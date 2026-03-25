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