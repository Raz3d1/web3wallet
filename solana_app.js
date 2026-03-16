// solana_app.js
// 目的：提供“Solana 专属”的测试按钮页，不依赖 window.ethereum.request。
// 你的自动化 agent/模型逻辑不变，只需要把测试 URL 指向 solana.html。

const logPanel = document.getElementById("log-panel");
const container = document.getElementById("test-container");

function sysLog(m) {
  logPanel.innerHTML += `<div>> ${new Date().toLocaleTimeString()}: ${m}</div>`;
  logPanel.scrollTop = logPanel.scrollHeight;
}

function getSolanaProvider() {
  // 通用：很多钱包注入 window.solana；Solflare 可能注入 window.solflare
  /** @type {any[]} */
  const candidates = [];
  if (window.solana) candidates.push(window.solana);
  if (window.solflare) candidates.push(window.solflare);

  for (const p of candidates) {
    if (!p) continue;
    // Solana provider 最基础能力：connect
    if (typeof p.connect === "function") return p;
  }
  return null;
}

function toBase64FromUtf8(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function randomAscii(n) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_:.@/ ";
  let out = "";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function buildSignMessagePayload(name) {
  // Solana 的 signMessage 一般接收 Uint8Array
  const msg =
    `[Solana Test] ${name}\n` +
    `time=${new Date().toISOString()}\n` +
    `nonce=${randomAscii(24)}\n` +
    `note=${randomAscii(64)}\n`;
  return new TextEncoder().encode(msg);
}

async function ensureConnected(provider) {
  try {
    // 部分钱包已经连接会直接返回
    const resp = await provider.connect();
    return resp?.publicKey?.toString?.() || provider.publicKey?.toString?.() || "";
  } catch (e) {
    sysLog("连接被拒绝或失败");
    return "";
  }
}

async function runSignMessage(name) {
  const provider = getSolanaProvider();
  if (!provider) {
    sysLog("错误: 当前钱包未注入 Solana Provider（window.solana / window.solflare 均不可用）。请确认是 Solana 钱包，且已开启 DApp 连接权限。");
    return;
  }

  const pubkey = await ensureConnected(provider);
  if (pubkey) sysLog(`钱包就绪: ${pubkey}`);

  const msgBytes = buildSignMessagePayload(name);
  sysLog(`触发 signMessage: ${name} (msg_b64=${toBase64FromUtf8(new TextDecoder().decode(msgBytes)).slice(0, 24)}...)`);
  try {
    if (typeof provider.signMessage !== "function") {
      sysLog("错误: 钱包不支持 signMessage");
      return;
    }
    await provider.signMessage(msgBytes, "utf8");
    sysLog("signMessage 已触发");
  } catch (err) {
    sysLog(`签名错误: ${err?.message || String(err)}`);
  }
}

async function runSignTransaction(name) {
  const provider = getSolanaProvider();
  if (!provider) {
    sysLog("错误: 当前钱包未注入 Solana Provider（window.solana / window.solflare 均不可用）。请确认是 Solana 钱包，且已开启 DApp 连接权限。");
    return;
  }

  const pubkey = await ensureConnected(provider);
  if (pubkey) sysLog(`钱包就绪: ${pubkey}`);

  // 这里不引入 @solana/web3.js，避免增加依赖；直接提示用户：
  // 大多数钱包在没有合法 Transaction 对象时会弹错/拒绝，这同样可用于测试“解析能力/风险提示”。
  sysLog(`触发 signTransaction: ${name}`);
  try {
    if (typeof provider.signTransaction !== "function") {
      sysLog("错误: 钱包不支持 signTransaction");
      return;
    }
    // 故意传入一个不完整对象，模拟“结构不规范/解析失败”场景
    // 不同钱包可能表现不同（弹错、拒绝、或无反应）
    await provider.signTransaction({} /* invalid tx */);
    sysLog("signTransaction 已触发");
  } catch (err) {
    sysLog(`交易签名错误: ${err?.message || String(err)}`);
  }
}

async function runSignAndSendTransaction(name) {
  const provider = getSolanaProvider();
  if (!provider) {
    sysLog("错误: 当前钱包未注入 Solana Provider（window.solana / window.solflare 均不可用）。请确认是 Solana 钱包，且已开启 DApp 连接权限。");
    return;
  }

  const pubkey = await ensureConnected(provider);
  if (pubkey) sysLog(`钱包就绪: ${pubkey}`);

  sysLog(`触发 signAndSendTransaction: ${name}`);
  try {
    if (typeof provider.signAndSendTransaction !== "function") {
      sysLog("错误: 钱包不支持 signAndSendTransaction");
      return;
    }
    await provider.signAndSendTransaction({} /* invalid tx */);
    sysLog("signAndSendTransaction 已触发");
  } catch (err) {
    sysLog(`发送错误: ${err?.message || String(err)}`);
  }
}

function _pickSolanaTriggerByName(name) {
  const t = (name || "").toLowerCase();
  // 更像“交易/授权/交互”的按钮，优先触发交易签名类（更接近钱包交易弹窗）
  const txHints = [
    "approve", "allowance", "permit", "seaport", "blur", "looksrare",
    "授权", "交易", "转账", "挂单", "订单", "permit", "nft",
    "危险地址", "钓鱼", "scam", "poison",
  ];
  if (txHints.some((k) => t.includes(k))) return "tx";
  // 其它更像纯签名/消息
  return "msg";
}

async function runCase(name) {
  const kind = _pickSolanaTriggerByName(name);
  if (kind === "tx") {
    // 优先 signAndSend（若钱包不支持会在内部提示），否则 fallback signTransaction
    const provider = getSolanaProvider();
    if (provider && typeof provider.signAndSendTransaction === "function") {
      await runSignAndSendTransaction(name);
      return;
    }
    await runSignTransaction(name);
    return;
  }
  await runSignMessage(name);
}

// 将 EVM 版的所有测试项“搬到” Solana 版：按钮名称/顺序保持一致，
// 但执行动作改为 Solana 的 signMessage / signTransaction / signAndSendTransaction。
const testSuite = [
  {
    vId: "V3",
    title: "危险的eth_sign (Dangerous eth_sign)",
    mutations: [
      { name: "危险的 eth_sign", run: () => runCase("危险的 eth_sign") },
      { name: "未解码的hex eth_sign", run: () => runCase("未解码的hex eth_sign") },
    ],
  },
  {
    vId: "V4",
    title: "非严格输入数据 (Non-rigorous Input Data)",
    mutations: [
      { name: "非严格输入数据", run: () => runCase("非严格输入数据") },
    ],
  },
  {
    vId: "V5",
    title: "授权风险 (Overlooked Approval)",
    mutations: [
      { name: "ERC20 授权 (Standard)", run: () => runCase("ERC20 授权 (Standard)") },
      { name: "ERC20 增加授权 (Standard)", run: () => runCase("ERC20 增加授权 (Standard)") },
      { name: "ERC20 无限授权 (Standard)", run: () => runCase("ERC20 无限授权 (Standard)") },
    ],
  },
  {
    vId: "V6",
    title: "无利所图的NFT挂单 (Unprofitable NFT Listings)",
    mutations: [
      { name: "Blur 挂单签名 (Blur Signature)", run: () => runCase("Blur 挂单签名 (Blur Signature)") },
      { name: "Blur 批量挂单签名 (Blur Bulk Signature)", run: () => runCase("Blur 批量挂单签名 (Blur Bulk Signature)") },
      { name: "Seaport1 订单签名 (Seaport Order Signature)", run: () => runCase("Seaport1 订单签名 (Seaport Order Signature)") },
      { name: "Seaport14 订单签名 (Seaport Order Signature)", run: () => runCase("Seaport14 订单签名 (Seaport Order Signature)") },
      { name: "LooksRare 订单签名 (LooksRare Order Signature)", run: () => runCase("LooksRare 订单签名 (LooksRare Order Signature)") },
    ],
  },
  {
    vId: "V7",
    title: "危险地址交互 (Dangerous Address)",
    mutations: [
      ...((window.__FIXTURE_DATA__?.V7_KnownDangerous_list?.list ?? []).map((item) => ({
        name: item.name,
        run: () => runCase(item.name),
      }))),
    ],
  },
  {
    vId: "V8",
    title: "欺诈性函数名 (Suspected Scams)",
    mutations: [
      ...((window.__FIXTURE_DATA__?.V8_SuspectedScam_list?.list ?? []).map((item) => ({
        name: item.name,
        run: () => runCase(item.name),
      }))),
    ],
  },
  {
    vId: "V9",
    title: "非预期的授权 (Unexpected Authorizations)",
    mutations: [
      { name: "合约与网络不一致的 Permit 签名 (Permit Signature with Mismatched Contract and Network)", run: () => runCase("合约与网络不一致的 Permit 签名 (Permit Signature with Mismatched Contract and Network)") },
      { name: "知名合约伪造的欺诈合约授权 (Fraudulent Contract Authorization Mimicking a Known Contract)", run: () => runCase("知名合约伪造的欺诈合约授权 (Fraudulent Contract Authorization Mimicking a Known Contract)") },
      { name: "Seaport 合约欺诈订单签名 (Seaport Contract Fraud Order Signature)", run: () => runCase("Seaport 合约欺诈订单签名 (Seaport Contract Fraud Order Signature)") },
      { name: "Seaport 跨链订单签名 (Seaport Cross-Chain Order Signature)", run: () => runCase("Seaport 跨链订单签名 (Seaport Cross-Chain Order Signature)") },
    ],
  },
  {
    vId: "V10",
    title: "不全面的personal_sign签名方法校验 (Inadequate personal_sign Validation)",
    mutations: [
      { name: "Personal Sign 挑战数据损坏 (Personal Sign with Corrupted Challenge)", run: () => runCase("Personal Sign 挑战数据损坏 (Personal Sign with Corrupted Challenge)") },
      { name: "Personal Sign 参数顺序颠倒 (Personal Sign with Swapped Parameters)", run: () => runCase("Personal Sign 参数顺序颠倒 (Personal Sign with Swapped Parameters)") },
    ],
  },
  {
    vId: "V14",
    title: "视觉显示与欺骗 (Visual Misleading)",
    mutations: [
      { name: "动态 API 首尾相似投毒", run: () => runCase("动态 API 首尾相似投毒") },
    ],
  },
];

async function init() {
  sysLog(">>> 正在启动 Solana 测试框架...");
  const provider = getSolanaProvider();
  if (!provider) {
    sysLog("提示: 未检测到 Solana Provider。请在 Solana 钱包内置浏览器中打开本页。");
  }

  testSuite.forEach((group) => {
    const section = document.createElement("div");
    section.className = "v-section";
    section.innerHTML = `<div class="v-title">${group.vId}: ${group.title}</div>`;

    const grid = document.createElement("div");
    grid.className = "mutation-grid";

    group.mutations.forEach((m) => {
      const btn = document.createElement("button");
      btn.className = "test-btn";
      btn.innerText = `▶ ${m.name}`;
      btn.onclick = async () => {
        sysLog(`正在触发: ${m.name}`);
        await m.run();
      };
      grid.appendChild(btn);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });

  sysLog("所有载体部署完毕");
}

window.addEventListener("load", init);

