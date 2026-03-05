function v10_PersonalSignSwappedParamsFixture(address) {
    return {
        id: 'V10_PersonalSignSwappedParams',
        name: 'Personal Sign 参数顺序颠倒 (Personal Sign with Swapped Parameters)',
        method: 'personal_sign',
        params: [
            address,
            "0x4c6f67696e20746f2057616c6c6554727574680a"//如果钱包永远把第一个参数当做challenge，第二个参数当做地址，那么challenge会显示16进制地址而可读部分会显示16进制challenge，这样用户就很难分辨哪个是地址哪个是challenge了，攻击者可以利用这一点来诱导用户签名欺诈消息
        ]
    }}