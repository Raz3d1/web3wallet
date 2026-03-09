// fixtures-data/V6.js
(() => {
  const r = window.registerFixtureData;

  r("V6_Blur", {
    id: "V6_Blur",
    name: "Blur 挂单签名 (Blur Signature)",
    method: "eth_signTypedData_v4",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: {
            Order: [
              { name: "trader", type: "address" },
              { name: "side", type: "uint8" },
              { name: "matchingPolicy", type: "address" },
              { name: "collection", type: "address" },
              { name: "tokenId", type: "uint256" },
              { name: "amount", type: "uint256" },
              { name: "paymentToken", type: "address" },
              { name: "price", type: "uint256" },
              { name: "listingTime", type: "uint256" },
              { name: "expirationTime", type: "uint256" },
              { name: "fees", type: "Fee[]" },
              { name: "salt", type: "uint256" },
              { name: "extraParams", type: "bytes" },
              { name: "nonce", type: "uint256" },
            ],
            Fee: [
              { name: "rate", type: "uint16" },
              { name: "recipient", type: "address" },
            ],
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
          },
          domain: {
            name: "Blur Exchange",
            version: "1.0",
            chainId: 1,
            verifyingContract: "0x000000000000ad05ccc4f10045630fb830b95127",
          },
          primaryType: "Order",
          message: {
            trader: "{{address}}",
            side: "1",
            matchingPolicy: "0x00000000006411739da1c40b106f8511de5d1fac",
            collection: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
            tokenId: "7971",
            amount: "1",
            paymentToken: "0x0000000000000000000000000000000000000000",
            price: "100000000000000000",
            listingTime: "1667156700",
            expirationTime: "1669748700",
            fees: [{ rate: "500", recipient: "0x4991381db0d5b269c7bf53a8f9724e6c6c57dd7b" }],
            salt: "77743047075140209825397850706388400705",
            extraParams: "0x",
            nonce: "0",
          },
        },
      },
    ],
  });

  r("V6_Blur_Bulk", {
    id: "V6_Blur_Bulk",
    name: "Blur 批量挂单签名 (Blur Bulk Signature)",
    method: "eth_signTypedData_v4",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: {
            Root: [{ name: "root", type: "bytes32" }],
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
          },
          domain: {
            name: "Blur Exchange",
            version: "1.0",
            chainId: 1,
            verifyingContract: "0x000000000000ad05ccc4f10045630fb830b95127",
          },
          primaryType: "Root",
          message: {
            root: "0xa14678738b2ace0e6461a32ef0cf24e8e090c05475ca6cc1691080b84cb5fc7b",
          },
        },
      },
    ],
  });

  r("V6_Seaport1", {
    id: "V6_Seaport1",
    name: "Seaport 订单签名 (Seaport Order Signature)",
    method: "eth_signTypedData_v4",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: {
            OrderComponents: [
              { name: "offerer", type: "address" },
              { name: "zone", type: "address" },
              { name: "offer", type: "OfferItem[]" },
              { name: "consideration", type: "ConsiderationItem[]" },
              { name: "orderType", type: "uint8" },
              { name: "startTime", type: "uint256" },
              { name: "endTime", type: "uint256" },
              { name: "zoneHash", type: "bytes32" },
              { name: "salt", type: "uint256" },
              { name: "conduitKey", type: "bytes32" },
              { name: "counter", type: "uint256" },
            ],
            OfferItem: [
              { name: "itemType", type: "uint8" },
              { name: "token", type: "address" },
              { name: "identifierOrCriteria", type: "uint256" },
              { name: "startAmount", type: "uint256" },
              { name: "endAmount", type: "uint256" },
            ],
            ConsiderationItem: [
              { name: "itemType", type: "uint8" },
              { name: "token", type: "address" },
              { name: "identifierOrCriteria", type: "uint256" },
              { name: "startAmount", type: "uint256" },
              { name: "endAmount", type: "uint256" },
              { name: "recipient", type: "address" },
            ],
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
          },
          domain: {
            name: "Seaport",
            version: "1.1",
            chainId: "1",
            verifyingContract: "0x00000000006c3852cbef3e08e8df289169ede581",
          },
          primaryType: "OrderComponents",
          message: {
            offerer: "{{address}}",
            zone: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
            offer: [
              {
                itemType: "2",
                token: "0x922dc160f2ab743312a6bb19dd5152c1d3ecca33",
                identifierOrCriteria: "176",
                startAmount: "1",
                endAmount: "1",
              },
            ],
            consideration: [
              {
                itemType: "0",
                token: "0x0000000000000000000000000000000000000000",
                identifierOrCriteria: "0",
                startAmount: "0",
                endAmount: "0",
                recipient: "{{address}}",
              },
              {
                itemType: "0",
                token: "0x0000000000000000000000000000000000000000",
                identifierOrCriteria: "0",
                startAmount: "25000000000000000",
                endAmount: "25000000000000000",
                recipient: "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
              },
              {
                itemType: "0",
                token: "0x0000000000000000000000000000000000000000",
                identifierOrCriteria: "0",
                startAmount: "50000000000000000",
                endAmount: "50000000000000000",
                recipient: "0x5c6139cd9ff1170197f13935c58f825b422c744c",
              },
            ],
            orderType: "3",
            startTime: "1660565524",
            endTime: "1661170320",
            zoneHash: "0x3000000000000000000000000000000000000000000000000000000000000000",
            salt: "5965482869793190759363249887602871532",
            conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            counter: "0",
          },
        },
      },
    ],
  });

  r("V6_Seaport14", {
    id: "V6_Seaport14",
    name: "Seaport14 订单签名 (Seaport14 Order Signature)",
    method: "eth_signTypedData_v4",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            BulkOrder: [{ name: "tree", type: "OrderComponents[2][2]" }],
            OrderComponents: [
              { name: "offerer", type: "address" },
              { name: "zone", type: "address" },
              { name: "offer", type: "OfferItem[]" },
              { name: "consideration", type: "ConsiderationItem[]" },
              { name: "orderType", type: "uint8" },
              { name: "startTime", type: "uint256" },
              { name: "endTime", type: "uint256" },
              { name: "zoneHash", type: "bytes32" },
              { name: "salt", type: "uint256" },
              { name: "conduitKey", type: "bytes32" },
              { name: "counter", type: "uint256" },
            ],
            OfferItem: [
              { name: "itemType", type: "uint8" },
              { name: "token", type: "address" },
              { name: "identifierOrCriteria", type: "uint256" },
              { name: "startAmount", type: "uint256" },
              { name: "endAmount", type: "uint256" },
            ],
            ConsiderationItem: [
              { name: "itemType", type: "uint8" },
              { name: "token", type: "address" },
              { name: "identifierOrCriteria", type: "uint256" },
              { name: "startAmount", type: "uint256" },
              { name: "endAmount", type: "uint256" },
              { name: "recipient", type: "address" },
            ],
          },
          primaryType: "BulkOrder",
          domain: {
            name: "Seaport",
            version: "1.4",
            chainId: "1",
            verifyingContract: "0x00000000000001ad428e4906aE43D8F9852d0dD6",
          },
          message: {
            tree: [
              [
                {
                  offerer: "{{address}}",
                  offer: [
                    {
                      itemType: "2",
                      token: "0x524cAB2ec69124574082676e6F654a18df49A048",
                      identifierOrCriteria: "523",
                      startAmount: "1",
                      endAmount: "1",
                    },
                  ],
                  consideration: [
                    {
                      itemType: "1",
                      token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                      identifierOrCriteria: "0",
                      startAmount: "950000000000000000",
                      endAmount: "950000000000000000",
                      recipient: "{{address}}",
                    },
                    {
                      itemType: "1",
                      token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                      identifierOrCriteria: "0",
                      startAmount: "50000000000000000",
                      endAmount: "50000000000000000",
                      recipient: "0x2dE038A402119bCbd49A4412c35f27670801eD4e",
                    },
                  ],
                  startTime: "1677839629",
                  endTime: "1680514429",
                  orderType: "0",
                  zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
                  zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                  salt: "24446860302761739304752683030156737591518664810215442929813375503150460457858",
                  conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
                  totalOriginalConsiderationItems: "2",
                  counter: "0",
                },
                {
                  offerer: "{{address}}",
                  offer: [
                    {
                      itemType: "2",
                      token: "0x922dC160f2ab743312A6bB19DD5152C1D3Ecca33",
                      identifierOrCriteria: "176",
                      startAmount: "1",
                      endAmount: "1",
                    },
                  ],
                  consideration: [],
                  startTime: "1677839629",
                  endTime: "1680514429",
                  orderType: "0",
                  zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
                  zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                  salt: "24446860302761739304752683030156737591518664810215442929814899498239212109405",
                  conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
                  totalOriginalConsiderationItems: "0",
                  counter: "0",
                },
              ],
              [
                {
                  offerer: "{{address}}",
                  offer: [
                    {
                      itemType: "2",
                      token: "0x922dC160f2ab743312A6bB19DD5152C1D3Ecca33",
                      identifierOrCriteria: "189",
                      startAmount: "1",
                      endAmount: "1",
                    },
                  ],
                  consideration: [],
                  startTime: "1677839629",
                  endTime: "1680514429",
                  orderType: "0",
                  zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
                  zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                  salt: "24446860302761739304752683030156737591518664810215442929800743236111375197126",
                  conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
                  totalOriginalConsiderationItems: "0",
                  counter: "0",
                },
                {
                  offerer: "0x0000000000000000000000000000000000000000",
                  zone: "0x0000000000000000000000000000000000000000",
                  offer: [],
                  consideration: [],
                  orderType: "0",
                  startTime: "0",
                  endTime: "0",
                  zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                  salt: "0",
                  conduitKey: "0x0000000000000000000000000000000000000000000000000000000000000000",
                  counter: "0",
                  totalOriginalConsiderationItems: "0",
                },
              ],
            ],
          },
        },
      },
    ],
  });

  r("V6_LooksRare", {
    id: "V6_LooksRare",
    name: "LooksRare 订单签名 (LooksRare Order Signature)",
    method: "eth_signTypedData_v4",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: {
            MakerOrder: [
              { name: "isOrderAsk", type: "bool" },
              { name: "signer", type: "address" },
              { name: "collection", type: "address" },
              { name: "price", type: "uint256" },
              { name: "tokenId", type: "uint256" },
              { name: "amount", type: "uint256" },
              { name: "strategy", type: "address" },
              { name: "currency", type: "address" },
              { name: "nonce", type: "uint256" },
              { name: "startTime", type: "uint256" },
              { name: "endTime", type: "uint256" },
              { name: "minPercentageToAsk", type: "uint256" },
              { name: "params", type: "bytes" },
            ],
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
          },
          domain: {
            name: "LooksRareExchange",
            version: "1",
            chainId: "1",
            verifyingContract: "0x59728544b08ab483533076417fbbb2fd0b17ce3a",
          },
          primaryType: "MakerOrder",
          message: {
            isOrderAsk: true,
            signer: "{{address}}",
            collection: "0x0C58Ef43fF3032005e472cB5709f8908aCb00205",
            price: "1000000000000000000",
            tokenId: "69",
            amount: "1",
            strategy: "0x56244bb70cbd3ea9dc8007399f61dfc065190031",
            currency: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            nonce: "9",
            startTime: "1661674724",
            endTime: "1664266721",
            minPercentageToAsk: "9550",
            params: "0x",
          },
        },
      },
    ],
  });
})();

