# WalleTruth · Web3 移动钱包界面欺诈测试框架

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Web3](https://img.shields.io/badge/Web3-Security-success)
![Ethers.js](https://img.shields.io/badge/Ethers.js-v5.0-orange)
![No Build](https://img.shields.io/badge/build-none%20%2F%20static-brightgreen)

**在线实例**：<https://web3wallet.imzhzhuoli.workers.dev/>

---

## 📌 项目简介

**WalleTruth** 是一套面向 Web3 移动端钱包（Trust Wallet、Bitget Wallet、Binance Web3 Wallet 等）的
**预授权界面（pre-authorization UI）安全评估框架**。

移动端钱包在用户点「确认」之前，会先把这笔请求渲染成一张确认页：调用什么合约、授权多少额度、
转给谁、有没有风险提示。用户对这页面的信任，就是整个 Web3 授权体系的安全边界。
本项目要回答的问题是：**这页面说的是不是真的。**

与「钓鱼站点仿冒」不同，这里研究的是**请求本身合法、签约界面却给出了错误或缺失的信息**这一类问题：

- 界面显示「授权」，链上实际执行的是「转账」；
- 界面只剩一句「Contract Interaction」，函数、金额、收款方全部丢失；
- 一份报文里同时塞 `data` 和 `input`，钱包读一个、节点读另一个；
- 删除 `0x` 前缀或改成大写，钱包就解析不出函数名，界面退化成通用模板。

框架把这些手法做成可复现的测试载体，通过一个标准 DApp 向真机钱包发请求，采集界面表现，
并在本地 fork 链上重放同一份报文、采集真实的链上效果，从而把「界面看起来不对」
判定为「链上确实如此」。

---

## ✨ 核心能力

| 能力 | 说明 |
|---|---|
| **攻击载体库** | `fixtures/` 下按 V3–V14 分组的签名 / 授权 / 挂单类载体，覆盖 `eth_sign`、`personal_sign`、ERC-20 `approve`、ERC-721 `setApprovalForAll`、Seaport / Blur 批量挂单、EIP-712 Permit 等 |
| **注入式采集** | `wallet_fuzzer_puppet.js` 拦截 `window.ethereum`，把 DApp 与钱包之间的每一次请求/响应完整落盘，不依赖抓包 |
| **界面采集面板** | `fuzz.html` 播放载体、收集截图与界面文本，经 WebSocket 回传 PC 端 |
| **RPC 支持度扫描** | `rpc_support_scanner.js` + `rpc_support_catalog.js`，统计各钱包对 RPC 方法的支持与返回差异 |
| **上链复核** | `onchain.html` + `onchain_data.js`，把判定为 X 的请求在本地 fork 链上真实执行，采 receipt 与状态变化，与界面模拟结果对照 |
| **零构建** | 纯原生 HTML/CSS/JS，仓库根目录即站点根目录，可直接静态托管 |

---

## 📂 目录结构

```text
web3wallet/
├── index.html                    # 入口页：连接钱包 / 选择测试模块
├── app.js                        # index 的交互与钱包连接逻辑
├── ethers.js                     # Web3 交互基础库（v5）
│
├── fuzz.html                     # 界面采集面板（配合 puppet 与 PC 端 WS）
├── wallet_fuzzer_puppet.js       # 注入式 puppet：拦截 window.ethereum，记录全部 RPC 交互
├── wallet_fuzzer_puppet.ts       # 同一 puppet 的 TypeScript 源
├── example_puppet_dapp.html      # puppet 用法示例
├── dapp_rpc_log.js               # DApp 侧 RPC 日志工具
├── fuzzer_backend_example.py     # PC 端 WebSocket 后端示例（接收采集数据）
│
├── onchain.html                  # 上链测试页：重发 Rp/Rm、采链接收据、出判定
├── onchain_data.js               # 上链测试数据集（判定为 X 的用例 + 截图索引）
│
├── rpc_capture.html              # 真实 RPC 捕获页
├── rpc_capture.js
├── rpc_support_scanner.js        # RPC 方法支持度扫描器
├── rpc_support_catalog.js        # 扫描结果目录（各钱包 / 各方法）
├── generate_rpc_support_catalog.js
├── validate_rpc_support_scanner.js
├── random1_validate.html         # 随机抽样复核页
│
├── solana.html                   # Solana 侧测试页
├── solana_app.js
│
├── BinanceDappFixtures.js        # Binance Web3 相关载体
├── fixtures/                     # 攻击载体库（按版本分组）
│   ├── V3/   原始签名 / 乱码签名
│   ├── V4/   基础调用与参数
│   ├── V5/   approve / increaseAllowance 授权劫持
│   ├── V6/   Seaport / Blur / LooksRare 零对价挂单
│   ├── V7/   危险地址交互
│   ├── V8/   函数名与 ABI 伪造
│   ├── V9/   Permit / PermitForAll 离线授权
│   ├── V10/  EIP-712 参数篡改与错位验证
│   ├── V11/  扩展签名场景
│   ├── V13/  补充载体
│   └── V14/  主网动态参数投毒
├── fixtures-data/                # fixtures 的打包版本（V3–V14 的 .js 分片）
└── dynamic_rpc/                  # 动态 RPC 端点页面（独立子模块）
```

---

## 🚀 快速开始

### 在线使用

直接访问 <https://web3wallet.imzhzhuoli.workers.dev/>，在手机钱包的 DApp 浏览器里打开即可。

### 本地起服务

仓库没有构建步骤，任意静态服务器都能跑：

```bash
python -m http.server 8080
# 然后访问 http://127.0.0.1:8080/
```

> 注意：`window.ethereum` 只在钱包内置浏览器里注入。普通桌面浏览器打开时，
> 上链测试页可用 `?mockwallet=1` 走内置的假 provider 预览界面。

---

## 🧪 上链测试页（onchain.html）

这一页把「判定为 X 的用例」重新发一次，用链上结果反证界面的说法。

### 数据来源

`onchain_data.js` 内置 **229 条**被判定为 X 的用例（Trust Wallet 111 + Bitget Wallet 118），
每条包含父请求 `Rp`、变异请求 `Rm`、两张界面截图以及预判结果。

### URL 参数

| 参数 | 作用 | 示例 |
|---|---|---|
| `case` | 直接打开某条用例 | `?case=t0332` |
| `wallet` | 只显示某个钱包 | `?wallet=bitget` |
| `filter` | 打开全部用例（默认只显示变异引入的） | `?filter=all` |
| `nows` | 不连接 PC 端 WebSocket，页面独立工作 | `?nows=1` |
| `mockwallet` | 注入假 provider，桌面浏览器也能预览 | `?mockwallet=1` |
| `mode` | 发送模式：`live` 真发、`dry_run` 只估算 | `?mode=live` |
| `autosend` | 自动触发发送（`rp` / `rm`），便于自动化 | `?autosend=rp` |
| `rpc` | 指定 RPC 地址（用于自检与直连模式） | `?rpc=https://…` |
| `alignchain` | 发送前把请求里的 `chainId` 对齐到当前链 | `?alignchain=1` |
| `chainid` | 指定目标 chainId（切链按钮使用） | `?chainid=1337` |
| `direct` | 直连模式：跳过钱包，页面自己把交易打到 RPC | `?direct=1` |

### 页面里能做什么

- 左侧按钱包分组浏览用例，右侧并排展示 `Rp` / `Rm` 报文与对应界面截图；
- 一键「发送 Rp / 发送 Rm」，走 `window.ethereum` 唤起钱包确认；
- 顶部「链」徽标显示当前连接链与 client 版本，用来确认钱包是否真的连上了自建链；
- 「自检 RPC」「切到 Fork」「添加网络」「充值」四个按钮，用于把钱包接入本地 fork 链；
- 底部「上链结果」表与「上链判定」四格（请求真值 / 钱包声明 / 链上效果 / 判定）。

### 与本地 fork 链配合

```bash
# 1. 起一条主网上 fork（chainId 可任意，避开钱包内置链库）
anvil --fork-url https://eth.drpc.org --chain-id 1337 --port 8545 --host 0.0.0.0

# 2. 通过 HTTPS 隧道暴露给手机（钱包会拒绝明文 HTTP 与不可达节点）
cloudflared tunnel --url http://localhost:8545

# 3. 在钱包里添加该自定义网络，或在页面上点「添加网络」由 DApp 发起
```

---

## 📊 判定口径

### 一次判定（模型判定）

| 等级 | 含义 |
|---|---|
| `X` | 界面与请求真值不符（语义欺诈） |
| `O` | 界面清晰无歧义 |
| `!1` | 严格警告（黄色/风险提示） |
| `!2` | 弹窗警告 |
| `!3` | 默认拒绝 |
| `!4` | 直接闪退 |
| `=` | 基线与变异界面文本一致（无差异） |

### 二次判定（链上复核）

只处理一次判定为 `X` 的 `Rm`：把 `Rm` 与其对应的 `Rp` 分别放到本地 fork 链上真实执行一遍，
记录链上执行了哪些操作、余额与授权额度如何变化；再对照三组来源——`Rp_hints`（父请求真值）、
`Rm_hints`（变异请求真值）、钱包模拟界面的记录——逐项与链上结果比对。

- 链上结果与钱包模拟界面不一致的 `Rm` → 聚合为**攻击向量**；
- 无法真实上链的 `Rm` → 排除；
- 同样的不一致出现在 `Rp` 上 → 归为**钱包解析能力缺陷**（请求本身合法，钱包已显示不全）。

据此区分两类误导：**语义错配**（界面呈现与链上执行不是同一件事）与
**确定性伪装**（把无法判定的内容呈现为确定的正常操作，使用户失去必要提示）。

---

## 🖥️ 与 PC 端配合

界面采集与上链测试都可以脱离 PC 端独立运行（`?nows=1`），但完整流水线需要 PC 侧配合：

| 组件 | 作用 |
|---|---|
| `fuzzer_backend_example.py` | WebSocket 服务端示例，接收页面回传的请求/界面/截图数据 |
| PC 端流水线（未包含在本仓库） | 变异生成、采集调度、判定模型与规则引擎 |
| `anvil` + `cloudflared` | 本地 fork 链与公网隧道 |

页面与 PC 端通过 WebSocket 通信（默认端口 `8765`），也可以用 `?ws=` 指定地址。

---

## 🌐 部署

仓库**没有构建流程**，根目录即站点根目录，可直接托管到 Cloudflare Pages / Workers、Vercel、GitHub Pages 等：

- 构建命令：留空
- 输出目录：`/`
- 站点入口：`index.html`

若使用 Cloudflare Pages，注意保持**扁平目录**：`index.html`、`fuzz.html`、`onchain.html`、
`onchain_data.js` 等文件需直接位于仓库根目录。

---

## ⚠️ 已知限制

- **自定义链限制**：Trust Wallet / Bitget Wallet 的 DApp 浏览器只认内置链白名单，
  对自定义 `chainId` 返回 `unrecognized chain ID` 或 `-32603`，请求无法到达自建 RPC。
  因此「钱包发起交易」这一环在真机上不可行，上链复核改为 PC 侧直接投递同报文。
- **签名类无法上链**：`eth_sign`、`eth_signTypedData*` 的产物是签名而非交易，
  除非目标合约支持消费（如 `permit`），否则没有链上效果，只能做签名内容与恢复地址校验。
- **fork 状态是构造的**：余额与持仓由作弊码写入，与真实钱包不同，
  「余额不足」类结果不代表原钱包行为。
- **事件 ≠ 危害**：没有事件不代表无害，可能写入了合约内部状态，需存储 diff 才能断言。

---

## 📄 免责声明

本项目仅用于**授权的安全研究与教学**：在自己控制的设备与本地链上复现问题、验证钱包的防御能力。

请勿将本仓库中的任何载体用于对未授权目标的攻击、诱导他人签名或任何形式的资金窃取。
使用者需自行承担因滥用产生的全部法律责任。

---

## 📜 License

MIT
