// app.js
//顶部的配置区
const testSuite = [
    {
        vId: "V3",
        title: "危险的eth_sign (Dangerous eth_sign)",
        mutations: [
            { name: "危险的 eth_sign", func: typeof v3_EthSignFixture !== 'undefined' ? v3_EthSignFixture : null },
            { name: "个人签名", func: typeof v3_PersonalSignFixture !== 'undefined' ? v3_PersonalSignFixture : null },
            { name: "未解码的hex eth_sign", func: typeof v3_HexEncodedHashFixture !== 'undefined' ? v3_HexEncodedHashFixture : null }
        ]
    },
    {
        vId: "V4",
        title: "非严格输入数据 (Non-rigorous Input Data)",
        mutations: [
            { name: "非严格输入数据", func: typeof v4_Non_rigorousInputdataFixture !== 'undefined' ? v4_Non_rigorousInputdataFixture : null }
        ]
    },
    {
        vId: "V5",
        title: "授权风险 (Overlooked Approval)",
        mutations: [
            { name: "ERC20 授权 (Standard)", func: typeof v5_ApproveFixture !== 'undefined' ? v5_ApproveFixture : null },
            { name: "ERC20 增加授权 (Standard)", func: typeof v5_IncreaseAllowanceFixture !== 'undefined' ? v5_IncreaseAllowanceFixture : null },
            { name: "ERC20 无限授权 (Standard)", func: typeof v5_SetApprovalForAllFixture !== 'undefined' ? v5_SetApprovalForAllFixture : null }
        ]
    },
    {
        vId: "V6",
        title: "无利所图的NFT挂单 (Unprofitable NFT Listings)",
        mutations: [
            { name: "Blur 挂单签名 (Blur Signature)", func: typeof v6_BlurFixture !== 'undefined' ? v6_BlurFixture : null },
            { name: "Blur 批量挂单签名 (Blur Bulk Signature)", func: typeof v6_BlurBulkFixture !== 'undefined' ? v6_BlurBulkFixture : null },
            { name: "Seaport 订单签名 (Seaport Order Signature)", func: typeof v6_Seaport1Fixture !== 'undefined' ? v6_Seaport1Fixture : null },
            { name: "Seaport 订单签名 (Seaport Order Signature)", func: typeof v6_Seaport14Fixture !== 'undefined' ? v6_Seaport14Fixture : null },
            { name: "LooksRare 订单签名 (LooksRare Order Signature)", func: typeof v6_LooksRareFixture !== 'undefined' ? v6_LooksRareFixture : null }
        ]
    },
    {
    vId: "V7",
    title: "危险地址交互 (Dangerous Address)",
    mutations: [
        // 替换为你从 ScamSniffer 获取的真实钓鱼地址
        { name: "ScamSniffer 标记钓鱼地址", func: (addr) => v7_KnownDangerousGenerator(addr, '0x164e84226882c385940134f5b292cb89bc4feed6', 'ScamSniffer 标记钓鱼地址') },
        // 替换为你从 Etherscan 获取的黑客地址
        { name: "Etherscan 标记黑客地址", func: (addr) => v7_KnownDangerousGenerator(addr, '0x057a3B930702c30E73c309b38A39fD54B468fD83', 'Etherscan 标记黑客地址') }
    ]
},
       {
        vId: "V8",
        title: "欺诈性函数名 (Suspected Scams)",
        mutations: [
            { 
                name: "SecurityUpdate()", 
                func: (addr) => v8_SuspectedScamGenerator(addr, '0x6d3F7b83bcec11381E81EC858Cc802B1A44f84E2', '0x5fba79f5', 'SecurityUpdate()') 
            },
            { 
                name: "ClaimRewards()", 
                func: (addr) => v8_SuspectedScamGenerator(addr, '0x10f9ec4181988b83d36a9df8ec87a73a3e27e4ac', '0x12798972', 'ClaimRewards()') 
            },
            { 
                name: "ClaimReward()", 
                func: (addr) => v8_SuspectedScamGenerator(addr, '0x00000f312c54d0dd25888ee9cdc3dee988700000', '0x9c9316c5', 'ClaimReward()') 
            },
            // 按照这个格式继续添加剩下的 Claim(), claim() 等项
            { 
                name: "Claim()", 
                func: (addr) => v8_SuspectedScamGenerator(addr, '0x0f56CcEB1A2dC1a598bb14d7121525dB2C05a7c5', '0x3158952e', 'Claim()') 
            },
            { 
                name: "claim()", 
                func: (addr) => v8_SuspectedScamGenerator(addr, '0x08915b57db78c0ff7e26b241820eede4b1badf2f', '0x4e71d92d', 'claim()') 
            },
            { 
                name: "NetworkMerge()", 
                func: (addr) => v8_SuspectedScamGenerator(addr, '0x00000f312c54d0dd25888ee9cdc3dee988700000', '0x9c9316c5', 'NetworkMerge()') 
            }
        ]
    },
    {
        vId: "V9",
        title: "授权风险 (Approval Risk)",
        mutations: [
            { name: "DAI Permit 离线授权", func: typeof DaiPermitFixture !== 'undefined' ? DaiPermitFixture : null },
            { name: "ERC20 无限授权 (Standard)", func: typeof SendEthFixture !== 'undefined' ? SendEthFixture : null }
        ]
    },
    {
        vId: "V10",
        title: "危险地址交互 (Dangerous Address)",
        mutations: [
            { name: "Revoke.cash 恶意转账样例", func: typeof SendEthFixture !== 'undefined' ? SendEthFixture : null }
        ]
    },
    {
    vId: "V13",
    title: "视觉显示与欺骗 (Visual Misleading)",
    mutations: [
        { 
            name: "动态 API 首尾相似投毒", 
            // 注意这里无需 await，直接把函数传进去，点击时才执行
            func: (addr) => typeof v13_DynamicPoisoningGenerator !== 'undefined' ? v13_DynamicPoisoningGenerator(addr) : null 
        }
    ]
}
    // 可以继续添加更多版本和测试项
];

