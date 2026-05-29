const __pluginConfig =  {
  "name": "windy-plugin-fieldguard",
  "version": "2.1.5",
  "icon": "🧪",
  "title": "FieldGuard TEST",
  "description": "Diagnostic test build — not for production.",
  "author": "FieldGuard HSE",
  "repository": "https://github.com/FieldGuard365/windy-plugin-fieldguard",
  "desktopUI": "embedded",
  "mobileUI": "small",
  "routerPath": "/fieldguard/:lat?/:lon?",
  "listenToLocationChange": true,
  "built": 1780062583136,
  "builtReadable": "2026-05-29T13:49:43.136Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import windyInit from '@windy/init';
const windyInit = W.init;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	if (value == null) {
		node.style.removeProperty(key);
	} else {
		node.style.setProperty(key, value, '');
	}
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

/* src\plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-1y1ilj4", ".fg-test.svelte-1y1ilj4{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;font-size:11px;background:#0a0f1e;border:2px solid #22c55e;border-radius:8px;overflow:hidden;width:100%;color:#e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.7)}.fg-test-head.svelte-1y1ilj4{background:#064e3b;color:#4ade80;font-weight:800;font-size:12px;padding:8px 12px;border-bottom:1px solid #22c55e;display:flex;align-items:center;justify-content:space-between}.fg-test-v.svelte-1y1ilj4{font-size:9px;background:#022c22;padding:2px 6px;border-radius:3px;color:#86efac}.fg-test-row.svelte-1y1ilj4{display:flex;align-items:flex-start;gap:8px;padding:5px 12px;border-bottom:1px solid rgba(255,255,255,0.05)}.fg-test-lbl.svelte-1y1ilj4{flex-shrink:0;width:120px;color:#64748b;font-size:10px}.fg-test-val.svelte-1y1ilj4{flex:1;color:#94a3b8;font-size:10px;word-break:break-all}.fg-test-divider.svelte-1y1ilj4{height:1px;background:#1e293b;margin:4px 0}.fg-test-btn.svelte-1y1ilj4{display:block;width:calc(50% - 12px);margin:6px 6px 0;padding:6px;background:#166534;border:1px solid #22c55e;color:#4ade80;border-radius:5px;font-size:10px;font-weight:700;cursor:pointer;float:left}.fg-test-btn-sec.svelte-1y1ilj4{background:#1e3a5f;border-color:#3b82f6;color:#93c5fd}.fg-test-btn.svelte-1y1ilj4:last-of-type{margin-bottom:6px}.fg-test-log.svelte-1y1ilj4{clear:both;background:#020817;border-top:1px solid #1e293b;padding:6px 10px;max-height:150px;overflow-y:auto}.fg-test-log-row.svelte-1y1ilj4{font-size:9px;padding:1px 0;font-family:monospace;white-space:pre-wrap;word-break:break-all}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	return child_ctx;
}

// (59:2) {#if log.length > 0}
function create_if_block(ctx) {
	let div;
	let each_value = ensure_array_like(/*log*/ ctx[7]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "fg-test-log svelte-1y1ilj4");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty & /*log*/ 128) {
				each_value = ensure_array_like(/*log*/ ctx[7]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (61:6) {#each log as entry}
function create_each_block(ctx) {
	let div;
	let t0_value = (/*entry*/ ctx[14].ok ? '✓' : '✗') + "";
	let t0;
	let t1;
	let t2_value = /*entry*/ ctx[14].msg + "";
	let t2;

	return {
		c() {
			div = element("div");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			attr(div, "class", "fg-test-log-row svelte-1y1ilj4");
			set_style(div, "color", /*entry*/ ctx[14].ok ? '#4ade80' : '#f87171');
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*log*/ 128 && t0_value !== (t0_value = (/*entry*/ ctx[14].ok ? '✓' : '✗') + "")) set_data(t0, t0_value);
			if (dirty & /*log*/ 128 && t2_value !== (t2_value = /*entry*/ ctx[14].msg + "")) set_data(t2, t2_value);

			if (dirty & /*log*/ 128) {
				set_style(div, "color", /*entry*/ ctx[14].ok ? '#4ade80' : '#f87171');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function create_fragment(ctx) {
	let div10;
	let div0;
	let t2;
	let div1;
	let t6;
	let div2;
	let t10;
	let div3;
	let span5;
	let t12;
	let span6;
	let t13_value = /*lat*/ ctx[0].toFixed(4) + "";
	let t13;
	let t14;
	let t15_value = /*lon*/ ctx[1].toFixed(4) + "";
	let t15;
	let t16;
	let div4;
	let span7;
	let t18;
	let span8;
	let t19;
	let t20;
	let div5;
	let span9;
	let t22;
	let span10;
	let t23;
	let t24;
	let div6;
	let span11;
	let t26;
	let span12;
	let t27;
	let t28;
	let div7;
	let t32;
	let div8;
	let t36;
	let div9;
	let t37;
	let button0;
	let t39;
	let button1;
	let t41;
	let mounted;
	let dispose;
	let if_block = /*log*/ ctx[7].length > 0 && create_if_block(ctx);

	return {
		c() {
			div10 = element("div");
			div0 = element("div");

			div0.innerHTML = `🛡 FieldGuard — TEST BUILD
    <span class="fg-test-v svelte-1y1ilj4">v0.0.1</span>`;

			t2 = space();
			div1 = element("div");
			div1.innerHTML = `<span class="fg-test-lbl svelte-1y1ilj4">📍 Position</span> <span class="fg-test-val svelte-1y1ilj4" id="fg-pos-check">checking…</span>`;
			t6 = space();
			div2 = element("div");
			div2.innerHTML = `<span class="fg-test-lbl svelte-1y1ilj4">📱 Mobile detect</span> <span class="fg-test-val svelte-1y1ilj4" id="fg-mobile-check">checking…</span>`;
			t10 = space();
			div3 = element("div");
			span5 = element("span");
			span5.textContent = "🌍 Lat / Lon";
			t12 = space();
			span6 = element("span");
			t13 = text(t13_value);
			t14 = text(", ");
			t15 = text(t15_value);
			t16 = space();
			div4 = element("div");
			span7 = element("span");
			span7.textContent = "🌡 Windy data";
			t18 = space();
			span8 = element("span");
			t19 = text(/*dataStatus*/ ctx[2]);
			t20 = space();
			div5 = element("div");
			span9 = element("span");
			span9.textContent = "🔑 License API";
			t22 = space();
			span10 = element("span");
			t23 = text(/*licenseStatus*/ ctx[3]);
			t24 = space();
			div6 = element("div");
			span11 = element("span");
			span11.textContent = "⚙ Remote config";
			t26 = space();
			span12 = element("span");
			t27 = text(/*configStatus*/ ctx[5]);
			t28 = space();
			div7 = element("div");
			div7.innerHTML = `<span class="fg-test-lbl svelte-1y1ilj4">📦 Container</span> <span class="fg-test-val svelte-1y1ilj4" id="fg-container-check">checking…</span>`;
			t32 = space();
			div8 = element("div");
			div8.innerHTML = `<span class="fg-test-lbl svelte-1y1ilj4">🖥 Window size</span> <span class="fg-test-val svelte-1y1ilj4" id="fg-size-check">checking…</span>`;
			t36 = space();
			div9 = element("div");
			t37 = space();
			button0 = element("button");
			button0.textContent = "🔄 Re-run tests";
			t39 = space();
			button1 = element("button");
			button1.textContent = "🔑 Test license call";
			t41 = space();
			if (if_block) if_block.c();
			attr(div0, "class", "fg-test-head svelte-1y1ilj4");
			attr(div1, "class", "fg-test-row svelte-1y1ilj4");
			attr(div2, "class", "fg-test-row svelte-1y1ilj4");
			attr(span5, "class", "fg-test-lbl svelte-1y1ilj4");
			attr(span6, "class", "fg-test-val svelte-1y1ilj4");
			attr(div3, "class", "fg-test-row svelte-1y1ilj4");
			attr(span7, "class", "fg-test-lbl svelte-1y1ilj4");
			attr(span8, "class", "fg-test-val svelte-1y1ilj4");
			attr(div4, "class", "fg-test-row svelte-1y1ilj4");
			attr(span9, "class", "fg-test-lbl svelte-1y1ilj4");
			attr(span10, "class", "fg-test-val svelte-1y1ilj4");
			set_style(span10, "color", /*licenseColor*/ ctx[4]);
			attr(div5, "class", "fg-test-row svelte-1y1ilj4");
			attr(span11, "class", "fg-test-lbl svelte-1y1ilj4");
			attr(span12, "class", "fg-test-val svelte-1y1ilj4");
			set_style(span12, "color", /*configColor*/ ctx[6]);
			attr(div6, "class", "fg-test-row svelte-1y1ilj4");
			attr(div7, "class", "fg-test-row svelte-1y1ilj4");
			attr(div8, "class", "fg-test-row svelte-1y1ilj4");
			attr(div9, "class", "fg-test-divider svelte-1y1ilj4");
			attr(button0, "class", "fg-test-btn svelte-1y1ilj4");
			attr(button1, "class", "fg-test-btn fg-test-btn-sec svelte-1y1ilj4");
			attr(div10, "class", "fg-test svelte-1y1ilj4");
		},
		m(target, anchor) {
			insert(target, div10, anchor);
			append(div10, div0);
			append(div10, t2);
			append(div10, div1);
			append(div10, t6);
			append(div10, div2);
			append(div10, t10);
			append(div10, div3);
			append(div3, span5);
			append(div3, t12);
			append(div3, span6);
			append(span6, t13);
			append(span6, t14);
			append(span6, t15);
			append(div10, t16);
			append(div10, div4);
			append(div4, span7);
			append(div4, t18);
			append(div4, span8);
			append(span8, t19);
			append(div10, t20);
			append(div10, div5);
			append(div5, span9);
			append(div5, t22);
			append(div5, span10);
			append(span10, t23);
			append(div10, t24);
			append(div10, div6);
			append(div6, span11);
			append(div6, t26);
			append(div6, span12);
			append(span12, t27);
			append(div10, t28);
			append(div10, div7);
			append(div10, t32);
			append(div10, div8);
			append(div10, t36);
			append(div10, div9);
			append(div10, t37);
			append(div10, button0);
			append(div10, t39);
			append(div10, button1);
			append(div10, t41);
			if (if_block) if_block.m(div10, null);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*runTests*/ ctx[8]),
					listen(button1, "click", /*testLicenseKey*/ ctx[9])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*lat*/ 1 && t13_value !== (t13_value = /*lat*/ ctx[0].toFixed(4) + "")) set_data(t13, t13_value);
			if (dirty & /*lon*/ 2 && t15_value !== (t15_value = /*lon*/ ctx[1].toFixed(4) + "")) set_data(t15, t15_value);
			if (dirty & /*dataStatus*/ 4) set_data(t19, /*dataStatus*/ ctx[2]);
			if (dirty & /*licenseStatus*/ 8) set_data(t23, /*licenseStatus*/ ctx[3]);

			if (dirty & /*licenseColor*/ 16) {
				set_style(span10, "color", /*licenseColor*/ ctx[4]);
			}

			if (dirty & /*configStatus*/ 32) set_data(t27, /*configStatus*/ ctx[5]);

			if (dirty & /*configColor*/ 64) {
				set_style(span12, "color", /*configColor*/ ctx[6]);
			}

			if (/*log*/ ctx[7].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div10, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div10);
			}

			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let lat = 23.03, lon = 58.59;
	let dataStatus = 'not tested';
	let licenseStatus = 'not tested';
	let licenseColor = '#8a9cc8';
	let configStatus = 'not tested';
	let configColor = '#8a9cc8';
	let log = [];
	let map;

	windyInit(
		{
			requiredVersion: '3.7.0',
			features: { interpolator: true }
		},
		windyAPI => {
			const { store, picker, broadcast, map: windyMap } = windyAPI;
			map = windyMap;

			onMount(() => {
				runTests();

				broadcast.on('paramsChanged', () => {
					try {
						const c = map.getCenter();
						$$invalidate(0, lat = c.lat);
						$$invalidate(1, lon = c.lng);
						$$invalidate(2, dataStatus = `map center updated`);
					} catch(e) {
						
					}
				});

				try {
					const { lat: lt, lon: ln } = store.get('pickerLocation') ?? { lat: 23.03, lon: 58.59 };
					$$invalidate(0, lat = lt);
					$$invalidate(1, lon = ln);
				} catch {
					
				}

				testWindyData();
			});
		}
	);

	function runTests() {
		$$invalidate(7, log = []);

		setTimeout(
			() => {
				const el = document.querySelector('.fg-test');
				const posEl = document.getElementById('fg-pos-check');

				if (el && posEl) {
					const rect = el.getBoundingClientRect();
					const wh = window.innerHeight;
					const ww = window.innerWidth;
					const pos = `top:${Math.round(rect.top)}px left:${Math.round(rect.left)}px`;
					const quadrant = rect.top > wh / 2 ? 'BOTTOM' : 'TOP';
					const side = rect.left > ww / 2 ? 'RIGHT' : 'LEFT';
					posEl.textContent = `${quadrant}-${side} (${pos})`;

					posEl.style.color = quadrant === 'BOTTOM' && side === 'RIGHT'
					? '#4ade80'
					: '#f59e0b';

					$$invalidate(7, log = [
						...log,
						{
							ok: quadrant === 'BOTTOM' && side === 'RIGHT',
							msg: `Placement: ${quadrant}-${side} — ${quadrant === 'BOTTOM' && side === 'RIGHT'
							? 'CORRECT'
							: 'WRONG (should be BOTTOM-RIGHT)'}`
						}
					]);
				}

				const mobileEl = document.getElementById('fg-mobile-check');
				const htmlEl = document.documentElement;
				const isMobile = htmlEl.id === 'device-mobile';

				if (mobileEl) {
					mobileEl.textContent = isMobile
					? '✓ #device-mobile detected'
					: '✗ desktop (no #device-mobile)';

					mobileEl.style.color = '#4ade80';
				}

				$$invalidate(7, log = [
					...log,
					{
						ok: true,
						msg: `Mobile: ${isMobile
						? 'YES (#device-mobile on html)'
						: 'NO (desktop)'}`
					}
				]);

				const contEl = document.getElementById('fg-container-check');

				if (contEl && el) {
					const parent = el.parentElement;
					parent?.parentElement;
					const info = `parent: ${parent?.className?.substring(0, 30) || parent?.id || 'unknown'}`;
					contEl.textContent = info;

					$$invalidate(7, log = [
						...log,
						{
							ok: true,
							msg: `Container: ${parent?.outerHTML?.substring(0, 80)}`
						}
					]);
				}

				const sizeEl = document.getElementById('fg-size-check');

				if (sizeEl) {
					sizeEl.textContent = `${window.innerWidth}×${window.innerHeight}px`;
				}
			},
			100
		);

		testRemoteConfig();
	}

	async function testWindyData() {
		try {
			const W = window.W;

			if (W?.interpolator) {
				$$invalidate(2, dataStatus = '✓ interpolator available');

				$$invalidate(7, log = [
					...log,
					{
						ok: true,
						msg: 'Windy interpolator: accessible'
					}
				]);
			} else {
				$$invalidate(2, dataStatus = '⚠ interpolator not ready');

				$$invalidate(7, log = [
					...log,
					{
						ok: false,
						msg: 'Windy interpolator: not available yet'
					}
				]);
			}
		} catch(e) {
			$$invalidate(2, dataStatus = `error: ${e.message}`);

			$$invalidate(7, log = [
				...log,
				{
					ok: false,
					msg: `Windy data error: ${e.message}`
				}
			]);
		}
	}

	async function testLicenseKey() {
		$$invalidate(3, licenseStatus = 'calling…');
		$$invalidate(4, licenseColor = '#e8962a');

		try {
			const res = await fetch('https://fieldguard-hse.com/api/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					key: 'TEST-KEY-PING',
					revalidate: false,
					test: true
				}),
				signal: AbortSignal.timeout(5000)
			});

			const status = res.status;
			const text = await res.text().catch(() => '');
			$$invalidate(3, licenseStatus = `HTTP ${status} — ${text.substring(0, 60)}`);
			$$invalidate(4, licenseColor = res.ok || status === 400 ? '#4ade80' : '#f87171');

			$$invalidate(7, log = [
				...log,
				{
					ok: res.ok || status === 400,
					msg: `License API: HTTP ${status} (400 = server reachable, key rejected = correct)`
				}
			]);
		} catch(e) {
			$$invalidate(3, licenseStatus = `UNREACHABLE — ${e.message}`);
			$$invalidate(4, licenseColor = '#f87171');

			$$invalidate(7, log = [
				...log,
				{
					ok: false,
					msg: `License API: ${e.message}`
				}
			]);
		}
	}

	async function testRemoteConfig() {
		$$invalidate(5, configStatus = 'calling…');
		$$invalidate(6, configColor = '#e8962a');

		try {
			const res = await fetch('https://fieldguard-hse.com/api/plugin-config', { signal: AbortSignal.timeout(4000) });

			if (res.ok) {
				const data = await res.json().catch(() => ({}));
				const keys = Object.keys(data);

				$$invalidate(5, configStatus = keys.length > 0
				? `✓ ${keys.length} keys: ${keys.join(', ')}`
				: '✓ reachable (empty config)');

				$$invalidate(6, configColor = '#4ade80');

				$$invalidate(7, log = [
					...log,
					{
						ok: true,
						msg: `Remote config: OK — keys: ${keys.join(', ') || 'none yet'}`
					}
				]);
			} else {
				$$invalidate(5, configStatus = `HTTP ${res.status}`);
				$$invalidate(6, configColor = res.status === 404 ? '#f59e0b' : '#f87171');

				$$invalidate(7, log = [
					...log,
					{
						ok: res.status === 404,
						msg: `Remote config: HTTP ${res.status} ${res.status === 404
						? '(endpoint not created yet — OK)'
						: '(error)'}`
					}
				]);
			}
		} catch(e) {
			$$invalidate(5, configStatus = `UNREACHABLE`);
			$$invalidate(6, configColor = '#f87171');

			$$invalidate(7, log = [
				...log,
				{
					ok: false,
					msg: `Remote config: unreachable — ${e.message}`
				}
			]);
		}
	}

	onDestroy(() => {
		
	});

	return [
		lat,
		lon,
		dataStatus,
		licenseStatus,
		licenseColor,
		configStatus,
		configColor,
		log,
		runTests,
		testLicenseKey
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
