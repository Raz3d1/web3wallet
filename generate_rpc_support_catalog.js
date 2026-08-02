/* 根据两份规范化 JSON 生成浏览器可直接加载的 RPC 目录。 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = __dirname;
const sourceFiles = {
  ethereum: path.join(root, "docx", "RPC", "01_Ethereum_Execution_APIs.json"),
  metamask: path.join(root, "docx", "RPC", "02_MetaMask_Wallet_APIs.json")
};

const categories = {
  "调试、测试与交易池接口": [
    "debug_getBadBlocks", "debug_getRawBlock", "debug_getRawBlockAccessList",
    "debug_getRawHeader", "debug_getRawReceipts", "debug_getRawTransaction",
    "testing_buildBlockV1", "txpool_content", "txpool_contentFrom", "txpool_status"
  ],
  "正式交易接口": [
    "eth_sendRawTransaction", "eth_sendTransaction", "wallet_sendCalls"
  ],
  "Engine API（共识层/执行层内部通信）": [
    "engine_exchangeCapabilities", "engine_exchangeTransitionConfigurationV1",
    "engine_forkchoiceUpdatedV1", "engine_forkchoiceUpdatedV2",
    "engine_forkchoiceUpdatedV3", "engine_forkchoiceUpdatedV4", "engine_getBlobsV1",
    "engine_getBlobsV2", "engine_getBlobsV3", "engine_getBlobsV4",
    "engine_getPayloadBodiesByHashV1", "engine_getPayloadBodiesByHashV2",
    "engine_getPayloadBodiesByRangeV1", "engine_getPayloadBodiesByRangeV2",
    "engine_getPayloadV1", "engine_getPayloadV2", "engine_getPayloadV3",
    "engine_getPayloadV4", "engine_getPayloadV5", "engine_getPayloadV6",
    "engine_newPayloadV1", "engine_newPayloadV2", "engine_newPayloadV3",
    "engine_newPayloadV4", "engine_newPayloadV5"
  ],
  "链上数据查询与只读接口": [
    "eth_blockNumber", "eth_getBalance", "eth_getBlockAccessList",
    "eth_getBlockByHash", "eth_getBlockByNumber", "eth_getBlockReceipts",
    "eth_getBlockTransactionCountByHash", "eth_getBlockTransactionCountByNumber",
    "eth_getCode", "eth_getProof", "eth_getStorageAt", "eth_getStorageValues",
    "eth_getTransactionByBlockHashAndIndex", "eth_getTransactionByBlockNumberAndIndex",
    "eth_getTransactionByHash", "eth_getTransactionCount", "eth_getTransactionReceipt",
    "eth_getUncleCountByBlockHash", "eth_getUncleCountByBlockNumber"
  ],
  "交易模拟、Gas 估算与交易准备": [
    "eth_blobBaseFee", "eth_call", "eth_createAccessList", "eth_estimateGas",
    "eth_feeHistory", "eth_gasPrice", "eth_maxPriorityFeePerGas", "eth_simulateV1"
  ],
  "过滤器、订阅与事件监听": [
    "eth_getFilterChanges", "eth_getFilterLogs", "eth_getLogs", "eth_newBlockFilter",
    "eth_newFilter", "eth_newPendingTransactionFilter", "eth_subscribe",
    "eth_uninstallFilter", "eth_unsubscribe"
  ],
  "签名、加密与密钥相关接口": [
    "eth_decrypt", "eth_getEncryptionPublicKey", "eth_sign", "eth_signTransaction",
    "eth_signTypedData_v4", "personal_sign"
  ],
  "钱包账户、权限、网络、资产与交互管理": [
    "eth_accounts", "eth_requestAccounts", "wallet_addEthereumChain",
    "wallet_getCallsStatus", "wallet_getCapabilities", "wallet_getPermissions",
    "wallet_registerOnboarding", "wallet_requestPermissions", "wallet_revokePermissions",
    "wallet_scanQRCode", "wallet_switchEthereumChain", "wallet_watchAsset"
  ],
  "客户端/网络状态与能力查询": [
    "eth_capabilities", "eth_chainId", "eth_coinbase", "eth_config", "eth_syncing",
    "net_version", "web3_clientVersion"
  ]
};

const categoryByMethod = new Map();
Object.entries(categories).forEach(([category, methods]) => {
  methods.forEach((method) => {
    if (categoryByMethod.has(method)) throw new Error(`重复分类：${method}`);
    categoryByMethod.set(method, category);
  });
});

const transactionMethods = new Set(categories["正式交易接口"]);
const signatureMethods = new Set(categories["签名、加密与密钥相关接口"]);
const interactiveMethods = new Set([
  "eth_requestAccounts", "wallet_addEthereumChain", "wallet_registerOnboarding",
  "wallet_requestPermissions", "wallet_revokePermissions", "wallet_scanQRCode",
  "wallet_switchEthereumChain", "wallet_watchAsset"
]);
const internalCategories = new Set([
  "调试、测试与交易池接口",
  "Engine API（共识层/执行层内部通信）",
  "过滤器、订阅与事件监听"
]);

function riskLevel(method, category) {
  if (transactionMethods.has(method)) return "transaction";
  if (signatureMethods.has(method)) return "signature";
  if (interactiveMethods.has(method)) return "interactive";
  if (internalCategories.has(category)) return "internal";
  return "safe";
}

function readMethods(file) {
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(document.methods)) throw new Error(`${file} 缺少 methods 数组`);
  return document.methods.map((method) => method.name);
}

const sourceMethods = Object.fromEntries(
  Object.entries(sourceFiles).map(([source, file]) => [source, readMethods(file)])
);
const allMethods = Array.from(new Set([
  ...sourceMethods.ethereum,
  ...sourceMethods.metamask
])).sort();

if (allMethods.length !== 99) throw new Error(`并集应为 99，实际为 ${allMethods.length}`);
if (categoryByMethod.size !== 99) throw new Error(`分类应覆盖 99，实际为 ${categoryByMethod.size}`);

const missing = allMethods.filter((method) => !categoryByMethod.has(method));
const extra = Array.from(categoryByMethod.keys()).filter((method) => !allMethods.includes(method));
if (missing.length || extra.length) {
  throw new Error(`分类与源不一致；缺失=${missing.join(",")}；多余=${extra.join(",")}`);
}

const catalog = allMethods.map((method) => {
  const category = categoryByMethod.get(method);
  return {
    method,
    sources: Object.keys(sourceMethods).filter((source) => sourceMethods[source].includes(method)),
    category,
    riskLevel: riskLevel(method, category),
    // 统一使用故意畸形的哨兵参数；任何高风险方法都没有有效交易、签名或改链负载。
    probeParams: [{ __rpcSupportProbe: "invalid-params-only" }]
  };
});

const output = [
  "/* 本文件由 generate_rpc_support_catalog.js 从两份规范化 JSON 生成，请勿手工维护方法列表。 */",
  "(function (global) {",
  '  "use strict";',
  `  global.RPC_SUPPORT_CATALOG = Object.freeze(${JSON.stringify(catalog, null, 2)}.map(function (entry) {`,
  "    Object.freeze(entry.sources);",
  "    Object.freeze(entry.probeParams);",
  "    return Object.freeze(entry);",
  "  }));",
  "})(window);",
  ""
].join("\n");

fs.writeFileSync(path.join(root, "rpc_support_catalog.js"), output, "utf8");
console.log(JSON.stringify({
  ethereum: new Set(sourceMethods.ethereum).size,
  metamask: new Set(sourceMethods.metamask).size,
  intersection: sourceMethods.ethereum.filter((method) => sourceMethods.metamask.includes(method)).length,
  union: catalog.length,
  categories: Object.keys(categories).length
}));
