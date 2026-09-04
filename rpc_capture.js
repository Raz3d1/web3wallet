(() => {
  "use strict";

  const METHODS = [
    ["eth_requestAccounts", true],
    ["wallet_requestPermissions", true],
    ["personal_sign", true],
    ["eth_sign", true],
    ["eth_signTypedData", true],
    ["eth_sendTransaction", true],
    ["eth_signTransaction", true],
    ["wallet_addEthereumChain", true],
    ["wallet_switchEthereumChain", true],
    ["wallet_watchAsset", true],
    ["wallet_sendCalls", true],
    ["wallet_scanQRCode", true],
    ["eth_getEncryptionPublicKey", true],
    ["eth_decrypt", true]
  ];
  const STORAGE_KEYS = Object.freeze({
    records: "web3wallet.rpc-capture.records.v2",
    tests: "web3wallet.rpc-capture.tests.v2"
  });
  const TEST_STATUS_LABELS = Object.freeze({
    pending: "待运行",
    running: "等待 wallet 回复",
    success: "已返回",
    error: "返回错误",
    cancelled: "已取消",
    skipped: "未发送"
  });

  // Each probe uses a protocol-valid payload and remains gated by confirmation.
  const TEST_CASES = Object.freeze([
    { id: "eth_requestAccounts", method: "eth_requestAccounts", label: "连接账户", risk: "interactive", description: "EIP-1193 账户连接请求，可能打开连接授权弹窗。", params: async () => [] },
    { id: "wallet_requestPermissions", method: "wallet_requestPermissions", label: "请求账户权限", risk: "interactive", description: "EIP-2255 eth_accounts 权限对象，可能打开权限确认弹窗。", params: async () => [{ eth_accounts: {} }] },
    { id: "personal_sign", method: "personal_sign", label: "Personal Sign", risk: "interactive", description: "EIP-191 合法参数顺序：[messageHex, address]，会打开签名弹窗。", params: async (ctx) => [ctx.messageHex, await ctx.account()] },
    { id: "eth_sign", method: "eth_sign", label: "Eth Sign", risk: "interactive", description: "合法参数顺序：[address, 32-byte data]，会打开签名弹窗。", params: async (ctx) => [await ctx.account(), "0x" + "11".repeat(32)] },
    { id: "eth_signTypedData", method: "eth_signTypedData", label: "Legacy Typed Data", risk: "interactive", description: "MetaMask legacy typed-data 数组格式：[typedData, address]。", params: async (ctx) => [[
      { type: "string", name: "Message", value: "RPC capture test message" },
      { type: "uint256", name: "Value", value: "1" }
    ], await ctx.account()] },
    { id: "eth_sendTransaction", method: "eth_sendTransaction", label: "发送零值自转交易", risk: "transaction", description: "合法的零值自转交易对象，会打开交易确认；请勿在主网确认。", params: async (ctx) => {
      const account = await ctx.account();
      return [{ from: account, to: account, value: "0x0", data: "0x" }];
    } },
    { id: "eth_signTransaction", method: "eth_signTransaction", label: "签署零值自转交易", risk: "transaction", description: "合法交易对象，仅请求签名；部分钱包出于安全策略不支持此方法。", params: async (ctx) => {
      const account = await ctx.account();
      return [{ from: account, to: account, value: "0x0", data: "0x" }];
    } },
    { id: "wallet_addEthereumChain", method: "wallet_addEthereumChain", label: "添加 Gnosis 网络", risk: "interactive", description: "EIP-3085 Gnosis 主网配置，可能打开添加网络确认。", params: async () => [{
      chainId: "0x64",
      chainName: "Gnosis",
      rpcUrls: ["https://rpc.gnosischain.com"],
      nativeCurrency: { name: "XDAI", symbol: "XDAI", decimals: 18 },
      blockExplorerUrls: ["https://gnosisscan.io"]
    }] },
    { id: "wallet_switchEthereumChain", method: "wallet_switchEthereumChain", label: "切换至 Gnosis", risk: "interactive", description: "EIP-3326 切换至 chainId 0x64，可能改变钱包当前网络。", params: async () => [{ chainId: "0x64" }] },
    { id: "wallet_watchAsset", method: "wallet_watchAsset", label: "添加 WXDAI 资产", risk: "interactive", description: "EIP-747 Gnosis WXDAI 合法代币信息，使用命名参数对象。", params: async () => ({
      type: "ERC20",
      options: {
        address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
        symbol: "WXDAI",
        decimals: 18
      }
    }) },
    { id: "wallet_sendCalls", method: "wallet_sendCalls", label: "发送零值调用批次", risk: "transaction", description: "EIP-5792 v2.0.0 单调用批次，使用当前账户与当前链。", params: async (ctx) => {
      const account = await ctx.account();
      return [{
        version: "2.0.0",
        chainId: await ctx.chainId(),
        from: account,
        calls: [{ to: account, value: "0x0", data: "0x" }]
      }];
    } },
    { id: "wallet_scanQRCode", method: "wallet_scanQRCode", label: "扫描 EVM 地址二维码", risk: "interactive", description: "打开二维码扫描器，并用 EVM 地址正则约束返回值。", params: async () => ["^0x[0-9a-fA-F]{40}$"] },
    { id: "eth_getEncryptionPublicKey", method: "eth_getEncryptionPublicKey", label: "获取加密公钥", risk: "interactive", description: "请求当前账户的 X25519 加密公钥，为下一项合法解密请求生成密文。", params: async (ctx) => [await ctx.account()] },
    { id: "eth_decrypt", method: "eth_decrypt", label: "解密测试消息", risk: "interactive", description: "使用上一项返回的公钥动态生成 x25519-xsalsa20-poly1305 密文。", params: async (ctx) => {
      const account = await ctx.account();
      return [await ctx.encryptedMessage(account), account];
    } }
  ]);

  function getPersistentStore() {
    try {
      if (typeof localStorage === "undefined") return null;
      const probeKey = "web3wallet.rpc-capture.storage-probe";
      localStorage.setItem(probeKey, "1");
      localStorage.removeItem(probeKey);
      return localStorage;
    } catch (_) {
      return null;
    }
  }

  const persistentStore = getPersistentStore();
  let storageWarningShown = false;

  function loadStoredArray(key) {
    try {
      const parsed = JSON.parse(persistentStore?.getItem(key) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  let records = loadStoredArray(STORAGE_KEYS.records);
  let testResults = loadStoredArray(STORAGE_KEYS.tests);
  let captureEnabled = true;
  let socket = null;
  let provider = null;
  let patchTimer = null;
  let selectedMethodSet = new Set(METHODS.map(([method]) => method));
  let selectedTestSet = new Set(TEST_CASES.map((test) => test.id));
  let testsRunning = false;
  let stopTestsRequested = false;
  let activeTestContext = null;
  let testRunId = null;
  let currentRunArtifacts = {
    encryptionPublicKey: null,
    encryptionAccount: null
  };

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

  function makeId(prefix) {
    const random = globalThis.crypto?.randomUUID?.();
    return `${prefix || "id"}-${random || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
  }

  function persistArray(key, value) {
    if (!persistentStore) {
      if (!storageWarningShown) {
        storageWarningShown = true;
        setStatus("当前 WebView 不支持本地持久化；请连接本地 PC 或及时导出 JSON", "warn");
        writeLog("当前 WebView 没有 localStorage；结果仍显示在本页，并可通过 WebSocket/导出 JSON 保存", true);
      }
      return false;
    }
    try {
      persistentStore.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      setStatus(`本地保存失败：${error?.message || "存储空间不足"}；请及时导出 JSON`, "warn");
      writeLog("localStorage 保存失败，当前页面内存记录仍保留", true);
      return false;
    }
  }

  function persistRecords() {
    window.__RPC_CAPTURE_RECORDS__ = records;
    persistArray(STORAGE_KEYS.records, records);
  }

  function persistTestResults() {
    window.__RPC_CAPTURE_TEST_RESULTS__ = testResults;
    persistArray(STORAGE_KEYS.tests, testResults);
  }

  function formatJson(value, maxLength = 12000) {
    let text;
    try {
      text = JSON.stringify(value, null, 2);
    } catch (_) {
      text = String(value);
    }
    if (text == null) text = "null";
    return text.length > maxLength ? `${text.slice(0, maxLength)}\n…(已截断，完整内容请导出 JSON)` : text;
  }

  function normaliseError(error) {
    return {
      name: error?.name || "Error",
      code: error?.code ?? null,
      message: error?.message || String(error),
      data: safeClone(error?.data ?? null)
    };
  }

  function utf8Bytes(text) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(String(text));
    const encoded = unescape(encodeURIComponent(String(text)));
    return Uint8Array.from(encoded, (character) => character.charCodeAt(0));
  }

  function hexEncode(text) {
    return `0x${Array.from(utf8Bytes(text), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("")}`;
  }

  function bytesToBase64(bytes) {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const normalised = String(value || "").trim()
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const padded = normalised.padEnd(Math.ceil(normalised.length / 4) * 4, "=");
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  }

  function encryptForPublicKey(publicKey, plaintext) {
    if (!globalThis.nacl?.box?.keyPair || !globalThis.nacl?.randomBytes) {
      throw new Error("ENCRYPTION_LIBRARY_UNAVAILABLE");
    }
    const recipientPublicKey = base64ToBytes(publicKey);
    if (recipientPublicKey.length !== globalThis.nacl.box.publicKeyLength) {
      throw new Error("INVALID_ENCRYPTION_PUBLIC_KEY");
    }
    const ephemeralKeyPair = globalThis.nacl.box.keyPair();
    const nonce = globalThis.nacl.randomBytes(globalThis.nacl.box.nonceLength);
    const ciphertext = globalThis.nacl.box(
      utf8Bytes(plaintext),
      nonce,
      recipientPublicKey,
      ephemeralKeyPair.secretKey
    );
    const envelope = {
      version: "x25519-xsalsa20-poly1305",
      nonce: bytesToBase64(nonce),
      ephemPublicKey: bytesToBase64(ephemeralKeyPair.publicKey),
      ciphertext: bytesToBase64(ciphertext)
    };
    return hexEncode(JSON.stringify(envelope));
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
    persistRecords();
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
        id: makeId("rpc"),
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
        chain_id: candidate.chainId || null,
        test_context: activeTestContext ? safeClone(activeTestContext) : null
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

  function requestWithTimeout(request, timeoutMs = 120000) {
    const started = performance.now();
    let timer;
    let requestPromise;
    try {
      requestPromise = Promise.resolve(provider.request(request)).then(
        (result) => ({ ok: true, result, duration: Math.round(performance.now() - started) }),
        (error) => ({ ok: false, error: normaliseError(error), duration: Math.round(performance.now() - started) })
      );
    } catch (error) {
      requestPromise = Promise.resolve({ ok: false, error: normaliseError(error), duration: Math.round(performance.now() - started) });
    }
    const timeoutPromise = new Promise((resolve) => {
      timer = setTimeout(() => resolve({
        ok: false,
        timeout: true,
        error: { name: "TimeoutError", code: null, message: `等待 wallet 回复超过 ${timeoutMs} ms`, data: null },
        duration: Math.round(performance.now() - started)
      }), timeoutMs);
    });
    return Promise.race([requestPromise, timeoutPromise]).finally(() => clearTimeout(timer));
  }

  function latestTestResult(testId) {
    return testResults.find((item) => item.test_id === testId) || null;
  }

  function saveTestResult(result) {
    const index = testResults.findIndex((item) => item.test_id === result.test_id);
    if (index >= 0) testResults[index] = result;
    else testResults.push(result);
    persistTestResults();
    renderTestResults();
    renderTestCases();
  }

  function buildTestContext() {
    const account = async () => {
      const accounts = await provider.request({ method: "eth_accounts", params: [] });
      if (!Array.isArray(accounts) || !accounts[0]) throw new Error("NO_ACCOUNT");
      return accounts[0];
    };
    const chainId = async () => provider.request({ method: "eth_chainId", params: [] });
    const encryptionPublicKey = (currentAccount) => {
      const normalisedAccount = String(currentAccount || "").toLowerCase();
      if (
        typeof currentRunArtifacts.encryptionPublicKey === "string" &&
        currentRunArtifacts.encryptionAccount === normalisedAccount
      ) {
        return currentRunArtifacts.encryptionPublicKey;
      }

      const stored = latestTestResult("eth_getEncryptionPublicKey");
      if (
        stored?.status === "success" &&
        typeof stored.response === "string" &&
        String(stored.params?.[0] || "").toLowerCase() === normalisedAccount
      ) {
        currentRunArtifacts = {
          encryptionPublicKey: stored.response,
          encryptionAccount: normalisedAccount
        };
        return stored.response;
      }
      throw new Error("ENCRYPTION_PUBLIC_KEY_REQUIRED");
    };
    const encryptedMessage = async (currentAccount) => encryptForPublicKey(
      encryptionPublicKey(currentAccount),
      "RPC capture decrypt test message"
    );
    return {
      account,
      chainId,
      encryptedMessage,
      messageHex: hexEncode("RPC capture test message")
    };
  }

  function testConfirmationText(test, params) {
    if (test.risk === "transaction") {
      return `${test.label} 将打开钱包交易确认。请只在测试网/专用测试钱包中运行，并在钱包弹窗中拒绝。\n\n请求参数：\n${formatJson(params, 5000)}`;
    }
    return `${test.label} 将向钱包发送真实 ${test.method} 请求，可能出现授权或签名弹窗。请确认你正在使用隔离测试钱包。\n\n请求参数：\n${formatJson(params, 5000)}`;
  }

  async function runOneTest(test, sequence, total) {
    const result = {
      test_id: test.id,
      run_id: testRunId,
      sequence,
      method: test.method,
      label: test.label,
      risk: test.risk,
      status: "running",
      started_at: new Date().toISOString(),
      finished_at: null,
      params: null,
      response: null,
      error: null,
      message: "正在生成合法参数…",
      duration_ms: null
    };
    saveTestResult(result);
    if (!provider) {
      result.status = "error";
      result.message = "未检测到 window.ethereum.request";
      result.finished_at = new Date().toISOString();
      saveTestResult(result);
      return result;
    }

    const context = buildTestContext();
    activeTestContext = {
      test_id: test.id,
      run_id: testRunId,
      sequence,
      total,
      label: test.label
    };
    try {
      const params = await test.params(context);
      result.params = safeClone(params);
      result.message = "等待 wallet 回复…";
      saveTestResult(result);

      if (test.risk !== "safe" && !window.confirm(testConfirmationText(test, params))) {
        result.status = "cancelled";
        result.message = "操作者取消发送，未调用 wallet";
        result.finished_at = new Date().toISOString();
        saveTestResult(result);
        return result;
      }

      const outcome = await requestWithTimeout({ method: test.method, params }, test.risk === "safe" ? 30000 : 120000);
      result.duration_ms = outcome.duration;
      if (outcome.ok) {
        result.status = "success";
        result.response = safeClone(outcome.result);
        result.message = "wallet 返回成功结果";
        if (test.method === "eth_getEncryptionPublicKey" && typeof outcome.result === "string") {
          currentRunArtifacts = {
            encryptionPublicKey: outcome.result,
            encryptionAccount: String(params?.[0] || "").toLowerCase()
          };
        }
      } else {
        result.status = outcome.timeout ? "error" : "error";
        result.error = safeClone(outcome.error);
        result.message = outcome.timeout ? "wallet 回复超时；请求可能仍在钱包侧处理" : (outcome.error?.message || "wallet 返回错误");
      }
    } catch (error) {
      const skippedMessages = {
        NO_ACCOUNT: "没有已授权账户，未发送该测试",
        ENCRYPTION_PUBLIC_KEY_REQUIRED: "缺少当前账户的加密公钥；请先成功运行 eth_getEncryptionPublicKey",
        ENCRYPTION_LIBRARY_UNAVAILABLE: "加密依赖未加载，无法生成合法 eth_decrypt 密文"
      };
      result.status = skippedMessages[error?.message] ? "skipped" : "error";
      result.error = normaliseError(error);
      result.message = skippedMessages[error?.message] || error?.message || String(error);
    } finally {
      activeTestContext = null;
      result.finished_at = new Date().toISOString();
      saveTestResult(result);
    }
    return result;
  }

  async function runSelectedTests() {
    if (testsRunning) return;
    findProvider();
    if (!provider) {
      setStatus("未找到 window.ethereum，请用钱包内置浏览器打开", "warn");
      return;
    }
    const selected = TEST_CASES.filter((test) => selectedTestSet.has(test.id));
    if (!selected.length) {
      setStatus("请至少选择一个 RPC 测试", "warn");
      return;
    }
    if (!window.confirm(`将按顺序运行 ${selected.length} 个 RPC。签名、权限和交易测试会逐项再次请求人工确认。继续？`)) return;

    testsRunning = true;
    stopTestsRequested = false;
    testRunId = makeId("run");
    currentRunArtifacts = {
      encryptionPublicKey: null,
      encryptionAccount: null
    };
    const startedAt = new Date().toISOString();
    setStatus(`RPC 测试运行中：0 / ${selected.length}`, "warn");
    renderTestCases();
    renderTestProgress(0, selected.length);
    for (let index = 0; index < selected.length; index += 1) {
      if (stopTestsRequested) {
        for (let rest = index; rest < selected.length; rest += 1) {
          saveTestResult({
            test_id: selected[rest].id,
            run_id: testRunId,
            sequence: rest + 1,
            method: selected[rest].method,
            label: selected[rest].label,
            risk: selected[rest].risk,
            status: "skipped",
            started_at: startedAt,
            finished_at: new Date().toISOString(),
            params: null,
            response: null,
            error: null,
            message: "已停止后续队列，未发送",
            duration_ms: null
          });
        }
        break;
      }
      await runOneTest(selected[index], index + 1, selected.length);
      renderTestProgress(index + 1, selected.length);
      setStatus(`RPC 测试运行中：${index + 1} / ${selected.length}`, "warn");
    }
    testsRunning = false;
    renderTestCases();
    renderTestProgress(selected.length, selected.length);
    setStatus(stopTestsRequested ? "已停止后续 RPC 测试；已完成结果已保存" : `RPC 测试完成：${selected.length} 个结果已保存`, "ok");
  }

  function renderTestProgress(completed, total) {
    const progress = $("test-progress");
    if (!progress) return;
    progress.textContent = testsRunning ?
      `运行进度：${completed} / ${total}（当前请求结束后才会进入下一项）` :
      (total ? `最近一次运行：${completed} / ${total}` : "尚未开始");
    $("stop-tests").disabled = !testsRunning;
    $("run-selected-tests").disabled = testsRunning;
  }

  function renderTestCases() {
    const container = $("test-cases");
    if (!container) return;
    container.textContent = "";
    TEST_CASES.forEach((test) => {
      const row = document.createElement("div");
      row.className = "test-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = selectedTestSet.has(test.id);
      checkbox.disabled = testsRunning;
      checkbox.dataset.testId = test.id;
      checkbox.setAttribute("aria-label", `选择 ${test.method}`);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) selectedTestSet.add(test.id);
        else selectedTestSet.delete(test.id);
        renderTestProgress(0, selectedTestSet.size);
      });
      const copy = document.createElement("div");
      const name = document.createElement("span");
      name.className = "test-name";
      name.textContent = test.method;
      const risk = document.createElement("span");
      risk.className = `test-risk ${test.risk}`;
      risk.textContent = test.risk === "safe" ? "只读" : (test.risk === "transaction" ? "交易" : "人工确认");
      name.appendChild(risk);
      const description = document.createElement("small");
      description.className = "test-description";
      description.textContent = test.description;
      copy.append(name, description);
      const runButton = document.createElement("button");
      runButton.type = "button";
      runButton.textContent = "单项运行";
      runButton.disabled = testsRunning;
      runButton.dataset.runTest = test.id;
      runButton.addEventListener("click", async () => {
        if (testsRunning) return;
        findProvider();
        if (!provider) { setStatus("未找到钱包 Provider", "warn"); return; }
        testsRunning = true;
        testRunId = makeId("run");
        renderTestCases();
        renderTestProgress(0, 1);
        await runOneTest(test, 1, 1);
        testsRunning = false;
        renderTestCases();
        renderTestProgress(1, 1);
      });
      row.append(checkbox, copy, runButton);
      container.appendChild(row);
    });
  }

  function renderTestResults() {
    const container = $("test-results");
    if (!container) return;
    container.textContent = "";
    if (!testResults.length) {
      container.textContent = "尚未运行测试。运行后将在此保留每个 wallet 的完整 result/error。";
      return;
    }
    TEST_CASES.forEach((test) => {
      const result = latestTestResult(test.id);
      if (!result) return;
      const card = document.createElement("article");
      card.className = "test-result";
      const head = document.createElement("div");
      head.className = "test-result-head";
      const title = document.createElement("code");
      title.textContent = `${result.sequence || "-"}. ${test.method}`;
      const status = document.createElement("span");
      status.className = `test-result-status ${result.status}`;
      status.textContent = TEST_STATUS_LABELS[result.status] || result.status;
      head.append(title, status);
      const message = document.createElement("div");
      message.textContent = `${result.message || ""}${result.duration_ms != null ? ` · ${result.duration_ms} ms` : ""}`;
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "查看 params 与 wallet 原始回复";
      const pre = document.createElement("pre");
      pre.textContent = `params:\n${formatJson(result.params)}\n\nresponse:\n${formatJson(result.response)}\n\nerror:\n${formatJson(result.error)}`;
      details.append(summary, pre);
      card.append(head, message, details);
      container.appendChild(card);
    });
  }

  function downloadRecords() {
    const payload = {
      formatVersion: 2,
      type: "rpc_capture_session",
      exportedAt: new Date().toISOString(),
      page: location.href,
      tests: safeClone(testResults),
      records: safeClone(records)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rpc-capture-session-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(`已导出 ${records.length} 条 RPC 记录和 ${testResults.length} 条测试结果`, "ok");
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

  function renderStoredLog() {
    if (!logEl) return;
    if (!records.length) {
      logEl.textContent = "尚未捕获 RPC。";
      return;
    }
    const lines = records.slice(-200).map((record) => {
      const result = record.success ? "success" : `error ${record.error?.code ?? ""}`;
      const context = record.test_context?.test_id ? ` [${record.test_context.test_id}]` : "";
      return `[${new Date(record.timestamp || Date.now()).toLocaleTimeString()}] ${record.method} → ${result}${context}`;
    });
    logEl.textContent = `${lines.join("\n")}\n`;
    logEl.scrollTop = logEl.scrollHeight;
  }

  function selectedMethods() {
    return new Set([...document.querySelectorAll("[data-method]:checked")].map((el) => el.dataset.method));
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
    window.__RPC_CAPTURE_RECORDS__ = records;
    window.__RPC_CAPTURE_TEST_RESULTS__ = testResults;
    if (!persistentStore) {
      storageWarningShown = true;
      setStatus("当前 WebView 不支持本地持久化；请连接本地 PC 或及时导出 JSON", "warn");
      writeLog("当前 WebView 没有 localStorage；结果仍显示在本页，并可通过 WebSocket/导出 JSON 保存", true);
    }
    $("connect-wallet").addEventListener("click", connectWallet);
    $("connect-pc").addEventListener("click", connectPc);
    $("download").addEventListener("click", downloadRecords);
    $("clear").addEventListener("click", () => {
      if (!window.confirm("清空当前浏览器保存的 RPC 请求、wallet 回复和测试结果？此操作不可恢复，请先导出 JSON。")) return;
      records = [];
      testResults = [];
      persistRecords();
      persistTestResults();
      renderStoredLog();
      renderTestResults();
      setStatus("已清空本地记录", "ok");
    });
    $("methods").addEventListener("change", applyMethodFilter);
    $("run-selected-tests").addEventListener("click", runSelectedTests);
    $("select-all-tests").addEventListener("click", () => {
      selectedTestSet = new Set(TEST_CASES.map((test) => test.id));
      renderTestCases();
      renderTestProgress(0, selectedTestSet.size);
    });
    $("select-none-tests").addEventListener("click", () => {
      selectedTestSet.clear();
      renderTestCases();
      renderTestProgress(0, 0);
    });
    $("stop-tests").addEventListener("click", () => {
      if (!testsRunning) return;
      stopTestsRequested = true;
      setStatus("已请求停止后续队列；当前 wallet 请求会先结束", "warn");
    });
    renderMethods();
    renderTestCases();
    renderTestResults();
    renderStoredLog();
    renderTestProgress(0, 0);
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
