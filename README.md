# WalleTruth: Web3 Mobile Wallet Visual Fraud Testing Framework

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Web3](https://img.shields.io/badge/Web3-Security-success)
![Ethers.js](https://img.shields.io/badge/Ethers.js-v5.0-orange)

## 📌 项目简介 (Introduction)

**WalleTruth** 是一个专为评估 Web3 移动端钱包（如 Trust Wallet, Binance Web3 Wallet, MetaMask 等）**视觉安全与防欺诈能力**而设计的自动化测试框架。

在当前的 Web3 钓鱼攻击中，攻击者越来越多地利用移动端屏幕尺寸受限、复杂协议参数（如 EIP-712, Seaport, Blur）解析困难等“视觉盲区”来诱导用户进行“盲签”。本项目通过构建一个标准化的恶意 DApp 交互环境，系统性地复现了多种高危攻击载体，用于量化评估不同钱包在面对 UI 误导、跨链混淆和零对价挂单时的防御表现。

## 🎯 核心特性 (Key Features)

* **多维度的攻击载体模拟**：内置从基础的 `eth_sign` 到高级的 Seaport 1.4 批量挂单（Bulk Order）等多种真实黑产钓鱼手法。
* **深度的协议覆盖**：针对 ERC20 (Approve/Permit) 和 ERC721 (SetApprovalForAll/Seaport/Blur) 资产授权协议的结构化签名（EIP-712）缺陷测试。
* **自动化触发面板**：基于原生 HTML/JS 和 `ethers.js` 构建，适配移动端浏览器，支持一键唤起钱包进行实机安全测试。
* **视觉欺诈评估（Visual Deception Testing）**：专注测试 UI 层面对“危险函数”、“极低/零对价（Zero Consideration）”、“跨链域欺骗（Domain Confusion）”的预警能力。

## 📂 目录结构 (Directory Structure)

```text
web3wallet/
├── index.html          # 测试框架前端入口（移动端适配）
├── app.js              # 核心交互逻辑与钱包连接模块
├── ethers.js           # Web3 交互基础库
└── fixtures/           # 攻击载体（Test Cases）库
    ├── V3/             # 危险的原始签名测试 (eth_sign, personal_sign 乱码)
    ├── V5/             # 传统授权劫持 (Approve, IncreaseAllowance)
    ├── V6/             # 无利所图的 NFT 挂单 (Seaport 1/1.4, Blur Bulk, LooksRare)
    ├── V7/             # 已知危险地址/黑客地址交互拦截测试
    ├── V8/             # 欺诈性函数名与 ABI 伪造
    ├── V9/             # 离线签名与跨链重放授权 (Permit, PermitForAll)
    ├── V10/            # EIP-712 参数篡改与错位验证
    └── V14/            # 主网动态参数投毒
