(function () {
    const DYNAMIC_RPC_METHODS = [
        "eth_requestAccounts",
        "eth_accounts",
        "eth_chainId",
        "eth_signTransaction",
        "eth_sendTransaction",
        "eth_sendRawTransaction",
        "personal_sign",
        "eth_sign",
        "eth_signTypedData",
        "eth_signTypedData_v3",
        "eth_signTypedData_v4",
        "personal_ecRecover",
        "wallet_addEthereumChain",
        "wallet_switchEthereumChain",
        "wallet_watchAsset",
        "wallet_requestPermissions",
        "wallet_sendCalls",
        "eth_decrypt",
        "eth_getEncryptionPublicKey"
    ];

    /**
     * kind:
     * - empty: params = []
     * - object: params = [ {...} ]，omit 空字符串字段
     * - tuple: params = 按行顺序组成的数组
     * - firstJson: 单个 JSON 文本框 → params = [ JSON.parse ]
     */
    const METHOD_SCHEMAS = {
        eth_requestAccounts: { kind: "empty", blurb: "无需填写参数。" },
        eth_accounts: { kind: "empty", blurb: "无需填写参数。" },
        eth_chainId: { kind: "empty", blurb: "无需填写参数。" },
        eth_sendTransaction: {
            kind: "object",
            blurb: "与 fixtures 中交易对象一致，空字段将省略。",
            fields: [
                { key: "from", label: "from", ph: "0x… 发送方", required: true },
                { key: "to", label: "to", ph: "0x… 接收合约/地址" },
                { key: "data", label: "data", ph: "0x… 或裸 hex（calldata）", multiline: true },
                { key: "value", label: "value", ph: "0x0" },
                { key: "gas", label: "gas", ph: "0x5208" },
                { key: "gasPrice", label: "gasPrice", ph: "0x…" },
                { key: "maxFeePerGas", label: "maxFeePerGas (EIP-1559)", ph: "0x…" },
                { key: "maxPriorityFeePerGas", label: "maxPriorityFeePerGas", ph: "0x…" },
                { key: "nonce", label: "nonce", ph: "0x…" },
                { key: "chainId", label: "chainId", ph: "0x1" }
            ]
        },
        eth_signTransaction: {
            kind: "object",
            blurb: "待签名交易字段（通常与 sendTransaction 类似）。",
            fields: [
                { key: "from", label: "from", ph: "0x…", required: true },
                { key: "to", label: "to", ph: "0x…" },
                { key: "data", label: "data", ph: "0x…", multiline: true },
                { key: "value", label: "value", ph: "0x0" },
                { key: "gas", label: "gas", ph: "0x5208" },
                { key: "gasPrice", label: "gasPrice", ph: "0x…" },
                { key: "nonce", label: "nonce", ph: "0x…" }
            ]
        },
        eth_sendRawTransaction: {
            kind: "tuple",
            blurb: "params 为单元素：已 RLP 编码的签名交易 hex。",
            rows: [{ key: "signedTx", label: "signedTx（hex）", multiline: true, ph: "0x02f8…" }],
            build: (v) => {
                const x = (v.signedTx || "").trim();
                return x ? [x] : [];
            }
        },
        personal_sign: {
            kind: "tuple",
            blurb: "params: [ address, messageHex ]",
            rows: [
                { key: "address", label: "address", ph: "0x…" },
                { key: "message", label: "message（hex）", multiline: true, ph: "0x…" }
            ],
            build: (v) => {
                const a = (v.address || "").trim();
                const m = (v.message || "").trim();
                if (!a || !m) return [];
                return [a, m];
            }
        },
        eth_sign: {
            kind: "tuple",
            blurb: "params: [ address, data ]（注意与 personal_sign 不同）",
            rows: [
                { key: "address", label: "address", ph: "0x…" },
                { key: "data", label: "data（32 bytes hex）", multiline: true, ph: "0x…" }
            ],
            build: (v) => {
                const a = (v.address || "").trim();
                const d = (v.data || "").trim();
                if (!a || !d) return [];
                return [a, d];
            }
        },
        eth_signTypedData: {
            kind: "tuple",
            blurb: "legacy：params: [ address, typedData JSON 字符串或对象 ]",
            rows: [
                { key: "address", label: "address", ph: "0x…" },
                { key: "typedData", label: "typedData（JSON）", multiline: true, ph: "{ \"types\": … }" }
            ],
            build: (v) => {
                const a = (v.address || "").trim();
                const t = (v.typedData || "").trim();
                if (!a || !t) return [];
                let second;
                try {
                    second = JSON.parse(t);
                } catch (e) {
                    second = t;
                }
                return [a, second];
            }
        },
        eth_signTypedData_v3: {
            kind: "tuple",
            blurb: "params: [ address, typedData ]（v3 结构）",
            rows: [
                { key: "address", label: "address", ph: "0x…" },
                { key: "typedData", label: "typedData（JSON）", multiline: true, ph: "{ \"types\", \"domain\", … }" }
            ],
            build: (v) => {
                const a = (v.address || "").trim();
                const t = (v.typedData || "").trim();
                if (!a || !t) return [];
                return [a, JSON.parse(t)];
            }
        },
        eth_signTypedData_v4: {
            kind: "tuple",
            blurb: "params: [ address, typedData ]（v4 / EIP-712）",
            rows: [
                { key: "address", label: "address", ph: "0x…" },
                { key: "typedData", label: "typedData（JSON）", multiline: true, ph: "{ \"types\", \"domain\", \"message\" … }" }
            ],
            build: (v) => {
                const a = (v.address || "").trim();
                const t = (v.typedData || "").trim();
                if (!a || !t) return [];
                return [a, JSON.parse(t)];
            }
        },
        personal_ecRecover: {
            kind: "tuple",
            blurb: "params: [ message, signature ]（实现因钱包而异）",
            rows: [
                { key: "message", label: "message（hex）", multiline: true, ph: "0x…" },
                { key: "signature", label: "signature", multiline: true, ph: "0x…" }
            ],
            build: (v) => {
                const m = (v.message || "").trim();
                const s = (v.signature || "").trim();
                if (!m || !s) return [];
                return [m, s];
            }
        },
        wallet_addEthereumChain: {
            kind: "object",
            blurb: "EIP-3085：单对象内包含链元数据。",
            fields: [
                { key: "chainId", label: "chainId", ph: "0x… hex", required: true },
                { key: "chainName", label: "chainName", ph: "My Chain" },
                { key: "rpcUrl", label: "rpcUrls[0]", ph: "https://…" },
                { key: "blockExplorerUrl", label: "blockExplorerUrls[0]", ph: "https://…" },
                { key: "nativeCurrencyName", label: "nativeCurrency.name", ph: "ETH" },
                { key: "nativeCurrencySymbol", label: "nativeCurrency.symbol", ph: "ETH" },
                { key: "nativeCurrencyDecimals", label: "nativeCurrency.decimals", ph: "18" }
            ],
            build: (vals) => {
                const o = {};
                const cid = (vals.chainId || "").trim();
                if (!cid) return null;
                o.chainId = cid;
                const cn = (vals.chainName || "").trim();
                if (cn) o.chainName = cn;
                const rpc = (vals.rpcUrl || "").trim();
                if (rpc) o.rpcUrls = [rpc];
                const ex = (vals.blockExplorerUrl || "").trim();
                if (ex) o.blockExplorerUrls = [ex];
                const nn = (vals.nativeCurrencyName || "").trim();
                const ns = (vals.nativeCurrencySymbol || "").trim();
                const nd = (vals.nativeCurrencyDecimals || "").trim();
                if (nn || ns || nd) {
                    o.nativeCurrency = {
                        name: nn || "Ether",
                        symbol: ns || "ETH",
                        decimals: nd ? parseInt(nd, 10) : 18
                    };
                }
                return [o];
            }
        },
        wallet_switchEthereumChain: {
            kind: "object",
            blurb: "仅一个字段：chainId。",
            fields: [{ key: "chainId", label: "chainId", ph: "0x1 / 0x89 …", required: true }]
        },
        wallet_watchAsset: {
            kind: "object",
            blurb: "EIP-747：自动组装 type + options。",
            fields: [
                { key: "type", label: "type", ph: "ERC20", default: "ERC20" },
                { key: "address", label: "options.address", ph: "0x… 代币合约" },
                { key: "symbol", label: "options.symbol", ph: "USDC" },
                { key: "decimals", label: "options.decimals", ph: "6", default: "18" },
                { key: "image", label: "options.image（URL）", ph: "https://…" }
            ],
            build: (vals) => {
                const type = (vals.type || "ERC20").trim() || "ERC20";
                const addr = (vals.address || "").trim();
                const sym = (vals.symbol || "").trim();
                const dec = (vals.decimals || "18").trim();
                const img = (vals.image || "").trim();
                const options = {};
                if (addr) options.address = addr;
                if (sym) options.symbol = sym;
                if (dec) options.decimals = parseInt(dec, 10) || 18;
                if (img) options.image = img;
                return [{ type, options }];
            }
        },
        wallet_requestPermissions: {
            kind: "firstJson",
            blurb: "默认 EIP-2255：请求 eth_accounts。可改为合法 JSON 对象。",
            defaultText: JSON.stringify({ eth_accounts: {} }, null, 2),
            build: (text) => {
                const t = text.trim();
                if (!t) return [{ eth_accounts: {} }];
                return [JSON.parse(t)];
            }
        },
        wallet_sendCalls: {
            kind: "firstJson",
            blurb: "EIP-5792：params[0] 为 bundle 对象，请填合法 JSON。",
            defaultText: JSON.stringify(
                {
                    version: "1.0",
                    chainId: "0x1",
                    from: "0x0000000000000000000000000000000000000000",
                    calls: []
                },
                null,
                2
            ),
            build: (text) => {
                const t = text.trim();
                if (!t) return [];
                return [JSON.parse(t)];
            }
        },
        eth_decrypt: {
            kind: "tuple",
            blurb: "params: [ encryptedMessage ]",
            rows: [{ key: "encrypted", label: "encrypted（hex）", multiline: true, ph: "0x…" }],
            build: (v) => {
                const e = (v.encrypted || "").trim();
                return e ? [e] : [];
            }
        },
        eth_getEncryptionPublicKey: {
            kind: "tuple",
            blurb: "params: [ address ]",
            rows: [{ key: "address", label: "address", ph: "0x…" }],
            build: (v) => {
                const a = (v.address || "").trim();
                return a ? [a] : [];
            }
        }
    };

    const logPanel = document.getElementById("log-panel");

    function sysLog(m) {
        if (!logPanel) return;
        logPanel.innerHTML += `<div>&gt; ${new Date().toLocaleTimeString()}: ${m}</div>`;
        logPanel.scrollTop = logPanel.scrollHeight;
    }

    function collectObjectFromForm(container) {
        const inputs = container.querySelectorAll("[data-field-key]");
        const o = {};
        inputs.forEach((el) => {
            const key = el.getAttribute("data-field-key");
            const v = el.value.trim();
            if (v !== "") o[key] = v;
        });
        return o;
    }

    function collectTupleFromForm(container) {
        const inputs = container.querySelectorAll("[data-tuple-key]");
        const o = {};
        inputs.forEach((el) => {
            const key = el.getAttribute("data-tuple-key");
            o[key] = el.value;
        });
        return o;
    }

    function buildParamsFromSchema(method, schema, formRoot) {
        if (!schema) return { error: "暂无该 method 的表单模板，请用「首参 JSON」或「完整 params」。" };

        if (schema.kind === "empty") {
            return { params: [] };
        }

        if (schema.kind === "object") {
            if (schema.build) {
                const vals = collectObjectFromForm(formRoot);
                const built = schema.build(vals);
                if (built === null) return { error: "请填写必填项（如 chainId）。" };
                return { params: built };
            }
            const vals = collectObjectFromForm(formRoot);
            const req = (schema.fields || []).filter((f) => f.required);
            for (let i = 0; i < req.length; i++) {
                if (!vals[req[i].key]) return { error: `请填写必填字段：${req[i].label}` };
            }
            return { params: [vals] };
        }

        if (schema.kind === "tuple") {
            const vals = collectTupleFromForm(formRoot);
            const params = schema.build(vals);
            return { params };
        }

        if (schema.kind === "firstJson") {
            const ta = formRoot.querySelector("[data-first-json]");
            const text = ta ? ta.value : "";
            try {
                if (schema.build) {
                    return { params: schema.build(text) };
                }
                const parsed = JSON.parse(text.trim() || "{}");
                return { params: [parsed] };
            } catch (e) {
                return { error: `JSON 解析失败: ${e.message}` };
            }
        }

        return { error: "未知 schema" };
    }

    function renderSchemaForm(method, container, schema) {
        container.innerHTML = "";
        if (!schema) {
            container.innerHTML =
                '<p class="schema-blurb warn">未配置表单：请切换到「首参 JSON」或「完整 params」。</p>';
            return;
        }

        const blurb = document.createElement("p");
        blurb.className = "schema-blurb";
        blurb.textContent = schema.blurb || "";
        container.appendChild(blurb);

        if (schema.kind === "empty") {
            const p = document.createElement("p");
            p.className = "empty-hint";
            p.textContent = "此调用无参数，直接点「发送请求」即可。";
            container.appendChild(p);
            return;
        }

        if (schema.kind === "firstJson") {
            const ta = document.createElement("textarea");
            ta.className = "schema-json-editor";
            ta.setAttribute("data-first-json", "1");
            ta.spellcheck = false;
            ta.value = schema.defaultText || "{}";
            container.appendChild(ta);
            return;
        }

        const grid = document.createElement("div");
        grid.className = "schema-grid";

        if (schema.kind === "object" && schema.fields) {
            schema.fields.forEach((f) => {
                const wrap = document.createElement("div");
                wrap.className = "schema-field" + (f.multiline ? " full" : "");
                const lab = document.createElement("label");
                lab.textContent = f.label + (f.required ? " *" : "");
                const input = f.multiline ? document.createElement("textarea") : document.createElement("input");
                input.setAttribute("data-field-key", f.key);
                if (!f.multiline) input.type = "text";
                input.placeholder = f.ph || "";
                if (f.default) input.value = f.default;
                wrap.appendChild(lab);
                wrap.appendChild(input);
                grid.appendChild(wrap);
            });
            container.appendChild(grid);
            return;
        }

        if (schema.kind === "tuple" && schema.rows) {
            schema.rows.forEach((f) => {
                const wrap = document.createElement("div");
                wrap.className = "schema-field" + (f.multiline ? " full" : "");
                const lab = document.createElement("label");
                lab.textContent = f.label;
                const input = f.multiline ? document.createElement("textarea") : document.createElement("input");
                input.setAttribute("data-tuple-key", f.key);
                input.type = "text";
                input.placeholder = f.ph || "";
                wrap.appendChild(lab);
                wrap.appendChild(input);
                grid.appendChild(wrap);
            });
            container.appendChild(grid);
        }
    }

    function init() {
        const select = document.getElementById("dynamic-method-select");
        const customWrap = document.getElementById("dynamic-method-custom-wrap");
        const customInput = document.getElementById("dynamic-method-custom");
        const payloadObjectTa = document.getElementById("dynamic-payload-object");
        const paramsArrayTa = document.getElementById("dynamic-params-array");
        const wrapObject = document.getElementById("wrap-payload-object");
        const wrapArray = document.getElementById("wrap-params-array");
        const wrapForm = document.getElementById("wrap-schema-form");
        const schemaFormRoot = document.getElementById("method-schema-form");
        const btn = document.getElementById("dynamic-send-btn");
        if (!select || !btn || !payloadObjectTa || !paramsArrayTa || !schemaFormRoot) return;

        const modeRadios = document.querySelectorAll('input[name="param-mode"]');

        function getParamMode() {
            for (let i = 0; i < modeRadios.length; i++) {
                if (modeRadios[i].checked) return modeRadios[i].value;
            }
            return "form";
        }

        function getResolvedMethod() {
            if (select.value === "__custom__" && customInput) return customInput.value.trim();
            return select.value;
        }

        function syncParamModeUi() {
            const mode = getParamMode();
            const showForm = mode === "form";
            const showObject = mode === "object";
            const showArray = mode === "array";
            if (wrapForm) wrapForm.classList.toggle("hidden", !showForm);
            if (wrapObject) wrapObject.classList.toggle("hidden", !showObject);
            if (wrapArray) wrapArray.classList.toggle("hidden", !showArray);
        }

        modeRadios.forEach((r) => r.addEventListener("change", syncParamModeUi));

        function onMethodChange() {
            const m = getResolvedMethod();
            const schema = METHOD_SCHEMAS[m];
            renderSchemaForm(m, schemaFormRoot, schema);
            syncCustomVisibility();
        }

        DYNAMIC_RPC_METHODS.forEach((m) => {
            const opt = document.createElement("option");
            opt.value = m;
            opt.textContent = m;
            select.appendChild(opt);
        });
        const optCustom = document.createElement("option");
        optCustom.value = "__custom__";
        optCustom.textContent = "其他（手动输入 method）";
        select.appendChild(optCustom);

        function syncCustomVisibility() {
            if (!customWrap) return;
            customWrap.classList.toggle("visible", select.value === "__custom__");
        }
        select.addEventListener("change", onMethodChange);
        if (customInput) customInput.addEventListener("input", onMethodChange);

        onMethodChange();
        syncParamModeUi();

        btn.addEventListener("click", async () => {
            const method = getResolvedMethod();
            if (select.value === "__custom__" && !method) {
                sysLog("错误: 请填写自定义 method");
                return;
            }

            let params;
            try {
                const mode = getParamMode();
                if (mode === "form") {
                    const schema = METHOD_SCHEMAS[method];
                    const r = buildParamsFromSchema(method, schema, schemaFormRoot);
                    if (r.error) {
                        sysLog(`错误: ${r.error}`);
                        return;
                    }
                    params = r.params;
                } else if (mode === "object") {
                    const raw = payloadObjectTa.value.trim();
                    if (raw === "") {
                        params = [];
                    } else {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            sysLog(
                                "错误: 「首参 JSON」模式下不能填数组。请只填对象 {...}，或切换到「完整 params」。"
                            );
                            return;
                        }
                        if (parsed === null || typeof parsed !== "object") {
                            sysLog("错误: 请填写 JSON 对象。");
                            return;
                        }
                        params = [parsed];
                    }
                } else {
                    const raw = paramsArrayTa.value.trim();
                    params = raw === "" ? [] : JSON.parse(raw);
                    if (!Array.isArray(params)) {
                        sysLog("错误: 「完整 params」须为 JSON 数组。");
                        return;
                    }
                }
            } catch (e) {
                const msg = e && e.message ? e.message : String(e);
                sysLog(`解析失败: ${msg}`);
                return;
            }

            if (!window.ethereum || typeof window.ethereum.request !== "function") {
                sysLog("错误: 未检测到 window.ethereum.request");
                return;
            }
            const pstr = JSON.stringify(params);
            sysLog(`[请求] ${method} params=${pstr.slice(0, 500)}${pstr.length > 500 ? "…" : ""}`);
            try {
                const result = await window.ethereum.request({ method, params });
                const out =
                    typeof result === "object" && result !== null
                        ? JSON.stringify(result, null, 0)
                        : String(result);
                const max = 4000;
                sysLog(`成功: ${out.length > max ? out.slice(0, max) + "…(已截断)" : out}`);
            } catch (err) {
                sysLog(`RPC 错误: ${err && err.message ? err.message : String(err)}`);
            }
        });

        sysLog("[AstraVault 模拟] 就绪：表单模式按协议类型填写；亦可切换 JSON。仅用于授权测试环境。");
    }

    window.addEventListener("load", init);
})();
