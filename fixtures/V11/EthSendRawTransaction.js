function v11_EthSendRawTransactionFixture(address) {
  // 占位 raw tx（默认会失败，用于测试 method 可达性）
  // 如需真实广播，请替换为对应链、已签名且可上链的 raw transaction。
  const rawTxHex =
    "0x02f86c01808502540be40082520894eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee8080c080a0" +
    "1111111111111111111111111111111111111111111111111111111111111111a0" +
    "2222222222222222222222222222222222222222222222222222222222222222";
  return window.buildFixtureFromData("V11_Eth_SendRawTransaction", {
    address,
    rawTxHex,
  });
}

function v11_EthSendRawTransactionBinanceFixture(address) {
  // Binance(BSC) 专属探测项：默认占位 raw tx（用于 method 可达性验证）
  const rawTxHex =
    "0x02f86c388502540be40082520894bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb8080c080a0" +
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0" +
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  return window.buildFixtureFromData("V11_Eth_SendRawTransaction_Binance", {
    address,
    rawTxHex,
  });
}

