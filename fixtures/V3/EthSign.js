function v3_EthSignFixture(address) {
    return {
        id: 'V3_Eth_Sign',
        name: '危险的 eth_sign (Dangerous eth_sign)',
        method: 'eth_sign',
        params: [
            '0x797d5b9bd6fb2c70d000491ad03b9f872f8f928eb2c4326add81969094eef2e4',
            address
        ]
    };
}
