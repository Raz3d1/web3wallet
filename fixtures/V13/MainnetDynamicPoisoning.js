// fixtures/v13/MainnetDynamicPoisoning.js

async function v13_MainnetDynamicPoisoningGenerator(address) {
    // 切换为以太坊主网 (Mainnet) 的 Etherscan API
    const apiKey = 'E5KWDCYQ1W9JQZ8V1MC192RXDX4YXASGSW'; 
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`;

    try {
        console.log(">>> 正在从以太坊主网拉取近期交易记录...");
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "1" || data.result.length === 0) {
            throw new Error("主网 API 错误或该账号没有任何历史交易");
        }

        // 寻找最近一次对外的真实转账地址
        let targetAddress = null;
        for (let tx of data.result) {
            if (tx.from.toLowerCase() === address.toLowerCase() && tx.to !== "") {
                targetAddress = tx.to;
                break;
            }
        }

        if (!targetAddress) throw new Error("没有找到对外的历史转账记录");

        // 核心：模拟算力碰撞（首尾相似）
        const prefix = targetAddress.slice(0, 6);
        const suffix = targetAddress.slice(-4);
        const fakeMiddle = "8".repeat(32); 
        const spoofedAddress = prefix + fakeMiddle + suffix;

        console.log(`🔍 真实主网历史地址: ${targetAddress}`);
        console.log(`☠️ 伪造的钓鱼投毒地址: ${spoofedAddress}`);

        return {
            id: 'V13_Mainnet_Poisoning',
            name: `主网动态投毒 (${prefix}...${suffix})`,
            method: 'eth_sendTransaction',
            params: [{
                from: address,
                to: spoofedAddress,
                value: "0x0" // 零金额转账投毒
            }]
        };

    } catch (error) {
        console.error("生成主网投毒载体失败:", error.message);
        return null;
    }

}
