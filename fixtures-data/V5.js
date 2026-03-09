// fixtures-data/V5.js
(() => {
  const r = window.registerFixtureData;

  r("V5_ERC20_Approve", {
    id: "V5_ERC20_Approve",
    name: "ERC20 授权 (Standard)",
    method: "eth_sendTransaction",
    params: [
      {
        from: "{{address}}",
        to: "0x6b175474e89094c44da98b954eedeac495271d0f",
        data: "0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d00000000000000056bc75e2d6311c18f",
      },
    ],
  });

  r("V5_Increase_Allowance", {
    id: "V5_Increase_Allowance",
    name: "ERC20 增加授权",
    method: "eth_sendTransaction",
    params: [
      {
        from: "{{address}}",
        to: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
        data: "0x39509351000000000000000000000000216b4b4ba9f3e719726886d34a177484278bfcae0000000000000000000000000000000000000000000000056bc75e2d63100000",
      },
    ],
  });

  r("V5_SetApprovalForAll", {
    id: "V5_SetApprovalForAll",
    name: "ERC20 无限授权 (SetApprovalForAll)",
    method: "eth_sendTransaction",
    params: [
      {
        gas: "0xea28",
        value: "0x0",
        from: "{{address}}",
        to: "0x42069abfe407c60cf4ae4112bedead391dba1cdb",
        data: "0xa22cb4650000000000000000000000001e0049783f008a0085193e00003d00cd54003c710000000000000000000000000000000000000000",
      },
    ],
  });
})();

