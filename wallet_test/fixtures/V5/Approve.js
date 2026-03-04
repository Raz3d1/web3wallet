function v5_ApproveFixture(address){
    return {
        id: 'V5_ERC20_Approve',
        name: 'ERC20 授权 (Standard)',
        method: 'eth_sendTransaction',
        params: [{
            from: address,
            to: '0x6b175474e89094c44da98b954eedeac495271d0f',
            data: '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d00000000000000056bc75e2d6311c18f'
        }]
    };
}