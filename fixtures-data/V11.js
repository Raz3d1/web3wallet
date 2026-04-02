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

  // 触发 eth_requestAccounts：请求钱包授权并返回可用账户地址。
  r("Dapp_RequestAccounts", {
    id: "Dapp_RequestAccounts",
    name: "eth_requestAccounts",
    method: "eth_requestAccounts",
    params: [],
  });

  // 触发 eth_requestAccounts（full 版本）：用于和普通版本做兼容性对照。
  r("Dapp_RequestAccounts_Full", {
    id: "Dapp_RequestAccounts_Full",
    name: "eth_requestAccounts",
    method: "eth_requestAccounts",
    params: [],
  });

  // 触发 eth_signTransaction：请求钱包仅签名交易，不立即广播到链上。
  r("Dapp_SignTransaction", {
    id: "Dapp_SignTransaction",
    name: "eth_signTransaction",
    method: "eth_signTransaction",
    params: [
      {
        from: "{{from}}",
        to: "{{to}}",
        value: "{{valueHex}}",
        data: "0x",
        gas: "0x5208",
        chainId: "{{chainIdHex}}",
      },
    ],
  });

  // 触发 eth_sendRawTransaction：直接广播已签名的原始交易数据。
  r("EIP1193_EthSendRawTransaction", {
    id: "EIP1193_EthSendRawTransaction",
    name: "eth_sendRawTransaction",
    method: "eth_sendRawTransaction",
    params: ["{{rawTxHex}}"],
  });

  // 触发 personal_ecRecover：通过消息和签名恢复签名地址。
  r("Dapp_EcRecover", {
    id: "Dapp_EcRecover",
    name: "personal_ecRecover",
    method: "personal_ecRecover",
    params: ["{{hexMessage}}", "{{sigHex}}"],
  });

  // 触发 wallet_addEthereumChain：请求钱包添加一个新的链配置。
  r("Dapp_AddEthereumChain", {
    id: "Dapp_AddEthereumChain",
    name: "wallet_addEthereumChain",
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "{{chainIdHex}}",
        chainName: "{{chainName}}",
        rpcUrls: ["{{rpcUrl}}"],
        iconUrls: ["{{tokenImage}}"],
        nativeCurrency: {
          name: "{{currencyName}}",
          symbol: "{{currencySymbol}}",
          decimals: 18,
        },
        blockExplorerUrls: ["{{explorerUrl}}"],
      },
    ],
  });

  // 触发 eth_chainId：读取当前钱包所连接网络的 chainId。
  r("Dapp_CommonJsonRpc_eth_chainId", {
    id: "Dapp_CommonJsonRpc_eth_chainId",
    name: "eth_chainId",
    method: "eth_chainId",
    params: [],
  });

  // 触发 eth_signTransaction（EIP-1193）：用于测试更完整交易参数的签名流程。
  r("EIP1193_EthSignTransaction", {
    id: "EIP1193_EthSignTransaction",
    name: "eth_signTransaction",
    method: "eth_signTransaction",
    params: [
      {
        from: "{{address}}",
        to: "{{to}}",

        // value/data：ERC20 转账通常 data 非空；value 由 {{valueHex}} 控制
        value: "{{valueHex}}",
        data: "{{dataHex}}",

        // gas/gasPrice/chainId 按钱包要求提供；nonce 由钱包自动补全
        gas: "{{gasHex}}",
        gasPrice: "{{gasPriceHex}}",
        chainId: "{{chainIdHex}}",
      },
    ],
  });

  // 触发 eth_accounts：读取当前已授权账户列表（通常不弹窗）。
  r("EIP1193_Accounts", {
    id: "EIP1193_Accounts",
    name: "eth_accounts",
    method: "eth_accounts",
    params: [],
  });

  // 触发 wallet_switchEthereumChain：请求钱包切换到指定链。
  r("EIP1193_SwitchChain", {
    id: "EIP1193_SwitchChain",
    name: "wallet_switchEthereumChain",
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "{{chainIdHex}}" }],
  });

  // 触发 wallet_watchAsset：请求钱包在 UI 中添加并展示代币。
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

  // 触发 wallet_requestPermissions：请求钱包授予指定权限（如 eth_accounts）。
  r("EIP1193_RequestPermissions", {
    id: "EIP1193_RequestPermissions",
    name: "wallet_requestPermissions",
    method: "wallet_requestPermissions",
    // EIP-2255: request specific wallet permissions
    params: [{ eth_accounts: {} }],
  });

  // 触发 eth_signTypedData_v3：请求钱包签名 EIP-712 v3 结构化数据。
  r("EIP1193_EthSignTypedData_V3", {
    id: "EIP1193_EthSignTypedData_V3",
    name: "eth_signTypedData_v3",
    method: "eth_signTypedData_v3",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            Mail: [{ name: "contents", type: "string" }],
          },
          primaryType: "Mail",
          domain: {
            name: "Fixture",
            version: "1",
            chainId: "{{chainIdNum}}",
            verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
          },
          message: { contents: "hello" },
        },
      },
    ],
  });

  // 触发 eth_signTypedData_v4：请求钱包签名 EIP-712 v4 结构化数据。
  r("EIP1193_EthSignTypedData_V4", {
    id: "EIP1193_EthSignTypedData_V4",
    name: "eth_signTypedData_v4",
    method: "eth_signTypedData_v4",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            Mail: [{ name: "contents", type: "string" }],
          },
          primaryType: "Mail",
          domain: {
            name: "Fixture",
            version: "1",
            chainId: "{{chainIdNum}}",
            verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
          },
          message: { contents: "hello" },
        },
      },
    ],
  });

  // 触发 wallet_sendCalls：请求钱包一次处理多笔 calls 的批量调用。
  r("EIP1193_WalletSendCalls", {
    id: "EIP1193_WalletSendCalls",
    name: "wallet_sendCalls",
    method: "wallet_sendCalls",
    params: [
      {
        version: "1.0",
        from: "{{from}}",
        calls: [
          { to: "{{to}}", data: "{{dataHex}}", value: "{{valueHex}}" },
          { to: "{{tokenAddress}}", data: "{{dataHex}}", value: "{{valueHex}}" },
        ],
      },
    ],
  });

  // 触发 eth_decrypt：请求钱包用当前账户私钥解密密文数据。
  r("EIP1193_EthDecrypt", {
    id: "EIP1193_EthDecrypt",
    name: "eth_decrypt",
    method: "eth_decrypt",
    params: ["{{encryptedHexData}}", "{{address}}"],
  });

  // 触发 eth_sendTransaction（对照组）：在 Polygon 场景下发一笔单独交易。
  r("V11_Polygon_ControlEthSendTransaction", {
    id: "V11_Polygon_ControlEthSendTransaction",
    name: "对照组 Polygon eth_sendTransaction",
    method: "eth_sendTransaction",
    params: [
      {
        from: "{{address}}",
        to: "{{polygonUsdtAddress}}",
        value: "0x0",
        data: "{{polygonUsdtTransferData}}",
        gas: "0x186a0",
        chainId: "{{polygonChainIdHex}}",
      },
    ],
  });

  // 实验组第二笔交易与对照组共用同一 fixture（V11_Polygon_ControlEthSendTransaction），仅多一步前置 wallet_switchEthereumChain
})();