//// app.js
//顶部的配置区
const testSuite = [
    {
        vId: "V3",
        title: "危险的eth_sign (Dangerous eth_sign)",
        mutations: [
            { name: "危险的 eth_sign", func: typeof v3_EthSignFixture !== 'undefined' ? v3_EthSignFixture : null },
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
            { name: "Seaport1 订单签名 (Seaport Order Signature)", func: typeof v6_Seaport1Fixture !== 'undefined' ? v6_Seaport1Fixture : null },
            { name: "Seaport14 订单签名 (Seaport Order Signature)", func: typeof v6_Seaport14Fixture !== 'undefined' ? v6_Seaport14Fixture : null },
            { name: "LooksRare 订单签名 (LooksRare Order Signature)", func: typeof v6_LooksRareFixture !== 'undefined' ? v6_LooksRareFixture : null }
        ]
    },
    {
    vId: "V7",
    title: "危险地址交互 (Dangerous Address)",
    mutations: [
        ...(window.__FIXTURE_DATA__?.V7_KnownDangerous_list?.list ?? []).map((item) => ({
            name: item.name,
            func: (addr) => v7_KnownDangerousGenerator(addr, item.to, item.name)
        }))
    ]
},
       {
        vId: "V8",
        title: "欺诈性函数名 (Suspected Scams)",
        mutations: [
            ...(window.__FIXTURE_DATA__?.V8_SuspectedScam_list?.list ?? []).map((item) => ({
                name: item.name,
                func: (addr) => v8_SuspectedScamGenerator(addr, item.to, item.selector, item.name)
            }))
        ]
    },
    {
        vId: "V9",
        title: "非预期的授权 (Unexpected Authorizations)",
        mutations: [
            { name: "合约与网络不一致的 Permit 签名 (Permit Signature with Mismatched Contract and Network)", func: typeof v9_PermitFixture !== 'undefined' ? v9_PermitFixture : null },
            { name: "知名合约伪造的欺诈合约授权 (Fraudulent Contract Authorization Mimicking a Known Contract)", func: typeof v9_PermitForAllFixture !== 'undefined' ? v9_PermitForAllFixture : null },
            { name: "Seaport 合约欺诈订单签名 (Seaport Contract Fraud Order Signature)", func: typeof v9_Seaport1_2Fixture !== 'undefined' ? v9_Seaport1_2Fixture : null },
            { name: "Seaport 跨链订单签名 (Seaport Cross-Chain Order Signature)", func: typeof v9_Seaport1_1Fixture !== 'undefined' ? v9_Seaport1_1Fixture : null }
        ]
    },
    {
        vId: "V10",
        title: "不全面的personal_sign签名方法校验 (Inadequate personal_sign Validation)",
        mutations: [
            { name: "Personal Sign 挑战数据损坏 (Personal Sign with Corrupted Challenge)", func: typeof v10_PersonalSignCorruptedChallengeFixture !== 'undefined' ? v10_PersonalSignCorruptedChallengeFixture : null },
            { name: "Personal Sign 参数顺序颠倒 (Personal Sign with Swapped Parameters)", func: typeof v10_PersonalSignSwappedParamsFixture !== 'undefined' ? v10_PersonalSignSwappedParamsFixture : null }
        ]
    },
    {
        vId: "V11",
        title: "Binance 特供版 (Native DApp Bridge 探测)",
        mutations: [
            { name: "requestAccounts", func: typeof v11_RequestAccountsFixture !== "undefined" ? v11_RequestAccountsFixture : null },
            { name: "requestAccounts (full model)", func: typeof v11_RequestAccountsFullFixture !== "undefined" ? v11_RequestAccountsFullFixture : null },
            { name: "signTransaction", func: typeof v11_SignTransactionFixture !== "undefined" ? v11_SignTransactionFixture : null },
            { name: "eth_signTransaction (EIP1193)", func: typeof v11_EIP1193_EthSignTransactionFixture !== "undefined" ? v11_EIP1193_EthSignTransactionFixture : null },
            { name: "signRawTransaction", func: typeof v11_SignRawTransactionFixture !== "undefined" ? v11_SignRawTransactionFixture : null },
            { name: "ecRecover", func: typeof v11_EcRecoverFixture !== "undefined" ? v11_EcRecoverFixture : null },
            { name: "addEthereumChain", func: typeof v11_AddEthereumChainFixture !== "undefined" ? v11_AddEthereumChainFixture : null },
            { name: "wallet_switchEthereumChain", func: typeof v11_EIP1193_SwitchChainFixture !== "undefined" ? v11_EIP1193_SwitchChainFixture : null },
            { name: "wallet_watchAsset", func: typeof v11_EIP1193_WatchAssetFixture !== "undefined" ? v11_EIP1193_WatchAssetFixture : null },
            { name: "eth_accounts (EIP1193)", func: typeof v11_EIP1193_AccountsFixture !== "undefined" ? v11_EIP1193_AccountsFixture : null },
            { name: "common_json_rpc eth_chainId", func: typeof v11_CommonJsonRpcEthChainIdFixture !== "undefined" ? v11_CommonJsonRpcEthChainIdFixture : null }
        ]
    },
    {
    vId: "V14",
    title: "视觉显示与欺骗 (Visual Misleading)",
    mutations: [
        { 
            name: "动态 API 首尾相似投毒", 
            // 注意这里无需 await，直接把函数传进去，点击时才执行
            func: (addr) => typeof v14_MainnetDynamicPoisoningGenerator !== 'undefined' ? v14_MainnetDynamicPoisoningGenerator(addr) : null 
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
        group.mutations.forEach(m => {
            if (!m.func) return; // 跳过未定义的脚本
            
            const btn = document.createElement('button');
            btn.className = 'test-btn';
            btn.innerText = `▶ ${m.name}`;
            
            // 这里是全新且干净的点击事件逻辑
            btn.onclick = async () => {
                sysLog(`正在生成载体: ${m.name}，请稍候...`);

                let data = null;
                try {
                    // 执行外部的 func 函数，等待它生成 data
                    data = await m.func(address);
                } catch (e) {
                    const msg = (e && e.message) ? e.message : String(e);
                    sysLog(`载体生成异常: ${msg}`);
                    return;
                }
                
                if (!data) {
                    sysLog(`错误: 载体生成失败，请检查控制台或网络`);
                    return; // 如果生成的是 null，直接退出
                }

                sysLog(`[${group.vId}] 触发: ${data.name || m.name}`);
                try {
                    const provider = window.ethereum;
                    if (!provider || typeof provider.request !== "function") {
                        sysLog("错误: 当前钱包未注入 EVM Provider（window.ethereum.request 不存在）。该钱包可能不是 EVM 钱包，或未开启 DApp/以太坊兼容模式。");
                        return;
                    }
                    await provider.request({ method: data.method, params: data.params });
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