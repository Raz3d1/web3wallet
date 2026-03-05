//// LooksRare 挂单签名样例，实际金额远高于挂单金额，但可能由于UI设计不当被用户忽略，导致用户以为自己签署了无关紧要的订单，实际是授权一个高价订单
function v6_LooksRareFixture(address) {
    return {
        id: 'V6_LooksRare',
        name: 'LooksRare 订单签名 (LooksRare Order Signature)',
        method: 'eth_signTypedData_v4',
        params: [
            address,
            JSON.stringify({
                types: {
        MakerOrder: [
          { name: 'isOrderAsk', type: 'bool' },
          { name: 'signer', type: 'address' },
          { name: 'collection', type: 'address' },
          { name: 'price', type: 'uint256' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          { name: 'strategy', type: 'address' },
          { name: 'currency', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'minPercentageToAsk', type: 'uint256' },
          { name: 'params', type: 'bytes' },
        ],
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
      },
      domain: {
        name: 'LooksRareExchange',
        version: '1',
        chainId: '1',
        verifyingContract: '0x59728544b08ab483533076417fbbb2fd0b17ce3a',
      },
      primaryType: 'MakerOrder',
      message: {
        isOrderAsk: true,
        signer: address,
        collection: '0x0C58Ef43fF3032005e472cB5709f8908aCb00205',
        price: '1000000000000000000',
        tokenId: '69',
        amount: '1',
        strategy: '0x56244bb70cbd3ea9dc8007399f61dfc065190031',
        currency: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        nonce: '9',
        startTime: '1661674724',
        endTime: '1664266721',
        minPercentageToAsk: '9550',
        params: '0x',
      },
    })
    ]
    };
}
