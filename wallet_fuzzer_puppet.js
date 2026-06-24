/**
 * Wallet Fuzzer Puppet Module
 * 
 * This module transforms a DApp into a "puppet" that listens to a Python Fuzzer
 * via WebSocket, receives mutated RPC payloads, and blindly forwards them to the
 * connected mobile wallet (MetaMask, TrustWallet, etc.) using window.ethereum.
 * 
 * Usage:
 *   1. As a script in index.html:
 *      <script src="wallet_fuzzer_puppet.js"></script>
 *      <script>
 *        const puppet = new WalletFuzzerPuppet("wss://your-ngrok-url.ngrok.app");
 *        puppet.start();
 *      </script>
 * 
 *   2. As an ES6 module:
 *      import { WalletFuzzerPuppet } from './wallet_fuzzer_puppet.js';
 *      const puppet = new WalletFuzzerPuppet("wss://your-ngrok-url.ngrok.app");
 *      puppet.start();
 */

class WalletFuzzerPuppet {
  /**
   * Initialize the Wallet Fuzzer Puppet.
   * 
   * @param {string} fuzzerUrl - WebSocket URL of the Python Fuzzer (e.g., wss://xxx.ngrok.app)
   * @param {Object} options - Configuration options
   * @param {number} options.reconnectInterval - Milliseconds between reconnection attempts (default: 3000)
   * @param {number} options.maxReconnectAttempts - Maximum reconnection attempts before giving up (-1 = infinite, default: -1)
   * @param {boolean} options.verbose - Enable verbose console logging (default: true)
   */
  constructor(fuzzerUrl, options = {}) {
    this.fuzzerUrl = fuzzerUrl;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts !== undefined ? options.maxReconnectAttempts : -1;
    this.verbose = options.verbose !== undefined ? options.verbose : true;

    this.ws = null;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.isManuallyClosed = false;
    this._currentTestId = null;
    this._keepaliveTimer = null;

    // Validate window.ethereum exists
    if (typeof window === "undefined") {
      this._log("ERROR", "This module must run in a browser environment.");
      return;
    }

    if (!window.ethereum) {
      this._log("WARN", "window.ethereum is not available. Make sure MetaMask or another wallet is installed.");
    }
  }

  /**
   * Start the puppet: establish WebSocket connection and begin listening.
   */
  start() {
    this._log("INFO", `Starting Wallet Fuzzer Puppet, connecting to ${this.fuzzerUrl}`);
    this.isManuallyClosed = false;
    this._connect();
  }

