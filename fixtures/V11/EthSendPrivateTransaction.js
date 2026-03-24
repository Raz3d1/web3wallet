function v11_EthSendPrivateTransactionBinanceFixture(address) {
  // Binance(BSC) 专属探测项：默认占位 raw tx（用于 method 可达性验证）
  const rawTxHex =
    "0x02f86c388502540be40082520894bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb8080c080a0" +
    "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccca0" +
    "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";
  return window.buildFixtureFromData("V11_Eth_SendPrivateTransaction_Binance", {
    address,
    rawTxHex,
    maxBlockNumber: "0x0",
  });
}
