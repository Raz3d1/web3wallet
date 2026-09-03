(() => {
  "use strict";

  const METHODS = [
    ["eth_requestAccounts", true],
    ["eth_accounts", false],
    ["eth_chainId", false],
    ["eth_blockNumber", false],
    ["eth_getBalance", false],
    ["eth_getCode", false],
    ["eth_getTransactionCount", false],
    ["eth_getBlockByNumber", false],
    ["eth_getTransactionByHash", false],
    ["eth_getTransactionReceipt", false],
    ["eth_call", false],
    ["eth_estimateGas", false],
    ["eth_gasPrice", false],
    ["net_version", false],
    ["web3_clientVersion", false],
    ["eth_sendTransaction", true],
    ["eth_signTransaction", true],
    ["eth_sign", true],
    ["personal_sign", true],
    ["eth_signTypedData_v3", true],
    ["eth_signTypedData_v4", true],
    ["wallet_switchEthereumChain", true],
    ["wallet_addEthereumChain", true],
    ["wallet_watchAsset", true],
    ["wallet_requestPermissions", true],
    ["wallet_sendCalls", true],
    ["eth_decrypt", true],
    ["eth_getEncryptionPublicKey", true]
  ];
  const SAFE_PROBES = new Set([
    "eth_accounts", "eth_chainId", "eth_blockNumber", "eth_gasPrice",
    "net_version", "web3_clientVersion"
  ]);

  let records = [];
  let captureEnabled = true;
  let socket = null;
  let provider = null;
  let patchTimer = null;
  let selectedMethodSet = new Set(METHODS.map(([method]) => method));

  const $ = (id) => document.getElementById(id);
  const logEl = $("log");
  const statusEl = $("status");

  function safeClone(value) {
    try {
      return JSON.parse(JSON.stringify(value, (_, item) =>
        typeof item === "bigint" ? item.toString() : item
      ));
    } catch (_) {
      return String(value);
    }
  }

  function writeLog(message, isError = false) {
    const line = `[${new Date().toLocaleTimeString()}] ${message}`;
    if (logEl) {
      if (logEl.textContent === "尚未捕获 RPC。") logEl.textContent = "";
      logEl.textContent += `${line}\n`;
      logEl.scrollTop = logEl.scrollHeight;
    }
    if (isError) console.error(line); else console.log(line);
  }

  function setStatus(message, kind = "") {
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = `status ${kind}`.trim();
    }
  }

  function defaultWsUrl() {
    const scheme = location.protocol === "https:" ? "wss" : "ws";
    return `${scheme}://${location.hostname || "127.0.0.1"}:8766`;
  }

  function recordMethod(method) {
    return METHODS.some(([name]) => name === method);
  }

  function sendToPc(record) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify({ type: "rpc_capture", record }));
    return true;
  }

  function sendRpcResponse(id, result = null, error = null) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
      type: "rpc_response",
      id: id ?? null,
      result: error ? null : safeClone(result),
      error: error ? safeClone(error) : null
    }));
  }

  async function handleRpcRequest(message) {
    if (!provider) {
      sendRpcResponse(message.id, null, {
        code: -32000,
        message: "钱包 Provider 尚未就绪"
      });
      return;
    }
    const method = message.method;
    if (typeof method !== "string" || !method) {
      sendRpcResponse(message.id, null, {
        code: -32600,
        message: "rpc_request 缺少有效的 method"
      });
      return;
    }
    try {
      const result = await provider.request({
        method,
        params: message.params ?? []
      });
      sendRpcResponse(message.id, result);
    } catch (error) {
      sendRpcResponse(message.id, null, {
        name: error?.name || "Error",
        code: error?.code ?? -32000,
        message: error?.message || String(error),
        data: safeClone(error?.data ?? null)
      });
    }
  }

  function addRecord(record) {
    records.push(record);
    window.__RPC_CAPTURE_RECORDS__ = records;
    const sent = sendToPc(record);
    const result = record.success ? "success" : `error ${record.error?.code ?? ""}`;
    writeLog(`${record.method} → ${result}${sent ? " [已回传]" : " [未连接 PC]"}`, !record.success);
  }

  function installProviderPatch(candidate) {
    if (!candidate || candidate.__rpcCaptureInstalled) return;
    provider = candidate;
    const originalRequest = candidate.request?.bind(candidate);
    if (!originalRequest) {
      setStatus("检测到钱包，但 Provider 没有 request 方法", "warn");
      return;
    }

    candidate.__rpcCaptureInstalled = true;
    candidate.request = async (request) => {
      const method = request?.method || null;
      const shouldCapture = captureEnabled && selectedMethodSet.has(method);
      const started = performance.now();
      const record = {
        timestamp: new Date().toISOString(),
        source: "window.ethereum.request",
        origin: location.origin,
        page: location.href,
        method,
        params: safeClone(request?.params ?? null),
        result: null,
        error: null,
        success: false,
        duration_ms: null,
        account: candidate.selectedAddress || null,
        chain_id: candidate.chainId || null
      };

      try {
        const result = await originalRequest(request);
        record.success = true;
        record.result = safeClone(result);
        return result;
      } catch (error) {
        record.error = {
          name: error?.name || "Error",
          code: error?.code ?? null,
          message: error?.message || String(error),
          data: safeClone(error?.data ?? null)
        };
        throw error;
      } finally {
        record.duration_ms = Math.round(performance.now() - started);
        if (shouldCapture) addRecord(record);
      }
    };

    setStatus("钱包已检测，正在捕获选定 RPC", "ok");
    writeLog("Provider 捕获已安装");
  }

  function findProvider() {
    if (window.ethereum) installProviderPatch(window.ethereum);
    if (!provider && window.ethereum?.providers?.length) {
      installProviderPatch(window.ethereum.providers[0]);
    }
  }

  async function connectWallet() {
    findProvider();
    if (!provider) {
      setStatus("未找到 window.ethereum，请用钱包内置浏览器打开", "warn");
      return;
    }
    try {
      await provider.request({ method: "eth_requestAccounts", params: [] });
      setStatus("钱包已连接，捕获已开启", "ok");
    } catch (error) {
      setStatus(`连接失败：${error.message || error}`, "warn");
    }
  }

  function connectPc(urlOverride = "", tokenOverride = "") {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
      return;
    }
    const urlInput = $("ws-url");
    const tokenInput = $("token");
    const url = urlOverride || urlInput?.value.trim() || defaultWsUrl();
    if (urlInput) urlInput.value = url;
    const token = tokenOverride || tokenInput?.value || "";
    try {
      socket = new WebSocket(url);
      setStatus(`正在连接本地 PC：${url}`, "warn");
      socket.onopen = () => {
        socket.send(JSON.stringify({
          type: "hello",
          token,
          client: "rpc_capture_page",
          page: location.href,
          timestamp: new Date().toISOString()
        }));
        setStatus(`已连接本地 PC：${url}`, "ok");
        writeLog("本地 PC WebSocket 已连接");
      };
      socket.onclose = () => {
        setStatus("本地 PC WebSocket 已断开", "warn");
        writeLog("本地 PC WebSocket 已断开", true);
      };
      socket.onerror = () => writeLog("本地 PC WebSocket 连接错误", true);
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "rpc_request") {
            void handleRpcRequest(message);
          } else {
            writeLog(`PC：${event.data}`);
          }
        } catch (_) {
          writeLog(`PC：${event.data}`);
        }
      };
    } catch (error) {
      setStatus(`WebSocket 地址无效：${error.message}`, "warn");
    }
  }

  function downloadRecords() {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rpc-capture-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderMethods() {
    const container = $("methods");
    METHODS.forEach(([method, risky]) => {
      const row = document.createElement("label");
      row.className = "method";
      row.innerHTML = `<input type="checkbox" checked data-method="${method}"><span>${method}</span>${risky ? "<small>需确认</small>" : ""}`;
      container.appendChild(row);
    });
  }

  function selectedMethods() {
    return new Set([...document.querySelectorAll("[data-method]:checked")].map((el) => el.dataset.method));
  }

  async function safeProbe() {
    findProvider();
    if (!provider) {
      setStatus("未找到钱包 Provider", "warn");
      return;
    }
    const selected = selectedMethods();
    const probes = [
      ["eth_accounts", []],
      ["eth_chainId", []],
      ["eth_blockNumber", []],
      ["eth_gasPrice", []],
      ["net_version", []],
      ["web3_clientVersion", []]
    ].filter(([method]) => selected.has(method) && SAFE_PROBES.has(method));
    for (const [method, params] of probes) {
      try {
        await provider.request({ method, params });
      } catch (error) {
        writeLog(`${method} 安全读取失败：${error.message || error}`, true);
      }
    }
    writeLog(`安全读取测试完成，共 ${probes.length} 个方法`);
  }

  function applyMethodFilter() {
    selectedMethodSet = $("methods")
      ? selectedMethods()
      : new Set(METHODS.map(([method]) => method));
    window.__RPC_CAPTURE_METHODS__ = selectedMethodSet;
    writeLog(`已选择 ${selectedMethodSet.size} 个 RPC 捕获`);
  }

  function initUi() {
    if (!$("ws-url")) return;
    $("ws-url").value = defaultWsUrl();
    $("connect-wallet").addEventListener("click", connectWallet);
    $("connect-pc").addEventListener("click", connectPc);
    $("download").addEventListener("click", downloadRecords);
    $("clear").addEventListener("click", () => {
      records = [];
      window.__RPC_CAPTURE_RECORDS__ = records;
      logEl.textContent = "尚未捕获 RPC。";
    });
    $("safe-probe").addEventListener("click", safeProbe);
    $("methods").addEventListener("change", applyMethodFilter);
    renderMethods();
  }

  initUi();
  applyMethodFilter();
  const captureUrl = new URLSearchParams(location.search).get("rpcCaptureWs");
  const captureToken = new URLSearchParams(location.search).get("rpcCaptureToken") || "";
  if (captureUrl) connectPc(captureUrl, captureToken);

  findProvider();
  patchTimer = setInterval(() => {
    findProvider();
    if (provider) clearInterval(patchTimer);
  }, 200);
  setTimeout(() => clearInterval(patchTimer), 20000);
})();
