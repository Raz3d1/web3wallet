// fixtures/V11/BinanceDappFixtures.js — ETH 默认占位，可改 buildFixtureFromData 的 vars
(function () {
  const g = typeof window !== "undefined" ? window : globalThis;

  function utf8ToHex0x(text) {
    if (typeof ethers !== "undefined" && ethers.utils && ethers.utils.hexlify) {
      return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text));
    }
    const bytes = new TextEncoder().encode(text);
    return "0x" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  /** ETH 默认；占位符见 fixtures-data/V11.js */
  function ethVars(address) {
    const dummySig = "0x" + "a".repeat(130);
    const dummyRaw =
      "0x02f9010880" +
      "8080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080808080";
    return {
      address,
      from: address,
      reqId: "1",
      network: "ethereum",
      to: "0x17eed3ad6051F833A7D0Ccd0E5a973dFe4EBa702",
      chainIdHex: "0x1",
      chainIdNum: "1",
      hexMessage: utf8ToHex0x("hello"),
      unsignedRawTxHex:
        "0x01f86a010a84b2d05e0082520894000000000000000000000000000000000000dead85e8d4a5100080c080a0097ab436458e7f070c791d6f1bd77fe74d315312608adfdbbf78489130da078ca04e04f7d1e1797b56c9b65f821adbe6bdf1e3166368bd8bba101643ba1a2e551a",
      rawTxHex:
        "0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833",
      sigHex: dummySig,
      chainName: "Ethereum Mainnet",
      rpcUrl: "https://rpc.ankr.com/eth",
      explorerUrl: "https://etherscan.io/",
      chainIdentifier: "ethereum",
      // eth_signTransaction：占位符（用于更完整的 EIP-1193 事务字段）
      valueHex: "0x0",
      // 这里用 0x 占位（若钱包/签名器要求 calldata，需改成真实编码后的 data）
      dataHex: "0x",
      gasHex: "0x5208",
      gasPriceHex: "0x3b9aca00",
      nonceHex: "0x0",
      // wallet_watchAsset 占位符：ERC20
      tokenAddress: "0x582d872a1b094fc48f5de31d3b73f2d9be47def1",
      tokenSymbol: "TON",
      tokenImage: "",
      // eth_decrypt 占位符：加密数据（很多钱包未支持时会 method not found/参数错误）
      encryptedHexData: "0x00",
    };
  }

  function v11_RequestAccountsFixture(addr) {
    return g.buildFixtureFromData("Dapp_RequestAccounts", ethVars(addr));
  }

  function v11_RequestAccountsFullFixture(addr) {
    return g.buildFixtureFromData("Dapp_RequestAccounts_Full", ethVars(addr));
  }

  function v11_SignTransactionFixture(addr) {
    return g.buildFixtureFromData("Dapp_SignTransaction", ethVars(addr));
  }

  function v11_SignRawTransactionFixture(addr) {
    return g.buildFixtureFromData("EIP1193_EthSendRawTransaction", ethVars(addr));
  }

  function v11_EcRecoverFixture(addr) {
    return g.buildFixtureFromData("Dapp_EcRecover", ethVars(addr));
  }

  function v11_AddEthereumChainFixture(addr) {
    return g.buildFixtureFromData("Dapp_AddEthereumChain", ethVars(addr));
  }

  function v11_CommonJsonRpcEthChainIdFixture(addr) {
    return g.buildFixtureFromData("Dapp_CommonJsonRpc_eth_chainId", ethVars(addr));
  }

  function v11_EIP1193_EthSignTransactionFixture(addr) {
    return g.buildFixtureFromData("EIP1193_EthSignTransaction", ethVars(addr));
  }

  function v11_EIP1193_AccountsFixture(addr) {
    return g.buildFixtureFromData("EIP1193_Accounts", ethVars(addr));
  }

  function v11_EIP1193_SwitchChainFixture(addr) {
    return g.buildFixtureFromData("EIP1193_SwitchChain", ethVars(addr));
  }

  function v11_EIP1193_WatchAssetFixture(addr) {
    return g.buildFixtureFromData("EIP1193_WatchAsset", ethVars(addr));
  }

  function v11_EIP1193_RequestPermissionsFixture(addr) {
    return g.buildFixtureFromData("EIP1193_RequestPermissions", ethVars(addr));
  }

  function v11_EIP1193_EthSignTypedDataV3Fixture(addr) {
    return g.buildFixtureFromData("EIP1193_EthSignTypedData_V3", ethVars(addr));
  }

  function v11_EIP1193_WalletSendCallsFixture(addr) {
    return g.buildFixtureFromData("EIP1193_WalletSendCalls", ethVars(addr));
  }

  function v11_EIP1193_EthDecryptFixture(addr) {
    return g.buildFixtureFromData("EIP1193_EthDecrypt", ethVars(addr));
  }

  /** Polygon 对照组 / 实验组第二笔交易共用占位（实验组仅多一步 wallet_switchEthereumChain） */
  function polygonScenarioVars(address) {
    const base = ethVars(address);
    return {
      ...base,
      polygonChainIdHex: "0x89",
      polygonTo: "0x0000000000000000000000000000000000000001",
    };
  }

  /** 对照组：仅 Polygon eth_sendTransaction（纯交易场景） */
  function v11_PolygonControlEthSendTransactionFixture(addr) {
    return g.buildFixtureFromData("V11_Polygon_ControlEthSendTransaction", polygonScenarioVars(addr));
  }

  /**
   * 实验组：先 wallet_switchEthereumChain(0x1)，再发与对照组完全相同的 Polygon eth_sendTransaction
   * 返回 { requests: [...] }，由 app.js 连续 provider.request
   */
  function v11_PolygonExperimentChainFraudFixture(addr) {
    const tx = g.buildFixtureFromData("V11_Polygon_ControlEthSendTransaction", polygonScenarioVars(addr));
    return {
      name: "实验组：wallet_switchEthereumChain(0x1) + Polygon eth_sendTransaction（与对照组同 payload）",
      requests: [
        { method: "wallet_switchEthereumChain", params: [{ chainId: "0x1" }] },
        { method: tx.method, params: tx.params },
      ],
    };
  }

  g.v11_RequestAccountsFixture = v11_RequestAccountsFixture;
  g.v11_RequestAccountsFullFixture = v11_RequestAccountsFullFixture;
  g.v11_SignTransactionFixture = v11_SignTransactionFixture;
  g.v11_SignRawTransactionFixture = v11_SignRawTransactionFixture;
  g.v11_EcRecoverFixture = v11_EcRecoverFixture;
  g.v11_AddEthereumChainFixture = v11_AddEthereumChainFixture;
  g.v11_CommonJsonRpcEthChainIdFixture = v11_CommonJsonRpcEthChainIdFixture;
  g.v11_EIP1193_EthSignTransactionFixture = v11_EIP1193_EthSignTransactionFixture;
  g.v11_EIP1193_AccountsFixture = v11_EIP1193_AccountsFixture;
  g.v11_EIP1193_SwitchChainFixture = v11_EIP1193_SwitchChainFixture;
  g.v11_EIP1193_WatchAssetFixture = v11_EIP1193_WatchAssetFixture;
  g.v11_EIP1193_RequestPermissionsFixture = v11_EIP1193_RequestPermissionsFixture;
  g.v11_EIP1193_EthSignTypedDataV3Fixture = v11_EIP1193_EthSignTypedDataV3Fixture;
  g.v11_EIP1193_WalletSendCallsFixture = v11_EIP1193_WalletSendCallsFixture;
  g.v11_EIP1193_EthDecryptFixture = v11_EIP1193_EthDecryptFixture;
  g.v11_PolygonControlEthSendTransactionFixture = v11_PolygonControlEthSendTransactionFixture;
  g.v11_PolygonExperimentChainFraudFixture = v11_PolygonExperimentChainFraudFixture;
})();
