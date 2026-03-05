//// fixtures/v6/BlurBulk.js root信息涵盖了多个挂单，一般App会调用对应（blur）的API来获取这些信息，但如果App没有正确展示这些信息，用户可能会忽略掉其中的风险，导致批量授权高价订单
function v6_BlurBulkFixture(address) {
    return {
        id: 'V6_Blur_Bulk',
        name: 'Blur 批量挂单签名 (Blur Bulk Signature)',
        method: 'eth_signTypedData_v4', // 必须保留：这是论文中提到的 EIP-712 标准方法 
        params: [
            address,
            JSON.stringify({
                types: {
                    Root: [{ name: 'root', type: 'bytes32' }],
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' },
                    ],
                },
                domain: {
                    name: 'Blur Exchange',
                    version: '1.0',
                    chainId: 1, // 建议转为数字，用于测试 V9 ChainID 匹配 [cite: 487, 497]
                    verifyingContract: '0x000000000000ad05ccc4f10045630fb830b95127',
                },
                primaryType: 'Root',
                message: {
                    // 这是变异的核心点：root 往往掩盖了多个 NFT 的真实成交信息 
                    root: '0xa14678738b2ace0e6461a32ef0cf24e8e090c05475ca6cc1691080b84cb5fc7b',
                },
            })
        ]
    };
}