function v4_Non_rigorousInputdataFixture(address) {
    return {
        id: 'V4_Non_rigorous_Input_data', 
        name: '非严格输入数据 (Non-rigorous Input Data)',
        method: 'eth_sendTransaction',
        params: [{
      from: address,
      to: '0x6b175474e89094c44da98b954eedeac495271d0f',
      data: '095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d0000000000000000000000000000000000000000000000056bc75e2d63100000',
    }]
    };
}
