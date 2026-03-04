// fixtures/DaiPermit.js
function DaiPermitFixture(address){
    return {
        id: 'V5_Dai_Permit',
        name: 'DAI 离线授权 (Permit)',
        method: 'eth_signTypedData_v3', //
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
                        { name: 'holder', type: 'address' },
                        { name: 'spender', type: 'address' },
                        { name: 'nonce', type: 'uint256' },
                        { name: 'expiry', type: 'uint256' },
                        { name: 'allowed', type: 'bool' },
                    ],
                },
                domain: {
                    name: 'Dai Stablecoin',
                    version: '1',
                    verifyingContract: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                    chainId: 1, // 对应 V9: ChainID 不匹配测试
                },
                primaryType: 'Permit',
                message: {
                    holder: address,
                    spender: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
                    allowed: true, // 对应 V5: 授权风险
                    nonce: 0,
                    expiry: 1660916504,
                },
            })
        ]
    };
};