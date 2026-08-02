(function (global, document) {
  "use strict";

  var STATUS_LABELS = {
    pending: "待探测",
    scanning: "探测中",
    confirmed_supported: "已确认支持",
    supported_user_rejected: "支持（用户拒绝）",
    supported_unauthorized: "支持（未授权）",
    recognized: "已识别（非完全支持）",
    explicitly_unsupported: "明确不支持",
    policy_blocked: "策略拦截",
    invalid_result: "返回结构无效",
    inconclusive_timeout: "超时，结论不确定",
    inconclusive_error: "错误，结论不确定",
    manual_required: "需要逐项人工验证",
    not_applicable_internal: "节点内部接口（默认跳过）",
    unsafe_unverifiable: "无法安全验证"
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

  function safelyRead(object, key) {
    try { return object[key]; } catch (error) {
      return "[读取 " + key + " 失败：" + (error && error.message ? error.message : String(error)) + "]";
    }
  }

  function safeStringify(value, space) {
    var seen = [];
    return JSON.stringify(value, function (key, item) {
      if (typeof item === "bigint") return item.toString() + "n";
      if (!item || typeof item !== "object") return item;
      if (seen.indexOf(item) !== -1) return "[Circular]";
      seen.push(item);
      if (Object.prototype.toString.call(item) === "[object Error]" ||
          (typeof Error !== "undefined" && item instanceof Error)) {
        return {
          name: safelyRead(item, "name") || "Error",
          message: safelyRead(item, "message") || String(item),
          stack: safelyRead(item, "stack") || null,
          code: safelyRead(item, "code"),
          data: safelyRead(item, "data")
        };
      }
      return item;
    }, space === undefined ? 2 : space);
  }

  function safeLimitedString(value, maxLength) {
    try { return String(value === undefined || value === null ? "" : value).slice(0, maxLength); }
    catch (error) { return "[无法安全转换文本]".slice(0, maxLength); }
  }

  function compactCode(value) {
    if (value === undefined || value === null) return null;
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "bigint") return value.toString() + "n";
    return safeLimitedString(value, 256);
  }

  function validatesExpected(value, expected) {
    if (value === undefined) return false;
    switch (expected) {
      case "anyDefined": return true;
      case "string": return typeof value === "string";
      case "hex": return typeof value === "string" && /^0x[0-9a-f]*$/i.test(value);
      case "hexOrNull": return value === null || (typeof value === "string" && /^0x[0-9a-f]*$/i.test(value));
      case "array": return Array.isArray(value);
      case "arrayOrNull": return value === null || Array.isArray(value);
      case "boolean": return typeof value === "boolean";
      case "booleanOrObject": return typeof value === "boolean" ||
        (value !== null && typeof value === "object" && !Array.isArray(value));
      case "object": return value !== null && typeof value === "object" && !Array.isArray(value);
      case "objectOrNull": return value === null ||
        (typeof value === "object" && !Array.isArray(value));
      case "stringOrNull": return value === null || typeof value === "string";
      default: return false;
    }
  }

  function messageFrom(error) {
    return error && error.message ? error.message : (error ? String(error) : "");
  }

  function matchesRecognitionPattern(error, entry) {
    if (!entry || !Array.isArray(entry.recognitionPatterns)) return false;
    var message = messageFrom(error);
    return entry.recognitionPatterns.some(function (pattern) {
      try { return new RegExp(pattern, "i").test(message); } catch (ignored) { return false; }
    });
  }

  function classifyRpcOutcome(outcome, entry) {
    if (outcome && outcome.ok) {
      if (!validatesExpected(outcome.result, entry && entry.expectedResult)) return "invalid_result";
      if (entry && (entry.probeMode === "recognition_only" || entry.probeMode === "internal_skip")) {
        return "recognized";
      }
      return "confirmed_supported";
    }
    if (outcome && outcome.timeout) return "inconclusive_timeout";
    var code = numericCode(outcome && outcome.error);
    var message = messageFrom(outcome && outcome.error);
    if (code === 4001) return "supported_user_rejected";
    if (code === 4100) return "supported_unauthorized";
    if (code === -32602) return "recognized";
    if (code === 4200 || code === -32601 || /\b(does not support|not supported|unsupported method)\b/i.test(message)) {
      return "explicitly_unsupported";
    }
    if (code === -32603 && /\b(blacklist|blacklisted|blocked|forbidden)\b/i.test(message)) {
      return "policy_blocked";
    }
    if (code === null && matchesRecognitionPattern(outcome && outcome.error, entry)) return "recognized";
    return "inconclusive_error";
  }

  function evidenceLevel(status) {
    if (status === "confirmed_supported" || status === "supported_user_rejected" ||
        status === "supported_unauthorized") return "confirmed";
    if (status === "recognized") return "recognized";
    if (status === "explicitly_unsupported") return "unsupported";
    if (status === "policy_blocked") return "blocked";
    if (status === "manual_required") return "manual";
    if (status === "not_applicable_internal") return "not_applicable";
    if (status === "unsafe_unverifiable") return "manual";
    return "inconclusive";
  }

  function resultFor(results, method) {
    if (results && typeof results.get === "function") return results.get(method);
    return results && results[method];
  }

  function buildCompactResultDocument(catalog, results, metadata) {
    if (!Array.isArray(catalog) || catalog.length !== 99) {
      throw new Error("目录校验失败：catalog 必须恰好包含 99 项");
    }
    var names = catalog.map(function (entry) { return entry.method; });
    if (new Set(names).size !== 99) throw new Error("目录校验失败：method 必须唯一");
    var summary = {};
    var methods = catalog.map(function (entry) {
      var result = resultFor(results, entry.method) || {};
      var status = safeLimitedString(result.status || "pending", 128);
      summary[status] = (summary[status] || 0) + 1;
      return {
        method: entry.method,
        sources: Array.isArray(entry.sources) ? entry.sources.map(function (source) {
          return safeLimitedString(source, 128);
        }) : [],
        category: safeLimitedString(entry.category, 256),
        riskLevel: safeLimitedString(entry.riskLevel, 128),
        probeMode: safeLimitedString(entry.probeMode, 128),
        evidenceLevel: evidenceLevel(status),
        status: status,
        code: compactCode(result.code),
        message: safeLimitedString(result.message, 500),
        duration: typeof result.duration === "number" && Number.isFinite(result.duration) ?
          result.duration : null
      };
    });
    var total = Object.keys(summary).reduce(function (sum, status) { return sum + summary[status]; }, 0);
    if (methods.length !== 99 || new Set(methods.map(function (item) { return item.method; })).size !== 99 ||
        total !== 99) throw new Error("结果校验失败：导出必须为 99 个唯一方法且 summary 总和为 99");
    var meta = metadata || {};
    return {
      formatVersion: 2,
      exportMode: "compact",
      exportedAt: meta.exportedAt,
      userAgent: safeLimitedString(meta.userAgent, 1000),
      chainId: typeof meta.chainId === "string" && meta.chainId.length <= 128 ? meta.chainId : null,
      methodology: "方法专属安全有效探测/参数识别；成功返回还需结构校验；超时不代表不支持；不含原始响应",
      catalogCount: catalog.length,
      resultSummary: summary,
      scanProgress: meta.scanProgress,
      methods: methods
    };
  }

  global.RpcSupportScannerUtils = Object.freeze({
    classifyRpcOutcome: classifyRpcOutcome,
    validatesExpected: validatesExpected,
    numericCode: numericCode,
    safeStringify: safeStringify,
    evidenceLevel: evidenceLevel,
    buildCompactResultDocument: buildCompactResultDocument
  });

  function safeText(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function requestWithTimeout(provider, method, params, timeoutMs) {
    var startedAt = Date.now();
    var timer;
    var timeoutPromise = new Promise(function (resolve) {
      timer = setTimeout(function () {
        resolve({ ok: false, timeout: true, duration: Date.now() - startedAt });
      }, timeoutMs);
    });
    var requestPromise;
    try {
      requestPromise = Promise.resolve(provider.request({ method: method, params: params })).then(
        function (result) { return { ok: true, result: result, duration: Date.now() - startedAt }; },
        function (error) { return { ok: false, error: error, duration: Date.now() - startedAt }; }
      );
    } catch (error) {
      requestPromise = Promise.resolve({ ok: false, error: error, duration: Date.now() - startedAt });
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
      ".rpcss{box-sizing:border-box;margin:20px auto;padding:16px;max-width:1200px;background:#fff;color:#202124;" +
      "border:1px solid #dfe3e8;border-radius:12px;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI'," +
      "'Microsoft YaHei',sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.08)}.rpcss *{box-sizing:border-box}" +
      ".rpcss h2{margin:0 0 8px;font-size:20px}.rpcss-note{margin:8px 0;color:#5f6368;font-size:12px}" +
      ".rpcss-warning{padding:10px;border-left:3px solid #b06000;background:#fff8e8;color:#694100}" +
      ".rpcss-toolbar{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;margin:14px 0}" +
      ".rpcss input,.rpcss select,.rpcss button{min-height:38px;border:1px solid #dfe3e8;border-radius:7px;" +
      "padding:7px 10px;font:inherit}.rpcss input,.rpcss select{width:100%;background:#fff;color:#202124}" +
      ".rpcss-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.rpcss button{cursor:pointer;background:#fff}" +
      ".rpcss .rpcss-primary{background:#1a73e8;border-color:#1a73e8;color:#fff;font-weight:600}" +
      ".rpcss button:disabled{opacity:.55;cursor:not-allowed}.rpcss-option{display:flex;gap:8px;align-items:flex-start;" +
      "margin:12px 0;color:#8a3b00}.rpcss-option input{width:auto;min-height:auto;margin-top:4px}" +
      ".rpcss-progress{height:8px;background:#edf0f3;border-radius:99px;overflow:hidden;margin:12px 0}" +
      ".rpcss-progress>i{display:block;height:100%;width:0;background:#1a73e8}.rpcss-stats{display:flex;gap:8px;" +
      "flex-wrap:wrap;margin:10px 0}.rpcss-pill{border:1px solid #dfe3e8;border-radius:99px;padding:3px 8px;font-size:12px}" +
      ".rpcss-legend{font-size:11px;color:#5f6368;margin:10px 0}.rpcss-table-wrap{overflow:auto;max-height:560px;" +
      "border:1px solid #dfe3e8;border-radius:8px}.rpcss table{width:100%;border-collapse:collapse;min-width:1050px}" +
      ".rpcss th,.rpcss td{padding:8px;border-bottom:1px solid #edf0f3;text-align:left;vertical-align:top}" +
      ".rpcss th{position:sticky;top:0;background:#f8f9fa;z-index:1;font-size:12px}.rpcss code{font-family:" +
      "ui-monospace,SFMono-Regular,Consolas,monospace}.rpcss-code{font-weight:700;color:#a33}" +
      ".rpcss-status-confirmed_supported,.rpcss-status-supported_user_rejected,.rpcss-status-supported_unauthorized{" +
      "color:#137333}.rpcss-status-recognized{color:#146c94}.rpcss-status-explicitly_unsupported{color:#b3261e}" +
      ".rpcss-status-manual_required,.rpcss-status-policy_blocked{color:#b06000}.rpcss-empty{text-align:center;" +
      "color:#5f6368;padding:24px}.rpcss-export-panel{margin:14px 0;padding:12px;border:1px solid #dfe3e8;" +
      "border-radius:8px;background:#f8f9fa}.rpcss-export-panel[hidden]{display:none}.rpcss-export-json{display:block;" +
      "width:100%;min-height:220px;max-height:55vh;resize:vertical;padding:10px;border:1px solid #dfe3e8;" +
      "border-radius:7px;background:#fff;font:12px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace}" +
      "@media(max-width:700px){.rpcss-toolbar{grid-template-columns:1fr 1fr}.rpcss-toolbar input{grid-column:1/-1}}";
    document.head.appendChild(style);
  }

  function initialStatus(entry) {
    if (entry.probeMode === "internal_skip") return "not_applicable_internal";
    if (entry.probeMode === "unsafe_unverifiable") return "unsafe_unverifiable";
    if (entry.probeMode === "manual_reject" || entry.probeMode === "manual_context") return "manual_required";
    return "pending";
  }

  function Scanner(container) {
    this.container = container;
    this.catalog = Array.isArray(global.RPC_SUPPORT_CATALOG) ? global.RPC_SUPPORT_CATALOG : [];
    this.results = new Map();
    this.running = false;
    this.stopRequested = false;
    this.manualRunning = new Set();
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
      "<p class='rpcss-note'>每个方法使用专属策略。recognized 只表示钱包识别方法或参数校验路径，不代表语义完整支持。</p>" +
      "<p class='rpcss-note rpcss-warning'>安全自动扫描只运行 safe_valid 与 recognition_only。Promise.race 超时无法取消已发出的请求；停止也只停止后续自动队列。</p>" +
      "<div class='rpcss-toolbar'><input data-role='search' type='search' placeholder='搜索 method 名称'>" +
      "<select data-role='category'><option value=''>全部类别</option>" +
      categories.map(function (category) { return "<option>" + safeText(category) + "</option>"; }).join("") +
      "</select><select data-role='source'><option value=''>全部来源</option><option value='ethereum'>Ethereum</option>" +
      "<option value='metamask'>MetaMask</option></select><select data-role='status'><option value=''>全部状态</option>" +
      Object.keys(STATUS_LABELS).map(function (key) {
        return "<option value='" + key + "'>" + safeText(STATUS_LABELS[key]) + "</option>";
      }).join("") + "</select></div>" +
      "<label class='rpcss-option'><input data-role='internal-probe' type='checkbox'>探测节点内部接口（仅参数识别；结果反映上游节点/安全策略，不计钱包功能支持；开始前确认）</label>" +
      "<div class='rpcss-actions'><button class='rpcss-primary' data-role='start'>安全自动扫描</button>" +
      "<button data-role='stop' disabled>停止</button><button data-role='export'>导出 / 复制 JSON</button>" +
      "<span data-role='progress-text'>尚未开始</span></div>" +
      "<section class='rpcss-export-panel' data-role='export-panel' hidden><h3>导出结果</h3>" +
      "<textarea class='rpcss-export-json' data-role='export-json' readonly></textarea>" +
      "<p data-role='export-status' role='status' aria-live='polite'></p><div class='rpcss-actions'>" +
      "<button data-role='download-json'>下载 .json</button><button data-role='copy-json'>复制 JSON</button>" +
      "<button data-role='share-json' hidden>系统分享</button><button data-role='close-export'>关闭</button></div></section>" +
      "<div class='rpcss-progress'><i data-role='progress-bar'></i></div><div class='rpcss-stats' data-role='stats'></div>" +
      "<div class='rpcss-legend'>图例：成功且结构正确＝confirmed_supported；4001/4100＝确认实现；-32602 或 profile 匹配的明确参数错误＝recognized（非完全支持）；4200/-32601＝明确不支持；-32603 blacklist/blocked/forbidden＝策略拦截；超时与普通 HTTP 400/503＝不确定。</div>" +
      "<div class='rpcss-table-wrap'><table><thead><tr><th>Method</th><th>来源</th><th>类别 / 风险</th>" +
      "<th>探测策略</th><th>状态</th><th>code</th><th>message / 耗时</th><th>操作</th></tr></thead>" +
      "<tbody data-role='rows'></tbody></table></div>";
  };

  Scanner.prototype.initializeResults = function () {
    var self = this;
    this.catalog.forEach(function (entry) {
      self.results.set(entry.method, {
        status: initialStatus(entry), code: null,
        message: entry.probeMode === "unsafe_unverifiable" ? entry.manualInstruction || entry.rationale : "",
        duration: null, rawResult: null
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
      self.stopRequested = true; self.updateControls(); self.renderStats();
    });
    this.container.querySelector("[data-role='rows']").addEventListener("click", function (event) {
      var button = event.target.closest && event.target.closest("[data-manual-method]");
      if (button) self.runManual(button.getAttribute("data-manual-method"));
    });
    this.container.querySelector("[data-role='export']").addEventListener("click", function () { self.openExportPanel(); });
    this.container.querySelector("[data-role='download-json']").addEventListener("click", function () { self.downloadJson(); });
    this.container.querySelector("[data-role='copy-json']").addEventListener("click", function () { self.copyJson(); });
    this.container.querySelector("[data-role='share-json']").addEventListener("click", function () { self.shareJson(); });
    this.container.querySelector("[data-role='close-export']").addEventListener("click", function () {
      self.container.querySelector("[data-role='export-panel']").hidden = true;
    });
  };

  Scanner.prototype.filteredEntries = function () {
    var search = this.container.querySelector("[data-role='search']").value.trim().toLowerCase();
    var category = this.container.querySelector("[data-role='category']").value;
    var source = this.container.querySelector("[data-role='source']").value;
    var status = this.container.querySelector("[data-role='status']").value;
    var self = this;
    return this.catalog.filter(function (entry) {
      return (!search || entry.method.toLowerCase().indexOf(search) !== -1) &&
        (!category || entry.category === category) && (!source || entry.sources.indexOf(source) !== -1) &&
        (!status || self.results.get(entry.method).status === status);
    });
  };

  Scanner.prototype.render = function () {
    var self = this;
    var rows = this.filteredEntries().map(function (entry) {
      var result = self.results.get(entry.method);
      var duration = result.duration === null ? "" : result.duration + " ms";
      var canManual = entry.probeMode === "manual_reject" || entry.probeMode === "manual_context";
      var operation = canManual ? "<button data-manual-method='" + safeText(entry.method) + "'" +
        (self.manualRunning.has(entry.method) || self.running ? " disabled" : "") + ">人工验证</button>" :
        (entry.probeMode === "unsafe_unverifiable" ? "不可验证" : "—");
      return "<tr><td><code>" + safeText(entry.method) + "</code></td><td>" +
        safeText(entry.sources.join(" + ")) + "</td><td>" + safeText(entry.category) + "<br><small>" +
        safeText(entry.riskLevel) + "</small></td><td><code>" + safeText(entry.probeMode) +
        "</code><br><small>" + safeText(entry.rationale) + "</small></td><td class='rpcss-status-" +
        safeText(result.status) + "'>" + safeText(STATUS_LABELS[result.status] || result.status) +
        "</td><td class='rpcss-code'>" + safeText(result.code === null ? "—" : result.code) +
        "</td><td>" + safeText(result.message) + (result.message && duration ? "<br>" : "") +
        "<small>" + safeText(duration) + "</small></td><td>" + operation + "</td></tr>";
    }).join("");
    this.container.querySelector("[data-role='rows']").innerHTML =
      rows || "<tr><td colspan='8' class='rpcss-empty'>没有符合筛选条件的方法</td></tr>";
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
      this.completed + " / " + this.total + (this.stopRequested ? "（仅停止后续队列，当前请求无法取消）" : "") :
      (this.total ? this.completed + " / " + this.total : "尚未开始");
  };

  Scanner.prototype.updateControls = function () {
    this.container.querySelector("[data-role='start']").disabled = this.running || this.manualRunning.size > 0;
    this.container.querySelector("[data-role='stop']").disabled = !this.running || this.stopRequested;
  };

  Scanner.prototype.recordOutcome = function (entry, outcome, internal) {
    var status = classifyRpcOutcome(outcome, entry);
    var prefix = internal ? "节点内部接口：结果仅反映上游节点/安全策略；" : "";
    this.results.set(entry.method, {
      status: status,
      code: outcome.ok || outcome.timeout ? null : numericCode(outcome.error),
      message: prefix + (outcome.timeout ?
        "达到 " + entry.timeoutMs + " ms 超时；已发请求无法取消，超时不代表不支持" :
        (outcome.ok ? (status === "confirmed_supported" ? "成功返回且结构校验通过" :
          "Promise 成功但返回结构不符合 " + entry.expectedResult) : messageFrom(outcome.error))),
      duration: outcome.duration,
      rawResult: outcome.ok ? outcome.result : null
    });
  };

  Scanner.prototype.start = async function () {
    if (this.running) return;
    if (!global.ethereum || typeof global.ethereum.request !== "function") {
      global.alert("未检测到 window.ethereum.request，无法扫描。"); return;
    }
    var includeInternal = this.container.querySelector("[data-role='internal-probe']").checked;
    if (includeInternal && !global.confirm(
      "节点内部接口探测只做方法专属参数识别，结果仅反映上游节点或安全策略，不计钱包功能支持。继续？"
    )) return;
    var queue = this.catalog.filter(function (entry) {
      return entry.probeMode === "safe_valid" || entry.probeMode === "recognition_only" ||
        (includeInternal && entry.probeMode === "internal_skip");
    });
    this.running = true; this.stopRequested = false; this.completed = 0; this.total = queue.length; this.render();
    for (var i = 0; i < queue.length; i += 1) {
      if (this.stopRequested) break;
      var entry = queue[i];
      this.results.set(entry.method, {
        status: "scanning", code: null, message: "等待钱包返回…", duration: null, rawResult: null
      });
      this.render();
      var outcome = await requestWithTimeout(
        global.ethereum, entry.method, entry.probeParams, entry.timeoutMs
      );
      this.recordOutcome(entry, outcome, entry.probeMode === "internal_skip");
      this.completed += 1; this.render();
    }
    this.running = false; this.render();
  };

  Scanner.prototype.getAccountsWithoutPrompt = async function () {
    var accounts = await global.ethereum.request({ method: "eth_accounts", params: [] });
    return Array.isArray(accounts) && accounts.length ? accounts[0] : null;
  };

  Scanner.prototype.buildManualParams = async function (entry) {
    var template = entry.paramsTemplate;
    if (template === "requestAccounts" || template === "registerOnboarding") return [];
    if (template === "wallet_getPermissions") return [];
    if (template === "wallet_requestPermissions" || template === "wallet_revokePermissions") {
      return [{ eth_accounts: {} }];
    }
    var account = await this.getAccountsWithoutPrompt();
    if (!account) throw new Error("NO_ACCOUNT");
    var chainId = await global.ethereum.request({ method: "eth_chainId", params: [] });
    var message = "0x" + Array.from("RPC support scanner test message").map(function (character) {
      return character.charCodeAt(0).toString(16).padStart(2, "0");
    }).join("");
    if (template === "sendTransaction") return [{ from: account, to: account, value: "0x0" }];
    if (template === "personalSign") return [message, account];
    if (template === "ethSign") return [account, message];
    if (template === "typedData") return [account, JSON.stringify({
      domain: { name: "RPC Support Scanner", version: "1", chainId: chainId },
      primaryType: "Probe", types: {
        EIP712Domain: [
          { name: "name", type: "string" }, { name: "version", type: "string" },
          { name: "chainId", type: "uint256" }
        ],
        Probe: [{ name: "message", type: "string" }]
      },
      message: { message: "RPC support scanner fixed test message" }
    })];
    if (template === "signTransaction") {
      return [{ from: account, to: account, value: "0x0", data: "0x" }];
    }
    if (template === "sendCalls") {
      return [{ version: "2.0.0", chainId: chainId, from: account,
        calls: [{ to: account, value: "0x0", data: "0x" }] }];
    }
    if (template === "encryptionPublicKey") return [account];
    throw new Error("CONTEXT_REQUIRED");
  };

  Scanner.prototype.runManual = async function (method) {
    var entry = this.catalog.find(function (item) { return item.method === method; });
    if (!entry || this.manualRunning.has(method) || this.running) return;
    if (!global.ethereum || typeof global.ethereum.request !== "function") {
      global.alert("未检测到 window.ethereum.request。"); return;
    }
    if (!global.confirm(entry.manualInstruction || entry.rationale || "确认逐项人工验证？")) return;
    if (entry.probeMode === "manual_reject") {
      var warning = "二次确认：请求将触发钱包弹窗。请务必在钱包中拒绝。";
      if (method === "eth_sendTransaction") {
        var currentChain;
        try { currentChain = await global.ethereum.request({ method: "eth_chainId", params: [] }); }
        catch (ignored) { currentChain = null; }
        warning = "二次确认：将请求 {from:当前账户,to:当前账户,value:'0x0'}。请在钱包弹窗中拒绝；若确认仍可能消耗 Gas。" +
          (String(currentChain).toLowerCase() === "0x1" ? "\n\n主网警告：当前 chainId=0x1，绝对不要确认交易！" : "");
      }
      if (!global.confirm(warning)) return;
    }
    this.manualRunning.add(method);
    this.results.set(method, { status: "scanning", code: null, message: "等待钱包弹窗/返回…",
      duration: null, rawResult: null });
    this.render();
    try {
      var params = await this.buildManualParams(entry);
      var outcome = await requestWithTimeout(global.ethereum, entry.method, params, entry.timeoutMs);
      this.recordOutcome(entry, outcome, false);
    } catch (error) {
      var noAccount = error && error.message === "NO_ACCOUNT";
      this.results.set(method, {
        status: "manual_required", code: null,
        message: noAccount ?
          "当前无已连接账户；不会自动弹 eth_requestAccounts，请先逐项测试/连接 eth_requestAccounts。" :
          "需要专用安全上下文，未发送请求：" + messageFrom(error),
        duration: null, rawResult: null
      });
    }
    this.manualRunning.delete(method); this.render();
  };

  Scanner.prototype.setExportStatus = function (message) {
    this.container.querySelector("[data-role='export-status']").textContent = message;
  };

  Scanner.prototype.buildExport = function () {
    var chainResult = this.results.get("eth_chainId");
    var chainId = chainResult && chainResult.status === "confirmed_supported" &&
      typeof chainResult.rawResult === "string" ? chainResult.rawResult : null;
    var payload = buildCompactResultDocument(this.catalog, this.results, {
      exportedAt: new Date().toISOString(),
      userAgent: global.navigator && global.navigator.userAgent || "",
      chainId: chainId,
      scanProgress: { completed: this.completed, total: this.total, running: this.running }
    });
    var json = safeStringify(payload, 2);
    if (typeof json !== "string") throw new Error("无法将扫描结果转换为 JSON 文本");
    var parsed = JSON.parse(json);
    if (!Array.isArray(parsed.methods) || parsed.methods.length !== 99) {
      throw new Error("序列化校验失败：methods 必须恰好包含 99 项");
    }
    var bytes = typeof global.TextEncoder === "function" ? new global.TextEncoder().encode(json).length :
      (typeof global.Blob === "function" ? new global.Blob([json]).size : unescape(encodeURIComponent(json)).length);
    return { json: json, bytes: bytes, filename: "rpc-support-scan-compact-" +
      new Date().toISOString().replace(/[:.]/g, "-") + ".json" };
  };

  Scanner.prototype.openExportPanel = function () {
    var self = this;
    var panel = this.container.querySelector("[data-role='export-panel']");
    var textarea = this.container.querySelector("[data-role='export-json']");
    var shareButton = this.container.querySelector("[data-role='share-json']");
    panel.hidden = false; textarea.value = ""; this.exportData = null;
    shareButton.hidden = !(global.navigator && typeof global.navigator.share === "function");
    this.setExportStatus("正在生成 JSON…");
    setTimeout(function () {
      try {
        self.exportData = self.buildExport(); textarea.value = self.exportData.json;
        self.setExportStatus("精简 JSON 已生成：99 项、" + self.exportData.bytes +
          " 字节；不含原始返回体。可下载、复制、分享或长按复制。");
      } catch (error) { self.setExportStatus("生成失败：" + messageFrom(error)); }
    }, 0);
  };

  Scanner.prototype.copyJson = function () {
    var self = this;
    var textarea = this.container.querySelector("[data-role='export-json']");
    if (!textarea.value) { this.setExportStatus("尚无可复制的 JSON。"); return; }
    function fallbackCopy() {
      try {
        textarea.focus(); textarea.select();
        if (typeof textarea.setSelectionRange === "function") textarea.setSelectionRange(0, textarea.value.length);
        if (typeof document.execCommand === "function" && document.execCommand("copy")) {
          self.setExportStatus("复制成功（兼容模式）。"); return;
        }
      } catch (ignored) { /* 保留文本供手动复制 */ }
      self.setExportStatus("自动复制失败；请长按复制或手动全选。");
    }
    if (global.navigator && global.navigator.clipboard &&
        typeof global.navigator.clipboard.writeText === "function") {
      Promise.resolve(global.navigator.clipboard.writeText(textarea.value)).then(function () {
        self.setExportStatus("复制成功。");
      }, fallbackCopy);
    } else fallbackCopy();
  };

  Scanner.prototype.downloadJson = function () {
    if (!this.exportData) { this.setExportStatus("尚无可下载的 JSON。"); return; }
    if (typeof global.Blob !== "function" || !global.URL || typeof global.URL.createObjectURL !== "function") {
      this.setExportStatus("当前 WebView 不支持文件下载，请复制 JSON。"); return;
    }
    var url;
    try {
      url = global.URL.createObjectURL(new global.Blob([this.exportData.json], { type: "application/json;charset=utf-8" }));
      var link = document.createElement("a"); link.href = url; link.download = this.exportData.filename;
      document.body.appendChild(link); link.click(); link.parentNode.removeChild(link);
      this.setExportStatus("下载已触发；下载可能被 WebView 拦截。");
      setTimeout(function () { global.URL.revokeObjectURL(url); }, 3000);
    } catch (error) { this.setExportStatus("下载失败：" + messageFrom(error)); }
  };

  Scanner.prototype.shareJson = async function () {
    if (!this.exportData || !global.navigator || typeof global.navigator.share !== "function") {
      this.setExportStatus("当前不可分享，请复制 JSON。"); return;
    }
    try {
      var shareData = null;
      if (typeof global.File === "function" && typeof global.navigator.canShare === "function") {
        var file = new global.File([this.exportData.json], this.exportData.filename, { type: "application/json" });
        if (global.navigator.canShare({ files: [file] })) shareData = { title: "RPC 支持度扫描结果", files: [file] };
      }
      if (!shareData && this.exportData.json.length <= 100 * 1024) {
        shareData = { title: "RPC 支持度扫描结果", text: this.exportData.json };
      }
      if (!shareData) { this.setExportStatus("JSON 过大且不支持文件分享，请复制 JSON。"); return; }
      await global.navigator.share(shareData); this.setExportStatus("系统分享已完成。");
    } catch (error) {
      this.setExportStatus(error && error.name === "AbortError" ? "已取消系统分享。" : "分享失败：" + messageFrom(error));
    }
  };

  function mount() {
    injectStyles();
    document.querySelectorAll("[data-rpc-support-scanner]").forEach(function (container) {
      if (!container.__rpcSupportScanner) container.__rpcSupportScanner = new Scanner(container);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window, document);
