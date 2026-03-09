// fixtures-data/V9.js
(() => {
  const r = window.registerFixtureData;

  r("V9_Permit", {
    id: "V9_Permit",
    name: "合约与网络不一致的 Permit 签名 (Permit Signature with Mismatched Contract and Network)",
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
            Permit: [
              { name: "owner", type: "address" },
              { name: "spender", type: "address" },
              { name: "value", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "deadline", type: "uint256" },
            ],
          },
          domain: {
            name: "USD Coin",
            version: "2",
            verifyingContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            chainId: 137,
          },
          primaryType: "Permit",
          message: {
            owner: "{{address}}",
            spender: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            value: "25000000",
            nonce: 5,
            deadline: 1800000000,
          },
        },
      },
    ],
  });

  r("V9_PermitForAll", {
    id: "V9_PermitForAll",
    name: "知名合约伪造的欺诈合约授权 (Fraudulent Contract Authorization Mimicking a Known Contract)",
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
            PermitForAll: [
              { name: "owner", type: "address" },
              { name: "operator", type: "address" },
              { name: "approved", type: "bool" },
              { name: "nonce", type: "uint256" },
              { name: "deadline", type: "uint256" },
            ],
          },
          domain: {
            name: "Lens",
            version: "2",
            verifyingContract: "0x7784604037F1245E8A720059cFB8ecC809A215F9",
            chainId: 137,
          },
          primaryType: "PermitForAll",
          message: {
            owner: "{{address}}",
            operator: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            approved: "true",
            nonce: 2,
            deadline: 1660917549,
          },
        },
      },
    ],
  });

  const seaportCommonTypes = {
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
  };

  const seaportCommonMessage = {
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
  };

  r("V9_Seaport1_1", {
    id: "V9_Seaport1_1",
    name: "Seaport 跨链订单签名 (Seaport Cross-Chain Order Signature)",
    method: "eth_signTypedData_v4",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: seaportCommonTypes,
          domain: {
            name: "Seaport",
            version: "1.4",
            chainId: "137",
            verifyingContract: "0x00000000006c3852cbef3e08e8df289169ede581",
          },
          primaryType: "OrderComponents",
          message: seaportCommonMessage,
        },
      },
    ],
  });

  r("V9_Seaport1_2", {
    id: "V9_Seaport1_2",
    name: "Seaport 合约欺诈订单签名 (Seaport Contract Fraud Order Signature)",
    method: "eth_signTypedData_v4",
    params: [
      "{{address}}",
      {
        $stringify: {
          types: seaportCommonTypes,
          domain: {
            name: "Seaport",
            version: "1.1",
            chainId: "1",
            verifyingContract: "0x7784604037F1245E8A720059cFB8ecC809A215F9",
          },
          primaryType: "OrderComponents",
          message: seaportCommonMessage,
        },
      },
    ],
  });
})();

