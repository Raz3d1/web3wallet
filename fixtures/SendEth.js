function SendEthFixture(address) {
    return {
        id: 'V7_SendEth',
        name: '发送 ETH',
        method: 'eth_sendTransaction',
        params: [
            {
                from: address,
                to: "0x000000000000000000000000123456789123456789",
                value: "123456789123456789"
            }
        ]
    };
};