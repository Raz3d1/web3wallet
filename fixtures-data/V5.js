// fixtures-data/V5.js
//
// 2026-11-11 ABI 补齐说明：
//   - V5_ERC20_Approve：approve 的 uint256 参数原来只写了 32 个 hex 字符（16 字节），
//     ABI 要求 64 个（32 字节），DAI(0.5.12) 在 calldatasize 检查阶段直接 revert。
//     同时原数值 0x56bc75e2d6311c18f（100.000000000000115087 DAI）本身也不是整齐的 100，
//     这里统一改为整数 100 DAI = 1e20。
//   - V5_SetApprovalForAll：setApprovalForAll 的 bool 参数原来写了 40 个 hex 字符，
//     应补到 64 个；按用例名“无限授权”填 true(1)。
//   - V5_Increase_Allowance：ABI 长度原本就是对的（68 字节），未改动；
//     但金额 1e12 = 0.000001 ENS 非常小，如需大额授权见该条注释。
(() => {
  const r = window.registerFixtureData;

  r("V5_ERC20_Approve", {
    id: "V5_ERC20_Approve",
    name: "ERC20 授权 (Standard)",
    method: "eth_sendTransaction",
    params: [
      {
        from: "{{address}}",
        // to      = DAI (0x6b17...1d0f)
        // spender = Uniswap V2 Router02 (0x7a25...488d)
        // amount  = 100 DAI = 1e20 = 0x56bc75e2d63100000
        to: "0x6b175474e89094c44da98b954eedeac495271d0f",
        data: "0x095ea7b3" +
          "0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d" +
          "0000000000000000000000000000000000000000000000056bc75e2d63100000",
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
        // to      = ENS token (0xC183...9D72)，18 位小数
        // spender = 0x216b...fcae
        // amount  = 1e12 = 0.000001 ENS（极小值；若要测大额增加授权，改成 10e18 = 0x8ac7230489e80000）
        // 注意：increaseAllowance 是“当前额度 + 本次额度”，不是覆盖设置
        to: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
        data: "0x39509351" +
          "000000000000000000000000216b4b4ba9f3e719726886d34a177484278bfcae" +
          "000000000000000000000000000000000000000000000000000000e8d4a51000",
      },
    ],
  });

  r("V5_SetApprovalForAll", {
    id: "V5_SetApprovalForAll",
    name: "ERC721/1155 全量授权 (SetApprovalForAll)",
    method: "eth_sendTransaction",
    params: [
      {
        gas: "0xea28",
        value: "0x0",
        from: "{{address}}",
        // to       = NFT 集合合约（fixture 固定地址）
        // operator = OpenSea Conduit (0x1E00...3c71)
        // approved = true(1)，即把该集合下全部 NFT 的转移权交给 operator
        to: "0x42069abfe407c60cf4ae4112bedead391dba1cdb",
        data: "0xa22cb465" +
          "0000000000000000000000001e0049783f008a0085193e00003d00cd54003c71" +
          "0000000000000000000000000000000000000000000000000000000000000001",
      },
    ],
  });
})();
