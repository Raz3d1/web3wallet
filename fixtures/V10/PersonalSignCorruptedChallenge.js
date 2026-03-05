function v10_PersonalSignCorruptedChallengeFixture(address) {
    return {
        id: 'V10_PersonalSignCorruptedChallenge',
        name: 'Personal Sign 挑战数据损坏 (Personal Sign with Corrupted Challenge)',
        method: 'personal_sign',
        params: [
            "0x4c6f67696e20746f2057616c6",//截断的challenge（奇数），钱包是否提醒用户challenge异常
            address
        ]
    }}