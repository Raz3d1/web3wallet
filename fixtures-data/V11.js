// fixtures-data/V11.js — Binance 特供版（标准 EIP-1193 / JSON-RPC 映射版）
// 说明：此文件用于网页里的 window.ethereum.request，method 需使用钱包可识别的标准名。
(() => {
  // ========= Ethereum Provider 请求增强日志（用于定位“无反应/异常”）=========
  // 原理：monkey patch window.ethereum.request，把 method/params/返回值/异常全部打出来。
  // 注意：如果 ethereum 尚未注入，会轮询一小段时间，注入后自动生效。
  const ensureDomLog = () => {
    try {
      const id = "binance_eth_log_debug";
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("div");
        el.id = id;
        el.style.position = "fixed";
        el.style.left = "0";
        el.style.bottom = "0";
        el.style.width = "100%";
        el.style.maxHeight = "35vh";
        el.style.overflow = "auto";
        el.style.zIndex = "2147483647";
        el.style.background = "rgba(0,0,0,0.75)";
        el.style.color = "#fff";
        el.style.fontFamily = "monospace";
        el.style.fontSize = "12px";
        el.style.padding = "8px 10px";
        el.style.boxSizing = "border-box";
        el.style.whiteSpace = "pre-wrap";
        el.innerText = "[eth-log] debug overlay created.\n";
        document.body && document.body.appendChild(el);
      }
      return el;
    } catch (_) {
      return null;
    }
  };

  const domLogEl = ensureDomLog();
  const domLog = (line) => {
    try {
      if (domLogEl) {
        domLogEl.innerText += line + "\n";
        domLogEl.scrollTop = domLogEl.scrollHeight;
      }
    } catch (_) {}
    try {
      console.log(line);
    } catch (_) {}
  };
  const domLogErr = (line) => {
    try {
      if (domLogEl) {
        domLogEl.innerText += line + "\n";
        domLogEl.scrollTop = domLogEl.scrollHeight;
      }
    } catch (_) {}
    try {
      console.error(line);
    } catch (_) {}
  };

  const enableEthRequestLoggingOnce = () => {
    try {
      if (window.__binance_eth_request_log_enabled) return;
      if (!window.ethereum || typeof window.ethereum.request !== "function") return;

      window.__binance_eth_request_log_enabled = true;

      const origRequest = window.ethereum.request.bind(window.ethereum);

      const safeStringify = (x) => {
        try {
          const seen = new WeakSet();
          return JSON.stringify(x, (k, v) => {
            if (typeof v === "bigint") return v.toString();
            if (typeof v === "object" && v !== null) {
              if (seen.has(v)) return "[Circular]";
              seen.add(v);
            }
            return v;
          });
        } catch (e) {
          try {
            return String(x);
          } catch (_) {
            return "[Unserializable]";
          }
        }
      };

      window.ethereum.request = async function (payload) {
        domLog("[eth-log] ---> request payload: " + safeStringify(payload));

        try {
          const res = await origRequest(payload);
          domLog("[eth-log] <--- success result: " + safeStringify(res));
          return res;
        } catch (e) {
          domLogErr("[eth-log] <--- ERROR thrown");
          domLogErr("[eth-log] error.name: " + (e && e.name ? e.name : "undefined"));
          domLogErr("[eth-log] error.code: " + (e && e.code ? e.code : "undefined"));
          domLogErr("[eth-log] error.message: " + (e && e.message ? e.message : "undefined"));
          domLogErr("[eth-log] error.data: " + safeStringify(e && e.data ? e.data : undefined));
          domLogErr("[eth-log] error.stack: " + (e && e.stack ? e.stack : "undefined"));
          domLogErr("[eth-log] payload causing error: " + safeStringify(payload));
          throw e;
        }
      };

      window.addEventListener("unhandledrejection", (ev) => {
        domLogErr("[eth-log] unhandledrejection: " + safeStringify(ev && ev.reason ? ev.reason : ev));
      });
      window.addEventListener("error", (ev) => {
        domLogErr("[eth-log] window.error: " + safeStringify(ev && (ev.error || ev.message) ? (ev.error || ev.message) : ev));
      });

      domLog("[eth-log] ethereum.request logging enabled.");
    } catch (e) {
      domLogErr("[eth-log] enableEthRequestLoggingOnce failed: " + (e && e.message ? e.message : String(e)));
    }
  };

  // 先尝试立即启用；若 ethereum 尚未注入，则轮询最多 5 秒。
  enableEthRequestLoggingOnce();
  const _t0 = setInterval(() => {
    enableEthRequestLoggingOnce();
    if (window.__binance_eth_request_log_enabled) clearInterval(_t0);
  }, 100);
  setTimeout(() => clearInterval(_t0), 20000);

  const r = window.registerFixtureData;

  // 1. requestAccounts -> eth_requestAccounts
  r("Dapp_RequestAccounts", {
    id: "Dapp_RequestAccounts",
    name: "eth_requestAccounts",
    method: "eth_requestAccounts",
    params: [],
  });

  // 2. 保留 full model id，但实际调用标准 eth_requestAccounts
  r("Dapp_RequestAccounts_Full", {
    id: "Dapp_RequestAccounts_Full",
    name: "eth_requestAccounts",
    method: "eth_requestAccounts",
    params: [],
  });

  // 4. signTransaction -> eth_signTransaction（部分钱包可能不支持）
  r("Dapp_SignTransaction", {
    id: "Dapp_SignTransaction",
    name: "eth_signTransaction",
    method: "eth_signTransaction",
    params: [
      {
        from: "{{from}}",
        to: "{{to}}",
        value: "0x0",
        data: "0x",
        gas: "0x5208",
        chainId: "{{chainIdHex}}"
      }
    ]
  });

  // 5. signRawTransaction 映射为 eth_sendRawTransaction（广播 raw tx）
  r("Dapp_SignRawTransaction", {
    id: "Dapp_SignRawTransaction",
    name: "eth_sendRawTransaction",
    method: "eth_sendRawTransaction",
    params: ["{{unsignedRawTxHex}}"],
  });

  // 6. ecRecover -> personal_ecRecover
  r("Dapp_EcRecover", {
    id: "Dapp_EcRecover",
    name: "personal_ecRecover",
    method: "personal_ecRecover",
    params: ["{{hexMessage}}", "{{sigHex}}"],
  });

  // 7. addEthereumChain -> wallet_addEthereumChain
  r("Dapp_AddEthereumChain", {
    id: "Dapp_AddEthereumChain",
    name: "wallet_addEthereumChain",
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "{{chainIdHex}}",
        chainName: "{{chainName}}",
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18
        },
        rpcUrls: ["{{rpcUrl}}"],
        blockExplorerUrls: ["{{explorerUrl}}"]
      }
    ]
  });

  // 8. common_json_rpc eth_chainId -> 直接调用 eth_chainId
  r("Dapp_CommonJsonRpc_eth_chainId", {
    id: "Dapp_CommonJsonRpc_eth_chainId",
    name: "eth_chainId",
    method: "eth_chainId",
    params: [],
  });

  // EIP-1193：eth_signTransaction（带 value/data/gas/nonce 的更完整参数）
  r("EIP1193_EthSignTransaction", {
    id: "EIP1193_EthSignTransaction",
    name: "eth_signTransaction",
    method: "eth_signTransaction",
    params: [
      {
        from: "{{address}}",
        to: "{{to}}",

        // value/data：ERC20 转账通常 data 非空，且 value 可能为 0x0
        value: "{{valueHex}}",
        data: "{{dataHex}}",

        // gas/nonce/gasPrice/chainId 按钱包要求提供；有些钱包会自动补全
        gas: "{{gasHex}}",
        gasPrice: "{{gasPriceHex}}",
        nonce: "{{nonceHex}}",
        chainId: "{{chainIdHex}}",
      },
    ],
  });

  // EIP-1193：eth_accounts（不一定会弹出授权框）
  r("EIP1193_Accounts", {
    id: "EIP1193_Accounts",
    name: "eth_accounts",
    method: "eth_accounts",
    params: [],
  });

  r("EIP1193_SwitchChain", {
    id: "EIP1193_SwitchChain",
    name: "wallet_switchEthereumChain",
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "{{chainIdHex}}" }],
  });

  r("EIP1193_WatchAsset", {
    id: "EIP1193_WatchAsset",
    name: "wallet_watchAsset",
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: "{{tokenAddress}}",
        symbol: "{{tokenSymbol}}",
        decimals: 18,
        image: "{{tokenImage}}",
      },
    },
  });
})();