// fixtures/v8/SuspectedScam.js

/**
 * 通用的欺诈函数名变体生成器
 * @param {string} address - 当前连接的钱包地址 (from)
 * @param {string} to - 恶意合约地址
 * @param {string} selector - 欺诈性的函数选择器 (如 SecurityUpdate 的 hash)
 * @param {string} name - 显示在按钮上的名称
 */
function v8_SuspectedScamGenerator(address, to, selector, name) {
    return {
        id: `V8_${name.replace('()', '')}`,
        name: `欺诈调用: ${name}`,
        method: 'eth_sendTransaction',
        params: [{
            from: address,
            to: to,
            data: selector,
            value: (0.01e18).toString(16) // 0.01 ETH 的 16 进制
        }]
    };
}