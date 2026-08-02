(function (global, document) {
  "use strict";

  var HIGH_RISK = new Set(["interactive", "transaction", "signature"]);
  var STATUS_LABELS = {
    pending: "待探测",
    scanning: "探测中",
    manual_required: "需手动确认",
    supported: "支持（成功）",
    recognized_invalid_params: "已识别/参数无效",
    supported_user_rejected: "支持/用户拒绝",
    supported_unauthorized: "支持/未授权",
    unsupported: "不支持",
    provider_or_chain_unavailable: "Provider/链不可用",
    rpc_error_recognized: "RPC 已识别但失败",
    inconclusive: "结论不确定",
    no_response: "无响应"
  };

  function numericCode(error) {
    var candidates = [
      error && error.code,
      error && error.error && error.error.code,
      error && error.data && error.data.originalError && error.data.originalError.code
    ];
    for (var i = 0; i < candidates.length; i += 1) {
      if (candidates[i] !== undefined && candidates[i] !== null && candidates[i] !== "") {
        var number = Number(candidates[i]);
        return Number.isNaN(number) ? candidates[i] : number;
      }
    }
    return null;
  }

  function classifyRpcOutcome(outcome) {
    if (outcome && outcome.ok) return "supported";
    if (outcome && outcome.timeout) return "no_response";
    var code = numericCode(outcome && outcome.error);
    if (code === -32602) return "recognized_invalid_params";
    if (code === 4001) return "supported_user_rejected";
    if (code === 4100) return "supported_unauthorized";
    if (code === 4200 || code === -32601) return "unsupported";
    if (code === 4900 || code === 4901) return "provider_or_chain_unavailable";
    if (typeof code === "number" && code >= -32099 && code <= -32000) {
      return "rpc_error_recognized";
    }
    return code === null ? "inconclusive" : "inconclusive";
  }

  global.RpcSupportScannerUtils = Object.freeze({
    classifyRpcOutcome: classifyRpcOutcome,
    numericCode: numericCode
  });

  function safeText(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function errorSnapshot(error) {
    if (!error) return null;
    var snapshot = {
      name: error.name || null,
      code: numericCode(error),
      message: error.message || String(error),
      data: error.data === undefined ? null : error.data
    };
    return snapshot;
  }

  function messageFrom(error) {
    return error && error.message ? error.message : (error ? String(error) : "");
  }

  function requestWithTimeout(provider, entry, timeoutMs) {
    var startedAt = Date.now();
    var timer;
    var timeoutPromise = new Promise(function (resolve) {
      timer = setTimeout(function () {
        resolve({ ok: false, timeout: true, duration: Date.now() - startedAt });
      }, timeoutMs);
    });
    var requestPromise;
    try {
      requestPromise = Promise.resolve(provider.request({
        method: entry.method,
        params: entry.probeParams
      })).then(function (result) {
        return { ok: true, result: result, duration: Date.now() - startedAt };
      }, function (error) {
        return { ok: false, error: error, duration: Date.now() - startedAt };
      });
    } catch (error) {
      requestPromise = Promise.resolve({
        ok: false,
        error: error,
        duration: Date.now() - startedAt
      });
    }
    return Promise.race([requestPromise, timeoutPromise]).then(function (outcome) {
      clearTimeout(timer);
      return outcome;
    });
  }

  function injectStyles() {
    if (document.getElementById("rpc-support-scanner-styles")) return;
    var style = document.createElement("style");
    style.id = "rpc-support-scanner-styles";
    style.textContent =
      ".rpcss{--rpcss-bg:#fff;--rpcss-fg:#202124;--rpcss-muted:#5f6368;--rpcss-line:#dfe3e8;" +
      "--rpcss-blue:#1a73e8;--rpcss-warn:#b06000;box-sizing:border-box;margin:20px auto;padding:16px;" +
      "max-width:1100px;background:var(--rpcss-bg);color:var(--rpcss-fg);border:1px solid var(--rpcss-line);" +
      "border-radius:12px;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',sans-serif;" +
      "box-shadow:0 2px 10px rgba(0,0,0,.08)}.rpcss *{box-sizing:border-box}.rpcss h2{margin:0 0 8px;font-size:20px}" +
      ".rpcss-note{margin:8px 0;color:var(--rpcss-muted);font-size:12px}.rpcss-warning{padding:10px;" +
      "border-left:3px solid var(--rpcss-warn);background:#fff8e8;color:#694100}.rpcss-toolbar{display:grid;" +
      "grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;margin:14px 0}.rpcss input,.rpcss select,.rpcss button{" +
      "min-height:38px;border:1px solid var(--rpcss-line);border-radius:7px;padding:7px 10px;font:inherit}" +
      ".rpcss input,.rpcss select{width:100%;background:#fff;color:#202124}.rpcss-actions{display:flex;gap:8px;" +
      "flex-wrap:wrap;align-items:center}.rpcss button{cursor:pointer;background:#fff;color:#202124}.rpcss .rpcss-primary{" +
      "background:var(--rpcss-blue);border-color:var(--rpcss-blue);color:#fff;font-weight:600}.rpcss button:disabled{" +
      "opacity:.55;cursor:not-allowed}.rpcss-risk{display:flex;align-items:flex-start;gap:8px;margin:12px 0;" +
      "color:#8a3b00}.rpcss-risk input{width:auto;min-height:auto;margin-top:4px}.rpcss-progress{height:8px;" +
      "background:#edf0f3;border-radius:99px;overflow:hidden;margin:12px 0}.rpcss-progress>i{display:block;height:100%;" +
      "width:0;background:var(--rpcss-blue);transition:width .15s}.rpcss-stats{display:flex;gap:8px;flex-wrap:wrap;" +
      "margin:10px 0}.rpcss-pill{border:1px solid var(--rpcss-line);border-radius:99px;padding:3px 8px;font-size:12px}" +
      ".rpcss-legend{font-size:11px;color:var(--rpcss-muted);margin:10px 0}.rpcss-table-wrap{overflow:auto;" +
      "max-height:520px;border:1px solid var(--rpcss-line);border-radius:8px}.rpcss table{width:100%;" +
      "border-collapse:collapse;min-width:820px}.rpcss th,.rpcss td{padding:8px;border-bottom:1px solid #edf0f3;" +
      "text-align:left;vertical-align:top}.rpcss th{position:sticky;top:0;background:#f8f9fa;z-index:1;font-size:12px}" +
      ".rpcss code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.rpcss-code{font-weight:700;" +
      "color:#a33}.rpcss-status-supported,.rpcss-status-recognized_invalid_params,.rpcss-status-supported_user_rejected," +
      ".rpcss-status-supported_unauthorized{color:#137333}.rpcss-status-unsupported{color:#b3261e}" +
      ".rpcss-status-manual_required{color:#b06000}.rpcss-empty{text-align:center;color:var(--rpcss-muted);padding:24px}" +
      "@media(max-width:700px){.rpcss{padding:12px;margin:14px 0}.rpcss-toolbar{grid-template-columns:1fr 1fr}" +
      ".rpcss-toolbar input{grid-column:1/-1}.rpcss-actions button{flex:1}.rpcss h2{font-size:18px}}";
    document.head.appendChild(style);
  }

  function Scanner(container) {
    this.container = container;
    this.catalog = Array.isArray(global.RPC_SUPPORT_CATALOG) ? global.RPC_SUPPORT_CATALOG : [];
    this.results = new Map();
    this.running = false;
    this.stopRequested = false;
    this.completed = 0;
    this.total = 0;
    this.renderShell();
    this.initializeResults();
    this.bind();
    this.render();
  }

  Scanner.prototype.renderShell = function () {
    var categories = Array.from(new Set(this.catalog.map(function (entry) { return entry.category; })));
    this.container.classList.add("rpcss");
    this.container.innerHTML =
      "<h2>EIP-1193 RPC 支持度扫描（" + this.catalog.length + " 个去重方法）</h2>" +
      "<p class='rpcss-note'>EIP-1193 没有统一的方法枚举接口。本工具优先观察钱包返回的原始错误码；错误码探测仅是启发式证据，不是兼容性认证。</p>" +
      "<p class='rpcss-note rpcss-warning'>Engine / debug / txpool / testing 属于节点接口，结果常反映钱包上游节点或安全策略，并不代表钱包 UI 功能。所有探测均使用故意无效、无害参数，不发送有效交易、真实签名消息或有效改链参数。</p>" +
      "<div class='rpcss-toolbar'>" +
      "<input data-role='search' type='search' placeholder='搜索 method 名称' aria-label='搜索方法'>" +
      "<select data-role='category' aria-label='类别'><option value=''>全部类别</option>" +
      categories.map(function (category) { return "<option>" + safeText(category) + "</option>"; }).join("") +
      "</select><select data-role='source' aria-label='来源'><option value=''>全部来源</option>" +
      "<option value='ethereum'>Ethereum</option><option value='metamask'>MetaMask</option></select>" +
      "<select data-role='status' aria-label='状态'><option value=''>全部状态</option>" +
      Object.keys(STATUS_LABELS).map(function (key) {
        return "<option value='" + key + "'>" + safeText(STATUS_LABELS[key]) + "</option>";
      }).join("") + "</select></div>" +
      "<label class='rpcss-risk'><input data-role='high-risk' type='checkbox'>包含交互/签名/交易方法（仅限隔离测试钱包；开始前会进行一次强确认，钱包自身仍可能逐项弹窗）</label>" +
      "<div class='rpcss-actions'><button class='rpcss-primary' data-role='start'>开始顺序扫描</button>" +
      "<button data-role='stop' disabled>停止</button><button data-role='export'>导出 JSON</button>" +
      "<span data-role='progress-text'>尚未开始</span></div>" +
      "<div class='rpcss-progress' aria-hidden='true'><i data-role='progress-bar'></i></div>" +
      "<div class='rpcss-stats' data-role='stats'></div>" +
      "<div class='rpcss-legend'>图例：成功＝supported；-32602＝已识别/参数无效；4001＝支持/用户拒绝；4100＝支持/未授权；4200 或 -32601＝不支持；4900/4901＝Provider/链不可用；-32000～-32099＝请求已到达实现但失败；超时、无 code 或其他＝结论不确定/无响应。</div>" +
      "<div class='rpcss-table-wrap'><table><thead><tr><th>Method</th><th>来源</th><th>类别 / 风险</th>" +
      "<th>状态</th><th>返回 code</th><th>message / 耗时</th></tr></thead><tbody data-role='rows'></tbody></table></div>";
  };

  Scanner.prototype.initializeResults = function () {
    var self = this;
    this.catalog.forEach(function (entry) {
      self.results.set(entry.method, {
        status: HIGH_RISK.has(entry.riskLevel) ? "manual_required" : "pending",
        code: null, message: "", duration: null, rawResult: null, rawError: null
      });
    });
  };

  Scanner.prototype.bind = function () {
    var self = this;
    ["search", "category", "source", "status"].forEach(function (role) {
      self.container.querySelector("[data-role='" + role + "']").addEventListener(
        role === "search" ? "input" : "change", function () { self.render(); }
      );
    });
    this.container.querySelector("[data-role='start']").addEventListener("click", function () { self.start(); });
    this.container.querySelector("[data-role='stop']").addEventListener("click", function () {
      self.stopRequested = true;
      self.updateControls();
    });
    this.container.querySelector("[data-role='export']").addEventListener("click", function () { self.exportJson(); });
  };

  Scanner.prototype.filteredEntries = function () {
    var search = this.container.querySelector("[data-role='search']").value.trim().toLowerCase();
    var category = this.container.querySelector("[data-role='category']").value;
    var source = this.container.querySelector("[data-role='source']").value;
    var status = this.container.querySelector("[data-role='status']").value;
    var self = this;
    return this.catalog.filter(function (entry) {
      var result = self.results.get(entry.method);
      return (!search || entry.method.toLowerCase().indexOf(search) !== -1) &&
        (!category || entry.category === category) &&
        (!source || entry.sources.indexOf(source) !== -1) &&
        (!status || result.status === status);
    });
  };

  Scanner.prototype.render = function () {
    var self = this;
    var rows = this.filteredEntries().map(function (entry) {
      var result = self.results.get(entry.method);
      var duration = result.duration === null ? "" : result.duration + " ms";
      return "<tr><td><code>" + safeText(entry.method) + "</code></td><td>" +
        safeText(entry.sources.join(" + ")) + "</td><td>" + safeText(entry.category) +
        "<br><small>" + safeText(entry.riskLevel) + "</small></td><td class='rpcss-status-" +
        safeText(result.status) + "'>" + safeText(STATUS_LABELS[result.status] || result.status) +
        "</td><td class='rpcss-code'>" + safeText(result.code === null ? "—" : result.code) +
        "</td><td>" + safeText(result.message) + (result.message && duration ? "<br>" : "") +
        "<small>" + safeText(duration) + "</small></td></tr>";
    }).join("");
    this.container.querySelector("[data-role='rows']").innerHTML =
      rows || "<tr><td colspan='6' class='rpcss-empty'>没有符合筛选条件的方法</td></tr>";
    this.renderStats();
    this.updateControls();
  };

  Scanner.prototype.renderStats = function () {
    var counts = {};
    this.results.forEach(function (result) { counts[result.status] = (counts[result.status] || 0) + 1; });
    this.container.querySelector("[data-role='stats']").innerHTML = Object.keys(counts).map(function (status) {
      return "<span class='rpcss-pill'>" + safeText(STATUS_LABELS[status] || status) + "：" + counts[status] + "</span>";
    }).join("");
    var percent = this.total ? Math.round(this.completed / this.total * 100) : 0;
    this.container.querySelector("[data-role='progress-bar']").style.width = percent + "%";
    this.container.querySelector("[data-role='progress-text']").textContent = this.running ?
      (this.completed + " / " + this.total + (this.stopRequested ? "（将在当前请求结束或超时后停止）" : "")) :
      (this.total ? this.completed + " / " + this.total : "尚未开始");
  };

  Scanner.prototype.updateControls = function () {
    this.container.querySelector("[data-role='start']").disabled = this.running;
    this.container.querySelector("[data-role='stop']").disabled = !this.running || this.stopRequested;
  };

  Scanner.prototype.start = async function () {
    if (this.running) return;
    var includeHighRisk = this.container.querySelector("[data-role='high-risk']").checked;
    if (includeHighRisk) {
      var accepted = global.confirm(
        "高风险探测可能触发钱包弹窗。仅应使用隔离测试钱包。\n\n" +
        "工具只发送故意无效参数，但已发出的 EIP-1193 请求无法被超时机制取消。确认继续？"
      );
      if (!accepted) return;
    }
    if (!global.ethereum || typeof global.ethereum.request !== "function") {
      global.alert("未检测到 window.ethereum.request，无法扫描。");
      return;
    }

    var queue = this.catalog.filter(function (entry) {
      return includeHighRisk || !HIGH_RISK.has(entry.riskLevel);
    });
    this.catalog.forEach(function (entry) {
      if (HIGH_RISK.has(entry.riskLevel) && !includeHighRisk) {
        this.results.set(entry.method, {
          status: "manual_required", code: null, message: "默认跳过，需主动勾选并确认",
          duration: null, rawResult: null, rawError: null
        });
      }
    }, this);
    this.running = true;
    this.stopRequested = false;
    this.completed = 0;
    this.total = queue.length;
    this.render();

    for (var i = 0; i < queue.length; i += 1) {
      if (this.stopRequested) break;
      var entry = queue[i];
      this.results.set(entry.method, {
        status: "scanning", code: null, message: "等待钱包返回…",
        duration: null, rawResult: null, rawError: null
      });
      this.render();
      var outcome = await requestWithTimeout(global.ethereum, entry, 8000);
      var code = outcome.ok ? null : numericCode(outcome.error);
      this.results.set(entry.method, {
        status: classifyRpcOutcome(outcome),
        code: code,
        message: outcome.timeout ? "约 8 秒未返回；超时不会取消钱包侧已发出的请求" :
          (outcome.ok ? "成功返回" : messageFrom(outcome.error)),
        duration: outcome.duration,
        rawResult: outcome.ok ? outcome.result : null,
        rawError: outcome.ok || outcome.timeout ? null : errorSnapshot(outcome.error)
      });
      this.completed += 1;
      this.render();
    }
    this.running = false;
    this.render();
  };

  Scanner.prototype.exportJson = function () {
    var self = this;
    var chainResult = this.results.get("eth_chainId");
    var chainId = chainResult && chainResult.status === "supported" &&
      typeof chainResult.rawResult === "string" ? chainResult.rawResult : null;
    var payload = {
      exportedAt: new Date().toISOString(),
      userAgent: global.navigator && global.navigator.userAgent || "",
      chainId: chainId,
      methodology: "EIP-1193 顺序错误码探测；统一使用故意无效/无害参数",
      methods: this.catalog.map(function (entry) {
        var result = self.results.get(entry.method);
        return {
          method: entry.method, sources: entry.sources, category: entry.category,
          riskLevel: entry.riskLevel, status: result.status, code: result.code,
          message: result.message, duration: result.duration,
          result: result.rawResult, error: result.rawError
        };
      })
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "rpc-support-scan-" + new Date().toISOString().replace(/[:.]/g, "-") + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };

  function mount() {
    injectStyles();
    document.querySelectorAll("[data-rpc-support-scanner]").forEach(function (container) {
      if (!container.__rpcSupportScanner) container.__rpcSupportScanner = new Scanner(container);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})(window, document);