  /**
   * Stop the puppet: close the WebSocket connection.
   */
  stop() {
    this._log("INFO", "Stopping Wallet Fuzzer Puppet");
    this.isManuallyClosed = true;
    this._stopKeepalive();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Establish WebSocket connection with fuzzer.
   * @private
   */
  _connect() {
    try {
      this.ws = new WebSocket(this.fuzzerUrl);

      this.ws.onopen = () => {
        this._log("SUCCESS", "Connected to Fuzzer WebSocket");
        this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        this._startKeepalive();
      };

      this.ws.onmessage = (event) => {
        this._handleIncomingPayload(event.data);
      };

      this.ws.onerror = (error) => {
        this._log("ERROR", `WebSocket error: ${error.message || "Unknown error"}`);
      };

      this.ws.onclose = () => {
        this._log("WARN", "WebSocket connection closed");
        this._stopKeepalive();
        if (!this.isManuallyClosed) {
          this._scheduleReconnect();
        }
      };
    } catch (error) {
      this._log("ERROR", `Failed to create WebSocket: ${error.message}`);
      if (!this.isManuallyClosed) {
        this._scheduleReconnect();
      }
    }
  }

  /**
   * Schedule a reconnection attempt.
   * @private
   */
  _scheduleReconnect() {
    // Check if we've exceeded max reconnection attempts
    if (this.maxReconnectAttempts !== -1 && this.reconnectAttempts >= this.maxReconnectAttempts) {
      this._log("ERROR", `Max reconnection attempts (${this.maxReconnectAttempts}) exceeded. Giving up.`);
      return;
    }

    this.reconnectAttempts++;
    this._log("INFO", `Reconnecting in ${this.reconnectInterval}ms (attempt ${this.reconnectAttempts})`);

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      this._connect();
    }, this.reconnectInterval);
  }

  /**
   * Handle incoming payload from the Fuzzer.
   * Parse, validate, and forward to wallet.
   * 
   * @param {string} data - Raw JSON message from the Fuzzer
   * @private
   */
  _handleIncomingPayload(data) {
    try {
      const envelope = JSON.parse(data);
      this._log("INFO", "Received message from Fuzzer:");
      this._log("PAYLOAD", envelope);

      if (envelope.type === "server_ping") {
        this._sendFeedback({ status: "pong", ping_id: envelope.ping_id });
        return;
      }

      // Control message from backend (e.g. welcome on connect)
      if (envelope.status && !envelope.method && !envelope.mutation) {
        this._log("INFO", `Fuzzer control: ${envelope.message || envelope.status}`);
        return;
      }

      this._currentTestId = envelope.test_id || null;

      // Backend wraps RPC in { mutation: { method, params }, test_id, ... }
      const payload = envelope.mutation && typeof envelope.mutation === "object"
        ? envelope.mutation
        : envelope;

      if (payload.is_sequence && Array.isArray(payload.sequence)) {
        if (envelope.test_id) payload.test_id = envelope.test_id;
        if (envelope.strategy) payload.strategy = envelope.strategy;
        this._forwardSequence(payload);
        return;
      }

      if (!payload.method) {
        throw new Error("Payload missing required 'method' field");
      }

      if (payload.params === undefined) {
        throw new Error("Payload missing 'params'");
      }

      const rpcPayload = {
        method: payload.method,
        params: payload.params
      };
      if (envelope.test_id) {
        rpcPayload.test_id = envelope.test_id;
      }
      if (envelope.strategy) {
        rpcPayload.strategy = envelope.strategy;
      }

      this._forwardToWallet(rpcPayload);
    } catch (error) {
      this._log("ERROR", `Failed to parse incoming payload: ${error.message}`);
      this._sendFeedback({
        status: "error",
        message: `Parsing error: ${error.message}`
      });
    }
  }

  /**
   * Resolve the currently authorized EVM account.
   * @private
   */
  async _getConnectedAccount() {
    let accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts || !accounts.length) {
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    }
    if (!accounts || !accounts.length) {
      throw new Error("No authorized account. Connect wallet in DApp first.");
    }
    return accounts[0];
  }

  /**
   * Replace placeholder `from` / signer addresses with the connected account
   * so wallets do not reject with 4100 before showing a popup.
   * @private
   */
  _normalizeParamsForWallet(method, params, account) {
    const normalized = JSON.parse(JSON.stringify(params));
    const first = normalized[0];

    if (first && typeof first === "object" && first.from) {
      if (first.from.toLowerCase() !== account.toLowerCase()) {
        this._log("WARN", `Replacing tx.from ${first.from} -> ${account}`);
        first.from = account;
      }
    }

    if (
      (method === "personal_sign" || method === "eth_sign") &&
      normalized.length >= 2 &&
      typeof normalized[1] === "string" &&
      normalized[1].startsWith("0x") &&
      normalized[1].toLowerCase() !== account.toLowerCase()
    ) {
      this._log("WARN", `Replacing signer ${normalized[1]} -> ${account}`);
      normalized[1] = account;
    }

    return normalized;
  }

  /**
   * Execute sequence hijacking: rapid-fire multiple RPC requests.
   * @param {Object} payload - { is_sequence, sequence, delay_ms }
   * @private
   */
  async _forwardSequence(payload) {
    if (!window.ethereum) {
      this._log("ERROR", "window.ethereum is not available.");
      this._sendFeedback({ status: "error", message: "No wallet" });
      return;
    }

    const delay = payload.delay_ms || 50;
    this._log(
      "WARN",
      `执行时序劫持攻击，连续 ${payload.sequence.length} 个请求（间隔 ${delay}ms）`
    );

    try {
      const account = await this._getConnectedAccount();
      for (const req of payload.sequence) {
        const params = this._normalizeParamsForWallet(
          req.method,
          req.params,
          account
        );
        window.ethereum
          .request({ method: req.method, params })
          .catch((e) => this._log("ERROR", `[sequence] ${req.method}: ${e.message}`));
        await new Promise((r) => setTimeout(r, delay));
      }
      this._sendFeedback({ status: "success", action: "sequence_invoked" });
    } catch (error) {
      this._sendFeedback({
        status: "error",
        message: error.message || "Sequence failed"
      });
    }
  }

  /**
   * Forward the RPC payload to the connected wallet.
   * 
   * @param {Object} payload - RPC payload with 'method' and 'params'
   * @private
   */
  async _forwardToWallet(payload) {
    // Check if wallet is available
    if (!window.ethereum) {
      const errorMsg = "window.ethereum is not available. No wallet connected.";
      this._log("ERROR", errorMsg);
      this._sendFeedback({
        status: "error",
        message: errorMsg
      });
      return;
    }

    try {
      const account = await this._getConnectedAccount();
      const params = this._normalizeParamsForWallet(
        payload.method,
        payload.params,
        account
      );

      this._log("INFO", `Forwarding RPC call to wallet: ${payload.method} (from ${account})`);
      if (payload.method === "personal_sign" && typeof logPersonalSignRequest === "function") {
        logPersonalSignRequest(params, (msg) => this._log("INFO", msg));
      }

      // Send the request to the wallet
      const result = await window.ethereum.request({
        method: payload.method,
        params: params
      });

      if (payload.method === "personal_sign" && typeof logPersonalSignResult === "function") {
        logPersonalSignResult(result, (msg) => this._log("SUCCESS", msg));
      } else {
        this._log("SUCCESS", `Wallet request succeeded. Result: ${JSON.stringify(result)}`);
      }

      // Send success feedback to the Fuzzer
      this._sendFeedback({
        status: "success",
        action: "wallet_invoked",
        result: result
      });
    } catch (error) {
      // Catch wallet errors (user rejection, invalid params, etc.)
      const errorMessage = error.message || "Unknown wallet error";
      const errorCode = error.code || null;

      this._log("ERROR", `Wallet request failed: [${errorCode}] ${errorMessage}`);

      // Send error feedback to the Fuzzer
      this._sendFeedback({
        status: "error",
        message: errorMessage,
        code: errorCode
      });
    }
  }

  /**
   * Periodic ping to keep WebSocket alive during long campaigns.
   * @private
   */
  _startKeepalive() {
    this._stopKeepalive();
    this._keepaliveTimer = setInterval(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }
      try {
        this.ws.send(JSON.stringify({ type: "ping", ts: Date.now() }));
      } catch (error) {
        this._log("WARN", `Keepalive ping failed: ${error.message}`);
      }
    }, 25000);
  }

  /**
   * @private
   */
  _stopKeepalive() {
    if (this._keepaliveTimer) {
      clearInterval(this._keepaliveTimer);
      this._keepaliveTimer = null;
    }
  }

  /**
   * Send feedback to the Fuzzer via WebSocket.
   * 
   * @param {Object} feedbackData - Feedback object to send back to Fuzzer
   * @private
   */
  _sendFeedback(feedbackData, testId) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this._log("WARN", "Cannot send feedback: WebSocket not connected");
      return;
    }

    const resolvedTestId = testId !== undefined ? testId : this._currentTestId;
    const payload = resolvedTestId
      ? { ...feedbackData, test_id: resolvedTestId }
      : feedbackData;

    try {
      const message = JSON.stringify(payload);
      this.ws.send(message);
      this._log("INFO", "Sent feedback to Fuzzer:", payload);
    } catch (error) {
      this._log("ERROR", `Failed to send feedback: ${error.message}`);
    }
  }

  /**
   * Internal logging function with log levels and styling.
   * 
   * @param {string} level - Log level (INFO, SUCCESS, WARN, ERROR, PAYLOAD)
   * @param {...any} args - Arguments to log
   * @private
   */
  _log(level, ...args) {
    if (!this.verbose && level !== "ERROR") {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[WalletFuzzerPuppet ${timestamp}] [${level}]`;

    const styles = {
      INFO: "color: #0099ff; font-weight: bold;",
      SUCCESS: "color: #00cc00; font-weight: bold;",
      WARN: "color: #ffaa00; font-weight: bold;",
      ERROR: "color: #ff0000; font-weight: bold;",
      PAYLOAD: "color: #9900ff; font-weight: bold;"
    };

    const style = styles[level] || "color: #999;";

    console.log(`%c${prefix}`, style, ...args);
  }

  /**
   * Get current connection status.
   * 
   * @returns {string} Connection status: "connected", "disconnected", or "reconnecting"
   */
  getStatus() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return "connected";
    } else if (this.reconnectTimer) {
      return "reconnecting";
    } else {
      return "disconnected";
    }
  }

  /**
   * Get detailed connection info for debugging.
   * 
   * @returns {Object} Detailed status information
   */
  getDetailedStatus() {
    return {
      status: this.getStatus(),
      fuzzerUrl: this.fuzzerUrl,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      walletAvailable: !!window.ethereum,
      wsReadyState: this.ws ? this.ws.readyState : null
    };
  }
}

// ============================================================================
// Export for different module systems
// ============================================================================

// CommonJS export (for Node.js environments or bundlers)
if (typeof module !== "undefined" && module.exports) {
  module.exports = WalletFuzzerPuppet;
}

// ES6 named export (for ES6 modules)
if (typeof exports !== "undefined") {
  exports.WalletFuzzerPuppet = WalletFuzzerPuppet;
}

// Global export (for browser script tag usage)
if (typeof window !== "undefined") {
  window.WalletFuzzerPuppet = WalletFuzzerPuppet;
}
