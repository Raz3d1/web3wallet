// fixtures-data/V11.js — Binance 特供版（标准 EIP-1193 / JSON-RPC 映射版）
// 说明：此文件用于网页里的 window.ethereum.request，method 需使用钱包可识别的标准名。
(() => {
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

  // 3. sendTransaction -> eth_sendTransaction
  r("Dapp_SendTransaction", {
    id: "Dapp_SendTransaction",
    name: "eth_sendTransaction",
    method: "eth_sendTransaction",
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

  // 5. signPersonalMessage -> personal_sign
  r("Dapp_SignPersonalMessage", {
    id: "Dapp_SignPersonalMessage",
    name: "personal_sign",
    method: "personal_sign",
    params: ["{{hexMessage}}", "{{address}}"],
  });

  // 6. signMessage -> eth_sign
  r("Dapp_SignMessage", {
    id: "Dapp_SignMessage",
    name: "eth_sign",
    method: "eth_sign",
    params: ["{{address}}", "{{hexMessage}}"],
  });

  // 7. eth_signTypedData_v4：第二个参数为 typed data JSON 字符串
  r("Dapp_EthSignTypedData_V4", {
    id: "Dapp_EthSignTypedData_V4",
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
    ]
  });

  // 8. signRawTransaction 映射为 eth_sendRawTransaction（广播 raw tx）
  r("Dapp_SignRawTransaction", {
    id: "Dapp_SignRawTransaction",
    name: "eth_sendRawTransaction",
    method: "eth_sendRawTransaction",
    params: ["{{unsignedRawTxHex}}"],
  });

  // 9. ecRecover -> personal_ecRecover
  r("Dapp_EcRecover", {
    id: "Dapp_EcRecover",
    name: "personal_ecRecover",
    method: "personal_ecRecover",
    params: ["{{hexMessage}}", "{{sigHex}}"],
  });

  // 10. addEthereumChain -> wallet_addEthereumChain
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

  // 11. common_json_rpc eth_chainId -> 直接调用 eth_chainId
  r("Dapp_CommonJsonRpc_eth_chainId", {
    id: "Dapp_CommonJsonRpc_eth_chainId",
    name: "eth_chainId",
    method: "eth_chainId",
    params: [],
  });
})();