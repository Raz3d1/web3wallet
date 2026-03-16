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

const testSuite = [
  {
    vId: "S1",
    title: "危险/混淆签名 (Solana SignMessage)",
    mutations: [
      { name: "SignMessage: 随机挑战字符串", run: () => runSignMessage("随机挑战字符串") },
      { name: "SignMessage: 伪装成网站登录确认", run: () => runSignMessage("伪装成网站登录确认") },
    ],
  },
  {
    vId: "S2",
    title: "交易签名解析能力 (Solana signTransaction)",
    mutations: [
      { name: "signTransaction: 非法交易对象(解析失败)", run: () => runSignTransaction("非法交易对象(解析失败)") },
    ],
  },
  {
    vId: "S3",
    title: "发送交易解析能力 (Solana signAndSendTransaction)",
    mutations: [
      { name: "signAndSend: 非法交易对象(解析失败)", run: () => runSignAndSendTransaction("非法交易对象(解析失败)") },
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

