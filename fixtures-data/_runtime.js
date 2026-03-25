// fixtures-data/_runtime.js
// 运行时数据仓库：把“可更新数据”与“执行逻辑”解耦
(() => {
  const g = /** @type {any} */ (window);

  if (!g.__FIXTURE_DATA__) g.__FIXTURE_DATA__ = Object.create(null);

  g.registerFixtureData = function registerFixtureData(id, data) {
    if (!id || typeof id !== "string") throw new Error("registerFixtureData: invalid id");
    g.__FIXTURE_DATA__[id] = data;
  };

  function deepClone(v) {
    // structuredClone 在部分老环境不可用，fallback 到 JSON 克隆
    if (typeof g.structuredClone === "function") return g.structuredClone(v);
    return JSON.parse(JSON.stringify(v));
  }

  function templateReplaceString(s, vars) {
    if (typeof s !== "string" || vars == null) return s;
    return s.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (Object.prototype.hasOwnProperty.call(vars, key) && vars[key] !== undefined && vars[key] !== null)
        return String(vars[key]);
      return "";
    });
  }

  function resolveTemplate(value, vars) {
    if (value == null) return value;

    if (typeof value === "string") return templateReplaceString(value, vars);

    if (Array.isArray(value)) return value.map((v) => resolveTemplate(v, vars));

    if (typeof value === "object") {
      // 特殊指令：把对象 resolve 后再 JSON.stringify
      if (Object.prototype.hasOwnProperty.call(value, "$stringify")) {
        return JSON.stringify(resolveTemplate(value.$stringify, vars));
      }

      const out = {};
      for (const [k, v] of Object.entries(value)) out[k] = resolveTemplate(v, vars);
      return out;
    }

    return value;
  }

  g.buildFixtureFromData = function buildFixtureFromData(id, vars) {
    const raw = g.__FIXTURE_DATA__?.[id];
    if (!raw) throw new Error(`Fixture data not found: ${id}`);

    const data = deepClone(raw);
    return {
      id: data.id ?? id,
      name: data.name,
      method: data.method,
      params: resolveTemplate(data.params, vars),
    };
  };
})();
