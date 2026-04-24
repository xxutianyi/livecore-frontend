import { c } from "react/compiler-runtime";
import * as React$1 from "react";
import React, { createContext, createElement, forwardRef, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as ReactDOM$1 from "react-dom";
import ReactDOM from "react-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region node_modules/.pnpm/nuqs@2.8.9_react@19.2.5/node_modules/nuqs/dist/context-C4spomkL.js
const debugEnabled = isDebugEnabled();
function debug(message, ...args) {
	if (!debugEnabled) return;
	const msg = sprintf(message, ...args);
	performance.mark(msg);
	try {
		console.log(message, ...args);
	} catch {
		console.log(msg);
	}
}
function warn(message, ...args) {
	if (!debugEnabled) return;
	console.warn(message, ...args);
}
function sprintf(base, ...args) {
	return base.replace(/%[sfdO]/g, (match) => {
		const arg = args.shift();
		return match === "%O" && arg ? JSON.stringify(arg).replace(/"([^"]+)":/g, "$1:") : String(arg);
	});
}
function isDebugEnabled() {
	if (typeof window === "undefined") return (process.env.DEBUG || "").includes("nuqs");
	try {
		const test = "nuqs-localStorage-test";
		if (typeof localStorage === "undefined") return false;
		localStorage.setItem(test, test);
		const isStorageAvailable = localStorage.getItem(test) === test;
		localStorage.removeItem(test);
		return isStorageAvailable && (localStorage.getItem("debug") || "").includes("nuqs");
	} catch {
		return false;
	}
}
const errors = {
	303: "Multiple adapter contexts detected. This might happen in monorepos.",
	404: "nuqs requires an adapter to work with your framework.",
	409: "Multiple versions of the library are loaded. This may lead to unexpected behavior. Currently using `%s`, but `%s` (via the %s adapter) was about to load on top.",
	414: "Max safe URL length exceeded. Some browsers may not be able to accept this URL. Consider limiting the amount of state stored in the URL.",
	422: "Invalid options combination: `limitUrlUpdates: debounce` should be used in SSR scenarios, with `shallow: false`",
	429: "URL update rate-limited by the browser. Consider increasing `throttleMs` for key(s) `%s`. %O",
	500: "Empty search params cache. Search params can't be accessed in Layouts.",
	501: "Search params cache already populated. Have you called `parse` twice?"
};
function error(code) {
	return `[nuqs] ${errors[code]}
  See https://nuqs.dev/NUQS-${code}`;
}
const context = createContext({ useAdapter() {
	throw new Error(error(404));
} });
context.displayName = "NuqsAdapterContext";
if (debugEnabled && typeof window !== "undefined") {
	if (window.__NuqsAdapterContext && window.__NuqsAdapterContext !== context) console.error(error(303));
	window.__NuqsAdapterContext = context;
}
function useAdapter(watchKeys) {
	const value = useContext(context);
	if (!("useAdapter" in value)) throw new Error(error(404));
	return value.useAdapter(watchKeys);
}
const useAdapterDefaultOptions = () => useContext(context).defaultOptions;
const useAdapterProcessUrlSearchParams = () => useContext(context).processUrlSearchParams;
//#endregion
//#region node_modules/.pnpm/nuqs@2.8.9_react@19.2.5/node_modules/nuqs/dist/debounce-PSGthE_7.js
function getDefaultThrottle() {
	if (typeof window === "undefined") return 50;
	if (!Boolean(window.GestureEvent)) return 50;
	try {
		const match = navigator.userAgent?.match(/version\/([\d\.]+) safari/i);
		return parseFloat(match[1]) >= 17 ? 120 : 320;
	} catch {
		return 320;
	}
}
function throttle(timeMs) {
	return {
		method: "throttle",
		timeMs
	};
}
const defaultRateLimit = throttle(getDefaultThrottle());
function isAbsentFromUrl(query) {
	return query === null || Array.isArray(query) && query.length === 0;
}
function write(serialized, key, searchParams) {
	if (typeof serialized === "string") searchParams.set(key, serialized);
	else {
		searchParams.delete(key);
		for (const v of serialized) searchParams.append(key, v);
		if (!searchParams.has(key)) searchParams.set(key, "");
	}
	return searchParams;
}
function createEmitter() {
	const all = /* @__PURE__ */ new Map();
	return {
		on(type, handler) {
			const handlers = all.get(type) || [];
			handlers.push(handler);
			all.set(type, handlers);
			return () => this.off(type, handler);
		},
		off(type, handler) {
			const handlers = all.get(type);
			if (handlers) all.set(type, handlers.filter((h) => h !== handler));
		},
		emit(type, event) {
			all.get(type)?.forEach((handler) => handler(event));
		}
	};
}
function timeout(callback, ms, signal) {
	function onTick() {
		callback();
		signal.removeEventListener("abort", onAbort);
	}
	const id = setTimeout(onTick, ms);
	function onAbort() {
		clearTimeout(id);
		signal.removeEventListener("abort", onAbort);
	}
	signal.addEventListener("abort", onAbort);
}
function withResolvers() {
	const P = Promise;
	if (Promise.hasOwnProperty("withResolvers")) return Promise.withResolvers();
	let resolve = () => {};
	let reject = () => {};
	return {
		promise: new P((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
function compose(fns, final) {
	let next = final;
	for (let i = fns.length - 1; i >= 0; i--) {
		const fn = fns[i];
		if (!fn) continue;
		const prev = next;
		next = () => fn(prev);
	}
	next();
}
function getSearchParamsSnapshotFromLocation() {
	return new URLSearchParams(location.search);
}
var ThrottledQueue = class {
	updateMap = /* @__PURE__ */ new Map();
	options = {
		history: "replace",
		scroll: false,
		shallow: true
	};
	timeMs = defaultRateLimit.timeMs;
	transitions = /* @__PURE__ */ new Set();
	resolvers = null;
	controller = null;
	lastFlushedAt = 0;
	resetQueueOnNextPush = false;
	push({ key, query, options }, timeMs = defaultRateLimit.timeMs) {
		if (this.resetQueueOnNextPush) {
			this.reset();
			this.resetQueueOnNextPush = false;
		}
		debug("[nuqs gtq] Enqueueing %s=%s %O", key, query, options);
		this.updateMap.set(key, query);
		if (options.history === "push") this.options.history = "push";
		if (options.scroll) this.options.scroll = true;
		if (options.shallow === false) this.options.shallow = false;
		if (options.startTransition) this.transitions.add(options.startTransition);
		if (!Number.isFinite(this.timeMs) || timeMs > this.timeMs) this.timeMs = timeMs;
	}
	getQueuedQuery(key) {
		return this.updateMap.get(key);
	}
	getPendingPromise({ getSearchParamsSnapshot = getSearchParamsSnapshotFromLocation }) {
		return this.resolvers?.promise ?? Promise.resolve(getSearchParamsSnapshot());
	}
	flush({ getSearchParamsSnapshot = getSearchParamsSnapshotFromLocation, rateLimitFactor = 1, ...adapter }, processUrlSearchParams) {
		this.controller ??= new AbortController();
		if (!Number.isFinite(this.timeMs)) {
			debug("[nuqs gtq] Skipping flush due to throttleMs=Infinity");
			return Promise.resolve(getSearchParamsSnapshot());
		}
		if (this.resolvers) return this.resolvers.promise;
		this.resolvers = withResolvers();
		const flushNow = () => {
			this.lastFlushedAt = performance.now();
			const [search, error] = this.applyPendingUpdates({
				...adapter,
				autoResetQueueOnUpdate: adapter.autoResetQueueOnUpdate ?? true,
				getSearchParamsSnapshot
			}, processUrlSearchParams);
			if (error === null) {
				this.resolvers.resolve(search);
				this.resetQueueOnNextPush = true;
			} else this.resolvers.reject(search);
			this.resolvers = null;
		};
		const runOnNextTick = () => {
			const timeSinceLastFlush = performance.now() - this.lastFlushedAt;
			const timeMs = this.timeMs;
			const flushInMs = rateLimitFactor * Math.max(0, timeMs - timeSinceLastFlush);
			debug(`[nuqs gtq] Scheduling flush in %f ms. Throttled at %f ms (x%f)`, flushInMs, timeMs, rateLimitFactor);
			if (flushInMs === 0) flushNow();
			else timeout(flushNow, flushInMs, this.controller.signal);
		};
		timeout(runOnNextTick, 0, this.controller.signal);
		return this.resolvers.promise;
	}
	abort() {
		this.controller?.abort();
		this.controller = new AbortController();
		this.resolvers?.resolve(new URLSearchParams());
		this.resolvers = null;
		return this.reset();
	}
	reset() {
		const queuedKeys = Array.from(this.updateMap.keys());
		debug("[nuqs gtq] Resetting queue %s", JSON.stringify(Object.fromEntries(this.updateMap)));
		this.updateMap.clear();
		this.transitions.clear();
		this.options = {
			history: "replace",
			scroll: false,
			shallow: true
		};
		this.timeMs = defaultRateLimit.timeMs;
		return queuedKeys;
	}
	applyPendingUpdates(adapter, processUrlSearchParams) {
		const { updateUrl, getSearchParamsSnapshot } = adapter;
		let search = getSearchParamsSnapshot();
		debug(`[nuqs gtq] Applying %d pending update(s) on top of %s`, this.updateMap.size, search.toString());
		if (this.updateMap.size === 0) return [search, null];
		const items = Array.from(this.updateMap.entries());
		const options = { ...this.options };
		const transitions = Array.from(this.transitions);
		if (adapter.autoResetQueueOnUpdate) this.reset();
		debug("[nuqs gtq] Flushing queue %O with options %O", items, options);
		for (const [key, value] of items) if (value === null) search.delete(key);
		else search = write(value, key, search);
		if (processUrlSearchParams) search = processUrlSearchParams(search);
		try {
			compose(transitions, () => {
				updateUrl(search, options);
			});
			return [search, null];
		} catch (err) {
			console.error(error(429), items.map(([key]) => key).join(), err);
			return [search, err];
		}
	}
};
const globalThrottleQueue = new ThrottledQueue();
/**
* Like `useSyncExternalStore`, but for subscribing to multiple keys.
*
* Each key becomes the key of the returned object,
* and the value is the result of calling `getKeySnapshot` with that key.
*
* @param keys - A list of keys to subscribe to.
* @param subscribeKey - A function that takes a key and a callback,
* subscribes to an external store using that key (calling the callback when
* state changes occur), and returns a function to unsubscribe from that key.
* @param getKeySnapshot - A function that takes a key and returns the snapshot for that key.
* It will be called on the server and on the client, so it needs to handle both
* environments.
*/
function useSyncExternalStores(keys, subscribeKey, getKeySnapshot) {
	const snapshot = useCallback(() => {
		const record = Object.fromEntries(keys.map((key) => [key, getKeySnapshot(key)]));
		return [JSON.stringify(record), record];
	}, [keys.join(","), getKeySnapshot]);
	const cacheRef = useRef(null);
	if (cacheRef.current === null) cacheRef.current = snapshot();
	return useSyncExternalStore(useCallback((callback) => {
		const off = keys.map((key) => subscribeKey(key, callback));
		return () => off.forEach((unsubscribe) => unsubscribe());
	}, [keys.join(","), subscribeKey]), () => {
		const [cacheKey, record] = snapshot();
		if (cacheRef.current[0] === cacheKey) return cacheRef.current[1];
		cacheRef.current = [cacheKey, record];
		return record;
	}, () => cacheRef.current[1]);
}
var DebouncedPromiseQueue = class {
	callback;
	resolvers = withResolvers();
	controller = new AbortController();
	queuedValue = void 0;
	constructor(callback) {
		this.callback = callback;
	}
	abort() {
		this.controller.abort();
		this.queuedValue = void 0;
	}
	push(value, timeMs) {
		this.queuedValue = value;
		this.controller.abort();
		this.controller = new AbortController();
		timeout(() => {
			const outputResolvers = this.resolvers;
			try {
				debug("[nuqs dq] Flushing debounce queue", value);
				const callbackPromise = this.callback(value);
				debug("[nuqs dq] Reset debounce queue %O", this.queuedValue);
				this.queuedValue = void 0;
				this.resolvers = withResolvers();
				callbackPromise.then((output) => outputResolvers.resolve(output)).catch((error) => outputResolvers.reject(error));
			} catch (error) {
				this.queuedValue = void 0;
				outputResolvers.reject(error);
			}
		}, timeMs, this.controller.signal);
		return this.resolvers.promise;
	}
};
var DebounceController = class {
	throttleQueue;
	queues = /* @__PURE__ */ new Map();
	queuedQuerySync = createEmitter();
	constructor(throttleQueue = new ThrottledQueue()) {
		this.throttleQueue = throttleQueue;
	}
	useQueuedQueries(keys) {
		return useSyncExternalStores(keys, (key, callback) => this.queuedQuerySync.on(key, callback), (key) => this.getQueuedQuery(key));
	}
	push(update, timeMs, adapter, processUrlSearchParams) {
		if (!Number.isFinite(timeMs)) {
			const getSnapshot = adapter.getSearchParamsSnapshot ?? getSearchParamsSnapshotFromLocation;
			return Promise.resolve(getSnapshot());
		}
		const key = update.key;
		if (!this.queues.has(key)) {
			debug("[nuqs dqc] Creating debounce queue for `%s`", key);
			const queue = new DebouncedPromiseQueue((update) => {
				this.throttleQueue.push(update);
				return this.throttleQueue.flush(adapter, processUrlSearchParams).finally(() => {
					if (this.queues.get(update.key)?.queuedValue === void 0) {
						debug("[nuqs dqc] Cleaning up empty queue for `%s`", update.key);
						this.queues.delete(update.key);
					}
					this.queuedQuerySync.emit(update.key);
				});
			});
			this.queues.set(key, queue);
		}
		debug("[nuqs dqc] Enqueueing debounce update %O", update);
		const promise = this.queues.get(key).push(update, timeMs);
		this.queuedQuerySync.emit(key);
		return promise;
	}
	abort(key) {
		const queue = this.queues.get(key);
		if (!queue) return (passThrough) => passThrough;
		debug("[nuqs dqc] Aborting debounce queue %s=%s", key, queue.queuedValue?.query);
		this.queues.delete(key);
		queue.abort();
		this.queuedQuerySync.emit(key);
		return (promise) => {
			promise.then(queue.resolvers.resolve, queue.resolvers.reject);
			return promise;
		};
	}
	abortAll() {
		for (const [key, queue] of this.queues.entries()) {
			debug("[nuqs dqc] Aborting debounce queue %s=%s", key, queue.queuedValue?.query);
			queue.abort();
			queue.resolvers.resolve(new URLSearchParams());
			this.queuedQuerySync.emit(key);
		}
		this.queues.clear();
	}
	getQueuedQuery(key) {
		const debouncedQueued = this.queues.get(key)?.queuedValue?.query;
		if (debouncedQueued !== void 0) return debouncedQueued;
		return this.throttleQueue.getQueuedQuery(key);
	}
};
const debounceController = new DebounceController(globalThrottleQueue);
//#endregion
//#region node_modules/.pnpm/nuqs@2.8.9_react@19.2.5/node_modules/nuqs/dist/compare-Br3z3FUS.js
function compareQuery(a, b) {
	if (a === b) return true;
	if (a === null || b === null) return false;
	if (typeof a === "string" || typeof b === "string") return false;
	if (a.length !== b.length) return false;
	return a.every((value, index) => value === b[index]);
}
//#endregion
//#region node_modules/.pnpm/nuqs@2.8.9_react@19.2.5/node_modules/nuqs/dist/index.js
function safeParse(parser, value, key) {
	try {
		return parser(value);
	} catch (error) {
		warn("[nuqs] Error while parsing value `%s`: %O" + (key ? " (for key `%s`)" : ""), value, error, key);
		return null;
	}
}
/**
* Wrap a set of parse/serialize functions into a builder pattern parser
* you can pass to one of the hooks, making its default value type safe.
*/
function createParser(parser) {
	function parseServerSideNullable(value) {
		if (typeof value === "undefined") return null;
		let str = "";
		if (Array.isArray(value)) {
			if (value[0] === void 0) return null;
			str = value[0];
		}
		if (typeof value === "string") str = value;
		return safeParse(parser.parse, str);
	}
	return {
		type: "single",
		eq: (a, b) => a === b,
		...parser,
		parseServerSide: parseServerSideNullable,
		withDefault(defaultValue) {
			return {
				...this,
				defaultValue,
				parseServerSide(value) {
					return parseServerSideNullable(value) ?? defaultValue;
				}
			};
		},
		withOptions(options) {
			return {
				...this,
				...options
			};
		}
	};
}
const parseAsString = createParser({
	parse: (v) => v,
	serialize: String
});
const parseAsInteger = createParser({
	parse: (v) => {
		const int = parseInt(v);
		return int == int ? int : null;
	},
	serialize: (v) => "" + Math.round(v)
});
createParser({
	parse: (v) => {
		const int = parseInt(v);
		return int == int ? int - 1 : null;
	},
	serialize: (v) => "" + Math.round(v + 1)
});
createParser({
	parse: (v) => {
		const int = parseInt(v, 16);
		return int == int ? int : null;
	},
	serialize: (v) => {
		const hex = Math.round(v).toString(16);
		return (hex.length & 1 ? "0" : "") + hex;
	}
});
createParser({
	parse: (v) => {
		const float = parseFloat(v);
		return float == float ? float : null;
	},
	serialize: String
});
createParser({
	parse: (v) => v.toLowerCase() === "true",
	serialize: String
});
function compareDates(a, b) {
	return a.valueOf() === b.valueOf();
}
createParser({
	parse: (v) => {
		const ms = parseInt(v);
		return ms == ms ? new Date(ms) : null;
	},
	serialize: (v) => "" + v.valueOf(),
	eq: compareDates
});
createParser({
	parse: (v) => {
		const date = new Date(v);
		return date.valueOf() == date.valueOf() ? date : null;
	},
	serialize: (v) => v.toISOString(),
	eq: compareDates
});
createParser({
	parse: (v) => {
		const date = new Date(v.slice(0, 10));
		return date.valueOf() == date.valueOf() ? date : null;
	},
	serialize: (v) => v.toISOString().slice(0, 10),
	eq: compareDates
});
const emitter = createEmitter();
const defaultUrlKeys = {};
/**
* Synchronise multiple query string arguments to React state in Next.js
*
* @param keys - An object describing the keys to synchronise and how to
*               serialise and parse them.
*               Use `parseAs(String|Integer|Float|...)` for quick shorthands.
* @param options - Optional history mode, shallow routing and scroll restoration options.
*/
function useQueryStates(keyMap, options = {}) {
	const hookId = useId();
	const defaultOptions = useAdapterDefaultOptions();
	const processUrlSearchParams = useAdapterProcessUrlSearchParams();
	const { history = "replace", scroll = defaultOptions?.scroll ?? false, shallow = defaultOptions?.shallow ?? true, throttleMs = defaultRateLimit.timeMs, limitUrlUpdates = defaultOptions?.limitUrlUpdates, clearOnDefault = defaultOptions?.clearOnDefault ?? true, startTransition, urlKeys = defaultUrlKeys } = options;
	const stateKeys = Object.keys(keyMap).join(",");
	const resolvedUrlKeys = useMemo(() => Object.fromEntries(Object.keys(keyMap).map((key) => [key, urlKeys[key] ?? key])), [stateKeys, JSON.stringify(urlKeys)]);
	const adapter = useAdapter(Object.values(resolvedUrlKeys));
	const initialSearchParams = adapter.searchParams;
	const queryRef = useRef({});
	const defaultValues = useMemo(() => Object.fromEntries(Object.keys(keyMap).map((key) => [key, keyMap[key].defaultValue ?? null])), [Object.values(keyMap).map(({ defaultValue }) => defaultValue).join(",")]);
	const queuedQueries = debounceController.useQueuedQueries(Object.values(resolvedUrlKeys));
	const [internalState, setInternalState] = useState(() => {
		return parseMap(keyMap, urlKeys, initialSearchParams ?? new URLSearchParams(), queuedQueries).state;
	});
	const stateRef = useRef(internalState);
	debug("[nuq+ %s `%s`] render - state: %O, iSP: %s", hookId, stateKeys, internalState, initialSearchParams);
	if (Object.keys(queryRef.current).join("&") !== Object.values(resolvedUrlKeys).join("&")) {
		const { state, hasChanged } = parseMap(keyMap, urlKeys, initialSearchParams, queuedQueries, queryRef.current, stateRef.current);
		if (hasChanged) {
			debug("[nuq+ %s `%s`] State changed: %O", hookId, stateKeys, {
				state,
				initialSearchParams,
				queuedQueries,
				queryRef: queryRef.current,
				stateRef: stateRef.current
			});
			stateRef.current = state;
			setInternalState(state);
		}
		queryRef.current = Object.fromEntries(Object.entries(resolvedUrlKeys).map(([key, urlKey]) => {
			return [urlKey, keyMap[key]?.type === "multi" ? initialSearchParams?.getAll(urlKey) : initialSearchParams?.get(urlKey) ?? null];
		}));
	}
	useEffect(() => {
		const { state, hasChanged } = parseMap(keyMap, urlKeys, initialSearchParams, queuedQueries, queryRef.current, stateRef.current);
		if (hasChanged) {
			debug("[nuq+ %s `%s`] State changed: %O", hookId, stateKeys, {
				state,
				initialSearchParams,
				queuedQueries,
				queryRef: queryRef.current,
				stateRef: stateRef.current
			});
			stateRef.current = state;
			setInternalState(state);
		}
	}, [Object.values(resolvedUrlKeys).map((key) => `${key}=${initialSearchParams?.getAll(key)}`).join("&"), JSON.stringify(queuedQueries)]);
	useEffect(() => {
		const handlers = Object.keys(keyMap).reduce((handlers, stateKey) => {
			handlers[stateKey] = ({ state, query }) => {
				setInternalState((currentState) => {
					const { defaultValue } = keyMap[stateKey];
					const urlKey = resolvedUrlKeys[stateKey];
					const nextValue = state ?? defaultValue ?? null;
					const currentValue = currentState[stateKey] ?? defaultValue ?? null;
					if (Object.is(currentValue, nextValue)) {
						debug("[nuq+ %s `%s`] Cross-hook key sync %s: %O (default: %O). no change, skipping, resolved: %O", hookId, stateKeys, urlKey, state, defaultValue, stateRef.current);
						return currentState;
					}
					stateRef.current = {
						...stateRef.current,
						[stateKey]: nextValue
					};
					queryRef.current[urlKey] = query;
					debug("[nuq+ %s `%s`] Cross-hook key sync %s: %O (default: %O). updateInternalState, resolved: %O", hookId, stateKeys, urlKey, state, defaultValue, stateRef.current);
					return stateRef.current;
				});
			};
			return handlers;
		}, {});
		for (const stateKey of Object.keys(keyMap)) {
			const urlKey = resolvedUrlKeys[stateKey];
			debug("[nuq+ %s `%s`] Subscribing to sync for `%s`", hookId, urlKey, stateKeys);
			emitter.on(urlKey, handlers[stateKey]);
		}
		return () => {
			for (const stateKey of Object.keys(keyMap)) {
				const urlKey = resolvedUrlKeys[stateKey];
				debug("[nuq+ %s `%s`] Unsubscribing to sync for `%s`", hookId, urlKey, stateKeys);
				emitter.off(urlKey, handlers[stateKey]);
			}
		};
	}, [stateKeys, resolvedUrlKeys]);
	const update = useCallback((stateUpdater, callOptions = {}) => {
		const nullMap = Object.fromEntries(Object.keys(keyMap).map((key) => [key, null]));
		const newState = typeof stateUpdater === "function" ? stateUpdater(applyDefaultValues(stateRef.current, defaultValues)) ?? nullMap : stateUpdater ?? nullMap;
		debug("[nuq+ %s `%s`] setState: %O", hookId, stateKeys, newState);
		let returnedPromise = void 0;
		let maxDebounceTime = 0;
		let doFlush = false;
		const debounceAborts = [];
		for (let [stateKey, value] of Object.entries(newState)) {
			const parser = keyMap[stateKey];
			const urlKey = resolvedUrlKeys[stateKey];
			if (!parser || value === void 0) continue;
			if ((callOptions.clearOnDefault ?? parser.clearOnDefault ?? clearOnDefault) && value !== null && parser.defaultValue !== void 0 && (parser.eq ?? ((a, b) => a === b))(value, parser.defaultValue)) value = null;
			const query = value === null ? null : (parser.serialize ?? String)(value);
			emitter.emit(urlKey, {
				state: value,
				query
			});
			const update = {
				key: urlKey,
				query,
				options: {
					history: callOptions.history ?? parser.history ?? history,
					shallow: callOptions.shallow ?? parser.shallow ?? shallow,
					scroll: callOptions.scroll ?? parser.scroll ?? scroll,
					startTransition: callOptions.startTransition ?? parser.startTransition ?? startTransition
				}
			};
			if (callOptions?.limitUrlUpdates?.method === "debounce" || limitUrlUpdates?.method === "debounce" || parser.limitUrlUpdates?.method === "debounce") {
				if (update.options.shallow === true) console.warn(error(422));
				const timeMs = callOptions?.limitUrlUpdates?.timeMs ?? limitUrlUpdates?.timeMs ?? parser.limitUrlUpdates?.timeMs ?? defaultRateLimit.timeMs;
				const debouncedPromise = debounceController.push(update, timeMs, adapter, processUrlSearchParams);
				if (maxDebounceTime < timeMs) {
					returnedPromise = debouncedPromise;
					maxDebounceTime = timeMs;
				}
			} else {
				const timeMs = callOptions?.limitUrlUpdates?.timeMs ?? parser?.limitUrlUpdates?.timeMs ?? limitUrlUpdates?.timeMs ?? callOptions.throttleMs ?? parser.throttleMs ?? throttleMs;
				debounceAborts.push(debounceController.abort(urlKey));
				globalThrottleQueue.push(update, timeMs);
				doFlush = true;
			}
		}
		const globalPromise = debounceAborts.reduce((previous, fn) => fn(previous), doFlush ? globalThrottleQueue.flush(adapter, processUrlSearchParams) : globalThrottleQueue.getPendingPromise(adapter));
		return returnedPromise ?? globalPromise;
	}, [
		stateKeys,
		history,
		shallow,
		scroll,
		throttleMs,
		limitUrlUpdates?.method,
		limitUrlUpdates?.timeMs,
		startTransition,
		resolvedUrlKeys,
		adapter.updateUrl,
		adapter.getSearchParamsSnapshot,
		adapter.rateLimitFactor,
		processUrlSearchParams,
		defaultValues
	]);
	return [useMemo(() => applyDefaultValues(internalState, defaultValues), [internalState, defaultValues]), update];
}
function parseMap(keyMap, urlKeys, searchParams, queuedQueries, cachedQuery, cachedState) {
	let hasChanged = false;
	const state = Object.entries(keyMap).reduce((out, [stateKey, parser]) => {
		const urlKey = urlKeys?.[stateKey] ?? stateKey;
		const queuedQuery = queuedQueries[urlKey];
		const fallbackValue = parser.type === "multi" ? [] : null;
		const query = queuedQuery === void 0 ? (parser.type === "multi" ? searchParams?.getAll(urlKey) : searchParams?.get(urlKey)) ?? fallbackValue : queuedQuery;
		if (cachedQuery && cachedState && compareQuery(cachedQuery[urlKey] ?? fallbackValue, query)) {
			out[stateKey] = cachedState[stateKey] ?? null;
			return out;
		}
		hasChanged = true;
		out[stateKey] = (isAbsentFromUrl(query) ? null : safeParse(parser.parse, query, urlKey)) ?? null;
		if (cachedQuery) cachedQuery[urlKey] = query;
		return out;
	}, {});
	if (!hasChanged) {
		const keyMapKeys = Object.keys(keyMap);
		const cachedStateKeys = Object.keys(cachedState ?? {});
		hasChanged = keyMapKeys.length !== cachedStateKeys.length || keyMapKeys.some((key) => !cachedStateKeys.includes(key));
	}
	return {
		state,
		hasChanged
	};
}
function applyDefaultValues(state, defaults) {
	return Object.fromEntries(Object.keys(state).map((key) => [key, state[key] ?? defaults[key] ?? null]));
}
/**
* React state hook synchronized with a URL query string in Next.js
*
* If used without a `defaultValue` supplied in the options, and the query is
* missing in the URL, the state will be `null`.
*
* ### Behaviour with default values:
*
* _Note: the URL will **not** be updated with the default value if the query
* is missing._
*
* Setting the value to `null` will clear the query in the URL, and return
* the default value as state.
*
* Example usage:
* ```ts
*   // Blog posts filtering by tag
*   const [tag, selectTag] = useQueryState('tag')
*   const filteredPosts = posts.filter(post => tag ? post.tag === tag : true)
*   const clearTag = () => selectTag(null)
*
*   // With default values
*
*   const [count, setCount] = useQueryState(
*     'count',
*     parseAsInteger.defaultValue(0)
*   )
*
*   const increment = () => setCount(oldCount => oldCount + 1)
*   const decrement = () => setCount(oldCount => oldCount - 1)
*   const clearCountQuery = () => setCount(null)
*
*   // --
*
*   const [date, setDate] = useQueryState(
*     'date',
*     parseAsIsoDateTime.withDefault(new Date('2021-01-01'))
*   )
*
*   const setToNow = () => setDate(new Date())
*   const addOneHour = () => {
*     setDate(oldDate => new Date(oldDate.valueOf() + 3600_000))
*   }
* ```
* @param key The URL query string key to bind to
* @param options - Parser (defines the state data type), optional default value and history mode.
*/
function useQueryState(key, options = {}) {
	const { parse, type, serialize, eq, defaultValue, ...hookOptions } = options;
	const [{ [key]: state }, setState] = useQueryStates({ [key]: {
		parse: parse ?? ((x) => x),
		type,
		serialize,
		eq,
		defaultValue
	} }, hookOptions);
	return [state, useCallback((stateUpdater, callOptions = {}) => setState((old) => ({ [key]: typeof stateUpdater === "function" ? stateUpdater(old[key]) : stateUpdater }), callOptions), [key, setState])];
}
//#endregion
//#region src/hooks/use-server-table.ts
function useServerTable(t0) {
	const $ = c(100);
	const { rowKey, request, columns, onRowSelection } = t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = parseAsInteger.withDefault(1);
		$[0] = t1;
	} else t1 = $[0];
	const [page, setPage] = useQueryState("page", t1);
	let t2;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = parseAsInteger.withDefault(10);
		$[1] = t2;
	} else t2 = $[1];
	const [size, setSize] = useQueryState("size", t2);
	const [sorts, setSorts] = useQueryState("sorts", parseAsString);
	const [search, setSearch] = useQueryState("search", parseAsString);
	const [filters, setFilters] = useQueryStates(filterableColumnsQuery());
	const [tableColumns, setTableColumns] = useState(columns);
	let t3;
	if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = [];
		$[2] = t3;
	} else t3 = $[2];
	const [selectedRows, setSelectedRows] = useState(t3);
	const [paginateData, setPaginateData] = useState();
	let t4;
	if ($[3] !== filters || $[4] !== page || $[5] !== request || $[6] !== search || $[7] !== size || $[8] !== sorts) {
		t4 = () => {
			request({
				page,
				size,
				sorts,
				search,
				...filters
			}).then(setPaginateData);
		};
		$[3] = filters;
		$[4] = page;
		$[5] = request;
		$[6] = search;
		$[7] = size;
		$[8] = sorts;
		$[9] = t4;
	} else t4 = $[9];
	let t5;
	if ($[10] !== filters || $[11] !== page || $[12] !== search || $[13] !== size || $[14] !== sorts) {
		t5 = [
			page,
			size,
			sorts,
			search,
			filters
		];
		$[10] = filters;
		$[11] = page;
		$[12] = search;
		$[13] = size;
		$[14] = sorts;
		$[15] = t5;
	} else t5 = $[15];
	useEffect(t4, t5);
	let t6;
	if ($[16] !== onRowSelection) {
		t6 = function onSelectedRowChange(newSelected) {
			setSelectedRows(newSelected);
			onRowSelection?.(newSelected);
		};
		$[16] = onRowSelection;
		$[17] = t6;
	} else t6 = $[17];
	const onSelectedRowChange = t6;
	function filterableColumnsQuery() {
		const state = {};
		getFilterableColumns().forEach((column) => {
			state[column.index] = parseAsString;
		});
		return state;
	}
	let t7;
	if ($[18] !== paginateData?.data) {
		t7 = function getData() {
			return paginateData?.data ?? [];
		};
		$[18] = paginateData?.data;
		$[19] = t7;
	} else t7 = $[19];
	const getData = t7;
	let t8;
	if ($[20] !== page) {
		t8 = function getPage() {
			return page;
		};
		$[20] = page;
		$[21] = t8;
	} else t8 = $[21];
	const getPage = t8;
	let t9;
	if ($[22] !== size) {
		t9 = function getSize() {
			return size.toString();
		};
		$[22] = size;
		$[23] = t9;
	} else t9 = $[23];
	const getSize = t9;
	let t10;
	if ($[24] !== search) {
		t10 = function getSearch() {
			return search ?? "";
		};
		$[24] = search;
		$[25] = t10;
	} else t10 = $[25];
	const getSearch = t10;
	let t11;
	if ($[26] !== paginateData?.data) {
		t11 = function getPageRows() {
			return paginateData?.data.length ?? 0;
		};
		$[26] = paginateData?.data;
		$[27] = t11;
	} else t11 = $[27];
	const getPageRows = t11;
	let t12;
	if ($[28] !== paginateData || $[29] !== size) {
		t12 = function getTotalPage() {
			return paginateData ? Math.ceil(paginateData?.total / size) : 1;
		};
		$[28] = paginateData;
		$[29] = size;
		$[30] = t12;
	} else t12 = $[30];
	const getTotalPage = t12;
	let t13;
	if ($[31] !== rowKey) {
		t13 = function getRowKey(dataItem) {
			return dataItem[rowKey];
		};
		$[31] = rowKey;
		$[32] = t13;
	} else t13 = $[32];
	const getRowKey = t13;
	let t14;
	if ($[33] !== tableColumns) {
		t14 = function getColumns() {
			return tableColumns.filter(_temp$3);
		};
		$[33] = tableColumns;
		$[34] = t14;
	} else t14 = $[34];
	const getColumns = t14;
	let t15;
	if ($[35] !== tableColumns) {
		t15 = function getHideableColumns() {
			return tableColumns.filter(_temp2$1);
		};
		$[35] = tableColumns;
		$[36] = t15;
	} else t15 = $[36];
	const getHideableColumns = t15;
	function getFilterableColumns() {
		return columns.filter(_temp3);
	}
	let t16;
	if ($[37] !== filters) {
		t16 = function getFilteredValue(column_3) {
			return filters[column_3.index];
		};
		$[37] = filters;
		$[38] = t16;
	} else t16 = $[38];
	const getFilteredValue = t16;
	let t17;
	if ($[39] !== getFilteredValue) {
		t17 = function getFilteredValueItem(column_4) {
			return column_4.filter?.find((filter) => filter.value == getFilteredValue(column_4));
		};
		$[39] = getFilteredValue;
		$[40] = t17;
	} else t17 = $[40];
	const getFilteredValueItem = t17;
	let t18;
	if ($[41] !== selectedRows) {
		t18 = function getSelectedRows() {
			return selectedRows;
		};
		$[41] = selectedRows;
		$[42] = t18;
	} else t18 = $[42];
	const getSelectedRows = t18;
	let t19;
	if ($[43] !== getRowKey || $[44] !== selectedRows) {
		t19 = function getRowSelectedState(dataItem_0) {
			return !!selectedRows.find((row) => row === getRowKey(dataItem_0));
		};
		$[43] = getRowKey;
		$[44] = selectedRows;
		$[45] = t19;
	} else t19 = $[45];
	const getRowSelectedState = t19;
	let t20;
	if ($[46] !== paginateData?.data || $[47] !== selectedRows) {
		t20 = function getRowSelectedAllState() {
			if (selectedRows.length === 0) return false;
			if (selectedRows.length === paginateData?.data.length) return true;
			return "indeterminate";
		};
		$[46] = paginateData?.data;
		$[47] = selectedRows;
		$[48] = t20;
	} else t20 = $[48];
	const getRowSelectedAllState = t20;
	let t21;
	if ($[49] !== sorts) {
		t21 = function getSortState() {
			if (!sorts) return [];
			return sorts.split(",").map(_temp4).filter(_temp5);
		};
		$[49] = sorts;
		$[50] = t21;
	} else t21 = $[50];
	const getSortState = t21;
	let t22;
	if ($[51] !== getSortState) {
		t22 = function getColumnSortDirection(column_5) {
			return getSortState()?.find((sort_0) => sort_0.column === column_5.index)?.direction;
		};
		$[51] = getSortState;
		$[52] = t22;
	} else t22 = $[52];
	const getColumnSortDirection = t22;
	let t23;
	if ($[53] !== getTotalPage || $[54] !== setPage) {
		t23 = function setNewPage(newPage) {
			if (newPage >= 1 && newPage <= getTotalPage()) setPage(newPage);
		};
		$[53] = getTotalPage;
		$[54] = setPage;
		$[55] = t23;
	} else t23 = $[55];
	const setNewPage = t23;
	let t24;
	if ($[56] !== setSize) {
		t24 = function setNewSize(newSize) {
			if (Number(newSize) > 0) setSize(Number(newSize));
		};
		$[56] = setSize;
		$[57] = t24;
	} else t24 = $[57];
	const setNewSize = t24;
	let t25;
	if ($[58] !== setSearch) {
		t25 = function setNewSearch(search_0) {
			setSearch(search_0 ?? null);
		};
		$[58] = setSearch;
		$[59] = t25;
	} else t25 = $[59];
	const setNewSearch = t25;
	let t26;
	if ($[60] !== setTableColumns || $[61] !== tableColumns) {
		t26 = function setColumnVisibleState(index, visible) {
			setTableColumns(tableColumns.map((column_6) => {
				if (column_6.index === index) column_6.hidden = !visible;
				return column_6;
			}));
		};
		$[60] = setTableColumns;
		$[61] = tableColumns;
		$[62] = t26;
	} else t26 = $[62];
	const setColumnVisibleState = t26;
	let t27;
	if ($[63] !== getRowKey || $[64] !== onSelectedRowChange || $[65] !== selectedRows) {
		t27 = function setRowSelectedState(dataItem_1, selected) {
			onSelectedRowChange(selected ? [...selectedRows, getRowKey(dataItem_1)] : selectedRows.filter((row_0) => row_0 !== getRowKey(dataItem_1)));
		};
		$[63] = getRowKey;
		$[64] = onSelectedRowChange;
		$[65] = selectedRows;
		$[66] = t27;
	} else t27 = $[66];
	const setRowSelectedState = t27;
	let t28;
	if ($[67] !== getRowKey || $[68] !== onSelectedRowChange || $[69] !== paginateData) {
		t28 = function setRowSelectedAllState(selected_0) {
			onSelectedRowChange(selected_0 && paginateData ? paginateData?.data.map(getRowKey) : []);
		};
		$[67] = getRowKey;
		$[68] = onSelectedRowChange;
		$[69] = paginateData;
		$[70] = t28;
	} else t28 = $[70];
	const setRowSelectedAllState = t28;
	let t29;
	if ($[71] !== getSortState || $[72] !== setSorts) {
		t29 = function setSortState(column_7, direction) {
			const currentSort = getSortState().filter((s) => s.column !== column_7);
			setSorts((direction ? [...currentSort, {
				column: column_7,
				direction
			}] : currentSort).map(_temp6).join(","));
		};
		$[71] = getSortState;
		$[72] = setSorts;
		$[73] = t29;
	} else t29 = $[73];
	const setSortState = t29;
	let t30;
	if ($[74] !== setFilters) {
		t30 = function setFilterState(index_0, value_0) {
			setFilters((prev) => ({
				...prev,
				[index_0]: value_0 ?? null
			}));
		};
		$[74] = setFilters;
		$[75] = t30;
	} else t30 = $[75];
	const setFilterState = t30;
	let t31;
	if ($[76] !== getColumnSortDirection || $[77] !== getColumns || $[78] !== getData || $[79] !== getFilterableColumns || $[80] !== getFilteredValue || $[81] !== getFilteredValueItem || $[82] !== getHideableColumns || $[83] !== getPage || $[84] !== getPageRows || $[85] !== getRowSelectedAllState || $[86] !== getRowSelectedState || $[87] !== getSearch || $[88] !== getSelectedRows || $[89] !== getSize || $[90] !== getTotalPage || $[91] !== setColumnVisibleState || $[92] !== setFilterState || $[93] !== setNewPage || $[94] !== setNewSearch || $[95] !== setNewSize || $[96] !== setRowSelectedAllState || $[97] !== setRowSelectedState || $[98] !== setSortState) {
		t31 = {
			getData,
			getPage,
			getSize,
			getSearch,
			getPageRows,
			getTotalPage,
			getColumns,
			getHideableColumns,
			getSelectedRows,
			getRowSelectedState,
			getRowSelectedAllState,
			getColumnSortDirection,
			getFilteredValue,
			getFilteredValueItem,
			getFilterableColumns,
			setNewPage,
			setNewSize,
			setNewSearch,
			setSortState,
			setColumnVisibleState,
			setRowSelectedState,
			setRowSelectedAllState,
			setFilterState
		};
		$[76] = getColumnSortDirection;
		$[77] = getColumns;
		$[78] = getData;
		$[79] = getFilterableColumns;
		$[80] = getFilteredValue;
		$[81] = getFilteredValueItem;
		$[82] = getHideableColumns;
		$[83] = getPage;
		$[84] = getPageRows;
		$[85] = getRowSelectedAllState;
		$[86] = getRowSelectedState;
		$[87] = getSearch;
		$[88] = getSelectedRows;
		$[89] = getSize;
		$[90] = getTotalPage;
		$[91] = setColumnVisibleState;
		$[92] = setFilterState;
		$[93] = setNewPage;
		$[94] = setNewSearch;
		$[95] = setNewSize;
		$[96] = setRowSelectedAllState;
		$[97] = setRowSelectedState;
		$[98] = setSortState;
		$[99] = t31;
	} else t31 = $[99];
	return t31;
}
function _temp6(s_0) {
	return `${s_0.column}:${s_0.direction}`;
}
function _temp5(value) {
	return !!value;
}
function _temp4(sort) {
	const sortMeta = sort.split(":");
	if (sortMeta.length !== 2) return;
	return {
		column: sortMeta[0],
		direction: sortMeta[1]
	};
}
function _temp3(column_2) {
	return column_2.title && column_2.filter && column_2.filter.length > 0;
}
function _temp2$1(column_1) {
	return column_1.hideable || column_1.title && column_1.dataKey;
}
function _temp$3(column_0) {
	return !column_0.hidden;
}
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
//#endregion
//#region node_modules/.pnpm/tailwind-merge@3.5.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs
/**
* Concatenates two arrays faster than the array spread operator.
*/
const concatArrays = (array1, array2) => {
	const combinedArray = new Array(array1.length + array2.length);
	for (let i = 0; i < array1.length; i++) combinedArray[i] = array1[i];
	for (let i = 0; i < array2.length; i++) combinedArray[array1.length + i] = array2[i];
	return combinedArray;
};
const createClassValidatorObject = (classGroupId, validator) => ({
	classGroupId,
	validator
});
const createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
	nextPart,
	validators,
	classGroupId
});
const CLASS_PART_SEPARATOR = "-";
const EMPTY_CONFLICTS = [];
const ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
const createClassGroupUtils = (config) => {
	const classMap = createClassMap(config);
	const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
	const getClassGroupId = (className) => {
		if (className.startsWith("[") && className.endsWith("]")) return getGroupIdForArbitraryProperty(className);
		const classParts = className.split(CLASS_PART_SEPARATOR);
		return getGroupRecursive(classParts, classParts[0] === "" && classParts.length > 1 ? 1 : 0, classMap);
	};
	const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
		if (hasPostfixModifier) {
			const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
			const baseConflicts = conflictingClassGroups[classGroupId];
			if (modifierConflicts) {
				if (baseConflicts) return concatArrays(baseConflicts, modifierConflicts);
				return modifierConflicts;
			}
			return baseConflicts || EMPTY_CONFLICTS;
		}
		return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
	};
	return {
		getClassGroupId,
		getConflictingClassGroupIds
	};
};
const getGroupRecursive = (classParts, startIndex, classPartObject) => {
	if (classParts.length - startIndex === 0) return classPartObject.classGroupId;
	const currentClassPart = classParts[startIndex];
	const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
	if (nextClassPartObject) {
		const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
		if (result) return result;
	}
	const validators = classPartObject.validators;
	if (validators === null) return;
	const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
	const validatorsLength = validators.length;
	for (let i = 0; i < validatorsLength; i++) {
		const validatorObj = validators[i];
		if (validatorObj.validator(classRest)) return validatorObj.classGroupId;
	}
};
/**
* Get the class group ID for an arbitrary property.
*
* @param className - The class name to get the group ID for. Is expected to be string starting with `[` and ending with `]`.
*/
const getGroupIdForArbitraryProperty = (className) => className.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	const content = className.slice(1, -1);
	const colonIndex = content.indexOf(":");
	const property = content.slice(0, colonIndex);
	return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
})();
/**
* Exported for testing only
*/
const createClassMap = (config) => {
	const { theme, classGroups } = config;
	return processClassGroups(classGroups, theme);
};
const processClassGroups = (classGroups, theme) => {
	const classMap = createClassPartObject();
	for (const classGroupId in classGroups) {
		const group = classGroups[classGroupId];
		processClassesRecursively(group, classMap, classGroupId, theme);
	}
	return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
	const len = classGroup.length;
	for (let i = 0; i < len; i++) {
		const classDefinition = classGroup[i];
		processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
	}
};
const processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (typeof classDefinition === "string") {
		processStringDefinition(classDefinition, classPartObject, classGroupId);
		return;
	}
	if (typeof classDefinition === "function") {
		processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
		return;
	}
	processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
const processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
	const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
	classPartObjectToEdit.classGroupId = classGroupId;
};
const processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (isThemeGetter(classDefinition)) {
		processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
		return;
	}
	if (classPartObject.validators === null) classPartObject.validators = [];
	classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
const processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	const entries = Object.entries(classDefinition);
	const len = entries.length;
	for (let i = 0; i < len; i++) {
		const [key, value] = entries[i];
		processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
	}
};
const getPart = (classPartObject, path) => {
	let current = classPartObject;
	const parts = path.split(CLASS_PART_SEPARATOR);
	const len = parts.length;
	for (let i = 0; i < len; i++) {
		const part = parts[i];
		let next = current.nextPart.get(part);
		if (!next) {
			next = createClassPartObject();
			current.nextPart.set(part, next);
		}
		current = next;
	}
	return current;
};
const isThemeGetter = (func) => "isThemeGetter" in func && func.isThemeGetter === true;
const createLruCache = (maxCacheSize) => {
	if (maxCacheSize < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let cacheSize = 0;
	let cache = Object.create(null);
	let previousCache = Object.create(null);
	const update = (key, value) => {
		cache[key] = value;
		cacheSize++;
		if (cacheSize > maxCacheSize) {
			cacheSize = 0;
			previousCache = cache;
			cache = Object.create(null);
		}
	};
	return {
		get(key) {
			let value = cache[key];
			if (value !== void 0) return value;
			if ((value = previousCache[key]) !== void 0) {
				update(key, value);
				return value;
			}
		},
		set(key, value) {
			if (key in cache) cache[key] = value;
			else update(key, value);
		}
	};
};
const IMPORTANT_MODIFIER = "!";
const MODIFIER_SEPARATOR = ":";
const EMPTY_MODIFIERS = [];
const createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal) => ({
	modifiers,
	hasImportantModifier,
	baseClassName,
	maybePostfixModifierPosition,
	isExternal
});
const createParseClassName = (config) => {
	const { prefix, experimentalParseClassName } = config;
	/**
	* Parse class name into parts.
	*
	* Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
	* @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
	*/
	let parseClassName = (className) => {
		const modifiers = [];
		let bracketDepth = 0;
		let parenDepth = 0;
		let modifierStart = 0;
		let postfixModifierPosition;
		const len = className.length;
		for (let index = 0; index < len; index++) {
			const currentCharacter = className[index];
			if (bracketDepth === 0 && parenDepth === 0) {
				if (currentCharacter === MODIFIER_SEPARATOR) {
					modifiers.push(className.slice(modifierStart, index));
					modifierStart = index + 1;
					continue;
				}
				if (currentCharacter === "/") {
					postfixModifierPosition = index;
					continue;
				}
			}
			if (currentCharacter === "[") bracketDepth++;
			else if (currentCharacter === "]") bracketDepth--;
			else if (currentCharacter === "(") parenDepth++;
			else if (currentCharacter === ")") parenDepth--;
		}
		const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
		let baseClassName = baseClassNameWithImportantModifier;
		let hasImportantModifier = false;
		if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
			hasImportantModifier = true;
		} else if (baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(1);
			hasImportantModifier = true;
		}
		const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
		return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
	};
	if (prefix) {
		const fullPrefix = prefix + MODIFIER_SEPARATOR;
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, void 0, true);
	}
	if (experimentalParseClassName) {
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => experimentalParseClassName({
			className,
			parseClassName: parseClassNameOriginal
		});
	}
	return parseClassName;
};
/**
* Sorts modifiers according to following schema:
* - Predefined modifiers are sorted alphabetically
* - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
*/
const createSortModifiers = (config) => {
	const modifierWeights = /* @__PURE__ */ new Map();
	config.orderSensitiveModifiers.forEach((mod, index) => {
		modifierWeights.set(mod, 1e6 + index);
	});
	return (modifiers) => {
		const result = [];
		let currentSegment = [];
		for (let i = 0; i < modifiers.length; i++) {
			const modifier = modifiers[i];
			const isArbitrary = modifier[0] === "[";
			const isOrderSensitive = modifierWeights.has(modifier);
			if (isArbitrary || isOrderSensitive) {
				if (currentSegment.length > 0) {
					currentSegment.sort();
					result.push(...currentSegment);
					currentSegment = [];
				}
				result.push(modifier);
			} else currentSegment.push(modifier);
		}
		if (currentSegment.length > 0) {
			currentSegment.sort();
			result.push(...currentSegment);
		}
		return result;
	};
};
const createConfigUtils = (config) => ({
	cache: createLruCache(config.cacheSize),
	parseClassName: createParseClassName(config),
	sortModifiers: createSortModifiers(config),
	...createClassGroupUtils(config)
});
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils) => {
	const { parseClassName, getClassGroupId, getConflictingClassGroupIds, sortModifiers } = configUtils;
	/**
	* Set of classGroupIds in following format:
	* `{importantModifier}{variantModifiers}{classGroupId}`
	* @example 'float'
	* @example 'hover:focus:bg-color'
	* @example 'md:!pr'
	*/
	const classGroupsInConflict = [];
	const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
	let result = "";
	for (let index = classNames.length - 1; index >= 0; index -= 1) {
		const originalClassName = classNames[index];
		const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
		if (isExternal) {
			result = originalClassName + (result.length > 0 ? " " + result : result);
			continue;
		}
		let hasPostfixModifier = !!maybePostfixModifierPosition;
		let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
		if (!classGroupId) {
			if (!hasPostfixModifier) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			classGroupId = getClassGroupId(baseClassName);
			if (!classGroupId) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			hasPostfixModifier = false;
		}
		const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
		const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
		const classId = modifierId + classGroupId;
		if (classGroupsInConflict.indexOf(classId) > -1) continue;
		classGroupsInConflict.push(classId);
		const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
		for (let i = 0; i < conflictGroups.length; ++i) {
			const group = conflictGroups[i];
			classGroupsInConflict.push(modifierId + group);
		}
		result = originalClassName + (result.length > 0 ? " " + result : result);
	}
	return result;
};
/**
* The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
*
* Specifically:
* - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
* - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
*
* Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
*/
const twJoin = (...classLists) => {
	let index = 0;
	let argument;
	let resolvedValue;
	let string = "";
	while (index < classLists.length) if (argument = classLists[index++]) {
		if (resolvedValue = toValue(argument)) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
const toValue = (mix) => {
	if (typeof mix === "string") return mix;
	let resolvedValue;
	let string = "";
	for (let k = 0; k < mix.length; k++) if (mix[k]) {
		if (resolvedValue = toValue(mix[k])) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
const createTailwindMerge = (createConfigFirst, ...createConfigRest) => {
	let configUtils;
	let cacheGet;
	let cacheSet;
	let functionToCall;
	const initTailwindMerge = (classList) => {
		configUtils = createConfigUtils(createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst()));
		cacheGet = configUtils.cache.get;
		cacheSet = configUtils.cache.set;
		functionToCall = tailwindMerge;
		return tailwindMerge(classList);
	};
	const tailwindMerge = (classList) => {
		const cachedResult = cacheGet(classList);
		if (cachedResult) return cachedResult;
		const result = mergeClassList(classList, configUtils);
		cacheSet(classList, result);
		return result;
	};
	functionToCall = initTailwindMerge;
	return (...args) => functionToCall(twJoin(...args));
};
const fallbackThemeArr = [];
const fromTheme = (key) => {
	const themeGetter = (theme) => theme[key] || fallbackThemeArr;
	themeGetter.isThemeGetter = true;
	return themeGetter;
};
const arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
const arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
const fractionRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isFraction = (value) => fractionRegex.test(value);
const isNumber = (value) => !!value && !Number.isNaN(Number(value));
const isInteger = (value) => !!value && Number.isInteger(Number(value));
const isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
const isTshirtSize = (value) => tshirtUnitRegex.test(value);
const isAny = () => true;
const isLengthOnly = (value) => lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
const isNever = () => false;
const isShadow = (value) => shadowRegex.test(value);
const isImage = (value) => imageRegex.test(value);
const isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
const isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
const isArbitraryValue = (value) => arbitraryValueRegex.test(value);
const isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
const isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
const isArbitraryWeight = (value) => getIsArbitraryValue(value, isLabelWeight, isAny);
const isArbitraryFamilyName = (value) => getIsArbitraryValue(value, isLabelFamilyName, isNever);
const isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
const isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
const isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
const isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
const isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
const isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
const isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
const isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
const isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
const isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
const isArbitraryVariableWeight = (value) => getIsArbitraryVariable(value, isLabelWeight, true);
const getIsArbitraryValue = (value, testLabel, testValue) => {
	const result = arbitraryValueRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return testValue(result[2]);
	}
	return false;
};
const getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
	const result = arbitraryVariableRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return shouldMatchNoLabel;
	}
	return false;
};
const isLabelPosition = (label) => label === "position" || label === "percentage";
const isLabelImage = (label) => label === "image" || label === "url";
const isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
const isLabelLength = (label) => label === "length";
const isLabelNumber = (label) => label === "number";
const isLabelFamilyName = (label) => label === "family-name";
const isLabelWeight = (label) => label === "number" || label === "weight";
const isLabelShadow = (label) => label === "shadow";
const getDefaultConfig = () => {
	/**
	* Theme getters for theme variable namespaces
	* @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
	*/
	const themeColor = fromTheme("color");
	const themeFont = fromTheme("font");
	const themeText = fromTheme("text");
	const themeFontWeight = fromTheme("font-weight");
	const themeTracking = fromTheme("tracking");
	const themeLeading = fromTheme("leading");
	const themeBreakpoint = fromTheme("breakpoint");
	const themeContainer = fromTheme("container");
	const themeSpacing = fromTheme("spacing");
	const themeRadius = fromTheme("radius");
	const themeShadow = fromTheme("shadow");
	const themeInsetShadow = fromTheme("inset-shadow");
	const themeTextShadow = fromTheme("text-shadow");
	const themeDropShadow = fromTheme("drop-shadow");
	const themeBlur = fromTheme("blur");
	const themePerspective = fromTheme("perspective");
	const themeAspect = fromTheme("aspect");
	const themeEase = fromTheme("ease");
	const themeAnimate = fromTheme("animate");
	/**
	* Helpers to avoid repeating the same scales
	*
	* We use functions that create a new array every time they're called instead of static arrays.
	* This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
	*/
	const scaleBreak = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	];
	const scalePosition = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	];
	const scalePositionWithArbitrary = () => [
		...scalePosition(),
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleOverflow = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	];
	const scaleOverscroll = () => [
		"auto",
		"contain",
		"none"
	];
	const scaleUnambiguousSpacing = () => [
		isArbitraryVariable,
		isArbitraryValue,
		themeSpacing
	];
	const scaleInset = () => [
		isFraction,
		"full",
		"auto",
		...scaleUnambiguousSpacing()
	];
	const scaleGridTemplateColsRows = () => [
		isInteger,
		"none",
		"subgrid",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartAndEnd = () => [
		"auto",
		{ span: [
			"full",
			isInteger,
			isArbitraryVariable,
			isArbitraryValue
		] },
		isInteger,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartOrEnd = () => [
		isInteger,
		"auto",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridAutoColsRows = () => [
		"auto",
		"min",
		"max",
		"fr",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleAlignPrimaryAxis = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	];
	const scaleAlignSecondaryAxis = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	];
	const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
	const scaleSizing = () => [
		isFraction,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingInline = () => [
		isFraction,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingBlock = () => [
		isFraction,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleColor = () => [
		themeColor,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBgPosition = () => [
		...scalePosition(),
		isArbitraryVariablePosition,
		isArbitraryPosition,
		{ position: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleBgRepeat = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }];
	const scaleBgSize = () => [
		"auto",
		"cover",
		"contain",
		isArbitraryVariableSize,
		isArbitrarySize,
		{ size: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleGradientStopPosition = () => [
		isPercent,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleRadius = () => [
		"",
		"none",
		"full",
		themeRadius,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBorderWidth = () => [
		"",
		isNumber,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleLineStyle = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	];
	const scaleBlendMode = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	];
	const scaleMaskImagePosition = () => [
		isNumber,
		isPercent,
		isArbitraryVariablePosition,
		isArbitraryPosition
	];
	const scaleBlur = () => [
		"",
		"none",
		themeBlur,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleRotate = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleScale = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleSkew = () => [
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleTranslate = () => [
		isFraction,
		"full",
		...scaleUnambiguousSpacing()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [isTshirtSize],
			breakpoint: [isTshirtSize],
			color: [isAny],
			container: [isTshirtSize],
			"drop-shadow": [isTshirtSize],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [isAnyNonArbitrary],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [isTshirtSize],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [isTshirtSize],
			shadow: [isTshirtSize],
			spacing: ["px", isNumber],
			text: [isTshirtSize],
			"text-shadow": [isTshirtSize],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				isFraction,
				isArbitraryValue,
				isArbitraryVariable,
				themeAspect
			] }],
			container: ["container"],
			columns: [{ columns: [
				isNumber,
				isArbitraryValue,
				isArbitraryVariable,
				themeContainer
			] }],
			"break-after": [{ "break-after": scaleBreak() }],
			"break-before": [{ "break-before": scaleBreak() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only", "not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: scalePositionWithArbitrary() }],
			overflow: [{ overflow: scaleOverflow() }],
			"overflow-x": [{ "overflow-x": scaleOverflow() }],
			"overflow-y": [{ "overflow-y": scaleOverflow() }],
			overscroll: [{ overscroll: scaleOverscroll() }],
			"overscroll-x": [{ "overscroll-x": scaleOverscroll() }],
			"overscroll-y": [{ "overscroll-y": scaleOverscroll() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: scaleInset() }],
			"inset-x": [{ "inset-x": scaleInset() }],
			"inset-y": [{ "inset-y": scaleInset() }],
			start: [{
				"inset-s": scaleInset(),
				start: scaleInset()
			}],
			end: [{
				"inset-e": scaleInset(),
				end: scaleInset()
			}],
			"inset-bs": [{ "inset-bs": scaleInset() }],
			"inset-be": [{ "inset-be": scaleInset() }],
			top: [{ top: scaleInset() }],
			right: [{ right: scaleInset() }],
			bottom: [{ bottom: scaleInset() }],
			left: [{ left: scaleInset() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				isInteger,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			basis: [{ basis: [
				isFraction,
				"full",
				"auto",
				themeContainer,
				...scaleUnambiguousSpacing()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				isNumber,
				isFraction,
				"auto",
				"initial",
				"none",
				isArbitraryValue
			] }],
			grow: [{ grow: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			shrink: [{ shrink: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			order: [{ order: [
				isInteger,
				"first",
				"last",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"grid-cols": [{ "grid-cols": scaleGridTemplateColsRows() }],
			"col-start-end": [{ col: scaleGridColRowStartAndEnd() }],
			"col-start": [{ "col-start": scaleGridColRowStartOrEnd() }],
			"col-end": [{ "col-end": scaleGridColRowStartOrEnd() }],
			"grid-rows": [{ "grid-rows": scaleGridTemplateColsRows() }],
			"row-start-end": [{ row: scaleGridColRowStartAndEnd() }],
			"row-start": [{ "row-start": scaleGridColRowStartOrEnd() }],
			"row-end": [{ "row-end": scaleGridColRowStartOrEnd() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": scaleGridAutoColsRows() }],
			"auto-rows": [{ "auto-rows": scaleGridAutoColsRows() }],
			gap: [{ gap: scaleUnambiguousSpacing() }],
			"gap-x": [{ "gap-x": scaleUnambiguousSpacing() }],
			"gap-y": [{ "gap-y": scaleUnambiguousSpacing() }],
			"justify-content": [{ justify: [...scaleAlignPrimaryAxis(), "normal"] }],
			"justify-items": [{ "justify-items": [...scaleAlignSecondaryAxis(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			"align-content": [{ content: ["normal", ...scaleAlignPrimaryAxis()] }],
			"align-items": [{ items: [...scaleAlignSecondaryAxis(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...scaleAlignSecondaryAxis(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": scaleAlignPrimaryAxis() }],
			"place-items": [{ "place-items": [...scaleAlignSecondaryAxis(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			p: [{ p: scaleUnambiguousSpacing() }],
			px: [{ px: scaleUnambiguousSpacing() }],
			py: [{ py: scaleUnambiguousSpacing() }],
			ps: [{ ps: scaleUnambiguousSpacing() }],
			pe: [{ pe: scaleUnambiguousSpacing() }],
			pbs: [{ pbs: scaleUnambiguousSpacing() }],
			pbe: [{ pbe: scaleUnambiguousSpacing() }],
			pt: [{ pt: scaleUnambiguousSpacing() }],
			pr: [{ pr: scaleUnambiguousSpacing() }],
			pb: [{ pb: scaleUnambiguousSpacing() }],
			pl: [{ pl: scaleUnambiguousSpacing() }],
			m: [{ m: scaleMargin() }],
			mx: [{ mx: scaleMargin() }],
			my: [{ my: scaleMargin() }],
			ms: [{ ms: scaleMargin() }],
			me: [{ me: scaleMargin() }],
			mbs: [{ mbs: scaleMargin() }],
			mbe: [{ mbe: scaleMargin() }],
			mt: [{ mt: scaleMargin() }],
			mr: [{ mr: scaleMargin() }],
			mb: [{ mb: scaleMargin() }],
			ml: [{ ml: scaleMargin() }],
			"space-x": [{ "space-x": scaleUnambiguousSpacing() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": scaleUnambiguousSpacing() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: scaleSizing() }],
			"inline-size": [{ inline: ["auto", ...scaleSizingInline()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...scaleSizingInline()] }],
			"max-inline-size": [{ "max-inline": ["none", ...scaleSizingInline()] }],
			"block-size": [{ block: ["auto", ...scaleSizingBlock()] }],
			"min-block-size": [{ "min-block": ["auto", ...scaleSizingBlock()] }],
			"max-block-size": [{ "max-block": ["none", ...scaleSizingBlock()] }],
			w: [{ w: [
				themeContainer,
				"screen",
				...scaleSizing()
			] }],
			"min-w": [{ "min-w": [
				themeContainer,
				"screen",
				"none",
				...scaleSizing()
			] }],
			"max-w": [{ "max-w": [
				themeContainer,
				"screen",
				"none",
				"prose",
				{ screen: [themeBreakpoint] },
				...scaleSizing()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...scaleSizing()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			"font-size": [{ text: [
				"base",
				themeText,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				themeFontWeight,
				isArbitraryVariableWeight,
				isArbitraryWeight
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				isPercent,
				isArbitraryValue
			] }],
			"font-family": [{ font: [
				isArbitraryVariableFamilyName,
				isArbitraryFamilyName,
				themeFont
			] }],
			"font-features": [{ "font-features": [isArbitraryValue] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				themeTracking,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"line-clamp": [{ "line-clamp": [
				isNumber,
				"none",
				isArbitraryVariable,
				isArbitraryNumber
			] }],
			leading: [{ leading: [themeLeading, ...scaleUnambiguousSpacing()] }],
			"list-image": [{ "list-image": [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: scaleColor() }],
			"text-color": [{ text: scaleColor() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...scaleLineStyle(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				isNumber,
				"from-font",
				"auto",
				isArbitraryVariable,
				isArbitraryLength
			] }],
			"text-decoration-color": [{ decoration: scaleColor() }],
			"underline-offset": [{ "underline-offset": [
				isNumber,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: scaleUnambiguousSpacing() }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: scaleBgPosition() }],
			"bg-repeat": [{ bg: scaleBgRepeat() }],
			"bg-size": [{ bg: scaleBgSize() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					],
					radial: [
						"",
						isArbitraryVariable,
						isArbitraryValue
					],
					conic: [
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					]
				},
				isArbitraryVariableImage,
				isArbitraryImage
			] }],
			"bg-color": [{ bg: scaleColor() }],
			"gradient-from-pos": [{ from: scaleGradientStopPosition() }],
			"gradient-via-pos": [{ via: scaleGradientStopPosition() }],
			"gradient-to-pos": [{ to: scaleGradientStopPosition() }],
			"gradient-from": [{ from: scaleColor() }],
			"gradient-via": [{ via: scaleColor() }],
			"gradient-to": [{ to: scaleColor() }],
			rounded: [{ rounded: scaleRadius() }],
			"rounded-s": [{ "rounded-s": scaleRadius() }],
			"rounded-e": [{ "rounded-e": scaleRadius() }],
			"rounded-t": [{ "rounded-t": scaleRadius() }],
			"rounded-r": [{ "rounded-r": scaleRadius() }],
			"rounded-b": [{ "rounded-b": scaleRadius() }],
			"rounded-l": [{ "rounded-l": scaleRadius() }],
			"rounded-ss": [{ "rounded-ss": scaleRadius() }],
			"rounded-se": [{ "rounded-se": scaleRadius() }],
			"rounded-ee": [{ "rounded-ee": scaleRadius() }],
			"rounded-es": [{ "rounded-es": scaleRadius() }],
			"rounded-tl": [{ "rounded-tl": scaleRadius() }],
			"rounded-tr": [{ "rounded-tr": scaleRadius() }],
			"rounded-br": [{ "rounded-br": scaleRadius() }],
			"rounded-bl": [{ "rounded-bl": scaleRadius() }],
			"border-w": [{ border: scaleBorderWidth() }],
			"border-w-x": [{ "border-x": scaleBorderWidth() }],
			"border-w-y": [{ "border-y": scaleBorderWidth() }],
			"border-w-s": [{ "border-s": scaleBorderWidth() }],
			"border-w-e": [{ "border-e": scaleBorderWidth() }],
			"border-w-bs": [{ "border-bs": scaleBorderWidth() }],
			"border-w-be": [{ "border-be": scaleBorderWidth() }],
			"border-w-t": [{ "border-t": scaleBorderWidth() }],
			"border-w-r": [{ "border-r": scaleBorderWidth() }],
			"border-w-b": [{ "border-b": scaleBorderWidth() }],
			"border-w-l": [{ "border-l": scaleBorderWidth() }],
			"divide-x": [{ "divide-x": scaleBorderWidth() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": scaleBorderWidth() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: scaleColor() }],
			"border-color-x": [{ "border-x": scaleColor() }],
			"border-color-y": [{ "border-y": scaleColor() }],
			"border-color-s": [{ "border-s": scaleColor() }],
			"border-color-e": [{ "border-e": scaleColor() }],
			"border-color-bs": [{ "border-bs": scaleColor() }],
			"border-color-be": [{ "border-be": scaleColor() }],
			"border-color-t": [{ "border-t": scaleColor() }],
			"border-color-r": [{ "border-r": scaleColor() }],
			"border-color-b": [{ "border-b": scaleColor() }],
			"border-color-l": [{ "border-l": scaleColor() }],
			"divide-color": [{ divide: scaleColor() }],
			"outline-style": [{ outline: [
				...scaleLineStyle(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"outline-w": [{ outline: [
				"",
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			"outline-color": [{ outline: scaleColor() }],
			shadow: [{ shadow: [
				"",
				"none",
				themeShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			"shadow-color": [{ shadow: scaleColor() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				themeInsetShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			"inset-shadow-color": [{ "inset-shadow": scaleColor() }],
			"ring-w": [{ ring: scaleBorderWidth() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: scaleColor() }],
			"ring-offset-w": [{ "ring-offset": [isNumber, isArbitraryLength] }],
			"ring-offset-color": [{ "ring-offset": scaleColor() }],
			"inset-ring-w": [{ "inset-ring": scaleBorderWidth() }],
			"inset-ring-color": [{ "inset-ring": scaleColor() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				themeTextShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			"text-shadow-color": [{ "text-shadow": scaleColor() }],
			opacity: [{ opacity: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"mix-blend": [{ "mix-blend": [
				...scaleBlendMode(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": scaleBlendMode() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [isNumber] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": scaleMaskImagePosition() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": scaleMaskImagePosition() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": scaleColor() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": scaleColor() }],
			"mask-image-t-from-pos": [{ "mask-t-from": scaleMaskImagePosition() }],
			"mask-image-t-to-pos": [{ "mask-t-to": scaleMaskImagePosition() }],
			"mask-image-t-from-color": [{ "mask-t-from": scaleColor() }],
			"mask-image-t-to-color": [{ "mask-t-to": scaleColor() }],
			"mask-image-r-from-pos": [{ "mask-r-from": scaleMaskImagePosition() }],
			"mask-image-r-to-pos": [{ "mask-r-to": scaleMaskImagePosition() }],
			"mask-image-r-from-color": [{ "mask-r-from": scaleColor() }],
			"mask-image-r-to-color": [{ "mask-r-to": scaleColor() }],
			"mask-image-b-from-pos": [{ "mask-b-from": scaleMaskImagePosition() }],
			"mask-image-b-to-pos": [{ "mask-b-to": scaleMaskImagePosition() }],
			"mask-image-b-from-color": [{ "mask-b-from": scaleColor() }],
			"mask-image-b-to-color": [{ "mask-b-to": scaleColor() }],
			"mask-image-l-from-pos": [{ "mask-l-from": scaleMaskImagePosition() }],
			"mask-image-l-to-pos": [{ "mask-l-to": scaleMaskImagePosition() }],
			"mask-image-l-from-color": [{ "mask-l-from": scaleColor() }],
			"mask-image-l-to-color": [{ "mask-l-to": scaleColor() }],
			"mask-image-x-from-pos": [{ "mask-x-from": scaleMaskImagePosition() }],
			"mask-image-x-to-pos": [{ "mask-x-to": scaleMaskImagePosition() }],
			"mask-image-x-from-color": [{ "mask-x-from": scaleColor() }],
			"mask-image-x-to-color": [{ "mask-x-to": scaleColor() }],
			"mask-image-y-from-pos": [{ "mask-y-from": scaleMaskImagePosition() }],
			"mask-image-y-to-pos": [{ "mask-y-to": scaleMaskImagePosition() }],
			"mask-image-y-from-color": [{ "mask-y-from": scaleColor() }],
			"mask-image-y-to-color": [{ "mask-y-to": scaleColor() }],
			"mask-image-radial": [{ "mask-radial": [isArbitraryVariable, isArbitraryValue] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": scaleMaskImagePosition() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": scaleMaskImagePosition() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": scaleColor() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": scaleColor() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": scalePosition() }],
			"mask-image-conic-pos": [{ "mask-conic": [isNumber] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": scaleMaskImagePosition() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": scaleMaskImagePosition() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": scaleColor() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": scaleColor() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: scaleBgPosition() }],
			"mask-repeat": [{ mask: scaleBgRepeat() }],
			"mask-size": [{ mask: scaleBgSize() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			filter: [{ filter: [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			blur: [{ blur: scaleBlur() }],
			brightness: [{ brightness: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			contrast: [{ contrast: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				themeDropShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			"drop-shadow-color": [{ "drop-shadow": scaleColor() }],
			grayscale: [{ grayscale: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"hue-rotate": [{ "hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			invert: [{ invert: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			saturate: [{ saturate: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			sepia: [{ sepia: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-blur": [{ "backdrop-blur": scaleBlur() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": scaleUnambiguousSpacing() }],
			"border-spacing-x": [{ "border-spacing-x": scaleUnambiguousSpacing() }],
			"border-spacing-y": [{ "border-spacing-y": scaleUnambiguousSpacing() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				isNumber,
				"initial",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				themeEase,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			delay: [{ delay: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			animate: [{ animate: [
				"none",
				themeAnimate,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				themePerspective,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"perspective-origin": [{ "perspective-origin": scalePositionWithArbitrary() }],
			rotate: [{ rotate: scaleRotate() }],
			"rotate-x": [{ "rotate-x": scaleRotate() }],
			"rotate-y": [{ "rotate-y": scaleRotate() }],
			"rotate-z": [{ "rotate-z": scaleRotate() }],
			scale: [{ scale: scaleScale() }],
			"scale-x": [{ "scale-x": scaleScale() }],
			"scale-y": [{ "scale-y": scaleScale() }],
			"scale-z": [{ "scale-z": scaleScale() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: scaleSkew() }],
			"skew-x": [{ "skew-x": scaleSkew() }],
			"skew-y": [{ "skew-y": scaleSkew() }],
			transform: [{ transform: [
				isArbitraryVariable,
				isArbitraryValue,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: scalePositionWithArbitrary() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: scaleTranslate() }],
			"translate-x": [{ "translate-x": scaleTranslate() }],
			"translate-y": [{ "translate-y": scaleTranslate() }],
			"translate-z": [{ "translate-z": scaleTranslate() }],
			"translate-none": ["translate-none"],
			accent: [{ accent: scaleColor() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: scaleColor() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scroll-m": [{ "scroll-m": scaleUnambiguousSpacing() }],
			"scroll-mx": [{ "scroll-mx": scaleUnambiguousSpacing() }],
			"scroll-my": [{ "scroll-my": scaleUnambiguousSpacing() }],
			"scroll-ms": [{ "scroll-ms": scaleUnambiguousSpacing() }],
			"scroll-me": [{ "scroll-me": scaleUnambiguousSpacing() }],
			"scroll-mbs": [{ "scroll-mbs": scaleUnambiguousSpacing() }],
			"scroll-mbe": [{ "scroll-mbe": scaleUnambiguousSpacing() }],
			"scroll-mt": [{ "scroll-mt": scaleUnambiguousSpacing() }],
			"scroll-mr": [{ "scroll-mr": scaleUnambiguousSpacing() }],
			"scroll-mb": [{ "scroll-mb": scaleUnambiguousSpacing() }],
			"scroll-ml": [{ "scroll-ml": scaleUnambiguousSpacing() }],
			"scroll-p": [{ "scroll-p": scaleUnambiguousSpacing() }],
			"scroll-px": [{ "scroll-px": scaleUnambiguousSpacing() }],
			"scroll-py": [{ "scroll-py": scaleUnambiguousSpacing() }],
			"scroll-ps": [{ "scroll-ps": scaleUnambiguousSpacing() }],
			"scroll-pe": [{ "scroll-pe": scaleUnambiguousSpacing() }],
			"scroll-pbs": [{ "scroll-pbs": scaleUnambiguousSpacing() }],
			"scroll-pbe": [{ "scroll-pbe": scaleUnambiguousSpacing() }],
			"scroll-pt": [{ "scroll-pt": scaleUnambiguousSpacing() }],
			"scroll-pr": [{ "scroll-pr": scaleUnambiguousSpacing() }],
			"scroll-pb": [{ "scroll-pb": scaleUnambiguousSpacing() }],
			"scroll-pl": [{ "scroll-pl": scaleUnambiguousSpacing() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			fill: [{ fill: ["none", ...scaleColor()] }],
			"stroke-w": [{ stroke: [
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength,
				isArbitraryNumber
			] }],
			stroke: [{ stroke: ["none", ...scaleColor()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
};
const twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);
//#endregion
//#region src/lib/utils.ts
function defineColumns(columns) {
	function columnKey(column) {
		if (Array.isArray(column.dataKey)) return column.dataKey.join(".");
		return column.dataKey ?? column.index;
	}
	return columns.map((column) => ({
		...column,
		index: columnKey(column)
	}));
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/lodash.js
var require_lodash = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		/** Used as a safe reference for `undefined` in pre-ES5 environments. */
		var undefined;
		/** Used as the semantic version number. */
		var VERSION = "4.18.1";
		/** Used as the size to enable large array optimizations. */
		var LARGE_ARRAY_SIZE = 200;
		/** Error message constants. */
		var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`", INVALID_TEMPL_IMPORTS_ERROR_TEXT = "Invalid `imports` option passed into `_.template`";
		/** Used to stand-in for `undefined` hash values. */
		var HASH_UNDEFINED = "__lodash_hash_undefined__";
		/** Used as the maximum memoize cache size. */
		var MAX_MEMOIZE_SIZE = 500;
		/** Used as the internal argument placeholder. */
		var PLACEHOLDER = "__lodash_placeholder__";
		/** Used to compose bitmasks for cloning. */
		var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
		/** Used to compose bitmasks for value comparisons. */
		var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
		/** Used to compose bitmasks for function metadata. */
		var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
		/** Used as default options for `_.truncate`. */
		var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
		/** Used to detect hot functions by number of calls within a span of milliseconds. */
		var HOT_COUNT = 800, HOT_SPAN = 16;
		/** Used to indicate the type of lazy iteratees. */
		var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
		/** Used as references for various `Number` constants. */
		var INFINITY = Infinity, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = NaN;
		/** Used as references for the maximum length and index of an array. */
		var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
		/** Used to associate wrap methods with their bit flags. */
		var wrapFlags = [
			["ary", WRAP_ARY_FLAG],
			["bind", WRAP_BIND_FLAG],
			["bindKey", WRAP_BIND_KEY_FLAG],
			["curry", WRAP_CURRY_FLAG],
			["curryRight", WRAP_CURRY_RIGHT_FLAG],
			["flip", WRAP_FLIP_FLAG],
			["partial", WRAP_PARTIAL_FLAG],
			["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
			["rearg", WRAP_REARG_FLAG]
		];
		/** `Object#toString` result references. */
		var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
		var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
		/** Used to match empty string literals in compiled template source. */
		var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
		/** Used to match HTML entities and HTML characters. */
		var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
		/** Used to match template delimiters. */
		var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
		/** Used to match property names within property paths. */
		var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
		/**
		* Used to match `RegExp`
		* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
		*/
		var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
		/** Used to match leading whitespace. */
		var reTrimStart = /^\s+/;
		/** Used to match a single whitespace character. */
		var reWhitespace = /\s/;
		/** Used to match wrap detail comments. */
		var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
		/** Used to match words composed of alphanumeric characters. */
		var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
		/**
		* Used to validate the `validate` option in `_.template` variable.
		*
		* Forbids characters which could potentially change the meaning of the function argument definition:
		* - "()," (modification of function parameters)
		* - "=" (default value)
		* - "[]{}" (destructuring of function parameters)
		* - "/" (beginning of a comment)
		* - whitespace
		*/
		var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
		/** Used to match backslashes in property paths. */
		var reEscapeChar = /\\(\\)?/g;
		/**
		* Used to match
		* [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
		*/
		var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
		/** Used to match `RegExp` flags from their coerced string values. */
		var reFlags = /\w*$/;
		/** Used to detect bad signed hexadecimal string values. */
		var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
		/** Used to detect binary string values. */
		var reIsBinary = /^0b[01]+$/i;
		/** Used to detect host constructors (Safari). */
		var reIsHostCtor = /^\[object .+?Constructor\]$/;
		/** Used to detect octal string values. */
		var reIsOctal = /^0o[0-7]+$/i;
		/** Used to detect unsigned integer values. */
		var reIsUint = /^(?:0|[1-9]\d*)$/;
		/** Used to match Latin Unicode letters (excluding mathematical operators). */
		var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
		/** Used to ensure capturing order of template delimiters. */
		var reNoMatch = /($^)/;
		/** Used to match unescaped characters in compiled string literals. */
		var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
		/** Used to compose unicode character classes. */
		var rsAstralRange = "\\ud800-\\udfff", rsComboRange = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
		/** Used to compose unicode capture groups. */
		var rsApos = "['’]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
		/** Used to compose unicode regexes. */
		var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [
			rsNonAstral,
			rsRegional,
			rsSurrPair
		].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [
			rsDingbat,
			rsRegional,
			rsSurrPair
		].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [
			rsNonAstral + rsCombo + "?",
			rsCombo,
			rsRegional,
			rsSurrPair,
			rsAstral
		].join("|") + ")";
		/** Used to match apostrophes. */
		var reApos = RegExp(rsApos, "g");
		/**
		* Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
		* [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
		*/
		var reComboMark = RegExp(rsCombo, "g");
		/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
		var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
		/** Used to match complex or compound words. */
		var reUnicodeWord = RegExp([
			rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [
				rsBreak,
				rsUpper,
				"$"
			].join("|") + ")",
			rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [
				rsBreak,
				rsUpper + rsMiscLower,
				"$"
			].join("|") + ")",
			rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
			rsUpper + "+" + rsOptContrUpper,
			rsOrdUpper,
			rsOrdLower,
			rsDigits,
			rsEmoji
		].join("|"), "g");
		/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
		var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
		/** Used to detect strings that need a more robust regexp to match words. */
		var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
		/** Used to assign default `context` object properties. */
		var contextProps = [
			"Array",
			"Buffer",
			"DataView",
			"Date",
			"Error",
			"Float32Array",
			"Float64Array",
			"Function",
			"Int8Array",
			"Int16Array",
			"Int32Array",
			"Map",
			"Math",
			"Object",
			"Promise",
			"RegExp",
			"Set",
			"String",
			"Symbol",
			"TypeError",
			"Uint8Array",
			"Uint8ClampedArray",
			"Uint16Array",
			"Uint32Array",
			"WeakMap",
			"_",
			"clearTimeout",
			"isFinite",
			"parseInt",
			"setTimeout"
		];
		/** Used to make template sourceURLs easier to identify. */
		var templateCounter = -1;
		/** Used to identify `toStringTag` values of typed arrays. */
		var typedArrayTags = {};
		typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
		typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
		/** Used to identify `toStringTag` values supported by `_.clone`. */
		var cloneableTags = {};
		cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
		cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
		/** Used to map Latin Unicode letters to basic Latin letters. */
		var deburredLetters = {
			"À": "A",
			"Á": "A",
			"Â": "A",
			"Ã": "A",
			"Ä": "A",
			"Å": "A",
			"à": "a",
			"á": "a",
			"â": "a",
			"ã": "a",
			"ä": "a",
			"å": "a",
			"Ç": "C",
			"ç": "c",
			"Ð": "D",
			"ð": "d",
			"È": "E",
			"É": "E",
			"Ê": "E",
			"Ë": "E",
			"è": "e",
			"é": "e",
			"ê": "e",
			"ë": "e",
			"Ì": "I",
			"Í": "I",
			"Î": "I",
			"Ï": "I",
			"ì": "i",
			"í": "i",
			"î": "i",
			"ï": "i",
			"Ñ": "N",
			"ñ": "n",
			"Ò": "O",
			"Ó": "O",
			"Ô": "O",
			"Õ": "O",
			"Ö": "O",
			"Ø": "O",
			"ò": "o",
			"ó": "o",
			"ô": "o",
			"õ": "o",
			"ö": "o",
			"ø": "o",
			"Ù": "U",
			"Ú": "U",
			"Û": "U",
			"Ü": "U",
			"ù": "u",
			"ú": "u",
			"û": "u",
			"ü": "u",
			"Ý": "Y",
			"ý": "y",
			"ÿ": "y",
			"Æ": "Ae",
			"æ": "ae",
			"Þ": "Th",
			"þ": "th",
			"ß": "ss",
			"Ā": "A",
			"Ă": "A",
			"Ą": "A",
			"ā": "a",
			"ă": "a",
			"ą": "a",
			"Ć": "C",
			"Ĉ": "C",
			"Ċ": "C",
			"Č": "C",
			"ć": "c",
			"ĉ": "c",
			"ċ": "c",
			"č": "c",
			"Ď": "D",
			"Đ": "D",
			"ď": "d",
			"đ": "d",
			"Ē": "E",
			"Ĕ": "E",
			"Ė": "E",
			"Ę": "E",
			"Ě": "E",
			"ē": "e",
			"ĕ": "e",
			"ė": "e",
			"ę": "e",
			"ě": "e",
			"Ĝ": "G",
			"Ğ": "G",
			"Ġ": "G",
			"Ģ": "G",
			"ĝ": "g",
			"ğ": "g",
			"ġ": "g",
			"ģ": "g",
			"Ĥ": "H",
			"Ħ": "H",
			"ĥ": "h",
			"ħ": "h",
			"Ĩ": "I",
			"Ī": "I",
			"Ĭ": "I",
			"Į": "I",
			"İ": "I",
			"ĩ": "i",
			"ī": "i",
			"ĭ": "i",
			"į": "i",
			"ı": "i",
			"Ĵ": "J",
			"ĵ": "j",
			"Ķ": "K",
			"ķ": "k",
			"ĸ": "k",
			"Ĺ": "L",
			"Ļ": "L",
			"Ľ": "L",
			"Ŀ": "L",
			"Ł": "L",
			"ĺ": "l",
			"ļ": "l",
			"ľ": "l",
			"ŀ": "l",
			"ł": "l",
			"Ń": "N",
			"Ņ": "N",
			"Ň": "N",
			"Ŋ": "N",
			"ń": "n",
			"ņ": "n",
			"ň": "n",
			"ŋ": "n",
			"Ō": "O",
			"Ŏ": "O",
			"Ő": "O",
			"ō": "o",
			"ŏ": "o",
			"ő": "o",
			"Ŕ": "R",
			"Ŗ": "R",
			"Ř": "R",
			"ŕ": "r",
			"ŗ": "r",
			"ř": "r",
			"Ś": "S",
			"Ŝ": "S",
			"Ş": "S",
			"Š": "S",
			"ś": "s",
			"ŝ": "s",
			"ş": "s",
			"š": "s",
			"Ţ": "T",
			"Ť": "T",
			"Ŧ": "T",
			"ţ": "t",
			"ť": "t",
			"ŧ": "t",
			"Ũ": "U",
			"Ū": "U",
			"Ŭ": "U",
			"Ů": "U",
			"Ű": "U",
			"Ų": "U",
			"ũ": "u",
			"ū": "u",
			"ŭ": "u",
			"ů": "u",
			"ű": "u",
			"ų": "u",
			"Ŵ": "W",
			"ŵ": "w",
			"Ŷ": "Y",
			"ŷ": "y",
			"Ÿ": "Y",
			"Ź": "Z",
			"Ż": "Z",
			"Ž": "Z",
			"ź": "z",
			"ż": "z",
			"ž": "z",
			"Ĳ": "IJ",
			"ĳ": "ij",
			"Œ": "Oe",
			"œ": "oe",
			"ŉ": "'n",
			"ſ": "s"
		};
		/** Used to map characters to HTML entities. */
		var htmlEscapes = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;",
			"'": "&#39;"
		};
		/** Used to map HTML entities to characters. */
		var htmlUnescapes = {
			"&amp;": "&",
			"&lt;": "<",
			"&gt;": ">",
			"&quot;": "\"",
			"&#39;": "'"
		};
		/** Used to escape characters for inclusion in compiled string literals. */
		var stringEscapes = {
			"\\": "\\",
			"'": "'",
			"\n": "n",
			"\r": "r",
			"\u2028": "u2028",
			"\u2029": "u2029"
		};
		/** Built-in method references without a dependency on `root`. */
		var freeParseFloat = parseFloat, freeParseInt = parseInt;
		/** Detect free variable `global` from Node.js. */
		var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
		/** Detect free variable `self`. */
		var freeSelf = typeof self == "object" && self && self.Object === Object && self;
		/** Used as a reference to the global object. */
		var root = freeGlobal || freeSelf || Function("return this")();
		/** Detect free variable `exports`. */
		var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
		/** Detect free variable `module`. */
		var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
		/** Detect the popular CommonJS extension `module.exports`. */
		var moduleExports = freeModule && freeModule.exports === freeExports;
		/** Detect free variable `process` from Node.js. */
		var freeProcess = moduleExports && freeGlobal.process;
		/** Used to access faster Node.js helpers. */
		var nodeUtil = function() {
			try {
				var types = freeModule && freeModule.require && freeModule.require("util").types;
				if (types) return types;
				return freeProcess && freeProcess.binding && freeProcess.binding("util");
			} catch (e) {}
		}();
		var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
		/**
		* A faster alternative to `Function#apply`, this function invokes `func`
		* with the `this` binding of `thisArg` and the arguments of `args`.
		*
		* @private
		* @param {Function} func The function to invoke.
		* @param {*} thisArg The `this` binding of `func`.
		* @param {Array} args The arguments to invoke `func` with.
		* @returns {*} Returns the result of `func`.
		*/
		function apply(func, thisArg, args) {
			switch (args.length) {
				case 0: return func.call(thisArg);
				case 1: return func.call(thisArg, args[0]);
				case 2: return func.call(thisArg, args[0], args[1]);
				case 3: return func.call(thisArg, args[0], args[1], args[2]);
			}
			return func.apply(thisArg, args);
		}
		/**
		* A specialized version of `baseAggregator` for arrays.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} setter The function to set `accumulator` values.
		* @param {Function} iteratee The iteratee to transform keys.
		* @param {Object} accumulator The initial aggregated object.
		* @returns {Function} Returns `accumulator`.
		*/
		function arrayAggregator(array, setter, iteratee, accumulator) {
			var index = -1, length = array == null ? 0 : array.length;
			while (++index < length) {
				var value = array[index];
				setter(accumulator, value, iteratee(value), array);
			}
			return accumulator;
		}
		/**
		* A specialized version of `_.forEach` for arrays without support for
		* iteratee shorthands.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} iteratee The function invoked per iteration.
		* @returns {Array} Returns `array`.
		*/
		function arrayEach(array, iteratee) {
			var index = -1, length = array == null ? 0 : array.length;
			while (++index < length) if (iteratee(array[index], index, array) === false) break;
			return array;
		}
		/**
		* A specialized version of `_.forEachRight` for arrays without support for
		* iteratee shorthands.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} iteratee The function invoked per iteration.
		* @returns {Array} Returns `array`.
		*/
		function arrayEachRight(array, iteratee) {
			var length = array == null ? 0 : array.length;
			while (length--) if (iteratee(array[length], length, array) === false) break;
			return array;
		}
		/**
		* A specialized version of `_.every` for arrays without support for
		* iteratee shorthands.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} predicate The function invoked per iteration.
		* @returns {boolean} Returns `true` if all elements pass the predicate check,
		*  else `false`.
		*/
		function arrayEvery(array, predicate) {
			var index = -1, length = array == null ? 0 : array.length;
			while (++index < length) if (!predicate(array[index], index, array)) return false;
			return true;
		}
		/**
		* A specialized version of `_.filter` for arrays without support for
		* iteratee shorthands.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} predicate The function invoked per iteration.
		* @returns {Array} Returns the new filtered array.
		*/
		function arrayFilter(array, predicate) {
			var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
			while (++index < length) {
				var value = array[index];
				if (predicate(value, index, array)) result[resIndex++] = value;
			}
			return result;
		}
		/**
		* A specialized version of `_.includes` for arrays without support for
		* specifying an index to search from.
		*
		* @private
		* @param {Array} [array] The array to inspect.
		* @param {*} target The value to search for.
		* @returns {boolean} Returns `true` if `target` is found, else `false`.
		*/
		function arrayIncludes(array, value) {
			return !!(array == null ? 0 : array.length) && baseIndexOf(array, value, 0) > -1;
		}
		/**
		* This function is like `arrayIncludes` except that it accepts a comparator.
		*
		* @private
		* @param {Array} [array] The array to inspect.
		* @param {*} target The value to search for.
		* @param {Function} comparator The comparator invoked per element.
		* @returns {boolean} Returns `true` if `target` is found, else `false`.
		*/
		function arrayIncludesWith(array, value, comparator) {
			var index = -1, length = array == null ? 0 : array.length;
			while (++index < length) if (comparator(value, array[index])) return true;
			return false;
		}
		/**
		* A specialized version of `_.map` for arrays without support for iteratee
		* shorthands.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} iteratee The function invoked per iteration.
		* @returns {Array} Returns the new mapped array.
		*/
		function arrayMap(array, iteratee) {
			var index = -1, length = array == null ? 0 : array.length, result = Array(length);
			while (++index < length) result[index] = iteratee(array[index], index, array);
			return result;
		}
		/**
		* Appends the elements of `values` to `array`.
		*
		* @private
		* @param {Array} array The array to modify.
		* @param {Array} values The values to append.
		* @returns {Array} Returns `array`.
		*/
		function arrayPush(array, values) {
			var index = -1, length = values.length, offset = array.length;
			while (++index < length) array[offset + index] = values[index];
			return array;
		}
		/**
		* A specialized version of `_.reduce` for arrays without support for
		* iteratee shorthands.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} iteratee The function invoked per iteration.
		* @param {*} [accumulator] The initial value.
		* @param {boolean} [initAccum] Specify using the first element of `array` as
		*  the initial value.
		* @returns {*} Returns the accumulated value.
		*/
		function arrayReduce(array, iteratee, accumulator, initAccum) {
			var index = -1, length = array == null ? 0 : array.length;
			if (initAccum && length) accumulator = array[++index];
			while (++index < length) accumulator = iteratee(accumulator, array[index], index, array);
			return accumulator;
		}
		/**
		* A specialized version of `_.reduceRight` for arrays without support for
		* iteratee shorthands.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} iteratee The function invoked per iteration.
		* @param {*} [accumulator] The initial value.
		* @param {boolean} [initAccum] Specify using the last element of `array` as
		*  the initial value.
		* @returns {*} Returns the accumulated value.
		*/
		function arrayReduceRight(array, iteratee, accumulator, initAccum) {
			var length = array == null ? 0 : array.length;
			if (initAccum && length) accumulator = array[--length];
			while (length--) accumulator = iteratee(accumulator, array[length], length, array);
			return accumulator;
		}
		/**
		* A specialized version of `_.some` for arrays without support for iteratee
		* shorthands.
		*
		* @private
		* @param {Array} [array] The array to iterate over.
		* @param {Function} predicate The function invoked per iteration.
		* @returns {boolean} Returns `true` if any element passes the predicate check,
		*  else `false`.
		*/
		function arraySome(array, predicate) {
			var index = -1, length = array == null ? 0 : array.length;
			while (++index < length) if (predicate(array[index], index, array)) return true;
			return false;
		}
		/**
		* Gets the size of an ASCII `string`.
		*
		* @private
		* @param {string} string The string inspect.
		* @returns {number} Returns the string size.
		*/
		var asciiSize = baseProperty("length");
		/**
		* Converts an ASCII `string` to an array.
		*
		* @private
		* @param {string} string The string to convert.
		* @returns {Array} Returns the converted array.
		*/
		function asciiToArray(string) {
			return string.split("");
		}
		/**
		* Splits an ASCII `string` into an array of its words.
		*
		* @private
		* @param {string} The string to inspect.
		* @returns {Array} Returns the words of `string`.
		*/
		function asciiWords(string) {
			return string.match(reAsciiWord) || [];
		}
		/**
		* The base implementation of methods like `_.findKey` and `_.findLastKey`,
		* without support for iteratee shorthands, which iterates over `collection`
		* using `eachFunc`.
		*
		* @private
		* @param {Array|Object} collection The collection to inspect.
		* @param {Function} predicate The function invoked per iteration.
		* @param {Function} eachFunc The function to iterate over `collection`.
		* @returns {*} Returns the found element or its key, else `undefined`.
		*/
		function baseFindKey(collection, predicate, eachFunc) {
			var result;
			eachFunc(collection, function(value, key, collection) {
				if (predicate(value, key, collection)) {
					result = key;
					return false;
				}
			});
			return result;
		}
		/**
		* The base implementation of `_.findIndex` and `_.findLastIndex` without
		* support for iteratee shorthands.
		*
		* @private
		* @param {Array} array The array to inspect.
		* @param {Function} predicate The function invoked per iteration.
		* @param {number} fromIndex The index to search from.
		* @param {boolean} [fromRight] Specify iterating from right to left.
		* @returns {number} Returns the index of the matched value, else `-1`.
		*/
		function baseFindIndex(array, predicate, fromIndex, fromRight) {
			var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
			while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
			return -1;
		}
		/**
		* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
		*
		* @private
		* @param {Array} array The array to inspect.
		* @param {*} value The value to search for.
		* @param {number} fromIndex The index to search from.
		* @returns {number} Returns the index of the matched value, else `-1`.
		*/
		function baseIndexOf(array, value, fromIndex) {
			return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
		}
		/**
		* This function is like `baseIndexOf` except that it accepts a comparator.
		*
		* @private
		* @param {Array} array The array to inspect.
		* @param {*} value The value to search for.
		* @param {number} fromIndex The index to search from.
		* @param {Function} comparator The comparator invoked per element.
		* @returns {number} Returns the index of the matched value, else `-1`.
		*/
		function baseIndexOfWith(array, value, fromIndex, comparator) {
			var index = fromIndex - 1, length = array.length;
			while (++index < length) if (comparator(array[index], value)) return index;
			return -1;
		}
		/**
		* The base implementation of `_.isNaN` without support for number objects.
		*
		* @private
		* @param {*} value The value to check.
		* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
		*/
		function baseIsNaN(value) {
			return value !== value;
		}
		/**
		* The base implementation of `_.mean` and `_.meanBy` without support for
		* iteratee shorthands.
		*
		* @private
		* @param {Array} array The array to iterate over.
		* @param {Function} iteratee The function invoked per iteration.
		* @returns {number} Returns the mean.
		*/
		function baseMean(array, iteratee) {
			var length = array == null ? 0 : array.length;
			return length ? baseSum(array, iteratee) / length : NAN;
		}
		/**
		* The base implementation of `_.property` without support for deep paths.
		*
		* @private
		* @param {string} key The key of the property to get.
		* @returns {Function} Returns the new accessor function.
		*/
		function baseProperty(key) {
			return function(object) {
				return object == null ? undefined : object[key];
			};
		}
		/**
		* The base implementation of `_.propertyOf` without support for deep paths.
		*
		* @private
		* @param {Object} object The object to query.
		* @returns {Function} Returns the new accessor function.
		*/
		function basePropertyOf(object) {
			return function(key) {
				return object == null ? undefined : object[key];
			};
		}
		/**
		* The base implementation of `_.reduce` and `_.reduceRight`, without support
		* for iteratee shorthands, which iterates over `collection` using `eachFunc`.
		*
		* @private
		* @param {Array|Object} collection The collection to iterate over.
		* @param {Function} iteratee The function invoked per iteration.
		* @param {*} accumulator The initial value.
		* @param {boolean} initAccum Specify using the first or last element of
		*  `collection` as the initial value.
		* @param {Function} eachFunc The function to iterate over `collection`.
		* @returns {*} Returns the accumulated value.
		*/
		function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
			eachFunc(collection, function(value, index, collection) {
				accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
			});
			return accumulator;
		}
		/**
		* The base implementation of `_.sortBy` which uses `comparer` to define the
		* sort order of `array` and replaces criteria objects with their corresponding
		* values.
		*
		* @private
		* @param {Array} array The array to sort.
		* @param {Function} comparer The function to define sort order.
		* @returns {Array} Returns `array`.
		*/
		function baseSortBy(array, comparer) {
			var length = array.length;
			array.sort(comparer);
			while (length--) array[length] = array[length].value;
			return array;
		}
		/**
		* The base implementation of `_.sum` and `_.sumBy` without support for
		* iteratee shorthands.
		*
		* @private
		* @param {Array} array The array to iterate over.
		* @param {Function} iteratee The function invoked per iteration.
		* @returns {number} Returns the sum.
		*/
		function baseSum(array, iteratee) {
			var result, index = -1, length = array.length;
			while (++index < length) {
				var current = iteratee(array[index]);
				if (current !== undefined) result = result === undefined ? current : result + current;
			}
			return result;
		}
		/**
		* The base implementation of `_.times` without support for iteratee shorthands
		* or max array length checks.
		*
		* @private
		* @param {number} n The number of times to invoke `iteratee`.
		* @param {Function} iteratee The function invoked per iteration.
		* @returns {Array} Returns the array of results.
		*/
		function baseTimes(n, iteratee) {
			var index = -1, result = Array(n);
			while (++index < n) result[index] = iteratee(index);
			return result;
		}
		/**
		* The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
		* of key-value pairs for `object` corresponding to the property names of `props`.
		*
		* @private
		* @param {Object} object The object to query.
		* @param {Array} props The property names to get values for.
		* @returns {Object} Returns the key-value pairs.
		*/
		function baseToPairs(object, props) {
			return arrayMap(props, function(key) {
				return [key, object[key]];
			});
		}
		/**
		* The base implementation of `_.trim`.
		*
		* @private
		* @param {string} string The string to trim.
		* @returns {string} Returns the trimmed string.
		*/
		function baseTrim(string) {
			return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
		}
		/**
		* The base implementation of `_.unary` without support for storing metadata.
		*
		* @private
		* @param {Function} func The function to cap arguments for.
		* @returns {Function} Returns the new capped function.
		*/
		function baseUnary(func) {
			return function(value) {
				return func(value);
			};
		}
		/**
		* The base implementation of `_.values` and `_.valuesIn` which creates an
		* array of `object` property values corresponding to the property names
		* of `props`.
		*
		* @private
		* @param {Object} object The object to query.
		* @param {Array} props The property names to get values for.
		* @returns {Object} Returns the array of property values.
		*/
		function baseValues(object, props) {
			return arrayMap(props, function(key) {
				return object[key];
			});
		}
		/**
		* Checks if a `cache` value for `key` exists.
		*
		* @private
		* @param {Object} cache The cache to query.
		* @param {string} key The key of the entry to check.
		* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
		*/
		function cacheHas(cache, key) {
			return cache.has(key);
		}
		/**
		* Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
		* that is not found in the character symbols.
		*
		* @private
		* @param {Array} strSymbols The string symbols to inspect.
		* @param {Array} chrSymbols The character symbols to find.
		* @returns {number} Returns the index of the first unmatched string symbol.
		*/
		function charsStartIndex(strSymbols, chrSymbols) {
			var index = -1, length = strSymbols.length;
			while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1);
			return index;
		}
		/**
		* Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
		* that is not found in the character symbols.
		*
		* @private
		* @param {Array} strSymbols The string symbols to inspect.
		* @param {Array} chrSymbols The character symbols to find.
		* @returns {number} Returns the index of the last unmatched string symbol.
		*/
		function charsEndIndex(strSymbols, chrSymbols) {
			var index = strSymbols.length;
			while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1);
			return index;
		}
		/**
		* Gets the number of `placeholder` occurrences in `array`.
		*
		* @private
		* @param {Array} array The array to inspect.
		* @param {*} placeholder The placeholder to search for.
		* @returns {number} Returns the placeholder count.
		*/
		function countHolders(array, placeholder) {
			var length = array.length, result = 0;
			while (length--) if (array[length] === placeholder) ++result;
			return result;
		}
		/**
		* Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
		* letters to basic Latin letters.
		*
		* @private
		* @param {string} letter The matched letter to deburr.
		* @returns {string} Returns the deburred letter.
		*/
		var deburrLetter = basePropertyOf(deburredLetters);
		/**
		* Used by `_.escape` to convert characters to HTML entities.
		*
		* @private
		* @param {string} chr The matched character to escape.
		* @returns {string} Returns the escaped character.
		*/
		var escapeHtmlChar = basePropertyOf(htmlEscapes);
		/**
		* Used by `_.template` to escape characters for inclusion in compiled string literals.
		*
		* @private
		* @param {string} chr The matched character to escape.
		* @returns {string} Returns the escaped character.
		*/
		function escapeStringChar(chr) {
			return "\\" + stringEscapes[chr];
		}
		/**
		* Gets the value at `key` of `object`.
		*
		* @private
		* @param {Object} [object] The object to query.
		* @param {string} key The key of the property to get.
		* @returns {*} Returns the property value.
		*/
		function getValue(object, key) {
			return object == null ? undefined : object[key];
		}
		/**
		* Checks if `string` contains Unicode symbols.
		*
		* @private
		* @param {string} string The string to inspect.
		* @returns {boolean} Returns `true` if a symbol is found, else `false`.
		*/
		function hasUnicode(string) {
			return reHasUnicode.test(string);
		}
		/**
		* Checks if `string` contains a word composed of Unicode symbols.
		*
		* @private
		* @param {string} string The string to inspect.
		* @returns {boolean} Returns `true` if a word is found, else `false`.
		*/
		function hasUnicodeWord(string) {
			return reHasUnicodeWord.test(string);
		}
		/**
		* Converts `iterator` to an array.
		*
		* @private
		* @param {Object} iterator The iterator to convert.
		* @returns {Array} Returns the converted array.
		*/
		function iteratorToArray(iterator) {
			var data, result = [];
			while (!(data = iterator.next()).done) result.push(data.value);
			return result;
		}
		/**
		* Converts `map` to its key-value pairs.
		*
		* @private
		* @param {Object} map The map to convert.
		* @returns {Array} Returns the key-value pairs.
		*/
		function mapToArray(map) {
			var index = -1, result = Array(map.size);
			map.forEach(function(value, key) {
				result[++index] = [key, value];
			});
			return result;
		}
		/**
		* Creates a unary function that invokes `func` with its argument transformed.
		*
		* @private
		* @param {Function} func The function to wrap.
		* @param {Function} transform The argument transform.
		* @returns {Function} Returns the new function.
		*/
		function overArg(func, transform) {
			return function(arg) {
				return func(transform(arg));
			};
		}
		/**
		* Replaces all `placeholder` elements in `array` with an internal placeholder
		* and returns an array of their indexes.
		*
		* @private
		* @param {Array} array The array to modify.
		* @param {*} placeholder The placeholder to replace.
		* @returns {Array} Returns the new array of placeholder indexes.
		*/
		function replaceHolders(array, placeholder) {
			var index = -1, length = array.length, resIndex = 0, result = [];
			while (++index < length) {
				var value = array[index];
				if (value === placeholder || value === PLACEHOLDER) {
					array[index] = PLACEHOLDER;
					result[resIndex++] = index;
				}
			}
			return result;
		}
		/**
		* Converts `set` to an array of its values.
		*
		* @private
		* @param {Object} set The set to convert.
		* @returns {Array} Returns the values.
		*/
		function setToArray(set) {
			var index = -1, result = Array(set.size);
			set.forEach(function(value) {
				result[++index] = value;
			});
			return result;
		}
		/**
		* Converts `set` to its value-value pairs.
		*
		* @private
		* @param {Object} set The set to convert.
		* @returns {Array} Returns the value-value pairs.
		*/
		function setToPairs(set) {
			var index = -1, result = Array(set.size);
			set.forEach(function(value) {
				result[++index] = [value, value];
			});
			return result;
		}
		/**
		* A specialized version of `_.indexOf` which performs strict equality
		* comparisons of values, i.e. `===`.
		*
		* @private
		* @param {Array} array The array to inspect.
		* @param {*} value The value to search for.
		* @param {number} fromIndex The index to search from.
		* @returns {number} Returns the index of the matched value, else `-1`.
		*/
		function strictIndexOf(array, value, fromIndex) {
			var index = fromIndex - 1, length = array.length;
			while (++index < length) if (array[index] === value) return index;
			return -1;
		}
		/**
		* A specialized version of `_.lastIndexOf` which performs strict equality
		* comparisons of values, i.e. `===`.
		*
		* @private
		* @param {Array} array The array to inspect.
		* @param {*} value The value to search for.
		* @param {number} fromIndex The index to search from.
		* @returns {number} Returns the index of the matched value, else `-1`.
		*/
		function strictLastIndexOf(array, value, fromIndex) {
			var index = fromIndex + 1;
			while (index--) if (array[index] === value) return index;
			return index;
		}
		/**
		* Gets the number of symbols in `string`.
		*
		* @private
		* @param {string} string The string to inspect.
		* @returns {number} Returns the string size.
		*/
		function stringSize(string) {
			return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
		}
		/**
		* Converts `string` to an array.
		*
		* @private
		* @param {string} string The string to convert.
		* @returns {Array} Returns the converted array.
		*/
		function stringToArray(string) {
			return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
		}
		/**
		* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
		* character of `string`.
		*
		* @private
		* @param {string} string The string to inspect.
		* @returns {number} Returns the index of the last non-whitespace character.
		*/
		function trimmedEndIndex(string) {
			var index = string.length;
			while (index-- && reWhitespace.test(string.charAt(index)));
			return index;
		}
		/**
		* Used by `_.unescape` to convert HTML entities to characters.
		*
		* @private
		* @param {string} chr The matched character to unescape.
		* @returns {string} Returns the unescaped character.
		*/
		var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
		/**
		* Gets the size of a Unicode `string`.
		*
		* @private
		* @param {string} string The string inspect.
		* @returns {number} Returns the string size.
		*/
		function unicodeSize(string) {
			var result = reUnicode.lastIndex = 0;
			while (reUnicode.test(string)) ++result;
			return result;
		}
		/**
		* Converts a Unicode `string` to an array.
		*
		* @private
		* @param {string} string The string to convert.
		* @returns {Array} Returns the converted array.
		*/
		function unicodeToArray(string) {
			return string.match(reUnicode) || [];
		}
		/**
		* Splits a Unicode `string` into an array of its words.
		*
		* @private
		* @param {string} The string to inspect.
		* @returns {Array} Returns the words of `string`.
		*/
		function unicodeWords(string) {
			return string.match(reUnicodeWord) || [];
		}
		var _ = (function runInContext(context) {
			context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
			/** Built-in constructor references. */
			var Array = context.Array, Date = context.Date, Error = context.Error, Function = context.Function, Math = context.Math, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
			/** Used for built-in method references. */
			var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
			/** Used to detect overreaching core-js shims. */
			var coreJsData = context["__core-js_shared__"];
			/** Used to resolve the decompiled source of functions. */
			var funcToString = funcProto.toString;
			/** Used to check objects for own properties. */
			var hasOwnProperty = objectProto.hasOwnProperty;
			/** Used to generate unique IDs. */
			var idCounter = 0;
			/** Used to detect methods masquerading as native. */
			var maskSrcKey = function() {
				var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
				return uid ? "Symbol(src)_1." + uid : "";
			}();
			/**
			* Used to resolve the
			* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
			* of values.
			*/
			var nativeObjectToString = objectProto.toString;
			/** Used to infer the `Object` constructor. */
			var objectCtorString = funcToString.call(Object);
			/** Used to restore the original `_` reference in `_.noConflict`. */
			var oldDash = root._;
			/** Used to detect if a method is native. */
			var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
			/** Built-in value references. */
			var Buffer = moduleExports ? context.Buffer : undefined, Symbol = context.Symbol, Uint8Array = context.Uint8Array, allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined, symIterator = Symbol ? Symbol.iterator : undefined, symToStringTag = Symbol ? Symbol.toStringTag : undefined;
			var defineProperty = function() {
				try {
					var func = getNative(Object, "defineProperty");
					func({}, "", {});
					return func;
				} catch (e) {}
			}();
			/** Mocked built-ins. */
			var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date && Date.now !== root.Date.now && Date.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
			var nativeCeil = Math.ceil, nativeFloor = Math.floor, nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object.keys, Object), nativeMax = Math.max, nativeMin = Math.min, nativeNow = Date.now, nativeParseInt = context.parseInt, nativeRandom = Math.random, nativeReverse = arrayProto.reverse;
			var DataView = getNative(context, "DataView"), Map = getNative(context, "Map"), Promise = getNative(context, "Promise"), Set = getNative(context, "Set"), WeakMap = getNative(context, "WeakMap"), nativeCreate = getNative(Object, "create");
			/** Used to store function metadata. */
			var metaMap = WeakMap && new WeakMap();
			/** Used to lookup unminified function names. */
			var realNames = {};
			/** Used to detect maps, sets, and weakmaps. */
			var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
			/** Used to convert symbols to primitives and strings. */
			var symbolProto = Symbol ? Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined, symbolToString = symbolProto ? symbolProto.toString : undefined;
			/**
			* Creates a `lodash` object which wraps `value` to enable implicit method
			* chain sequences. Methods that operate on and return arrays, collections,
			* and functions can be chained together. Methods that retrieve a single value
			* or may return a primitive value will automatically end the chain sequence
			* and return the unwrapped value. Otherwise, the value must be unwrapped
			* with `_#value`.
			*
			* Explicit chain sequences, which must be unwrapped with `_#value`, may be
			* enabled using `_.chain`.
			*
			* The execution of chained methods is lazy, that is, it's deferred until
			* `_#value` is implicitly or explicitly called.
			*
			* Lazy evaluation allows several methods to support shortcut fusion.
			* Shortcut fusion is an optimization to merge iteratee calls; this avoids
			* the creation of intermediate arrays and can greatly reduce the number of
			* iteratee executions. Sections of a chain sequence qualify for shortcut
			* fusion if the section is applied to an array and iteratees accept only
			* one argument. The heuristic for whether a section qualifies for shortcut
			* fusion is subject to change.
			*
			* Chaining is supported in custom builds as long as the `_#value` method is
			* directly or indirectly included in the build.
			*
			* In addition to lodash methods, wrappers have `Array` and `String` methods.
			*
			* The wrapper `Array` methods are:
			* `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
			*
			* The wrapper `String` methods are:
			* `replace` and `split`
			*
			* The wrapper methods that support shortcut fusion are:
			* `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
			* `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
			* `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
			*
			* The chainable wrapper methods are:
			* `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
			* `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
			* `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
			* `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
			* `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
			* `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
			* `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
			* `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
			* `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
			* `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
			* `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
			* `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
			* `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
			* `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
			* `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
			* `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
			* `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
			* `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
			* `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
			* `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
			* `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
			* `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
			* `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
			* `zipObject`, `zipObjectDeep`, and `zipWith`
			*
			* The wrapper methods that are **not** chainable by default are:
			* `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
			* `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
			* `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
			* `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
			* `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
			* `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
			* `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
			* `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
			* `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
			* `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
			* `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
			* `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
			* `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
			* `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
			* `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
			* `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
			* `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
			* `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
			* `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
			* `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
			* `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
			* `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
			* `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
			* `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
			* `upperFirst`, `value`, and `words`
			*
			* @name _
			* @constructor
			* @category Seq
			* @param {*} value The value to wrap in a `lodash` instance.
			* @returns {Object} Returns the new `lodash` wrapper instance.
			* @example
			*
			* function square(n) {
			*   return n * n;
			* }
			*
			* var wrapped = _([1, 2, 3]);
			*
			* // Returns an unwrapped value.
			* wrapped.reduce(_.add);
			* // => 6
			*
			* // Returns a wrapped value.
			* var squares = wrapped.map(square);
			*
			* _.isArray(squares);
			* // => false
			*
			* _.isArray(squares.value());
			* // => true
			*/
			function lodash(value) {
				if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
					if (value instanceof LodashWrapper) return value;
					if (hasOwnProperty.call(value, "__wrapped__")) return wrapperClone(value);
				}
				return new LodashWrapper(value);
			}
			/**
			* The base implementation of `_.create` without support for assigning
			* properties to the created object.
			*
			* @private
			* @param {Object} proto The object to inherit from.
			* @returns {Object} Returns the new object.
			*/
			var baseCreate = function() {
				function object() {}
				return function(proto) {
					if (!isObject(proto)) return {};
					if (objectCreate) return objectCreate(proto);
					object.prototype = proto;
					var result = new object();
					object.prototype = undefined;
					return result;
				};
			}();
			/**
			* The function whose prototype chain sequence wrappers inherit from.
			*
			* @private
			*/
			function baseLodash() {}
			/**
			* The base constructor for creating `lodash` wrapper objects.
			*
			* @private
			* @param {*} value The value to wrap.
			* @param {boolean} [chainAll] Enable explicit method chain sequences.
			*/
			function LodashWrapper(value, chainAll) {
				this.__wrapped__ = value;
				this.__actions__ = [];
				this.__chain__ = !!chainAll;
				this.__index__ = 0;
				this.__values__ = undefined;
			}
			/**
			* By default, the template delimiters used by lodash are like those in
			* embedded Ruby (ERB) as well as ES2015 template strings. Change the
			* following template settings to use alternative delimiters.
			*
			* **Security:** See
			* [threat model](https://github.com/lodash/lodash/blob/main/threat-model.md)
			* — `_.template` is insecure and will be removed in v5.
			*
			* @static
			* @memberOf _
			* @type {Object}
			*/
			lodash.templateSettings = {
				"escape": reEscape,
				"evaluate": reEvaluate,
				"interpolate": reInterpolate,
				"variable": "",
				"imports": { "_": lodash }
			};
			lodash.prototype = baseLodash.prototype;
			lodash.prototype.constructor = lodash;
			LodashWrapper.prototype = baseCreate(baseLodash.prototype);
			LodashWrapper.prototype.constructor = LodashWrapper;
			/**
			* Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
			*
			* @private
			* @constructor
			* @param {*} value The value to wrap.
			*/
			function LazyWrapper(value) {
				this.__wrapped__ = value;
				this.__actions__ = [];
				this.__dir__ = 1;
				this.__filtered__ = false;
				this.__iteratees__ = [];
				this.__takeCount__ = MAX_ARRAY_LENGTH;
				this.__views__ = [];
			}
			/**
			* Creates a clone of the lazy wrapper object.
			*
			* @private
			* @name clone
			* @memberOf LazyWrapper
			* @returns {Object} Returns the cloned `LazyWrapper` object.
			*/
			function lazyClone() {
				var result = new LazyWrapper(this.__wrapped__);
				result.__actions__ = copyArray(this.__actions__);
				result.__dir__ = this.__dir__;
				result.__filtered__ = this.__filtered__;
				result.__iteratees__ = copyArray(this.__iteratees__);
				result.__takeCount__ = this.__takeCount__;
				result.__views__ = copyArray(this.__views__);
				return result;
			}
			/**
			* Reverses the direction of lazy iteration.
			*
			* @private
			* @name reverse
			* @memberOf LazyWrapper
			* @returns {Object} Returns the new reversed `LazyWrapper` object.
			*/
			function lazyReverse() {
				if (this.__filtered__) {
					var result = new LazyWrapper(this);
					result.__dir__ = -1;
					result.__filtered__ = true;
				} else {
					result = this.clone();
					result.__dir__ *= -1;
				}
				return result;
			}
			/**
			* Extracts the unwrapped value from its lazy wrapper.
			*
			* @private
			* @name value
			* @memberOf LazyWrapper
			* @returns {*} Returns the unwrapped value.
			*/
			function lazyValue() {
				var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
				if (!isArr || !isRight && arrLength == length && takeCount == length) return baseWrapperValue(array, this.__actions__);
				var result = [];
				outer: while (length-- && resIndex < takeCount) {
					index += dir;
					var iterIndex = -1, value = array[index];
					while (++iterIndex < iterLength) {
						var data = iteratees[iterIndex], iteratee = data.iteratee, type = data.type, computed = iteratee(value);
						if (type == LAZY_MAP_FLAG) value = computed;
						else if (!computed) if (type == LAZY_FILTER_FLAG) continue outer;
						else break outer;
					}
					result[resIndex++] = value;
				}
				return result;
			}
			LazyWrapper.prototype = baseCreate(baseLodash.prototype);
			LazyWrapper.prototype.constructor = LazyWrapper;
			/**
			* Creates a hash object.
			*
			* @private
			* @constructor
			* @param {Array} [entries] The key-value pairs to cache.
			*/
			function Hash(entries) {
				var index = -1, length = entries == null ? 0 : entries.length;
				this.clear();
				while (++index < length) {
					var entry = entries[index];
					this.set(entry[0], entry[1]);
				}
			}
			/**
			* Removes all key-value entries from the hash.
			*
			* @private
			* @name clear
			* @memberOf Hash
			*/
			function hashClear() {
				this.__data__ = nativeCreate ? nativeCreate(null) : {};
				this.size = 0;
			}
			/**
			* Removes `key` and its value from the hash.
			*
			* @private
			* @name delete
			* @memberOf Hash
			* @param {Object} hash The hash to modify.
			* @param {string} key The key of the value to remove.
			* @returns {boolean} Returns `true` if the entry was removed, else `false`.
			*/
			function hashDelete(key) {
				var result = this.has(key) && delete this.__data__[key];
				this.size -= result ? 1 : 0;
				return result;
			}
			/**
			* Gets the hash value for `key`.
			*
			* @private
			* @name get
			* @memberOf Hash
			* @param {string} key The key of the value to get.
			* @returns {*} Returns the entry value.
			*/
			function hashGet(key) {
				var data = this.__data__;
				if (nativeCreate) {
					var result = data[key];
					return result === HASH_UNDEFINED ? undefined : result;
				}
				return hasOwnProperty.call(data, key) ? data[key] : undefined;
			}
			/**
			* Checks if a hash value for `key` exists.
			*
			* @private
			* @name has
			* @memberOf Hash
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function hashHas(key) {
				var data = this.__data__;
				return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
			}
			/**
			* Sets the hash `key` to `value`.
			*
			* @private
			* @name set
			* @memberOf Hash
			* @param {string} key The key of the value to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns the hash instance.
			*/
			function hashSet(key, value) {
				var data = this.__data__;
				this.size += this.has(key) ? 0 : 1;
				data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
				return this;
			}
			Hash.prototype.clear = hashClear;
			Hash.prototype["delete"] = hashDelete;
			Hash.prototype.get = hashGet;
			Hash.prototype.has = hashHas;
			Hash.prototype.set = hashSet;
			/**
			* Creates an list cache object.
			*
			* @private
			* @constructor
			* @param {Array} [entries] The key-value pairs to cache.
			*/
			function ListCache(entries) {
				var index = -1, length = entries == null ? 0 : entries.length;
				this.clear();
				while (++index < length) {
					var entry = entries[index];
					this.set(entry[0], entry[1]);
				}
			}
			/**
			* Removes all key-value entries from the list cache.
			*
			* @private
			* @name clear
			* @memberOf ListCache
			*/
			function listCacheClear() {
				this.__data__ = [];
				this.size = 0;
			}
			/**
			* Removes `key` and its value from the list cache.
			*
			* @private
			* @name delete
			* @memberOf ListCache
			* @param {string} key The key of the value to remove.
			* @returns {boolean} Returns `true` if the entry was removed, else `false`.
			*/
			function listCacheDelete(key) {
				var data = this.__data__, index = assocIndexOf(data, key);
				if (index < 0) return false;
				if (index == data.length - 1) data.pop();
				else splice.call(data, index, 1);
				--this.size;
				return true;
			}
			/**
			* Gets the list cache value for `key`.
			*
			* @private
			* @name get
			* @memberOf ListCache
			* @param {string} key The key of the value to get.
			* @returns {*} Returns the entry value.
			*/
			function listCacheGet(key) {
				var data = this.__data__, index = assocIndexOf(data, key);
				return index < 0 ? undefined : data[index][1];
			}
			/**
			* Checks if a list cache value for `key` exists.
			*
			* @private
			* @name has
			* @memberOf ListCache
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function listCacheHas(key) {
				return assocIndexOf(this.__data__, key) > -1;
			}
			/**
			* Sets the list cache `key` to `value`.
			*
			* @private
			* @name set
			* @memberOf ListCache
			* @param {string} key The key of the value to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns the list cache instance.
			*/
			function listCacheSet(key, value) {
				var data = this.__data__, index = assocIndexOf(data, key);
				if (index < 0) {
					++this.size;
					data.push([key, value]);
				} else data[index][1] = value;
				return this;
			}
			ListCache.prototype.clear = listCacheClear;
			ListCache.prototype["delete"] = listCacheDelete;
			ListCache.prototype.get = listCacheGet;
			ListCache.prototype.has = listCacheHas;
			ListCache.prototype.set = listCacheSet;
			/**
			* Creates a map cache object to store key-value pairs.
			*
			* @private
			* @constructor
			* @param {Array} [entries] The key-value pairs to cache.
			*/
			function MapCache(entries) {
				var index = -1, length = entries == null ? 0 : entries.length;
				this.clear();
				while (++index < length) {
					var entry = entries[index];
					this.set(entry[0], entry[1]);
				}
			}
			/**
			* Removes all key-value entries from the map.
			*
			* @private
			* @name clear
			* @memberOf MapCache
			*/
			function mapCacheClear() {
				this.size = 0;
				this.__data__ = {
					"hash": new Hash(),
					"map": new (Map || ListCache)(),
					"string": new Hash()
				};
			}
			/**
			* Removes `key` and its value from the map.
			*
			* @private
			* @name delete
			* @memberOf MapCache
			* @param {string} key The key of the value to remove.
			* @returns {boolean} Returns `true` if the entry was removed, else `false`.
			*/
			function mapCacheDelete(key) {
				var result = getMapData(this, key)["delete"](key);
				this.size -= result ? 1 : 0;
				return result;
			}
			/**
			* Gets the map value for `key`.
			*
			* @private
			* @name get
			* @memberOf MapCache
			* @param {string} key The key of the value to get.
			* @returns {*} Returns the entry value.
			*/
			function mapCacheGet(key) {
				return getMapData(this, key).get(key);
			}
			/**
			* Checks if a map value for `key` exists.
			*
			* @private
			* @name has
			* @memberOf MapCache
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function mapCacheHas(key) {
				return getMapData(this, key).has(key);
			}
			/**
			* Sets the map `key` to `value`.
			*
			* @private
			* @name set
			* @memberOf MapCache
			* @param {string} key The key of the value to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns the map cache instance.
			*/
			function mapCacheSet(key, value) {
				var data = getMapData(this, key), size = data.size;
				data.set(key, value);
				this.size += data.size == size ? 0 : 1;
				return this;
			}
			MapCache.prototype.clear = mapCacheClear;
			MapCache.prototype["delete"] = mapCacheDelete;
			MapCache.prototype.get = mapCacheGet;
			MapCache.prototype.has = mapCacheHas;
			MapCache.prototype.set = mapCacheSet;
			/**
			*
			* Creates an array cache object to store unique values.
			*
			* @private
			* @constructor
			* @param {Array} [values] The values to cache.
			*/
			function SetCache(values) {
				var index = -1, length = values == null ? 0 : values.length;
				this.__data__ = new MapCache();
				while (++index < length) this.add(values[index]);
			}
			/**
			* Adds `value` to the array cache.
			*
			* @private
			* @name add
			* @memberOf SetCache
			* @alias push
			* @param {*} value The value to cache.
			* @returns {Object} Returns the cache instance.
			*/
			function setCacheAdd(value) {
				this.__data__.set(value, HASH_UNDEFINED);
				return this;
			}
			/**
			* Checks if `value` is in the array cache.
			*
			* @private
			* @name has
			* @memberOf SetCache
			* @param {*} value The value to search for.
			* @returns {boolean} Returns `true` if `value` is found, else `false`.
			*/
			function setCacheHas(value) {
				return this.__data__.has(value);
			}
			SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
			SetCache.prototype.has = setCacheHas;
			/**
			* Creates a stack cache object to store key-value pairs.
			*
			* @private
			* @constructor
			* @param {Array} [entries] The key-value pairs to cache.
			*/
			function Stack(entries) {
				var data = this.__data__ = new ListCache(entries);
				this.size = data.size;
			}
			/**
			* Removes all key-value entries from the stack.
			*
			* @private
			* @name clear
			* @memberOf Stack
			*/
			function stackClear() {
				this.__data__ = new ListCache();
				this.size = 0;
			}
			/**
			* Removes `key` and its value from the stack.
			*
			* @private
			* @name delete
			* @memberOf Stack
			* @param {string} key The key of the value to remove.
			* @returns {boolean} Returns `true` if the entry was removed, else `false`.
			*/
			function stackDelete(key) {
				var data = this.__data__, result = data["delete"](key);
				this.size = data.size;
				return result;
			}
			/**
			* Gets the stack value for `key`.
			*
			* @private
			* @name get
			* @memberOf Stack
			* @param {string} key The key of the value to get.
			* @returns {*} Returns the entry value.
			*/
			function stackGet(key) {
				return this.__data__.get(key);
			}
			/**
			* Checks if a stack value for `key` exists.
			*
			* @private
			* @name has
			* @memberOf Stack
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function stackHas(key) {
				return this.__data__.has(key);
			}
			/**
			* Sets the stack `key` to `value`.
			*
			* @private
			* @name set
			* @memberOf Stack
			* @param {string} key The key of the value to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns the stack cache instance.
			*/
			function stackSet(key, value) {
				var data = this.__data__;
				if (data instanceof ListCache) {
					var pairs = data.__data__;
					if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
						pairs.push([key, value]);
						this.size = ++data.size;
						return this;
					}
					data = this.__data__ = new MapCache(pairs);
				}
				data.set(key, value);
				this.size = data.size;
				return this;
			}
			Stack.prototype.clear = stackClear;
			Stack.prototype["delete"] = stackDelete;
			Stack.prototype.get = stackGet;
			Stack.prototype.has = stackHas;
			Stack.prototype.set = stackSet;
			/**
			* Creates an array of the enumerable property names of the array-like `value`.
			*
			* @private
			* @param {*} value The value to query.
			* @param {boolean} inherited Specify returning inherited property names.
			* @returns {Array} Returns the array of property names.
			*/
			function arrayLikeKeys(value, inherited) {
				var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
				for (var key in value) if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
				return result;
			}
			/**
			* A specialized version of `_.sample` for arrays.
			*
			* @private
			* @param {Array} array The array to sample.
			* @returns {*} Returns the random element.
			*/
			function arraySample(array) {
				var length = array.length;
				return length ? array[baseRandom(0, length - 1)] : undefined;
			}
			/**
			* A specialized version of `_.sampleSize` for arrays.
			*
			* @private
			* @param {Array} array The array to sample.
			* @param {number} n The number of elements to sample.
			* @returns {Array} Returns the random elements.
			*/
			function arraySampleSize(array, n) {
				return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
			}
			/**
			* A specialized version of `_.shuffle` for arrays.
			*
			* @private
			* @param {Array} array The array to shuffle.
			* @returns {Array} Returns the new shuffled array.
			*/
			function arrayShuffle(array) {
				return shuffleSelf(copyArray(array));
			}
			/**
			* This function is like `assignValue` except that it doesn't assign
			* `undefined` values.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {string} key The key of the property to assign.
			* @param {*} value The value to assign.
			*/
			function assignMergeValue(object, key, value) {
				if (value !== undefined && !eq(object[key], value) || value === undefined && !(key in object)) baseAssignValue(object, key, value);
			}
			/**
			* Assigns `value` to `key` of `object` if the existing value is not equivalent
			* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {string} key The key of the property to assign.
			* @param {*} value The value to assign.
			*/
			function assignValue(object, key, value) {
				var objValue = object[key];
				if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) baseAssignValue(object, key, value);
			}
			/**
			* Gets the index at which the `key` is found in `array` of key-value pairs.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {*} key The key to search for.
			* @returns {number} Returns the index of the matched value, else `-1`.
			*/
			function assocIndexOf(array, key) {
				var length = array.length;
				while (length--) if (eq(array[length][0], key)) return length;
				return -1;
			}
			/**
			* Aggregates elements of `collection` on `accumulator` with keys transformed
			* by `iteratee` and values set by `setter`.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} setter The function to set `accumulator` values.
			* @param {Function} iteratee The iteratee to transform keys.
			* @param {Object} accumulator The initial aggregated object.
			* @returns {Function} Returns `accumulator`.
			*/
			function baseAggregator(collection, setter, iteratee, accumulator) {
				baseEach(collection, function(value, key, collection) {
					setter(accumulator, value, iteratee(value), collection);
				});
				return accumulator;
			}
			/**
			* The base implementation of `_.assign` without support for multiple sources
			* or `customizer` functions.
			*
			* @private
			* @param {Object} object The destination object.
			* @param {Object} source The source object.
			* @returns {Object} Returns `object`.
			*/
			function baseAssign(object, source) {
				return object && copyObject(source, keys(source), object);
			}
			/**
			* The base implementation of `_.assignIn` without support for multiple sources
			* or `customizer` functions.
			*
			* @private
			* @param {Object} object The destination object.
			* @param {Object} source The source object.
			* @returns {Object} Returns `object`.
			*/
			function baseAssignIn(object, source) {
				return object && copyObject(source, keysIn(source), object);
			}
			/**
			* The base implementation of `assignValue` and `assignMergeValue` without
			* value checks.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {string} key The key of the property to assign.
			* @param {*} value The value to assign.
			*/
			function baseAssignValue(object, key, value) {
				if (key == "__proto__" && defineProperty) defineProperty(object, key, {
					"configurable": true,
					"enumerable": true,
					"value": value,
					"writable": true
				});
				else object[key] = value;
			}
			/**
			* The base implementation of `_.at` without support for individual paths.
			*
			* @private
			* @param {Object} object The object to iterate over.
			* @param {string[]} paths The property paths to pick.
			* @returns {Array} Returns the picked elements.
			*/
			function baseAt(object, paths) {
				var index = -1, length = paths.length, result = Array(length), skip = object == null;
				while (++index < length) result[index] = skip ? undefined : get(object, paths[index]);
				return result;
			}
			/**
			* The base implementation of `_.clamp` which doesn't coerce arguments.
			*
			* @private
			* @param {number} number The number to clamp.
			* @param {number} [lower] The lower bound.
			* @param {number} upper The upper bound.
			* @returns {number} Returns the clamped number.
			*/
			function baseClamp(number, lower, upper) {
				if (number === number) {
					if (upper !== undefined) number = number <= upper ? number : upper;
					if (lower !== undefined) number = number >= lower ? number : lower;
				}
				return number;
			}
			/**
			* The base implementation of `_.clone` and `_.cloneDeep` which tracks
			* traversed objects.
			*
			* @private
			* @param {*} value The value to clone.
			* @param {boolean} bitmask The bitmask flags.
			*  1 - Deep clone
			*  2 - Flatten inherited properties
			*  4 - Clone symbols
			* @param {Function} [customizer] The function to customize cloning.
			* @param {string} [key] The key of `value`.
			* @param {Object} [object] The parent object of `value`.
			* @param {Object} [stack] Tracks traversed objects and their clone counterparts.
			* @returns {*} Returns the cloned value.
			*/
			function baseClone(value, bitmask, customizer, key, object, stack) {
				var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
				if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
				if (result !== undefined) return result;
				if (!isObject(value)) return value;
				var isArr = isArray(value);
				if (isArr) {
					result = initCloneArray(value);
					if (!isDeep) return copyArray(value, result);
				} else {
					var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
					if (isBuffer(value)) return cloneBuffer(value, isDeep);
					if (tag == objectTag || tag == argsTag || isFunc && !object) {
						result = isFlat || isFunc ? {} : initCloneObject(value);
						if (!isDeep) return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
					} else {
						if (!cloneableTags[tag]) return object ? value : {};
						result = initCloneByTag(value, tag, isDeep);
					}
				}
				stack || (stack = new Stack());
				var stacked = stack.get(value);
				if (stacked) return stacked;
				stack.set(value, result);
				if (isSet(value)) value.forEach(function(subValue) {
					result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
				});
				else if (isMap(value)) value.forEach(function(subValue, key) {
					result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
				});
				var props = isArr ? undefined : (isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys)(value);
				arrayEach(props || value, function(subValue, key) {
					if (props) {
						key = subValue;
						subValue = value[key];
					}
					assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
				});
				return result;
			}
			/**
			* The base implementation of `_.conforms` which doesn't clone `source`.
			*
			* @private
			* @param {Object} source The object of property predicates to conform to.
			* @returns {Function} Returns the new spec function.
			*/
			function baseConforms(source) {
				var props = keys(source);
				return function(object) {
					return baseConformsTo(object, source, props);
				};
			}
			/**
			* The base implementation of `_.conformsTo` which accepts `props` to check.
			*
			* @private
			* @param {Object} object The object to inspect.
			* @param {Object} source The object of property predicates to conform to.
			* @returns {boolean} Returns `true` if `object` conforms, else `false`.
			*/
			function baseConformsTo(object, source, props) {
				var length = props.length;
				if (object == null) return !length;
				object = Object(object);
				while (length--) {
					var key = props[length], predicate = source[key], value = object[key];
					if (value === undefined && !(key in object) || !predicate(value)) return false;
				}
				return true;
			}
			/**
			* The base implementation of `_.delay` and `_.defer` which accepts `args`
			* to provide to `func`.
			*
			* @private
			* @param {Function} func The function to delay.
			* @param {number} wait The number of milliseconds to delay invocation.
			* @param {Array} args The arguments to provide to `func`.
			* @returns {number|Object} Returns the timer id or timeout object.
			*/
			function baseDelay(func, wait, args) {
				if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				return setTimeout(function() {
					func.apply(undefined, args);
				}, wait);
			}
			/**
			* The base implementation of methods like `_.difference` without support
			* for excluding multiple arrays or iteratee shorthands.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {Array} values The values to exclude.
			* @param {Function} [iteratee] The iteratee invoked per element.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new array of filtered values.
			*/
			function baseDifference(array, values, iteratee, comparator) {
				var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
				if (!length) return result;
				if (iteratee) values = arrayMap(values, baseUnary(iteratee));
				if (comparator) {
					includes = arrayIncludesWith;
					isCommon = false;
				} else if (values.length >= LARGE_ARRAY_SIZE) {
					includes = cacheHas;
					isCommon = false;
					values = new SetCache(values);
				}
				outer: while (++index < length) {
					var value = array[index], computed = iteratee == null ? value : iteratee(value);
					value = comparator || value !== 0 ? value : 0;
					if (isCommon && computed === computed) {
						var valuesIndex = valuesLength;
						while (valuesIndex--) if (values[valuesIndex] === computed) continue outer;
						result.push(value);
					} else if (!includes(values, computed, comparator)) result.push(value);
				}
				return result;
			}
			/**
			* The base implementation of `_.forEach` without support for iteratee shorthands.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array|Object} Returns `collection`.
			*/
			var baseEach = createBaseEach(baseForOwn);
			/**
			* The base implementation of `_.forEachRight` without support for iteratee shorthands.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array|Object} Returns `collection`.
			*/
			var baseEachRight = createBaseEach(baseForOwnRight, true);
			/**
			* The base implementation of `_.every` without support for iteratee shorthands.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} predicate The function invoked per iteration.
			* @returns {boolean} Returns `true` if all elements pass the predicate check,
			*  else `false`
			*/
			function baseEvery(collection, predicate) {
				var result = true;
				baseEach(collection, function(value, index, collection) {
					result = !!predicate(value, index, collection);
					return result;
				});
				return result;
			}
			/**
			* The base implementation of methods like `_.max` and `_.min` which accepts a
			* `comparator` to determine the extremum value.
			*
			* @private
			* @param {Array} array The array to iterate over.
			* @param {Function} iteratee The iteratee invoked per iteration.
			* @param {Function} comparator The comparator used to compare values.
			* @returns {*} Returns the extremum value.
			*/
			function baseExtremum(array, iteratee, comparator) {
				var index = -1, length = array.length;
				while (++index < length) {
					var value = array[index], current = iteratee(value);
					if (current != null && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) var computed = current, result = value;
				}
				return result;
			}
			/**
			* The base implementation of `_.fill` without an iteratee call guard.
			*
			* @private
			* @param {Array} array The array to fill.
			* @param {*} value The value to fill `array` with.
			* @param {number} [start=0] The start position.
			* @param {number} [end=array.length] The end position.
			* @returns {Array} Returns `array`.
			*/
			function baseFill(array, value, start, end) {
				var length = array.length;
				start = toInteger(start);
				if (start < 0) start = -start > length ? 0 : length + start;
				end = end === undefined || end > length ? length : toInteger(end);
				if (end < 0) end += length;
				end = start > end ? 0 : toLength(end);
				while (start < end) array[start++] = value;
				return array;
			}
			/**
			* The base implementation of `_.filter` without support for iteratee shorthands.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} predicate The function invoked per iteration.
			* @returns {Array} Returns the new filtered array.
			*/
			function baseFilter(collection, predicate) {
				var result = [];
				baseEach(collection, function(value, index, collection) {
					if (predicate(value, index, collection)) result.push(value);
				});
				return result;
			}
			/**
			* The base implementation of `_.flatten` with support for restricting flattening.
			*
			* @private
			* @param {Array} array The array to flatten.
			* @param {number} depth The maximum recursion depth.
			* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
			* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
			* @param {Array} [result=[]] The initial result value.
			* @returns {Array} Returns the new flattened array.
			*/
			function baseFlatten(array, depth, predicate, isStrict, result) {
				var index = -1, length = array.length;
				predicate || (predicate = isFlattenable);
				result || (result = []);
				while (++index < length) {
					var value = array[index];
					if (depth > 0 && predicate(value)) if (depth > 1) baseFlatten(value, depth - 1, predicate, isStrict, result);
					else arrayPush(result, value);
					else if (!isStrict) result[result.length] = value;
				}
				return result;
			}
			/**
			* The base implementation of `baseForOwn` which iterates over `object`
			* properties returned by `keysFunc` and invokes `iteratee` for each property.
			* Iteratee functions may exit iteration early by explicitly returning `false`.
			*
			* @private
			* @param {Object} object The object to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @param {Function} keysFunc The function to get the keys of `object`.
			* @returns {Object} Returns `object`.
			*/
			var baseFor = createBaseFor();
			/**
			* This function is like `baseFor` except that it iterates over properties
			* in the opposite order.
			*
			* @private
			* @param {Object} object The object to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @param {Function} keysFunc The function to get the keys of `object`.
			* @returns {Object} Returns `object`.
			*/
			var baseForRight = createBaseFor(true);
			/**
			* The base implementation of `_.forOwn` without support for iteratee shorthands.
			*
			* @private
			* @param {Object} object The object to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Object} Returns `object`.
			*/
			function baseForOwn(object, iteratee) {
				return object && baseFor(object, iteratee, keys);
			}
			/**
			* The base implementation of `_.forOwnRight` without support for iteratee shorthands.
			*
			* @private
			* @param {Object} object The object to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Object} Returns `object`.
			*/
			function baseForOwnRight(object, iteratee) {
				return object && baseForRight(object, iteratee, keys);
			}
			/**
			* The base implementation of `_.functions` which creates an array of
			* `object` function property names filtered from `props`.
			*
			* @private
			* @param {Object} object The object to inspect.
			* @param {Array} props The property names to filter.
			* @returns {Array} Returns the function names.
			*/
			function baseFunctions(object, props) {
				return arrayFilter(props, function(key) {
					return isFunction(object[key]);
				});
			}
			/**
			* The base implementation of `_.get` without support for default values.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Array|string} path The path of the property to get.
			* @returns {*} Returns the resolved value.
			*/
			function baseGet(object, path) {
				path = castPath(path, object);
				var index = 0, length = path.length;
				while (object != null && index < length) object = object[toKey(path[index++])];
				return index && index == length ? object : undefined;
			}
			/**
			* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
			* `keysFunc` and `symbolsFunc` to get the enumerable property names and
			* symbols of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Function} keysFunc The function to get the keys of `object`.
			* @param {Function} symbolsFunc The function to get the symbols of `object`.
			* @returns {Array} Returns the array of property names and symbols.
			*/
			function baseGetAllKeys(object, keysFunc, symbolsFunc) {
				var result = keysFunc(object);
				return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
			}
			/**
			* The base implementation of `getTag` without fallbacks for buggy environments.
			*
			* @private
			* @param {*} value The value to query.
			* @returns {string} Returns the `toStringTag`.
			*/
			function baseGetTag(value) {
				if (value == null) return value === undefined ? undefinedTag : nullTag;
				return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
			}
			/**
			* The base implementation of `_.gt` which doesn't coerce arguments.
			*
			* @private
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if `value` is greater than `other`,
			*  else `false`.
			*/
			function baseGt(value, other) {
				return value > other;
			}
			/**
			* The base implementation of `_.has` without support for deep paths.
			*
			* @private
			* @param {Object} [object] The object to query.
			* @param {Array|string} key The key to check.
			* @returns {boolean} Returns `true` if `key` exists, else `false`.
			*/
			function baseHas(object, key) {
				return object != null && hasOwnProperty.call(object, key);
			}
			/**
			* The base implementation of `_.hasIn` without support for deep paths.
			*
			* @private
			* @param {Object} [object] The object to query.
			* @param {Array|string} key The key to check.
			* @returns {boolean} Returns `true` if `key` exists, else `false`.
			*/
			function baseHasIn(object, key) {
				return object != null && key in Object(object);
			}
			/**
			* The base implementation of `_.inRange` which doesn't coerce arguments.
			*
			* @private
			* @param {number} number The number to check.
			* @param {number} start The start of the range.
			* @param {number} end The end of the range.
			* @returns {boolean} Returns `true` if `number` is in the range, else `false`.
			*/
			function baseInRange(number, start, end) {
				return number >= nativeMin(start, end) && number < nativeMax(start, end);
			}
			/**
			* The base implementation of methods like `_.intersection`, without support
			* for iteratee shorthands, that accepts an array of arrays to inspect.
			*
			* @private
			* @param {Array} arrays The arrays to inspect.
			* @param {Function} [iteratee] The iteratee invoked per element.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new array of shared values.
			*/
			function baseIntersection(arrays, iteratee, comparator) {
				var includes = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = Infinity, result = [];
				while (othIndex--) {
					var array = arrays[othIndex];
					if (othIndex && iteratee) array = arrayMap(array, baseUnary(iteratee));
					maxLength = nativeMin(array.length, maxLength);
					caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined;
				}
				array = arrays[0];
				var index = -1, seen = caches[0];
				outer: while (++index < length && result.length < maxLength) {
					var value = array[index], computed = iteratee ? iteratee(value) : value;
					value = comparator || value !== 0 ? value : 0;
					if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
						othIndex = othLength;
						while (--othIndex) {
							var cache = caches[othIndex];
							if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) continue outer;
						}
						if (seen) seen.push(computed);
						result.push(value);
					}
				}
				return result;
			}
			/**
			* The base implementation of `_.invert` and `_.invertBy` which inverts
			* `object` with values transformed by `iteratee` and set by `setter`.
			*
			* @private
			* @param {Object} object The object to iterate over.
			* @param {Function} setter The function to set `accumulator` values.
			* @param {Function} iteratee The iteratee to transform values.
			* @param {Object} accumulator The initial inverted object.
			* @returns {Function} Returns `accumulator`.
			*/
			function baseInverter(object, setter, iteratee, accumulator) {
				baseForOwn(object, function(value, key, object) {
					setter(accumulator, iteratee(value), key, object);
				});
				return accumulator;
			}
			/**
			* The base implementation of `_.invoke` without support for individual
			* method arguments.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Array|string} path The path of the method to invoke.
			* @param {Array} args The arguments to invoke the method with.
			* @returns {*} Returns the result of the invoked method.
			*/
			function baseInvoke(object, path, args) {
				path = castPath(path, object);
				object = parent(object, path);
				var func = object == null ? object : object[toKey(last(path))];
				return func == null ? undefined : apply(func, object, args);
			}
			/**
			* The base implementation of `_.isArguments`.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an `arguments` object,
			*/
			function baseIsArguments(value) {
				return isObjectLike(value) && baseGetTag(value) == argsTag;
			}
			/**
			* The base implementation of `_.isArrayBuffer` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
			*/
			function baseIsArrayBuffer(value) {
				return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
			}
			/**
			* The base implementation of `_.isDate` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a date object, else `false`.
			*/
			function baseIsDate(value) {
				return isObjectLike(value) && baseGetTag(value) == dateTag;
			}
			/**
			* The base implementation of `_.isEqual` which supports partial comparisons
			* and tracks traversed objects.
			*
			* @private
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @param {boolean} bitmask The bitmask flags.
			*  1 - Unordered comparison
			*  2 - Partial comparison
			* @param {Function} [customizer] The function to customize comparisons.
			* @param {Object} [stack] Tracks traversed `value` and `other` objects.
			* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
			*/
			function baseIsEqual(value, other, bitmask, customizer, stack) {
				if (value === other) return true;
				if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
				return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
			}
			/**
			* A specialized version of `baseIsEqual` for arrays and objects which performs
			* deep comparisons and tracks traversed objects enabling objects with circular
			* references to be compared.
			*
			* @private
			* @param {Object} object The object to compare.
			* @param {Object} other The other object to compare.
			* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
			* @param {Function} customizer The function to customize comparisons.
			* @param {Function} equalFunc The function to determine equivalents of values.
			* @param {Object} [stack] Tracks traversed `object` and `other` objects.
			* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
			*/
			function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
				var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
				objTag = objTag == argsTag ? objectTag : objTag;
				othTag = othTag == argsTag ? objectTag : othTag;
				var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
				if (isSameTag && isBuffer(object)) {
					if (!isBuffer(other)) return false;
					objIsArr = true;
					objIsObj = false;
				}
				if (isSameTag && !objIsObj) {
					stack || (stack = new Stack());
					return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
				}
				if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
					var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
					if (objIsWrapped || othIsWrapped) {
						var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
						stack || (stack = new Stack());
						return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
					}
				}
				if (!isSameTag) return false;
				stack || (stack = new Stack());
				return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
			}
			/**
			* The base implementation of `_.isMap` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a map, else `false`.
			*/
			function baseIsMap(value) {
				return isObjectLike(value) && getTag(value) == mapTag;
			}
			/**
			* The base implementation of `_.isMatch` without support for iteratee shorthands.
			*
			* @private
			* @param {Object} object The object to inspect.
			* @param {Object} source The object of property values to match.
			* @param {Array} matchData The property names, values, and compare flags to match.
			* @param {Function} [customizer] The function to customize comparisons.
			* @returns {boolean} Returns `true` if `object` is a match, else `false`.
			*/
			function baseIsMatch(object, source, matchData, customizer) {
				var index = matchData.length, length = index, noCustomizer = !customizer;
				if (object == null) return !length;
				object = Object(object);
				while (index--) {
					var data = matchData[index];
					if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
				}
				while (++index < length) {
					data = matchData[index];
					var key = data[0], objValue = object[key], srcValue = data[1];
					if (noCustomizer && data[2]) {
						if (objValue === undefined && !(key in object)) return false;
					} else {
						var stack = new Stack();
						if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
						if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) return false;
					}
				}
				return true;
			}
			/**
			* The base implementation of `_.isNative` without bad shim checks.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a native function,
			*  else `false`.
			*/
			function baseIsNative(value) {
				if (!isObject(value) || isMasked(value)) return false;
				return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
			}
			/**
			* The base implementation of `_.isRegExp` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
			*/
			function baseIsRegExp(value) {
				return isObjectLike(value) && baseGetTag(value) == regexpTag;
			}
			/**
			* The base implementation of `_.isSet` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a set, else `false`.
			*/
			function baseIsSet(value) {
				return isObjectLike(value) && getTag(value) == setTag;
			}
			/**
			* The base implementation of `_.isTypedArray` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
			*/
			function baseIsTypedArray(value) {
				return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
			}
			/**
			* The base implementation of `_.iteratee`.
			*
			* @private
			* @param {*} [value=_.identity] The value to convert to an iteratee.
			* @returns {Function} Returns the iteratee.
			*/
			function baseIteratee(value) {
				if (typeof value == "function") return value;
				if (value == null) return identity;
				if (typeof value == "object") return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
				return property(value);
			}
			/**
			* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			*/
			function baseKeys(object) {
				if (!isPrototype(object)) return nativeKeys(object);
				var result = [];
				for (var key in Object(object)) if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
				return result;
			}
			/**
			* The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			*/
			function baseKeysIn(object) {
				if (!isObject(object)) return nativeKeysIn(object);
				var isProto = isPrototype(object), result = [];
				for (var key in object) if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) result.push(key);
				return result;
			}
			/**
			* The base implementation of `_.lt` which doesn't coerce arguments.
			*
			* @private
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if `value` is less than `other`,
			*  else `false`.
			*/
			function baseLt(value, other) {
				return value < other;
			}
			/**
			* The base implementation of `_.map` without support for iteratee shorthands.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array} Returns the new mapped array.
			*/
			function baseMap(collection, iteratee) {
				var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
				baseEach(collection, function(value, key, collection) {
					result[++index] = iteratee(value, key, collection);
				});
				return result;
			}
			/**
			* The base implementation of `_.matches` which doesn't clone `source`.
			*
			* @private
			* @param {Object} source The object of property values to match.
			* @returns {Function} Returns the new spec function.
			*/
			function baseMatches(source) {
				var matchData = getMatchData(source);
				if (matchData.length == 1 && matchData[0][2]) return matchesStrictComparable(matchData[0][0], matchData[0][1]);
				return function(object) {
					return object === source || baseIsMatch(object, source, matchData);
				};
			}
			/**
			* The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
			*
			* @private
			* @param {string} path The path of the property to get.
			* @param {*} srcValue The value to match.
			* @returns {Function} Returns the new spec function.
			*/
			function baseMatchesProperty(path, srcValue) {
				if (isKey(path) && isStrictComparable(srcValue)) return matchesStrictComparable(toKey(path), srcValue);
				return function(object) {
					var objValue = get(object, path);
					return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
				};
			}
			/**
			* The base implementation of `_.merge` without support for multiple sources.
			*
			* @private
			* @param {Object} object The destination object.
			* @param {Object} source The source object.
			* @param {number} srcIndex The index of `source`.
			* @param {Function} [customizer] The function to customize merged values.
			* @param {Object} [stack] Tracks traversed source values and their merged
			*  counterparts.
			*/
			function baseMerge(object, source, srcIndex, customizer, stack) {
				if (object === source) return;
				baseFor(source, function(srcValue, key) {
					stack || (stack = new Stack());
					if (isObject(srcValue)) baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
					else {
						var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined;
						if (newValue === undefined) newValue = srcValue;
						assignMergeValue(object, key, newValue);
					}
				}, keysIn);
			}
			/**
			* A specialized version of `baseMerge` for arrays and objects which performs
			* deep merges and tracks traversed objects enabling objects with circular
			* references to be merged.
			*
			* @private
			* @param {Object} object The destination object.
			* @param {Object} source The source object.
			* @param {string} key The key of the value to merge.
			* @param {number} srcIndex The index of `source`.
			* @param {Function} mergeFunc The function to merge values.
			* @param {Function} [customizer] The function to customize assigned values.
			* @param {Object} [stack] Tracks traversed source values and their merged
			*  counterparts.
			*/
			function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
				var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
				if (stacked) {
					assignMergeValue(object, key, stacked);
					return;
				}
				var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined;
				var isCommon = newValue === undefined;
				if (isCommon) {
					var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
					newValue = srcValue;
					if (isArr || isBuff || isTyped) if (isArray(objValue)) newValue = objValue;
					else if (isArrayLikeObject(objValue)) newValue = copyArray(objValue);
					else if (isBuff) {
						isCommon = false;
						newValue = cloneBuffer(srcValue, true);
					} else if (isTyped) {
						isCommon = false;
						newValue = cloneTypedArray(srcValue, true);
					} else newValue = [];
					else if (isPlainObject(srcValue) || isArguments(srcValue)) {
						newValue = objValue;
						if (isArguments(objValue)) newValue = toPlainObject(objValue);
						else if (!isObject(objValue) || isFunction(objValue)) newValue = initCloneObject(srcValue);
					} else isCommon = false;
				}
				if (isCommon) {
					stack.set(srcValue, newValue);
					mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
					stack["delete"](srcValue);
				}
				assignMergeValue(object, key, newValue);
			}
			/**
			* The base implementation of `_.nth` which doesn't coerce arguments.
			*
			* @private
			* @param {Array} array The array to query.
			* @param {number} n The index of the element to return.
			* @returns {*} Returns the nth element of `array`.
			*/
			function baseNth(array, n) {
				var length = array.length;
				if (!length) return;
				n += n < 0 ? length : 0;
				return isIndex(n, length) ? array[n] : undefined;
			}
			/**
			* The base implementation of `_.orderBy` without param guards.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
			* @param {string[]} orders The sort orders of `iteratees`.
			* @returns {Array} Returns the new sorted array.
			*/
			function baseOrderBy(collection, iteratees, orders) {
				if (iteratees.length) iteratees = arrayMap(iteratees, function(iteratee) {
					if (isArray(iteratee)) return function(value) {
						return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
					};
					return iteratee;
				});
				else iteratees = [identity];
				var index = -1;
				iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
				return baseSortBy(baseMap(collection, function(value, key, collection) {
					return {
						"criteria": arrayMap(iteratees, function(iteratee) {
							return iteratee(value);
						}),
						"index": ++index,
						"value": value
					};
				}), function(object, other) {
					return compareMultiple(object, other, orders);
				});
			}
			/**
			* The base implementation of `_.pick` without support for individual
			* property identifiers.
			*
			* @private
			* @param {Object} object The source object.
			* @param {string[]} paths The property paths to pick.
			* @returns {Object} Returns the new object.
			*/
			function basePick(object, paths) {
				return basePickBy(object, paths, function(value, path) {
					return hasIn(object, path);
				});
			}
			/**
			* The base implementation of  `_.pickBy` without support for iteratee shorthands.
			*
			* @private
			* @param {Object} object The source object.
			* @param {string[]} paths The property paths to pick.
			* @param {Function} predicate The function invoked per property.
			* @returns {Object} Returns the new object.
			*/
			function basePickBy(object, paths, predicate) {
				var index = -1, length = paths.length, result = {};
				while (++index < length) {
					var path = paths[index], value = baseGet(object, path);
					if (predicate(value, path)) baseSet(result, castPath(path, object), value);
				}
				return result;
			}
			/**
			* A specialized version of `baseProperty` which supports deep paths.
			*
			* @private
			* @param {Array|string} path The path of the property to get.
			* @returns {Function} Returns the new accessor function.
			*/
			function basePropertyDeep(path) {
				return function(object) {
					return baseGet(object, path);
				};
			}
			/**
			* The base implementation of `_.pullAllBy` without support for iteratee
			* shorthands.
			*
			* @private
			* @param {Array} array The array to modify.
			* @param {Array} values The values to remove.
			* @param {Function} [iteratee] The iteratee invoked per element.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns `array`.
			*/
			function basePullAll(array, values, iteratee, comparator) {
				var indexOf = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values.length, seen = array;
				if (array === values) values = copyArray(values);
				if (iteratee) seen = arrayMap(array, baseUnary(iteratee));
				while (++index < length) {
					var fromIndex = 0, value = values[index], computed = iteratee ? iteratee(value) : value;
					while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
						if (seen !== array) splice.call(seen, fromIndex, 1);
						splice.call(array, fromIndex, 1);
					}
				}
				return array;
			}
			/**
			* The base implementation of `_.pullAt` without support for individual
			* indexes or capturing the removed elements.
			*
			* @private
			* @param {Array} array The array to modify.
			* @param {number[]} indexes The indexes of elements to remove.
			* @returns {Array} Returns `array`.
			*/
			function basePullAt(array, indexes) {
				var length = array ? indexes.length : 0, lastIndex = length - 1;
				while (length--) {
					var index = indexes[length];
					if (length == lastIndex || index !== previous) {
						var previous = index;
						if (isIndex(index)) splice.call(array, index, 1);
						else baseUnset(array, index);
					}
				}
				return array;
			}
			/**
			* The base implementation of `_.random` without support for returning
			* floating-point numbers.
			*
			* @private
			* @param {number} lower The lower bound.
			* @param {number} upper The upper bound.
			* @returns {number} Returns the random number.
			*/
			function baseRandom(lower, upper) {
				return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
			}
			/**
			* The base implementation of `_.range` and `_.rangeRight` which doesn't
			* coerce arguments.
			*
			* @private
			* @param {number} start The start of the range.
			* @param {number} end The end of the range.
			* @param {number} step The value to increment or decrement by.
			* @param {boolean} [fromRight] Specify iterating from right to left.
			* @returns {Array} Returns the range of numbers.
			*/
			function baseRange(start, end, step, fromRight) {
				var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
				while (length--) {
					result[fromRight ? length : ++index] = start;
					start += step;
				}
				return result;
			}
			/**
			* The base implementation of `_.repeat` which doesn't coerce arguments.
			*
			* @private
			* @param {string} string The string to repeat.
			* @param {number} n The number of times to repeat the string.
			* @returns {string} Returns the repeated string.
			*/
			function baseRepeat(string, n) {
				var result = "";
				if (!string || n < 1 || n > MAX_SAFE_INTEGER) return result;
				do {
					if (n % 2) result += string;
					n = nativeFloor(n / 2);
					if (n) string += string;
				} while (n);
				return result;
			}
			/**
			* The base implementation of `_.rest` which doesn't validate or coerce arguments.
			*
			* @private
			* @param {Function} func The function to apply a rest parameter to.
			* @param {number} [start=func.length-1] The start position of the rest parameter.
			* @returns {Function} Returns the new function.
			*/
			function baseRest(func, start) {
				return setToString(overRest(func, start, identity), func + "");
			}
			/**
			* The base implementation of `_.sample`.
			*
			* @private
			* @param {Array|Object} collection The collection to sample.
			* @returns {*} Returns the random element.
			*/
			function baseSample(collection) {
				return arraySample(values(collection));
			}
			/**
			* The base implementation of `_.sampleSize` without param guards.
			*
			* @private
			* @param {Array|Object} collection The collection to sample.
			* @param {number} n The number of elements to sample.
			* @returns {Array} Returns the random elements.
			*/
			function baseSampleSize(collection, n) {
				var array = values(collection);
				return shuffleSelf(array, baseClamp(n, 0, array.length));
			}
			/**
			* The base implementation of `_.set`.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {Array|string} path The path of the property to set.
			* @param {*} value The value to set.
			* @param {Function} [customizer] The function to customize path creation.
			* @returns {Object} Returns `object`.
			*/
			function baseSet(object, path, value, customizer) {
				if (!isObject(object)) return object;
				path = castPath(path, object);
				var index = -1, length = path.length, lastIndex = length - 1, nested = object;
				while (nested != null && ++index < length) {
					var key = toKey(path[index]), newValue = value;
					if (key === "__proto__" || key === "constructor" || key === "prototype") return object;
					if (index != lastIndex) {
						var objValue = nested[key];
						newValue = customizer ? customizer(objValue, key, nested) : undefined;
						if (newValue === undefined) newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
					}
					assignValue(nested, key, newValue);
					nested = nested[key];
				}
				return object;
			}
			/**
			* The base implementation of `setData` without support for hot loop shorting.
			*
			* @private
			* @param {Function} func The function to associate metadata with.
			* @param {*} data The metadata.
			* @returns {Function} Returns `func`.
			*/
			var baseSetData = !metaMap ? identity : function(func, data) {
				metaMap.set(func, data);
				return func;
			};
			/**
			* The base implementation of `setToString` without support for hot loop shorting.
			*
			* @private
			* @param {Function} func The function to modify.
			* @param {Function} string The `toString` result.
			* @returns {Function} Returns `func`.
			*/
			var baseSetToString = !defineProperty ? identity : function(func, string) {
				return defineProperty(func, "toString", {
					"configurable": true,
					"enumerable": false,
					"value": constant(string),
					"writable": true
				});
			};
			/**
			* The base implementation of `_.shuffle`.
			*
			* @private
			* @param {Array|Object} collection The collection to shuffle.
			* @returns {Array} Returns the new shuffled array.
			*/
			function baseShuffle(collection) {
				return shuffleSelf(values(collection));
			}
			/**
			* The base implementation of `_.slice` without an iteratee call guard.
			*
			* @private
			* @param {Array} array The array to slice.
			* @param {number} [start=0] The start position.
			* @param {number} [end=array.length] The end position.
			* @returns {Array} Returns the slice of `array`.
			*/
			function baseSlice(array, start, end) {
				var index = -1, length = array.length;
				if (start < 0) start = -start > length ? 0 : length + start;
				end = end > length ? length : end;
				if (end < 0) end += length;
				length = start > end ? 0 : end - start >>> 0;
				start >>>= 0;
				var result = Array(length);
				while (++index < length) result[index] = array[index + start];
				return result;
			}
			/**
			* The base implementation of `_.some` without support for iteratee shorthands.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} predicate The function invoked per iteration.
			* @returns {boolean} Returns `true` if any element passes the predicate check,
			*  else `false`.
			*/
			function baseSome(collection, predicate) {
				var result;
				baseEach(collection, function(value, index, collection) {
					result = predicate(value, index, collection);
					return !result;
				});
				return !!result;
			}
			/**
			* The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
			* performs a binary search of `array` to determine the index at which `value`
			* should be inserted into `array` in order to maintain its sort order.
			*
			* @private
			* @param {Array} array The sorted array to inspect.
			* @param {*} value The value to evaluate.
			* @param {boolean} [retHighest] Specify returning the highest qualified index.
			* @returns {number} Returns the index at which `value` should be inserted
			*  into `array`.
			*/
			function baseSortedIndex(array, value, retHighest) {
				var low = 0, high = array == null ? low : array.length;
				if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
					while (low < high) {
						var mid = low + high >>> 1, computed = array[mid];
						if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) low = mid + 1;
						else high = mid;
					}
					return high;
				}
				return baseSortedIndexBy(array, value, identity, retHighest);
			}
			/**
			* The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
			* which invokes `iteratee` for `value` and each element of `array` to compute
			* their sort ranking. The iteratee is invoked with one argument; (value).
			*
			* @private
			* @param {Array} array The sorted array to inspect.
			* @param {*} value The value to evaluate.
			* @param {Function} iteratee The iteratee invoked per element.
			* @param {boolean} [retHighest] Specify returning the highest qualified index.
			* @returns {number} Returns the index at which `value` should be inserted
			*  into `array`.
			*/
			function baseSortedIndexBy(array, value, iteratee, retHighest) {
				var low = 0, high = array == null ? 0 : array.length;
				if (high === 0) return 0;
				value = iteratee(value);
				var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined;
				while (low < high) {
					var mid = nativeFloor((low + high) / 2), computed = iteratee(array[mid]), othIsDefined = computed !== undefined, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
					if (valIsNaN) var setLow = retHighest || othIsReflexive;
					else if (valIsUndefined) setLow = othIsReflexive && (retHighest || othIsDefined);
					else if (valIsNull) setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
					else if (valIsSymbol) setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
					else if (othIsNull || othIsSymbol) setLow = false;
					else setLow = retHighest ? computed <= value : computed < value;
					if (setLow) low = mid + 1;
					else high = mid;
				}
				return nativeMin(high, MAX_ARRAY_INDEX);
			}
			/**
			* The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
			* support for iteratee shorthands.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {Function} [iteratee] The iteratee invoked per element.
			* @returns {Array} Returns the new duplicate free array.
			*/
			function baseSortedUniq(array, iteratee) {
				var index = -1, length = array.length, resIndex = 0, result = [];
				while (++index < length) {
					var value = array[index], computed = iteratee ? iteratee(value) : value;
					if (!index || !eq(computed, seen)) {
						var seen = computed;
						result[resIndex++] = value === 0 ? 0 : value;
					}
				}
				return result;
			}
			/**
			* The base implementation of `_.toNumber` which doesn't ensure correct
			* conversions of binary, hexadecimal, or octal string values.
			*
			* @private
			* @param {*} value The value to process.
			* @returns {number} Returns the number.
			*/
			function baseToNumber(value) {
				if (typeof value == "number") return value;
				if (isSymbol(value)) return NAN;
				return +value;
			}
			/**
			* The base implementation of `_.toString` which doesn't convert nullish
			* values to empty strings.
			*
			* @private
			* @param {*} value The value to process.
			* @returns {string} Returns the string.
			*/
			function baseToString(value) {
				if (typeof value == "string") return value;
				if (isArray(value)) return arrayMap(value, baseToString) + "";
				if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
				var result = value + "";
				return result == "0" && 1 / value == -INFINITY ? "-0" : result;
			}
			/**
			* The base implementation of `_.uniqBy` without support for iteratee shorthands.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {Function} [iteratee] The iteratee invoked per element.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new duplicate free array.
			*/
			function baseUniq(array, iteratee, comparator) {
				var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
				if (comparator) {
					isCommon = false;
					includes = arrayIncludesWith;
				} else if (length >= LARGE_ARRAY_SIZE) {
					var set = iteratee ? null : createSet(array);
					if (set) return setToArray(set);
					isCommon = false;
					includes = cacheHas;
					seen = new SetCache();
				} else seen = iteratee ? [] : result;
				outer: while (++index < length) {
					var value = array[index], computed = iteratee ? iteratee(value) : value;
					value = comparator || value !== 0 ? value : 0;
					if (isCommon && computed === computed) {
						var seenIndex = seen.length;
						while (seenIndex--) if (seen[seenIndex] === computed) continue outer;
						if (iteratee) seen.push(computed);
						result.push(value);
					} else if (!includes(seen, computed, comparator)) {
						if (seen !== result) seen.push(computed);
						result.push(value);
					}
				}
				return result;
			}
			/**
			* The base implementation of `_.unset`.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {Array|string} path The property path to unset.
			* @returns {boolean} Returns `true` if the property is deleted, else `false`.
			*/
			function baseUnset(object, path) {
				path = castPath(path, object);
				var index = -1, length = path.length;
				if (!length) return true;
				while (++index < length) {
					var key = toKey(path[index]);
					if (key === "__proto__" && !hasOwnProperty.call(object, "__proto__")) return false;
					if ((key === "constructor" || key === "prototype") && index < length - 1) return false;
				}
				var obj = parent(object, path);
				return obj == null || delete obj[toKey(last(path))];
			}
			/**
			* The base implementation of `_.update`.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {Array|string} path The path of the property to update.
			* @param {Function} updater The function to produce the updated value.
			* @param {Function} [customizer] The function to customize path creation.
			* @returns {Object} Returns `object`.
			*/
			function baseUpdate(object, path, updater, customizer) {
				return baseSet(object, path, updater(baseGet(object, path)), customizer);
			}
			/**
			* The base implementation of methods like `_.dropWhile` and `_.takeWhile`
			* without support for iteratee shorthands.
			*
			* @private
			* @param {Array} array The array to query.
			* @param {Function} predicate The function invoked per iteration.
			* @param {boolean} [isDrop] Specify dropping elements instead of taking them.
			* @param {boolean} [fromRight] Specify iterating from right to left.
			* @returns {Array} Returns the slice of `array`.
			*/
			function baseWhile(array, predicate, isDrop, fromRight) {
				var length = array.length, index = fromRight ? length : -1;
				while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array));
				return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
			}
			/**
			* The base implementation of `wrapperValue` which returns the result of
			* performing a sequence of actions on the unwrapped `value`, where each
			* successive action is supplied the return value of the previous.
			*
			* @private
			* @param {*} value The unwrapped value.
			* @param {Array} actions Actions to perform to resolve the unwrapped value.
			* @returns {*} Returns the resolved value.
			*/
			function baseWrapperValue(value, actions) {
				var result = value;
				if (result instanceof LazyWrapper) result = result.value();
				return arrayReduce(actions, function(result, action) {
					return action.func.apply(action.thisArg, arrayPush([result], action.args));
				}, result);
			}
			/**
			* The base implementation of methods like `_.xor`, without support for
			* iteratee shorthands, that accepts an array of arrays to inspect.
			*
			* @private
			* @param {Array} arrays The arrays to inspect.
			* @param {Function} [iteratee] The iteratee invoked per element.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new array of values.
			*/
			function baseXor(arrays, iteratee, comparator) {
				var length = arrays.length;
				if (length < 2) return length ? baseUniq(arrays[0]) : [];
				var index = -1, result = Array(length);
				while (++index < length) {
					var array = arrays[index], othIndex = -1;
					while (++othIndex < length) if (othIndex != index) result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
				}
				return baseUniq(baseFlatten(result, 1), iteratee, comparator);
			}
			/**
			* This base implementation of `_.zipObject` which assigns values using `assignFunc`.
			*
			* @private
			* @param {Array} props The property identifiers.
			* @param {Array} values The property values.
			* @param {Function} assignFunc The function to assign values.
			* @returns {Object} Returns the new object.
			*/
			function baseZipObject(props, values, assignFunc) {
				var index = -1, length = props.length, valsLength = values.length, result = {};
				while (++index < length) {
					var value = index < valsLength ? values[index] : undefined;
					assignFunc(result, props[index], value);
				}
				return result;
			}
			/**
			* Casts `value` to an empty array if it's not an array like object.
			*
			* @private
			* @param {*} value The value to inspect.
			* @returns {Array|Object} Returns the cast array-like object.
			*/
			function castArrayLikeObject(value) {
				return isArrayLikeObject(value) ? value : [];
			}
			/**
			* Casts `value` to `identity` if it's not a function.
			*
			* @private
			* @param {*} value The value to inspect.
			* @returns {Function} Returns cast function.
			*/
			function castFunction(value) {
				return typeof value == "function" ? value : identity;
			}
			/**
			* Casts `value` to a path array if it's not one.
			*
			* @private
			* @param {*} value The value to inspect.
			* @param {Object} [object] The object to query keys on.
			* @returns {Array} Returns the cast property path array.
			*/
			function castPath(value, object) {
				if (isArray(value)) return value;
				return isKey(value, object) ? [value] : stringToPath(toString(value));
			}
			/**
			* A `baseRest` alias which can be replaced with `identity` by module
			* replacement plugins.
			*
			* @private
			* @type {Function}
			* @param {Function} func The function to apply a rest parameter to.
			* @returns {Function} Returns the new function.
			*/
			var castRest = baseRest;
			/**
			* Casts `array` to a slice if it's needed.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {number} start The start position.
			* @param {number} [end=array.length] The end position.
			* @returns {Array} Returns the cast slice.
			*/
			function castSlice(array, start, end) {
				var length = array.length;
				end = end === undefined ? length : end;
				return !start && end >= length ? array : baseSlice(array, start, end);
			}
			/**
			* A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
			*
			* @private
			* @param {number|Object} id The timer id or timeout object of the timer to clear.
			*/
			var clearTimeout = ctxClearTimeout || function(id) {
				return root.clearTimeout(id);
			};
			/**
			* Creates a clone of  `buffer`.
			*
			* @private
			* @param {Buffer} buffer The buffer to clone.
			* @param {boolean} [isDeep] Specify a deep clone.
			* @returns {Buffer} Returns the cloned buffer.
			*/
			function cloneBuffer(buffer, isDeep) {
				if (isDeep) return buffer.slice();
				var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
				buffer.copy(result);
				return result;
			}
			/**
			* Creates a clone of `arrayBuffer`.
			*
			* @private
			* @param {ArrayBuffer} arrayBuffer The array buffer to clone.
			* @returns {ArrayBuffer} Returns the cloned array buffer.
			*/
			function cloneArrayBuffer(arrayBuffer) {
				var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
				new Uint8Array(result).set(new Uint8Array(arrayBuffer));
				return result;
			}
			/**
			* Creates a clone of `dataView`.
			*
			* @private
			* @param {Object} dataView The data view to clone.
			* @param {boolean} [isDeep] Specify a deep clone.
			* @returns {Object} Returns the cloned data view.
			*/
			function cloneDataView(dataView, isDeep) {
				var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
				return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
			}
			/**
			* Creates a clone of `regexp`.
			*
			* @private
			* @param {Object} regexp The regexp to clone.
			* @returns {Object} Returns the cloned regexp.
			*/
			function cloneRegExp(regexp) {
				var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
				result.lastIndex = regexp.lastIndex;
				return result;
			}
			/**
			* Creates a clone of the `symbol` object.
			*
			* @private
			* @param {Object} symbol The symbol object to clone.
			* @returns {Object} Returns the cloned symbol object.
			*/
			function cloneSymbol(symbol) {
				return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
			}
			/**
			* Creates a clone of `typedArray`.
			*
			* @private
			* @param {Object} typedArray The typed array to clone.
			* @param {boolean} [isDeep] Specify a deep clone.
			* @returns {Object} Returns the cloned typed array.
			*/
			function cloneTypedArray(typedArray, isDeep) {
				var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
				return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
			}
			/**
			* Compares values to sort them in ascending order.
			*
			* @private
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {number} Returns the sort order indicator for `value`.
			*/
			function compareAscending(value, other) {
				if (value !== other) {
					var valIsDefined = value !== undefined, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
					var othIsDefined = other !== undefined, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
					if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) return 1;
					if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) return -1;
				}
				return 0;
			}
			/**
			* Used by `_.orderBy` to compare multiple properties of a value to another
			* and stable sort them.
			*
			* If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
			* specify an order of "desc" for descending or "asc" for ascending sort order
			* of corresponding values.
			*
			* @private
			* @param {Object} object The object to compare.
			* @param {Object} other The other object to compare.
			* @param {boolean[]|string[]} orders The order to sort by for each property.
			* @returns {number} Returns the sort order indicator for `object`.
			*/
			function compareMultiple(object, other, orders) {
				var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
				while (++index < length) {
					var result = compareAscending(objCriteria[index], othCriteria[index]);
					if (result) {
						if (index >= ordersLength) return result;
						return result * (orders[index] == "desc" ? -1 : 1);
					}
				}
				return object.index - other.index;
			}
			/**
			* Creates an array that is the composition of partially applied arguments,
			* placeholders, and provided arguments into a single array of arguments.
			*
			* @private
			* @param {Array} args The provided arguments.
			* @param {Array} partials The arguments to prepend to those provided.
			* @param {Array} holders The `partials` placeholder indexes.
			* @params {boolean} [isCurried] Specify composing for a curried function.
			* @returns {Array} Returns the new array of composed arguments.
			*/
			function composeArgs(args, partials, holders, isCurried) {
				var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
				while (++leftIndex < leftLength) result[leftIndex] = partials[leftIndex];
				while (++argsIndex < holdersLength) if (isUncurried || argsIndex < argsLength) result[holders[argsIndex]] = args[argsIndex];
				while (rangeLength--) result[leftIndex++] = args[argsIndex++];
				return result;
			}
			/**
			* This function is like `composeArgs` except that the arguments composition
			* is tailored for `_.partialRight`.
			*
			* @private
			* @param {Array} args The provided arguments.
			* @param {Array} partials The arguments to append to those provided.
			* @param {Array} holders The `partials` placeholder indexes.
			* @params {boolean} [isCurried] Specify composing for a curried function.
			* @returns {Array} Returns the new array of composed arguments.
			*/
			function composeArgsRight(args, partials, holders, isCurried) {
				var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
				while (++argsIndex < rangeLength) result[argsIndex] = args[argsIndex];
				var offset = argsIndex;
				while (++rightIndex < rightLength) result[offset + rightIndex] = partials[rightIndex];
				while (++holdersIndex < holdersLength) if (isUncurried || argsIndex < argsLength) result[offset + holders[holdersIndex]] = args[argsIndex++];
				return result;
			}
			/**
			* Copies the values of `source` to `array`.
			*
			* @private
			* @param {Array} source The array to copy values from.
			* @param {Array} [array=[]] The array to copy values to.
			* @returns {Array} Returns `array`.
			*/
			function copyArray(source, array) {
				var index = -1, length = source.length;
				array || (array = Array(length));
				while (++index < length) array[index] = source[index];
				return array;
			}
			/**
			* Copies properties of `source` to `object`.
			*
			* @private
			* @param {Object} source The object to copy properties from.
			* @param {Array} props The property identifiers to copy.
			* @param {Object} [object={}] The object to copy properties to.
			* @param {Function} [customizer] The function to customize copied values.
			* @returns {Object} Returns `object`.
			*/
			function copyObject(source, props, object, customizer) {
				var isNew = !object;
				object || (object = {});
				var index = -1, length = props.length;
				while (++index < length) {
					var key = props[index];
					var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
					if (newValue === undefined) newValue = source[key];
					if (isNew) baseAssignValue(object, key, newValue);
					else assignValue(object, key, newValue);
				}
				return object;
			}
			/**
			* Copies own symbols of `source` to `object`.
			*
			* @private
			* @param {Object} source The object to copy symbols from.
			* @param {Object} [object={}] The object to copy symbols to.
			* @returns {Object} Returns `object`.
			*/
			function copySymbols(source, object) {
				return copyObject(source, getSymbols(source), object);
			}
			/**
			* Copies own and inherited symbols of `source` to `object`.
			*
			* @private
			* @param {Object} source The object to copy symbols from.
			* @param {Object} [object={}] The object to copy symbols to.
			* @returns {Object} Returns `object`.
			*/
			function copySymbolsIn(source, object) {
				return copyObject(source, getSymbolsIn(source), object);
			}
			/**
			* Creates a function like `_.groupBy`.
			*
			* @private
			* @param {Function} setter The function to set accumulator values.
			* @param {Function} [initializer] The accumulator object initializer.
			* @returns {Function} Returns the new aggregator function.
			*/
			function createAggregator(setter, initializer) {
				return function(collection, iteratee) {
					var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
					return func(collection, setter, getIteratee(iteratee, 2), accumulator);
				};
			}
			/**
			* Creates a function like `_.assign`.
			*
			* @private
			* @param {Function} assigner The function to assign values.
			* @returns {Function} Returns the new assigner function.
			*/
			function createAssigner(assigner) {
				return baseRest(function(object, sources) {
					var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined, guard = length > 2 ? sources[2] : undefined;
					customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined;
					if (guard && isIterateeCall(sources[0], sources[1], guard)) {
						customizer = length < 3 ? undefined : customizer;
						length = 1;
					}
					object = Object(object);
					while (++index < length) {
						var source = sources[index];
						if (source) assigner(object, source, index, customizer);
					}
					return object;
				});
			}
			/**
			* Creates a `baseEach` or `baseEachRight` function.
			*
			* @private
			* @param {Function} eachFunc The function to iterate over a collection.
			* @param {boolean} [fromRight] Specify iterating from right to left.
			* @returns {Function} Returns the new base function.
			*/
			function createBaseEach(eachFunc, fromRight) {
				return function(collection, iteratee) {
					if (collection == null) return collection;
					if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
					var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
					while (fromRight ? index-- : ++index < length) if (iteratee(iterable[index], index, iterable) === false) break;
					return collection;
				};
			}
			/**
			* Creates a base function for methods like `_.forIn` and `_.forOwn`.
			*
			* @private
			* @param {boolean} [fromRight] Specify iterating from right to left.
			* @returns {Function} Returns the new base function.
			*/
			function createBaseFor(fromRight) {
				return function(object, iteratee, keysFunc) {
					var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
					while (length--) {
						var key = props[fromRight ? length : ++index];
						if (iteratee(iterable[key], key, iterable) === false) break;
					}
					return object;
				};
			}
			/**
			* Creates a function that wraps `func` to invoke it with the optional `this`
			* binding of `thisArg`.
			*
			* @private
			* @param {Function} func The function to wrap.
			* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
			* @param {*} [thisArg] The `this` binding of `func`.
			* @returns {Function} Returns the new wrapped function.
			*/
			function createBind(func, bitmask, thisArg) {
				var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
				function wrapper() {
					return (this && this !== root && this instanceof wrapper ? Ctor : func).apply(isBind ? thisArg : this, arguments);
				}
				return wrapper;
			}
			/**
			* Creates a function like `_.lowerFirst`.
			*
			* @private
			* @param {string} methodName The name of the `String` case method to use.
			* @returns {Function} Returns the new case function.
			*/
			function createCaseFirst(methodName) {
				return function(string) {
					string = toString(string);
					var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
					var chr = strSymbols ? strSymbols[0] : string.charAt(0);
					var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
					return chr[methodName]() + trailing;
				};
			}
			/**
			* Creates a function like `_.camelCase`.
			*
			* @private
			* @param {Function} callback The function to combine each word.
			* @returns {Function} Returns the new compounder function.
			*/
			function createCompounder(callback) {
				return function(string) {
					return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
				};
			}
			/**
			* Creates a function that produces an instance of `Ctor` regardless of
			* whether it was invoked as part of a `new` expression or by `call` or `apply`.
			*
			* @private
			* @param {Function} Ctor The constructor to wrap.
			* @returns {Function} Returns the new wrapped function.
			*/
			function createCtor(Ctor) {
				return function() {
					var args = arguments;
					switch (args.length) {
						case 0: return new Ctor();
						case 1: return new Ctor(args[0]);
						case 2: return new Ctor(args[0], args[1]);
						case 3: return new Ctor(args[0], args[1], args[2]);
						case 4: return new Ctor(args[0], args[1], args[2], args[3]);
						case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
						case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
						case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
					}
					var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, args);
					return isObject(result) ? result : thisBinding;
				};
			}
			/**
			* Creates a function that wraps `func` to enable currying.
			*
			* @private
			* @param {Function} func The function to wrap.
			* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
			* @param {number} arity The arity of `func`.
			* @returns {Function} Returns the new wrapped function.
			*/
			function createCurry(func, bitmask, arity) {
				var Ctor = createCtor(func);
				function wrapper() {
					var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
					while (index--) args[index] = arguments[index];
					var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
					length -= holders.length;
					if (length < arity) return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined, args, holders, undefined, undefined, arity - length);
					return apply(this && this !== root && this instanceof wrapper ? Ctor : func, this, args);
				}
				return wrapper;
			}
			/**
			* Creates a `_.find` or `_.findLast` function.
			*
			* @private
			* @param {Function} findIndexFunc The function to find the collection index.
			* @returns {Function} Returns the new find function.
			*/
			function createFind(findIndexFunc) {
				return function(collection, predicate, fromIndex) {
					var iterable = Object(collection);
					if (!isArrayLike(collection)) {
						var iteratee = getIteratee(predicate, 3);
						collection = keys(collection);
						predicate = function(key) {
							return iteratee(iterable[key], key, iterable);
						};
					}
					var index = findIndexFunc(collection, predicate, fromIndex);
					return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
				};
			}
			/**
			* Creates a `_.flow` or `_.flowRight` function.
			*
			* @private
			* @param {boolean} [fromRight] Specify iterating from right to left.
			* @returns {Function} Returns the new flow function.
			*/
			function createFlow(fromRight) {
				return flatRest(function(funcs) {
					var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
					if (fromRight) funcs.reverse();
					while (index--) {
						var func = funcs[index];
						if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
						if (prereq && !wrapper && getFuncName(func) == "wrapper") var wrapper = new LodashWrapper([], true);
					}
					index = wrapper ? index : length;
					while (++index < length) {
						func = funcs[index];
						var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined;
						if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
						else wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
					}
					return function() {
						var args = arguments, value = args[0];
						if (wrapper && args.length == 1 && isArray(value)) return wrapper.plant(value).value();
						var index = 0, result = length ? funcs[index].apply(this, args) : value;
						while (++index < length) result = funcs[index].call(this, result);
						return result;
					};
				});
			}
			/**
			* Creates a function that wraps `func` to invoke it with optional `this`
			* binding of `thisArg`, partial application, and currying.
			*
			* @private
			* @param {Function|string} func The function or method name to wrap.
			* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
			* @param {*} [thisArg] The `this` binding of `func`.
			* @param {Array} [partials] The arguments to prepend to those provided to
			*  the new function.
			* @param {Array} [holders] The `partials` placeholder indexes.
			* @param {Array} [partialsRight] The arguments to append to those provided
			*  to the new function.
			* @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
			* @param {Array} [argPos] The argument positions of the new function.
			* @param {number} [ary] The arity cap of `func`.
			* @param {number} [arity] The arity of `func`.
			* @returns {Function} Returns the new wrapped function.
			*/
			function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
				var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined : createCtor(func);
				function wrapper() {
					var length = arguments.length, args = Array(length), index = length;
					while (index--) args[index] = arguments[index];
					if (isCurried) var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
					if (partials) args = composeArgs(args, partials, holders, isCurried);
					if (partialsRight) args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
					length -= holdersCount;
					if (isCurried && length < arity) {
						var newHolders = replaceHolders(args, placeholder);
						return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
					}
					var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
					length = args.length;
					if (argPos) args = reorder(args, argPos);
					else if (isFlip && length > 1) args.reverse();
					if (isAry && ary < length) args.length = ary;
					if (this && this !== root && this instanceof wrapper) fn = Ctor || createCtor(fn);
					return fn.apply(thisBinding, args);
				}
				return wrapper;
			}
			/**
			* Creates a function like `_.invertBy`.
			*
			* @private
			* @param {Function} setter The function to set accumulator values.
			* @param {Function} toIteratee The function to resolve iteratees.
			* @returns {Function} Returns the new inverter function.
			*/
			function createInverter(setter, toIteratee) {
				return function(object, iteratee) {
					return baseInverter(object, setter, toIteratee(iteratee), {});
				};
			}
			/**
			* Creates a function that performs a mathematical operation on two values.
			*
			* @private
			* @param {Function} operator The function to perform the operation.
			* @param {number} [defaultValue] The value used for `undefined` arguments.
			* @returns {Function} Returns the new mathematical operation function.
			*/
			function createMathOperation(operator, defaultValue) {
				return function(value, other) {
					var result;
					if (value === undefined && other === undefined) return defaultValue;
					if (value !== undefined) result = value;
					if (other !== undefined) {
						if (result === undefined) return other;
						if (typeof value == "string" || typeof other == "string") {
							value = baseToString(value);
							other = baseToString(other);
						} else {
							value = baseToNumber(value);
							other = baseToNumber(other);
						}
						result = operator(value, other);
					}
					return result;
				};
			}
			/**
			* Creates a function like `_.over`.
			*
			* @private
			* @param {Function} arrayFunc The function to iterate over iteratees.
			* @returns {Function} Returns the new over function.
			*/
			function createOver(arrayFunc) {
				return flatRest(function(iteratees) {
					iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
					return baseRest(function(args) {
						var thisArg = this;
						return arrayFunc(iteratees, function(iteratee) {
							return apply(iteratee, thisArg, args);
						});
					});
				});
			}
			/**
			* Creates the padding for `string` based on `length`. The `chars` string
			* is truncated if the number of characters exceeds `length`.
			*
			* @private
			* @param {number} length The padding length.
			* @param {string} [chars=' '] The string used as padding.
			* @returns {string} Returns the padding for `string`.
			*/
			function createPadding(length, chars) {
				chars = chars === undefined ? " " : baseToString(chars);
				var charsLength = chars.length;
				if (charsLength < 2) return charsLength ? baseRepeat(chars, length) : chars;
				var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
				return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
			}
			/**
			* Creates a function that wraps `func` to invoke it with the `this` binding
			* of `thisArg` and `partials` prepended to the arguments it receives.
			*
			* @private
			* @param {Function} func The function to wrap.
			* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
			* @param {*} thisArg The `this` binding of `func`.
			* @param {Array} partials The arguments to prepend to those provided to
			*  the new function.
			* @returns {Function} Returns the new wrapped function.
			*/
			function createPartial(func, bitmask, thisArg, partials) {
				var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
				function wrapper() {
					var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
					while (++leftIndex < leftLength) args[leftIndex] = partials[leftIndex];
					while (argsLength--) args[leftIndex++] = arguments[++argsIndex];
					return apply(fn, isBind ? thisArg : this, args);
				}
				return wrapper;
			}
			/**
			* Creates a `_.range` or `_.rangeRight` function.
			*
			* @private
			* @param {boolean} [fromRight] Specify iterating from right to left.
			* @returns {Function} Returns the new range function.
			*/
			function createRange(fromRight) {
				return function(start, end, step) {
					if (step && typeof step != "number" && isIterateeCall(start, end, step)) end = step = undefined;
					start = toFinite(start);
					if (end === undefined) {
						end = start;
						start = 0;
					} else end = toFinite(end);
					step = step === undefined ? start < end ? 1 : -1 : toFinite(step);
					return baseRange(start, end, step, fromRight);
				};
			}
			/**
			* Creates a function that performs a relational operation on two values.
			*
			* @private
			* @param {Function} operator The function to perform the operation.
			* @returns {Function} Returns the new relational operation function.
			*/
			function createRelationalOperation(operator) {
				return function(value, other) {
					if (!(typeof value == "string" && typeof other == "string")) {
						value = toNumber(value);
						other = toNumber(other);
					}
					return operator(value, other);
				};
			}
			/**
			* Creates a function that wraps `func` to continue currying.
			*
			* @private
			* @param {Function} func The function to wrap.
			* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
			* @param {Function} wrapFunc The function to create the `func` wrapper.
			* @param {*} placeholder The placeholder value.
			* @param {*} [thisArg] The `this` binding of `func`.
			* @param {Array} [partials] The arguments to prepend to those provided to
			*  the new function.
			* @param {Array} [holders] The `partials` placeholder indexes.
			* @param {Array} [argPos] The argument positions of the new function.
			* @param {number} [ary] The arity cap of `func`.
			* @param {number} [arity] The arity of `func`.
			* @returns {Function} Returns the new wrapped function.
			*/
			function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
				var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined, newHoldersRight = isCurry ? undefined : holders, newPartials = isCurry ? partials : undefined, newPartialsRight = isCurry ? undefined : partials;
				bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
				bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
				if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
				var newData = [
					func,
					bitmask,
					thisArg,
					newPartials,
					newHolders,
					newPartialsRight,
					newHoldersRight,
					argPos,
					ary,
					arity
				];
				var result = wrapFunc.apply(undefined, newData);
				if (isLaziable(func)) setData(result, newData);
				result.placeholder = placeholder;
				return setWrapToString(result, func, bitmask);
			}
			/**
			* Creates a function like `_.round`.
			*
			* @private
			* @param {string} methodName The name of the `Math` method to use when rounding.
			* @returns {Function} Returns the new round function.
			*/
			function createRound(methodName) {
				var func = Math[methodName];
				return function(number, precision) {
					number = toNumber(number);
					precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
					if (precision && nativeIsFinite(number)) {
						var pair = (toString(number) + "e").split("e");
						pair = (toString(func(pair[0] + "e" + (+pair[1] + precision))) + "e").split("e");
						return +(pair[0] + "e" + (+pair[1] - precision));
					}
					return func(number);
				};
			}
			/**
			* Creates a set object of `values`.
			*
			* @private
			* @param {Array} values The values to add to the set.
			* @returns {Object} Returns the new set.
			*/
			var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function(values) {
				return new Set(values);
			};
			/**
			* Creates a `_.toPairs` or `_.toPairsIn` function.
			*
			* @private
			* @param {Function} keysFunc The function to get the keys of a given object.
			* @returns {Function} Returns the new pairs function.
			*/
			function createToPairs(keysFunc) {
				return function(object) {
					var tag = getTag(object);
					if (tag == mapTag) return mapToArray(object);
					if (tag == setTag) return setToPairs(object);
					return baseToPairs(object, keysFunc(object));
				};
			}
			/**
			* Creates a function that either curries or invokes `func` with optional
			* `this` binding and partially applied arguments.
			*
			* @private
			* @param {Function|string} func The function or method name to wrap.
			* @param {number} bitmask The bitmask flags.
			*    1 - `_.bind`
			*    2 - `_.bindKey`
			*    4 - `_.curry` or `_.curryRight` of a bound function
			*    8 - `_.curry`
			*   16 - `_.curryRight`
			*   32 - `_.partial`
			*   64 - `_.partialRight`
			*  128 - `_.rearg`
			*  256 - `_.ary`
			*  512 - `_.flip`
			* @param {*} [thisArg] The `this` binding of `func`.
			* @param {Array} [partials] The arguments to be partially applied.
			* @param {Array} [holders] The `partials` placeholder indexes.
			* @param {Array} [argPos] The argument positions of the new function.
			* @param {number} [ary] The arity cap of `func`.
			* @param {number} [arity] The arity of `func`.
			* @returns {Function} Returns the new wrapped function.
			*/
			function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
				var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
				if (!isBindKey && typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				var length = partials ? partials.length : 0;
				if (!length) {
					bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
					partials = holders = undefined;
				}
				ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
				arity = arity === undefined ? arity : toInteger(arity);
				length -= holders ? holders.length : 0;
				if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
					var partialsRight = partials, holdersRight = holders;
					partials = holders = undefined;
				}
				var data = isBindKey ? undefined : getData(func);
				var newData = [
					func,
					bitmask,
					thisArg,
					partials,
					holders,
					partialsRight,
					holdersRight,
					argPos,
					ary,
					arity
				];
				if (data) mergeData(newData, data);
				func = newData[0];
				bitmask = newData[1];
				thisArg = newData[2];
				partials = newData[3];
				holders = newData[4];
				arity = newData[9] = newData[9] === undefined ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
				if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
				if (!bitmask || bitmask == WRAP_BIND_FLAG) var result = createBind(func, bitmask, thisArg);
				else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) result = createCurry(func, bitmask, arity);
				else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) result = createPartial(func, bitmask, thisArg, partials);
				else result = createHybrid.apply(undefined, newData);
				return setWrapToString((data ? baseSetData : setData)(result, newData), func, bitmask);
			}
			/**
			* Used by `_.defaults` to customize its `_.assignIn` use to assign properties
			* of source objects to the destination object for all destination properties
			* that resolve to `undefined`.
			*
			* @private
			* @param {*} objValue The destination value.
			* @param {*} srcValue The source value.
			* @param {string} key The key of the property to assign.
			* @param {Object} object The parent object of `objValue`.
			* @returns {*} Returns the value to assign.
			*/
			function customDefaultsAssignIn(objValue, srcValue, key, object) {
				if (objValue === undefined || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) return srcValue;
				return objValue;
			}
			/**
			* Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
			* objects into destination objects that are passed thru.
			*
			* @private
			* @param {*} objValue The destination value.
			* @param {*} srcValue The source value.
			* @param {string} key The key of the property to merge.
			* @param {Object} object The parent object of `objValue`.
			* @param {Object} source The parent object of `srcValue`.
			* @param {Object} [stack] Tracks traversed source values and their merged
			*  counterparts.
			* @returns {*} Returns the value to assign.
			*/
			function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
				if (isObject(objValue) && isObject(srcValue)) {
					stack.set(srcValue, objValue);
					baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
					stack["delete"](srcValue);
				}
				return objValue;
			}
			/**
			* Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
			* objects.
			*
			* @private
			* @param {*} value The value to inspect.
			* @param {string} key The key of the property to inspect.
			* @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
			*/
			function customOmitClone(value) {
				return isPlainObject(value) ? undefined : value;
			}
			/**
			* A specialized version of `baseIsEqualDeep` for arrays with support for
			* partial deep comparisons.
			*
			* @private
			* @param {Array} array The array to compare.
			* @param {Array} other The other array to compare.
			* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
			* @param {Function} customizer The function to customize comparisons.
			* @param {Function} equalFunc The function to determine equivalents of values.
			* @param {Object} stack Tracks traversed `array` and `other` objects.
			* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
			*/
			function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
				var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
				if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
				var arrStacked = stack.get(array);
				var othStacked = stack.get(other);
				if (arrStacked && othStacked) return arrStacked == other && othStacked == array;
				var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;
				stack.set(array, other);
				stack.set(other, array);
				while (++index < arrLength) {
					var arrValue = array[index], othValue = other[index];
					if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
					if (compared !== undefined) {
						if (compared) continue;
						result = false;
						break;
					}
					if (seen) {
						if (!arraySome(other, function(othValue, othIndex) {
							if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
						})) {
							result = false;
							break;
						}
					} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
						result = false;
						break;
					}
				}
				stack["delete"](array);
				stack["delete"](other);
				return result;
			}
			/**
			* A specialized version of `baseIsEqualDeep` for comparing objects of
			* the same `toStringTag`.
			*
			* **Note:** This function only supports comparing values with tags of
			* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
			*
			* @private
			* @param {Object} object The object to compare.
			* @param {Object} other The other object to compare.
			* @param {string} tag The `toStringTag` of the objects to compare.
			* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
			* @param {Function} customizer The function to customize comparisons.
			* @param {Function} equalFunc The function to determine equivalents of values.
			* @param {Object} stack Tracks traversed `object` and `other` objects.
			* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
			*/
			function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
				switch (tag) {
					case dataViewTag:
						if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
						object = object.buffer;
						other = other.buffer;
					case arrayBufferTag:
						if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
						return true;
					case boolTag:
					case dateTag:
					case numberTag: return eq(+object, +other);
					case errorTag: return object.name == other.name && object.message == other.message;
					case regexpTag:
					case stringTag: return object == other + "";
					case mapTag: var convert = mapToArray;
					case setTag:
						var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
						convert || (convert = setToArray);
						if (object.size != other.size && !isPartial) return false;
						var stacked = stack.get(object);
						if (stacked) return stacked == other;
						bitmask |= COMPARE_UNORDERED_FLAG;
						stack.set(object, other);
						var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
						stack["delete"](object);
						return result;
					case symbolTag: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
				}
				return false;
			}
			/**
			* A specialized version of `baseIsEqualDeep` for objects with support for
			* partial deep comparisons.
			*
			* @private
			* @param {Object} object The object to compare.
			* @param {Object} other The other object to compare.
			* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
			* @param {Function} customizer The function to customize comparisons.
			* @param {Function} equalFunc The function to determine equivalents of values.
			* @param {Object} stack Tracks traversed `object` and `other` objects.
			* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
			*/
			function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
				var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length;
				if (objLength != getAllKeys(other).length && !isPartial) return false;
				var index = objLength;
				while (index--) {
					var key = objProps[index];
					if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) return false;
				}
				var objStacked = stack.get(object);
				var othStacked = stack.get(other);
				if (objStacked && othStacked) return objStacked == other && othStacked == object;
				var result = true;
				stack.set(object, other);
				stack.set(other, object);
				var skipCtor = isPartial;
				while (++index < objLength) {
					key = objProps[index];
					var objValue = object[key], othValue = other[key];
					if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
					if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
						result = false;
						break;
					}
					skipCtor || (skipCtor = key == "constructor");
				}
				if (result && !skipCtor) {
					var objCtor = object.constructor, othCtor = other.constructor;
					if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
				}
				stack["delete"](object);
				stack["delete"](other);
				return result;
			}
			/**
			* A specialized version of `baseRest` which flattens the rest array.
			*
			* @private
			* @param {Function} func The function to apply a rest parameter to.
			* @returns {Function} Returns the new function.
			*/
			function flatRest(func) {
				return setToString(overRest(func, undefined, flatten), func + "");
			}
			/**
			* Creates an array of own enumerable property names and symbols of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names and symbols.
			*/
			function getAllKeys(object) {
				return baseGetAllKeys(object, keys, getSymbols);
			}
			/**
			* Creates an array of own and inherited enumerable property names and
			* symbols of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names and symbols.
			*/
			function getAllKeysIn(object) {
				return baseGetAllKeys(object, keysIn, getSymbolsIn);
			}
			/**
			* Gets metadata for `func`.
			*
			* @private
			* @param {Function} func The function to query.
			* @returns {*} Returns the metadata for `func`.
			*/
			var getData = !metaMap ? noop : function(func) {
				return metaMap.get(func);
			};
			/**
			* Gets the name of `func`.
			*
			* @private
			* @param {Function} func The function to query.
			* @returns {string} Returns the function name.
			*/
			function getFuncName(func) {
				var result = func.name + "", array = realNames[result], length = hasOwnProperty.call(realNames, result) ? array.length : 0;
				while (length--) {
					var data = array[length], otherFunc = data.func;
					if (otherFunc == null || otherFunc == func) return data.name;
				}
				return result;
			}
			/**
			* Gets the argument placeholder value for `func`.
			*
			* @private
			* @param {Function} func The function to inspect.
			* @returns {*} Returns the placeholder value.
			*/
			function getHolder(func) {
				return (hasOwnProperty.call(lodash, "placeholder") ? lodash : func).placeholder;
			}
			/**
			* Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
			* this function returns the custom method, otherwise it returns `baseIteratee`.
			* If arguments are provided, the chosen function is invoked with them and
			* its result is returned.
			*
			* @private
			* @param {*} [value] The value to convert to an iteratee.
			* @param {number} [arity] The arity of the created iteratee.
			* @returns {Function} Returns the chosen function or its result.
			*/
			function getIteratee() {
				var result = lodash.iteratee || iteratee;
				result = result === iteratee ? baseIteratee : result;
				return arguments.length ? result(arguments[0], arguments[1]) : result;
			}
			/**
			* Gets the data for `map`.
			*
			* @private
			* @param {Object} map The map to query.
			* @param {string} key The reference key.
			* @returns {*} Returns the map data.
			*/
			function getMapData(map, key) {
				var data = map.__data__;
				return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
			}
			/**
			* Gets the property names, values, and compare flags of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the match data of `object`.
			*/
			function getMatchData(object) {
				var result = keys(object), length = result.length;
				while (length--) {
					var key = result[length], value = object[key];
					result[length] = [
						key,
						value,
						isStrictComparable(value)
					];
				}
				return result;
			}
			/**
			* Gets the native function at `key` of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {string} key The key of the method to get.
			* @returns {*} Returns the function if it's native, else `undefined`.
			*/
			function getNative(object, key) {
				var value = getValue(object, key);
				return baseIsNative(value) ? value : undefined;
			}
			/**
			* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
			*
			* @private
			* @param {*} value The value to query.
			* @returns {string} Returns the raw `toStringTag`.
			*/
			function getRawTag(value) {
				var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
				try {
					value[symToStringTag] = undefined;
					var unmasked = true;
				} catch (e) {}
				var result = nativeObjectToString.call(value);
				if (unmasked) if (isOwn) value[symToStringTag] = tag;
				else delete value[symToStringTag];
				return result;
			}
			/**
			* Creates an array of the own enumerable symbols of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of symbols.
			*/
			var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
				if (object == null) return [];
				object = Object(object);
				return arrayFilter(nativeGetSymbols(object), function(symbol) {
					return propertyIsEnumerable.call(object, symbol);
				});
			};
			/**
			* Creates an array of the own and inherited enumerable symbols of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of symbols.
			*/
			var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
				var result = [];
				while (object) {
					arrayPush(result, getSymbols(object));
					object = getPrototype(object);
				}
				return result;
			};
			/**
			* Gets the `toStringTag` of `value`.
			*
			* @private
			* @param {*} value The value to query.
			* @returns {string} Returns the `toStringTag`.
			*/
			var getTag = baseGetTag;
			if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) getTag = function(value) {
				var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : "";
				if (ctorString) switch (ctorString) {
					case dataViewCtorString: return dataViewTag;
					case mapCtorString: return mapTag;
					case promiseCtorString: return promiseTag;
					case setCtorString: return setTag;
					case weakMapCtorString: return weakMapTag;
				}
				return result;
			};
			/**
			* Gets the view, applying any `transforms` to the `start` and `end` positions.
			*
			* @private
			* @param {number} start The start of the view.
			* @param {number} end The end of the view.
			* @param {Array} transforms The transformations to apply to the view.
			* @returns {Object} Returns an object containing the `start` and `end`
			*  positions of the view.
			*/
			function getView(start, end, transforms) {
				var index = -1, length = transforms.length;
				while (++index < length) {
					var data = transforms[index], size = data.size;
					switch (data.type) {
						case "drop":
							start += size;
							break;
						case "dropRight":
							end -= size;
							break;
						case "take":
							end = nativeMin(end, start + size);
							break;
						case "takeRight":
							start = nativeMax(start, end - size);
							break;
					}
				}
				return {
					"start": start,
					"end": end
				};
			}
			/**
			* Extracts wrapper details from the `source` body comment.
			*
			* @private
			* @param {string} source The source to inspect.
			* @returns {Array} Returns the wrapper details.
			*/
			function getWrapDetails(source) {
				var match = source.match(reWrapDetails);
				return match ? match[1].split(reSplitDetails) : [];
			}
			/**
			* Checks if `path` exists on `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Array|string} path The path to check.
			* @param {Function} hasFunc The function to check properties.
			* @returns {boolean} Returns `true` if `path` exists, else `false`.
			*/
			function hasPath(object, path, hasFunc) {
				path = castPath(path, object);
				var index = -1, length = path.length, result = false;
				while (++index < length) {
					var key = toKey(path[index]);
					if (!(result = object != null && hasFunc(object, key))) break;
					object = object[key];
				}
				if (result || ++index != length) return result;
				length = object == null ? 0 : object.length;
				return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
			}
			/**
			* Initializes an array clone.
			*
			* @private
			* @param {Array} array The array to clone.
			* @returns {Array} Returns the initialized clone.
			*/
			function initCloneArray(array) {
				var length = array.length, result = new array.constructor(length);
				if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
					result.index = array.index;
					result.input = array.input;
				}
				return result;
			}
			/**
			* Initializes an object clone.
			*
			* @private
			* @param {Object} object The object to clone.
			* @returns {Object} Returns the initialized clone.
			*/
			function initCloneObject(object) {
				return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
			}
			/**
			* Initializes an object clone based on its `toStringTag`.
			*
			* **Note:** This function only supports cloning values with tags of
			* `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
			*
			* @private
			* @param {Object} object The object to clone.
			* @param {string} tag The `toStringTag` of the object to clone.
			* @param {boolean} [isDeep] Specify a deep clone.
			* @returns {Object} Returns the initialized clone.
			*/
			function initCloneByTag(object, tag, isDeep) {
				var Ctor = object.constructor;
				switch (tag) {
					case arrayBufferTag: return cloneArrayBuffer(object);
					case boolTag:
					case dateTag: return new Ctor(+object);
					case dataViewTag: return cloneDataView(object, isDeep);
					case float32Tag:
					case float64Tag:
					case int8Tag:
					case int16Tag:
					case int32Tag:
					case uint8Tag:
					case uint8ClampedTag:
					case uint16Tag:
					case uint32Tag: return cloneTypedArray(object, isDeep);
					case mapTag: return new Ctor();
					case numberTag:
					case stringTag: return new Ctor(object);
					case regexpTag: return cloneRegExp(object);
					case setTag: return new Ctor();
					case symbolTag: return cloneSymbol(object);
				}
			}
			/**
			* Inserts wrapper `details` in a comment at the top of the `source` body.
			*
			* @private
			* @param {string} source The source to modify.
			* @returns {Array} details The details to insert.
			* @returns {string} Returns the modified source.
			*/
			function insertWrapDetails(source, details) {
				var length = details.length;
				if (!length) return source;
				var lastIndex = length - 1;
				details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
				details = details.join(length > 2 ? ", " : " ");
				return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
			}
			/**
			* Checks if `value` is a flattenable `arguments` object or array.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
			*/
			function isFlattenable(value) {
				return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
			}
			/**
			* Checks if `value` is a valid array-like index.
			*
			* @private
			* @param {*} value The value to check.
			* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
			* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
			*/
			function isIndex(value, length) {
				var type = typeof value;
				length = length == null ? MAX_SAFE_INTEGER : length;
				return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
			}
			/**
			* Checks if the given arguments are from an iteratee call.
			*
			* @private
			* @param {*} value The potential iteratee value argument.
			* @param {*} index The potential iteratee index or key argument.
			* @param {*} object The potential iteratee object argument.
			* @returns {boolean} Returns `true` if the arguments are from an iteratee call,
			*  else `false`.
			*/
			function isIterateeCall(value, index, object) {
				if (!isObject(object)) return false;
				var type = typeof index;
				if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) return eq(object[index], value);
				return false;
			}
			/**
			* Checks if `value` is a property name and not a property path.
			*
			* @private
			* @param {*} value The value to check.
			* @param {Object} [object] The object to query keys on.
			* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
			*/
			function isKey(value, object) {
				if (isArray(value)) return false;
				var type = typeof value;
				if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) return true;
				return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
			}
			/**
			* Checks if `value` is suitable for use as unique object key.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
			*/
			function isKeyable(value) {
				var type = typeof value;
				return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
			}
			/**
			* Checks if `func` has a lazy counterpart.
			*
			* @private
			* @param {Function} func The function to check.
			* @returns {boolean} Returns `true` if `func` has a lazy counterpart,
			*  else `false`.
			*/
			function isLaziable(func) {
				var funcName = getFuncName(func), other = lodash[funcName];
				if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) return false;
				if (func === other) return true;
				var data = getData(other);
				return !!data && func === data[0];
			}
			/**
			* Checks if `func` has its source masked.
			*
			* @private
			* @param {Function} func The function to check.
			* @returns {boolean} Returns `true` if `func` is masked, else `false`.
			*/
			function isMasked(func) {
				return !!maskSrcKey && maskSrcKey in func;
			}
			/**
			* Checks if `func` is capable of being masked.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `func` is maskable, else `false`.
			*/
			var isMaskable = coreJsData ? isFunction : stubFalse;
			/**
			* Checks if `value` is likely a prototype object.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
			*/
			function isPrototype(value) {
				var Ctor = value && value.constructor;
				return value === (typeof Ctor == "function" && Ctor.prototype || objectProto);
			}
			/**
			* Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` if suitable for strict
			*  equality comparisons, else `false`.
			*/
			function isStrictComparable(value) {
				return value === value && !isObject(value);
			}
			/**
			* A specialized version of `matchesProperty` for source values suitable
			* for strict equality comparisons, i.e. `===`.
			*
			* @private
			* @param {string} key The key of the property to get.
			* @param {*} srcValue The value to match.
			* @returns {Function} Returns the new spec function.
			*/
			function matchesStrictComparable(key, srcValue) {
				return function(object) {
					if (object == null) return false;
					return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
				};
			}
			/**
			* A specialized version of `_.memoize` which clears the memoized function's
			* cache when it exceeds `MAX_MEMOIZE_SIZE`.
			*
			* @private
			* @param {Function} func The function to have its output memoized.
			* @returns {Function} Returns the new memoized function.
			*/
			function memoizeCapped(func) {
				var result = memoize(func, function(key) {
					if (cache.size === MAX_MEMOIZE_SIZE) cache.clear();
					return key;
				});
				var cache = result.cache;
				return result;
			}
			/**
			* Merges the function metadata of `source` into `data`.
			*
			* Merging metadata reduces the number of wrappers used to invoke a function.
			* This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
			* may be applied regardless of execution order. Methods like `_.ary` and
			* `_.rearg` modify function arguments, making the order in which they are
			* executed important, preventing the merging of metadata. However, we make
			* an exception for a safe combined case where curried functions have `_.ary`
			* and or `_.rearg` applied.
			*
			* @private
			* @param {Array} data The destination metadata.
			* @param {Array} source The source metadata.
			* @returns {Array} Returns `data`.
			*/
			function mergeData(data, source) {
				var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
				var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
				if (!(isCommon || isCombo)) return data;
				if (srcBitmask & WRAP_BIND_FLAG) {
					data[2] = source[2];
					newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
				}
				var value = source[3];
				if (value) {
					var partials = data[3];
					data[3] = partials ? composeArgs(partials, value, source[4]) : value;
					data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
				}
				value = source[5];
				if (value) {
					partials = data[5];
					data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
					data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
				}
				value = source[7];
				if (value) data[7] = value;
				if (srcBitmask & WRAP_ARY_FLAG) data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
				if (data[9] == null) data[9] = source[9];
				data[0] = source[0];
				data[1] = newBitmask;
				return data;
			}
			/**
			* This function is like
			* [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
			* except that it includes inherited enumerable properties.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			*/
			function nativeKeysIn(object) {
				var result = [];
				if (object != null) for (var key in Object(object)) result.push(key);
				return result;
			}
			/**
			* Converts `value` to a string using `Object.prototype.toString`.
			*
			* @private
			* @param {*} value The value to convert.
			* @returns {string} Returns the converted string.
			*/
			function objectToString(value) {
				return nativeObjectToString.call(value);
			}
			/**
			* A specialized version of `baseRest` which transforms the rest array.
			*
			* @private
			* @param {Function} func The function to apply a rest parameter to.
			* @param {number} [start=func.length-1] The start position of the rest parameter.
			* @param {Function} transform The rest array transform.
			* @returns {Function} Returns the new function.
			*/
			function overRest(func, start, transform) {
				start = nativeMax(start === undefined ? func.length - 1 : start, 0);
				return function() {
					var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
					while (++index < length) array[index] = args[start + index];
					index = -1;
					var otherArgs = Array(start + 1);
					while (++index < start) otherArgs[index] = args[index];
					otherArgs[start] = transform(array);
					return apply(func, this, otherArgs);
				};
			}
			/**
			* Gets the parent value at `path` of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Array} path The path to get the parent value of.
			* @returns {*} Returns the parent value.
			*/
			function parent(object, path) {
				return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
			}
			/**
			* Reorder `array` according to the specified indexes where the element at
			* the first index is assigned as the first element, the element at
			* the second index is assigned as the second element, and so on.
			*
			* @private
			* @param {Array} array The array to reorder.
			* @param {Array} indexes The arranged array indexes.
			* @returns {Array} Returns `array`.
			*/
			function reorder(array, indexes) {
				var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
				while (length--) {
					var index = indexes[length];
					array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
				}
				return array;
			}
			/**
			* Gets the value at `key`, unless `key` is "__proto__" or "constructor".
			*
			* @private
			* @param {Object} object The object to query.
			* @param {string} key The key of the property to get.
			* @returns {*} Returns the property value.
			*/
			function safeGet(object, key) {
				if (key === "constructor" && typeof object[key] === "function") return;
				if (key == "__proto__") return;
				return object[key];
			}
			/**
			* Sets metadata for `func`.
			*
			* **Note:** If this function becomes hot, i.e. is invoked a lot in a short
			* period of time, it will trip its breaker and transition to an identity
			* function to avoid garbage collection pauses in V8. See
			* [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
			* for more details.
			*
			* @private
			* @param {Function} func The function to associate metadata with.
			* @param {*} data The metadata.
			* @returns {Function} Returns `func`.
			*/
			var setData = shortOut(baseSetData);
			/**
			* A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
			*
			* @private
			* @param {Function} func The function to delay.
			* @param {number} wait The number of milliseconds to delay invocation.
			* @returns {number|Object} Returns the timer id or timeout object.
			*/
			var setTimeout = ctxSetTimeout || function(func, wait) {
				return root.setTimeout(func, wait);
			};
			/**
			* Sets the `toString` method of `func` to return `string`.
			*
			* @private
			* @param {Function} func The function to modify.
			* @param {Function} string The `toString` result.
			* @returns {Function} Returns `func`.
			*/
			var setToString = shortOut(baseSetToString);
			/**
			* Sets the `toString` method of `wrapper` to mimic the source of `reference`
			* with wrapper details in a comment at the top of the source body.
			*
			* @private
			* @param {Function} wrapper The function to modify.
			* @param {Function} reference The reference function.
			* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
			* @returns {Function} Returns `wrapper`.
			*/
			function setWrapToString(wrapper, reference, bitmask) {
				var source = reference + "";
				return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
			}
			/**
			* Creates a function that'll short out and invoke `identity` instead
			* of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
			* milliseconds.
			*
			* @private
			* @param {Function} func The function to restrict.
			* @returns {Function} Returns the new shortable function.
			*/
			function shortOut(func) {
				var count = 0, lastCalled = 0;
				return function() {
					var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
					lastCalled = stamp;
					if (remaining > 0) {
						if (++count >= HOT_COUNT) return arguments[0];
					} else count = 0;
					return func.apply(undefined, arguments);
				};
			}
			/**
			* A specialized version of `_.shuffle` which mutates and sets the size of `array`.
			*
			* @private
			* @param {Array} array The array to shuffle.
			* @param {number} [size=array.length] The size of `array`.
			* @returns {Array} Returns `array`.
			*/
			function shuffleSelf(array, size) {
				var index = -1, length = array.length, lastIndex = length - 1;
				size = size === undefined ? length : size;
				while (++index < size) {
					var rand = baseRandom(index, lastIndex), value = array[rand];
					array[rand] = array[index];
					array[index] = value;
				}
				array.length = size;
				return array;
			}
			/**
			* Converts `string` to a property path array.
			*
			* @private
			* @param {string} string The string to convert.
			* @returns {Array} Returns the property path array.
			*/
			var stringToPath = memoizeCapped(function(string) {
				var result = [];
				if (string.charCodeAt(0) === 46) result.push("");
				string.replace(rePropName, function(match, number, quote, subString) {
					result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
				});
				return result;
			});
			/**
			* Converts `value` to a string key if it's not a string or symbol.
			*
			* @private
			* @param {*} value The value to inspect.
			* @returns {string|symbol} Returns the key.
			*/
			function toKey(value) {
				if (typeof value == "string" || isSymbol(value)) return value;
				var result = value + "";
				return result == "0" && 1 / value == -INFINITY ? "-0" : result;
			}
			/**
			* Converts `func` to its source code.
			*
			* @private
			* @param {Function} func The function to convert.
			* @returns {string} Returns the source code.
			*/
			function toSource(func) {
				if (func != null) {
					try {
						return funcToString.call(func);
					} catch (e) {}
					try {
						return func + "";
					} catch (e) {}
				}
				return "";
			}
			/**
			* Updates wrapper `details` based on `bitmask` flags.
			*
			* @private
			* @returns {Array} details The details to modify.
			* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
			* @returns {Array} Returns `details`.
			*/
			function updateWrapDetails(details, bitmask) {
				arrayEach(wrapFlags, function(pair) {
					var value = "_." + pair[0];
					if (bitmask & pair[1] && !arrayIncludes(details, value)) details.push(value);
				});
				return details.sort();
			}
			/**
			* Creates a clone of `wrapper`.
			*
			* @private
			* @param {Object} wrapper The wrapper to clone.
			* @returns {Object} Returns the cloned wrapper.
			*/
			function wrapperClone(wrapper) {
				if (wrapper instanceof LazyWrapper) return wrapper.clone();
				var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
				result.__actions__ = copyArray(wrapper.__actions__);
				result.__index__ = wrapper.__index__;
				result.__values__ = wrapper.__values__;
				return result;
			}
			/**
			* Creates an array of elements split into groups the length of `size`.
			* If `array` can't be split evenly, the final chunk will be the remaining
			* elements.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to process.
			* @param {number} [size=1] The length of each chunk
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Array} Returns the new array of chunks.
			* @example
			*
			* _.chunk(['a', 'b', 'c', 'd'], 2);
			* // => [['a', 'b'], ['c', 'd']]
			*
			* _.chunk(['a', 'b', 'c', 'd'], 3);
			* // => [['a', 'b', 'c'], ['d']]
			*/
			function chunk(array, size, guard) {
				if (guard ? isIterateeCall(array, size, guard) : size === undefined) size = 1;
				else size = nativeMax(toInteger(size), 0);
				var length = array == null ? 0 : array.length;
				if (!length || size < 1) return [];
				var index = 0, resIndex = 0, result = Array(nativeCeil(length / size));
				while (index < length) result[resIndex++] = baseSlice(array, index, index += size);
				return result;
			}
			/**
			* Creates an array with all falsey values removed. The values `false`, `null`,
			* `0`, `-0`, `0n`, `""`, `undefined`, and `NaN` are falsy.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to compact.
			* @returns {Array} Returns the new array of filtered values.
			* @example
			*
			* _.compact([0, 1, false, 2, '', 3]);
			* // => [1, 2, 3]
			*/
			function compact(array) {
				var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
				while (++index < length) {
					var value = array[index];
					if (value) result[resIndex++] = value;
				}
				return result;
			}
			/**
			* Creates a new array concatenating `array` with any additional arrays
			* and/or values.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to concatenate.
			* @param {...*} [values] The values to concatenate.
			* @returns {Array} Returns the new concatenated array.
			* @example
			*
			* var array = [1];
			* var other = _.concat(array, 2, [3], [[4]]);
			*
			* console.log(other);
			* // => [1, 2, 3, [4]]
			*
			* console.log(array);
			* // => [1]
			*/
			function concat() {
				var length = arguments.length;
				if (!length) return [];
				var args = Array(length - 1), array = arguments[0], index = length;
				while (index--) args[index - 1] = arguments[index];
				return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
			}
			/**
			* Creates an array of `array` values not included in the other given arrays
			* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons. The order and references of result values are
			* determined by the first array.
			*
			* **Note:** Unlike `_.pullAll`, this method returns a new array.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {...Array} [values] The values to exclude.
			* @returns {Array} Returns the new array of filtered values.
			* @see _.without, _.xor
			* @example
			*
			* _.difference([2, 1], [2, 3]);
			* // => [1]
			*/
			var difference = baseRest(function(array, values) {
				return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
			});
			/**
			* This method is like `_.difference` except that it accepts `iteratee` which
			* is invoked for each element of `array` and `values` to generate the criterion
			* by which they're compared. The order and references of result values are
			* determined by the first array. The iteratee is invoked with one argument:
			* (value).
			*
			* **Note:** Unlike `_.pullAllBy`, this method returns a new array.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {...Array} [values] The values to exclude.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {Array} Returns the new array of filtered values.
			* @example
			*
			* _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
			* // => [1.2]
			*
			* // The `_.property` iteratee shorthand.
			* _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
			* // => [{ 'x': 2 }]
			*/
			var differenceBy = baseRest(function(array, values) {
				var iteratee = last(values);
				if (isArrayLikeObject(iteratee)) iteratee = undefined;
				return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2)) : [];
			});
			/**
			* This method is like `_.difference` except that it accepts `comparator`
			* which is invoked to compare elements of `array` to `values`. The order and
			* references of result values are determined by the first array. The comparator
			* is invoked with two arguments: (arrVal, othVal).
			*
			* **Note:** Unlike `_.pullAllWith`, this method returns a new array.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {...Array} [values] The values to exclude.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new array of filtered values.
			* @example
			*
			* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
			*
			* _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
			* // => [{ 'x': 2, 'y': 1 }]
			*/
			var differenceWith = baseRest(function(array, values) {
				var comparator = last(values);
				if (isArrayLikeObject(comparator)) comparator = undefined;
				return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
			});
			/**
			* Creates a slice of `array` with `n` elements dropped from the beginning.
			*
			* @static
			* @memberOf _
			* @since 0.5.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {number} [n=1] The number of elements to drop.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* _.drop([1, 2, 3]);
			* // => [2, 3]
			*
			* _.drop([1, 2, 3], 2);
			* // => [3]
			*
			* _.drop([1, 2, 3], 5);
			* // => []
			*
			* _.drop([1, 2, 3], 0);
			* // => [1, 2, 3]
			*/
			function drop(array, n, guard) {
				var length = array == null ? 0 : array.length;
				if (!length) return [];
				n = guard || n === undefined ? 1 : toInteger(n);
				return baseSlice(array, n < 0 ? 0 : n, length);
			}
			/**
			* Creates a slice of `array` with `n` elements dropped from the end.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {number} [n=1] The number of elements to drop.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* _.dropRight([1, 2, 3]);
			* // => [1, 2]
			*
			* _.dropRight([1, 2, 3], 2);
			* // => [1]
			*
			* _.dropRight([1, 2, 3], 5);
			* // => []
			*
			* _.dropRight([1, 2, 3], 0);
			* // => [1, 2, 3]
			*/
			function dropRight(array, n, guard) {
				var length = array == null ? 0 : array.length;
				if (!length) return [];
				n = guard || n === undefined ? 1 : toInteger(n);
				n = length - n;
				return baseSlice(array, 0, n < 0 ? 0 : n);
			}
			/**
			* Creates a slice of `array` excluding elements dropped from the end.
			* Elements are dropped until `predicate` returns falsey. The predicate is
			* invoked with three arguments: (value, index, array).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'active': true },
			*   { 'user': 'fred',    'active': false },
			*   { 'user': 'pebbles', 'active': false }
			* ];
			*
			* _.dropRightWhile(users, function(o) { return !o.active; });
			* // => objects for ['barney']
			*
			* // The `_.matches` iteratee shorthand.
			* _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
			* // => objects for ['barney', 'fred']
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.dropRightWhile(users, ['active', false]);
			* // => objects for ['barney']
			*
			* // The `_.property` iteratee shorthand.
			* _.dropRightWhile(users, 'active');
			* // => objects for ['barney', 'fred', 'pebbles']
			*/
			function dropRightWhile(array, predicate) {
				return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
			}
			/**
			* Creates a slice of `array` excluding elements dropped from the beginning.
			* Elements are dropped until `predicate` returns falsey. The predicate is
			* invoked with three arguments: (value, index, array).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'active': false },
			*   { 'user': 'fred',    'active': false },
			*   { 'user': 'pebbles', 'active': true }
			* ];
			*
			* _.dropWhile(users, function(o) { return !o.active; });
			* // => objects for ['pebbles']
			*
			* // The `_.matches` iteratee shorthand.
			* _.dropWhile(users, { 'user': 'barney', 'active': false });
			* // => objects for ['fred', 'pebbles']
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.dropWhile(users, ['active', false]);
			* // => objects for ['pebbles']
			*
			* // The `_.property` iteratee shorthand.
			* _.dropWhile(users, 'active');
			* // => objects for ['barney', 'fred', 'pebbles']
			*/
			function dropWhile(array, predicate) {
				return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
			}
			/**
			* Fills elements of `array` with `value` from `start` up to, but not
			* including, `end`.
			*
			* **Note:** This method mutates `array`.
			*
			* @static
			* @memberOf _
			* @since 3.2.0
			* @category Array
			* @param {Array} array The array to fill.
			* @param {*} value The value to fill `array` with.
			* @param {number} [start=0] The start position.
			* @param {number} [end=array.length] The end position.
			* @returns {Array} Returns `array`.
			* @example
			*
			* var array = [1, 2, 3];
			*
			* _.fill(array, 'a');
			* console.log(array);
			* // => ['a', 'a', 'a']
			*
			* _.fill(Array(3), 2);
			* // => [2, 2, 2]
			*
			* _.fill([4, 6, 8, 10], '*', 1, 3);
			* // => [4, '*', '*', 10]
			*/
			function fill(array, value, start, end) {
				var length = array == null ? 0 : array.length;
				if (!length) return [];
				if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
					start = 0;
					end = length;
				}
				return baseFill(array, value, start, end);
			}
			/**
			* This method is like `_.find` except that it returns the index of the first
			* element `predicate` returns truthy for instead of the element itself.
			*
			* @static
			* @memberOf _
			* @since 1.1.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @param {number} [fromIndex=0] The index to search from.
			* @returns {number} Returns the index of the found element, else `-1`.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'active': false },
			*   { 'user': 'fred',    'active': false },
			*   { 'user': 'pebbles', 'active': true }
			* ];
			*
			* _.findIndex(users, function(o) { return o.user == 'barney'; });
			* // => 0
			*
			* // The `_.matches` iteratee shorthand.
			* _.findIndex(users, { 'user': 'fred', 'active': false });
			* // => 1
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.findIndex(users, ['active', false]);
			* // => 0
			*
			* // The `_.property` iteratee shorthand.
			* _.findIndex(users, 'active');
			* // => 2
			*/
			function findIndex(array, predicate, fromIndex) {
				var length = array == null ? 0 : array.length;
				if (!length) return -1;
				var index = fromIndex == null ? 0 : toInteger(fromIndex);
				if (index < 0) index = nativeMax(length + index, 0);
				return baseFindIndex(array, getIteratee(predicate, 3), index);
			}
			/**
			* This method is like `_.findIndex` except that it iterates over elements
			* of `collection` from right to left.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @param {number} [fromIndex=array.length-1] The index to search from.
			* @returns {number} Returns the index of the found element, else `-1`.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'active': true },
			*   { 'user': 'fred',    'active': false },
			*   { 'user': 'pebbles', 'active': false }
			* ];
			*
			* _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
			* // => 2
			*
			* // The `_.matches` iteratee shorthand.
			* _.findLastIndex(users, { 'user': 'barney', 'active': true });
			* // => 0
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.findLastIndex(users, ['active', false]);
			* // => 2
			*
			* // The `_.property` iteratee shorthand.
			* _.findLastIndex(users, 'active');
			* // => 0
			*/
			function findLastIndex(array, predicate, fromIndex) {
				var length = array == null ? 0 : array.length;
				if (!length) return -1;
				var index = length - 1;
				if (fromIndex !== undefined) {
					index = toInteger(fromIndex);
					index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
				}
				return baseFindIndex(array, getIteratee(predicate, 3), index, true);
			}
			/**
			* Flattens `array` a single level deep.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to flatten.
			* @returns {Array} Returns the new flattened array.
			* @example
			*
			* _.flatten([1, [2, [3, [4]], 5]]);
			* // => [1, 2, [3, [4]], 5]
			*/
			function flatten(array) {
				return (array == null ? 0 : array.length) ? baseFlatten(array, 1) : [];
			}
			/**
			* Recursively flattens `array`.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to flatten.
			* @returns {Array} Returns the new flattened array.
			* @example
			*
			* _.flattenDeep([1, [2, [3, [4]], 5]]);
			* // => [1, 2, 3, 4, 5]
			*/
			function flattenDeep(array) {
				return (array == null ? 0 : array.length) ? baseFlatten(array, INFINITY) : [];
			}
			/**
			* Recursively flatten `array` up to `depth` times.
			*
			* @static
			* @memberOf _
			* @since 4.4.0
			* @category Array
			* @param {Array} array The array to flatten.
			* @param {number} [depth=1] The maximum recursion depth.
			* @returns {Array} Returns the new flattened array.
			* @example
			*
			* var array = [1, [2, [3, [4]], 5]];
			*
			* _.flattenDepth(array, 1);
			* // => [1, 2, [3, [4]], 5]
			*
			* _.flattenDepth(array, 2);
			* // => [1, 2, 3, [4], 5]
			*/
			function flattenDepth(array, depth) {
				if (!(array == null ? 0 : array.length)) return [];
				depth = depth === undefined ? 1 : toInteger(depth);
				return baseFlatten(array, depth);
			}
			/**
			* The inverse of `_.toPairs`; this method returns an object composed
			* from key-value `pairs`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} pairs The key-value pairs.
			* @returns {Object} Returns the new object.
			* @example
			*
			* _.fromPairs([['a', 1], ['b', 2]]);
			* // => { 'a': 1, 'b': 2 }
			*/
			function fromPairs(pairs) {
				var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
				while (++index < length) {
					var pair = pairs[index];
					baseAssignValue(result, pair[0], pair[1]);
				}
				return result;
			}
			/**
			* Gets the first element of `array`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @alias first
			* @category Array
			* @param {Array} array The array to query.
			* @returns {*} Returns the first element of `array`.
			* @example
			*
			* _.head([1, 2, 3]);
			* // => 1
			*
			* _.head([]);
			* // => undefined
			*/
			function head(array) {
				return array && array.length ? array[0] : undefined;
			}
			/**
			* Gets the index at which the first occurrence of `value` is found in `array`
			* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons. If `fromIndex` is negative, it's used as the
			* offset from the end of `array`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {*} value The value to search for.
			* @param {number} [fromIndex=0] The index to search from.
			* @returns {number} Returns the index of the matched value, else `-1`.
			* @example
			*
			* _.indexOf([1, 2, 1, 2], 2);
			* // => 1
			*
			* // Search from the `fromIndex`.
			* _.indexOf([1, 2, 1, 2], 2, 2);
			* // => 3
			*/
			function indexOf(array, value, fromIndex) {
				var length = array == null ? 0 : array.length;
				if (!length) return -1;
				var index = fromIndex == null ? 0 : toInteger(fromIndex);
				if (index < 0) index = nativeMax(length + index, 0);
				return baseIndexOf(array, value, index);
			}
			/**
			* Gets all but the last element of `array`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to query.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* _.initial([1, 2, 3]);
			* // => [1, 2]
			*/
			function initial(array) {
				return (array == null ? 0 : array.length) ? baseSlice(array, 0, -1) : [];
			}
			/**
			* Creates an array of unique values that are included in all given arrays
			* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons. The order and references of result values are
			* determined by the first array.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @returns {Array} Returns the new array of intersecting values.
			* @example
			*
			* _.intersection([2, 1], [2, 3]);
			* // => [2]
			*/
			var intersection = baseRest(function(arrays) {
				var mapped = arrayMap(arrays, castArrayLikeObject);
				return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
			});
			/**
			* This method is like `_.intersection` except that it accepts `iteratee`
			* which is invoked for each element of each `arrays` to generate the criterion
			* by which they're compared. The order and references of result values are
			* determined by the first array. The iteratee is invoked with one argument:
			* (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {Array} Returns the new array of intersecting values.
			* @example
			*
			* _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
			* // => [2.1]
			*
			* // The `_.property` iteratee shorthand.
			* _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
			* // => [{ 'x': 1 }]
			*/
			var intersectionBy = baseRest(function(arrays) {
				var iteratee = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
				if (iteratee === last(mapped)) iteratee = undefined;
				else mapped.pop();
				return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee, 2)) : [];
			});
			/**
			* This method is like `_.intersection` except that it accepts `comparator`
			* which is invoked to compare elements of `arrays`. The order and references
			* of result values are determined by the first array. The comparator is
			* invoked with two arguments: (arrVal, othVal).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new array of intersecting values.
			* @example
			*
			* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
			* var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
			*
			* _.intersectionWith(objects, others, _.isEqual);
			* // => [{ 'x': 1, 'y': 2 }]
			*/
			var intersectionWith = baseRest(function(arrays) {
				var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
				comparator = typeof comparator == "function" ? comparator : undefined;
				if (comparator) mapped.pop();
				return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : [];
			});
			/**
			* Converts all elements in `array` into a string separated by `separator`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to convert.
			* @param {string} [separator=','] The element separator.
			* @returns {string} Returns the joined string.
			* @example
			*
			* _.join(['a', 'b', 'c'], '~');
			* // => 'a~b~c'
			*/
			function join(array, separator) {
				return array == null ? "" : nativeJoin.call(array, separator);
			}
			/**
			* Gets the last element of `array`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to query.
			* @returns {*} Returns the last element of `array`.
			* @example
			*
			* _.last([1, 2, 3]);
			* // => 3
			*/
			function last(array) {
				var length = array == null ? 0 : array.length;
				return length ? array[length - 1] : undefined;
			}
			/**
			* This method is like `_.indexOf` except that it iterates over elements of
			* `array` from right to left.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {*} value The value to search for.
			* @param {number} [fromIndex=array.length-1] The index to search from.
			* @returns {number} Returns the index of the matched value, else `-1`.
			* @example
			*
			* _.lastIndexOf([1, 2, 1, 2], 2);
			* // => 3
			*
			* // Search from the `fromIndex`.
			* _.lastIndexOf([1, 2, 1, 2], 2, 2);
			* // => 1
			*/
			function lastIndexOf(array, value, fromIndex) {
				var length = array == null ? 0 : array.length;
				if (!length) return -1;
				var index = length;
				if (fromIndex !== undefined) {
					index = toInteger(fromIndex);
					index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
				}
				return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
			}
			/**
			* Gets the element at index `n` of `array`. If `n` is negative, the nth
			* element from the end is returned.
			*
			* @static
			* @memberOf _
			* @since 4.11.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {number} [n=0] The index of the element to return.
			* @returns {*} Returns the nth element of `array`.
			* @example
			*
			* var array = ['a', 'b', 'c', 'd'];
			*
			* _.nth(array, 1);
			* // => 'b'
			*
			* _.nth(array, -2);
			* // => 'c';
			*/
			function nth(array, n) {
				return array && array.length ? baseNth(array, toInteger(n)) : undefined;
			}
			/**
			* Removes all given values from `array` using
			* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons.
			*
			* **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
			* to remove elements from an array by predicate.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Array
			* @param {Array} array The array to modify.
			* @param {...*} [values] The values to remove.
			* @returns {Array} Returns `array`.
			* @example
			*
			* var array = ['a', 'b', 'c', 'a', 'b', 'c'];
			*
			* _.pull(array, 'a', 'c');
			* console.log(array);
			* // => ['b', 'b']
			*/
			var pull = baseRest(pullAll);
			/**
			* This method is like `_.pull` except that it accepts an array of values to remove.
			*
			* **Note:** Unlike `_.difference`, this method mutates `array`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to modify.
			* @param {Array} values The values to remove.
			* @returns {Array} Returns `array`.
			* @example
			*
			* var array = ['a', 'b', 'c', 'a', 'b', 'c'];
			*
			* _.pullAll(array, ['a', 'c']);
			* console.log(array);
			* // => ['b', 'b']
			*/
			function pullAll(array, values) {
				return array && array.length && values && values.length ? basePullAll(array, values) : array;
			}
			/**
			* This method is like `_.pullAll` except that it accepts `iteratee` which is
			* invoked for each element of `array` and `values` to generate the criterion
			* by which they're compared. The iteratee is invoked with one argument: (value).
			*
			* **Note:** Unlike `_.differenceBy`, this method mutates `array`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to modify.
			* @param {Array} values The values to remove.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {Array} Returns `array`.
			* @example
			*
			* var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
			*
			* _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
			* console.log(array);
			* // => [{ 'x': 2 }]
			*/
			function pullAllBy(array, values, iteratee) {
				return array && array.length && values && values.length ? basePullAll(array, values, getIteratee(iteratee, 2)) : array;
			}
			/**
			* This method is like `_.pullAll` except that it accepts `comparator` which
			* is invoked to compare elements of `array` to `values`. The comparator is
			* invoked with two arguments: (arrVal, othVal).
			*
			* **Note:** Unlike `_.differenceWith`, this method mutates `array`.
			*
			* @static
			* @memberOf _
			* @since 4.6.0
			* @category Array
			* @param {Array} array The array to modify.
			* @param {Array} values The values to remove.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns `array`.
			* @example
			*
			* var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
			*
			* _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
			* console.log(array);
			* // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
			*/
			function pullAllWith(array, values, comparator) {
				return array && array.length && values && values.length ? basePullAll(array, values, undefined, comparator) : array;
			}
			/**
			* Removes elements from `array` corresponding to `indexes` and returns an
			* array of removed elements.
			*
			* **Note:** Unlike `_.at`, this method mutates `array`.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to modify.
			* @param {...(number|number[])} [indexes] The indexes of elements to remove.
			* @returns {Array} Returns the new array of removed elements.
			* @example
			*
			* var array = ['a', 'b', 'c', 'd'];
			* var pulled = _.pullAt(array, [1, 3]);
			*
			* console.log(array);
			* // => ['a', 'c']
			*
			* console.log(pulled);
			* // => ['b', 'd']
			*/
			var pullAt = flatRest(function(array, indexes) {
				var length = array == null ? 0 : array.length, result = baseAt(array, indexes);
				basePullAt(array, arrayMap(indexes, function(index) {
					return isIndex(index, length) ? +index : index;
				}).sort(compareAscending));
				return result;
			});
			/**
			* Removes all elements from `array` that `predicate` returns truthy for
			* and returns an array of the removed elements. The predicate is invoked
			* with three arguments: (value, index, array).
			*
			* **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
			* to pull elements from an array by value.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Array
			* @param {Array} array The array to modify.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the new array of removed elements.
			* @example
			*
			* var array = [1, 2, 3, 4];
			* var evens = _.remove(array, function(n) {
			*   return n % 2 == 0;
			* });
			*
			* console.log(array);
			* // => [1, 3]
			*
			* console.log(evens);
			* // => [2, 4]
			*/
			function remove(array, predicate) {
				var result = [];
				if (!(array && array.length)) return result;
				var index = -1, indexes = [], length = array.length;
				predicate = getIteratee(predicate, 3);
				while (++index < length) {
					var value = array[index];
					if (predicate(value, index, array)) {
						result.push(value);
						indexes.push(index);
					}
				}
				basePullAt(array, indexes);
				return result;
			}
			/**
			* Reverses `array` so that the first element becomes the last, the second
			* element becomes the second to last, and so on.
			*
			* **Note:** This method mutates `array` and is based on
			* [`Array#reverse`](https://mdn.io/Array/reverse).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to modify.
			* @returns {Array} Returns `array`.
			* @example
			*
			* var array = [1, 2, 3];
			*
			* _.reverse(array);
			* // => [3, 2, 1]
			*
			* console.log(array);
			* // => [3, 2, 1]
			*/
			function reverse(array) {
				return array == null ? array : nativeReverse.call(array);
			}
			/**
			* Creates a slice of `array` from `start` up to, but not including, `end`.
			*
			* **Note:** This method is used instead of
			* [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
			* returned.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to slice.
			* @param {number} [start=0] The start position.
			* @param {number} [end=array.length] The end position.
			* @returns {Array} Returns the slice of `array`.
			*/
			function slice(array, start, end) {
				var length = array == null ? 0 : array.length;
				if (!length) return [];
				if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
					start = 0;
					end = length;
				} else {
					start = start == null ? 0 : toInteger(start);
					end = end === undefined ? length : toInteger(end);
				}
				return baseSlice(array, start, end);
			}
			/**
			* Uses a binary search to determine the lowest index at which `value`
			* should be inserted into `array` in order to maintain its sort order.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The sorted array to inspect.
			* @param {*} value The value to evaluate.
			* @returns {number} Returns the index at which `value` should be inserted
			*  into `array`.
			* @example
			*
			* _.sortedIndex([30, 50], 40);
			* // => 1
			*/
			function sortedIndex(array, value) {
				return baseSortedIndex(array, value);
			}
			/**
			* This method is like `_.sortedIndex` except that it accepts `iteratee`
			* which is invoked for `value` and each element of `array` to compute their
			* sort ranking. The iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The sorted array to inspect.
			* @param {*} value The value to evaluate.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {number} Returns the index at which `value` should be inserted
			*  into `array`.
			* @example
			*
			* var objects = [{ 'x': 4 }, { 'x': 5 }];
			*
			* _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
			* // => 0
			*
			* // The `_.property` iteratee shorthand.
			* _.sortedIndexBy(objects, { 'x': 4 }, 'x');
			* // => 0
			*/
			function sortedIndexBy(array, value, iteratee) {
				return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
			}
			/**
			* This method is like `_.indexOf` except that it performs a binary
			* search on a sorted `array`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {*} value The value to search for.
			* @returns {number} Returns the index of the matched value, else `-1`.
			* @example
			*
			* _.sortedIndexOf([4, 5, 5, 5, 6], 5);
			* // => 1
			*/
			function sortedIndexOf(array, value) {
				var length = array == null ? 0 : array.length;
				if (length) {
					var index = baseSortedIndex(array, value);
					if (index < length && eq(array[index], value)) return index;
				}
				return -1;
			}
			/**
			* This method is like `_.sortedIndex` except that it returns the highest
			* index at which `value` should be inserted into `array` in order to
			* maintain its sort order.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The sorted array to inspect.
			* @param {*} value The value to evaluate.
			* @returns {number} Returns the index at which `value` should be inserted
			*  into `array`.
			* @example
			*
			* _.sortedLastIndex([4, 5, 5, 5, 6], 5);
			* // => 4
			*/
			function sortedLastIndex(array, value) {
				return baseSortedIndex(array, value, true);
			}
			/**
			* This method is like `_.sortedLastIndex` except that it accepts `iteratee`
			* which is invoked for `value` and each element of `array` to compute their
			* sort ranking. The iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The sorted array to inspect.
			* @param {*} value The value to evaluate.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {number} Returns the index at which `value` should be inserted
			*  into `array`.
			* @example
			*
			* var objects = [{ 'x': 4 }, { 'x': 5 }];
			*
			* _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
			* // => 1
			*
			* // The `_.property` iteratee shorthand.
			* _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
			* // => 1
			*/
			function sortedLastIndexBy(array, value, iteratee) {
				return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
			}
			/**
			* This method is like `_.lastIndexOf` except that it performs a binary
			* search on a sorted `array`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {*} value The value to search for.
			* @returns {number} Returns the index of the matched value, else `-1`.
			* @example
			*
			* _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
			* // => 3
			*/
			function sortedLastIndexOf(array, value) {
				if (array == null ? 0 : array.length) {
					var index = baseSortedIndex(array, value, true) - 1;
					if (eq(array[index], value)) return index;
				}
				return -1;
			}
			/**
			* This method is like `_.uniq` except that it's designed and optimized
			* for sorted arrays.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @returns {Array} Returns the new duplicate free array.
			* @example
			*
			* _.sortedUniq([1, 1, 2]);
			* // => [1, 2]
			*/
			function sortedUniq(array) {
				return array && array.length ? baseSortedUniq(array) : [];
			}
			/**
			* This method is like `_.uniqBy` except that it's designed and optimized
			* for sorted arrays.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {Function} [iteratee] The iteratee invoked per element.
			* @returns {Array} Returns the new duplicate free array.
			* @example
			*
			* _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
			* // => [1.1, 2.3]
			*/
			function sortedUniqBy(array, iteratee) {
				return array && array.length ? baseSortedUniq(array, getIteratee(iteratee, 2)) : [];
			}
			/**
			* Gets all but the first element of `array`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to query.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* _.tail([1, 2, 3]);
			* // => [2, 3]
			*/
			function tail(array) {
				var length = array == null ? 0 : array.length;
				return length ? baseSlice(array, 1, length) : [];
			}
			/**
			* Creates a slice of `array` with `n` elements taken from the beginning.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {number} [n=1] The number of elements to take.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* _.take([1, 2, 3]);
			* // => [1]
			*
			* _.take([1, 2, 3], 2);
			* // => [1, 2]
			*
			* _.take([1, 2, 3], 5);
			* // => [1, 2, 3]
			*
			* _.take([1, 2, 3], 0);
			* // => []
			*/
			function take(array, n, guard) {
				if (!(array && array.length)) return [];
				n = guard || n === undefined ? 1 : toInteger(n);
				return baseSlice(array, 0, n < 0 ? 0 : n);
			}
			/**
			* Creates a slice of `array` with `n` elements taken from the end.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {number} [n=1] The number of elements to take.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* _.takeRight([1, 2, 3]);
			* // => [3]
			*
			* _.takeRight([1, 2, 3], 2);
			* // => [2, 3]
			*
			* _.takeRight([1, 2, 3], 5);
			* // => [1, 2, 3]
			*
			* _.takeRight([1, 2, 3], 0);
			* // => []
			*/
			function takeRight(array, n, guard) {
				var length = array == null ? 0 : array.length;
				if (!length) return [];
				n = guard || n === undefined ? 1 : toInteger(n);
				n = length - n;
				return baseSlice(array, n < 0 ? 0 : n, length);
			}
			/**
			* Creates a slice of `array` with elements taken from the end. Elements are
			* taken until `predicate` returns falsey. The predicate is invoked with
			* three arguments: (value, index, array).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'active': true },
			*   { 'user': 'fred',    'active': false },
			*   { 'user': 'pebbles', 'active': false }
			* ];
			*
			* _.takeRightWhile(users, function(o) { return !o.active; });
			* // => objects for ['fred', 'pebbles']
			*
			* // The `_.matches` iteratee shorthand.
			* _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
			* // => objects for ['pebbles']
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.takeRightWhile(users, ['active', false]);
			* // => objects for ['fred', 'pebbles']
			*
			* // The `_.property` iteratee shorthand.
			* _.takeRightWhile(users, 'active');
			* // => []
			*/
			function takeRightWhile(array, predicate) {
				return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
			}
			/**
			* Creates a slice of `array` with elements taken from the beginning. Elements
			* are taken until `predicate` returns falsey. The predicate is invoked with
			* three arguments: (value, index, array).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Array
			* @param {Array} array The array to query.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the slice of `array`.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'active': false },
			*   { 'user': 'fred',    'active': false },
			*   { 'user': 'pebbles', 'active': true }
			* ];
			*
			* _.takeWhile(users, function(o) { return !o.active; });
			* // => objects for ['barney', 'fred']
			*
			* // The `_.matches` iteratee shorthand.
			* _.takeWhile(users, { 'user': 'barney', 'active': false });
			* // => objects for ['barney']
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.takeWhile(users, ['active', false]);
			* // => objects for ['barney', 'fred']
			*
			* // The `_.property` iteratee shorthand.
			* _.takeWhile(users, 'active');
			* // => []
			*/
			function takeWhile(array, predicate) {
				return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
			}
			/**
			* Creates an array of unique values, in order, from all given arrays using
			* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @returns {Array} Returns the new array of combined values.
			* @example
			*
			* _.union([2], [1, 2]);
			* // => [2, 1]
			*/
			var union = baseRest(function(arrays) {
				return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
			});
			/**
			* This method is like `_.union` except that it accepts `iteratee` which is
			* invoked for each element of each `arrays` to generate the criterion by
			* which uniqueness is computed. Result values are chosen from the first
			* array in which the value occurs. The iteratee is invoked with one argument:
			* (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {Array} Returns the new array of combined values.
			* @example
			*
			* _.unionBy([2.1], [1.2, 2.3], Math.floor);
			* // => [2.1, 1.2]
			*
			* // The `_.property` iteratee shorthand.
			* _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
			* // => [{ 'x': 1 }, { 'x': 2 }]
			*/
			var unionBy = baseRest(function(arrays) {
				var iteratee = last(arrays);
				if (isArrayLikeObject(iteratee)) iteratee = undefined;
				return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
			});
			/**
			* This method is like `_.union` except that it accepts `comparator` which
			* is invoked to compare elements of `arrays`. Result values are chosen from
			* the first array in which the value occurs. The comparator is invoked
			* with two arguments: (arrVal, othVal).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new array of combined values.
			* @example
			*
			* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
			* var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
			*
			* _.unionWith(objects, others, _.isEqual);
			* // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
			*/
			var unionWith = baseRest(function(arrays) {
				var comparator = last(arrays);
				comparator = typeof comparator == "function" ? comparator : undefined;
				return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
			});
			/**
			* Creates a duplicate-free version of an array, using
			* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons, in which only the first occurrence of each element
			* is kept. The order of result values is determined by the order they occur
			* in the array.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @returns {Array} Returns the new duplicate free array.
			* @example
			*
			* _.uniq([2, 1, 2]);
			* // => [2, 1]
			*/
			function uniq(array) {
				return array && array.length ? baseUniq(array) : [];
			}
			/**
			* This method is like `_.uniq` except that it accepts `iteratee` which is
			* invoked for each element in `array` to generate the criterion by which
			* uniqueness is computed. The order of result values is determined by the
			* order they occur in the array. The iteratee is invoked with one argument:
			* (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {Array} Returns the new duplicate free array.
			* @example
			*
			* _.uniqBy([2.1, 1.2, 2.3], Math.floor);
			* // => [2.1, 1.2]
			*
			* // The `_.property` iteratee shorthand.
			* _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
			* // => [{ 'x': 1 }, { 'x': 2 }]
			*/
			function uniqBy(array, iteratee) {
				return array && array.length ? baseUniq(array, getIteratee(iteratee, 2)) : [];
			}
			/**
			* This method is like `_.uniq` except that it accepts `comparator` which
			* is invoked to compare elements of `array`. The order of result values is
			* determined by the order they occur in the array.The comparator is invoked
			* with two arguments: (arrVal, othVal).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new duplicate free array.
			* @example
			*
			* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
			*
			* _.uniqWith(objects, _.isEqual);
			* // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
			*/
			function uniqWith(array, comparator) {
				comparator = typeof comparator == "function" ? comparator : undefined;
				return array && array.length ? baseUniq(array, undefined, comparator) : [];
			}
			/**
			* This method is like `_.zip` except that it accepts an array of grouped
			* elements and creates an array regrouping the elements to their pre-zip
			* configuration.
			*
			* @static
			* @memberOf _
			* @since 1.2.0
			* @category Array
			* @param {Array} array The array of grouped elements to process.
			* @returns {Array} Returns the new array of regrouped elements.
			* @example
			*
			* var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
			* // => [['a', 1, true], ['b', 2, false]]
			*
			* _.unzip(zipped);
			* // => [['a', 'b'], [1, 2], [true, false]]
			*/
			function unzip(array) {
				if (!(array && array.length)) return [];
				var length = 0;
				array = arrayFilter(array, function(group) {
					if (isArrayLikeObject(group)) {
						length = nativeMax(group.length, length);
						return true;
					}
				});
				return baseTimes(length, function(index) {
					return arrayMap(array, baseProperty(index));
				});
			}
			/**
			* This method is like `_.unzip` except that it accepts `iteratee` to specify
			* how regrouped values should be combined. The iteratee is invoked with the
			* elements of each group: (...group).
			*
			* @static
			* @memberOf _
			* @since 3.8.0
			* @category Array
			* @param {Array} array The array of grouped elements to process.
			* @param {Function} [iteratee=_.identity] The function to combine
			*  regrouped values.
			* @returns {Array} Returns the new array of regrouped elements.
			* @example
			*
			* var zipped = _.zip([1, 2], [10, 20], [100, 200]);
			* // => [[1, 10, 100], [2, 20, 200]]
			*
			* _.unzipWith(zipped, _.add);
			* // => [3, 30, 300]
			*/
			function unzipWith(array, iteratee) {
				if (!(array && array.length)) return [];
				var result = unzip(array);
				if (iteratee == null) return result;
				return arrayMap(result, function(group) {
					return apply(iteratee, undefined, group);
				});
			}
			/**
			* Creates an array excluding all given values using
			* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons.
			*
			* **Note:** Unlike `_.pull`, this method returns a new array.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to inspect.
			* @param {...*} [values] The values to exclude.
			* @returns {Array} Returns the new array of filtered values.
			* @see _.difference, _.xor
			* @example
			*
			* _.without([2, 1, 2, 3], 1, 2);
			* // => [3]
			*/
			var without = baseRest(function(array, values) {
				return isArrayLikeObject(array) ? baseDifference(array, values) : [];
			});
			/**
			* Creates an array of unique values that is the
			* [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
			* of the given arrays. The order of result values is determined by the order
			* they occur in the arrays.
			*
			* @static
			* @memberOf _
			* @since 2.4.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @returns {Array} Returns the new array of filtered values.
			* @see _.difference, _.without
			* @example
			*
			* _.xor([2, 1], [2, 3]);
			* // => [1, 3]
			*/
			var xor = baseRest(function(arrays) {
				return baseXor(arrayFilter(arrays, isArrayLikeObject));
			});
			/**
			* This method is like `_.xor` except that it accepts `iteratee` which is
			* invoked for each element of each `arrays` to generate the criterion by
			* which by which they're compared. The order of result values is determined
			* by the order they occur in the arrays. The iteratee is invoked with one
			* argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {Array} Returns the new array of filtered values.
			* @example
			*
			* _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
			* // => [1.2, 3.4]
			*
			* // The `_.property` iteratee shorthand.
			* _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
			* // => [{ 'x': 2 }]
			*/
			var xorBy = baseRest(function(arrays) {
				var iteratee = last(arrays);
				if (isArrayLikeObject(iteratee)) iteratee = undefined;
				return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
			});
			/**
			* This method is like `_.xor` except that it accepts `comparator` which is
			* invoked to compare elements of `arrays`. The order of result values is
			* determined by the order they occur in the arrays. The comparator is invoked
			* with two arguments: (arrVal, othVal).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Array
			* @param {...Array} [arrays] The arrays to inspect.
			* @param {Function} [comparator] The comparator invoked per element.
			* @returns {Array} Returns the new array of filtered values.
			* @example
			*
			* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
			* var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
			*
			* _.xorWith(objects, others, _.isEqual);
			* // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
			*/
			var xorWith = baseRest(function(arrays) {
				var comparator = last(arrays);
				comparator = typeof comparator == "function" ? comparator : undefined;
				return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
			});
			/**
			* Creates an array of grouped elements, the first of which contains the
			* first elements of the given arrays, the second of which contains the
			* second elements of the given arrays, and so on.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {...Array} [arrays] The arrays to process.
			* @returns {Array} Returns the new array of grouped elements.
			* @example
			*
			* _.zip(['a', 'b'], [1, 2], [true, false]);
			* // => [['a', 1, true], ['b', 2, false]]
			*/
			var zip = baseRest(unzip);
			/**
			* This method is like `_.fromPairs` except that it accepts two arrays,
			* one of property identifiers and one of corresponding values.
			*
			* @static
			* @memberOf _
			* @since 0.4.0
			* @category Array
			* @param {Array} [props=[]] The property identifiers.
			* @param {Array} [values=[]] The property values.
			* @returns {Object} Returns the new object.
			* @example
			*
			* _.zipObject(['a', 'b'], [1, 2]);
			* // => { 'a': 1, 'b': 2 }
			*/
			function zipObject(props, values) {
				return baseZipObject(props || [], values || [], assignValue);
			}
			/**
			* This method is like `_.zipObject` except that it supports property paths.
			*
			* @static
			* @memberOf _
			* @since 4.1.0
			* @category Array
			* @param {Array} [props=[]] The property identifiers.
			* @param {Array} [values=[]] The property values.
			* @returns {Object} Returns the new object.
			* @example
			*
			* _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
			* // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
			*/
			function zipObjectDeep(props, values) {
				return baseZipObject(props || [], values || [], baseSet);
			}
			/**
			* This method is like `_.zip` except that it accepts `iteratee` to specify
			* how grouped values should be combined. The iteratee is invoked with the
			* elements of each group: (...group).
			*
			* @static
			* @memberOf _
			* @since 3.8.0
			* @category Array
			* @param {...Array} [arrays] The arrays to process.
			* @param {Function} [iteratee=_.identity] The function to combine
			*  grouped values.
			* @returns {Array} Returns the new array of grouped elements.
			* @example
			*
			* _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
			*   return a + b + c;
			* });
			* // => [111, 222]
			*/
			var zipWith = baseRest(function(arrays) {
				var length = arrays.length, iteratee = length > 1 ? arrays[length - 1] : undefined;
				iteratee = typeof iteratee == "function" ? (arrays.pop(), iteratee) : undefined;
				return unzipWith(arrays, iteratee);
			});
			/**
			* Creates a `lodash` wrapper instance that wraps `value` with explicit method
			* chain sequences enabled. The result of such sequences must be unwrapped
			* with `_#value`.
			*
			* @static
			* @memberOf _
			* @since 1.3.0
			* @category Seq
			* @param {*} value The value to wrap.
			* @returns {Object} Returns the new `lodash` wrapper instance.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'age': 36 },
			*   { 'user': 'fred',    'age': 40 },
			*   { 'user': 'pebbles', 'age': 1 }
			* ];
			*
			* var youngest = _
			*   .chain(users)
			*   .sortBy('age')
			*   .map(function(o) {
			*     return o.user + ' is ' + o.age;
			*   })
			*   .head()
			*   .value();
			* // => 'pebbles is 1'
			*/
			function chain(value) {
				var result = lodash(value);
				result.__chain__ = true;
				return result;
			}
			/**
			* This method invokes `interceptor` and returns `value`. The interceptor
			* is invoked with one argument; (value). The purpose of this method is to
			* "tap into" a method chain sequence in order to modify intermediate results.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Seq
			* @param {*} value The value to provide to `interceptor`.
			* @param {Function} interceptor The function to invoke.
			* @returns {*} Returns `value`.
			* @example
			*
			* _([1, 2, 3])
			*  .tap(function(array) {
			*    // Mutate input array.
			*    array.pop();
			*  })
			*  .reverse()
			*  .value();
			* // => [2, 1]
			*/
			function tap(value, interceptor) {
				interceptor(value);
				return value;
			}
			/**
			* This method is like `_.tap` except that it returns the result of `interceptor`.
			* The purpose of this method is to "pass thru" values replacing intermediate
			* results in a method chain sequence.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Seq
			* @param {*} value The value to provide to `interceptor`.
			* @param {Function} interceptor The function to invoke.
			* @returns {*} Returns the result of `interceptor`.
			* @example
			*
			* _('  abc  ')
			*  .chain()
			*  .trim()
			*  .thru(function(value) {
			*    return [value];
			*  })
			*  .value();
			* // => ['abc']
			*/
			function thru(value, interceptor) {
				return interceptor(value);
			}
			/**
			* This method is the wrapper version of `_.at`.
			*
			* @name at
			* @memberOf _
			* @since 1.0.0
			* @category Seq
			* @param {...(string|string[])} [paths] The property paths to pick.
			* @returns {Object} Returns the new `lodash` wrapper instance.
			* @example
			*
			* var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
			*
			* _(object).at(['a[0].b.c', 'a[1]']).value();
			* // => [3, 4]
			*/
			var wrapperAt = flatRest(function(paths) {
				var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
					return baseAt(object, paths);
				};
				if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) return this.thru(interceptor);
				value = value.slice(start, +start + (length ? 1 : 0));
				value.__actions__.push({
					"func": thru,
					"args": [interceptor],
					"thisArg": undefined
				});
				return new LodashWrapper(value, this.__chain__).thru(function(array) {
					if (length && !array.length) array.push(undefined);
					return array;
				});
			});
			/**
			* Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
			*
			* @name chain
			* @memberOf _
			* @since 0.1.0
			* @category Seq
			* @returns {Object} Returns the new `lodash` wrapper instance.
			* @example
			*
			* var users = [
			*   { 'user': 'barney', 'age': 36 },
			*   { 'user': 'fred',   'age': 40 }
			* ];
			*
			* // A sequence without explicit chaining.
			* _(users).head();
			* // => { 'user': 'barney', 'age': 36 }
			*
			* // A sequence with explicit chaining.
			* _(users)
			*   .chain()
			*   .head()
			*   .pick('user')
			*   .value();
			* // => { 'user': 'barney' }
			*/
			function wrapperChain() {
				return chain(this);
			}
			/**
			* Executes the chain sequence and returns the wrapped result.
			*
			* @name commit
			* @memberOf _
			* @since 3.2.0
			* @category Seq
			* @returns {Object} Returns the new `lodash` wrapper instance.
			* @example
			*
			* var array = [1, 2];
			* var wrapped = _(array).push(3);
			*
			* console.log(array);
			* // => [1, 2]
			*
			* wrapped = wrapped.commit();
			* console.log(array);
			* // => [1, 2, 3]
			*
			* wrapped.last();
			* // => 3
			*
			* console.log(array);
			* // => [1, 2, 3]
			*/
			function wrapperCommit() {
				return new LodashWrapper(this.value(), this.__chain__);
			}
			/**
			* Gets the next value on a wrapped object following the
			* [iterator protocol](https://mdn.io/iteration_protocols#iterator).
			*
			* @name next
			* @memberOf _
			* @since 4.0.0
			* @category Seq
			* @returns {Object} Returns the next iterator value.
			* @example
			*
			* var wrapped = _([1, 2]);
			*
			* wrapped.next();
			* // => { 'done': false, 'value': 1 }
			*
			* wrapped.next();
			* // => { 'done': false, 'value': 2 }
			*
			* wrapped.next();
			* // => { 'done': true, 'value': undefined }
			*/
			function wrapperNext() {
				if (this.__values__ === undefined) this.__values__ = toArray(this.value());
				var done = this.__index__ >= this.__values__.length;
				return {
					"done": done,
					"value": done ? undefined : this.__values__[this.__index__++]
				};
			}
			/**
			* Enables the wrapper to be iterable.
			*
			* @name Symbol.iterator
			* @memberOf _
			* @since 4.0.0
			* @category Seq
			* @returns {Object} Returns the wrapper object.
			* @example
			*
			* var wrapped = _([1, 2]);
			*
			* wrapped[Symbol.iterator]() === wrapped;
			* // => true
			*
			* Array.from(wrapped);
			* // => [1, 2]
			*/
			function wrapperToIterator() {
				return this;
			}
			/**
			* Creates a clone of the chain sequence planting `value` as the wrapped value.
			*
			* @name plant
			* @memberOf _
			* @since 3.2.0
			* @category Seq
			* @param {*} value The value to plant.
			* @returns {Object} Returns the new `lodash` wrapper instance.
			* @example
			*
			* function square(n) {
			*   return n * n;
			* }
			*
			* var wrapped = _([1, 2]).map(square);
			* var other = wrapped.plant([3, 4]);
			*
			* other.value();
			* // => [9, 16]
			*
			* wrapped.value();
			* // => [1, 4]
			*/
			function wrapperPlant(value) {
				var result, parent = this;
				while (parent instanceof baseLodash) {
					var clone = wrapperClone(parent);
					clone.__index__ = 0;
					clone.__values__ = undefined;
					if (result) previous.__wrapped__ = clone;
					else result = clone;
					var previous = clone;
					parent = parent.__wrapped__;
				}
				previous.__wrapped__ = value;
				return result;
			}
			/**
			* This method is the wrapper version of `_.reverse`.
			*
			* **Note:** This method mutates the wrapped array.
			*
			* @name reverse
			* @memberOf _
			* @since 0.1.0
			* @category Seq
			* @returns {Object} Returns the new `lodash` wrapper instance.
			* @example
			*
			* var array = [1, 2, 3];
			*
			* _(array).reverse().value()
			* // => [3, 2, 1]
			*
			* console.log(array);
			* // => [3, 2, 1]
			*/
			function wrapperReverse() {
				var value = this.__wrapped__;
				if (value instanceof LazyWrapper) {
					var wrapped = value;
					if (this.__actions__.length) wrapped = new LazyWrapper(this);
					wrapped = wrapped.reverse();
					wrapped.__actions__.push({
						"func": thru,
						"args": [reverse],
						"thisArg": undefined
					});
					return new LodashWrapper(wrapped, this.__chain__);
				}
				return this.thru(reverse);
			}
			/**
			* Executes the chain sequence to resolve the unwrapped value.
			*
			* @name value
			* @memberOf _
			* @since 0.1.0
			* @alias toJSON, valueOf
			* @category Seq
			* @returns {*} Returns the resolved unwrapped value.
			* @example
			*
			* _([1, 2, 3]).value();
			* // => [1, 2, 3]
			*/
			function wrapperValue() {
				return baseWrapperValue(this.__wrapped__, this.__actions__);
			}
			/**
			* Creates an object composed of keys generated from the results of running
			* each element of `collection` thru `iteratee`. The corresponding value of
			* each key is the number of times the key was returned by `iteratee`. The
			* iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 0.5.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The iteratee to transform keys.
			* @returns {Object} Returns the composed aggregate object.
			* @example
			*
			* _.countBy([6.1, 4.2, 6.3], Math.floor);
			* // => { '4': 1, '6': 2 }
			*
			* // The `_.property` iteratee shorthand.
			* _.countBy(['one', 'two', 'three'], 'length');
			* // => { '3': 2, '5': 1 }
			*/
			var countBy = createAggregator(function(result, value, key) {
				if (hasOwnProperty.call(result, key)) ++result[key];
				else baseAssignValue(result, key, 1);
			});
			/**
			* Checks if `predicate` returns truthy for **all** elements of `collection`.
			* Iteration is stopped once `predicate` returns falsey. The predicate is
			* invoked with three arguments: (value, index|key, collection).
			*
			* **Note:** This method returns `true` for
			* [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
			* [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
			* elements of empty collections.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {boolean} Returns `true` if all elements pass the predicate check,
			*  else `false`.
			* @example
			*
			* _.every([true, 1, null, 'yes'], Boolean);
			* // => false
			*
			* var users = [
			*   { 'user': 'barney', 'age': 36, 'active': false },
			*   { 'user': 'fred',   'age': 40, 'active': false }
			* ];
			*
			* // The `_.matches` iteratee shorthand.
			* _.every(users, { 'user': 'barney', 'active': false });
			* // => false
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.every(users, ['active', false]);
			* // => true
			*
			* // The `_.property` iteratee shorthand.
			* _.every(users, 'active');
			* // => false
			*/
			function every(collection, predicate, guard) {
				var func = isArray(collection) ? arrayEvery : baseEvery;
				if (guard && isIterateeCall(collection, predicate, guard)) predicate = undefined;
				return func(collection, getIteratee(predicate, 3));
			}
			/**
			* Iterates over elements of `collection`, returning an array of all elements
			* `predicate` returns truthy for. The predicate is invoked with three
			* arguments: (value, index|key, collection).
			*
			* **Note:** Unlike `_.remove`, this method returns a new array.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the new filtered array.
			* @see _.reject
			* @example
			*
			* var users = [
			*   { 'user': 'barney', 'age': 36, 'active': true },
			*   { 'user': 'fred',   'age': 40, 'active': false }
			* ];
			*
			* _.filter(users, function(o) { return !o.active; });
			* // => objects for ['fred']
			*
			* // The `_.matches` iteratee shorthand.
			* _.filter(users, { 'age': 36, 'active': true });
			* // => objects for ['barney']
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.filter(users, ['active', false]);
			* // => objects for ['fred']
			*
			* // The `_.property` iteratee shorthand.
			* _.filter(users, 'active');
			* // => objects for ['barney']
			*
			* // Combining several predicates using `_.overEvery` or `_.overSome`.
			* _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
			* // => objects for ['fred', 'barney']
			*/
			function filter(collection, predicate) {
				return (isArray(collection) ? arrayFilter : baseFilter)(collection, getIteratee(predicate, 3));
			}
			/**
			* Iterates over elements of `collection`, returning the first element
			* `predicate` returns truthy for. The predicate is invoked with three
			* arguments: (value, index|key, collection).
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to inspect.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @param {number} [fromIndex=0] The index to search from.
			* @returns {*} Returns the matched element, else `undefined`.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'age': 36, 'active': true },
			*   { 'user': 'fred',    'age': 40, 'active': false },
			*   { 'user': 'pebbles', 'age': 1,  'active': true }
			* ];
			*
			* _.find(users, function(o) { return o.age < 40; });
			* // => object for 'barney'
			*
			* // The `_.matches` iteratee shorthand.
			* _.find(users, { 'age': 1, 'active': true });
			* // => object for 'pebbles'
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.find(users, ['active', false]);
			* // => object for 'fred'
			*
			* // The `_.property` iteratee shorthand.
			* _.find(users, 'active');
			* // => object for 'barney'
			*/
			var find = createFind(findIndex);
			/**
			* This method is like `_.find` except that it iterates over elements of
			* `collection` from right to left.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Collection
			* @param {Array|Object} collection The collection to inspect.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @param {number} [fromIndex=collection.length-1] The index to search from.
			* @returns {*} Returns the matched element, else `undefined`.
			* @example
			*
			* _.findLast([1, 2, 3, 4], function(n) {
			*   return n % 2 == 1;
			* });
			* // => 3
			*/
			var findLast = createFind(findLastIndex);
			/**
			* Creates a flattened array of values by running each element in `collection`
			* thru `iteratee` and flattening the mapped results. The iteratee is invoked
			* with three arguments: (value, index|key, collection).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the new flattened array.
			* @example
			*
			* function duplicate(n) {
			*   return [n, n];
			* }
			*
			* _.flatMap([1, 2], duplicate);
			* // => [1, 1, 2, 2]
			*/
			function flatMap(collection, iteratee) {
				return baseFlatten(map(collection, iteratee), 1);
			}
			/**
			* This method is like `_.flatMap` except that it recursively flattens the
			* mapped results.
			*
			* @static
			* @memberOf _
			* @since 4.7.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the new flattened array.
			* @example
			*
			* function duplicate(n) {
			*   return [[[n, n]]];
			* }
			*
			* _.flatMapDeep([1, 2], duplicate);
			* // => [1, 1, 2, 2]
			*/
			function flatMapDeep(collection, iteratee) {
				return baseFlatten(map(collection, iteratee), INFINITY);
			}
			/**
			* This method is like `_.flatMap` except that it recursively flattens the
			* mapped results up to `depth` times.
			*
			* @static
			* @memberOf _
			* @since 4.7.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @param {number} [depth=1] The maximum recursion depth.
			* @returns {Array} Returns the new flattened array.
			* @example
			*
			* function duplicate(n) {
			*   return [[[n, n]]];
			* }
			*
			* _.flatMapDepth([1, 2], duplicate, 2);
			* // => [[1, 1], [2, 2]]
			*/
			function flatMapDepth(collection, iteratee, depth) {
				depth = depth === undefined ? 1 : toInteger(depth);
				return baseFlatten(map(collection, iteratee), depth);
			}
			/**
			* Iterates over elements of `collection` and invokes `iteratee` for each element.
			* The iteratee is invoked with three arguments: (value, index|key, collection).
			* Iteratee functions may exit iteration early by explicitly returning `false`.
			*
			* **Note:** As with other "Collections" methods, objects with a "length"
			* property are iterated like arrays. To avoid this behavior use `_.forIn`
			* or `_.forOwn` for object iteration.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @alias each
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Array|Object} Returns `collection`.
			* @see _.forEachRight
			* @example
			*
			* _.forEach([1, 2], function(value) {
			*   console.log(value);
			* });
			* // => Logs `1` then `2`.
			*
			* _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
			*   console.log(key);
			* });
			* // => Logs 'a' then 'b' (iteration order is not guaranteed).
			*/
			function forEach(collection, iteratee) {
				return (isArray(collection) ? arrayEach : baseEach)(collection, getIteratee(iteratee, 3));
			}
			/**
			* This method is like `_.forEach` except that it iterates over elements of
			* `collection` from right to left.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @alias eachRight
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Array|Object} Returns `collection`.
			* @see _.forEach
			* @example
			*
			* _.forEachRight([1, 2], function(value) {
			*   console.log(value);
			* });
			* // => Logs `2` then `1`.
			*/
			function forEachRight(collection, iteratee) {
				return (isArray(collection) ? arrayEachRight : baseEachRight)(collection, getIteratee(iteratee, 3));
			}
			/**
			* Creates an object composed of keys generated from the results of running
			* each element of `collection` thru `iteratee`. The order of grouped values
			* is determined by the order they occur in `collection`. The corresponding
			* value of each key is an array of elements responsible for generating the
			* key. The iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The iteratee to transform keys.
			* @returns {Object} Returns the composed aggregate object.
			* @example
			*
			* _.groupBy([6.1, 4.2, 6.3], Math.floor);
			* // => { '4': [4.2], '6': [6.1, 6.3] }
			*
			* // The `_.property` iteratee shorthand.
			* _.groupBy(['one', 'two', 'three'], 'length');
			* // => { '3': ['one', 'two'], '5': ['three'] }
			*/
			var groupBy = createAggregator(function(result, value, key) {
				if (hasOwnProperty.call(result, key)) result[key].push(value);
				else baseAssignValue(result, key, [value]);
			});
			/**
			* Checks if `value` is in `collection`. If `collection` is a string, it's
			* checked for a substring of `value`, otherwise
			* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* is used for equality comparisons. If `fromIndex` is negative, it's used as
			* the offset from the end of `collection`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object|string} collection The collection to inspect.
			* @param {*} value The value to search for.
			* @param {number} [fromIndex=0] The index to search from.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
			* @returns {boolean} Returns `true` if `value` is found, else `false`.
			* @example
			*
			* _.includes([1, 2, 3], 1);
			* // => true
			*
			* _.includes([1, 2, 3], 1, 2);
			* // => false
			*
			* _.includes({ 'a': 1, 'b': 2 }, 1);
			* // => true
			*
			* _.includes('abcd', 'bc');
			* // => true
			*/
			function includes(collection, value, fromIndex, guard) {
				collection = isArrayLike(collection) ? collection : values(collection);
				fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
				var length = collection.length;
				if (fromIndex < 0) fromIndex = nativeMax(length + fromIndex, 0);
				return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
			}
			/**
			* Invokes the method at `path` of each element in `collection`, returning
			* an array of the results of each invoked method. Any additional arguments
			* are provided to each invoked method. If `path` is a function, it's invoked
			* for, and `this` bound to, each element in `collection`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Array|Function|string} path The path of the method to invoke or
			*  the function invoked per iteration.
			* @param {...*} [args] The arguments to invoke each method with.
			* @returns {Array} Returns the array of results.
			* @example
			*
			* _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
			* // => [[1, 5, 7], [1, 2, 3]]
			*
			* _.invokeMap([123, 456], String.prototype.split, '');
			* // => [['1', '2', '3'], ['4', '5', '6']]
			*/
			var invokeMap = baseRest(function(collection, path, args) {
				var index = -1, isFunc = typeof path == "function", result = isArrayLike(collection) ? Array(collection.length) : [];
				baseEach(collection, function(value) {
					result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
				});
				return result;
			});
			/**
			* Creates an object composed of keys generated from the results of running
			* each element of `collection` thru `iteratee`. The corresponding value of
			* each key is the last element responsible for generating the key. The
			* iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The iteratee to transform keys.
			* @returns {Object} Returns the composed aggregate object.
			* @example
			*
			* var array = [
			*   { 'dir': 'left', 'code': 97 },
			*   { 'dir': 'right', 'code': 100 }
			* ];
			*
			* _.keyBy(array, function(o) {
			*   return String.fromCharCode(o.code);
			* });
			* // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
			*
			* _.keyBy(array, 'dir');
			* // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
			*/
			var keyBy = createAggregator(function(result, value, key) {
				baseAssignValue(result, key, value);
			});
			/**
			* Creates an array of values by running each element in `collection` thru
			* `iteratee`. The iteratee is invoked with three arguments:
			* (value, index|key, collection).
			*
			* Many lodash methods are guarded to work as iteratees for methods like
			* `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
			*
			* The guarded methods are:
			* `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
			* `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
			* `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
			* `template`, `trim`, `trimEnd`, `trimStart`, and `words`
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the new mapped array.
			* @example
			*
			* function square(n) {
			*   return n * n;
			* }
			*
			* _.map([4, 8], square);
			* // => [16, 64]
			*
			* _.map({ 'a': 4, 'b': 8 }, square);
			* // => [16, 64] (iteration order is not guaranteed)
			*
			* var users = [
			*   { 'user': 'barney' },
			*   { 'user': 'fred' }
			* ];
			*
			* // The `_.property` iteratee shorthand.
			* _.map(users, 'user');
			* // => ['barney', 'fred']
			*/
			function map(collection, iteratee) {
				return (isArray(collection) ? arrayMap : baseMap)(collection, getIteratee(iteratee, 3));
			}
			/**
			* This method is like `_.sortBy` except that it allows specifying the sort
			* orders of the iteratees to sort by. If `orders` is unspecified, all values
			* are sorted in ascending order. Otherwise, specify an order of "desc" for
			* descending or "asc" for ascending sort order of corresponding values.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
			*  The iteratees to sort by.
			* @param {string[]} [orders] The sort orders of `iteratees`.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
			* @returns {Array} Returns the new sorted array.
			* @example
			*
			* var users = [
			*   { 'user': 'fred',   'age': 48 },
			*   { 'user': 'barney', 'age': 34 },
			*   { 'user': 'fred',   'age': 40 },
			*   { 'user': 'barney', 'age': 36 }
			* ];
			*
			* // Sort by `user` in ascending order and by `age` in descending order.
			* _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
			* // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
			*/
			function orderBy(collection, iteratees, orders, guard) {
				if (collection == null) return [];
				if (!isArray(iteratees)) iteratees = iteratees == null ? [] : [iteratees];
				orders = guard ? undefined : orders;
				if (!isArray(orders)) orders = orders == null ? [] : [orders];
				return baseOrderBy(collection, iteratees, orders);
			}
			/**
			* Creates an array of elements split into two groups, the first of which
			* contains elements `predicate` returns truthy for, the second of which
			* contains elements `predicate` returns falsey for. The predicate is
			* invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the array of grouped elements.
			* @example
			*
			* var users = [
			*   { 'user': 'barney',  'age': 36, 'active': false },
			*   { 'user': 'fred',    'age': 40, 'active': true },
			*   { 'user': 'pebbles', 'age': 1,  'active': false }
			* ];
			*
			* _.partition(users, function(o) { return o.active; });
			* // => objects for [['fred'], ['barney', 'pebbles']]
			*
			* // The `_.matches` iteratee shorthand.
			* _.partition(users, { 'age': 1, 'active': false });
			* // => objects for [['pebbles'], ['barney', 'fred']]
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.partition(users, ['active', false]);
			* // => objects for [['barney', 'pebbles'], ['fred']]
			*
			* // The `_.property` iteratee shorthand.
			* _.partition(users, 'active');
			* // => objects for [['fred'], ['barney', 'pebbles']]
			*/
			var partition = createAggregator(function(result, value, key) {
				result[key ? 0 : 1].push(value);
			}, function() {
				return [[], []];
			});
			/**
			* Reduces `collection` to a value which is the accumulated result of running
			* each element in `collection` thru `iteratee`, where each successive
			* invocation is supplied the return value of the previous. If `accumulator`
			* is not given, the first element of `collection` is used as the initial
			* value. The iteratee is invoked with four arguments:
			* (accumulator, value, index|key, collection).
			*
			* Many lodash methods are guarded to work as iteratees for methods like
			* `_.reduce`, `_.reduceRight`, and `_.transform`.
			*
			* The guarded methods are:
			* `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
			* and `sortBy`
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @param {*} [accumulator] The initial value.
			* @returns {*} Returns the accumulated value.
			* @see _.reduceRight
			* @example
			*
			* _.reduce([1, 2], function(sum, n) {
			*   return sum + n;
			* }, 0);
			* // => 3
			*
			* _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
			*   (result[value] || (result[value] = [])).push(key);
			*   return result;
			* }, {});
			* // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
			*/
			function reduce(collection, iteratee, accumulator) {
				var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
				return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
			}
			/**
			* This method is like `_.reduce` except that it iterates over elements of
			* `collection` from right to left.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @param {*} [accumulator] The initial value.
			* @returns {*} Returns the accumulated value.
			* @see _.reduce
			* @example
			*
			* var array = [[0, 1], [2, 3], [4, 5]];
			*
			* _.reduceRight(array, function(flattened, other) {
			*   return flattened.concat(other);
			* }, []);
			* // => [4, 5, 2, 3, 0, 1]
			*/
			function reduceRight(collection, iteratee, accumulator) {
				var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
				return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
			}
			/**
			* The opposite of `_.filter`; this method returns the elements of `collection`
			* that `predicate` does **not** return truthy for.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the new filtered array.
			* @see _.filter
			* @example
			*
			* var users = [
			*   { 'user': 'barney', 'age': 36, 'active': false },
			*   { 'user': 'fred',   'age': 40, 'active': true }
			* ];
			*
			* _.reject(users, function(o) { return !o.active; });
			* // => objects for ['fred']
			*
			* // The `_.matches` iteratee shorthand.
			* _.reject(users, { 'age': 40, 'active': true });
			* // => objects for ['barney']
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.reject(users, ['active', false]);
			* // => objects for ['fred']
			*
			* // The `_.property` iteratee shorthand.
			* _.reject(users, 'active');
			* // => objects for ['barney']
			*/
			function reject(collection, predicate) {
				return (isArray(collection) ? arrayFilter : baseFilter)(collection, negate(getIteratee(predicate, 3)));
			}
			/**
			* Gets a random element from `collection`.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Collection
			* @param {Array|Object} collection The collection to sample.
			* @returns {*} Returns the random element.
			* @example
			*
			* _.sample([1, 2, 3, 4]);
			* // => 2
			*/
			function sample(collection) {
				return (isArray(collection) ? arraySample : baseSample)(collection);
			}
			/**
			* Gets `n` random elements at unique keys from `collection` up to the
			* size of `collection`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Collection
			* @param {Array|Object} collection The collection to sample.
			* @param {number} [n=1] The number of elements to sample.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Array} Returns the random elements.
			* @example
			*
			* _.sampleSize([1, 2, 3], 2);
			* // => [3, 1]
			*
			* _.sampleSize([1, 2, 3], 4);
			* // => [2, 3, 1]
			*/
			function sampleSize(collection, n, guard) {
				if (guard ? isIterateeCall(collection, n, guard) : n === undefined) n = 1;
				else n = toInteger(n);
				return (isArray(collection) ? arraySampleSize : baseSampleSize)(collection, n);
			}
			/**
			* Creates an array of shuffled values, using a version of the
			* [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to shuffle.
			* @returns {Array} Returns the new shuffled array.
			* @example
			*
			* _.shuffle([1, 2, 3, 4]);
			* // => [4, 1, 3, 2]
			*/
			function shuffle(collection) {
				return (isArray(collection) ? arrayShuffle : baseShuffle)(collection);
			}
			/**
			* Gets the size of `collection` by returning its length for array-like
			* values or the number of own enumerable string keyed properties for objects.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object|string} collection The collection to inspect.
			* @returns {number} Returns the collection size.
			* @example
			*
			* _.size([1, 2, 3]);
			* // => 3
			*
			* _.size({ 'a': 1, 'b': 2 });
			* // => 2
			*
			* _.size('pebbles');
			* // => 7
			*/
			function size(collection) {
				if (collection == null) return 0;
				if (isArrayLike(collection)) return isString(collection) ? stringSize(collection) : collection.length;
				var tag = getTag(collection);
				if (tag == mapTag || tag == setTag) return collection.size;
				return baseKeys(collection).length;
			}
			/**
			* Checks if `predicate` returns truthy for **any** element of `collection`.
			* Iteration is stopped once `predicate` returns truthy. The predicate is
			* invoked with three arguments: (value, index|key, collection).
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {boolean} Returns `true` if any element passes the predicate check,
			*  else `false`.
			* @example
			*
			* _.some([null, 0, 'yes', false], Boolean);
			* // => true
			*
			* var users = [
			*   { 'user': 'barney', 'active': true },
			*   { 'user': 'fred',   'active': false }
			* ];
			*
			* // The `_.matches` iteratee shorthand.
			* _.some(users, { 'user': 'barney', 'active': false });
			* // => false
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.some(users, ['active', false]);
			* // => true
			*
			* // The `_.property` iteratee shorthand.
			* _.some(users, 'active');
			* // => true
			*/
			function some(collection, predicate, guard) {
				var func = isArray(collection) ? arraySome : baseSome;
				if (guard && isIterateeCall(collection, predicate, guard)) predicate = undefined;
				return func(collection, getIteratee(predicate, 3));
			}
			/**
			* Creates an array of elements, sorted in ascending order by the results of
			* running each element in a collection thru each iteratee. This method
			* performs a stable sort, that is, it preserves the original sort order of
			* equal elements. The iteratees are invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Collection
			* @param {Array|Object} collection The collection to iterate over.
			* @param {...(Function|Function[])} [iteratees=[_.identity]]
			*  The iteratees to sort by.
			* @returns {Array} Returns the new sorted array.
			* @example
			*
			* var users = [
			*   { 'user': 'fred',   'age': 48 },
			*   { 'user': 'barney', 'age': 36 },
			*   { 'user': 'fred',   'age': 30 },
			*   { 'user': 'barney', 'age': 34 }
			* ];
			*
			* _.sortBy(users, [function(o) { return o.user; }]);
			* // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
			*
			* _.sortBy(users, ['user', 'age']);
			* // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
			*/
			var sortBy = baseRest(function(collection, iteratees) {
				if (collection == null) return [];
				var length = iteratees.length;
				if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) iteratees = [];
				else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) iteratees = [iteratees[0]];
				return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
			});
			/**
			* Gets the timestamp of the number of milliseconds that have elapsed since
			* the Unix epoch (1 January 1970 00:00:00 UTC).
			*
			* @static
			* @memberOf _
			* @since 2.4.0
			* @category Date
			* @returns {number} Returns the timestamp.
			* @example
			*
			* _.defer(function(stamp) {
			*   console.log(_.now() - stamp);
			* }, _.now());
			* // => Logs the number of milliseconds it took for the deferred invocation.
			*/
			var now = ctxNow || function() {
				return root.Date.now();
			};
			/**
			* The opposite of `_.before`; this method creates a function that invokes
			* `func` once it's called `n` or more times.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {number} n The number of calls before `func` is invoked.
			* @param {Function} func The function to restrict.
			* @returns {Function} Returns the new restricted function.
			* @example
			*
			* var saves = ['profile', 'settings'];
			*
			* var done = _.after(saves.length, function() {
			*   console.log('done saving!');
			* });
			*
			* _.forEach(saves, function(type) {
			*   asyncSave({ 'type': type, 'complete': done });
			* });
			* // => Logs 'done saving!' after the two async saves have completed.
			*/
			function after(n, func) {
				if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				n = toInteger(n);
				return function() {
					if (--n < 1) return func.apply(this, arguments);
				};
			}
			/**
			* Creates a function that invokes `func`, with up to `n` arguments,
			* ignoring any additional arguments.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Function
			* @param {Function} func The function to cap arguments for.
			* @param {number} [n=func.length] The arity cap.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Function} Returns the new capped function.
			* @example
			*
			* _.map(['6', '8', '10'], _.ary(parseInt, 1));
			* // => [6, 8, 10]
			*/
			function ary(func, n, guard) {
				n = guard ? undefined : n;
				n = func && n == null ? func.length : n;
				return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
			}
			/**
			* Creates a function that invokes `func`, with the `this` binding and arguments
			* of the created function, while it's called less than `n` times. Subsequent
			* calls to the created function return the result of the last `func` invocation.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Function
			* @param {number} n The number of calls at which `func` is no longer invoked.
			* @param {Function} func The function to restrict.
			* @returns {Function} Returns the new restricted function.
			* @example
			*
			* jQuery(element).on('click', _.before(5, addContactToList));
			* // => Allows adding up to 4 contacts to the list.
			*/
			function before(n, func) {
				var result;
				if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				n = toInteger(n);
				return function() {
					if (--n > 0) result = func.apply(this, arguments);
					if (n <= 1) func = undefined;
					return result;
				};
			}
			/**
			* Creates a function that invokes `func` with the `this` binding of `thisArg`
			* and `partials` prepended to the arguments it receives.
			*
			* The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
			* may be used as a placeholder for partially applied arguments.
			*
			* **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
			* property of bound functions.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {Function} func The function to bind.
			* @param {*} thisArg The `this` binding of `func`.
			* @param {...*} [partials] The arguments to be partially applied.
			* @returns {Function} Returns the new bound function.
			* @example
			*
			* function greet(greeting, punctuation) {
			*   return greeting + ' ' + this.user + punctuation;
			* }
			*
			* var object = { 'user': 'fred' };
			*
			* var bound = _.bind(greet, object, 'hi');
			* bound('!');
			* // => 'hi fred!'
			*
			* // Bound with placeholders.
			* var bound = _.bind(greet, object, _, '!');
			* bound('hi');
			* // => 'hi fred!'
			*/
			var bind = baseRest(function(func, thisArg, partials) {
				var bitmask = WRAP_BIND_FLAG;
				if (partials.length) {
					var holders = replaceHolders(partials, getHolder(bind));
					bitmask |= WRAP_PARTIAL_FLAG;
				}
				return createWrap(func, bitmask, thisArg, partials, holders);
			});
			/**
			* Creates a function that invokes the method at `object[key]` with `partials`
			* prepended to the arguments it receives.
			*
			* This method differs from `_.bind` by allowing bound functions to reference
			* methods that may be redefined or don't yet exist. See
			* [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
			* for more details.
			*
			* The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
			* builds, may be used as a placeholder for partially applied arguments.
			*
			* @static
			* @memberOf _
			* @since 0.10.0
			* @category Function
			* @param {Object} object The object to invoke the method on.
			* @param {string} key The key of the method.
			* @param {...*} [partials] The arguments to be partially applied.
			* @returns {Function} Returns the new bound function.
			* @example
			*
			* var object = {
			*   'user': 'fred',
			*   'greet': function(greeting, punctuation) {
			*     return greeting + ' ' + this.user + punctuation;
			*   }
			* };
			*
			* var bound = _.bindKey(object, 'greet', 'hi');
			* bound('!');
			* // => 'hi fred!'
			*
			* object.greet = function(greeting, punctuation) {
			*   return greeting + 'ya ' + this.user + punctuation;
			* };
			*
			* bound('!');
			* // => 'hiya fred!'
			*
			* // Bound with placeholders.
			* var bound = _.bindKey(object, 'greet', _, '!');
			* bound('hi');
			* // => 'hiya fred!'
			*/
			var bindKey = baseRest(function(object, key, partials) {
				var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
				if (partials.length) {
					var holders = replaceHolders(partials, getHolder(bindKey));
					bitmask |= WRAP_PARTIAL_FLAG;
				}
				return createWrap(key, bitmask, object, partials, holders);
			});
			/**
			* Creates a function that accepts arguments of `func` and either invokes
			* `func` returning its result, if at least `arity` number of arguments have
			* been provided, or returns a function that accepts the remaining `func`
			* arguments, and so on. The arity of `func` may be specified if `func.length`
			* is not sufficient.
			*
			* The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
			* may be used as a placeholder for provided arguments.
			*
			* **Note:** This method doesn't set the "length" property of curried functions.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Function
			* @param {Function} func The function to curry.
			* @param {number} [arity=func.length] The arity of `func`.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Function} Returns the new curried function.
			* @example
			*
			* var abc = function(a, b, c) {
			*   return [a, b, c];
			* };
			*
			* var curried = _.curry(abc);
			*
			* curried(1)(2)(3);
			* // => [1, 2, 3]
			*
			* curried(1, 2)(3);
			* // => [1, 2, 3]
			*
			* curried(1, 2, 3);
			* // => [1, 2, 3]
			*
			* // Curried with placeholders.
			* curried(1)(_, 3)(2);
			* // => [1, 2, 3]
			*/
			function curry(func, arity, guard) {
				arity = guard ? undefined : arity;
				var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
				result.placeholder = curry.placeholder;
				return result;
			}
			/**
			* This method is like `_.curry` except that arguments are applied to `func`
			* in the manner of `_.partialRight` instead of `_.partial`.
			*
			* The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
			* builds, may be used as a placeholder for provided arguments.
			*
			* **Note:** This method doesn't set the "length" property of curried functions.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Function
			* @param {Function} func The function to curry.
			* @param {number} [arity=func.length] The arity of `func`.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Function} Returns the new curried function.
			* @example
			*
			* var abc = function(a, b, c) {
			*   return [a, b, c];
			* };
			*
			* var curried = _.curryRight(abc);
			*
			* curried(3)(2)(1);
			* // => [1, 2, 3]
			*
			* curried(2, 3)(1);
			* // => [1, 2, 3]
			*
			* curried(1, 2, 3);
			* // => [1, 2, 3]
			*
			* // Curried with placeholders.
			* curried(3)(1, _)(2);
			* // => [1, 2, 3]
			*/
			function curryRight(func, arity, guard) {
				arity = guard ? undefined : arity;
				var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
				result.placeholder = curryRight.placeholder;
				return result;
			}
			/**
			* Creates a debounced function that delays invoking `func` until after `wait`
			* milliseconds have elapsed since the last time the debounced function was
			* invoked. The debounced function comes with a `cancel` method to cancel
			* delayed `func` invocations and a `flush` method to immediately invoke them.
			* Provide `options` to indicate whether `func` should be invoked on the
			* leading and/or trailing edge of the `wait` timeout. The `func` is invoked
			* with the last arguments provided to the debounced function. Subsequent
			* calls to the debounced function return the result of the last `func`
			* invocation.
			*
			* **Note:** If `leading` and `trailing` options are `true`, `func` is
			* invoked on the trailing edge of the timeout only if the debounced function
			* is invoked more than once during the `wait` timeout.
			*
			* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
			* until to the next tick, similar to `setTimeout` with a timeout of `0`.
			*
			* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
			* for details over the differences between `_.debounce` and `_.throttle`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {Function} func The function to debounce.
			* @param {number} [wait=0] The number of milliseconds to delay.
			* @param {Object} [options={}] The options object.
			* @param {boolean} [options.leading=false]
			*  Specify invoking on the leading edge of the timeout.
			* @param {number} [options.maxWait]
			*  The maximum time `func` is allowed to be delayed before it's invoked.
			* @param {boolean} [options.trailing=true]
			*  Specify invoking on the trailing edge of the timeout.
			* @returns {Function} Returns the new debounced function.
			* @example
			*
			* // Avoid costly calculations while the window size is in flux.
			* jQuery(window).on('resize', _.debounce(calculateLayout, 150));
			*
			* // Invoke `sendMail` when clicked, debouncing subsequent calls.
			* jQuery(element).on('click', _.debounce(sendMail, 300, {
			*   'leading': true,
			*   'trailing': false
			* }));
			*
			* // Ensure `batchLog` is invoked once after 1 second of debounced calls.
			* var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
			* var source = new EventSource('/stream');
			* jQuery(source).on('message', debounced);
			*
			* // Cancel the trailing debounced invocation.
			* jQuery(window).on('popstate', debounced.cancel);
			*/
			function debounce(func, wait, options) {
				var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
				if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				wait = toNumber(wait) || 0;
				if (isObject(options)) {
					leading = !!options.leading;
					maxing = "maxWait" in options;
					maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
					trailing = "trailing" in options ? !!options.trailing : trailing;
				}
				function invokeFunc(time) {
					var args = lastArgs, thisArg = lastThis;
					lastArgs = lastThis = undefined;
					lastInvokeTime = time;
					result = func.apply(thisArg, args);
					return result;
				}
				function leadingEdge(time) {
					lastInvokeTime = time;
					timerId = setTimeout(timerExpired, wait);
					return leading ? invokeFunc(time) : result;
				}
				function remainingWait(time) {
					var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
					return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
				}
				function shouldInvoke(time) {
					var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
					return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
				}
				function timerExpired() {
					var time = now();
					if (shouldInvoke(time)) return trailingEdge(time);
					timerId = setTimeout(timerExpired, remainingWait(time));
				}
				function trailingEdge(time) {
					timerId = undefined;
					if (trailing && lastArgs) return invokeFunc(time);
					lastArgs = lastThis = undefined;
					return result;
				}
				function cancel() {
					if (timerId !== undefined) clearTimeout(timerId);
					lastInvokeTime = 0;
					lastArgs = lastCallTime = lastThis = timerId = undefined;
				}
				function flush() {
					return timerId === undefined ? result : trailingEdge(now());
				}
				function debounced() {
					var time = now(), isInvoking = shouldInvoke(time);
					lastArgs = arguments;
					lastThis = this;
					lastCallTime = time;
					if (isInvoking) {
						if (timerId === undefined) return leadingEdge(lastCallTime);
						if (maxing) {
							clearTimeout(timerId);
							timerId = setTimeout(timerExpired, wait);
							return invokeFunc(lastCallTime);
						}
					}
					if (timerId === undefined) timerId = setTimeout(timerExpired, wait);
					return result;
				}
				debounced.cancel = cancel;
				debounced.flush = flush;
				return debounced;
			}
			/**
			* Defers invoking the `func` until the current call stack has cleared. Any
			* additional arguments are provided to `func` when it's invoked.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {Function} func The function to defer.
			* @param {...*} [args] The arguments to invoke `func` with.
			* @returns {number} Returns the timer id.
			* @example
			*
			* _.defer(function(text) {
			*   console.log(text);
			* }, 'deferred');
			* // => Logs 'deferred' after one millisecond.
			*/
			var defer = baseRest(function(func, args) {
				return baseDelay(func, 1, args);
			});
			/**
			* Invokes `func` after `wait` milliseconds. Any additional arguments are
			* provided to `func` when it's invoked.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {Function} func The function to delay.
			* @param {number} wait The number of milliseconds to delay invocation.
			* @param {...*} [args] The arguments to invoke `func` with.
			* @returns {number} Returns the timer id.
			* @example
			*
			* _.delay(function(text) {
			*   console.log(text);
			* }, 1000, 'later');
			* // => Logs 'later' after one second.
			*/
			var delay = baseRest(function(func, wait, args) {
				return baseDelay(func, toNumber(wait) || 0, args);
			});
			/**
			* Creates a function that invokes `func` with arguments reversed.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Function
			* @param {Function} func The function to flip arguments for.
			* @returns {Function} Returns the new flipped function.
			* @example
			*
			* var flipped = _.flip(function() {
			*   return _.toArray(arguments);
			* });
			*
			* flipped('a', 'b', 'c', 'd');
			* // => ['d', 'c', 'b', 'a']
			*/
			function flip(func) {
				return createWrap(func, WRAP_FLIP_FLAG);
			}
			/**
			* Creates a function that memoizes the result of `func`. If `resolver` is
			* provided, it determines the cache key for storing the result based on the
			* arguments provided to the memoized function. By default, the first argument
			* provided to the memoized function is used as the map cache key. The `func`
			* is invoked with the `this` binding of the memoized function.
			*
			* **Note:** The cache is exposed as the `cache` property on the memoized
			* function. Its creation may be customized by replacing the `_.memoize.Cache`
			* constructor with one whose instances implement the
			* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
			* method interface of `clear`, `delete`, `get`, `has`, and `set`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {Function} func The function to have its output memoized.
			* @param {Function} [resolver] The function to resolve the cache key.
			* @returns {Function} Returns the new memoized function.
			* @example
			*
			* var object = { 'a': 1, 'b': 2 };
			* var other = { 'c': 3, 'd': 4 };
			*
			* var values = _.memoize(_.values);
			* values(object);
			* // => [1, 2]
			*
			* values(other);
			* // => [3, 4]
			*
			* object.a = 2;
			* values(object);
			* // => [1, 2]
			*
			* // Modify the result cache.
			* values.cache.set(object, ['a', 'b']);
			* values(object);
			* // => ['a', 'b']
			*
			* // Replace `_.memoize.Cache`.
			* _.memoize.Cache = WeakMap;
			*/
			function memoize(func, resolver) {
				if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT);
				var memoized = function() {
					var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
					if (cache.has(key)) return cache.get(key);
					var result = func.apply(this, args);
					memoized.cache = cache.set(key, result) || cache;
					return result;
				};
				memoized.cache = new (memoize.Cache || MapCache)();
				return memoized;
			}
			memoize.Cache = MapCache;
			/**
			* Creates a function that negates the result of the predicate `func`. The
			* `func` predicate is invoked with the `this` binding and arguments of the
			* created function.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Function
			* @param {Function} predicate The predicate to negate.
			* @returns {Function} Returns the new negated function.
			* @example
			*
			* function isEven(n) {
			*   return n % 2 == 0;
			* }
			*
			* _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
			* // => [1, 3, 5]
			*/
			function negate(predicate) {
				if (typeof predicate != "function") throw new TypeError(FUNC_ERROR_TEXT);
				return function() {
					var args = arguments;
					switch (args.length) {
						case 0: return !predicate.call(this);
						case 1: return !predicate.call(this, args[0]);
						case 2: return !predicate.call(this, args[0], args[1]);
						case 3: return !predicate.call(this, args[0], args[1], args[2]);
					}
					return !predicate.apply(this, args);
				};
			}
			/**
			* Creates a function that is restricted to invoking `func` once. Repeat calls
			* to the function return the value of the first invocation. The `func` is
			* invoked with the `this` binding and arguments of the created function.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {Function} func The function to restrict.
			* @returns {Function} Returns the new restricted function.
			* @example
			*
			* var initialize = _.once(createApplication);
			* initialize();
			* initialize();
			* // => `createApplication` is invoked once
			*/
			function once(func) {
				return before(2, func);
			}
			/**
			* Creates a function that invokes `func` with its arguments transformed.
			*
			* @static
			* @since 4.0.0
			* @memberOf _
			* @category Function
			* @param {Function} func The function to wrap.
			* @param {...(Function|Function[])} [transforms=[_.identity]]
			*  The argument transforms.
			* @returns {Function} Returns the new function.
			* @example
			*
			* function doubled(n) {
			*   return n * 2;
			* }
			*
			* function square(n) {
			*   return n * n;
			* }
			*
			* var func = _.overArgs(function(x, y) {
			*   return [x, y];
			* }, [square, doubled]);
			*
			* func(9, 3);
			* // => [81, 6]
			*
			* func(10, 5);
			* // => [100, 10]
			*/
			var overArgs = castRest(function(func, transforms) {
				transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
				var funcsLength = transforms.length;
				return baseRest(function(args) {
					var index = -1, length = nativeMin(args.length, funcsLength);
					while (++index < length) args[index] = transforms[index].call(this, args[index]);
					return apply(func, this, args);
				});
			});
			/**
			* Creates a function that invokes `func` with `partials` prepended to the
			* arguments it receives. This method is like `_.bind` except it does **not**
			* alter the `this` binding.
			*
			* The `_.partial.placeholder` value, which defaults to `_` in monolithic
			* builds, may be used as a placeholder for partially applied arguments.
			*
			* **Note:** This method doesn't set the "length" property of partially
			* applied functions.
			*
			* @static
			* @memberOf _
			* @since 0.2.0
			* @category Function
			* @param {Function} func The function to partially apply arguments to.
			* @param {...*} [partials] The arguments to be partially applied.
			* @returns {Function} Returns the new partially applied function.
			* @example
			*
			* function greet(greeting, name) {
			*   return greeting + ' ' + name;
			* }
			*
			* var sayHelloTo = _.partial(greet, 'hello');
			* sayHelloTo('fred');
			* // => 'hello fred'
			*
			* // Partially applied with placeholders.
			* var greetFred = _.partial(greet, _, 'fred');
			* greetFred('hi');
			* // => 'hi fred'
			*/
			var partial = baseRest(function(func, partials) {
				return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, replaceHolders(partials, getHolder(partial)));
			});
			/**
			* This method is like `_.partial` except that partially applied arguments
			* are appended to the arguments it receives.
			*
			* The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
			* builds, may be used as a placeholder for partially applied arguments.
			*
			* **Note:** This method doesn't set the "length" property of partially
			* applied functions.
			*
			* @static
			* @memberOf _
			* @since 1.0.0
			* @category Function
			* @param {Function} func The function to partially apply arguments to.
			* @param {...*} [partials] The arguments to be partially applied.
			* @returns {Function} Returns the new partially applied function.
			* @example
			*
			* function greet(greeting, name) {
			*   return greeting + ' ' + name;
			* }
			*
			* var greetFred = _.partialRight(greet, 'fred');
			* greetFred('hi');
			* // => 'hi fred'
			*
			* // Partially applied with placeholders.
			* var sayHelloTo = _.partialRight(greet, 'hello', _);
			* sayHelloTo('fred');
			* // => 'hello fred'
			*/
			var partialRight = baseRest(function(func, partials) {
				return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, replaceHolders(partials, getHolder(partialRight)));
			});
			/**
			* Creates a function that invokes `func` with arguments arranged according
			* to the specified `indexes` where the argument value at the first index is
			* provided as the first argument, the argument value at the second index is
			* provided as the second argument, and so on.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Function
			* @param {Function} func The function to rearrange arguments for.
			* @param {...(number|number[])} indexes The arranged argument indexes.
			* @returns {Function} Returns the new function.
			* @example
			*
			* var rearged = _.rearg(function(a, b, c) {
			*   return [a, b, c];
			* }, [2, 0, 1]);
			*
			* rearged('b', 'c', 'a')
			* // => ['a', 'b', 'c']
			*/
			var rearg = flatRest(function(func, indexes) {
				return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
			});
			/**
			* Creates a function that invokes `func` with the `this` binding of the
			* created function and arguments from `start` and beyond provided as
			* an array.
			*
			* **Note:** This method is based on the
			* [rest parameter](https://mdn.io/rest_parameters).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Function
			* @param {Function} func The function to apply a rest parameter to.
			* @param {number} [start=func.length-1] The start position of the rest parameter.
			* @returns {Function} Returns the new function.
			* @example
			*
			* var say = _.rest(function(what, names) {
			*   return what + ' ' + _.initial(names).join(', ') +
			*     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
			* });
			*
			* say('hello', 'fred', 'barney', 'pebbles');
			* // => 'hello fred, barney, & pebbles'
			*/
			function rest(func, start) {
				if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				start = start === undefined ? start : toInteger(start);
				return baseRest(func, start);
			}
			/**
			* Creates a function that invokes `func` with the `this` binding of the
			* create function and an array of arguments much like
			* [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
			*
			* **Note:** This method is based on the
			* [spread operator](https://mdn.io/spread_operator).
			*
			* @static
			* @memberOf _
			* @since 3.2.0
			* @category Function
			* @param {Function} func The function to spread arguments over.
			* @param {number} [start=0] The start position of the spread.
			* @returns {Function} Returns the new function.
			* @example
			*
			* var say = _.spread(function(who, what) {
			*   return who + ' says ' + what;
			* });
			*
			* say(['fred', 'hello']);
			* // => 'fred says hello'
			*
			* var numbers = Promise.all([
			*   Promise.resolve(40),
			*   Promise.resolve(36)
			* ]);
			*
			* numbers.then(_.spread(function(x, y) {
			*   return x + y;
			* }));
			* // => a Promise of 76
			*/
			function spread(func, start) {
				if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				start = start == null ? 0 : nativeMax(toInteger(start), 0);
				return baseRest(function(args) {
					var array = args[start], otherArgs = castSlice(args, 0, start);
					if (array) arrayPush(otherArgs, array);
					return apply(func, this, otherArgs);
				});
			}
			/**
			* Creates a throttled function that only invokes `func` at most once per
			* every `wait` milliseconds. The throttled function comes with a `cancel`
			* method to cancel delayed `func` invocations and a `flush` method to
			* immediately invoke them. Provide `options` to indicate whether `func`
			* should be invoked on the leading and/or trailing edge of the `wait`
			* timeout. The `func` is invoked with the last arguments provided to the
			* throttled function. Subsequent calls to the throttled function return the
			* result of the last `func` invocation.
			*
			* **Note:** If `leading` and `trailing` options are `true`, `func` is
			* invoked on the trailing edge of the timeout only if the throttled function
			* is invoked more than once during the `wait` timeout.
			*
			* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
			* until to the next tick, similar to `setTimeout` with a timeout of `0`.
			*
			* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
			* for details over the differences between `_.throttle` and `_.debounce`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {Function} func The function to throttle.
			* @param {number} [wait=0] The number of milliseconds to throttle invocations to.
			* @param {Object} [options={}] The options object.
			* @param {boolean} [options.leading=true]
			*  Specify invoking on the leading edge of the timeout.
			* @param {boolean} [options.trailing=true]
			*  Specify invoking on the trailing edge of the timeout.
			* @returns {Function} Returns the new throttled function.
			* @example
			*
			* // Avoid excessively updating the position while scrolling.
			* jQuery(window).on('scroll', _.throttle(updatePosition, 100));
			*
			* // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
			* var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
			* jQuery(element).on('click', throttled);
			*
			* // Cancel the trailing throttled invocation.
			* jQuery(window).on('popstate', throttled.cancel);
			*/
			function throttle(func, wait, options) {
				var leading = true, trailing = true;
				if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				if (isObject(options)) {
					leading = "leading" in options ? !!options.leading : leading;
					trailing = "trailing" in options ? !!options.trailing : trailing;
				}
				return debounce(func, wait, {
					"leading": leading,
					"maxWait": wait,
					"trailing": trailing
				});
			}
			/**
			* Creates a function that accepts up to one argument, ignoring any
			* additional arguments.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Function
			* @param {Function} func The function to cap arguments for.
			* @returns {Function} Returns the new capped function.
			* @example
			*
			* _.map(['6', '8', '10'], _.unary(parseInt));
			* // => [6, 8, 10]
			*/
			function unary(func) {
				return ary(func, 1);
			}
			/**
			* Creates a function that provides `value` to `wrapper` as its first
			* argument. Any additional arguments provided to the function are appended
			* to those provided to the `wrapper`. The wrapper is invoked with the `this`
			* binding of the created function.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {*} value The value to wrap.
			* @param {Function} [wrapper=identity] The wrapper function.
			* @returns {Function} Returns the new function.
			* @example
			*
			* var p = _.wrap(_.escape, function(func, text) {
			*   return '<p>' + func(text) + '</p>';
			* });
			*
			* p('fred, barney, & pebbles');
			* // => '<p>fred, barney, &amp; pebbles</p>'
			*/
			function wrap(value, wrapper) {
				return partial(castFunction(wrapper), value);
			}
			/**
			* Casts `value` as an array if it's not one.
			*
			* @static
			* @memberOf _
			* @since 4.4.0
			* @category Lang
			* @param {*} value The value to inspect.
			* @returns {Array} Returns the cast array.
			* @example
			*
			* _.castArray(1);
			* // => [1]
			*
			* _.castArray({ 'a': 1 });
			* // => [{ 'a': 1 }]
			*
			* _.castArray('abc');
			* // => ['abc']
			*
			* _.castArray(null);
			* // => [null]
			*
			* _.castArray(undefined);
			* // => [undefined]
			*
			* _.castArray();
			* // => []
			*
			* var array = [1, 2, 3];
			* console.log(_.castArray(array) === array);
			* // => true
			*/
			function castArray() {
				if (!arguments.length) return [];
				var value = arguments[0];
				return isArray(value) ? value : [value];
			}
			/**
			* Creates a shallow clone of `value`.
			*
			* **Note:** This method is loosely based on the
			* [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
			* and supports cloning arrays, array buffers, booleans, date objects, maps,
			* numbers, `Object` objects, regexes, sets, strings, symbols, and typed
			* arrays. The own enumerable properties of `arguments` objects are cloned
			* as plain objects. An empty object is returned for uncloneable values such
			* as error objects, functions, DOM nodes, and WeakMaps.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to clone.
			* @returns {*} Returns the cloned value.
			* @see _.cloneDeep
			* @example
			*
			* var objects = [{ 'a': 1 }, { 'b': 2 }];
			*
			* var shallow = _.clone(objects);
			* console.log(shallow[0] === objects[0]);
			* // => true
			*/
			function clone(value) {
				return baseClone(value, CLONE_SYMBOLS_FLAG);
			}
			/**
			* This method is like `_.clone` except that it accepts `customizer` which
			* is invoked to produce the cloned value. If `customizer` returns `undefined`,
			* cloning is handled by the method instead. The `customizer` is invoked with
			* up to four arguments; (value [, index|key, object, stack]).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to clone.
			* @param {Function} [customizer] The function to customize cloning.
			* @returns {*} Returns the cloned value.
			* @see _.cloneDeepWith
			* @example
			*
			* function customizer(value) {
			*   if (_.isElement(value)) {
			*     return value.cloneNode(false);
			*   }
			* }
			*
			* var el = _.cloneWith(document.body, customizer);
			*
			* console.log(el === document.body);
			* // => false
			* console.log(el.nodeName);
			* // => 'BODY'
			* console.log(el.childNodes.length);
			* // => 0
			*/
			function cloneWith(value, customizer) {
				customizer = typeof customizer == "function" ? customizer : undefined;
				return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
			}
			/**
			* This method is like `_.clone` except that it recursively clones `value`.
			*
			* @static
			* @memberOf _
			* @since 1.0.0
			* @category Lang
			* @param {*} value The value to recursively clone.
			* @returns {*} Returns the deep cloned value.
			* @see _.clone
			* @example
			*
			* var objects = [{ 'a': 1 }, { 'b': 2 }];
			*
			* var deep = _.cloneDeep(objects);
			* console.log(deep[0] === objects[0]);
			* // => false
			*/
			function cloneDeep(value) {
				return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
			}
			/**
			* This method is like `_.cloneWith` except that it recursively clones `value`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to recursively clone.
			* @param {Function} [customizer] The function to customize cloning.
			* @returns {*} Returns the deep cloned value.
			* @see _.cloneWith
			* @example
			*
			* function customizer(value) {
			*   if (_.isElement(value)) {
			*     return value.cloneNode(true);
			*   }
			* }
			*
			* var el = _.cloneDeepWith(document.body, customizer);
			*
			* console.log(el === document.body);
			* // => false
			* console.log(el.nodeName);
			* // => 'BODY'
			* console.log(el.childNodes.length);
			* // => 20
			*/
			function cloneDeepWith(value, customizer) {
				customizer = typeof customizer == "function" ? customizer : undefined;
				return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
			}
			/**
			* Checks if `object` conforms to `source` by invoking the predicate
			* properties of `source` with the corresponding property values of `object`.
			*
			* **Note:** This method is equivalent to `_.conforms` when `source` is
			* partially applied.
			*
			* @static
			* @memberOf _
			* @since 4.14.0
			* @category Lang
			* @param {Object} object The object to inspect.
			* @param {Object} source The object of property predicates to conform to.
			* @returns {boolean} Returns `true` if `object` conforms, else `false`.
			* @example
			*
			* var object = { 'a': 1, 'b': 2 };
			*
			* _.conformsTo(object, { 'b': function(n) { return n > 1; } });
			* // => true
			*
			* _.conformsTo(object, { 'b': function(n) { return n > 2; } });
			* // => false
			*/
			function conformsTo(object, source) {
				return source == null || baseConformsTo(object, source, keys(source));
			}
			/**
			* Performs a
			* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* comparison between two values to determine if they are equivalent.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
			* @example
			*
			* var object = { 'a': 1 };
			* var other = { 'a': 1 };
			*
			* _.eq(object, object);
			* // => true
			*
			* _.eq(object, other);
			* // => false
			*
			* _.eq('a', 'a');
			* // => true
			*
			* _.eq('a', Object('a'));
			* // => false
			*
			* _.eq(NaN, NaN);
			* // => true
			*/
			function eq(value, other) {
				return value === other || value !== value && other !== other;
			}
			/**
			* Checks if `value` is greater than `other`.
			*
			* @static
			* @memberOf _
			* @since 3.9.0
			* @category Lang
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if `value` is greater than `other`,
			*  else `false`.
			* @see _.lt
			* @example
			*
			* _.gt(3, 1);
			* // => true
			*
			* _.gt(3, 3);
			* // => false
			*
			* _.gt(1, 3);
			* // => false
			*/
			var gt = createRelationalOperation(baseGt);
			/**
			* Checks if `value` is greater than or equal to `other`.
			*
			* @static
			* @memberOf _
			* @since 3.9.0
			* @category Lang
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if `value` is greater than or equal to
			*  `other`, else `false`.
			* @see _.lte
			* @example
			*
			* _.gte(3, 1);
			* // => true
			*
			* _.gte(3, 3);
			* // => true
			*
			* _.gte(1, 3);
			* // => false
			*/
			var gte = createRelationalOperation(function(value, other) {
				return value >= other;
			});
			/**
			* Checks if `value` is likely an `arguments` object.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an `arguments` object,
			*  else `false`.
			* @example
			*
			* _.isArguments(function() { return arguments; }());
			* // => true
			*
			* _.isArguments([1, 2, 3]);
			* // => false
			*/
			var isArguments = baseIsArguments(function() {
				return arguments;
			}()) ? baseIsArguments : function(value) {
				return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
			};
			/**
			* Checks if `value` is classified as an `Array` object.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an array, else `false`.
			* @example
			*
			* _.isArray([1, 2, 3]);
			* // => true
			*
			* _.isArray(document.body.children);
			* // => false
			*
			* _.isArray('abc');
			* // => false
			*
			* _.isArray(_.noop);
			* // => false
			*/
			var isArray = Array.isArray;
			/**
			* Checks if `value` is classified as an `ArrayBuffer` object.
			*
			* @static
			* @memberOf _
			* @since 4.3.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
			* @example
			*
			* _.isArrayBuffer(new ArrayBuffer(2));
			* // => true
			*
			* _.isArrayBuffer(new Array(2));
			* // => false
			*/
			var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
			/**
			* Checks if `value` is array-like. A value is considered array-like if it's
			* not a function and has a `value.length` that's an integer greater than or
			* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
			* @example
			*
			* _.isArrayLike([1, 2, 3]);
			* // => true
			*
			* _.isArrayLike(document.body.children);
			* // => true
			*
			* _.isArrayLike('abc');
			* // => true
			*
			* _.isArrayLike(_.noop);
			* // => false
			*/
			function isArrayLike(value) {
				return value != null && isLength(value.length) && !isFunction(value);
			}
			/**
			* This method is like `_.isArrayLike` except that it also checks if `value`
			* is an object.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an array-like object,
			*  else `false`.
			* @example
			*
			* _.isArrayLikeObject([1, 2, 3]);
			* // => true
			*
			* _.isArrayLikeObject(document.body.children);
			* // => true
			*
			* _.isArrayLikeObject('abc');
			* // => false
			*
			* _.isArrayLikeObject(_.noop);
			* // => false
			*/
			function isArrayLikeObject(value) {
				return isObjectLike(value) && isArrayLike(value);
			}
			/**
			* Checks if `value` is classified as a boolean primitive or object.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
			* @example
			*
			* _.isBoolean(false);
			* // => true
			*
			* _.isBoolean(null);
			* // => false
			*/
			function isBoolean(value) {
				return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
			}
			/**
			* Checks if `value` is a buffer.
			*
			* @static
			* @memberOf _
			* @since 4.3.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
			* @example
			*
			* _.isBuffer(new Buffer(2));
			* // => true
			*
			* _.isBuffer(new Uint8Array(2));
			* // => false
			*/
			var isBuffer = nativeIsBuffer || stubFalse;
			/**
			* Checks if `value` is classified as a `Date` object.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a date object, else `false`.
			* @example
			*
			* _.isDate(new Date);
			* // => true
			*
			* _.isDate('Mon April 23 2012');
			* // => false
			*/
			var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
			/**
			* Checks if `value` is likely a DOM element.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
			* @example
			*
			* _.isElement(document.body);
			* // => true
			*
			* _.isElement('<body>');
			* // => false
			*/
			function isElement(value) {
				return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
			}
			/**
			* Checks if `value` is an empty object, collection, map, or set.
			*
			* Objects are considered empty if they have no own enumerable string keyed
			* properties.
			*
			* Array-like values such as `arguments` objects, arrays, buffers, strings, or
			* jQuery-like collections are considered empty if they have a `length` of `0`.
			* Similarly, maps and sets are considered empty if they have a `size` of `0`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is empty, else `false`.
			* @example
			*
			* _.isEmpty(null);
			* // => true
			*
			* _.isEmpty(true);
			* // => true
			*
			* _.isEmpty(1);
			* // => true
			*
			* _.isEmpty([1, 2, 3]);
			* // => false
			*
			* _.isEmpty({ 'a': 1 });
			* // => false
			*/
			function isEmpty(value) {
				if (value == null) return true;
				if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) return !value.length;
				var tag = getTag(value);
				if (tag == mapTag || tag == setTag) return !value.size;
				if (isPrototype(value)) return !baseKeys(value).length;
				for (var key in value) if (hasOwnProperty.call(value, key)) return false;
				return true;
			}
			/**
			* Performs a deep comparison between two values to determine if they are
			* equivalent.
			*
			* **Note:** This method supports comparing arrays, array buffers, booleans,
			* date objects, error objects, maps, numbers, `Object` objects, regexes,
			* sets, strings, symbols, and typed arrays. `Object` objects are compared
			* by their own, not inherited, enumerable properties. Functions and DOM
			* nodes are compared by strict equality, i.e. `===`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
			* @example
			*
			* var object = { 'a': 1 };
			* var other = { 'a': 1 };
			*
			* _.isEqual(object, other);
			* // => true
			*
			* object === other;
			* // => false
			*/
			function isEqual(value, other) {
				return baseIsEqual(value, other);
			}
			/**
			* This method is like `_.isEqual` except that it accepts `customizer` which
			* is invoked to compare values. If `customizer` returns `undefined`, comparisons
			* are handled by the method instead. The `customizer` is invoked with up to
			* six arguments: (objValue, othValue [, index|key, object, other, stack]).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @param {Function} [customizer] The function to customize comparisons.
			* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
			* @example
			*
			* function isGreeting(value) {
			*   return /^h(?:i|ello)$/.test(value);
			* }
			*
			* function customizer(objValue, othValue) {
			*   if (isGreeting(objValue) && isGreeting(othValue)) {
			*     return true;
			*   }
			* }
			*
			* var array = ['hello', 'goodbye'];
			* var other = ['hi', 'goodbye'];
			*
			* _.isEqualWith(array, other, customizer);
			* // => true
			*/
			function isEqualWith(value, other, customizer) {
				customizer = typeof customizer == "function" ? customizer : undefined;
				var result = customizer ? customizer(value, other) : undefined;
				return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
			}
			/**
			* Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
			* `SyntaxError`, `TypeError`, or `URIError` object.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an error object, else `false`.
			* @example
			*
			* _.isError(new Error);
			* // => true
			*
			* _.isError(Error);
			* // => false
			*/
			function isError(value) {
				if (!isObjectLike(value)) return false;
				var tag = baseGetTag(value);
				return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
			}
			/**
			* Checks if `value` is a finite primitive number.
			*
			* **Note:** This method is based on
			* [`Number.isFinite`](https://mdn.io/Number/isFinite).
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
			* @example
			*
			* _.isFinite(3);
			* // => true
			*
			* _.isFinite(Number.MIN_VALUE);
			* // => true
			*
			* _.isFinite(Infinity);
			* // => false
			*
			* _.isFinite('3');
			* // => false
			*/
			function isFinite(value) {
				return typeof value == "number" && nativeIsFinite(value);
			}
			/**
			* Checks if `value` is classified as a `Function` object.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a function, else `false`.
			* @example
			*
			* _.isFunction(_);
			* // => true
			*
			* _.isFunction(/abc/);
			* // => false
			*/
			function isFunction(value) {
				if (!isObject(value)) return false;
				var tag = baseGetTag(value);
				return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
			}
			/**
			* Checks if `value` is an integer.
			*
			* **Note:** This method is based on
			* [`Number.isInteger`](https://mdn.io/Number/isInteger).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an integer, else `false`.
			* @example
			*
			* _.isInteger(3);
			* // => true
			*
			* _.isInteger(Number.MIN_VALUE);
			* // => false
			*
			* _.isInteger(Infinity);
			* // => false
			*
			* _.isInteger('3');
			* // => false
			*/
			function isInteger(value) {
				return typeof value == "number" && value == toInteger(value);
			}
			/**
			* Checks if `value` is a valid array-like length.
			*
			* **Note:** This method is loosely based on
			* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
			* @example
			*
			* _.isLength(3);
			* // => true
			*
			* _.isLength(Number.MIN_VALUE);
			* // => false
			*
			* _.isLength(Infinity);
			* // => false
			*
			* _.isLength('3');
			* // => false
			*/
			function isLength(value) {
				return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
			}
			/**
			* Checks if `value` is the
			* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
			* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an object, else `false`.
			* @example
			*
			* _.isObject({});
			* // => true
			*
			* _.isObject([1, 2, 3]);
			* // => true
			*
			* _.isObject(_.noop);
			* // => true
			*
			* _.isObject(null);
			* // => false
			*/
			function isObject(value) {
				var type = typeof value;
				return value != null && (type == "object" || type == "function");
			}
			/**
			* Checks if `value` is object-like. A value is object-like if it's not `null`
			* and has a `typeof` result of "object".
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
			* @example
			*
			* _.isObjectLike({});
			* // => true
			*
			* _.isObjectLike([1, 2, 3]);
			* // => true
			*
			* _.isObjectLike(_.noop);
			* // => false
			*
			* _.isObjectLike(null);
			* // => false
			*/
			function isObjectLike(value) {
				return value != null && typeof value == "object";
			}
			/**
			* Checks if `value` is classified as a `Map` object.
			*
			* @static
			* @memberOf _
			* @since 4.3.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a map, else `false`.
			* @example
			*
			* _.isMap(new Map);
			* // => true
			*
			* _.isMap(new WeakMap);
			* // => false
			*/
			var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
			/**
			* Performs a partial deep comparison between `object` and `source` to
			* determine if `object` contains equivalent property values.
			*
			* **Note:** This method is equivalent to `_.matches` when `source` is
			* partially applied.
			*
			* Partial comparisons will match empty array and empty object `source`
			* values against any array or object value, respectively. See `_.isEqual`
			* for a list of supported value comparisons.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Lang
			* @param {Object} object The object to inspect.
			* @param {Object} source The object of property values to match.
			* @returns {boolean} Returns `true` if `object` is a match, else `false`.
			* @example
			*
			* var object = { 'a': 1, 'b': 2 };
			*
			* _.isMatch(object, { 'b': 2 });
			* // => true
			*
			* _.isMatch(object, { 'b': 1 });
			* // => false
			*/
			function isMatch(object, source) {
				return object === source || baseIsMatch(object, source, getMatchData(source));
			}
			/**
			* This method is like `_.isMatch` except that it accepts `customizer` which
			* is invoked to compare values. If `customizer` returns `undefined`, comparisons
			* are handled by the method instead. The `customizer` is invoked with five
			* arguments: (objValue, srcValue, index|key, object, source).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {Object} object The object to inspect.
			* @param {Object} source The object of property values to match.
			* @param {Function} [customizer] The function to customize comparisons.
			* @returns {boolean} Returns `true` if `object` is a match, else `false`.
			* @example
			*
			* function isGreeting(value) {
			*   return /^h(?:i|ello)$/.test(value);
			* }
			*
			* function customizer(objValue, srcValue) {
			*   if (isGreeting(objValue) && isGreeting(srcValue)) {
			*     return true;
			*   }
			* }
			*
			* var object = { 'greeting': 'hello' };
			* var source = { 'greeting': 'hi' };
			*
			* _.isMatchWith(object, source, customizer);
			* // => true
			*/
			function isMatchWith(object, source, customizer) {
				customizer = typeof customizer == "function" ? customizer : undefined;
				return baseIsMatch(object, source, getMatchData(source), customizer);
			}
			/**
			* Checks if `value` is `NaN`.
			*
			* **Note:** This method is based on
			* [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
			* global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
			* `undefined` and other non-number values.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
			* @example
			*
			* _.isNaN(NaN);
			* // => true
			*
			* _.isNaN(new Number(NaN));
			* // => true
			*
			* isNaN(undefined);
			* // => true
			*
			* _.isNaN(undefined);
			* // => false
			*/
			function isNaN(value) {
				return isNumber(value) && value != +value;
			}
			/**
			* Checks if `value` is a pristine native function.
			*
			* **Note:** This method can't reliably detect native functions in the presence
			* of the core-js package because core-js circumvents this kind of detection.
			* Despite multiple requests, the core-js maintainer has made it clear: any
			* attempt to fix the detection will be obstructed. As a result, we're left
			* with little choice but to throw an error. Unfortunately, this also affects
			* packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
			* which rely on core-js.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a native function,
			*  else `false`.
			* @example
			*
			* _.isNative(Array.prototype.push);
			* // => true
			*
			* _.isNative(_);
			* // => false
			*/
			function isNative(value) {
				if (isMaskable(value)) throw new Error(CORE_ERROR_TEXT);
				return baseIsNative(value);
			}
			/**
			* Checks if `value` is `null`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is `null`, else `false`.
			* @example
			*
			* _.isNull(null);
			* // => true
			*
			* _.isNull(void 0);
			* // => false
			*/
			function isNull(value) {
				return value === null;
			}
			/**
			* Checks if `value` is `null` or `undefined`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is nullish, else `false`.
			* @example
			*
			* _.isNil(null);
			* // => true
			*
			* _.isNil(void 0);
			* // => true
			*
			* _.isNil(NaN);
			* // => false
			*/
			function isNil(value) {
				return value == null;
			}
			/**
			* Checks if `value` is classified as a `Number` primitive or object.
			*
			* **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
			* classified as numbers, use the `_.isFinite` method.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a number, else `false`.
			* @example
			*
			* _.isNumber(3);
			* // => true
			*
			* _.isNumber(Number.MIN_VALUE);
			* // => true
			*
			* _.isNumber(Infinity);
			* // => true
			*
			* _.isNumber('3');
			* // => false
			*/
			function isNumber(value) {
				return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
			}
			/**
			* Checks if `value` is a plain object, that is, an object created by the
			* `Object` constructor or one with a `[[Prototype]]` of `null`.
			*
			* @static
			* @memberOf _
			* @since 0.8.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			* }
			*
			* _.isPlainObject(new Foo);
			* // => false
			*
			* _.isPlainObject([1, 2, 3]);
			* // => false
			*
			* _.isPlainObject({ 'x': 0, 'y': 0 });
			* // => true
			*
			* _.isPlainObject(Object.create(null));
			* // => true
			*/
			function isPlainObject(value) {
				if (!isObjectLike(value) || baseGetTag(value) != objectTag) return false;
				var proto = getPrototype(value);
				if (proto === null) return true;
				var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
				return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
			}
			/**
			* Checks if `value` is classified as a `RegExp` object.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
			* @example
			*
			* _.isRegExp(/abc/);
			* // => true
			*
			* _.isRegExp('/abc/');
			* // => false
			*/
			var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
			/**
			* Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
			* double precision number which isn't the result of a rounded unsafe integer.
			*
			* **Note:** This method is based on
			* [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
			* @example
			*
			* _.isSafeInteger(3);
			* // => true
			*
			* _.isSafeInteger(Number.MIN_VALUE);
			* // => false
			*
			* _.isSafeInteger(Infinity);
			* // => false
			*
			* _.isSafeInteger('3');
			* // => false
			*/
			function isSafeInteger(value) {
				return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
			}
			/**
			* Checks if `value` is classified as a `Set` object.
			*
			* @static
			* @memberOf _
			* @since 4.3.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a set, else `false`.
			* @example
			*
			* _.isSet(new Set);
			* // => true
			*
			* _.isSet(new WeakSet);
			* // => false
			*/
			var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
			/**
			* Checks if `value` is classified as a `String` primitive or object.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a string, else `false`.
			* @example
			*
			* _.isString('abc');
			* // => true
			*
			* _.isString(1);
			* // => false
			*/
			function isString(value) {
				return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
			}
			/**
			* Checks if `value` is classified as a `Symbol` primitive or object.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
			* @example
			*
			* _.isSymbol(Symbol.iterator);
			* // => true
			*
			* _.isSymbol('abc');
			* // => false
			*/
			function isSymbol(value) {
				return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
			}
			/**
			* Checks if `value` is classified as a typed array.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
			* @example
			*
			* _.isTypedArray(new Uint8Array);
			* // => true
			*
			* _.isTypedArray([]);
			* // => false
			*/
			var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
			/**
			* Checks if `value` is `undefined`.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
			* @example
			*
			* _.isUndefined(void 0);
			* // => true
			*
			* _.isUndefined(null);
			* // => false
			*/
			function isUndefined(value) {
				return value === undefined;
			}
			/**
			* Checks if `value` is classified as a `WeakMap` object.
			*
			* @static
			* @memberOf _
			* @since 4.3.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
			* @example
			*
			* _.isWeakMap(new WeakMap);
			* // => true
			*
			* _.isWeakMap(new Map);
			* // => false
			*/
			function isWeakMap(value) {
				return isObjectLike(value) && getTag(value) == weakMapTag;
			}
			/**
			* Checks if `value` is classified as a `WeakSet` object.
			*
			* @static
			* @memberOf _
			* @since 4.3.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
			* @example
			*
			* _.isWeakSet(new WeakSet);
			* // => true
			*
			* _.isWeakSet(new Set);
			* // => false
			*/
			function isWeakSet(value) {
				return isObjectLike(value) && baseGetTag(value) == weakSetTag;
			}
			/**
			* Checks if `value` is less than `other`.
			*
			* @static
			* @memberOf _
			* @since 3.9.0
			* @category Lang
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if `value` is less than `other`,
			*  else `false`.
			* @see _.gt
			* @example
			*
			* _.lt(1, 3);
			* // => true
			*
			* _.lt(3, 3);
			* // => false
			*
			* _.lt(3, 1);
			* // => false
			*/
			var lt = createRelationalOperation(baseLt);
			/**
			* Checks if `value` is less than or equal to `other`.
			*
			* @static
			* @memberOf _
			* @since 3.9.0
			* @category Lang
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if `value` is less than or equal to
			*  `other`, else `false`.
			* @see _.gte
			* @example
			*
			* _.lte(1, 3);
			* // => true
			*
			* _.lte(3, 3);
			* // => true
			*
			* _.lte(3, 1);
			* // => false
			*/
			var lte = createRelationalOperation(function(value, other) {
				return value <= other;
			});
			/**
			* Converts `value` to an array.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {Array} Returns the converted array.
			* @example
			*
			* _.toArray({ 'a': 1, 'b': 2 });
			* // => [1, 2]
			*
			* _.toArray('abc');
			* // => ['a', 'b', 'c']
			*
			* _.toArray(1);
			* // => []
			*
			* _.toArray(null);
			* // => []
			*/
			function toArray(value) {
				if (!value) return [];
				if (isArrayLike(value)) return isString(value) ? stringToArray(value) : copyArray(value);
				if (symIterator && value[symIterator]) return iteratorToArray(value[symIterator]());
				var tag = getTag(value);
				return (tag == mapTag ? mapToArray : tag == setTag ? setToArray : values)(value);
			}
			/**
			* Converts `value` to a finite number.
			*
			* @static
			* @memberOf _
			* @since 4.12.0
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {number} Returns the converted number.
			* @example
			*
			* _.toFinite(3.2);
			* // => 3.2
			*
			* _.toFinite(Number.MIN_VALUE);
			* // => 5e-324
			*
			* _.toFinite(Infinity);
			* // => 1.7976931348623157e+308
			*
			* _.toFinite('3.2');
			* // => 3.2
			*/
			function toFinite(value) {
				if (!value) return value === 0 ? value : 0;
				value = toNumber(value);
				if (value === INFINITY || value === -INFINITY) return (value < 0 ? -1 : 1) * MAX_INTEGER;
				return value === value ? value : 0;
			}
			/**
			* Converts `value` to an integer.
			*
			* **Note:** This method is loosely based on
			* [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {number} Returns the converted integer.
			* @example
			*
			* _.toInteger(3.2);
			* // => 3
			*
			* _.toInteger(Number.MIN_VALUE);
			* // => 0
			*
			* _.toInteger(Infinity);
			* // => 1.7976931348623157e+308
			*
			* _.toInteger('3.2');
			* // => 3
			*/
			function toInteger(value) {
				var result = toFinite(value), remainder = result % 1;
				return result === result ? remainder ? result - remainder : result : 0;
			}
			/**
			* Converts `value` to an integer suitable for use as the length of an
			* array-like object.
			*
			* **Note:** This method is based on
			* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {number} Returns the converted integer.
			* @example
			*
			* _.toLength(3.2);
			* // => 3
			*
			* _.toLength(Number.MIN_VALUE);
			* // => 0
			*
			* _.toLength(Infinity);
			* // => 4294967295
			*
			* _.toLength('3.2');
			* // => 3
			*/
			function toLength(value) {
				return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
			}
			/**
			* Converts `value` to a number.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to process.
			* @returns {number} Returns the number.
			* @example
			*
			* _.toNumber(3.2);
			* // => 3.2
			*
			* _.toNumber(Number.MIN_VALUE);
			* // => 5e-324
			*
			* _.toNumber(Infinity);
			* // => Infinity
			*
			* _.toNumber('3.2');
			* // => 3.2
			*/
			function toNumber(value) {
				if (typeof value == "number") return value;
				if (isSymbol(value)) return NAN;
				if (isObject(value)) {
					var other = typeof value.valueOf == "function" ? value.valueOf() : value;
					value = isObject(other) ? other + "" : other;
				}
				if (typeof value != "string") return value === 0 ? value : +value;
				value = baseTrim(value);
				var isBinary = reIsBinary.test(value);
				return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
			}
			/**
			* Converts `value` to a plain object flattening inherited enumerable string
			* keyed properties of `value` to own properties of the plain object.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {Object} Returns the converted plain object.
			* @example
			*
			* function Foo() {
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.assign({ 'a': 1 }, new Foo);
			* // => { 'a': 1, 'b': 2 }
			*
			* _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
			* // => { 'a': 1, 'b': 2, 'c': 3 }
			*/
			function toPlainObject(value) {
				return copyObject(value, keysIn(value));
			}
			/**
			* Converts `value` to a safe integer. A safe integer can be compared and
			* represented correctly.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {number} Returns the converted integer.
			* @example
			*
			* _.toSafeInteger(3.2);
			* // => 3
			*
			* _.toSafeInteger(Number.MIN_VALUE);
			* // => 0
			*
			* _.toSafeInteger(Infinity);
			* // => 9007199254740991
			*
			* _.toSafeInteger('3.2');
			* // => 3
			*/
			function toSafeInteger(value) {
				return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
			}
			/**
			* Converts `value` to a string. An empty string is returned for `null`
			* and `undefined` values. The sign of `-0` is preserved.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {string} Returns the converted string.
			* @example
			*
			* _.toString(null);
			* // => ''
			*
			* _.toString(-0);
			* // => '-0'
			*
			* _.toString([1, 2, 3]);
			* // => '1,2,3'
			*/
			function toString(value) {
				return value == null ? "" : baseToString(value);
			}
			/**
			* Assigns own enumerable string keyed properties of source objects to the
			* destination object. Source objects are applied from left to right.
			* Subsequent sources overwrite property assignments of previous sources.
			*
			* **Note:** This method mutates `object` and is loosely based on
			* [`Object.assign`](https://mdn.io/Object/assign).
			*
			* @static
			* @memberOf _
			* @since 0.10.0
			* @category Object
			* @param {Object} object The destination object.
			* @param {...Object} [sources] The source objects.
			* @returns {Object} Returns `object`.
			* @see _.assignIn
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			* }
			*
			* function Bar() {
			*   this.c = 3;
			* }
			*
			* Foo.prototype.b = 2;
			* Bar.prototype.d = 4;
			*
			* _.assign({ 'a': 0 }, new Foo, new Bar);
			* // => { 'a': 1, 'c': 3 }
			*/
			var assign = createAssigner(function(object, source) {
				if (isPrototype(source) || isArrayLike(source)) {
					copyObject(source, keys(source), object);
					return;
				}
				for (var key in source) if (hasOwnProperty.call(source, key)) assignValue(object, key, source[key]);
			});
			/**
			* This method is like `_.assign` except that it iterates over own and
			* inherited source properties.
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @alias extend
			* @category Object
			* @param {Object} object The destination object.
			* @param {...Object} [sources] The source objects.
			* @returns {Object} Returns `object`.
			* @see _.assign
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			* }
			*
			* function Bar() {
			*   this.c = 3;
			* }
			*
			* Foo.prototype.b = 2;
			* Bar.prototype.d = 4;
			*
			* _.assignIn({ 'a': 0 }, new Foo, new Bar);
			* // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
			*/
			var assignIn = createAssigner(function(object, source) {
				copyObject(source, keysIn(source), object);
			});
			/**
			* This method is like `_.assignIn` except that it accepts `customizer`
			* which is invoked to produce the assigned values. If `customizer` returns
			* `undefined`, assignment is handled by the method instead. The `customizer`
			* is invoked with five arguments: (objValue, srcValue, key, object, source).
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @alias extendWith
			* @category Object
			* @param {Object} object The destination object.
			* @param {...Object} sources The source objects.
			* @param {Function} [customizer] The function to customize assigned values.
			* @returns {Object} Returns `object`.
			* @see _.assignWith
			* @example
			*
			* function customizer(objValue, srcValue) {
			*   return _.isUndefined(objValue) ? srcValue : objValue;
			* }
			*
			* var defaults = _.partialRight(_.assignInWith, customizer);
			*
			* defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
			* // => { 'a': 1, 'b': 2 }
			*/
			var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
				copyObject(source, keysIn(source), object, customizer);
			});
			/**
			* This method is like `_.assign` except that it accepts `customizer`
			* which is invoked to produce the assigned values. If `customizer` returns
			* `undefined`, assignment is handled by the method instead. The `customizer`
			* is invoked with five arguments: (objValue, srcValue, key, object, source).
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The destination object.
			* @param {...Object} sources The source objects.
			* @param {Function} [customizer] The function to customize assigned values.
			* @returns {Object} Returns `object`.
			* @see _.assignInWith
			* @example
			*
			* function customizer(objValue, srcValue) {
			*   return _.isUndefined(objValue) ? srcValue : objValue;
			* }
			*
			* var defaults = _.partialRight(_.assignWith, customizer);
			*
			* defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
			* // => { 'a': 1, 'b': 2 }
			*/
			var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
				copyObject(source, keys(source), object, customizer);
			});
			/**
			* Creates an array of values corresponding to `paths` of `object`.
			*
			* @static
			* @memberOf _
			* @since 1.0.0
			* @category Object
			* @param {Object} object The object to iterate over.
			* @param {...(string|string[])} [paths] The property paths to pick.
			* @returns {Array} Returns the picked values.
			* @example
			*
			* var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
			*
			* _.at(object, ['a[0].b.c', 'a[1]']);
			* // => [3, 4]
			*/
			var at = flatRest(baseAt);
			/**
			* Creates an object that inherits from the `prototype` object. If a
			* `properties` object is given, its own enumerable string keyed properties
			* are assigned to the created object.
			*
			* @static
			* @memberOf _
			* @since 2.3.0
			* @category Object
			* @param {Object} prototype The object to inherit from.
			* @param {Object} [properties] The properties to assign to the object.
			* @returns {Object} Returns the new object.
			* @example
			*
			* function Shape() {
			*   this.x = 0;
			*   this.y = 0;
			* }
			*
			* function Circle() {
			*   Shape.call(this);
			* }
			*
			* Circle.prototype = _.create(Shape.prototype, {
			*   'constructor': Circle
			* });
			*
			* var circle = new Circle;
			* circle instanceof Circle;
			* // => true
			*
			* circle instanceof Shape;
			* // => true
			*/
			function create(prototype, properties) {
				var result = baseCreate(prototype);
				return properties == null ? result : baseAssign(result, properties);
			}
			/**
			* Assigns own and inherited enumerable string keyed properties of source
			* objects to the destination object for all destination properties that
			* resolve to `undefined`. Source objects are applied from left to right.
			* Once a property is set, additional values of the same property are ignored.
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The destination object.
			* @param {...Object} [sources] The source objects.
			* @returns {Object} Returns `object`.
			* @see _.defaultsDeep
			* @example
			*
			* _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
			* // => { 'a': 1, 'b': 2 }
			*/
			var defaults = baseRest(function(object, sources) {
				object = Object(object);
				var index = -1;
				var length = sources.length;
				var guard = length > 2 ? sources[2] : undefined;
				if (guard && isIterateeCall(sources[0], sources[1], guard)) length = 1;
				while (++index < length) {
					var source = sources[index];
					var props = keysIn(source);
					var propsIndex = -1;
					var propsLength = props.length;
					while (++propsIndex < propsLength) {
						var key = props[propsIndex];
						var value = object[key];
						if (value === undefined || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) object[key] = source[key];
					}
				}
				return object;
			});
			/**
			* This method is like `_.defaults` except that it recursively assigns
			* default properties.
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 3.10.0
			* @category Object
			* @param {Object} object The destination object.
			* @param {...Object} [sources] The source objects.
			* @returns {Object} Returns `object`.
			* @see _.defaults
			* @example
			*
			* _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
			* // => { 'a': { 'b': 2, 'c': 3 } }
			*/
			var defaultsDeep = baseRest(function(args) {
				args.push(undefined, customDefaultsMerge);
				return apply(mergeWith, undefined, args);
			});
			/**
			* This method is like `_.find` except that it returns the key of the first
			* element `predicate` returns truthy for instead of the element itself.
			*
			* @static
			* @memberOf _
			* @since 1.1.0
			* @category Object
			* @param {Object} object The object to inspect.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {string|undefined} Returns the key of the matched element,
			*  else `undefined`.
			* @example
			*
			* var users = {
			*   'barney':  { 'age': 36, 'active': true },
			*   'fred':    { 'age': 40, 'active': false },
			*   'pebbles': { 'age': 1,  'active': true }
			* };
			*
			* _.findKey(users, function(o) { return o.age < 40; });
			* // => 'barney' (iteration order is not guaranteed)
			*
			* // The `_.matches` iteratee shorthand.
			* _.findKey(users, { 'age': 1, 'active': true });
			* // => 'pebbles'
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.findKey(users, ['active', false]);
			* // => 'fred'
			*
			* // The `_.property` iteratee shorthand.
			* _.findKey(users, 'active');
			* // => 'barney'
			*/
			function findKey(object, predicate) {
				return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
			}
			/**
			* This method is like `_.findKey` except that it iterates over elements of
			* a collection in the opposite order.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Object
			* @param {Object} object The object to inspect.
			* @param {Function} [predicate=_.identity] The function invoked per iteration.
			* @returns {string|undefined} Returns the key of the matched element,
			*  else `undefined`.
			* @example
			*
			* var users = {
			*   'barney':  { 'age': 36, 'active': true },
			*   'fred':    { 'age': 40, 'active': false },
			*   'pebbles': { 'age': 1,  'active': true }
			* };
			*
			* _.findLastKey(users, function(o) { return o.age < 40; });
			* // => returns 'pebbles' assuming `_.findKey` returns 'barney'
			*
			* // The `_.matches` iteratee shorthand.
			* _.findLastKey(users, { 'age': 36, 'active': true });
			* // => 'barney'
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.findLastKey(users, ['active', false]);
			* // => 'fred'
			*
			* // The `_.property` iteratee shorthand.
			* _.findLastKey(users, 'active');
			* // => 'pebbles'
			*/
			function findLastKey(object, predicate) {
				return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
			}
			/**
			* Iterates over own and inherited enumerable string keyed properties of an
			* object and invokes `iteratee` for each property. The iteratee is invoked
			* with three arguments: (value, key, object). Iteratee functions may exit
			* iteration early by explicitly returning `false`.
			*
			* @static
			* @memberOf _
			* @since 0.3.0
			* @category Object
			* @param {Object} object The object to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Object} Returns `object`.
			* @see _.forInRight
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.forIn(new Foo, function(value, key) {
			*   console.log(key);
			* });
			* // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
			*/
			function forIn(object, iteratee) {
				return object == null ? object : baseFor(object, getIteratee(iteratee, 3), keysIn);
			}
			/**
			* This method is like `_.forIn` except that it iterates over properties of
			* `object` in the opposite order.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Object
			* @param {Object} object The object to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Object} Returns `object`.
			* @see _.forIn
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.forInRight(new Foo, function(value, key) {
			*   console.log(key);
			* });
			* // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
			*/
			function forInRight(object, iteratee) {
				return object == null ? object : baseForRight(object, getIteratee(iteratee, 3), keysIn);
			}
			/**
			* Iterates over own enumerable string keyed properties of an object and
			* invokes `iteratee` for each property. The iteratee is invoked with three
			* arguments: (value, key, object). Iteratee functions may exit iteration
			* early by explicitly returning `false`.
			*
			* @static
			* @memberOf _
			* @since 0.3.0
			* @category Object
			* @param {Object} object The object to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Object} Returns `object`.
			* @see _.forOwnRight
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.forOwn(new Foo, function(value, key) {
			*   console.log(key);
			* });
			* // => Logs 'a' then 'b' (iteration order is not guaranteed).
			*/
			function forOwn(object, iteratee) {
				return object && baseForOwn(object, getIteratee(iteratee, 3));
			}
			/**
			* This method is like `_.forOwn` except that it iterates over properties of
			* `object` in the opposite order.
			*
			* @static
			* @memberOf _
			* @since 2.0.0
			* @category Object
			* @param {Object} object The object to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Object} Returns `object`.
			* @see _.forOwn
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.forOwnRight(new Foo, function(value, key) {
			*   console.log(key);
			* });
			* // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
			*/
			function forOwnRight(object, iteratee) {
				return object && baseForOwnRight(object, getIteratee(iteratee, 3));
			}
			/**
			* Creates an array of function property names from own enumerable properties
			* of `object`.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The object to inspect.
			* @returns {Array} Returns the function names.
			* @see _.functionsIn
			* @example
			*
			* function Foo() {
			*   this.a = _.constant('a');
			*   this.b = _.constant('b');
			* }
			*
			* Foo.prototype.c = _.constant('c');
			*
			* _.functions(new Foo);
			* // => ['a', 'b']
			*/
			function functions(object) {
				return object == null ? [] : baseFunctions(object, keys(object));
			}
			/**
			* Creates an array of function property names from own and inherited
			* enumerable properties of `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The object to inspect.
			* @returns {Array} Returns the function names.
			* @see _.functions
			* @example
			*
			* function Foo() {
			*   this.a = _.constant('a');
			*   this.b = _.constant('b');
			* }
			*
			* Foo.prototype.c = _.constant('c');
			*
			* _.functionsIn(new Foo);
			* // => ['a', 'b', 'c']
			*/
			function functionsIn(object) {
				return object == null ? [] : baseFunctions(object, keysIn(object));
			}
			/**
			* Gets the value at `path` of `object`. If the resolved value is
			* `undefined`, the `defaultValue` is returned in its place.
			*
			* @static
			* @memberOf _
			* @since 3.7.0
			* @category Object
			* @param {Object} object The object to query.
			* @param {Array|string} path The path of the property to get.
			* @param {*} [defaultValue] The value returned for `undefined` resolved values.
			* @returns {*} Returns the resolved value.
			* @example
			*
			* var object = { 'a': [{ 'b': { 'c': 3 } }] };
			*
			* _.get(object, 'a[0].b.c');
			* // => 3
			*
			* _.get(object, ['a', '0', 'b', 'c']);
			* // => 3
			*
			* _.get(object, 'a.b.c', 'default');
			* // => 'default'
			*/
			function get(object, path, defaultValue) {
				var result = object == null ? undefined : baseGet(object, path);
				return result === undefined ? defaultValue : result;
			}
			/**
			* Checks if `path` is a direct property of `object`.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The object to query.
			* @param {Array|string} path The path to check.
			* @returns {boolean} Returns `true` if `path` exists, else `false`.
			* @example
			*
			* var object = { 'a': { 'b': 2 } };
			* var other = _.create({ 'a': _.create({ 'b': 2 }) });
			*
			* _.has(object, 'a');
			* // => true
			*
			* _.has(object, 'a.b');
			* // => true
			*
			* _.has(object, ['a', 'b']);
			* // => true
			*
			* _.has(other, 'a');
			* // => false
			*/
			function has(object, path) {
				return object != null && hasPath(object, path, baseHas);
			}
			/**
			* Checks if `path` is a direct or inherited property of `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The object to query.
			* @param {Array|string} path The path to check.
			* @returns {boolean} Returns `true` if `path` exists, else `false`.
			* @example
			*
			* var object = _.create({ 'a': _.create({ 'b': 2 }) });
			*
			* _.hasIn(object, 'a');
			* // => true
			*
			* _.hasIn(object, 'a.b');
			* // => true
			*
			* _.hasIn(object, ['a', 'b']);
			* // => true
			*
			* _.hasIn(object, 'b');
			* // => false
			*/
			function hasIn(object, path) {
				return object != null && hasPath(object, path, baseHasIn);
			}
			/**
			* Creates an object composed of the inverted keys and values of `object`.
			* If `object` contains duplicate values, subsequent values overwrite
			* property assignments of previous values.
			*
			* @static
			* @memberOf _
			* @since 0.7.0
			* @category Object
			* @param {Object} object The object to invert.
			* @returns {Object} Returns the new inverted object.
			* @example
			*
			* var object = { 'a': 1, 'b': 2, 'c': 1 };
			*
			* _.invert(object);
			* // => { '1': 'c', '2': 'b' }
			*/
			var invert = createInverter(function(result, value, key) {
				if (value != null && typeof value.toString != "function") value = nativeObjectToString.call(value);
				result[value] = key;
			}, constant(identity));
			/**
			* This method is like `_.invert` except that the inverted object is generated
			* from the results of running each element of `object` thru `iteratee`. The
			* corresponding inverted value of each inverted key is an array of keys
			* responsible for generating the inverted value. The iteratee is invoked
			* with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.1.0
			* @category Object
			* @param {Object} object The object to invert.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {Object} Returns the new inverted object.
			* @example
			*
			* var object = { 'a': 1, 'b': 2, 'c': 1 };
			*
			* _.invertBy(object);
			* // => { '1': ['a', 'c'], '2': ['b'] }
			*
			* _.invertBy(object, function(value) {
			*   return 'group' + value;
			* });
			* // => { 'group1': ['a', 'c'], 'group2': ['b'] }
			*/
			var invertBy = createInverter(function(result, value, key) {
				if (value != null && typeof value.toString != "function") value = nativeObjectToString.call(value);
				if (hasOwnProperty.call(result, value)) result[value].push(key);
				else result[value] = [key];
			}, getIteratee);
			/**
			* Invokes the method at `path` of `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The object to query.
			* @param {Array|string} path The path of the method to invoke.
			* @param {...*} [args] The arguments to invoke the method with.
			* @returns {*} Returns the result of the invoked method.
			* @example
			*
			* var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
			*
			* _.invoke(object, 'a[0].b.c.slice', 1, 3);
			* // => [2, 3]
			*/
			var invoke = baseRest(baseInvoke);
			/**
			* Creates an array of the own enumerable property names of `object`.
			*
			* **Note:** Non-object values are coerced to objects. See the
			* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
			* for more details.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.keys(new Foo);
			* // => ['a', 'b'] (iteration order is not guaranteed)
			*
			* _.keys('hi');
			* // => ['0', '1']
			*/
			function keys(object) {
				return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
			}
			/**
			* Creates an array of the own and inherited enumerable property names of `object`.
			*
			* **Note:** Non-object values are coerced to objects.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Object
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.keysIn(new Foo);
			* // => ['a', 'b', 'c'] (iteration order is not guaranteed)
			*/
			function keysIn(object) {
				return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
			}
			/**
			* The opposite of `_.mapValues`; this method creates an object with the
			* same values as `object` and keys generated by running each own enumerable
			* string keyed property of `object` thru `iteratee`. The iteratee is invoked
			* with three arguments: (value, key, object).
			*
			* @static
			* @memberOf _
			* @since 3.8.0
			* @category Object
			* @param {Object} object The object to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Object} Returns the new mapped object.
			* @see _.mapValues
			* @example
			*
			* _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
			*   return key + value;
			* });
			* // => { 'a1': 1, 'b2': 2 }
			*/
			function mapKeys(object, iteratee) {
				var result = {};
				iteratee = getIteratee(iteratee, 3);
				baseForOwn(object, function(value, key, object) {
					baseAssignValue(result, iteratee(value, key, object), value);
				});
				return result;
			}
			/**
			* Creates an object with the same keys as `object` and values generated
			* by running each own enumerable string keyed property of `object` thru
			* `iteratee`. The iteratee is invoked with three arguments:
			* (value, key, object).
			*
			* @static
			* @memberOf _
			* @since 2.4.0
			* @category Object
			* @param {Object} object The object to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Object} Returns the new mapped object.
			* @see _.mapKeys
			* @example
			*
			* var users = {
			*   'fred':    { 'user': 'fred',    'age': 40 },
			*   'pebbles': { 'user': 'pebbles', 'age': 1 }
			* };
			*
			* _.mapValues(users, function(o) { return o.age; });
			* // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
			*
			* // The `_.property` iteratee shorthand.
			* _.mapValues(users, 'age');
			* // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
			*/
			function mapValues(object, iteratee) {
				var result = {};
				iteratee = getIteratee(iteratee, 3);
				baseForOwn(object, function(value, key, object) {
					baseAssignValue(result, key, iteratee(value, key, object));
				});
				return result;
			}
			/**
			* This method is like `_.assign` except that it recursively merges own and
			* inherited enumerable string keyed properties of source objects into the
			* destination object. Source properties that resolve to `undefined` are
			* skipped if a destination value exists. Array and plain object properties
			* are merged recursively. Other objects and value types are overridden by
			* assignment. Source objects are applied from left to right. Subsequent
			* sources overwrite property assignments of previous sources.
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 0.5.0
			* @category Object
			* @param {Object} object The destination object.
			* @param {...Object} [sources] The source objects.
			* @returns {Object} Returns `object`.
			* @example
			*
			* var object = {
			*   'a': [{ 'b': 2 }, { 'd': 4 }]
			* };
			*
			* var other = {
			*   'a': [{ 'c': 3 }, { 'e': 5 }]
			* };
			*
			* _.merge(object, other);
			* // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
			*/
			var merge = createAssigner(function(object, source, srcIndex) {
				baseMerge(object, source, srcIndex);
			});
			/**
			* This method is like `_.merge` except that it accepts `customizer` which
			* is invoked to produce the merged values of the destination and source
			* properties. If `customizer` returns `undefined`, merging is handled by the
			* method instead. The `customizer` is invoked with six arguments:
			* (objValue, srcValue, key, object, source, stack).
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The destination object.
			* @param {...Object} sources The source objects.
			* @param {Function} customizer The function to customize assigned values.
			* @returns {Object} Returns `object`.
			* @example
			*
			* function customizer(objValue, srcValue) {
			*   if (_.isArray(objValue)) {
			*     return objValue.concat(srcValue);
			*   }
			* }
			*
			* var object = { 'a': [1], 'b': [2] };
			* var other = { 'a': [3], 'b': [4] };
			*
			* _.mergeWith(object, other, customizer);
			* // => { 'a': [1, 3], 'b': [2, 4] }
			*/
			var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
				baseMerge(object, source, srcIndex, customizer);
			});
			/**
			* The opposite of `_.pick`; this method creates an object composed of the
			* own and inherited enumerable property paths of `object` that are not omitted.
			*
			* **Note:** This method is considerably slower than `_.pick`.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The source object.
			* @param {...(string|string[])} [paths] The property paths to omit.
			* @returns {Object} Returns the new object.
			* @example
			*
			* var object = { 'a': 1, 'b': '2', 'c': 3 };
			*
			* _.omit(object, ['a', 'c']);
			* // => { 'b': '2' }
			*/
			var omit = flatRest(function(object, paths) {
				var result = {};
				if (object == null) return result;
				var isDeep = false;
				paths = arrayMap(paths, function(path) {
					path = castPath(path, object);
					isDeep || (isDeep = path.length > 1);
					return path;
				});
				copyObject(object, getAllKeysIn(object), result);
				if (isDeep) result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
				var length = paths.length;
				while (length--) baseUnset(result, paths[length]);
				return result;
			});
			/**
			* The opposite of `_.pickBy`; this method creates an object composed of
			* the own and inherited enumerable string keyed properties of `object` that
			* `predicate` doesn't return truthy for. The predicate is invoked with two
			* arguments: (value, key).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The source object.
			* @param {Function} [predicate=_.identity] The function invoked per property.
			* @returns {Object} Returns the new object.
			* @example
			*
			* var object = { 'a': 1, 'b': '2', 'c': 3 };
			*
			* _.omitBy(object, _.isNumber);
			* // => { 'b': '2' }
			*/
			function omitBy(object, predicate) {
				return pickBy(object, negate(getIteratee(predicate)));
			}
			/**
			* Creates an object composed of the picked `object` properties.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The source object.
			* @param {...(string|string[])} [paths] The property paths to pick.
			* @returns {Object} Returns the new object.
			* @example
			*
			* var object = { 'a': 1, 'b': '2', 'c': 3 };
			*
			* _.pick(object, ['a', 'c']);
			* // => { 'a': 1, 'c': 3 }
			*/
			var pick = flatRest(function(object, paths) {
				return object == null ? {} : basePick(object, paths);
			});
			/**
			* Creates an object composed of the `object` properties `predicate` returns
			* truthy for. The predicate is invoked with two arguments: (value, key).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The source object.
			* @param {Function} [predicate=_.identity] The function invoked per property.
			* @returns {Object} Returns the new object.
			* @example
			*
			* var object = { 'a': 1, 'b': '2', 'c': 3 };
			*
			* _.pickBy(object, _.isNumber);
			* // => { 'a': 1, 'c': 3 }
			*/
			function pickBy(object, predicate) {
				if (object == null) return {};
				var props = arrayMap(getAllKeysIn(object), function(prop) {
					return [prop];
				});
				predicate = getIteratee(predicate);
				return basePickBy(object, props, function(value, path) {
					return predicate(value, path[0]);
				});
			}
			/**
			* This method is like `_.get` except that if the resolved value is a
			* function it's invoked with the `this` binding of its parent object and
			* its result is returned.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The object to query.
			* @param {Array|string} path The path of the property to resolve.
			* @param {*} [defaultValue] The value returned for `undefined` resolved values.
			* @returns {*} Returns the resolved value.
			* @example
			*
			* var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
			*
			* _.result(object, 'a[0].b.c1');
			* // => 3
			*
			* _.result(object, 'a[0].b.c2');
			* // => 4
			*
			* _.result(object, 'a[0].b.c3', 'default');
			* // => 'default'
			*
			* _.result(object, 'a[0].b.c3', _.constant('default'));
			* // => 'default'
			*/
			function result(object, path, defaultValue) {
				path = castPath(path, object);
				var index = -1, length = path.length;
				if (!length) {
					length = 1;
					object = undefined;
				}
				while (++index < length) {
					var value = object == null ? undefined : object[toKey(path[index])];
					if (value === undefined) {
						index = length;
						value = defaultValue;
					}
					object = isFunction(value) ? value.call(object) : value;
				}
				return object;
			}
			/**
			* Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
			* it's created. Arrays are created for missing index properties while objects
			* are created for all other missing properties. Use `_.setWith` to customize
			* `path` creation.
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 3.7.0
			* @category Object
			* @param {Object} object The object to modify.
			* @param {Array|string} path The path of the property to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns `object`.
			* @example
			*
			* var object = { 'a': [{ 'b': { 'c': 3 } }] };
			*
			* _.set(object, 'a[0].b.c', 4);
			* console.log(object.a[0].b.c);
			* // => 4
			*
			* _.set(object, ['x', '0', 'y', 'z'], 5);
			* console.log(object.x[0].y.z);
			* // => 5
			*/
			function set(object, path, value) {
				return object == null ? object : baseSet(object, path, value);
			}
			/**
			* This method is like `_.set` except that it accepts `customizer` which is
			* invoked to produce the objects of `path`.  If `customizer` returns `undefined`
			* path creation is handled by the method instead. The `customizer` is invoked
			* with three arguments: (nsValue, key, nsObject).
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The object to modify.
			* @param {Array|string} path The path of the property to set.
			* @param {*} value The value to set.
			* @param {Function} [customizer] The function to customize assigned values.
			* @returns {Object} Returns `object`.
			* @example
			*
			* var object = {};
			*
			* _.setWith(object, '[0][1]', 'a', Object);
			* // => { '0': { '1': 'a' } }
			*/
			function setWith(object, path, value, customizer) {
				customizer = typeof customizer == "function" ? customizer : undefined;
				return object == null ? object : baseSet(object, path, value, customizer);
			}
			/**
			* Creates an array of own enumerable string keyed-value pairs for `object`
			* which can be consumed by `_.fromPairs`. If `object` is a map or set, its
			* entries are returned.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @alias entries
			* @category Object
			* @param {Object} object The object to query.
			* @returns {Array} Returns the key-value pairs.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.toPairs(new Foo);
			* // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
			*/
			var toPairs = createToPairs(keys);
			/**
			* Creates an array of own and inherited enumerable string keyed-value pairs
			* for `object` which can be consumed by `_.fromPairs`. If `object` is a map
			* or set, its entries are returned.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @alias entriesIn
			* @category Object
			* @param {Object} object The object to query.
			* @returns {Array} Returns the key-value pairs.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.toPairsIn(new Foo);
			* // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
			*/
			var toPairsIn = createToPairs(keysIn);
			/**
			* An alternative to `_.reduce`; this method transforms `object` to a new
			* `accumulator` object which is the result of running each of its own
			* enumerable string keyed properties thru `iteratee`, with each invocation
			* potentially mutating the `accumulator` object. If `accumulator` is not
			* provided, a new object with the same `[[Prototype]]` will be used. The
			* iteratee is invoked with four arguments: (accumulator, value, key, object).
			* Iteratee functions may exit iteration early by explicitly returning `false`.
			*
			* @static
			* @memberOf _
			* @since 1.3.0
			* @category Object
			* @param {Object} object The object to iterate over.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @param {*} [accumulator] The custom accumulator value.
			* @returns {*} Returns the accumulated value.
			* @example
			*
			* _.transform([2, 3, 4], function(result, n) {
			*   result.push(n *= n);
			*   return n % 2 == 0;
			* }, []);
			* // => [4, 9]
			*
			* _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
			*   (result[value] || (result[value] = [])).push(key);
			* }, {});
			* // => { '1': ['a', 'c'], '2': ['b'] }
			*/
			function transform(object, iteratee, accumulator) {
				var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
				iteratee = getIteratee(iteratee, 4);
				if (accumulator == null) {
					var Ctor = object && object.constructor;
					if (isArrLike) accumulator = isArr ? new Ctor() : [];
					else if (isObject(object)) accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
					else accumulator = {};
				}
				(isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
					return iteratee(accumulator, value, index, object);
				});
				return accumulator;
			}
			/**
			* Removes the property at `path` of `object`.
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Object
			* @param {Object} object The object to modify.
			* @param {Array|string} path The path of the property to unset.
			* @returns {boolean} Returns `true` if the property is deleted, else `false`.
			* @example
			*
			* var object = { 'a': [{ 'b': { 'c': 7 } }] };
			* _.unset(object, 'a[0].b.c');
			* // => true
			*
			* console.log(object);
			* // => { 'a': [{ 'b': {} }] };
			*
			* _.unset(object, ['a', '0', 'b', 'c']);
			* // => true
			*
			* console.log(object);
			* // => { 'a': [{ 'b': {} }] };
			*/
			function unset(object, path) {
				return object == null ? true : baseUnset(object, path);
			}
			/**
			* This method is like `_.set` except that accepts `updater` to produce the
			* value to set. Use `_.updateWith` to customize `path` creation. The `updater`
			* is invoked with one argument: (value).
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 4.6.0
			* @category Object
			* @param {Object} object The object to modify.
			* @param {Array|string} path The path of the property to set.
			* @param {Function} updater The function to produce the updated value.
			* @returns {Object} Returns `object`.
			* @example
			*
			* var object = { 'a': [{ 'b': { 'c': 3 } }] };
			*
			* _.update(object, 'a[0].b.c', function(n) { return n * n; });
			* console.log(object.a[0].b.c);
			* // => 9
			*
			* _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
			* console.log(object.x[0].y.z);
			* // => 0
			*/
			function update(object, path, updater) {
				return object == null ? object : baseUpdate(object, path, castFunction(updater));
			}
			/**
			* This method is like `_.update` except that it accepts `customizer` which is
			* invoked to produce the objects of `path`.  If `customizer` returns `undefined`
			* path creation is handled by the method instead. The `customizer` is invoked
			* with three arguments: (nsValue, key, nsObject).
			*
			* **Note:** This method mutates `object`.
			*
			* @static
			* @memberOf _
			* @since 4.6.0
			* @category Object
			* @param {Object} object The object to modify.
			* @param {Array|string} path The path of the property to set.
			* @param {Function} updater The function to produce the updated value.
			* @param {Function} [customizer] The function to customize assigned values.
			* @returns {Object} Returns `object`.
			* @example
			*
			* var object = {};
			*
			* _.updateWith(object, '[0][1]', _.constant('a'), Object);
			* // => { '0': { '1': 'a' } }
			*/
			function updateWith(object, path, updater, customizer) {
				customizer = typeof customizer == "function" ? customizer : undefined;
				return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
			}
			/**
			* Creates an array of the own enumerable string keyed property values of `object`.
			*
			* **Note:** Non-object values are coerced to objects.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property values.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.values(new Foo);
			* // => [1, 2] (iteration order is not guaranteed)
			*
			* _.values('hi');
			* // => ['h', 'i']
			*/
			function values(object) {
				return object == null ? [] : baseValues(object, keys(object));
			}
			/**
			* Creates an array of the own and inherited enumerable string keyed property
			* values of `object`.
			*
			* **Note:** Non-object values are coerced to objects.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Object
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property values.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.valuesIn(new Foo);
			* // => [1, 2, 3] (iteration order is not guaranteed)
			*/
			function valuesIn(object) {
				return object == null ? [] : baseValues(object, keysIn(object));
			}
			/**
			* Clamps `number` within the inclusive `lower` and `upper` bounds.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Number
			* @param {number} number The number to clamp.
			* @param {number} [lower] The lower bound.
			* @param {number} upper The upper bound.
			* @returns {number} Returns the clamped number.
			* @example
			*
			* _.clamp(-10, -5, 5);
			* // => -5
			*
			* _.clamp(10, -5, 5);
			* // => 5
			*/
			function clamp(number, lower, upper) {
				if (upper === undefined) {
					upper = lower;
					lower = undefined;
				}
				if (upper !== undefined) {
					upper = toNumber(upper);
					upper = upper === upper ? upper : 0;
				}
				if (lower !== undefined) {
					lower = toNumber(lower);
					lower = lower === lower ? lower : 0;
				}
				return baseClamp(toNumber(number), lower, upper);
			}
			/**
			* Checks if `n` is between `start` and up to, but not including, `end`. If
			* `end` is not specified, it's set to `start` with `start` then set to `0`.
			* If `start` is greater than `end` the params are swapped to support
			* negative ranges.
			*
			* @static
			* @memberOf _
			* @since 3.3.0
			* @category Number
			* @param {number} number The number to check.
			* @param {number} [start=0] The start of the range.
			* @param {number} end The end of the range.
			* @returns {boolean} Returns `true` if `number` is in the range, else `false`.
			* @see _.range, _.rangeRight
			* @example
			*
			* _.inRange(3, 2, 4);
			* // => true
			*
			* _.inRange(4, 8);
			* // => true
			*
			* _.inRange(4, 2);
			* // => false
			*
			* _.inRange(2, 2);
			* // => false
			*
			* _.inRange(1.2, 2);
			* // => true
			*
			* _.inRange(5.2, 4);
			* // => false
			*
			* _.inRange(-3, -2, -6);
			* // => true
			*/
			function inRange(number, start, end) {
				start = toFinite(start);
				if (end === undefined) {
					end = start;
					start = 0;
				} else end = toFinite(end);
				number = toNumber(number);
				return baseInRange(number, start, end);
			}
			/**
			* Produces a random number between the inclusive `lower` and `upper` bounds.
			* If only one argument is provided a number between `0` and the given number
			* is returned. If `floating` is `true`, or either `lower` or `upper` are
			* floats, a floating-point number is returned instead of an integer.
			*
			* **Note:** JavaScript follows the IEEE-754 standard for resolving
			* floating-point values which can produce unexpected results.
			*
			* **Note:** If `lower` is greater than `upper`, the values are swapped.
			*
			* @static
			* @memberOf _
			* @since 0.7.0
			* @category Number
			* @param {number} [lower=0] The lower bound.
			* @param {number} [upper=1] The upper bound.
			* @param {boolean} [floating] Specify returning a floating-point number.
			* @returns {number} Returns the random number.
			* @example
			*
			* _.random(0, 5);
			* // => an integer between 0 and 5
			*
			* // when lower is greater than upper the values are swapped
			* _.random(5, 0);
			* // => an integer between 0 and 5
			*
			* _.random(5);
			* // => also an integer between 0 and 5
			*
			* _.random(-5);
			* // => an integer between -5 and 0
			*
			* _.random(5, true);
			* // => a floating-point number between 0 and 5
			*
			* _.random(1.2, 5.2);
			* // => a floating-point number between 1.2 and 5.2
			*/
			function random(lower, upper, floating) {
				if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) upper = floating = undefined;
				if (floating === undefined) {
					if (typeof upper == "boolean") {
						floating = upper;
						upper = undefined;
					} else if (typeof lower == "boolean") {
						floating = lower;
						lower = undefined;
					}
				}
				if (lower === undefined && upper === undefined) {
					lower = 0;
					upper = 1;
				} else {
					lower = toFinite(lower);
					if (upper === undefined) {
						upper = lower;
						lower = 0;
					} else upper = toFinite(upper);
				}
				if (lower > upper) {
					var temp = lower;
					lower = upper;
					upper = temp;
				}
				if (floating || lower % 1 || upper % 1) {
					var rand = nativeRandom();
					return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
				}
				return baseRandom(lower, upper);
			}
			/**
			* Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the camel cased string.
			* @example
			*
			* _.camelCase('Foo Bar');
			* // => 'fooBar'
			*
			* _.camelCase('--foo-bar--');
			* // => 'fooBar'
			*
			* _.camelCase('__FOO_BAR__');
			* // => 'fooBar'
			*/
			var camelCase = createCompounder(function(result, word, index) {
				word = word.toLowerCase();
				return result + (index ? capitalize(word) : word);
			});
			/**
			* Converts the first character of `string` to upper case and the remaining
			* to lower case.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to capitalize.
			* @returns {string} Returns the capitalized string.
			* @example
			*
			* _.capitalize('FRED');
			* // => 'Fred'
			*/
			function capitalize(string) {
				return upperFirst(toString(string).toLowerCase());
			}
			/**
			* Deburrs `string` by converting
			* [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
			* and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
			* letters to basic Latin letters and removing
			* [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to deburr.
			* @returns {string} Returns the deburred string.
			* @example
			*
			* _.deburr('déjà vu');
			* // => 'deja vu'
			*/
			function deburr(string) {
				string = toString(string);
				return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
			}
			/**
			* Checks if `string` ends with the given target string.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to inspect.
			* @param {string} [target] The string to search for.
			* @param {number} [position=string.length] The position to search up to.
			* @returns {boolean} Returns `true` if `string` ends with `target`,
			*  else `false`.
			* @example
			*
			* _.endsWith('abc', 'c');
			* // => true
			*
			* _.endsWith('abc', 'b');
			* // => false
			*
			* _.endsWith('abc', 'b', 2);
			* // => true
			*/
			function endsWith(string, target, position) {
				string = toString(string);
				target = baseToString(target);
				var length = string.length;
				position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
				var end = position;
				position -= target.length;
				return position >= 0 && string.slice(position, end) == target;
			}
			/**
			* Converts the characters "&", "<", ">", '"', and "'" in `string` to their
			* corresponding HTML entities.
			*
			* **Note:** No other characters are escaped. To escape additional
			* characters use a third-party library like [_he_](https://mths.be/he).
			*
			* Though the ">" character is escaped for symmetry, characters like
			* ">" and "/" don't need escaping in HTML and have no special meaning
			* unless they're part of a tag or unquoted attribute value. See
			* [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
			* (under "semi-related fun fact") for more details.
			*
			* When working with HTML you should always
			* [quote attribute values](http://wonko.com/post/html-escaping) to reduce
			* XSS vectors.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category String
			* @param {string} [string=''] The string to escape.
			* @returns {string} Returns the escaped string.
			* @example
			*
			* _.escape('fred, barney, & pebbles');
			* // => 'fred, barney, &amp; pebbles'
			*/
			function escape(string) {
				string = toString(string);
				return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
			}
			/**
			* Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
			* "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to escape.
			* @returns {string} Returns the escaped string.
			* @example
			*
			* _.escapeRegExp('[lodash](https://lodash.com/)');
			* // => '\[lodash\]\(https://lodash\.com/\)'
			*/
			function escapeRegExp(string) {
				string = toString(string);
				return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
			}
			/**
			* Converts `string` to
			* [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the kebab cased string.
			* @example
			*
			* _.kebabCase('Foo Bar');
			* // => 'foo-bar'
			*
			* _.kebabCase('fooBar');
			* // => 'foo-bar'
			*
			* _.kebabCase('__FOO_BAR__');
			* // => 'foo-bar'
			*/
			var kebabCase = createCompounder(function(result, word, index) {
				return result + (index ? "-" : "") + word.toLowerCase();
			});
			/**
			* Converts `string`, as space separated words, to lower case.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the lower cased string.
			* @example
			*
			* _.lowerCase('--Foo-Bar--');
			* // => 'foo bar'
			*
			* _.lowerCase('fooBar');
			* // => 'foo bar'
			*
			* _.lowerCase('__FOO_BAR__');
			* // => 'foo bar'
			*/
			var lowerCase = createCompounder(function(result, word, index) {
				return result + (index ? " " : "") + word.toLowerCase();
			});
			/**
			* Converts the first character of `string` to lower case.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the converted string.
			* @example
			*
			* _.lowerFirst('Fred');
			* // => 'fred'
			*
			* _.lowerFirst('FRED');
			* // => 'fRED'
			*/
			var lowerFirst = createCaseFirst("toLowerCase");
			/**
			* Pads `string` on the left and right sides if it's shorter than `length`.
			* Padding characters are truncated if they can't be evenly divided by `length`.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to pad.
			* @param {number} [length=0] The padding length.
			* @param {string} [chars=' '] The string used as padding.
			* @returns {string} Returns the padded string.
			* @example
			*
			* _.pad('abc', 8);
			* // => '  abc   '
			*
			* _.pad('abc', 8, '_-');
			* // => '_-abc_-_'
			*
			* _.pad('abc', 3);
			* // => 'abc'
			*/
			function pad(string, length, chars) {
				string = toString(string);
				length = toInteger(length);
				var strLength = length ? stringSize(string) : 0;
				if (!length || strLength >= length) return string;
				var mid = (length - strLength) / 2;
				return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
			}
			/**
			* Pads `string` on the right side if it's shorter than `length`. Padding
			* characters are truncated if they exceed `length`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to pad.
			* @param {number} [length=0] The padding length.
			* @param {string} [chars=' '] The string used as padding.
			* @returns {string} Returns the padded string.
			* @example
			*
			* _.padEnd('abc', 6);
			* // => 'abc   '
			*
			* _.padEnd('abc', 6, '_-');
			* // => 'abc_-_'
			*
			* _.padEnd('abc', 3);
			* // => 'abc'
			*/
			function padEnd(string, length, chars) {
				string = toString(string);
				length = toInteger(length);
				var strLength = length ? stringSize(string) : 0;
				return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
			}
			/**
			* Pads `string` on the left side if it's shorter than `length`. Padding
			* characters are truncated if they exceed `length`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to pad.
			* @param {number} [length=0] The padding length.
			* @param {string} [chars=' '] The string used as padding.
			* @returns {string} Returns the padded string.
			* @example
			*
			* _.padStart('abc', 6);
			* // => '   abc'
			*
			* _.padStart('abc', 6, '_-');
			* // => '_-_abc'
			*
			* _.padStart('abc', 3);
			* // => 'abc'
			*/
			function padStart(string, length, chars) {
				string = toString(string);
				length = toInteger(length);
				var strLength = length ? stringSize(string) : 0;
				return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
			}
			/**
			* Converts `string` to an integer of the specified radix. If `radix` is
			* `undefined` or `0`, a `radix` of `10` is used unless `value` is a
			* hexadecimal, in which case a `radix` of `16` is used.
			*
			* **Note:** This method aligns with the
			* [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
			*
			* @static
			* @memberOf _
			* @since 1.1.0
			* @category String
			* @param {string} string The string to convert.
			* @param {number} [radix=10] The radix to interpret `value` by.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {number} Returns the converted integer.
			* @example
			*
			* _.parseInt('08');
			* // => 8
			*
			* _.map(['6', '08', '10'], _.parseInt);
			* // => [6, 8, 10]
			*/
			function parseInt(string, radix, guard) {
				if (guard || radix == null) radix = 0;
				else if (radix) radix = +radix;
				return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
			}
			/**
			* Repeats the given string `n` times.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to repeat.
			* @param {number} [n=1] The number of times to repeat the string.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {string} Returns the repeated string.
			* @example
			*
			* _.repeat('*', 3);
			* // => '***'
			*
			* _.repeat('abc', 2);
			* // => 'abcabc'
			*
			* _.repeat('abc', 0);
			* // => ''
			*/
			function repeat(string, n, guard) {
				if (guard ? isIterateeCall(string, n, guard) : n === undefined) n = 1;
				else n = toInteger(n);
				return baseRepeat(toString(string), n);
			}
			/**
			* Replaces matches for `pattern` in `string` with `replacement`.
			*
			* **Note:** This method is based on
			* [`String#replace`](https://mdn.io/String/replace).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to modify.
			* @param {RegExp|string} pattern The pattern to replace.
			* @param {Function|string} replacement The match replacement.
			* @returns {string} Returns the modified string.
			* @example
			*
			* _.replace('Hi Fred', 'Fred', 'Barney');
			* // => 'Hi Barney'
			*/
			function replace() {
				var args = arguments, string = toString(args[0]);
				return args.length < 3 ? string : string.replace(args[1], args[2]);
			}
			/**
			* Converts `string` to
			* [snake case](https://en.wikipedia.org/wiki/Snake_case).
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the snake cased string.
			* @example
			*
			* _.snakeCase('Foo Bar');
			* // => 'foo_bar'
			*
			* _.snakeCase('fooBar');
			* // => 'foo_bar'
			*
			* _.snakeCase('--FOO-BAR--');
			* // => 'foo_bar'
			*/
			var snakeCase = createCompounder(function(result, word, index) {
				return result + (index ? "_" : "") + word.toLowerCase();
			});
			/**
			* Splits `string` by `separator`.
			*
			* **Note:** This method is based on
			* [`String#split`](https://mdn.io/String/split).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to split.
			* @param {RegExp|string} separator The separator pattern to split by.
			* @param {number} [limit] The length to truncate results to.
			* @returns {Array} Returns the string segments.
			* @example
			*
			* _.split('a-b-c', '-', 2);
			* // => ['a', 'b']
			*/
			function split(string, separator, limit) {
				if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) separator = limit = undefined;
				limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
				if (!limit) return [];
				string = toString(string);
				if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
					separator = baseToString(separator);
					if (!separator && hasUnicode(string)) return castSlice(stringToArray(string), 0, limit);
				}
				return string.split(separator, limit);
			}
			/**
			* Converts `string` to
			* [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
			*
			* @static
			* @memberOf _
			* @since 3.1.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the start cased string.
			* @example
			*
			* _.startCase('--foo-bar--');
			* // => 'Foo Bar'
			*
			* _.startCase('fooBar');
			* // => 'Foo Bar'
			*
			* _.startCase('__FOO_BAR__');
			* // => 'FOO BAR'
			*/
			var startCase = createCompounder(function(result, word, index) {
				return result + (index ? " " : "") + upperFirst(word);
			});
			/**
			* Checks if `string` starts with the given target string.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to inspect.
			* @param {string} [target] The string to search for.
			* @param {number} [position=0] The position to search from.
			* @returns {boolean} Returns `true` if `string` starts with `target`,
			*  else `false`.
			* @example
			*
			* _.startsWith('abc', 'a');
			* // => true
			*
			* _.startsWith('abc', 'b');
			* // => false
			*
			* _.startsWith('abc', 'b', 1);
			* // => true
			*/
			function startsWith(string, target, position) {
				string = toString(string);
				position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
				target = baseToString(target);
				return string.slice(position, position + target.length) == target;
			}
			/**
			* Creates a compiled template function that can interpolate data properties
			* in "interpolate" delimiters, HTML-escape interpolated data properties in
			* "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
			* properties may be accessed as free variables in the template. If a setting
			* object is given, it takes precedence over `_.templateSettings` values.
			*
			* **Security:** `_.template` is insecure and should not be used. It will be
			* removed in Lodash v5. Avoid untrusted input. See
			* [threat model](https://github.com/lodash/lodash/blob/main/threat-model.md).
			*
			* **Note:** In the development build `_.template` utilizes
			* [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
			* for easier debugging.
			*
			* For more information on precompiling templates see
			* [lodash's custom builds documentation](https://lodash.com/custom-builds).
			*
			* For more information on Chrome extension sandboxes see
			* [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category String
			* @param {string} [string=''] The template string.
			* @param {Object} [options={}] The options object.
			* @param {RegExp} [options.escape=_.templateSettings.escape]
			*  The HTML "escape" delimiter.
			* @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
			*  The "evaluate" delimiter.
			* @param {Object} [options.imports=_.templateSettings.imports]
			*  An object to import into the template as free variables.
			* @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
			*  The "interpolate" delimiter.
			* @param {string} [options.sourceURL='lodash.templateSources[n]']
			*  The sourceURL of the compiled template.
			* @param {string} [options.variable='obj']
			*  The data object variable name.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Function} Returns the compiled template function.
			* @example
			*
			* // Use the "interpolate" delimiter to create a compiled template.
			* var compiled = _.template('hello <%= user %>!');
			* compiled({ 'user': 'fred' });
			* // => 'hello fred!'
			*
			* // Use the HTML "escape" delimiter to escape data property values.
			* var compiled = _.template('<b><%- value %></b>');
			* compiled({ 'value': '<script>' });
			* // => '<b>&lt;script&gt;</b>'
			*
			* // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
			* var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
			* compiled({ 'users': ['fred', 'barney'] });
			* // => '<li>fred</li><li>barney</li>'
			*
			* // Use the internal `print` function in "evaluate" delimiters.
			* var compiled = _.template('<% print("hello " + user); %>!');
			* compiled({ 'user': 'barney' });
			* // => 'hello barney!'
			*
			* // Use the ES template literal delimiter as an "interpolate" delimiter.
			* // Disable support by replacing the "interpolate" delimiter.
			* var compiled = _.template('hello ${ user }!');
			* compiled({ 'user': 'pebbles' });
			* // => 'hello pebbles!'
			*
			* // Use backslashes to treat delimiters as plain text.
			* var compiled = _.template('<%= "\\<%- value %\\>" %>');
			* compiled({ 'value': 'ignored' });
			* // => '<%- value %>'
			*
			* // Use the `imports` option to import `jQuery` as `jq`.
			* var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
			* var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
			* compiled({ 'users': ['fred', 'barney'] });
			* // => '<li>fred</li><li>barney</li>'
			*
			* // Use the `sourceURL` option to specify a custom sourceURL for the template.
			* var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
			* compiled(data);
			* // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
			*
			* // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
			* var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
			* compiled.source;
			* // => function(data) {
			* //   var __t, __p = '';
			* //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
			* //   return __p;
			* // }
			*
			* // Use custom template delimiters.
			* _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
			* var compiled = _.template('hello {{ user }}!');
			* compiled({ 'user': 'mustache' });
			* // => 'hello mustache!'
			*
			* // Use the `source` property to inline compiled templates for meaningful
			* // line numbers in error messages and stack traces.
			* fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
			*   var JST = {\
			*     "main": ' + _.template(mainText).source + '\
			*   };\
			* ');
			*/
			function template(string, options, guard) {
				var settings = lodash.templateSettings;
				if (guard && isIterateeCall(string, options, guard)) options = undefined;
				string = toString(string);
				options = assignWith({}, options, settings, customDefaultsAssignIn);
				var imports = assignWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
				arrayEach(importsKeys, function(key) {
					if (reForbiddenIdentifierChars.test(key)) throw new Error(INVALID_TEMPL_IMPORTS_ERROR_TEXT);
				});
				var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
				var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
				var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
				string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
					interpolateValue || (interpolateValue = esTemplateValue);
					source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
					if (escapeValue) {
						isEscaping = true;
						source += "' +\n__e(" + escapeValue + ") +\n'";
					}
					if (evaluateValue) {
						isEvaluating = true;
						source += "';\n" + evaluateValue + ";\n__p += '";
					}
					if (interpolateValue) source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
					index = offset + match.length;
					return match;
				});
				source += "';\n";
				var variable = hasOwnProperty.call(options, "variable") && options.variable;
				if (!variable) source = "with (obj) {\n" + source + "\n}\n";
				else if (reForbiddenIdentifierChars.test(variable)) throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
				source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
				source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
				var result = attempt(function() {
					return Function(importsKeys, sourceURL + "return " + source).apply(undefined, importsValues);
				});
				result.source = source;
				if (isError(result)) throw result;
				return result;
			}
			/**
			* Converts `string`, as a whole, to lower case just like
			* [String#toLowerCase](https://mdn.io/toLowerCase).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the lower cased string.
			* @example
			*
			* _.toLower('--Foo-Bar--');
			* // => '--foo-bar--'
			*
			* _.toLower('fooBar');
			* // => 'foobar'
			*
			* _.toLower('__FOO_BAR__');
			* // => '__foo_bar__'
			*/
			function toLower(value) {
				return toString(value).toLowerCase();
			}
			/**
			* Converts `string`, as a whole, to upper case just like
			* [String#toUpperCase](https://mdn.io/toUpperCase).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the upper cased string.
			* @example
			*
			* _.toUpper('--foo-bar--');
			* // => '--FOO-BAR--'
			*
			* _.toUpper('fooBar');
			* // => 'FOOBAR'
			*
			* _.toUpper('__foo_bar__');
			* // => '__FOO_BAR__'
			*/
			function toUpper(value) {
				return toString(value).toUpperCase();
			}
			/**
			* Removes leading and trailing whitespace or specified characters from `string`.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to trim.
			* @param {string} [chars=whitespace] The characters to trim.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {string} Returns the trimmed string.
			* @example
			*
			* _.trim('  abc  ');
			* // => 'abc'
			*
			* _.trim('-_-abc-_-', '_-');
			* // => 'abc'
			*
			* _.map(['  foo  ', '  bar  '], _.trim);
			* // => ['foo', 'bar']
			*/
			function trim(string, chars, guard) {
				string = toString(string);
				if (string && (guard || chars === undefined)) return baseTrim(string);
				if (!string || !(chars = baseToString(chars))) return string;
				var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars);
				return castSlice(strSymbols, charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join("");
			}
			/**
			* Removes trailing whitespace or specified characters from `string`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to trim.
			* @param {string} [chars=whitespace] The characters to trim.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {string} Returns the trimmed string.
			* @example
			*
			* _.trimEnd('  abc  ');
			* // => '  abc'
			*
			* _.trimEnd('-_-abc-_-', '_-');
			* // => '-_-abc'
			*/
			function trimEnd(string, chars, guard) {
				string = toString(string);
				if (string && (guard || chars === undefined)) return string.slice(0, trimmedEndIndex(string) + 1);
				if (!string || !(chars = baseToString(chars))) return string;
				var strSymbols = stringToArray(string);
				return castSlice(strSymbols, 0, charsEndIndex(strSymbols, stringToArray(chars)) + 1).join("");
			}
			/**
			* Removes leading whitespace or specified characters from `string`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to trim.
			* @param {string} [chars=whitespace] The characters to trim.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {string} Returns the trimmed string.
			* @example
			*
			* _.trimStart('  abc  ');
			* // => 'abc  '
			*
			* _.trimStart('-_-abc-_-', '_-');
			* // => 'abc-_-'
			*/
			function trimStart(string, chars, guard) {
				string = toString(string);
				if (string && (guard || chars === undefined)) return string.replace(reTrimStart, "");
				if (!string || !(chars = baseToString(chars))) return string;
				var strSymbols = stringToArray(string);
				return castSlice(strSymbols, charsStartIndex(strSymbols, stringToArray(chars))).join("");
			}
			/**
			* Truncates `string` if it's longer than the given maximum string length.
			* The last characters of the truncated string are replaced with the omission
			* string which defaults to "...".
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to truncate.
			* @param {Object} [options={}] The options object.
			* @param {number} [options.length=30] The maximum string length.
			* @param {string} [options.omission='...'] The string to indicate text is omitted.
			* @param {RegExp|string} [options.separator] The separator pattern to truncate to.
			* @returns {string} Returns the truncated string.
			* @example
			*
			* _.truncate('hi-diddly-ho there, neighborino');
			* // => 'hi-diddly-ho there, neighbo...'
			*
			* _.truncate('hi-diddly-ho there, neighborino', {
			*   'length': 24,
			*   'separator': ' '
			* });
			* // => 'hi-diddly-ho there,...'
			*
			* _.truncate('hi-diddly-ho there, neighborino', {
			*   'length': 24,
			*   'separator': /,? +/
			* });
			* // => 'hi-diddly-ho there...'
			*
			* _.truncate('hi-diddly-ho there, neighborino', {
			*   'omission': ' [...]'
			* });
			* // => 'hi-diddly-ho there, neig [...]'
			*/
			function truncate(string, options) {
				var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
				if (isObject(options)) {
					var separator = "separator" in options ? options.separator : separator;
					length = "length" in options ? toInteger(options.length) : length;
					omission = "omission" in options ? baseToString(options.omission) : omission;
				}
				string = toString(string);
				var strLength = string.length;
				if (hasUnicode(string)) {
					var strSymbols = stringToArray(string);
					strLength = strSymbols.length;
				}
				if (length >= strLength) return string;
				var end = length - stringSize(omission);
				if (end < 1) return omission;
				var result = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
				if (separator === undefined) return result + omission;
				if (strSymbols) end += result.length - end;
				if (isRegExp(separator)) {
					if (string.slice(end).search(separator)) {
						var match, substring = result;
						if (!separator.global) separator = RegExp(separator.source, toString(reFlags.exec(separator)) + "g");
						separator.lastIndex = 0;
						while (match = separator.exec(substring)) var newEnd = match.index;
						result = result.slice(0, newEnd === undefined ? end : newEnd);
					}
				} else if (string.indexOf(baseToString(separator), end) != end) {
					var index = result.lastIndexOf(separator);
					if (index > -1) result = result.slice(0, index);
				}
				return result + omission;
			}
			/**
			* The inverse of `_.escape`; this method converts the HTML entities
			* `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
			* their corresponding characters.
			*
			* **Note:** No other HTML entities are unescaped. To unescape additional
			* HTML entities use a third-party library like [_he_](https://mths.be/he).
			*
			* @static
			* @memberOf _
			* @since 0.6.0
			* @category String
			* @param {string} [string=''] The string to unescape.
			* @returns {string} Returns the unescaped string.
			* @example
			*
			* _.unescape('fred, barney, &amp; pebbles');
			* // => 'fred, barney, & pebbles'
			*/
			function unescape(string) {
				string = toString(string);
				return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
			}
			/**
			* Converts `string`, as space separated words, to upper case.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the upper cased string.
			* @example
			*
			* _.upperCase('--foo-bar');
			* // => 'FOO BAR'
			*
			* _.upperCase('fooBar');
			* // => 'FOO BAR'
			*
			* _.upperCase('__foo_bar__');
			* // => 'FOO BAR'
			*/
			var upperCase = createCompounder(function(result, word, index) {
				return result + (index ? " " : "") + word.toUpperCase();
			});
			/**
			* Converts the first character of `string` to upper case.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category String
			* @param {string} [string=''] The string to convert.
			* @returns {string} Returns the converted string.
			* @example
			*
			* _.upperFirst('fred');
			* // => 'Fred'
			*
			* _.upperFirst('FRED');
			* // => 'FRED'
			*/
			var upperFirst = createCaseFirst("toUpperCase");
			/**
			* Splits `string` into an array of its words.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category String
			* @param {string} [string=''] The string to inspect.
			* @param {RegExp|string} [pattern] The pattern to match words.
			* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
			* @returns {Array} Returns the words of `string`.
			* @example
			*
			* _.words('fred, barney, & pebbles');
			* // => ['fred', 'barney', 'pebbles']
			*
			* _.words('fred, barney, & pebbles', /[^, ]+/g);
			* // => ['fred', 'barney', '&', 'pebbles']
			*/
			function words(string, pattern, guard) {
				string = toString(string);
				pattern = guard ? undefined : pattern;
				if (pattern === undefined) return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
				return string.match(pattern) || [];
			}
			/**
			* Attempts to invoke `func`, returning either the result or the caught error
			* object. Any additional arguments are provided to `func` when it's invoked.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Util
			* @param {Function} func The function to attempt.
			* @param {...*} [args] The arguments to invoke `func` with.
			* @returns {*} Returns the `func` result or error object.
			* @example
			*
			* // Avoid throwing errors for invalid selectors.
			* var elements = _.attempt(function(selector) {
			*   return document.querySelectorAll(selector);
			* }, '>_>');
			*
			* if (_.isError(elements)) {
			*   elements = [];
			* }
			*/
			var attempt = baseRest(function(func, args) {
				try {
					return apply(func, undefined, args);
				} catch (e) {
					return isError(e) ? e : new Error(e);
				}
			});
			/**
			* Binds methods of an object to the object itself, overwriting the existing
			* method.
			*
			* **Note:** This method doesn't set the "length" property of bound functions.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Util
			* @param {Object} object The object to bind and assign the bound methods to.
			* @param {...(string|string[])} methodNames The object method names to bind.
			* @returns {Object} Returns `object`.
			* @example
			*
			* var view = {
			*   'label': 'docs',
			*   'click': function() {
			*     console.log('clicked ' + this.label);
			*   }
			* };
			*
			* _.bindAll(view, ['click']);
			* jQuery(element).on('click', view.click);
			* // => Logs 'clicked docs' when clicked.
			*/
			var bindAll = flatRest(function(object, methodNames) {
				arrayEach(methodNames, function(key) {
					key = toKey(key);
					baseAssignValue(object, key, bind(object[key], object));
				});
				return object;
			});
			/**
			* Creates a function that iterates over `pairs` and invokes the corresponding
			* function of the first predicate to return truthy. The predicate-function
			* pairs are invoked with the `this` binding and arguments of the created
			* function.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Util
			* @param {Array} pairs The predicate-function pairs.
			* @returns {Function} Returns the new composite function.
			* @example
			*
			* var func = _.cond([
			*   [_.matches({ 'a': 1 }),           _.constant('matches A')],
			*   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
			*   [_.stubTrue,                      _.constant('no match')]
			* ]);
			*
			* func({ 'a': 1, 'b': 2 });
			* // => 'matches A'
			*
			* func({ 'a': 0, 'b': 1 });
			* // => 'matches B'
			*
			* func({ 'a': '1', 'b': '2' });
			* // => 'no match'
			*/
			function cond(pairs) {
				var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
				pairs = !length ? [] : arrayMap(pairs, function(pair) {
					if (typeof pair[1] != "function") throw new TypeError(FUNC_ERROR_TEXT);
					return [toIteratee(pair[0]), pair[1]];
				});
				return baseRest(function(args) {
					var index = -1;
					while (++index < length) {
						var pair = pairs[index];
						if (apply(pair[0], this, args)) return apply(pair[1], this, args);
					}
				});
			}
			/**
			* Creates a function that invokes the predicate properties of `source` with
			* the corresponding property values of a given object, returning `true` if
			* all predicates return truthy, else `false`.
			*
			* **Note:** The created function is equivalent to `_.conformsTo` with
			* `source` partially applied.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Util
			* @param {Object} source The object of property predicates to conform to.
			* @returns {Function} Returns the new spec function.
			* @example
			*
			* var objects = [
			*   { 'a': 2, 'b': 1 },
			*   { 'a': 1, 'b': 2 }
			* ];
			*
			* _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
			* // => [{ 'a': 1, 'b': 2 }]
			*/
			function conforms(source) {
				return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
			}
			/**
			* Creates a function that returns `value`.
			*
			* @static
			* @memberOf _
			* @since 2.4.0
			* @category Util
			* @param {*} value The value to return from the new function.
			* @returns {Function} Returns the new constant function.
			* @example
			*
			* var objects = _.times(2, _.constant({ 'a': 1 }));
			*
			* console.log(objects);
			* // => [{ 'a': 1 }, { 'a': 1 }]
			*
			* console.log(objects[0] === objects[1]);
			* // => true
			*/
			function constant(value) {
				return function() {
					return value;
				};
			}
			/**
			* Checks `value` to determine whether a default value should be returned in
			* its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
			* or `undefined`.
			*
			* @static
			* @memberOf _
			* @since 4.14.0
			* @category Util
			* @param {*} value The value to check.
			* @param {*} defaultValue The default value.
			* @returns {*} Returns the resolved value.
			* @example
			*
			* _.defaultTo(1, 10);
			* // => 1
			*
			* _.defaultTo(undefined, 10);
			* // => 10
			*/
			function defaultTo(value, defaultValue) {
				return value == null || value !== value ? defaultValue : value;
			}
			/**
			* Creates a function that returns the result of invoking the given functions
			* with the `this` binding of the created function, where each successive
			* invocation is supplied the return value of the previous.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Util
			* @param {...(Function|Function[])} [funcs] The functions to invoke.
			* @returns {Function} Returns the new composite function.
			* @see _.flowRight
			* @example
			*
			* function square(n) {
			*   return n * n;
			* }
			*
			* var addSquare = _.flow([_.add, square]);
			* addSquare(1, 2);
			* // => 9
			*/
			var flow = createFlow();
			/**
			* This method is like `_.flow` except that it creates a function that
			* invokes the given functions from right to left.
			*
			* @static
			* @since 3.0.0
			* @memberOf _
			* @category Util
			* @param {...(Function|Function[])} [funcs] The functions to invoke.
			* @returns {Function} Returns the new composite function.
			* @see _.flow
			* @example
			*
			* function square(n) {
			*   return n * n;
			* }
			*
			* var addSquare = _.flowRight([square, _.add]);
			* addSquare(1, 2);
			* // => 9
			*/
			var flowRight = createFlow(true);
			/**
			* This method returns the first argument it receives.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Util
			* @param {*} value Any value.
			* @returns {*} Returns `value`.
			* @example
			*
			* var object = { 'a': 1 };
			*
			* console.log(_.identity(object) === object);
			* // => true
			*/
			function identity(value) {
				return value;
			}
			/**
			* Creates a function that invokes `func` with the arguments of the created
			* function. If `func` is a property name, the created function returns the
			* property value for a given element. If `func` is an array or object, the
			* created function returns `true` for elements that contain the equivalent
			* source properties, otherwise it returns `false`.
			*
			* @static
			* @since 4.0.0
			* @memberOf _
			* @category Util
			* @param {*} [func=_.identity] The value to convert to a callback.
			* @returns {Function} Returns the callback.
			* @example
			*
			* var users = [
			*   { 'user': 'barney', 'age': 36, 'active': true },
			*   { 'user': 'fred',   'age': 40, 'active': false }
			* ];
			*
			* // The `_.matches` iteratee shorthand.
			* _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
			* // => [{ 'user': 'barney', 'age': 36, 'active': true }]
			*
			* // The `_.matchesProperty` iteratee shorthand.
			* _.filter(users, _.iteratee(['user', 'fred']));
			* // => [{ 'user': 'fred', 'age': 40 }]
			*
			* // The `_.property` iteratee shorthand.
			* _.map(users, _.iteratee('user'));
			* // => ['barney', 'fred']
			*
			* // Create custom iteratee shorthands.
			* _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
			*   return !_.isRegExp(func) ? iteratee(func) : function(string) {
			*     return func.test(string);
			*   };
			* });
			*
			* _.filter(['abc', 'def'], /ef/);
			* // => ['def']
			*/
			function iteratee(func) {
				return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
			}
			/**
			* Creates a function that performs a partial deep comparison between a given
			* object and `source`, returning `true` if the given object has equivalent
			* property values, else `false`.
			*
			* **Note:** The created function is equivalent to `_.isMatch` with `source`
			* partially applied.
			*
			* Partial comparisons will match empty array and empty object `source`
			* values against any array or object value, respectively. See `_.isEqual`
			* for a list of supported value comparisons.
			*
			* **Note:** Multiple values can be checked by combining several matchers
			* using `_.overSome`
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Util
			* @param {Object} source The object of property values to match.
			* @returns {Function} Returns the new spec function.
			* @example
			*
			* var objects = [
			*   { 'a': 1, 'b': 2, 'c': 3 },
			*   { 'a': 4, 'b': 5, 'c': 6 }
			* ];
			*
			* _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
			* // => [{ 'a': 4, 'b': 5, 'c': 6 }]
			*
			* // Checking for several possible values
			* _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
			* // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
			*/
			function matches(source) {
				return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
			}
			/**
			* Creates a function that performs a partial deep comparison between the
			* value at `path` of a given object to `srcValue`, returning `true` if the
			* object value is equivalent, else `false`.
			*
			* **Note:** Partial comparisons will match empty array and empty object
			* `srcValue` values against any array or object value, respectively. See
			* `_.isEqual` for a list of supported value comparisons.
			*
			* **Note:** Multiple values can be checked by combining several matchers
			* using `_.overSome`
			*
			* @static
			* @memberOf _
			* @since 3.2.0
			* @category Util
			* @param {Array|string} path The path of the property to get.
			* @param {*} srcValue The value to match.
			* @returns {Function} Returns the new spec function.
			* @example
			*
			* var objects = [
			*   { 'a': 1, 'b': 2, 'c': 3 },
			*   { 'a': 4, 'b': 5, 'c': 6 }
			* ];
			*
			* _.find(objects, _.matchesProperty('a', 4));
			* // => { 'a': 4, 'b': 5, 'c': 6 }
			*
			* // Checking for several possible values
			* _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
			* // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
			*/
			function matchesProperty(path, srcValue) {
				return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
			}
			/**
			* Creates a function that invokes the method at `path` of a given object.
			* Any additional arguments are provided to the invoked method.
			*
			* @static
			* @memberOf _
			* @since 3.7.0
			* @category Util
			* @param {Array|string} path The path of the method to invoke.
			* @param {...*} [args] The arguments to invoke the method with.
			* @returns {Function} Returns the new invoker function.
			* @example
			*
			* var objects = [
			*   { 'a': { 'b': _.constant(2) } },
			*   { 'a': { 'b': _.constant(1) } }
			* ];
			*
			* _.map(objects, _.method('a.b'));
			* // => [2, 1]
			*
			* _.map(objects, _.method(['a', 'b']));
			* // => [2, 1]
			*/
			var method = baseRest(function(path, args) {
				return function(object) {
					return baseInvoke(object, path, args);
				};
			});
			/**
			* The opposite of `_.method`; this method creates a function that invokes
			* the method at a given path of `object`. Any additional arguments are
			* provided to the invoked method.
			*
			* @static
			* @memberOf _
			* @since 3.7.0
			* @category Util
			* @param {Object} object The object to query.
			* @param {...*} [args] The arguments to invoke the method with.
			* @returns {Function} Returns the new invoker function.
			* @example
			*
			* var array = _.times(3, _.constant),
			*     object = { 'a': array, 'b': array, 'c': array };
			*
			* _.map(['a[2]', 'c[0]'], _.methodOf(object));
			* // => [2, 0]
			*
			* _.map([['a', '2'], ['c', '0']], _.methodOf(object));
			* // => [2, 0]
			*/
			var methodOf = baseRest(function(object, args) {
				return function(path) {
					return baseInvoke(object, path, args);
				};
			});
			/**
			* Adds all own enumerable string keyed function properties of a source
			* object to the destination object. If `object` is a function, then methods
			* are added to its prototype as well.
			*
			* **Note:** Use `_.runInContext` to create a pristine `lodash` function to
			* avoid conflicts caused by modifying the original.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Util
			* @param {Function|Object} [object=lodash] The destination object.
			* @param {Object} source The object of functions to add.
			* @param {Object} [options={}] The options object.
			* @param {boolean} [options.chain=true] Specify whether mixins are chainable.
			* @returns {Function|Object} Returns `object`.
			* @example
			*
			* function vowels(string) {
			*   return _.filter(string, function(v) {
			*     return /[aeiou]/i.test(v);
			*   });
			* }
			*
			* _.mixin({ 'vowels': vowels });
			* _.vowels('fred');
			* // => ['e']
			*
			* _('fred').vowels().value();
			* // => ['e']
			*
			* _.mixin({ 'vowels': vowels }, { 'chain': false });
			* _('fred').vowels();
			* // => ['e']
			*/
			function mixin(object, source, options) {
				var props = keys(source), methodNames = baseFunctions(source, props);
				if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
					options = source;
					source = object;
					object = this;
					methodNames = baseFunctions(source, keys(source));
				}
				var chain = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
				arrayEach(methodNames, function(methodName) {
					var func = source[methodName];
					object[methodName] = func;
					if (isFunc) object.prototype[methodName] = function() {
						var chainAll = this.__chain__;
						if (chain || chainAll) {
							var result = object(this.__wrapped__);
							(result.__actions__ = copyArray(this.__actions__)).push({
								"func": func,
								"args": arguments,
								"thisArg": object
							});
							result.__chain__ = chainAll;
							return result;
						}
						return func.apply(object, arrayPush([this.value()], arguments));
					};
				});
				return object;
			}
			/**
			* Reverts the `_` variable to its previous value and returns a reference to
			* the `lodash` function.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Util
			* @returns {Function} Returns the `lodash` function.
			* @example
			*
			* var lodash = _.noConflict();
			*/
			function noConflict() {
				if (root._ === this) root._ = oldDash;
				return this;
			}
			/**
			* This method returns `undefined`.
			*
			* @static
			* @memberOf _
			* @since 2.3.0
			* @category Util
			* @example
			*
			* _.times(2, _.noop);
			* // => [undefined, undefined]
			*/
			function noop() {}
			/**
			* Creates a function that gets the argument at index `n`. If `n` is negative,
			* the nth argument from the end is returned.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Util
			* @param {number} [n=0] The index of the argument to return.
			* @returns {Function} Returns the new pass-thru function.
			* @example
			*
			* var func = _.nthArg(1);
			* func('a', 'b', 'c', 'd');
			* // => 'b'
			*
			* var func = _.nthArg(-2);
			* func('a', 'b', 'c', 'd');
			* // => 'c'
			*/
			function nthArg(n) {
				n = toInteger(n);
				return baseRest(function(args) {
					return baseNth(args, n);
				});
			}
			/**
			* Creates a function that invokes `iteratees` with the arguments it receives
			* and returns their results.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Util
			* @param {...(Function|Function[])} [iteratees=[_.identity]]
			*  The iteratees to invoke.
			* @returns {Function} Returns the new function.
			* @example
			*
			* var func = _.over([Math.max, Math.min]);
			*
			* func(1, 2, 3, 4);
			* // => [4, 1]
			*/
			var over = createOver(arrayMap);
			/**
			* Creates a function that checks if **all** of the `predicates` return
			* truthy when invoked with the arguments it receives.
			*
			* Following shorthands are possible for providing predicates.
			* Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
			* Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Util
			* @param {...(Function|Function[])} [predicates=[_.identity]]
			*  The predicates to check.
			* @returns {Function} Returns the new function.
			* @example
			*
			* var func = _.overEvery([Boolean, isFinite]);
			*
			* func('1');
			* // => true
			*
			* func(null);
			* // => false
			*
			* func(NaN);
			* // => false
			*/
			var overEvery = createOver(arrayEvery);
			/**
			* Creates a function that checks if **any** of the `predicates` return
			* truthy when invoked with the arguments it receives.
			*
			* Following shorthands are possible for providing predicates.
			* Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
			* Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Util
			* @param {...(Function|Function[])} [predicates=[_.identity]]
			*  The predicates to check.
			* @returns {Function} Returns the new function.
			* @example
			*
			* var func = _.overSome([Boolean, isFinite]);
			*
			* func('1');
			* // => true
			*
			* func(null);
			* // => true
			*
			* func(NaN);
			* // => false
			*
			* var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
			* var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
			*/
			var overSome = createOver(arraySome);
			/**
			* Creates a function that returns the value at `path` of a given object.
			*
			* @static
			* @memberOf _
			* @since 2.4.0
			* @category Util
			* @param {Array|string} path The path of the property to get.
			* @returns {Function} Returns the new accessor function.
			* @example
			*
			* var objects = [
			*   { 'a': { 'b': 2 } },
			*   { 'a': { 'b': 1 } }
			* ];
			*
			* _.map(objects, _.property('a.b'));
			* // => [2, 1]
			*
			* _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
			* // => [1, 2]
			*/
			function property(path) {
				return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
			}
			/**
			* The opposite of `_.property`; this method creates a function that returns
			* the value at a given path of `object`.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Util
			* @param {Object} object The object to query.
			* @returns {Function} Returns the new accessor function.
			* @example
			*
			* var array = [0, 1, 2],
			*     object = { 'a': array, 'b': array, 'c': array };
			*
			* _.map(['a[2]', 'c[0]'], _.propertyOf(object));
			* // => [2, 0]
			*
			* _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
			* // => [2, 0]
			*/
			function propertyOf(object) {
				return function(path) {
					return object == null ? undefined : baseGet(object, path);
				};
			}
			/**
			* Creates an array of numbers (positive and/or negative) progressing from
			* `start` up to, but not including, `end`. A step of `-1` is used if a negative
			* `start` is specified without an `end` or `step`. If `end` is not specified,
			* it's set to `start` with `start` then set to `0`.
			*
			* **Note:** JavaScript follows the IEEE-754 standard for resolving
			* floating-point values which can produce unexpected results.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Util
			* @param {number} [start=0] The start of the range.
			* @param {number} end The end of the range.
			* @param {number} [step=1] The value to increment or decrement by.
			* @returns {Array} Returns the range of numbers.
			* @see _.inRange, _.rangeRight
			* @example
			*
			* _.range(4);
			* // => [0, 1, 2, 3]
			*
			* _.range(-4);
			* // => [0, -1, -2, -3]
			*
			* _.range(1, 5);
			* // => [1, 2, 3, 4]
			*
			* _.range(0, 20, 5);
			* // => [0, 5, 10, 15]
			*
			* _.range(0, -4, -1);
			* // => [0, -1, -2, -3]
			*
			* _.range(1, 4, 0);
			* // => [1, 1, 1]
			*
			* _.range(0);
			* // => []
			*/
			var range = createRange();
			/**
			* This method is like `_.range` except that it populates values in
			* descending order.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Util
			* @param {number} [start=0] The start of the range.
			* @param {number} end The end of the range.
			* @param {number} [step=1] The value to increment or decrement by.
			* @returns {Array} Returns the range of numbers.
			* @see _.inRange, _.range
			* @example
			*
			* _.rangeRight(4);
			* // => [3, 2, 1, 0]
			*
			* _.rangeRight(-4);
			* // => [-3, -2, -1, 0]
			*
			* _.rangeRight(1, 5);
			* // => [4, 3, 2, 1]
			*
			* _.rangeRight(0, 20, 5);
			* // => [15, 10, 5, 0]
			*
			* _.rangeRight(0, -4, -1);
			* // => [-3, -2, -1, 0]
			*
			* _.rangeRight(1, 4, 0);
			* // => [1, 1, 1]
			*
			* _.rangeRight(0);
			* // => []
			*/
			var rangeRight = createRange(true);
			/**
			* This method returns a new empty array.
			*
			* @static
			* @memberOf _
			* @since 4.13.0
			* @category Util
			* @returns {Array} Returns the new empty array.
			* @example
			*
			* var arrays = _.times(2, _.stubArray);
			*
			* console.log(arrays);
			* // => [[], []]
			*
			* console.log(arrays[0] === arrays[1]);
			* // => false
			*/
			function stubArray() {
				return [];
			}
			/**
			* This method returns `false`.
			*
			* @static
			* @memberOf _
			* @since 4.13.0
			* @category Util
			* @returns {boolean} Returns `false`.
			* @example
			*
			* _.times(2, _.stubFalse);
			* // => [false, false]
			*/
			function stubFalse() {
				return false;
			}
			/**
			* This method returns a new empty object.
			*
			* @static
			* @memberOf _
			* @since 4.13.0
			* @category Util
			* @returns {Object} Returns the new empty object.
			* @example
			*
			* var objects = _.times(2, _.stubObject);
			*
			* console.log(objects);
			* // => [{}, {}]
			*
			* console.log(objects[0] === objects[1]);
			* // => false
			*/
			function stubObject() {
				return {};
			}
			/**
			* This method returns an empty string.
			*
			* @static
			* @memberOf _
			* @since 4.13.0
			* @category Util
			* @returns {string} Returns the empty string.
			* @example
			*
			* _.times(2, _.stubString);
			* // => ['', '']
			*/
			function stubString() {
				return "";
			}
			/**
			* This method returns `true`.
			*
			* @static
			* @memberOf _
			* @since 4.13.0
			* @category Util
			* @returns {boolean} Returns `true`.
			* @example
			*
			* _.times(2, _.stubTrue);
			* // => [true, true]
			*/
			function stubTrue() {
				return true;
			}
			/**
			* Invokes the iteratee `n` times, returning an array of the results of
			* each invocation. The iteratee is invoked with one argument; (index).
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Util
			* @param {number} n The number of times to invoke `iteratee`.
			* @param {Function} [iteratee=_.identity] The function invoked per iteration.
			* @returns {Array} Returns the array of results.
			* @example
			*
			* _.times(3, String);
			* // => ['0', '1', '2']
			*
			*  _.times(4, _.constant(0));
			* // => [0, 0, 0, 0]
			*/
			function times(n, iteratee) {
				n = toInteger(n);
				if (n < 1 || n > MAX_SAFE_INTEGER) return [];
				var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
				iteratee = getIteratee(iteratee);
				n -= MAX_ARRAY_LENGTH;
				var result = baseTimes(length, iteratee);
				while (++index < n) iteratee(index);
				return result;
			}
			/**
			* Converts `value` to a property path array.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Util
			* @param {*} value The value to convert.
			* @returns {Array} Returns the new property path array.
			* @example
			*
			* _.toPath('a.b.c');
			* // => ['a', 'b', 'c']
			*
			* _.toPath('a[0].b.c');
			* // => ['a', '0', 'b', 'c']
			*/
			function toPath(value) {
				if (isArray(value)) return arrayMap(value, toKey);
				return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
			}
			/**
			* Generates a unique ID. If `prefix` is given, the ID is appended to it.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Util
			* @param {string} [prefix=''] The value to prefix the ID with.
			* @returns {string} Returns the unique ID.
			* @example
			*
			* _.uniqueId('contact_');
			* // => 'contact_104'
			*
			* _.uniqueId();
			* // => '105'
			*/
			function uniqueId(prefix) {
				var id = ++idCounter;
				return toString(prefix) + id;
			}
			/**
			* Adds two numbers.
			*
			* @static
			* @memberOf _
			* @since 3.4.0
			* @category Math
			* @param {number} augend The first number in an addition.
			* @param {number} addend The second number in an addition.
			* @returns {number} Returns the total.
			* @example
			*
			* _.add(6, 4);
			* // => 10
			*/
			var add = createMathOperation(function(augend, addend) {
				return augend + addend;
			}, 0);
			/**
			* Computes `number` rounded up to `precision`.
			*
			* @static
			* @memberOf _
			* @since 3.10.0
			* @category Math
			* @param {number} number The number to round up.
			* @param {number} [precision=0] The precision to round up to.
			* @returns {number} Returns the rounded up number.
			* @example
			*
			* _.ceil(4.006);
			* // => 5
			*
			* _.ceil(6.004, 2);
			* // => 6.01
			*
			* _.ceil(6040, -2);
			* // => 6100
			*/
			var ceil = createRound("ceil");
			/**
			* Divide two numbers.
			*
			* @static
			* @memberOf _
			* @since 4.7.0
			* @category Math
			* @param {number} dividend The first number in a division.
			* @param {number} divisor The second number in a division.
			* @returns {number} Returns the quotient.
			* @example
			*
			* _.divide(6, 4);
			* // => 1.5
			*/
			var divide = createMathOperation(function(dividend, divisor) {
				return dividend / divisor;
			}, 1);
			/**
			* Computes `number` rounded down to `precision`.
			*
			* @static
			* @memberOf _
			* @since 3.10.0
			* @category Math
			* @param {number} number The number to round down.
			* @param {number} [precision=0] The precision to round down to.
			* @returns {number} Returns the rounded down number.
			* @example
			*
			* _.floor(4.006);
			* // => 4
			*
			* _.floor(0.046, 2);
			* // => 0.04
			*
			* _.floor(4060, -2);
			* // => 4000
			*/
			var floor = createRound("floor");
			/**
			* Computes the maximum value of `array`. If `array` is empty or falsey,
			* `undefined` is returned.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Math
			* @param {Array} array The array to iterate over.
			* @returns {*} Returns the maximum value.
			* @example
			*
			* _.max([4, 2, 8, 6]);
			* // => 8
			*
			* _.max([]);
			* // => undefined
			*/
			function max(array) {
				return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
			}
			/**
			* This method is like `_.max` except that it accepts `iteratee` which is
			* invoked for each element in `array` to generate the criterion by which
			* the value is ranked. The iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Math
			* @param {Array} array The array to iterate over.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {*} Returns the maximum value.
			* @example
			*
			* var objects = [{ 'n': 1 }, { 'n': 2 }];
			*
			* _.maxBy(objects, function(o) { return o.n; });
			* // => { 'n': 2 }
			*
			* // The `_.property` iteratee shorthand.
			* _.maxBy(objects, 'n');
			* // => { 'n': 2 }
			*/
			function maxBy(array, iteratee) {
				return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseGt) : undefined;
			}
			/**
			* Computes the mean of the values in `array`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Math
			* @param {Array} array The array to iterate over.
			* @returns {number} Returns the mean.
			* @example
			*
			* _.mean([4, 2, 8, 6]);
			* // => 5
			*/
			function mean(array) {
				return baseMean(array, identity);
			}
			/**
			* This method is like `_.mean` except that it accepts `iteratee` which is
			* invoked for each element in `array` to generate the value to be averaged.
			* The iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.7.0
			* @category Math
			* @param {Array} array The array to iterate over.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {number} Returns the mean.
			* @example
			*
			* var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
			*
			* _.meanBy(objects, function(o) { return o.n; });
			* // => 5
			*
			* // The `_.property` iteratee shorthand.
			* _.meanBy(objects, 'n');
			* // => 5
			*/
			function meanBy(array, iteratee) {
				return baseMean(array, getIteratee(iteratee, 2));
			}
			/**
			* Computes the minimum value of `array`. If `array` is empty or falsey,
			* `undefined` is returned.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Math
			* @param {Array} array The array to iterate over.
			* @returns {*} Returns the minimum value.
			* @example
			*
			* _.min([4, 2, 8, 6]);
			* // => 2
			*
			* _.min([]);
			* // => undefined
			*/
			function min(array) {
				return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
			}
			/**
			* This method is like `_.min` except that it accepts `iteratee` which is
			* invoked for each element in `array` to generate the criterion by which
			* the value is ranked. The iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Math
			* @param {Array} array The array to iterate over.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {*} Returns the minimum value.
			* @example
			*
			* var objects = [{ 'n': 1 }, { 'n': 2 }];
			*
			* _.minBy(objects, function(o) { return o.n; });
			* // => { 'n': 1 }
			*
			* // The `_.property` iteratee shorthand.
			* _.minBy(objects, 'n');
			* // => { 'n': 1 }
			*/
			function minBy(array, iteratee) {
				return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseLt) : undefined;
			}
			/**
			* Multiply two numbers.
			*
			* @static
			* @memberOf _
			* @since 4.7.0
			* @category Math
			* @param {number} multiplier The first number in a multiplication.
			* @param {number} multiplicand The second number in a multiplication.
			* @returns {number} Returns the product.
			* @example
			*
			* _.multiply(6, 4);
			* // => 24
			*/
			var multiply = createMathOperation(function(multiplier, multiplicand) {
				return multiplier * multiplicand;
			}, 1);
			/**
			* Computes `number` rounded to `precision`.
			*
			* @static
			* @memberOf _
			* @since 3.10.0
			* @category Math
			* @param {number} number The number to round.
			* @param {number} [precision=0] The precision to round to.
			* @returns {number} Returns the rounded number.
			* @example
			*
			* _.round(4.006);
			* // => 4
			*
			* _.round(4.006, 2);
			* // => 4.01
			*
			* _.round(4060, -2);
			* // => 4100
			*/
			var round = createRound("round");
			/**
			* Subtract two numbers.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Math
			* @param {number} minuend The first number in a subtraction.
			* @param {number} subtrahend The second number in a subtraction.
			* @returns {number} Returns the difference.
			* @example
			*
			* _.subtract(6, 4);
			* // => 2
			*/
			var subtract = createMathOperation(function(minuend, subtrahend) {
				return minuend - subtrahend;
			}, 0);
			/**
			* Computes the sum of the values in `array`.
			*
			* @static
			* @memberOf _
			* @since 3.4.0
			* @category Math
			* @param {Array} array The array to iterate over.
			* @returns {number} Returns the sum.
			* @example
			*
			* _.sum([4, 2, 8, 6]);
			* // => 20
			*/
			function sum(array) {
				return array && array.length ? baseSum(array, identity) : 0;
			}
			/**
			* This method is like `_.sum` except that it accepts `iteratee` which is
			* invoked for each element in `array` to generate the value to be summed.
			* The iteratee is invoked with one argument: (value).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Math
			* @param {Array} array The array to iterate over.
			* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
			* @returns {number} Returns the sum.
			* @example
			*
			* var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
			*
			* _.sumBy(objects, function(o) { return o.n; });
			* // => 20
			*
			* // The `_.property` iteratee shorthand.
			* _.sumBy(objects, 'n');
			* // => 20
			*/
			function sumBy(array, iteratee) {
				return array && array.length ? baseSum(array, getIteratee(iteratee, 2)) : 0;
			}
			lodash.after = after;
			lodash.ary = ary;
			lodash.assign = assign;
			lodash.assignIn = assignIn;
			lodash.assignInWith = assignInWith;
			lodash.assignWith = assignWith;
			lodash.at = at;
			lodash.before = before;
			lodash.bind = bind;
			lodash.bindAll = bindAll;
			lodash.bindKey = bindKey;
			lodash.castArray = castArray;
			lodash.chain = chain;
			lodash.chunk = chunk;
			lodash.compact = compact;
			lodash.concat = concat;
			lodash.cond = cond;
			lodash.conforms = conforms;
			lodash.constant = constant;
			lodash.countBy = countBy;
			lodash.create = create;
			lodash.curry = curry;
			lodash.curryRight = curryRight;
			lodash.debounce = debounce;
			lodash.defaults = defaults;
			lodash.defaultsDeep = defaultsDeep;
			lodash.defer = defer;
			lodash.delay = delay;
			lodash.difference = difference;
			lodash.differenceBy = differenceBy;
			lodash.differenceWith = differenceWith;
			lodash.drop = drop;
			lodash.dropRight = dropRight;
			lodash.dropRightWhile = dropRightWhile;
			lodash.dropWhile = dropWhile;
			lodash.fill = fill;
			lodash.filter = filter;
			lodash.flatMap = flatMap;
			lodash.flatMapDeep = flatMapDeep;
			lodash.flatMapDepth = flatMapDepth;
			lodash.flatten = flatten;
			lodash.flattenDeep = flattenDeep;
			lodash.flattenDepth = flattenDepth;
			lodash.flip = flip;
			lodash.flow = flow;
			lodash.flowRight = flowRight;
			lodash.fromPairs = fromPairs;
			lodash.functions = functions;
			lodash.functionsIn = functionsIn;
			lodash.groupBy = groupBy;
			lodash.initial = initial;
			lodash.intersection = intersection;
			lodash.intersectionBy = intersectionBy;
			lodash.intersectionWith = intersectionWith;
			lodash.invert = invert;
			lodash.invertBy = invertBy;
			lodash.invokeMap = invokeMap;
			lodash.iteratee = iteratee;
			lodash.keyBy = keyBy;
			lodash.keys = keys;
			lodash.keysIn = keysIn;
			lodash.map = map;
			lodash.mapKeys = mapKeys;
			lodash.mapValues = mapValues;
			lodash.matches = matches;
			lodash.matchesProperty = matchesProperty;
			lodash.memoize = memoize;
			lodash.merge = merge;
			lodash.mergeWith = mergeWith;
			lodash.method = method;
			lodash.methodOf = methodOf;
			lodash.mixin = mixin;
			lodash.negate = negate;
			lodash.nthArg = nthArg;
			lodash.omit = omit;
			lodash.omitBy = omitBy;
			lodash.once = once;
			lodash.orderBy = orderBy;
			lodash.over = over;
			lodash.overArgs = overArgs;
			lodash.overEvery = overEvery;
			lodash.overSome = overSome;
			lodash.partial = partial;
			lodash.partialRight = partialRight;
			lodash.partition = partition;
			lodash.pick = pick;
			lodash.pickBy = pickBy;
			lodash.property = property;
			lodash.propertyOf = propertyOf;
			lodash.pull = pull;
			lodash.pullAll = pullAll;
			lodash.pullAllBy = pullAllBy;
			lodash.pullAllWith = pullAllWith;
			lodash.pullAt = pullAt;
			lodash.range = range;
			lodash.rangeRight = rangeRight;
			lodash.rearg = rearg;
			lodash.reject = reject;
			lodash.remove = remove;
			lodash.rest = rest;
			lodash.reverse = reverse;
			lodash.sampleSize = sampleSize;
			lodash.set = set;
			lodash.setWith = setWith;
			lodash.shuffle = shuffle;
			lodash.slice = slice;
			lodash.sortBy = sortBy;
			lodash.sortedUniq = sortedUniq;
			lodash.sortedUniqBy = sortedUniqBy;
			lodash.split = split;
			lodash.spread = spread;
			lodash.tail = tail;
			lodash.take = take;
			lodash.takeRight = takeRight;
			lodash.takeRightWhile = takeRightWhile;
			lodash.takeWhile = takeWhile;
			lodash.tap = tap;
			lodash.throttle = throttle;
			lodash.thru = thru;
			lodash.toArray = toArray;
			lodash.toPairs = toPairs;
			lodash.toPairsIn = toPairsIn;
			lodash.toPath = toPath;
			lodash.toPlainObject = toPlainObject;
			lodash.transform = transform;
			lodash.unary = unary;
			lodash.union = union;
			lodash.unionBy = unionBy;
			lodash.unionWith = unionWith;
			lodash.uniq = uniq;
			lodash.uniqBy = uniqBy;
			lodash.uniqWith = uniqWith;
			lodash.unset = unset;
			lodash.unzip = unzip;
			lodash.unzipWith = unzipWith;
			lodash.update = update;
			lodash.updateWith = updateWith;
			lodash.values = values;
			lodash.valuesIn = valuesIn;
			lodash.without = without;
			lodash.words = words;
			lodash.wrap = wrap;
			lodash.xor = xor;
			lodash.xorBy = xorBy;
			lodash.xorWith = xorWith;
			lodash.zip = zip;
			lodash.zipObject = zipObject;
			lodash.zipObjectDeep = zipObjectDeep;
			lodash.zipWith = zipWith;
			lodash.entries = toPairs;
			lodash.entriesIn = toPairsIn;
			lodash.extend = assignIn;
			lodash.extendWith = assignInWith;
			mixin(lodash, lodash);
			lodash.add = add;
			lodash.attempt = attempt;
			lodash.camelCase = camelCase;
			lodash.capitalize = capitalize;
			lodash.ceil = ceil;
			lodash.clamp = clamp;
			lodash.clone = clone;
			lodash.cloneDeep = cloneDeep;
			lodash.cloneDeepWith = cloneDeepWith;
			lodash.cloneWith = cloneWith;
			lodash.conformsTo = conformsTo;
			lodash.deburr = deburr;
			lodash.defaultTo = defaultTo;
			lodash.divide = divide;
			lodash.endsWith = endsWith;
			lodash.eq = eq;
			lodash.escape = escape;
			lodash.escapeRegExp = escapeRegExp;
			lodash.every = every;
			lodash.find = find;
			lodash.findIndex = findIndex;
			lodash.findKey = findKey;
			lodash.findLast = findLast;
			lodash.findLastIndex = findLastIndex;
			lodash.findLastKey = findLastKey;
			lodash.floor = floor;
			lodash.forEach = forEach;
			lodash.forEachRight = forEachRight;
			lodash.forIn = forIn;
			lodash.forInRight = forInRight;
			lodash.forOwn = forOwn;
			lodash.forOwnRight = forOwnRight;
			lodash.get = get;
			lodash.gt = gt;
			lodash.gte = gte;
			lodash.has = has;
			lodash.hasIn = hasIn;
			lodash.head = head;
			lodash.identity = identity;
			lodash.includes = includes;
			lodash.indexOf = indexOf;
			lodash.inRange = inRange;
			lodash.invoke = invoke;
			lodash.isArguments = isArguments;
			lodash.isArray = isArray;
			lodash.isArrayBuffer = isArrayBuffer;
			lodash.isArrayLike = isArrayLike;
			lodash.isArrayLikeObject = isArrayLikeObject;
			lodash.isBoolean = isBoolean;
			lodash.isBuffer = isBuffer;
			lodash.isDate = isDate;
			lodash.isElement = isElement;
			lodash.isEmpty = isEmpty;
			lodash.isEqual = isEqual;
			lodash.isEqualWith = isEqualWith;
			lodash.isError = isError;
			lodash.isFinite = isFinite;
			lodash.isFunction = isFunction;
			lodash.isInteger = isInteger;
			lodash.isLength = isLength;
			lodash.isMap = isMap;
			lodash.isMatch = isMatch;
			lodash.isMatchWith = isMatchWith;
			lodash.isNaN = isNaN;
			lodash.isNative = isNative;
			lodash.isNil = isNil;
			lodash.isNull = isNull;
			lodash.isNumber = isNumber;
			lodash.isObject = isObject;
			lodash.isObjectLike = isObjectLike;
			lodash.isPlainObject = isPlainObject;
			lodash.isRegExp = isRegExp;
			lodash.isSafeInteger = isSafeInteger;
			lodash.isSet = isSet;
			lodash.isString = isString;
			lodash.isSymbol = isSymbol;
			lodash.isTypedArray = isTypedArray;
			lodash.isUndefined = isUndefined;
			lodash.isWeakMap = isWeakMap;
			lodash.isWeakSet = isWeakSet;
			lodash.join = join;
			lodash.kebabCase = kebabCase;
			lodash.last = last;
			lodash.lastIndexOf = lastIndexOf;
			lodash.lowerCase = lowerCase;
			lodash.lowerFirst = lowerFirst;
			lodash.lt = lt;
			lodash.lte = lte;
			lodash.max = max;
			lodash.maxBy = maxBy;
			lodash.mean = mean;
			lodash.meanBy = meanBy;
			lodash.min = min;
			lodash.minBy = minBy;
			lodash.stubArray = stubArray;
			lodash.stubFalse = stubFalse;
			lodash.stubObject = stubObject;
			lodash.stubString = stubString;
			lodash.stubTrue = stubTrue;
			lodash.multiply = multiply;
			lodash.nth = nth;
			lodash.noConflict = noConflict;
			lodash.noop = noop;
			lodash.now = now;
			lodash.pad = pad;
			lodash.padEnd = padEnd;
			lodash.padStart = padStart;
			lodash.parseInt = parseInt;
			lodash.random = random;
			lodash.reduce = reduce;
			lodash.reduceRight = reduceRight;
			lodash.repeat = repeat;
			lodash.replace = replace;
			lodash.result = result;
			lodash.round = round;
			lodash.runInContext = runInContext;
			lodash.sample = sample;
			lodash.size = size;
			lodash.snakeCase = snakeCase;
			lodash.some = some;
			lodash.sortedIndex = sortedIndex;
			lodash.sortedIndexBy = sortedIndexBy;
			lodash.sortedIndexOf = sortedIndexOf;
			lodash.sortedLastIndex = sortedLastIndex;
			lodash.sortedLastIndexBy = sortedLastIndexBy;
			lodash.sortedLastIndexOf = sortedLastIndexOf;
			lodash.startCase = startCase;
			lodash.startsWith = startsWith;
			lodash.subtract = subtract;
			lodash.sum = sum;
			lodash.sumBy = sumBy;
			lodash.template = template;
			lodash.times = times;
			lodash.toFinite = toFinite;
			lodash.toInteger = toInteger;
			lodash.toLength = toLength;
			lodash.toLower = toLower;
			lodash.toNumber = toNumber;
			lodash.toSafeInteger = toSafeInteger;
			lodash.toString = toString;
			lodash.toUpper = toUpper;
			lodash.trim = trim;
			lodash.trimEnd = trimEnd;
			lodash.trimStart = trimStart;
			lodash.truncate = truncate;
			lodash.unescape = unescape;
			lodash.uniqueId = uniqueId;
			lodash.upperCase = upperCase;
			lodash.upperFirst = upperFirst;
			lodash.each = forEach;
			lodash.eachRight = forEachRight;
			lodash.first = head;
			mixin(lodash, function() {
				var source = {};
				baseForOwn(lodash, function(func, methodName) {
					if (!hasOwnProperty.call(lodash.prototype, methodName)) source[methodName] = func;
				});
				return source;
			}(), { "chain": false });
			/**
			* The semantic version number.
			*
			* @static
			* @memberOf _
			* @type {string}
			*/
			lodash.VERSION = VERSION;
			arrayEach([
				"bind",
				"bindKey",
				"curry",
				"curryRight",
				"partial",
				"partialRight"
			], function(methodName) {
				lodash[methodName].placeholder = lodash;
			});
			arrayEach(["drop", "take"], function(methodName, index) {
				LazyWrapper.prototype[methodName] = function(n) {
					n = n === undefined ? 1 : nativeMax(toInteger(n), 0);
					var result = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
					if (result.__filtered__) result.__takeCount__ = nativeMin(n, result.__takeCount__);
					else result.__views__.push({
						"size": nativeMin(n, MAX_ARRAY_LENGTH),
						"type": methodName + (result.__dir__ < 0 ? "Right" : "")
					});
					return result;
				};
				LazyWrapper.prototype[methodName + "Right"] = function(n) {
					return this.reverse()[methodName](n).reverse();
				};
			});
			arrayEach([
				"filter",
				"map",
				"takeWhile"
			], function(methodName, index) {
				var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
				LazyWrapper.prototype[methodName] = function(iteratee) {
					var result = this.clone();
					result.__iteratees__.push({
						"iteratee": getIteratee(iteratee, 3),
						"type": type
					});
					result.__filtered__ = result.__filtered__ || isFilter;
					return result;
				};
			});
			arrayEach(["head", "last"], function(methodName, index) {
				var takeName = "take" + (index ? "Right" : "");
				LazyWrapper.prototype[methodName] = function() {
					return this[takeName](1).value()[0];
				};
			});
			arrayEach(["initial", "tail"], function(methodName, index) {
				var dropName = "drop" + (index ? "" : "Right");
				LazyWrapper.prototype[methodName] = function() {
					return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
				};
			});
			LazyWrapper.prototype.compact = function() {
				return this.filter(identity);
			};
			LazyWrapper.prototype.find = function(predicate) {
				return this.filter(predicate).head();
			};
			LazyWrapper.prototype.findLast = function(predicate) {
				return this.reverse().find(predicate);
			};
			LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
				if (typeof path == "function") return new LazyWrapper(this);
				return this.map(function(value) {
					return baseInvoke(value, path, args);
				});
			});
			LazyWrapper.prototype.reject = function(predicate) {
				return this.filter(negate(getIteratee(predicate)));
			};
			LazyWrapper.prototype.slice = function(start, end) {
				start = toInteger(start);
				var result = this;
				if (result.__filtered__ && (start > 0 || end < 0)) return new LazyWrapper(result);
				if (start < 0) result = result.takeRight(-start);
				else if (start) result = result.drop(start);
				if (end !== undefined) {
					end = toInteger(end);
					result = end < 0 ? result.dropRight(-end) : result.take(end - start);
				}
				return result;
			};
			LazyWrapper.prototype.takeRightWhile = function(predicate) {
				return this.reverse().takeWhile(predicate).reverse();
			};
			LazyWrapper.prototype.toArray = function() {
				return this.take(MAX_ARRAY_LENGTH);
			};
			baseForOwn(LazyWrapper.prototype, function(func, methodName) {
				var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
				if (!lodashFunc) return;
				lodash.prototype[methodName] = function() {
					var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee = args[0], useLazy = isLazy || isArray(value);
					var interceptor = function(value) {
						var result = lodashFunc.apply(lodash, arrayPush([value], args));
						return isTaker && chainAll ? result[0] : result;
					};
					if (useLazy && checkIteratee && typeof iteratee == "function" && iteratee.length != 1) isLazy = useLazy = false;
					var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
					if (!retUnwrapped && useLazy) {
						value = onlyLazy ? value : new LazyWrapper(this);
						var result = func.apply(value, args);
						result.__actions__.push({
							"func": thru,
							"args": [interceptor],
							"thisArg": undefined
						});
						return new LodashWrapper(result, chainAll);
					}
					if (isUnwrapped && onlyLazy) return func.apply(this, args);
					result = this.thru(interceptor);
					return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
				};
			});
			arrayEach([
				"pop",
				"push",
				"shift",
				"sort",
				"splice",
				"unshift"
			], function(methodName) {
				var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
				lodash.prototype[methodName] = function() {
					var args = arguments;
					if (retUnwrapped && !this.__chain__) {
						var value = this.value();
						return func.apply(isArray(value) ? value : [], args);
					}
					return this[chainName](function(value) {
						return func.apply(isArray(value) ? value : [], args);
					});
				};
			});
			baseForOwn(LazyWrapper.prototype, function(func, methodName) {
				var lodashFunc = lodash[methodName];
				if (lodashFunc) {
					var key = lodashFunc.name + "";
					if (!hasOwnProperty.call(realNames, key)) realNames[key] = [];
					realNames[key].push({
						"name": methodName,
						"func": lodashFunc
					});
				}
			});
			realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
				"name": "wrapper",
				"func": undefined
			}];
			LazyWrapper.prototype.clone = lazyClone;
			LazyWrapper.prototype.reverse = lazyReverse;
			LazyWrapper.prototype.value = lazyValue;
			lodash.prototype.at = wrapperAt;
			lodash.prototype.chain = wrapperChain;
			lodash.prototype.commit = wrapperCommit;
			lodash.prototype.next = wrapperNext;
			lodash.prototype.plant = wrapperPlant;
			lodash.prototype.reverse = wrapperReverse;
			lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
			lodash.prototype.first = lodash.prototype.head;
			if (symIterator) lodash.prototype[symIterator] = wrapperToIterator;
			return lodash;
		})();
		if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
			root._ = _;
			define(function() {
				return _;
			});
		} else if (freeModule) {
			(freeModule.exports = _)._ = _;
			freeExports._ = _;
		} else root._ = _;
	}).call(exports);
}));
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/context.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const LucideContext = createContext({});
const useLucideContext = () => useContext(LucideContext);
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/Icon.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const Icon$1 = forwardRef(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
	const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
	const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
	return createElement("svg", {
		ref,
		...defaultAttributes,
		width: size ?? contextSize ?? defaultAttributes.width,
		height: size ?? contextSize ?? defaultAttributes.height,
		stroke: color ?? contextColor,
		strokeWidth: calculatedStrokeWidth,
		className: mergeClasses("lucide", contextClass, className),
		...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
		...rest
	}, [...iconNode.map(([tag, attrs]) => createElement(tag, attrs)), ...Array.isArray(children) ? children : [children]]);
});
//#endregion
//#region node_modules/.pnpm/lucide-react@1.8.0_react@19.2.5/node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
* @license lucide-react v1.8.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const createLucideIcon = (iconName, iconNode) => {
	const Component = forwardRef(({ className, ...props }, ref) => createElement(Icon$1, {
		ref,
		iconNode,
		className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
		...props
	}));
	Component.displayName = toPascalCase(iconName);
	return Component;
};
const ArrowDown = createLucideIcon("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]);
const ArrowUp = createLucideIcon("arrow-up", [["path", {
	d: "m5 12 7-7 7 7",
	key: "hav0vg"
}], ["path", {
	d: "M12 19V5",
	key: "x0mq9r"
}]]);
const Check = createLucideIcon("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]);
const ChevronDown = createLucideIcon("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]);
const ChevronLeft = createLucideIcon("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]);
const ChevronRight = createLucideIcon("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]);
const ChevronUp = createLucideIcon("chevron-up", [["path", {
	d: "m18 15-6-6-6 6",
	key: "153udz"
}]]);
const ChevronsLeft = createLucideIcon("chevrons-left", [["path", {
	d: "m11 17-5-5 5-5",
	key: "13zhaf"
}], ["path", {
	d: "m18 17-5-5 5-5",
	key: "h8a8et"
}]]);
const ChevronsRight = createLucideIcon("chevrons-right", [["path", {
	d: "m6 17 5-5-5-5",
	key: "xnjwq"
}], ["path", {
	d: "m13 17 5-5-5-5",
	key: "17xmmf"
}]]);
const ChevronsUpDown = createLucideIcon("chevrons-up-down", [["path", {
	d: "m7 15 5 5 5-5",
	key: "1hf1tw"
}], ["path", {
	d: "m7 9 5-5 5 5",
	key: "sgt6xg"
}]]);
const CirclePlus = createLucideIcon("circle-plus", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M8 12h8",
		key: "1wcyev"
	}],
	["path", {
		d: "M12 8v8",
		key: "napkw2"
	}]
]);
const Search = createLucideIcon("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]);
const Settings2 = createLucideIcon("settings-2", [
	["path", {
		d: "M14 17H5",
		key: "gfn3mx"
	}],
	["path", {
		d: "M19 7h-9",
		key: "6i9tg"
	}],
	["circle", {
		cx: "17",
		cy: "17",
		r: "3",
		key: "18b49y"
	}],
	["circle", {
		cx: "7",
		cy: "7",
		r: "3",
		key: "dfmy0x"
	}]
]);
const X$1 = createLucideIcon("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
//#endregion
//#region node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs
var import_lodash = /* @__PURE__ */ __toESM(require_lodash());
/**
* Copyright 2022 Joe Bell. All rights reserved.
*
* This file is licensed to you under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with the
* License. You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/ const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
	var _config_compoundVariants;
	if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
	const { variants, defaultVariants } = config;
	const getVariantClassNames = Object.keys(variants).map((variant) => {
		const variantProp = props === null || props === void 0 ? void 0 : props[variant];
		const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
		if (variantProp === null) return null;
		const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
		return variants[variant][variantKey];
	});
	const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
		let [key, value] = param;
		if (value === void 0) return acc;
		acc[key] = value;
		return acc;
	}, {});
	return cx(base, getVariantClassNames, config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
		let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
		return Object.entries(compoundVariantOptions).every((param) => {
			let [key, value] = param;
			return Array.isArray(value) ? value.includes({
				...defaultVariants,
				...propsWithoutUndefined
			}[key]) : {
				...defaultVariants,
				...propsWithoutUndefined
			}[key] === value;
		}) ? [
			...acc,
			cvClass,
			cvClassName
		] : acc;
	}, []), props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
function setRef(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
function composeRefs(...refs) {
	return (node) => {
		let hasCleanup = false;
		const cleanups = refs.map((ref) => {
			const cleanup = setRef(ref, node);
			if (!hasCleanup && typeof cleanup == "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup == "function") cleanup();
				else setRef(refs[i], null);
			}
		};
	};
}
function useComposedRefs(...refs) {
	return React$1.useCallback(composeRefs(...refs), refs);
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-slot@1.2.3_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-slot/dist/index.mjs
/* @__NO_SIDE_EFFECTS__ */
function createSlot(ownerName) {
	const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
	const Slot2 = React$1.forwardRef((props, forwardedRef) => {
		const { children, ...slotProps } = props;
		const childrenArray = React$1.Children.toArray(children);
		const slottable = childrenArray.find(isSlottable);
		if (slottable) {
			const newElement = slottable.props.children;
			const newChildren = childrenArray.map((child) => {
				if (child === slottable) {
					if (React$1.Children.count(newElement) > 1) return React$1.Children.only(null);
					return React$1.isValidElement(newElement) ? newElement.props.children : null;
				} else return child;
			});
			return /* @__PURE__ */ jsx(SlotClone, {
				...slotProps,
				ref: forwardedRef,
				children: React$1.isValidElement(newElement) ? React$1.cloneElement(newElement, void 0, newChildren) : null
			});
		}
		return /* @__PURE__ */ jsx(SlotClone, {
			...slotProps,
			ref: forwardedRef,
			children
		});
	});
	Slot2.displayName = `${ownerName}.Slot`;
	return Slot2;
}
var Slot$4 = /* @__PURE__ */ createSlot("Slot");
/* @__NO_SIDE_EFFECTS__ */
function createSlotClone(ownerName) {
	const SlotClone = React$1.forwardRef((props, forwardedRef) => {
		const { children, ...slotProps } = props;
		if (React$1.isValidElement(children)) {
			const childrenRef = getElementRef$1(children);
			const props2 = mergeProps(slotProps, children.props);
			if (children.type !== React$1.Fragment) props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
			return React$1.cloneElement(children, props2);
		}
		return React$1.Children.count(children) > 1 ? React$1.Children.only(null) : null;
	});
	SlotClone.displayName = `${ownerName}.SlotClone`;
	return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
	return React$1.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
	const overrideProps = { ...childProps };
	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];
		if (/^on[A-Z]/.test(propName)) {
			if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
				const result = childPropValue(...args);
				slotPropValue(...args);
				return result;
			};
			else if (slotPropValue) overrideProps[propName] = slotPropValue;
		} else if (propName === "style") overrideProps[propName] = {
			...slotPropValue,
			...childPropValue
		};
		else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
	}
	return {
		...slotProps,
		...overrideProps
	};
}
function getElementRef$1(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-primitive@2.1.3_@types+react-dom@19.2.3_@types+react@19.2.14__@types+re_004379973539b6d86227cd4562b544dc/node_modules/@radix-ui/react-primitive/dist/index.mjs
var Primitive = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((primitive, node) => {
	const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
	const Node = React$1.forwardRef((props, forwardedRef) => {
		const { asChild, ...primitiveProps } = props;
		const Comp = asChild ? Slot : node;
		if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
		return /* @__PURE__ */ jsx(Comp, {
			...primitiveProps,
			ref: forwardedRef
		});
	});
	Node.displayName = `Primitive.${node}`;
	return {
		...primitive,
		[node]: Node
	};
}, {});
function dispatchDiscreteCustomEvent(target, event) {
	if (target) ReactDOM$1.flushSync(() => target.dispatchEvent(event));
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-visually-hidden@1.2.3_@types+react-dom@19.2.3_@types+react@19.2.14__@ty_e810030844e1cfedd403eda403a3d8c6/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
var VISUALLY_HIDDEN_STYLES = Object.freeze({
	position: "absolute",
	border: 0,
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	wordWrap: "normal"
});
var NAME$2 = "VisuallyHidden";
var VisuallyHidden = React$1.forwardRef((props, forwardedRef) => {
	return /* @__PURE__ */ jsx(Primitive.span, {
		...props,
		ref: forwardedRef,
		style: {
			...VISUALLY_HIDDEN_STYLES,
			...props.style
		}
	});
});
VisuallyHidden.displayName = NAME$2;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-context@1.1.2_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-context/dist/index.mjs
function createContext2(rootComponentName, defaultContext) {
	const Context = React$1.createContext(defaultContext);
	const Provider = (props) => {
		const { children, ...context } = props;
		const value = React$1.useMemo(() => context, Object.values(context));
		return /* @__PURE__ */ jsx(Context.Provider, {
			value,
			children
		});
	};
	Provider.displayName = rootComponentName + "Provider";
	function useContext2(consumerName) {
		const context = React$1.useContext(Context);
		if (context) return context;
		if (defaultContext !== void 0) return defaultContext;
		throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
	}
	return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
	let defaultContexts = [];
	function createContext3(rootComponentName, defaultContext) {
		const BaseContext = React$1.createContext(defaultContext);
		const index = defaultContexts.length;
		defaultContexts = [...defaultContexts, defaultContext];
		const Provider = (props) => {
			const { scope, children, ...context } = props;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const value = React$1.useMemo(() => context, Object.values(context));
			return /* @__PURE__ */ jsx(Context.Provider, {
				value,
				children
			});
		};
		Provider.displayName = rootComponentName + "Provider";
		function useContext2(consumerName, scope) {
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const context = React$1.useContext(Context);
			if (context) return context;
			if (defaultContext !== void 0) return defaultContext;
			throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
		}
		return [Provider, useContext2];
	}
	const createScope = () => {
		const scopeContexts = defaultContexts.map((defaultContext) => {
			return React$1.createContext(defaultContext);
		});
		return function useScope(scope) {
			const contexts = scope?.[scopeName] || scopeContexts;
			return React$1.useMemo(() => ({ [`__scope${scopeName}`]: {
				...scope,
				[scopeName]: contexts
			} }), [scope, contexts]);
		};
	};
	createScope.scopeName = scopeName;
	return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
	const baseScope = scopes[0];
	if (scopes.length === 1) return baseScope;
	const createScope = () => {
		const scopeHooks = scopes.map((createScope2) => ({
			useScope: createScope2(),
			scopeName: createScope2.scopeName
		}));
		return function useComposedScopes(overrideScopes) {
			const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
				const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
				return {
					...nextScopes2,
					...currentScope
				};
			}, {});
			return React$1.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
		};
	};
	createScope.scopeName = baseScope.scopeName;
	return createScope;
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-collection@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+r_77c072394032ab0bbbc95bc0564e2b30/node_modules/@radix-ui/react-collection/dist/index.mjs
function createCollection(name) {
	const PROVIDER_NAME = name + "CollectionProvider";
	const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
	const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
		collectionRef: { current: null },
		itemMap: /* @__PURE__ */ new Map()
	});
	const CollectionProvider = (props) => {
		const { scope, children } = props;
		const ref = React.useRef(null);
		const itemMap = React.useRef(/* @__PURE__ */ new Map()).current;
		return /* @__PURE__ */ jsx(CollectionProviderImpl, {
			scope,
			itemMap,
			collectionRef: ref,
			children
		});
	};
	CollectionProvider.displayName = PROVIDER_NAME;
	const COLLECTION_SLOT_NAME = name + "CollectionSlot";
	const CollectionSlotImpl = /* @__PURE__ */ createSlot(COLLECTION_SLOT_NAME);
	const CollectionSlot = React.forwardRef((props, forwardedRef) => {
		const { scope, children } = props;
		return /* @__PURE__ */ jsx(CollectionSlotImpl, {
			ref: useComposedRefs(forwardedRef, useCollectionContext(COLLECTION_SLOT_NAME, scope).collectionRef),
			children
		});
	});
	CollectionSlot.displayName = COLLECTION_SLOT_NAME;
	const ITEM_SLOT_NAME = name + "CollectionItemSlot";
	const ITEM_DATA_ATTR = "data-radix-collection-item";
	const CollectionItemSlotImpl = /* @__PURE__ */ createSlot(ITEM_SLOT_NAME);
	const CollectionItemSlot = React.forwardRef((props, forwardedRef) => {
		const { scope, children, ...itemData } = props;
		const ref = React.useRef(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);
		const context = useCollectionContext(ITEM_SLOT_NAME, scope);
		React.useEffect(() => {
			context.itemMap.set(ref, {
				ref,
				...itemData
			});
			return () => void context.itemMap.delete(ref);
		});
		return /* @__PURE__ */ jsx(CollectionItemSlotImpl, {
			[ITEM_DATA_ATTR]: "",
			ref: composedRefs,
			children
		});
	});
	CollectionItemSlot.displayName = ITEM_SLOT_NAME;
	function useCollection(scope) {
		const context = useCollectionContext(name + "CollectionConsumer", scope);
		return React.useCallback(() => {
			const collectionNode = context.collectionRef.current;
			if (!collectionNode) return [];
			const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
			return Array.from(context.itemMap.values()).sort((a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current));
		}, [context.collectionRef, context.itemMap]);
	}
	return [
		{
			Provider: CollectionProvider,
			Slot: CollectionSlot,
			ItemSlot: CollectionItemSlot
		},
		useCollection,
		createCollectionScope
	];
}
typeof window !== "undefined" && window.document && window.document.createElement;
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler?.(event);
	};
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.1_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var useLayoutEffect2 = globalThis?.document ? React$1.useLayoutEffect : () => {};
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-controllable-state@1.2.2_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var useInsertionEffect = React$1[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({ prop, defaultProp, onChange = () => {}, caller }) {
	const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
		defaultProp,
		onChange
	});
	const isControlled = prop !== void 0;
	const value = isControlled ? prop : uncontrolledProp;
	{
		const isControlledRef = React$1.useRef(prop !== void 0);
		React$1.useEffect(() => {
			const wasControlled = isControlledRef.current;
			if (wasControlled !== isControlled) console.warn(`${caller} is changing from ${wasControlled ? "controlled" : "uncontrolled"} to ${isControlled ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`);
			isControlledRef.current = isControlled;
		}, [isControlled, caller]);
	}
	return [value, React$1.useCallback((nextValue) => {
		if (isControlled) {
			const value2 = isFunction$1(nextValue) ? nextValue(prop) : nextValue;
			if (value2 !== prop) onChangeRef.current?.(value2);
		} else setUncontrolledProp(nextValue);
	}, [
		isControlled,
		prop,
		setUncontrolledProp,
		onChangeRef
	])];
}
function useUncontrolledState({ defaultProp, onChange }) {
	const [value, setValue] = React$1.useState(defaultProp);
	const prevValueRef = React$1.useRef(value);
	const onChangeRef = React$1.useRef(onChange);
	useInsertionEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);
	React$1.useEffect(() => {
		if (prevValueRef.current !== value) {
			onChangeRef.current?.(value);
			prevValueRef.current = value;
		}
	}, [value, prevValueRef]);
	return [
		value,
		setValue,
		onChangeRef
	];
}
function isFunction$1(value) {
	return typeof value === "function";
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-presence@1.1.5_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_bb0422da16a13d2aa5012c2e1c1c5a99/node_modules/@radix-ui/react-presence/dist/index.mjs
function useStateMachine(initialState, machine) {
	return React$1.useReducer((state, event) => {
		return machine[state][event] ?? state;
	}, initialState);
}
var Presence = (props) => {
	const { present, children } = props;
	const presence = usePresence(present);
	const child = typeof children === "function" ? children({ present: presence.isPresent }) : React$1.Children.only(children);
	const ref = useComposedRefs(presence.ref, getElementRef(child));
	return typeof children === "function" || presence.isPresent ? React$1.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
	const [node, setNode] = React$1.useState();
	const stylesRef = React$1.useRef(null);
	const prevPresentRef = React$1.useRef(present);
	const prevAnimationNameRef = React$1.useRef("none");
	const [state, send] = useStateMachine(present ? "mounted" : "unmounted", {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	React$1.useEffect(() => {
		const currentAnimationName = getAnimationName(stylesRef.current);
		prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
	}, [state]);
	useLayoutEffect2(() => {
		const styles = stylesRef.current;
		const wasPresent = prevPresentRef.current;
		if (wasPresent !== present) {
			const prevAnimationName = prevAnimationNameRef.current;
			const currentAnimationName = getAnimationName(styles);
			if (present) send("MOUNT");
			else if (currentAnimationName === "none" || styles?.display === "none") send("UNMOUNT");
			else if (wasPresent && prevAnimationName !== currentAnimationName) send("ANIMATION_OUT");
			else send("UNMOUNT");
			prevPresentRef.current = present;
		}
	}, [present, send]);
	useLayoutEffect2(() => {
		if (node) {
			let timeoutId;
			const ownerWindow = node.ownerDocument.defaultView ?? window;
			const handleAnimationEnd = (event) => {
				const isCurrentAnimation = getAnimationName(stylesRef.current).includes(CSS.escape(event.animationName));
				if (event.target === node && isCurrentAnimation) {
					send("ANIMATION_END");
					if (!prevPresentRef.current) {
						const currentFillMode = node.style.animationFillMode;
						node.style.animationFillMode = "forwards";
						timeoutId = ownerWindow.setTimeout(() => {
							if (node.style.animationFillMode === "forwards") node.style.animationFillMode = currentFillMode;
						});
					}
				}
			};
			const handleAnimationStart = (event) => {
				if (event.target === node) prevAnimationNameRef.current = getAnimationName(stylesRef.current);
			};
			node.addEventListener("animationstart", handleAnimationStart);
			node.addEventListener("animationcancel", handleAnimationEnd);
			node.addEventListener("animationend", handleAnimationEnd);
			return () => {
				ownerWindow.clearTimeout(timeoutId);
				node.removeEventListener("animationstart", handleAnimationStart);
				node.removeEventListener("animationcancel", handleAnimationEnd);
				node.removeEventListener("animationend", handleAnimationEnd);
			};
		} else send("ANIMATION_END");
	}, [node, send]);
	return {
		isPresent: ["mounted", "unmountSuspended"].includes(state),
		ref: React$1.useCallback((node2) => {
			stylesRef.current = node2 ? getComputedStyle(node2) : null;
			setNode(node2);
		}, [])
	};
}
function getAnimationName(styles) {
	return styles?.animationName || "none";
}
function getElementRef(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-id@1.1.1_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-id/dist/index.mjs
var useReactId = React$1[" useId ".trim().toString()] || (() => void 0);
var count$1 = 0;
function useId$1(deterministicId) {
	const [id, setId] = React$1.useState(useReactId());
	useLayoutEffect2(() => {
		if (!deterministicId) setId((reactId) => reactId ?? String(count$1++));
	}, [deterministicId]);
	return deterministicId || (id ? `radix-${id}` : "");
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-direction@1.1.1_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-direction/dist/index.mjs
var DirectionContext = React$1.createContext(void 0);
function useDirection(localDir) {
	const globalDir = React$1.useContext(DirectionContext);
	return localDir || globalDir || "ltr";
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
function useCallbackRef$1(callback) {
	const callbackRef = React$1.useRef(callback);
	React$1.useEffect(() => {
		callbackRef.current = callback;
	});
	return React$1.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
	const onEscapeKeyDown = useCallbackRef$1(onEscapeKeyDownProp);
	React$1.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") onEscapeKeyDown(event);
		};
		ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
	}, [onEscapeKeyDown, ownerDocument]);
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-dismissable-layer@1.1.11_@types+react-dom@19.2.3_@types+react@19.2.14___1028c2c016475a479b27a6c04520b6b2/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = React$1.createContext({
	layers: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = React$1.forwardRef((props, forwardedRef) => {
	const { disableOutsidePointerEvents = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
	const context = React$1.useContext(DismissableLayerContext);
	const [node, setNode] = React$1.useState(null);
	const ownerDocument = node?.ownerDocument ?? globalThis?.document;
	const [, force] = React$1.useState({});
	const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
	const layers = Array.from(context.layers);
	const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
	const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
	const index = node ? layers.indexOf(node) : -1;
	const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
	const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
	const pointerDownOutside = usePointerDownOutside((event) => {
		const target = event.target;
		const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
		if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
		onPointerDownOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, ownerDocument);
	const focusOutside = useFocusOutside((event) => {
		const target = event.target;
		if ([...context.branches].some((branch) => branch.contains(target))) return;
		onFocusOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, ownerDocument);
	useEscapeKeydown((event) => {
		if (!(index === context.layers.size - 1)) return;
		onEscapeKeyDown?.(event);
		if (!event.defaultPrevented && onDismiss) {
			event.preventDefault();
			onDismiss();
		}
	}, ownerDocument);
	React$1.useEffect(() => {
		if (!node) return;
		if (disableOutsidePointerEvents) {
			if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
				originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
				ownerDocument.body.style.pointerEvents = "none";
			}
			context.layersWithOutsidePointerEventsDisabled.add(node);
		}
		context.layers.add(node);
		dispatchUpdate();
		return () => {
			if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
		};
	}, [
		node,
		ownerDocument,
		disableOutsidePointerEvents,
		context
	]);
	React$1.useEffect(() => {
		return () => {
			if (!node) return;
			context.layers.delete(node);
			context.layersWithOutsidePointerEventsDisabled.delete(node);
			dispatchUpdate();
		};
	}, [node, context]);
	React$1.useEffect(() => {
		const handleUpdate = () => force({});
		document.addEventListener(CONTEXT_UPDATE, handleUpdate);
		return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
	}, []);
	return /* @__PURE__ */ jsx(Primitive.div, {
		...layerProps,
		ref: composedRefs,
		style: {
			pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
			...props.style
		},
		onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
		onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
		onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)
	});
});
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = React$1.forwardRef((props, forwardedRef) => {
	const context = React$1.useContext(DismissableLayerContext);
	const ref = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	React$1.useEffect(() => {
		const node = ref.current;
		if (node) {
			context.branches.add(node);
			return () => {
				context.branches.delete(node);
			};
		}
	}, [context.branches]);
	return /* @__PURE__ */ jsx(Primitive.div, {
		...props,
		ref: composedRefs
	});
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
	const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
	const isPointerInsideReactTreeRef = React$1.useRef(false);
	const handleClickRef = React$1.useRef(() => {});
	React$1.useEffect(() => {
		const handlePointerDown = (event) => {
			if (event.target && !isPointerInsideReactTreeRef.current) {
				let handleAndDispatchPointerDownOutsideEvent2 = function() {
					handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, { discrete: true });
				};
				const eventDetail = { originalEvent: event };
				if (event.pointerType === "touch") {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
					ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
				} else handleAndDispatchPointerDownOutsideEvent2();
			} else ownerDocument.removeEventListener("click", handleClickRef.current);
			isPointerInsideReactTreeRef.current = false;
		};
		const timerId = window.setTimeout(() => {
			ownerDocument.addEventListener("pointerdown", handlePointerDown);
		}, 0);
		return () => {
			window.clearTimeout(timerId);
			ownerDocument.removeEventListener("pointerdown", handlePointerDown);
			ownerDocument.removeEventListener("click", handleClickRef.current);
		};
	}, [ownerDocument, handlePointerDownOutside]);
	return { onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
	const handleFocusOutside = useCallbackRef$1(onFocusOutside);
	const isFocusInsideReactTreeRef = React$1.useRef(false);
	React$1.useEffect(() => {
		const handleFocus = (event) => {
			if (event.target && !isFocusInsideReactTreeRef.current) handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, { originalEvent: event }, { discrete: false });
		};
		ownerDocument.addEventListener("focusin", handleFocus);
		return () => ownerDocument.removeEventListener("focusin", handleFocus);
	}, [ownerDocument, handleFocusOutside]);
	return {
		onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
		onBlurCapture: () => isFocusInsideReactTreeRef.current = false
	};
}
function dispatchUpdate() {
	const event = new CustomEvent(CONTEXT_UPDATE);
	document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) target.addEventListener(name, handler, { once: true });
	if (discrete) dispatchDiscreteCustomEvent(target, event);
	else target.dispatchEvent(event);
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-focus-scope@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+_ba36e4abb1b5b8160094c10bc652129f/node_modules/@radix-ui/react-focus-scope/dist/index.mjs
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS$1 = {
	bubbles: false,
	cancelable: true
};
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = React$1.forwardRef((props, forwardedRef) => {
	const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
	const [container, setContainer] = React$1.useState(null);
	const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
	const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
	const lastFocusedElementRef = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
	const focusScope = React$1.useRef({
		paused: false,
		pause() {
			this.paused = true;
		},
		resume() {
			this.paused = false;
		}
	}).current;
	React$1.useEffect(() => {
		if (trapped) {
			let handleFocusIn2 = function(event) {
				if (focusScope.paused || !container) return;
				const target = event.target;
				if (container.contains(target)) lastFocusedElementRef.current = target;
				else focus(lastFocusedElementRef.current, { select: true });
			}, handleFocusOut2 = function(event) {
				if (focusScope.paused || !container) return;
				const relatedTarget = event.relatedTarget;
				if (relatedTarget === null) return;
				if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.current, { select: true });
			}, handleMutations2 = function(mutations) {
				if (document.activeElement !== document.body) return;
				for (const mutation of mutations) if (mutation.removedNodes.length > 0) focus(container);
			};
			document.addEventListener("focusin", handleFocusIn2);
			document.addEventListener("focusout", handleFocusOut2);
			const mutationObserver = new MutationObserver(handleMutations2);
			if (container) mutationObserver.observe(container, {
				childList: true,
				subtree: true
			});
			return () => {
				document.removeEventListener("focusin", handleFocusIn2);
				document.removeEventListener("focusout", handleFocusOut2);
				mutationObserver.disconnect();
			};
		}
	}, [
		trapped,
		container,
		focusScope.paused
	]);
	React$1.useEffect(() => {
		if (container) {
			focusScopesStack.add(focusScope);
			const previouslyFocusedElement = document.activeElement;
			if (!container.contains(previouslyFocusedElement)) {
				const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS$1);
				container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				container.dispatchEvent(mountEvent);
				if (!mountEvent.defaultPrevented) {
					focusFirst$2(removeLinks(getTabbableCandidates(container)), { select: true });
					if (document.activeElement === previouslyFocusedElement) focus(container);
				}
			}
			return () => {
				container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				setTimeout(() => {
					const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS$1);
					container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					container.dispatchEvent(unmountEvent);
					if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? document.body, { select: true });
					container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					focusScopesStack.remove(focusScope);
				}, 0);
			};
		}
	}, [
		container,
		onMountAutoFocus,
		onUnmountAutoFocus,
		focusScope
	]);
	const handleKeyDown = React$1.useCallback((event) => {
		if (!loop && !trapped) return;
		if (focusScope.paused) return;
		const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
		const focusedElement = document.activeElement;
		if (isTabKey && focusedElement) {
			const container2 = event.currentTarget;
			const [first, last] = getTabbableEdges(container2);
			if (!(first && last)) {
				if (focusedElement === container2) event.preventDefault();
			} else if (!event.shiftKey && focusedElement === last) {
				event.preventDefault();
				if (loop) focus(first, { select: true });
			} else if (event.shiftKey && focusedElement === first) {
				event.preventDefault();
				if (loop) focus(last, { select: true });
			}
		}
	}, [
		loop,
		trapped,
		focusScope.paused
	]);
	return /* @__PURE__ */ jsx(Primitive.div, {
		tabIndex: -1,
		...scopeProps,
		ref: composedRefs,
		onKeyDown: handleKeyDown
	});
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst$2(candidates, { select = false } = {}) {
	const previouslyFocusedElement = document.activeElement;
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (document.activeElement !== previouslyFocusedElement) return;
	}
}
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
}
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
function findVisible(elements, container) {
	for (const element of elements) if (!isHidden(element, { upTo: container })) return element;
}
function isHidden(node, { upTo }) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		if (upTo !== void 0 && node === upTo) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement;
	}
	return false;
}
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
	if (element && element.focus) {
		const previouslyFocusedElement = document.activeElement;
		element.focus({ preventScroll: true });
		if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
	}
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
	let stack = [];
	return {
		add(focusScope) {
			const activeFocusScope = stack[0];
			if (focusScope !== activeFocusScope) activeFocusScope?.pause();
			stack = arrayRemove(stack, focusScope);
			stack.unshift(focusScope);
		},
		remove(focusScope) {
			stack = arrayRemove(stack, focusScope);
			stack[0]?.resume();
		}
	};
}
function arrayRemove(array, item) {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);
	if (index !== -1) updatedArray.splice(index, 1);
	return updatedArray;
}
function removeLinks(items) {
	return items.filter((item) => item.tagName !== "A");
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-portal@1.1.9_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_1cce15ec7b8f692335f3eff7d631e14a/node_modules/@radix-ui/react-portal/dist/index.mjs
var PORTAL_NAME$5 = "Portal";
var Portal$4 = React$1.forwardRef((props, forwardedRef) => {
	const { container: containerProp, ...portalProps } = props;
	const [mounted, setMounted] = React$1.useState(false);
	useLayoutEffect2(() => setMounted(true), []);
	const container = containerProp || mounted && globalThis?.document?.body;
	return container ? ReactDOM.createPortal(/* @__PURE__ */ jsx(Primitive.div, {
		...portalProps,
		ref: forwardedRef
	}), container) : null;
});
Portal$4.displayName = PORTAL_NAME$5;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-focus-guards@1.1.3_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-focus-guards/dist/index.mjs
var count = 0;
function useFocusGuards() {
	React$1.useEffect(() => {
		const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
		document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
		document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
		count++;
		return () => {
			if (count === 1) document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
			count--;
		};
	}, []);
}
function createFocusGuard() {
	const element = document.createElement("span");
	element.setAttribute("data-radix-focus-guard", "");
	element.tabIndex = 0;
	element.style.outline = "none";
	element.style.opacity = "0";
	element.style.position = "fixed";
	element.style.pointerEvents = "none";
	return element;
}
//#endregion
//#region node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __spreadArray(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
}
//#endregion
//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zeroRightClassName = "right-scroll-bar-position";
var fullWidthClassName = "width-before-scroll-bar";
var noScrollbarsClassName = "with-scroll-bars-hidden";
/**
* Name of a CSS variable containing the amount of "hidden" scrollbar
* ! might be undefined ! use will fallback!
*/
var removedBarSizeVariable = "--removed-body-scroll-bar-size";
//#endregion
//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.5/node_modules/use-callback-ref/dist/es2015/assignRef.js
/**
* Assigns a value for a given ref, no matter of the ref format
* @param {RefObject} ref - a callback function or ref object
* @param value - a new value
*
* @see https://github.com/theKashey/use-callback-ref#assignref
* @example
* const refObject = useRef();
* const refFn = (ref) => {....}
*
* assignRef(refObject, "refValue");
* assignRef(refFn, "refValue");
*/
function assignRef(ref, value) {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
	return ref;
}
//#endregion
//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.5/node_modules/use-callback-ref/dist/es2015/useRef.js
/**
* creates a MutableRef with ref change callback
* @param initialValue - initial ref value
* @param {Function} callback - a callback to run when value changes
*
* @example
* const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
* ref.current = 1;
* // prints 0 -> 1
*
* @see https://reactjs.org/docs/hooks-reference.html#useref
* @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
* @returns {MutableRefObject}
*/
function useCallbackRef(initialValue, callback) {
	var ref = useState(function() {
		return {
			value: initialValue,
			callback,
			facade: {
				get current() {
					return ref.value;
				},
				set current(value) {
					var last = ref.value;
					if (last !== value) {
						ref.value = value;
						ref.callback(value, last);
					}
				}
			}
		};
	})[0];
	ref.callback = callback;
	return ref.facade;
}
//#endregion
//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.5/node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React$1.useLayoutEffect : React$1.useEffect;
var currentValues = /* @__PURE__ */ new WeakMap();
/**
* Merges two or more refs together providing a single interface to set their value
* @param {RefObject|Ref} refs
* @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
*
* @see {@link mergeRefs} a version without buit-in memoization
* @see https://github.com/theKashey/use-callback-ref#usemergerefs
* @example
* const Component = React.forwardRef((props, ref) => {
*   const ownRef = useRef();
*   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
*   return <div ref={domRef}>...</div>
* }
*/
function useMergeRefs(refs, defaultValue) {
	var callbackRef = useCallbackRef(defaultValue || null, function(newValue) {
		return refs.forEach(function(ref) {
			return assignRef(ref, newValue);
		});
	});
	useIsomorphicLayoutEffect(function() {
		var oldValue = currentValues.get(callbackRef);
		if (oldValue) {
			var prevRefs_1 = new Set(oldValue);
			var nextRefs_1 = new Set(refs);
			var current_1 = callbackRef.current;
			prevRefs_1.forEach(function(ref) {
				if (!nextRefs_1.has(ref)) assignRef(ref, null);
			});
			nextRefs_1.forEach(function(ref) {
				if (!prevRefs_1.has(ref)) assignRef(ref, current_1);
			});
		}
		currentValues.set(callbackRef, refs);
	}, [refs]);
	return callbackRef;
}
//#endregion
//#region node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.5/node_modules/use-sidecar/dist/es2015/medium.js
function ItoI(a) {
	return a;
}
function innerCreateMedium(defaults, middleware) {
	if (middleware === void 0) middleware = ItoI;
	var buffer = [];
	var assigned = false;
	return {
		read: function() {
			if (assigned) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
			if (buffer.length) return buffer[buffer.length - 1];
			return defaults;
		},
		useMedium: function(data) {
			var item = middleware(data, assigned);
			buffer.push(item);
			return function() {
				buffer = buffer.filter(function(x) {
					return x !== item;
				});
			};
		},
		assignSyncMedium: function(cb) {
			assigned = true;
			while (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
			}
			buffer = {
				push: function(x) {
					return cb(x);
				},
				filter: function() {
					return buffer;
				}
			};
		},
		assignMedium: function(cb) {
			assigned = true;
			var pendingQueue = [];
			if (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
				pendingQueue = buffer;
			}
			var executeQueue = function() {
				var cbs = pendingQueue;
				pendingQueue = [];
				cbs.forEach(cb);
			};
			var cycle = function() {
				return Promise.resolve().then(executeQueue);
			};
			cycle();
			buffer = {
				push: function(x) {
					pendingQueue.push(x);
					cycle();
				},
				filter: function(filter) {
					pendingQueue = pendingQueue.filter(filter);
					return buffer;
				}
			};
		}
	};
}
function createSidecarMedium(options) {
	if (options === void 0) options = {};
	var medium = innerCreateMedium(null);
	medium.options = __assign({
		async: true,
		ssr: false
	}, options);
	return medium;
}
//#endregion
//#region node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.5/node_modules/use-sidecar/dist/es2015/exports.js
var SideCar = function(_a) {
	var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
	if (!sideCar) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
	var Target = sideCar.read();
	if (!Target) throw new Error("Sidecar medium not found");
	return React$1.createElement(Target, __assign({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
	medium.useMedium(exported);
	return SideCar;
}
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll/dist/es2015/medium.js
var effectCar = createSidecarMedium();
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll/dist/es2015/UI.js
var nothing = function() {};
/**
* Removes scrollbar from the page and contain the scroll within the Lock
*/
var RemoveScroll = React$1.forwardRef(function(props, parentRef) {
	var ref = React$1.useRef(null);
	var _a = React$1.useState({
		onScrollCapture: nothing,
		onWheelCapture: nothing,
		onTouchMoveCapture: nothing
	}), callbacks = _a[0], setCallbacks = _a[1];
	var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, [
		"forwardProps",
		"children",
		"className",
		"removeScrollBar",
		"enabled",
		"shards",
		"sideCar",
		"noRelative",
		"noIsolation",
		"inert",
		"allowPinchZoom",
		"as",
		"gapMode"
	]);
	var SideCar = sideCar;
	var containerRef = useMergeRefs([ref, parentRef]);
	var containerProps = __assign(__assign({}, rest), callbacks);
	return React$1.createElement(React$1.Fragment, null, enabled && React$1.createElement(SideCar, {
		sideCar: effectCar,
		removeScrollBar,
		shards,
		noRelative,
		noIsolation,
		inert,
		setCallbacks,
		allowPinchZoom: !!allowPinchZoom,
		lockRef: ref,
		gapMode
	}), forwardProps ? React$1.cloneElement(React$1.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React$1.createElement(Container, __assign({}, containerProps, {
		className,
		ref: containerRef
	}), children));
});
RemoveScroll.defaultProps = {
	enabled: true,
	removeScrollBar: true,
	inert: false
};
RemoveScroll.classNames = {
	fullWidth: fullWidthClassName,
	zeroRight: zeroRightClassName
};
//#endregion
//#region node_modules/.pnpm/get-nonce@1.0.1/node_modules/get-nonce/dist/es2015/index.js
var currentNonce;
var getNonce = function() {
	if (currentNonce) return currentNonce;
	if (typeof __webpack_nonce__ !== "undefined") return __webpack_nonce__;
};
//#endregion
//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.14_react@19.2.5/node_modules/react-style-singleton/dist/es2015/singleton.js
function makeStyleTag() {
	if (!document) return null;
	var tag = document.createElement("style");
	tag.type = "text/css";
	var nonce = getNonce();
	if (nonce) tag.setAttribute("nonce", nonce);
	return tag;
}
function injectStyles(tag, css) {
	if (tag.styleSheet) tag.styleSheet.cssText = css;
	else tag.appendChild(document.createTextNode(css));
}
function insertStyleTag(tag) {
	(document.head || document.getElementsByTagName("head")[0]).appendChild(tag);
}
var stylesheetSingleton = function() {
	var counter = 0;
	var stylesheet = null;
	return {
		add: function(style) {
			if (counter == 0) {
				if (stylesheet = makeStyleTag()) {
					injectStyles(stylesheet, style);
					insertStyleTag(stylesheet);
				}
			}
			counter++;
		},
		remove: function() {
			counter--;
			if (!counter && stylesheet) {
				stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
				stylesheet = null;
			}
		}
	};
};
//#endregion
//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.14_react@19.2.5/node_modules/react-style-singleton/dist/es2015/hook.js
/**
* creates a hook to control style singleton
* @see {@link styleSingleton} for a safer component version
* @example
* ```tsx
* const useStyle = styleHookSingleton();
* ///
* useStyle('body { overflow: hidden}');
*/
var styleHookSingleton = function() {
	var sheet = stylesheetSingleton();
	return function(styles, isDynamic) {
		React$1.useEffect(function() {
			sheet.add(styles);
			return function() {
				sheet.remove();
			};
		}, [styles && isDynamic]);
	};
};
//#endregion
//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.14_react@19.2.5/node_modules/react-style-singleton/dist/es2015/component.js
/**
* create a Component to add styles on demand
* - styles are added when first instance is mounted
* - styles are removed when the last instance is unmounted
* - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
*/
var styleSingleton = function() {
	var useStyle = styleHookSingleton();
	var Sheet = function(_a) {
		var styles = _a.styles, dynamic = _a.dynamic;
		useStyle(styles, dynamic);
		return null;
	};
	return Sheet;
};
//#endregion
//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zeroGap = {
	left: 0,
	top: 0,
	right: 0,
	gap: 0
};
var parse = function(x) {
	return parseInt(x || "", 10) || 0;
};
var getOffset = function(gapMode) {
	var cs = window.getComputedStyle(document.body);
	var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
	var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
	var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
	return [
		parse(left),
		parse(top),
		parse(right)
	];
};
var getGapWidth = function(gapMode) {
	if (gapMode === void 0) gapMode = "margin";
	if (typeof window === "undefined") return zeroGap;
	var offsets = getOffset(gapMode);
	var documentWidth = document.documentElement.clientWidth;
	var windowWidth = window.innerWidth;
	return {
		left: offsets[0],
		top: offsets[1],
		right: offsets[2],
		gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
	};
};
//#endregion
//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll-bar/dist/es2015/component.js
var Style = styleSingleton();
var lockAttribute = "data-scroll-locked";
var getStyles = function(_a, allowRelative, gapMode, important) {
	var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
	if (gapMode === void 0) gapMode = "margin";
	return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
		allowRelative && "position: relative ".concat(important, ";"),
		gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
		gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
	].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
	var counter = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
	return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
	React$1.useEffect(function() {
		document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
		return function() {
			var newCounter = getCurrentUseCounter() - 1;
			if (newCounter <= 0) document.body.removeAttribute(lockAttribute);
			else document.body.setAttribute(lockAttribute, newCounter.toString());
		};
	}, []);
};
/**
* Removes page scrollbar and blocks page scroll when mounted
*/
var RemoveScrollBar = function(_a) {
	var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
	useLockAttribute();
	var gap = React$1.useMemo(function() {
		return getGapWidth(gapMode);
	}, [gapMode]);
	return React$1.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
};
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var passiveSupported = false;
if (typeof window !== "undefined") try {
	var options = Object.defineProperty({}, "passive", { get: function() {
		passiveSupported = true;
		return true;
	} });
	window.addEventListener("test", options, options);
	window.removeEventListener("test", options, options);
} catch (err) {
	passiveSupported = false;
}
var nonPassive = passiveSupported ? { passive: false } : false;
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var alwaysContainsScroll = function(node) {
	return node.tagName === "TEXTAREA";
};
var elementCanBeScrolled = function(node, overflow) {
	if (!(node instanceof Element)) return false;
	var styles = window.getComputedStyle(node);
	return styles[overflow] !== "hidden" && !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible");
};
var elementCouldBeVScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowY");
};
var elementCouldBeHScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowX");
};
var locationCouldBeScrolled = function(axis, node) {
	var ownerDocument = node.ownerDocument;
	var current = node;
	do {
		if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) current = current.host;
		if (elementCouldBeScrolled(axis, current)) {
			var _a = getScrollVariables(axis, current);
			if (_a[1] > _a[2]) return true;
		}
		current = current.parentNode;
	} while (current && current !== ownerDocument.body);
	return false;
};
var getVScrollVariables = function(_a) {
	return [
		_a.scrollTop,
		_a.scrollHeight,
		_a.clientHeight
	];
};
var getHScrollVariables = function(_a) {
	return [
		_a.scrollLeft,
		_a.scrollWidth,
		_a.clientWidth
	];
};
var elementCouldBeScrolled = function(axis, node) {
	return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
	return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
	/**
	* If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
	* and then increasingly negative as you scroll towards the end of the content.
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
	*/
	return axis === "h" && direction === "rtl" ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
	var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
	var delta = directionFactor * sourceDelta;
	var target = event.target;
	var targetInLock = endTarget.contains(target);
	var shouldCancelScroll = false;
	var isDeltaPositive = delta > 0;
	var availableScroll = 0;
	var availableScrollTop = 0;
	do {
		if (!target) break;
		var _a = getScrollVariables(axis, target), position = _a[0];
		var elementScroll = _a[1] - _a[2] - directionFactor * position;
		if (position || elementScroll) {
			if (elementCouldBeScrolled(axis, target)) {
				availableScroll += elementScroll;
				availableScrollTop += position;
			}
		}
		var parent_1 = target.parentNode;
		target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
	} while (!targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target));
	if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) shouldCancelScroll = true;
	else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) shouldCancelScroll = true;
	return shouldCancelScroll;
};
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var getTouchXY = function(event) {
	return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function(event) {
	return [event.deltaX, event.deltaY];
};
var extractRef = function(ref) {
	return ref && "current" in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
	return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
	return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
	var shouldPreventQueue = React$1.useRef([]);
	var touchStartRef = React$1.useRef([0, 0]);
	var activeAxis = React$1.useRef();
	var id = React$1.useState(idCounter++)[0];
	var Style = React$1.useState(styleSingleton)[0];
	var lastProps = React$1.useRef(props);
	React$1.useEffect(function() {
		lastProps.current = props;
	}, [props]);
	React$1.useEffect(function() {
		if (props.inert) {
			document.body.classList.add("block-interactivity-".concat(id));
			var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
			allow_1.forEach(function(el) {
				return el.classList.add("allow-interactivity-".concat(id));
			});
			return function() {
				document.body.classList.remove("block-interactivity-".concat(id));
				allow_1.forEach(function(el) {
					return el.classList.remove("allow-interactivity-".concat(id));
				});
			};
		}
	}, [
		props.inert,
		props.lockRef.current,
		props.shards
	]);
	var shouldCancelEvent = React$1.useCallback(function(event, parent) {
		if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) return !lastProps.current.allowPinchZoom;
		var touch = getTouchXY(event);
		var touchStart = touchStartRef.current;
		var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
		var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
		var currentAxis;
		var target = event.target;
		var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
		if ("touches" in event && moveDirection === "h" && target.type === "range") return false;
		var selection = window.getSelection();
		var anchorNode = selection && selection.anchorNode;
		if (anchorNode ? anchorNode === target || anchorNode.contains(target) : false) return false;
		var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		if (!canBeScrolledInMainDirection) return true;
		if (canBeScrolledInMainDirection) currentAxis = moveDirection;
		else {
			currentAxis = moveDirection === "v" ? "h" : "v";
			canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		}
		if (!canBeScrolledInMainDirection) return false;
		if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) activeAxis.current = currentAxis;
		if (!currentAxis) return true;
		var cancelingAxis = activeAxis.current || currentAxis;
		return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
	}, []);
	var shouldPrevent = React$1.useCallback(function(_event) {
		var event = _event;
		if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) return;
		var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
		var sourceEvent = shouldPreventQueue.current.filter(function(e) {
			return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
		})[0];
		if (sourceEvent && sourceEvent.should) {
			if (event.cancelable) event.preventDefault();
			return;
		}
		if (!sourceEvent) {
			var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
				return node.contains(event.target);
			});
			if (shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation) {
				if (event.cancelable) event.preventDefault();
			}
		}
	}, []);
	var shouldCancel = React$1.useCallback(function(name, delta, target, should) {
		var event = {
			name,
			delta,
			target,
			should,
			shadowParent: getOutermostShadowParent(target)
		};
		shouldPreventQueue.current.push(event);
		setTimeout(function() {
			shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
				return e !== event;
			});
		}, 1);
	}, []);
	var scrollTouchStart = React$1.useCallback(function(event) {
		touchStartRef.current = getTouchXY(event);
		activeAxis.current = void 0;
	}, []);
	var scrollWheel = React$1.useCallback(function(event) {
		shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	var scrollTouchMove = React$1.useCallback(function(event) {
		shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	React$1.useEffect(function() {
		lockStack.push(Style);
		props.setCallbacks({
			onScrollCapture: scrollWheel,
			onWheelCapture: scrollWheel,
			onTouchMoveCapture: scrollTouchMove
		});
		document.addEventListener("wheel", shouldPrevent, nonPassive);
		document.addEventListener("touchmove", shouldPrevent, nonPassive);
		document.addEventListener("touchstart", scrollTouchStart, nonPassive);
		return function() {
			lockStack = lockStack.filter(function(inst) {
				return inst !== Style;
			});
			document.removeEventListener("wheel", shouldPrevent, nonPassive);
			document.removeEventListener("touchmove", shouldPrevent, nonPassive);
			document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
		};
	}, []);
	var removeScrollBar = props.removeScrollBar, inert = props.inert;
	return React$1.createElement(React$1.Fragment, null, inert ? React$1.createElement(Style, { styles: generateStyle(id) }) : null, removeScrollBar ? React$1.createElement(RemoveScrollBar, {
		noRelative: props.noRelative,
		gapMode: props.gapMode
	}) : null);
}
function getOutermostShadowParent(node) {
	var shadowParent = null;
	while (node !== null) {
		if (node instanceof ShadowRoot) {
			shadowParent = node.host;
			node = node.host;
		}
		node = node.parentNode;
	}
	return shadowParent;
}
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll/dist/es2015/sidecar.js
var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.5/node_modules/react-remove-scroll/dist/es2015/Combination.js
var ReactRemoveScroll = React$1.forwardRef(function(props, ref) {
	return React$1.createElement(RemoveScroll, __assign({}, props, {
		ref,
		sideCar: sidecar_default
	}));
});
ReactRemoveScroll.classNames = RemoveScroll.classNames;
//#endregion
//#region node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
var getDefaultParent = function(originalTarget) {
	if (typeof document === "undefined") return null;
	return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
};
var counterMap = /* @__PURE__ */ new WeakMap();
var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
	return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
	return targets.map(function(target) {
		if (parent.contains(target)) return target;
		var correctedTarget = unwrapHost(target);
		if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
		console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
		return null;
	}).filter(function(x) {
		return Boolean(x);
	});
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @param {String} [controlAttribute] - html Attribute to control
* @return {Undo} undo command
*/
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
	var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	if (!markerMap[markerName]) markerMap[markerName] = /* @__PURE__ */ new WeakMap();
	var markerCounter = markerMap[markerName];
	var hiddenNodes = [];
	var elementsToKeep = /* @__PURE__ */ new Set();
	var elementsToStop = new Set(targets);
	var keep = function(el) {
		if (!el || elementsToKeep.has(el)) return;
		elementsToKeep.add(el);
		keep(el.parentNode);
	};
	targets.forEach(keep);
	var deep = function(parent) {
		if (!parent || elementsToStop.has(parent)) return;
		Array.prototype.forEach.call(parent.children, function(node) {
			if (elementsToKeep.has(node)) deep(node);
			else try {
				var attr = node.getAttribute(controlAttribute);
				var alreadyHidden = attr !== null && attr !== "false";
				var counterValue = (counterMap.get(node) || 0) + 1;
				var markerValue = (markerCounter.get(node) || 0) + 1;
				counterMap.set(node, counterValue);
				markerCounter.set(node, markerValue);
				hiddenNodes.push(node);
				if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
				if (markerValue === 1) node.setAttribute(markerName, "true");
				if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
			} catch (e) {
				console.error("aria-hidden: cannot operate on ", node, e);
			}
		});
	};
	deep(parentNode);
	elementsToKeep.clear();
	lockCount++;
	return function() {
		hiddenNodes.forEach(function(node) {
			var counterValue = counterMap.get(node) - 1;
			var markerValue = markerCounter.get(node) - 1;
			counterMap.set(node, counterValue);
			markerCounter.set(node, markerValue);
			if (!counterValue) {
				if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
				uncontrolledNodes.delete(node);
			}
			if (!markerValue) node.removeAttribute(markerName);
		});
		lockCount--;
		if (!lockCount) {
			counterMap = /* @__PURE__ */ new WeakMap();
			counterMap = /* @__PURE__ */ new WeakMap();
			uncontrolledNodes = /* @__PURE__ */ new WeakMap();
			markerMap = {};
		}
	};
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @return {Undo} undo command
*/
var hideOthers = function(originalTarget, parentNode, markerName) {
	if (markerName === void 0) markerName = "data-aria-hidden";
	var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	var activeParentNode = parentNode || getDefaultParent(originalTarget);
	if (!activeParentNode) return function() {
		return null;
	};
	targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
	return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-dialog@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.14__@types+reac_2bb6e144a4a4887664c34982a66175eb/node_modules/@radix-ui/react-dialog/dist/index.mjs
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
	const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const triggerRef = React$1.useRef(null);
	const contentRef = React$1.useRef(null);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DIALOG_NAME
	});
	return /* @__PURE__ */ jsx(DialogProvider, {
		scope: __scopeDialog,
		triggerRef,
		contentRef,
		contentId: useId$1(),
		titleId: useId$1(),
		descriptionId: useId$1(),
		open,
		onOpenChange: setOpen,
		onOpenToggle: React$1.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		children
	});
};
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME$4 = "DialogTrigger";
var DialogTrigger = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...triggerProps } = props;
	const context = useDialogContext(TRIGGER_NAME$4, __scopeDialog);
	const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
	return /* @__PURE__ */ jsx(Primitive.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": context.open,
		"aria-controls": context.contentId,
		"data-state": getState$2(context.open),
		...triggerProps,
		ref: composedTriggerRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
});
DialogTrigger.displayName = TRIGGER_NAME$4;
var PORTAL_NAME$4 = "DialogPortal";
var [PortalProvider$2, usePortalContext$2] = createDialogContext(PORTAL_NAME$4, { forceMount: void 0 });
var DialogPortal = (props) => {
	const { __scopeDialog, forceMount, children, container } = props;
	const context = useDialogContext(PORTAL_NAME$4, __scopeDialog);
	return /* @__PURE__ */ jsx(PortalProvider$2, {
		scope: __scopeDialog,
		forceMount,
		children: React$1.Children.map(children, (child) => /* @__PURE__ */ jsx(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ jsx(Portal$4, {
				asChild: true,
				container,
				children: child
			})
		}))
	});
};
DialogPortal.displayName = PORTAL_NAME$4;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = React$1.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext$2(OVERLAY_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
	return context.modal ? /* @__PURE__ */ jsx(Presence, {
		present: forceMount || context.open,
		children: /* @__PURE__ */ jsx(DialogOverlayImpl, {
			...overlayProps,
			ref: forwardedRef
		})
	}) : null;
});
DialogOverlay.displayName = OVERLAY_NAME;
var Slot$3 = /* @__PURE__ */ createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
	return /* @__PURE__ */ jsx(ReactRemoveScroll, {
		as: Slot$3,
		allowPinchZoom: true,
		shards: [context.contentRef],
		children: /* @__PURE__ */ jsx(Primitive.div, {
			"data-state": getState$2(context.open),
			...overlayProps,
			ref: forwardedRef,
			style: {
				pointerEvents: "auto",
				...overlayProps.style
			}
		})
	});
});
var CONTENT_NAME$5 = "DialogContent";
var DialogContent = React$1.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext$2(CONTENT_NAME$5, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME$5, props.__scopeDialog);
	return /* @__PURE__ */ jsx(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ jsx(DialogContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ jsx(DialogContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
});
DialogContent.displayName = CONTENT_NAME$5;
var DialogContentModal = React$1.forwardRef((props, forwardedRef) => {
	const context = useDialogContext(CONTENT_NAME$5, props.__scopeDialog);
	const contentRef = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
	React$1.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ jsx(DialogContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: true,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			event.preventDefault();
			context.triggerRef.current?.focus();
		}),
		onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
		}),
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault())
	});
});
var DialogContentNonModal = React$1.forwardRef((props, forwardedRef) => {
	const context = useDialogContext(CONTENT_NAME$5, props.__scopeDialog);
	const hasInteractedOutsideRef = React$1.useRef(false);
	const hasPointerDownOutsideRef = React$1.useRef(false);
	return /* @__PURE__ */ jsx(DialogContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		onCloseAutoFocus: (event) => {
			props.onCloseAutoFocus?.(event);
			if (!event.defaultPrevented) {
				if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
				event.preventDefault();
			}
			hasInteractedOutsideRef.current = false;
			hasPointerDownOutsideRef.current = false;
		},
		onInteractOutside: (event) => {
			props.onInteractOutside?.(event);
			if (!event.defaultPrevented) {
				hasInteractedOutsideRef.current = true;
				if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.current = true;
			}
			const target = event.target;
			if (context.triggerRef.current?.contains(target)) event.preventDefault();
			if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) event.preventDefault();
		}
	});
});
var DialogContentImpl = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME$5, __scopeDialog);
	const contentRef = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef);
	useFocusGuards();
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(FocusScope, {
		asChild: true,
		loop: true,
		trapped: trapFocus,
		onMountAutoFocus: onOpenAutoFocus,
		onUnmountAutoFocus: onCloseAutoFocus,
		children: /* @__PURE__ */ jsx(DismissableLayer, {
			role: "dialog",
			id: context.contentId,
			"aria-describedby": context.descriptionId,
			"aria-labelledby": context.titleId,
			"data-state": getState$2(context.open),
			...contentProps,
			ref: composedRefs,
			onDismiss: () => context.onOpenChange(false)
		})
	}), /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(TitleWarning, { titleId: context.titleId }), /* @__PURE__ */ jsx(DescriptionWarning, {
		contentRef,
		descriptionId: context.descriptionId
	})] })] });
});
var TITLE_NAME = "DialogTitle";
var DialogTitle = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...titleProps } = props;
	const context = useDialogContext(TITLE_NAME, __scopeDialog);
	return /* @__PURE__ */ jsx(Primitive.h2, {
		id: context.titleId,
		...titleProps,
		ref: forwardedRef
	});
});
DialogTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...descriptionProps } = props;
	const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
	return /* @__PURE__ */ jsx(Primitive.p, {
		id: context.descriptionId,
		...descriptionProps,
		ref: forwardedRef
	});
});
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME$1 = "DialogClose";
var DialogClose = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...closeProps } = props;
	const context = useDialogContext(CLOSE_NAME$1, __scopeDialog);
	return /* @__PURE__ */ jsx(Primitive.button, {
		type: "button",
		...closeProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
	});
});
DialogClose.displayName = CLOSE_NAME$1;
function getState$2(open) {
	return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
	contentName: CONTENT_NAME$5,
	titleName: TITLE_NAME,
	docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
	const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
	const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
	React$1.useEffect(() => {
		if (titleId) {
			if (!document.getElementById(titleId)) console.error(MESSAGE);
		}
	}, [MESSAGE, titleId]);
	return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
	const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${useWarningContext(DESCRIPTION_WARNING_NAME).contentName}}.`;
	React$1.useEffect(() => {
		const describedById = contentRef.current?.getAttribute("aria-describedby");
		if (descriptionId && describedById) {
			if (!document.getElementById(descriptionId)) console.warn(MESSAGE);
		}
	}, [
		MESSAGE,
		contentRef,
		descriptionId
	]);
	return null;
};
var Root$3 = Dialog;
var Portal$3 = DialogPortal;
var Overlay = DialogOverlay;
var Content$1 = DialogContent;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-previous@1.1.1_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-use-previous/dist/index.mjs
function usePrevious(value) {
	const ref = React$1.useRef({
		value,
		previous: value
	});
	return React$1.useMemo(() => {
		if (ref.current.value !== value) {
			ref.current.previous = ref.current.value;
			ref.current.value = value;
		}
		return ref.current.previous;
	}, [value]);
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-size@1.1.1_@types+react@19.2.14_react@19.2.5/node_modules/@radix-ui/react-use-size/dist/index.mjs
function useSize(element) {
	const [size, setSize] = React$1.useState(void 0);
	useLayoutEffect2(() => {
		if (element) {
			setSize({
				width: element.offsetWidth,
				height: element.offsetHeight
			});
			const resizeObserver = new ResizeObserver((entries) => {
				if (!Array.isArray(entries)) return;
				if (!entries.length) return;
				const entry = entries[0];
				let width;
				let height;
				if ("borderBoxSize" in entry) {
					const borderSizeEntry = entry["borderBoxSize"];
					const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
					width = borderSize["inlineSize"];
					height = borderSize["blockSize"];
				} else {
					width = element.offsetWidth;
					height = element.offsetHeight;
				}
				setSize({
					width,
					height
				});
			});
			resizeObserver.observe(element, { box: "border-box" });
			return () => resizeObserver.unobserve(element);
		} else setSize(void 0);
	}, [element]);
	return size;
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-checkbox@1.3.3_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_5d08deedc0c6fcbbf88ad155a4d8991e/node_modules/@radix-ui/react-checkbox/dist/index.mjs
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
	const { __scopeCheckbox, checked: checkedProp, children, defaultChecked, disabled, form, name, onCheckedChange, required, value = "on", internal_do_not_use_render } = props;
	const [checked, setChecked] = useControllableState({
		prop: checkedProp,
		defaultProp: defaultChecked ?? false,
		onChange: onCheckedChange,
		caller: CHECKBOX_NAME
	});
	const [control, setControl] = React$1.useState(null);
	const [bubbleInput, setBubbleInput] = React$1.useState(null);
	const hasConsumerStoppedPropagationRef = React$1.useRef(false);
	const isFormControl = control ? !!form || !!control.closest("form") : true;
	const context = {
		checked,
		disabled,
		setChecked,
		control,
		setControl,
		name,
		form,
		value,
		hasConsumerStoppedPropagationRef,
		required,
		defaultChecked: isIndeterminate$1(defaultChecked) ? false : defaultChecked,
		isFormControl,
		bubbleInput,
		setBubbleInput
	};
	return /* @__PURE__ */ jsx(CheckboxProviderImpl, {
		scope: __scopeCheckbox,
		...context,
		children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
	});
}
var TRIGGER_NAME$3 = "CheckboxTrigger";
var CheckboxTrigger = React$1.forwardRef(({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
	const { control, value, disabled, checked, required, setControl, setChecked, hasConsumerStoppedPropagationRef, isFormControl, bubbleInput } = useCheckboxContext(TRIGGER_NAME$3, __scopeCheckbox);
	const composedRefs = useComposedRefs(forwardedRef, setControl);
	const initialCheckedStateRef = React$1.useRef(checked);
	React$1.useEffect(() => {
		const form = control?.form;
		if (form) {
			const reset = () => setChecked(initialCheckedStateRef.current);
			form.addEventListener("reset", reset);
			return () => form.removeEventListener("reset", reset);
		}
	}, [control, setChecked]);
	return /* @__PURE__ */ jsx(Primitive.button, {
		type: "button",
		role: "checkbox",
		"aria-checked": isIndeterminate$1(checked) ? "mixed" : checked,
		"aria-required": required,
		"data-state": getState$1(checked),
		"data-disabled": disabled ? "" : void 0,
		disabled,
		value,
		...checkboxProps,
		ref: composedRefs,
		onKeyDown: composeEventHandlers(onKeyDown, (event) => {
			if (event.key === "Enter") event.preventDefault();
		}),
		onClick: composeEventHandlers(onClick, (event) => {
			setChecked((prevChecked) => isIndeterminate$1(prevChecked) ? true : !prevChecked);
			if (bubbleInput && isFormControl) {
				hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
				if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
			}
		})
	});
});
CheckboxTrigger.displayName = TRIGGER_NAME$3;
var Checkbox$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeCheckbox, name, checked, defaultChecked, required, disabled, value, onCheckedChange, form, ...checkboxProps } = props;
	return /* @__PURE__ */ jsx(CheckboxProvider, {
		__scopeCheckbox,
		checked,
		defaultChecked,
		disabled,
		required,
		onCheckedChange,
		name,
		form,
		value,
		internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CheckboxTrigger, {
			...checkboxProps,
			ref: forwardedRef,
			__scopeCheckbox
		}), isFormControl && /* @__PURE__ */ jsx(CheckboxBubbleInput, { __scopeCheckbox })] })
	});
});
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME$1 = "CheckboxIndicator";
var CheckboxIndicator = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
	const context = useCheckboxContext(INDICATOR_NAME$1, __scopeCheckbox);
	return /* @__PURE__ */ jsx(Presence, {
		present: forceMount || isIndeterminate$1(context.checked) || context.checked === true,
		children: /* @__PURE__ */ jsx(Primitive.span, {
			"data-state": getState$1(context.checked),
			"data-disabled": context.disabled ? "" : void 0,
			...indicatorProps,
			ref: forwardedRef,
			style: {
				pointerEvents: "none",
				...props.style
			}
		})
	});
});
CheckboxIndicator.displayName = INDICATOR_NAME$1;
var BUBBLE_INPUT_NAME$1 = "CheckboxBubbleInput";
var CheckboxBubbleInput = React$1.forwardRef(({ __scopeCheckbox, ...props }, forwardedRef) => {
	const { control, hasConsumerStoppedPropagationRef, checked, defaultChecked, required, disabled, name, value, form, bubbleInput, setBubbleInput } = useCheckboxContext(BUBBLE_INPUT_NAME$1, __scopeCheckbox);
	const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
	const prevChecked = usePrevious(checked);
	const controlSize = useSize(control);
	React$1.useEffect(() => {
		const input = bubbleInput;
		if (!input) return;
		const inputProto = window.HTMLInputElement.prototype;
		const setChecked = Object.getOwnPropertyDescriptor(inputProto, "checked").set;
		const bubbles = !hasConsumerStoppedPropagationRef.current;
		if (prevChecked !== checked && setChecked) {
			const event = new Event("click", { bubbles });
			input.indeterminate = isIndeterminate$1(checked);
			setChecked.call(input, isIndeterminate$1(checked) ? false : checked);
			input.dispatchEvent(event);
		}
	}, [
		bubbleInput,
		prevChecked,
		checked,
		hasConsumerStoppedPropagationRef
	]);
	const defaultCheckedRef = React$1.useRef(isIndeterminate$1(checked) ? false : checked);
	return /* @__PURE__ */ jsx(Primitive.input, {
		type: "checkbox",
		"aria-hidden": true,
		defaultChecked: defaultChecked ?? defaultCheckedRef.current,
		required,
		disabled,
		name,
		value,
		form,
		...props,
		tabIndex: -1,
		ref: composedRefs,
		style: {
			...props.style,
			...controlSize,
			position: "absolute",
			pointerEvents: "none",
			opacity: 0,
			margin: 0,
			transform: "translateX(-100%)"
		}
	});
});
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME$1;
function isFunction(value) {
	return typeof value === "function";
}
function isIndeterminate$1(checked) {
	return checked === "indeterminate";
}
function getState$1(checked) {
	return isIndeterminate$1(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
/**
* Custom positioning reference element.
* @see https://floating-ui.com/docs/virtual-elements
*/
const sides = [
	"top",
	"right",
	"bottom",
	"left"
];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
	x: v,
	y: v
});
const oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp$1(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
const lrPlacement = ["left", "right"];
const rlPlacement = ["right", "left"];
const tbPlacement = ["top", "bottom"];
const btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...padding
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+core@1.7.5/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	switch (getAlignment(placement)) {
		case "start":
			coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
			break;
		case "end":
			coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
			break;
	}
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) ? await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	} : {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
const MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
const computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
const arrow$3 = (options) => ({
	name: "arrow",
	options,
	async fn(state) {
		const { x, y, placement, rects, platform, elements, middlewareData } = state;
		const { element, padding = 0 } = evaluate(options, state) || {};
		if (element == null) return {};
		const paddingObject = getPaddingObject(padding);
		const coords = {
			x,
			y
		};
		const axis = getAlignmentAxis(placement);
		const length = getAxisLength(axis);
		const arrowDimensions = await platform.getDimensions(element);
		const isYAxis = axis === "y";
		const minProp = isYAxis ? "top" : "left";
		const maxProp = isYAxis ? "bottom" : "right";
		const clientProp = isYAxis ? "clientHeight" : "clientWidth";
		const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
		const startDiff = coords[axis] - rects.reference[axis];
		const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
		let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
		if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
		const centerToReference = endDiff / 2 - startDiff / 2;
		const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
		const minPadding = min(paddingObject[minProp], largestPossiblePadding);
		const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
		const min$1 = minPadding;
		const max = clientSize - arrowDimensions[length] - maxPadding;
		const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
		const offset = clamp$1(min$1, center, max);
		const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
		const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
		return {
			[axis]: coords[axis] + alignmentOffset,
			data: {
				[axis]: offset,
				centerOffset: center - offset - alignmentOffset,
				...shouldAddOffset && { alignmentOffset }
			},
			reset: shouldAddOffset
		};
	}
});
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
const flip$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement":
						resetPlacement = initialPlacement;
						break;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
function getSideOffsets(overflow, rect) {
	return {
		top: overflow.top - rect.height,
		right: overflow.right - rect.width,
		bottom: overflow.bottom - rect.height,
		left: overflow.left - rect.width
	};
}
function isAnySideFullyClipped(overflow) {
	return sides.some((side) => overflow[side] >= 0);
}
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
const hide$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "hide",
		options,
		async fn(state) {
			const { rects, platform } = state;
			const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
			switch (strategy) {
				case "referenceHidden": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						elementContext: "reference"
					}), rects.reference);
					return { data: {
						referenceHiddenOffsets: offsets,
						referenceHidden: isAnySideFullyClipped(offsets)
					} };
				}
				case "escaped": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						altBoundary: true
					}), rects.floating);
					return { data: {
						escapedOffsets: offsets,
						escaped: isAnySideFullyClipped(offsets)
					} };
				}
				default: return {};
			}
		}
	};
};
const originSides = /* @__PURE__ */ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
const offset$2 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
const shift$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(getSide(placement));
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			if (checkMainAxis) {
				const minSide = mainAxis === "y" ? "top" : "left";
				const maxSide = mainAxis === "y" ? "bottom" : "right";
				const min = mainAxisCoord + overflow[minSide];
				const max = mainAxisCoord - overflow[maxSide];
				mainAxisCoord = clamp$1(min, mainAxisCoord, max);
			}
			if (checkCrossAxis) {
				const minSide = crossAxis === "y" ? "top" : "left";
				const maxSide = crossAxis === "y" ? "bottom" : "right";
				const min = crossAxisCoord + overflow[minSide];
				const max = crossAxisCoord - overflow[maxSide];
				crossAxisCoord = clamp$1(min, crossAxisCoord, max);
			}
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
const limitShift$2 = function(options) {
	if (options === void 0) options = {};
	return {
		options,
		fn(state) {
			const { x, y, placement, rects, middlewareData } = state;
			const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const rawOffset = evaluate(offset, state);
			const computedOffset = typeof rawOffset === "number" ? {
				mainAxis: rawOffset,
				crossAxis: 0
			} : {
				mainAxis: 0,
				crossAxis: 0,
				...rawOffset
			};
			if (checkMainAxis) {
				const len = mainAxis === "y" ? "height" : "width";
				const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
				const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
				if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
				else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
			}
			if (checkCrossAxis) {
				var _middlewareData$offse, _middlewareData$offse2;
				const len = mainAxis === "y" ? "width" : "height";
				const isOriginSide = originSides.has(getSide(placement));
				const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
				const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
				if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
				else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
			}
			return {
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
const size$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			var _state$middlewareData, _state$middlewareData2;
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const noShift = !state.middlewareData.shift;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) availableWidth = maximumClippingWidth;
			if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) {
				const xMin = max(overflow.left, 0);
				const xMax = max(overflow.right, 0);
				const yMin = max(overflow.top, 0);
				const yMax = max(overflow.bottom, 0);
				if (isYAxis) availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
				else availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
			}
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = (value) => !!value && value !== "none";
let isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return node.ownerDocument ? node.ownerDocument.body : node.body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+dom@1.7.6/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) return false;
	return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) if (offsetParent) {
		if (isElement(offsetParent)) scale = getScale(offsetParent);
	} else scale = getScale(element);
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement) {
		const win = getWindow(domElement);
		const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetParent && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
	const html = getDocumentElement(element);
	const scroll = getNodeScroll(element);
	const body = element.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(element);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		width = visualViewport.width;
		height = visualViewport.height;
		const visualViewportBased = isWebKit();
		if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
			x = visualViewport.offsetLeft;
			y = visualViewport.offsetTop;
		}
	}
	const windowScrollbarX = getWindowScrollBarX(html);
	if (windowScrollbarX <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) width -= clippingStableScrollbarWidth;
	} else if (windowScrollbarX <= SCROLLBAR_MAX) width += windowScrollbarX;
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport") rect = getViewportRect(element, strategy);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
	const parentNode = getParentNode(element);
	if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) return false;
	return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let currentContainingBlockComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		if (!currentNodeIsContaining && computedStyle.position === "fixed") currentContainingBlockComputedStyle = null;
		if (elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode)) result = result.filter((ancestor) => ancestor !== currentNode);
		else currentContainingBlockComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	function setLeftRTLScrollbarOffset() {
		offsets.x = getWindowScrollBarX(documentElement);
	}
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		} else if (documentElement) setLeftRTLScrollbarOffset();
	}
	if (isFixed && !isOffsetParentAnElement && documentElement) setLeftRTLScrollbarOffset();
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) refresh();
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	refresh(true);
	return cleanup;
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update, { passive: true });
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
const offset$1 = offset$2;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
const shift$1 = shift$2;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
const flip$1 = flip$2;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
const size$1 = size$2;
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
const hide$1 = hide$2;
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
const arrow$2 = arrow$3;
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
const limitShift$1 = limitShift$2;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
const computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = {
		platform,
		...options
	};
	const platformWithCache = {
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
//#endregion
//#region node_modules/.pnpm/@floating-ui+react-dom@2.1.8_react-dom@19.2.5_react@19.2.5__react@19.2.5/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
var index = typeof document !== "undefined" ? useLayoutEffect : function noop() {};
function deepEqual(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (typeof a === "function" && a.toString() === b.toString()) return true;
	let length;
	let i;
	let keys;
	if (a && b && typeof a === "object") {
		if (Array.isArray(a)) {
			length = a.length;
			if (length !== b.length) return false;
			for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
			return true;
		}
		keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) return false;
		for (i = length; i-- !== 0;) if (!{}.hasOwnProperty.call(b, keys[i])) return false;
		for (i = length; i-- !== 0;) {
			const key = keys[i];
			if (key === "_owner" && a.$$typeof) continue;
			if (!deepEqual(a[key], b[key])) return false;
		}
		return true;
	}
	return a !== a && b !== b;
}
function getDPR(element) {
	if (typeof window === "undefined") return 1;
	return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
	const ref = React$1.useRef(value);
	index(() => {
		ref.current = value;
	});
	return ref;
}
/**
* Provides data to position a floating element.
* @see https://floating-ui.com/docs/useFloating
*/
function useFloating(options) {
	if (options === void 0) options = {};
	const { placement = "bottom", strategy = "absolute", middleware = [], platform, elements: { reference: externalReference, floating: externalFloating } = {}, transform = true, whileElementsMounted, open } = options;
	const [data, setData] = React$1.useState({
		x: 0,
		y: 0,
		strategy,
		placement,
		middlewareData: {},
		isPositioned: false
	});
	const [latestMiddleware, setLatestMiddleware] = React$1.useState(middleware);
	if (!deepEqual(latestMiddleware, middleware)) setLatestMiddleware(middleware);
	const [_reference, _setReference] = React$1.useState(null);
	const [_floating, _setFloating] = React$1.useState(null);
	const setReference = React$1.useCallback((node) => {
		if (node !== referenceRef.current) {
			referenceRef.current = node;
			_setReference(node);
		}
	}, []);
	const setFloating = React$1.useCallback((node) => {
		if (node !== floatingRef.current) {
			floatingRef.current = node;
			_setFloating(node);
		}
	}, []);
	const referenceEl = externalReference || _reference;
	const floatingEl = externalFloating || _floating;
	const referenceRef = React$1.useRef(null);
	const floatingRef = React$1.useRef(null);
	const dataRef = React$1.useRef(data);
	const hasWhileElementsMounted = whileElementsMounted != null;
	const whileElementsMountedRef = useLatestRef(whileElementsMounted);
	const platformRef = useLatestRef(platform);
	const openRef = useLatestRef(open);
	const update = React$1.useCallback(() => {
		if (!referenceRef.current || !floatingRef.current) return;
		const config = {
			placement,
			strategy,
			middleware: latestMiddleware
		};
		if (platformRef.current) config.platform = platformRef.current;
		computePosition(referenceRef.current, floatingRef.current, config).then((data) => {
			const fullData = {
				...data,
				isPositioned: openRef.current !== false
			};
			if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
				dataRef.current = fullData;
				ReactDOM$1.flushSync(() => {
					setData(fullData);
				});
			}
		});
	}, [
		latestMiddleware,
		placement,
		strategy,
		platformRef,
		openRef
	]);
	index(() => {
		if (open === false && dataRef.current.isPositioned) {
			dataRef.current.isPositioned = false;
			setData((data) => ({
				...data,
				isPositioned: false
			}));
		}
	}, [open]);
	const isMountedRef = React$1.useRef(false);
	index(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	index(() => {
		if (referenceEl) referenceRef.current = referenceEl;
		if (floatingEl) floatingRef.current = floatingEl;
		if (referenceEl && floatingEl) {
			if (whileElementsMountedRef.current) return whileElementsMountedRef.current(referenceEl, floatingEl, update);
			update();
		}
	}, [
		referenceEl,
		floatingEl,
		update,
		whileElementsMountedRef,
		hasWhileElementsMounted
	]);
	const refs = React$1.useMemo(() => ({
		reference: referenceRef,
		floating: floatingRef,
		setReference,
		setFloating
	}), [setReference, setFloating]);
	const elements = React$1.useMemo(() => ({
		reference: referenceEl,
		floating: floatingEl
	}), [referenceEl, floatingEl]);
	const floatingStyles = React$1.useMemo(() => {
		const initialStyles = {
			position: strategy,
			left: 0,
			top: 0
		};
		if (!elements.floating) return initialStyles;
		const x = roundByDPR(elements.floating, data.x);
		const y = roundByDPR(elements.floating, data.y);
		if (transform) return {
			...initialStyles,
			transform: "translate(" + x + "px, " + y + "px)",
			...getDPR(elements.floating) >= 1.5 && { willChange: "transform" }
		};
		return {
			position: strategy,
			left: x,
			top: y
		};
	}, [
		strategy,
		transform,
		elements.floating,
		data.x,
		data.y
	]);
	return React$1.useMemo(() => ({
		...data,
		update,
		refs,
		elements,
		floatingStyles
	}), [
		data,
		update,
		refs,
		elements,
		floatingStyles
	]);
}
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
const arrow$1 = (options) => {
	function isRef(value) {
		return {}.hasOwnProperty.call(value, "current");
	}
	return {
		name: "arrow",
		options,
		fn(state) {
			const { element, padding } = typeof options === "function" ? options(state) : options;
			if (element && isRef(element)) {
				if (element.current != null) return arrow$2({
					element: element.current,
					padding
				}).fn(state);
				return {};
			}
			if (element) return arrow$2({
				element,
				padding
			}).fn(state);
			return {};
		}
	};
};
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
const offset = (options, deps) => {
	const result = offset$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
const shift = (options, deps) => {
	const result = shift$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
const limitShift = (options, deps) => {
	return {
		fn: limitShift$1(options).fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
const flip = (options, deps) => {
	const result = flip$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
const size = (options, deps) => {
	const result = size$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
const hide = (options, deps) => {
	const result = hide$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
const arrow = (options, deps) => {
	const result = arrow$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-arrow@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_14bc9598b768a769e11be219fefe25ea/node_modules/@radix-ui/react-arrow/dist/index.mjs
var NAME$1 = "Arrow";
var Arrow$1 = React$1.forwardRef((props, forwardedRef) => {
	const { children, width = 10, height = 5, ...arrowProps } = props;
	return /* @__PURE__ */ jsx(Primitive.svg, {
		...arrowProps,
		ref: forwardedRef,
		width,
		height,
		viewBox: "0 0 30 10",
		preserveAspectRatio: "none",
		children: props.asChild ? children : /* @__PURE__ */ jsx("polygon", { points: "0,0 30,0 15,10" })
	});
});
Arrow$1.displayName = NAME$1;
var Root$2 = Arrow$1;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-popper@1.2.8_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_b2df70dfdc5938ce3eb3c2d33572a030/node_modules/@radix-ui/react-popper/dist/index.mjs
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
	const { __scopePopper, children } = props;
	const [anchor, setAnchor] = React$1.useState(null);
	return /* @__PURE__ */ jsx(PopperProvider, {
		scope: __scopePopper,
		anchor,
		onAnchorChange: setAnchor,
		children
	});
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME$2 = "PopperAnchor";
var PopperAnchor = React$1.forwardRef((props, forwardedRef) => {
	const { __scopePopper, virtualRef, ...anchorProps } = props;
	const context = usePopperContext(ANCHOR_NAME$2, __scopePopper);
	const ref = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const anchorRef = React$1.useRef(null);
	React$1.useEffect(() => {
		const previousAnchor = anchorRef.current;
		anchorRef.current = virtualRef?.current || ref.current;
		if (previousAnchor !== anchorRef.current) context.onAnchorChange(anchorRef.current);
	});
	return virtualRef ? null : /* @__PURE__ */ jsx(Primitive.div, {
		...anchorProps,
		ref: composedRefs
	});
});
PopperAnchor.displayName = ANCHOR_NAME$2;
var CONTENT_NAME$4 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$4);
var PopperContent = React$1.forwardRef((props, forwardedRef) => {
	const { __scopePopper, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, arrowPadding = 0, avoidCollisions = true, collisionBoundary = [], collisionPadding: collisionPaddingProp = 0, sticky = "partial", hideWhenDetached = false, updatePositionStrategy = "optimized", onPlaced, ...contentProps } = props;
	const context = usePopperContext(CONTENT_NAME$4, __scopePopper);
	const [content, setContent] = React$1.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
	const [arrow$4, setArrow] = React$1.useState(null);
	const arrowSize = useSize(arrow$4);
	const arrowWidth = arrowSize?.width ?? 0;
	const arrowHeight = arrowSize?.height ?? 0;
	const desiredPlacement = side + (align !== "center" ? "-" + align : "");
	const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...collisionPaddingProp
	};
	const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
	const hasExplicitBoundaries = boundary.length > 0;
	const detectOverflowOptions = {
		padding: collisionPadding,
		boundary: boundary.filter(isNotNull),
		altBoundary: hasExplicitBoundaries
	};
	const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
		strategy: "fixed",
		placement: desiredPlacement,
		whileElementsMounted: (...args) => {
			return autoUpdate(...args, { animationFrame: updatePositionStrategy === "always" });
		},
		elements: { reference: context.anchor },
		middleware: [
			offset({
				mainAxis: sideOffset + arrowHeight,
				alignmentAxis: alignOffset
			}),
			avoidCollisions && shift({
				mainAxis: true,
				crossAxis: false,
				limiter: sticky === "partial" ? limitShift() : void 0,
				...detectOverflowOptions
			}),
			avoidCollisions && flip({ ...detectOverflowOptions }),
			size({
				...detectOverflowOptions,
				apply: ({ elements, rects, availableWidth, availableHeight }) => {
					const { width: anchorWidth, height: anchorHeight } = rects.reference;
					const contentStyle = elements.floating.style;
					contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
					contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
					contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
					contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
				}
			}),
			arrow$4 && arrow({
				element: arrow$4,
				padding: arrowPadding
			}),
			transformOrigin({
				arrowWidth,
				arrowHeight
			}),
			hideWhenDetached && hide({
				strategy: "referenceHidden",
				...detectOverflowOptions
			})
		]
	});
	const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
	const handlePlaced = useCallbackRef$1(onPlaced);
	useLayoutEffect2(() => {
		if (isPositioned) handlePlaced?.();
	}, [isPositioned, handlePlaced]);
	const arrowX = middlewareData.arrow?.x;
	const arrowY = middlewareData.arrow?.y;
	const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
	const [contentZIndex, setContentZIndex] = React$1.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ jsx("div", {
		ref: refs.setFloating,
		"data-radix-popper-content-wrapper": "",
		style: {
			...floatingStyles,
			transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: contentZIndex,
			["--radix-popper-transform-origin"]: [middlewareData.transformOrigin?.x, middlewareData.transformOrigin?.y].join(" "),
			...middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				pointerEvents: "none"
			}
		},
		dir: props.dir,
		children: /* @__PURE__ */ jsx(PopperContentProvider, {
			scope: __scopePopper,
			placedSide,
			onArrowChange: setArrow,
			arrowX,
			arrowY,
			shouldHideArrow: cannotCenterArrow,
			children: /* @__PURE__ */ jsx(Primitive.div, {
				"data-side": placedSide,
				"data-align": placedAlign,
				...contentProps,
				ref: composedRefs,
				style: {
					...contentProps.style,
					animation: !isPositioned ? "none" : void 0
				}
			})
		})
	});
});
PopperContent.displayName = CONTENT_NAME$4;
var ARROW_NAME$4 = "PopperArrow";
var OPPOSITE_SIDE = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
};
var PopperArrow = React$1.forwardRef(function PopperArrow2(props, forwardedRef) {
	const { __scopePopper, ...arrowProps } = props;
	const contentContext = useContentContext(ARROW_NAME$4, __scopePopper);
	const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
	return /* @__PURE__ */ jsx("span", {
		ref: contentContext.onArrowChange,
		style: {
			position: "absolute",
			left: contentContext.arrowX,
			top: contentContext.arrowY,
			[baseSide]: 0,
			transformOrigin: {
				top: "",
				right: "0 0",
				bottom: "center 0",
				left: "100% 0"
			}[contentContext.placedSide],
			transform: {
				top: "translateY(100%)",
				right: "translateY(50%) rotate(90deg) translateX(-50%)",
				bottom: `rotate(180deg)`,
				left: "translateY(50%) rotate(-90deg) translateX(50%)"
			}[contentContext.placedSide],
			visibility: contentContext.shouldHideArrow ? "hidden" : void 0
		},
		children: /* @__PURE__ */ jsx(Root$2, {
			...arrowProps,
			ref: forwardedRef,
			style: {
				...arrowProps.style,
				display: "block"
			}
		})
	});
});
PopperArrow.displayName = ARROW_NAME$4;
function isNotNull(value) {
	return value !== null;
}
var transformOrigin = (options) => ({
	name: "transformOrigin",
	options,
	fn(data) {
		const { placement, rects, middlewareData } = data;
		const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
		const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
		const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
		const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
		const noArrowAlign = {
			start: "0%",
			center: "50%",
			end: "100%"
		}[placedAlign];
		const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
		const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
		let x = "";
		let y = "";
		if (placedSide === "bottom") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${-arrowHeight}px`;
		} else if (placedSide === "top") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${rects.floating.height + arrowHeight}px`;
		} else if (placedSide === "right") {
			x = `${-arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		} else if (placedSide === "left") {
			x = `${rects.floating.width + arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		}
		return { data: {
			x,
			y
		} };
	}
});
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
var Root2$3 = Popper;
var Anchor = PopperAnchor;
var Content = PopperContent;
var Arrow = PopperArrow;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-roving-focus@1.1.11_@types+react-dom@19.2.3_@types+react@19.2.14__@type_9d0b8dcb46d97f81693e9755c8aa9b77/node_modules/@radix-ui/react-roving-focus/dist/index.mjs
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
var GROUP_NAME$3 = "RovingFocusGroup";
var [Collection$2, useCollection$2, createCollectionScope$2] = createCollection(GROUP_NAME$3);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(GROUP_NAME$3, [createCollectionScope$2]);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME$3);
var RovingFocusGroup = React$1.forwardRef((props, forwardedRef) => {
	return /* @__PURE__ */ jsx(Collection$2.Provider, {
		scope: props.__scopeRovingFocusGroup,
		children: /* @__PURE__ */ jsx(Collection$2.Slot, {
			scope: props.__scopeRovingFocusGroup,
			children: /* @__PURE__ */ jsx(RovingFocusGroupImpl, {
				...props,
				ref: forwardedRef
			})
		})
	});
});
RovingFocusGroup.displayName = GROUP_NAME$3;
var RovingFocusGroupImpl = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeRovingFocusGroup, orientation, loop = false, dir, currentTabStopId: currentTabStopIdProp, defaultCurrentTabStopId, onCurrentTabStopIdChange, onEntryFocus, preventScrollOnEntryFocus = false, ...groupProps } = props;
	const ref = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const direction = useDirection(dir);
	const [currentTabStopId, setCurrentTabStopId] = useControllableState({
		prop: currentTabStopIdProp,
		defaultProp: defaultCurrentTabStopId ?? null,
		onChange: onCurrentTabStopIdChange,
		caller: GROUP_NAME$3
	});
	const [isTabbingBackOut, setIsTabbingBackOut] = React$1.useState(false);
	const handleEntryFocus = useCallbackRef$1(onEntryFocus);
	const getItems = useCollection$2(__scopeRovingFocusGroup);
	const isClickFocusRef = React$1.useRef(false);
	const [focusableItemsCount, setFocusableItemsCount] = React$1.useState(0);
	React$1.useEffect(() => {
		const node = ref.current;
		if (node) {
			node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
			return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
		}
	}, [handleEntryFocus]);
	return /* @__PURE__ */ jsx(RovingFocusProvider, {
		scope: __scopeRovingFocusGroup,
		orientation,
		dir: direction,
		loop,
		currentTabStopId,
		onItemFocus: React$1.useCallback((tabStopId) => setCurrentTabStopId(tabStopId), [setCurrentTabStopId]),
		onItemShiftTab: React$1.useCallback(() => setIsTabbingBackOut(true), []),
		onFocusableItemAdd: React$1.useCallback(() => setFocusableItemsCount((prevCount) => prevCount + 1), []),
		onFocusableItemRemove: React$1.useCallback(() => setFocusableItemsCount((prevCount) => prevCount - 1), []),
		children: /* @__PURE__ */ jsx(Primitive.div, {
			tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
			"data-orientation": orientation,
			...groupProps,
			ref: composedRefs,
			style: {
				outline: "none",
				...props.style
			},
			onMouseDown: composeEventHandlers(props.onMouseDown, () => {
				isClickFocusRef.current = true;
			}),
			onFocus: composeEventHandlers(props.onFocus, (event) => {
				const isKeyboardFocus = !isClickFocusRef.current;
				if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
					const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
					event.currentTarget.dispatchEvent(entryFocusEvent);
					if (!entryFocusEvent.defaultPrevented) {
						const items = getItems().filter((item) => item.focusable);
						focusFirst$1([
							items.find((item) => item.active),
							items.find((item) => item.id === currentTabStopId),
							...items
						].filter(Boolean).map((item) => item.ref.current), preventScrollOnEntryFocus);
					}
				}
				isClickFocusRef.current = false;
			}),
			onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
		})
	});
});
var ITEM_NAME$3 = "RovingFocusGroupItem";
var RovingFocusGroupItem = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, children, ...itemProps } = props;
	const autoId = useId$1();
	const id = tabStopId || autoId;
	const context = useRovingFocusContext(ITEM_NAME$3, __scopeRovingFocusGroup);
	const isCurrentTabStop = context.currentTabStopId === id;
	const getItems = useCollection$2(__scopeRovingFocusGroup);
	const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
	React$1.useEffect(() => {
		if (focusable) {
			onFocusableItemAdd();
			return () => onFocusableItemRemove();
		}
	}, [
		focusable,
		onFocusableItemAdd,
		onFocusableItemRemove
	]);
	return /* @__PURE__ */ jsx(Collection$2.ItemSlot, {
		scope: __scopeRovingFocusGroup,
		id,
		focusable,
		active,
		children: /* @__PURE__ */ jsx(Primitive.span, {
			tabIndex: isCurrentTabStop ? 0 : -1,
			"data-orientation": context.orientation,
			...itemProps,
			ref: forwardedRef,
			onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
				if (!focusable) event.preventDefault();
				else context.onItemFocus(id);
			}),
			onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (event.key === "Tab" && event.shiftKey) {
					context.onItemShiftTab();
					return;
				}
				if (event.target !== event.currentTarget) return;
				const focusIntent = getFocusIntent(event, context.orientation, context.dir);
				if (focusIntent !== void 0) {
					if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
					event.preventDefault();
					let candidateNodes = getItems().filter((item) => item.focusable).map((item) => item.ref.current);
					if (focusIntent === "last") candidateNodes.reverse();
					else if (focusIntent === "prev" || focusIntent === "next") {
						if (focusIntent === "prev") candidateNodes.reverse();
						const currentIndex = candidateNodes.indexOf(event.currentTarget);
						candidateNodes = context.loop ? wrapArray$2(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
					}
					setTimeout(() => focusFirst$1(candidateNodes));
				}
			}),
			children: typeof children === "function" ? children({
				isCurrentTabStop,
				hasTabStop: currentTabStopId != null
			}) : children
		})
	});
});
RovingFocusGroupItem.displayName = ITEM_NAME$3;
var MAP_KEY_TO_FOCUS_INTENT = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function getDirectionAwareKey(key, dir) {
	if (dir !== "rtl") return key;
	return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
	const key = getDirectionAwareKey(event.key, dir);
	if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
	if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
	return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst$1(candidates, preventScroll = false) {
	const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus({ preventScroll });
		if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
function wrapArray$2(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root$1 = RovingFocusGroup;
var Item$1 = RovingFocusGroupItem;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_67f50c1aa5d60701126d27c0502fb287/node_modules/@radix-ui/react-menu/dist/index.mjs
var SELECTION_KEYS$1 = ["Enter", " "];
var FIRST_KEYS = [
	"ArrowDown",
	"PageUp",
	"Home"
];
var LAST_KEYS = [
	"ArrowUp",
	"PageDown",
	"End"
];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var SUB_OPEN_KEYS = {
	ltr: [...SELECTION_KEYS$1, "ArrowRight"],
	rtl: [...SELECTION_KEYS$1, "ArrowLeft"]
};
var SUB_CLOSE_KEYS = {
	ltr: ["ArrowLeft"],
	rtl: ["ArrowRight"]
};
var MENU_NAME = "Menu";
var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(MENU_NAME);
var [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
	createCollectionScope$1,
	createPopperScope,
	createRovingFocusGroupScope
]);
var usePopperScope$2 = createPopperScope();
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
var Menu = (props) => {
	const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
	const popperScope = usePopperScope$2(__scopeMenu);
	const [content, setContent] = React$1.useState(null);
	const isUsingKeyboardRef = React$1.useRef(false);
	const handleOpenChange = useCallbackRef$1(onOpenChange);
	const direction = useDirection(dir);
	React$1.useEffect(() => {
		const handleKeyDown = () => {
			isUsingKeyboardRef.current = true;
			document.addEventListener("pointerdown", handlePointer, {
				capture: true,
				once: true
			});
			document.addEventListener("pointermove", handlePointer, {
				capture: true,
				once: true
			});
		};
		const handlePointer = () => isUsingKeyboardRef.current = false;
		document.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => {
			document.removeEventListener("keydown", handleKeyDown, { capture: true });
			document.removeEventListener("pointerdown", handlePointer, { capture: true });
			document.removeEventListener("pointermove", handlePointer, { capture: true });
		};
	}, []);
	return /* @__PURE__ */ jsx(Root2$3, {
		...popperScope,
		children: /* @__PURE__ */ jsx(MenuProvider, {
			scope: __scopeMenu,
			open,
			onOpenChange: handleOpenChange,
			content,
			onContentChange: setContent,
			children: /* @__PURE__ */ jsx(MenuRootProvider, {
				scope: __scopeMenu,
				onClose: React$1.useCallback(() => handleOpenChange(false), [handleOpenChange]),
				isUsingKeyboardRef,
				dir: direction,
				modal,
				children
			})
		})
	});
};
Menu.displayName = MENU_NAME;
var ANCHOR_NAME$1 = "MenuAnchor";
var MenuAnchor = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...anchorProps } = props;
	return /* @__PURE__ */ jsx(Anchor, {
		...usePopperScope$2(__scopeMenu),
		...anchorProps,
		ref: forwardedRef
	});
});
MenuAnchor.displayName = ANCHOR_NAME$1;
var PORTAL_NAME$3 = "MenuPortal";
var [PortalProvider$1, usePortalContext$1] = createMenuContext(PORTAL_NAME$3, { forceMount: void 0 });
var MenuPortal = (props) => {
	const { __scopeMenu, forceMount, children, container } = props;
	const context = useMenuContext(PORTAL_NAME$3, __scopeMenu);
	return /* @__PURE__ */ jsx(PortalProvider$1, {
		scope: __scopeMenu,
		forceMount,
		children: /* @__PURE__ */ jsx(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ jsx(Portal$4, {
				asChild: true,
				container,
				children
			})
		})
	});
};
MenuPortal.displayName = PORTAL_NAME$3;
var CONTENT_NAME$3 = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME$3);
var MenuContent = React$1.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext$1(CONTENT_NAME$3, props.__scopeMenu);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useMenuContext(CONTENT_NAME$3, props.__scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$3, props.__scopeMenu);
	return /* @__PURE__ */ jsx(Collection$1.Provider, {
		scope: props.__scopeMenu,
		children: /* @__PURE__ */ jsx(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ jsx(Collection$1.Slot, {
				scope: props.__scopeMenu,
				children: rootContext.modal ? /* @__PURE__ */ jsx(MenuRootContentModal, {
					...contentProps,
					ref: forwardedRef
				}) : /* @__PURE__ */ jsx(MenuRootContentNonModal, {
					...contentProps,
					ref: forwardedRef
				})
			})
		})
	});
});
var MenuRootContentModal = React$1.forwardRef((props, forwardedRef) => {
	const context = useMenuContext(CONTENT_NAME$3, props.__scopeMenu);
	const ref = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	React$1.useEffect(() => {
		const content = ref.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ jsx(MenuContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: context.open,
		disableOutsideScroll: true,
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault(), { checkForDefaultPrevented: false }),
		onDismiss: () => context.onOpenChange(false)
	});
});
var MenuRootContentNonModal = React$1.forwardRef((props, forwardedRef) => {
	const context = useMenuContext(CONTENT_NAME$3, props.__scopeMenu);
	return /* @__PURE__ */ jsx(MenuContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		disableOutsideScroll: false,
		onDismiss: () => context.onOpenChange(false)
	});
});
var Slot$2 = /* @__PURE__ */ createSlot("MenuContent.ScrollLock");
var MenuContentImpl = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, loop = false, trapFocus, onOpenAutoFocus, onCloseAutoFocus, disableOutsidePointerEvents, onEntryFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, disableOutsideScroll, ...contentProps } = props;
	const context = useMenuContext(CONTENT_NAME$3, __scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$3, __scopeMenu);
	const popperScope = usePopperScope$2(__scopeMenu);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
	const getItems = useCollection$1(__scopeMenu);
	const [currentItemId, setCurrentItemId] = React$1.useState(null);
	const contentRef = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
	const timerRef = React$1.useRef(0);
	const searchRef = React$1.useRef("");
	const pointerGraceTimerRef = React$1.useRef(0);
	const pointerGraceIntentRef = React$1.useRef(null);
	const pointerDirRef = React$1.useRef("right");
	const lastPointerXRef = React$1.useRef(0);
	const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : React$1.Fragment;
	const scrollLockWrapperProps = disableOutsideScroll ? {
		as: Slot$2,
		allowPinchZoom: true
	} : void 0;
	const handleTypeaheadSearch = (key) => {
		const search = searchRef.current + key;
		const items = getItems().filter((item) => !item.disabled);
		const currentItem = document.activeElement;
		const currentMatch = items.find((item) => item.ref.current === currentItem)?.textValue;
		const nextMatch = getNextMatch(items.map((item) => item.textValue), search, currentMatch);
		const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current;
		(function updateSearch(value) {
			searchRef.current = value;
			window.clearTimeout(timerRef.current);
			if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
		})(search);
		if (newItem) setTimeout(() => newItem.focus());
	};
	React$1.useEffect(() => {
		return () => window.clearTimeout(timerRef.current);
	}, []);
	useFocusGuards();
	const isPointerMovingToSubmenu = React$1.useCallback((event) => {
		return pointerDirRef.current === pointerGraceIntentRef.current?.side && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
	}, []);
	return /* @__PURE__ */ jsx(MenuContentProvider, {
		scope: __scopeMenu,
		searchRef,
		onItemEnter: React$1.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) event.preventDefault();
		}, [isPointerMovingToSubmenu]),
		onItemLeave: React$1.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) return;
			contentRef.current?.focus();
			setCurrentItemId(null);
		}, [isPointerMovingToSubmenu]),
		onTriggerLeave: React$1.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) event.preventDefault();
		}, [isPointerMovingToSubmenu]),
		pointerGraceTimerRef,
		onPointerGraceIntentChange: React$1.useCallback((intent) => {
			pointerGraceIntentRef.current = intent;
		}, []),
		children: /* @__PURE__ */ jsx(ScrollLockWrapper, {
			...scrollLockWrapperProps,
			children: /* @__PURE__ */ jsx(FocusScope, {
				asChild: true,
				trapped: trapFocus,
				onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
					event.preventDefault();
					contentRef.current?.focus({ preventScroll: true });
				}),
				onUnmountAutoFocus: onCloseAutoFocus,
				children: /* @__PURE__ */ jsx(DismissableLayer, {
					asChild: true,
					disableOutsidePointerEvents,
					onEscapeKeyDown,
					onPointerDownOutside,
					onFocusOutside,
					onInteractOutside,
					onDismiss,
					children: /* @__PURE__ */ jsx(Root$1, {
						asChild: true,
						...rovingFocusGroupScope,
						dir: rootContext.dir,
						orientation: "vertical",
						loop,
						currentTabStopId: currentItemId,
						onCurrentTabStopIdChange: setCurrentItemId,
						onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
							if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
						}),
						preventScrollOnEntryFocus: true,
						children: /* @__PURE__ */ jsx(Content, {
							role: "menu",
							"aria-orientation": "vertical",
							"data-state": getOpenState(context.open),
							"data-radix-menu-content": "",
							dir: rootContext.dir,
							...popperScope,
							...contentProps,
							ref: composedRefs,
							style: {
								outline: "none",
								...contentProps.style
							},
							onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
								const isKeyDownInside = event.target.closest("[data-radix-menu-content]") === event.currentTarget;
								const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
								const isCharacterKey = event.key.length === 1;
								if (isKeyDownInside) {
									if (event.key === "Tab") event.preventDefault();
									if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
								}
								const content = contentRef.current;
								if (event.target !== content) return;
								if (!FIRST_LAST_KEYS.includes(event.key)) return;
								event.preventDefault();
								const candidateNodes = getItems().filter((item) => !item.disabled).map((item) => item.ref.current);
								if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
								focusFirst(candidateNodes);
							}),
							onBlur: composeEventHandlers(props.onBlur, (event) => {
								if (!event.currentTarget.contains(event.target)) {
									window.clearTimeout(timerRef.current);
									searchRef.current = "";
								}
							}),
							onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
								const target = event.target;
								const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
								if (event.currentTarget.contains(target) && pointerXHasChanged) {
									pointerDirRef.current = event.clientX > lastPointerXRef.current ? "right" : "left";
									lastPointerXRef.current = event.clientX;
								}
							}))
						})
					})
				})
			})
		})
	});
});
MenuContent.displayName = CONTENT_NAME$3;
var GROUP_NAME$2 = "MenuGroup";
var MenuGroup = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...groupProps } = props;
	return /* @__PURE__ */ jsx(Primitive.div, {
		role: "group",
		...groupProps,
		ref: forwardedRef
	});
});
MenuGroup.displayName = GROUP_NAME$2;
var LABEL_NAME$2 = "MenuLabel";
var MenuLabel = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...labelProps } = props;
	return /* @__PURE__ */ jsx(Primitive.div, {
		...labelProps,
		ref: forwardedRef
	});
});
MenuLabel.displayName = LABEL_NAME$2;
var ITEM_NAME$2 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = React$1.forwardRef((props, forwardedRef) => {
	const { disabled = false, onSelect, ...itemProps } = props;
	const ref = React$1.useRef(null);
	const rootContext = useMenuRootContext(ITEM_NAME$2, props.__scopeMenu);
	const contentContext = useMenuContentContext(ITEM_NAME$2, props.__scopeMenu);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const isPointerDownRef = React$1.useRef(false);
	const handleSelect = () => {
		const menuItem = ref.current;
		if (!disabled && menuItem) {
			const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
				bubbles: true,
				cancelable: true
			});
			menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true });
			dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
			if (itemSelectEvent.defaultPrevented) isPointerDownRef.current = false;
			else rootContext.onClose();
		}
	};
	return /* @__PURE__ */ jsx(MenuItemImpl, {
		...itemProps,
		ref: composedRefs,
		disabled,
		onClick: composeEventHandlers(props.onClick, handleSelect),
		onPointerDown: (event) => {
			props.onPointerDown?.(event);
			isPointerDownRef.current = true;
		},
		onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
			if (!isPointerDownRef.current) event.currentTarget?.click();
		}),
		onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
			const isTypingAhead = contentContext.searchRef.current !== "";
			if (disabled || isTypingAhead && event.key === " ") return;
			if (SELECTION_KEYS$1.includes(event.key)) {
				event.currentTarget.click();
				event.preventDefault();
			}
		})
	});
});
MenuItem.displayName = ITEM_NAME$2;
var MenuItemImpl = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
	const contentContext = useMenuContentContext(ITEM_NAME$2, __scopeMenu);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
	const ref = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const [isFocused, setIsFocused] = React$1.useState(false);
	const [textContent, setTextContent] = React$1.useState("");
	React$1.useEffect(() => {
		const menuItem = ref.current;
		if (menuItem) setTextContent((menuItem.textContent ?? "").trim());
	}, [itemProps.children]);
	return /* @__PURE__ */ jsx(Collection$1.ItemSlot, {
		scope: __scopeMenu,
		disabled,
		textValue: textValue ?? textContent,
		children: /* @__PURE__ */ jsx(Item$1, {
			asChild: true,
			...rovingFocusGroupScope,
			focusable: !disabled,
			children: /* @__PURE__ */ jsx(Primitive.div, {
				role: "menuitem",
				"data-highlighted": isFocused ? "" : void 0,
				"aria-disabled": disabled || void 0,
				"data-disabled": disabled ? "" : void 0,
				...itemProps,
				ref: composedRefs,
				onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
					if (disabled) contentContext.onItemLeave(event);
					else {
						contentContext.onItemEnter(event);
						if (!event.defaultPrevented) event.currentTarget.focus({ preventScroll: true });
					}
				})),
				onPointerLeave: composeEventHandlers(props.onPointerLeave, whenMouse((event) => contentContext.onItemLeave(event))),
				onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
				onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
			})
		})
	});
});
var CHECKBOX_ITEM_NAME$1 = "MenuCheckboxItem";
var MenuCheckboxItem = React$1.forwardRef((props, forwardedRef) => {
	const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
	return /* @__PURE__ */ jsx(ItemIndicatorProvider, {
		scope: props.__scopeMenu,
		checked,
		children: /* @__PURE__ */ jsx(MenuItem, {
			role: "menuitemcheckbox",
			"aria-checked": isIndeterminate(checked) ? "mixed" : checked,
			...checkboxItemProps,
			ref: forwardedRef,
			"data-state": getCheckedState(checked),
			onSelect: composeEventHandlers(checkboxItemProps.onSelect, () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked), { checkForDefaultPrevented: false })
		})
	});
});
MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME$1;
var RADIO_GROUP_NAME$1 = "MenuRadioGroup";
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(RADIO_GROUP_NAME$1, {
	value: void 0,
	onValueChange: () => {}
});
var MenuRadioGroup = React$1.forwardRef((props, forwardedRef) => {
	const { value, onValueChange, ...groupProps } = props;
	const handleValueChange = useCallbackRef$1(onValueChange);
	return /* @__PURE__ */ jsx(RadioGroupProvider, {
		scope: props.__scopeMenu,
		value,
		onValueChange: handleValueChange,
		children: /* @__PURE__ */ jsx(MenuGroup, {
			...groupProps,
			ref: forwardedRef
		})
	});
});
MenuRadioGroup.displayName = RADIO_GROUP_NAME$1;
var RADIO_ITEM_NAME$1 = "MenuRadioItem";
var MenuRadioItem = React$1.forwardRef((props, forwardedRef) => {
	const { value, ...radioItemProps } = props;
	const context = useRadioGroupContext(RADIO_ITEM_NAME$1, props.__scopeMenu);
	const checked = value === context.value;
	return /* @__PURE__ */ jsx(ItemIndicatorProvider, {
		scope: props.__scopeMenu,
		checked,
		children: /* @__PURE__ */ jsx(MenuItem, {
			role: "menuitemradio",
			"aria-checked": checked,
			...radioItemProps,
			ref: forwardedRef,
			"data-state": getCheckedState(checked),
			onSelect: composeEventHandlers(radioItemProps.onSelect, () => context.onValueChange?.(value), { checkForDefaultPrevented: false })
		})
	});
});
MenuRadioItem.displayName = RADIO_ITEM_NAME$1;
var ITEM_INDICATOR_NAME$1 = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(ITEM_INDICATOR_NAME$1, { checked: false });
var MenuItemIndicator = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
	const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME$1, __scopeMenu);
	return /* @__PURE__ */ jsx(Presence, {
		present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
		children: /* @__PURE__ */ jsx(Primitive.span, {
			...itemIndicatorProps,
			ref: forwardedRef,
			"data-state": getCheckedState(indicatorContext.checked)
		})
	});
});
MenuItemIndicator.displayName = ITEM_INDICATOR_NAME$1;
var SEPARATOR_NAME$2 = "MenuSeparator";
var MenuSeparator = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...separatorProps } = props;
	return /* @__PURE__ */ jsx(Primitive.div, {
		role: "separator",
		"aria-orientation": "horizontal",
		...separatorProps,
		ref: forwardedRef
	});
});
MenuSeparator.displayName = SEPARATOR_NAME$2;
var ARROW_NAME$3 = "MenuArrow";
var MenuArrow = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...arrowProps } = props;
	return /* @__PURE__ */ jsx(Arrow, {
		...usePopperScope$2(__scopeMenu),
		...arrowProps,
		ref: forwardedRef
	});
});
MenuArrow.displayName = ARROW_NAME$3;
var SUB_NAME = "MenuSub";
var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
var MenuSub = (props) => {
	const { __scopeMenu, children, open = false, onOpenChange } = props;
	const parentMenuContext = useMenuContext(SUB_NAME, __scopeMenu);
	const popperScope = usePopperScope$2(__scopeMenu);
	const [trigger, setTrigger] = React$1.useState(null);
	const [content, setContent] = React$1.useState(null);
	const handleOpenChange = useCallbackRef$1(onOpenChange);
	React$1.useEffect(() => {
		if (parentMenuContext.open === false) handleOpenChange(false);
		return () => handleOpenChange(false);
	}, [parentMenuContext.open, handleOpenChange]);
	return /* @__PURE__ */ jsx(Root2$3, {
		...popperScope,
		children: /* @__PURE__ */ jsx(MenuProvider, {
			scope: __scopeMenu,
			open,
			onOpenChange: handleOpenChange,
			content,
			onContentChange: setContent,
			children: /* @__PURE__ */ jsx(MenuSubProvider, {
				scope: __scopeMenu,
				contentId: useId$1(),
				triggerId: useId$1(),
				trigger,
				onTriggerChange: setTrigger,
				children
			})
		})
	});
};
MenuSub.displayName = SUB_NAME;
var SUB_TRIGGER_NAME$1 = "MenuSubTrigger";
var MenuSubTrigger = React$1.forwardRef((props, forwardedRef) => {
	const context = useMenuContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
	const rootContext = useMenuRootContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
	const subContext = useMenuSubContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
	const contentContext = useMenuContentContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
	const openTimerRef = React$1.useRef(null);
	const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
	const scope = { __scopeMenu: props.__scopeMenu };
	const clearOpenTimer = React$1.useCallback(() => {
		if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
		openTimerRef.current = null;
	}, []);
	React$1.useEffect(() => clearOpenTimer, [clearOpenTimer]);
	React$1.useEffect(() => {
		const pointerGraceTimer = pointerGraceTimerRef.current;
		return () => {
			window.clearTimeout(pointerGraceTimer);
			onPointerGraceIntentChange(null);
		};
	}, [pointerGraceTimerRef, onPointerGraceIntentChange]);
	return /* @__PURE__ */ jsx(MenuAnchor, {
		asChild: true,
		...scope,
		children: /* @__PURE__ */ jsx(MenuItemImpl, {
			id: subContext.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": context.open,
			"aria-controls": subContext.contentId,
			"data-state": getOpenState(context.open),
			...props,
			ref: composeRefs(forwardedRef, subContext.onTriggerChange),
			onClick: (event) => {
				props.onClick?.(event);
				if (props.disabled || event.defaultPrevented) return;
				event.currentTarget.focus();
				if (!context.open) context.onOpenChange(true);
			},
			onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
				contentContext.onItemEnter(event);
				if (event.defaultPrevented) return;
				if (!props.disabled && !context.open && !openTimerRef.current) {
					contentContext.onPointerGraceIntentChange(null);
					openTimerRef.current = window.setTimeout(() => {
						context.onOpenChange(true);
						clearOpenTimer();
					}, 100);
				}
			})),
			onPointerLeave: composeEventHandlers(props.onPointerLeave, whenMouse((event) => {
				clearOpenTimer();
				const contentRect = context.content?.getBoundingClientRect();
				if (contentRect) {
					const side = context.content?.dataset.side;
					const rightSide = side === "right";
					const bleed = rightSide ? -5 : 5;
					const contentNearEdge = contentRect[rightSide ? "left" : "right"];
					const contentFarEdge = contentRect[rightSide ? "right" : "left"];
					contentContext.onPointerGraceIntentChange({
						area: [
							{
								x: event.clientX + bleed,
								y: event.clientY
							},
							{
								x: contentNearEdge,
								y: contentRect.top
							},
							{
								x: contentFarEdge,
								y: contentRect.top
							},
							{
								x: contentFarEdge,
								y: contentRect.bottom
							},
							{
								x: contentNearEdge,
								y: contentRect.bottom
							}
						],
						side
					});
					window.clearTimeout(pointerGraceTimerRef.current);
					pointerGraceTimerRef.current = window.setTimeout(() => contentContext.onPointerGraceIntentChange(null), 300);
				} else {
					contentContext.onTriggerLeave(event);
					if (event.defaultPrevented) return;
					contentContext.onPointerGraceIntentChange(null);
				}
			})),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				const isTypingAhead = contentContext.searchRef.current !== "";
				if (props.disabled || isTypingAhead && event.key === " ") return;
				if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
					context.onOpenChange(true);
					context.content?.focus();
					event.preventDefault();
				}
			})
		})
	});
});
MenuSubTrigger.displayName = SUB_TRIGGER_NAME$1;
var SUB_CONTENT_NAME$1 = "MenuSubContent";
var MenuSubContent = React$1.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext$1(CONTENT_NAME$3, props.__scopeMenu);
	const { forceMount = portalContext.forceMount, ...subContentProps } = props;
	const context = useMenuContext(CONTENT_NAME$3, props.__scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$3, props.__scopeMenu);
	const subContext = useMenuSubContext(SUB_CONTENT_NAME$1, props.__scopeMenu);
	const ref = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	return /* @__PURE__ */ jsx(Collection$1.Provider, {
		scope: props.__scopeMenu,
		children: /* @__PURE__ */ jsx(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ jsx(Collection$1.Slot, {
				scope: props.__scopeMenu,
				children: /* @__PURE__ */ jsx(MenuContentImpl, {
					id: subContext.contentId,
					"aria-labelledby": subContext.triggerId,
					...subContentProps,
					ref: composedRefs,
					align: "start",
					side: rootContext.dir === "rtl" ? "left" : "right",
					disableOutsidePointerEvents: false,
					disableOutsideScroll: false,
					trapFocus: false,
					onOpenAutoFocus: (event) => {
						if (rootContext.isUsingKeyboardRef.current) ref.current?.focus();
						event.preventDefault();
					},
					onCloseAutoFocus: (event) => event.preventDefault(),
					onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
						if (event.target !== subContext.trigger) context.onOpenChange(false);
					}),
					onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
						rootContext.onClose();
						event.preventDefault();
					}),
					onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
						const isKeyDownInside = event.currentTarget.contains(event.target);
						const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
						if (isKeyDownInside && isCloseKey) {
							context.onOpenChange(false);
							subContext.trigger?.focus();
							event.preventDefault();
						}
					})
				})
			})
		})
	});
});
MenuSubContent.displayName = SUB_CONTENT_NAME$1;
function getOpenState(open) {
	return open ? "open" : "closed";
}
function isIndeterminate(checked) {
	return checked === "indeterminate";
}
function getCheckedState(checked) {
	return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function focusFirst(candidates) {
	const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus();
		if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
function wrapArray$1(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
function getNextMatch(values, search, currentMatch) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = wrapArray$1(values, Math.max(currentMatchIndex, 0));
	if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
	const nextMatch = wrappedValues.find((value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextMatch !== currentMatch ? nextMatch : void 0;
}
function isPointInPolygon(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const ii = polygon[i];
		const jj = polygon[j];
		const xi = ii.x;
		const yi = ii.y;
		const xj = jj.x;
		const yj = jj.y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function isPointerInGraceArea(event, area) {
	if (!area) return false;
	return isPointInPolygon({
		x: event.clientX,
		y: event.clientY
	}, area);
}
function whenMouse(handler) {
	return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root3 = Menu;
var Anchor2 = MenuAnchor;
var Portal$2 = MenuPortal;
var Content2$3 = MenuContent;
var Group = MenuGroup;
var Label = MenuLabel;
var Item2$1 = MenuItem;
var CheckboxItem = MenuCheckboxItem;
var RadioGroup = MenuRadioGroup;
var RadioItem = MenuRadioItem;
var ItemIndicator$1 = MenuItemIndicator;
var Separator$2 = MenuSeparator;
var Arrow2 = MenuArrow;
var SubTrigger = MenuSubTrigger;
var SubContent = MenuSubContent;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.14__@typ_d9fe3466f9115142c8c659988aaf6f97/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs
var DROPDOWN_MENU_NAME = "DropdownMenu";
var [createDropdownMenuContext, createDropdownMenuScope] = createContextScope(DROPDOWN_MENU_NAME, [createMenuScope]);
var useMenuScope = createMenuScope();
var [DropdownMenuProvider, useDropdownMenuContext] = createDropdownMenuContext(DROPDOWN_MENU_NAME);
var DropdownMenu$1 = (props) => {
	const { __scopeDropdownMenu, children, dir, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	const triggerRef = React$1.useRef(null);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DROPDOWN_MENU_NAME
	});
	return /* @__PURE__ */ jsx(DropdownMenuProvider, {
		scope: __scopeDropdownMenu,
		triggerId: useId$1(),
		triggerRef,
		contentId: useId$1(),
		open,
		onOpenChange: setOpen,
		onOpenToggle: React$1.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		children: /* @__PURE__ */ jsx(Root3, {
			...menuScope,
			open,
			onOpenChange: setOpen,
			dir,
			modal,
			children
		})
	});
};
DropdownMenu$1.displayName = DROPDOWN_MENU_NAME;
var TRIGGER_NAME$2 = "DropdownMenuTrigger";
var DropdownMenuTrigger$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props;
	const context = useDropdownMenuContext(TRIGGER_NAME$2, __scopeDropdownMenu);
	return /* @__PURE__ */ jsx(Anchor2, {
		asChild: true,
		...useMenuScope(__scopeDropdownMenu),
		children: /* @__PURE__ */ jsx(Primitive.button, {
			type: "button",
			id: context.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": context.open,
			"aria-controls": context.open ? context.contentId : void 0,
			"data-state": context.open ? "open" : "closed",
			"data-disabled": disabled ? "" : void 0,
			disabled,
			...triggerProps,
			ref: composeRefs(forwardedRef, context.triggerRef),
			onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
				if (!disabled && event.button === 0 && event.ctrlKey === false) {
					context.onOpenToggle();
					if (!context.open) event.preventDefault();
				}
			}),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (disabled) return;
				if (["Enter", " "].includes(event.key)) context.onOpenToggle();
				if (event.key === "ArrowDown") context.onOpenChange(true);
				if ([
					"Enter",
					" ",
					"ArrowDown"
				].includes(event.key)) event.preventDefault();
			})
		})
	});
});
DropdownMenuTrigger$1.displayName = TRIGGER_NAME$2;
var PORTAL_NAME$2 = "DropdownMenuPortal";
var DropdownMenuPortal = (props) => {
	const { __scopeDropdownMenu, ...portalProps } = props;
	return /* @__PURE__ */ jsx(Portal$2, {
		...useMenuScope(__scopeDropdownMenu),
		...portalProps
	});
};
DropdownMenuPortal.displayName = PORTAL_NAME$2;
var CONTENT_NAME$2 = "DropdownMenuContent";
var DropdownMenuContent$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...contentProps } = props;
	const context = useDropdownMenuContext(CONTENT_NAME$2, __scopeDropdownMenu);
	const menuScope = useMenuScope(__scopeDropdownMenu);
	const hasInteractedOutsideRef = React$1.useRef(false);
	return /* @__PURE__ */ jsx(Content2$3, {
		id: context.contentId,
		"aria-labelledby": context.triggerId,
		...menuScope,
		...contentProps,
		ref: forwardedRef,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
			hasInteractedOutsideRef.current = false;
			event.preventDefault();
		}),
		onInteractOutside: composeEventHandlers(props.onInteractOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
			if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
		}),
		style: {
			...props.style,
			"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
			"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
			"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
});
DropdownMenuContent$1.displayName = CONTENT_NAME$2;
var GROUP_NAME$1 = "DropdownMenuGroup";
var DropdownMenuGroup = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...groupProps } = props;
	return /* @__PURE__ */ jsx(Group, {
		...useMenuScope(__scopeDropdownMenu),
		...groupProps,
		ref: forwardedRef
	});
});
DropdownMenuGroup.displayName = GROUP_NAME$1;
var LABEL_NAME$1 = "DropdownMenuLabel";
var DropdownMenuLabel$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...labelProps } = props;
	return /* @__PURE__ */ jsx(Label, {
		...useMenuScope(__scopeDropdownMenu),
		...labelProps,
		ref: forwardedRef
	});
});
DropdownMenuLabel$1.displayName = LABEL_NAME$1;
var ITEM_NAME$1 = "DropdownMenuItem";
var DropdownMenuItem$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...itemProps } = props;
	return /* @__PURE__ */ jsx(Item2$1, {
		...useMenuScope(__scopeDropdownMenu),
		...itemProps,
		ref: forwardedRef
	});
});
DropdownMenuItem$1.displayName = ITEM_NAME$1;
var CHECKBOX_ITEM_NAME = "DropdownMenuCheckboxItem";
var DropdownMenuCheckboxItem$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...checkboxItemProps } = props;
	return /* @__PURE__ */ jsx(CheckboxItem, {
		...useMenuScope(__scopeDropdownMenu),
		...checkboxItemProps,
		ref: forwardedRef
	});
});
DropdownMenuCheckboxItem$1.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "DropdownMenuRadioGroup";
var DropdownMenuRadioGroup = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...radioGroupProps } = props;
	return /* @__PURE__ */ jsx(RadioGroup, {
		...useMenuScope(__scopeDropdownMenu),
		...radioGroupProps,
		ref: forwardedRef
	});
});
DropdownMenuRadioGroup.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "DropdownMenuRadioItem";
var DropdownMenuRadioItem = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...radioItemProps } = props;
	return /* @__PURE__ */ jsx(RadioItem, {
		...useMenuScope(__scopeDropdownMenu),
		...radioItemProps,
		ref: forwardedRef
	});
});
DropdownMenuRadioItem.displayName = RADIO_ITEM_NAME;
var INDICATOR_NAME = "DropdownMenuItemIndicator";
var DropdownMenuItemIndicator = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...itemIndicatorProps } = props;
	return /* @__PURE__ */ jsx(ItemIndicator$1, {
		...useMenuScope(__scopeDropdownMenu),
		...itemIndicatorProps,
		ref: forwardedRef
	});
});
DropdownMenuItemIndicator.displayName = INDICATOR_NAME;
var SEPARATOR_NAME$1 = "DropdownMenuSeparator";
var DropdownMenuSeparator$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...separatorProps } = props;
	return /* @__PURE__ */ jsx(Separator$2, {
		...useMenuScope(__scopeDropdownMenu),
		...separatorProps,
		ref: forwardedRef
	});
});
DropdownMenuSeparator$1.displayName = SEPARATOR_NAME$1;
var ARROW_NAME$2 = "DropdownMenuArrow";
var DropdownMenuArrow = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...arrowProps } = props;
	return /* @__PURE__ */ jsx(Arrow2, {
		...useMenuScope(__scopeDropdownMenu),
		...arrowProps,
		ref: forwardedRef
	});
});
DropdownMenuArrow.displayName = ARROW_NAME$2;
var SUB_TRIGGER_NAME = "DropdownMenuSubTrigger";
var DropdownMenuSubTrigger = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...subTriggerProps } = props;
	return /* @__PURE__ */ jsx(SubTrigger, {
		...useMenuScope(__scopeDropdownMenu),
		...subTriggerProps,
		ref: forwardedRef
	});
});
DropdownMenuSubTrigger.displayName = SUB_TRIGGER_NAME;
var SUB_CONTENT_NAME = "DropdownMenuSubContent";
var DropdownMenuSubContent = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...subContentProps } = props;
	return /* @__PURE__ */ jsx(SubContent, {
		...useMenuScope(__scopeDropdownMenu),
		...subContentProps,
		ref: forwardedRef,
		style: {
			...props.style,
			"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
			"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
			"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
});
DropdownMenuSubContent.displayName = SUB_CONTENT_NAME;
var Root2$2 = DropdownMenu$1;
var Trigger$2 = DropdownMenuTrigger$1;
var Portal2 = DropdownMenuPortal;
var Content2$2 = DropdownMenuContent$1;
var Label2 = DropdownMenuLabel$1;
var Item2 = DropdownMenuItem$1;
var CheckboxItem2 = DropdownMenuCheckboxItem$1;
var ItemIndicator2 = DropdownMenuItemIndicator;
var Separator2 = DropdownMenuSeparator$1;
//#endregion
//#region node_modules/.pnpm/@radix-ui+number@1.1.1/node_modules/@radix-ui/number/dist/index.mjs
function clamp(value, [min, max]) {
	return Math.min(max, Math.max(min, value));
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-popover@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_f1d1a58244a80c62b16bd608f9d928e5/node_modules/@radix-ui/react-popover/dist/index.mjs
var POPOVER_NAME = "Popover";
var [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [createPopperScope]);
var usePopperScope$1 = createPopperScope();
var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
var Popover$1 = (props) => {
	const { __scopePopover, children, open: openProp, defaultOpen, onOpenChange, modal = false } = props;
	const popperScope = usePopperScope$1(__scopePopover);
	const triggerRef = React$1.useRef(null);
	const [hasCustomAnchor, setHasCustomAnchor] = React$1.useState(false);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: POPOVER_NAME
	});
	return /* @__PURE__ */ jsx(Root2$3, {
		...popperScope,
		children: /* @__PURE__ */ jsx(PopoverProvider, {
			scope: __scopePopover,
			contentId: useId$1(),
			triggerRef,
			open,
			onOpenChange: setOpen,
			onOpenToggle: React$1.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
			hasCustomAnchor,
			onCustomAnchorAdd: React$1.useCallback(() => setHasCustomAnchor(true), []),
			onCustomAnchorRemove: React$1.useCallback(() => setHasCustomAnchor(false), []),
			modal,
			children
		})
	});
};
Popover$1.displayName = POPOVER_NAME;
var ANCHOR_NAME = "PopoverAnchor";
var PopoverAnchor = React$1.forwardRef((props, forwardedRef) => {
	const { __scopePopover, ...anchorProps } = props;
	const context = usePopoverContext(ANCHOR_NAME, __scopePopover);
	const popperScope = usePopperScope$1(__scopePopover);
	const { onCustomAnchorAdd, onCustomAnchorRemove } = context;
	React$1.useEffect(() => {
		onCustomAnchorAdd();
		return () => onCustomAnchorRemove();
	}, [onCustomAnchorAdd, onCustomAnchorRemove]);
	return /* @__PURE__ */ jsx(Anchor, {
		...popperScope,
		...anchorProps,
		ref: forwardedRef
	});
});
PopoverAnchor.displayName = ANCHOR_NAME;
var TRIGGER_NAME$1 = "PopoverTrigger";
var PopoverTrigger$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopePopover, ...triggerProps } = props;
	const context = usePopoverContext(TRIGGER_NAME$1, __scopePopover);
	const popperScope = usePopperScope$1(__scopePopover);
	const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
	const trigger = /* @__PURE__ */ jsx(Primitive.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": context.open,
		"aria-controls": context.contentId,
		"data-state": getState(context.open),
		...triggerProps,
		ref: composedTriggerRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
	return context.hasCustomAnchor ? trigger : /* @__PURE__ */ jsx(Anchor, {
		asChild: true,
		...popperScope,
		children: trigger
	});
});
PopoverTrigger$1.displayName = TRIGGER_NAME$1;
var PORTAL_NAME$1 = "PopoverPortal";
var [PortalProvider, usePortalContext] = createPopoverContext(PORTAL_NAME$1, { forceMount: void 0 });
var PopoverPortal = (props) => {
	const { __scopePopover, forceMount, children, container } = props;
	const context = usePopoverContext(PORTAL_NAME$1, __scopePopover);
	return /* @__PURE__ */ jsx(PortalProvider, {
		scope: __scopePopover,
		forceMount,
		children: /* @__PURE__ */ jsx(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ jsx(Portal$4, {
				asChild: true,
				container,
				children
			})
		})
	});
};
PopoverPortal.displayName = PORTAL_NAME$1;
var CONTENT_NAME$1 = "PopoverContent";
var PopoverContent$1 = React$1.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopePopover);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = usePopoverContext(CONTENT_NAME$1, props.__scopePopover);
	return /* @__PURE__ */ jsx(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ jsx(PopoverContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ jsx(PopoverContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
});
PopoverContent$1.displayName = CONTENT_NAME$1;
var Slot$1 = /* @__PURE__ */ createSlot("PopoverContent.RemoveScroll");
var PopoverContentModal = React$1.forwardRef((props, forwardedRef) => {
	const context = usePopoverContext(CONTENT_NAME$1, props.__scopePopover);
	const contentRef = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef);
	const isRightClickOutsideRef = React$1.useRef(false);
	React$1.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ jsx(ReactRemoveScroll, {
		as: Slot$1,
		allowPinchZoom: true,
		children: /* @__PURE__ */ jsx(PopoverContentImpl, {
			...props,
			ref: composedRefs,
			trapFocus: context.open,
			disableOutsidePointerEvents: true,
			onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
				event.preventDefault();
				if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
			}),
			onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
				const originalEvent = event.detail.originalEvent;
				const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
				isRightClickOutsideRef.current = originalEvent.button === 2 || ctrlLeftClick;
			}, { checkForDefaultPrevented: false }),
			onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault(), { checkForDefaultPrevented: false })
		})
	});
});
var PopoverContentNonModal = React$1.forwardRef((props, forwardedRef) => {
	const context = usePopoverContext(CONTENT_NAME$1, props.__scopePopover);
	const hasInteractedOutsideRef = React$1.useRef(false);
	const hasPointerDownOutsideRef = React$1.useRef(false);
	return /* @__PURE__ */ jsx(PopoverContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		onCloseAutoFocus: (event) => {
			props.onCloseAutoFocus?.(event);
			if (!event.defaultPrevented) {
				if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
				event.preventDefault();
			}
			hasInteractedOutsideRef.current = false;
			hasPointerDownOutsideRef.current = false;
		},
		onInteractOutside: (event) => {
			props.onInteractOutside?.(event);
			if (!event.defaultPrevented) {
				hasInteractedOutsideRef.current = true;
				if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.current = true;
			}
			const target = event.target;
			if (context.triggerRef.current?.contains(target)) event.preventDefault();
			if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) event.preventDefault();
		}
	});
});
var PopoverContentImpl = React$1.forwardRef((props, forwardedRef) => {
	const { __scopePopover, trapFocus, onOpenAutoFocus, onCloseAutoFocus, disableOutsidePointerEvents, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, ...contentProps } = props;
	const context = usePopoverContext(CONTENT_NAME$1, __scopePopover);
	const popperScope = usePopperScope$1(__scopePopover);
	useFocusGuards();
	return /* @__PURE__ */ jsx(FocusScope, {
		asChild: true,
		loop: true,
		trapped: trapFocus,
		onMountAutoFocus: onOpenAutoFocus,
		onUnmountAutoFocus: onCloseAutoFocus,
		children: /* @__PURE__ */ jsx(DismissableLayer, {
			asChild: true,
			disableOutsidePointerEvents,
			onInteractOutside,
			onEscapeKeyDown,
			onPointerDownOutside,
			onFocusOutside,
			onDismiss: () => context.onOpenChange(false),
			children: /* @__PURE__ */ jsx(Content, {
				"data-state": getState(context.open),
				role: "dialog",
				id: context.contentId,
				...popperScope,
				...contentProps,
				ref: forwardedRef,
				style: {
					...contentProps.style,
					"--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
					"--radix-popover-content-available-width": "var(--radix-popper-available-width)",
					"--radix-popover-content-available-height": "var(--radix-popper-available-height)",
					"--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
					"--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
				}
			})
		})
	});
});
var CLOSE_NAME = "PopoverClose";
var PopoverClose = React$1.forwardRef((props, forwardedRef) => {
	const { __scopePopover, ...closeProps } = props;
	const context = usePopoverContext(CLOSE_NAME, __scopePopover);
	return /* @__PURE__ */ jsx(Primitive.button, {
		type: "button",
		...closeProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
	});
});
PopoverClose.displayName = CLOSE_NAME;
var ARROW_NAME$1 = "PopoverArrow";
var PopoverArrow = React$1.forwardRef((props, forwardedRef) => {
	const { __scopePopover, ...arrowProps } = props;
	return /* @__PURE__ */ jsx(Arrow, {
		...usePopperScope$1(__scopePopover),
		...arrowProps,
		ref: forwardedRef
	});
});
PopoverArrow.displayName = ARROW_NAME$1;
function getState(open) {
	return open ? "open" : "closed";
}
var Root2$1 = Popover$1;
var Trigger$1 = PopoverTrigger$1;
var Portal$1 = PopoverPortal;
var Content2$1 = PopoverContent$1;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-select@2.2.6_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_bb2c087fbe927e1f3c46e91de68a4ad7/node_modules/@radix-ui/react-select/dist/index.mjs
var OPEN_KEYS = [
	" ",
	"Enter",
	"ArrowUp",
	"ArrowDown"
];
var SELECTION_KEYS = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection, useCollection, createCollectionScope] = createCollection(SELECT_NAME);
var [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [createCollectionScope, createPopperScope]);
var usePopperScope = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select$1 = (props) => {
	const { __scopeSelect, children, open: openProp, defaultOpen, onOpenChange, value: valueProp, defaultValue, onValueChange, dir, name, autoComplete, disabled, required, form } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const [trigger, setTrigger] = React$1.useState(null);
	const [valueNode, setValueNode] = React$1.useState(null);
	const [valueNodeHasChildren, setValueNodeHasChildren] = React$1.useState(false);
	const direction = useDirection(dir);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: SELECT_NAME
	});
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue,
		onChange: onValueChange,
		caller: SELECT_NAME
	});
	const triggerPointerDownPosRef = React$1.useRef(null);
	const isFormControl = trigger ? form || !!trigger.closest("form") : true;
	const [nativeOptionsSet, setNativeOptionsSet] = React$1.useState(/* @__PURE__ */ new Set());
	const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
	return /* @__PURE__ */ jsx(Root2$3, {
		...popperScope,
		children: /* @__PURE__ */ jsxs(SelectProvider, {
			required,
			scope: __scopeSelect,
			trigger,
			onTriggerChange: setTrigger,
			valueNode,
			onValueNodeChange: setValueNode,
			valueNodeHasChildren,
			onValueNodeHasChildrenChange: setValueNodeHasChildren,
			contentId: useId$1(),
			value,
			onValueChange: setValue,
			open,
			onOpenChange: setOpen,
			dir: direction,
			triggerPointerDownPosRef,
			disabled,
			children: [/* @__PURE__ */ jsx(Collection.Provider, {
				scope: __scopeSelect,
				children: /* @__PURE__ */ jsx(SelectNativeOptionsProvider, {
					scope: props.__scopeSelect,
					onNativeOptionAdd: React$1.useCallback((option) => {
						setNativeOptionsSet((prev) => new Set(prev).add(option));
					}, []),
					onNativeOptionRemove: React$1.useCallback((option) => {
						setNativeOptionsSet((prev) => {
							const optionsSet = new Set(prev);
							optionsSet.delete(option);
							return optionsSet;
						});
					}, []),
					children
				})
			}), isFormControl ? /* @__PURE__ */ jsxs(SelectBubbleInput, {
				"aria-hidden": true,
				required,
				tabIndex: -1,
				name,
				autoComplete,
				value,
				onChange: (event) => setValue(event.target.value),
				disabled,
				form,
				children: [value === void 0 ? /* @__PURE__ */ jsx("option", { value: "" }) : null, Array.from(nativeOptionsSet)]
			}, nativeSelectKey) : null]
		})
	});
};
Select$1.displayName = SELECT_NAME;
var TRIGGER_NAME = "SelectTrigger";
var SelectTrigger$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, disabled = false, ...triggerProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const context = useSelectContext(TRIGGER_NAME, __scopeSelect);
	const isDisabled = context.disabled || disabled;
	const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
	const getItems = useCollection(__scopeSelect);
	const pointerTypeRef = React$1.useRef("touch");
	const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
		const enabledItems = getItems().filter((item) => !item.disabled);
		const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.value === context.value));
		if (nextItem !== void 0) context.onValueChange(nextItem.value);
	});
	const handleOpen = (pointerEvent) => {
		if (!isDisabled) {
			context.onOpenChange(true);
			resetTypeahead();
		}
		if (pointerEvent) context.triggerPointerDownPosRef.current = {
			x: Math.round(pointerEvent.pageX),
			y: Math.round(pointerEvent.pageY)
		};
	};
	return /* @__PURE__ */ jsx(Anchor, {
		asChild: true,
		...popperScope,
		children: /* @__PURE__ */ jsx(Primitive.button, {
			type: "button",
			role: "combobox",
			"aria-controls": context.contentId,
			"aria-expanded": context.open,
			"aria-required": context.required,
			"aria-autocomplete": "none",
			dir: context.dir,
			"data-state": context.open ? "open" : "closed",
			disabled: isDisabled,
			"data-disabled": isDisabled ? "" : void 0,
			"data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
			...triggerProps,
			ref: composedRefs,
			onClick: composeEventHandlers(triggerProps.onClick, (event) => {
				event.currentTarget.focus();
				if (pointerTypeRef.current !== "mouse") handleOpen(event);
			}),
			onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
				pointerTypeRef.current = event.pointerType;
				const target = event.target;
				if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
				if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
					handleOpen(event);
					event.preventDefault();
				}
			}),
			onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
				const isTypingAhead = searchRef.current !== "";
				if (!(event.ctrlKey || event.altKey || event.metaKey) && event.key.length === 1) handleTypeaheadSearch(event.key);
				if (isTypingAhead && event.key === " ") return;
				if (OPEN_KEYS.includes(event.key)) {
					handleOpen();
					event.preventDefault();
				}
			})
		})
	});
});
SelectTrigger$1.displayName = TRIGGER_NAME;
var VALUE_NAME = "SelectValue";
var SelectValue$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
	const context = useSelectContext(VALUE_NAME, __scopeSelect);
	const { onValueNodeHasChildrenChange } = context;
	const hasChildren = children !== void 0;
	const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
	useLayoutEffect2(() => {
		onValueNodeHasChildrenChange(hasChildren);
	}, [onValueNodeHasChildrenChange, hasChildren]);
	return /* @__PURE__ */ jsx(Primitive.span, {
		...valueProps,
		ref: composedRefs,
		style: { pointerEvents: "none" },
		children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ jsx(Fragment, { children: placeholder }) : children
	});
});
SelectValue$1.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, children, ...iconProps } = props;
	return /* @__PURE__ */ jsx(Primitive.span, {
		"aria-hidden": true,
		...iconProps,
		ref: forwardedRef,
		children: children || "▼"
	});
});
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME = "SelectPortal";
var SelectPortal = (props) => {
	return /* @__PURE__ */ jsx(Portal$4, {
		asChild: true,
		...props
	});
};
SelectPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "SelectContent";
var SelectContent$1 = React$1.forwardRef((props, forwardedRef) => {
	const context = useSelectContext(CONTENT_NAME, props.__scopeSelect);
	const [fragment, setFragment] = React$1.useState();
	useLayoutEffect2(() => {
		setFragment(new DocumentFragment());
	}, []);
	if (!context.open) {
		const frag = fragment;
		return frag ? ReactDOM$1.createPortal(/* @__PURE__ */ jsx(SelectContentProvider, {
			scope: props.__scopeSelect,
			children: /* @__PURE__ */ jsx(Collection.Slot, {
				scope: props.__scopeSelect,
				children: /* @__PURE__ */ jsx("div", { children: props.children })
			})
		}), frag) : null;
	}
	return /* @__PURE__ */ jsx(SelectContentImpl, {
		...props,
		ref: forwardedRef
	});
});
SelectContent$1.displayName = CONTENT_NAME;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot = /* @__PURE__ */ createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, position = "item-aligned", onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, side, sideOffset, align, alignOffset, arrowPadding, collisionBoundary, collisionPadding, sticky, hideWhenDetached, avoidCollisions, ...contentProps } = props;
	const context = useSelectContext(CONTENT_NAME, __scopeSelect);
	const [content, setContent] = React$1.useState(null);
	const [viewport, setViewport] = React$1.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
	const [selectedItem, setSelectedItem] = React$1.useState(null);
	const [selectedItemText, setSelectedItemText] = React$1.useState(null);
	const getItems = useCollection(__scopeSelect);
	const [isPositioned, setIsPositioned] = React$1.useState(false);
	const firstValidItemFoundRef = React$1.useRef(false);
	React$1.useEffect(() => {
		if (content) return hideOthers(content);
	}, [content]);
	useFocusGuards();
	const focusFirst = React$1.useCallback((candidates) => {
		const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
		const [lastItem] = restItems.slice(-1);
		const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
		for (const candidate of candidates) {
			if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
			candidate?.scrollIntoView({ block: "nearest" });
			if (candidate === firstItem && viewport) viewport.scrollTop = 0;
			if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
			candidate?.focus();
			if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
		}
	}, [getItems, viewport]);
	const focusSelectedItem = React$1.useCallback(() => focusFirst([selectedItem, content]), [
		focusFirst,
		selectedItem,
		content
	]);
	React$1.useEffect(() => {
		if (isPositioned) focusSelectedItem();
	}, [isPositioned, focusSelectedItem]);
	const { onOpenChange, triggerPointerDownPosRef } = context;
	React$1.useEffect(() => {
		if (content) {
			let pointerMoveDelta = {
				x: 0,
				y: 0
			};
			const handlePointerMove = (event) => {
				pointerMoveDelta = {
					x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
					y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0))
				};
			};
			const handlePointerUp = (event) => {
				if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();
				else if (!content.contains(event.target)) onOpenChange(false);
				document.removeEventListener("pointermove", handlePointerMove);
				triggerPointerDownPosRef.current = null;
			};
			if (triggerPointerDownPosRef.current !== null) {
				document.addEventListener("pointermove", handlePointerMove);
				document.addEventListener("pointerup", handlePointerUp, {
					capture: true,
					once: true
				});
			}
			return () => {
				document.removeEventListener("pointermove", handlePointerMove);
				document.removeEventListener("pointerup", handlePointerUp, { capture: true });
			};
		}
	}, [
		content,
		onOpenChange,
		triggerPointerDownPosRef
	]);
	React$1.useEffect(() => {
		const close = () => onOpenChange(false);
		window.addEventListener("blur", close);
		window.addEventListener("resize", close);
		return () => {
			window.removeEventListener("blur", close);
			window.removeEventListener("resize", close);
		};
	}, [onOpenChange]);
	const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
		const enabledItems = getItems().filter((item) => !item.disabled);
		const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.ref.current === document.activeElement));
		if (nextItem) setTimeout(() => nextItem.ref.current.focus());
	});
	const itemRefCallback = React$1.useCallback((node, value, disabled) => {
		const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
		if (context.value !== void 0 && context.value === value || isFirstValidItem) {
			setSelectedItem(node);
			if (isFirstValidItem) firstValidItemFoundRef.current = true;
		}
	}, [context.value]);
	const handleItemLeave = React$1.useCallback(() => content?.focus(), [content]);
	const itemTextRefCallback = React$1.useCallback((node, value, disabled) => {
		const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
		if (context.value !== void 0 && context.value === value || isFirstValidItem) setSelectedItemText(node);
	}, [context.value]);
	const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
	const popperContentProps = SelectPosition === SelectPopperPosition ? {
		side,
		sideOffset,
		align,
		alignOffset,
		arrowPadding,
		collisionBoundary,
		collisionPadding,
		sticky,
		hideWhenDetached,
		avoidCollisions
	} : {};
	return /* @__PURE__ */ jsx(SelectContentProvider, {
		scope: __scopeSelect,
		content,
		viewport,
		onViewportChange: setViewport,
		itemRefCallback,
		selectedItem,
		onItemLeave: handleItemLeave,
		itemTextRefCallback,
		focusSelectedItem,
		selectedItemText,
		position,
		isPositioned,
		searchRef,
		children: /* @__PURE__ */ jsx(ReactRemoveScroll, {
			as: Slot,
			allowPinchZoom: true,
			children: /* @__PURE__ */ jsx(FocusScope, {
				asChild: true,
				trapped: context.open,
				onMountAutoFocus: (event) => {
					event.preventDefault();
				},
				onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
					context.trigger?.focus({ preventScroll: true });
					event.preventDefault();
				}),
				children: /* @__PURE__ */ jsx(DismissableLayer, {
					asChild: true,
					disableOutsidePointerEvents: true,
					onEscapeKeyDown,
					onPointerDownOutside,
					onFocusOutside: (event) => event.preventDefault(),
					onDismiss: () => context.onOpenChange(false),
					children: /* @__PURE__ */ jsx(SelectPosition, {
						role: "listbox",
						id: context.contentId,
						"data-state": context.open ? "open" : "closed",
						dir: context.dir,
						onContextMenu: (event) => event.preventDefault(),
						...contentProps,
						...popperContentProps,
						onPlaced: () => setIsPositioned(true),
						ref: composedRefs,
						style: {
							display: "flex",
							flexDirection: "column",
							outline: "none",
							...contentProps.style
						},
						onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
							const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
							if (event.key === "Tab") event.preventDefault();
							if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
							if ([
								"ArrowUp",
								"ArrowDown",
								"Home",
								"End"
							].includes(event.key)) {
								let candidateNodes = getItems().filter((item) => !item.disabled).map((item) => item.ref.current);
								if (["ArrowUp", "End"].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
								if (["ArrowUp", "ArrowDown"].includes(event.key)) {
									const currentElement = event.target;
									const currentIndex = candidateNodes.indexOf(currentElement);
									candidateNodes = candidateNodes.slice(currentIndex + 1);
								}
								setTimeout(() => focusFirst(candidateNodes));
								event.preventDefault();
							}
						})
					})
				})
			})
		})
	});
});
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, onPlaced, ...popperProps } = props;
	const context = useSelectContext(CONTENT_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(CONTENT_NAME, __scopeSelect);
	const [contentWrapper, setContentWrapper] = React$1.useState(null);
	const [content, setContent] = React$1.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
	const getItems = useCollection(__scopeSelect);
	const shouldExpandOnScrollRef = React$1.useRef(false);
	const shouldRepositionRef = React$1.useRef(true);
	const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
	const position = React$1.useCallback(() => {
		if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
			const triggerRect = context.trigger.getBoundingClientRect();
			const contentRect = content.getBoundingClientRect();
			const valueNodeRect = context.valueNode.getBoundingClientRect();
			const itemTextRect = selectedItemText.getBoundingClientRect();
			if (context.dir !== "rtl") {
				const itemTextOffset = itemTextRect.left - contentRect.left;
				const left = valueNodeRect.left - itemTextOffset;
				const leftDelta = triggerRect.left - left;
				const minContentWidth = triggerRect.width + leftDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const rightEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedLeft = clamp(left, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth)]);
				contentWrapper.style.minWidth = minContentWidth + "px";
				contentWrapper.style.left = clampedLeft + "px";
			} else {
				const itemTextOffset = contentRect.right - itemTextRect.right;
				const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
				const rightDelta = window.innerWidth - triggerRect.right - right;
				const minContentWidth = triggerRect.width + rightDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const leftEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedRight = clamp(right, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth)]);
				contentWrapper.style.minWidth = minContentWidth + "px";
				contentWrapper.style.right = clampedRight + "px";
			}
			const items = getItems();
			const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
			const itemsHeight = viewport.scrollHeight;
			const contentStyles = window.getComputedStyle(content);
			const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
			const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
			const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
			const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
			const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
			const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
			const viewportStyles = window.getComputedStyle(viewport);
			const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
			const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
			const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
			const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
			const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
			const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
			const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
			const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
			if (contentTopToItemMiddle <= topEdgeToTriggerMiddle) {
				const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
				contentWrapper.style.bottom = "0px";
				const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
				const height = contentTopToItemMiddle + Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
				contentWrapper.style.height = height + "px";
			} else {
				const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
				contentWrapper.style.top = "0px";
				const height = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight) + itemMiddleToContentBottom;
				contentWrapper.style.height = height + "px";
				viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
			}
			contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
			contentWrapper.style.minHeight = minContentHeight + "px";
			contentWrapper.style.maxHeight = availableHeight + "px";
			onPlaced?.();
			requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
		}
	}, [
		getItems,
		context.trigger,
		context.valueNode,
		contentWrapper,
		content,
		viewport,
		selectedItem,
		selectedItemText,
		context.dir,
		onPlaced
	]);
	useLayoutEffect2(() => position(), [position]);
	const [contentZIndex, setContentZIndex] = React$1.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ jsx(SelectViewportProvider, {
		scope: __scopeSelect,
		contentWrapper,
		shouldExpandOnScrollRef,
		onScrollButtonChange: React$1.useCallback((node) => {
			if (node && shouldRepositionRef.current === true) {
				position();
				focusSelectedItem?.();
				shouldRepositionRef.current = false;
			}
		}, [position, focusSelectedItem]),
		children: /* @__PURE__ */ jsx("div", {
			ref: setContentWrapper,
			style: {
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: contentZIndex
			},
			children: /* @__PURE__ */ jsx(Primitive.div, {
				...popperProps,
				ref: composedRefs,
				style: {
					boxSizing: "border-box",
					maxHeight: "100%",
					...popperProps.style
				}
			})
		})
	});
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, align = "start", collisionPadding = CONTENT_MARGIN, ...popperProps } = props;
	return /* @__PURE__ */ jsx(Content, {
		...usePopperScope(__scopeSelect),
		...popperProps,
		ref: forwardedRef,
		align,
		collisionPadding,
		style: {
			boxSizing: "border-box",
			...popperProps.style,
			"--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-select-content-available-width": "var(--radix-popper-available-width)",
			"--radix-select-content-available-height": "var(--radix-popper-available-height)",
			"--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME, {});
var VIEWPORT_NAME = "SelectViewport";
var SelectViewport = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, nonce, ...viewportProps } = props;
	const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
	const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
	const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
	const prevScrollTopRef = React$1.useRef(0);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("style", {
		dangerouslySetInnerHTML: { __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}` },
		nonce
	}), /* @__PURE__ */ jsx(Collection.Slot, {
		scope: __scopeSelect,
		children: /* @__PURE__ */ jsx(Primitive.div, {
			"data-radix-select-viewport": "",
			role: "presentation",
			...viewportProps,
			ref: composedRefs,
			style: {
				position: "relative",
				flex: 1,
				overflow: "hidden auto",
				...viewportProps.style
			},
			onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
				const viewport = event.currentTarget;
				const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
				if (shouldExpandOnScrollRef?.current && contentWrapper) {
					const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
					if (scrolledBy > 0) {
						const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
						const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
						const cssHeight = parseFloat(contentWrapper.style.height);
						const prevHeight = Math.max(cssMinHeight, cssHeight);
						if (prevHeight < availableHeight) {
							const nextHeight = prevHeight + scrolledBy;
							const clampedNextHeight = Math.min(availableHeight, nextHeight);
							const heightDiff = nextHeight - clampedNextHeight;
							contentWrapper.style.height = clampedNextHeight + "px";
							if (contentWrapper.style.bottom === "0px") {
								viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
								contentWrapper.style.justifyContent = "flex-end";
							}
						}
					}
				}
				prevScrollTopRef.current = viewport.scrollTop;
			})
		})
	})] });
});
SelectViewport.displayName = VIEWPORT_NAME;
var GROUP_NAME = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME);
var SelectGroup = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...groupProps } = props;
	const groupId = useId$1();
	return /* @__PURE__ */ jsx(SelectGroupContextProvider, {
		scope: __scopeSelect,
		id: groupId,
		children: /* @__PURE__ */ jsx(Primitive.div, {
			role: "group",
			"aria-labelledby": groupId,
			...groupProps,
			ref: forwardedRef
		})
	});
});
SelectGroup.displayName = GROUP_NAME;
var LABEL_NAME = "SelectLabel";
var SelectLabel = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...labelProps } = props;
	const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
	return /* @__PURE__ */ jsx(Primitive.div, {
		id: groupContext.id,
		...labelProps,
		ref: forwardedRef
	});
});
SelectLabel.displayName = LABEL_NAME;
var ITEM_NAME = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME);
var SelectItem$1 = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, value, disabled = false, textValue: textValueProp, ...itemProps } = props;
	const context = useSelectContext(ITEM_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect);
	const isSelected = context.value === value;
	const [textValue, setTextValue] = React$1.useState(textValueProp ?? "");
	const [isFocused, setIsFocused] = React$1.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, (node) => contentContext.itemRefCallback?.(node, value, disabled));
	const textId = useId$1();
	const pointerTypeRef = React$1.useRef("touch");
	const handleSelect = () => {
		if (!disabled) {
			context.onValueChange(value);
			context.onOpenChange(false);
		}
	};
	if (value === "") throw new Error("A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
	return /* @__PURE__ */ jsx(SelectItemContextProvider, {
		scope: __scopeSelect,
		value,
		disabled,
		textId,
		isSelected,
		onItemTextChange: React$1.useCallback((node) => {
			setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? "").trim());
		}, []),
		children: /* @__PURE__ */ jsx(Collection.ItemSlot, {
			scope: __scopeSelect,
			value,
			disabled,
			textValue,
			children: /* @__PURE__ */ jsx(Primitive.div, {
				role: "option",
				"aria-labelledby": textId,
				"data-highlighted": isFocused ? "" : void 0,
				"aria-selected": isSelected && isFocused,
				"data-state": isSelected ? "checked" : "unchecked",
				"aria-disabled": disabled || void 0,
				"data-disabled": disabled ? "" : void 0,
				tabIndex: disabled ? void 0 : -1,
				...itemProps,
				ref: composedRefs,
				onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
				onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
				onClick: composeEventHandlers(itemProps.onClick, () => {
					if (pointerTypeRef.current !== "mouse") handleSelect();
				}),
				onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
					if (pointerTypeRef.current === "mouse") handleSelect();
				}),
				onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
					pointerTypeRef.current = event.pointerType;
				}),
				onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
					pointerTypeRef.current = event.pointerType;
					if (disabled) contentContext.onItemLeave?.();
					else if (pointerTypeRef.current === "mouse") event.currentTarget.focus({ preventScroll: true });
				}),
				onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
					if (event.currentTarget === document.activeElement) contentContext.onItemLeave?.();
				}),
				onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
					if (contentContext.searchRef?.current !== "" && event.key === " ") return;
					if (SELECTION_KEYS.includes(event.key)) handleSelect();
					if (event.key === " ") event.preventDefault();
				})
			})
		})
	});
});
SelectItem$1.displayName = ITEM_NAME;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, className, style, ...itemTextProps } = props;
	const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
	const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
	const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
	const [itemTextNode, setItemTextNode] = React$1.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setItemTextNode(node), itemContext.onItemTextChange, (node) => contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled));
	const textContent = itemTextNode?.textContent;
	const nativeOption = React$1.useMemo(() => /* @__PURE__ */ jsx("option", {
		value: itemContext.value,
		disabled: itemContext.disabled,
		children: textContent
	}, itemContext.value), [
		itemContext.disabled,
		itemContext.value,
		textContent
	]);
	const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
	useLayoutEffect2(() => {
		onNativeOptionAdd(nativeOption);
		return () => onNativeOptionRemove(nativeOption);
	}, [
		onNativeOptionAdd,
		onNativeOptionRemove,
		nativeOption
	]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Primitive.span, {
		id: itemContext.textId,
		...itemTextProps,
		ref: composedRefs
	}), itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? ReactDOM$1.createPortal(itemTextProps.children, context.valueNode) : null] });
});
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME = "SelectItemIndicator";
var SelectItemIndicator = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...itemIndicatorProps } = props;
	return useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect).isSelected ? /* @__PURE__ */ jsx(Primitive.span, {
		"aria-hidden": true,
		...itemIndicatorProps,
		ref: forwardedRef
	}) : null;
});
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton$1 = React$1.forwardRef((props, forwardedRef) => {
	const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
	const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
	const [canScrollUp, setCanScrollUp] = React$1.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
	useLayoutEffect2(() => {
		if (contentContext.viewport && contentContext.isPositioned) {
			let handleScroll2 = function() {
				setCanScrollUp(viewport.scrollTop > 0);
			};
			const viewport = contentContext.viewport;
			handleScroll2();
			viewport.addEventListener("scroll", handleScroll2);
			return () => viewport.removeEventListener("scroll", handleScroll2);
		}
	}, [contentContext.viewport, contentContext.isPositioned]);
	return canScrollUp ? /* @__PURE__ */ jsx(SelectScrollButtonImpl, {
		...props,
		ref: composedRefs,
		onAutoScroll: () => {
			const { viewport, selectedItem } = contentContext;
			if (viewport && selectedItem) viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		}
	}) : null;
});
SelectScrollUpButton$1.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton$1 = React$1.forwardRef((props, forwardedRef) => {
	const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
	const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
	const [canScrollDown, setCanScrollDown] = React$1.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
	useLayoutEffect2(() => {
		if (contentContext.viewport && contentContext.isPositioned) {
			let handleScroll2 = function() {
				const maxScroll = viewport.scrollHeight - viewport.clientHeight;
				setCanScrollDown(Math.ceil(viewport.scrollTop) < maxScroll);
			};
			const viewport = contentContext.viewport;
			handleScroll2();
			viewport.addEventListener("scroll", handleScroll2);
			return () => viewport.removeEventListener("scroll", handleScroll2);
		}
	}, [contentContext.viewport, contentContext.isPositioned]);
	return canScrollDown ? /* @__PURE__ */ jsx(SelectScrollButtonImpl, {
		...props,
		ref: composedRefs,
		onAutoScroll: () => {
			const { viewport, selectedItem } = contentContext;
			if (viewport && selectedItem) viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
		}
	}) : null;
});
SelectScrollDownButton$1.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
	const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
	const autoScrollTimerRef = React$1.useRef(null);
	const getItems = useCollection(__scopeSelect);
	const clearAutoScrollTimer = React$1.useCallback(() => {
		if (autoScrollTimerRef.current !== null) {
			window.clearInterval(autoScrollTimerRef.current);
			autoScrollTimerRef.current = null;
		}
	}, []);
	React$1.useEffect(() => {
		return () => clearAutoScrollTimer();
	}, [clearAutoScrollTimer]);
	useLayoutEffect2(() => {
		getItems().find((item) => item.ref.current === document.activeElement)?.ref.current?.scrollIntoView({ block: "nearest" });
	}, [getItems]);
	return /* @__PURE__ */ jsx(Primitive.div, {
		"aria-hidden": true,
		...scrollIndicatorProps,
		ref: forwardedRef,
		style: {
			flexShrink: 0,
			...scrollIndicatorProps.style
		},
		onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
			if (autoScrollTimerRef.current === null) autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
		}),
		onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
			contentContext.onItemLeave?.();
			if (autoScrollTimerRef.current === null) autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
		}),
		onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
			clearAutoScrollTimer();
		})
	});
});
var SEPARATOR_NAME = "SelectSeparator";
var SelectSeparator = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...separatorProps } = props;
	return /* @__PURE__ */ jsx(Primitive.div, {
		"aria-hidden": true,
		...separatorProps,
		ref: forwardedRef
	});
});
SelectSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "SelectArrow";
var SelectArrow = React$1.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...arrowProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const context = useSelectContext(ARROW_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect);
	return context.open && contentContext.position === "popper" ? /* @__PURE__ */ jsx(Arrow, {
		...popperScope,
		...arrowProps,
		ref: forwardedRef
	}) : null;
});
SelectArrow.displayName = ARROW_NAME;
var BUBBLE_INPUT_NAME = "SelectBubbleInput";
var SelectBubbleInput = React$1.forwardRef(({ __scopeSelect, value, ...props }, forwardedRef) => {
	const ref = React$1.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const prevValue = usePrevious(value);
	React$1.useEffect(() => {
		const select = ref.current;
		if (!select) return;
		const selectProto = window.HTMLSelectElement.prototype;
		const setValue = Object.getOwnPropertyDescriptor(selectProto, "value").set;
		if (prevValue !== value && setValue) {
			const event = new Event("change", { bubbles: true });
			setValue.call(select, value);
			select.dispatchEvent(event);
		}
	}, [prevValue, value]);
	return /* @__PURE__ */ jsx(Primitive.select, {
		...props,
		style: {
			...VISUALLY_HIDDEN_STYLES,
			...props.style
		},
		ref: composedRefs,
		defaultValue: value
	});
});
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME;
function shouldShowPlaceholder(value) {
	return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
	const handleSearchChange = useCallbackRef$1(onSearchChange);
	const searchRef = React$1.useRef("");
	const timerRef = React$1.useRef(0);
	const handleTypeaheadSearch = React$1.useCallback((key) => {
		const search = searchRef.current + key;
		handleSearchChange(search);
		(function updateSearch(value) {
			searchRef.current = value;
			window.clearTimeout(timerRef.current);
			if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
		})(search);
	}, [handleSearchChange]);
	const resetTypeahead = React$1.useCallback(() => {
		searchRef.current = "";
		window.clearTimeout(timerRef.current);
	}, []);
	React$1.useEffect(() => {
		return () => window.clearTimeout(timerRef.current);
	}, []);
	return [
		searchRef,
		handleTypeaheadSearch,
		resetTypeahead
	];
}
function findNextItem(items, search, currentItem) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
	let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
	if (normalizedSearch.length === 1) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
	const nextItem = wrappedItems.find((item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root2 = Select$1;
var Trigger = SelectTrigger$1;
var Value = SelectValue$1;
var Icon = SelectIcon;
var Portal = SelectPortal;
var Content2 = SelectContent$1;
var Viewport = SelectViewport;
var Item = SelectItem$1;
var ItemText = SelectItemText;
var ItemIndicator = SelectItemIndicator;
var ScrollUpButton = SelectScrollUpButton$1;
var ScrollDownButton = SelectScrollDownButton$1;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-separator@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+re_a181a3b4027320248b9b449c5675c5f5/node_modules/@radix-ui/react-separator/dist/index.mjs
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = React$1.forwardRef((props, forwardedRef) => {
	const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
	const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
	const semanticProps = decorative ? { role: "none" } : {
		"aria-orientation": orientation === "vertical" ? orientation : void 0,
		role: "separator"
	};
	return /* @__PURE__ */ jsx(Primitive.div, {
		"data-orientation": orientation,
		...semanticProps,
		...domProps,
		ref: forwardedRef
	});
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
	return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
//#endregion
//#region src/components/ui/badge.tsx
const badgeVariants = cva("group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-3xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
		destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
		outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
		ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
		link: "text-primary underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Badge(t0) {
	const $ = c(13);
	let className;
	let props;
	let t1;
	let t2;
	if ($[0] !== t0) {
		({className, variant: t1, asChild: t2, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
		$[3] = t1;
		$[4] = t2;
	} else {
		className = $[1];
		props = $[2];
		t1 = $[3];
		t2 = $[4];
	}
	const variant = t1 === void 0 ? "default" : t1;
	const Comp = (t2 === void 0 ? false : t2) ? Slot$4 : "span";
	let t3;
	if ($[5] !== className || $[6] !== variant) {
		t3 = cn(badgeVariants({ variant }), className);
		$[5] = className;
		$[6] = variant;
		$[7] = t3;
	} else t3 = $[7];
	let t4;
	if ($[8] !== Comp || $[9] !== props || $[10] !== t3 || $[11] !== variant) {
		t4 = /* @__PURE__ */ jsx(Comp, {
			"data-slot": "badge",
			"data-variant": variant,
			className: t3,
			...props
		});
		$[8] = Comp;
		$[9] = props;
		$[10] = t3;
		$[11] = variant;
		$[12] = t4;
	} else t4 = $[12];
	return t4;
}
//#endregion
//#region src/components/ui/button.tsx
const buttonVariants = cva("group/button inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/80",
			outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-transparent dark:hover:bg-input/30",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
			xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
			icon: "size-9",
			"icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button(t0) {
	const $ = c(16);
	let className;
	let props;
	let t1;
	let t2;
	let t3;
	if ($[0] !== t0) {
		({className, variant: t1, size: t2, asChild: t3, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
		$[3] = t1;
		$[4] = t2;
		$[5] = t3;
	} else {
		className = $[1];
		props = $[2];
		t1 = $[3];
		t2 = $[4];
		t3 = $[5];
	}
	const variant = t1 === void 0 ? "default" : t1;
	const size = t2 === void 0 ? "default" : t2;
	const Comp = (t3 === void 0 ? false : t3) ? Slot$4 : "button";
	let t4;
	if ($[6] !== className || $[7] !== size || $[8] !== variant) {
		t4 = cn(buttonVariants({
			variant,
			size,
			className
		}));
		$[6] = className;
		$[7] = size;
		$[8] = variant;
		$[9] = t4;
	} else t4 = $[9];
	let t5;
	if ($[10] !== Comp || $[11] !== props || $[12] !== size || $[13] !== t4 || $[14] !== variant) {
		t5 = /* @__PURE__ */ jsx(Comp, {
			"data-slot": "button",
			"data-variant": variant,
			"data-size": size,
			className: t4,
			...props
		});
		$[10] = Comp;
		$[11] = props;
		$[12] = size;
		$[13] = t4;
		$[14] = variant;
		$[15] = t5;
	} else t5 = $[15];
	return t5;
}
//#endregion
//#region src/components/ui/checkbox.tsx
function Checkbox(t0) {
	const $ = c(9);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("peer relative flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent bg-input/90 transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ jsx(CheckboxIndicator, {
			"data-slot": "checkbox-indicator",
			className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
			children: /* @__PURE__ */ jsx(Check, {})
		});
		$[5] = t2;
	} else t2 = $[5];
	let t3;
	if ($[6] !== props || $[7] !== t1) {
		t3 = /* @__PURE__ */ jsx(Checkbox$1, {
			"data-slot": "checkbox",
			className: t1,
			...props,
			children: t2
		});
		$[6] = props;
		$[7] = t1;
		$[8] = t3;
	} else t3 = $[8];
	return t3;
}
//#endregion
//#region node_modules/.pnpm/cmdk@1.1.1_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@19.2.14_react-dom_3d47b27abe92d75583fac7218a36b921/node_modules/cmdk/dist/chunk-NZJY6EH4.mjs
var U = 1, Y$1 = .9, H = .8, J = .17, p = .1, u = .999, $ = .9999;
var k$1 = .99, m = /[\\\/_+.#"@\[\(\{&]/, B$1 = /[\\\/_+.#"@\[\(\{&]/g, K$1 = /[\s-]/, X = /[\s-]/g;
function G(_, C, h, P, A, f, O) {
	if (f === C.length) return A === _.length ? U : k$1;
	var T = `${A},${f}`;
	if (O[T] !== void 0) return O[T];
	for (var L = P.charAt(f), c = h.indexOf(L, A), S = 0, E, N, R, M; c >= 0;) E = G(_, C, h, P, c + 1, f + 1, O), E > S && (c === A ? E *= U : m.test(_.charAt(c - 1)) ? (E *= H, R = _.slice(A, c - 1).match(B$1), R && A > 0 && (E *= Math.pow(u, R.length))) : K$1.test(_.charAt(c - 1)) ? (E *= Y$1, M = _.slice(A, c - 1).match(X), M && A > 0 && (E *= Math.pow(u, M.length))) : (E *= J, A > 0 && (E *= Math.pow(u, c - A))), _.charAt(c) !== C.charAt(f) && (E *= $)), (E < p && h.charAt(c - 1) === P.charAt(f + 1) || P.charAt(f + 1) === P.charAt(f) && h.charAt(c - 1) !== P.charAt(f)) && (N = G(_, C, h, P, c + 1, f + 2, O), N * p > E && (E = N * p)), E > S && (S = E), c = h.indexOf(L, c + 1);
	return O[T] = S, S;
}
function D(_) {
	return _.toLowerCase().replace(X, " ");
}
function W(_, C, h) {
	return _ = h && h.length > 0 ? `${_ + " " + h.join(" ")}` : _, G(_, C, D(_), D(C), 0, 0, {});
}
//#endregion
//#region node_modules/.pnpm/cmdk@1.1.1_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@19.2.14_react-dom_3d47b27abe92d75583fac7218a36b921/node_modules/cmdk/dist/index.mjs
var N = "[cmdk-group=\"\"]", Y = "[cmdk-group-items=\"\"]", be = "[cmdk-group-heading=\"\"]", le = "[cmdk-item=\"\"]", ce = `${le}:not([aria-disabled="true"])`, Z = "cmdk-item-select", T = "data-value", Re = (r, o, n) => W(r, o, n), ue = React$1.createContext(void 0), K = () => React$1.useContext(ue), de = React$1.createContext(void 0), ee = () => React$1.useContext(de), fe = React$1.createContext(void 0), me = React$1.forwardRef((r, o) => {
	let n = L(() => {
		var e, a;
		return {
			search: "",
			value: (a = (e = r.value) != null ? e : r.defaultValue) != null ? a : "",
			selectedItemId: void 0,
			filtered: {
				count: 0,
				items: /* @__PURE__ */ new Map(),
				groups: /* @__PURE__ */ new Set()
			}
		};
	}), u = L(() => /* @__PURE__ */ new Set()), c = L(() => /* @__PURE__ */ new Map()), d = L(() => /* @__PURE__ */ new Map()), f = L(() => /* @__PURE__ */ new Set()), p = pe(r), { label: b, children: m, value: R, onValueChange: x, filter: C, shouldFilter: S, loop: A, disablePointerSelection: ge = !1, vimBindings: j = !0, ...O } = r, $ = useId$1(), q = useId$1(), _ = useId$1(), I = React$1.useRef(null), v = ke();
	k(() => {
		if (R !== void 0) {
			let e = R.trim();
			n.current.value = e, E.emit();
		}
	}, [R]), k(() => {
		v(6, ne);
	}, []);
	let E = React$1.useMemo(() => ({
		subscribe: (e) => (f.current.add(e), () => f.current.delete(e)),
		snapshot: () => n.current,
		setState: (e, a, s) => {
			var i, l, g, y;
			if (!Object.is(n.current[e], a)) {
				if (n.current[e] = a, e === "search") J(), z(), v(1, W);
				else if (e === "value") {
					if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
						let h = document.getElementById(_);
						h ? h.focus() : (i = document.getElementById($)) == null || i.focus();
					}
					if (v(7, () => {
						var h;
						n.current.selectedItemId = (h = M()) == null ? void 0 : h.id, E.emit();
					}), s || v(5, ne), ((l = p.current) == null ? void 0 : l.value) !== void 0) {
						let h = a != null ? a : "";
						(y = (g = p.current).onValueChange) == null || y.call(g, h);
						return;
					}
				}
				E.emit();
			}
		},
		emit: () => {
			f.current.forEach((e) => e());
		}
	}), []), U = React$1.useMemo(() => ({
		value: (e, a, s) => {
			var i;
			a !== ((i = d.current.get(e)) == null ? void 0 : i.value) && (d.current.set(e, {
				value: a,
				keywords: s
			}), n.current.filtered.items.set(e, te(a, s)), v(2, () => {
				z(), E.emit();
			}));
		},
		item: (e, a) => (u.current.add(e), a && (c.current.has(a) ? c.current.get(a).add(e) : c.current.set(a, new Set([e]))), v(3, () => {
			J(), z(), n.current.value || W(), E.emit();
		}), () => {
			d.current.delete(e), u.current.delete(e), n.current.filtered.items.delete(e);
			let s = M();
			v(4, () => {
				J(), (s == null ? void 0 : s.getAttribute("id")) === e && W(), E.emit();
			});
		}),
		group: (e) => (c.current.has(e) || c.current.set(e, /* @__PURE__ */ new Set()), () => {
			d.current.delete(e), c.current.delete(e);
		}),
		filter: () => p.current.shouldFilter,
		label: b || r["aria-label"],
		getDisablePointerSelection: () => p.current.disablePointerSelection,
		listId: $,
		inputId: _,
		labelId: q,
		listInnerRef: I
	}), []);
	function te(e, a) {
		var i, l;
		let s = (l = (i = p.current) == null ? void 0 : i.filter) != null ? l : Re;
		return e ? s(e, n.current.search, a) : 0;
	}
	function z() {
		if (!n.current.search || p.current.shouldFilter === !1) return;
		let e = n.current.filtered.items, a = [];
		n.current.filtered.groups.forEach((i) => {
			let l = c.current.get(i), g = 0;
			l.forEach((y) => {
				let h = e.get(y);
				g = Math.max(h, g);
			}), a.push([i, g]);
		});
		let s = I.current;
		V().sort((i, l) => {
			var h, F;
			let g = i.getAttribute("id"), y = l.getAttribute("id");
			return ((h = e.get(y)) != null ? h : 0) - ((F = e.get(g)) != null ? F : 0);
		}).forEach((i) => {
			let l = i.closest(Y);
			l ? l.appendChild(i.parentElement === l ? i : i.closest(`${Y} > *`)) : s.appendChild(i.parentElement === s ? i : i.closest(`${Y} > *`));
		}), a.sort((i, l) => l[1] - i[1]).forEach((i) => {
			var g;
			let l = (g = I.current) == null ? void 0 : g.querySelector(`${N}[${T}="${encodeURIComponent(i[0])}"]`);
			l?.parentElement.appendChild(l);
		});
	}
	function W() {
		let e = V().find((s) => s.getAttribute("aria-disabled") !== "true"), a = e == null ? void 0 : e.getAttribute(T);
		E.setState("value", a || void 0);
	}
	function J() {
		var a, s, i, l;
		if (!n.current.search || p.current.shouldFilter === !1) {
			n.current.filtered.count = u.current.size;
			return;
		}
		n.current.filtered.groups = /* @__PURE__ */ new Set();
		let e = 0;
		for (let g of u.current) {
			let F = te((s = (a = d.current.get(g)) == null ? void 0 : a.value) != null ? s : "", (l = (i = d.current.get(g)) == null ? void 0 : i.keywords) != null ? l : []);
			n.current.filtered.items.set(g, F), F > 0 && e++;
		}
		for (let [g, y] of c.current) for (let h of y) if (n.current.filtered.items.get(h) > 0) {
			n.current.filtered.groups.add(g);
			break;
		}
		n.current.filtered.count = e;
	}
	function ne() {
		var a, s, i;
		let e = M();
		e && (((a = e.parentElement) == null ? void 0 : a.firstChild) === e && ((i = (s = e.closest(N)) == null ? void 0 : s.querySelector(be)) == null || i.scrollIntoView({ block: "nearest" })), e.scrollIntoView({ block: "nearest" }));
	}
	function M() {
		var e;
		return (e = I.current) == null ? void 0 : e.querySelector(`${le}[aria-selected="true"]`);
	}
	function V() {
		var e;
		return Array.from(((e = I.current) == null ? void 0 : e.querySelectorAll(ce)) || []);
	}
	function X(e) {
		let s = V()[e];
		s && E.setState("value", s.getAttribute(T));
	}
	function Q(e) {
		var g;
		let a = M(), s = V(), i = s.findIndex((y) => y === a), l = s[i + e];
		(g = p.current) != null && g.loop && (l = i + e < 0 ? s[s.length - 1] : i + e === s.length ? s[0] : s[i + e]), l && E.setState("value", l.getAttribute(T));
	}
	function re(e) {
		let a = M(), s = a == null ? void 0 : a.closest(N), i;
		for (; s && !i;) s = e > 0 ? we(s, N) : De(s, N), i = s == null ? void 0 : s.querySelector(ce);
		i ? E.setState("value", i.getAttribute(T)) : Q(e);
	}
	let oe = () => X(V().length - 1), ie = (e) => {
		e.preventDefault(), e.metaKey ? oe() : e.altKey ? re(1) : Q(1);
	}, se = (e) => {
		e.preventDefault(), e.metaKey ? X(0) : e.altKey ? re(-1) : Q(-1);
	};
	return React$1.createElement(Primitive.div, {
		ref: o,
		tabIndex: -1,
		...O,
		"cmdk-root": "",
		onKeyDown: (e) => {
			var s;
			(s = O.onKeyDown) == null || s.call(O, e);
			let a = e.nativeEvent.isComposing || e.keyCode === 229;
			if (!(e.defaultPrevented || a)) switch (e.key) {
				case "n":
				case "j":
					j && e.ctrlKey && ie(e);
					break;
				case "ArrowDown":
					ie(e);
					break;
				case "p":
				case "k":
					j && e.ctrlKey && se(e);
					break;
				case "ArrowUp":
					se(e);
					break;
				case "Home":
					e.preventDefault(), X(0);
					break;
				case "End":
					e.preventDefault(), oe();
					break;
				case "Enter": {
					e.preventDefault();
					let i = M();
					if (i) {
						let l = new Event(Z);
						i.dispatchEvent(l);
					}
				}
			}
		}
	}, React$1.createElement("label", {
		"cmdk-label": "",
		htmlFor: U.inputId,
		id: U.labelId,
		style: Te
	}, b), B(r, (e) => React$1.createElement(de.Provider, { value: E }, React$1.createElement(ue.Provider, { value: U }, e))));
}), he = React$1.forwardRef((r, o) => {
	var _, I;
	let n = useId$1(), u = React$1.useRef(null), c = React$1.useContext(fe), d = K(), f = pe(r), p = (I = (_ = f.current) == null ? void 0 : _.forceMount) != null ? I : c == null ? void 0 : c.forceMount;
	k(() => {
		if (!p) return d.item(n, c == null ? void 0 : c.id);
	}, [p]);
	let b = ve(n, u, [
		r.value,
		r.children,
		u
	], r.keywords), m = ee(), R = P((v) => v.value && v.value === b.current), x = P((v) => p || d.filter() === !1 ? !0 : v.search ? v.filtered.items.get(n) > 0 : !0);
	React$1.useEffect(() => {
		let v = u.current;
		if (!(!v || r.disabled)) return v.addEventListener(Z, C), () => v.removeEventListener(Z, C);
	}, [
		x,
		r.onSelect,
		r.disabled
	]);
	function C() {
		var v, E;
		S(), (E = (v = f.current).onSelect) == null || E.call(v, b.current);
	}
	function S() {
		m.setState("value", b.current, !0);
	}
	if (!x) return null;
	let { disabled: A, value: ge, onSelect: j, forceMount: O, keywords: $, ...q } = r;
	return React$1.createElement(Primitive.div, {
		ref: composeRefs(u, o),
		...q,
		id: n,
		"cmdk-item": "",
		role: "option",
		"aria-disabled": !!A,
		"aria-selected": !!R,
		"data-disabled": !!A,
		"data-selected": !!R,
		onPointerMove: A || d.getDisablePointerSelection() ? void 0 : S,
		onClick: A ? void 0 : C
	}, r.children);
}), Ee = React$1.forwardRef((r, o) => {
	let { heading: n, children: u, forceMount: c, ...d } = r, f = useId$1(), p = React$1.useRef(null), b = React$1.useRef(null), m = useId$1(), R = K(), x = P((S) => c || R.filter() === !1 ? !0 : S.search ? S.filtered.groups.has(f) : !0);
	k(() => R.group(f), []), ve(f, p, [
		r.value,
		r.heading,
		b
	]);
	let C = React$1.useMemo(() => ({
		id: f,
		forceMount: c
	}), [c]);
	return React$1.createElement(Primitive.div, {
		ref: composeRefs(p, o),
		...d,
		"cmdk-group": "",
		role: "presentation",
		hidden: x ? void 0 : !0
	}, n && React$1.createElement("div", {
		ref: b,
		"cmdk-group-heading": "",
		"aria-hidden": !0,
		id: m
	}, n), B(r, (S) => React$1.createElement("div", {
		"cmdk-group-items": "",
		role: "group",
		"aria-labelledby": n ? m : void 0
	}, React$1.createElement(fe.Provider, { value: C }, S))));
}), ye = React$1.forwardRef((r, o) => {
	let { alwaysRender: n, ...u } = r, c = React$1.useRef(null), d = P((f) => !f.search);
	return !n && !d ? null : React$1.createElement(Primitive.div, {
		ref: composeRefs(c, o),
		...u,
		"cmdk-separator": "",
		role: "separator"
	});
}), Se = React$1.forwardRef((r, o) => {
	let { onValueChange: n, ...u } = r, c = r.value != null, d = ee(), f = P((m) => m.search), p = P((m) => m.selectedItemId), b = K();
	return React$1.useEffect(() => {
		r.value != null && d.setState("search", r.value);
	}, [r.value]), React$1.createElement(Primitive.input, {
		ref: o,
		...u,
		"cmdk-input": "",
		autoComplete: "off",
		autoCorrect: "off",
		spellCheck: !1,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": !0,
		"aria-controls": b.listId,
		"aria-labelledby": b.labelId,
		"aria-activedescendant": p,
		id: b.inputId,
		type: "text",
		value: c ? r.value : f,
		onChange: (m) => {
			c || d.setState("search", m.target.value), n?.(m.target.value);
		}
	});
}), Ce = React$1.forwardRef((r, o) => {
	let { children: n, label: u = "Suggestions", ...c } = r, d = React$1.useRef(null), f = React$1.useRef(null), p = P((m) => m.selectedItemId), b = K();
	return React$1.useEffect(() => {
		if (f.current && d.current) {
			let m = f.current, R = d.current, x, C = new ResizeObserver(() => {
				x = requestAnimationFrame(() => {
					let S = m.offsetHeight;
					R.style.setProperty("--cmdk-list-height", S.toFixed(1) + "px");
				});
			});
			return C.observe(m), () => {
				cancelAnimationFrame(x), C.unobserve(m);
			};
		}
	}, []), React$1.createElement(Primitive.div, {
		ref: composeRefs(d, o),
		...c,
		"cmdk-list": "",
		role: "listbox",
		tabIndex: -1,
		"aria-activedescendant": p,
		"aria-label": u,
		id: b.listId
	}, B(r, (m) => React$1.createElement("div", {
		ref: composeRefs(f, b.listInnerRef),
		"cmdk-list-sizer": ""
	}, m)));
}), xe = React$1.forwardRef((r, o) => {
	let { open: n, onOpenChange: u, overlayClassName: c, contentClassName: d, container: f, ...p } = r;
	return React$1.createElement(Root$3, {
		open: n,
		onOpenChange: u
	}, React$1.createElement(Portal$3, { container: f }, React$1.createElement(Overlay, {
		"cmdk-overlay": "",
		className: c
	}), React$1.createElement(Content$1, {
		"aria-label": r.label,
		"cmdk-dialog": "",
		className: d
	}, React$1.createElement(me, {
		ref: o,
		...p
	}))));
}), Ie = React$1.forwardRef((r, o) => P((u) => u.filtered.count === 0) ? React$1.createElement(Primitive.div, {
	ref: o,
	...r,
	"cmdk-empty": "",
	role: "presentation"
}) : null), Pe = React$1.forwardRef((r, o) => {
	let { progress: n, children: u, label: c = "Loading...", ...d } = r;
	return React$1.createElement(Primitive.div, {
		ref: o,
		...d,
		"cmdk-loading": "",
		role: "progressbar",
		"aria-valuenow": n,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": c
	}, B(r, (f) => React$1.createElement("div", { "aria-hidden": !0 }, f)));
}), _e = Object.assign(me, {
	List: Ce,
	Item: he,
	Input: Se,
	Group: Ee,
	Separator: ye,
	Dialog: xe,
	Empty: Ie,
	Loading: Pe
});
function we(r, o) {
	let n = r.nextElementSibling;
	for (; n;) {
		if (n.matches(o)) return n;
		n = n.nextElementSibling;
	}
}
function De(r, o) {
	let n = r.previousElementSibling;
	for (; n;) {
		if (n.matches(o)) return n;
		n = n.previousElementSibling;
	}
}
function pe(r) {
	let o = React$1.useRef(r);
	return k(() => {
		o.current = r;
	}), o;
}
var k = typeof window == "undefined" ? React$1.useEffect : React$1.useLayoutEffect;
function L(r) {
	let o = React$1.useRef();
	return o.current === void 0 && (o.current = r()), o;
}
function P(r) {
	let o = ee(), n = () => r(o.snapshot());
	return React$1.useSyncExternalStore(o.subscribe, n, n);
}
function ve(r, o, n, u = []) {
	let c = React$1.useRef(), d = K();
	return k(() => {
		var b;
		let f = (() => {
			var m;
			for (let R of n) {
				if (typeof R == "string") return R.trim();
				if (typeof R == "object" && "current" in R) return R.current ? (m = R.current.textContent) == null ? void 0 : m.trim() : c.current;
			}
		})(), p = u.map((m) => m.trim());
		d.value(r, f, p), (b = o.current) == null || b.setAttribute(T, f), c.current = f;
	}), c;
}
var ke = () => {
	let [r, o] = React$1.useState(), n = L(() => /* @__PURE__ */ new Map());
	return k(() => {
		n.current.forEach((u) => u()), n.current = /* @__PURE__ */ new Map();
	}, [r]), (u, c) => {
		n.current.set(u, c), o({});
	};
};
function Me(r) {
	let o = r.type;
	return typeof o == "function" ? o(r.props) : "render" in o ? o.render(r.props) : r;
}
function B({ asChild: r, children: o }, n) {
	return r && React$1.isValidElement(o) ? React$1.cloneElement(Me(o), { ref: o.ref }, n(o.props.children)) : n(o);
}
var Te = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0"
};
//#endregion
//#region src/components/ui/input.tsx
function Input(t0) {
	const $ = c(10);
	let className;
	let props;
	let type;
	if ($[0] !== t0) {
		({className, type, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
		$[3] = type;
	} else {
		className = $[1];
		props = $[2];
		type = $[3];
	}
	let t1;
	if ($[4] !== className) {
		t1 = cn("h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className);
		$[4] = className;
		$[5] = t1;
	} else t1 = $[5];
	let t2;
	if ($[6] !== props || $[7] !== t1 || $[8] !== type) {
		t2 = /* @__PURE__ */ jsx("input", {
			type,
			"data-slot": "input",
			className: t1,
			...props
		});
		$[6] = props;
		$[7] = t1;
		$[8] = type;
		$[9] = t2;
	} else t2 = $[9];
	return t2;
}
//#endregion
//#region src/components/ui/input-group.tsx
function InputGroup(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("group/input-group relative flex h-9 w-full min-w-0 items-center rounded-4xl border border-transparent bg-input/50 transition-[color,box-shadow,background-color] outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-data-[align=block-end]:rounded-3xl has-data-[align=block-start]:rounded-3xl has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[textarea]:rounded-2xl has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx("div", {
			"data-slot": "input-group",
			role: "group",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
const inputGroupAddonVariants = cva("flex h-auto cursor-text items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-3xl **:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1.5 [&>svg:not([class*='size-'])]:size-4", {
	variants: { align: {
		"inline-start": "order-first pl-3 has-[>button]:-ml-1 has-[>kbd]:-ml-1",
		"inline-end": "order-last pr-3 has-[>button]:-mr-1 has-[>kbd]:-mr-1",
		"block-start": "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-3.5 [.border-b]:pb-3.5",
		"block-end": "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-3.5 [.border-t]:pt-3.5"
	} },
	defaultVariants: { align: "inline-start" }
});
function InputGroupAddon(t0) {
	const $ = c(11);
	let className;
	let props;
	let t1;
	if ($[0] !== t0) {
		({className, align: t1, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
		$[3] = t1;
	} else {
		className = $[1];
		props = $[2];
		t1 = $[3];
	}
	const align = t1 === void 0 ? "inline-start" : t1;
	let t2;
	if ($[4] !== align || $[5] !== className) {
		t2 = cn(inputGroupAddonVariants({ align }), className);
		$[4] = align;
		$[5] = className;
		$[6] = t2;
	} else t2 = $[6];
	let t3;
	if ($[7] !== align || $[8] !== props || $[9] !== t2) {
		t3 = /* @__PURE__ */ jsx("div", {
			role: "group",
			"data-slot": "input-group-addon",
			"data-align": align,
			className: t2,
			onClick: _temp$2,
			...props
		});
		$[7] = align;
		$[8] = props;
		$[9] = t2;
		$[10] = t3;
	} else t3 = $[10];
	return t3;
}
function _temp$2(e) {
	if (e.target.closest("button")) return;
	e.currentTarget.parentElement?.querySelector("input")?.focus();
}
cva("flex items-center gap-2 rounded-4xl text-sm shadow-none", {
	variants: { size: {
		xs: "h-6 gap-1 rounded-xl px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
		sm: "",
		"icon-xs": "size-6 rounded-xl p-0 has-[>svg]:p-0",
		"icon-sm": "size-8 p-0 has-[>svg]:p-0"
	} },
	defaultVariants: { size: "xs" }
});
//#endregion
//#region src/components/ui/command.tsx
function Command(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("flex size-full flex-col overflow-hidden rounded-4xl bg-popover p-1 text-popover-foreground", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx(_e, {
			"data-slot": "command",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function CommandInput(t0) {
	const $ = c(11);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx(_e.Input, {
			"data-slot": "command-input",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	let t3;
	if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = /* @__PURE__ */ jsx(InputGroupAddon, { children: /* @__PURE__ */ jsx(Search, { className: "size-4 shrink-0 opacity-50" }) });
		$[8] = t3;
	} else t3 = $[8];
	let t4;
	if ($[9] !== t2) {
		t4 = /* @__PURE__ */ jsx("div", {
			"data-slot": "command-input-wrapper",
			className: "p-1 pb-0",
			children: /* @__PURE__ */ jsxs(InputGroup, {
				className: "h-9 bg-input/50",
				children: [t2, t3]
			})
		});
		$[9] = t2;
		$[10] = t4;
	} else t4 = $[10];
	return t4;
}
function CommandList(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx(_e.List, {
			"data-slot": "command-list",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function CommandEmpty(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("py-6 text-center text-sm", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx(_e.Empty, {
			"data-slot": "command-empty",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function CommandGroup(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("overflow-hidden p-1.5 text-foreground **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx(_e.Group, {
			"data-slot": "command-group",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function CommandItem(t0) {
	const $ = c(11);
	let children;
	let className;
	let props;
	if ($[0] !== t0) {
		({className, children, ...props} = t0);
		$[0] = t0;
		$[1] = children;
		$[2] = className;
		$[3] = props;
	} else {
		children = $[1];
		className = $[2];
		props = $[3];
	}
	let t1;
	if ($[4] !== className) {
		t1 = cn("group/command-item relative flex cursor-default items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden select-none in-data-[slot=dialog-content]:rounded-3xl data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground", className);
		$[4] = className;
		$[5] = t1;
	} else t1 = $[5];
	let t2;
	if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ jsx(Check, { className: "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" });
		$[6] = t2;
	} else t2 = $[6];
	let t3;
	if ($[7] !== children || $[8] !== props || $[9] !== t1) {
		t3 = /* @__PURE__ */ jsxs(_e.Item, {
			"data-slot": "command-item",
			className: t1,
			...props,
			children: [children, t2]
		});
		$[7] = children;
		$[8] = props;
		$[9] = t1;
		$[10] = t3;
	} else t3 = $[10];
	return t3;
}
//#endregion
//#region src/components/ui/dropdown-menu.tsx
function DropdownMenu(t0) {
	const $ = c(4);
	let props;
	if ($[0] !== t0) {
		({...props} = t0);
		$[0] = t0;
		$[1] = props;
	} else props = $[1];
	let t1;
	if ($[2] !== props) {
		t1 = /* @__PURE__ */ jsx(Root2$2, {
			"data-slot": "dropdown-menu",
			...props
		});
		$[2] = props;
		$[3] = t1;
	} else t1 = $[3];
	return t1;
}
function DropdownMenuTrigger(t0) {
	const $ = c(4);
	let props;
	if ($[0] !== t0) {
		({...props} = t0);
		$[0] = t0;
		$[1] = props;
	} else props = $[1];
	let t1;
	if ($[2] !== props) {
		t1 = /* @__PURE__ */ jsx(Trigger$2, {
			"data-slot": "dropdown-menu-trigger",
			...props
		});
		$[2] = props;
		$[3] = t1;
	} else t1 = $[3];
	return t1;
}
function DropdownMenuContent(t0) {
	const $ = c(12);
	let className;
	let props;
	let t1;
	let t2;
	if ($[0] !== t0) {
		({className, align: t1, sideOffset: t2, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
		$[3] = t1;
		$[4] = t2;
	} else {
		className = $[1];
		props = $[2];
		t1 = $[3];
		t2 = $[4];
	}
	const align = t1 === void 0 ? "start" : t1;
	const sideOffset = t2 === void 0 ? 4 : t2;
	let t3;
	if ($[5] !== className) {
		t3 = cn("z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-48 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-3xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className);
		$[5] = className;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== align || $[8] !== props || $[9] !== sideOffset || $[10] !== t3) {
		t4 = /* @__PURE__ */ jsx(Portal2, { children: /* @__PURE__ */ jsx(Content2$2, {
			"data-slot": "dropdown-menu-content",
			sideOffset,
			align,
			className: t3,
			...props
		}) });
		$[7] = align;
		$[8] = props;
		$[9] = sideOffset;
		$[10] = t3;
		$[11] = t4;
	} else t4 = $[11];
	return t4;
}
function DropdownMenuItem(t0) {
	const $ = c(12);
	let className;
	let inset;
	let props;
	let t1;
	if ($[0] !== t0) {
		({className, inset, variant: t1, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = inset;
		$[3] = props;
		$[4] = t1;
	} else {
		className = $[1];
		inset = $[2];
		props = $[3];
		t1 = $[4];
	}
	const variant = t1 === void 0 ? "default" : t1;
	let t2;
	if ($[5] !== className) {
		t2 = cn("group/dropdown-menu-item relative flex cursor-default items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-9.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive", className);
		$[5] = className;
		$[6] = t2;
	} else t2 = $[6];
	let t3;
	if ($[7] !== inset || $[8] !== props || $[9] !== t2 || $[10] !== variant) {
		t3 = /* @__PURE__ */ jsx(Item2, {
			"data-slot": "dropdown-menu-item",
			"data-inset": inset,
			"data-variant": variant,
			className: t2,
			...props
		});
		$[7] = inset;
		$[8] = props;
		$[9] = t2;
		$[10] = variant;
		$[11] = t3;
	} else t3 = $[11];
	return t3;
}
function DropdownMenuCheckboxItem(t0) {
	const $ = c(15);
	let checked;
	let children;
	let className;
	let inset;
	let props;
	if ($[0] !== t0) {
		({className, children, checked, inset, ...props} = t0);
		$[0] = t0;
		$[1] = checked;
		$[2] = children;
		$[3] = className;
		$[4] = inset;
		$[5] = props;
	} else {
		checked = $[1];
		children = $[2];
		className = $[3];
		inset = $[4];
		props = $[5];
	}
	let t1;
	if ($[6] !== className) {
		t1 = cn("relative flex cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-9.5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className);
		$[6] = className;
		$[7] = t1;
	} else t1 = $[7];
	let t2;
	if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ jsx("span", {
			className: "pointer-events-none absolute right-2 flex items-center justify-center",
			"data-slot": "dropdown-menu-checkbox-item-indicator",
			children: /* @__PURE__ */ jsx(ItemIndicator2, { children: /* @__PURE__ */ jsx(Check, {}) })
		});
		$[8] = t2;
	} else t2 = $[8];
	let t3;
	if ($[9] !== checked || $[10] !== children || $[11] !== inset || $[12] !== props || $[13] !== t1) {
		t3 = /* @__PURE__ */ jsxs(CheckboxItem2, {
			"data-slot": "dropdown-menu-checkbox-item",
			"data-inset": inset,
			className: t1,
			checked,
			...props,
			children: [t2, children]
		});
		$[9] = checked;
		$[10] = children;
		$[11] = inset;
		$[12] = props;
		$[13] = t1;
		$[14] = t3;
	} else t3 = $[14];
	return t3;
}
function DropdownMenuLabel(t0) {
	const $ = c(10);
	let className;
	let inset;
	let props;
	if ($[0] !== t0) {
		({className, inset, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = inset;
		$[3] = props;
	} else {
		className = $[1];
		inset = $[2];
		props = $[3];
	}
	let t1;
	if ($[4] !== className) {
		t1 = cn("px-3 py-2.5 text-xs text-muted-foreground data-inset:pl-9.5", className);
		$[4] = className;
		$[5] = t1;
	} else t1 = $[5];
	let t2;
	if ($[6] !== inset || $[7] !== props || $[8] !== t1) {
		t2 = /* @__PURE__ */ jsx(Label2, {
			"data-slot": "dropdown-menu-label",
			"data-inset": inset,
			className: t1,
			...props
		});
		$[6] = inset;
		$[7] = props;
		$[8] = t1;
		$[9] = t2;
	} else t2 = $[9];
	return t2;
}
function DropdownMenuSeparator(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("-mx-1.5 my-1.5 h-px bg-border/50", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx(Separator2, {
			"data-slot": "dropdown-menu-separator",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
//#endregion
//#region src/components/ui/popover.tsx
function Popover(t0) {
	const $ = c(4);
	let props;
	if ($[0] !== t0) {
		({...props} = t0);
		$[0] = t0;
		$[1] = props;
	} else props = $[1];
	let t1;
	if ($[2] !== props) {
		t1 = /* @__PURE__ */ jsx(Root2$1, {
			"data-slot": "popover",
			...props
		});
		$[2] = props;
		$[3] = t1;
	} else t1 = $[3];
	return t1;
}
function PopoverTrigger(t0) {
	const $ = c(4);
	let props;
	if ($[0] !== t0) {
		({...props} = t0);
		$[0] = t0;
		$[1] = props;
	} else props = $[1];
	let t1;
	if ($[2] !== props) {
		t1 = /* @__PURE__ */ jsx(Trigger$1, {
			"data-slot": "popover-trigger",
			...props
		});
		$[2] = props;
		$[3] = t1;
	} else t1 = $[3];
	return t1;
}
function PopoverContent(t0) {
	const $ = c(12);
	let className;
	let props;
	let t1;
	let t2;
	if ($[0] !== t0) {
		({className, align: t1, sideOffset: t2, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
		$[3] = t1;
		$[4] = t2;
	} else {
		className = $[1];
		props = $[2];
		t1 = $[3];
		t2 = $[4];
	}
	const align = t1 === void 0 ? "center" : t1;
	const sideOffset = t2 === void 0 ? 4 : t2;
	let t3;
	if ($[5] !== className) {
		t3 = cn("z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-4 rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className);
		$[5] = className;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== align || $[8] !== props || $[9] !== sideOffset || $[10] !== t3) {
		t4 = /* @__PURE__ */ jsx(Portal$1, { children: /* @__PURE__ */ jsx(Content2$1, {
			"data-slot": "popover-content",
			align,
			sideOffset,
			className: t3,
			...props
		}) });
		$[7] = align;
		$[8] = props;
		$[9] = sideOffset;
		$[10] = t3;
		$[11] = t4;
	} else t4 = $[11];
	return t4;
}
//#endregion
//#region src/components/ui/select.tsx
function Select(t0) {
	const $ = c(4);
	let props;
	if ($[0] !== t0) {
		({...props} = t0);
		$[0] = t0;
		$[1] = props;
	} else props = $[1];
	let t1;
	if ($[2] !== props) {
		t1 = /* @__PURE__ */ jsx(Root2, {
			"data-slot": "select",
			...props
		});
		$[2] = props;
		$[3] = t1;
	} else t1 = $[3];
	return t1;
}
function SelectValue(t0) {
	const $ = c(4);
	let props;
	if ($[0] !== t0) {
		({...props} = t0);
		$[0] = t0;
		$[1] = props;
	} else props = $[1];
	let t1;
	if ($[2] !== props) {
		t1 = /* @__PURE__ */ jsx(Value, {
			"data-slot": "select-value",
			...props
		});
		$[2] = props;
		$[3] = t1;
	} else t1 = $[3];
	return t1;
}
function SelectTrigger(t0) {
	const $ = c(13);
	let children;
	let className;
	let props;
	let t1;
	if ($[0] !== t0) {
		({className, size: t1, children, ...props} = t0);
		$[0] = t0;
		$[1] = children;
		$[2] = className;
		$[3] = props;
		$[4] = t1;
	} else {
		children = $[1];
		className = $[2];
		props = $[3];
		t1 = $[4];
	}
	const size = t1 === void 0 ? "default" : t1;
	let t2;
	if ($[5] !== className) {
		t2 = cn("flex w-fit items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className);
		$[5] = className;
		$[6] = t2;
	} else t2 = $[6];
	let t3;
	if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = /* @__PURE__ */ jsx(Icon, {
			asChild: true,
			children: /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none size-4 text-muted-foreground" })
		});
		$[7] = t3;
	} else t3 = $[7];
	let t4;
	if ($[8] !== children || $[9] !== props || $[10] !== size || $[11] !== t2) {
		t4 = /* @__PURE__ */ jsxs(Trigger, {
			"data-slot": "select-trigger",
			"data-size": size,
			className: t2,
			...props,
			children: [children, t3]
		});
		$[8] = children;
		$[9] = props;
		$[10] = size;
		$[11] = t2;
		$[12] = t4;
	} else t4 = $[12];
	return t4;
}
function SelectContent(t0) {
	const $ = c(24);
	let children;
	let className;
	let props;
	let t1;
	let t2;
	if ($[0] !== t0) {
		({className, children, position: t1, align: t2, ...props} = t0);
		$[0] = t0;
		$[1] = children;
		$[2] = className;
		$[3] = props;
		$[4] = t1;
		$[5] = t2;
	} else {
		children = $[1];
		className = $[2];
		props = $[3];
		t1 = $[4];
		t2 = $[5];
	}
	const position = t1 === void 0 ? "item-aligned" : t1;
	const align = t2 === void 0 ? "center" : t2;
	const t3 = position === "item-aligned";
	const t4 = position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1";
	let t5;
	if ($[6] !== className || $[7] !== t4) {
		t5 = cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", t4, className);
		$[6] = className;
		$[7] = t4;
		$[8] = t5;
	} else t5 = $[8];
	let t6;
	if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
		t6 = /* @__PURE__ */ jsx(SelectScrollUpButton, {});
		$[9] = t6;
	} else t6 = $[9];
	const t7 = position === "popper" && "";
	let t8;
	if ($[10] !== t7) {
		t8 = cn("data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)", t7);
		$[10] = t7;
		$[11] = t8;
	} else t8 = $[11];
	let t9;
	if ($[12] !== children || $[13] !== position || $[14] !== t8) {
		t9 = /* @__PURE__ */ jsx(Viewport, {
			"data-position": position,
			className: t8,
			children
		});
		$[12] = children;
		$[13] = position;
		$[14] = t8;
		$[15] = t9;
	} else t9 = $[15];
	let t10;
	if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
		t10 = /* @__PURE__ */ jsx(SelectScrollDownButton, {});
		$[16] = t10;
	} else t10 = $[16];
	let t11;
	if ($[17] !== align || $[18] !== position || $[19] !== props || $[20] !== t3 || $[21] !== t5 || $[22] !== t9) {
		t11 = /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsxs(Content2, {
			"data-slot": "select-content",
			"data-align-trigger": t3,
			className: t5,
			position,
			align,
			...props,
			children: [
				t6,
				t9,
				t10
			]
		}) });
		$[17] = align;
		$[18] = position;
		$[19] = props;
		$[20] = t3;
		$[21] = t5;
		$[22] = t9;
		$[23] = t11;
	} else t11 = $[23];
	return t11;
}
function SelectItem(t0) {
	const $ = c(13);
	let children;
	let className;
	let props;
	if ($[0] !== t0) {
		({className, children, ...props} = t0);
		$[0] = t0;
		$[1] = children;
		$[2] = className;
		$[3] = props;
	} else {
		children = $[1];
		className = $[2];
		props = $[3];
	}
	let t1;
	if ($[4] !== className) {
		t1 = cn("relative flex w-full cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className);
		$[4] = className;
		$[5] = t1;
	} else t1 = $[5];
	let t2;
	if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ jsx("span", {
			className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ jsx(ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "pointer-events-none" }) })
		});
		$[6] = t2;
	} else t2 = $[6];
	let t3;
	if ($[7] !== children) {
		t3 = /* @__PURE__ */ jsx(ItemText, { children });
		$[7] = children;
		$[8] = t3;
	} else t3 = $[8];
	let t4;
	if ($[9] !== props || $[10] !== t1 || $[11] !== t3) {
		t4 = /* @__PURE__ */ jsxs(Item, {
			"data-slot": "select-item",
			className: t1,
			...props,
			children: [t2, t3]
		});
		$[9] = props;
		$[10] = t1;
		$[11] = t3;
		$[12] = t4;
	} else t4 = $[12];
	return t4;
}
function SelectScrollUpButton(t0) {
	const $ = c(9);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ jsx(ChevronUp, {});
		$[5] = t2;
	} else t2 = $[5];
	let t3;
	if ($[6] !== props || $[7] !== t1) {
		t3 = /* @__PURE__ */ jsx(ScrollUpButton, {
			"data-slot": "select-scroll-up-button",
			className: t1,
			...props,
			children: t2
		});
		$[6] = props;
		$[7] = t1;
		$[8] = t3;
	} else t3 = $[8];
	return t3;
}
function SelectScrollDownButton(t0) {
	const $ = c(9);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ jsx(ChevronDown, {});
		$[5] = t2;
	} else t2 = $[5];
	let t3;
	if ($[6] !== props || $[7] !== t1) {
		t3 = /* @__PURE__ */ jsx(ScrollDownButton, {
			"data-slot": "select-scroll-down-button",
			className: t1,
			...props,
			children: t2
		});
		$[6] = props;
		$[7] = t1;
		$[8] = t3;
	} else t3 = $[8];
	return t3;
}
//#endregion
//#region src/components/ui/separator.tsx
function Separator(t0) {
	const $ = c(12);
	let className;
	let props;
	let t1;
	let t2;
	if ($[0] !== t0) {
		({className, orientation: t1, decorative: t2, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
		$[3] = t1;
		$[4] = t2;
	} else {
		className = $[1];
		props = $[2];
		t1 = $[3];
		t2 = $[4];
	}
	const orientation = t1 === void 0 ? "horizontal" : t1;
	const decorative = t2 === void 0 ? true : t2;
	let t3;
	if ($[5] !== className) {
		t3 = cn("shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch", className);
		$[5] = className;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== decorative || $[8] !== orientation || $[9] !== props || $[10] !== t3) {
		t4 = /* @__PURE__ */ jsx(Root, {
			"data-slot": "separator",
			decorative,
			orientation,
			className: t3,
			...props
		});
		$[7] = decorative;
		$[8] = orientation;
		$[9] = props;
		$[10] = t3;
		$[11] = t4;
	} else t4 = $[11];
	return t4;
}
//#endregion
//#region src/components/ui/table.tsx
function Table(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("w-full caption-bottom text-sm", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx("div", {
			"data-slot": "table-container",
			className: "relative w-full overflow-x-auto",
			children: /* @__PURE__ */ jsx("table", {
				"data-slot": "table",
				className: t1,
				...props
			})
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function TableHeader(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("[&_tr]:border-b", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx("thead", {
			"data-slot": "table-header",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function TableBody(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("[&_tr:last-child]:border-0", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx("tbody", {
			"data-slot": "table-body",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function TableRow(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx("tr", {
			"data-slot": "table-row",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function TableHead(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("h-12 px-3 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx("th", {
			"data-slot": "table-head",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
function TableCell(t0) {
	const $ = c(8);
	let className;
	let props;
	if ($[0] !== t0) {
		({className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
	} else {
		className = $[1];
		props = $[2];
	}
	let t1;
	if ($[3] !== className) {
		t1 = cn("p-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className);
		$[3] = className;
		$[4] = t1;
	} else t1 = $[4];
	let t2;
	if ($[5] !== props || $[6] !== t1) {
		t2 = /* @__PURE__ */ jsx("td", {
			"data-slot": "table-cell",
			className: t1,
			...props
		});
		$[5] = props;
		$[6] = t1;
		$[7] = t2;
	} else t2 = $[7];
	return t2;
}
//#endregion
//#region src/components/server-table.tsx
function ServerTableFilter(t0) {
	const $ = c(21);
	const { table, column } = t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ jsx(CirclePlus, { className: "mr-2 size-4" });
		$[0] = t1;
	} else t1 = $[0];
	let t2;
	if ($[1] !== column || $[2] !== table) {
		t2 = table.getFilteredValueItem(column) && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Separator, {
			orientation: "vertical",
			className: "mx-2 my-1! h-5!"
		}), /* @__PURE__ */ jsx(Badge, {
			variant: "secondary",
			className: "rounded-sm px-1 font-normal",
			children: table.getFilteredValueItem(column)?.label
		})] });
		$[1] = column;
		$[2] = table;
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== column.title || $[5] !== t2) {
		t3 = /* @__PURE__ */ jsx(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "h-8 border-dashed",
				children: [
					t1,
					column.title,
					t2
				]
			})
		});
		$[4] = column.title;
		$[5] = t2;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== column.title) {
		t4 = /* @__PURE__ */ jsx(CommandInput, { placeholder: column.title });
		$[7] = column.title;
		$[8] = t4;
	} else t4 = $[8];
	let t5;
	if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
		t5 = /* @__PURE__ */ jsx(CommandEmpty, { children: "无匹配项" });
		$[9] = t5;
	} else t5 = $[9];
	let t6;
	if ($[10] !== column || $[11] !== table) {
		t6 = column.filter?.map((option) => {
			const isSelected = table.getFilteredValue(column) === option.value;
			return /* @__PURE__ */ jsxs(CommandItem, {
				onSelect: () => table.setFilterState(column.index, isSelected ? void 0 : option.value),
				children: [
					/* @__PURE__ */ jsx("div", {
						className: cn("mr-2 flex size-4 items-center justify-center rounded-lg border", isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input [&_svg]:invisible"),
						children: /* @__PURE__ */ jsx(Check, { className: "size-3.5" })
					}),
					option.icon && /* @__PURE__ */ jsx(option.icon, { className: "mr-2 size-4 text-muted-foreground" }),
					/* @__PURE__ */ jsx("span", { children: option.label })
				]
			}, option.value);
		});
		$[10] = column;
		$[11] = table;
		$[12] = t6;
	} else t6 = $[12];
	let t7;
	if ($[13] !== t6) {
		t7 = /* @__PURE__ */ jsxs(CommandList, { children: [t5, /* @__PURE__ */ jsx(CommandGroup, { children: t6 })] });
		$[13] = t6;
		$[14] = t7;
	} else t7 = $[14];
	let t8;
	if ($[15] !== t4 || $[16] !== t7) {
		t8 = /* @__PURE__ */ jsx(PopoverContent, {
			className: "w-50 p-0",
			align: "start",
			children: /* @__PURE__ */ jsxs(Command, { children: [t4, t7] })
		});
		$[15] = t4;
		$[16] = t7;
		$[17] = t8;
	} else t8 = $[17];
	let t9;
	if ($[18] !== t3 || $[19] !== t8) {
		t9 = /* @__PURE__ */ jsxs(Popover, { children: [t3, t8] });
		$[18] = t3;
		$[19] = t8;
		$[20] = t9;
	} else t9 = $[20];
	return t9;
}
function ServerTableToolbar(t0) {
	const $ = c(21);
	const { table, actions, showSearch } = t0;
	let t1;
	if ($[0] !== showSearch || $[1] !== table) {
		t1 = showSearch && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Input, {
			"aria-label": "Search",
			placeholder: "搜索...",
			value: table.getSearch(),
			onChange: (event) => table.setNewSearch(event.target.value),
			className: "mx-1 h-8 w-37.5 border-border lg:w-62.5"
		}), !!table.getSearch() && /* @__PURE__ */ jsxs(Button, {
			variant: "secondary",
			size: "sm",
			onClick: () => table.setNewSearch(),
			className: "h-8 px-2 lg:px-3",
			children: ["重置", /* @__PURE__ */ jsx(X$1, { className: "ml-2 size-4" })]
		})] });
		$[0] = showSearch;
		$[1] = table;
		$[2] = t1;
	} else t1 = $[2];
	let t2;
	if ($[3] !== table) {
		t2 = table.getFilterableColumns().map((column) => /* @__PURE__ */ jsx(ServerTableFilter, {
			column,
			table
		}, column.index));
		$[3] = table;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== t1 || $[6] !== t2) {
		t3 = /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 items-center gap-2",
			children: [t1, t2]
		});
		$[5] = t1;
		$[6] = t2;
		$[7] = t3;
	} else t3 = $[7];
	let t4;
	if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
		t4 = /* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				className: "ml-auto hidden lg:flex",
				children: [/* @__PURE__ */ jsx(Settings2, { className: "mr-2 size-4" }), "视图"]
			})
		});
		$[8] = t4;
	} else t4 = $[8];
	let t5;
	let t6;
	if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
		t5 = /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "显示列" });
		t6 = /* @__PURE__ */ jsx(DropdownMenuSeparator, {});
		$[9] = t5;
		$[10] = t6;
	} else {
		t5 = $[9];
		t6 = $[10];
	}
	let t7;
	if ($[11] !== table) {
		t7 = table.getHideableColumns().map((column_0) => /* @__PURE__ */ jsx(DropdownMenuCheckboxItem, {
			className: "capitalize",
			checked: !column_0.hidden,
			onCheckedChange: (value) => {
				table.setColumnVisibleState(column_0.index, value);
			},
			children: column_0.title
		}, column_0.index));
		$[11] = table;
		$[12] = t7;
	} else t7 = $[12];
	let t8;
	if ($[13] !== t7) {
		t8 = /* @__PURE__ */ jsxs(DropdownMenu, { children: [t4, /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "end",
			className: "w-37.5",
			children: [
				t5,
				t6,
				t7
			]
		})] });
		$[13] = t7;
		$[14] = t8;
	} else t8 = $[14];
	let t9;
	if ($[15] !== actions || $[16] !== t8) {
		t9 = /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [t8, actions]
		});
		$[15] = actions;
		$[16] = t8;
		$[17] = t9;
	} else t9 = $[17];
	let t10;
	if ($[18] !== t3 || $[19] !== t9) {
		t10 = /* @__PURE__ */ jsx("div", {
			className: "rounded-lg py-2",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [t3, t9]
			})
		});
		$[18] = t3;
		$[19] = t9;
		$[20] = t10;
	} else t10 = $[20];
	return t10;
}
function ServerTableFooter(t0) {
	const $ = c(65);
	const { table, sizeOptions, showPageNumbers } = t0;
	let t1;
	if ($[0] !== table) {
		t1 = table.getSelectedRows() && table.getSelectedRows().length > 0 && /* @__PURE__ */ jsxs("div", {
			className: "text-sm text-muted-foreground",
			children: [
				"已勾选\xA0",
				table.getSelectedRows().length,
				"\xA0行，共\xA0",
				table.getPageRows(),
				"\xA0行"
			]
		});
		$[0] = table;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ jsx("p", {
			className: "text-sm font-medium",
			children: "每页数量"
		});
		$[2] = t2;
	} else t2 = $[2];
	let t3;
	if ($[3] !== table) {
		t3 = table.getSize();
		$[3] = table;
		$[4] = t3;
	} else t3 = $[4];
	const t4 = table.setNewSize;
	let t5;
	if ($[5] !== table) {
		t5 = table.getSize();
		$[5] = table;
		$[6] = t5;
	} else t5 = $[6];
	let t6;
	if ($[7] !== t5) {
		t6 = /* @__PURE__ */ jsx(SelectTrigger, {
			className: "h-8 w-17.5",
			children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t5 })
		});
		$[7] = t5;
		$[8] = t6;
	} else t6 = $[8];
	let t7;
	if ($[9] !== sizeOptions) {
		t7 = sizeOptions ?? [
			10,
			20,
			30,
			40,
			50
		];
		$[9] = sizeOptions;
		$[10] = t7;
	} else t7 = $[10];
	let t8;
	if ($[11] !== t7) {
		t8 = t7.map(_temp$1);
		$[11] = t7;
		$[12] = t8;
	} else t8 = $[12];
	let t9;
	if ($[13] !== t8) {
		t9 = /* @__PURE__ */ jsx(SelectContent, {
			side: "top",
			children: t8
		});
		$[13] = t8;
		$[14] = t9;
	} else t9 = $[14];
	let t10;
	if ($[15] !== t3 || $[16] !== t6 || $[17] !== t9 || $[18] !== table.setNewSize) {
		t10 = /* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-2",
			children: [t2, /* @__PURE__ */ jsxs(Select, {
				value: t3,
				onValueChange: t4,
				children: [t6, t9]
			})]
		});
		$[15] = t3;
		$[16] = t6;
		$[17] = t9;
		$[18] = table.setNewSize;
		$[19] = t10;
	} else t10 = $[19];
	let t11;
	if ($[20] !== t1 || $[21] !== t10) {
		t11 = /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-4",
			children: [t1, t10]
		});
		$[20] = t1;
		$[21] = t10;
		$[22] = t11;
	} else t11 = $[22];
	let t12;
	if ($[23] !== showPageNumbers || $[24] !== table) {
		t12 = !showPageNumbers && /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-center text-sm font-medium whitespace-nowrap",
			children: [
				"第\xA0",
				table.getPage(),
				"\xA0页，共\xA0",
				table.getTotalPage(),
				"\xA0页"
			]
		});
		$[23] = showPageNumbers;
		$[24] = table;
		$[25] = t12;
	} else t12 = $[25];
	let t13;
	if ($[26] !== table) {
		t13 = () => table.setNewPage(1);
		$[26] = table;
		$[27] = t13;
	} else t13 = $[27];
	const t14 = table.getPage() <= 1;
	let t15;
	let t16;
	if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
		t15 = /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "第一页"
		});
		t16 = /* @__PURE__ */ jsx(ChevronsLeft, { className: "size-4" });
		$[28] = t15;
		$[29] = t16;
	} else {
		t15 = $[28];
		t16 = $[29];
	}
	let t17;
	if ($[30] !== t13 || $[31] !== t14) {
		t17 = /* @__PURE__ */ jsxs(Button, {
			size: "icon",
			variant: "outline",
			className: "size-8",
			onClick: t13,
			disabled: t14,
			children: [t15, t16]
		});
		$[30] = t13;
		$[31] = t14;
		$[32] = t17;
	} else t17 = $[32];
	let t18;
	if ($[33] !== table) {
		t18 = () => table.setNewPage(table.getPage() - 1);
		$[33] = table;
		$[34] = t18;
	} else t18 = $[34];
	const t19 = table.getPage() <= 1;
	let t20;
	let t21;
	if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
		t20 = /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "上一页"
		});
		t21 = /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" });
		$[35] = t20;
		$[36] = t21;
	} else {
		t20 = $[35];
		t21 = $[36];
	}
	let t22;
	if ($[37] !== t18 || $[38] !== t19) {
		t22 = /* @__PURE__ */ jsxs(Button, {
			size: "icon",
			variant: "outline",
			className: "size-8",
			onClick: t18,
			disabled: t19,
			children: [t20, t21]
		});
		$[37] = t18;
		$[38] = t19;
		$[39] = t22;
	} else t22 = $[39];
	let t23;
	if ($[40] !== table) {
		t23 = () => table.setNewPage(table.getPage() + 1);
		$[40] = table;
		$[41] = t23;
	} else t23 = $[41];
	const t24 = table.getPage() >= table.getTotalPage();
	let t25;
	let t26;
	if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
		t25 = /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "下一页"
		});
		t26 = /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" });
		$[42] = t25;
		$[43] = t26;
	} else {
		t25 = $[42];
		t26 = $[43];
	}
	let t27;
	if ($[44] !== t23 || $[45] !== t24) {
		t27 = /* @__PURE__ */ jsxs(Button, {
			size: "icon",
			variant: "outline",
			className: "size-8",
			onClick: t23,
			disabled: t24,
			children: [t25, t26]
		});
		$[44] = t23;
		$[45] = t24;
		$[46] = t27;
	} else t27 = $[46];
	let t28;
	if ($[47] !== table) {
		t28 = () => table.setNewPage(table.getTotalPage());
		$[47] = table;
		$[48] = t28;
	} else t28 = $[48];
	const t29 = table.getPage() >= table.getTotalPage();
	let t30;
	let t31;
	if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
		t30 = /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "最后页"
		});
		t31 = /* @__PURE__ */ jsx(ChevronsRight, { className: "size-4" });
		$[49] = t30;
		$[50] = t31;
	} else {
		t30 = $[49];
		t31 = $[50];
	}
	let t32;
	if ($[51] !== t28 || $[52] !== t29) {
		t32 = /* @__PURE__ */ jsxs(Button, {
			size: "icon",
			variant: "outline",
			className: "size-8",
			onClick: t28,
			disabled: t29,
			children: [t30, t31]
		});
		$[51] = t28;
		$[52] = t29;
		$[53] = t32;
	} else t32 = $[53];
	let t33;
	if ($[54] !== t17 || $[55] !== t22 || $[56] !== t27 || $[57] !== t32) {
		t33 = /* @__PURE__ */ jsx("div", {
			className: "flex items-center space-x-2",
			children: /* @__PURE__ */ jsxs(Fragment, { children: [
				t17,
				t22,
				t27,
				t32
			] })
		});
		$[54] = t17;
		$[55] = t22;
		$[56] = t27;
		$[57] = t32;
		$[58] = t33;
	} else t33 = $[58];
	let t34;
	if ($[59] !== t12 || $[60] !== t33) {
		t34 = /* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-6 lg:space-x-8",
			children: [t12, t33]
		});
		$[59] = t12;
		$[60] = t33;
		$[61] = t34;
	} else t34 = $[61];
	let t35;
	if ($[62] !== t11 || $[63] !== t34) {
		t35 = /* @__PURE__ */ jsx("div", {
			className: "rounded-lg py-2",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between px-2",
				children: [t11, t34]
			})
		});
		$[62] = t11;
		$[63] = t34;
		$[64] = t35;
	} else t35 = $[64];
	return t35;
}
function _temp$1(pageSize) {
	return /* @__PURE__ */ jsx(SelectItem, {
		value: `${pageSize}`,
		children: pageSize
	}, pageSize);
}
function ServerTableTitle(t0) {
	const $ = c(38);
	const { column, table } = t0;
	if (!column.sortable) {
		let t1;
		if ($[0] !== column) {
			t1 = column.titleRender ? column.titleRender() : column.title;
			$[0] = column;
			$[1] = t1;
		} else t1 = $[1];
		return t1;
	}
	let t1;
	if ($[2] !== column) {
		t1 = column.titleRender ? column.titleRender() : column.title;
		$[2] = column;
		$[3] = t1;
	} else t1 = $[3];
	let t2;
	if ($[4] !== t1) {
		t2 = /* @__PURE__ */ jsx("span", { children: t1 });
		$[4] = t1;
		$[5] = t2;
	} else t2 = $[5];
	let t3;
	if ($[6] !== column || $[7] !== table) {
		t3 = table.getColumnSortDirection(column) === "desc" ? /* @__PURE__ */ jsx(ArrowDown, { className: "ml-2 size-4" }) : table.getColumnSortDirection(column) === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "ml-2 size-4" }) : /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-2 size-4" });
		$[6] = column;
		$[7] = table;
		$[8] = t3;
	} else t3 = $[8];
	let t4;
	if ($[9] !== t2 || $[10] !== t3) {
		t4 = /* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "sm",
				className: "-ml-3 h-8 data-[state=open]:bg-accent",
				children: [t2, t3]
			})
		});
		$[9] = t2;
		$[10] = t3;
		$[11] = t4;
	} else t4 = $[11];
	let t5;
	if ($[12] !== column.index || $[13] !== table) {
		t5 = () => table.setSortState(column.index, "asc");
		$[12] = column.index;
		$[13] = table;
		$[14] = t5;
	} else t5 = $[14];
	let t6;
	if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
		t6 = /* @__PURE__ */ jsx(ArrowUp, { className: "mr-2 size-3.5 text-muted-foreground/70" });
		$[15] = t6;
	} else t6 = $[15];
	let t7;
	if ($[16] !== t5) {
		t7 = /* @__PURE__ */ jsxs(DropdownMenuItem, {
			onClick: t5,
			children: [t6, "从小到大（升序）"]
		});
		$[16] = t5;
		$[17] = t7;
	} else t7 = $[17];
	let t8;
	if ($[18] !== column.index || $[19] !== table) {
		t8 = () => table.setSortState(column.index, "desc");
		$[18] = column.index;
		$[19] = table;
		$[20] = t8;
	} else t8 = $[20];
	let t9;
	if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
		t9 = /* @__PURE__ */ jsx(ArrowDown, { className: "mr-2 size-3.5 text-muted-foreground/70" });
		$[21] = t9;
	} else t9 = $[21];
	let t10;
	if ($[22] !== t8) {
		t10 = /* @__PURE__ */ jsxs(DropdownMenuItem, {
			onClick: t8,
			children: [t9, "从大到小（降序）"]
		});
		$[22] = t8;
		$[23] = t10;
	} else t10 = $[23];
	let t11;
	if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
		t11 = /* @__PURE__ */ jsx(DropdownMenuSeparator, {});
		$[24] = t11;
	} else t11 = $[24];
	let t12;
	if ($[25] !== column.index || $[26] !== table) {
		t12 = () => table.setSortState(column.index);
		$[25] = column.index;
		$[26] = table;
		$[27] = t12;
	} else t12 = $[27];
	let t13;
	if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
		t13 = /* @__PURE__ */ jsx(X$1, { className: "mr-2 size-3.5 text-muted-foreground/70" });
		$[28] = t13;
	} else t13 = $[28];
	let t14;
	if ($[29] !== t12) {
		t14 = /* @__PURE__ */ jsxs(DropdownMenuItem, {
			onClick: t12,
			children: [t13, "取消"]
		});
		$[29] = t12;
		$[30] = t14;
	} else t14 = $[30];
	let t15;
	if ($[31] !== t10 || $[32] !== t14 || $[33] !== t7) {
		t15 = /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "start",
			children: [
				t7,
				t10,
				t11,
				t14
			]
		});
		$[31] = t10;
		$[32] = t14;
		$[33] = t7;
		$[34] = t15;
	} else t15 = $[34];
	let t16;
	if ($[35] !== t15 || $[36] !== t4) {
		t16 = /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2",
			children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [t4, t15] })
		});
		$[35] = t15;
		$[36] = t4;
		$[37] = t16;
	} else t16 = $[37];
	return t16;
}
function ServerTable(t0) {
	const $ = c(47);
	let { rowKey, columns, request, sizeOptions, onRowSelection, toolbarAction, className, showSearch: t1, showPageNumbers: t2 } = t0;
	const showSearch = t1 === void 0 ? true : t1;
	const showPageNumbers = t2 === void 0 ? false : t2;
	rowKey = rowKey ?? "id";
	let t3;
	if ($[0] !== columns || $[1] !== onRowSelection || $[2] !== request || $[3] !== rowKey) {
		t3 = {
			rowKey,
			columns,
			request,
			onRowSelection
		};
		$[0] = columns;
		$[1] = onRowSelection;
		$[2] = request;
		$[3] = rowKey;
		$[4] = t3;
	} else t3 = $[4];
	const table = useServerTable(t3);
	let T0;
	let T1;
	let t4;
	let t5;
	let t6;
	let t7;
	let t8;
	let t9;
	if ($[5] !== className || $[6] !== columns || $[7] !== onRowSelection || $[8] !== showSearch || $[9] !== table || $[10] !== toolbarAction) {
		const renderedColumns = onRowSelection ? [{
			index: "select",
			titleRender: () => /* @__PURE__ */ jsx(Checkbox, {
				checked: table.getRowSelectedAllState(),
				onCheckedChange: (value) => table.setRowSelectedAllState(!!value)
			}),
			tableRowRender: (data) => /* @__PURE__ */ jsx(Checkbox, {
				checked: table.getRowSelectedState(data),
				onCheckedChange: (value_0) => table.setRowSelectedState(data, value_0)
			})
		}, ...table.getColumns()] : table.getColumns();
		if ($[19] !== className) {
			t8 = cn(className, "w-full space-y-4");
			$[19] = className;
			$[20] = t8;
		} else t8 = $[20];
		if ($[21] !== showSearch || $[22] !== table || $[23] !== toolbarAction) {
			t9 = /* @__PURE__ */ jsx(ServerTableToolbar, {
				table,
				actions: toolbarAction,
				showSearch
			});
			$[21] = showSearch;
			$[22] = table;
			$[23] = toolbarAction;
			$[24] = t9;
		} else t9 = $[24];
		t7 = "overflow-hidden rounded-3xl border";
		T1 = Table;
		t5 = "";
		let t10;
		if ($[25] !== table) {
			t10 = (column, index) => /* @__PURE__ */ jsx(TableHead, {
				id: column.index,
				colSpan: column.colSpan,
				children: /* @__PURE__ */ jsx(ServerTableTitle, {
					column,
					table
				})
			}, index);
			$[25] = table;
			$[26] = t10;
		} else t10 = $[26];
		t6 = /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsx(TableRow, { children: renderedColumns.map(t10) }) });
		T0 = TableBody;
		t4 = table.getData().length ? table.getData().map((item, index_0) => /* @__PURE__ */ jsx(TableRow, { children: renderedColumns.map((column_0) => /* @__PURE__ */ jsx(TableCell, {
			colSpan: column_0.colSpan,
			children: column_0.tableRowRender ? column_0.tableRowRender(item) : column_0.dataKey ? import_lodash.default.get(item, column_0.dataKey) ?? "-" : "-"
		}, column_0.index)) }, index_0)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
			colSpan: columns.length,
			className: "h-24 text-center",
			children: "暂无数据"
		}) });
		$[5] = className;
		$[6] = columns;
		$[7] = onRowSelection;
		$[8] = showSearch;
		$[9] = table;
		$[10] = toolbarAction;
		$[11] = T0;
		$[12] = T1;
		$[13] = t4;
		$[14] = t5;
		$[15] = t6;
		$[16] = t7;
		$[17] = t8;
		$[18] = t9;
	} else {
		T0 = $[11];
		T1 = $[12];
		t4 = $[13];
		t5 = $[14];
		t6 = $[15];
		t7 = $[16];
		t8 = $[17];
		t9 = $[18];
	}
	let t10;
	if ($[27] !== T0 || $[28] !== t4) {
		t10 = /* @__PURE__ */ jsx(T0, { children: t4 });
		$[27] = T0;
		$[28] = t4;
		$[29] = t10;
	} else t10 = $[29];
	let t11;
	if ($[30] !== T1 || $[31] !== t10 || $[32] !== t5 || $[33] !== t6) {
		t11 = /* @__PURE__ */ jsxs(T1, {
			className: t5,
			children: [t6, t10]
		});
		$[30] = T1;
		$[31] = t10;
		$[32] = t5;
		$[33] = t6;
		$[34] = t11;
	} else t11 = $[34];
	let t12;
	if ($[35] !== t11 || $[36] !== t7) {
		t12 = /* @__PURE__ */ jsx("div", {
			className: t7,
			children: t11
		});
		$[35] = t11;
		$[36] = t7;
		$[37] = t12;
	} else t12 = $[37];
	let t13;
	if ($[38] !== showPageNumbers || $[39] !== sizeOptions || $[40] !== table) {
		t13 = /* @__PURE__ */ jsx(ServerTableFooter, {
			table,
			sizeOptions,
			showPageNumbers
		});
		$[38] = showPageNumbers;
		$[39] = sizeOptions;
		$[40] = table;
		$[41] = t13;
	} else t13 = $[41];
	let t14;
	if ($[42] !== t12 || $[43] !== t13 || $[44] !== t8 || $[45] !== t9) {
		t14 = /* @__PURE__ */ jsxs("div", {
			className: t8,
			children: [
				t9,
				t12,
				t13
			]
		});
		$[42] = t12;
		$[43] = t13;
		$[44] = t8;
		$[45] = t9;
		$[46] = t14;
	} else t14 = $[46];
	return t14;
}
//#endregion
//#region src/hooks/use-simple-table.ts
function useSimpleTable(t0) {
	const $ = c(42);
	const { data, defaultPageSize: t1 } = t0;
	const [pageSize, setPageSize] = useState(t1 === void 0 ? 10 : t1);
	const [currentPage, setCurrentPage] = useState(1);
	let t2;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = function onPageSizeChange(newPageSize) {
			setPageSize(Number(newPageSize));
			setCurrentPage(1);
		};
		$[0] = t2;
	} else t2 = $[0];
	const onPageSizeChange = t2;
	let t3;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = function onCurrentPageChange(newCurrentPage) {
			setCurrentPage(newCurrentPage);
		};
		$[1] = t3;
	} else t3 = $[1];
	const onCurrentPageChange = t3;
	let t4;
	if ($[2] !== pageSize) {
		t4 = function getPageSize() {
			return `${pageSize}`;
		};
		$[2] = pageSize;
		$[3] = t4;
	} else t4 = $[3];
	const getPageSize = t4;
	let t5;
	if ($[4] !== data || $[5] !== pageSize) {
		t5 = function getTotalPage() {
			return data.length === 0 ? 1 : Math.ceil(data.length / pageSize);
		};
		$[4] = data;
		$[5] = pageSize;
		$[6] = t5;
	} else t5 = $[6];
	const getTotalPage = t5;
	let t6;
	if ($[7] !== currentPage) {
		t6 = function getCurrentPage() {
			return currentPage;
		};
		$[7] = currentPage;
		$[8] = t6;
	} else t6 = $[8];
	const getCurrentPage = t6;
	let t7;
	if ($[9] !== currentPage || $[10] !== data || $[11] !== pageSize) {
		t7 = function getCurrentPageData() {
			return data.slice(pageSize * (currentPage - 1), pageSize * currentPage);
		};
		$[9] = currentPage;
		$[10] = data;
		$[11] = pageSize;
		$[12] = t7;
	} else t7 = $[12];
	const getCurrentPageData = t7;
	let t8;
	if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
		t8 = function toFirstPage() {
			onCurrentPageChange(1);
		};
		$[13] = t8;
	} else t8 = $[13];
	const toFirstPage = t8;
	let t9;
	if ($[14] !== getCurrentPage) {
		t9 = function disableFirstPage() {
			return getCurrentPage() === 1;
		};
		$[14] = getCurrentPage;
		$[15] = t9;
	} else t9 = $[15];
	const disableFirstPage = t9;
	let t10;
	if ($[16] !== getTotalPage) {
		t10 = function toLastPage() {
			onCurrentPageChange(getTotalPage());
		};
		$[16] = getTotalPage;
		$[17] = t10;
	} else t10 = $[17];
	const toLastPage = t10;
	let t11;
	if ($[18] !== getCurrentPage || $[19] !== getTotalPage) {
		t11 = function disableLastPage() {
			return getCurrentPage() === getTotalPage();
		};
		$[18] = getCurrentPage;
		$[19] = getTotalPage;
		$[20] = t11;
	} else t11 = $[20];
	const disableLastPage = t11;
	let t12;
	if ($[21] !== getCurrentPage) {
		t12 = function toPrevPage() {
			onCurrentPageChange(getCurrentPage() - 1);
		};
		$[21] = getCurrentPage;
		$[22] = t12;
	} else t12 = $[22];
	const toPrevPage = t12;
	let t13;
	if ($[23] !== getCurrentPage) {
		t13 = function disablePrevPage() {
			return getCurrentPage() === 1;
		};
		$[23] = getCurrentPage;
		$[24] = t13;
	} else t13 = $[24];
	const disablePrevPage = t13;
	let t14;
	if ($[25] !== getCurrentPage) {
		t14 = function toNextPage() {
			onCurrentPageChange(getCurrentPage() + 1);
		};
		$[25] = getCurrentPage;
		$[26] = t14;
	} else t14 = $[26];
	const toNextPage = t14;
	let t15;
	if ($[27] !== getCurrentPage || $[28] !== getTotalPage) {
		t15 = function disableNextPage() {
			return getCurrentPage() === getTotalPage();
		};
		$[27] = getCurrentPage;
		$[28] = getTotalPage;
		$[29] = t15;
	} else t15 = $[29];
	const disableNextPage = t15;
	let t16;
	if ($[30] !== disableFirstPage || $[31] !== disableLastPage || $[32] !== disableNextPage || $[33] !== disablePrevPage || $[34] !== getCurrentPage || $[35] !== getCurrentPageData || $[36] !== getPageSize || $[37] !== getTotalPage || $[38] !== toLastPage || $[39] !== toNextPage || $[40] !== toPrevPage) {
		t16 = {
			onPageSizeChange,
			getPageSize,
			getTotalPage,
			getCurrentPage,
			getCurrentPageData,
			toFirstPage,
			disableFirstPage,
			toLastPage,
			disableLastPage,
			toPrevPage,
			disablePrevPage,
			toNextPage,
			disableNextPage
		};
		$[30] = disableFirstPage;
		$[31] = disableLastPage;
		$[32] = disableNextPage;
		$[33] = disablePrevPage;
		$[34] = getCurrentPage;
		$[35] = getCurrentPageData;
		$[36] = getPageSize;
		$[37] = getTotalPage;
		$[38] = toLastPage;
		$[39] = toNextPage;
		$[40] = toPrevPage;
		$[41] = t16;
	} else t16 = $[41];
	return t16;
}
//#endregion
//#region src/components/simple-table.tsx
function SimpleTable(t0) {
	const $ = c(86);
	const { data, columns, sizeOptions, className } = t0;
	let t1;
	if ($[0] !== data) {
		t1 = data ?? [];
		$[0] = data;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== t1) {
		t2 = { data: t1 };
		$[2] = t1;
		$[3] = t2;
	} else t2 = $[3];
	const table = useSimpleTable(t2);
	let t3;
	if ($[4] !== className) {
		t3 = cn(className, "w-full space-y-4");
		$[4] = className;
		$[5] = t3;
	} else t3 = $[5];
	let t4;
	if ($[6] !== columns) {
		t4 = columns.map(_temp);
		$[6] = columns;
		$[7] = t4;
	} else t4 = $[7];
	let t5;
	if ($[8] !== t4) {
		t5 = /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsx(TableRow, { children: t4 }) });
		$[8] = t4;
		$[9] = t5;
	} else t5 = $[9];
	let t6;
	if ($[10] !== columns || $[11] !== table) {
		t6 = table.getCurrentPageData()?.length ? table.getCurrentPageData().map((item, index_0) => /* @__PURE__ */ jsx(TableRow, { children: columns.map((column_0) => /* @__PURE__ */ jsx(TableCell, {
			colSpan: column_0.colSpan,
			children: column_0.tableRowRender ? column_0.tableRowRender(item) : column_0.dataKey ? import_lodash.default.get(item, column_0.dataKey) ?? "-" : "-"
		}, column_0.index)) }, index_0)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
			colSpan: columns.length,
			className: "h-24 text-center",
			children: "暂无数据"
		}) });
		$[10] = columns;
		$[11] = table;
		$[12] = t6;
	} else t6 = $[12];
	let t7;
	if ($[13] !== t6) {
		t7 = /* @__PURE__ */ jsx(TableBody, { children: t6 });
		$[13] = t6;
		$[14] = t7;
	} else t7 = $[14];
	let t8;
	if ($[15] !== t5 || $[16] !== t7) {
		t8 = /* @__PURE__ */ jsx("div", {
			className: "overflow-hidden rounded-3xl border",
			children: /* @__PURE__ */ jsxs(Table, {
				className: "",
				children: [t5, t7]
			})
		});
		$[15] = t5;
		$[16] = t7;
		$[17] = t8;
	} else t8 = $[17];
	let t9;
	if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
		t9 = /* @__PURE__ */ jsx("p", {
			className: "text-sm font-medium",
			children: "每页数量"
		});
		$[18] = t9;
	} else t9 = $[18];
	let t10;
	if ($[19] !== table) {
		t10 = table.getPageSize();
		$[19] = table;
		$[20] = t10;
	} else t10 = $[20];
	const t11 = table.onPageSizeChange;
	let t12;
	if ($[21] !== table) {
		t12 = table.getPageSize();
		$[21] = table;
		$[22] = t12;
	} else t12 = $[22];
	let t13;
	if ($[23] !== t12) {
		t13 = /* @__PURE__ */ jsx(SelectTrigger, {
			className: "h-8 w-17.5",
			children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t12 })
		});
		$[23] = t12;
		$[24] = t13;
	} else t13 = $[24];
	let t14;
	if ($[25] !== sizeOptions) {
		t14 = sizeOptions ?? [
			10,
			20,
			30,
			40,
			50
		];
		$[25] = sizeOptions;
		$[26] = t14;
	} else t14 = $[26];
	let t15;
	if ($[27] !== t14) {
		t15 = t14.map(_temp2);
		$[27] = t14;
		$[28] = t15;
	} else t15 = $[28];
	let t16;
	if ($[29] !== t15) {
		t16 = /* @__PURE__ */ jsx(SelectContent, {
			side: "top",
			children: t15
		});
		$[29] = t15;
		$[30] = t16;
	} else t16 = $[30];
	let t17;
	if ($[31] !== t10 || $[32] !== t13 || $[33] !== t16 || $[34] !== table.onPageSizeChange) {
		t17 = /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center space-x-2",
				children: [t9, /* @__PURE__ */ jsxs(Select, {
					value: t10,
					onValueChange: t11,
					children: [t13, t16]
				})]
			})
		});
		$[31] = t10;
		$[32] = t13;
		$[33] = t16;
		$[34] = table.onPageSizeChange;
		$[35] = t17;
	} else t17 = $[35];
	let t18;
	if ($[36] !== table) {
		t18 = table.getCurrentPage();
		$[36] = table;
		$[37] = t18;
	} else t18 = $[37];
	let t19;
	if ($[38] !== table) {
		t19 = table.getTotalPage();
		$[38] = table;
		$[39] = t19;
	} else t19 = $[39];
	let t20;
	if ($[40] !== t18 || $[41] !== t19) {
		t20 = /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-center text-sm font-medium whitespace-nowrap",
			children: [
				"第\xA0",
				t18,
				"\xA0页，共\xA0",
				t19,
				"\xA0页"
			]
		});
		$[40] = t18;
		$[41] = t19;
		$[42] = t20;
	} else t20 = $[42];
	const t21 = table.toFirstPage;
	let t22;
	if ($[43] !== table) {
		t22 = table.disableFirstPage();
		$[43] = table;
		$[44] = t22;
	} else t22 = $[44];
	let t23;
	let t24;
	if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
		t23 = /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "第一页"
		});
		t24 = /* @__PURE__ */ jsx(ChevronsLeft, { className: "size-4" });
		$[45] = t23;
		$[46] = t24;
	} else {
		t23 = $[45];
		t24 = $[46];
	}
	let t25;
	if ($[47] !== t22 || $[48] !== table.toFirstPage) {
		t25 = /* @__PURE__ */ jsxs(Button, {
			size: "icon",
			variant: "outline",
			className: "size-8",
			onClick: t21,
			disabled: t22,
			children: [t23, t24]
		});
		$[47] = t22;
		$[48] = table.toFirstPage;
		$[49] = t25;
	} else t25 = $[49];
	const t26 = table.toPrevPage;
	let t27;
	if ($[50] !== table) {
		t27 = table.disablePrevPage();
		$[50] = table;
		$[51] = t27;
	} else t27 = $[51];
	let t28;
	let t29;
	if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
		t28 = /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "上一页"
		});
		t29 = /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" });
		$[52] = t28;
		$[53] = t29;
	} else {
		t28 = $[52];
		t29 = $[53];
	}
	let t30;
	if ($[54] !== t27 || $[55] !== table.toPrevPage) {
		t30 = /* @__PURE__ */ jsxs(Button, {
			size: "icon",
			variant: "outline",
			className: "size-8",
			onClick: t26,
			disabled: t27,
			children: [t28, t29]
		});
		$[54] = t27;
		$[55] = table.toPrevPage;
		$[56] = t30;
	} else t30 = $[56];
	const t31 = table.toNextPage;
	let t32;
	if ($[57] !== table) {
		t32 = table.disableNextPage();
		$[57] = table;
		$[58] = t32;
	} else t32 = $[58];
	let t33;
	let t34;
	if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
		t33 = /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "下一页"
		});
		t34 = /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" });
		$[59] = t33;
		$[60] = t34;
	} else {
		t33 = $[59];
		t34 = $[60];
	}
	let t35;
	if ($[61] !== t32 || $[62] !== table.toNextPage) {
		t35 = /* @__PURE__ */ jsxs(Button, {
			size: "icon",
			variant: "outline",
			className: "size-8",
			onClick: t31,
			disabled: t32,
			children: [t33, t34]
		});
		$[61] = t32;
		$[62] = table.toNextPage;
		$[63] = t35;
	} else t35 = $[63];
	const t36 = table.toLastPage;
	let t37;
	if ($[64] !== table) {
		t37 = table.disableLastPage();
		$[64] = table;
		$[65] = t37;
	} else t37 = $[65];
	let t38;
	let t39;
	if ($[66] === Symbol.for("react.memo_cache_sentinel")) {
		t38 = /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "最后页"
		});
		t39 = /* @__PURE__ */ jsx(ChevronsRight, { className: "size-4" });
		$[66] = t38;
		$[67] = t39;
	} else {
		t38 = $[66];
		t39 = $[67];
	}
	let t40;
	if ($[68] !== t37 || $[69] !== table.toLastPage) {
		t40 = /* @__PURE__ */ jsxs(Button, {
			size: "icon",
			variant: "outline",
			className: "size-8",
			onClick: t36,
			disabled: t37,
			children: [t38, t39]
		});
		$[68] = t37;
		$[69] = table.toLastPage;
		$[70] = t40;
	} else t40 = $[70];
	let t41;
	if ($[71] !== t25 || $[72] !== t30 || $[73] !== t35 || $[74] !== t40) {
		t41 = /* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-2",
			children: [
				t25,
				t30,
				t35,
				t40
			]
		});
		$[71] = t25;
		$[72] = t30;
		$[73] = t35;
		$[74] = t40;
		$[75] = t41;
	} else t41 = $[75];
	let t42;
	if ($[76] !== t20 || $[77] !== t41) {
		t42 = /* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-6 lg:space-x-8",
			children: [t20, t41]
		});
		$[76] = t20;
		$[77] = t41;
		$[78] = t42;
	} else t42 = $[78];
	let t43;
	if ($[79] !== t17 || $[80] !== t42) {
		t43 = /* @__PURE__ */ jsx("div", {
			className: "rounded-lg py-2",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between px-2",
				children: [t17, t42]
			})
		});
		$[79] = t17;
		$[80] = t42;
		$[81] = t43;
	} else t43 = $[81];
	let t44;
	if ($[82] !== t3 || $[83] !== t43 || $[84] !== t8) {
		t44 = /* @__PURE__ */ jsxs("div", {
			className: t3,
			children: [t8, t43]
		});
		$[82] = t3;
		$[83] = t43;
		$[84] = t8;
		$[85] = t44;
	} else t44 = $[85];
	return t44;
}
function _temp2(pageSize) {
	return /* @__PURE__ */ jsx(SelectItem, {
		value: `${pageSize}`,
		children: pageSize
	}, pageSize);
}
function _temp(column, index) {
	return /* @__PURE__ */ jsx(TableHead, {
		id: column.index,
		colSpan: column.colSpan,
		children: column.titleRender ? column.titleRender() : column.title
	}, index);
}
//#endregion
export { ServerTable, SimpleTable, defineColumns };

//# sourceMappingURL=index.js.map