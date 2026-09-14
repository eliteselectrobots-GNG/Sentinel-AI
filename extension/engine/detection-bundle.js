"use strict";
var SentAIDetection = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // extension/engine/entry.ts
  var entry_exports = {};
  __export(entry_exports, {
    addAuditEvent: () => addAuditEvent,
    addScan: () => addScan,
    analyzeDomain: () => analyzeDomain,
    analyzeIocs: () => analyzeIocs,
    analyzeTactics: () => analyzeTactics,
    analyzeUrl: () => analyzeUrl,
    anomaliesFor: () => anomaliesFor,
    attachmentThreatFlags: () => attachmentThreatFlags,
    attributionMeta: () => attributionMeta,
    attributionOf: () => attributionOf,
    buildBriefing: () => buildBriefing,
    campaignClusters: () => campaignClusters,
    checkBlacklists: () => checkBlacklists,
    classMeta: () => classMeta,
    classifyEmail: () => classifyEmail,
    clearScans: () => clearScans,
    countScans: () => countScans,
    deleteScan: () => deleteScan,
    detectAttachments: () => detectAttachments,
    detectBecPatterns: () => detectBecPatterns,
    detectLanguage: () => detectLanguage,
    distanceKm: () => distanceKm,
    enrichIpInfra: () => enrichIpInfra,
    enrichIps: () => enrichIps,
    enrichWithDns: () => enrichWithDns,
    extractIocs: () => extractIocs,
    findScan: () => findScan,
    fingerprintInfra: () => fingerprintInfra,
    flagEmoji: () => flagEmoji,
    getOrgDomain: () => getOrgDomain,
    getOrgName: () => getOrgName,
    headerForensics: () => headerForensics,
    impersonationWatchlist: () => impersonationWatchlist,
    incidentSimilarity: () => incidentSimilarity,
    iocTotals: () => iocTotals,
    isPublicIpv4: () => isPublicIpv4,
    isTorExit: () => isTorExit,
    linkDisguise: () => linkDisguise,
    listAuditEvents: () => listAuditEvents,
    listScans: () => listScans,
    locationLabel: () => locationLabel,
    lookupDomainIntel: () => lookupDomainIntel,
    lookupGeo: () => lookupGeo,
    lookupMx: () => lookupMx,
    lookupWhois: () => lookupWhois,
    originIpOf: () => originIpOf,
    priorityOf: () => priorityOf,
    relatedCases: () => relatedCases,
    riskTone: () => riskTone,
    sampleEmail: () => sampleEmail,
    scanEmail: () => scanEmail,
    setOrgDomain: () => setOrgDomain,
    setOrgName: () => setOrgName,
    setStorageBridge: () => setStorageBridge,
    severityCount: () => severityCount,
    severityDistribution: () => severityDistribution,
    spoofingSignals: () => spoofingSignals,
    threatCorrelation: () => threatCorrelation,
    toStoredScan: () => toStoredScan,
    verifyEvidence: () => verifyEvidence
  });

  // node_modules/zod/v3/external.js
  var external_exports = {};
  __export(external_exports, {
    BRAND: () => BRAND,
    DIRTY: () => DIRTY,
    EMPTY_PATH: () => EMPTY_PATH,
    INVALID: () => INVALID,
    NEVER: () => NEVER,
    OK: () => OK,
    ParseStatus: () => ParseStatus,
    Schema: () => ZodType,
    ZodAny: () => ZodAny,
    ZodArray: () => ZodArray,
    ZodBigInt: () => ZodBigInt,
    ZodBoolean: () => ZodBoolean,
    ZodBranded: () => ZodBranded,
    ZodCatch: () => ZodCatch,
    ZodDate: () => ZodDate,
    ZodDefault: () => ZodDefault,
    ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
    ZodEffects: () => ZodEffects,
    ZodEnum: () => ZodEnum,
    ZodError: () => ZodError,
    ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
    ZodFunction: () => ZodFunction,
    ZodIntersection: () => ZodIntersection,
    ZodIssueCode: () => ZodIssueCode,
    ZodLazy: () => ZodLazy,
    ZodLiteral: () => ZodLiteral,
    ZodMap: () => ZodMap,
    ZodNaN: () => ZodNaN,
    ZodNativeEnum: () => ZodNativeEnum,
    ZodNever: () => ZodNever,
    ZodNull: () => ZodNull,
    ZodNullable: () => ZodNullable,
    ZodNumber: () => ZodNumber,
    ZodObject: () => ZodObject,
    ZodOptional: () => ZodOptional,
    ZodParsedType: () => ZodParsedType,
    ZodPipeline: () => ZodPipeline,
    ZodPromise: () => ZodPromise,
    ZodReadonly: () => ZodReadonly,
    ZodRecord: () => ZodRecord,
    ZodSchema: () => ZodType,
    ZodSet: () => ZodSet,
    ZodString: () => ZodString,
    ZodSymbol: () => ZodSymbol,
    ZodTransformer: () => ZodEffects,
    ZodTuple: () => ZodTuple,
    ZodType: () => ZodType,
    ZodUndefined: () => ZodUndefined,
    ZodUnion: () => ZodUnion,
    ZodUnknown: () => ZodUnknown,
    ZodVoid: () => ZodVoid,
    addIssueToContext: () => addIssueToContext,
    any: () => anyType,
    array: () => arrayType,
    bigint: () => bigIntType,
    boolean: () => booleanType,
    coerce: () => coerce,
    custom: () => custom,
    date: () => dateType,
    datetimeRegex: () => datetimeRegex,
    defaultErrorMap: () => en_default,
    discriminatedUnion: () => discriminatedUnionType,
    effect: () => effectsType,
    enum: () => enumType,
    function: () => functionType,
    getErrorMap: () => getErrorMap,
    getParsedType: () => getParsedType,
    instanceof: () => instanceOfType,
    intersection: () => intersectionType,
    isAborted: () => isAborted,
    isAsync: () => isAsync,
    isDirty: () => isDirty,
    isValid: () => isValid,
    late: () => late,
    lazy: () => lazyType,
    literal: () => literalType,
    makeIssue: () => makeIssue,
    map: () => mapType,
    nan: () => nanType,
    nativeEnum: () => nativeEnumType,
    never: () => neverType,
    null: () => nullType,
    nullable: () => nullableType,
    number: () => numberType,
    object: () => objectType,
    objectUtil: () => objectUtil,
    oboolean: () => oboolean,
    onumber: () => onumber,
    optional: () => optionalType,
    ostring: () => ostring,
    pipeline: () => pipelineType,
    preprocess: () => preprocessType,
    promise: () => promiseType,
    quotelessJson: () => quotelessJson,
    record: () => recordType,
    set: () => setType,
    setErrorMap: () => setErrorMap,
    strictObject: () => strictObjectType,
    string: () => stringType,
    symbol: () => symbolType,
    transformer: () => effectsType,
    tuple: () => tupleType,
    undefined: () => undefinedType,
    union: () => unionType,
    unknown: () => unknownType,
    util: () => util,
    void: () => voidType
  });

  // node_modules/zod/v3/helpers/util.js
  var util;
  (function(util2) {
    util2.assertEqual = (_) => {
    };
    function assertIs(_arg) {
    }
    util2.assertIs = assertIs;
    function assertNever(_x) {
      throw new Error();
    }
    util2.assertNever = assertNever;
    util2.arrayToEnum = (items) => {
      const obj = {};
      for (const item of items) {
        obj[item] = item;
      }
      return obj;
    };
    util2.getValidEnumValues = (obj) => {
      const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
      const filtered = {};
      for (const k of validKeys) {
        filtered[k] = obj[k];
      }
      return util2.objectValues(filtered);
    };
    util2.objectValues = (obj) => {
      return util2.objectKeys(obj).map(function(e) {
        return obj[e];
      });
    };
    util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
      const keys = [];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          keys.push(key);
        }
      }
      return keys;
    };
    util2.find = (arr, checker) => {
      for (const item of arr) {
        if (checker(item))
          return item;
      }
      return void 0;
    };
    util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
      return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
    }
    util2.joinValues = joinValues;
    util2.jsonStringifyReplacer = (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    };
  })(util || (util = {}));
  var objectUtil;
  (function(objectUtil2) {
    objectUtil2.mergeShapes = (first, second) => {
      return {
        ...first,
        ...second
        // second overwrites first
      };
    };
  })(objectUtil || (objectUtil = {}));
  var ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
  ]);
  var getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
      case "undefined":
        return ZodParsedType.undefined;
      case "string":
        return ZodParsedType.string;
      case "number":
        return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
      case "boolean":
        return ZodParsedType.boolean;
      case "function":
        return ZodParsedType.function;
      case "bigint":
        return ZodParsedType.bigint;
      case "symbol":
        return ZodParsedType.symbol;
      case "object":
        if (Array.isArray(data)) {
          return ZodParsedType.array;
        }
        if (data === null) {
          return ZodParsedType.null;
        }
        if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
          return ZodParsedType.promise;
        }
        if (typeof Map !== "undefined" && data instanceof Map) {
          return ZodParsedType.map;
        }
        if (typeof Set !== "undefined" && data instanceof Set) {
          return ZodParsedType.set;
        }
        if (typeof Date !== "undefined" && data instanceof Date) {
          return ZodParsedType.date;
        }
        return ZodParsedType.object;
      default:
        return ZodParsedType.unknown;
    }
  };

  // node_modules/zod/v3/ZodError.js
  var ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite"
  ]);
  var quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
  };
  var ZodError = class _ZodError extends Error {
    get errors() {
      return this.issues;
    }
    constructor(issues) {
      super();
      this.issues = [];
      this.addIssue = (sub) => {
        this.issues = [...this.issues, sub];
      };
      this.addIssues = (subs = []) => {
        this.issues = [...this.issues, ...subs];
      };
      const actualProto = new.target.prototype;
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(this, actualProto);
      } else {
        this.__proto__ = actualProto;
      }
      this.name = "ZodError";
      this.issues = issues;
    }
    format(_mapper) {
      const mapper = _mapper || function(issue) {
        return issue.message;
      };
      const fieldErrors = { _errors: [] };
      const processError = (error) => {
        for (const issue of error.issues) {
          if (issue.code === "invalid_union") {
            issue.unionErrors.map(processError);
          } else if (issue.code === "invalid_return_type") {
            processError(issue.returnTypeError);
          } else if (issue.code === "invalid_arguments") {
            processError(issue.argumentsError);
          } else if (issue.path.length === 0) {
            fieldErrors._errors.push(mapper(issue));
          } else {
            let curr = fieldErrors;
            let i = 0;
            while (i < issue.path.length) {
              const el = issue.path[i];
              const terminal = i === issue.path.length - 1;
              if (!terminal) {
                curr[el] = curr[el] || { _errors: [] };
              } else {
                curr[el] = curr[el] || { _errors: [] };
                curr[el]._errors.push(mapper(issue));
              }
              curr = curr[el];
              i++;
            }
          }
        }
      };
      processError(this);
      return fieldErrors;
    }
    static assert(value) {
      if (!(value instanceof _ZodError)) {
        throw new Error(`Not a ZodError: ${value}`);
      }
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
      const fieldErrors = {};
      const formErrors = [];
      for (const sub of this.issues) {
        if (sub.path.length > 0) {
          const firstEl = sub.path[0];
          fieldErrors[firstEl] = fieldErrors[firstEl] || [];
          fieldErrors[firstEl].push(mapper(sub));
        } else {
          formErrors.push(mapper(sub));
        }
      }
      return { formErrors, fieldErrors };
    }
    get formErrors() {
      return this.flatten();
    }
  };
  ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
  };

  // node_modules/zod/v3/locales/en.js
  var errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = "Required";
        } else {
          message = `Expected ${issue.expected}, received ${issue.received}`;
        }
        break;
      case ZodIssueCode.invalid_literal:
        message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
        break;
      case ZodIssueCode.unrecognized_keys:
        message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
        break;
      case ZodIssueCode.invalid_union:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
        break;
      case ZodIssueCode.invalid_enum_value:
        message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
        break;
      case ZodIssueCode.invalid_arguments:
        message = `Invalid function arguments`;
        break;
      case ZodIssueCode.invalid_return_type:
        message = `Invalid function return type`;
        break;
      case ZodIssueCode.invalid_date:
        message = `Invalid date`;
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("includes" in issue.validation) {
            message = `Invalid input: must include "${issue.validation.includes}"`;
            if (typeof issue.validation.position === "number") {
              message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
            }
          } else if ("startsWith" in issue.validation) {
            message = `Invalid input: must start with "${issue.validation.startsWith}"`;
          } else if ("endsWith" in issue.validation) {
            message = `Invalid input: must end with "${issue.validation.endsWith}"`;
          } else {
            util.assertNever(issue.validation);
          }
        } else if (issue.validation !== "regex") {
          message = `Invalid ${issue.validation}`;
        } else {
          message = "Invalid";
        }
        break;
      case ZodIssueCode.too_small:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "bigint")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.too_big:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "bigint")
          message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.custom:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = `Intersection results could not be merged`;
        break;
      case ZodIssueCode.not_multiple_of:
        message = `Number must be a multiple of ${issue.multipleOf}`;
        break;
      case ZodIssueCode.not_finite:
        message = "Number must be finite";
        break;
      default:
        message = _ctx.defaultError;
        util.assertNever(issue);
    }
    return { message };
  };
  var en_default = errorMap;

  // node_modules/zod/v3/errors.js
  var overrideErrorMap = en_default;
  function setErrorMap(map) {
    overrideErrorMap = map;
  }
  function getErrorMap() {
    return overrideErrorMap;
  }

  // node_modules/zod/v3/helpers/parseUtil.js
  var makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...issueData.path || []];
    const fullIssue = {
      ...issueData,
      path: fullPath
    };
    if (issueData.message !== void 0) {
      return {
        ...issueData,
        path: fullPath,
        message: issueData.message
      };
    }
    let errorMessage = "";
    const maps = errorMaps.filter((m) => !!m).slice().reverse();
    for (const map of maps) {
      errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
      ...issueData,
      path: fullPath,
      message: errorMessage
    };
  };
  var EMPTY_PATH = [];
  function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
      issueData,
      data: ctx.data,
      path: ctx.path,
      errorMaps: [
        ctx.common.contextualErrorMap,
        // contextual error map is first priority
        ctx.schemaErrorMap,
        // then schema-bound map if available
        overrideMap,
        // then global override map
        overrideMap === en_default ? void 0 : en_default
        // then global default map
      ].filter((x) => !!x)
    });
    ctx.common.issues.push(issue);
  }
  var ParseStatus = class _ParseStatus {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      if (this.value === "valid")
        this.value = "dirty";
    }
    abort() {
      if (this.value !== "aborted")
        this.value = "aborted";
    }
    static mergeArray(status, results) {
      const arrayValue = [];
      for (const s of results) {
        if (s.status === "aborted")
          return INVALID;
        if (s.status === "dirty")
          status.dirty();
        arrayValue.push(s.value);
      }
      return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
      const syncPairs = [];
      for (const pair of pairs) {
        const key = await pair.key;
        const value = await pair.value;
        syncPairs.push({
          key,
          value
        });
      }
      return _ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
      const finalObject = {};
      for (const pair of pairs) {
        const { key, value } = pair;
        if (key.status === "aborted")
          return INVALID;
        if (value.status === "aborted")
          return INVALID;
        if (key.status === "dirty")
          status.dirty();
        if (value.status === "dirty")
          status.dirty();
        if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
          finalObject[key.value] = value.value;
        }
      }
      return { status: status.value, value: finalObject };
    }
  };
  var INVALID = Object.freeze({
    status: "aborted"
  });
  var DIRTY = (value) => ({ status: "dirty", value });
  var OK = (value) => ({ status: "valid", value });
  var isAborted = (x) => x.status === "aborted";
  var isDirty = (x) => x.status === "dirty";
  var isValid = (x) => x.status === "valid";
  var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

  // node_modules/zod/v3/helpers/errorUtil.js
  var errorUtil;
  (function(errorUtil2) {
    errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
  })(errorUtil || (errorUtil = {}));

  // node_modules/zod/v3/types.js
  var ParseInputLazyPath = class {
    constructor(parent, value, path, key) {
      this._cachedPath = [];
      this.parent = parent;
      this.data = value;
      this._path = path;
      this._key = key;
    }
    get path() {
      if (!this._cachedPath.length) {
        if (Array.isArray(this._key)) {
          this._cachedPath.push(...this._path, ...this._key);
        } else {
          this._cachedPath.push(...this._path, this._key);
        }
      }
      return this._cachedPath;
    }
  };
  var handleResult = (ctx, result) => {
    if (isValid(result)) {
      return { success: true, data: result.value };
    } else {
      if (!ctx.common.issues.length) {
        throw new Error("Validation failed but no issues detected.");
      }
      return {
        success: false,
        get error() {
          if (this._error)
            return this._error;
          const error = new ZodError(ctx.common.issues);
          this._error = error;
          return this._error;
        }
      };
    }
  };
  function processCreateParams(params) {
    if (!params)
      return {};
    const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
    if (errorMap2 && (invalid_type_error || required_error)) {
      throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap2)
      return { errorMap: errorMap2, description };
    const customMap = (iss, ctx) => {
      const { message } = params;
      if (iss.code === "invalid_enum_value") {
        return { message: message ?? ctx.defaultError };
      }
      if (typeof ctx.data === "undefined") {
        return { message: message ?? required_error ?? ctx.defaultError };
      }
      if (iss.code !== "invalid_type")
        return { message: ctx.defaultError };
      return { message: message ?? invalid_type_error ?? ctx.defaultError };
    };
    return { errorMap: customMap, description };
  }
  var ZodType = class {
    get description() {
      return this._def.description;
    }
    _getType(input) {
      return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
      return ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      };
    }
    _processInputParams(input) {
      return {
        status: new ParseStatus(),
        ctx: {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        }
      };
    }
    _parseSync(input) {
      const result = this._parse(input);
      if (isAsync(result)) {
        throw new Error("Synchronous parse encountered promise.");
      }
      return result;
    }
    _parseAsync(input) {
      const result = this._parse(input);
      return Promise.resolve(result);
    }
    parse(data, params) {
      const result = this.safeParse(data, params);
      if (result.success)
        return result.data;
      throw result.error;
    }
    safeParse(data, params) {
      const ctx = {
        common: {
          issues: [],
          async: params?.async ?? false,
          contextualErrorMap: params?.errorMap
        },
        path: params?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const result = this._parseSync({ data, path: ctx.path, parent: ctx });
      return handleResult(ctx, result);
    }
    "~validate"(data) {
      const ctx = {
        common: {
          issues: [],
          async: !!this["~standard"].async
        },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      if (!this["~standard"].async) {
        try {
          const result = this._parseSync({ data, path: [], parent: ctx });
          return isValid(result) ? {
            value: result.value
          } : {
            issues: ctx.common.issues
          };
        } catch (err) {
          if (err?.message?.toLowerCase()?.includes("encountered")) {
            this["~standard"].async = true;
          }
          ctx.common = {
            issues: [],
            async: true
          };
        }
      }
      return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
        value: result.value
      } : {
        issues: ctx.common.issues
      });
    }
    async parseAsync(data, params) {
      const result = await this.safeParseAsync(data, params);
      if (result.success)
        return result.data;
      throw result.error;
    }
    async safeParseAsync(data, params) {
      const ctx = {
        common: {
          issues: [],
          contextualErrorMap: params?.errorMap,
          async: true
        },
        path: params?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
      const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
      return handleResult(ctx, result);
    }
    refine(check, message) {
      const getIssueProperties = (val) => {
        if (typeof message === "string" || typeof message === "undefined") {
          return { message };
        } else if (typeof message === "function") {
          return message(val);
        } else {
          return message;
        }
      };
      return this._refinement((val, ctx) => {
        const result = check(val);
        const setError = () => ctx.addIssue({
          code: ZodIssueCode.custom,
          ...getIssueProperties(val)
        });
        if (typeof Promise !== "undefined" && result instanceof Promise) {
          return result.then((data) => {
            if (!data) {
              setError();
              return false;
            } else {
              return true;
            }
          });
        }
        if (!result) {
          setError();
          return false;
        } else {
          return true;
        }
      });
    }
    refinement(check, refinementData) {
      return this._refinement((val, ctx) => {
        if (!check(val)) {
          ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
          return false;
        } else {
          return true;
        }
      });
    }
    _refinement(refinement) {
      return new ZodEffects({
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "refinement", refinement }
      });
    }
    superRefine(refinement) {
      return this._refinement(refinement);
    }
    constructor(def) {
      this.spa = this.safeParseAsync;
      this._def = def;
      this.parse = this.parse.bind(this);
      this.safeParse = this.safeParse.bind(this);
      this.parseAsync = this.parseAsync.bind(this);
      this.safeParseAsync = this.safeParseAsync.bind(this);
      this.spa = this.spa.bind(this);
      this.refine = this.refine.bind(this);
      this.refinement = this.refinement.bind(this);
      this.superRefine = this.superRefine.bind(this);
      this.optional = this.optional.bind(this);
      this.nullable = this.nullable.bind(this);
      this.nullish = this.nullish.bind(this);
      this.array = this.array.bind(this);
      this.promise = this.promise.bind(this);
      this.or = this.or.bind(this);
      this.and = this.and.bind(this);
      this.transform = this.transform.bind(this);
      this.brand = this.brand.bind(this);
      this.default = this.default.bind(this);
      this.catch = this.catch.bind(this);
      this.describe = this.describe.bind(this);
      this.pipe = this.pipe.bind(this);
      this.readonly = this.readonly.bind(this);
      this.isNullable = this.isNullable.bind(this);
      this.isOptional = this.isOptional.bind(this);
      this["~standard"] = {
        version: 1,
        vendor: "zod",
        validate: (data) => this["~validate"](data)
      };
    }
    optional() {
      return ZodOptional.create(this, this._def);
    }
    nullable() {
      return ZodNullable.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return ZodArray.create(this);
    }
    promise() {
      return ZodPromise.create(this, this._def);
    }
    or(option) {
      return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
      return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
      return new ZodEffects({
        ...processCreateParams(this._def),
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "transform", transform }
      });
    }
    default(def) {
      const defaultValueFunc = typeof def === "function" ? def : () => def;
      return new ZodDefault({
        ...processCreateParams(this._def),
        innerType: this,
        defaultValue: defaultValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodDefault
      });
    }
    brand() {
      return new ZodBranded({
        typeName: ZodFirstPartyTypeKind.ZodBranded,
        type: this,
        ...processCreateParams(this._def)
      });
    }
    catch(def) {
      const catchValueFunc = typeof def === "function" ? def : () => def;
      return new ZodCatch({
        ...processCreateParams(this._def),
        innerType: this,
        catchValue: catchValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodCatch
      });
    }
    describe(description) {
      const This = this.constructor;
      return new This({
        ...this._def,
        description
      });
    }
    pipe(target) {
      return ZodPipeline.create(this, target);
    }
    readonly() {
      return ZodReadonly.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  };
  var cuidRegex = /^c[^\s-]{8,}$/i;
  var cuid2Regex = /^[0-9a-z]+$/;
  var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  var nanoidRegex = /^[a-z0-9_-]{21}$/i;
  var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
  var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  var emojiRegex;
  var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
  var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
  var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
  var dateRegex = new RegExp(`^${dateRegexSource}$`);
  function timeRegexSource(args) {
    let secondsRegexSource = `[0-5]\\d`;
    if (args.precision) {
      secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
    } else if (args.precision == null) {
      secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
    }
    const secondsQuantifier = args.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
  }
  function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
  }
  function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
      opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
  }
  function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
      return true;
    }
    return false;
  }
  function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt))
      return false;
    try {
      const [header] = jwt.split(".");
      if (!header)
        return false;
      const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
      const decoded = JSON.parse(atob(base64));
      if (typeof decoded !== "object" || decoded === null)
        return false;
      if ("typ" in decoded && decoded?.typ !== "JWT")
        return false;
      if (!decoded.alg)
        return false;
      if (alg && decoded.alg !== alg)
        return false;
      return true;
    } catch {
      return false;
    }
  }
  function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
      return true;
    }
    return false;
  }
  var ZodString = class _ZodString extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = String(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.string) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const status = new ParseStatus();
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.length < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.length > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "length") {
          const tooBig = input.data.length > check.value;
          const tooSmall = input.data.length < check.value;
          if (tooBig || tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            if (tooBig) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            } else if (tooSmall) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            }
            status.dirty();
          }
        } else if (check.kind === "email") {
          if (!emailRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "email",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "emoji") {
          if (!emojiRegex) {
            emojiRegex = new RegExp(_emojiRegex, "u");
          }
          if (!emojiRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "emoji",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "uuid") {
          if (!uuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "uuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "nanoid") {
          if (!nanoidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "nanoid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid") {
          if (!cuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid2") {
          if (!cuid2Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid2",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ulid") {
          if (!ulidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ulid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "url") {
          try {
            new URL(input.data);
          } catch {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "regex") {
          check.regex.lastIndex = 0;
          const testResult = check.regex.test(input.data);
          if (!testResult) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "regex",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "trim") {
          input.data = input.data.trim();
        } else if (check.kind === "includes") {
          if (!input.data.includes(check.value, check.position)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { includes: check.value, position: check.position },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "toLowerCase") {
          input.data = input.data.toLowerCase();
        } else if (check.kind === "toUpperCase") {
          input.data = input.data.toUpperCase();
        } else if (check.kind === "startsWith") {
          if (!input.data.startsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { startsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "endsWith") {
          if (!input.data.endsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { endsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "datetime") {
          const regex = datetimeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "datetime",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "date") {
          const regex = dateRegex;
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "date",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "time") {
          const regex = timeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "time",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "duration") {
          if (!durationRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "duration",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ip") {
          if (!isValidIP(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ip",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "jwt") {
          if (!isValidJWT(input.data, check.alg)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "jwt",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cidr") {
          if (!isValidCidr(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cidr",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64") {
          if (!base64Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64url") {
          if (!base64urlRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
      return this.refinement((data) => regex.test(data), {
        validation,
        code: ZodIssueCode.invalid_string,
        ...errorUtil.errToObj(message)
      });
    }
    _addCheck(check) {
      return new _ZodString({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    email(message) {
      return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
      return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
      return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
      return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
      return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
      return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
      return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
      return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
      return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    base64url(message) {
      return this._addCheck({
        kind: "base64url",
        ...errorUtil.errToObj(message)
      });
    }
    jwt(options) {
      return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
    }
    ip(options) {
      return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    cidr(options) {
      return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "datetime",
          precision: null,
          offset: false,
          local: false,
          message: options
        });
      }
      return this._addCheck({
        kind: "datetime",
        precision: typeof options?.precision === "undefined" ? null : options?.precision,
        offset: options?.offset ?? false,
        local: options?.local ?? false,
        ...errorUtil.errToObj(options?.message)
      });
    }
    date(message) {
      return this._addCheck({ kind: "date", message });
    }
    time(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "time",
          precision: null,
          message: options
        });
      }
      return this._addCheck({
        kind: "time",
        precision: typeof options?.precision === "undefined" ? null : options?.precision,
        ...errorUtil.errToObj(options?.message)
      });
    }
    duration(message) {
      return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex, message) {
      return this._addCheck({
        kind: "regex",
        regex,
        ...errorUtil.errToObj(message)
      });
    }
    includes(value, options) {
      return this._addCheck({
        kind: "includes",
        value,
        position: options?.position,
        ...errorUtil.errToObj(options?.message)
      });
    }
    startsWith(value, message) {
      return this._addCheck({
        kind: "startsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    endsWith(value, message) {
      return this._addCheck({
        kind: "endsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    min(minLength, message) {
      return this._addCheck({
        kind: "min",
        value: minLength,
        ...errorUtil.errToObj(message)
      });
    }
    max(maxLength, message) {
      return this._addCheck({
        kind: "max",
        value: maxLength,
        ...errorUtil.errToObj(message)
      });
    }
    length(len, message) {
      return this._addCheck({
        kind: "length",
        value: len,
        ...errorUtil.errToObj(message)
      });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
      return new _ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }]
      });
    }
    toLowerCase() {
      return new _ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }]
      });
    }
    toUpperCase() {
      return new _ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }]
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxLength() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  };
  ZodString.create = (params) => {
    return new ZodString({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodString,
      coerce: params?.coerce ?? false,
      ...processCreateParams(params)
    });
  };
  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
  }
  var ZodNumber = class _ZodNumber extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
      this.step = this.multipleOf;
    }
    _parse(input) {
      if (this._def.coerce) {
        input.data = Number(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.number) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.number,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      let ctx = void 0;
      const status = new ParseStatus();
      for (const check of this._def.checks) {
        if (check.kind === "int") {
          if (!util.isInteger(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: "integer",
              received: "float",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (floatSafeRemainder(input.data, check.value) !== 0) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "finite") {
          if (!Number.isFinite(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_finite,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new _ZodNumber({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new _ZodNumber({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message)
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message)
      });
    }
    safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: true,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message)
      })._addCheck({
        kind: "max",
        inclusive: true,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
    get isInt() {
      return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
    }
    get isFinite() {
      let max = null;
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
          return true;
        } else if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        } else if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  };
  ZodNumber.create = (params) => {
    return new ZodNumber({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodNumber,
      coerce: params?.coerce || false,
      ...processCreateParams(params)
    });
  };
  var ZodBigInt = class _ZodBigInt extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
    }
    _parse(input) {
      if (this._def.coerce) {
        try {
          input.data = BigInt(input.data);
        } catch {
          return this._getInvalidInput(input);
        }
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.bigint) {
        return this._getInvalidInput(input);
      }
      let ctx = void 0;
      const status = new ParseStatus();
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              type: "bigint",
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              type: "bigint",
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (input.data % check.value !== BigInt(0)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      });
      return INVALID;
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new _ZodBigInt({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new _ZodBigInt({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  };
  ZodBigInt.create = (params) => {
    return new ZodBigInt({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodBigInt,
      coerce: params?.coerce ?? false,
      ...processCreateParams(params)
    });
  };
  var ZodBoolean = class extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = Boolean(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.boolean) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.boolean,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodBoolean.create = (params) => {
    return new ZodBoolean({
      typeName: ZodFirstPartyTypeKind.ZodBoolean,
      coerce: params?.coerce || false,
      ...processCreateParams(params)
    });
  };
  var ZodDate = class _ZodDate extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = new Date(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.date) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.date,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      if (Number.isNaN(input.data.getTime())) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_date
        });
        return INVALID;
      }
      const status = new ParseStatus();
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.getTime() < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              message: check.message,
              inclusive: true,
              exact: false,
              minimum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.getTime() > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              message: check.message,
              inclusive: true,
              exact: false,
              maximum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: new Date(input.data.getTime())
      };
    }
    _addCheck(check) {
      return new _ZodDate({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    get minDate() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min != null ? new Date(min) : null;
    }
    get maxDate() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max != null ? new Date(max) : null;
    }
  };
  ZodDate.create = (params) => {
    return new ZodDate({
      checks: [],
      coerce: params?.coerce || false,
      typeName: ZodFirstPartyTypeKind.ZodDate,
      ...processCreateParams(params)
    });
  };
  var ZodSymbol = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.symbol) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.symbol,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodSymbol.create = (params) => {
    return new ZodSymbol({
      typeName: ZodFirstPartyTypeKind.ZodSymbol,
      ...processCreateParams(params)
    });
  };
  var ZodUndefined = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.undefined,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodUndefined.create = (params) => {
    return new ZodUndefined({
      typeName: ZodFirstPartyTypeKind.ZodUndefined,
      ...processCreateParams(params)
    });
  };
  var ZodNull = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.null) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.null,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodNull.create = (params) => {
    return new ZodNull({
      typeName: ZodFirstPartyTypeKind.ZodNull,
      ...processCreateParams(params)
    });
  };
  var ZodAny = class extends ZodType {
    constructor() {
      super(...arguments);
      this._any = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  };
  ZodAny.create = (params) => {
    return new ZodAny({
      typeName: ZodFirstPartyTypeKind.ZodAny,
      ...processCreateParams(params)
    });
  };
  var ZodUnknown = class extends ZodType {
    constructor() {
      super(...arguments);
      this._unknown = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  };
  ZodUnknown.create = (params) => {
    return new ZodUnknown({
      typeName: ZodFirstPartyTypeKind.ZodUnknown,
      ...processCreateParams(params)
    });
  };
  var ZodNever = class extends ZodType {
    _parse(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.never,
        received: ctx.parsedType
      });
      return INVALID;
    }
  };
  ZodNever.create = (params) => {
    return new ZodNever({
      typeName: ZodFirstPartyTypeKind.ZodNever,
      ...processCreateParams(params)
    });
  };
  var ZodVoid = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.void,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodVoid.create = (params) => {
    return new ZodVoid({
      typeName: ZodFirstPartyTypeKind.ZodVoid,
      ...processCreateParams(params)
    });
  };
  var ZodArray = class _ZodArray extends ZodType {
    _parse(input) {
      const { ctx, status } = this._processInputParams(input);
      const def = this._def;
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (def.exactLength !== null) {
        const tooBig = ctx.data.length > def.exactLength.value;
        const tooSmall = ctx.data.length < def.exactLength.value;
        if (tooBig || tooSmall) {
          addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
            minimum: tooSmall ? def.exactLength.value : void 0,
            maximum: tooBig ? def.exactLength.value : void 0,
            type: "array",
            inclusive: true,
            exact: true,
            message: def.exactLength.message
          });
          status.dirty();
        }
      }
      if (def.minLength !== null) {
        if (ctx.data.length < def.minLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.minLength.message
          });
          status.dirty();
        }
      }
      if (def.maxLength !== null) {
        if (ctx.data.length > def.maxLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.maxLength.message
          });
          status.dirty();
        }
      }
      if (ctx.common.async) {
        return Promise.all([...ctx.data].map((item, i) => {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        })).then((result2) => {
          return ParseStatus.mergeArray(status, result2);
        });
      }
      const result = [...ctx.data].map((item, i) => {
        return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      });
      return ParseStatus.mergeArray(status, result);
    }
    get element() {
      return this._def.type;
    }
    min(minLength, message) {
      return new _ZodArray({
        ...this._def,
        minLength: { value: minLength, message: errorUtil.toString(message) }
      });
    }
    max(maxLength, message) {
      return new _ZodArray({
        ...this._def,
        maxLength: { value: maxLength, message: errorUtil.toString(message) }
      });
    }
    length(len, message) {
      return new _ZodArray({
        ...this._def,
        exactLength: { value: len, message: errorUtil.toString(message) }
      });
    }
    nonempty(message) {
      return this.min(1, message);
    }
  };
  ZodArray.create = (schema, params) => {
    return new ZodArray({
      type: schema,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: ZodFirstPartyTypeKind.ZodArray,
      ...processCreateParams(params)
    });
  };
  function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
      const newShape = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
      }
      return new ZodObject({
        ...schema._def,
        shape: () => newShape
      });
    } else if (schema instanceof ZodArray) {
      return new ZodArray({
        ...schema._def,
        type: deepPartialify(schema.element)
      });
    } else if (schema instanceof ZodOptional) {
      return ZodOptional.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodNullable) {
      return ZodNullable.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodTuple) {
      return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    } else {
      return schema;
    }
  }
  var ZodObject = class _ZodObject extends ZodType {
    constructor() {
      super(...arguments);
      this._cached = null;
      this.nonstrict = this.passthrough;
      this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null)
        return this._cached;
      const shape = this._def.shape();
      const keys = util.objectKeys(shape);
      this._cached = { shape, keys };
      return this._cached;
    }
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.object) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const { status, ctx } = this._processInputParams(input);
      const { shape, keys: shapeKeys } = this._getCached();
      const extraKeys = [];
      if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
        for (const key in ctx.data) {
          if (!shapeKeys.includes(key)) {
            extraKeys.push(key);
          }
        }
      }
      const pairs = [];
      for (const key of shapeKeys) {
        const keyValidator = shape[key];
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (this._def.catchall instanceof ZodNever) {
        const unknownKeys = this._def.unknownKeys;
        if (unknownKeys === "passthrough") {
          for (const key of extraKeys) {
            pairs.push({
              key: { status: "valid", value: key },
              value: { status: "valid", value: ctx.data[key] }
            });
          }
        } else if (unknownKeys === "strict") {
          if (extraKeys.length > 0) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.unrecognized_keys,
              keys: extraKeys
            });
            status.dirty();
          }
        } else if (unknownKeys === "strip") {
        } else {
          throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
        }
      } else {
        const catchall = this._def.catchall;
        for (const key of extraKeys) {
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: catchall._parse(
              new ParseInputLazyPath(ctx, value, ctx.path, key)
              //, ctx.child(key), value, getParsedType(value)
            ),
            alwaysSet: key in ctx.data
          });
        }
      }
      if (ctx.common.async) {
        return Promise.resolve().then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
              key,
              value,
              alwaysSet: pair.alwaysSet
            });
          }
          return syncPairs;
        }).then((syncPairs) => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get shape() {
      return this._def.shape();
    }
    strict(message) {
      errorUtil.errToObj;
      return new _ZodObject({
        ...this._def,
        unknownKeys: "strict",
        ...message !== void 0 ? {
          errorMap: (issue, ctx) => {
            const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
            if (issue.code === "unrecognized_keys")
              return {
                message: errorUtil.errToObj(message).message ?? defaultError
              };
            return {
              message: defaultError
            };
          }
        } : {}
      });
    }
    strip() {
      return new _ZodObject({
        ...this._def,
        unknownKeys: "strip"
      });
    }
    passthrough() {
      return new _ZodObject({
        ...this._def,
        unknownKeys: "passthrough"
      });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
      return new _ZodObject({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...augmentation
        })
      });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
      const merged = new _ZodObject({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...merging._def.shape()
        }),
        typeName: ZodFirstPartyTypeKind.ZodObject
      });
      return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
      return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
      return new _ZodObject({
        ...this._def,
        catchall: index
      });
    }
    pick(mask) {
      const shape = {};
      for (const key of util.objectKeys(mask)) {
        if (mask[key] && this.shape[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new _ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    omit(mask) {
      const shape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (!mask[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new _ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    /**
     * @deprecated
     */
    deepPartial() {
      return deepPartialify(this);
    }
    partial(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        const fieldSchema = this.shape[key];
        if (mask && !mask[key]) {
          newShape[key] = fieldSchema;
        } else {
          newShape[key] = fieldSchema.optional();
        }
      }
      return new _ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    required(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (mask && !mask[key]) {
          newShape[key] = this.shape[key];
        } else {
          const fieldSchema = this.shape[key];
          let newField = fieldSchema;
          while (newField instanceof ZodOptional) {
            newField = newField._def.innerType;
          }
          newShape[key] = newField;
        }
      }
      return new _ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    keyof() {
      return createZodEnum(util.objectKeys(this.shape));
    }
  };
  ZodObject.create = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strict",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
      shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  var ZodUnion = class extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const options = this._def.options;
      function handleResults(results) {
        for (const result of results) {
          if (result.result.status === "valid") {
            return result.result;
          }
        }
        for (const result of results) {
          if (result.result.status === "dirty") {
            ctx.common.issues.push(...result.ctx.common.issues);
            return result.result;
          }
        }
        const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return Promise.all(options.map(async (option) => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            }),
            ctx: childCtx
          };
        })).then(handleResults);
      } else {
        let dirty = void 0;
        const issues = [];
        for (const option of options) {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          const result = option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          });
          if (result.status === "valid") {
            return result;
          } else if (result.status === "dirty" && !dirty) {
            dirty = { result, ctx: childCtx };
          }
          if (childCtx.common.issues.length) {
            issues.push(childCtx.common.issues);
          }
        }
        if (dirty) {
          ctx.common.issues.push(...dirty.ctx.common.issues);
          return dirty.result;
        }
        const unionErrors = issues.map((issues2) => new ZodError(issues2));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  };
  ZodUnion.create = (types, params) => {
    return new ZodUnion({
      options: types,
      typeName: ZodFirstPartyTypeKind.ZodUnion,
      ...processCreateParams(params)
    });
  };
  var getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
      return getDiscriminator(type.schema);
    } else if (type instanceof ZodEffects) {
      return getDiscriminator(type.innerType());
    } else if (type instanceof ZodLiteral) {
      return [type.value];
    } else if (type instanceof ZodEnum) {
      return type.options;
    } else if (type instanceof ZodNativeEnum) {
      return util.objectValues(type.enum);
    } else if (type instanceof ZodDefault) {
      return getDiscriminator(type._def.innerType);
    } else if (type instanceof ZodUndefined) {
      return [void 0];
    } else if (type instanceof ZodNull) {
      return [null];
    } else if (type instanceof ZodOptional) {
      return [void 0, ...getDiscriminator(type.unwrap())];
    } else if (type instanceof ZodNullable) {
      return [null, ...getDiscriminator(type.unwrap())];
    } else if (type instanceof ZodBranded) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodReadonly) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodCatch) {
      return getDiscriminator(type._def.innerType);
    } else {
      return [];
    }
  };
  var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const discriminator = this.discriminator;
      const discriminatorValue = ctx.data[discriminator];
      const option = this.optionsMap.get(discriminatorValue);
      if (!option) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union_discriminator,
          options: Array.from(this.optionsMap.keys()),
          path: [discriminator]
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return option._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      } else {
        return option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      }
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
      const optionsMap = /* @__PURE__ */ new Map();
      for (const type of options) {
        const discriminatorValues = getDiscriminator(type.shape[discriminator]);
        if (!discriminatorValues.length) {
          throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
        }
        for (const value of discriminatorValues) {
          if (optionsMap.has(value)) {
            throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
          }
          optionsMap.set(value, type);
        }
      }
      return new _ZodDiscriminatedUnion({
        typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
        discriminator,
        options,
        optionsMap,
        ...processCreateParams(params)
      });
    }
  };
  function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
      return { valid: true, data: a };
    } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
      const bKeys = util.objectKeys(b);
      const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
      const newObj = { ...a, ...b };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newObj[key] = sharedValue.data;
      }
      return { valid: true, data: newObj };
    } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
      if (a.length !== b.length) {
        return { valid: false };
      }
      const newArray = [];
      for (let index = 0; index < a.length; index++) {
        const itemA = a[index];
        const itemB = b[index];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newArray.push(sharedValue.data);
      }
      return { valid: true, data: newArray };
    } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
      return { valid: true, data: a };
    } else {
      return { valid: false };
    }
  }
  var ZodIntersection = class extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const handleParsed = (parsedLeft, parsedRight) => {
        if (isAborted(parsedLeft) || isAborted(parsedRight)) {
          return INVALID;
        }
        const merged = mergeValues(parsedLeft.value, parsedRight.value);
        if (!merged.valid) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_intersection_types
          });
          return INVALID;
        }
        if (isDirty(parsedLeft) || isDirty(parsedRight)) {
          status.dirty();
        }
        return { status: status.value, value: merged.data };
      };
      if (ctx.common.async) {
        return Promise.all([
          this._def.left._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }),
          this._def.right._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          })
        ]).then(([left, right]) => handleParsed(left, right));
      } else {
        return handleParsed(this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }));
      }
    }
  };
  ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
      left,
      right,
      typeName: ZodFirstPartyTypeKind.ZodIntersection,
      ...processCreateParams(params)
    });
  };
  var ZodTuple = class _ZodTuple extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (ctx.data.length < this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        return INVALID;
      }
      const rest = this._def.rest;
      if (!rest && ctx.data.length > this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        status.dirty();
      }
      const items = [...ctx.data].map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema)
          return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      }).filter((x) => !!x);
      if (ctx.common.async) {
        return Promise.all(items).then((results) => {
          return ParseStatus.mergeArray(status, results);
        });
      } else {
        return ParseStatus.mergeArray(status, items);
      }
    }
    get items() {
      return this._def.items;
    }
    rest(rest) {
      return new _ZodTuple({
        ...this._def,
        rest
      });
    }
  };
  ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
      items: schemas,
      typeName: ZodFirstPartyTypeKind.ZodTuple,
      rest: null,
      ...processCreateParams(params)
    });
  };
  var ZodRecord = class _ZodRecord extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const pairs = [];
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      for (const key in ctx.data) {
        pairs.push({
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
          value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (ctx.common.async) {
        return ParseStatus.mergeObjectAsync(status, pairs);
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get element() {
      return this._def.valueType;
    }
    static create(first, second, third) {
      if (second instanceof ZodType) {
        return new _ZodRecord({
          keyType: first,
          valueType: second,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(third)
        });
      }
      return new _ZodRecord({
        keyType: ZodString.create(),
        valueType: first,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(second)
      });
    }
  };
  var ZodMap = class extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.map) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.map,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      const pairs = [...ctx.data.entries()].map(([key, value], index) => {
        return {
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
          value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
        };
      });
      if (ctx.common.async) {
        const finalMap = /* @__PURE__ */ new Map();
        return Promise.resolve().then(async () => {
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        });
      } else {
        const finalMap = /* @__PURE__ */ new Map();
        for (const pair of pairs) {
          const key = pair.key;
          const value = pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      }
    }
  };
  ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
      valueType,
      keyType,
      typeName: ZodFirstPartyTypeKind.ZodMap,
      ...processCreateParams(params)
    });
  };
  var ZodSet = class _ZodSet extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.set) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.set,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const def = this._def;
      if (def.minSize !== null) {
        if (ctx.data.size < def.minSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.minSize.message
          });
          status.dirty();
        }
      }
      if (def.maxSize !== null) {
        if (ctx.data.size > def.maxSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.maxSize.message
          });
          status.dirty();
        }
      }
      const valueType = this._def.valueType;
      function finalizeSet(elements2) {
        const parsedSet = /* @__PURE__ */ new Set();
        for (const element of elements2) {
          if (element.status === "aborted")
            return INVALID;
          if (element.status === "dirty")
            status.dirty();
          parsedSet.add(element.value);
        }
        return { status: status.value, value: parsedSet };
      }
      const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
      if (ctx.common.async) {
        return Promise.all(elements).then((elements2) => finalizeSet(elements2));
      } else {
        return finalizeSet(elements);
      }
    }
    min(minSize, message) {
      return new _ZodSet({
        ...this._def,
        minSize: { value: minSize, message: errorUtil.toString(message) }
      });
    }
    max(maxSize, message) {
      return new _ZodSet({
        ...this._def,
        maxSize: { value: maxSize, message: errorUtil.toString(message) }
      });
    }
    size(size, message) {
      return this.min(size, message).max(size, message);
    }
    nonempty(message) {
      return this.min(1, message);
    }
  };
  ZodSet.create = (valueType, params) => {
    return new ZodSet({
      valueType,
      minSize: null,
      maxSize: null,
      typeName: ZodFirstPartyTypeKind.ZodSet,
      ...processCreateParams(params)
    });
  };
  var ZodFunction = class _ZodFunction extends ZodType {
    constructor() {
      super(...arguments);
      this.validate = this.implement;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.function) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.function,
          received: ctx.parsedType
        });
        return INVALID;
      }
      function makeArgsIssue(args, error) {
        return makeIssue({
          data: args,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
          issueData: {
            code: ZodIssueCode.invalid_arguments,
            argumentsError: error
          }
        });
      }
      function makeReturnsIssue(returns, error) {
        return makeIssue({
          data: returns,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
          issueData: {
            code: ZodIssueCode.invalid_return_type,
            returnTypeError: error
          }
        });
      }
      const params = { errorMap: ctx.common.contextualErrorMap };
      const fn = ctx.data;
      if (this._def.returns instanceof ZodPromise) {
        const me = this;
        return OK(async function(...args) {
          const error = new ZodError([]);
          const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
            error.addIssue(makeArgsIssue(args, e));
            throw error;
          });
          const result = await Reflect.apply(fn, this, parsedArgs);
          const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
            error.addIssue(makeReturnsIssue(result, e));
            throw error;
          });
          return parsedReturns;
        });
      } else {
        const me = this;
        return OK(function(...args) {
          const parsedArgs = me._def.args.safeParse(args, params);
          if (!parsedArgs.success) {
            throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
          }
          const result = Reflect.apply(fn, this, parsedArgs.data);
          const parsedReturns = me._def.returns.safeParse(result, params);
          if (!parsedReturns.success) {
            throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
          }
          return parsedReturns.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...items) {
      return new _ZodFunction({
        ...this._def,
        args: ZodTuple.create(items).rest(ZodUnknown.create())
      });
    }
    returns(returnType) {
      return new _ZodFunction({
        ...this._def,
        returns: returnType
      });
    }
    implement(func) {
      const validatedFunc = this.parse(func);
      return validatedFunc;
    }
    strictImplement(func) {
      const validatedFunc = this.parse(func);
      return validatedFunc;
    }
    static create(args, returns, params) {
      return new _ZodFunction({
        args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
        returns: returns || ZodUnknown.create(),
        typeName: ZodFirstPartyTypeKind.ZodFunction,
        ...processCreateParams(params)
      });
    }
  };
  var ZodLazy = class extends ZodType {
    get schema() {
      return this._def.getter();
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const lazySchema = this._def.getter();
      return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
  };
  ZodLazy.create = (getter, params) => {
    return new ZodLazy({
      getter,
      typeName: ZodFirstPartyTypeKind.ZodLazy,
      ...processCreateParams(params)
    });
  };
  var ZodLiteral = class extends ZodType {
    _parse(input) {
      if (input.data !== this._def.value) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_literal,
          expected: this._def.value
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
    get value() {
      return this._def.value;
    }
  };
  ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
      value,
      typeName: ZodFirstPartyTypeKind.ZodLiteral,
      ...processCreateParams(params)
    });
  };
  function createZodEnum(values, params) {
    return new ZodEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodEnum,
      ...processCreateParams(params)
    });
  }
  var ZodEnum = class _ZodEnum extends ZodType {
    _parse(input) {
      if (typeof input.data !== "string") {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(this._def.values);
      }
      if (!this._cache.has(input.data)) {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Values() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    extract(values, newDef = this._def) {
      return _ZodEnum.create(values, {
        ...this._def,
        ...newDef
      });
    }
    exclude(values, newDef = this._def) {
      return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
        ...this._def,
        ...newDef
      });
    }
  };
  ZodEnum.create = createZodEnum;
  var ZodNativeEnum = class extends ZodType {
    _parse(input) {
      const nativeEnumValues = util.getValidEnumValues(this._def.values);
      const ctx = this._getOrReturnCtx(input);
      if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(util.getValidEnumValues(this._def.values));
      }
      if (!this._cache.has(input.data)) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get enum() {
      return this._def.values;
    }
  };
  ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
      ...processCreateParams(params)
    });
  };
  var ZodPromise = class extends ZodType {
    unwrap() {
      return this._def.type;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.promise,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
      return OK(promisified.then((data) => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap
        });
      }));
    }
  };
  ZodPromise.create = (schema, params) => {
    return new ZodPromise({
      type: schema,
      typeName: ZodFirstPartyTypeKind.ZodPromise,
      ...processCreateParams(params)
    });
  };
  var ZodEffects = class extends ZodType {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const effect = this._def.effect || null;
      const checkCtx = {
        addIssue: (arg) => {
          addIssueToContext(ctx, arg);
          if (arg.fatal) {
            status.abort();
          } else {
            status.dirty();
          }
        },
        get path() {
          return ctx.path;
        }
      };
      checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
      if (effect.type === "preprocess") {
        const processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(processed).then(async (processed2) => {
            if (status.value === "aborted")
              return INVALID;
            const result = await this._def.schema._parseAsync({
              data: processed2,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          });
        } else {
          if (status.value === "aborted")
            return INVALID;
          const result = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        }
      }
      if (effect.type === "refinement") {
        const executeRefinement = (acc) => {
          const result = effect.refinement(acc, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(result);
          }
          if (result instanceof Promise) {
            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          }
          return acc;
        };
        if (ctx.common.async === false) {
          const inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          executeRefinement(inner.value);
          return { status: status.value, value: inner.value };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
        }
      }
      if (effect.type === "transform") {
        if (ctx.common.async === false) {
          const base = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (!isValid(base))
            return INVALID;
          const result = effect.transform(base.value, checkCtx);
          if (result instanceof Promise) {
            throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
          }
          return { status: status.value, value: result };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
            if (!isValid(base))
              return INVALID;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
              status: status.value,
              value: result
            }));
          });
        }
      }
      util.assertNever(effect);
    }
  };
  ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
      schema,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect,
      ...processCreateParams(params)
    });
  };
  ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
      schema,
      effect: { type: "preprocess", transform: preprocess },
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      ...processCreateParams(params)
    });
  };
  var ZodOptional = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.undefined) {
        return OK(void 0);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodOptional.create = (type, params) => {
    return new ZodOptional({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodOptional,
      ...processCreateParams(params)
    });
  };
  var ZodNullable = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.null) {
        return OK(null);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodNullable.create = (type, params) => {
    return new ZodNullable({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodNullable,
      ...processCreateParams(params)
    });
  };
  var ZodDefault = class extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      let data = ctx.data;
      if (ctx.parsedType === ZodParsedType.undefined) {
        data = this._def.defaultValue();
      }
      return this._def.innerType._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  };
  ZodDefault.create = (type, params) => {
    return new ZodDefault({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
      defaultValue: typeof params.default === "function" ? params.default : () => params.default,
      ...processCreateParams(params)
    });
  };
  var ZodCatch = class extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const newCtx = {
        ...ctx,
        common: {
          ...ctx.common,
          issues: []
        }
      };
      const result = this._def.innerType._parse({
        data: newCtx.data,
        path: newCtx.path,
        parent: {
          ...newCtx
        }
      });
      if (isAsync(result)) {
        return result.then((result2) => {
          return {
            status: "valid",
            value: result2.status === "valid" ? result2.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        });
      } else {
        return {
          status: "valid",
          value: result.status === "valid" ? result.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      }
    }
    removeCatch() {
      return this._def.innerType;
    }
  };
  ZodCatch.create = (type, params) => {
    return new ZodCatch({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
      catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
      ...processCreateParams(params)
    });
  };
  var ZodNaN = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.nan) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.nan,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
  };
  ZodNaN.create = (params) => {
    return new ZodNaN({
      typeName: ZodFirstPartyTypeKind.ZodNaN,
      ...processCreateParams(params)
    });
  };
  var BRAND = /* @__PURE__ */ Symbol("zod_brand");
  var ZodBranded = class extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const data = ctx.data;
      return this._def.type._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    unwrap() {
      return this._def.type;
    }
  };
  var ZodPipeline = class _ZodPipeline extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.common.async) {
        const handleAsync = async () => {
          const inResult = await this._def.in._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return DIRTY(inResult.value);
          } else {
            return this._def.out._parseAsync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        };
        return handleAsync();
      } else {
        const inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return {
            status: "dirty",
            value: inResult.value
          };
        } else {
          return this._def.out._parseSync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }
    }
    static create(a, b) {
      return new _ZodPipeline({
        in: a,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline
      });
    }
  };
  var ZodReadonly = class extends ZodType {
    _parse(input) {
      const result = this._def.innerType._parse(input);
      const freeze = (data) => {
        if (isValid(data)) {
          data.value = Object.freeze(data.value);
        }
        return data;
      };
      return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodReadonly,
      ...processCreateParams(params)
    });
  };
  function cleanParams(params, data) {
    const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
    const p2 = typeof p === "string" ? { message: p } : p;
    return p2;
  }
  function custom(check, _params = {}, fatal) {
    if (check)
      return ZodAny.create().superRefine((data, ctx) => {
        const r = check(data);
        if (r instanceof Promise) {
          return r.then((r2) => {
            if (!r2) {
              const params = cleanParams(_params, data);
              const _fatal = params.fatal ?? fatal ?? true;
              ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
            }
          });
        }
        if (!r) {
          const params = cleanParams(_params, data);
          const _fatal = params.fatal ?? fatal ?? true;
          ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
        }
        return;
      });
    return ZodAny.create();
  }
  var late = {
    object: ZodObject.lazycreate
  };
  var ZodFirstPartyTypeKind;
  (function(ZodFirstPartyTypeKind2) {
    ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
  var instanceOfType = (cls, params = {
    message: `Input not instance of ${cls.name}`
  }) => custom((data) => data instanceof cls, params);
  var stringType = ZodString.create;
  var numberType = ZodNumber.create;
  var nanType = ZodNaN.create;
  var bigIntType = ZodBigInt.create;
  var booleanType = ZodBoolean.create;
  var dateType = ZodDate.create;
  var symbolType = ZodSymbol.create;
  var undefinedType = ZodUndefined.create;
  var nullType = ZodNull.create;
  var anyType = ZodAny.create;
  var unknownType = ZodUnknown.create;
  var neverType = ZodNever.create;
  var voidType = ZodVoid.create;
  var arrayType = ZodArray.create;
  var objectType = ZodObject.create;
  var strictObjectType = ZodObject.strictCreate;
  var unionType = ZodUnion.create;
  var discriminatedUnionType = ZodDiscriminatedUnion.create;
  var intersectionType = ZodIntersection.create;
  var tupleType = ZodTuple.create;
  var recordType = ZodRecord.create;
  var mapType = ZodMap.create;
  var setType = ZodSet.create;
  var functionType = ZodFunction.create;
  var lazyType = ZodLazy.create;
  var literalType = ZodLiteral.create;
  var enumType = ZodEnum.create;
  var nativeEnumType = ZodNativeEnum.create;
  var promiseType = ZodPromise.create;
  var effectsType = ZodEffects.create;
  var optionalType = ZodOptional.create;
  var nullableType = ZodNullable.create;
  var preprocessType = ZodEffects.createWithPreprocess;
  var pipelineType = ZodPipeline.create;
  var ostring = () => stringType().optional();
  var onumber = () => numberType().optional();
  var oboolean = () => booleanType().optional();
  var coerce = {
    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
    boolean: ((arg) => ZodBoolean.create({
      ...arg,
      coerce: true
    })),
    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
    date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
  };
  var NEVER = INVALID;

  // src/lib/email-scanner.ts
  var emailInputSchema = external_exports.string().trim().min(1, "Add an email or raw headers to begin the scan.").max(1e6, "The scan input must be smaller than 1 MB.");
  var urgencyTerms = /urgent|immediately|asap|action required|within \d+ hours?|final notice|suspended/i;
  var paymentTerms = /invoice|payment|bank details|wire transfer|beneficiary|account number|gift card/i;
  var credentialTerms = /password|verify your account|sign in|login|mailbox quota|security alert|credential/i;
  var ipPattern = /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g;
  var addressPattern = /<([^>\s]+@[^>\s]+)>|\b([\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+)\b/i;
  function parseHeaders(raw) {
    const separator = raw.search(/\r?\n\r?\n/);
    const headerText = separator >= 0 ? raw.slice(0, separator) : raw;
    const body = separator >= 0 ? raw.slice(separator).replace(/^\r?\n\r?\n/, "") : "";
    const unfolded = headerText.replace(/\r?\n[ \t]+/g, " ");
    const headers = {};
    for (const line of unfolded.split(/\r?\n/)) {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex <= 0) continue;
      const name = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();
      if (!value) continue;
      headers[name] = [...headers[name] ?? [], value];
    }
    return { headers, body };
  }
  function firstAddress(value) {
    const match = value.match(addressPattern);
    return match?.[1] ?? match?.[2] ?? value.trim();
  }
  function domainOf(value) {
    return firstAddress(value).split("@")[1]?.toLowerCase() ?? "";
  }
  function canonicalIpv4(ip) {
    if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) return null;
    for (const octet of ip.split(".")) {
      if (octet.length > 1 && octet.startsWith("0")) return null;
      const num = Number(octet);
      if (!Number.isInteger(num) || num > 255 || String(num) !== octet) return null;
    }
    return ip;
  }
  function extractIps(value) {
    const candidates = (value.match(ipPattern) ?? []).map(canonicalIpv4).filter((ip) => ip !== null);
    if (candidates.length === 0) return [];
    const bracketed = new Set(
      [...value.matchAll(/[\[(](\d{1,3}(?:\.\d{1,3}){3})[\])]/g)].map((match) => match[1])
    );
    const preferred = candidates.filter((ip) => bracketed.has(ip));
    return [...new Set(preferred.length > 0 ? preferred : candidates)];
  }
  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  function makeHops(received) {
    const hops = received.map((header, index) => {
      const ips = extractIps(header);
      return {
        label: `Relay ${String(index + 1).padStart(2, "0")}`,
        detail: ips[0] ? `Header hop · ${header.split(";").at(-1)?.trim() ?? "Received"}` : "Header hop · IP not disclosed",
        ip: ips[0] ?? "Not disclosed",
        status: "relay"
      };
    });
    const unique = hops.filter((hop, index) => hops.findIndex((candidate) => candidate.ip === hop.ip) === index);
    const origin = unique.at(-1);
    if (origin) origin.status = "origin";
    return unique.length > 0 ? unique : [{ label: "Origin", detail: "No Received IP found", ip: "Not disclosed", status: "origin" }];
  }
  async function scanEmail(rawInput) {
    const raw = emailInputSchema.parse(rawInput);
    const { headers, body } = parseHeaders(raw);
    const subject = headers["subject"]?.[0] ?? "Untitled message";
    const from = headers["from"]?.[0] ?? "Unknown sender";
    const senderAddress = firstAddress(from);
    const replyTo = headers["reply-to"]?.[0] ?? "Not present";
    const returnPath = headers["return-path"]?.[0] ?? "Not present";
    const searchableText = `${subject} ${from} ${replyTo} ${body}`;
    const findings = [];
    let score = 8;
    if (urgencyTerms.test(searchableText)) {
      score += 18;
      findings.push({ label: "Urgency language", detail: "Pressure tactics detected in the subject or message body.", severity: "high" });
    }
    if (paymentTerms.test(searchableText)) {
      score += 24;
      findings.push({ label: "Payment diversion cues", detail: "Financial or bank-change language requires verification.", severity: "critical" });
    }
    if (credentialTerms.test(searchableText)) {
      score += 22;
      findings.push({ label: "Credential harvesting cues", detail: "Account access or mailbox verification language detected.", severity: "high" });
    }
    const fromDomain = domainOf(from);
    const replyDomain = domainOf(replyTo);
    if (replyDomain && fromDomain && replyDomain !== fromDomain) {
      score += 25;
      findings.push({ label: "Reply-to mismatch", detail: `${fromDomain} sends the message, but replies route to ${replyDomain}.`, severity: "critical" });
    }
    const authResults = [...headers["authentication-results"] ?? [], ...headers["received-spf"] ?? []].join(" ").toLowerCase();
    if (/fail|softfail|temperror|none/.test(authResults)) {
      score += 18;
      findings.push({ label: "Authentication anomaly", detail: "SPF, DKIM, or DMARC-related failure language found in the headers.", severity: "high" });
    }
    if (headers["received"]?.length) {
      findings.push({ label: "Relay path reconstructed", detail: `${headers["received"].length} Received header${headers["received"].length === 1 ? "" : "s"} parsed for forensic tracing.`, severity: "info" });
    } else {
      score += 8;
      findings.push({ label: "Missing relay evidence", detail: "No Received headers were available to establish a reliable origin.", severity: "medium" });
    }
    if (headers["x-mailer"] || headers["user-agent"]) {
      findings.push({ label: "Client fingerprint", detail: `Message client: ${headers["x-mailer"]?.[0] ?? headers["user-agent"]?.[0]}.`, severity: "info" });
    }
    if (findings.length === 0) {
      findings.push({ label: "No high-confidence indicators", detail: "No configured threat signals matched this message.", severity: "info" });
    }
    score = Math.min(99, score);
    const riskLabel = score >= 75 ? "Critical" : score >= 55 ? "High" : score >= 30 ? "Medium" : "Low";
    const hash = await sha256(raw);
    const allHeaders = Object.values(headers).flat();
    return {
      id: `AT-${hash.slice(0, 4).toUpperCase()}`,
      subject,
      sender: from.replace(addressPattern, "").replace(/[<>]/g, "").trim() || senderAddress,
      senderAddress,
      replyTo,
      returnPath,
      receivedAt: headers["date"]?.[0] ?? "Date not present",
      riskScore: score,
      riskLabel,
      findings,
      hops: makeHops(headers["received"] ?? []),
      evidenceHash: hash,
      headersFound: allHeaders.length,
      bodyPreview: body.replace(/\s+/g, " ").trim().slice(0, 180) || "No message body detected."
    };
  }
  var sampleEmail = `From: Finance Desk <finance@acme-corp.example>
To: accounts@northstar.example
Reply-To: payments-team@acme-corp-support.example
Subject: URGENT: Updated bank details — action required
Date: Sun, 30 Aug 2026 09:41:12 +0530
Return-Path: <bounce@acme-corp.example>
Authentication-Results: northstar.example; spf=fail smtp.mailfrom=acme-corp.example; dkim=none
Received: from relay.acme-corp-support.example (185.220.101.4) by mx2.example.net
Received: from unknown (203.0.113.44) by relay.acme-corp-support.example

Please process the attached invoice immediately and confirm the new beneficiary account before 12:00. Reply to payments-team@acme-corp-support.example.
`;

  // src/lib/stats.ts
  function severityDistribution(scans) {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    for (const scan of scans) {
      const key = scan.result.riskLabel;
      if (key in counts) counts[key] += 1;
      else counts.Low += 1;
    }
    return counts;
  }
  function severityCount(scans, severity) {
    return severityDistribution(scans)[severity];
  }
  function originIpOf(scan) {
    const origin = scan.result.hops.find((hop) => hop.status === "origin");
    const candidate = origin?.ip ?? scan.result.hops[0]?.ip;
    return candidate && candidate !== "Not disclosed" ? candidate : null;
  }
  function campaignClusters(scans) {
    const clusters = /* @__PURE__ */ new Map();
    const ensure = (key, label) => {
      let cluster = clusters.get(key);
      if (!cluster) {
        cluster = { key, label, count: 0, worstRisk: 0, worstLabel: "Low", origins: [], domains: [] };
        clusters.set(key, cluster);
      }
      return cluster;
    };
    for (const scan of scans) {
      const originIp = originIpOf(scan);
      const senderDomain = scan.result.senderAddress.split("@")[1]?.toLowerCase();
      const replyDomain = scan.result.replyTo.includes("@") ? scan.result.replyTo.split("@")[1]?.toLowerCase() : null;
      const keys = /* @__PURE__ */ new Set();
      if (originIp) keys.add(`ip:${originIp}`);
      if (senderDomain) keys.add(`domain:${senderDomain}`);
      if (replyDomain) keys.add(`reply:${replyDomain}`);
      if (keys.size === 0) continue;
      for (const key of keys) {
        const cluster = ensure(key, key.startsWith("ip:") ? `Origin ${key.slice(3)}` : key.startsWith("reply:") ? `Replies to ${key.slice(6)}` : `Senders from ${key.slice(7)}`);
        cluster.count += 1;
        if (scan.result.riskScore > cluster.worstRisk) {
          cluster.worstRisk = scan.result.riskScore;
          cluster.worstLabel = scan.result.riskLabel;
        }
        if (originIp && !cluster.origins.includes(originIp)) cluster.origins.push(originIp);
        const domain = senderDomain ?? replyDomain;
        if (domain && !cluster.domains.includes(domain)) cluster.domains.push(domain);
      }
    }
    return [...clusters.values()].sort((a, b) => b.count - a.count || b.worstRisk - a.worstRisk);
  }

  // src/lib/iocs.ts
  var urlPattern = /\bhttps?:\/\/[^\s<>"']+/gi;
  var domainPattern = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/gi;
  var emailPattern = /\b[\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+\b/gi;
  var pseudoDomainDenylist = /* @__PURE__ */ new Set(["smtp.mailfrom", "smtp.helo", "mailfrom", "helo", "header.from", "envelope.from"]);
  function normalizeUrl(raw) {
    return raw.replace(/[),.;]+$/, "");
  }
  function hostOf(url) {
    try {
      return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    } catch {
      return "";
    }
  }
  function extractIocs(raw, result) {
    const iocs = [];
    const seen = /* @__PURE__ */ new Set();
    const push = (type, value, source) => {
      const key = `${type}:${value.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      iocs.push({ type, value, source });
    };
    for (const match of raw.match(urlPattern) ?? []) {
      const url = normalizeUrl(match);
      push("URL", url, "Message body");
      const host = hostOf(url);
      if (host) push("Domain", host, "Extracted URL");
    }
    const emailCandidates = /* @__PURE__ */ new Set();
    if (result.senderAddress.includes("@")) emailCandidates.add(result.senderAddress.toLowerCase());
    for (const header of ["reply-to", "return-path"]) {
      const value = header === "reply-to" ? result.replyTo : result.returnPath;
      const match = value.match(emailPattern);
      if (match) emailCandidates.add(match[0].toLowerCase());
    }
    for (const match of raw.match(emailPattern) ?? []) {
      emailCandidates.add(match.toLowerCase());
    }
    for (const email of emailCandidates) push("Email", email, "Headers");
    const emailDomains = new Set([...emailCandidates].map((email) => email.split("@")[1]));
    const hostCandidates = /* @__PURE__ */ new Set();
    for (const match of raw.match(domainPattern) ?? []) {
      const domain = match.toLowerCase();
      if (emailDomains.has(domain)) continue;
      hostCandidates.add(domain);
    }
    for (const domain of hostCandidates) {
      if (pseudoDomainDenylist.has(domain)) continue;
      push("Domain", domain, "Headers / body");
    }
    for (const hop of result.hops) {
      if (hop.ip !== "Not disclosed") push("IP", hop.ip, "Received header");
    }
    return iocs;
  }
  function iocTotals(iocs) {
    return {
      IP: iocs.filter((ioc) => ioc.type === "IP").length,
      Domain: iocs.filter((ioc) => ioc.type === "Domain").length,
      URL: iocs.filter((ioc) => ioc.type === "URL").length,
      Email: iocs.filter((ioc) => ioc.type === "Email").length
    };
  }
  function relatedCases(scan, all) {
    const senderDomain = scan.result.senderAddress.split("@")[1]?.toLowerCase();
    const replyDomain = scan.result.replyTo.includes("@") ? scan.result.replyTo.split("@")[1]?.toLowerCase() : null;
    const originIp = scan.result.hops.find((hop) => hop.status === "origin")?.ip;
    return all.filter((candidate) => {
      if (candidate.id === scan.id) return false;
      const candidateSender = candidate.result.senderAddress.split("@")[1]?.toLowerCase();
      const candidateReply = candidate.result.replyTo.includes("@") ? candidate.result.replyTo.split("@")[1]?.toLowerCase() : null;
      const candidateOrigin = candidate.result.hops.find((hop) => hop.status === "origin")?.ip;
      return senderDomain && senderDomain === candidateSender || replyDomain && replyDomain === candidateReply || originIp && originIp === candidateOrigin;
    });
  }

  // src/lib/advanced.ts
  var ORG_NAME_KEY = "aegistrace.org-name";
  var ORG_DOMAIN_KEY = "aegistrace.org-domain";
  function setStorageBridge(bridge) {
    globalThis.__sentinelStorage = bridge ?? void 0;
  }
  function orgBridge() {
    const bridge = globalThis.__sentinelStorage;
    return bridge ?? null;
  }
  function getOrgDomain() {
    const bridge = orgBridge();
    if (bridge) {
      try {
        return (bridge.get(ORG_DOMAIN_KEY) ?? "").trim().toLowerCase();
      } catch {
        return "";
      }
    }
    try {
      return (localStorage.getItem(ORG_DOMAIN_KEY) ?? "").trim().toLowerCase();
    } catch {
      return "";
    }
  }
  function setOrgDomain(domain) {
    const bridge = orgBridge();
    if (bridge) {
      try {
        bridge.set(ORG_DOMAIN_KEY, domain.trim().toLowerCase());
      } catch {
      }
      return;
    }
    try {
      localStorage.setItem(ORG_DOMAIN_KEY, domain.trim().toLowerCase());
    } catch {
    }
  }
  function getOrgName() {
    const bridge = orgBridge();
    if (bridge) {
      try {
        return (bridge.get(ORG_NAME_KEY) ?? "").trim();
      } catch {
        return "";
      }
    }
    try {
      return (localStorage.getItem(ORG_NAME_KEY) ?? "").trim();
    } catch {
      return "";
    }
  }
  function setOrgName(name) {
    const bridge = orgBridge();
    if (bridge) {
      try {
        bridge.set(ORG_NAME_KEY, name.trim());
      } catch {
      }
      return;
    }
    try {
      localStorage.setItem(ORG_NAME_KEY, name.trim());
    } catch {
    }
  }
  var scriptChecks = [
    { re: /[\u0900-\u097F]/, script: "Devanagari", name: "Hindi / Marathi", hint: "Devanagari-script (Hindi, Marathi, Sanskrit)" },
    { re: /[\u0600-\u06FF]/, script: "Arabic", name: "Arabic / Urdu / Persian", hint: "Arabic-script — common for Urdu and Persian too" },
    { re: /[\u3040-\u30FF]/, script: "Kana", name: "Japanese", hint: "Hiragana or Katakana" },
    { re: /[\uAC00-\uD7AF]/, script: "Hangul", name: "Korean", hint: "Hangul" },
    { re: /[\u4E00-\u9FFF]/, script: "CJK", name: "Chinese", hint: "Han ideographs" },
    { re: /[\u0400-\u04FF]/, script: "Cyrillic", name: "Russian / Cyrillic", hint: "Cyrillic script" },
    { re: /[\u0370-\u03FF]/, script: "Greek", name: "Greek", hint: "Greek script" },
    { re: /[\u0590-\u05FF]/, script: "Hebrew", name: "Hebrew", hint: "Hebrew script" },
    { re: /[\u0E00-\u0E7F]/, script: "Thai", name: "Thai", hint: "Thai script" }
  ];
  function detectLanguage(text) {
    const sample = text.trim().slice(0, 2e3);
    if (!sample) return { name: "Unknown", script: "None", hint: "No body text to analyze." };
    for (const check of scriptChecks) {
      if (check.re.test(sample)) return { name: check.name, script: check.script, hint: check.hint };
    }
    const words = sample.split(/\s+/).filter((word) => /[A-Za-z]/.test(word)).length;
    return words > 3 ? { name: "English", script: "Latin", hint: "Latin-script (English)" } : { name: "Undetermined", script: "Latin", hint: "Short or script-neutral content." };
  }
  var audioExtensions = /\.(mp3|wav|m4a|aac|ogg|oga|opus|amr|flac|wma)$/i;
  var dangerousExtensions = /\.(exe|scr|bat|cmd|com|ps1|vbs|vbe|js|jse|jar|hta|msi|lnk|iso|reg|wsf|wsh)$/i;
  var macroExtensions = /\.(docm|xlsm|pptm)$/i;
  function detectAttachments(raw) {
    const found = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (filename) => {
      const clean = filename.replace(/^"|"$/g, "");
      if (!clean || seen.has(clean.toLowerCase())) return;
      seen.add(clean.toLowerCase());
      const kind = dangerousExtensions.test(clean) ? "executable" : audioExtensions.test(clean) ? "audio" : /\.(zip|rar|7z|tar|gz)$/i.test(clean) ? "archive" : /\.(pdf|docx?|xlsx?|pptx?|txt)$/i.test(clean) ? "document" : "other";
      found.push({ filename: clean, kind });
    };
    const audioTypes = /content-type:\s*audio\/[^\s;]+|audio\/(mpeg|wav|x-wav|mp4|ogg|amr|flac)/i;
    if (audioTypes.test(raw)) {
      const names = raw.match(/filename="?([^";\r\n]+)"?/gi);
      if (names) {
        for (const match of names) {
          const file = /filename="?([^";\r\n]+)"?/i.exec(match)?.[1];
          if (file) add(file);
        }
      }
      if (found.every((att) => att.kind !== "audio")) {
        found.push({ filename: "voice message (audio/*)", kind: "audio" });
      }
    } else {
      const names = raw.match(/filename="?([^";\r\n]+)"?/gi);
      if (names) {
        for (const match of names) {
          const file = /filename="?([^";\r\n]+)"?/i.exec(match)?.[1];
          if (file) add(file);
        }
      }
    }
    return found;
  }
  var KNOWN_BRANDS = [
    { name: "Google", domain: "google.com" },
    { name: "Gmail", domain: "gmail.com" },
    { name: "Microsoft", domain: "microsoft.com" },
    { name: "Office 365", domain: "office365.com" },
    { name: "Outlook", domain: "outlook.com" },
    { name: "Apple", domain: "apple.com" },
    { name: "Amazon", domain: "amazon.com" },
    { name: "PayPal", domain: "paypal.com" },
    { name: "LinkedIn", domain: "linkedin.com" },
    { name: "Facebook", domain: "facebook.com" },
    { name: "Instagram", domain: "instagram.com" },
    { name: "Netflix", domain: "netflix.com" },
    { name: "WhatsApp", domain: "whatsapp.com" },
    { name: "Dropbox", domain: "dropbox.com" },
    { name: "Adobe", domain: "adobe.com" },
    { name: "Yahoo", domain: "yahoo.com" },
    { name: "SBI", domain: "sbi.co.in" },
    { name: "HDFC Bank", domain: "hdfcbank.com" },
    { name: "ICICI Bank", domain: "icicibank.com" },
    { name: "Axis Bank", domain: "axisbank.com" },
    { name: "Kotak", domain: "kotak.com" },
    { name: "Paytm", domain: "paytm.com" },
    { name: "PhonePe", domain: "phonepe.com" },
    { name: "NPCI / UPI", domain: "npci.org.in" },
    { name: "UIDAI / Aadhaar", domain: "uidai.gov.in" },
    { name: "Income Tax", domain: "incometax.gov.in" },
    { name: "IRCTC", domain: "irctc.co.in" }
  ];
  var suspiciousTlds = /* @__PURE__ */ new Set(["tk", "ml", "ga", "cf", "gq", "xyz", "top", "icu", "monster", "rest", "click", "link", "work", "download", "racing", "country", "stream", "review", "date", "faith", "science", "zip", "mov", "loan", "win", "bid", "trade", "webcam", "party"]);
  function levenshtein(a, b) {
    if (a.length < b.length) [a, b] = [b, a];
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const curr = [i];
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      }
      prev = curr;
    }
    return prev[b.length];
  }
  function baseDomainOf(domain) {
    return domain.replace(/^www\./, "");
  }
  function impersonationWatchlist(all, orgDomain) {
    const list = KNOWN_BRANDS.map((brand) => ({ ...brand, source: "known brand" }));
    if (orgDomain) list.push({ name: "Your organization", domain: orgDomain, source: "org profile" });
    for (const scan of all) {
      const domain = scan.result.senderAddress.split("@")[1]?.toLowerCase();
      if (domain && !list.some((entry) => entry.domain === domain)) {
        list.push({ name: domain.split(".")[0] ?? domain, domain, source: "evidence history" });
      }
    }
    return list;
  }
  function lookalikeMatches(domain, all, orgDomain) {
    const candidate = baseDomainOf(domain);
    const matches = /* @__PURE__ */ new Set();
    for (const brand of impersonationWatchlist(all, orgDomain)) {
      const target = baseDomainOf(brand.domain);
      if (candidate === target) continue;
      if (candidate.endsWith(`.${target}`)) continue;
      const editDistance = levenshtein(candidate, target);
      if (editDistance <= 1 && candidate.length >= target.length - 2) matches.add(brand.domain);
      else if (candidate.includes(target) && candidate.length > target.length + 1) matches.add(brand.domain);
      else if (target.includes(candidate) && target.length > candidate.length + 1) matches.add(brand.domain);
      else if (candidate.length === target.length && editDistance <= 2) matches.add(brand.domain);
    }
    return [...matches];
  }
  function analyzeDomain(domain, all, orgDomain) {
    const flags = [];
    const lowered = domain.toLowerCase().trim();
    const labels = lowered.split(".");
    const last = labels.at(-1) ?? "";
    const secondLast = labels.at(-2) ?? "";
    if (suspiciousTlds.has(last)) flags.push({ label: "Uncommon TLD", detail: `.${last} is a low-cost top-level domain frequently used in spam infrastructure.`, severity: "high" });
    if (lowered.includes("xn--")) flags.push({ label: "Internationalized domain", detail: "Punycode (xn--) encoding is used — can visually disguise the domain in some clients.", severity: "high" });
    const brandLike = /^(g00gle|paypa1|1inkedin|fac3book|mircosoft|micr0soft|amaz0n|netfl1x)/i.test(lowered);
    if (brandLike) flags.push({ label: "Character-substitution brand lookalike", detail: "Digits or characters swapped with visually similar ones (e.g. 0 for o, 1 for l).", severity: "critical" });
    if (/^\d/.test(secondLast) || /\d{2}/.test(secondLast)) flags.push({ label: "Digit-heavy second-level label", detail: `"${secondLast}" contains digit patterns — a common obfuscation tactic.`, severity: "medium" });
    if (secondLast.includes("--") || (secondLast.match(/-/g)?.length ?? 0) > 2) flags.push({ label: "Unusual hyphenation", detail: `"${secondLast}" uses hyphens heavily — attacker domains often need free names.`, severity: "medium" });
    if (secondLast.length > 25) flags.push({ label: "Overlong label", detail: `"${secondLast}" is unusually long for a legitimate registered domain.`, severity: "info" });
    if (labels.length > 3) flags.push({ label: "Deep subdomain chain", detail: `${labels.length} labels — legitimate mail rarely sits this far down a subdomain tree.`, severity: "medium" });
    return { domain, flags, impersonates: lookalikeMatches(lowered, all, orgDomain) };
  }
  var urlShorteners = /* @__PURE__ */ new Set(["bit.ly", "tinyurl.com", "goo.gl", "t.co", "is.gd", "buff.ly", "ow.ly", "shorturl.at", "rb.gy", "cutt.ly", "shorte.st", "adf.ly", "bl.ink", "v.gd"]);
  var credentialPath = /(login|signin|sign-in|verify|secure|account|update|confirm|webscr|unlock|recover|password|credential|validation)/i;
  function analyzeUrl(url, all, orgDomain) {
    const flags = [];
    let host = "";
    try {
      const parsed = new URL(url);
      host = parsed.hostname.toLowerCase().replace(/^www\./, "");
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname)) flags.push({ label: "IP-literal host", detail: "The address points directly at an IP, bypassing domain reputation entirely.", severity: "high" });
      if (parsed.username || parsed.password) flags.push({ label: "Credentials in URL", detail: "The link embeds credentials — a classic deception trick for display purposes.", severity: "critical" });
      if (parsed.port && parsed.port !== "80" && parsed.port !== "443") flags.push({ label: "Unusual port", detail: `Uses port ${parsed.port}`, severity: "medium" });
      if (parsed.protocol !== "https:") flags.push({ label: "Not HTTPS", detail: "The link is served over plain HTTP — credentials or content can be intercepted.", severity: "high" });
      if (urlShorteners.has(host)) flags.push({ label: "URL shortener", detail: "Shortened links hide the real destination from the preview.", severity: "medium" });
      if (credentialPath.test(parsed.pathname)) flags.push({ label: "Credential-harvesting path", detail: "Path suggests a login/verification page — common in credential phishing.", severity: "high" });
    } catch {
      flags.push({ label: "Malformed URL", detail: "Could not parse this as a valid URL.", severity: "medium" });
    }
    return { url, host, flags, impersonates: host ? lookalikeMatches(host, all, orgDomain) : [] };
  }
  function analyzeIocs(allIocs, all, orgDomain) {
    const domains = /* @__PURE__ */ new Map();
    const urls = /* @__PURE__ */ new Map();
    for (const ioc of allIocs) {
      if (ioc.type === "Domain" && !domains.has(ioc.value.toLowerCase())) {
        domains.set(ioc.value.toLowerCase(), analyzeDomain(ioc.value, all, orgDomain));
      }
      if (ioc.type === "URL" && !urls.has(ioc.value)) {
        urls.set(ioc.value, analyzeUrl(ioc.value, all, orgDomain));
      }
    }
    return { domains, urls };
  }
  function threatCorrelation(scan, all) {
    const current = extractIocs(scan.raw, scan.result);
    const currentKeys = new Set(current.map((ioc) => `${ioc.type}:${ioc.value.toLowerCase()}`));
    const seenElsewhere = /* @__PURE__ */ new Map();
    for (const other of all) {
      if (other.id === scan.id) continue;
      for (const ioc of extractIocs(other.raw, other.result)) {
        const key = `${ioc.type}:${ioc.value.toLowerCase()}`;
        if (!currentKeys.has(key)) continue;
        seenElsewhere.set(key, (seenElsewhere.get(key) ?? 0) + 1);
      }
    }
    return [...seenElsewhere.entries()].map(([key, count]) => {
      const [type, value] = key.split(":");
      return { type, value: value ?? key, count };
    }).sort((a, b) => b.count - a.count);
  }
  var countryOffsetMinutes = {
    IN: 330,
    PK: 300,
    BD: 360,
    LK: 330,
    NP: 345,
    US: -420,
    CA: -300,
    MX: -360,
    BR: -180,
    AR: -180,
    GB: 0,
    IE: 0,
    PT: 0,
    FR: 60,
    DE: 60,
    ES: 60,
    IT: 60,
    NL: 60,
    RU: 180,
    TR: 180,
    NG: 60,
    GH: 0,
    KE: 180,
    ZA: 120,
    EG: 120,
    SA: 180,
    AE: 240,
    IL: 180,
    SG: 480,
    MY: 480,
    ID: 420,
    TH: 420,
    VN: 420,
    PH: 480,
    CN: 480,
    HK: 480,
    TW: 480,
    JP: 540,
    KR: 540,
    AU: 600,
    NZ: 720
  };
  function headerOffsetMinutes(dateValue) {
    const match = /([+-])(\d{2})(\d{2})/.exec(dateValue);
    if (!match) return null;
    const sign = match[1] === "-" ? -1 : 1;
    const hours = Number(match[2]);
    const minutes = Number(match[3]);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return sign * (hours * 60 + minutes);
  }
  function hourInHeaderZone(dateValue) {
    const match = /(\d{1,2}):(\d{2})/.exec(dateValue);
    const offset = headerOffsetMinutes(dateValue);
    if (!match || offset === null) return null;
    const hour = Number(match[1]);
    if (Number.isNaN(hour)) return null;
    return ((hour - Math.round(offset / 60)) % 24 + 24) % 24;
  }
  function anomaliesFor(scan, all) {
    const anomalies = [];
    const others = all.filter((candidate) => candidate.id !== scan.id);
    const senderDomain = scan.result.senderAddress.split("@")[1]?.toLowerCase();
    const originIp = originIpOf(scan);
    const originGeo = originIp ? scan.geo?.[originIp] ?? null : null;
    if (senderDomain) {
      const history = others.filter((other) => other.result.senderAddress.toLowerCase().endsWith(`@${senderDomain}`));
      if (history.length === 0 && others.length >= 1) {
        anomalies.push({
          label: "First contact from this sender domain",
          detail: `"${senderDomain}" has never sent to this workspace before. First-time senders deserve extra verification regardless of content.`,
          severity: "medium"
        });
      } else if (history.length > 0 && originGeo) {
        const previousCountries = /* @__PURE__ */ new Set();
        for (const other of history) {
          const ip = originIpOf(other);
          const geo = ip ? other.geo?.[ip] ?? null : null;
          if (geo && geo.countryCode) previousCountries.add(geo.countryCode);
        }
        if (previousCountries.size > 0 && !previousCountries.has(originGeo.countryCode)) {
          anomalies.push({
            label: "Origin country shift",
            detail: `This sender previously arrived from ${[...previousCountries].join(", ")}, and now arrives from ${originGeo.country} (${originGeo.city}, ${originGeo.region}). Compromised accounts often change origin suddenly.`,
            severity: "critical"
          });
        }
      }
    }
    const offset = headerOffsetMinutes(scan.result.receivedAt);
    const expected = originGeo && originGeo.countryCode ? countryOffsetMinutes[originGeo.countryCode] : void 0;
    if (originGeo && offset !== null && expected !== void 0) {
      const delta = Math.abs(offset - expected);
      if (delta >= 240) {
        anomalies.push({
          label: "Sender-timezone inconsistency",
          detail: `The message claims UTC${offset >= 0 ? "+" : ""}${offset / 60} (${offset >= 0 ? "east" : "west"} of UTC) while its origin infrastructure sits in ${originGeo.country} (usually UTC${expected >= 0 ? "+" : ""}${expected / 60}). A legitimate sender rarely clocks hours away from their location.`,
          severity: "high"
        });
      }
    }
    const hour = hourInHeaderZone(scan.result.receivedAt);
    if (hour !== null && (hour < 6 || hour > 22)) {
      anomalies.push({
        label: "Unusual sending hour",
        detail: `The message time corresponds to ${hour === 0 ? "midnight" : `${hour}:00`} in its own timezone — outside typical business hours. Not proof of anything alone, but worth noting.`,
        severity: "info"
      });
    }
    const authFails = (scan.auth?.checks ?? []).filter((check) => check.outcome === "fail").length;
    if (authFails > 0) {
      anomalies.push({
        label: "Live authentication failures",
        detail: `${authFails} DNS-level authentication check${authFails === 1 ? "" : "s"} failed at scan time (see Header analysis).`,
        severity: "high"
      });
    }
    const body = scan.result.bodyPreview;
    if (body && body !== "No message body detected.") {
      const language = detectLanguage(body);
      if (language.script !== "Latin" && language.script !== "None") {
        anomalies.push({
          label: "Non-English message body",
          detail: `The body is written in a ${language.script} script (${language.name}). Multilingual phishing is common — have the content reviewed in the sender's language.`,
          severity: "info"
        });
      }
    }
    const attachments = detectAttachments(scan.raw);
    if (attachments.some((att) => att.kind === "audio")) {
      anomalies.push({
        label: "Audio attachment present",
        detail: "The message carries a voice/audio file. Content cannot be inspected in the local build — treat it as untrusted until it is reviewed (transcription arrives with the server build).",
        severity: "medium"
      });
    }
    return anomalies;
  }
  function subjectTokens(subject) {
    return new Set(subject.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3));
  }
  function incidentSimilarity(scan, all) {
    const current = extractIocs(scan.raw, scan.result);
    const currentIocKeys = new Set(current.map((ioc) => `${ioc.type}:${ioc.value.toLowerCase()}`));
    const currentSubjects = subjectTokens(scan.result.subject);
    const senderDomain = scan.result.senderAddress.split("@")[1]?.toLowerCase();
    const replyDomain = scan.result.replyTo.includes("@") ? scan.result.replyTo.split("@")[1]?.toLowerCase() : null;
    const originIp = originIpOf(scan);
    const results = [];
    for (const other of all) {
      if (other.id === scan.id) continue;
      let score = 0;
      const reasons = [];
      const otherSender = other.result.senderAddress.split("@")[1]?.toLowerCase();
      if (senderDomain && senderDomain === otherSender) {
        score += 30;
        reasons.push("same sender domain");
      }
      if (replyDomain && other.result.replyTo.includes("@") && replyDomain === other.result.replyTo.split("@")[1]?.toLowerCase()) {
        score += 15;
        reasons.push("same reply domain");
      }
      const otherOrigin = originIpOf(other);
      if (originIp && originIp === otherOrigin) {
        score += 25;
        reasons.push("same origin IP");
      }
      for (const ioc of extractIocs(other.raw, other.result)) {
        const key = `${ioc.type}:${ioc.value.toLowerCase()}`;
        if (currentIocKeys.has(key)) {
          score += ioc.type === "IP" ? 10 : ioc.type === "Email" ? 8 : 6;
          reasons.push(`shares IoC ${ioc.value}`);
          break;
        }
      }
      const overlap = [...currentSubjects].filter((token) => subjectTokens(other.result.subject).has(token)).length;
      if (overlap >= 2) {
        score += 5 + overlap;
        reasons.push(`${overlap} subject keywords match`);
      }
      if (score >= 12) results.push({ scan: other, score: Math.min(99, score), reasons: reasons.slice(0, 3) });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 4);
  }
  function priorityOf(scan, all) {
    const score = scan.result.riskScore;
    const anomalies = anomaliesFor(scan, all);
    const escalated = anomalies.some((anomaly) => anomaly.severity === "critical");
    let level = score >= 75 ? "P1" : score >= 55 ? "P2" : score >= 30 ? "P3" : "P4";
    if (escalated && level !== "P1") {
      level = level === "P4" ? "P3" : level === "P3" ? "P2" : "P2";
    }
    const labels = { P1: "Immediate", P2: "High", P3: "Standard", P4: "Monitor" };
    const escalationNote = escalated ? ` — escalated by the ${anomalies.find((a) => a.severity === "critical")?.label.toLowerCase() ?? "critical anomaly"} signal` : "";
    return { level, label: labels[level], reason: `${scan.result.riskLabel} score ${score}/100${escalationNote}.` };
  }
  function buildBriefing(scan, all, orgDomain) {
    const r = scan.result;
    const auth = scan.auth?.checks ?? [];
    const failedAuth = auth.filter((check) => check.outcome === "fail");
    const passedAuth = auth.filter((check) => check.outcome === "pass");
    const originIp = originIpOf(scan);
    const originGeo = originIp ? scan.geo?.[originIp] ?? null : null;
    const senderDomain = r.senderAddress.split("@")[1]?.toLowerCase() ?? "unknown domain";
    const replyDomain = r.replyTo.includes("@") ? r.replyTo.split("@")[1]?.toLowerCase() : null;
    const replyMismatch = replyDomain && senderDomain !== replyDomain;
    const language = detectLanguage(r.bodyPreview);
    const attachments = detectAttachments(scan.raw);
    const watchlist = impersonationWatchlist(all, orgDomain);
    const impersonated = watchlist.filter((entry) => entry.domain !== senderDomain && lookalikeMatches(senderDomain, all, orgDomain).includes(entry.domain));
    const highRisk = r.riskLabel === "Critical" || r.riskLabel === "High";
    let headline;
    if (highRisk) headline = `Do not act on this message — ${r.riskLabel} risk (${r.riskScore}/100)`;
    else if (r.riskLabel === "Medium") headline = `Verify before acting — ${r.riskLabel} risk (${r.riskScore}/100)`;
    else headline = `No credible threat signals — ${r.riskLabel} risk (${r.riskScore}/100)`;
    const authSentence = failedAuth.length > 0 ? `${failedAuth.length} live DNS authentication check${failedAuth.length === 1 ? "" : "s"} failed (${failedAuth.map((c) => `${c.kind} on ${c.domain}`).join(", ")}).` : passedAuth.length > 0 ? `Live DNS authentication passed or was neutral (${passedAuth.length} check${passedAuth.length === 1 ? "" : "s"}).` : "No live DNS checks were recorded for this case.";
    const originSentence = originGeo ? `The relay path originates from ${originGeo.city}, ${originGeo.country} (${originGeo.asn || "unknown ASN"}${originGeo.isp ? `, ${originGeo.isp}` : ""}).` : originIp ? "The earliest disclosed IP is hidden by the sending provider — normal for Google-hosted mail." : "No origin IP was disclosed in the headers.";
    const signalSentence = r.findings.filter((finding) => finding.severity !== "info").length > 0 ? `Key signals: ${r.findings.filter((finding) => finding.severity !== "info").map((f) => f.label.toLowerCase()).join(", ")}.` : "No configured threat signals matched.";
    const summary = `${r.sender} claims to be “${r.sender !== r.senderAddress ? r.sender : senderDomain}”. ${authSentence} ${originSentence} ${signalSentence}`;
    const keyFacts = [
      `Sender domain: ${senderDomain}`,
      `Reply-to: ${r.replyTo}${replyMismatch ? ` — differs from the sender domain (${replyDomain})` : ""}`,
      `Origin: ${originGeo ? `${originGeo.city}, ${originGeo.country}${originGeo.asn ? ` · ${originGeo.asn}` : ""}` : originIp ? "Hidden by provider" : "Not disclosed"}`,
      `Body language: ${language.name}`
    ];
    if (attachments.length > 0) keyFacts.push(`Attachments: ${attachments.map((att) => att.filename).join(", ")}${attachments.some((a) => a.kind === "audio") ? " (audio — transcription is a server-build item)" : ""}`);
    const iocCount = extractIocs(scan.raw, r).length;
    keyFacts.push(`Indicators extracted: ${iocCount}`);
    if (impersonated.length > 0) keyFacts.push(`Impersonation watch: this sender domain looks like ${[...new Set(impersonated.map((e) => e.domain))].join(", ")}`);
    const recommendations = [];
    if (highRisk || failedAuth.length > 0) {
      recommendations.push("Do not click links, reply, or open attachments in this message.");
      recommendations.push("Contact the sender through a previously known channel — not the address in this message.");
      recommendations.push("Escalate to your security team, quoting this case id.");
    } else if (replyMismatch || r.riskLabel === "Medium") {
      recommendations.push("Verify the request through a known channel before acting on it.");
      recommendations.push("Do not use the reply address in this message; it routes to a different domain.");
    } else {
      recommendations.push("No action required beyond standard caution.");
    }
    if (attachments.some((att) => att.kind === "audio")) recommendations.push("The voice attachment is untrusted in the local build — transcription arrives with the server integration.");
    recommendations.push("Evidence is stored with a re-verifiable SHA-256 fingerprint (Evidence vault).");
    return { headline, summary, keyFacts, recommendations };
  }
  var classMeta = {
    fraud: { label: "Fraud / BEC", blurb: "Financial or business-email compromise pattern — payment diversion, fake invoices, or executive impersonation with a money/credential request.", tone: "critical" },
    phishing: { label: "Phishing", blurb: "Credential-harvesting lures, malicious or disguised links, or live authentication failures.", tone: "critical" },
    impersonated: { label: "Impersonation", blurb: "The sender or its links mimic a known brand, executive, or your organization — the identity is not what it claims to be.", tone: "warning" },
    suspicious: { label: "Suspicious", blurb: "Unusual signals that warrant verification, but no confirmed attack pattern yet.", tone: "brand" },
    legitimate: { label: "Legitimate", blurb: "No credible threat signals and no authentication failures.", tone: "safe" }
  };
  var urgencyRe = /\b(urgent|immediately|immediate action|asap|as soon as possible|act (now|today)|right away|don'?t delay|time[- ]sensitive|expires? (today|soon)|last warning|final (notice|reminder)|response required|within \d+\s*(hours?|minutes?|days?)|deadline|overdue|only \d+\s*(hours?|days?))\b/i;
  var fearRe = /\b(account (suspended|locked|limited|closed|will be closed|compromised|on hold)|unauthorized (transaction|login|access|activity|charge)|suspicious (activity|login|transaction|sign-?in)|security (breach|incident|alert)|legal (action|proceedings|notice|threat)|lawsuit|tax (penalty|refund|assessment)|arrest warrant|identity (theft|stolen)|you owe|debt|deactivated|terminated|blocked|penalty)\b/i;
  var greedRe = /\b(prize|lottery|winner|you have won|inheritance|bequest|gift cards?|refund (pending|due|approved)|compensation|selected (for|as)|free (iphone|phone|trip|vacation|gift)|discount|reward|winnings)\b/i;
  var authorityRe = /\b(ceo|cfp?o|coo|cto|president|chairman|managing director|director|vice president|senior (vice )?president|principal|dean|h\s?o\s?d|head of|commissioner|secretary|administrator|board|director general|officer)\b/i;
  var secrecyRe = /\b(confidential|do not (share|disclose|tell|discuss)|keep (this )?(between us|private|secret|discreet)|strictly private|discreet)\b/i;
  function analyzeTactics(subject, body) {
    const text = `${subject} ${body}`.slice(0, 4e3);
    const result = { urgency: [], fear: [], greed: [], authority: [], pressure: [] };
    const groups = [
      { key: "urgency", label: "Urgency pressure", detail: "Time pressure is the #1 social-engineering lever — it pushes victims to act before they verify.", re: urgencyRe, severity: "high" },
      { key: "fear", label: "Fear / threat framing", detail: "The message threatens consequences (account loss, legal action, penalties) to bypass careful judgment.", re: fearRe, severity: "high" },
      { key: "greed", label: "Greed / reward lure", detail: "Prizes, refunds, and windfalls are used to buy attention and lower suspicion.", re: greedRe, severity: "medium" },
      { key: "authority", label: "Authority figure invoked", detail: "Executive or institutional authority is referenced to make demands feel legitimate.", re: authorityRe, severity: "medium" },
      { key: "pressure", label: "Secrecy / confidentiality pressure", detail: "Requests to keep the matter secret isolate the victim from colleagues who could verify.", re: secrecyRe, severity: "medium" }
    ];
    for (const group of groups) {
      if (group.re.test(text)) result[group.key].push({ label: group.label, detail: group.detail, severity: group.severity });
    }
    if (/\bkindly\b/i.test(text)) {
      result.pressure.push({ label: "Kindly language", detail: "“Kindly” is over-represented in scam mail, though it is also normal Indian business English — low weight on its own.", severity: "info" });
    }
    if (/\b[A-Z]{4,}\b/.test(subject)) {
      result.urgency.push({ label: "ALL-CAPS emphasis", detail: "The subject line shouts in capitals — amateur social-engineering styling.", severity: "info" });
    }
    if (/!{2,}/.test(subject)) {
      result.urgency.push({ label: "Exclamation overload", detail: "Repeated exclamation marks in the subject line are a common phishing styling tell.", severity: "info" });
    }
    return result;
  }
  var freeMailDomains = /* @__PURE__ */ new Set(["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "yahoo.com", "yahoo.in", "rediffmail.com", "live.com", "icloud.com", "aol.com", "proton.me", "protonmail.com", "zoho.com", "mail.com", "yandex.com", "gmx.com", "tutanota.com"]);
  var execTitleRe = /\b(ceo|cfp?o|coo|cto|chairman|managing director|director|vice president|senior vice president|principal|dean|h\s?o\s?d|head of|commissioner|secretary|administrator|executive)\b/i;
  function spoofingSignals(scan, all, orgDomain) {
    const flags = [];
    const r = scan.result;
    const display = r.sender.trim();
    const fromDomain = r.senderAddress.split("@")[1]?.toLowerCase() ?? "";
    const cleanReturnPath = r.returnPath.replace(/[<>]/g, "").trim();
    const returnDomain = cleanReturnPath.includes("@") ? cleanReturnPath.split("@")[1]?.toLowerCase() : "";
    if (fromDomain && returnDomain && returnDomain !== fromDomain) {
      flags.push({
        label: "Sender / Return-Path mismatch",
        detail: `The From header uses ${fromDomain} but the Return-Path belongs to ${returnDomain} — the envelope is not aligned with the displayed sender.`,
        severity: "high"
      });
    }
    const looksLikeOrg = /(official|support|admin|care|help|service|bank|team|hr|ceo|director|principal|executive|office|nodal|desk)/i.test(display);
    if (fromDomain && freeMailDomains.has(fromDomain) && display !== r.senderAddress && looksLikeOrg) {
      flags.push({
        label: "Free-mail sender posing as an organization",
        detail: `“${display}” claims an institutional role but sends from ${fromDomain} — a free mailbox. Legitimate institutions mail from their own domain.`,
        severity: "critical"
      });
    }
    const watchlist = impersonationWatchlist(all, orgDomain);
    const displayLower = display.toLowerCase();
    for (const entry of watchlist) {
      const brandName = entry.name.toLowerCase();
      if (brandName.length >= 3 && displayLower.includes(brandName)) {
        const nameStem = entry.domain.split(".")[0] ?? "";
        if (!displayLower.includes(nameStem) && fromDomain !== entry.domain && fromDomain !== "") {
          flags.push({
            label: "Display-name impersonation",
            detail: `The sender name contains “${entry.name}” (protected: ${entry.source}) but the message is sent from ${fromDomain}, not ${entry.domain}.`,
            severity: "critical"
          });
          break;
        }
      }
    }
    if (execTitleRe.test(display) && fromDomain && freeMailDomains.has(fromDomain)) {
      flags.push({
        label: "Executive title on a free mailbox",
        detail: `The sender presents as an executive but uses a free mailbox (${fromDomain}). Real executives sign from organizational domains.`,
        severity: "high"
      });
    }
    return flags;
  }
  function linkDisguise(raw) {
    const flags = [];
    const seen = /* @__PURE__ */ new Set();
    for (const match of raw.matchAll(/<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi)) {
      const href = match[1] ?? "";
      const text = (match[2] ?? "").trim();
      if (!href || !text) continue;
      try {
        const parsed = new URL(href);
        const hrefHost = parsed.hostname.replace(/^www\./, "").toLowerCase();
        let textHost = null;
        try {
          textHost = new URL(text).hostname.replace(/^www\./, "").toLowerCase();
        } catch {
        }
        if (textHost && textHost !== hrefHost && !seen.has(href)) {
          seen.add(href);
          flags.push({
            label: "Link text vs destination mismatch",
            detail: `The link displays “${text}” but actually points to ${hrefHost}. The visible text is safe; the target is not.`,
            severity: "critical"
          });
        }
        if (/^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname) && !seen.has(href)) {
          seen.add(href);
          flags.push({
            label: "IP-literal link",
            detail: `The link target is a raw IP address (${parsed.hostname}) — domain reputation is bypassed entirely.`,
            severity: "high"
          });
        }
      } catch {
      }
    }
    if (/href\s*=\s*["'][^"']*(%[0-9a-f]{2}){2,}/i.test(raw)) {
      flags.push({
        label: "Obfuscated (encoded) URL",
        detail: "A link uses percent-encoding in its host segment — an obfuscation technique that can hide the real destination.",
        severity: "high"
      });
    }
    return flags;
  }
  function attachmentThreatFlags(attachments) {
    const flags = [];
    const executables = attachments.filter((att) => att.kind === "executable" || macroExtensions.test(att.filename));
    if (executables.length > 0) {
      flags.push({
        label: "Executable / macro attachment",
        detail: `${executables.map((att) => att.filename).join(", ")} — executable or macro-enabled files are the primary malware delivery vehicle and are blocked by most mail gateways.`,
        severity: "critical"
      });
    }
    const archives = attachments.filter((att) => att.kind === "archive");
    if (archives.length > 0) {
      flags.push({
        label: "Archive attachment",
        detail: `${archives.map((att) => att.filename).join(", ")} — archives are commonly used to smuggle executables past scanners.`,
        severity: "medium"
      });
    }
    const audio = attachments.filter((att) => att.kind === "audio");
    if (audio.length > 0) {
      flags.push({
        label: "Audio attachment (untranscribed)",
        detail: `${audio.map((att) => att.filename).join(", ")} — voice files cannot be inspected in the local build; transcription arrives with the server integration.`,
        severity: "medium"
      });
    }
    return flags;
  }
  var becGroups = [
    {
      id: "payment-diversion",
      label: "Payment diversion",
      detail: "Requests to change payment/bank details are the hallmark of business email compromise — confirm through a verified channel before acting.",
      re: /(update (your )?(payment|bank|direct deposit)|new (bank )?(account|payment) (details|information)|payment (details|information) (changed|updated|verify|re-?verified)|change of (bank |payment )?(account|details)|switched (banks?|payroll|accounts?)|different (bank )?(account|details)|beneficiary|remittance|payroll (change|update)|re-?routing|new (account|iban)|account (details|number) (changed|updated))/i
    },
    {
      id: "fake-invoice",
      label: "Fake invoice",
      detail: "Invoice, outstanding-balance, or payment-overdue language without verifiable billing context.",
      re: /(invoice (attached|enclosed|available|below|for|#\s?\d+)|outstanding (invoice|payment|balance|amount)|payment (pending|overdue|required|is due)|overdue (invoice|payment)|settle (the )?(invoice|amount|payment)|remittance|advance payment|credit note|purchase order)/i
    },
    {
      id: "credential-harvest",
      label: "Credential harvesting",
      detail: "Account-verification or password language is the most common credential-theft lure.",
      re: /(verify (your )?(account|identity|credentials|information)|confirm (your )?(account|password|login|identity)|password (expired|reset|change|update|will be)|account (suspended|locked|limited|will be (closed|deactivated)|on hold)|security (check|update|verification|alert)|re-?authenticate|login (page|link|details)|sign in to (verify|update|confirm)|unusual (activity|login|sign-?in|transaction)|quota (exceeded|full))/i
    }
  ];
  var requestVerbRe = /\b(kindly|please|request|need|require|send|transfer|pay|approve|process|purchase|buy|share|provide|help|urgent)\b/i;
  var moneyRe = /\b(payment|pay|bank|account|funds?|money|wire|transfer|invoice|credential|password|gift cards?|vouchers?|amount|salary|remuneration)\b/i;
  function detectBecPatterns(subject, body, displayName) {
    const text = `${subject} ${body}`.slice(0, 4e3);
    const found = [];
    for (const group of becGroups) {
      if (group.re.test(text)) {
        found.push({ id: group.id, label: group.label, detail: group.detail, severity: group.id === "credential-harvest" ? "high" : "critical" });
      }
    }
    const titleInName = execTitleRe.test(displayName);
    const titleInBody = execTitleRe.test(text);
    if ((titleInName || titleInBody) && requestVerbRe.test(text) && moneyRe.test(text)) {
      found.push({
        id: "executive-impersonation",
        label: "Executive impersonation",
        detail: titleInName ? `The sender presents as “${displayName}” and asks for action involving money or credentials — the classic fake-executive pattern.` : "An executive role is invoked while requesting money or credentials — the classic fake-CEO pattern.",
        severity: "critical"
      });
    }
    return found;
  }
  var evidenceWeight = (severity) => severity === "critical" ? 24 : severity === "high" ? 15 : severity === "medium" ? 8 : 2;
  function classifyEmail(scan, all, orgDomain) {
    const r = scan.result;
    const evidence = [];
    for (const finding of r.findings) {
      if (finding.severity !== "info") evidence.push(finding);
    }
    const authFails = (scan.auth?.checks ?? []).filter((check) => check.outcome === "fail");
    for (const check of authFails) {
      evidence.push({ label: `${check.kind} failed (live DNS)`, detail: check.detail, severity: "high" });
    }
    const iocs = extractIocs(scan.raw, r);
    const analysis = analyzeIocs(iocs, all, orgDomain);
    const impersonatedDomains = /* @__PURE__ */ new Set();
    const impersonatedUrls = /* @__PURE__ */ new Set();
    for (const dom of analysis.domains.values()) {
      for (const flag of dom.flags) evidence.push(flag);
      if (dom.impersonates.length > 0) {
        evidence.push({ label: "Lookalike domain impersonation", detail: `${dom.domain} closely resembles protected domain${dom.impersonates.length === 1 ? "" : "s"} ${dom.impersonates.join(", ")} — a deceptive-domain pattern.`, severity: "critical" });
        for (const target of dom.impersonates) impersonatedDomains.add(target);
      }
    }
    for (const url of analysis.urls.values()) {
      for (const flag of url.flags) evidence.push(flag);
      if (url.impersonates.length > 0) {
        evidence.push({ label: "Link host impersonates protected domain", detail: `${url.host} closely resembles ${url.impersonates.join(", ")} — clicking could land on a spoofed login.`, severity: "critical" });
        for (const target of url.impersonates) impersonatedUrls.add(target);
      }
    }
    const indicators = [...spoofingSignals(scan, all, orgDomain), ...linkDisguise(scan.raw), ...attachmentThreatFlags(detectAttachments(scan.raw))];
    for (const flag of indicators) evidence.push(flag);
    const bec = detectBecPatterns(r.subject, r.bodyPreview, r.sender).map((pattern) => ({ label: pattern.label, detail: pattern.detail, severity: pattern.severity }));
    for (const flag of bec) evidence.push(flag);
    const tactics = analyzeTactics(r.subject, r.bodyPreview);
    for (const anomaly of anomaliesFor(scan, all)) {
      if (anomaly.severity === "critical" || anomaly.severity === "high") evidence.push(anomaly);
    }
    const hasPaymentDiversion = bec.some((pattern) => pattern.label === "Payment diversion");
    const hasFakeInvoice = bec.some((pattern) => pattern.label === "Fake invoice");
    const hasCredHarvest = bec.some((pattern) => pattern.label === "Credential harvesting");
    const hasExecImpersonation = bec.some((pattern) => pattern.label === "Executive impersonation");
    const hasUrgency = tactics.urgency.some((tactic) => tactic.severity !== "info");
    const hasAuthFailure = authFails.length > 0;
    const hasImpersonation = impersonatedDomains.size > 0 || impersonatedUrls.size > 0 || indicators.some((i) => i.label === "Display-name impersonation");
    const hasLinkThreat = indicators.some((i) => i.label === "Link text vs destination mismatch" || i.label === "IP-literal link" || i.label === "Obfuscated (encoded) URL" || i.label === "Executable / macro attachment");
    const financialContext = /(payment|invoice|bank|wire|transfer|beneficiary|remittance|pay|account)/i.test(`${r.subject} ${r.bodyPreview}`);
    let className;
    if ((hasPaymentDiversion || hasFakeInvoice) && (hasUrgency || hasAuthFailure || hasImpersonation || hasExecImpersonation)) {
      className = "fraud";
    } else if (hasExecImpersonation) {
      className = "fraud";
    } else if (hasImpersonation) {
      className = "impersonated";
    } else if (hasCredHarvest || hasLinkThreat || hasAuthFailure || hasUrgency && financialContext) {
      className = "phishing";
    } else {
      const strong = evidence.filter((item) => item.severity === "critical" || item.severity === "high");
      const medium = evidence.filter((item) => item.severity === "medium");
      className = r.riskScore >= 40 || strong.length > 0 || medium.length >= 2 ? "suspicious" : "legitimate";
    }
    const total = evidence.reduce((sum, item) => sum + evidenceWeight(item.severity), 0);
    const confidence = className === "legitimate" ? Math.max(50, 97 - Math.min(45, total)) : Math.max(38, Math.min(96, 35 + total));
    const topDrivers = evidence.filter((item) => item.severity === "critical" || item.severity === "high").slice(0, 2).map((item) => item.label.toLowerCase());
    const verdict = topDrivers.length > 0 ? `Classified as ${classMeta[className].label} — driven by ${topDrivers.join(" and ")}.` : `Classified as ${classMeta[className].label}.`;
    return { className, confidence, verdict, bec, tactics, indicators, evidence };
  }
  var attributionMeta = {
    "verified-identity": {
      label: "Verified sender identity",
      description: "Authentication passes live and no deception or malicious-infrastructure signals were found — the message is plausibly from the party it claims."
    },
    "spoofed-identity": {
      label: "Spoofed / impersonated identity",
      description: "The displayed identity does not match the sending infrastructure — lookalike domain, display-name impersonation, or misaligned envelope fields."
    },
    "compromised-account": {
      label: "Possible compromised account",
      description: "The sender passes authentication for a known domain, but behavior (origin shift, unusual hour, phishing content) suggests the mailbox may be controlled by an attacker."
    },
    "anonymized-actor": {
      label: "Anonymized infrastructure",
      description: "The message traversed anonymizing infrastructure (Tor exit or relay operator) — commonly used to hide the true sender location."
    },
    "malicious-actor": {
      label: "Direct malicious actor",
      description: "Origin infrastructure is blacklisted or carries confirmed attack patterns with failing authentication — consistent with a spam/botnet or phishing operator."
    },
    unverified: {
      label: "Identity unverified",
      description: "Not enough verifiable signal (hidden origin, no live auth) — treat the sender as untrusted until confirmed through another channel."
    }
  };
  function attributionOf(scan, all, orgDomain) {
    const r = scan.result;
    const drivers = [];
    const weight = (severity) => severity === "critical" ? 22 : severity === "high" ? 14 : severity === "medium" ? 7 : 2;
    const checks = scan.auth?.checks ?? [];
    const authFails = checks.filter((check) => check.outcome === "fail");
    const authPasses = checks.filter((check) => check.outcome === "pass");
    for (const check of authFails) drivers.push({ label: `${check.kind} failed (live)`, detail: check.detail, severity: "high" });
    for (const check of authPasses.slice(0, 2)) drivers.push({ label: `${check.kind} passed (live)`, detail: check.detail, severity: "info" });
    const senderDomain = r.senderAddress.split("@")[1]?.toLowerCase() ?? "";
    const replyDomain = r.replyTo.includes("@") ? r.replyTo.split("@")[1]?.toLowerCase() ?? "" : "";
    const originIp = originIpOf(scan);
    const originInfra = originIp ? scan.infra?.[originIp] ?? null : null;
    const anyTor = Object.values(scan.infra ?? {}).some((entry) => entry.torExit);
    const anyBlacklisted = Object.values(scan.infra ?? {}).some((entry) => entry.blacklists.length > 0);
    const originBlacklisted = originInfra !== null && originInfra.blacklists.length > 0;
    const originCloud = originInfra?.cloudHosting === true;
    const iocs = extractIocs(scan.raw, r);
    const analysis = analyzeIocs(iocs, all, orgDomain);
    const domainImpersonates = [...analysis.domains.values()].flatMap((entry) => entry.impersonates);
    const urlImpersonates = [...analysis.urls.values()].flatMap((entry) => entry.impersonates);
    const spoofing = spoofingSignals(scan, all, orgDomain);
    const displayImpersonation = spoofing.find((flag) => flag.label === "Display-name impersonation" || flag.label === "Free-mail sender posing as an organization");
    if (displayImpersonation) drivers.push(displayImpersonation);
    if (domainImpersonates.length > 0) {
      drivers.push({ label: "Lookalike domain", detail: `${senderDomain} resembles ${domainImpersonates.join(", ")}.`, severity: "critical" });
    }
    if (urlImpersonates.length > 0) {
      drivers.push({ label: "Link impersonation", detail: `A link host resembles ${urlImpersonates.join(", ")}.`, severity: "high" });
    }
    const envelopeMismatch = spoofing.find((flag) => flag.label === "Sender / Return-Path mismatch");
    if (envelopeMismatch) drivers.push(envelopeMismatch);
    const anomalies = anomaliesFor(scan, all);
    const originShift = anomalies.find((anomaly) => anomaly.label === "Origin country shift");
    const timezoneOdd = anomalies.find((anomaly) => anomaly.label === "Sender-timezone inconsistency");
    if (originShift) drivers.push(originShift);
    if (timezoneOdd) drivers.push(timezoneOdd);
    const knownSenderDomain = all.some((other) => other.id !== scan.id && other.result.senderAddress.toLowerCase().endsWith(`@${senderDomain}`));
    const replyMismatch = replyDomain && replyDomain !== senderDomain;
    const contentRisk = r.riskScore >= 55;
    const hasFinancialOrCredentialLure = /(verify (your )?(account|password)|invoice|payment|bank details|password|credential)/i.test(`${r.subject} ${r.bodyPreview}`);
    const torNote = anyTor ? "at least one hop traverses a Tor exit relay" : "";
    const blacklistNote = originBlacklisted ? `the origin IP is blacklisted (${originInfra?.blacklists.map((hit) => hit.list).join(", ")})` : anyBlacklisted ? "a hop IP is blacklisted" : "";
    let className;
    if (displayImpersonation || domainImpersonates.length > 0 || urlImpersonates.length > 0 || envelopeMismatch) {
      className = "spoofed-identity";
      if (torNote) drivers.push({ label: "Anonymizing relay", detail: `In addition to the spoofing signals, ${torNote}.`, severity: "high" });
    } else if (originShift && (authPasses.length > 0 || knownSenderDomain) && !anyTor && !anyBlacklisted) {
      className = "compromised-account";
      drivers.push({ label: "Authenticated but behaviorally anomalous", detail: "The sender authenticates for a known domain yet originates from a new country — the classic compromised-mailbox pattern.", severity: "high" });
    } else if ((contentRisk || hasFinancialOrCredentialLure) && authPasses.length > 0 && knownSenderDomain && (originShift || timezoneOdd || contentRisk)) {
      className = "compromised-account";
    } else if (originBlacklisted || authFails.length > 0 && contentRisk && !knownSenderDomain) {
      className = "malicious-actor";
      if (blacklistNote) drivers.push({ label: "Blacklisted origin infrastructure", detail: blacklistNote, severity: "critical" });
    } else if (anyTor || originInfra?.torExit) {
      className = "anonymized-actor";
      drivers.push({ label: "Tor exit in relay path", detail: torNote, severity: "high" });
    } else if (authPasses.length > 0 && !contentRisk && !originShift && !anyBlacklisted && !anyTor) {
      className = "verified-identity";
    } else {
      className = "unverified";
    }
    if (className === "unverified" && replyMismatch) {
      drivers.push({ label: "Reply-to domain differs", detail: `Replies route to ${replyDomain} while the sender claims ${senderDomain}.`, severity: "medium" });
    }
    if (className === "unverified" && !originIp) {
      drivers.push({ label: "Origin IP hidden", detail: "No disclosable origin IP — cannot tie the message to real infrastructure.", severity: "info" });
    }
    if (className === "malicious-actor" && replyMismatch) {
      drivers.push({ label: "Reply-to domain differs", detail: `Replies route to ${replyDomain}, separate from the sender domain.`, severity: "medium" });
    }
    if (className === "anonymized-actor" && !contentRisk && !authFails.length) {
      drivers.push({ label: "No attack content confirmed", detail: "Anonymization alone is not proof of malice — verify the content before acting.", severity: "info" });
    }
    const total = drivers.reduce((sum, flag) => sum + weight(flag.severity), 0);
    let confidence = Math.max(40, Math.min(96, 42 + total));
    if (className === "verified-identity") confidence = Math.max(confidence, 68);
    if (className === "unverified") confidence = Math.min(confidence, 60);
    const meta = attributionMeta[className];
    return { className, label: meta.label, description: meta.description, confidence, drivers: drivers.slice(0, 8) };
  }
  function headerForensics(scan) {
    const r = scan.result;
    const flags = [];
    const headerBlock = scan.raw.split(/\r?\n\r?\n/)[0] ?? scan.raw;
    const headerValue = (name) => new RegExp(`^${name}:\\s*(.+)$`, "im").exec(headerBlock)?.[1]?.trim() ?? "";
    const senderDomain = r.senderAddress.split("@")[1]?.toLowerCase() ?? "";
    const fromHeaders = headerBlock.match(/^from:/gim)?.length ?? 0;
    if (fromHeaders > 1) {
      flags.push({ label: "Multiple From headers", detail: `${fromHeaders} From headers found — mailers emit exactly one; duplicates indicate forged or concatenated content.`, severity: "critical" });
    }
    const messageId = headerValue("message-id");
    if (!messageId) {
      flags.push({ label: "Missing Message-ID", detail: "No Message-ID header — most legitimate mailers add one; its absence is common in bulk-send and phishing tooling.", severity: "medium" });
    } else {
      const midDomain = (messageId.match(/@([^>\]\s]+)/)?.[1] ?? "").toLowerCase();
      if (midDomain && senderDomain && !midDomain.endsWith(senderDomain) && !senderDomain.endsWith(midDomain)) {
        flags.push({ label: "Message-ID host mismatch", detail: `Message-ID belongs to ${midDomain} while the sender claims ${senderDomain}. Forged messages keep the sending system's original ID.`, severity: "high" });
      }
    }
    const dateValue = headerValue("date");
    if (!dateValue) {
      flags.push({ label: "Missing Date header", detail: "No Date header — RFC 5322 requires one; its absence is unusual in legitimate mail.", severity: "medium" });
    } else {
      const parsed = new Date(dateValue);
      if (Number.isNaN(parsed.getTime())) {
        flags.push({ label: "Unparseable Date header", detail: `The Date header (“${dateValue.slice(0, 60)}”) cannot be parsed as a real timestamp.`, severity: "medium" });
      } else {
        const diffMs = Date.now() - parsed.getTime();
        if (diffMs < -24 * 36e5) flags.push({ label: "Date header in the future", detail: "The message is dated more than a day ahead of analysis time — clock skew or header manipulation.", severity: "high" });
        else if (diffMs > 90 * 864e5) flags.push({ label: "Date header unusually old", detail: "The message is dated more than 90 days before analysis — unusual for a fresh delivery.", severity: "info" });
      }
    }
    if (!headerValue("return-path") && r.returnPath === "Not present") {
      flags.push({ label: "Missing Return-Path", detail: "No envelope sender (Return-Path) — bounce handling and some SPF checks cannot be anchored.", severity: "medium" });
    }
    const xOriginating = headerValue("x-originating-ip");
    if (xOriginating) {
      flags.push({ label: "Client IP disclosed (X-Originating-IP)", detail: `The header exposes the originating client IP (${xOriginating.trim()}) — a disclosure most providers strip; useful when present.`, severity: "info" });
    }
    const claimsText = (headerBlock.match(/^authentication-results:.*$/gim) ?? []).join(" ").toLowerCase();
    if (claimsText) {
      for (const check of scan.auth?.checks ?? []) {
        if (check.outcome !== "fail") continue;
        const kind = check.kind.toLowerCase();
        if (new RegExp(`${kind}=pass`).test(claimsText)) {
          flags.push({
            label: "Header overstates authentication vs live DNS",
            detail: `The headers claim ${check.kind} pass for ${check.domain}, but the live DNS check failed: ${check.detail}`,
            severity: "critical"
          });
        }
      }
    }
    if (r.hops.length === 1 && r.hops[0]?.status === "origin" && r.hops[0]?.ip === "Not disclosed") {
      flags.push({ label: "No disclosed relay path", detail: "No Received hop discloses an IP — the sender's infrastructure is fully hidden, normal for Google-hosted mail and a red flag for others.", severity: "info" });
    }
    return flags;
  }

  // src/lib/dns.ts
  var DOH_ENDPOINT = "https://cloudflare-dns.com/dns-query";
  async function queryDns(name, type) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6e3);
    try {
      const url = `${DOH_ENDPOINT}?name=${encodeURIComponent(name)}&type=${type}`;
      const response = await fetch(url, {
        headers: { accept: "application/dns-json" },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`DNS query failed: ${response.status}`);
      const payload = await response.json();
      return payload.Answer ?? [];
    } finally {
      clearTimeout(timer);
    }
  }
  function txtRecord(answer) {
    return (answer.data ?? "").replace(/^"|"$/g, "").replace(/"\s*"/g, "");
  }
  function domainOfAddress(value) {
    const at = value.lastIndexOf("@");
    if (at < 0) return null;
    return value.slice(at + 1).replace(/[>)]/g, "").toLowerCase() || null;
  }
  function splitQualifier(token) {
    const q = token[0];
    if (q === "-" || q === "~" || q === "?" || q === "+") return { qualifier: q, mech: token.slice(1) };
    return { qualifier: "+", mech: token };
  }
  async function evaluateSpf(domain, ip) {
    const answers = await queryDns(domain, "TXT");
    const spfRecord = answers.map(txtRecord).find((txt) => txt.startsWith("v=spf1"));
    if (!spfRecord) {
      return { outcome: "notfound", detail: `No SPF record published for ${domain}.`, mechanisms: [] };
    }
    const tokens = spfRecord.split(/\s+/).slice(1);
    if (!ip) {
      return { outcome: "notfound", detail: `SPF record published for ${domain} (${tokens.length} mechanisms) — no connecting IP was disclosed to evaluate it against.`, mechanisms: tokens };
    }
    const checkMechanism = (token) => {
      const { mech } = splitQualifier(token);
      if (mech === "ip4") return token === `ip4:${ip}`;
      if (mech === "ip6") return token === `ip6:${ip}`;
      return false;
    };
    const walk = async (mechs, depth) => {
      let matched2 = false;
      let qualifier2 = "+";
      let hardAll2 = false;
      let softAll2 = false;
      for (const token of mechs) {
        const { qualifier: q, mech } = splitQualifier(token);
        if (mech === "all") {
          hardAll2 = q === "-";
          softAll2 = q === "~";
          continue;
        }
        if (mech === "ip4" || mech === "ip6") {
          if (checkMechanism(token)) {
            matched2 = true;
            qualifier2 = q;
            return { matched: matched2, qualifier: qualifier2, hardAll: hardAll2, softAll: softAll2 };
          }
          continue;
        }
        if (mech.startsWith("include:") && depth < 3) {
          const includedDomain = mech.slice("include:".length);
          try {
            const included = await evaluateSpf(includedDomain, ip);
            if (included.outcome === "pass") {
              matched2 = true;
              qualifier2 = q;
              return { matched: matched2, qualifier: qualifier2, hardAll: hardAll2, softAll: softAll2 };
            }
          } catch {
          }
        }
      }
      return { matched: matched2, qualifier: qualifier2, hardAll: hardAll2, softAll: softAll2 };
    };
    const { matched, qualifier, hardAll, softAll } = await walk(tokens, 0);
    if (matched) {
      if (qualifier === "-") return { outcome: "fail", detail: `SPF hard fail: ${ip} matched a "-" mechanism on ${domain}.`, mechanisms: tokens };
      if (qualifier === "~") return { outcome: "softfail", detail: `SPF softfail: ${ip} matched a "~" mechanism on ${domain}.`, mechanisms: tokens };
      return { outcome: "pass", detail: `SPF pass: ${ip} is authorized to send for ${domain}.`, mechanisms: tokens };
    }
    if (hardAll) return { outcome: "fail", detail: `SPF hard fail (-all): ${ip} is not authorized to send for ${domain}.`, mechanisms: tokens };
    if (softAll) return { outcome: "softfail", detail: `SPF softfail (~all): ${ip} is not authorized to send for ${domain}.`, mechanisms: tokens };
    return { outcome: "neutral", detail: `SPF record for ${domain} returned no decisive result for ${ip}.`, mechanisms: tokens };
  }
  async function checkDmarc(domain) {
    const answers = await queryDns(`_dmarc.${domain}`, "TXT");
    const record = answers.map(txtRecord).find((txt) => txt.toLowerCase().startsWith("v=dmarc1"));
    if (!record) {
      return { kind: "DMARC", domain, outcome: "notfound", detail: `No DMARC policy published for ${domain}.` };
    }
    const policy = /p=(\w+)/.exec(record)?.[1];
    if (policy === "reject") {
      return { kind: "DMARC", domain, outcome: "fail", detail: `DMARC p=reject: receiving servers should reject mail that fails authentication from ${domain}.` };
    }
    if (policy === "quarantine") {
      return { kind: "DMARC", domain, outcome: "softfail", detail: `DMARC p=quarantine: unauthenticated mail from ${domain} should be quarantined.` };
    }
    if (policy === "none") {
      return { kind: "DMARC", domain, outcome: "neutral", detail: `DMARC p=none for ${domain}: policy is published but not enforced.` };
    }
    return { kind: "DMARC", domain, outcome: "neutral", detail: `DMARC record found for ${domain}: ${record.slice(0, 160)}`.replace(/\s+/g, " ") };
  }
  var DKIM_SELECTORS = ["default", "google", "selector1", "selector2", "s1", "s2", "k1", "k2", "mail", "2024", "2025"];
  async function checkDkim(domain) {
    const probed = await Promise.all(
      DKIM_SELECTORS.map(async (selector) => {
        try {
          const answers = await queryDns(`${selector}._domainkey.${domain}`, "TXT");
          const record = answers.map(txtRecord).find((txt) => txt.toLowerCase().includes("v=dkim1"));
          return record ? { selector, record } : null;
        } catch {
          return null;
        }
      })
    );
    const found = probed.find((entry) => entry !== null);
    if (found) {
      const dTag = /(?:^|;)\s*d=([^\s;]+)/i.exec(found.record)?.[1];
      const aligned = !dTag || dTag.toLowerCase() === domain;
      return aligned ? { kind: "DKIM", domain, outcome: "pass", detail: `DKIM key published for selector "${found.selector}" on ${domain}.` } : { kind: "DKIM", domain, outcome: "softfail", detail: `DKIM key found under "${found.selector}" but d=${dTag} does not match ${domain}.` };
    }
    return { kind: "DKIM", domain, outcome: "notfound", detail: `No DKIM key found for common selectors on ${domain}.` };
  }
  async function enrichWithDns(sender, replyTo, returnPath, originIp) {
    const senderDomain = domainOfAddress(sender) ?? domainOfAddress(sender.split(">")[0] ?? "");
    const checkedAt = Date.now();
    const offline = await queryDns("example.com", "TXT").then(() => false).catch(() => true);
    if (!senderDomain) {
      return { checks: [], checkedAt, offline };
    }
    if (offline) {
      return {
        checks: [{ kind: "SPF", domain: senderDomain, outcome: "error", detail: "DNS unreachable — live authentication checks are unavailable in this offline session." }],
        checkedAt,
        offline: true
      };
    }
    const checks = [];
    const [spf, dmarc, dkim] = await Promise.all([
      evaluateSpf(senderDomain, originIp ?? "").then((spfResult) => ({ kind: "SPF", domain: senderDomain, outcome: spfResult.outcome, detail: spfResult.detail })).catch(() => ({ kind: "SPF", domain: senderDomain, outcome: "error", detail: `SPF lookup failed for ${senderDomain} (DNS error).` })),
      checkDmarc(senderDomain).catch(() => ({ kind: "DMARC", domain: senderDomain, outcome: "error", detail: `DMARC lookup failed for ${senderDomain} (DNS error).` })),
      checkDkim(senderDomain).catch(() => ({ kind: "DKIM", domain: senderDomain, outcome: "error", detail: `DKIM lookup failed for ${senderDomain} (DNS error).` }))
    ]);
    checks.push(spf, dmarc, dkim);
    const replyDomain = domainOfAddress(replyTo);
    if (replyDomain && replyDomain !== senderDomain) {
      checks.push({ kind: "DMARC", domain: replyDomain, outcome: "fail", detail: `Alignment: replies route to ${replyDomain}, which differs from the sender domain ${senderDomain}.` });
    }
    const returnPathDomain = domainOfAddress(returnPath);
    if (returnPathDomain && returnPathDomain !== senderDomain) {
      checks.push({ kind: "SPF", domain: returnPathDomain, outcome: "softfail", detail: `Return-path domain ${returnPathDomain} differs from the sender domain ${senderDomain} (envelope alignment).` });
    }
    return { checks, checkedAt, offline: false };
  }

  // src/lib/geo.ts
  var cache = /* @__PURE__ */ new Map();
  function isPublicIpv4(ip) {
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return false;
    if (ip.split(".").some((octet) => octet.length > 1 && octet.startsWith("0"))) return false;
    const octets = ip.split(".").map(Number);
    if (octets.some((octet) => octet > 255)) return false;
    const a = octets[0] ?? 0;
    const b = octets[1] ?? 0;
    const c = octets[2] ?? 0;
    if (a === 0) return false;
    if (a === 10) return false;
    if (a === 100 && b >= 64 && b <= 127) return false;
    if (a === 127) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 192 && b === 0 && c === 2) return false;
    if (a === 198 && b === 51 && c === 100) return false;
    if (a === 203 && b === 0 && c === 113) return false;
    if (a === 198 && b === 18) return false;
    if (a >= 224) return false;
    return true;
  }
  async function lookupGeo(ip) {
    if (cache.has(ip)) return cache.get(ip) ?? null;
    if (!isPublicIpv4(ip)) {
      cache.set(ip, null);
      return null;
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6e3);
      const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) throw new Error(`Geo lookup failed: ${response.status}`);
      const data = await response.json();
      if (!data || data.success === false) {
        cache.set(ip, null);
        return null;
      }
      const info = {
        ip,
        country: data.country ?? "Unknown",
        countryCode: data.country_code ?? "",
        region: data.region ?? "",
        city: data.city ?? "",
        lat: typeof data.latitude === "number" ? data.latitude : 0,
        lon: typeof data.longitude === "number" ? data.longitude : 0,
        isp: data.connection?.isp ?? "",
        org: data.connection?.org ?? "",
        asn: data.connection?.asn ? `AS${data.connection.asn}` : "",
        source: "live"
      };
      if (data.connection?.domain) info.ispDomain = data.connection.domain;
      cache.set(ip, info);
      return info;
    } catch {
      cache.set(ip, null);
      return null;
    }
  }
  async function enrichIps(ips) {
    const unique = [...new Set(ips.map((ip) => ip.trim()).filter(Boolean))].filter(isPublicIpv4).slice(0, 8);
    const found = {};
    const BATCH = 4;
    for (let i = 0; i < unique.length; i += BATCH) {
      const batch = unique.slice(i, i + BATCH);
      const results = await Promise.all(batch.map((ip) => lookupGeo(ip)));
      for (const info of results) if (info) found[info.ip] = info;
    }
    return found;
  }
  function flagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return "🌐";
    const upper = countryCode.toUpperCase();
    if (!/[A-Z]{2}/.test(upper)) return "🌐";
    return String.fromCodePoint(...[...upper].map((char) => 127397 + char.charCodeAt(0)));
  }
  function locationLabel(geo) {
    const parts = [geo.city, geo.region, geo.country].filter((part) => part && part !== "Unknown");
    const unique = [];
    for (const part of parts) if (!unique.includes(part)) unique.push(part);
    return unique.join(", ") || "Location unknown";
  }
  function distanceKm(a, b) {
    const toRad = (deg) => deg * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return Math.round(2 * 6371 * Math.asin(Math.min(1, Math.sqrt(s))));
  }

  // src/lib/infra.ts
  async function dohQuery(name, type) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6e3);
    try {
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
        headers: { accept: "application/dns-json" },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`DoH failed: ${response.status}`);
      const data = await response.json();
      return (data.Answer ?? []).filter((answer) => answer.type === (type === "MX" ? 15 : 1)).map((answer) => answer.data ?? "").filter(Boolean);
    } finally {
      clearTimeout(timer);
    }
  }
  var zenMeanings = {
    "127.0.0.2": "SBL — known spam source",
    "127.0.0.3": "SBL — spam source (CSS)",
    "127.0.0.4": "XBL — exploited host / botnet member",
    "127.0.0.5": "XBL — botnet member (CBL)",
    "127.0.0.6": "XBL — exploited host",
    "127.0.0.7": "XBL — botnet member (CBL+)",
    "127.0.0.8": "SBL — known spam source",
    "127.0.0.9": "SBL — known spam source",
    "127.0.0.10": "PBL — dynamic end-user range",
    "127.0.0.11": "PBL — end-user policy",
    "127.255.255.254": "PBL — listed end-user range"
  };
  var blacklistCache = /* @__PURE__ */ new Map();
  async function checkBlacklists(ip) {
    if (blacklistCache.has(ip)) return blacklistCache.get(ip) ?? [];
    if (!isPublicIpv4(ip)) {
      blacklistCache.set(ip, []);
      return [];
    }
    const reversed = ip.split(".").reverse().join(".");
    const hits = [];
    try {
      const zen = await dohQuery(`${reversed}.zen.spamhaus.org`, "A");
      for (const record of zen) {
        const code = record.trim();
        hits.push({ list: "Spamhaus ZEN", code, meaning: zenMeanings[code] ?? "listed on Spamhaus ZEN" });
      }
    } catch {
    }
    try {
      const spamcop = await dohQuery(`${reversed}.bl.spamcop.net`, "A");
      if (spamcop.some((record) => record.trim() === "127.0.0.2")) {
        hits.push({ list: "SpamCop", code: "127.0.0.2", meaning: "listed on SpamCop — reported spam source" });
      }
    } catch {
    }
    blacklistCache.set(ip, hits);
    return hits;
  }
  var torExitCache = /* @__PURE__ */ new Map();
  async function isTorExit(ip) {
    if (torExitCache.has(ip)) return torExitCache.get(ip) ?? false;
    if (!isPublicIpv4(ip)) {
      torExitCache.set(ip, false);
      return false;
    }
    const reversed = ip.split(".").reverse().join(".");
    let exit = false;
    try {
      const answers = await dohQuery(`${reversed}.dnsel.torproject.org`, "A");
      exit = answers.some((record) => record.trim() === "127.0.0.2");
    } catch {
    }
    torExitCache.set(ip, exit);
    return exit;
  }
  var torRelayOrgFingerprints = [
    "relayon.org",
    "cia triad security",
    "stiftung erneuerbare freiheit",
    "f3netze",
    "tor project",
    "quantum network",
    "schokokeks",
    "1984"
  ];
  var cloudHostFingerprints = [
    "amazon",
    "aws",
    "amazon.com",
    "microsoft",
    "azure",
    "microsoft.com",
    "google",
    "google cloud",
    "google.com",
    "goog",
    "ovh",
    "hetzner",
    "digitalocean",
    "linode",
    "vultr",
    "contabo",
    "m247",
    "leaseweb",
    "cogent",
    "zayo",
    "hostinger",
    "ionos",
    "namecheap",
    "godaddy",
    "cloudflare",
    "akamai",
    "fastly",
    "heroku",
    "netlify",
    "scaleway",
    "upcloud",
    "oracle cloud",
    "ibm cloud",
    "alibaba",
    "tencent",
    "choopa",
    "ramnode",
    "voxility",
    "datacamp",
    "psychz",
    "multacom",
    "quadra",
    "hostkey",
    "forpsi",
    "one man",
    "websupport"
  ];
  function textOf(geo) {
    return `${geo.org ?? ""} ${geo.isp ?? ""} ${geo.ispDomain ?? ""} ${geo.asn ?? ""}`.toLowerCase();
  }
  function fingerprintInfra(geo) {
    const text = textOf(geo);
    const torRelayOperator = torRelayOrgFingerprints.some((needle) => text.includes(needle));
    const cloudHosting = !torRelayOperator && cloudHostFingerprints.some((needle) => text.includes(needle));
    return { torRelayOperator, cloudHosting };
  }
  var infraCache = /* @__PURE__ */ new Map();
  async function enrichIpInfra(ip, geo) {
    if (infraCache.has(ip)) return infraCache.get(ip) ?? null;
    if (!isPublicIpv4(ip)) {
      infraCache.set(ip, null);
      return null;
    }
    try {
      const [blacklists, torExit] = await Promise.all([checkBlacklists(ip), isTorExit(ip)]);
      const fingerprints = fingerprintInfra(geo);
      const infra = {
        blacklists,
        torExit: torExit || fingerprints.torRelayOperator,
        cloudHosting: fingerprints.cloudHosting,
        source: "live"
      };
      infraCache.set(ip, infra);
      return infra;
    } catch {
      infraCache.set(ip, null);
      return null;
    }
  }
  var mxCache = /* @__PURE__ */ new Map();
  async function lookupMx(domain) {
    const key = domain.toLowerCase();
    if (mxCache.has(key)) return mxCache.get(key) ?? [];
    try {
      const answers = await dohQuery(key, "MX");
      const mx = answers.map((record) => record.trim().replace(/\.$/, "")).sort();
      mxCache.set(key, mx);
      return mx;
    } catch {
      mxCache.set(key, []);
      return [];
    }
  }
  var whoisCache = /* @__PURE__ */ new Map();
  async function lookupWhois(domain) {
    const key = domain.toLowerCase();
    if (whoisCache.has(key)) return whoisCache.get(key) ?? null;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7e3);
      const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(key)}`, { signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) {
        whoisCache.set(key, null);
        return null;
      }
      const data = await response.json();
      let registrar = "";
      for (const entity of data.entities ?? []) {
        if ((entity.roles ?? []).includes("registrar")) {
          const vcard = entity.vcardArray?.[1];
          if (Array.isArray(vcard)) {
            for (const line of vcard) {
              if (line?.[0] === "fn") {
                const value = line[3];
                if (typeof value === "string") registrar = value;
              }
            }
          }
        }
      }
      const created = (data.events ?? []).find((event) => event.eventAction === "registration")?.eventDate ?? null;
      const result = registrar || created ? { registrar: registrar || "Unknown registrar", created } : null;
      whoisCache.set(key, result);
      return result;
    } catch {
      whoisCache.set(key, null);
      return null;
    }
  }
  var domainIntelCache = /* @__PURE__ */ new Map();
  async function lookupDomainIntel(domain) {
    const key = domain.toLowerCase();
    if (domainIntelCache.has(key)) return domainIntelCache.get(key) ?? null;
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(key)) {
      domainIntelCache.set(key, null);
      return null;
    }
    try {
      const [mx, whois] = await Promise.all([lookupMx(key), lookupWhois(key)]);
      const result = { mx, whois, source: "live" };
      domainIntelCache.set(key, result);
      return result;
    } catch {
      domainIntelCache.set(key, null);
      return null;
    }
  }

  // src/lib/store.ts
  var DB_NAME = "aegistrace-db";
  var DB_VERSION = 2;
  var SCAN_STORE = "scans";
  var AUDIT_STORE = "audit";
  var dbPromise;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(SCAN_STORE)) {
          const store = db.createObjectStore(SCAN_STORE, { keyPath: "id" });
          store.createIndex("scannedAt", "scannedAt");
        }
        if (!db.objectStoreNames.contains(AUDIT_STORE)) {
          const audit = db.createObjectStore(AUDIT_STORE, { keyPath: "id" });
          audit.createIndex("at", "at");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("Could not open local evidence store"));
    });
    return dbPromise;
  }
  function requestToPromise(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("Local store operation failed"));
    });
  }
  function transactionDone(tx) {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Local store transaction failed"));
      tx.onabort = () => reject(tx.error ?? new Error("Local store transaction aborted"));
    });
  }
  async function addScan(scan) {
    const db = await openDb();
    const tx = db.transaction(SCAN_STORE, "readwrite");
    tx.objectStore(SCAN_STORE).put(scan);
    await transactionDone(tx);
  }
  async function findScan(id) {
    const db = await openDb();
    const tx = db.transaction(SCAN_STORE, "readonly");
    const found = await requestToPromise(tx.objectStore(SCAN_STORE).get(id));
    await transactionDone(tx);
    return found;
  }
  async function listScans() {
    const db = await openDb();
    const tx = db.transaction(SCAN_STORE, "readonly");
    const store = tx.objectStore(SCAN_STORE);
    const index = store.index("scannedAt");
    const all = await requestToPromise(index.getAll());
    await transactionDone(tx);
    return all.sort((a, b) => b.scannedAt - a.scannedAt);
  }
  async function deleteScan(id) {
    const db = await openDb();
    const tx = db.transaction(SCAN_STORE, "readwrite");
    tx.objectStore(SCAN_STORE).delete(id);
    await transactionDone(tx);
  }
  async function clearScans() {
    const db = await openDb();
    const tx = db.transaction(SCAN_STORE, "readwrite");
    tx.objectStore(SCAN_STORE).clear();
    await transactionDone(tx);
  }
  async function addAuditEvent(event) {
    try {
      const db = await openDb();
      const tx = db.transaction(AUDIT_STORE, "readwrite");
      tx.objectStore(AUDIT_STORE).put(event);
      await transactionDone(tx);
    } catch {
    }
  }
  async function listAuditEvents(limit = 60) {
    try {
      const db = await openDb();
      const tx = db.transaction(AUDIT_STORE, "readonly");
      const store = tx.objectStore(AUDIT_STORE);
      const index = store.index("at");
      const all = await requestToPromise(index.getAll());
      await transactionDone(tx);
      return all.sort((a, b) => b.at - a.at).slice(0, limit);
    } catch {
      return [];
    }
  }
  async function countScans() {
    const db = await openDb();
    const tx = db.transaction(SCAN_STORE, "readonly");
    const count = await requestToPromise(tx.objectStore(SCAN_STORE).count());
    await transactionDone(tx);
    return count;
  }
  async function verifyEvidence(raw, expectedHash) {
    const result = await scanEmail(raw);
    return { matches: result.evidenceHash === expectedHash, result };
  }
  function toStoredScan(raw, result, scannedAt = Date.now(), demo = false, auth, geo) {
    const scan = {
      id: crypto.randomUUID(),
      caseId: result.id,
      raw,
      result,
      scannedAt
    };
    if (demo) scan.demo = true;
    if (auth && auth.checks.length > 0) scan.auth = auth;
    if (geo && Object.keys(geo).length > 0) scan.geo = geo;
    return scan;
  }
  function riskTone(risk) {
    if (risk === "Critical") return "critical";
    if (risk === "High") return "high";
    return "medium";
  }
  return __toCommonJS(entry_exports);
})();
