// dapp_rpc_log.js — 统一将 personal_sign 签名结果写入页面底部日志
(function (g) {
  function isPersonalSignMethod(method) {
    return String(method || "").toLowerCase() === "personal_sign";
  }

  function formatPersonalSignSignature(result) {
    if (typeof result === "string") return result;
    if (result == null) return "";
    try {
      return JSON.stringify(result);
    } catch (_) {
      return String(result);
    }
  }

  function getDefaultLogSink() {
    if (typeof g.sysLog === "function") return g.sysLog;
    const panel = document.getElementById("log-panel") || document.getElementById("logContainer");
    if (!panel) return null;
    return function appendLog(message) {
      const line = document.createElement("div");
      line.textContent = `> ${new Date().toLocaleTimeString()}: ${message}`;
      panel.appendChild(line);
      panel.scrollTop = panel.scrollHeight;
    };
  }

  function logPersonalSignRequest(params, logFn) {
    const sink = logFn || getDefaultLogSink();
    if (!sink || !Array.isArray(params)) return;
    const message = params[0] != null ? String(params[0]) : "";
    const address = params[1] != null ? String(params[1]) : "";
    sink(`personal_sign 请求 message=${message} address=${address}`);
  }

  function logPersonalSignResult(result, logFn) {
    const sink = logFn || getDefaultLogSink();
    if (!sink) return;
    const signature = formatPersonalSignSignature(result);
    sink(`personal_sign 签名结果: ${signature}`);
  }

  async function dappProviderRequest(provider, payload, logFn) {
    const method = payload && payload.method;
    const params = payload && payload.params;
    if (isPersonalSignMethod(method)) {
      logPersonalSignRequest(params, logFn);
    }
    const result = await provider.request(payload);
    if (isPersonalSignMethod(method)) {
      logPersonalSignResult(result, logFn);
    }
    return result;
  }

  g.isPersonalSignMethod = isPersonalSignMethod;
  g.formatPersonalSignSignature = formatPersonalSignSignature;
  g.logPersonalSignRequest = logPersonalSignRequest;
  g.logPersonalSignResult = logPersonalSignResult;
  g.dappProviderRequest = dappProviderRequest;
})(typeof window !== "undefined" ? window : globalThis);
