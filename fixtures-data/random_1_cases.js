window.RANDOM1_CASES = [
  {
    "id": 140,
    "mode": "random",
    "strategy": "random_field",
    "seed": "v7_phishing_address",
    "expectedResult": "X",
    "title": "data 注入非空 calldata",
    "summary": "0x → 0x5fba79f5...，UI 未展示 data 语义",
    "mutation": "params[0].data: 0x → 0x5fba79f5b93ed335c4bf565781",
    "note": "step_146 未显示 data；假设含 approve 需重测",
    "rpc": "eth_sendTransaction",
    "baseline": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0x0987654321098765432109876543210987654321",
          "value": "0x1000000000000000",
          "data": "0x"
        }
      ]
    },
    "mutated": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0x0987654321098765432109876543210987654321",
          "value": "0x1000000000000000",
          "data": "0x5fba79f5b93ed335c4bf565781"
        }
      ]
    }
  },
  {
    "id": 148,
    "mode": "random",
    "strategy": "random_field",
    "seed": "v7_phishing_address",
    "expectedResult": "O",
    "title": "to 替换为已知钓鱼地址",
    "summary": "to 改为 0xE92E...，UI 展示地址一致判 O",
    "mutation": "params[0].to → 0xE92E1Da67dE3a136F129C64cbCaFE4D47bc6a03f",
    "note": "",
    "rpc": "eth_sendTransaction",
    "baseline": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0x0987654321098765432109876543210987654321",
          "value": "0x1000000000000000",
          "data": "0x"
        }
      ]
    },
    "mutated": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0xE92E1Da67dE3a136F129C64cbCaFE4D47bc6a03f",
          "value": "0x1000000000000000",
          "data": "0x"
        }
      ]
    }
  },
  {
    "id": 191,
    "mode": "random",
    "strategy": "random_field",
    "seed": "v5_unlimited_approve",
    "expectedResult": "X",
    "title": "approve 交易 value 被随机改写",
    "summary": "value 0x0 → 0xb357bf9b18c996ab，UI 误导为 Approve 且无金额",
    "mutation": "params[0].value: 0x0 → 0xb357bf9b18c996ab",
    "note": "需重新测试",
    "rpc": "eth_sendTransaction",
    "baseline": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "value": "0x0",
          "data": "0x095ea7b3000000000000000000000000abcdefabcdefabcdefabcdefabcdefabcdefabcd0000000000000000000000000000000000000000000000008ac7230489e80000"
        }
      ]
    },
    "mutated": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "value": "0xb357bf9b18c996ab",
          "data": "0x095ea7b3000000000000000000000000abcdefabcdefabcdefabcdefabcdefabcdefabcd0000000000000000000000000000000000000000000000008ac7230489e80000"
        }
      ]
    }
  },
  {
    "id": 209,
    "mode": "random",
    "strategy": "random_field",
    "seed": "v10_corrupt_personal_sign",
    "expectedResult": "X",
    "title": "personal_sign 签名者地址被替换",
    "summary": "params[1] 改为非当前账户地址",
    "mutation": "params[1] → 0x2b1EBdD51FD2e5f2406F655C7a3e94EaB9B338fE",
    "note": "",
    "rpc": "personal_sign",
    "baseline": {
      "method": "personal_sign",
      "params": [
        "0x48656c6c6f2c20576f726c6421",
        "0x1234567890123456789012345678901234567890"
      ]
    },
    "mutated": {
      "method": "personal_sign",
      "params": [
        "0x48656c6c6f2c20576f726c6421",
        "0x2b1EBdD51FD2e5f2406F655C7a3e94EaB9B338fE"
      ]
    }
  },
  {
    "id": 230,
    "mode": "corner",
    "strategy": "v14_lookalike_address",
    "seed": "v14_lookalike_address",
    "expectedResult": "X",
    "title": "首尾相似钓鱼地址 (corner)",
    "summary": "to 替换为 lookalike，UI 显示 Smart Contract Call",
    "mutation": "v14_lookalike_address",
    "note": "",
    "rpc": "eth_sendTransaction",
    "baseline": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0x17eed3ad6051F833A7D0Ccd0E5a973dFe4EBa702",
          "value": "0x0",
          "data": "0x"
        }
      ]
    },
    "mutated": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0x17ee88888888888888888888888888888888a702",
          "value": "0x0",
          "data": "0x"
        }
      ]
    }
  },
  {
    "id": 236,
    "mode": "corner",
    "strategy": "v10_corrupt_hex",
    "seed": "v10_corrupt_hex",
    "expectedResult": "X",
    "title": "corrupt hex 消息 (corner)",
    "summary": "消息应为不可读 hex，UI 显示 HelloWorld",
    "mutation": "v10_corrupt_hex",
    "note": "",
    "rpc": "personal_sign",
    "baseline": {
      "method": "personal_sign",
      "params": [
        "0x48656c6c6f2c20576f726c6421",
        "0x1234567890123456789012345678901234567890"
      ]
    },
    "mutated": {
      "method": "personal_sign",
      "params": [
        "0x48656c6c6f576f726c64",
        "0x1234567890123456789012345678901234567890"
      ]
    }
  },
  {
    "id": 280,
    "mode": "random",
    "strategy": "random_field",
    "seed": "v4_strip_0x",
    "expectedResult": "X",
    "title": "approve calldata 被截断破坏",
    "summary": "标准 approve data → 0x95daae，UI 仍显示 Approve",
    "mutation": "params[0].data → 0x95daae",
    "note": "",
    "rpc": "eth_sendTransaction",
    "baseline": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0x0987654321098765432109876543210987654321",
          "value": "0x0",
          "data": "0x095ea7b3000000000000000000000000abcdefabcdefabcdefabcdefabcdefabcdefabcd0000000000000000000000000000000000000000000000008ac7230489e80000"
        }
      ]
    },
    "mutated": {
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0x0987654321098765432109876543210987654321",
          "value": "0x0",
          "data": "0x95daae"
        }
      ]
    }
  }
];
