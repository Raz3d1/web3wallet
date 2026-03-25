// fixtures-data/V11.js — Binance 特供版：Native / DappRequest / Web3RequestModel 风格占位模板
// 内层需整段 JSON 字符串处使用 $stringify，避免双重编码；占位符见 _runtime.js templateReplaceString
(() => {
  const r = window.registerFixtureData;

  // 1. 简单的账户请求 (无参数)
  r("Dapp_RequestAccounts", {
    id: "Dapp_RequestAccounts",
    name: "requestAccounts",
    method: "requestAccounts",
    params: [],
  });

  // 2. 完整的账户请求 (带 $stringify)
  r("Dapp_RequestAccounts_Full", {
    id: "Dapp_RequestAccounts_Full",
    name: "requestAccounts (full model)",
    method: "requestAccounts",
    params: [
      {
        $stringify: {
          assetId: "",
          meta: {
            id: "{{reqId}}",
            name: "requestAccounts",
            network: "{{network}}",
            _object: {}
          }
        }
      }
    ]
  });

  // 3. 发送交易 (普通 JSON，不带 $stringify)
  r("Dapp_SendTransaction", {
    id: "Dapp_SendTransaction",
    name: "sendTransaction",
    method: "sendTransaction",
    params: [
      {
        from: "{{from}}",
        to: "{{to}}",
        value: "0x0",
        data: "0x",
        gas: "0x5208",
        gasPrice: "0x3b9aca00",
        chainId: "{{chainIdHex}}"
      }
    ]
  });

  // 4. 签名交易 (普通 JSON)
  r("Dapp_SignTransaction", {
    id: "Dapp_SignTransaction",
    name: "signTransaction",
    method: "signTransaction",
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

  // 5. 个人消息签名 (带 $stringify)
  r("Dapp_SignPersonalMessage", {
    id: "Dapp_SignPersonalMessage",
    name: "signPersonalMessage",
    method: "signPersonalMessage",
    params: [
      {
        $stringify: {
          assetId: "",
          meta: {
            id: "{{reqId}}",
            name: "signPersonalMessage",
            network: "{{network}}",
            _object: {
              address: "{{address}}",
              data: "{{hexMessage}}"
            }
          }
        }
      }
    ]
  });

  // 6. 消息签名 (带 $stringify)
  r("Dapp_SignMessage", {
    id: "Dapp_SignMessage",
    name: "signMessage",
    method: "signMessage",
    params: [
      {
        $stringify: {
          assetId: "",
          meta: {
            id: "{{reqId}}",
            name: "signMessage",
            network: "{{network}}",
            _object: {
              address: "{{address}}",
              data: "{{hexMessage}}"
            }
          }
        }
      }
    ]
  });

  // 7. EIP-712 结构化签名 (双重 $stringify)
  r("Dapp_EthSignTypedData_V4", {
    id: "Dapp_EthSignTypedData_V4",
    name: "eth_signTypedData_v4",
    method: "eth_signTypedData_v4",
    params: [
      {
        $stringify: {
          assetId: "",
          meta: {
            id: "{{reqId}}",
            name: "eth_signTypedData_v4",
            network: "{{network}}",
            _object: {
              address: "{{address}}",
              raw: {
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
                }
              }
            }
          }
        }
      }
    ]
  });

  // 8. 原始交易签名 (带 $stringify)
  r("Dapp_SignRawTransaction", {
    id: "Dapp_SignRawTransaction",
    name: "signRawTransaction",
    method: "signRawTransaction",
    params: [
      {
        $stringify: {
          assetId: "",
          meta: {
            id: "{{reqId}}",
            name: "signRawTransaction",
            network: "{{network}}",
            _object: {
              raw: "{{unsignedRawTxHex}}"
            }
          }
        }
      }
    ]
  });

  // 9. 验签恢复 (带 $stringify)
  r("Dapp_EcRecover", {
    id: "Dapp_EcRecover",
    name: "ecRecover",
    method: "ecRecover",
    params: [
      {
        $stringify: {
          assetId: "",
          meta: {
            id: "{{reqId}}",
            name: "ecRecover",
            network: "{{network}}",
            _object: {
              message: "{{hexMessage}}",
              signature: "{{sigHex}}"
            }
          }
        }
      }
    ]
  });

  // 10. 添加新网络 (普通 JSON)
  r("Dapp_AddEthereumChain", {
    id: "Dapp_AddEthereumChain",
    name: "addEthereumChain",
    method: "addEthereumChain",
    params: [
      {
        chainId: "{{chainIdHex}}",
        chainName: "{{chainName}}",
        nativeCurrency: {
          name: "BNB", // 默认占位用 BNB 或 ETH 均可，看你具体测什么
          symbol: "BNB",
          decimals: 18
        },
        rpcUrls: ["{{rpcUrl}}"],
        blockExplorerUrls: ["{{explorerUrl}}"]
      }
    ]
  });

  // 11. 通用 RPC (带 $stringify)
  r("Dapp_CommonJsonRpc_eth_chainId", {
    id: "Dapp_CommonJsonRpc_eth_chainId",
    name: "common_json_rpc eth_chainId",
    method: "common_json_rpc",
    params: [
      {
        $stringify: {
          action: "common_json_rpc",
          chain: "{{network}}", // 根据 bscVars 的定义，这里填 {{network}} 即可匹配 "bsc"
          rpcMethod: "eth_chainId",
          rpcParams: []
        }
      }
    ]
  });
})();