const logPanel = document.getElementById('log-panel');
const container = document.getElementById('test-container');

function sysLog(m) {
    logPanel.innerHTML += `<div>> ${new Date().toLocaleTimeString()}: ${m}</div>`;
    logPanel.scrollTop = logPanel.scrollHeight;
}

// 检查函数是否加载成功
const availableTests = [];
if (typeof DaiPermitFixture !== 'undefined') availableTests.push(DaiPermitFixture);
if (typeof SendEthFixture !== 'undefined') availableTests.push(SendEthFixture);

async function init() {
    sysLog(">>> 正在启动扁平化测试框架...");
    const container = document.getElementById('test-container');
    let address = "0x0000000000000000000000000000000000000000";

    // 获取地址
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            address = accounts[0];
            sysLog(`钱包就绪: ${address}`);
        } catch (e) { sysLog("连接被拒绝"); }
    }

    // 渲染每一个 V 模块
    testSuite.forEach(group => {
        const section = document.createElement('div');
        section.className = 'v-section';
        
        // 渲染大标题 (V1, V2...)
        section.innerHTML = `<div class="v-title">${group.vId}: ${group.title}</div>`;
        
        const grid = document.createElement('div');
        grid.className = 'mutation-grid';

        // 渲染该分类下的所有子按钮
        // 渲染该分类下的所有子按钮
        group.mutations.forEach(m => {
            if (!m.func) return; // 跳过未定义的脚本
            
            const btn = document.createElement('button');
            btn.className = 'test-btn';
            btn.innerText = `▶ ${m.name}`;
            
            // 这里是全新且干净的点击事件逻辑
            btn.onclick = async () => {
                sysLog(`正在生成载体: ${m.name}，请稍候...`);
                
                // 执行外部的 func 函数，等待它生成 data
                const data = await m.func(address); 
                
                if (!data) {
                    sysLog(`错误: 载体生成失败，请检查控制台或网络`);
                    return; // 如果生成的是 null，直接退出
                }

                sysLog(`[${group.vId}] 触发: ${data.name || m.name}`);
                try {
                    await window.ethereum.request({ method: data.method, params: data.params });
                } catch (err) {
                    sysLog(`RPC 错误: ${err.message}`);
                }
            };
            
            grid.appendChild(btn);
        });

        section.appendChild(grid);
        container.appendChild(section);
    });
    sysLog("所有载体部署完毕");
}

window.addEventListener('load', init);