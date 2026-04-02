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
      to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
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
      currencyName: "ETH",
      currencySymbol: "ETH",
      // eth_signTransaction：占位符（用于更完整的 EIP-1193 事务字段）；约 0.01 个原生代币（18 位小数）
      valueHex: "0x2386f26fc10000",
      // 这里用 0x 占位（若钱包/签名器要求 calldata，需改成真实编码后的 data）
      dataHex: "0x",
      gasHex: "0x5208",
      gasPriceHex: "0x3b9aca00",
      // 默认不传 nonce（见 fixtures-data/V11.js EIP1193_EthSignTransaction）。
      // 若钱包强校验 “missing nonce”，可在 ethVars 中取消下面注释，并在 V11.js 该 fixture 的 tx 对象中加回：nonce: "{{nonceHex}}"
      // nonceHex: "0x491c",
      // wallet_watchAsset 占位符：ERC20
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      tokenSymbol: "USDC",
      tokenImage: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      // eth_decrypt 占位符：加密数据（很多钱包未支持时会 method not found/参数错误）
      encryptedHexData: "0x00",
    };
  }

  // 构造 requestAccounts 载体：触发钱包账户授权流程。
  function v11_RequestAccountsFixture(addr) {
    return g.buildFixtureFromData("Dapp_RequestAccounts", ethVars(addr));
  }

  // 构造 requestAccounts full 载体：用于兼容性对照测试。
  function v11_RequestAccountsFullFixture(addr) {
    return g.buildFixtureFromData("Dapp_RequestAccounts_Full", ethVars(addr));
  }

  // 构造 signTransaction 载体：测试仅签名不广播的交易流程。
  function v11_SignTransactionFixture(addr) {
    return g.buildFixtureFromData("Dapp_SignTransaction", ethVars(addr));
  }

  // 构造 sendRawTransaction 载体：测试广播原始交易。
  function v11_SignRawTransactionFixture(addr) {
    return g.buildFixtureFromData("EIP1193_EthSendRawTransaction", ethVars(addr));
  }

  // 构造 ecRecover 载体：测试签名地址恢复能力。
  function v11_EcRecoverFixture(addr) {
    return g.buildFixtureFromData("Dapp_EcRecover", ethVars(addr));
  }

  // 构造 addEthereumChain 载体：测试新增链配置弹窗。
  function v11_AddEthereumChainFixture(addr) {
    return g.buildFixtureFromData("Dapp_AddEthereumChain", ethVars(addr));
  }

  // 构造 eth_chainId 载体：测试当前网络识别。
  function v11_CommonJsonRpcEthChainIdFixture(addr) {
    return g.buildFixtureFromData("Dapp_CommonJsonRpc_eth_chainId", ethVars(addr));
  }

  // 构造 EIP1193 signTransaction 载体：测试完整交易字段签名流程。
  function v11_EIP1193_EthSignTransactionFixture(addr) {
    return g.buildFixtureFromData("EIP1193_EthSignTransaction", ethVars(addr));
  }

  // 构造 eth_accounts 载体：读取已授权账户列表。
  function v11_EIP1193_AccountsFixture(addr) {
    return g.buildFixtureFromData("EIP1193_Accounts", ethVars(addr));
  }

  // 构造 switchEthereumChain 载体：测试钱包切链行为。
  function v11_EIP1193_SwitchChainFixture(addr) {
    return g.buildFixtureFromData("EIP1193_SwitchChain", ethVars(addr));
  }

  // 构造 watchAsset 载体：测试钱包添加代币展示行为。
  function v11_EIP1193_WatchAssetFixture(addr) {
    return g.buildFixtureFromData("EIP1193_WatchAsset", ethVars(addr));
  }

  // 构造 requestPermissions 载体：测试权限申请弹窗。
  function v11_EIP1193_RequestPermissionsFixture(addr) {
    return g.buildFixtureFromData("EIP1193_RequestPermissions", ethVars(addr));
  }

  // 构造 signTypedData v3 载体：测试 EIP-712 v3 签名展示与校验。
  function v11_EIP1193_EthSignTypedDataV3Fixture(addr) {
    return g.buildFixtureFromData("EIP1193_EthSignTypedData_V3", ethVars(addr));
  }

  // 构造 signTypedData v4 载体：测试 EIP-712 v4 签名展示与校验。
  function v11_EIP1193_EthSignTypedDataV4Fixture(addr) {
    return g.buildFixtureFromData("EIP1193_EthSignTypedData_V4", ethVars(addr));
  }

  // 构造 wallet_sendCalls 载体：测试批量 calls 的复合交互展示。
  function v11_EIP1193_WalletSendCallsFixture(addr) {
    return g.buildFixtureFromData("EIP1193_WalletSendCalls", ethVars(addr));
  }

  // 构造 eth_decrypt 载体：测试高敏感解密请求的告警与阻断。
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
      polygonUsdtAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      polygonUsdtTransferData:
        "0xa9059cbb000000000000000000000000000000000000000000000000000000000000dead00000000000000000000000000000000000000000000000000000000000f4240",
      currencyName: "MATIC",
      currencySymbol: "MATIC",
    };
  }

  /** 切换到 Polygon：只请求钱包切链到 chainId=0x89 */
  function v11_SwitchToPolygonFixture(addr) {
    return g.buildFixtureFromData("V11_SwitchToPolygon", polygonScenarioVars(addr));
  }

  /** 对照组：仅发一笔 Polygon 交易，观察基础交易弹窗。 */
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
  g.v11_EIP1193_EthSignTypedDataV4Fixture = v11_EIP1193_EthSignTypedDataV4Fixture;
  g.v11_EIP1193_WalletSendCallsFixture = v11_EIP1193_WalletSendCallsFixture;
  g.v11_EIP1193_EthDecryptFixture = v11_EIP1193_EthDecryptFixture;
  g.v11_SwitchToPolygonFixture = v11_SwitchToPolygonFixture;
  g.v11_PolygonControlEthSendTransactionFixture = v11_PolygonControlEthSendTransactionFixture;
  g.v11_PolygonExperimentChainFraudFixture = v11_PolygonExperimentChainFraudFixture;
})();
