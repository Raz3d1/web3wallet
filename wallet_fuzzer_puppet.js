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
      };

      this.ws.onmessage = (event) => {
        this._handleIncomingPayload(event.data);
      };

      this.ws.onerror = (error) => {
        this._log("ERROR", `WebSocket error: ${error.message || "Unknown error"}`);
      };

      this.ws.onclose = () => {
        this._log("WARN", "WebSocket connection closed");
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
      const payload = JSON.parse(data);
      this._log("INFO", "Received payload from Fuzzer:");
      this._log("PAYLOAD", payload);

      // Validate payload structure
      if (!payload.method) {
        throw new Error("Payload missing required 'method' field");
      }

      if (!Array.isArray(payload.params)) {
        throw new Error("Payload 'params' must be an array");
      }

      // Forward to wallet
      this._forwardToWallet(payload);
    } catch (error) {
      this._log("ERROR", `Failed to parse incoming payload: ${error.message}`);
      this._sendFeedback({
        status: "error",
        message: `Parsing error: ${error.message}`
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
      this._log("INFO", `Forwarding RPC call to wallet: ${payload.method}`);

      // Send the request to the wallet
      const result = await window.ethereum.request({
        method: payload.method,
        params: payload.params
      });

      this._log("SUCCESS", `Wallet request succeeded. Result: ${JSON.stringify(result)}`);

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
   * Send feedback to the Fuzzer via WebSocket.
   * 
   * @param {Object} feedbackData - Feedback object to send back to Fuzzer
   * @private
   */
  _sendFeedback(feedbackData) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this._log("WARN", "Cannot send feedback: WebSocket not connected");
      return;
    }

    try {
      const message = JSON.stringify(feedbackData);
      this.ws.send(message);
      this._log("INFO", "Sent feedback to Fuzzer:", feedbackData);
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
