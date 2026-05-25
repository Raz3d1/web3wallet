/**
 * Wallet Fuzzer Puppet Module (TypeScript)
 * 
 * Type-safe version of the wallet fuzzer puppet for TypeScript projects.
 */

/**
 * Options for WalletFuzzerPuppet initialization.
 */
interface WalletFuzzerPuppetOptions {
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  verbose?: boolean;
}

/**
 * RPC Payload structure.
 */
interface RpcPayload {
  method: string;
  params: any[];
}

/**
 * Feedback structure sent back to the Fuzzer.
 */
interface FuzzerFeedback {
  status: "success" | "error";
  action?: string;
  message?: string;
  code?: number | null;
  result?: any;
}

/**
 * Connection status types.
 */
type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

/**
 * Detailed status information.
 */
interface DetailedStatus {
  status: ConnectionStatus;
  fuzzerUrl: string;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  walletAvailable: boolean;
  wsReadyState: number | null;
}

/**
 * Wallet Fuzzer Puppet - TypeScript implementation
 */
class WalletFuzzerPuppet {
  private fuzzerUrl: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private verbose: boolean;

  private ws: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isManuallyClosed: boolean = false;

  /**
   * Initialize the Wallet Fuzzer Puppet.
   * 
   * @param fuzzerUrl - WebSocket URL of the Python Fuzzer
   * @param options - Configuration options
   */
  constructor(fuzzerUrl: string, options: WalletFuzzerPuppetOptions = {}) {
    this.fuzzerUrl = fuzzerUrl;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts !== undefined ? options.maxReconnectAttempts : -1;
    this.verbose = options.verbose !== undefined ? options.verbose : true;

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
  start(): void {
    this._log("INFO", `Starting Wallet Fuzzer Puppet, connecting to ${this.fuzzerUrl}`);
    this.isManuallyClosed = false;
    this._connect();
  }

  /**
   * Stop the puppet: close the WebSocket connection.
   */
  stop(): void {
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
   */
  private _connect(): void {
    try {
      this.ws = new WebSocket(this.fuzzerUrl);

      this.ws.onopen = (): void => {
        this._log("SUCCESS", "Connected to Fuzzer WebSocket");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event: MessageEvent<string>): void => {
        this._handleIncomingPayload(event.data);
      };

      this.ws.onerror = (error: Event): void => {
        const errorMsg = (error as any).message || "Unknown error";
        this._log("ERROR", `WebSocket error: ${errorMsg}`);
      };

      this.ws.onclose = (): void => {
        this._log("WARN", "WebSocket connection closed");
        if (!this.isManuallyClosed) {
          this._scheduleReconnect();
        }
      };
    } catch (error) {
      const errorMsg = (error as Error).message || "Unknown error";
      this._log("ERROR", `Failed to create WebSocket: ${errorMsg}`);
      if (!this.isManuallyClosed) {
        this._scheduleReconnect();
      }
    }
  }

  /**
   * Schedule a reconnection attempt.
   */
  private _scheduleReconnect(): void {
    if (this.maxReconnectAttempts !== -1 && this.reconnectAttempts >= this.maxReconnectAttempts) {
      this._log("ERROR", `Max reconnection attempts (${this.maxReconnectAttempts}) exceeded. Giving up.`);
      return;
    }

    this.reconnectAttempts++;
    this._log("INFO", `Reconnecting in ${this.reconnectInterval}ms (attempt ${this.reconnectAttempts})`);

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout((): void => {
      this._connect();
    }, this.reconnectInterval);
  }

  /**
   * Handle incoming payload from the Fuzzer.
   */
  private _handleIncomingPayload(data: string): void {
    try {
      const envelope: Record<string, unknown> = JSON.parse(data);
      this._log("INFO", "Received message from Fuzzer:");
      this._log("PAYLOAD", envelope);

      if (envelope.status && !envelope.method && !envelope.mutation) {
        this._log("INFO", `Fuzzer control: ${envelope.message || envelope.status}`);
        return;
      }

      const raw = (envelope.mutation && typeof envelope.mutation === "object"
        ? envelope.mutation
        : envelope) as RpcPayload;

      if (!raw.method) {
        throw new Error("Payload missing required 'method' field");
      }

      if (!Array.isArray(raw.params)) {
        throw new Error("Payload 'params' must be an array");
      }

      const payload: RpcPayload = { method: raw.method, params: raw.params };
      this._forwardToWallet(payload);
    } catch (error) {
      const errorMsg = (error as Error).message || "Unknown error";
      this._log("ERROR", `Failed to parse incoming payload: ${errorMsg}`);
      this._sendFeedback({
        status: "error",
        message: `Parsing error: ${errorMsg}`
      });
    }
  }

  /**
   * Forward the RPC payload to the connected wallet.
   */
  private async _forwardToWallet(payload: RpcPayload): Promise<void> {
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
      const errorMessage = (error as Error).message || "Unknown wallet error";
      const errorCode = (error as any).code || null;

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
   */
  private _sendFeedback(feedbackData: FuzzerFeedback): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this._log("WARN", "Cannot send feedback: WebSocket not connected");
      return;
    }

    try {
      const message = JSON.stringify(feedbackData);
      this.ws.send(message);
      this._log("INFO", "Sent feedback to Fuzzer:", feedbackData);
    } catch (error) {
      const errorMsg = (error as Error).message || "Unknown error";
      this._log("ERROR", `Failed to send feedback: ${errorMsg}`);
    }
  }

  /**
   * Internal logging function with log levels and styling.
   */
  private _log(level: string, ...args: any[]): void {
    if (!this.verbose && level !== "ERROR") {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[WalletFuzzerPuppet ${timestamp}] [${level}]`;

    const styles: Record<string, string> = {
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
   */
  getStatus(): ConnectionStatus {
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
   */
  getDetailedStatus(): DetailedStatus {
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

// Export for TypeScript
export default WalletFuzzerPuppet;
export { WalletFuzzerPuppet, WalletFuzzerPuppetOptions, RpcPayload, FuzzerFeedback, ConnectionStatus, DetailedStatus };
