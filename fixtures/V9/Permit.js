function v9_PermitFixture(address) {
    return {
        id: 'V9_Permit',
        name: '合约与网络不一致的 Permit 签名 (Permit Signature with Mismatched Contract and Network)',
        method: 'eth_signTypedData_v4',
        params: [
            address,
            JSON.stringify({
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      domain: {
        name: 'USD Coin',
        version: '2',
        verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',// USDC 主网合约地址,但是使用的是 Polygon 主网的 chainId，攻击者可能利用这一点来混淆用户
        chainId: 137,
      },
      primaryType: 'Permit',
      message: {
        owner: address,
        spender: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        value: '25000000',
        nonce: 5,
        deadline: 1800000000,
      },
    }),
        ],
}}
