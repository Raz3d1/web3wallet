function v9_PermitForAllFixture(address) {
    return {
        id: 'V9_PermitForAll',
        name: '知名合约伪造的欺诈合约授权 (Fraudulent Contract Authorization Mimicking a Known Contract)',
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
        PermitForAll: [
          { name: 'owner', type: 'address' },
          { name: 'operator', type: 'address' },
          { name: 'approved', type: 'bool' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      domain: {
        name: 'Lens',
        version: '2',
        verifyingContract: '0x7784604037F1245E8A720059cFB8ecC809A215F9',// 这是一个恶意合约地址，攻击者部署了一个模仿 Lens 的合约来诱导用户签名授权
        chainId: 137,
      },
      primaryType: 'PermitForAll',
      message: {
        owner: address,
        operator: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        approved: 'true',
        nonce: 2,
        deadline: 1660917549,
      },
    }),
        ],
}}