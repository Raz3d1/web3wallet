// fixtures-data/V11.js
(() => {
  const r = window.registerFixtureData;

  r("V11_Eth_SendRawTransaction", {
    id: "V11_Eth_SendRawTransaction",
    name: "eth_sendRawTransaction",
    method: "eth_sendRawTransaction",
    params: [
      "{{rawTxHex}}",
    ],
  });

  r("V11_Eth_SendPrivateTransaction", {
    id: "V11_Eth_SendPrivateTransaction",
    name: "eth_sendPrivateTransaction",
    method: "eth_sendPrivateTransaction",
    params: [
      {
        tx: "{{rawTxHex}}",
        maxBlockNumber: "{{maxBlockNumber}}",
      },
    ],
  });

  r("V11_Eth_SendRawTransaction_Binance", {
    id: "V11_Eth_SendRawTransaction_Binance",
    name: "eth_sendRawTransaction (Binance)",
    method: "eth_sendRawTransaction",
    params: [
      "{{rawTxHex}}",
    ],
  });

  r("V11_Eth_SendPrivateTransaction_Binance", {
    id: "V11_Eth_SendPrivateTransaction_Binance",
    name: "eth_sendPrivateTransaction (Binance)",
    method: "eth_sendPrivateTransaction",
    params: [
      {
        tx: "{{rawTxHex}}",
        maxBlockNumber: "{{maxBlockNumber}}",
      },
    ],
  });
})();

