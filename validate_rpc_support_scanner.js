"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const source = {
  ethereum: JSON.parse(fs.readFileSync(path.join(root, "docx", "RPC", "01_Ethereum_Execution_APIs.json"), "utf8")),
  metamask: JSON.parse(fs.readFileSync(path.join(root, "docx", "RPC", "02_MetaMask_Wallet_APIs.json"), "utf8"))
};
const sourceSets = Object.fromEntries(Object.entries(source).map(([name, value]) => [
  name, new Set(value.methods.map((method) => method.name))
]));

const catalogContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "rpc_support_catalog.js"), "utf8"), catalogContext);
const catalog = catalogContext.window.RPC_SUPPORT_CATALOG;
const methods = new Set(catalog.map((entry) => entry.method));
const union = new Set([...sourceSets.ethereum, ...sourceSets.metamask]);

assert.strictEqual(sourceSets.ethereum.size, 78);
assert.strictEqual(sourceSets.metamask.size, 52);
assert.strictEqual([...sourceSets.ethereum].filter((method) => sourceSets.metamask.has(method)).length, 31);
assert.strictEqual(catalog.length, 99);
assert.strictEqual(methods.size, 99);
assert.deepStrictEqual([...methods].sort(), [...union].sort());
assert.strictEqual(new Set(catalog.map((entry) => entry.category)).size, 9);

catalog.forEach((entry) => {
  const expected = [];
  if (sourceSets.ethereum.has(entry.method)) expected.push("ethereum");
  if (sourceSets.metamask.has(entry.method)) expected.push("metamask");
  assert.deepStrictEqual(Array.from(entry.sources), expected, `sources 错误：${entry.method}`);
  assert.deepStrictEqual(
    JSON.parse(JSON.stringify(entry.probeParams)),
    [{ __rpcSupportProbe: "invalid-params-only" }],
    `探测参数不是统一无效哨兵：${entry.method}`
  );
});

const scannerContext = {
  window: {},
  document: { readyState: "loading", addEventListener() {} },
  Set, Map, Promise, Number, Object, Array, String, Date, JSON, Blob: function () {},
  URL: {}, setTimeout, clearTimeout
};
scannerContext.window.window = scannerContext.window;
scannerContext.window.document = scannerContext.document;
const scannerSource = fs.readFileSync(path.join(root, "rpc_support_scanner.js"), "utf8");
vm.runInNewContext(scannerSource, scannerContext);
const classify = scannerContext.window.RpcSupportScannerUtils.classifyRpcOutcome;
const safeStringify = scannerContext.window.RpcSupportScannerUtils.safeStringify;
const cases = [
  [{ ok: true }, "supported"],
  [{ ok: false, error: { code: -32602 } }, "recognized_invalid_params"],
  [{ ok: false, error: { code: 4001 } }, "supported_user_rejected"],
  [{ ok: false, error: { code: 4100 } }, "supported_unauthorized"],
  [{ ok: false, error: { code: 4200 } }, "unsupported"],
  [{ ok: false, error: { code: -32601 } }, "unsupported"],
  [{ ok: false, error: { code: 4900 } }, "provider_or_chain_unavailable"],
  [{ ok: false, error: { code: 4901 } }, "provider_or_chain_unavailable"],
  [{ ok: false, error: { code: -32000 } }, "rpc_error_recognized"],
  [{ ok: false, error: { code: -32099 } }, "rpc_error_recognized"],
  [{ ok: false, timeout: true }, "no_response"],
  [{ ok: false, error: { message: "无 code" } }, "inconclusive"],
  [{ ok: false, error: { code: 12345 } }, "inconclusive"]
];
cases.forEach(([outcome, expected]) => assert.strictEqual(classify(outcome), expected));

const bigintJson = safeStringify({ count: BigInt("9007199254740993") });
assert.strictEqual(JSON.parse(bigintJson).count, "9007199254740993n");
const circular = { label: "root" };
circular.self = circular;
const circularJson = safeStringify(circular);
assert.strictEqual(JSON.parse(circularJson).self, "[Circular]");

[
  "导出 / 复制 JSON",
  "data-role='export-panel'",
  "data-role='export-json'",
  "data-role='download-json'",
  "data-role='copy-json'",
  "data-role='share-json'",
  "data-role='close-export'",
  "aria-live='polite'",
  "下载可能被 WebView 拦截",
  "长按复制",
  "navigatorObject.canShare",
  "catalogCount",
  "resultSummary",
  "scanProgress"
].forEach((marker) => assert(scannerSource.includes(marker), `缺少导出 UI/逻辑标记：${marker}`));

const rootHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const dynamicHtml = fs.readFileSync(path.join(root, "dynamic_rpc", "index.html"), "utf8");
assert(rootHtml.includes("data-rpc-support-scanner"));
assert(rootHtml.includes('src="rpc_support_catalog.js"'));
assert(rootHtml.includes('src="rpc_support_scanner.js"'));
assert(dynamicHtml.includes("data-rpc-support-scanner"));
assert(dynamicHtml.includes('src="../rpc_support_catalog.js"'));
assert(dynamicHtml.includes('src="../rpc_support_scanner.js"'));

console.log(JSON.stringify({
  sourceCounts: { ethereum: 78, metamask: 52, intersection: 31, union: 99 },
  catalog: { unique: methods.size, categories: 9, sourcesVerified: true },
  classificationCasesPassed: cases.length,
  safeStringify: { bigint: true, circular: true },
  exportUi: true,
  htmlIntegration: true,
  harmlessProbeParams: true
}, null, 2));
