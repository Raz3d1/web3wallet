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
      unsignedRawTxHex: dummyRaw,
      sigHex: dummySig,
      chainName: "Ethereum Mainnet",
      rpcUrl: "https://rpc.ankr.com/eth",
      explorerUrl: "https://etherscan.io/",
      chainIdentifier: "ethereum",
    };
  }

  function v11_RequestAccountsFixture(addr) {
    return g.buildFixtureFromData("Dapp_RequestAccounts", ethVars(addr));
  }

  function v11_RequestAccountsFullFixture(addr) {
    return g.buildFixtureFromData("Dapp_RequestAccounts_Full", ethVars(addr));
  }

  function v11_SendTransactionFixture(addr) {
    return g.buildFixtureFromData("Dapp_SendTransaction", ethVars(addr));
  }

  function v11_SignTransactionFixture(addr) {
    return g.buildFixtureFromData("Dapp_SignTransaction", ethVars(addr));
  }

  function v11_SignPersonalMessageFixture(addr) {
    return g.buildFixtureFromData("Dapp_SignPersonalMessage", ethVars(addr));
  }

  function v11_SignMessageFixture(addr) {
    return g.buildFixtureFromData("Dapp_SignMessage", ethVars(addr));
  }

  function v11_EthSignTypedDataV4Fixture(addr) {
    return g.buildFixtureFromData("Dapp_EthSignTypedData_V4", ethVars(addr));
  }

  function v11_SignRawTransactionFixture(addr) {
    return g.buildFixtureFromData("Dapp_SignRawTransaction", ethVars(addr));
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

  function buildDappTypedDataV4(address, chainIdNum) {
    return g.buildFixtureFromData("Dapp_EthSignTypedData_V4", {
      address,
      reqId: "1",
      network: "ethereum",
      chainIdNum: String(chainIdNum),
    });
  }

  g.v11_RequestAccountsFixture = v11_RequestAccountsFixture;
  g.v11_RequestAccountsFullFixture = v11_RequestAccountsFullFixture;
  g.v11_SendTransactionFixture = v11_SendTransactionFixture;
  g.v11_SignTransactionFixture = v11_SignTransactionFixture;
  g.v11_SignPersonalMessageFixture = v11_SignPersonalMessageFixture;
  g.v11_SignMessageFixture = v11_SignMessageFixture;
  g.v11_EthSignTypedDataV4Fixture = v11_EthSignTypedDataV4Fixture;
  g.v11_SignRawTransactionFixture = v11_SignRawTransactionFixture;
  g.v11_EcRecoverFixture = v11_EcRecoverFixture;
  g.v11_AddEthereumChainFixture = v11_AddEthereumChainFixture;
  g.v11_CommonJsonRpcEthChainIdFixture = v11_CommonJsonRpcEthChainIdFixture;
  g.buildDappTypedDataV4 = buildDappTypedDataV4;
})();
