/* 本文件由 generate_rpc_support_catalog.js 从两份规范化 JSON 生成，请勿手工维护方法列表。 */
(function (global) {
  "use strict";
  global.RPC_SUPPORT_CATALOG = Object.freeze([
  {
    "method": "debug_getBadBlocks",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "debug_getBadBlocks"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "debug_getRawBlock",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "debug_getRawBlock"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "debug_getRawBlockAccessList",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "debug_getRawBlockAccessList"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "debug_getRawHeader",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "debug_getRawHeader"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "debug_getRawReceipts",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "debug_getRawReceipts"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "debug_getRawTransaction",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "debug_getRawTransaction"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_exchangeCapabilities",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_exchangeCapabilities"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_exchangeTransitionConfigurationV1",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_exchangeTransitionConfigurationV1"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_forkchoiceUpdatedV1",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_forkchoiceUpdatedV1"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_forkchoiceUpdatedV2",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_forkchoiceUpdatedV2"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_forkchoiceUpdatedV3",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_forkchoiceUpdatedV3"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_forkchoiceUpdatedV4",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_forkchoiceUpdatedV4"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getBlobsV1",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getBlobsV1"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getBlobsV2",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getBlobsV2"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getBlobsV3",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getBlobsV3"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getBlobsV4",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getBlobsV4"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadBodiesByHashV1",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadBodiesByHashV1"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadBodiesByHashV2",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadBodiesByHashV2"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadBodiesByRangeV1",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadBodiesByRangeV1"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadBodiesByRangeV2",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadBodiesByRangeV2"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadV1",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadV1"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadV2",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadV2"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadV3",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadV3"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadV4",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadV4"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadV5",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadV5"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_getPayloadV6",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_getPayloadV6"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_newPayloadV1",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_newPayloadV1"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_newPayloadV2",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_newPayloadV2"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_newPayloadV3",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_newPayloadV3"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_newPayloadV4",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_newPayloadV4"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "engine_newPayloadV5",
    "sources": [
      "ethereum"
    ],
    "category": "Engine API（共识层/执行层内部通信）",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "engine_newPayloadV5"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "eth_accounts",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "array",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_blobBaseFee",
    "sources": [
      "ethereum"
    ],
    "category": "交易模拟、Gas 估算与交易准备",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "hex",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_blockNumber",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "hex",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_call",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "交易模拟、Gas 估算与交易准备",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      {
        "to": "0x0000000000000000000000000000000000000000",
        "data": "0x"
      },
      "latest"
    ],
    "expectedResult": "hex",
    "rationale": "零地址、空 calldata、无金额的只读调用。"
  },
  {
    "method": "eth_capabilities",
    "sources": [
      "ethereum"
    ],
    "category": "客户端/网络状态与能力查询",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "object",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_chainId",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "客户端/网络状态与能力查询",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "hex",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_coinbase",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "客户端/网络状态与能力查询",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "stringOrNull",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_config",
    "sources": [
      "ethereum"
    ],
    "category": "客户端/网络状态与能力查询",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "object",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_createAccessList",
    "sources": [
      "ethereum"
    ],
    "category": "交易模拟、Gas 估算与交易准备",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      {
        "to": "0x0000000000000000000000000000000000000000",
        "data": "0x",
        "value": "0x0"
      },
      "latest"
    ],
    "expectedResult": "object",
    "rationale": "零金额、空 calldata，仅创建访问列表。"
  },
  {
    "method": "eth_decrypt",
    "sources": [
      "metamask"
    ],
    "category": "签名、加密与密钥相关接口",
    "riskLevel": "signature",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "decrypt",
    "expectedResult": "anyDefined",
    "rationale": "缺少安全测试密文。",
    "manualInstruction": "需要专门生成的测试密文与当前账户；不得使用敏感业务数据。"
  },
  {
    "method": "eth_estimateGas",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "交易模拟、Gas 估算与交易准备",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      {
        "to": "0x0000000000000000000000000000000000000000",
        "data": "0x",
        "value": "0x0"
      }
    ],
    "expectedResult": "hex",
    "rationale": "零金额、空 calldata 的估算，不提交交易。"
  },
  {
    "method": "eth_feeHistory",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "交易模拟、Gas 估算与交易准备",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x1",
      "latest",
      []
    ],
    "expectedResult": "object",
    "rationale": "只读取一个区块且不请求奖励分位。"
  },
  {
    "method": "eth_gasPrice",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "交易模拟、Gas 估算与交易准备",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "hex",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_getBalance",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000",
      "latest"
    ],
    "expectedResult": "hex",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getBlockAccessList",
    "sources": [
      "ethereum"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_getBlockAccessList",
      "eth_getBlockAccessList.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "latest"
    ],
    "expectedResult": "anyDefined",
    "rationale": "使用 latest 的只读访问列表查询。"
  },
  {
    "method": "eth_getBlockByHash",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      false
    ],
    "expectedResult": "objectOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getBlockByNumber",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "latest",
      false
    ],
    "expectedResult": "objectOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getBlockReceipts",
    "sources": [
      "ethereum"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "latest"
    ],
    "expectedResult": "arrayOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getBlockTransactionCountByHash",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ],
    "expectedResult": "hexOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getBlockTransactionCountByNumber",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "latest"
    ],
    "expectedResult": "hexOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getCode",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000",
      "latest"
    ],
    "expectedResult": "hex",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getEncryptionPublicKey",
    "sources": [
      "metamask"
    ],
    "category": "签名、加密与密钥相关接口",
    "riskLevel": "signature",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "encryptionPublicKey",
    "expectedResult": "anyDefined",
    "rationale": "依赖账户授权。",
    "manualInstruction": "需要已连接账户并可能弹窗；请先单独连接 eth_requestAccounts。"
  },
  {
    "method": "eth_getFilterChanges",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_getFilterChanges",
      "eth_getFilterChanges.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "not-a-filter-id"
    ],
    "expectedResult": "anyDefined",
    "rationale": "方法专属的强类型/参数个数错误；即使实现忽略多余参数，查询范围仍严格有界。"
  },
  {
    "method": "eth_getFilterLogs",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_getFilterLogs",
      "eth_getFilterLogs.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "not-a-filter-id"
    ],
    "expectedResult": "anyDefined",
    "rationale": "方法专属的强类型/参数个数错误；即使实现忽略多余参数，查询范围仍严格有界。"
  },
  {
    "method": "eth_getLogs",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      {
        "fromBlock": "latest",
        "toBlock": "latest",
        "address": "0x0000000000000000000000000000000000000000"
      }
    ],
    "expectedResult": "array",
    "rationale": "仅查询 latest 单一区块与零地址，避免全量日志。"
  },
  {
    "method": "eth_getProof",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000",
      [],
      "latest"
    ],
    "expectedResult": "object",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getStorageAt",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000",
      "0x0",
      "latest"
    ],
    "expectedResult": "hex",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getStorageValues",
    "sources": [
      "ethereum"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_getStorageValues",
      "eth_getStorageValues.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "0x0000000000000000000000000000000000000000",
      [],
      "latest"
    ],
    "expectedResult": "anyDefined",
    "rationale": "使用空 storage key 列表的有界查询。"
  },
  {
    "method": "eth_getTransactionByBlockHashAndIndex",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x0"
    ],
    "expectedResult": "objectOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getTransactionByBlockNumberAndIndex",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "latest",
      "0x0"
    ],
    "expectedResult": "objectOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getTransactionByHash",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ],
    "expectedResult": "objectOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getTransactionCount",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000",
      "latest"
    ],
    "expectedResult": "hex",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getTransactionReceipt",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ],
    "expectedResult": "objectOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getUncleCountByBlockHash",
    "sources": [
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ],
    "expectedResult": "hexOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_getUncleCountByBlockNumber",
    "sources": [
      "metamask"
    ],
    "category": "链上数据查询与只读接口",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [
      "latest"
    ],
    "expectedResult": "hexOrNull",
    "rationale": "使用零地址、零哈希或 latest 的有界只读查询。"
  },
  {
    "method": "eth_maxPriorityFeePerGas",
    "sources": [
      "ethereum"
    ],
    "category": "交易模拟、Gas 估算与交易准备",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "hex",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_newBlockFilter",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_newBlockFilter",
      "eth_newBlockFilter.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      true
    ],
    "expectedResult": "anyDefined",
    "rationale": "方法专属的强类型/参数个数错误；即使实现忽略多余参数，查询范围仍严格有界。"
  },
  {
    "method": "eth_newFilter",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_newFilter",
      "eth_newFilter.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      {
        "fromBlock": "latest",
        "toBlock": "latest",
        "address": "0x0000000000000000000000000000000000000000"
      },
      true
    ],
    "expectedResult": "anyDefined",
    "rationale": "方法专属的强类型/参数个数错误；即使实现忽略多余参数，查询范围仍严格有界。"
  },
  {
    "method": "eth_newPendingTransactionFilter",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_newPendingTransactionFilter",
      "eth_newPendingTransactionFilter.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      true
    ],
    "expectedResult": "anyDefined",
    "rationale": "方法专属的强类型/参数个数错误；即使实现忽略多余参数，查询范围仍严格有界。"
  },
  {
    "method": "eth_requestAccounts",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "requestAccounts",
    "expectedResult": "anyDefined",
    "rationale": "账户连接需要用户上下文，禁止在自动队列中弹窗。",
    "manualInstruction": "将触发连接账户弹窗。请单独测试；拒绝（4001）也可确认钱包识别该方法。"
  },
  {
    "method": "eth_sendRawTransaction",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "正式交易接口",
    "riskLevel": "transaction",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "unsafe_unverifiable",
    "expectedResult": "hex",
    "rationale": "需要真实已签名交易并会直接广播，无法构造无副作用探针。",
    "manualInstruction": "不可安全验证：不得自动或默认手动发送真实已签名交易。"
  },
  {
    "method": "eth_sendTransaction",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "正式交易接口",
    "riskLevel": "transaction",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_reject",
    "paramsTemplate": "sendTransaction",
    "expectedResult": "anyDefined",
    "rationale": "签名或交易请求必须逐项由用户明确触发并拒绝。",
    "manualInstruction": "强警告：即将请求零金额自转账。请在钱包弹窗中拒绝；若确认仍可能消耗 Gas。主网将显示额外警告。需要二次确认。"
  },
  {
    "method": "eth_sign",
    "sources": [
      "ethereum"
    ],
    "category": "签名、加密与密钥相关接口",
    "riskLevel": "signature",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_reject",
    "paramsTemplate": "ethSign",
    "expectedResult": "anyDefined",
    "rationale": "签名或交易请求必须逐项由用户明确触发并拒绝。",
    "manualInstruction": "将使用固定无敏感测试内容。请在钱包弹窗中拒绝；4001 可确认支持。需要二次确认。"
  },
  {
    "method": "eth_signTransaction",
    "sources": [
      "ethereum"
    ],
    "category": "签名、加密与密钥相关接口",
    "riskLevel": "signature",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_reject",
    "paramsTemplate": "signTransaction",
    "expectedResult": "anyDefined",
    "rationale": "签名或交易请求必须逐项由用户明确触发并拒绝。",
    "manualInstruction": "将使用固定无敏感测试内容。请在钱包弹窗中拒绝；4001 可确认支持。需要二次确认。"
  },
  {
    "method": "eth_signTypedData_v4",
    "sources": [
      "metamask"
    ],
    "category": "签名、加密与密钥相关接口",
    "riskLevel": "signature",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_reject",
    "paramsTemplate": "typedData",
    "expectedResult": "anyDefined",
    "rationale": "签名或交易请求必须逐项由用户明确触发并拒绝。",
    "manualInstruction": "将使用固定无敏感测试内容。请在钱包弹窗中拒绝；4001 可确认支持。需要二次确认。"
  },
  {
    "method": "eth_simulateV1",
    "sources": [
      "ethereum"
    ],
    "category": "交易模拟、Gas 估算与交易准备",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_simulateV1",
      "eth_simulateV1.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      {
        "blockStateCalls": []
      },
      "latest"
    ],
    "expectedResult": "anyDefined",
    "rationale": "使用空调用集合进行模拟。"
  },
  {
    "method": "eth_subscribe",
    "sources": [
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_subscribe",
      "eth_subscribe.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "__rpc_support_invalid_subscription_type__"
    ],
    "expectedResult": "anyDefined",
    "rationale": "方法专属的强类型/参数个数错误；即使实现忽略多余参数，查询范围仍严格有界。"
  },
  {
    "method": "eth_syncing",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "客户端/网络状态与能力查询",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "booleanOrObject",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "eth_uninstallFilter",
    "sources": [
      "ethereum",
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_uninstallFilter",
      "eth_uninstallFilter.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "not-a-filter-id"
    ],
    "expectedResult": "anyDefined",
    "rationale": "方法专属的强类型/参数个数错误；即使实现忽略多余参数，查询范围仍严格有界。"
  },
  {
    "method": "eth_unsubscribe",
    "sources": [
      "metamask"
    ],
    "category": "过滤器、订阅与事件监听",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*eth_unsubscribe",
      "eth_unsubscribe.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "not-a-subscription-id"
    ],
    "expectedResult": "anyDefined",
    "rationale": "方法专属的强类型/参数个数错误；即使实现忽略多余参数，查询范围仍严格有界。"
  },
  {
    "method": "net_version",
    "sources": [
      "ethereum"
    ],
    "category": "客户端/网络状态与能力查询",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "string",
    "rationale": "标准无参只读查询；必须使用空 params。"
  },
  {
    "method": "personal_sign",
    "sources": [
      "metamask"
    ],
    "category": "签名、加密与密钥相关接口",
    "riskLevel": "signature",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_reject",
    "paramsTemplate": "personalSign",
    "expectedResult": "anyDefined",
    "rationale": "签名或交易请求必须逐项由用户明确触发并拒绝。",
    "manualInstruction": "将使用固定无敏感测试内容。请在钱包弹窗中拒绝；4001 可确认支持。需要二次确认。"
  },
  {
    "method": "testing_buildBlockV1",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "testing_buildBlockV1"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "txpool_content",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "txpool_content"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "txpool_contentFrom",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "txpool_contentFrom"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "txpool_status",
    "sources": [
      "ethereum"
    ],
    "category": "调试、测试与交易池接口",
    "riskLevel": "internal",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "internal_skip",
    "probeParams": [
      {
        "__invalidInternalProbeFor": "txpool_status"
      }
    ],
    "expectedResult": "anyDefined",
    "rationale": "节点内部接口，默认不调用；可选探测只反映上游节点或钱包安全策略。",
    "manualInstruction": "仅在隔离环境探测节点内部接口；结果不计入钱包功能支持。"
  },
  {
    "method": "wallet_addEthereumChain",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "addChain",
    "expectedResult": "anyDefined",
    "rationale": "缺少由操作者审核的安全测试链配置。",
    "manualInstruction": "需要专用测试链配置，可能修改钱包网络列表；当前工具不构造未知链配置。"
  },
  {
    "method": "wallet_getCallsStatus",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*wallet_getCallsStatus",
      "wallet_getCallsStatus.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "0x00000000000000000000000000000000"
    ],
    "expectedResult": "anyDefined",
    "rationale": "使用不存在的固定调用批次标识。"
  },
  {
    "method": "wallet_getCapabilities",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "expected .*wallet_getCapabilities",
      "wallet_getCapabilities.*(parameter|argument)",
      "java.*onrequest"
    ],
    "probeMode": "recognition_only",
    "probeParams": [
      "0x0000000000000000000000000000000000000000"
    ],
    "expectedResult": "anyDefined",
    "rationale": "使用零地址查询能力，不请求权限。"
  },
  {
    "method": "wallet_getPermissions",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "wallet_getPermissions",
    "expectedResult": "anyDefined",
    "rationale": "权限请求依赖当前站点授权上下文。",
    "manualInstruction": "权限操作可能显示弹窗或改变授权，请在隔离测试钱包中逐项验证。"
  },
  {
    "method": "wallet_registerOnboarding",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "registerOnboarding",
    "expectedResult": "anyDefined",
    "rationale": "依赖钱包 UI 上下文。",
    "manualInstruction": "可能打开钱包引导页面，请逐项验证。"
  },
  {
    "method": "wallet_requestPermissions",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "wallet_requestPermissions",
    "expectedResult": "anyDefined",
    "rationale": "权限请求依赖当前站点授权上下文。",
    "manualInstruction": "权限操作可能显示弹窗或改变授权，请在隔离测试钱包中逐项验证。"
  },
  {
    "method": "wallet_revokePermissions",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "wallet_revokePermissions",
    "expectedResult": "anyDefined",
    "rationale": "权限请求依赖当前站点授权上下文。",
    "manualInstruction": "权限操作可能显示弹窗或改变授权，请在隔离测试钱包中逐项验证。"
  },
  {
    "method": "wallet_scanQRCode",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "scanQRCode",
    "expectedResult": "anyDefined",
    "rationale": "需要人工扫码上下文。",
    "manualInstruction": "会打开扫码界面；不要扫描真实付款或授权二维码。"
  },
  {
    "method": "wallet_sendCalls",
    "sources": [
      "metamask"
    ],
    "category": "正式交易接口",
    "riskLevel": "transaction",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_reject",
    "paramsTemplate": "sendCalls",
    "expectedResult": "anyDefined",
    "rationale": "签名或交易请求必须逐项由用户明确触发并拒绝。",
    "manualInstruction": "将使用固定无敏感测试内容。请在钱包弹窗中拒绝；4001 可确认支持。需要二次确认。"
  },
  {
    "method": "wallet_switchEthereumChain",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "switchChain",
    "expectedResult": "anyDefined",
    "rationale": "切链具有可见状态变化，不能自动执行。",
    "manualInstruction": "可能切换当前网络；需要操作者提供并审核目标测试 chainId。"
  },
  {
    "method": "wallet_watchAsset",
    "sources": [
      "metamask"
    ],
    "category": "钱包账户、权限、网络、资产与交互管理",
    "riskLevel": "interactive",
    "timeoutMs": 120000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "manual_context",
    "paramsTemplate": "watchAsset",
    "expectedResult": "anyDefined",
    "rationale": "缺少安全测试代币地址。",
    "manualInstruction": "会请求添加资产，必须使用专门的无价值测试代币上下文。"
  },
  {
    "method": "web3_clientVersion",
    "sources": [
      "metamask"
    ],
    "category": "客户端/网络状态与能力查询",
    "riskLevel": "safe",
    "timeoutMs": 10000,
    "recognitionPatterns": [
      "invalid params",
      "invalid parameter",
      "invalid argument",
      "missing required",
      "java.*onrequest"
    ],
    "probeMode": "safe_valid",
    "probeParams": [],
    "expectedResult": "string",
    "rationale": "标准无参只读查询；必须使用空 params。"
  }
].map(function (entry) {
    Object.keys(entry).forEach(function (key) {
      if (entry[key] && typeof entry[key] === 'object') Object.freeze(entry[key]);
    });
    return Object.freeze(entry);
  }));
})(window);
