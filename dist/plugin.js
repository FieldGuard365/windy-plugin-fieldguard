const __pluginConfig =  {
  "name": "windy-plugin-fieldguard",
  "version": "2.0.1",
  "icon": "🛡️",
  "title": "FieldGuard — HSE Field Safety",
  "description": "Real-time HSE safety monitor for field workers. Heat stress zones (ISO 7243/7933), wind & rain alerts, worst-case multi-model engine, ISO 7933 weekly reports.",
  "author": "FieldGuard HSE",
  "desktopUI": "rhpane",
  "mobileUI": "small",
  "desktopWidth": 270,
  "routerPath": "/fieldguard/:lat?/:lon?",
  "listenToLocationChange": true,
  "hooks": "contextmenu",
  "built": 1779542586561,
  "builtReadable": "2026-05-23T13:23:06.561Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import { map } from '@windy/map';
const { map } = W.map;

// transformCode: import { store } from '@windy/store';
const { store } = W.store;

// transformCode: import { getLatLonInterpolator } from '@windy/interpolator';
const { getLatLonInterpolator } = W.interpolator;


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

let src_url_equal_anchor;

/**
 * @param {string} element_src
 * @param {string} url
 * @returns {boolean}
 */
function src_url_equal(element_src, url) {
	if (element_src === url) return true;
	if (!src_url_equal_anchor) {
		src_url_equal_anchor = document.createElement('a');
	}
	// This is actually faster than doing URL(..).href
	src_url_equal_anchor.href = url;
	return element_src === src_url_equal_anchor.href;
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

function null_to_empty(value) {
	return value == null ? '' : value;
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
 * @returns {Text} */
function empty() {
	return text('');
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
 * @param {HTMLInputElement[]} group
 * @returns {{ p(...inputs: HTMLInputElement[]): void; r(): void; }}
 */
function init_binding_group(group) {
	/**
	 * @type {HTMLInputElement[]} */
	let _inputs;
	return {
		/* push */ p(...inputs) {
			_inputs = inputs;
			_inputs.forEach((input) => group.push(input));
		},
		/* remove */ r() {
			_inputs.forEach((input) => group.splice(group.indexOf(input), 1));
		}
	};
}

/** @returns {number} */
function to_number(value) {
	return value === '' ? null : +value;
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
function set_input_value(input, value) {
	input.value = value == null ? '' : value;
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
 * @returns {void} */
function select_option(select, value, mounting) {
	for (let i = 0; i < select.options.length; i += 1) {
		const option = select.options[i];
		if (option.__value === value) {
			option.selected = true;
			return;
		}
	}
	if (!mounting || value !== undefined) {
		select.selectedIndex = -1; // no option should be selected
	}
}

function select_value(select) {
	const selected_option = select.querySelector(':checked');
	return selected_option && selected_option.__value;
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

/**
 * FieldGuard HSE Calculations — v2.0
 *
 * Standard: ISO 7933:2004 / ISO 7243:2017
 *
 * Core method: 2-step Apparent Temperature lookup
 *   Step 1: Temp (°C) + Humidity (%) → Apparent Temp (°C) [Chart A]
 *   Step 2: Apparent Temp + Wind (m/s) → Final Apparent Temp [Chart B]
 *   Output zone: Green / Amber / Red / Purple / Black (No Work)
 *
 * Zone thresholds and work/rest schedules per ISO 7243 field standard.
 * Work ban: 12:30–15:30, June/July/August (outdoor workers).
 * Stop work when temp exceeds 50°C ambient (when monitor unavailable).
 */ // Zones from ISO 7243 / field standard
const ZONES = {
    green: {
        key: 'green',
        label: 'Unrestricted — Low Risk',
        riskLabel: 'GREEN',
        color: '#16a34a',
        bgColor: '#14532d',
        hydrationLow: 0.6,
        hydrationHigh: 1.0,
        workRestLight: 'Continuous self-paced',
        workRestHeavy: 'Continuous self-paced',
        monitoringSchedule: 'Daily measurement and calculation only',
        workAllowed: true,
        stopWork: false,
        mandatoryControls: [
            'No limits on self-paced work for educated, hydrated workers',
            'Hydration: 0.6–1.0 L/hr'
        ]
    },
    amber: {
        key: 'amber',
        label: 'Attention — Medium Risk',
        riskLabel: 'AMBER',
        color: '#d97706',
        bgColor: '#451a03',
        hydrationLow: 1.0,
        hydrationHigh: 1.2,
        workRestLight: 'Continuous self-paced',
        workRestHeavy: '45 min work / 15 min rest',
        monitoringSchedule: 'Verification of controls before validation/start work',
        workAllowed: true,
        stopWork: false,
        mandatoryControls: [
            'Provide shade, improve ventilation',
            'Working alone to be avoided',
            'No un-acclimatized workers on site',
            'Heat stress trained responder on site',
            'Light work: continuous self-paced',
            'Heavy work: 45 min work / 15 min rest',
            'Hydration: 1.0–1.2 L/hr'
        ]
    },
    red: {
        key: 'red',
        label: 'Alert — High Risk',
        riskLabel: 'RED',
        color: '#dc2626',
        bgColor: '#450a0a',
        hydrationLow: 1.2,
        hydrationHigh: 1.2,
        workRestLight: '45 min work / 15 min rest',
        workRestHeavy: '20 min work / 30 min rest',
        monitoringSchedule: 'Verification at start + at least twice per day',
        workAllowed: true,
        stopWork: false,
        mandatoryControls: [
            'All Amber controls apply',
            'No person works alone',
            'Test risk awareness in toolbox talk',
            'Strict work/rest cycle compliance',
            'No un-acclimatized person on site',
            'Stand-by vehicle with A/C for emergency response',
            'Light work: 45/15 | Heavy work: 20/30 (min work/rest)',
            'Hydration: 1.2 L/hr + isotonic supplements'
        ]
    },
    purple: {
        key: 'purple',
        label: 'Extreme — Extreme Risk',
        riskLabel: 'PURPLE',
        color: '#7c3aed',
        bgColor: '#2e1065',
        hydrationLow: 1.2,
        hydrationHigh: 1.2,
        workRestLight: '10 min work / 20 min rest',
        workRestHeavy: '5 min work / 20 min rest',
        monitoringSchedule: 'Continuous monitoring',
        workAllowed: true,
        stopWork: false,
        mandatoryControls: [
            'All Red controls apply',
            'Business-critical activities ONLY — approved by senior HSE representative',
            'Continuous monitoring for heat stress symptoms',
            'Must be within 30 minutes of Tier 2 medical response',
            'Crew must have support vehicle with A/C + heat stress kit',
            'Light work: 10/20 | Heavy work: 5/20 (min work/rest)',
            'Hydration: 1.2 L/hr + isotonic supplements'
        ]
    },
    black: {
        key: 'black',
        label: 'No Work',
        riskLabel: 'NO WORK',
        color: '#6b7280',
        bgColor: '#030712',
        hydrationLow: 0.6,
        hydrationHigh: 1.0,
        workRestLight: 'No work',
        workRestHeavy: 'No work',
        monitoringSchedule: 'Suspend work authorisation',
        workAllowed: false,
        stopWork: true,
        mandatoryControls: [
            'ALL OUTDOOR WORK STOPPED',
            'Standby in shaded, air-conditioned environment or return to camp',
            'Maintain hydration: 0.6–1.0 L/hr'
        ]
    }
};
// ─── Chart A: Temp × Humidity → Apparent Temp ─────────────────────────────────
const CHART_A_TEMPS = [
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54
];
const CHART_A_RH = [
    0,
    5,
    10,
    15,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    85,
    90,
    95,
    100
];
const CHART_A = [
    [
        25,
        25,
        25,
        25,
        25,
        25,
        25,
        25,
        25,
        25,
        25,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26
    ],
    [
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        27,
        27,
        27,
        27,
        28,
        28,
        28,
        28,
        28
    ],
    [
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        28,
        28,
        29,
        29,
        30,
        30,
        31,
        32,
        33
    ],
    [
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        29,
        30,
        31,
        31,
        32,
        33,
        34,
        35,
        36
    ],
    [
        29,
        29,
        29,
        29,
        29,
        29,
        29,
        29,
        29,
        29,
        30,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        39,
        40
    ],
    [
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        38,
        39,
        41,
        43,
        44
    ],
    [
        31,
        31,
        31,
        31,
        31,
        31,
        31,
        31,
        31,
        32,
        33,
        34,
        36,
        36,
        38,
        39,
        41,
        43,
        45,
        47,
        49
    ],
    [
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        33,
        34,
        36,
        37,
        39,
        40,
        42,
        44,
        47,
        49,
        51,
        54
    ],
    [
        33,
        33,
        33,
        33,
        33,
        33,
        33,
        33,
        34,
        35,
        36,
        38,
        40,
        41,
        43,
        46,
        48,
        51,
        54,
        57,
        60
    ],
    [
        34,
        34,
        34,
        34,
        34,
        34,
        34,
        35,
        35,
        37,
        38,
        40,
        42,
        44,
        47,
        49,
        52,
        55,
        58,
        60,
        60
    ],
    [
        35,
        35,
        35,
        35,
        35,
        35,
        35,
        36,
        37,
        39,
        41,
        43,
        45,
        48,
        50,
        53,
        57,
        60,
        60,
        60,
        60
    ],
    [
        36,
        36,
        36,
        36,
        36,
        36,
        36,
        38,
        39,
        41,
        43,
        46,
        48,
        51,
        54,
        58,
        60,
        60,
        60,
        60,
        60
    ],
    [
        37,
        37,
        37,
        37,
        37,
        37,
        38,
        39,
        41,
        43,
        46,
        48,
        51,
        44,
        58,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        38,
        38,
        38,
        38,
        38,
        38,
        39,
        41,
        43,
        46,
        49,
        52,
        55,
        59,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        39,
        39,
        39,
        39,
        39,
        39,
        41,
        43,
        46,
        49,
        52,
        55,
        59,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        40,
        40,
        40,
        40,
        40,
        41,
        43,
        46,
        48,
        51,
        55,
        59,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        41,
        41,
        41,
        41,
        41,
        43,
        45,
        48,
        51,
        54,
        58,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        42,
        42,
        42,
        42,
        42,
        45,
        47,
        50,
        54,
        57,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        43,
        43,
        43,
        43,
        44,
        46,
        49,
        53,
        57,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        44,
        44,
        44,
        44,
        46,
        48,
        52,
        55,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        45,
        45,
        45,
        45,
        47,
        50,
        54,
        58,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        46,
        46,
        46,
        46,
        49,
        53,
        57,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        47,
        47,
        47,
        47,
        51,
        55,
        59,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        48,
        48,
        48,
        48,
        53,
        57,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        49,
        49,
        49,
        50,
        55,
        59,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        50,
        50,
        50,
        52,
        57,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        51,
        51,
        51,
        54,
        59,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        52,
        52,
        52,
        55,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        53,
        53,
        53,
        57,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ],
    [
        54,
        54,
        53,
        59,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60,
        60
    ]
];
// ─── Chart B: Apparent Temp × Wind → Final Apparent Temp ──────────────────────
const CHART_B_APPTEMPS = [
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60
];
const CHART_B_WINDS = [
    0,
    1,
    3,
    4,
    6,
    7,
    8,
    10,
    11,
    13,
    14,
    15,
    17,
    18,
    19,
    21,
    22,
    24,
    25,
    26,
    28
];
const NW = 999;
const CHART_B = [
    [
        25,
        25,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        26,
        27,
        27,
        27,
        28,
        28,
        28,
        28,
        29,
        29,
        29
    ],
    [
        26,
        26,
        27,
        27,
        27,
        27,
        27,
        28,
        28,
        28,
        28,
        28,
        29,
        29,
        29,
        29,
        30,
        30,
        30,
        31,
        31
    ],
    [
        27,
        27,
        28,
        28,
        28,
        28,
        28,
        29,
        29,
        29,
        30,
        30,
        30,
        30,
        31,
        31,
        33,
        33,
        34,
        35,
        36
    ],
    [
        28,
        28,
        29,
        29,
        29,
        29,
        30,
        30,
        30,
        31,
        33,
        31,
        31,
        33,
        33,
        34,
        36,
        37,
        39,
        40,
        42
    ],
    [
        29,
        29,
        30,
        30,
        30,
        30,
        31,
        31,
        31,
        32,
        33,
        33,
        34,
        36,
        36,
        38,
        40,
        41,
        43,
        46,
        47
    ],
    [
        30,
        30,
        31,
        31,
        31,
        31,
        32,
        32,
        33,
        33,
        34,
        36,
        37,
        39,
        40,
        41,
        44,
        46,
        49,
        51,
        52
    ],
    [
        31,
        31,
        32,
        32,
        32,
        32,
        33,
        33,
        34,
        36,
        37,
        39,
        40,
        42,
        45,
        46,
        48,
        51,
        53,
        NW,
        NW
    ],
    [
        32,
        32,
        33,
        33,
        33,
        33,
        34,
        34,
        37,
        37,
        40,
        41,
        43,
        46,
        48,
        50,
        52,
        NW,
        NW,
        NW,
        NW
    ],
    [
        33,
        33,
        34,
        34,
        34,
        34,
        36,
        37,
        38,
        39,
        41,
        44,
        47,
        49,
        51,
        54,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        34,
        34,
        35,
        35,
        35,
        36,
        37,
        38,
        39,
        42,
        44,
        47,
        50,
        52,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        35,
        35,
        36,
        36,
        36,
        38,
        40,
        41,
        43,
        45,
        47,
        51,
        53,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        36,
        36,
        37,
        38,
        38,
        39,
        41,
        43,
        45,
        48,
        51,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        37,
        37,
        38,
        39,
        40,
        40,
        44,
        45,
        48,
        51,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        38,
        38,
        39,
        40,
        41,
        43,
        45,
        47,
        51,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        39,
        39,
        40,
        41,
        43,
        44,
        48,
        51,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        40,
        40,
        41,
        42,
        44,
        47,
        50,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        41,
        41,
        43,
        44,
        45,
        49,
        53,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        42,
        42,
        45,
        44,
        47,
        52,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        43,
        43,
        45,
        47,
        49,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        44,
        44,
        47,
        48,
        53,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        45,
        45,
        49,
        51,
        55,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        46,
        46,
        50,
        52,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        47,
        47,
        51,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        48,
        48,
        53,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        49,
        49,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        50,
        50,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        51,
        51,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        52,
        52,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        53,
        53,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        54,
        54,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ],
    [
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW,
        NW
    ]
];
function findNearestIndex(arr, val) {
    let best = 0, bestDist = Math.abs(arr[0] - val);
    for(let i = 1; i < arr.length; i++){
        const d = Math.abs(arr[i] - val);
        if (d < bestDist) {
            bestDist = d;
            best = i;
        }
    }
    return best;
}
function calcApparentTemp(tempC, rh) {
    const ti = findNearestIndex(CHART_A_TEMPS, tempC);
    const ri = findNearestIndex(CHART_A_RH, rh);
    return CHART_A[ti][ri];
}
function calcFinalApparentTemp(apparentTemp, windMs) {
    const ai = findNearestIndex(CHART_B_APPTEMPS, apparentTemp);
    const wi = findNearestIndex(CHART_B_WINDS, windMs);
    return CHART_B[ai][wi];
}
function apparentTempToZone(finalApparent, tempC) {
    if (finalApparent >= NW || tempC >= 50) return 'black';
    if (finalApparent >= 55) return 'black';
    if (finalApparent >= 50) return 'purple';
    if (finalApparent >= 43) return 'red';
    if (finalApparent >= 35) return 'amber';
    return 'green';
}
function assessHeatStress(inputs, ppeKey, localHour, month) {
    const appTemp1 = calcApparentTemp(inputs.tempC, inputs.humidity);
    const appTempFinal = calcFinalApparentTemp(appTemp1, inputs.windMs);
    const zone = apparentTempToZone(appTempFinal, inputs.tempC);
    const zoneInfo = ZONES[zone];
    const wbgtBase = calcWBGT(inputs);
    const wbgtAdj = calcAdjustedWBGT(wbgtBase, ppeKey);
    const heatIdx = calcHeatIndex(inputs.tempC, inputs.humidity);
    // Legal work ban: 12:30–15:30, June/July/August
    const isBanPeriod = [
        6,
        7,
        8
    ].includes(month) && localHour >= 12.5 && localHour < 15.5;
    return {
        apparentTemp1: appTemp1,
        apparentTempFinal: appTempFinal,
        zone,
        zoneInfo,
        wbgtBase,
        wbgtAdjusted: wbgtAdj,
        heatIndex: heatIdx,
        isNoWork: zoneInfo.stopWork || isBanPeriod,
        isBanPeriod,
        workRestSchedule: {
            light: zoneInfo.workRestLight,
            heavy: zoneInfo.workRestHeavy
        },
        hydration: `${zoneInfo.hydrationLow}–${zoneInfo.hydrationHigh} L/hr`
    };
}
// ─── WBGT (Liljegren 2008 simplified outdoor) ────────────────────────────────
function calcWBGT(inputs) {
    const { tempC, humidity, solarWm2 } = inputs;
    const Tw = tempC * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) + Math.atan(tempC + humidity) - Math.atan(humidity - 1.676331) + 0.00391838 * humidity ** 1.5 * Math.atan(0.023101 * humidity) - 4.686035;
    const Tk = tempC + 273.15;
    const emissGlobe = 0.95, albedo = 0.37, sigma = 5.67e-8;
    let Tg = tempC + 15 * (solarWm2 / 800);
    for(let i = 0; i < 5; i++){
        Tg = Math.pow((1 - albedo) * solarWm2 / (emissGlobe * sigma) + Tk ** 4, 0.25) - 273.15;
    }
    return Math.round((0.7 * Tw + 0.2 * Tg + 0.1 * tempC) * 10) / 10;
}
// ─── PPE Profiles (ISO 7933:2004) ────────────────────────────────────────────
const PPE_PROFILES = {
    light: {
        label: 'Light clothing (summer work wear)',
        adjustment: 0
    },
    coverall: {
        label: 'Coverall (cotton)',
        adjustment: 1.0
    },
    fr: {
        label: 'FR (flame-resistant) suit',
        adjustment: 2.0
    },
    fr_imperm: {
        label: 'FR impermeable suit',
        adjustment: 4.0
    },
    encapsulat: {
        label: 'Fully encapsulating chemical suit',
        adjustment: 10.0
    }
};
function calcAdjustedWBGT(wbgtBase, ppeKey) {
    return Math.round((wbgtBase + (PPE_PROFILES[ppeKey]?.adjustment ?? 0)) * 10) / 10;
}
// ─── Heat Index (Rothfusz/NWS) ────────────────────────────────────────────────
function calcHeatIndex(tempC, rh) {
    const T = tempC * 9 / 5 + 32;
    if (T < 80) return Math.round((0.5 * (T + 61 + (T - 68) * 1.2 + rh * 0.094) - 32) * 5 / 9 * 10) / 10;
    let hi = -42.379 + 2.04901523 * T + 10.14333127 * rh - 0.22475541 * T * rh - 0.00683783 * T * T - 0.05481717 * rh * rh + 0.00122874 * T * T * rh + 0.00085282 * T * rh * rh - 0.00000199 * T * T * rh * rh;
    if (rh < 13 && T >= 80 && T <= 112) hi -= (13 - rh) / 4 * Math.sqrt((17 - Math.abs(T - 95)) / 17);
    else if (rh > 85 && T >= 80 && T <= 87) hi += (rh - 85) / 10 * ((87 - T) / 5);
    return Math.round((hi - 32) * 5 / 9 * 10) / 10;
}
// ─── Wind ─────────────────────────────────────────────────────────────────────
const BEAUFORT_SCALE = [
    {
        max: 0.5,
        bf: 0,
        desc: 'Calm'
    },
    {
        max: 1.5,
        bf: 1,
        desc: 'Light air'
    },
    {
        max: 3.3,
        bf: 2,
        desc: 'Light breeze'
    },
    {
        max: 5.5,
        bf: 3,
        desc: 'Gentle breeze'
    },
    {
        max: 7.9,
        bf: 4,
        desc: 'Moderate breeze'
    },
    {
        max: 10.7,
        bf: 5,
        desc: 'Fresh breeze'
    },
    {
        max: 13.8,
        bf: 6,
        desc: 'Strong breeze'
    },
    {
        max: 17.1,
        bf: 7,
        desc: 'Near gale'
    },
    {
        max: 20.7,
        bf: 8,
        desc: 'Gale'
    },
    {
        max: 24.4,
        bf: 9,
        desc: 'Severe gale'
    },
    {
        max: 28.4,
        bf: 10,
        desc: 'Storm'
    },
    {
        max: 32.6,
        bf: 11,
        desc: 'Violent storm'
    },
    {
        max: Infinity,
        bf: 12,
        desc: 'Hurricane'
    }
];
function assessWind(windMs, warnMs, dangerMs) {
    const e = BEAUFORT_SCALE.find((b)=>windMs <= b.max) ?? BEAUFORT_SCALE[12];
    let riskColor = '#16a34a', riskLabel = 'SAFE';
    if (windMs >= dangerMs) {
        riskColor = '#dc2626';
        riskLabel = 'DANGER';
    } else if (windMs >= warnMs) {
        riskColor = '#f97316';
        riskLabel = 'WARNING';
    } else if (windMs >= warnMs * 0.7) {
        riskColor = '#d97706';
        riskLabel = 'CAUTION';
    }
    return {
        beaufort: e.bf,
        beaufortDesc: e.desc,
        riskColor,
        riskLabel,
        exceedsThreshold: windMs >= warnMs
    };
}
function assessRain(mmh, warnMmh, dangerMmh) {
    let intensityLabel = 'None';
    if (mmh > 0 && mmh < 0.5) intensityLabel = 'Trace';
    else if (mmh < 2.5) intensityLabel = 'Light';
    else if (mmh < 7.6) intensityLabel = 'Moderate';
    else if (mmh < 50) intensityLabel = 'Heavy';
    else if (mmh > 0) intensityLabel = 'Violent';
    let riskColor = '#16a34a', riskLabel = 'CLEAR';
    if (mmh >= dangerMmh) {
        riskColor = '#dc2626';
        riskLabel = 'DANGER';
    } else if (mmh >= warnMmh) {
        riskColor = '#f97316';
        riskLabel = 'WARNING';
    } else if (mmh >= warnMmh * 0.5) {
        riskColor = '#d97706';
        riskLabel = 'CAUTION';
    }
    return {
        intensityLabel,
        riskColor,
        riskLabel,
        exceedsThreshold: mmh >= warnMmh
    };
}
// ─── Symptom & Emergency reference (ISO 7243) ─────────────────────────────────
const HEAT_STRESS_SYMPTOMS = [
    'Weakness',
    'Headache',
    'Loss of Consciousness',
    'Nausea and Vomiting',
    'Muscle Cramps',
    'Dizziness'
];
const EMERGENCY_RESPONSE = [
    'Quit activity immediately',
    'Move to shaded, air-conditioned area',
    'Use water and isotonic water/powder supplements',
    'Loosen clothing',
    'Wet cloth to dampen neck, head and arms',
    'Consult Doctor — Notify site representative',
    'FOR SEVERE SYMPTOMS: GET IMMEDIATE MEDICAL CARE'
];

/**
 * FieldGuard Weekly Report Generator — v2.0
 * Standard: ISO 7933:2004 / ISO 7243:2017 / FIDIC Clause 8.4
 * Standard: ISO 7933:2004 / ISO 7243:2017 / FIDIC Clause 8.4
 */ function pad(s, n = 8) {
    return String(s).padEnd(n);
}
function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const ys = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date.getTime() - ys.getTime()) / 86400000 + 1) / 7);
}
function generateWeeklyReport(d) {
    const now = new Date().toISOString();
    const weekNo = getWeekNumber(new Date(d.weekStart));
    const year = new Date(d.weekStart).getFullYear();
    const siteId = d.projectName.replace(/\s+/g, '-').toUpperCase().slice(0, 8);
    const reportId = `FG-${siteId}-W${weekNo}-${year}`;
    const totalExceedH = d.wbgtLog.reduce((s, e)=>s + e.durationH, 0).toFixed(1);
    const peakEntry = d.wbgtLog.reduce((a, b)=>b.wbgtAdj > a.wbgtAdj ? b : a, d.wbgtLog[0] ?? {
        wbgtAdj: 0,
        date: 'N/A',
        time: 'N/A'
    });
    const metTable = ()=>{
        const m = d.dailyMet;
        const cols = (fn)=>m.map((x)=>String(fn(x)).padStart(7)).join('  ');
        return [
            `                   ${m.map((x)=>x.day.padStart(7)).join('  ')}`,
            '─'.repeat(88),
            `Max Temp (°C):     ${cols((x)=>x.maxTemp)}`,
            `Min Temp (°C):     ${cols((x)=>x.minTemp)}`,
            `Max RH (%):        ${cols((x)=>x.maxRH)}`,
            `Max Wind (m/s):    ${cols((x)=>x.maxWind)}`,
            `Peak Solar(W/m²):  ${cols((x)=>x.peakSolar)}`,
            '─'.repeat(88)
        ].join('\n');
    };
    const wbgtTable = ()=>{
        const sep = '━'.repeat(95);
        const hdr = '  DATE         TIME     DUR(H)  WBGT   WBGT+PPE  PPE                ZONE      ACTION';
        const rows = d.wbgtLog.map((e)=>`  ${pad(e.date, 14)}${pad(e.time, 9)}${pad(e.durationH.toFixed(1), 8)}${pad(e.wbgtBase + '°', 7)} ${pad(e.wbgtAdj + '°', 10)}${pad(e.ppe, 19)}${pad(e.zone, 10)}${e.action}`).join('\n') || '  No exceedances recorded.';
        return [
            sep,
            hdr,
            sep,
            rows,
            sep,
            `  TOTAL: ${d.wbgtLog.length} events | ${totalExceedH} hrs above threshold`
        ].join('\n');
    };
    const mgTable = ()=>{
        if (!d.morningGap.length) return '  None recorded this week.';
        const sep = '━'.repeat(75);
        const hdr = '  DATE         THRESHOLD   AT TIME   MINS BEFORE BAN   PEAK ADJ. WBGT';
        const rows = d.morningGap.map((e)=>`  ${pad(e.date, 14)} ${pad(e.threshold + '°C', 11)} ${pad(e.time, 10)}${pad(e.minsBeforeBan + ' min', 18)} ${e.peakAdj}°C`).join('\n');
        return [
            sep,
            hdr,
            sep,
            rows,
            sep
        ].join('\n');
    };
    const suspTable = ()=>{
        if (!d.suspensions.length) return '  No suspensions recorded.';
        const sep = '━'.repeat(90);
        const hdr = '  DATE         START   END     DUR(H)  TRIGGER        TRADES             WORKERS';
        const rows = d.suspensions.map((e)=>`  ${pad(e.date, 14)}${pad(e.startTime, 8)}${pad(e.endTime, 8)}${pad(e.hours.toFixed(1), 8)}${pad(e.trigger, 15)}${pad(e.trades, 19)}${e.workers}`).join('\n');
        const total = `\n  TOTAL SUSPENSION HOURS THIS WEEK: ${d.totalSuspensionHours.toFixed(1)} hours\n  CUMULATIVE (PROJECT TO DATE): ${d.cumulativeSuspensionHours.toFixed(1)} hours`;
        return [
            sep,
            hdr,
            sep,
            rows,
            sep,
            total
        ].join('\n');
    };
    return `
================================================================================
FIELDGUARD — WEEKLY HEAT & WEATHER SAFETY AUDIT REPORT
Document Ref: HSE-WBGT-WEEKLY | Standard: ISO 7933:2004 / ISO 7243:2017
Standard: ISO 7933:2004 / ISO 7243:2017
Audit Period: ${d.weekStart} to ${d.weekEnd}
Generated: ${now} UTC | Report ID: ${reportId}
================================================================================

⚠  IMPORTANT LEGAL NOTICE
This report is generated by FieldGuard's automated HSE engine. It is intended as
a decision-support tool for qualified HSE professionals and must be reviewed by a
certified HSE Manager before use as contractual or legal evidence.
================================================================================

SECTION A — PROJECT & SITE IDENTIFICATION
──────────────────────────────────────────────────────────────────────────────
Project Name:           ${d.projectName}
Contract Number:        ${d.contractNumber}
Project Location:       ${d.siteAddress}
GPS Coordinates:        ${d.lat.toFixed(4)}, ${d.lon.toFixed(4)}
Country / Jurisdiction: ${d.country} — ${d.regulatoryRef}
Client / Employer:      ${d.clientName}
Main Contractor:        ${d.contractorName}
HSE Manager:            ${d.hseManagerName}
Report ID:              ${reportId}
FieldGuard Version:     v2.0
Heat Stress Method:     2-Step Apparent Temperature (Charts A & B)


SECTION B — EXECUTIVE SUMMARY
──────────────────────────────────────────────────────────────────────────────
During the week of ${d.weekStart} to ${d.weekEnd}, site "${d.projectName}" at
${d.siteAddress} recorded ${d.wbgtLog.length} heat stress exceedance events per
the ISO 7243 / ISO 7933 zone system (PPE-Adjusted WBGT).

Peak Adjusted WBGT:          ${peakEntry.wbgtAdj}°C at ${peakEntry.time} on ${peakEntry.date}
PPE Profile:                 ${d.ppeProfile} (+${d.ppeAdjustment}°C)
Total exceedance hours:      ${totalExceedH} hours across ${d.wbgtLog.length} events
Work suspension hours:       ${d.totalSuspensionHours.toFixed(1)} hours
Morning Gap events:          ${d.morningGap.length} events (WBGT exceedance before legal ban)
Legal Work Ban:              ${d.banStart}–${d.banEnd} (${d.banMonths})

FIDIC Clause 8.4 Assessment: ${d.fidic}
Estimated delay:             ${d.delayDays} calendar day(s)

Note: Zones determined by 2-step Apparent Temperature method (Chart A: Temp×RH;
Chart B: Apparent Temp × Wind) per ISO 7243 field calculator.
Zone system: Green (safe) → Amber (attention) → Red (alert) → Purple (extreme) → Black (no work)
Stop-work rule applied when ambient temp exceeds 50°C or NW (No Work) on Chart B.


SECTION C — METEOROLOGICAL DATA SUMMARY
──────────────────────────────────────────────────────────────────────────────
Data Source:     FieldGuard — Windy.com multi-model (ECMWF, GFS, ICON, MEPS, GEM, ACCESS-G)
                 + Open-Meteo API backup (ECMWF/ICON, 15-min interval)
Method:          Worst-case across all available forecast models
Measurement:     Every 2 hours per field (ISO 7243 Execution protocol)

${metTable()}
Weekly Max Temp:     ${Math.max(...d.dailyMet.map((m)=>m.maxTemp))}°C
Weekly Max Humidity: ${Math.max(...d.dailyMet.map((m)=>m.maxRH))}%
Weekly Max Wind:     ${Math.max(...d.dailyMet.map((m)=>m.maxWind))} m/s


SECTION D — HEAT STRESS ZONE ANALYSIS (ISO 7933 / ISO 7243)
──────────────────────────────────────────────────────────────────────────────
Zone System Reference: ISO 7243:2017 / ISO 7933:2004
WBGT Supplement:      ISO 7933:2004 — Analytical Determination of Thermal Stress (PHS)

PPE Profile Applied:    ${d.ppeProfile}
ISO 7933 Adjustment:    +${d.ppeAdjustment}°C to base WBGT

ZONE THRESHOLDS (Apparent Temperature, °C):
  ● < 35°C  — GREEN  (Unrestricted): No limits on self-paced work
  ● 35–42°C — AMBER  (Attention):   Shade, no working alone, restricted heavy work
  ● 43–49°C — RED    (Alert):       Strict work/rest, stand-by vehicle, no solo work
  ● 50–54°C — PURPLE (Extreme):     Business-critical only, continuous monitoring, 30min from medical
  ● ≥ 55°C  — BLACK  (No Work):    All outdoor work STOPPED — A/C shelter only
  ● "NW"    — NO WORK on Chart B:  Stop work regardless of temperature

WORK/REST SCHEDULES (ISO 7243):
  Zone     Light Work               Heavy Work
  AMBER    Continuous self-paced    45 min / 15 min rest
  RED      45 min / 15 min rest     20 min / 30 min rest
  PURPLE   10 min / 20 min rest     5 min / 20 min rest
  BLACK    No work                  No work

LEGAL WORK BAN (${d.country}): ${d.banStart}–${d.banEnd} during ${d.banMonths}
Reference: ${d.regulatoryRef}

WEEKLY EXCEEDANCE LOG:
${wbgtTable()}


SECTION E — THE MORNING GAP ANALYSIS
──────────────────────────────────────────────────────────────────────────────
"The Morning Gap is the period between operational start and the legal work ban
during which PPE-Adjusted WBGT exceeds safe thresholds, yet no legal protection
exists for workers. FieldGuard identifies this gap that regulatory clocks miss."
— Concept based on HeatProof Global methodology

Legal Work Ban: ${d.banStart}–${d.banEnd} (${d.banMonths}) per ${d.regulatoryRef}

Morning Gap Events This Week:
${mgTable()}


SECTION F — WORK SUSPENSION LOG
──────────────────────────────────────────────────────────────────────────────
Records suitable as contemporaneous evidence under FIDIC Clause 20.1.

${suspTable()}


SECTION G — FIDIC CLAUSE 8.4 WEATHER DELAY CLAIM EVIDENCE
──────────────────────────────────────────────────────────────────────────────
Contract Reference: FIDIC Sub-Clause 8.4 — Extension of Time for Completion
Assessment:         ${d.fidic}

Sub-Clause 8.4(d) provides EOT where Completion is delayed by "Exceptionally
Adverse Climatic Conditions."

Hours lost:         ${d.totalSuspensionHours.toFixed(1)} suspension hours
Delay claimed:      ${d.delayDays} calendar day(s)

SUPPORTING DOCUMENTS (attach):
  □ Appendix A: FieldGuard GPS-stamped alert log
  □ Appendix B: Open-Meteo API export (15-min intervals) — ECMWF/ICON best_match
  □ Appendix C: Site photographs with timestamps
  □ Appendix D: Supervisor attendance records (Ref: field monitoring log)
  □ Appendix E: ISO 7933 PPE adjustment calculation worksheet
  □ Appendix F: Heat Stress Calculator output screenshots
  □ Appendix G: National meteorological station records


SECTION H — REGULATORY COMPLIANCE CHECKLIST
──────────────────────────────────────────────────────────────────────────────
Based on: ISO 7243:2017 / ISO 7933:2004 / ${d.regulatoryRef}

PLAN (Day Before):
  ☐ Weather forecast checked against Heat Stress Calculator (FieldGuard)
  ☐ If Amber/Red/Purple/Black: crew has trained heat stress responder
  ☐ If Purple: crew confirmed within 30 minutes of Tier 2 medical response
  ☐ Risk assessment updated with summer/heat hazards and controls

PREPARE (Before Leaving Camp):
  ☐ Summer hazards included in toolbox talk
  ☐ Support vehicle with A/C and heat stress response kit (Amber+ zones)
  ☐ All mandatory controls verified and in place

START-UP (Before Starting Work):
  ☐ All mandatory controls for current zone verified on site
  ☐ Toolbox talk: heat stress controls explained; symptoms and response confirmed
  ☐ Every worker acknowledged right and duty to raise concern
  ☐ Hydration schedule started

EXECUTION (During Work):
  ☐ Work/rest schedule followed per current zone
  ☐ Crew monitored for symptoms every 2 hours:
     Weakness, Headache, Loss of Consciousness, Nausea/Vomiting, Cramps, Dizziness
  ☐ Conditions measured and recorded every 2 hours
  ☐ Heat stress calculator rechecked when conditions change
  ☐ HSE representative spot checks conducted per schedule
  ☐ Legal work ban ${d.banStart}–${d.banEnd} observed (${d.banMonths})
  ☐ Hydration: ≥0.6–1.2 L/hr per zone; isotonic supplements for Red/Purple
  ☐ Stop work implemented when ambient temp exceeded 50°C (if monitor unavailable)

EMERGENCY RESPONSE:
  ☐ Trained first aider on site
  ☐ Emergency light vehicle available for medical response
  ☐ Emergency response steps posted (multi-language)
  ☐ Near-miss heat incidents this week: ___
  ☐ Notifiable incidents this week: ___

DEFICIENCIES / CORRECTIVE ACTIONS:
[Enter any compliance gaps and corrective actions here]


SECTION I — AI RISK ASSESSMENT & FORECAST
──────────────────────────────────────────────────────────────────────────────
FieldGuard Worst-Case Engine: All available Windy.com forecast models queried
simultaneously (ECMWF, GFS, ICON, MEPS, GEM, ACCESS-G). Highest-severity result
across all models used for zone determination and alerts.

CURRENT WEEK ASSESSMENT:
${d.forecastNarrative}

IMPORTANT: Risk of heat stress increases when apparent temperature exceeds 35°C.
Heat is not defined by temperature alone but also depends on relative humidity and
wind speed. (ISO 7243:2017)


SECTION J — SIGNATURES & CERTIFICATION
──────────────────────────────────────────────────────────────────────────────
FieldGuard Data: Windy.com API + Open-Meteo (ECMWF/ICON)
Method: 2-Step Apparent Temperature (Charts A & B) + ISO 7933 WBGT
Report ID: ${reportId}

─────────────────────────────────────────────────────────────────────────────
Prepared by (HSE Manager):
Name: _________________________    Qualification: _________________________
Signature: _____________________    Date: _________________________________
FieldGuard User ID: ____________

Reviewed by (Project Director):
Name: _________________________    Title: _________________________________
Signature: _____________________    Date: _________________________________

Approved by (Client Representative / FIDIC Engineer):
Name: _________________________    Title: _________________________________
Signature: _____________________    Date: _________________________________
Reference: _____________________    (for FIDIC Engineer's record)
─────────────────────────────────────────────────────────────────────────────

DOCUMENT RETENTION: Retain minimum 10 years from project completion.
Archive Reference: FG-VAULT-${siteId}-${reportId}

================================================================================
FIELDGUARD HSE PLUGIN — Windy.com
"All models. Worst case. Zero compromise."
Standard: ISO 7933:2004 / ISO 7243:2017 / ACGIH TLV® / FIDIC Clause 8.4
Zone system: ISO 7243:2017 / ISO 7933:2004
WBGT method: Liljegren (2008) | Apparent Temp: 2-step Chart A+B
================================================================================
END OF REPORT — ${reportId}
================================================================================
`;
}

/* src\plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-8x78vt", ":root{--amb:#e8962a;--n1:#050a18;--n2:#0a1228;--n3:#111e3a;--n4:#1a2d55;--sl:#8a9cc8;--sl2:#4a6090}.fg-mbar.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,24,0.88) !important;border-bottom:2px solid var(--amb) !important;padding:6px 8px !important;display:flex !important;gap:5px !important;align-items:stretch !important;min-height:0 !important;border-radius:0 !important}.fg-mp.svelte-8x78vt.svelte-8x78vt{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 3px;background:rgba(10,18,40,0.75);border:1px solid var(--c,#2d4080);border-radius:8px;cursor:pointer;transition:all 0.15s}.fg-mp.svelte-8x78vt.svelte-8x78vt:active{transform:scale(0.94)}.fg-mp.fg-mp-on.svelte-8x78vt.svelte-8x78vt{border-width:2px;background:rgba(18,32,68,0.95)}.fg-mp-ic.svelte-8x78vt.svelte-8x78vt{font-size:14px;line-height:1}.fg-mp-vl.svelte-8x78vt.svelte-8x78vt{font-size:13px;font-weight:800;color:#fff;line-height:1.1;display:flex;align-items:baseline;gap:1px}.fg-mp-u.svelte-8x78vt.svelte-8x78vt{font-size:7px;color:var(--sl)}.fg-mp-lb.svelte-8x78vt.svelte-8x78vt{font-size:7px;font-weight:800;text-transform:uppercase;letter-spacing:0.4px}.fg-mrf.svelte-8x78vt.svelte-8x78vt{width:26px;flex-shrink:0;align-self:center;background:rgba(10,18,40,0.7);border:1px solid rgba(45,64,128,0.5);border-radius:7px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--sl);padding:5px;transition:all 0.15s}.fg-mrf.svelte-8x78vt.svelte-8x78vt:hover{border-color:var(--amb);color:var(--amb)}.fg-mbar-load.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--sl);padding:8px}.fg-mbar-tap.svelte-8x78vt.svelte-8x78vt{font-size:11px;color:var(--sl);background:transparent;border:1px dashed rgba(45,64,128,0.5);border-radius:7px;padding:7px 14px;cursor:pointer;width:100%}.fg-mdet.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,24,0.95);border-bottom:1px solid rgba(232,150,42,0.3);padding:10px 10px 14px;animation:svelte-8x78vt-slideDown 0.18s ease-out}@keyframes svelte-8x78vt-slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}.fg-mdet-close.svelte-8x78vt.svelte-8x78vt{display:block;width:100%;margin-top:10px;background:rgba(15,29,66,0.6);border:1px solid rgba(45,64,128,0.4);border-radius:6px;color:var(--sl);padding:6px;cursor:pointer;font-size:11px}.fg-panel.svelte-8x78vt.svelte-8x78vt{background:transparent !important;padding:0 !important;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;font-size:12px;color:#e8edf8;overflow-y:auto}.fg-ph.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:7px;padding:6px 9px;background:rgba(5,10,24,0.82);border:1px solid rgba(232,150,42,0.35);border-bottom:none;border-radius:10px 10px 0 0}.fg-ph-logo.svelte-8x78vt.svelte-8x78vt{width:22px;height:22px;object-fit:contain;flex-shrink:0}.fg-ph-shield.svelte-8x78vt.svelte-8x78vt{width:22px;height:22px;background:#1e3a8a;border-radius:4px;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}.fg-ph-txt.svelte-8x78vt.svelte-8x78vt{flex:1;min-width:0;display:flex;flex-direction:column}.fg-ph-title.svelte-8x78vt.svelte-8x78vt{font-size:12px;font-weight:800;color:#fff;line-height:1.1}.fg-ph-sub.svelte-8x78vt.svelte-8x78vt{font-size:7px;color:var(--sl2);text-transform:uppercase;letter-spacing:0.8px}.fg-ph-btn.svelte-8x78vt.svelte-8x78vt{width:22px;height:22px;background:rgba(15,29,66,0.7);border:1px solid rgba(45,64,128,0.5);border-radius:5px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--sl);transition:all 0.15s;flex-shrink:0;padding:0}.fg-ph-btn.svelte-8x78vt.svelte-8x78vt:hover{border-color:var(--amb);color:var(--amb)}.fg-ploc.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:4px;padding:3px 9px;background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3);font-size:9px;color:var(--sl)}.fg-ploc-name.svelte-8x78vt.svelte-8x78vt{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fg-ploc-r.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:3px;flex-shrink:0}.fg-ploc-time.svelte-8x78vt.svelte-8x78vt{color:var(--sl2)}.fg-dbadge.svelte-8x78vt.svelte-8x78vt{background:#78350f;color:#fcd34d;border-radius:3px;padding:1px 4px;font-size:7px;font-weight:700}.fg-nbadge.svelte-8x78vt.svelte-8x78vt{background:#1e1b4b;color:#a5b4fc;border-radius:3px;padding:1px 4px;font-size:7px;font-weight:700}.fg-ptabs.svelte-8x78vt.svelte-8x78vt{display:flex;background:rgba(5,10,24,0.82);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3)}.fg-ptab.svelte-8x78vt.svelte-8x78vt{flex:1;padding:5px 2px;background:transparent;border:none;color:var(--sl2);cursor:pointer;font-size:8px;border-bottom:2px solid transparent;transition:all 0.15s;display:flex;flex-direction:column;align-items:center;gap:1px}.fg-ptab.svelte-8x78vt span.svelte-8x78vt:first-child{font-size:12px}.fg-ptab.fg-ptab-on.svelte-8x78vt.svelte-8x78vt{color:var(--amb);border-bottom-color:var(--amb)}.fg-pgrid.svelte-8x78vt.svelte-8x78vt{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:6px 6px 3px;background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3)}.fg-psb.svelte-8x78vt.svelte-8x78vt{background:rgba(10,18,40,0.8);border:1px solid var(--c,#2d4080);border-radius:8px;padding:10px 4px;cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;gap:2px;transition:all 0.15s;width:100%}.fg-psb.svelte-8x78vt.svelte-8x78vt:hover{filter:brightness(1.15)}.fg-psb.fg-psb-on.svelte-8x78vt.svelte-8x78vt{border-width:2px;background:rgba(18,32,68,0.95)}.fg-psb-ic.svelte-8x78vt.svelte-8x78vt{font-size:17px;line-height:1}.fg-psb-zo.svelte-8x78vt.svelte-8x78vt{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px}.fg-psb-vl.svelte-8x78vt.svelte-8x78vt{font-size:15px;font-weight:800;color:#fff;line-height:1.2}.fg-psb-lb.svelte-8x78vt.svelte-8x78vt{font-size:8px;color:var(--sl)}.fg-psb-ch.svelte-8x78vt.svelte-8x78vt{font-size:7px;color:var(--sl2)}.fg-pdet.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,24,0.88);border:1px solid;border-top:none;padding:9px 7px 7px;border-left-color:rgba(232,150,42,0.3) !important;border-right-color:rgba(232,150,42,0.3) !important}.fg-det-title.svelte-8x78vt.svelte-8x78vt{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:7px}.fg-det-grid.svelte-8x78vt.svelte-8x78vt{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-bottom:6px}.fg-dc.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,22,0.6);border-radius:4px;padding:5px 2px;text-align:center}.fg-dv.svelte-8x78vt.svelte-8x78vt{font-size:12px;font-weight:800;color:#fff;display:block}.fg-dl.svelte-8x78vt.svelte-8x78vt{font-size:7px;color:var(--sl2);text-transform:uppercase;letter-spacing:0.3px}.fg-ds.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,22,0.4);border-radius:4px;padding:5px;margin-bottom:4px}.fg-dr.svelte-8x78vt.svelte-8x78vt{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(10,18,38,0.9);font-size:8px}.fg-dr.svelte-8x78vt.svelte-8x78vt:last-child{border:none}.fg-drl.svelte-8x78vt.svelte-8x78vt{color:var(--sl2)}.fg-drv.svelte-8x78vt.svelte-8x78vt{color:var(--sl);font-weight:500}.fg-drv-sm.svelte-8x78vt.svelte-8x78vt{font-size:7px}.fg-dct.svelte-8x78vt.svelte-8x78vt{font-size:8px;color:var(--amb);text-transform:uppercase;font-weight:700;letter-spacing:0.4px;margin:5px 0 3px}.fg-dci.svelte-8x78vt.svelte-8x78vt{font-size:8px;color:var(--sl);padding:2px 0;border-bottom:1px solid rgba(10,18,38,0.7)}.fg-dci.svelte-8x78vt.svelte-8x78vt:last-child{border:none}.fg-dppe.svelte-8x78vt.svelte-8x78vt{font-size:8px;color:var(--sl2);margin-top:5px}.fg-dthr.svelte-8x78vt.svelte-8x78vt{font-size:8px;color:var(--sl2);text-align:center;margin-top:4px}.fg-night-msg.svelte-8x78vt.svelte-8x78vt{background:rgba(30,27,75,0.5);border-radius:6px;padding:10px;text-align:center;font-size:10px;color:#c7d2fe;display:flex;flex-direction:column;gap:4px}.fg-night-msg.svelte-8x78vt strong.svelte-8x78vt{color:#a5b4fc}.fg-pmr.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:5px;padding:5px 6px 6px;background:rgba(5,10,24,0.82);border:1px solid rgba(232,150,42,0.3);border-top:none;border-radius:0 0 10px 10px}.fg-pmr-sel.svelte-8x78vt.svelte-8x78vt{background:rgba(10,18,40,0.8);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:3px 5px;border-radius:4px;font-size:9px}.fg-pmr-wc.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:3px;margin-left:auto;font-size:8px;color:var(--sl);cursor:pointer}.fg-proch.svelte-8x78vt.svelte-8x78vt{background:var(--amb);color:#0f1d42;font-size:7px;font-weight:800;padding:1px 3px;border-radius:2px}.fg-ptbl.svelte-8x78vt.svelte-8x78vt{padding:0 6px 6px;background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3);border-bottom:1px solid rgba(232,150,42,0.3);border-radius:0 0 10px 10px}.fg-tbl.svelte-8x78vt.svelte-8x78vt{width:100%;border-collapse:collapse;font-size:9px}.fg-tbl.svelte-8x78vt th.svelte-8x78vt{color:var(--sl2);text-align:left;padding:3px 3px;border-bottom:1px solid rgba(45,64,128,0.4);font-weight:600}.fg-tbl.svelte-8x78vt td.svelte-8x78vt{padding:2px 3px;color:var(--sl)}.fg-tbl-best.svelte-8x78vt td.svelte-8x78vt{color:#fff;font-weight:700;background:rgba(10,18,40,0.6)}.fg-pload.svelte-8x78vt.svelte-8x78vt{display:flex;flex-direction:column;align-items:center;gap:8px;padding:18px;color:var(--sl);font-size:10px;background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3);border-bottom:1px solid rgba(232,150,42,0.3);border-radius:0 0 10px 10px}.fg-perr.svelte-8x78vt.svelte-8x78vt{padding:10px 9px;background:rgba(61,10,10,0.85);color:#fca5a5;font-size:10px;border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3);border-bottom:1px solid #7f1d1d;border-radius:0 0 10px 10px}.fg-ban.svelte-8x78vt.svelte-8x78vt{padding:6px 9px;background:rgba(124,45,18,0.85);color:#fed7aa;font-size:10px;font-weight:700;text-align:center;border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3);border-bottom:1px solid var(--amb)}.fg-spin.svelte-8x78vt.svelte-8x78vt{width:16px;height:16px;border:2px solid rgba(45,64,128,0.5);border-top-color:var(--amb);border-radius:50%;animation:svelte-8x78vt-spin 0.8s linear infinite}@keyframes svelte-8x78vt-spin{to{transform:rotate(360deg)}}.fg-psec.svelte-8x78vt.svelte-8x78vt{padding:7px 9px 3px;font-size:9px;color:var(--amb);text-transform:uppercase;letter-spacing:1px;font-weight:700;background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3)}.fg-empty.svelte-8x78vt.svelte-8x78vt{padding:14px;text-align:center;color:var(--sl2);font-size:10px;background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3);border-bottom:1px solid rgba(232,150,42,0.3);border-radius:0 0 10px 10px}.fg-pemg.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,24,0.75);border:1px solid rgba(220,38,38,0.5);border-top:none;border-radius:0 0 10px 10px;padding:10px 9px}.fg-pemg-warn.svelte-8x78vt.svelte-8x78vt{font-size:11px;font-weight:700;color:#f87171;margin-bottom:4px}.fg-pemg-sub.svelte-8x78vt.svelte-8x78vt{font-size:9px;color:var(--sl);margin-bottom:8px}.fg-pemg-hd.svelte-8x78vt.svelte-8x78vt{font-size:8px;color:var(--sl2);text-transform:uppercase;font-weight:700;margin-bottom:5px}.fg-pemg-syms.svelte-8x78vt.svelte-8x78vt{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:8px}.fg-sym.svelte-8x78vt.svelte-8x78vt{background:rgba(61,10,10,0.8);color:#fca5a5;border-radius:3px;padding:2px 5px;font-size:8px}.fg-pemg-step.svelte-8x78vt.svelte-8x78vt{display:flex;gap:6px;align-items:flex-start;padding:3px 0;font-size:9px;color:var(--sl);border-bottom:1px solid rgba(10,18,38,0.8)}.fg-pemg-step.svelte-8x78vt.svelte-8x78vt:last-child{border:none}.fg-pemg-n.svelte-8x78vt.svelte-8x78vt{background:rgba(45,64,128,0.6);color:#e8edf8;border-radius:3px;padding:1px 4px;font-size:8px;font-weight:700;flex-shrink:0}.fg-pemg-crit.svelte-8x78vt.svelte-8x78vt{color:#f87171 !important;font-weight:700}.fg-pemg-crit.svelte-8x78vt .fg-pemg-n.svelte-8x78vt{background:#dc2626}.fg-alog.svelte-8x78vt.svelte-8x78vt{margin:3px 9px;padding:6px 8px;background:rgba(10,18,40,0.7);border-radius:5px;border-left:3px solid}.fg-alog-t.svelte-8x78vt.svelte-8x78vt{font-size:10px;font-weight:700;color:#fff}.fg-alog-m.svelte-8x78vt.svelte-8x78vt{font-size:9px;color:var(--sl)}.fg-alog-tm.svelte-8x78vt.svelte-8x78vt{font-size:8px;color:var(--sl2)}.fg-prform.svelte-8x78vt.svelte-8x78vt{padding:6px 9px;display:grid;grid-template-columns:1fr 1fr;gap:4px;background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3)}label.svelte-8x78vt.svelte-8x78vt{display:block;color:var(--sl);font-size:9px}label.svelte-8x78vt input.svelte-8x78vt,label.svelte-8x78vt select.svelte-8x78vt{display:block;width:100%;background:rgba(5,10,22,0.9);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:4px 6px;border-radius:4px;font-size:9px;margin-top:2px;box-sizing:border-box}label.svelte-8x78vt input.svelte-8x78vt:focus,label.svelte-8x78vt select.svelte-8x78vt:focus{outline:none;border-color:var(--amb)}.fg-pbtn.svelte-8x78vt.svelte-8x78vt{display:block;width:calc(100% - 0px);margin:0;padding:8px;border:none;border-radius:0;font-size:11px;font-weight:800;cursor:pointer;background:var(--amb);color:#0f1d42;border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3)}.fg-pbtn-sec.svelte-8x78vt.svelte-8x78vt{background:rgba(10,18,40,0.8);color:var(--sl);border:1px solid rgba(45,64,128,0.4);border-radius:5px;width:calc(100%)}.fg-pbtn-amber.svelte-8x78vt.svelte-8x78vt{display:block;text-align:center;text-decoration:none;background:var(--amb);color:#0f1d42 !important;padding:7px;border-radius:5px;font-size:10px;font-weight:800;margin-top:5px}.fg-prep.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,22,0.9);border:1px solid rgba(45,64,128,0.4);border-radius:0 0 10px 10px;overflow:hidden}.fg-prep-bar.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(10,18,40,0.9);border-bottom:1px solid rgba(45,64,128,0.3);font-size:9px;color:var(--sl2)}.fg-prep-bar.svelte-8x78vt span.svelte-8x78vt{flex:1}.fg-prep-btn.svelte-8x78vt.svelte-8x78vt{background:rgba(45,64,128,0.5);border:none;color:var(--sl);padding:2px 7px;border-radius:3px;cursor:pointer;font-size:9px}.fg-prep-txt.svelte-8x78vt.svelte-8x78vt{padding:8px;font-size:8px;color:var(--sl);white-space:pre;overflow:auto;max-height:220px;font-family:'Courier New', monospace;line-height:1.4}.fg-pgrp.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3);border-bottom:1px solid rgba(45,64,128,0.2);padding:8px 9px}.fg-pgrp.svelte-8x78vt.svelte-8x78vt:last-child{border-bottom:1px solid rgba(232,150,42,0.3);border-radius:0 0 10px 10px}.fg-lic-grp.svelte-8x78vt.svelte-8x78vt{border-top:none}.fg-pgrp-hd.svelte-8x78vt.svelte-8x78vt{font-size:9px;font-weight:700;color:var(--amb);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:7px}.fg-lic-act.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.fg-lic-badge.svelte-8x78vt.svelte-8x78vt{background:rgba(5,46,22,0.8);color:#4ade80;border:1px solid #16a34a;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700}.fg-lic-info.svelte-8x78vt.svelte-8x78vt{font-size:10px;color:#86efac;flex:1}.fg-lic-deact.svelte-8x78vt.svelte-8x78vt{background:rgba(10,18,40,0.8);border:1px solid rgba(45,64,128,0.5);color:var(--sl);padding:3px 8px;border-radius:4px;cursor:pointer;font-size:9px}.fg-lic-free.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,22,0.6);border-radius:5px;padding:8px;margin-bottom:7px;border:1px solid rgba(45,64,128,0.3)}.fg-lic-free-tag.svelte-8x78vt.svelte-8x78vt{font-size:8px;font-weight:700;color:var(--sl2);text-transform:uppercase;margin-bottom:5px}.fg-lic-free-list.svelte-8x78vt.svelte-8x78vt{font-size:9px;color:var(--sl2);line-height:1.7;margin-bottom:5px}.fg-lic-row.svelte-8x78vt.svelte-8x78vt{display:flex;gap:4px}.fg-lic-input.svelte-8x78vt.svelte-8x78vt{flex:1;background:rgba(5,10,22,0.9);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:4px 6px;border-radius:4px;font-size:9px;font-family:monospace}.fg-lic-input.svelte-8x78vt.svelte-8x78vt:disabled{opacity:0.5}.fg-lic-act-btn.svelte-8x78vt.svelte-8x78vt{background:var(--amb);border:none;color:#0f1d42;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:800;white-space:nowrap}.fg-lic-act-btn.svelte-8x78vt.svelte-8x78vt:disabled{background:rgba(45,64,128,0.4);color:var(--sl2);cursor:not-allowed}.fg-lic-err.svelte-8x78vt.svelte-8x78vt{margin-top:5px;font-size:9px;color:#f87171;padding:4px 6px;background:rgba(61,10,10,0.8);border-radius:4px}.fg-radio.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:6px;padding:4px 0;cursor:pointer;border-bottom:1px solid rgba(5,10,22,0.8);font-size:9px;color:#c8d4f0}.fg-radio.svelte-8x78vt.svelte-8x78vt:last-child{border-bottom:none}.fg-radio.svelte-8x78vt span.svelte-8x78vt{flex:1}.fg-adjch.svelte-8x78vt.svelte-8x78vt{background:rgba(5,10,22,0.8);color:var(--sl);border-radius:2px;padding:1px 4px;font-size:8px}.fg-slbl.svelte-8x78vt.svelte-8x78vt{display:block;color:var(--sl);font-size:9px;margin-bottom:4px}.fg-srow.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:6px;margin-top:2px}.fg-srow.svelte-8x78vt input[type=\"range\"].svelte-8x78vt{flex:1;accent-color:var(--amb)}.fg-srow.svelte-8x78vt span.svelte-8x78vt{min-width:48px;text-align:right;color:var(--amb);font-size:9px;font-weight:700}.fg-tog.svelte-8x78vt.svelte-8x78vt{display:flex;align-items:center;gap:6px;padding:4px 0;cursor:pointer;font-size:9px;color:#c8d4f0;border-bottom:1px solid rgba(5,10,22,0.8)}.fg-tog.svelte-8x78vt.svelte-8x78vt:last-child{border-bottom:none}input[type=\"checkbox\"].svelte-8x78vt.svelte-8x78vt{accent-color:var(--amb)}.fg-gate.svelte-8x78vt.svelte-8x78vt{padding:16px 12px;background:rgba(5,10,24,0.75);border-left:1px solid rgba(232,150,42,0.3);border-right:1px solid rgba(232,150,42,0.3);border-bottom:1px solid rgba(232,150,42,0.3);border-radius:0 0 10px 10px;text-align:center}.fg-gate-ic.svelte-8x78vt.svelte-8x78vt{font-size:28px;margin-bottom:6px}.fg-gate-ti.svelte-8x78vt.svelte-8x78vt{font-size:13px;font-weight:800;color:#fff;margin-bottom:6px}.fg-gate-desc.svelte-8x78vt.svelte-8x78vt{font-size:10px;color:var(--sl2);margin-bottom:10px}.fg-gate-btn.svelte-8x78vt.svelte-8x78vt{display:block;background:var(--amb);color:#0f1d42 !important;text-decoration:none;padding:8px 12px;border-radius:6px;font-size:11px;font-weight:800}.fg-disabled.svelte-8x78vt.svelte-8x78vt{opacity:0.4;pointer-events:none}.plugin__mobile-header.svelte-8x78vt.svelte-8x78vt{display:none !important}.fg-mdet.svelte-8x78vt.svelte-8x78vt{display:none}");
}

function get_each_context_6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[108] = list[i][0];
	child_ctx[109] = list[i][1];
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[99] = list[i];
	return child_ctx;
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[102] = list[i];
	child_ctx[104] = i;
	return child_ctx;
}

function get_each_context_5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[105] = list[i];
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[90] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[93] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[96] = list[i];
	return child_ctx;
}

function get_each_context_7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[112] = list[i];
	return child_ctx;
}

function get_each_context_8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[96] = list[i];
	return child_ctx;
}

// (31:2) {:else}
function create_else_block_7(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "⚡ Tap to load FieldGuard";
			attr(button, "class", "fg-mbar-tap svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*refreshData*/ ctx[38]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (7:17) 
function create_if_block_31(ctx) {
	let button0;
	let span0;
	let t1;
	let span1;

	let t2_value = (/*heat*/ ctx[9].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[9].apparentTempFinal + '°C') + "";

	let t2;
	let t3;
	let span2;
	let t4_value = /*heat*/ ctx[9].zoneInfo.riskLabel + "";
	let t4;
	let button0_class_value;
	let t5;
	let button1;
	let span3;
	let t7;
	let span5;
	let t8_value = /*rawData*/ ctx[8]?.windMs.toFixed(1) + "";
	let t8;
	let span4;
	let t10;
	let span6;
	let t11_value = /*windResult*/ ctx[10]?.riskLabel + "";
	let t11;
	let button1_class_value;
	let t12;
	let button2;
	let span7;
	let t14;
	let span9;
	let t15_value = /*rawData*/ ctx[8]?.rainMmH.toFixed(1) + "";
	let t15;
	let span8;
	let t17;
	let span10;
	let t18_value = /*rainResult*/ ctx[11]?.riskLabel + "";
	let t18;
	let button2_class_value;
	let t19;
	let button3;
	let span11;
	let t20_value = (/*isNight*/ ctx[17] ? '🌙' : '☀') + "";
	let t20;
	let t21;
	let span13;

	let t22_value = (/*isNight*/ ctx[17]
	? '--'
	: /*rawData*/ ctx[8]?.solarWm2) + "";

	let t22;
	let span12;
	let t23_value = (/*isNight*/ ctx[17] ? '' : 'W') + "";
	let t23;
	let t24;
	let span14;
	let t25;
	let button3_class_value;
	let t26;
	let button4;
	let mounted;
	let dispose;

	return {
		c() {
			button0 = element("button");
			span0 = element("span");
			span0.textContent = "🌡";
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			span2 = element("span");
			t4 = text(t4_value);
			t5 = space();
			button1 = element("button");
			span3 = element("span");
			span3.textContent = "💨";
			t7 = space();
			span5 = element("span");
			t8 = text(t8_value);
			span4 = element("span");
			span4.textContent = "m/s";
			t10 = space();
			span6 = element("span");
			t11 = text(t11_value);
			t12 = space();
			button2 = element("button");
			span7 = element("span");
			span7.textContent = "🌧";
			t14 = space();
			span9 = element("span");
			t15 = text(t15_value);
			span8 = element("span");
			span8.textContent = "mm";
			t17 = space();
			span10 = element("span");
			t18 = text(t18_value);
			t19 = space();
			button3 = element("button");
			span11 = element("span");
			t20 = text(t20_value);
			t21 = space();
			span13 = element("span");
			t22 = text(t22_value);
			span12 = element("span");
			t23 = text(t23_value);
			t24 = space();
			span14 = element("span");
			t25 = text(/*solarLabel*/ ctx[25]);
			t26 = space();
			button4 = element("button");
			button4.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>`;
			attr(span0, "class", "fg-mp-ic svelte-8x78vt");
			attr(span1, "class", "fg-mp-vl svelte-8x78vt");
			attr(span2, "class", "fg-mp-lb svelte-8x78vt");
			set_style(span2, "color", /*heat*/ ctx[9].zoneInfo.color);
			attr(button0, "class", button0_class_value = "fg-mp " + (/*mActive*/ ctx[7] === 'heat' ? 'fg-mp-on' : '') + " svelte-8x78vt");
			set_style(button0, "--c", /*heat*/ ctx[9].zoneInfo.color);
			attr(span3, "class", "fg-mp-ic svelte-8x78vt");
			attr(span4, "class", "fg-mp-u svelte-8x78vt");
			attr(span5, "class", "fg-mp-vl svelte-8x78vt");
			attr(span6, "class", "fg-mp-lb svelte-8x78vt");
			set_style(span6, "color", /*windResult*/ ctx[10]?.riskColor);
			attr(button1, "class", button1_class_value = "fg-mp " + (/*mActive*/ ctx[7] === 'wind' ? 'fg-mp-on' : '') + " svelte-8x78vt");
			set_style(button1, "--c", /*windResult*/ ctx[10]?.riskColor);
			attr(span7, "class", "fg-mp-ic svelte-8x78vt");
			attr(span8, "class", "fg-mp-u svelte-8x78vt");
			attr(span9, "class", "fg-mp-vl svelte-8x78vt");
			attr(span10, "class", "fg-mp-lb svelte-8x78vt");
			set_style(span10, "color", /*rainResult*/ ctx[11]?.riskColor);
			attr(button2, "class", button2_class_value = "fg-mp " + (/*mActive*/ ctx[7] === 'rain' ? 'fg-mp-on' : '') + " svelte-8x78vt");
			set_style(button2, "--c", /*rainResult*/ ctx[11]?.riskColor);
			attr(span11, "class", "fg-mp-ic svelte-8x78vt");
			attr(span12, "class", "fg-mp-u svelte-8x78vt");
			attr(span13, "class", "fg-mp-vl svelte-8x78vt");
			attr(span14, "class", "fg-mp-lb svelte-8x78vt");
			set_style(span14, "color", /*solarColor*/ ctx[24]);
			attr(button3, "class", button3_class_value = "fg-mp " + (/*mActive*/ ctx[7] === 'solar' ? 'fg-mp-on' : '') + " svelte-8x78vt");
			set_style(button3, "--c", /*solarColor*/ ctx[24]);
			attr(button4, "class", "fg-mrf svelte-8x78vt");
			attr(button4, "title", "Refresh");
		},
		m(target, anchor) {
			insert(target, button0, anchor);
			append(button0, span0);
			append(button0, t1);
			append(button0, span1);
			append(span1, t2);
			append(button0, t3);
			append(button0, span2);
			append(span2, t4);
			insert(target, t5, anchor);
			insert(target, button1, anchor);
			append(button1, span3);
			append(button1, t7);
			append(button1, span5);
			append(span5, t8);
			append(span5, span4);
			append(button1, t10);
			append(button1, span6);
			append(span6, t11);
			insert(target, t12, anchor);
			insert(target, button2, anchor);
			append(button2, span7);
			append(button2, t14);
			append(button2, span9);
			append(span9, t15);
			append(span9, span8);
			append(button2, t17);
			append(button2, span10);
			append(span10, t18);
			insert(target, t19, anchor);
			insert(target, button3, anchor);
			append(button3, span11);
			append(span11, t20);
			append(button3, t21);
			append(button3, span13);
			append(span13, t22);
			append(span13, span12);
			append(span12, t23);
			append(button3, t24);
			append(button3, span14);
			append(span14, t25);
			insert(target, t26, anchor);
			insert(target, button4, anchor);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler*/ ctx[46]),
					listen(button1, "click", /*click_handler_1*/ ctx[47]),
					listen(button2, "click", /*click_handler_2*/ ctx[48]),
					listen(button3, "click", /*click_handler_3*/ ctx[49]),
					listen(button4, "click", /*refreshData*/ ctx[38])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 512 && t2_value !== (t2_value = (/*heat*/ ctx[9].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[9].apparentTempFinal + '°C') + "")) set_data(t2, t2_value);

			if (dirty[0] & /*heat*/ 512 && t4_value !== (t4_value = /*heat*/ ctx[9].zoneInfo.riskLabel + "")) set_data(t4, t4_value);

			if (dirty[0] & /*heat*/ 512) {
				set_style(span2, "color", /*heat*/ ctx[9].zoneInfo.color);
			}

			if (dirty[0] & /*mActive*/ 128 && button0_class_value !== (button0_class_value = "fg-mp " + (/*mActive*/ ctx[7] === 'heat' ? 'fg-mp-on' : '') + " svelte-8x78vt")) {
				attr(button0, "class", button0_class_value);
			}

			if (dirty[0] & /*heat*/ 512) {
				set_style(button0, "--c", /*heat*/ ctx[9].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 256 && t8_value !== (t8_value = /*rawData*/ ctx[8]?.windMs.toFixed(1) + "")) set_data(t8, t8_value);
			if (dirty[0] & /*windResult*/ 1024 && t11_value !== (t11_value = /*windResult*/ ctx[10]?.riskLabel + "")) set_data(t11, t11_value);

			if (dirty[0] & /*windResult*/ 1024) {
				set_style(span6, "color", /*windResult*/ ctx[10]?.riskColor);
			}

			if (dirty[0] & /*mActive*/ 128 && button1_class_value !== (button1_class_value = "fg-mp " + (/*mActive*/ ctx[7] === 'wind' ? 'fg-mp-on' : '') + " svelte-8x78vt")) {
				attr(button1, "class", button1_class_value);
			}

			if (dirty[0] & /*windResult*/ 1024) {
				set_style(button1, "--c", /*windResult*/ ctx[10]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 256 && t15_value !== (t15_value = /*rawData*/ ctx[8]?.rainMmH.toFixed(1) + "")) set_data(t15, t15_value);
			if (dirty[0] & /*rainResult*/ 2048 && t18_value !== (t18_value = /*rainResult*/ ctx[11]?.riskLabel + "")) set_data(t18, t18_value);

			if (dirty[0] & /*rainResult*/ 2048) {
				set_style(span10, "color", /*rainResult*/ ctx[11]?.riskColor);
			}

			if (dirty[0] & /*mActive*/ 128 && button2_class_value !== (button2_class_value = "fg-mp " + (/*mActive*/ ctx[7] === 'rain' ? 'fg-mp-on' : '') + " svelte-8x78vt")) {
				attr(button2, "class", button2_class_value);
			}

			if (dirty[0] & /*rainResult*/ 2048) {
				set_style(button2, "--c", /*rainResult*/ ctx[11]?.riskColor);
			}

			if (dirty[0] & /*isNight*/ 131072 && t20_value !== (t20_value = (/*isNight*/ ctx[17] ? '🌙' : '☀') + "")) set_data(t20, t20_value);

			if (dirty[0] & /*isNight, rawData*/ 131328 && t22_value !== (t22_value = (/*isNight*/ ctx[17]
			? '--'
			: /*rawData*/ ctx[8]?.solarWm2) + "")) set_data(t22, t22_value);

			if (dirty[0] & /*isNight*/ 131072 && t23_value !== (t23_value = (/*isNight*/ ctx[17] ? '' : 'W') + "")) set_data(t23, t23_value);
			if (dirty[0] & /*solarLabel*/ 33554432) set_data(t25, /*solarLabel*/ ctx[25]);

			if (dirty[0] & /*solarColor*/ 16777216) {
				set_style(span14, "color", /*solarColor*/ ctx[24]);
			}

			if (dirty[0] & /*mActive*/ 128 && button3_class_value !== (button3_class_value = "fg-mp " + (/*mActive*/ ctx[7] === 'solar' ? 'fg-mp-on' : '') + " svelte-8x78vt")) {
				attr(button3, "class", button3_class_value);
			}

			if (dirty[0] & /*solarColor*/ 16777216) {
				set_style(button3, "--c", /*solarColor*/ ctx[24]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button0);
				detach(t5);
				detach(button1);
				detach(t12);
				detach(button2);
				detach(t19);
				detach(button3);
				detach(t26);
				detach(button4);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (5:2) {#if loading}
function create_if_block_30(ctx) {
	let div1;

	return {
		c() {
			div1 = element("div");
			div1.innerHTML = `<div class="fg-spin svelte-8x78vt"></div><span>Loading…</span>`;
			attr(div1, "class", "fg-mbar-load svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div1);
			}
		}
	};
}

// (37:0) {#if mActive}
function create_if_block_24(ctx) {
	let div;
	let t0;
	let button;
	let mounted;
	let dispose;

	function select_block_type_1(ctx, dirty) {
		if (/*mActive*/ ctx[7] === 'heat' && /*heat*/ ctx[9]) return create_if_block_25;
		if (/*mActive*/ ctx[7] === 'wind' && /*windResult*/ ctx[10]) return create_if_block_26;
		if (/*mActive*/ ctx[7] === 'rain' && /*rainResult*/ ctx[11]) return create_if_block_27;
		if (/*mActive*/ ctx[7] === 'solar') return create_if_block_28;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	return {
		c() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			button = element("button");
			button.textContent = "✕ Close";
			attr(button, "class", "fg-mdet-close svelte-8x78vt");
			attr(div, "class", "fg-mdet svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append(div, t0);
			append(div, button);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_4*/ ctx[50]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, t0);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if (if_block) {
				if_block.d();
			}

			mounted = false;
			dispose();
		}
	};
}

// (71:34) 
function create_if_block_28(ctx) {
	let div;

	let t0_value = (/*isNight*/ ctx[17]
	? '🌙 Night — No Solar'
	: '☀ Solar — ' + /*solarLabel*/ ctx[25]) + "";

	let t0;
	let t1;
	let if_block_anchor;

	function select_block_type_2(ctx, dirty) {
		if (/*isNight*/ ctx[17]) return create_if_block_29;
		return create_else_block_6;
	}

	let current_block_type = select_block_type_2(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div = element("div");
			t0 = text(t0_value);
			t1 = space();
			if_block.c();
			if_block_anchor = empty();
			attr(div, "class", "fg-det-title svelte-8x78vt");
			set_style(div, "color", /*solarColor*/ ctx[24]);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			insert(target, t1, anchor);
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*isNight, solarLabel*/ 33685504 && t0_value !== (t0_value = (/*isNight*/ ctx[17]
			? '🌙 Night — No Solar'
			: '☀ Solar — ' + /*solarLabel*/ ctx[25]) + "")) set_data(t0, t0_value);

			if (dirty[0] & /*solarColor*/ 16777216) {
				set_style(div, "color", /*solarColor*/ ctx[24]);
			}

			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
				detach(t1);
				detach(if_block_anchor);
			}

			if_block.d(detaching);
		}
	};
}

// (64:47) 
function create_if_block_27(ctx) {
	let div0;
	let t0;
	let t1_value = /*rainResult*/ ctx[11].riskLabel + "";
	let t1;
	let t2;
	let div3;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[8]?.rainMmH.toFixed(1) + "";
	let t3;
	let span1;
	let t5;
	let div2;
	let span2;
	let t6_value = /*rainResult*/ ctx[11].intensityLabel + "";
	let t6;
	let span3;
	let t8;
	let div4;
	let t9;
	let t10_value = /*settings*/ ctx[30].rainWarnMmh + "";
	let t10;
	let t11;
	let t12_value = /*settings*/ ctx[30].rainDangerMmh + "";
	let t12;
	let t13;

	return {
		c() {
			div0 = element("div");
			t0 = text("🌧 Rain — ");
			t1 = text(t1_value);
			t2 = space();
			div3 = element("div");
			div1 = element("div");
			span0 = element("span");
			t3 = text(t3_value);
			span1 = element("span");
			span1.textContent = "mm/h";
			t5 = space();
			div2 = element("div");
			span2 = element("span");
			t6 = text(t6_value);
			span3 = element("span");
			span3.textContent = "Intensity";
			t8 = space();
			div4 = element("div");
			t9 = text("Warn ≥ ");
			t10 = text(t10_value);
			t11 = text(" mm/h · Danger ≥ ");
			t12 = text(t12_value);
			t13 = text(" mm/h");
			attr(div0, "class", "fg-det-title svelte-8x78vt");
			set_style(div0, "color", /*rainResult*/ ctx[11].riskColor);
			attr(span0, "class", "fg-dv svelte-8x78vt");
			attr(span1, "class", "fg-dl svelte-8x78vt");
			attr(div1, "class", "fg-dc svelte-8x78vt");
			attr(span2, "class", "fg-dv svelte-8x78vt");
			attr(span3, "class", "fg-dl svelte-8x78vt");
			attr(div2, "class", "fg-dc svelte-8x78vt");
			attr(div3, "class", "fg-det-grid svelte-8x78vt");
			attr(div4, "class", "fg-dthr svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, t0);
			append(div0, t1);
			insert(target, t2, anchor);
			insert(target, div3, anchor);
			append(div3, div1);
			append(div1, span0);
			append(span0, t3);
			append(div1, span1);
			append(div3, t5);
			append(div3, div2);
			append(div2, span2);
			append(span2, t6);
			append(div2, span3);
			insert(target, t8, anchor);
			insert(target, div4, anchor);
			append(div4, t9);
			append(div4, t10);
			append(div4, t11);
			append(div4, t12);
			append(div4, t13);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rainResult*/ 2048 && t1_value !== (t1_value = /*rainResult*/ ctx[11].riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*rainResult*/ 2048) {
				set_style(div0, "color", /*rainResult*/ ctx[11].riskColor);
			}

			if (dirty[0] & /*rawData*/ 256 && t3_value !== (t3_value = /*rawData*/ ctx[8]?.rainMmH.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rainResult*/ 2048 && t6_value !== (t6_value = /*rainResult*/ ctx[11].intensityLabel + "")) set_data(t6, t6_value);
			if (dirty[0] & /*settings*/ 1073741824 && t10_value !== (t10_value = /*settings*/ ctx[30].rainWarnMmh + "")) set_data(t10, t10_value);
			if (dirty[0] & /*settings*/ 1073741824 && t12_value !== (t12_value = /*settings*/ ctx[30].rainDangerMmh + "")) set_data(t12, t12_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t2);
				detach(div3);
				detach(t8);
				detach(div4);
			}
		}
	};
}

// (56:47) 
function create_if_block_26(ctx) {
	let div0;
	let t0;
	let t1_value = /*windResult*/ ctx[10].riskLabel + "";
	let t1;
	let t2;
	let div4;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[8]?.windMs.toFixed(1) + "";
	let t3;
	let span1;
	let t5;
	let div2;
	let span2;
	let t6_value = ((/*rawData*/ ctx[8]?.windMs ?? 0) * 3.6).toFixed(1) + "";
	let t6;
	let span3;
	let t8;
	let div3;
	let span4;
	let t9;
	let t10_value = /*windResult*/ ctx[10].beaufort + "";
	let t10;
	let span5;
	let t11_value = /*windResult*/ ctx[10].beaufortDesc + "";
	let t11;
	let t12;
	let div5;
	let t13;
	let t14_value = /*settings*/ ctx[30].windWarnMs + "";
	let t14;
	let t15;
	let t16_value = /*settings*/ ctx[30].windDangerMs + "";
	let t16;
	let t17;

	return {
		c() {
			div0 = element("div");
			t0 = text("💨 Wind — ");
			t1 = text(t1_value);
			t2 = space();
			div4 = element("div");
			div1 = element("div");
			span0 = element("span");
			t3 = text(t3_value);
			span1 = element("span");
			span1.textContent = "m/s";
			t5 = space();
			div2 = element("div");
			span2 = element("span");
			t6 = text(t6_value);
			span3 = element("span");
			span3.textContent = "km/h";
			t8 = space();
			div3 = element("div");
			span4 = element("span");
			t9 = text("Bft ");
			t10 = text(t10_value);
			span5 = element("span");
			t11 = text(t11_value);
			t12 = space();
			div5 = element("div");
			t13 = text("Warn ≥ ");
			t14 = text(t14_value);
			t15 = text(" m/s · Danger ≥ ");
			t16 = text(t16_value);
			t17 = text(" m/s");
			attr(div0, "class", "fg-det-title svelte-8x78vt");
			set_style(div0, "color", /*windResult*/ ctx[10].riskColor);
			attr(span0, "class", "fg-dv svelte-8x78vt");
			attr(span1, "class", "fg-dl svelte-8x78vt");
			attr(div1, "class", "fg-dc svelte-8x78vt");
			attr(span2, "class", "fg-dv svelte-8x78vt");
			attr(span3, "class", "fg-dl svelte-8x78vt");
			attr(div2, "class", "fg-dc svelte-8x78vt");
			attr(span4, "class", "fg-dv svelte-8x78vt");
			attr(span5, "class", "fg-dl svelte-8x78vt");
			attr(div3, "class", "fg-dc svelte-8x78vt");
			attr(div4, "class", "fg-det-grid svelte-8x78vt");
			attr(div5, "class", "fg-dthr svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, t0);
			append(div0, t1);
			insert(target, t2, anchor);
			insert(target, div4, anchor);
			append(div4, div1);
			append(div1, span0);
			append(span0, t3);
			append(div1, span1);
			append(div4, t5);
			append(div4, div2);
			append(div2, span2);
			append(span2, t6);
			append(div2, span3);
			append(div4, t8);
			append(div4, div3);
			append(div3, span4);
			append(span4, t9);
			append(span4, t10);
			append(div3, span5);
			append(span5, t11);
			insert(target, t12, anchor);
			insert(target, div5, anchor);
			append(div5, t13);
			append(div5, t14);
			append(div5, t15);
			append(div5, t16);
			append(div5, t17);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*windResult*/ 1024 && t1_value !== (t1_value = /*windResult*/ ctx[10].riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*windResult*/ 1024) {
				set_style(div0, "color", /*windResult*/ ctx[10].riskColor);
			}

			if (dirty[0] & /*rawData*/ 256 && t3_value !== (t3_value = /*rawData*/ ctx[8]?.windMs.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rawData*/ 256 && t6_value !== (t6_value = ((/*rawData*/ ctx[8]?.windMs ?? 0) * 3.6).toFixed(1) + "")) set_data(t6, t6_value);
			if (dirty[0] & /*windResult*/ 1024 && t10_value !== (t10_value = /*windResult*/ ctx[10].beaufort + "")) set_data(t10, t10_value);
			if (dirty[0] & /*windResult*/ 1024 && t11_value !== (t11_value = /*windResult*/ ctx[10].beaufortDesc + "")) set_data(t11, t11_value);
			if (dirty[0] & /*settings*/ 1073741824 && t14_value !== (t14_value = /*settings*/ ctx[30].windWarnMs + "")) set_data(t14, t14_value);
			if (dirty[0] & /*settings*/ 1073741824 && t16_value !== (t16_value = /*settings*/ ctx[30].windDangerMs + "")) set_data(t16, t16_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t2);
				detach(div4);
				detach(t12);
				detach(div5);
			}
		}
	};
}

// (39:4) {#if mActive === 'heat' && heat}
function create_if_block_25(ctx) {
	let div0;
	let t0;
	let t1_value = /*heat*/ ctx[9].zoneInfo.riskLabel + "";
	let t1;
	let t2;
	let div7;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[8]?.tempC + "";
	let t3;
	let t4;
	let span1;
	let t6;
	let div2;
	let span2;
	let t7_value = /*rawData*/ ctx[8]?.humidity + "";
	let t7;
	let t8;
	let span3;
	let t10;
	let div3;
	let span4;
	let t11_value = /*heat*/ ctx[9].apparentTemp1 + "";
	let t11;
	let t12;
	let span5;
	let t14;
	let div4;
	let span6;

	let t15_value = (/*heat*/ ctx[9].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[9].apparentTempFinal + '°C') + "";

	let t15;
	let span7;
	let t17;
	let div5;
	let span8;
	let t18_value = /*heat*/ ctx[9].wbgtBase + "";
	let t18;
	let t19;
	let span9;
	let t21;
	let div6;
	let span10;
	let t22_value = /*heat*/ ctx[9].wbgtAdjusted + "";
	let t22;
	let t23;
	let span11;
	let t25;
	let div11;
	let div8;
	let span12;
	let span13;
	let t27_value = /*heat*/ ctx[9].workRestSchedule.light + "";
	let t27;
	let t28;
	let div9;
	let span14;
	let span15;
	let t30_value = /*heat*/ ctx[9].workRestSchedule.heavy + "";
	let t30;
	let t31;
	let div10;
	let span16;
	let span17;
	let t33_value = /*heat*/ ctx[9].hydration + "";
	let t33;
	let t34;
	let div12;
	let t36;
	let each_1_anchor;
	let each_value_8 = ensure_array_like(/*heat*/ ctx[9].zoneInfo.mandatoryControls);
	let each_blocks = [];

	for (let i = 0; i < each_value_8.length; i += 1) {
		each_blocks[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
	}

	return {
		c() {
			div0 = element("div");
			t0 = text("🌡 Heat Stress — ");
			t1 = text(t1_value);
			t2 = space();
			div7 = element("div");
			div1 = element("div");
			span0 = element("span");
			t3 = text(t3_value);
			t4 = text("°C");
			span1 = element("span");
			span1.textContent = "Temp";
			t6 = space();
			div2 = element("div");
			span2 = element("span");
			t7 = text(t7_value);
			t8 = text("%");
			span3 = element("span");
			span3.textContent = "Humidity";
			t10 = space();
			div3 = element("div");
			span4 = element("span");
			t11 = text(t11_value);
			t12 = text("°C");
			span5 = element("span");
			span5.textContent = "App.T A";
			t14 = space();
			div4 = element("div");
			span6 = element("span");
			t15 = text(t15_value);
			span7 = element("span");
			span7.textContent = "App.T B";
			t17 = space();
			div5 = element("div");
			span8 = element("span");
			t18 = text(t18_value);
			t19 = text("°C");
			span9 = element("span");
			span9.textContent = "WBGT";
			t21 = space();
			div6 = element("div");
			span10 = element("span");
			t22 = text(t22_value);
			t23 = text("°C");
			span11 = element("span");
			span11.textContent = "WBGT+PPE";
			t25 = space();
			div11 = element("div");
			div8 = element("div");
			span12 = element("span");
			span12.textContent = "🕐 Light work";
			span13 = element("span");
			t27 = text(t27_value);
			t28 = space();
			div9 = element("div");
			span14 = element("span");
			span14.textContent = "💪 Heavy work";
			span15 = element("span");
			t30 = text(t30_value);
			t31 = space();
			div10 = element("div");
			span16 = element("span");
			span16.textContent = "💧 Hydration";
			span17 = element("span");
			t33 = text(t33_value);
			t34 = space();
			div12 = element("div");
			div12.textContent = "⚠ Mandatory Controls";
			t36 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
			attr(div0, "class", "fg-det-title svelte-8x78vt");
			set_style(div0, "color", /*heat*/ ctx[9].zoneInfo.color);
			attr(span0, "class", "fg-dv svelte-8x78vt");
			attr(span1, "class", "fg-dl svelte-8x78vt");
			attr(div1, "class", "fg-dc svelte-8x78vt");
			attr(span2, "class", "fg-dv svelte-8x78vt");
			attr(span3, "class", "fg-dl svelte-8x78vt");
			attr(div2, "class", "fg-dc svelte-8x78vt");
			attr(span4, "class", "fg-dv svelte-8x78vt");
			attr(span5, "class", "fg-dl svelte-8x78vt");
			attr(div3, "class", "fg-dc svelte-8x78vt");
			attr(span6, "class", "fg-dv svelte-8x78vt");
			set_style(span6, "color", /*heat*/ ctx[9].zoneInfo.color);
			attr(span7, "class", "fg-dl svelte-8x78vt");
			attr(div4, "class", "fg-dc svelte-8x78vt");
			attr(span8, "class", "fg-dv svelte-8x78vt");
			attr(span9, "class", "fg-dl svelte-8x78vt");
			attr(div5, "class", "fg-dc svelte-8x78vt");
			attr(span10, "class", "fg-dv svelte-8x78vt");
			attr(span11, "class", "fg-dl svelte-8x78vt");
			attr(div6, "class", "fg-dc svelte-8x78vt");
			attr(div7, "class", "fg-det-grid svelte-8x78vt");
			attr(span12, "class", "fg-drl svelte-8x78vt");
			attr(span13, "class", "fg-drv svelte-8x78vt");
			attr(div8, "class", "fg-dr svelte-8x78vt");
			attr(span14, "class", "fg-drl svelte-8x78vt");
			attr(span15, "class", "fg-drv svelte-8x78vt");
			attr(div9, "class", "fg-dr svelte-8x78vt");
			attr(span16, "class", "fg-drl svelte-8x78vt");
			attr(span17, "class", "fg-drv svelte-8x78vt");
			attr(div10, "class", "fg-dr svelte-8x78vt");
			attr(div11, "class", "fg-ds svelte-8x78vt");
			attr(div12, "class", "fg-dct svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, t0);
			append(div0, t1);
			insert(target, t2, anchor);
			insert(target, div7, anchor);
			append(div7, div1);
			append(div1, span0);
			append(span0, t3);
			append(span0, t4);
			append(div1, span1);
			append(div7, t6);
			append(div7, div2);
			append(div2, span2);
			append(span2, t7);
			append(span2, t8);
			append(div2, span3);
			append(div7, t10);
			append(div7, div3);
			append(div3, span4);
			append(span4, t11);
			append(span4, t12);
			append(div3, span5);
			append(div7, t14);
			append(div7, div4);
			append(div4, span6);
			append(span6, t15);
			append(div4, span7);
			append(div7, t17);
			append(div7, div5);
			append(div5, span8);
			append(span8, t18);
			append(span8, t19);
			append(div5, span9);
			append(div7, t21);
			append(div7, div6);
			append(div6, span10);
			append(span10, t22);
			append(span10, t23);
			append(div6, span11);
			insert(target, t25, anchor);
			insert(target, div11, anchor);
			append(div11, div8);
			append(div8, span12);
			append(div8, span13);
			append(span13, t27);
			append(div11, t28);
			append(div11, div9);
			append(div9, span14);
			append(div9, span15);
			append(span15, t30);
			append(div11, t31);
			append(div11, div10);
			append(div10, span16);
			append(div10, span17);
			append(span17, t33);
			insert(target, t34, anchor);
			insert(target, div12, anchor);
			insert(target, t36, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 512 && t1_value !== (t1_value = /*heat*/ ctx[9].zoneInfo.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*heat*/ 512) {
				set_style(div0, "color", /*heat*/ ctx[9].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 256 && t3_value !== (t3_value = /*rawData*/ ctx[8]?.tempC + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rawData*/ 256 && t7_value !== (t7_value = /*rawData*/ ctx[8]?.humidity + "")) set_data(t7, t7_value);
			if (dirty[0] & /*heat*/ 512 && t11_value !== (t11_value = /*heat*/ ctx[9].apparentTemp1 + "")) set_data(t11, t11_value);

			if (dirty[0] & /*heat*/ 512 && t15_value !== (t15_value = (/*heat*/ ctx[9].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[9].apparentTempFinal + '°C') + "")) set_data(t15, t15_value);

			if (dirty[0] & /*heat*/ 512) {
				set_style(span6, "color", /*heat*/ ctx[9].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 512 && t18_value !== (t18_value = /*heat*/ ctx[9].wbgtBase + "")) set_data(t18, t18_value);
			if (dirty[0] & /*heat*/ 512 && t22_value !== (t22_value = /*heat*/ ctx[9].wbgtAdjusted + "")) set_data(t22, t22_value);
			if (dirty[0] & /*heat*/ 512 && t27_value !== (t27_value = /*heat*/ ctx[9].workRestSchedule.light + "")) set_data(t27, t27_value);
			if (dirty[0] & /*heat*/ 512 && t30_value !== (t30_value = /*heat*/ ctx[9].workRestSchedule.heavy + "")) set_data(t30, t30_value);
			if (dirty[0] & /*heat*/ 512 && t33_value !== (t33_value = /*heat*/ ctx[9].hydration + "")) set_data(t33, t33_value);

			if (dirty[0] & /*heat*/ 512) {
				each_value_8 = ensure_array_like(/*heat*/ ctx[9].zoneInfo.mandatoryControls);
				let i;

				for (i = 0; i < each_value_8.length; i += 1) {
					const child_ctx = get_each_context_8(ctx, each_value_8, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_8(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_8.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t2);
				detach(div7);
				detach(t25);
				detach(div11);
				detach(t34);
				detach(div12);
				detach(t36);
				detach(each_1_anchor);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (79:6) {:else}
function create_else_block_6(ctx) {
	let div3;
	let div0;
	let span0;
	let t0_value = /*rawData*/ ctx[8]?.solarWm2 + "";
	let t0;
	let span1;
	let t2;
	let div1;
	let span2;
	let t3;
	let t4;
	let span3;
	let t6;
	let div2;
	let span4;
	let t7;
	let t8;
	let span5;
	let t10;
	let div8;
	let div4;
	let span6;
	let span7;
	let t12;
	let t13;
	let div5;
	let span8;
	let span9;
	let t15;
	let t16;
	let div6;
	let span10;
	let span11;
	let t18;
	let t19;
	let div7;
	let span12;
	let span13;
	let t21;
	let t22;
	let t23;

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			span1 = element("span");
			span1.textContent = "W/m²";
			t2 = space();
			div1 = element("div");
			span2 = element("span");
			t3 = text("UV ~");
			t4 = text(/*uvIndex*/ ctx[19]);
			span3 = element("span");
			span3.textContent = "Index";
			t6 = space();
			div2 = element("div");
			span4 = element("span");
			t7 = text(/*solarElevDeg*/ ctx[18]);
			t8 = text("°");
			span5 = element("span");
			span5.textContent = "Sun angle";
			t10 = space();
			div8 = element("div");
			div4 = element("div");
			span6 = element("span");
			span6.textContent = "Sunrise";
			span7 = element("span");
			t12 = text(/*sunriseTime*/ ctx[20]);
			t13 = space();
			div5 = element("div");
			span8 = element("span");
			span8.textContent = "Solar noon";
			span9 = element("span");
			t15 = text(/*solarNoonTime*/ ctx[22]);
			t16 = space();
			div6 = element("div");
			span10 = element("span");
			span10.textContent = "Sunset";
			span11 = element("span");
			t18 = text(/*sunsetTime*/ ctx[21]);
			t19 = space();
			div7 = element("div");
			span12 = element("span");
			span12.textContent = "WBGT solar contribution";
			span13 = element("span");
			t21 = text("+");
			t22 = text(/*wbgtSolarContrib*/ ctx[23]);
			t23 = text("°C");
			attr(span0, "class", "fg-dv svelte-8x78vt");
			attr(span1, "class", "fg-dl svelte-8x78vt");
			attr(div0, "class", "fg-dc svelte-8x78vt");
			attr(span2, "class", "fg-dv svelte-8x78vt");
			attr(span3, "class", "fg-dl svelte-8x78vt");
			attr(div1, "class", "fg-dc svelte-8x78vt");
			attr(span4, "class", "fg-dv svelte-8x78vt");
			attr(span5, "class", "fg-dl svelte-8x78vt");
			attr(div2, "class", "fg-dc svelte-8x78vt");
			attr(div3, "class", "fg-det-grid svelte-8x78vt");
			attr(span6, "class", "fg-drl svelte-8x78vt");
			attr(span7, "class", "fg-drv svelte-8x78vt");
			attr(div4, "class", "fg-dr svelte-8x78vt");
			attr(span8, "class", "fg-drl svelte-8x78vt");
			attr(span9, "class", "fg-drv svelte-8x78vt");
			attr(div5, "class", "fg-dr svelte-8x78vt");
			attr(span10, "class", "fg-drl svelte-8x78vt");
			attr(span11, "class", "fg-drv svelte-8x78vt");
			attr(div6, "class", "fg-dr svelte-8x78vt");
			attr(span12, "class", "fg-drl svelte-8x78vt");
			attr(span13, "class", "fg-drv svelte-8x78vt");
			attr(div7, "class", "fg-dr svelte-8x78vt");
			attr(div8, "class", "fg-ds svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div0, span0);
			append(span0, t0);
			append(div0, span1);
			append(div3, t2);
			append(div3, div1);
			append(div1, span2);
			append(span2, t3);
			append(span2, t4);
			append(div1, span3);
			append(div3, t6);
			append(div3, div2);
			append(div2, span4);
			append(span4, t7);
			append(span4, t8);
			append(div2, span5);
			insert(target, t10, anchor);
			insert(target, div8, anchor);
			append(div8, div4);
			append(div4, span6);
			append(div4, span7);
			append(span7, t12);
			append(div8, t13);
			append(div8, div5);
			append(div5, span8);
			append(div5, span9);
			append(span9, t15);
			append(div8, t16);
			append(div8, div6);
			append(div6, span10);
			append(div6, span11);
			append(span11, t18);
			append(div8, t19);
			append(div8, div7);
			append(div7, span12);
			append(div7, span13);
			append(span13, t21);
			append(span13, t22);
			append(span13, t23);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 256 && t0_value !== (t0_value = /*rawData*/ ctx[8]?.solarWm2 + "")) set_data(t0, t0_value);
			if (dirty[0] & /*uvIndex*/ 524288) set_data(t4, /*uvIndex*/ ctx[19]);
			if (dirty[0] & /*solarElevDeg*/ 262144) set_data(t7, /*solarElevDeg*/ ctx[18]);
			if (dirty[0] & /*sunriseTime*/ 1048576) set_data(t12, /*sunriseTime*/ ctx[20]);
			if (dirty[0] & /*solarNoonTime*/ 4194304) set_data(t15, /*solarNoonTime*/ ctx[22]);
			if (dirty[0] & /*sunsetTime*/ 2097152) set_data(t18, /*sunsetTime*/ ctx[21]);
			if (dirty[0] & /*wbgtSolarContrib*/ 8388608) set_data(t22, /*wbgtSolarContrib*/ ctx[23]);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
				detach(t10);
				detach(div8);
			}
		}
	};
}

// (73:6) {#if isNight}
function create_if_block_29(ctx) {
	let div3;
	let div0;
	let t1;
	let div1;
	let t5;
	let div2;
	let t6;
	let t7;
	let t8;
	let t9;

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			div0.textContent = "🌙";
			t1 = space();
			div1 = element("div");
			div1.innerHTML = `Solar radiation is <strong class="svelte-8x78vt">zero</strong> at night. WBGT uses only temp, humidity and wind.`;
			t5 = space();
			div2 = element("div");
			t6 = text("Sunrise: ~");
			t7 = text(/*sunriseTime*/ ctx[20]);
			t8 = text(" · Sunset: ~");
			t9 = text(/*sunsetTime*/ ctx[21]);
			set_style(div0, "font-size", "24px");
			set_style(div2, "color", "#4a6090");
			attr(div3, "class", "fg-night-msg svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div3, t1);
			append(div3, div1);
			append(div3, t5);
			append(div3, div2);
			append(div2, t6);
			append(div2, t7);
			append(div2, t8);
			append(div2, t9);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sunriseTime*/ 1048576) set_data(t7, /*sunriseTime*/ ctx[20]);
			if (dirty[0] & /*sunsetTime*/ 2097152) set_data(t9, /*sunsetTime*/ ctx[21]);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (55:6) {#each heat.zoneInfo.mandatoryControls as c}
function create_each_block_8(ctx) {
	let div;
	let t0;
	let t1_value = /*c*/ ctx[96] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("▸ ");
			t1 = text(t1_value);
			attr(div, "class", "fg-dci svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 512 && t1_value !== (t1_value = /*c*/ ctx[96] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (122:6) {:else}
function create_else_block_5(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "☀ Day";
			attr(span, "class", "fg-dbadge svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (121:6) {#if isNight}
function create_if_block_23(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "🌙 Night";
			attr(span, "class", "fg-nbadge svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (128:4) {#each TABS as t}
function create_each_block_7(ctx) {
	let button;
	let span0;
	let span1;
	let t2;
	let button_class_value;
	let mounted;
	let dispose;

	function click_handler_5() {
		return /*click_handler_5*/ ctx[51](/*t*/ ctx[112]);
	}

	return {
		c() {
			button = element("button");
			span0 = element("span");
			span0.textContent = `${/*t*/ ctx[112].icon}`;
			span1 = element("span");
			span1.textContent = `${/*t*/ ctx[112].label}`;
			t2 = space();
			attr(span0, "class", "svelte-8x78vt");
			attr(span1, "class", "svelte-8x78vt");
			attr(button, "class", button_class_value = "fg-ptab " + (/*tab*/ ctx[0] === /*t*/ ctx[112].id ? 'fg-ptab-on' : '') + " svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, span0);
			append(button, span1);
			append(button, t2);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_5);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*tab*/ 1 && button_class_value !== (button_class_value = "fg-ptab " + (/*tab*/ ctx[0] === /*t*/ ctx[112].id ? 'fg-ptab-on' : '') + " svelte-8x78vt")) {
				attr(button, "class", button_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (343:31) 
function create_if_block_18(ctx) {
	let div1;
	let div0;
	let t1;
	let t2;
	let div3;
	let div2;
	let t4;
	let t5;
	let t6;
	let div5;
	let div4;
	let t8;
	let label0;
	let input0;
	let t9;
	let t10;
	let label1;
	let input1;
	let input1_disabled_value;
	let t11;
	let label1_class_value;
	let mounted;
	let dispose;

	function select_block_type_11(ctx, dirty) {
		if (/*license*/ ctx[26].valid) return create_if_block_21;
		return create_else_block_4;
	}

	let current_block_type = select_block_type_11(ctx);
	let if_block0 = current_block_type(ctx);
	let each_value_6 = ensure_array_like(Object.entries(PPE_PROFILES));
	let each_blocks = [];

	for (let i = 0; i < each_value_6.length; i += 1) {
		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
	}

	let if_block1 = /*license*/ ctx[26].valid && create_if_block_20(ctx);
	let if_block2 = !/*license*/ ctx[26].valid && create_if_block_19();

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			div0.textContent = "🔑 License";
			t1 = space();
			if_block0.c();
			t2 = space();
			div3 = element("div");
			div2 = element("div");
			div2.textContent = "👷 PPE Profile (ISO 7933)";
			t4 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			if (if_block1) if_block1.c();
			t6 = space();
			div5 = element("div");
			div4 = element("div");
			div4.textContent = "🔔 Alerts";
			t8 = space();
			label0 = element("label");
			input0 = element("input");
			t9 = text("Browser notifications for danger zones");
			t10 = space();
			label1 = element("label");
			input1 = element("input");
			t11 = text("Auto-refresh every 15 min ");
			if (if_block2) if_block2.c();
			attr(div0, "class", "fg-pgrp-hd svelte-8x78vt");
			attr(div1, "class", "fg-pgrp fg-lic-grp svelte-8x78vt");
			attr(div2, "class", "fg-pgrp-hd svelte-8x78vt");
			attr(div3, "class", "fg-pgrp svelte-8x78vt");
			attr(div4, "class", "fg-pgrp-hd svelte-8x78vt");
			attr(input0, "type", "checkbox");
			attr(input0, "class", "svelte-8x78vt");
			attr(label0, "class", "fg-tog svelte-8x78vt");
			attr(input1, "type", "checkbox");
			input1.disabled = input1_disabled_value = !/*license*/ ctx[26].valid;
			attr(input1, "class", "svelte-8x78vt");
			attr(label1, "class", label1_class_value = "fg-tog " + (!/*license*/ ctx[26].valid ? 'fg-disabled' : '') + " svelte-8x78vt");
			attr(div5, "class", "fg-pgrp svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div1, t1);
			if_block0.m(div1, null);
			insert(target, t2, anchor);
			insert(target, div3, anchor);
			append(div3, div2);
			append(div3, t4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div3, null);
				}
			}

			insert(target, t5, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t6, anchor);
			insert(target, div5, anchor);
			append(div5, div4);
			append(div5, t8);
			append(div5, label0);
			append(label0, input0);
			input0.checked = /*settings*/ ctx[30].soundAlerts;
			append(label0, t9);
			append(div5, t10);
			append(div5, label1);
			append(label1, input1);
			input1.checked = /*settings*/ ctx[30].autoRefresh;
			append(label1, t11);
			if (if_block2) if_block2.m(label1, null);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_handler*/ ctx[77]),
					listen(input0, "change", /*saveSettings*/ ctx[39]),
					listen(input1, "change", /*input1_change_handler*/ ctx[78]),
					listen(input1, "change", /*setupAutoRefresh*/ ctx[41])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_11(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div1, null);
				}
			}

			if (dirty[0] & /*settings*/ 1073741824 | dirty[1] & /*saveSettings*/ 256) {
				each_value_6 = ensure_array_like(Object.entries(PPE_PROFILES));
				let i;

				for (i = 0; i < each_value_6.length; i += 1) {
					const child_ctx = get_each_context_6(ctx, each_value_6, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div3, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_6.length;
			}

			if (/*license*/ ctx[26].valid) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_20(ctx);
					if_block1.c();
					if_block1.m(t6.parentNode, t6);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty[0] & /*settings*/ 1073741824) {
				input0.checked = /*settings*/ ctx[30].soundAlerts;
			}

			if (dirty[0] & /*license*/ 67108864 && input1_disabled_value !== (input1_disabled_value = !/*license*/ ctx[26].valid)) {
				input1.disabled = input1_disabled_value;
			}

			if (dirty[0] & /*settings*/ 1073741824) {
				input1.checked = /*settings*/ ctx[30].autoRefresh;
			}

			if (!/*license*/ ctx[26].valid) {
				if (if_block2) ; else {
					if_block2 = create_if_block_19();
					if_block2.c();
					if_block2.m(label1, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty[0] & /*license*/ 67108864 && label1_class_value !== (label1_class_value = "fg-tog " + (!/*license*/ ctx[26].valid ? 'fg-disabled' : '') + " svelte-8x78vt")) {
				attr(label1, "class", label1_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
				detach(t2);
				detach(div3);
				detach(t5);
				detach(t6);
				detach(div5);
			}

			if_block0.d();
			destroy_each(each_blocks, detaching);
			if (if_block1) if_block1.d(detaching);
			if (if_block2) if_block2.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (312:29) 
function create_if_block_15(ctx) {
	let if_block_anchor;

	function select_block_type_10(ctx, dirty) {
		if (!/*license*/ ctx[26].valid) return create_if_block_16;
		return create_else_block_3;
	}

	let current_block_type = select_block_type_10(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_10(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(if_block_anchor);
			}

			if_block.d(detaching);
		}
	};
}

// (278:26) 
function create_if_block_12(ctx) {
	let if_block_anchor;

	function select_block_type_8(ctx, dirty) {
		if (!/*license*/ ctx[26].valid) return create_if_block_13;
		return create_else_block_1;
	}

	let current_block_type = select_block_type_8(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_8(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(if_block_anchor);
			}

			if_block.d(detaching);
		}
	};
}

// (136:2) {#if tab === 'dashboard'}
function create_if_block(ctx) {
	let if_block_anchor;

	function select_block_type_5(ctx, dirty) {
		if (/*loading*/ ctx[3]) return create_if_block_1;
		if (/*error*/ ctx[4]) return create_if_block_2;
		if (/*heat*/ ctx[9]) return create_if_block_3;
	}

	let current_block_type = select_block_type_5(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_5(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(if_block_anchor);
			}

			if (if_block) {
				if_block.d(detaching);
			}
		}
	};
}

// (353:6) {:else}
function create_else_block_4(ctx) {
	let div2;
	let t8;
	let div3;
	let input;
	let t9;
	let button;
	let t10_value = (/*licenseLoading*/ ctx[28] ? '…' : 'Activate') + "";
	let t10;
	let button_disabled_value;
	let t11;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*licenseError*/ ctx[29] && create_if_block_22(ctx);

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = `<div class="fg-lic-free-tag svelte-8x78vt">FREE TIER</div> <div class="fg-lic-free-list svelte-8x78vt">⚡ Multi-model worst-case engine<br/>📄 ISO 7933 weekly reports<br/>🚨 SOS emergency tab<br/>🎛 Custom thresholds · 🔄 Auto-refresh</div> <a class="fg-pbtn fg-pbtn-amber svelte-8x78vt" href="https://fieldguard-hse.com" target="_blank">Get Pro — fieldguard-hse.com</a>`;
			t8 = space();
			div3 = element("div");
			input = element("input");
			t9 = space();
			button = element("button");
			t10 = text(t10_value);
			t11 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div2, "class", "fg-lic-free svelte-8x78vt");
			attr(input, "class", "fg-lic-input svelte-8x78vt");
			attr(input, "placeholder", "Paste license key…");
			input.disabled = /*licenseLoading*/ ctx[28];
			attr(button, "class", "fg-lic-act-btn svelte-8x78vt");
			button.disabled = button_disabled_value = /*licenseLoading*/ ctx[28] || !/*licenseKeyInput*/ ctx[27].trim();
			attr(div3, "class", "fg-lic-row svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			insert(target, t8, anchor);
			insert(target, div3, anchor);
			append(div3, input);
			set_input_value(input, /*licenseKeyInput*/ ctx[27]);
			append(div3, t9);
			append(div3, button);
			append(button, t10);
			insert(target, t11, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[68]),
					listen(button, "click", /*activateLicense*/ ctx[34])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseLoading*/ 268435456) {
				input.disabled = /*licenseLoading*/ ctx[28];
			}

			if (dirty[0] & /*licenseKeyInput*/ 134217728 && input.value !== /*licenseKeyInput*/ ctx[27]) {
				set_input_value(input, /*licenseKeyInput*/ ctx[27]);
			}

			if (dirty[0] & /*licenseLoading*/ 268435456 && t10_value !== (t10_value = (/*licenseLoading*/ ctx[28] ? '…' : 'Activate') + "")) set_data(t10, t10_value);

			if (dirty[0] & /*licenseLoading, licenseKeyInput*/ 402653184 && button_disabled_value !== (button_disabled_value = /*licenseLoading*/ ctx[28] || !/*licenseKeyInput*/ ctx[27].trim())) {
				button.disabled = button_disabled_value;
			}

			if (/*licenseError*/ ctx[29]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_22(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
				detach(t8);
				detach(div3);
				detach(t11);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (347:6) {#if license.valid}
function create_if_block_21(ctx) {
	let div;
	let span0;
	let t1;
	let span1;
	let t2_value = /*license*/ ctx[26].tier?.toUpperCase() + "";
	let t2;
	let t3;
	let t4_value = /*license*/ ctx[26].expires?.slice(0, 10) + "";
	let t4;
	let t5;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			span0 = element("span");
			span0.textContent = "✓ PRO";
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = text(" · expires ");
			t4 = text(t4_value);
			t5 = space();
			button = element("button");
			button.textContent = "Deactivate";
			attr(span0, "class", "fg-lic-badge svelte-8x78vt");
			attr(span1, "class", "fg-lic-info svelte-8x78vt");
			attr(button, "class", "fg-lic-deact svelte-8x78vt");
			attr(div, "class", "fg-lic-act svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(div, t1);
			append(div, span1);
			append(span1, t2);
			append(span1, t3);
			append(span1, t4);
			append(div, t5);
			append(div, button);

			if (!mounted) {
				dispose = listen(button, "click", /*deactivateLicense*/ ctx[35]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*license*/ 67108864 && t2_value !== (t2_value = /*license*/ ctx[26].tier?.toUpperCase() + "")) set_data(t2, t2_value);
			if (dirty[0] & /*license*/ 67108864 && t4_value !== (t4_value = /*license*/ ctx[26].expires?.slice(0, 10) + "")) set_data(t4, t4_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			mounted = false;
			dispose();
		}
	};
}

// (363:8) {#if licenseError}
function create_if_block_22(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚠ ");
			t1 = text(/*licenseError*/ ctx[29]);
			attr(div, "class", "fg-lic-err svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseError*/ 536870912) set_data(t1, /*licenseError*/ ctx[29]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (369:6) {#each Object.entries(PPE_PROFILES) as [key, prof]}
function create_each_block_6(ctx) {
	let label;
	let input;
	let span0;
	let span1;
	let binding_group;
	let mounted;
	let dispose;
	binding_group = init_binding_group(/*$$binding_groups*/ ctx[70][0]);

	return {
		c() {
			label = element("label");
			input = element("input");
			span0 = element("span");
			span0.textContent = `${/*prof*/ ctx[109].label}`;
			span1 = element("span");
			span1.textContent = `+${/*prof*/ ctx[109].adjustment}°C`;
			attr(input, "type", "radio");
			input.__value = /*key*/ ctx[108];
			set_input_value(input, input.__value);
			attr(input, "class", "svelte-8x78vt");
			attr(span0, "class", "svelte-8x78vt");
			attr(span1, "class", "fg-adjch svelte-8x78vt");
			attr(label, "class", "fg-radio svelte-8x78vt");
			binding_group.p(input);
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			input.checked = input.__value === /*settings*/ ctx[30].ppeProfile;
			append(label, span0);
			append(label, span1);

			if (!mounted) {
				dispose = [
					listen(input, "change", /*input_change_handler_1*/ ctx[69]),
					listen(input, "change", /*saveSettings*/ ctx[39])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 1073741824) {
				input.checked = input.__value === /*settings*/ ctx[30].ppeProfile;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(label);
			}

			binding_group.r();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (374:4) {#if license.valid}
function create_if_block_20(ctx) {
	let div9;
	let div0;
	let t1;
	let label0;
	let t2;
	let div1;
	let input0;
	let span0;
	let t3_value = /*settings*/ ctx[30].wbgtWarnC + "";
	let t3;
	let t4;
	let t5;
	let label1;
	let t6;
	let div2;
	let input1;
	let span1;
	let t7_value = /*settings*/ ctx[30].wbgtDangerC + "";
	let t7;
	let t8;
	let t9;
	let div3;
	let t11;
	let label2;
	let t12;
	let div4;
	let input2;
	let span2;
	let t13_value = /*settings*/ ctx[30].windWarnMs + "";
	let t13;
	let t14;
	let t15;
	let label3;
	let t16;
	let div5;
	let input3;
	let span3;
	let t17_value = /*settings*/ ctx[30].windDangerMs + "";
	let t17;
	let t18;
	let t19;
	let div6;
	let t21;
	let label4;
	let t22;
	let div7;
	let input4;
	let span4;
	let t23_value = /*settings*/ ctx[30].rainWarnMmh + "";
	let t23;
	let t24;
	let t25;
	let label5;
	let t26;
	let div8;
	let input5;
	let span5;
	let t27_value = /*settings*/ ctx[30].rainDangerMmh + "";
	let t27;
	let t28;
	let t29;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div9 = element("div");
			div0 = element("div");
			div0.textContent = "🌡 WBGT Thresholds";
			t1 = space();
			label0 = element("label");
			t2 = text("Warning (°C)");
			div1 = element("div");
			input0 = element("input");
			span0 = element("span");
			t3 = text(t3_value);
			t4 = text("°C");
			t5 = space();
			label1 = element("label");
			t6 = text("Danger (°C)");
			div2 = element("div");
			input1 = element("input");
			span1 = element("span");
			t7 = text(t7_value);
			t8 = text("°C");
			t9 = space();
			div3 = element("div");
			div3.textContent = "💨 Wind Thresholds";
			t11 = space();
			label2 = element("label");
			t12 = text("Warning (m/s)");
			div4 = element("div");
			input2 = element("input");
			span2 = element("span");
			t13 = text(t13_value);
			t14 = text(" m/s");
			t15 = space();
			label3 = element("label");
			t16 = text("Danger (m/s)");
			div5 = element("div");
			input3 = element("input");
			span3 = element("span");
			t17 = text(t17_value);
			t18 = text(" m/s");
			t19 = space();
			div6 = element("div");
			div6.textContent = "🌧 Rain Thresholds";
			t21 = space();
			label4 = element("label");
			t22 = text("Warning (mm/h)");
			div7 = element("div");
			input4 = element("input");
			span4 = element("span");
			t23 = text(t23_value);
			t24 = text(" mm/h");
			t25 = space();
			label5 = element("label");
			t26 = text("Danger (mm/h)");
			div8 = element("div");
			input5 = element("input");
			span5 = element("span");
			t27 = text(t27_value);
			t28 = text(" mm/h");
			t29 = space();
			button = element("button");
			button.textContent = "↩ Reset Defaults";
			attr(div0, "class", "fg-pgrp-hd svelte-8x78vt");
			attr(input0, "type", "range");
			attr(input0, "min", "28");
			attr(input0, "max", "38");
			attr(input0, "step", "0.5");
			attr(input0, "class", "svelte-8x78vt");
			attr(span0, "class", "svelte-8x78vt");
			attr(div1, "class", "fg-srow svelte-8x78vt");
			attr(label0, "class", "fg-slbl svelte-8x78vt");
			attr(input1, "type", "range");
			attr(input1, "min", "30");
			attr(input1, "max", "42");
			attr(input1, "step", "0.5");
			attr(input1, "class", "svelte-8x78vt");
			attr(span1, "class", "svelte-8x78vt");
			attr(div2, "class", "fg-srow svelte-8x78vt");
			attr(label1, "class", "fg-slbl svelte-8x78vt");
			attr(div3, "class", "fg-pgrp-hd svelte-8x78vt");
			set_style(div3, "margin-top", "8px");
			attr(input2, "type", "range");
			attr(input2, "min", "5");
			attr(input2, "max", "25");
			attr(input2, "step", "0.5");
			attr(input2, "class", "svelte-8x78vt");
			attr(span2, "class", "svelte-8x78vt");
			attr(div4, "class", "fg-srow svelte-8x78vt");
			attr(label2, "class", "fg-slbl svelte-8x78vt");
			attr(input3, "type", "range");
			attr(input3, "min", "10");
			attr(input3, "max", "35");
			attr(input3, "step", "0.5");
			attr(input3, "class", "svelte-8x78vt");
			attr(span3, "class", "svelte-8x78vt");
			attr(div5, "class", "fg-srow svelte-8x78vt");
			attr(label3, "class", "fg-slbl svelte-8x78vt");
			attr(div6, "class", "fg-pgrp-hd svelte-8x78vt");
			set_style(div6, "margin-top", "8px");
			attr(input4, "type", "range");
			attr(input4, "min", "1");
			attr(input4, "max", "25");
			attr(input4, "step", "0.5");
			attr(input4, "class", "svelte-8x78vt");
			attr(span4, "class", "svelte-8x78vt");
			attr(div7, "class", "fg-srow svelte-8x78vt");
			attr(label4, "class", "fg-slbl svelte-8x78vt");
			attr(input5, "type", "range");
			attr(input5, "min", "5");
			attr(input5, "max", "60");
			attr(input5, "step", "1");
			attr(input5, "class", "svelte-8x78vt");
			attr(span5, "class", "svelte-8x78vt");
			attr(div8, "class", "fg-srow svelte-8x78vt");
			attr(label5, "class", "fg-slbl svelte-8x78vt");
			attr(button, "class", "fg-pbtn fg-pbtn-sec svelte-8x78vt");
			set_style(button, "margin-top", "6px");
			attr(div9, "class", "fg-pgrp svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div9, anchor);
			append(div9, div0);
			append(div9, t1);
			append(div9, label0);
			append(label0, t2);
			append(label0, div1);
			append(div1, input0);
			set_input_value(input0, /*settings*/ ctx[30].wbgtWarnC);
			append(div1, span0);
			append(span0, t3);
			append(span0, t4);
			append(div9, t5);
			append(div9, label1);
			append(label1, t6);
			append(label1, div2);
			append(div2, input1);
			set_input_value(input1, /*settings*/ ctx[30].wbgtDangerC);
			append(div2, span1);
			append(span1, t7);
			append(span1, t8);
			append(div9, t9);
			append(div9, div3);
			append(div9, t11);
			append(div9, label2);
			append(label2, t12);
			append(label2, div4);
			append(div4, input2);
			set_input_value(input2, /*settings*/ ctx[30].windWarnMs);
			append(div4, span2);
			append(span2, t13);
			append(span2, t14);
			append(div9, t15);
			append(div9, label3);
			append(label3, t16);
			append(label3, div5);
			append(div5, input3);
			set_input_value(input3, /*settings*/ ctx[30].windDangerMs);
			append(div5, span3);
			append(span3, t17);
			append(span3, t18);
			append(div9, t19);
			append(div9, div6);
			append(div9, t21);
			append(div9, label4);
			append(label4, t22);
			append(label4, div7);
			append(div7, input4);
			set_input_value(input4, /*settings*/ ctx[30].rainWarnMmh);
			append(div7, span4);
			append(span4, t23);
			append(span4, t24);
			append(div9, t25);
			append(div9, label5);
			append(label5, t26);
			append(label5, div8);
			append(div8, input5);
			set_input_value(input5, /*settings*/ ctx[30].rainDangerMmh);
			append(div8, span5);
			append(span5, t27);
			append(span5, t28);
			append(div9, t29);
			append(div9, button);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_input_handler*/ ctx[71]),
					listen(input0, "input", /*input0_change_input_handler*/ ctx[71]),
					listen(input0, "change", /*saveSettings*/ ctx[39]),
					listen(input1, "change", /*input1_change_input_handler*/ ctx[72]),
					listen(input1, "input", /*input1_change_input_handler*/ ctx[72]),
					listen(input1, "change", /*saveSettings*/ ctx[39]),
					listen(input2, "change", /*input2_change_input_handler*/ ctx[73]),
					listen(input2, "input", /*input2_change_input_handler*/ ctx[73]),
					listen(input2, "change", /*saveSettings*/ ctx[39]),
					listen(input3, "change", /*input3_change_input_handler*/ ctx[74]),
					listen(input3, "input", /*input3_change_input_handler*/ ctx[74]),
					listen(input3, "change", /*saveSettings*/ ctx[39]),
					listen(input4, "change", /*input4_change_input_handler*/ ctx[75]),
					listen(input4, "input", /*input4_change_input_handler*/ ctx[75]),
					listen(input4, "change", /*saveSettings*/ ctx[39]),
					listen(input5, "change", /*input5_change_input_handler*/ ctx[76]),
					listen(input5, "input", /*input5_change_input_handler*/ ctx[76]),
					listen(input5, "change", /*saveSettings*/ ctx[39]),
					listen(button, "click", /*resetSettings*/ ctx[40])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 1073741824) {
				set_input_value(input0, /*settings*/ ctx[30].wbgtWarnC);
			}

			if (dirty[0] & /*settings*/ 1073741824 && t3_value !== (t3_value = /*settings*/ ctx[30].wbgtWarnC + "")) set_data(t3, t3_value);

			if (dirty[0] & /*settings*/ 1073741824) {
				set_input_value(input1, /*settings*/ ctx[30].wbgtDangerC);
			}

			if (dirty[0] & /*settings*/ 1073741824 && t7_value !== (t7_value = /*settings*/ ctx[30].wbgtDangerC + "")) set_data(t7, t7_value);

			if (dirty[0] & /*settings*/ 1073741824) {
				set_input_value(input2, /*settings*/ ctx[30].windWarnMs);
			}

			if (dirty[0] & /*settings*/ 1073741824 && t13_value !== (t13_value = /*settings*/ ctx[30].windWarnMs + "")) set_data(t13, t13_value);

			if (dirty[0] & /*settings*/ 1073741824) {
				set_input_value(input3, /*settings*/ ctx[30].windDangerMs);
			}

			if (dirty[0] & /*settings*/ 1073741824 && t17_value !== (t17_value = /*settings*/ ctx[30].windDangerMs + "")) set_data(t17, t17_value);

			if (dirty[0] & /*settings*/ 1073741824) {
				set_input_value(input4, /*settings*/ ctx[30].rainWarnMmh);
			}

			if (dirty[0] & /*settings*/ 1073741824 && t23_value !== (t23_value = /*settings*/ ctx[30].rainWarnMmh + "")) set_data(t23, t23_value);

			if (dirty[0] & /*settings*/ 1073741824) {
				set_input_value(input5, /*settings*/ ctx[30].rainDangerMmh);
			}

			if (dirty[0] & /*settings*/ 1073741824 && t27_value !== (t27_value = /*settings*/ ctx[30].rainDangerMmh + "")) set_data(t27, t27_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div9);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (392:203) {#if !license.valid}
function create_if_block_19(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-proch svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (315:4) {:else}
function create_else_block_3(ctx) {
	let div0;
	let t1;
	let div1;
	let label0;
	let t2;
	let input0;
	let t3;
	let label1;
	let t4;
	let input1;
	let t5;
	let label2;
	let t6;
	let input2;
	let t7;
	let label3;
	let t8;
	let input3;
	let t9;
	let label4;
	let t10;
	let input4;
	let t11;
	let label5;
	let t12;
	let input5;
	let t13;
	let label6;
	let t14;
	let input6;
	let t15;
	let label7;
	let t16;
	let input7;
	let t17;
	let label8;
	let t18;
	let input8;
	let t19;
	let label9;
	let t20;
	let select;
	let option0;
	let option1;
	let option2;
	let t24;
	let button;
	let t26;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*reportText*/ ctx[16] && create_if_block_17(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = "📄 ISO 7933 Weekly Report";
			t1 = space();
			div1 = element("div");
			label0 = element("label");
			t2 = text("Project Name");
			input0 = element("input");
			t3 = space();
			label1 = element("label");
			t4 = text("Contract No.");
			input1 = element("input");
			t5 = space();
			label2 = element("label");
			t6 = text("Country");
			input2 = element("input");
			t7 = space();
			label3 = element("label");
			t8 = text("Client");
			input3 = element("input");
			t9 = space();
			label4 = element("label");
			t10 = text("Contractor");
			input4 = element("input");
			t11 = space();
			label5 = element("label");
			t12 = text("HSE Manager");
			input5 = element("input");
			t13 = space();
			label6 = element("label");
			t14 = text("Regulatory Ref");
			input6 = element("input");
			t15 = space();
			label7 = element("label");
			t16 = text("Ban Start");
			input7 = element("input");
			t17 = space();
			label8 = element("label");
			t18 = text("Ban End");
			input8 = element("input");
			t19 = space();
			label9 = element("label");
			t20 = text("FIDIC");
			select = element("select");
			option0 = element("option");
			option0.textContent = "ELIGIBLE";
			option1 = element("option");
			option1.textContent = "NOT ELIGIBLE";
			option2 = element("option");
			option2.textContent = "UNDER REVIEW";
			t24 = space();
			button = element("button");
			button.textContent = "📋 Generate ISO 7933 Report";
			t26 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div0, "class", "fg-psec svelte-8x78vt");
			attr(input0, "placeholder", "Site/Project");
			attr(input0, "class", "svelte-8x78vt");
			attr(label0, "class", "svelte-8x78vt");
			attr(input1, "placeholder", "CONTRACT-001");
			attr(input1, "class", "svelte-8x78vt");
			attr(label1, "class", "svelte-8x78vt");
			attr(input2, "placeholder", "Oman, UAE…");
			attr(input2, "class", "svelte-8x78vt");
			attr(label2, "class", "svelte-8x78vt");
			attr(input3, "class", "svelte-8x78vt");
			attr(label3, "class", "svelte-8x78vt");
			attr(input4, "class", "svelte-8x78vt");
			attr(label4, "class", "svelte-8x78vt");
			attr(input5, "class", "svelte-8x78vt");
			attr(label5, "class", "svelte-8x78vt");
			attr(input6, "class", "svelte-8x78vt");
			attr(label6, "class", "svelte-8x78vt");
			attr(input7, "placeholder", "12:30");
			attr(input7, "class", "svelte-8x78vt");
			attr(label7, "class", "svelte-8x78vt");
			attr(input8, "placeholder", "15:30");
			attr(input8, "class", "svelte-8x78vt");
			attr(label8, "class", "svelte-8x78vt");
			option0.__value = "ELIGIBLE";
			set_input_value(option0, option0.__value);
			option1.__value = "NOT ELIGIBLE";
			set_input_value(option1, option1.__value);
			option2.__value = "UNDER REVIEW";
			set_input_value(option2, option2.__value);
			attr(select, "class", "svelte-8x78vt");
			if (/*reportMeta*/ ctx[31].fidic === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[67].call(select));
			attr(label9, "class", "svelte-8x78vt");
			attr(div1, "class", "fg-prform svelte-8x78vt");
			attr(button, "class", "fg-pbtn svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			append(div1, label0);
			append(label0, t2);
			append(label0, input0);
			set_input_value(input0, /*reportMeta*/ ctx[31].projectName);
			append(div1, t3);
			append(div1, label1);
			append(label1, t4);
			append(label1, input1);
			set_input_value(input1, /*reportMeta*/ ctx[31].contractNumber);
			append(div1, t5);
			append(div1, label2);
			append(label2, t6);
			append(label2, input2);
			set_input_value(input2, /*reportMeta*/ ctx[31].country);
			append(div1, t7);
			append(div1, label3);
			append(label3, t8);
			append(label3, input3);
			set_input_value(input3, /*reportMeta*/ ctx[31].clientName);
			append(div1, t9);
			append(div1, label4);
			append(label4, t10);
			append(label4, input4);
			set_input_value(input4, /*reportMeta*/ ctx[31].contractorName);
			append(div1, t11);
			append(div1, label5);
			append(label5, t12);
			append(label5, input5);
			set_input_value(input5, /*reportMeta*/ ctx[31].hseManagerName);
			append(div1, t13);
			append(div1, label6);
			append(label6, t14);
			append(label6, input6);
			set_input_value(input6, /*reportMeta*/ ctx[31].regulatoryRef);
			append(div1, t15);
			append(div1, label7);
			append(label7, t16);
			append(label7, input7);
			set_input_value(input7, /*reportMeta*/ ctx[31].banStart);
			append(div1, t17);
			append(div1, label8);
			append(label8, t18);
			append(label8, input8);
			set_input_value(input8, /*reportMeta*/ ctx[31].banEnd);
			append(div1, t19);
			append(div1, label9);
			append(label9, t20);
			append(label9, select);
			append(select, option0);
			append(select, option1);
			append(select, option2);
			select_option(select, /*reportMeta*/ ctx[31].fidic, true);
			insert(target, t24, anchor);
			insert(target, button, anchor);
			insert(target, t26, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[58]),
					listen(input1, "input", /*input1_input_handler*/ ctx[59]),
					listen(input2, "input", /*input2_input_handler*/ ctx[60]),
					listen(input3, "input", /*input3_input_handler*/ ctx[61]),
					listen(input4, "input", /*input4_input_handler*/ ctx[62]),
					listen(input5, "input", /*input5_input_handler*/ ctx[63]),
					listen(input6, "input", /*input6_input_handler*/ ctx[64]),
					listen(input7, "input", /*input7_input_handler*/ ctx[65]),
					listen(input8, "input", /*input8_input_handler*/ ctx[66]),
					listen(select, "change", /*select_change_handler_1*/ ctx[67]),
					listen(button, "click", /*generateReport*/ ctx[42])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[1] & /*reportMeta*/ 1 && input0.value !== /*reportMeta*/ ctx[31].projectName) {
				set_input_value(input0, /*reportMeta*/ ctx[31].projectName);
			}

			if (dirty[1] & /*reportMeta*/ 1 && input1.value !== /*reportMeta*/ ctx[31].contractNumber) {
				set_input_value(input1, /*reportMeta*/ ctx[31].contractNumber);
			}

			if (dirty[1] & /*reportMeta*/ 1 && input2.value !== /*reportMeta*/ ctx[31].country) {
				set_input_value(input2, /*reportMeta*/ ctx[31].country);
			}

			if (dirty[1] & /*reportMeta*/ 1 && input3.value !== /*reportMeta*/ ctx[31].clientName) {
				set_input_value(input3, /*reportMeta*/ ctx[31].clientName);
			}

			if (dirty[1] & /*reportMeta*/ 1 && input4.value !== /*reportMeta*/ ctx[31].contractorName) {
				set_input_value(input4, /*reportMeta*/ ctx[31].contractorName);
			}

			if (dirty[1] & /*reportMeta*/ 1 && input5.value !== /*reportMeta*/ ctx[31].hseManagerName) {
				set_input_value(input5, /*reportMeta*/ ctx[31].hseManagerName);
			}

			if (dirty[1] & /*reportMeta*/ 1 && input6.value !== /*reportMeta*/ ctx[31].regulatoryRef) {
				set_input_value(input6, /*reportMeta*/ ctx[31].regulatoryRef);
			}

			if (dirty[1] & /*reportMeta*/ 1 && input7.value !== /*reportMeta*/ ctx[31].banStart) {
				set_input_value(input7, /*reportMeta*/ ctx[31].banStart);
			}

			if (dirty[1] & /*reportMeta*/ 1 && input8.value !== /*reportMeta*/ ctx[31].banEnd) {
				set_input_value(input8, /*reportMeta*/ ctx[31].banEnd);
			}

			if (dirty[1] & /*reportMeta*/ 1) {
				select_option(select, /*reportMeta*/ ctx[31].fidic);
			}

			if (/*reportText*/ ctx[16]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_17(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
				detach(t24);
				detach(button);
				detach(t26);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (313:4) {#if !license.valid}
function create_if_block_16(ctx) {
	let div3;

	return {
		c() {
			div3 = element("div");
			div3.innerHTML = `<div class="fg-gate-ic svelte-8x78vt">📄</div><div class="fg-gate-ti svelte-8x78vt">Reports — Pro Feature</div><div class="fg-gate-desc svelte-8x78vt">ISO 7933 weekly audit reports with FIDIC 8.4 evidence</div><a class="fg-gate-btn svelte-8x78vt" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a>`;
			attr(div3, "class", "fg-gate svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (330:6) {#if reportText}
function create_if_block_17(ctx) {
	let div1;
	let div0;
	let span;
	let t1;
	let button0;
	let t3;
	let button1;
	let t5;
	let pre;
	let t6;
	let mounted;
	let dispose;

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			span = element("span");
			span.textContent = "Report ready";
			t1 = space();
			button0 = element("button");
			button0.textContent = "📋 Copy";
			t3 = space();
			button1 = element("button");
			button1.textContent = "⬇ .txt";
			t5 = space();
			pre = element("pre");
			t6 = text(/*reportText*/ ctx[16]);
			attr(span, "class", "svelte-8x78vt");
			attr(button0, "class", "fg-prep-btn svelte-8x78vt");
			attr(button1, "class", "fg-prep-btn svelte-8x78vt");
			attr(div0, "class", "fg-prep-bar svelte-8x78vt");
			attr(pre, "class", "fg-prep-txt svelte-8x78vt");
			attr(div1, "class", "fg-prep svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, span);
			append(div0, t1);
			append(div0, button0);
			append(div0, t3);
			append(div0, button1);
			append(div1, t5);
			append(div1, pre);
			append(pre, t6);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*copyReport*/ ctx[43]),
					listen(button1, "click", /*downloadReport*/ ctx[44])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*reportText*/ 65536) set_data(t6, /*reportText*/ ctx[16]);
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (281:4) {:else}
function create_else_block_1(ctx) {
	let div0;
	let t1;
	let div6;
	let div1;
	let t3;
	let div2;
	let t5;
	let div3;
	let t7;
	let div4;
	let t8;
	let div5;
	let t10;
	let t11;
	let div7;
	let t13;
	let if_block_anchor;
	let each_value_5 = ensure_array_like(HEAT_STRESS_SYMPTOMS);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_5.length; i += 1) {
		each_blocks_1[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
	}

	let each_value_4 = ensure_array_like(EMERGENCY_RESPONSE);
	let each_blocks = [];

	for (let i = 0; i < each_value_4.length; i += 1) {
		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
	}

	function select_block_type_9(ctx, dirty) {
		if (/*alertLog*/ ctx[15].length === 0) return create_if_block_14;
		return create_else_block_2;
	}

	let current_block_type = select_block_type_9(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = "🚨 Emergency Response";
			t1 = space();
			div6 = element("div");
			div1 = element("div");
			div1.textContent = "⚠ Heat Stress Is Life-Threatening";
			t3 = space();
			div2 = element("div");
			div2.textContent = "The body starts shutting down and cannot recover without help.";
			t5 = space();
			div3 = element("div");
			div3.textContent = "🔴 Symptoms (monitor every 2 hours)";
			t7 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t8 = space();
			div5 = element("div");
			div5.textContent = "🚑 Response Steps";
			t10 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t11 = space();
			div7 = element("div");
			div7.textContent = "📋 Alert Log";
			t13 = space();
			if_block.c();
			if_block_anchor = empty();
			attr(div0, "class", "fg-psec svelte-8x78vt");
			attr(div1, "class", "fg-pemg-warn svelte-8x78vt");
			attr(div2, "class", "fg-pemg-sub svelte-8x78vt");
			attr(div3, "class", "fg-pemg-hd svelte-8x78vt");
			attr(div4, "class", "fg-pemg-syms svelte-8x78vt");
			attr(div5, "class", "fg-pemg-hd svelte-8x78vt");
			attr(div6, "class", "fg-pemg svelte-8x78vt");
			attr(div7, "class", "fg-psec svelte-8x78vt");
			set_style(div7, "margin-top", "6px");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div6, anchor);
			append(div6, div1);
			append(div6, t3);
			append(div6, div2);
			append(div6, t5);
			append(div6, div3);
			append(div6, t7);
			append(div6, div4);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div4, null);
				}
			}

			append(div6, t8);
			append(div6, div5);
			append(div6, t10);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div6, null);
				}
			}

			insert(target, t11, anchor);
			insert(target, div7, anchor);
			insert(target, t13, anchor);
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_9(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div6);
				detach(t11);
				detach(div7);
				detach(t13);
				detach(if_block_anchor);
			}

			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			if_block.d(detaching);
		}
	};
}

// (279:4) {#if !license.valid}
function create_if_block_13(ctx) {
	let div2;

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = `<div class="fg-gate-ic svelte-8x78vt">🚨</div><div class="fg-gate-ti svelte-8x78vt">SOS — Pro Feature</div><a class="fg-gate-btn svelte-8x78vt" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a>`;
			attr(div2, "class", "fg-gate svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div2);
			}
		}
	};
}

// (288:10) {#each HEAT_STRESS_SYMPTOMS as s}
function create_each_block_5(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = `${/*s*/ ctx[105]}`;
			attr(span, "class", "fg-sym svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (291:8) {#each EMERGENCY_RESPONSE as step, i}
function create_each_block_4(ctx) {
	let div;
	let span;
	let t1;
	let t2;
	let t3;

	return {
		c() {
			div = element("div");
			span = element("span");
			span.textContent = `${/*i*/ ctx[104] + 1}`;
			t1 = space();
			t2 = text(/*step*/ ctx[102]);
			t3 = space();
			attr(span, "class", "fg-pemg-n svelte-8x78vt");

			attr(div, "class", "fg-pemg-step " + (/*step*/ ctx[102].includes('SEVERE')
			? 'fg-pemg-crit'
			: '') + " svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span);
			append(div, t1);
			append(div, t2);
			append(div, t3);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (300:6) {:else}
function create_else_block_2(ctx) {
	let each_1_anchor;
	let each_value_3 = ensure_array_like([.../*alertLog*/ ctx[15]].reverse().slice(0, 15));
	let each_blocks = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*alertLog*/ 32768) {
				each_value_3 = ensure_array_like([.../*alertLog*/ ctx[15]].reverse().slice(0, 15));
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_3.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(each_1_anchor);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (298:6) {#if alertLog.length===0}
function create_if_block_14(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "No alerts this session.";
			attr(div, "class", "fg-empty svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (301:8) {#each [...alertLog].reverse().slice(0,15) as a}
function create_each_block_3(ctx) {
	let div3;
	let div0;
	let t0_value = /*a*/ ctx[99].type + "";
	let t0;
	let t1;
	let div1;
	let t2_value = /*a*/ ctx[99].message + "";
	let t2;
	let t3;
	let div2;
	let t4_value = /*a*/ ctx[99].time + "";
	let t4;
	let t5;

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			t2 = text(t2_value);
			t3 = space();
			div2 = element("div");
			t4 = text(t4_value);
			t5 = space();
			attr(div0, "class", "fg-alog-t svelte-8x78vt");
			attr(div1, "class", "fg-alog-m svelte-8x78vt");
			attr(div2, "class", "fg-alog-tm svelte-8x78vt");
			attr(div3, "class", "fg-alog svelte-8x78vt");
			set_style(div3, "border-left-color", /*a*/ ctx[99].color);
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div0, t0);
			append(div3, t1);
			append(div3, div1);
			append(div1, t2);
			append(div3, t3);
			append(div3, div2);
			append(div2, t4);
			append(div3, t5);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*alertLog*/ 32768 && t0_value !== (t0_value = /*a*/ ctx[99].type + "")) set_data(t0, t0_value);
			if (dirty[0] & /*alertLog*/ 32768 && t2_value !== (t2_value = /*a*/ ctx[99].message + "")) set_data(t2, t2_value);
			if (dirty[0] & /*alertLog*/ 32768 && t4_value !== (t4_value = /*a*/ ctx[99].time + "")) set_data(t4, t4_value);

			if (dirty[0] & /*alertLog*/ 32768) {
				set_style(div3, "border-left-color", /*a*/ ctx[99].color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (141:19) 
function create_if_block_3(ctx) {
	let t0;
	let div0;
	let button0;
	let span0;
	let t2;
	let span1;
	let t3_value = /*heat*/ ctx[9].zoneInfo.riskLabel + "";
	let t3;
	let t4;
	let span2;

	let t5_value = (/*heat*/ ctx[9].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[9].apparentTempFinal + '°C') + "";

	let t5;
	let t6;
	let span3;
	let t8;
	let span4;
	let t9_value = (/*dActive*/ ctx[6] === 'heat' ? '▲' : '▼') + "";
	let t9;
	let button0_class_value;
	let t10;
	let button1;
	let span5;
	let t12;
	let span6;
	let t13_value = /*windResult*/ ctx[10]?.riskLabel + "";
	let t13;
	let t14;
	let span7;
	let t15_value = /*rawData*/ ctx[8]?.windMs.toFixed(1) + "";
	let t15;
	let t16;
	let t17;
	let span8;
	let t18;
	let t19_value = /*windResult*/ ctx[10]?.beaufort + "";
	let t19;
	let t20;
	let span9;
	let t21_value = (/*dActive*/ ctx[6] === 'wind' ? '▲' : '▼') + "";
	let t21;
	let button1_class_value;
	let t22;
	let button2;
	let span10;
	let t24;
	let span11;
	let t25_value = /*rainResult*/ ctx[11]?.riskLabel + "";
	let t25;
	let t26;
	let span12;
	let t27_value = /*rawData*/ ctx[8]?.rainMmH.toFixed(1) + "";
	let t27;
	let t28;
	let t29;
	let span13;
	let t30_value = /*rainResult*/ ctx[11]?.intensityLabel + "";
	let t30;
	let t31;
	let span14;
	let t32_value = (/*dActive*/ ctx[6] === 'rain' ? '▲' : '▼') + "";
	let t32;
	let button2_class_value;
	let t33;
	let button3;
	let span15;
	let t34_value = (/*isNight*/ ctx[17] ? '🌙' : '☀') + "";
	let t34;
	let t35;
	let span16;
	let t36;
	let t37;
	let span17;
	let t38_value = (/*isNight*/ ctx[17] ? '0' : /*rawData*/ ctx[8]?.solarWm2) + "";
	let t38;
	let t39;
	let t40;
	let span18;

	let t41_value = (/*isNight*/ ctx[17]
	? 'Night'
	: 'UV ~' + /*uvIndex*/ ctx[19]) + "";

	let t41;
	let t42;
	let span19;
	let t43_value = (/*dActive*/ ctx[6] === 'solar' ? '▲' : '▼') + "";
	let t43;
	let button3_class_value;
	let t44;
	let t45;
	let div1;
	let select;
	let t46;
	let label;
	let input;
	let input_disabled_value;
	let t47;
	let label_class_value;
	let t48;
	let if_block3_anchor;
	let mounted;
	let dispose;
	let if_block0 = /*heat*/ ctx[9].isBanPeriod && create_if_block_11();

	function select_block_type_6(ctx, dirty) {
		if (/*dActive*/ ctx[6] === 'heat') return create_if_block_6;
		if (/*dActive*/ ctx[6] === 'wind') return create_if_block_7;
		if (/*dActive*/ ctx[6] === 'rain') return create_if_block_8;
		if (/*dActive*/ ctx[6] === 'solar') return create_if_block_9;
	}

	let current_block_type = select_block_type_6(ctx);
	let if_block1 = current_block_type && current_block_type(ctx);
	let each_value_1 = ensure_array_like(/*MODELS*/ ctx[37]);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let if_block2 = !/*license*/ ctx[26].valid && create_if_block_5();
	let if_block3 = /*worstCaseMode*/ ctx[14] && /*modelResults*/ ctx[12].length > 1 && create_if_block_4(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			span0 = element("span");
			span0.textContent = "🌡";
			t2 = space();
			span1 = element("span");
			t3 = text(t3_value);
			t4 = space();
			span2 = element("span");
			t5 = text(t5_value);
			t6 = space();
			span3 = element("span");
			span3.textContent = "Apparent Temp";
			t8 = space();
			span4 = element("span");
			t9 = text(t9_value);
			t10 = space();
			button1 = element("button");
			span5 = element("span");
			span5.textContent = "💨";
			t12 = space();
			span6 = element("span");
			t13 = text(t13_value);
			t14 = space();
			span7 = element("span");
			t15 = text(t15_value);
			t16 = text(" m/s");
			t17 = space();
			span8 = element("span");
			t18 = text("Bft ");
			t19 = text(t19_value);
			t20 = space();
			span9 = element("span");
			t21 = text(t21_value);
			t22 = space();
			button2 = element("button");
			span10 = element("span");
			span10.textContent = "🌧";
			t24 = space();
			span11 = element("span");
			t25 = text(t25_value);
			t26 = space();
			span12 = element("span");
			t27 = text(t27_value);
			t28 = text(" mm/h");
			t29 = space();
			span13 = element("span");
			t30 = text(t30_value);
			t31 = space();
			span14 = element("span");
			t32 = text(t32_value);
			t33 = space();
			button3 = element("button");
			span15 = element("span");
			t34 = text(t34_value);
			t35 = space();
			span16 = element("span");
			t36 = text(/*solarLabel*/ ctx[25]);
			t37 = space();
			span17 = element("span");
			t38 = text(t38_value);
			t39 = text(" W/m²");
			t40 = space();
			span18 = element("span");
			t41 = text(t41_value);
			t42 = space();
			span19 = element("span");
			t43 = text(t43_value);
			t44 = space();
			if (if_block1) if_block1.c();
			t45 = space();
			div1 = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t46 = space();
			label = element("label");
			input = element("input");
			t47 = text("\n          Worst-case ⚡\n          ");
			if (if_block2) if_block2.c();
			t48 = space();
			if (if_block3) if_block3.c();
			if_block3_anchor = empty();
			attr(span0, "class", "fg-psb-ic svelte-8x78vt");
			attr(span1, "class", "fg-psb-zo svelte-8x78vt");
			set_style(span1, "color", /*heat*/ ctx[9].zoneInfo.color);
			attr(span2, "class", "fg-psb-vl svelte-8x78vt");
			attr(span3, "class", "fg-psb-lb svelte-8x78vt");
			attr(span4, "class", "fg-psb-ch svelte-8x78vt");
			attr(button0, "class", button0_class_value = "fg-psb " + (/*dActive*/ ctx[6] === 'heat' ? 'fg-psb-on' : '') + " svelte-8x78vt");
			set_style(button0, "--c", /*heat*/ ctx[9].zoneInfo.color);
			attr(span5, "class", "fg-psb-ic svelte-8x78vt");
			attr(span6, "class", "fg-psb-zo svelte-8x78vt");
			set_style(span6, "color", /*windResult*/ ctx[10]?.riskColor);
			attr(span7, "class", "fg-psb-vl svelte-8x78vt");
			attr(span8, "class", "fg-psb-lb svelte-8x78vt");
			attr(span9, "class", "fg-psb-ch svelte-8x78vt");
			attr(button1, "class", button1_class_value = "fg-psb " + (/*dActive*/ ctx[6] === 'wind' ? 'fg-psb-on' : '') + " svelte-8x78vt");
			set_style(button1, "--c", /*windResult*/ ctx[10]?.riskColor);
			attr(span10, "class", "fg-psb-ic svelte-8x78vt");
			attr(span11, "class", "fg-psb-zo svelte-8x78vt");
			set_style(span11, "color", /*rainResult*/ ctx[11]?.riskColor);
			attr(span12, "class", "fg-psb-vl svelte-8x78vt");
			attr(span13, "class", "fg-psb-lb svelte-8x78vt");
			attr(span14, "class", "fg-psb-ch svelte-8x78vt");
			attr(button2, "class", button2_class_value = "fg-psb " + (/*dActive*/ ctx[6] === 'rain' ? 'fg-psb-on' : '') + " svelte-8x78vt");
			set_style(button2, "--c", /*rainResult*/ ctx[11]?.riskColor);
			attr(span15, "class", "fg-psb-ic svelte-8x78vt");
			attr(span16, "class", "fg-psb-zo svelte-8x78vt");
			set_style(span16, "color", /*solarColor*/ ctx[24]);
			attr(span17, "class", "fg-psb-vl svelte-8x78vt");
			attr(span18, "class", "fg-psb-lb svelte-8x78vt");
			attr(span19, "class", "fg-psb-ch svelte-8x78vt");
			attr(button3, "class", button3_class_value = "fg-psb " + (/*dActive*/ ctx[6] === 'solar' ? 'fg-psb-on' : '') + " svelte-8x78vt");
			set_style(button3, "--c", /*solarColor*/ ctx[24]);
			attr(div0, "class", "fg-pgrid svelte-8x78vt");
			attr(select, "class", "fg-pmr-sel svelte-8x78vt");
			if (/*selectedModel*/ ctx[13] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[56].call(select));
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = !/*license*/ ctx[26].valid;
			attr(input, "class", "svelte-8x78vt");
			attr(label, "class", label_class_value = "fg-pmr-wc " + (!/*license*/ ctx[26].valid ? 'fg-disabled' : '') + " svelte-8x78vt");
			attr(div1, "class", "fg-pmr svelte-8x78vt");
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			insert(target, div0, anchor);
			append(div0, button0);
			append(button0, span0);
			append(button0, t2);
			append(button0, span1);
			append(span1, t3);
			append(button0, t4);
			append(button0, span2);
			append(span2, t5);
			append(button0, t6);
			append(button0, span3);
			append(button0, t8);
			append(button0, span4);
			append(span4, t9);
			append(div0, t10);
			append(div0, button1);
			append(button1, span5);
			append(button1, t12);
			append(button1, span6);
			append(span6, t13);
			append(button1, t14);
			append(button1, span7);
			append(span7, t15);
			append(span7, t16);
			append(button1, t17);
			append(button1, span8);
			append(span8, t18);
			append(span8, t19);
			append(button1, t20);
			append(button1, span9);
			append(span9, t21);
			append(div0, t22);
			append(div0, button2);
			append(button2, span10);
			append(button2, t24);
			append(button2, span11);
			append(span11, t25);
			append(button2, t26);
			append(button2, span12);
			append(span12, t27);
			append(span12, t28);
			append(button2, t29);
			append(button2, span13);
			append(span13, t30);
			append(button2, t31);
			append(button2, span14);
			append(span14, t32);
			append(div0, t33);
			append(div0, button3);
			append(button3, span15);
			append(span15, t34);
			append(button3, t35);
			append(button3, span16);
			append(span16, t36);
			append(button3, t37);
			append(button3, span17);
			append(span17, t38);
			append(span17, t39);
			append(button3, t40);
			append(button3, span18);
			append(span18, t41);
			append(button3, t42);
			append(button3, span19);
			append(span19, t43);
			insert(target, t44, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t45, anchor);
			insert(target, div1, anchor);
			append(div1, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			select_option(select, /*selectedModel*/ ctx[13], true);
			append(div1, t46);
			append(div1, label);
			append(label, input);
			input.checked = /*worstCaseMode*/ ctx[14];
			append(label, t47);
			if (if_block2) if_block2.m(label, null);
			insert(target, t48, anchor);
			if (if_block3) if_block3.m(target, anchor);
			insert(target, if_block3_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_6*/ ctx[52]),
					listen(button1, "click", /*click_handler_7*/ ctx[53]),
					listen(button2, "click", /*click_handler_8*/ ctx[54]),
					listen(button3, "click", /*click_handler_9*/ ctx[55]),
					listen(select, "change", /*select_change_handler*/ ctx[56]),
					listen(select, "change", /*refreshData*/ ctx[38]),
					listen(input, "change", /*input_change_handler*/ ctx[57]),
					listen(input, "change", /*refreshData*/ ctx[38])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*heat*/ ctx[9].isBanPeriod) {
				if (if_block0) ; else {
					if_block0 = create_if_block_11();
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty[0] & /*heat*/ 512 && t3_value !== (t3_value = /*heat*/ ctx[9].zoneInfo.riskLabel + "")) set_data(t3, t3_value);

			if (dirty[0] & /*heat*/ 512) {
				set_style(span1, "color", /*heat*/ ctx[9].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 512 && t5_value !== (t5_value = (/*heat*/ ctx[9].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[9].apparentTempFinal + '°C') + "")) set_data(t5, t5_value);

			if (dirty[0] & /*dActive*/ 64 && t9_value !== (t9_value = (/*dActive*/ ctx[6] === 'heat' ? '▲' : '▼') + "")) set_data(t9, t9_value);

			if (dirty[0] & /*dActive*/ 64 && button0_class_value !== (button0_class_value = "fg-psb " + (/*dActive*/ ctx[6] === 'heat' ? 'fg-psb-on' : '') + " svelte-8x78vt")) {
				attr(button0, "class", button0_class_value);
			}

			if (dirty[0] & /*heat*/ 512) {
				set_style(button0, "--c", /*heat*/ ctx[9].zoneInfo.color);
			}

			if (dirty[0] & /*windResult*/ 1024 && t13_value !== (t13_value = /*windResult*/ ctx[10]?.riskLabel + "")) set_data(t13, t13_value);

			if (dirty[0] & /*windResult*/ 1024) {
				set_style(span6, "color", /*windResult*/ ctx[10]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 256 && t15_value !== (t15_value = /*rawData*/ ctx[8]?.windMs.toFixed(1) + "")) set_data(t15, t15_value);
			if (dirty[0] & /*windResult*/ 1024 && t19_value !== (t19_value = /*windResult*/ ctx[10]?.beaufort + "")) set_data(t19, t19_value);
			if (dirty[0] & /*dActive*/ 64 && t21_value !== (t21_value = (/*dActive*/ ctx[6] === 'wind' ? '▲' : '▼') + "")) set_data(t21, t21_value);

			if (dirty[0] & /*dActive*/ 64 && button1_class_value !== (button1_class_value = "fg-psb " + (/*dActive*/ ctx[6] === 'wind' ? 'fg-psb-on' : '') + " svelte-8x78vt")) {
				attr(button1, "class", button1_class_value);
			}

			if (dirty[0] & /*windResult*/ 1024) {
				set_style(button1, "--c", /*windResult*/ ctx[10]?.riskColor);
			}

			if (dirty[0] & /*rainResult*/ 2048 && t25_value !== (t25_value = /*rainResult*/ ctx[11]?.riskLabel + "")) set_data(t25, t25_value);

			if (dirty[0] & /*rainResult*/ 2048) {
				set_style(span11, "color", /*rainResult*/ ctx[11]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 256 && t27_value !== (t27_value = /*rawData*/ ctx[8]?.rainMmH.toFixed(1) + "")) set_data(t27, t27_value);
			if (dirty[0] & /*rainResult*/ 2048 && t30_value !== (t30_value = /*rainResult*/ ctx[11]?.intensityLabel + "")) set_data(t30, t30_value);
			if (dirty[0] & /*dActive*/ 64 && t32_value !== (t32_value = (/*dActive*/ ctx[6] === 'rain' ? '▲' : '▼') + "")) set_data(t32, t32_value);

			if (dirty[0] & /*dActive*/ 64 && button2_class_value !== (button2_class_value = "fg-psb " + (/*dActive*/ ctx[6] === 'rain' ? 'fg-psb-on' : '') + " svelte-8x78vt")) {
				attr(button2, "class", button2_class_value);
			}

			if (dirty[0] & /*rainResult*/ 2048) {
				set_style(button2, "--c", /*rainResult*/ ctx[11]?.riskColor);
			}

			if (dirty[0] & /*isNight*/ 131072 && t34_value !== (t34_value = (/*isNight*/ ctx[17] ? '🌙' : '☀') + "")) set_data(t34, t34_value);
			if (dirty[0] & /*solarLabel*/ 33554432) set_data(t36, /*solarLabel*/ ctx[25]);

			if (dirty[0] & /*solarColor*/ 16777216) {
				set_style(span16, "color", /*solarColor*/ ctx[24]);
			}

			if (dirty[0] & /*isNight, rawData*/ 131328 && t38_value !== (t38_value = (/*isNight*/ ctx[17] ? '0' : /*rawData*/ ctx[8]?.solarWm2) + "")) set_data(t38, t38_value);

			if (dirty[0] & /*isNight, uvIndex*/ 655360 && t41_value !== (t41_value = (/*isNight*/ ctx[17]
			? 'Night'
			: 'UV ~' + /*uvIndex*/ ctx[19]) + "")) set_data(t41, t41_value);

			if (dirty[0] & /*dActive*/ 64 && t43_value !== (t43_value = (/*dActive*/ ctx[6] === 'solar' ? '▲' : '▼') + "")) set_data(t43, t43_value);

			if (dirty[0] & /*dActive*/ 64 && button3_class_value !== (button3_class_value = "fg-psb " + (/*dActive*/ ctx[6] === 'solar' ? 'fg-psb-on' : '') + " svelte-8x78vt")) {
				attr(button3, "class", button3_class_value);
			}

			if (dirty[0] & /*solarColor*/ 16777216) {
				set_style(button3, "--c", /*solarColor*/ ctx[24]);
			}

			if (current_block_type === (current_block_type = select_block_type_6(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if (if_block1) if_block1.d(1);
				if_block1 = current_block_type && current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(t45.parentNode, t45);
				}
			}

			if (dirty[1] & /*MODELS*/ 64) {
				each_value_1 = ensure_array_like(/*MODELS*/ ctx[37]);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}

			if (dirty[0] & /*selectedModel*/ 8192 | dirty[1] & /*MODELS*/ 64) {
				select_option(select, /*selectedModel*/ ctx[13]);
			}

			if (dirty[0] & /*license*/ 67108864 && input_disabled_value !== (input_disabled_value = !/*license*/ ctx[26].valid)) {
				input.disabled = input_disabled_value;
			}

			if (dirty[0] & /*worstCaseMode*/ 16384) {
				input.checked = /*worstCaseMode*/ ctx[14];
			}

			if (!/*license*/ ctx[26].valid) {
				if (if_block2) ; else {
					if_block2 = create_if_block_5();
					if_block2.c();
					if_block2.m(label, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty[0] & /*license*/ 67108864 && label_class_value !== (label_class_value = "fg-pmr-wc " + (!/*license*/ ctx[26].valid ? 'fg-disabled' : '') + " svelte-8x78vt")) {
				attr(label, "class", label_class_value);
			}

			if (/*worstCaseMode*/ ctx[14] && /*modelResults*/ ctx[12].length > 1) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block_4(ctx);
					if_block3.c();
					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(div0);
				detach(t44);
				detach(t45);
				detach(div1);
				detach(t48);
				detach(if_block3_anchor);
			}

			if (if_block0) if_block0.d(detaching);

			if (if_block1) {
				if_block1.d(detaching);
			}

			destroy_each(each_blocks, detaching);
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (139:20) 
function create_if_block_2(ctx) {
	let div;
	let t_1;

	return {
		c() {
			div = element("div");
			t_1 = text(/*error*/ ctx[4]);
			attr(div, "class", "fg-perr svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t_1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*error*/ 16) set_data(t_1, /*error*/ ctx[4]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (137:4) {#if loading}
function create_if_block_1(ctx) {
	let div1;
	let div0;
	let span;
	let t0;

	let t1_value = (/*worstCaseMode*/ ctx[14]
	? 'all models'
	: /*selectedModel*/ ctx[13]) + "";

	let t1;
	let t2;

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			span = element("span");
			t0 = text("Reading ");
			t1 = text(t1_value);
			t2 = text("…");
			attr(div0, "class", "fg-spin svelte-8x78vt");
			attr(div1, "class", "fg-pload svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div1, span);
			append(span, t0);
			append(span, t1);
			append(span, t2);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*worstCaseMode, selectedModel*/ 24576 && t1_value !== (t1_value = (/*worstCaseMode*/ ctx[14]
			? 'all models'
			: /*selectedModel*/ ctx[13]) + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}
		}
	};
}

// (143:6) {#if heat.isBanPeriod}
function create_if_block_11(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "🚫 LEGAL WORK BAN · 12:30–15:30";
			attr(div, "class", "fg-ban svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (220:36) 
function create_if_block_9(ctx) {
	let div1;
	let div0;

	let t0_value = (/*isNight*/ ctx[17]
	? '🌙 Night — No Solar'
	: '☀ Solar — ' + /*solarLabel*/ ctx[25]) + "";

	let t0;
	let t1;

	function select_block_type_7(ctx, dirty) {
		if (/*isNight*/ ctx[17]) return create_if_block_10;
		return create_else_block;
	}

	let current_block_type = select_block_type_7(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			if_block.c();
			attr(div0, "class", "fg-det-title svelte-8x78vt");
			set_style(div0, "color", /*solarColor*/ ctx[24]);
			attr(div1, "class", "fg-pdet svelte-8x78vt");
			set_style(div1, "border-color", /*solarColor*/ ctx[24]);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div1, t1);
			if_block.m(div1, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*isNight, solarLabel*/ 33685504 && t0_value !== (t0_value = (/*isNight*/ ctx[17]
			? '🌙 Night — No Solar'
			: '☀ Solar — ' + /*solarLabel*/ ctx[25]) + "")) set_data(t0, t0_value);

			if (dirty[0] & /*solarColor*/ 16777216) {
				set_style(div0, "color", /*solarColor*/ ctx[24]);
			}

			if (current_block_type === (current_block_type = select_block_type_7(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (dirty[0] & /*solarColor*/ 16777216) {
				set_style(div1, "border-color", /*solarColor*/ ctx[24]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			if_block.d();
		}
	};
}

// (211:35) 
function create_if_block_8(ctx) {
	let div5;
	let div0;
	let t0;
	let t1_value = /*rainResult*/ ctx[11]?.riskLabel + "";
	let t1;
	let t2;
	let div3;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[8]?.rainMmH.toFixed(1) + "";
	let t3;
	let span1;
	let t5;
	let div2;
	let span2;
	let t6_value = /*rainResult*/ ctx[11]?.intensityLabel + "";
	let t6;
	let span3;
	let t8;
	let div4;
	let t9;
	let t10_value = /*settings*/ ctx[30].rainWarnMmh + "";
	let t10;
	let t11;
	let t12_value = /*settings*/ ctx[30].rainDangerMmh + "";
	let t12;
	let t13;

	return {
		c() {
			div5 = element("div");
			div0 = element("div");
			t0 = text("🌧 Rain — ");
			t1 = text(t1_value);
			t2 = space();
			div3 = element("div");
			div1 = element("div");
			span0 = element("span");
			t3 = text(t3_value);
			span1 = element("span");
			span1.textContent = "mm/h";
			t5 = space();
			div2 = element("div");
			span2 = element("span");
			t6 = text(t6_value);
			span3 = element("span");
			span3.textContent = "Intensity";
			t8 = space();
			div4 = element("div");
			t9 = text("Warn ≥ ");
			t10 = text(t10_value);
			t11 = text(" mm/h · Danger ≥ ");
			t12 = text(t12_value);
			t13 = text(" mm/h");
			attr(div0, "class", "fg-det-title svelte-8x78vt");
			set_style(div0, "color", /*rainResult*/ ctx[11]?.riskColor);
			attr(span0, "class", "fg-dv svelte-8x78vt");
			attr(span1, "class", "fg-dl svelte-8x78vt");
			attr(div1, "class", "fg-dc svelte-8x78vt");
			attr(span2, "class", "fg-dv svelte-8x78vt");
			attr(span3, "class", "fg-dl svelte-8x78vt");
			attr(div2, "class", "fg-dc svelte-8x78vt");
			attr(div3, "class", "fg-det-grid svelte-8x78vt");
			attr(div4, "class", "fg-dthr svelte-8x78vt");
			attr(div5, "class", "fg-pdet svelte-8x78vt");
			set_style(div5, "border-color", /*rainResult*/ ctx[11]?.riskColor);
		},
		m(target, anchor) {
			insert(target, div5, anchor);
			append(div5, div0);
			append(div0, t0);
			append(div0, t1);
			append(div5, t2);
			append(div5, div3);
			append(div3, div1);
			append(div1, span0);
			append(span0, t3);
			append(div1, span1);
			append(div3, t5);
			append(div3, div2);
			append(div2, span2);
			append(span2, t6);
			append(div2, span3);
			append(div5, t8);
			append(div5, div4);
			append(div4, t9);
			append(div4, t10);
			append(div4, t11);
			append(div4, t12);
			append(div4, t13);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rainResult*/ 2048 && t1_value !== (t1_value = /*rainResult*/ ctx[11]?.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*rainResult*/ 2048) {
				set_style(div0, "color", /*rainResult*/ ctx[11]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 256 && t3_value !== (t3_value = /*rawData*/ ctx[8]?.rainMmH.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rainResult*/ 2048 && t6_value !== (t6_value = /*rainResult*/ ctx[11]?.intensityLabel + "")) set_data(t6, t6_value);
			if (dirty[0] & /*settings*/ 1073741824 && t10_value !== (t10_value = /*settings*/ ctx[30].rainWarnMmh + "")) set_data(t10, t10_value);
			if (dirty[0] & /*settings*/ 1073741824 && t12_value !== (t12_value = /*settings*/ ctx[30].rainDangerMmh + "")) set_data(t12, t12_value);

			if (dirty[0] & /*rainResult*/ 2048) {
				set_style(div5, "border-color", /*rainResult*/ ctx[11]?.riskColor);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div5);
			}
		}
	};
}

// (201:35) 
function create_if_block_7(ctx) {
	let div6;
	let div0;
	let t0;
	let t1_value = /*windResult*/ ctx[10]?.riskLabel + "";
	let t1;
	let t2;
	let div4;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[8]?.windMs.toFixed(1) + "";
	let t3;
	let span1;
	let t5;
	let div2;
	let span2;
	let t6_value = ((/*rawData*/ ctx[8]?.windMs ?? 0) * 3.6).toFixed(1) + "";
	let t6;
	let span3;
	let t8;
	let div3;
	let span4;
	let t9;
	let t10_value = /*windResult*/ ctx[10]?.beaufort + "";
	let t10;
	let span5;
	let t11_value = /*windResult*/ ctx[10]?.beaufortDesc + "";
	let t11;
	let t12;
	let div5;
	let t13;
	let t14_value = /*settings*/ ctx[30].windWarnMs + "";
	let t14;
	let t15;
	let t16_value = /*settings*/ ctx[30].windDangerMs + "";
	let t16;
	let t17;

	return {
		c() {
			div6 = element("div");
			div0 = element("div");
			t0 = text("💨 Wind — ");
			t1 = text(t1_value);
			t2 = space();
			div4 = element("div");
			div1 = element("div");
			span0 = element("span");
			t3 = text(t3_value);
			span1 = element("span");
			span1.textContent = "m/s";
			t5 = space();
			div2 = element("div");
			span2 = element("span");
			t6 = text(t6_value);
			span3 = element("span");
			span3.textContent = "km/h";
			t8 = space();
			div3 = element("div");
			span4 = element("span");
			t9 = text("Bft ");
			t10 = text(t10_value);
			span5 = element("span");
			t11 = text(t11_value);
			t12 = space();
			div5 = element("div");
			t13 = text("Warn ≥ ");
			t14 = text(t14_value);
			t15 = text(" m/s · Danger ≥ ");
			t16 = text(t16_value);
			t17 = text(" m/s");
			attr(div0, "class", "fg-det-title svelte-8x78vt");
			set_style(div0, "color", /*windResult*/ ctx[10]?.riskColor);
			attr(span0, "class", "fg-dv svelte-8x78vt");
			attr(span1, "class", "fg-dl svelte-8x78vt");
			attr(div1, "class", "fg-dc svelte-8x78vt");
			attr(span2, "class", "fg-dv svelte-8x78vt");
			attr(span3, "class", "fg-dl svelte-8x78vt");
			attr(div2, "class", "fg-dc svelte-8x78vt");
			attr(span4, "class", "fg-dv svelte-8x78vt");
			attr(span5, "class", "fg-dl svelte-8x78vt");
			attr(div3, "class", "fg-dc svelte-8x78vt");
			attr(div4, "class", "fg-det-grid svelte-8x78vt");
			attr(div5, "class", "fg-dthr svelte-8x78vt");
			attr(div6, "class", "fg-pdet svelte-8x78vt");
			set_style(div6, "border-color", /*windResult*/ ctx[10]?.riskColor);
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div0);
			append(div0, t0);
			append(div0, t1);
			append(div6, t2);
			append(div6, div4);
			append(div4, div1);
			append(div1, span0);
			append(span0, t3);
			append(div1, span1);
			append(div4, t5);
			append(div4, div2);
			append(div2, span2);
			append(span2, t6);
			append(div2, span3);
			append(div4, t8);
			append(div4, div3);
			append(div3, span4);
			append(span4, t9);
			append(span4, t10);
			append(div3, span5);
			append(span5, t11);
			append(div6, t12);
			append(div6, div5);
			append(div5, t13);
			append(div5, t14);
			append(div5, t15);
			append(div5, t16);
			append(div5, t17);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*windResult*/ 1024 && t1_value !== (t1_value = /*windResult*/ ctx[10]?.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*windResult*/ 1024) {
				set_style(div0, "color", /*windResult*/ ctx[10]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 256 && t3_value !== (t3_value = /*rawData*/ ctx[8]?.windMs.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rawData*/ 256 && t6_value !== (t6_value = ((/*rawData*/ ctx[8]?.windMs ?? 0) * 3.6).toFixed(1) + "")) set_data(t6, t6_value);
			if (dirty[0] & /*windResult*/ 1024 && t10_value !== (t10_value = /*windResult*/ ctx[10]?.beaufort + "")) set_data(t10, t10_value);
			if (dirty[0] & /*windResult*/ 1024 && t11_value !== (t11_value = /*windResult*/ ctx[10]?.beaufortDesc + "")) set_data(t11, t11_value);
			if (dirty[0] & /*settings*/ 1073741824 && t14_value !== (t14_value = /*settings*/ ctx[30].windWarnMs + "")) set_data(t14, t14_value);
			if (dirty[0] & /*settings*/ 1073741824 && t16_value !== (t16_value = /*settings*/ ctx[30].windDangerMs + "")) set_data(t16, t16_value);

			if (dirty[0] & /*windResult*/ 1024) {
				set_style(div6, "border-color", /*windResult*/ ctx[10]?.riskColor);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div6);
			}
		}
	};
}

// (180:6) {#if dActive === 'heat'}
function create_if_block_6(ctx) {
	let div15;
	let div0;
	let t0;
	let t1_value = /*heat*/ ctx[9].zoneInfo.riskLabel + "";
	let t1;
	let t2;
	let div7;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[8]?.tempC + "";
	let t3;
	let t4;
	let span1;
	let t6;
	let div2;
	let span2;
	let t7_value = /*rawData*/ ctx[8]?.humidity + "";
	let t7;
	let t8;
	let span3;
	let t10;
	let div3;
	let span4;
	let t11_value = /*heat*/ ctx[9].apparentTemp1 + "";
	let t11;
	let t12;
	let span5;
	let t14;
	let div4;
	let span6;

	let t15_value = (/*heat*/ ctx[9].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[9].apparentTempFinal + '°C') + "";

	let t15;
	let span7;
	let t17;
	let div5;
	let span8;
	let t18_value = /*heat*/ ctx[9].wbgtBase + "";
	let t18;
	let t19;
	let span9;
	let t21;
	let div6;
	let span10;
	let t22_value = /*heat*/ ctx[9].wbgtAdjusted + "";
	let t22;
	let t23;
	let span11;
	let t25;
	let div12;
	let div8;
	let span12;
	let span13;
	let t27_value = /*heat*/ ctx[9].workRestSchedule.light + "";
	let t27;
	let t28;
	let div9;
	let span14;
	let span15;
	let t30_value = /*heat*/ ctx[9].workRestSchedule.heavy + "";
	let t30;
	let t31;
	let div10;
	let span16;
	let span17;
	let t33_value = /*heat*/ ctx[9].hydration + "";
	let t33;
	let t34;
	let div11;
	let span18;
	let span19;
	let t36_value = /*heat*/ ctx[9].zoneInfo.monitoringSchedule + "";
	let t36;
	let t37;
	let div13;
	let t39;
	let t40;
	let div14;
	let t41;
	let t42_value = PPE_PROFILES[/*settings*/ ctx[30].ppeProfile].label + "";
	let t42;
	let t43;
	let t44_value = PPE_PROFILES[/*settings*/ ctx[30].ppeProfile].adjustment + "";
	let t44;
	let t45;
	let each_value_2 = ensure_array_like(/*heat*/ ctx[9].zoneInfo.mandatoryControls);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	return {
		c() {
			div15 = element("div");
			div0 = element("div");
			t0 = text("🌡 Heat Stress — ");
			t1 = text(t1_value);
			t2 = space();
			div7 = element("div");
			div1 = element("div");
			span0 = element("span");
			t3 = text(t3_value);
			t4 = text("°C");
			span1 = element("span");
			span1.textContent = "Temp";
			t6 = space();
			div2 = element("div");
			span2 = element("span");
			t7 = text(t7_value);
			t8 = text("%");
			span3 = element("span");
			span3.textContent = "Humidity";
			t10 = space();
			div3 = element("div");
			span4 = element("span");
			t11 = text(t11_value);
			t12 = text("°C");
			span5 = element("span");
			span5.textContent = "App.T A";
			t14 = space();
			div4 = element("div");
			span6 = element("span");
			t15 = text(t15_value);
			span7 = element("span");
			span7.textContent = "App.T B";
			t17 = space();
			div5 = element("div");
			span8 = element("span");
			t18 = text(t18_value);
			t19 = text("°C");
			span9 = element("span");
			span9.textContent = "WBGT";
			t21 = space();
			div6 = element("div");
			span10 = element("span");
			t22 = text(t22_value);
			t23 = text("°C");
			span11 = element("span");
			span11.textContent = "WBGT+PPE";
			t25 = space();
			div12 = element("div");
			div8 = element("div");
			span12 = element("span");
			span12.textContent = "🕐 Light work";
			span13 = element("span");
			t27 = text(t27_value);
			t28 = space();
			div9 = element("div");
			span14 = element("span");
			span14.textContent = "💪 Heavy work";
			span15 = element("span");
			t30 = text(t30_value);
			t31 = space();
			div10 = element("div");
			span16 = element("span");
			span16.textContent = "💧 Hydration";
			span17 = element("span");
			t33 = text(t33_value);
			t34 = space();
			div11 = element("div");
			span18 = element("span");
			span18.textContent = "👁 Monitoring";
			span19 = element("span");
			t36 = text(t36_value);
			t37 = space();
			div13 = element("div");
			div13.textContent = "⚠ Mandatory Controls";
			t39 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t40 = space();
			div14 = element("div");
			t41 = text("PPE: ");
			t42 = text(t42_value);
			t43 = text(" (+");
			t44 = text(t44_value);
			t45 = text("°C)");
			attr(div0, "class", "fg-det-title svelte-8x78vt");
			set_style(div0, "color", /*heat*/ ctx[9].zoneInfo.color);
			attr(span0, "class", "fg-dv svelte-8x78vt");
			attr(span1, "class", "fg-dl svelte-8x78vt");
			attr(div1, "class", "fg-dc svelte-8x78vt");
			attr(span2, "class", "fg-dv svelte-8x78vt");
			attr(span3, "class", "fg-dl svelte-8x78vt");
			attr(div2, "class", "fg-dc svelte-8x78vt");
			attr(span4, "class", "fg-dv svelte-8x78vt");
			attr(span5, "class", "fg-dl svelte-8x78vt");
			attr(div3, "class", "fg-dc svelte-8x78vt");
			attr(span6, "class", "fg-dv svelte-8x78vt");
			set_style(span6, "color", /*heat*/ ctx[9].zoneInfo.color);
			attr(span7, "class", "fg-dl svelte-8x78vt");
			attr(div4, "class", "fg-dc svelte-8x78vt");
			attr(span8, "class", "fg-dv svelte-8x78vt");
			attr(span9, "class", "fg-dl svelte-8x78vt");
			attr(div5, "class", "fg-dc svelte-8x78vt");
			attr(span10, "class", "fg-dv svelte-8x78vt");
			attr(span11, "class", "fg-dl svelte-8x78vt");
			attr(div6, "class", "fg-dc svelte-8x78vt");
			attr(div7, "class", "fg-det-grid svelte-8x78vt");
			attr(span12, "class", "fg-drl svelte-8x78vt");
			attr(span13, "class", "fg-drv svelte-8x78vt");
			attr(div8, "class", "fg-dr svelte-8x78vt");
			attr(span14, "class", "fg-drl svelte-8x78vt");
			attr(span15, "class", "fg-drv svelte-8x78vt");
			attr(div9, "class", "fg-dr svelte-8x78vt");
			attr(span16, "class", "fg-drl svelte-8x78vt");
			attr(span17, "class", "fg-drv svelte-8x78vt");
			attr(div10, "class", "fg-dr svelte-8x78vt");
			attr(span18, "class", "fg-drl svelte-8x78vt");
			attr(span19, "class", "fg-drv fg-drv-sm svelte-8x78vt");
			attr(div11, "class", "fg-dr svelte-8x78vt");
			attr(div12, "class", "fg-ds svelte-8x78vt");
			attr(div13, "class", "fg-dct svelte-8x78vt");
			attr(div14, "class", "fg-dppe svelte-8x78vt");
			attr(div15, "class", "fg-pdet svelte-8x78vt");
			set_style(div15, "border-color", /*heat*/ ctx[9].zoneInfo.color);
		},
		m(target, anchor) {
			insert(target, div15, anchor);
			append(div15, div0);
			append(div0, t0);
			append(div0, t1);
			append(div15, t2);
			append(div15, div7);
			append(div7, div1);
			append(div1, span0);
			append(span0, t3);
			append(span0, t4);
			append(div1, span1);
			append(div7, t6);
			append(div7, div2);
			append(div2, span2);
			append(span2, t7);
			append(span2, t8);
			append(div2, span3);
			append(div7, t10);
			append(div7, div3);
			append(div3, span4);
			append(span4, t11);
			append(span4, t12);
			append(div3, span5);
			append(div7, t14);
			append(div7, div4);
			append(div4, span6);
			append(span6, t15);
			append(div4, span7);
			append(div7, t17);
			append(div7, div5);
			append(div5, span8);
			append(span8, t18);
			append(span8, t19);
			append(div5, span9);
			append(div7, t21);
			append(div7, div6);
			append(div6, span10);
			append(span10, t22);
			append(span10, t23);
			append(div6, span11);
			append(div15, t25);
			append(div15, div12);
			append(div12, div8);
			append(div8, span12);
			append(div8, span13);
			append(span13, t27);
			append(div12, t28);
			append(div12, div9);
			append(div9, span14);
			append(div9, span15);
			append(span15, t30);
			append(div12, t31);
			append(div12, div10);
			append(div10, span16);
			append(div10, span17);
			append(span17, t33);
			append(div12, t34);
			append(div12, div11);
			append(div11, span18);
			append(div11, span19);
			append(span19, t36);
			append(div15, t37);
			append(div15, div13);
			append(div15, t39);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div15, null);
				}
			}

			append(div15, t40);
			append(div15, div14);
			append(div14, t41);
			append(div14, t42);
			append(div14, t43);
			append(div14, t44);
			append(div14, t45);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 512 && t1_value !== (t1_value = /*heat*/ ctx[9].zoneInfo.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*heat*/ 512) {
				set_style(div0, "color", /*heat*/ ctx[9].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 256 && t3_value !== (t3_value = /*rawData*/ ctx[8]?.tempC + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rawData*/ 256 && t7_value !== (t7_value = /*rawData*/ ctx[8]?.humidity + "")) set_data(t7, t7_value);
			if (dirty[0] & /*heat*/ 512 && t11_value !== (t11_value = /*heat*/ ctx[9].apparentTemp1 + "")) set_data(t11, t11_value);

			if (dirty[0] & /*heat*/ 512 && t15_value !== (t15_value = (/*heat*/ ctx[9].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[9].apparentTempFinal + '°C') + "")) set_data(t15, t15_value);

			if (dirty[0] & /*heat*/ 512) {
				set_style(span6, "color", /*heat*/ ctx[9].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 512 && t18_value !== (t18_value = /*heat*/ ctx[9].wbgtBase + "")) set_data(t18, t18_value);
			if (dirty[0] & /*heat*/ 512 && t22_value !== (t22_value = /*heat*/ ctx[9].wbgtAdjusted + "")) set_data(t22, t22_value);
			if (dirty[0] & /*heat*/ 512 && t27_value !== (t27_value = /*heat*/ ctx[9].workRestSchedule.light + "")) set_data(t27, t27_value);
			if (dirty[0] & /*heat*/ 512 && t30_value !== (t30_value = /*heat*/ ctx[9].workRestSchedule.heavy + "")) set_data(t30, t30_value);
			if (dirty[0] & /*heat*/ 512 && t33_value !== (t33_value = /*heat*/ ctx[9].hydration + "")) set_data(t33, t33_value);
			if (dirty[0] & /*heat*/ 512 && t36_value !== (t36_value = /*heat*/ ctx[9].zoneInfo.monitoringSchedule + "")) set_data(t36, t36_value);

			if (dirty[0] & /*heat*/ 512) {
				each_value_2 = ensure_array_like(/*heat*/ ctx[9].zoneInfo.mandatoryControls);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div15, t40);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}

			if (dirty[0] & /*settings*/ 1073741824 && t42_value !== (t42_value = PPE_PROFILES[/*settings*/ ctx[30].ppeProfile].label + "")) set_data(t42, t42_value);
			if (dirty[0] & /*settings*/ 1073741824 && t44_value !== (t44_value = PPE_PROFILES[/*settings*/ ctx[30].ppeProfile].adjustment + "")) set_data(t44, t44_value);

			if (dirty[0] & /*heat*/ 512) {
				set_style(div15, "border-color", /*heat*/ ctx[9].zoneInfo.color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div15);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (229:10) {:else}
function create_else_block(ctx) {
	let div3;
	let div0;
	let span0;
	let t0_value = /*rawData*/ ctx[8]?.solarWm2 + "";
	let t0;
	let span1;
	let t2;
	let div1;
	let span2;
	let t3;
	let t4;
	let span3;
	let t6;
	let div2;
	let span4;
	let t7;
	let t8;
	let span5;
	let t10;
	let div8;
	let div4;
	let span6;
	let span7;
	let t12;
	let t13;
	let div5;
	let span8;
	let span9;
	let t15;
	let t16;
	let div6;
	let span10;
	let span11;
	let t18;
	let t19;
	let div7;
	let span12;
	let span13;
	let t21;
	let t22;
	let t23;

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			span1 = element("span");
			span1.textContent = "W/m²";
			t2 = space();
			div1 = element("div");
			span2 = element("span");
			t3 = text("UV ~");
			t4 = text(/*uvIndex*/ ctx[19]);
			span3 = element("span");
			span3.textContent = "Index";
			t6 = space();
			div2 = element("div");
			span4 = element("span");
			t7 = text(/*solarElevDeg*/ ctx[18]);
			t8 = text("°");
			span5 = element("span");
			span5.textContent = "Sun angle";
			t10 = space();
			div8 = element("div");
			div4 = element("div");
			span6 = element("span");
			span6.textContent = "Sunrise";
			span7 = element("span");
			t12 = text(/*sunriseTime*/ ctx[20]);
			t13 = space();
			div5 = element("div");
			span8 = element("span");
			span8.textContent = "Solar noon";
			span9 = element("span");
			t15 = text(/*solarNoonTime*/ ctx[22]);
			t16 = space();
			div6 = element("div");
			span10 = element("span");
			span10.textContent = "Sunset";
			span11 = element("span");
			t18 = text(/*sunsetTime*/ ctx[21]);
			t19 = space();
			div7 = element("div");
			span12 = element("span");
			span12.textContent = "WBGT solar +";
			span13 = element("span");
			t21 = text("+");
			t22 = text(/*wbgtSolarContrib*/ ctx[23]);
			t23 = text("°C");
			attr(span0, "class", "fg-dv svelte-8x78vt");
			attr(span1, "class", "fg-dl svelte-8x78vt");
			attr(div0, "class", "fg-dc svelte-8x78vt");
			attr(span2, "class", "fg-dv svelte-8x78vt");
			attr(span3, "class", "fg-dl svelte-8x78vt");
			attr(div1, "class", "fg-dc svelte-8x78vt");
			attr(span4, "class", "fg-dv svelte-8x78vt");
			attr(span5, "class", "fg-dl svelte-8x78vt");
			attr(div2, "class", "fg-dc svelte-8x78vt");
			attr(div3, "class", "fg-det-grid svelte-8x78vt");
			attr(span6, "class", "fg-drl svelte-8x78vt");
			attr(span7, "class", "fg-drv svelte-8x78vt");
			attr(div4, "class", "fg-dr svelte-8x78vt");
			attr(span8, "class", "fg-drl svelte-8x78vt");
			attr(span9, "class", "fg-drv svelte-8x78vt");
			attr(div5, "class", "fg-dr svelte-8x78vt");
			attr(span10, "class", "fg-drl svelte-8x78vt");
			attr(span11, "class", "fg-drv svelte-8x78vt");
			attr(div6, "class", "fg-dr svelte-8x78vt");
			attr(span12, "class", "fg-drl svelte-8x78vt");
			attr(span13, "class", "fg-drv svelte-8x78vt");
			attr(div7, "class", "fg-dr svelte-8x78vt");
			attr(div8, "class", "fg-ds svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div0, span0);
			append(span0, t0);
			append(div0, span1);
			append(div3, t2);
			append(div3, div1);
			append(div1, span2);
			append(span2, t3);
			append(span2, t4);
			append(div1, span3);
			append(div3, t6);
			append(div3, div2);
			append(div2, span4);
			append(span4, t7);
			append(span4, t8);
			append(div2, span5);
			insert(target, t10, anchor);
			insert(target, div8, anchor);
			append(div8, div4);
			append(div4, span6);
			append(div4, span7);
			append(span7, t12);
			append(div8, t13);
			append(div8, div5);
			append(div5, span8);
			append(div5, span9);
			append(span9, t15);
			append(div8, t16);
			append(div8, div6);
			append(div6, span10);
			append(div6, span11);
			append(span11, t18);
			append(div8, t19);
			append(div8, div7);
			append(div7, span12);
			append(div7, span13);
			append(span13, t21);
			append(span13, t22);
			append(span13, t23);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 256 && t0_value !== (t0_value = /*rawData*/ ctx[8]?.solarWm2 + "")) set_data(t0, t0_value);
			if (dirty[0] & /*uvIndex*/ 524288) set_data(t4, /*uvIndex*/ ctx[19]);
			if (dirty[0] & /*solarElevDeg*/ 262144) set_data(t7, /*solarElevDeg*/ ctx[18]);
			if (dirty[0] & /*sunriseTime*/ 1048576) set_data(t12, /*sunriseTime*/ ctx[20]);
			if (dirty[0] & /*solarNoonTime*/ 4194304) set_data(t15, /*solarNoonTime*/ ctx[22]);
			if (dirty[0] & /*sunsetTime*/ 2097152) set_data(t18, /*sunsetTime*/ ctx[21]);
			if (dirty[0] & /*wbgtSolarContrib*/ 8388608) set_data(t22, /*wbgtSolarContrib*/ ctx[23]);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
				detach(t10);
				detach(div8);
			}
		}
	};
}

// (223:10) {#if isNight}
function create_if_block_10(ctx) {
	let div3;
	let div0;
	let t1;
	let div1;
	let t5;
	let div2;
	let t6;
	let t7;
	let t8;
	let t9;

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			div0.textContent = "🌙";
			t1 = space();
			div1 = element("div");
			div1.innerHTML = `Solar radiation is <strong class="svelte-8x78vt">zero</strong> at night.`;
			t5 = space();
			div2 = element("div");
			t6 = text("Sunrise: ~");
			t7 = text(/*sunriseTime*/ ctx[20]);
			t8 = text(" · Sunset: ~");
			t9 = text(/*sunsetTime*/ ctx[21]);
			set_style(div0, "font-size", "22px");
			set_style(div0, "margin-bottom", "4px");
			set_style(div2, "color", "#4a6090");
			set_style(div2, "font-size", "9px");
			set_style(div2, "margin-top", "3px");
			attr(div3, "class", "fg-night-msg svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div3, t1);
			append(div3, div1);
			append(div3, t5);
			append(div3, div2);
			append(div2, t6);
			append(div2, t7);
			append(div2, t8);
			append(div2, t9);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sunriseTime*/ 1048576) set_data(t7, /*sunriseTime*/ ctx[20]);
			if (dirty[0] & /*sunsetTime*/ 2097152) set_data(t9, /*sunsetTime*/ ctx[21]);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (198:10) {#each heat.zoneInfo.mandatoryControls as c}
function create_each_block_2(ctx) {
	let div;
	let t0;
	let t1_value = /*c*/ ctx[96] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("▸ ");
			t1 = text(t1_value);
			attr(div, "class", "fg-dci svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 512 && t1_value !== (t1_value = /*c*/ ctx[96] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (248:10) {#each MODELS as m}
function create_each_block_1(ctx) {
	let option;
	let t_1_value = /*m*/ ctx[93].label + "";
	let t_1;

	return {
		c() {
			option = element("option");
			t_1 = text(t_1_value);
			option.__value = /*m*/ ctx[93].key;
			set_input_value(option, option.__value);
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t_1);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(option);
			}
		}
	};
}

// (253:10) {#if !license.valid}
function create_if_block_5(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-proch svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (258:6) {#if worstCaseMode && modelResults.length > 1}
function create_if_block_4(ctx) {
	let div;
	let table;
	let thead;
	let t4;
	let tbody;
	let each_value = ensure_array_like(/*modelResults*/ ctx[12]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");
			table = element("table");
			thead = element("thead");
			thead.innerHTML = `<tr><th class="svelte-8x78vt">Model</th><th class="svelte-8x78vt">Zone</th><th class="svelte-8x78vt">App.T</th><th class="svelte-8x78vt">Wind</th></tr>`;
			t4 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(table, "class", "fg-tbl svelte-8x78vt");
			attr(div, "class", "fg-ptbl svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, table);
			append(table, thead);
			append(table, t4);
			append(table, tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(tbody, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 4096) {
				each_value = ensure_array_like(/*modelResults*/ ctx[12]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
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

// (263:14) {#each modelResults as mr}
function create_each_block(ctx) {
	let tr;
	let td0;
	let t0_value = /*mr*/ ctx[90].modelLabel + "";
	let t0;
	let t1_value = (/*mr*/ ctx[90].isWorst ? ' ⚡' : '') + "";
	let t1;
	let t2;
	let td1;
	let t3_value = /*mr*/ ctx[90].heat.zoneInfo.riskLabel + "";
	let t3;
	let t4;
	let td2;

	let t5_value = (/*mr*/ ctx[90].heat.apparentTempFinal === 999
	? 'NW'
	: /*mr*/ ctx[90].heat.apparentTempFinal + '°C') + "";

	let t5;
	let t6;
	let td3;
	let t7_value = /*mr*/ ctx[90].raw.windMs.toFixed(1) + "";
	let t7;
	let t8;
	let t9;
	let tr_class_value;

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = text(t1_value);
			t2 = space();
			td1 = element("td");
			t3 = text(t3_value);
			t4 = space();
			td2 = element("td");
			t5 = text(t5_value);
			t6 = space();
			td3 = element("td");
			t7 = text(t7_value);
			t8 = text(" m/s");
			t9 = space();
			attr(td0, "class", "svelte-8x78vt");
			set_style(td1, "color", /*mr*/ ctx[90].heat.zoneInfo.color);
			attr(td1, "class", "svelte-8x78vt");
			set_style(td2, "color", /*mr*/ ctx[90].heat.zoneInfo.color);
			attr(td2, "class", "svelte-8x78vt");
			set_style(td3, "color", /*mr*/ ctx[90].wind.riskColor);
			attr(td3, "class", "svelte-8x78vt");
			attr(tr, "class", tr_class_value = "" + (null_to_empty(/*mr*/ ctx[90].isWorst ? 'fg-tbl-best' : '') + " svelte-8x78vt"));
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, t0);
			append(td0, t1);
			append(tr, t2);
			append(tr, td1);
			append(td1, t3);
			append(tr, t4);
			append(tr, td2);
			append(td2, t5);
			append(tr, t6);
			append(tr, td3);
			append(td3, t7);
			append(td3, t8);
			append(tr, t9);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 4096 && t0_value !== (t0_value = /*mr*/ ctx[90].modelLabel + "")) set_data(t0, t0_value);
			if (dirty[0] & /*modelResults*/ 4096 && t1_value !== (t1_value = (/*mr*/ ctx[90].isWorst ? ' ⚡' : '') + "")) set_data(t1, t1_value);
			if (dirty[0] & /*modelResults*/ 4096 && t3_value !== (t3_value = /*mr*/ ctx[90].heat.zoneInfo.riskLabel + "")) set_data(t3, t3_value);

			if (dirty[0] & /*modelResults*/ 4096) {
				set_style(td1, "color", /*mr*/ ctx[90].heat.zoneInfo.color);
			}

			if (dirty[0] & /*modelResults*/ 4096 && t5_value !== (t5_value = (/*mr*/ ctx[90].heat.apparentTempFinal === 999
			? 'NW'
			: /*mr*/ ctx[90].heat.apparentTempFinal + '°C') + "")) set_data(t5, t5_value);

			if (dirty[0] & /*modelResults*/ 4096) {
				set_style(td2, "color", /*mr*/ ctx[90].heat.zoneInfo.color);
			}

			if (dirty[0] & /*modelResults*/ 4096 && t7_value !== (t7_value = /*mr*/ ctx[90].raw.windMs.toFixed(1) + "")) set_data(t7, t7_value);

			if (dirty[0] & /*modelResults*/ 4096) {
				set_style(td3, "color", /*mr*/ ctx[90].wind.riskColor);
			}

			if (dirty[0] & /*modelResults*/ 4096 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*mr*/ ctx[90].isWorst ? 'fg-tbl-best' : '') + " svelte-8x78vt"))) {
				attr(tr, "class", tr_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(tr);
			}
		}
	};
}

function create_fragment(ctx) {
	let div0;
	let t0;
	let t1;
	let section;
	let div3;
	let img;
	let img_src_value;
	let t2;
	let div1;
	let t4;
	let div2;
	let t8;
	let button0;
	let t9;
	let button1;
	let t11;
	let div4;
	let span2;
	let t13;
	let span3;
	let t14_value = (/*lat*/ ctx[1].toFixed(3) + ', ' + /*lon*/ ctx[2].toFixed(3)) + "";
	let t14;
	let t15;
	let span5;
	let span4;
	let t16;
	let t17;
	let t18;
	let div5;
	let t19;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*loading*/ ctx[3]) return create_if_block_30;
		if (/*heat*/ ctx[9]) return create_if_block_31;
		return create_else_block_7;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*mActive*/ ctx[7] && create_if_block_24(ctx);

	function select_block_type_3(ctx, dirty) {
		if (/*isNight*/ ctx[17]) return create_if_block_23;
		return create_else_block_5;
	}

	let current_block_type_1 = select_block_type_3(ctx);
	let if_block2 = current_block_type_1(ctx);
	let each_value_7 = ensure_array_like(/*TABS*/ ctx[36]);
	let each_blocks = [];

	for (let i = 0; i < each_value_7.length; i += 1) {
		each_blocks[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
	}

	function select_block_type_4(ctx, dirty) {
		if (/*tab*/ ctx[0] === 'dashboard') return create_if_block;
		if (/*tab*/ ctx[0] === 'sos') return create_if_block_12;
		if (/*tab*/ ctx[0] === 'report') return create_if_block_15;
		if (/*tab*/ ctx[0] === 'settings') return create_if_block_18;
	}

	let current_block_type_2 = select_block_type_4(ctx);
	let if_block3 = current_block_type_2 && current_block_type_2(ctx);

	return {
		c() {
			div0 = element("div");
			if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			section = element("section");
			div3 = element("div");
			img = element("img");
			t2 = space();
			div1 = element("div");
			div1.textContent = "🛡️";
			t4 = space();
			div2 = element("div");
			div2.innerHTML = `<span class="fg-ph-title svelte-8x78vt">FieldGuard</span> <span class="fg-ph-sub svelte-8x78vt">Real-time Heat &amp; Weather Safety</span>`;
			t8 = space();
			button0 = element("button");
			button0.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>`;
			t9 = space();
			button1 = element("button");
			button1.textContent = "◎";
			t11 = space();
			div4 = element("div");
			span2 = element("span");
			span2.textContent = "📍";
			t13 = space();
			span3 = element("span");
			t14 = text(t14_value);
			t15 = space();
			span5 = element("span");
			span4 = element("span");
			t16 = text(/*currentTime*/ ctx[5]);
			t17 = space();
			if_block2.c();
			t18 = space();
			div5 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t19 = space();
			if (if_block3) if_block3.c();
			attr(div0, "class", "plugin__mobile-header fg-mbar svelte-8x78vt");
			attr(img, "class", "fg-ph-logo svelte-8x78vt");
			if (!src_url_equal(img.src, img_src_value = "./assets/logo-white.png")) attr(img, "src", img_src_value);
			attr(img, "onerror", "this.style.display='none';this.nextElementSibling.style.display='flex'");
			attr(img, "alt", "FieldGuard");
			attr(div1, "class", "fg-ph-shield svelte-8x78vt");
			set_style(div1, "display", "none");
			attr(div2, "class", "fg-ph-txt svelte-8x78vt");
			attr(button0, "class", "fg-ph-btn svelte-8x78vt");
			attr(button0, "title", "Refresh");
			attr(button1, "class", "fg-ph-btn svelte-8x78vt");
			attr(button1, "title", "Location");
			attr(div3, "class", "fg-ph svelte-8x78vt");
			attr(span3, "class", "fg-ploc-name svelte-8x78vt");
			attr(span4, "class", "fg-ploc-time svelte-8x78vt");
			attr(span5, "class", "fg-ploc-r svelte-8x78vt");
			attr(div4, "class", "fg-ploc svelte-8x78vt");
			attr(div5, "class", "fg-ptabs svelte-8x78vt");
			attr(section, "class", "plugin__content fg-panel svelte-8x78vt");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			if_block0.m(div0, null);
			insert(target, t0, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div3);
			append(div3, img);
			append(div3, t2);
			append(div3, div1);
			append(div3, t4);
			append(div3, div2);
			append(div3, t8);
			append(div3, button0);
			append(div3, t9);
			append(div3, button1);
			append(section, t11);
			append(section, div4);
			append(div4, span2);
			append(div4, t13);
			append(div4, span3);
			append(span3, t14);
			append(div4, t15);
			append(div4, span5);
			append(span5, span4);
			append(span4, t16);
			append(span5, t17);
			if_block2.m(span5, null);
			append(section, t18);
			append(section, div5);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div5, null);
				}
			}

			append(section, t19);
			if (if_block3) if_block3.m(section, null);

			if (!mounted) {
				dispose = listen(button0, "click", /*refreshData*/ ctx[38]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div0, null);
				}
			}

			if (/*mActive*/ ctx[7]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_24(ctx);
					if_block1.c();
					if_block1.m(t1.parentNode, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty[0] & /*lat, lon*/ 6 && t14_value !== (t14_value = (/*lat*/ ctx[1].toFixed(3) + ', ' + /*lon*/ ctx[2].toFixed(3)) + "")) set_data(t14, t14_value);
			if (dirty[0] & /*currentTime*/ 32) set_data(t16, /*currentTime*/ ctx[5]);

			if (current_block_type_1 !== (current_block_type_1 = select_block_type_3(ctx))) {
				if_block2.d(1);
				if_block2 = current_block_type_1(ctx);

				if (if_block2) {
					if_block2.c();
					if_block2.m(span5, null);
				}
			}

			if (dirty[0] & /*tab*/ 1 | dirty[1] & /*TABS*/ 32) {
				each_value_7 = ensure_array_like(/*TABS*/ ctx[36]);
				let i;

				for (i = 0; i < each_value_7.length; i += 1) {
					const child_ctx = get_each_context_7(ctx, each_value_7, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div5, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_7.length;
			}

			if (current_block_type_2 === (current_block_type_2 = select_block_type_4(ctx)) && if_block3) {
				if_block3.p(ctx, dirty);
			} else {
				if (if_block3) if_block3.d(1);
				if_block3 = current_block_type_2 && current_block_type_2(ctx);

				if (if_block3) {
					if_block3.c();
					if_block3.m(section, null);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t0);
				detach(t1);
				detach(section);
			}

			if_block0.d();
			if (if_block1) if_block1.d(detaching);
			if_block2.d();
			destroy_each(each_blocks, detaching);

			if (if_block3) {
				if_block3.d();
			}

			mounted = false;
			dispose();
		}
	};
}

function calcSolarPosition(latDeg, lonDeg, date) {
	const JD = date.getTime() / 86400000 + 2440587.5;
	const n = JD - 2451545.0;
	const L = (280.46 + 0.9856474 * n) % 360;
	const g = (357.528 + 0.9856003 * n) % 360 * Math.PI / 180;
	const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * Math.PI / 180;
	const epsilon = 23.439 * Math.PI / 180;
	const sinDec = Math.sin(epsilon) * Math.sin(lambda);
	const dec = Math.asin(sinDec);
	const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
	const LSTM = 15 * Math.round(lonDeg / 15);
	const B = 360 / 365 * (n - 81) * Math.PI / 180;
	const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
	const TC = 4 * (lonDeg - LSTM) + EoT;
	const LST = UT + TC / 60;
	const HRA = (LST - 12) * 15 * Math.PI / 180;
	const latRad = latDeg * Math.PI / 180;
	const sinElev = Math.sin(latRad) * Math.sin(dec) + Math.cos(latRad) * Math.cos(dec) * Math.cos(HRA);
	const elev = Math.asin(sinElev) * 180 / Math.PI;
	const cosHA_rise = -Math.tan(latRad) * Math.tan(dec);
	const HA_rise = Math.acos(Math.max(-1, Math.min(1, cosHA_rise))) * 180 / Math.PI;
	const sunrise_LST = 12 - HA_rise / 15;
	const sunset_LST = 12 + HA_rise / 15;

	return {
		elev,
		LST,
		sunrise_LST,
		sunset_LST,
		solarNoon_LST: 12
	};
}

function fmtLocalSolarTime(lst) {
	const h = Math.floor((lst % 24 + 24) % 24);
	const m = Math.floor((lst - Math.floor(lst)) * 60);
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function zoneSeverity(zone) {
	return ({
		green: 0,
		amber: 1,
		red: 2,
		purple: 3,
		black: 4
	})[zone] ?? 0;
}

function instance($$self, $$props, $$invalidate) {
	let tab = 'dashboard';
	let lat = 23.6, lon = 58.6;
	let loading = false, error = '';
	let currentTime = '';
	let dActive = 'heat';
	let mActive = null;
	let rawData = null;
	let heat = null;
	let windResult = null;
	let rainResult = null;
	let modelResults = [];
	let worstModelLabel = '';
	let selectedModel = 'ecmwf';
	let worstCaseMode = false;
	let alertLog = [];
	let autoRefreshTimer = null;
	let reportText = '';
	let isNight = false;
	let solarElevDeg = 0;
	let uvIndex = 0;
	let sunriseTime = '--:--';
	let sunsetTime = '--:--';
	let solarNoonTime = '--:--';
	let wbgtSolarContrib = 0;
	let solarColor = '#4a6090';
	let solarLabel = 'LOW';

	function updateSolarState(inputs) {
		const now = new Date();
		const sol = calcSolarPosition(lat, lon, now);
		$$invalidate(17, isNight = sol.elev < -0.833);
		$$invalidate(18, solarElevDeg = Math.round(sol.elev * 10) / 10);

		$$invalidate(20, sunriseTime = fmtLocalSolarTime(sol.sunrise_LST));
		$$invalidate(21, sunsetTime = fmtLocalSolarTime(sol.sunset_LST));
		$$invalidate(22, solarNoonTime = fmtLocalSolarTime(sol.solarNoon_LST));
		$$invalidate(19, uvIndex = isNight ? 0 : Math.round(inputs.solarWm2 / 25));
		const albedo = 0.37, emiss = 0.95, sigma = 5.67e-8;
		const Tk = inputs.tempC + 273.15;
		const Tg_K = Math.pow((1 - albedo) * inputs.solarWm2 / (emiss * sigma) + Tk ** 4, 0.25);
		const Tg = Tg_K - 273.15;
		$$invalidate(23, wbgtSolarContrib = Math.round(0.2 * (Tg - inputs.tempC) * 10) / 10);
		const w = inputs.solarWm2;

		if (isNight) {
			$$invalidate(24, solarColor = '#a5b4fc');
			$$invalidate(25, solarLabel = 'NIGHT');
		} else if (w < 200) {
			$$invalidate(24, solarColor = '#16a34a');
			$$invalidate(25, solarLabel = 'LOW');
		} else if (w < 600) {
			$$invalidate(24, solarColor = '#d97706');
			$$invalidate(25, solarLabel = 'MODERATE');
		} else if (w < 900) {
			$$invalidate(24, solarColor = '#dc2626');
			$$invalidate(25, solarLabel = 'HIGH');
		} else {
			$$invalidate(24, solarColor = '#7c3aed');
			$$invalidate(25, solarLabel = 'EXTREME');
		}
	}

	function dToggle(id) {
		$$invalidate(6, dActive = dActive === id ? null : id);
	}

	function mToggle(id) {
		$$invalidate(7, mActive = mActive === id ? null : id);
	}

	let license = { valid: false, tier: '', expires: '' };
	let licenseKeyInput = '';
	let licenseLoading = false;
	let licenseError = '';

	function isPro() {
		return license.valid && !!license.expires && new Date(license.expires) > new Date();
	}

	function loadLicense() {
		try {
			const s = localStorage.getItem('fg_license');

			if (s) {
				const p = JSON.parse(s);

				if (p.valid && new Date(p.expires) > new Date()) {
					$$invalidate(26, license = p);
					$$invalidate(14, worstCaseMode = true);
				}
			}
		} catch {
			
		}
	}

	async function activateLicense() {
		const key = licenseKeyInput.trim();
		if (!key) return;
		$$invalidate(28, licenseLoading = true);
		$$invalidate(29, licenseError = '');

		try {
			const res = await fetch('https://fieldguard-hse.com/api/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, fingerprint: navigator.userAgent })
			});

			if (!res.ok) throw new Error(`Server error: ${res.status}`);
			const data = await res.json();

			if (data.valid) {
				$$invalidate(26, license = {
					valid: true,
					tier: data.tier,
					expires: data.expires,
					token: data.token
				});

				localStorage.setItem('fg_license', JSON.stringify(license));
				$$invalidate(27, licenseKeyInput = '');
				$$invalidate(14, worstCaseMode = true);
				refreshData();
			} else {
				$$invalidate(29, licenseError = data.message ?? 'Invalid license key.');
			}
		} catch(e) {
			$$invalidate(29, licenseError = (e.message?.includes('fetch'))
			? 'Cannot reach fieldguard-hse.com'
			: e.message ?? 'Activation failed.');
		}

		$$invalidate(28, licenseLoading = false);
	}

	function deactivateLicense() {
		$$invalidate(26, license = { valid: false, tier: '', expires: '' });
		localStorage.removeItem('fg_license');
		$$invalidate(14, worstCaseMode = false);
	}

	const TABS = [
		{
			id: 'dashboard',
			icon: '🏠',
			label: 'Live'
		},
		{ id: 'sos', icon: '🚨', label: 'SOS' },
		{
			id: 'report',
			icon: '📄',
			label: 'Report'
		},
		{
			id: 'settings',
			icon: '⚙',
			label: 'Config'
		}
	];

	const MODELS = [
		{ key: 'ecmwf', label: 'ECMWF' },
		{ key: 'gfs', label: 'GFS' },
		{ key: 'icon', label: 'ICON' },
		{ key: 'meps', label: 'MEPS' },
		{ key: 'gem', label: 'GEM' },
		{ key: 'access', label: 'ACCESS-G' }
	];

	const DEFAULT_SETTINGS = {
		ppeProfile: 'coverall',
		wbgtWarnC: 30,
		wbgtDangerC: 32,
		windWarnMs: 12,
		windDangerMs: 20,
		rainWarnMmh: 7.6,
		rainDangerMmh: 25,
		soundAlerts: true,
		autoRefresh: false
	};

	let settings = { ...DEFAULT_SETTINGS };

	let reportMeta = {
		projectName: '',
		contractNumber: '',
		country: '',
		clientName: '',
		contractorName: '',
		hseManagerName: '',
		regulatoryRef: 'Ministerial Decision No. 286/2008',
		banStart: '12:30',
		banEnd: '15:30',
		banMonths: 'June, July, August',
		fidic: 'UNDER REVIEW',
		delayDays: 0
	};

	async function fetchModelData(modelKey) {
		try {
			store.set('product', modelKey);
			await new Promise(r => setTimeout(r, 600));

			const read = async overlay => {
				store.set('overlay', overlay);
				await new Promise(r => setTimeout(r, 300));
				const interp = await getLatLonInterpolator();
				return interp ? await interp({ lat, lon }) : null;
			};

			const tempRaw = await read('temp');
			const windRaw = await read('wind');
			const humRaw = await read('rh');
			const rainRaw = await read('rain');
			const cloudRaw = await read('lclouds');

			const tempC = Array.isArray(tempRaw)
			? tempRaw[0] - 273.15
			: (tempRaw ?? 298) - 273.15;

			const windMs = Array.isArray(windRaw)
			? Math.sqrt(windRaw[0] ** 2 + windRaw[1] ** 2)
			: windRaw ?? 0;

			const humidity = Array.isArray(humRaw) ? humRaw[0] : humRaw ?? 50;

			const rainMmH = Array.isArray(rainRaw)
			? Math.max(0, rainRaw[0])
			: Math.max(0, rainRaw ?? 0);

			const cloudFrac = Math.min(1, Math.max(0, (Array.isArray(cloudRaw) ? cloudRaw[0] : cloudRaw ?? 30) / 100));
			const now = new Date();
			const sol = calcSolarPosition(lat, lon, now);
			const isNightLocal = sol.elev < -0.833;
			let solarWm2 = 0;

			if (!isNightLocal) {
				const elevRad = sol.elev * Math.PI / 180;
				const sinElev = Math.sin(elevRad);
				const I0 = 1361;
				const airMass = sinElev > 0.01 ? 1 / sinElev : 100;
				const transmit = Math.pow(0.7, Math.pow(airMass, 0.678));
				const clearSky = I0 * transmit * sinElev;
				solarWm2 = Math.round(Math.max(0, clearSky * (1 - 0.75 * cloudFrac)));
			}

			return {
				tempC: Math.round(tempC * 10) / 10,
				humidity: Math.min(100, Math.max(0, Math.round(humidity))),
				windMs: Math.max(0, Math.round(windMs * 10) / 10),
				solarWm2,
				rainMmH: Math.round(rainMmH * 10) / 10
			};
		} catch {
			return null;
		}
	}

	async function loadFromOpenMeteo() {
		try {
			const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` + `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,shortwave_radiation` + `&wind_speed_unit=ms&timezone=auto`;
			const j = await (await fetch(url)).json();
			const c = j.current;
			const sol = calcSolarPosition(lat, lon, new Date());
			const solarWm2 = sol.elev < -0.833 ? 0 : c.shortwave_radiation ?? 0;

			return {
				tempC: c.temperature_2m,
				humidity: c.relative_humidity_2m,
				windMs: c.wind_speed_10m,
				solarWm2,
				rainMmH: c.precipitation ?? 0
			};
		} catch {
			return null;
		}
	}

	function processInputs(inputs) {
		const now = new Date();
		const localHour = now.getUTCHours() + lon / 15;
		const month = now.getMonth() + 1;

		return {
			heat: assessHeatStress(inputs, settings.ppeProfile, localHour, month),
			wind: assessWind(inputs.windMs, settings.windWarnMs, settings.windDangerMs),
			rain: assessRain(inputs.rainMmH, settings.rainWarnMmh, settings.rainDangerMmh)
		};
	}

	async function refreshData() {
		$$invalidate(3, loading = true);
		$$invalidate(4, error = '');
		$$invalidate(5, currentTime = new Date().toLocaleTimeString());

		try {
			const results = [];

			if (worstCaseMode && isPro()) {
				for (const model of MODELS) {
					const inputs = await fetchModelData(model.key);
					if (!inputs) continue;
					const { heat: h, wind: w, rain: r } = processInputs(inputs);

					results.push({
						modelKey: model.key,
						modelLabel: model.label,
						raw: inputs,
						heat: h,
						wind: w,
						rain: r,
						isWorst: false
					});
				}
			}

			if (results.length === 0) {
				const inputs = await fetchModelData(selectedModel) ?? await loadFromOpenMeteo();
				if (!inputs) throw new Error('No data available');
				const { heat: h, wind: w, rain: r } = processInputs(inputs);

				results.push({
					modelKey: selectedModel,
					modelLabel: MODELS.find(m => m.key === selectedModel)?.label ?? selectedModel,
					raw: inputs,
					heat: h,
					wind: w,
					rain: r,
					isWorst: true
				});
			} else {
				results.sort((a, b) => {
					const zd = zoneSeverity(b.heat.zone) - zoneSeverity(a.heat.zone);

					return zd !== 0
					? zd
					: (b.heat.apparentTempFinal === 999
						? 99
						: b.heat.apparentTempFinal) - (a.heat.apparentTempFinal === 999
						? 99
						: a.heat.apparentTempFinal);
				});

				results[0].isWorst = true;
			}

			$$invalidate(12, modelResults = results);
			$$invalidate(8, rawData = results[0].raw);
			$$invalidate(9, heat = results[0].heat);
			$$invalidate(10, windResult = results[0].wind);
			$$invalidate(11, rainResult = results[0].rain);
			worstModelLabel = results[0].modelLabel;
			updateSolarState(rawData);
			checkAlerts();
		} catch {
			$$invalidate(4, error = 'Failed to fetch data. Try a different model or check connection.');
		}

		$$invalidate(3, loading = false);
	}

	function checkAlerts() {
		if (!heat || !windResult || !rainResult) return;
		const time = new Date().toLocaleTimeString();

		if (heat.zone !== 'green') $$invalidate(15, alertLog = [
			...alertLog,
			{
				time,
				type: `🌡 HEAT — ${heat.zoneInfo.riskLabel}`,
				color: heat.zoneInfo.color,
				message: `App.Temp: ${heat.apparentTempFinal === 999
				? 'NO WORK'
				: heat.apparentTempFinal + '°C'} | ${heat.zoneInfo.label}`
			}
		]);

		if (windResult.exceedsThreshold) $$invalidate(15, alertLog = [
			...alertLog,
			{
				time,
				type: '💨 WIND ALERT',
				color: windResult.riskColor,
				message: `${rawData?.windMs.toFixed(1)} m/s — Bft ${windResult.beaufort} (${windResult.beaufortDesc})`
			}
		]);

		if (rainResult.exceedsThreshold) $$invalidate(15, alertLog = [
			...alertLog,
			{
				time,
				type: '🌧 RAIN ALERT',
				color: rainResult.riskColor,
				message: `${rawData?.rainMmH.toFixed(1)} mm/h — ${rainResult.intensityLabel}`
			}
		]);

		if (heat.isBanPeriod) $$invalidate(15, alertLog = [
			...alertLog,
			{
				time,
				type: '🚫 LEGAL WORK BAN',
				color: '#f97316',
				message: `12:30–15:30 outdoor ban active`
			}
		]);

		if (heat.zone === 'red' || heat.zone === 'purple' || heat.zone === 'black') {
			if (settings.soundAlerts && 'Notification' in window && Notification.permission === 'granted') {
				new Notification(`FieldGuard: ${heat.zoneInfo.riskLabel}`, { body: heat.zoneInfo.mandatoryControls[0] });
			}
		}
	}

	function saveSettings() {
		try {
			localStorage.setItem('fieldguard_settings', JSON.stringify(settings));
		} catch {
			
		}

		refreshData();
	}

	function resetSettings() {
		$$invalidate(30, settings = { ...DEFAULT_SETTINGS });
		saveSettings();
	}

	function setupAutoRefresh() {
		if (autoRefreshTimer) {
			clearInterval(autoRefreshTimer);
			autoRefreshTimer = null;
		}

		if (settings.autoRefresh && isPro()) autoRefreshTimer = setInterval(refreshData, 15 * 60 * 1000);
	}

	function generateReport() {
		const today = new Date(), weekAgo = new Date(today);
		weekAgo.setDate(today.getDate() - 7);
		const fmt = d => d.toISOString().split('T')[0];
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

		const dailyMet = days.map(day => ({
			day,
			maxTemp: rawData?.tempC ?? 0,
			minTemp: (rawData?.tempC ?? 8) - 8,
			maxRH: rawData?.humidity ?? 0,
			maxWind: rawData?.windMs ?? 0,
			peakSolar: rawData?.solarWm2 ?? 0
		}));

		const wbgtLog = alertLog.filter(a => a.type.includes('HEAT')).map((a, i) => ({
			date: fmt(new Date(today.getTime() - (6 - i) * 86400000)),
			time: a.time,
			durationH: 0.5,
			wbgtBase: heat?.wbgtBase ?? 0,
			wbgtAdj: heat?.wbgtAdjusted ?? 0,
			ppe: PPE_PROFILES[settings.ppeProfile].label,
			zone: heat?.zoneInfo.riskLabel ?? '',
			action: heat?.zoneInfo.mandatoryControls[0] ?? ''
		}));

		const rd = {
			...reportMeta,
			siteAddress: lat.toFixed(3) + ', ' + lon.toFixed(3),
			lat,
			lon,
			weekStart: fmt(weekAgo),
			weekEnd: fmt(today),
			ppeProfile: PPE_PROFILES[settings.ppeProfile].label,
			ppeAdjustment: PPE_PROFILES[settings.ppeProfile].adjustment,
			dailyMet,
			wbgtLog,
			morningGap: [],
			suspensions: [],
			totalSuspensionHours: wbgtLog.reduce((s, e) => s + e.durationH, 0),
			cumulativeSuspensionHours: wbgtLog.reduce((s, e) => s + e.durationH, 0),
			forecastNarrative: `FieldGuard analysis at ${lat.toFixed(3) + ', ' + lon.toFixed(3)} shows ${heat?.zoneInfo.riskLabel ?? 'N/A'} zone.`
		};

		$$invalidate(16, reportText = generateWeeklyReport(rd));
	}

	function copyReport() {
		navigator.clipboard?.writeText(reportText).catch(() => {
			
		});
	}

	function downloadReport() {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([reportText], { type: 'text/plain' }));
		a.download = `FieldGuard-ISO7933-${new Date().toISOString().split('T')[0]}.txt`;
		a.click();
	}

	onMount(() => {
		try {
			const s = localStorage.getItem('fieldguard_settings');
			if (s) $$invalidate(30, settings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) });
		} catch {
			
		}

		loadLicense();

		try {
			const c = map.getCenter();
			$$invalidate(1, lat = c.lat);
			$$invalidate(2, lon = c.lng);
		} catch {
			
		}

		map.on('click', e => {
			$$invalidate(1, lat = e.latlng.lat);
			$$invalidate(2, lon = e.latlng.lng);
			refreshData();
		});

		refreshData();
		setupAutoRefresh();
		if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
	});

	onDestroy(() => {
		if (autoRefreshTimer) clearInterval(autoRefreshTimer);
		map.off('click');
	});

	const onopen = params => {
		if (params?.lat && params?.lon) {
			$$invalidate(1, lat = parseFloat(params.lat));
			$$invalidate(2, lon = parseFloat(params.lon));
			refreshData();
		}
	};

	const $$binding_groups = [[]];
	const click_handler = () => mToggle('heat');
	const click_handler_1 = () => mToggle('wind');
	const click_handler_2 = () => mToggle('rain');
	const click_handler_3 = () => mToggle('solar');
	const click_handler_4 = () => $$invalidate(7, mActive = null);
	const click_handler_5 = t => $$invalidate(0, tab = t.id);
	const click_handler_6 = () => dToggle('heat');
	const click_handler_7 = () => dToggle('wind');
	const click_handler_8 = () => dToggle('rain');
	const click_handler_9 = () => dToggle('solar');

	function select_change_handler() {
		selectedModel = select_value(this);
		$$invalidate(13, selectedModel);
		$$invalidate(37, MODELS);
	}

	function input_change_handler() {
		worstCaseMode = this.checked;
		$$invalidate(14, worstCaseMode);
	}

	function input0_input_handler() {
		reportMeta.projectName = this.value;
		$$invalidate(31, reportMeta);
	}

	function input1_input_handler() {
		reportMeta.contractNumber = this.value;
		$$invalidate(31, reportMeta);
	}

	function input2_input_handler() {
		reportMeta.country = this.value;
		$$invalidate(31, reportMeta);
	}

	function input3_input_handler() {
		reportMeta.clientName = this.value;
		$$invalidate(31, reportMeta);
	}

	function input4_input_handler() {
		reportMeta.contractorName = this.value;
		$$invalidate(31, reportMeta);
	}

	function input5_input_handler() {
		reportMeta.hseManagerName = this.value;
		$$invalidate(31, reportMeta);
	}

	function input6_input_handler() {
		reportMeta.regulatoryRef = this.value;
		$$invalidate(31, reportMeta);
	}

	function input7_input_handler() {
		reportMeta.banStart = this.value;
		$$invalidate(31, reportMeta);
	}

	function input8_input_handler() {
		reportMeta.banEnd = this.value;
		$$invalidate(31, reportMeta);
	}

	function select_change_handler_1() {
		reportMeta.fidic = select_value(this);
		$$invalidate(31, reportMeta);
	}

	function input_input_handler() {
		licenseKeyInput = this.value;
		$$invalidate(27, licenseKeyInput);
	}

	function input_change_handler_1() {
		settings.ppeProfile = this.__value;
		$$invalidate(30, settings);
	}

	function input0_change_input_handler() {
		settings.wbgtWarnC = to_number(this.value);
		$$invalidate(30, settings);
	}

	function input1_change_input_handler() {
		settings.wbgtDangerC = to_number(this.value);
		$$invalidate(30, settings);
	}

	function input2_change_input_handler() {
		settings.windWarnMs = to_number(this.value);
		$$invalidate(30, settings);
	}

	function input3_change_input_handler() {
		settings.windDangerMs = to_number(this.value);
		$$invalidate(30, settings);
	}

	function input4_change_input_handler() {
		settings.rainWarnMmh = to_number(this.value);
		$$invalidate(30, settings);
	}

	function input5_change_input_handler() {
		settings.rainDangerMmh = to_number(this.value);
		$$invalidate(30, settings);
	}

	function input0_change_handler() {
		settings.soundAlerts = this.checked;
		$$invalidate(30, settings);
	}

	function input1_change_handler() {
		settings.autoRefresh = this.checked;
		$$invalidate(30, settings);
	}

	return [
		tab,
		lat,
		lon,
		loading,
		error,
		currentTime,
		dActive,
		mActive,
		rawData,
		heat,
		windResult,
		rainResult,
		modelResults,
		selectedModel,
		worstCaseMode,
		alertLog,
		reportText,
		isNight,
		solarElevDeg,
		uvIndex,
		sunriseTime,
		sunsetTime,
		solarNoonTime,
		wbgtSolarContrib,
		solarColor,
		solarLabel,
		license,
		licenseKeyInput,
		licenseLoading,
		licenseError,
		settings,
		reportMeta,
		dToggle,
		mToggle,
		activateLicense,
		deactivateLicense,
		TABS,
		MODELS,
		refreshData,
		saveSettings,
		resetSettings,
		setupAutoRefresh,
		generateReport,
		copyReport,
		downloadReport,
		onopen,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4,
		click_handler_5,
		click_handler_6,
		click_handler_7,
		click_handler_8,
		click_handler_9,
		select_change_handler,
		input_change_handler,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler,
		input3_input_handler,
		input4_input_handler,
		input5_input_handler,
		input6_input_handler,
		input7_input_handler,
		input8_input_handler,
		select_change_handler_1,
		input_input_handler,
		input_change_handler_1,
		$$binding_groups,
		input0_change_input_handler,
		input1_change_input_handler,
		input2_change_input_handler,
		input3_change_input_handler,
		input4_change_input_handler,
		input5_change_input_handler,
		input0_change_handler,
		input1_change_handler
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 45 }, add_css, [-1, -1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[45];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
