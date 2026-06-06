// src/plugin.ts
var PLUGIN_NAME = "vite-plugin-better-console";
var VIRTUAL_ID = "virtual:better-console";
var RESOLVED_VIRTUAL = "\0virtual:better-console";
var RUNTIME_PKG = `${PLUGIN_NAME}/runtime`;
var ENTRY_EXTS = /* @__PURE__ */ new Set([".js", ".ts", ".jsx", ".tsx", ".mjs", ".mts", ".cjs", ".cts", ".vue", ".svelte"]);
function normalize(p) {
  return p.replace(/\\/g, "/");
}
function resolveEntry(root, entry) {
  const e = entry.startsWith("/") ? entry.slice(1) : entry;
  return normalize(`${normalize(root)}/${e}`.replace(/\/+/g, "/"));
}
function globToRegex(glob) {
  const escaped = glob.replace(/\\/g, "/").replace(/[.+^${}()|[\]]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/\x00/g, ".*").replace(/\?/g, "[^/]");
  return new RegExp(`^${escaped}$`);
}
function matchPattern(pattern, id) {
  if (!pattern) return false;
  const normalized = normalize(id);
  if (pattern instanceof RegExp) return pattern.test(normalized);
  return globToRegex(pattern).test(normalized);
}
function htmlModuleEntries(html, root) {
  const result = /* @__PURE__ */ new Set();
  const re = /<script([^>]*)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    if (!/type\s*=\s*["']module["']/i.test(attrs)) continue;
    const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!src || /^https?:\/\//i.test(src) || src.startsWith("//")) continue;
    result.add(resolveEntry(root, src));
  }
  return result;
}
function rollupEntries(config) {
  const result = /* @__PURE__ */ new Set();
  const { root } = config;
  const input = config.build?.rollupOptions?.input;
  if (typeof input === "string") {
    result.add(resolveEntry(root, input));
  } else if (Array.isArray(input)) {
    for (const e of input) result.add(resolveEntry(root, e));
  } else if (input && typeof input === "object") {
    for (const e of Object.values(input)) result.add(resolveEntry(root, e));
  }
  return result;
}
function serializeRuntimeOptions(options) {
  const { inject: _i, injectEntries: _ie, injectPattern: _ip, ...rest } = options;
  return JSON.stringify(rest);
}
function betterConsole(options = {}) {
  const {
    inject = true,
    injectEntries = [],
    injectPattern,
    warnInProduction = true
  } = options;
  const serialized = serializeRuntimeOptions(options);
  const injected = /* @__PURE__ */ new Set();
  let entryPaths = /* @__PURE__ */ new Set();
  let projectRoot = process.cwd();
  let isDev = false;
  function shouldInject(id) {
    if (!inject) return false;
    if (injected.has(id)) return false;
    if (id.includes("node_modules")) return false;
    if (id.startsWith("\0")) return false;
    if (id.startsWith("virtual:")) return false;
    if (id.includes(PLUGIN_NAME)) return false;
    const norm = normalize(id);
    if (injectEntries.some((e) => {
      const resolved = resolveEntry(projectRoot, e);
      return matchPattern(e, norm) || matchPattern(resolved, norm) || norm.endsWith("/" + normalize(e));
    })) return true;
    if (injectPattern && matchPattern(injectPattern, norm)) return true;
    if (entryPaths.has(norm)) {
      return ENTRY_EXTS.has(norm.slice(norm.lastIndexOf(".")));
    }
    return false;
  }
  return {
    name: PLUGIN_NAME,
    enforce: "pre",
    // run before framework plugins (e.g. @vitejs/plugin-vue)
    // 1. Inject compile-time defines so the runtime knows mode and options
    config(_cfg, env) {
      isDev = env.command === "serve" || env.mode !== "production";
      return {
        define: {
          __BETTER_CONSOLE_DEV__: JSON.stringify(isDev),
          __BETTER_CONSOLE_WARN__: JSON.stringify(warnInProduction),
          __BETTER_CONSOLE_OPTIONS__: serialized
        },
        optimizeDeps: {
          // Pre-bundle the runtime so HMR doesn't break on first load
          include: [RUNTIME_PKG]
        }
      };
    },
    // 2. Save the resolved root and collect rollup entries
    configResolved(config) {
      projectRoot = config.root;
      entryPaths = rollupEntries(config);
    },
    // 3. Collect <script type="module"> entries from index.html
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        for (const path of htmlModuleEntries(html, projectRoot)) {
          entryPaths.add(path);
        }
        return [];
      }
    },
    // 4. Virtual module: the thin glue that imports the runtime
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL) {
        return `import '${RUNTIME_PKG}'`;
      }
    },
    // 5. Prepend the virtual import to every matched entry
    transform(code, id) {
      if (!shouldInject(id)) return null;
      if (!isDev) return null;
      injected.add(id);
      return {
        code: `import '${VIRTUAL_ID}'
${code}`,
        map: null
      };
    }
  };
}
var plugin_default = betterConsole;
export {
  betterConsole,
  plugin_default as default
};
