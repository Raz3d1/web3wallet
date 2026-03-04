// fixtures/v7/KnownDangerous.js

/**
 * 通用的欺诈函数名变体生成器
 * @param {string} address - 当前连接的钱包地址 (from)
 * @param {string} to - 恶意合约地址
 * @param {string} name - 显示在按钮上的名称
 */
function v7_KnownDangerousGenerator(address, to, name) {
    return {
        id: `V7_${name.replace('()', '')}`,
        name: ` ${name}`,
        method: 'eth_sendTransaction',
        params: [{
            from: address,
            to: to,
            value: (0.01e18).toString(16) // 0.01 ETH 的 16 进制
        }]
    };
}