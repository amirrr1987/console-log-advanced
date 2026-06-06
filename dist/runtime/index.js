// src/types.ts
var LOG_LEVEL_RANK = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 99
};

// src/config.ts
var DEFAULT_THEME = {
  badge_debug: "display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.5px;background:#f3f0ff;color:#6d28d9;border:1px solid #c4b5fd",
  badge_info: "display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.5px;background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd",
  badge_warn: "display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.5px;background:#fffbeb;color:#b45309;border:1px solid #fcd34d",
  badge_error: "display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.5px;background:#fef2f2;color:#dc2626;border:1px solid #fca5a5",
  label: "color:#94a3b8;font-size:11px;min-width:68px;display:inline-block",
  value: "color:#0ea5e9;font-weight:600",
  meta: "color:#64748b;font-size:11px",
  divider: "color:#cbd5e1"
};
var DEFAULT_OPTIONS = {
  logLevel: "debug",
  collapsed: true,
  showPath: true,
  showLine: true,
  showFn: true,
  showType: true,
  timestamp: true,
  timestampFormat: "locale"
};
function detectDev() {
  if (typeof __BETTER_CONSOLE_DEV__ !== "undefined") {
    return __BETTER_CONSOLE_DEV__;
  }
  try {
    if (import.meta.env?.PROD) return false;
    if (import.meta.env?.DEV) return true;
  } catch {
  }
  if (typeof process !== "undefined") {
    return true;
  }
  return true;
}
function detectWarnInProduction() {
  if (typeof __BETTER_CONSOLE_WARN__ !== "undefined") {
    return __BETTER_CONSOLE_WARN__;
  }
  return true;
}
function parseInjectedOptions() {
  if (typeof __BETTER_CONSOLE_OPTIONS__ === "undefined") return {};
  try {
    const raw = __BETTER_CONSOLE_OPTIONS__;
    return (typeof raw === "string" ? JSON.parse(raw) : raw) ?? {};
  } catch {
    return {};
  }
}
function resolveOptions(overrides = {}) {
  const injected = parseInjectedOptions();
  return {
    ...DEFAULT_OPTIONS,
    ...injected,
    ...overrides,
    dev: overrides.dev ?? detectDev(),
    warnInProduction: overrides.warnInProduction ?? detectWarnInProduction(),
    theme: {
      ...DEFAULT_THEME,
      ...injected.theme,
      ...overrides.theme
    },
    badge: overrides.badge ?? injected.badge ?? {}
  };
}
function shouldLog(level, minLevel = "debug") {
  return (LOG_LEVEL_RANK[level] ?? 0) >= (LOG_LEVEL_RANK[minLevel] ?? 0);
}

// src/caller.ts
var SKIP_TOKENS = [
  "vite-plugin-better-console",
  "betterConsole",
  "getCaller",
  "createLogger",
  "attachRuntime",
  "logAtLevel",
  "printMeta",
  "printValue"
];
var RE_V8 = /^\s*at\s+(?:async\s+)?(?:([\w$.<>\[\] ]+?)\s+\()?(?:file:\/\/)?(.+?):(\d+)(?::(\d+))?\)?$/;
var RE_FF = /^\s*(?:([\w$.<>\[\]]+)@)?(?:file:\/\/)?(.+?):(\d+)(?::(\d+))?$/;
function parseFrame(raw) {
  let m = raw.match(RE_V8);
  if (m) {
    const [, fn, path, line, col] = m;
    if (!path) return null;
    return { fn: fn?.trim() || void 0, path: cleanPath(path), line, col };
  }
  m = raw.match(RE_FF);
  if (m) {
    const [, fn, path, line, col] = m;
    if (!path) return null;
    return { fn: fn?.trim() || void 0, path: cleanPath(path), line, col };
  }
  return null;
}
function cleanPath(raw) {
  return raw.replace(/^file:\/\//, "").replace(/\\/g, "/").replace(/\?.*$/, "").replace(/^\/\//, "/");
}
function isInternal(info) {
  const haystack = `${info.path ?? ""} ${info.fn ?? ""}`.toLowerCase();
  return SKIP_TOKENS.some((tok) => haystack.includes(tok.toLowerCase()));
}
function getCaller(extraSkip = 0) {
  const stack = new Error().stack;
  if (!stack) return {};
  const lines = stack.split("\n").slice(1 + extraSkip);
  for (const line of lines) {
    const frame = parseFrame(line);
    if (!frame) continue;
    if (isInternal(frame)) continue;
    return frame;
  }
  return {};
}

// src/format.ts
function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
var _start = Date.now();
function formatTimestamp(date, format) {
  if (typeof format === "function") return format(date);
  switch (format) {
    case "iso":
      return date.toISOString();
    case "time-only":
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    case "date-only":
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      });
    case "relative": {
      const ms = date.getTime() - _start;
      if (ms < 1e3) return `+${ms}ms`;
      if (ms < 6e4) return `+${(ms / 1e3).toFixed(2)}s`;
      return `+${(ms / 6e4).toFixed(1)}min`;
    }
    case "locale":
    default: {
      const d = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      });
      const t = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      return `${d} ${t}`;
    }
  }
}
function printMeta(label, value, opts) {
  if (value == null || value === "") return;
  console.info(
    `%c${label.padEnd(10)}%c${value}`,
    opts.theme.label,
    opts.theme.value
  );
}
function printValue(value) {
  const kind = typeOf(value);
  switch (kind) {
    case "Map": {
      const rows = Array.from(value, ([k, v]) => ({ key: k, value: v }));
      console.table(rows);
      return;
    }
    case "Set": {
      const rows = Array.from(value, (v, i) => ({ index: i, value: v }));
      console.table(rows);
      return;
    }
    case "Array":
    case "Object":
      console.table(value);
      return;
    case "Date": {
      const d = value;
      console.info(`${d.toISOString()}  (local: ${d.toLocaleString()})`);
      return;
    }
    case "Promise":
      console.info("%cPromise { <pending> }", "color:#94a3b8;font-style:italic");
      value.then(
        (r) => console.info("  \u21B3 resolved \u2192", r),
        (e) => console.info("  \u21B3 rejected \u2192", e)
      );
      return;
    case "Error": {
      const err = value;
      console.info(err.stack ?? err.message ?? String(err));
      return;
    }
    case "Function":
      console.info(`\u0192 ${value.name || "(anonymous)"}`);
      return;
    case "RegExp":
      console.info(String(value));
      return;
    case "Null":
      console.info("%cnull", "color:#94a3b8;font-style:italic");
      return;
    case "Undefined":
      console.info("%cundefined", "color:#94a3b8;font-style:italic");
      return;
    default:
      if (value !== void 0) console.info(value);
  }
}

// src/logger.ts
var warnProductionOnce = /* @__PURE__ */ (() => {
  let fired = false;
  return () => {
    if (fired) return;
    fired = true;
    console.log(
      "%c better-console %c disabled in production ",
      "background:#dc2626;color:#fff;font-size:11px;padding:3px 6px;border-radius:4px 0 0 4px;font-weight:700",
      "background:#1e293b;color:#94a3b8;font-size:11px;padding:3px 8px;border-radius:0 4px 4px 0"
    );
  };
})();
var DEFAULT_BADGES = {
  debug: "DEBUG",
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  silent: ""
};
function createLogger(userOptions = {}) {
  const opts = resolveOptions(userOptions);
  const {
    dev,
    warnInProduction,
    logLevel,
    collapsed: defaultCollapsed,
    showPath,
    showLine,
    showFn,
    showType,
    timestamp: defaultTimestamp,
    timestampFormat,
    theme,
    badge: badgeMap
  } = opts;
  function logAtLevel(level, label, value, callOpts = {}) {
    if (!dev) {
      if (warnInProduction) warnProductionOnce();
      return;
    }
    const effectiveLevel = callOpts.level ?? level;
    if (!shouldLog(effectiveLevel, logLevel)) return;
    if (callOpts.enabled === false) return;
    const {
      comment,
      collapsed = defaultCollapsed,
      path: overridePath,
      line: overrideLine,
      fn: overrideFn,
      timestamp: showTimestamp = defaultTimestamp
    } = callOpts;
    let caller = getCaller();
    if (overridePath != null) caller = { ...caller, path: overridePath };
    if (overrideLine != null) caller = { ...caller, line: String(overrideLine) };
    if (overrideFn != null) caller = { ...caller, fn: overrideFn };
    const badgeText = badgeMap === false ? label : `${(badgeMap && badgeMap[effectiveLevel]) ?? DEFAULT_BADGES[effectiveLevel]} \xB7 ${label}`;
    const badgeStyle = theme[`badge_${effectiveLevel}`] ?? theme.badge_info;
    const groupFn = collapsed ? console.groupCollapsed : console.group;
    groupFn(`%c ${badgeText} `, badgeStyle);
    if (showTimestamp) {
      printMeta("time", formatTimestamp(/* @__PURE__ */ new Date(), timestampFormat), opts);
    }
    if (showFn && caller.fn) {
      printMeta("function", caller.fn, opts);
    }
    if (showPath && caller.path) {
      printMeta("file", caller.path, opts);
    }
    if (showLine && caller.line) {
      printMeta("line", caller.line, opts);
    }
    if (showType && value !== void 0) {
      printMeta("type", typeOf(value), opts);
    }
    printValue(value);
    if (comment) {
      printMeta("note", comment, opts);
    }
    console.groupEnd();
  }
  const log = (label, value, options) => logAtLevel("info", label, value, options);
  log.debug = (label, value, options) => logAtLevel("debug", label, value, options);
  log.info = (label, value, options) => logAtLevel("info", label, value, options);
  log.warn = (label, value, options) => logAtLevel("warn", label, value, options);
  log.error = (label, value, options) => logAtLevel("error", label, value, options);
  log.table = (label, data, options = {}) => logAtLevel("info", label, data, { ...options, collapsed: false });
  Object.defineProperty(log, "dev", { get: () => dev, enumerable: true });
  Object.defineProperty(log, "level", { get: () => logLevel, enumerable: true });
  return log;
}

// src/index.ts
function attachRuntime(logger) {
  const instance = logger ?? createLogger(resolveOptions());
  if (typeof console !== "undefined") {
    ;
    console.log = console.log;
    console.better = instance;
    console.logger = instance;
  }
  return instance;
}
var _logger = attachRuntime();
var index_default = _logger;
export {
  DEFAULT_OPTIONS,
  DEFAULT_THEME,
  LOG_LEVEL_RANK,
  attachRuntime,
  createLogger,
  index_default as default,
  detectDev,
  detectWarnInProduction,
  formatTimestamp,
  getCaller,
  printMeta,
  printValue,
  resolveOptions,
  shouldLog,
  typeOf
};
