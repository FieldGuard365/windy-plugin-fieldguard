const __pluginConfig =  {
  "name": "windy-plugin-fieldguard",
  "version": "2.1.0",
  "icon": "🛡️",
  "title": "FieldGuard — HSE Field Safety",
  "description": "Real-time HSE safety monitor. Heat stress zones (ISO 7243/7933), wind & rain alerts, multi-model worst-case engine, ISO 7933 weekly reports.",
  "author": "FieldGuard HSE",
  "desktopUI": "rhpane",
  "mobileUI": "small",
  "desktopWidth": 280,
  "routerPath": "/fieldguard/:lat?/:lon?",
  "listenToLocationChange": true,
  "addToContextmenu": true,
  "built": 1779558063876,
  "builtReadable": "2026-05-23T17:41:03.876Z",
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
	append_styles(target, "svelte-lyzie7", ":root{--amb:#e8962a;--n1:#050a18;--n2:#0a1228;--n4:#1a2d55;--sl:#8a9cc8;--sl2:#4a6090}.fg.svelte-lyzie7.svelte-lyzie7{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;font-size:12px;color:#e8edf8;background:rgba(5,10,24,0.97);min-height:100%}.fg-head.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#0a1228;border-bottom:2px solid var(--amb)}.fg-head-logo.svelte-lyzie7.svelte-lyzie7{width:26px;height:26px;object-fit:contain;flex-shrink:0}.fg-head-shield.svelte-lyzie7.svelte-lyzie7{font-size:18px;flex-shrink:0}.fg-head-txt.svelte-lyzie7.svelte-lyzie7{flex:1;display:flex;flex-direction:column}.fg-head-title.svelte-lyzie7.svelte-lyzie7{font-size:13px;font-weight:800;color:#fff}.fg-head-sub.svelte-lyzie7.svelte-lyzie7{font-size:8px;color:var(--sl2);text-transform:uppercase;letter-spacing:0.8px}.fg-icon-btn.svelte-lyzie7.svelte-lyzie7{width:26px;height:26px;background:rgba(15,29,66,0.8);border:1px solid rgba(45,64,128,0.6);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--sl);transition:all 0.15s;flex-shrink:0;padding:0}.fg-icon-btn.svelte-lyzie7.svelte-lyzie7:hover{border-color:var(--amb);color:var(--amb)}.fg-loc.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(10,18,40,0.8);border-bottom:1px solid rgba(255,255,255,0.04);font-size:9px;color:var(--sl)}.fg-loc-name.svelte-lyzie7.svelte-lyzie7{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fg-loc-r.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:4px;flex-shrink:0}.fg-loc-t.svelte-lyzie7.svelte-lyzie7{color:var(--sl2)}.fg-dbadge.svelte-lyzie7.svelte-lyzie7{background:#78350f;color:#fcd34d;border-radius:3px;padding:1px 5px;font-size:7px;font-weight:700}.fg-nbadge.svelte-lyzie7.svelte-lyzie7{background:#1e1b4b;color:#a5b4fc;border-radius:3px;padding:1px 5px;font-size:7px;font-weight:700}.fg-pills.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:stretch;gap:5px;padding:8px 8px 6px;background:#0d1933;border-bottom:1px solid rgba(232,150,42,0.2)}.fg-pill.svelte-lyzie7.svelte-lyzie7{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 3px;background:rgba(10,18,40,0.8);border:1px solid var(--c,#2d4080);border-radius:9px;cursor:pointer;transition:all 0.15s}.fg-pill.svelte-lyzie7.svelte-lyzie7:active{transform:scale(0.94)}.fg-pill.fg-pill-on.svelte-lyzie7.svelte-lyzie7{border-width:2px;background:rgba(18,32,68,0.95)}.fg-pill-ic.svelte-lyzie7.svelte-lyzie7{font-size:16px;line-height:1}.fg-pill-vl.svelte-lyzie7.svelte-lyzie7{font-size:14px;font-weight:800;color:#fff;line-height:1.1;display:flex;align-items:baseline;gap:1px}.fg-pill-u.svelte-lyzie7.svelte-lyzie7{font-size:8px;color:var(--sl)}.fg-pill-lb.svelte-lyzie7.svelte-lyzie7{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.4px}.fg-pill-ban.svelte-lyzie7.svelte-lyzie7{font-size:18px;align-self:center;flex-shrink:0;animation:svelte-lyzie7-pulse 1.5s infinite}@keyframes svelte-lyzie7-pulse{0%,100%{opacity:1}50%{opacity:.4}}.fg-rfr.svelte-lyzie7.svelte-lyzie7{width:28px;flex-shrink:0;align-self:center;background:rgba(10,18,40,0.7);border:1px solid rgba(45,64,128,0.5);border-radius:8px;font-size:16px;cursor:pointer;color:var(--sl);padding:5px;display:flex;align-items:center;justify-content:center;transition:all 0.15s}.fg-rfr.svelte-lyzie7.svelte-lyzie7:hover{border-color:var(--amb);color:var(--amb)}.fg-pills-load.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--sl);padding:6px 2px}.fg-pills-tap.svelte-lyzie7.svelte-lyzie7{width:100%;background:transparent;border:1px dashed rgba(45,64,128,0.5);border-radius:7px;color:var(--sl);font-size:11px;cursor:pointer;padding:8px}.fg-desktop.svelte-lyzie7.svelte-lyzie7{display:block}.fg-tabs.svelte-lyzie7.svelte-lyzie7{display:flex;background:#0a1228;border-bottom:1px solid rgba(255,255,255,0.06)}.fg-tab.svelte-lyzie7.svelte-lyzie7{flex:1;padding:6px 2px;background:transparent;border:none;color:var(--sl2);cursor:pointer;font-size:9px;border-bottom:2px solid transparent;transition:all 0.15s;display:flex;flex-direction:column;align-items:center;gap:1px}.fg-tab.svelte-lyzie7 span.svelte-lyzie7:first-child{font-size:13px}.fg-tab.fg-tab-on.svelte-lyzie7.svelte-lyzie7{color:var(--amb);border-bottom-color:var(--amb)}.fg-det.svelte-lyzie7.svelte-lyzie7{background:rgba(5,10,24,0.8);border:1px solid;margin:6px 8px;border-radius:8px;padding:10px 9px}.fg-det-ti.svelte-lyzie7.svelte-lyzie7{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px}.fg-det-g.svelte-lyzie7.svelte-lyzie7{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-bottom:7px}.fg-dc.svelte-lyzie7.svelte-lyzie7{background:rgba(5,10,22,0.6);border-radius:5px;padding:5px 3px;text-align:center}.fg-dv.svelte-lyzie7.svelte-lyzie7{font-size:12px;font-weight:800;color:#fff;display:block}.fg-dl.svelte-lyzie7.svelte-lyzie7{font-size:7px;color:var(--sl2);text-transform:uppercase;letter-spacing:0.3px}.fg-ds.svelte-lyzie7.svelte-lyzie7{background:rgba(5,10,22,0.4);border-radius:5px;padding:6px;margin-bottom:5px}.fg-dr.svelte-lyzie7.svelte-lyzie7{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(10,18,38,0.9);font-size:9px}.fg-dr.svelte-lyzie7.svelte-lyzie7:last-child{border:none}.fg-drl.svelte-lyzie7.svelte-lyzie7{color:var(--sl2)}.fg-drv.svelte-lyzie7.svelte-lyzie7{color:var(--sl);font-weight:500}.fg-dct.svelte-lyzie7.svelte-lyzie7{font-size:9px;color:var(--amb);text-transform:uppercase;font-weight:700;margin:6px 0 4px}.fg-dci.svelte-lyzie7.svelte-lyzie7{font-size:9px;color:var(--sl);padding:2px 0;border-bottom:1px solid rgba(10,18,38,0.7)}.fg-dci.svelte-lyzie7.svelte-lyzie7:last-child{border:none}.fg-dppe.svelte-lyzie7.svelte-lyzie7{font-size:8px;color:var(--sl2);margin-top:5px}.fg-dthr.svelte-lyzie7.svelte-lyzie7{font-size:9px;color:var(--sl2);text-align:center;margin:4px 8px 0}.fg-night.svelte-lyzie7.svelte-lyzie7{background:rgba(30,27,75,0.5);border-radius:6px;padding:12px;text-align:center;font-size:10px;color:#c7d2fe}.fg-det-hint.svelte-lyzie7.svelte-lyzie7{padding:18px;text-align:center;color:var(--sl2);font-size:10px}.fg-ban.svelte-lyzie7.svelte-lyzie7{padding:7px 10px;background:rgba(124,45,18,0.85);color:#fed7aa;font-size:10px;font-weight:700;text-align:center}.fg-load.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:8px;padding:18px 10px;font-size:10px;color:var(--sl)}.fg-err.svelte-lyzie7.svelte-lyzie7{padding:10px;background:rgba(61,10,10,0.85);color:#fca5a5;font-size:10px}.fg-mr.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:6px;padding:6px 8px;border-top:1px solid rgba(255,255,255,0.05);background:rgba(10,18,40,0.5)}.fg-mr-sel.svelte-lyzie7.svelte-lyzie7{background:rgba(10,18,40,0.9);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:3px 6px;border-radius:4px;font-size:10px}.fg-mr-wc.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:4px;margin-left:auto;font-size:9px;color:var(--sl);cursor:pointer}.fg-proch.svelte-lyzie7.svelte-lyzie7{background:var(--amb);color:#0f1d42;font-size:7px;font-weight:800;padding:1px 4px;border-radius:2px}.fg-tbl.svelte-lyzie7.svelte-lyzie7{width:100%;border-collapse:collapse;font-size:9px;margin:0 8px 6px;width:calc(100% - 16px)}.fg-tbl.svelte-lyzie7 th.svelte-lyzie7{color:var(--sl2);text-align:left;padding:3px;border-bottom:1px solid rgba(45,64,128,0.4)}.fg-tbl.svelte-lyzie7 td.svelte-lyzie7{padding:2px 3px;color:var(--sl)}.fg-tbl-b.svelte-lyzie7 td.svelte-lyzie7{color:#fff;font-weight:700;background:rgba(10,18,40,0.6)}.fg-emg.svelte-lyzie7.svelte-lyzie7{padding:10px 10px}.fg-emg-w.svelte-lyzie7.svelte-lyzie7{font-size:11px;font-weight:700;color:#f87171;margin-bottom:5px}.fg-emg-syms.svelte-lyzie7.svelte-lyzie7{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:8px}.fg-sym.svelte-lyzie7.svelte-lyzie7{background:rgba(61,10,10,0.8);color:#fca5a5;border-radius:3px;padding:2px 6px;font-size:9px}.fg-emg-hd.svelte-lyzie7.svelte-lyzie7{font-size:9px;color:var(--sl2);text-transform:uppercase;font-weight:700;margin-bottom:5px}.fg-emg-step.svelte-lyzie7.svelte-lyzie7{display:flex;gap:7px;align-items:flex-start;padding:3px 0;font-size:9px;color:var(--sl);border-bottom:1px solid rgba(10,18,38,0.8)}.fg-emg-step.svelte-lyzie7.svelte-lyzie7:last-child{border:none}.fg-emg-n.svelte-lyzie7.svelte-lyzie7{background:rgba(45,64,128,0.6);color:#e8edf8;border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;flex-shrink:0}.fg-emg-crit.svelte-lyzie7.svelte-lyzie7{color:#f87171 !important;font-weight:700}.fg-emg-crit.svelte-lyzie7 .fg-emg-n.svelte-lyzie7{background:#dc2626}.fg-sec.svelte-lyzie7.svelte-lyzie7{padding:8px 10px 3px;font-size:9px;color:var(--amb);text-transform:uppercase;font-weight:700}.fg-alog.svelte-lyzie7.svelte-lyzie7{margin:3px 10px;padding:6px 8px;background:rgba(10,18,40,0.7);border-radius:5px;border-left:3px solid}.fg-alog-t.svelte-lyzie7.svelte-lyzie7{font-size:10px;font-weight:700;color:#fff}.fg-alog-m.svelte-lyzie7.svelte-lyzie7{font-size:9px;color:var(--sl)}.fg-alog-tm.svelte-lyzie7.svelte-lyzie7{font-size:8px;color:var(--sl2)}.fg-rform.svelte-lyzie7.svelte-lyzie7{padding:7px 10px;display:grid;grid-template-columns:1fr 1fr;gap:5px}label.svelte-lyzie7.svelte-lyzie7{display:block;color:var(--sl);font-size:9px}label.svelte-lyzie7 input.svelte-lyzie7,label.svelte-lyzie7 select.svelte-lyzie7{display:block;width:100%;background:rgba(5,10,22,0.9);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:4px 7px;border-radius:4px;font-size:9px;margin-top:2px;box-sizing:border-box}label.svelte-lyzie7 input.svelte-lyzie7:focus,label.svelte-lyzie7 select.svelte-lyzie7:focus{outline:none;border-color:var(--amb)}.fg-btn.svelte-lyzie7.svelte-lyzie7{display:block;width:100%;padding:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:var(--amb);color:#0f1d42}.fg-btn-sec.svelte-lyzie7.svelte-lyzie7{background:rgba(10,18,40,0.8);color:var(--sl);border:1px solid rgba(45,64,128,0.4);border-radius:5px;width:calc(100% - 20px);margin:0 10px}.fg-btn-amb.svelte-lyzie7.svelte-lyzie7{display:block;text-align:center;text-decoration:none;background:var(--amb);color:#0f1d42 !important;padding:8px;border-radius:5px;font-size:10px;font-weight:800;margin-top:5px}.fg-rep.svelte-lyzie7.svelte-lyzie7{overflow:hidden;border-top:1px solid rgba(45,64,128,0.3)}.fg-rep-bar.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:6px;padding:5px 10px;background:rgba(10,18,40,0.8);font-size:9px;color:var(--sl2)}.fg-rep-bar.svelte-lyzie7 span.svelte-lyzie7{flex:1}.fg-rep-btn.svelte-lyzie7.svelte-lyzie7{background:rgba(45,64,128,0.5);border:none;color:var(--sl);padding:2px 8px;border-radius:3px;cursor:pointer;font-size:9px}.fg-rep-txt.svelte-lyzie7.svelte-lyzie7{padding:8px 10px;font-size:8px;color:var(--sl);white-space:pre;overflow:auto;max-height:220px;font-family:monospace;line-height:1.4}.fg-grp.svelte-lyzie7.svelte-lyzie7{padding:9px 10px;border-bottom:1px solid rgba(45,64,128,0.2)}.fg-grp-hd.svelte-lyzie7.svelte-lyzie7{font-size:9px;font-weight:700;color:var(--amb);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:7px}.fg-lic-act.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.fg-lic-b.svelte-lyzie7.svelte-lyzie7{background:rgba(5,46,22,0.8);color:#4ade80;border:1px solid #16a34a;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700}.fg-lic-i.svelte-lyzie7.svelte-lyzie7{font-size:10px;color:#86efac;flex:1}.fg-lic-d.svelte-lyzie7.svelte-lyzie7{background:rgba(10,18,40,0.8);border:1px solid rgba(45,64,128,0.5);color:var(--sl);padding:3px 8px;border-radius:4px;cursor:pointer;font-size:9px}.fg-lic-free.svelte-lyzie7.svelte-lyzie7{background:rgba(5,10,22,0.6);border-radius:5px;padding:9px;margin-bottom:7px}.fg-lic-ft.svelte-lyzie7.svelte-lyzie7{font-size:8px;font-weight:700;color:var(--sl2);text-transform:uppercase;margin-bottom:4px}.fg-lic-fl.svelte-lyzie7.svelte-lyzie7{font-size:9px;color:var(--sl2);line-height:1.7;margin-bottom:5px}.fg-lic-row.svelte-lyzie7.svelte-lyzie7{display:flex;gap:4px}.fg-lic-in.svelte-lyzie7.svelte-lyzie7{flex:1;background:rgba(5,10,22,0.9);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:4px 7px;border-radius:4px;font-size:9px;font-family:monospace}.fg-lic-in.svelte-lyzie7.svelte-lyzie7:disabled{opacity:0.5}.fg-lic-ab.svelte-lyzie7.svelte-lyzie7{background:var(--amb);border:none;color:#0f1d42;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:800;white-space:nowrap}.fg-lic-ab.svelte-lyzie7.svelte-lyzie7:disabled{background:rgba(45,64,128,0.4);color:var(--sl2);cursor:not-allowed}.fg-lic-err.svelte-lyzie7.svelte-lyzie7{margin-top:5px;font-size:9px;color:#f87171;padding:4px 7px;background:rgba(61,10,10,0.8);border-radius:4px}.fg-radio.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:6px;padding:4px 0;cursor:pointer;border-bottom:1px solid rgba(5,10,22,0.8);font-size:9px;color:#c8d4f0}.fg-radio.svelte-lyzie7.svelte-lyzie7:last-child{border-bottom:none}.fg-radio.svelte-lyzie7 span.svelte-lyzie7{flex:1}.fg-adjch.svelte-lyzie7.svelte-lyzie7{background:rgba(5,10,22,0.8);color:var(--sl);border-radius:2px;padding:1px 4px;font-size:8px}.fg-slbl.svelte-lyzie7.svelte-lyzie7{display:block;color:var(--sl);font-size:9px;margin-bottom:4px}.fg-srow.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:6px;margin-top:2px}.fg-srow.svelte-lyzie7 input[type=\"range\"].svelte-lyzie7{flex:1;accent-color:var(--amb)}.fg-srow.svelte-lyzie7 span.svelte-lyzie7{min-width:48px;text-align:right;color:var(--amb);font-size:9px;font-weight:700}.fg-tog.svelte-lyzie7.svelte-lyzie7{display:flex;align-items:center;gap:6px;padding:4px 0;cursor:pointer;font-size:9px;color:#c8d4f0;border-bottom:1px solid rgba(5,10,22,0.8)}.fg-tog.svelte-lyzie7.svelte-lyzie7:last-child{border-bottom:none}input[type=\"checkbox\"].svelte-lyzie7.svelte-lyzie7{accent-color:var(--amb)}.fg-gate.svelte-lyzie7.svelte-lyzie7{padding:16px 12px;text-align:center}.fg-gate-ic.svelte-lyzie7.svelte-lyzie7{font-size:28px;margin-bottom:6px}.fg-gate-ti.svelte-lyzie7.svelte-lyzie7{font-size:13px;font-weight:800;color:#fff;margin-bottom:6px}.fg-gate-btn.svelte-lyzie7.svelte-lyzie7{display:block;background:var(--amb);color:#0f1d42 !important;text-decoration:none;padding:8px 14px;border-radius:6px;font-size:11px;font-weight:800}.fg-spin.svelte-lyzie7.svelte-lyzie7{width:15px;height:15px;border:2px solid rgba(45,64,128,0.5);border-top-color:var(--amb);border-radius:50%;animation:svelte-lyzie7-spin 0.8s linear infinite;flex-shrink:0}@keyframes svelte-lyzie7-spin{to{transform:rotate(360deg)}}.fg-dis.svelte-lyzie7.svelte-lyzie7{opacity:0.4;pointer-events:none}.desktophide.svelte-lyzie7.svelte-lyzie7{display:none}");
}

function get_each_context_6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[95] = list[i][0];
	child_ctx[96] = list[i][1];
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[86] = list[i];
	return child_ctx;
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[89] = list[i];
	child_ctx[91] = i;
	return child_ctx;
}

function get_each_context_5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[92] = list[i];
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[77] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[80] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[83] = list[i];
	return child_ctx;
}

function get_each_context_7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[99] = list[i];
	return child_ctx;
}

// (26:6) {:else}
function create_else_block_6(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "☀ Day";
			attr(span, "class", "fg-dbadge svelte-lyzie7");
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

// (25:6) {#if isNight}
function create_if_block_26(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "🌙 Night";
			attr(span, "class", "fg-nbadge svelte-lyzie7");
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

// (66:4) {:else}
function create_else_block_5(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "⚡ Tap to load FieldGuard";
			attr(button, "class", "fg-pills-tap svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*refreshData*/ ctx[36]);
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

// (37:19) 
function create_if_block_24(ctx) {
	let button0;
	let span0;
	let t1;
	let span1;

	let t2_value = (/*heat*/ ctx[8].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[8].apparentTempFinal + '°') + "";

	let t2;
	let t3;
	let span2;
	let t4_value = /*heat*/ ctx[8].zoneInfo.riskLabel + "";
	let t4;
	let button0_class_value;
	let t5;
	let button1;
	let span3;
	let t7;
	let span5;
	let t8_value = /*rawData*/ ctx[7]?.windMs.toFixed(1) + "";
	let t8;
	let span4;
	let t10;
	let span6;
	let t11_value = /*windResult*/ ctx[9]?.riskLabel + "";
	let t11;
	let button1_class_value;
	let t12;
	let button2;
	let span7;
	let t14;
	let span9;
	let t15_value = /*rawData*/ ctx[7]?.rainMmH.toFixed(1) + "";
	let t15;
	let span8;
	let t17;
	let span10;
	let t18_value = /*rainResult*/ ctx[10]?.riskLabel + "";
	let t18;
	let button2_class_value;
	let t19;
	let button3;
	let span11;
	let t20_value = (/*isNight*/ ctx[16] ? '🌙' : '☀') + "";
	let t20;
	let t21;
	let span13;

	let t22_value = (/*isNight*/ ctx[16]
	? '--'
	: /*rawData*/ ctx[7]?.solarWm2) + "";

	let t22;
	let span12;
	let t23_value = (/*isNight*/ ctx[16] ? '' : 'W') + "";
	let t23;
	let t24;
	let span14;
	let t25;
	let button3_class_value;
	let t26;
	let t27;
	let button4;
	let mounted;
	let dispose;
	let if_block = /*heat*/ ctx[8].isBanPeriod && create_if_block_25();

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
			t25 = text(/*solarLabel*/ ctx[24]);
			t26 = space();
			if (if_block) if_block.c();
			t27 = space();
			button4 = element("button");
			button4.textContent = "↻";
			attr(span0, "class", "fg-pill-ic svelte-lyzie7");
			attr(span1, "class", "fg-pill-vl svelte-lyzie7");
			attr(span2, "class", "fg-pill-lb svelte-lyzie7");
			set_style(span2, "color", /*heat*/ ctx[8].zoneInfo.color);
			attr(button0, "class", button0_class_value = "fg-pill " + (/*activeCard*/ ctx[6] === 'heat' ? 'fg-pill-on' : '') + " svelte-lyzie7");
			set_style(button0, "--c", /*heat*/ ctx[8].zoneInfo.color);
			attr(span3, "class", "fg-pill-ic svelte-lyzie7");
			attr(span4, "class", "fg-pill-u svelte-lyzie7");
			attr(span5, "class", "fg-pill-vl svelte-lyzie7");
			attr(span6, "class", "fg-pill-lb svelte-lyzie7");
			set_style(span6, "color", /*windResult*/ ctx[9]?.riskColor);
			attr(button1, "class", button1_class_value = "fg-pill " + (/*activeCard*/ ctx[6] === 'wind' ? 'fg-pill-on' : '') + " svelte-lyzie7");
			set_style(button1, "--c", /*windResult*/ ctx[9]?.riskColor);
			attr(span7, "class", "fg-pill-ic svelte-lyzie7");
			attr(span8, "class", "fg-pill-u svelte-lyzie7");
			attr(span9, "class", "fg-pill-vl svelte-lyzie7");
			attr(span10, "class", "fg-pill-lb svelte-lyzie7");
			set_style(span10, "color", /*rainResult*/ ctx[10]?.riskColor);
			attr(button2, "class", button2_class_value = "fg-pill " + (/*activeCard*/ ctx[6] === 'rain' ? 'fg-pill-on' : '') + " svelte-lyzie7");
			set_style(button2, "--c", /*rainResult*/ ctx[10]?.riskColor);
			attr(span11, "class", "fg-pill-ic svelte-lyzie7");
			attr(span12, "class", "fg-pill-u svelte-lyzie7");
			attr(span13, "class", "fg-pill-vl svelte-lyzie7");
			attr(span14, "class", "fg-pill-lb svelte-lyzie7");
			set_style(span14, "color", /*solarColor*/ ctx[23]);
			attr(button3, "class", button3_class_value = "fg-pill " + (/*activeCard*/ ctx[6] === 'solar' ? 'fg-pill-on' : '') + " svelte-lyzie7");
			set_style(button3, "--c", /*solarColor*/ ctx[23]);
			attr(button4, "class", "fg-rfr svelte-lyzie7");
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
			if (if_block) if_block.m(target, anchor);
			insert(target, t27, anchor);
			insert(target, button4, anchor);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler*/ ctx[44]),
					listen(button1, "click", /*click_handler_1*/ ctx[45]),
					listen(button2, "click", /*click_handler_2*/ ctx[46]),
					listen(button3, "click", /*click_handler_3*/ ctx[47]),
					listen(button4, "click", /*refreshData*/ ctx[36])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 256 && t2_value !== (t2_value = (/*heat*/ ctx[8].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[8].apparentTempFinal + '°') + "")) set_data(t2, t2_value);

			if (dirty[0] & /*heat*/ 256 && t4_value !== (t4_value = /*heat*/ ctx[8].zoneInfo.riskLabel + "")) set_data(t4, t4_value);

			if (dirty[0] & /*heat*/ 256) {
				set_style(span2, "color", /*heat*/ ctx[8].zoneInfo.color);
			}

			if (dirty[0] & /*activeCard*/ 64 && button0_class_value !== (button0_class_value = "fg-pill " + (/*activeCard*/ ctx[6] === 'heat' ? 'fg-pill-on' : '') + " svelte-lyzie7")) {
				attr(button0, "class", button0_class_value);
			}

			if (dirty[0] & /*heat*/ 256) {
				set_style(button0, "--c", /*heat*/ ctx[8].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 128 && t8_value !== (t8_value = /*rawData*/ ctx[7]?.windMs.toFixed(1) + "")) set_data(t8, t8_value);
			if (dirty[0] & /*windResult*/ 512 && t11_value !== (t11_value = /*windResult*/ ctx[9]?.riskLabel + "")) set_data(t11, t11_value);

			if (dirty[0] & /*windResult*/ 512) {
				set_style(span6, "color", /*windResult*/ ctx[9]?.riskColor);
			}

			if (dirty[0] & /*activeCard*/ 64 && button1_class_value !== (button1_class_value = "fg-pill " + (/*activeCard*/ ctx[6] === 'wind' ? 'fg-pill-on' : '') + " svelte-lyzie7")) {
				attr(button1, "class", button1_class_value);
			}

			if (dirty[0] & /*windResult*/ 512) {
				set_style(button1, "--c", /*windResult*/ ctx[9]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 128 && t15_value !== (t15_value = /*rawData*/ ctx[7]?.rainMmH.toFixed(1) + "")) set_data(t15, t15_value);
			if (dirty[0] & /*rainResult*/ 1024 && t18_value !== (t18_value = /*rainResult*/ ctx[10]?.riskLabel + "")) set_data(t18, t18_value);

			if (dirty[0] & /*rainResult*/ 1024) {
				set_style(span10, "color", /*rainResult*/ ctx[10]?.riskColor);
			}

			if (dirty[0] & /*activeCard*/ 64 && button2_class_value !== (button2_class_value = "fg-pill " + (/*activeCard*/ ctx[6] === 'rain' ? 'fg-pill-on' : '') + " svelte-lyzie7")) {
				attr(button2, "class", button2_class_value);
			}

			if (dirty[0] & /*rainResult*/ 1024) {
				set_style(button2, "--c", /*rainResult*/ ctx[10]?.riskColor);
			}

			if (dirty[0] & /*isNight*/ 65536 && t20_value !== (t20_value = (/*isNight*/ ctx[16] ? '🌙' : '☀') + "")) set_data(t20, t20_value);

			if (dirty[0] & /*isNight, rawData*/ 65664 && t22_value !== (t22_value = (/*isNight*/ ctx[16]
			? '--'
			: /*rawData*/ ctx[7]?.solarWm2) + "")) set_data(t22, t22_value);

			if (dirty[0] & /*isNight*/ 65536 && t23_value !== (t23_value = (/*isNight*/ ctx[16] ? '' : 'W') + "")) set_data(t23, t23_value);
			if (dirty[0] & /*solarLabel*/ 16777216) set_data(t25, /*solarLabel*/ ctx[24]);

			if (dirty[0] & /*solarColor*/ 8388608) {
				set_style(span14, "color", /*solarColor*/ ctx[23]);
			}

			if (dirty[0] & /*activeCard*/ 64 && button3_class_value !== (button3_class_value = "fg-pill " + (/*activeCard*/ ctx[6] === 'solar' ? 'fg-pill-on' : '') + " svelte-lyzie7")) {
				attr(button3, "class", button3_class_value);
			}

			if (dirty[0] & /*solarColor*/ 8388608) {
				set_style(button3, "--c", /*solarColor*/ ctx[23]);
			}

			if (/*heat*/ ctx[8].isBanPeriod) {
				if (if_block) ; else {
					if_block = create_if_block_25();
					if_block.c();
					if_block.m(t27.parentNode, t27);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
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
				detach(t27);
				detach(button4);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (35:4) {#if loading}
function create_if_block_23(ctx) {
	let div1;

	return {
		c() {
			div1 = element("div");
			div1.innerHTML = `<div class="fg-spin svelte-lyzie7"></div><span>Loading…</span>`;
			attr(div1, "class", "fg-pills-load svelte-lyzie7");
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

// (62:6) {#if heat.isBanPeriod}
function create_if_block_25(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "🚫";
			attr(div, "class", "fg-pill-ban svelte-lyzie7");
			attr(div, "title", "Legal work ban active");
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

// (76:6) {#each TABS as t}
function create_each_block_7(ctx) {
	let button;
	let span0;
	let span1;
	let t2;
	let button_class_value;
	let mounted;
	let dispose;

	function click_handler_4() {
		return /*click_handler_4*/ ctx[48](/*t*/ ctx[99]);
	}

	return {
		c() {
			button = element("button");
			span0 = element("span");
			span0.textContent = `${/*t*/ ctx[99].icon}`;
			span1 = element("span");
			span1.textContent = `${/*t*/ ctx[99].label}`;
			t2 = space();
			attr(span0, "class", "svelte-lyzie7");
			attr(span1, "class", "svelte-lyzie7");
			attr(button, "class", button_class_value = "fg-tab " + (/*tab*/ ctx[0] === /*t*/ ctx[99].id ? 'fg-tab-on' : '') + " svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, span0);
			append(button, span1);
			append(button, t2);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_4);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*tab*/ 1 && button_class_value !== (button_class_value = "fg-tab " + (/*tab*/ ctx[0] === /*t*/ ctx[99].id ? 'fg-tab-on' : '') + " svelte-lyzie7")) {
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

// (228:33) 
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

	function select_block_type_8(ctx, dirty) {
		if (/*license*/ ctx[25].valid) return create_if_block_21;
		return create_else_block_4;
	}

	let current_block_type = select_block_type_8(ctx);
	let if_block0 = current_block_type(ctx);
	let each_value_6 = ensure_array_like(Object.entries(PPE_PROFILES));
	let each_blocks = [];

	for (let i = 0; i < each_value_6.length; i += 1) {
		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
	}

	let if_block1 = /*license*/ ctx[25].valid && create_if_block_20(ctx);
	let if_block2 = !/*license*/ ctx[25].valid && create_if_block_19();

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
			t9 = text("Browser notifications");
			t10 = space();
			label1 = element("label");
			input1 = element("input");
			t11 = text("Auto-refresh 15 min ");
			if (if_block2) if_block2.c();
			attr(div0, "class", "fg-grp-hd svelte-lyzie7");
			attr(div1, "class", "fg-grp svelte-lyzie7");
			attr(div2, "class", "fg-grp-hd svelte-lyzie7");
			attr(div3, "class", "fg-grp svelte-lyzie7");
			attr(div4, "class", "fg-grp-hd svelte-lyzie7");
			attr(input0, "type", "checkbox");
			attr(input0, "class", "svelte-lyzie7");
			attr(label0, "class", "fg-tog svelte-lyzie7");
			attr(input1, "type", "checkbox");
			input1.disabled = input1_disabled_value = !/*license*/ ctx[25].valid;
			attr(input1, "class", "svelte-lyzie7");
			attr(label1, "class", label1_class_value = "fg-tog " + (!/*license*/ ctx[25].valid ? 'fg-dis' : '') + " svelte-lyzie7");
			attr(div5, "class", "fg-grp svelte-lyzie7");
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
			input0.checked = /*settings*/ ctx[29].soundAlerts;
			append(label0, t9);
			append(div5, t10);
			append(div5, label1);
			append(label1, input1);
			input1.checked = /*settings*/ ctx[29].autoRefresh;
			append(label1, t11);
			if (if_block2) if_block2.m(label1, null);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_handler*/ ctx[64]),
					listen(input0, "change", /*saveSettings*/ ctx[37]),
					listen(input1, "change", /*input1_change_handler*/ ctx[65]),
					listen(input1, "change", /*setupAutoRefresh*/ ctx[39])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_8(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div1, null);
				}
			}

			if (dirty[0] & /*settings*/ 536870912 | dirty[1] & /*saveSettings*/ 64) {
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

			if (/*license*/ ctx[25].valid) {
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

			if (dirty[0] & /*settings*/ 536870912) {
				input0.checked = /*settings*/ ctx[29].soundAlerts;
			}

			if (dirty[0] & /*license*/ 33554432 && input1_disabled_value !== (input1_disabled_value = !/*license*/ ctx[25].valid)) {
				input1.disabled = input1_disabled_value;
			}

			if (dirty[0] & /*settings*/ 536870912) {
				input1.checked = /*settings*/ ctx[29].autoRefresh;
			}

			if (!/*license*/ ctx[25].valid) {
				if (if_block2) ; else {
					if_block2 = create_if_block_19();
					if_block2.c();
					if_block2.m(label1, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty[0] & /*license*/ 33554432 && label1_class_value !== (label1_class_value = "fg-tog " + (!/*license*/ ctx[25].valid ? 'fg-dis' : '') + " svelte-lyzie7")) {
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

// (207:31) 
function create_if_block_15(ctx) {
	let if_block_anchor;

	function select_block_type_7(ctx, dirty) {
		if (!/*license*/ ctx[25].valid) return create_if_block_16;
		return create_else_block_3;
	}

	let current_block_type = select_block_type_7(ctx);
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
			if (current_block_type === (current_block_type = select_block_type_7(ctx)) && if_block) {
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

// (181:28) 
function create_if_block_12(ctx) {
	let if_block_anchor;

	function select_block_type_6(ctx, dirty) {
		if (!/*license*/ ctx[25].valid) return create_if_block_13;
		return create_else_block_2;
	}

	let current_block_type = select_block_type_6(ctx);
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
			if (current_block_type === (current_block_type = select_block_type_6(ctx)) && if_block) {
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

// (83:4) {#if tab === 'dashboard'}
function create_if_block(ctx) {
	let if_block_anchor;

	function select_block_type_3(ctx, dirty) {
		if (/*loading*/ ctx[3]) return create_if_block_1;
		if (/*error*/ ctx[4]) return create_if_block_2;
		if (/*heat*/ ctx[8]) return create_if_block_3;
	}

	let current_block_type = select_block_type_3(ctx);
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
			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
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

// (233:8) {:else}
function create_else_block_4(ctx) {
	let div2;
	let t3;
	let div3;
	let input;
	let button;
	let t4_value = (/*licenseLoading*/ ctx[27] ? '…' : 'Activate') + "";
	let t4;
	let button_disabled_value;
	let t5;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*licenseError*/ ctx[28] && create_if_block_22(ctx);

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = `<div class="fg-lic-ft svelte-lyzie7">FREE TIER</div><div class="fg-lic-fl svelte-lyzie7">⚡ Worst-case · 📄 Reports · 🚨 SOS · 🎛 Thresholds</div><a class="fg-btn-amb svelte-lyzie7" href="https://fieldguard-hse.com" target="_blank">Get Pro — fieldguard-hse.com</a>`;
			t3 = space();
			div3 = element("div");
			input = element("input");
			button = element("button");
			t4 = text(t4_value);
			t5 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div2, "class", "fg-lic-free svelte-lyzie7");
			attr(input, "class", "fg-lic-in svelte-lyzie7");
			attr(input, "placeholder", "Paste license key…");
			input.disabled = /*licenseLoading*/ ctx[27];
			attr(button, "class", "fg-lic-ab svelte-lyzie7");
			button.disabled = button_disabled_value = /*licenseLoading*/ ctx[27] || !/*licenseKeyInput*/ ctx[26].trim();
			attr(div3, "class", "fg-lic-row svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			insert(target, t3, anchor);
			insert(target, div3, anchor);
			append(div3, input);
			set_input_value(input, /*licenseKeyInput*/ ctx[26]);
			append(div3, button);
			append(button, t4);
			insert(target, t5, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[57]),
					listen(button, "click", /*activateLicense*/ ctx[32])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseLoading*/ 134217728) {
				input.disabled = /*licenseLoading*/ ctx[27];
			}

			if (dirty[0] & /*licenseKeyInput*/ 67108864 && input.value !== /*licenseKeyInput*/ ctx[26]) {
				set_input_value(input, /*licenseKeyInput*/ ctx[26]);
			}

			if (dirty[0] & /*licenseLoading*/ 134217728 && t4_value !== (t4_value = (/*licenseLoading*/ ctx[27] ? '…' : 'Activate') + "")) set_data(t4, t4_value);

			if (dirty[0] & /*licenseLoading, licenseKeyInput*/ 201326592 && button_disabled_value !== (button_disabled_value = /*licenseLoading*/ ctx[27] || !/*licenseKeyInput*/ ctx[26].trim())) {
				button.disabled = button_disabled_value;
			}

			if (/*licenseError*/ ctx[28]) {
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
				detach(t3);
				detach(div3);
				detach(t5);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (231:8) {#if license.valid}
function create_if_block_21(ctx) {
	let div;
	let span0;
	let span1;
	let t1_value = /*license*/ ctx[25].tier?.toUpperCase() + "";
	let t1;
	let t2;
	let t3_value = /*license*/ ctx[25].expires?.slice(0, 10) + "";
	let t3;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			span0 = element("span");
			span0.textContent = "✓ PRO";
			span1 = element("span");
			t1 = text(t1_value);
			t2 = text(" · ");
			t3 = text(t3_value);
			button = element("button");
			button.textContent = "Deactivate";
			attr(span0, "class", "fg-lic-b svelte-lyzie7");
			attr(span1, "class", "fg-lic-i svelte-lyzie7");
			attr(button, "class", "fg-lic-d svelte-lyzie7");
			attr(div, "class", "fg-lic-act svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(div, span1);
			append(span1, t1);
			append(span1, t2);
			append(span1, t3);
			append(div, button);

			if (!mounted) {
				dispose = listen(button, "click", /*deactivateLicense*/ ctx[33]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*license*/ 33554432 && t1_value !== (t1_value = /*license*/ ctx[25].tier?.toUpperCase() + "")) set_data(t1, t1_value);
			if (dirty[0] & /*license*/ 33554432 && t3_value !== (t3_value = /*license*/ ctx[25].expires?.slice(0, 10) + "")) set_data(t3, t3_value);
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

// (236:10) {#if licenseError}
function create_if_block_22(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚠ ");
			t1 = text(/*licenseError*/ ctx[28]);
			attr(div, "class", "fg-lic-err svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseError*/ 268435456) set_data(t1, /*licenseError*/ ctx[28]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (241:8) {#each Object.entries(PPE_PROFILES) as [key, prof]}
function create_each_block_6(ctx) {
	let label;
	let input;
	let span0;
	let span1;
	let binding_group;
	let mounted;
	let dispose;
	binding_group = init_binding_group(/*$$binding_groups*/ ctx[59][0]);

	return {
		c() {
			label = element("label");
			input = element("input");
			span0 = element("span");
			span0.textContent = `${/*prof*/ ctx[96].label}`;
			span1 = element("span");
			span1.textContent = `+${/*prof*/ ctx[96].adjustment}°C`;
			attr(input, "type", "radio");
			input.__value = /*key*/ ctx[95];
			set_input_value(input, input.__value);
			attr(input, "class", "svelte-lyzie7");
			attr(span0, "class", "svelte-lyzie7");
			attr(span1, "class", "fg-adjch svelte-lyzie7");
			attr(label, "class", "fg-radio svelte-lyzie7");
			binding_group.p(input);
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			input.checked = input.__value === /*settings*/ ctx[29].ppeProfile;
			append(label, span0);
			append(label, span1);

			if (!mounted) {
				dispose = [
					listen(input, "change", /*input_change_handler_1*/ ctx[58]),
					listen(input, "change", /*saveSettings*/ ctx[37])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 536870912) {
				input.checked = input.__value === /*settings*/ ctx[29].ppeProfile;
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

// (245:6) {#if license.valid}
function create_if_block_20(ctx) {
	let div5;
	let div0;
	let t1;
	let label0;
	let t2;
	let div1;
	let input0;
	let span0;
	let t3_value = /*settings*/ ctx[29].wbgtWarnC + "";
	let t3;
	let t4;
	let t5;
	let label1;
	let t6;
	let div2;
	let input1;
	let span1;
	let t7_value = /*settings*/ ctx[29].wbgtDangerC + "";
	let t7;
	let t8;
	let t9;
	let label2;
	let t10;
	let div3;
	let input2;
	let span2;
	let t11_value = /*settings*/ ctx[29].windWarnMs + "";
	let t11;
	let t12;
	let t13;
	let label3;
	let t14;
	let div4;
	let input3;
	let span3;
	let t15_value = /*settings*/ ctx[29].rainWarnMmh + "";
	let t15;
	let t16;
	let t17;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div5 = element("div");
			div0 = element("div");
			div0.textContent = "🌡 Thresholds";
			t1 = space();
			label0 = element("label");
			t2 = text("WBGT Warn");
			div1 = element("div");
			input0 = element("input");
			span0 = element("span");
			t3 = text(t3_value);
			t4 = text("°C");
			t5 = space();
			label1 = element("label");
			t6 = text("WBGT Danger");
			div2 = element("div");
			input1 = element("input");
			span1 = element("span");
			t7 = text(t7_value);
			t8 = text("°C");
			t9 = space();
			label2 = element("label");
			t10 = text("Wind Warn");
			div3 = element("div");
			input2 = element("input");
			span2 = element("span");
			t11 = text(t11_value);
			t12 = text(" m/s");
			t13 = space();
			label3 = element("label");
			t14 = text("Rain Warn");
			div4 = element("div");
			input3 = element("input");
			span3 = element("span");
			t15 = text(t15_value);
			t16 = text(" mm/h");
			t17 = space();
			button = element("button");
			button.textContent = "↩ Reset Defaults";
			attr(div0, "class", "fg-grp-hd svelte-lyzie7");
			attr(input0, "type", "range");
			attr(input0, "min", "28");
			attr(input0, "max", "38");
			attr(input0, "step", "0.5");
			attr(input0, "class", "svelte-lyzie7");
			attr(span0, "class", "svelte-lyzie7");
			attr(div1, "class", "fg-srow svelte-lyzie7");
			attr(label0, "class", "fg-slbl svelte-lyzie7");
			attr(input1, "type", "range");
			attr(input1, "min", "30");
			attr(input1, "max", "42");
			attr(input1, "step", "0.5");
			attr(input1, "class", "svelte-lyzie7");
			attr(span1, "class", "svelte-lyzie7");
			attr(div2, "class", "fg-srow svelte-lyzie7");
			attr(label1, "class", "fg-slbl svelte-lyzie7");
			attr(input2, "type", "range");
			attr(input2, "min", "5");
			attr(input2, "max", "25");
			attr(input2, "step", "0.5");
			attr(input2, "class", "svelte-lyzie7");
			attr(span2, "class", "svelte-lyzie7");
			attr(div3, "class", "fg-srow svelte-lyzie7");
			attr(label2, "class", "fg-slbl svelte-lyzie7");
			attr(input3, "type", "range");
			attr(input3, "min", "1");
			attr(input3, "max", "25");
			attr(input3, "step", "0.5");
			attr(input3, "class", "svelte-lyzie7");
			attr(span3, "class", "svelte-lyzie7");
			attr(div4, "class", "fg-srow svelte-lyzie7");
			attr(label3, "class", "fg-slbl svelte-lyzie7");
			attr(button, "class", "fg-btn fg-btn-sec svelte-lyzie7");
			attr(div5, "class", "fg-grp svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div5, anchor);
			append(div5, div0);
			append(div5, t1);
			append(div5, label0);
			append(label0, t2);
			append(label0, div1);
			append(div1, input0);
			set_input_value(input0, /*settings*/ ctx[29].wbgtWarnC);
			append(div1, span0);
			append(span0, t3);
			append(span0, t4);
			append(div5, t5);
			append(div5, label1);
			append(label1, t6);
			append(label1, div2);
			append(div2, input1);
			set_input_value(input1, /*settings*/ ctx[29].wbgtDangerC);
			append(div2, span1);
			append(span1, t7);
			append(span1, t8);
			append(div5, t9);
			append(div5, label2);
			append(label2, t10);
			append(label2, div3);
			append(div3, input2);
			set_input_value(input2, /*settings*/ ctx[29].windWarnMs);
			append(div3, span2);
			append(span2, t11);
			append(span2, t12);
			append(div5, t13);
			append(div5, label3);
			append(label3, t14);
			append(label3, div4);
			append(div4, input3);
			set_input_value(input3, /*settings*/ ctx[29].rainWarnMmh);
			append(div4, span3);
			append(span3, t15);
			append(span3, t16);
			append(div5, t17);
			append(div5, button);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_input_handler*/ ctx[60]),
					listen(input0, "input", /*input0_change_input_handler*/ ctx[60]),
					listen(input0, "change", /*saveSettings*/ ctx[37]),
					listen(input1, "change", /*input1_change_input_handler*/ ctx[61]),
					listen(input1, "input", /*input1_change_input_handler*/ ctx[61]),
					listen(input1, "change", /*saveSettings*/ ctx[37]),
					listen(input2, "change", /*input2_change_input_handler*/ ctx[62]),
					listen(input2, "input", /*input2_change_input_handler*/ ctx[62]),
					listen(input2, "change", /*saveSettings*/ ctx[37]),
					listen(input3, "change", /*input3_change_input_handler*/ ctx[63]),
					listen(input3, "input", /*input3_change_input_handler*/ ctx[63]),
					listen(input3, "change", /*saveSettings*/ ctx[37]),
					listen(button, "click", /*resetSettings*/ ctx[38])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 536870912) {
				set_input_value(input0, /*settings*/ ctx[29].wbgtWarnC);
			}

			if (dirty[0] & /*settings*/ 536870912 && t3_value !== (t3_value = /*settings*/ ctx[29].wbgtWarnC + "")) set_data(t3, t3_value);

			if (dirty[0] & /*settings*/ 536870912) {
				set_input_value(input1, /*settings*/ ctx[29].wbgtDangerC);
			}

			if (dirty[0] & /*settings*/ 536870912 && t7_value !== (t7_value = /*settings*/ ctx[29].wbgtDangerC + "")) set_data(t7, t7_value);

			if (dirty[0] & /*settings*/ 536870912) {
				set_input_value(input2, /*settings*/ ctx[29].windWarnMs);
			}

			if (dirty[0] & /*settings*/ 536870912 && t11_value !== (t11_value = /*settings*/ ctx[29].windWarnMs + "")) set_data(t11, t11_value);

			if (dirty[0] & /*settings*/ 536870912) {
				set_input_value(input3, /*settings*/ ctx[29].rainWarnMmh);
			}

			if (dirty[0] & /*settings*/ 536870912 && t15_value !== (t15_value = /*settings*/ ctx[29].rainWarnMmh + "")) set_data(t15, t15_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div5);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (258:194) {#if !license.valid}
function create_if_block_19(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-proch svelte-lyzie7");
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

// (210:6) {:else}
function create_else_block_3(ctx) {
	let div;
	let label0;
	let t0;
	let input0;
	let t1;
	let label1;
	let t2;
	let input1;
	let t3;
	let label2;
	let t4;
	let input2;
	let t5;
	let label3;
	let t6;
	let input3;
	let t7;
	let label4;
	let t8;
	let input4;
	let t9;
	let label5;
	let t10;
	let select;
	let option0;
	let option1;
	let option2;
	let t14;
	let button;
	let t16;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*reportText*/ ctx[15] && create_if_block_17(ctx);

	return {
		c() {
			div = element("div");
			label0 = element("label");
			t0 = text("Project");
			input0 = element("input");
			t1 = space();
			label1 = element("label");
			t2 = text("Country");
			input1 = element("input");
			t3 = space();
			label2 = element("label");
			t4 = text("Client");
			input2 = element("input");
			t5 = space();
			label3 = element("label");
			t6 = text("Contractor");
			input3 = element("input");
			t7 = space();
			label4 = element("label");
			t8 = text("HSE Manager");
			input4 = element("input");
			t9 = space();
			label5 = element("label");
			t10 = text("FIDIC");
			select = element("select");
			option0 = element("option");
			option0.textContent = "ELIGIBLE";
			option1 = element("option");
			option1.textContent = "NOT ELIGIBLE";
			option2 = element("option");
			option2.textContent = "UNDER REVIEW";
			t14 = space();
			button = element("button");
			button.textContent = "📋 Generate ISO 7933 Report";
			t16 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(input0, "placeholder", "Project Name");
			attr(input0, "class", "svelte-lyzie7");
			attr(label0, "class", "svelte-lyzie7");
			attr(input1, "placeholder", "Oman, UAE…");
			attr(input1, "class", "svelte-lyzie7");
			attr(label1, "class", "svelte-lyzie7");
			attr(input2, "class", "svelte-lyzie7");
			attr(label2, "class", "svelte-lyzie7");
			attr(input3, "class", "svelte-lyzie7");
			attr(label3, "class", "svelte-lyzie7");
			attr(input4, "class", "svelte-lyzie7");
			attr(label4, "class", "svelte-lyzie7");
			option0.__value = "ELIGIBLE";
			set_input_value(option0, option0.__value);
			option1.__value = "NOT ELIGIBLE";
			set_input_value(option1, option1.__value);
			option2.__value = "UNDER REVIEW";
			set_input_value(option2, option2.__value);
			attr(select, "class", "svelte-lyzie7");
			if (/*reportMeta*/ ctx[30].fidic === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[56].call(select));
			attr(label5, "class", "svelte-lyzie7");
			attr(div, "class", "fg-rform svelte-lyzie7");
			attr(button, "class", "fg-btn svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, label0);
			append(label0, t0);
			append(label0, input0);
			set_input_value(input0, /*reportMeta*/ ctx[30].projectName);
			append(div, t1);
			append(div, label1);
			append(label1, t2);
			append(label1, input1);
			set_input_value(input1, /*reportMeta*/ ctx[30].country);
			append(div, t3);
			append(div, label2);
			append(label2, t4);
			append(label2, input2);
			set_input_value(input2, /*reportMeta*/ ctx[30].clientName);
			append(div, t5);
			append(div, label3);
			append(label3, t6);
			append(label3, input3);
			set_input_value(input3, /*reportMeta*/ ctx[30].contractorName);
			append(div, t7);
			append(div, label4);
			append(label4, t8);
			append(label4, input4);
			set_input_value(input4, /*reportMeta*/ ctx[30].hseManagerName);
			append(div, t9);
			append(div, label5);
			append(label5, t10);
			append(label5, select);
			append(select, option0);
			append(select, option1);
			append(select, option2);
			select_option(select, /*reportMeta*/ ctx[30].fidic, true);
			insert(target, t14, anchor);
			insert(target, button, anchor);
			insert(target, t16, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[51]),
					listen(input1, "input", /*input1_input_handler*/ ctx[52]),
					listen(input2, "input", /*input2_input_handler*/ ctx[53]),
					listen(input3, "input", /*input3_input_handler*/ ctx[54]),
					listen(input4, "input", /*input4_input_handler*/ ctx[55]),
					listen(select, "change", /*select_change_handler_1*/ ctx[56]),
					listen(button, "click", /*generateReport*/ ctx[40])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*reportMeta*/ 1073741824 && input0.value !== /*reportMeta*/ ctx[30].projectName) {
				set_input_value(input0, /*reportMeta*/ ctx[30].projectName);
			}

			if (dirty[0] & /*reportMeta*/ 1073741824 && input1.value !== /*reportMeta*/ ctx[30].country) {
				set_input_value(input1, /*reportMeta*/ ctx[30].country);
			}

			if (dirty[0] & /*reportMeta*/ 1073741824 && input2.value !== /*reportMeta*/ ctx[30].clientName) {
				set_input_value(input2, /*reportMeta*/ ctx[30].clientName);
			}

			if (dirty[0] & /*reportMeta*/ 1073741824 && input3.value !== /*reportMeta*/ ctx[30].contractorName) {
				set_input_value(input3, /*reportMeta*/ ctx[30].contractorName);
			}

			if (dirty[0] & /*reportMeta*/ 1073741824 && input4.value !== /*reportMeta*/ ctx[30].hseManagerName) {
				set_input_value(input4, /*reportMeta*/ ctx[30].hseManagerName);
			}

			if (dirty[0] & /*reportMeta*/ 1073741824) {
				select_option(select, /*reportMeta*/ ctx[30].fidic);
			}

			if (/*reportText*/ ctx[15]) {
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
				detach(div);
				detach(t14);
				detach(button);
				detach(t16);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (208:6) {#if !license.valid}
function create_if_block_16(ctx) {
	let div2;

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = `<div class="fg-gate-ic svelte-lyzie7">📄</div><div class="fg-gate-ti svelte-lyzie7">Reports — Pro Feature</div><a class="fg-gate-btn svelte-lyzie7" href="https://fieldguard-hse.com" target="_blank">Upgrade</a>`;
			attr(div2, "class", "fg-gate svelte-lyzie7");
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

// (220:8) {#if reportText}
function create_if_block_17(ctx) {
	let div1;
	let div0;
	let span;
	let button0;
	let button1;
	let t3;
	let pre;
	let t4;
	let mounted;
	let dispose;

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			span = element("span");
			span.textContent = "Report ready";
			button0 = element("button");
			button0.textContent = "Copy";
			button1 = element("button");
			button1.textContent = ".txt";
			t3 = space();
			pre = element("pre");
			t4 = text(/*reportText*/ ctx[15]);
			attr(span, "class", "svelte-lyzie7");
			attr(button0, "class", "fg-rep-btn svelte-lyzie7");
			attr(button1, "class", "fg-rep-btn svelte-lyzie7");
			attr(div0, "class", "fg-rep-bar svelte-lyzie7");
			attr(pre, "class", "fg-rep-txt svelte-lyzie7");
			attr(div1, "class", "fg-rep svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, span);
			append(div0, button0);
			append(div0, button1);
			append(div1, t3);
			append(div1, pre);
			append(pre, t4);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*copyReport*/ ctx[41]),
					listen(button1, "click", /*downloadReport*/ ctx[42])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*reportText*/ 32768) set_data(t4, /*reportText*/ ctx[15]);
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

// (184:6) {:else}
function create_else_block_2(ctx) {
	let div3;
	let div0;
	let t1;
	let div1;
	let t2;
	let div2;
	let t4;
	let t5;
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

	let if_block = /*alertLog*/ ctx[14].length > 0 && create_if_block_14(ctx);

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			div0.textContent = "⚠ Heat Stress Is Life-Threatening";
			t1 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t2 = space();
			div2 = element("div");
			div2.textContent = "🚑 Response Steps";
			t4 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div0, "class", "fg-emg-w svelte-lyzie7");
			attr(div1, "class", "fg-emg-syms svelte-lyzie7");
			attr(div2, "class", "fg-emg-hd svelte-lyzie7");
			attr(div3, "class", "fg-emg svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div3, t1);
			append(div3, div1);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div1, null);
				}
			}

			append(div3, t2);
			append(div3, div2);
			append(div3, t4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div3, null);
				}
			}

			insert(target, t5, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (/*alertLog*/ ctx[14].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_14(ctx);
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
				detach(div3);
				detach(t5);
				detach(if_block_anchor);
			}

			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			if (if_block) if_block.d(detaching);
		}
	};
}

// (182:6) {#if !license.valid}
function create_if_block_13(ctx) {
	let div2;

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = `<div class="fg-gate-ic svelte-lyzie7">🚨</div><div class="fg-gate-ti svelte-lyzie7">SOS — Pro Feature</div><a class="fg-gate-btn svelte-lyzie7" href="https://fieldguard-hse.com" target="_blank">Upgrade</a>`;
			attr(div2, "class", "fg-gate svelte-lyzie7");
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

// (187:35) {#each HEAT_STRESS_SYMPTOMS as s}
function create_each_block_5(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = `${/*s*/ ctx[92]}`;
			attr(span, "class", "fg-sym svelte-lyzie7");
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

// (189:10) {#each EMERGENCY_RESPONSE as step, i}
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
			span.textContent = `${/*i*/ ctx[91] + 1}`;
			t1 = space();
			t2 = text(/*step*/ ctx[89]);
			t3 = space();
			attr(span, "class", "fg-emg-n svelte-lyzie7");
			attr(div, "class", "fg-emg-step " + (/*step*/ ctx[89].includes('SEVERE') ? 'fg-emg-crit' : '') + " svelte-lyzie7");
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

// (195:8) {#if alertLog.length > 0}
function create_if_block_14(ctx) {
	let div;
	let t1;
	let each_1_anchor;
	let each_value_3 = ensure_array_like([.../*alertLog*/ ctx[14]].reverse().slice(0, 15));
	let each_blocks = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	return {
		c() {
			div = element("div");
			div.textContent = "📋 Alert Log";
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
			attr(div, "class", "fg-sec svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			insert(target, t1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*alertLog*/ 16384) {
				each_value_3 = ensure_array_like([.../*alertLog*/ ctx[14]].reverse().slice(0, 15));
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
				detach(div);
				detach(t1);
				detach(each_1_anchor);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (197:10) {#each [...alertLog].reverse().slice(0,15) as a}
function create_each_block_3(ctx) {
	let div3;
	let div0;
	let t0_value = /*a*/ ctx[86].type + "";
	let t0;
	let t1;
	let div1;
	let t2_value = /*a*/ ctx[86].message + "";
	let t2;
	let t3;
	let div2;
	let t4_value = /*a*/ ctx[86].time + "";
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
			attr(div0, "class", "fg-alog-t svelte-lyzie7");
			attr(div1, "class", "fg-alog-m svelte-lyzie7");
			attr(div2, "class", "fg-alog-tm svelte-lyzie7");
			attr(div3, "class", "fg-alog svelte-lyzie7");
			set_style(div3, "border-left-color", /*a*/ ctx[86].color);
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
			if (dirty[0] & /*alertLog*/ 16384 && t0_value !== (t0_value = /*a*/ ctx[86].type + "")) set_data(t0, t0_value);
			if (dirty[0] & /*alertLog*/ 16384 && t2_value !== (t2_value = /*a*/ ctx[86].message + "")) set_data(t2, t2_value);
			if (dirty[0] & /*alertLog*/ 16384 && t4_value !== (t4_value = /*a*/ ctx[86].time + "")) set_data(t4, t4_value);

			if (dirty[0] & /*alertLog*/ 16384) {
				set_style(div3, "border-left-color", /*a*/ ctx[86].color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (88:21) 
function create_if_block_3(ctx) {
	let t0;
	let t1;
	let div;
	let select;
	let t2;
	let label;
	let input;
	let input_disabled_value;
	let t3;
	let label_class_value;
	let t4;
	let if_block3_anchor;
	let mounted;
	let dispose;
	let if_block0 = /*heat*/ ctx[8].isBanPeriod && create_if_block_11();

	function select_block_type_4(ctx, dirty) {
		if (/*activeCard*/ ctx[6] === 'heat') return create_if_block_6;
		if (/*activeCard*/ ctx[6] === 'wind') return create_if_block_7;
		if (/*activeCard*/ ctx[6] === 'rain') return create_if_block_8;
		if (/*activeCard*/ ctx[6] === 'solar') return create_if_block_9;
		return create_else_block_1;
	}

	let current_block_type = select_block_type_4(ctx);
	let if_block1 = current_block_type(ctx);
	let each_value_1 = ensure_array_like(/*MODELS*/ ctx[35]);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let if_block2 = !/*license*/ ctx[25].valid && create_if_block_5();
	let if_block3 = /*worstCaseMode*/ ctx[13] && /*modelResults*/ ctx[11].length > 1 && create_if_block_4(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			if_block1.c();
			t1 = space();
			div = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			label = element("label");
			input = element("input");
			t3 = text("\n            Worst-case ⚡\n            ");
			if (if_block2) if_block2.c();
			t4 = space();
			if (if_block3) if_block3.c();
			if_block3_anchor = empty();
			attr(select, "class", "fg-mr-sel svelte-lyzie7");
			if (/*selectedModel*/ ctx[12] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[49].call(select));
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = !/*license*/ ctx[25].valid;
			attr(input, "class", "svelte-lyzie7");
			attr(label, "class", label_class_value = "fg-mr-wc " + (!/*license*/ ctx[25].valid ? 'fg-dis' : '') + " svelte-lyzie7");
			attr(div, "class", "fg-mr svelte-lyzie7");
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			if_block1.m(target, anchor);
			insert(target, t1, anchor);
			insert(target, div, anchor);
			append(div, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			select_option(select, /*selectedModel*/ ctx[12], true);
			append(div, t2);
			append(div, label);
			append(label, input);
			input.checked = /*worstCaseMode*/ ctx[13];
			append(label, t3);
			if (if_block2) if_block2.m(label, null);
			insert(target, t4, anchor);
			if (if_block3) if_block3.m(target, anchor);
			insert(target, if_block3_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(select, "change", /*select_change_handler*/ ctx[49]),
					listen(select, "change", /*refreshData*/ ctx[36]),
					listen(input, "change", /*input_change_handler*/ ctx[50]),
					listen(input, "change", /*refreshData*/ ctx[36])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*heat*/ ctx[8].isBanPeriod) {
				if (if_block0) ; else {
					if_block0 = create_if_block_11();
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(t1.parentNode, t1);
				}
			}

			if (dirty[1] & /*MODELS*/ 16) {
				each_value_1 = ensure_array_like(/*MODELS*/ ctx[35]);
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

			if (dirty[0] & /*selectedModel*/ 4096 | dirty[1] & /*MODELS*/ 16) {
				select_option(select, /*selectedModel*/ ctx[12]);
			}

			if (dirty[0] & /*license*/ 33554432 && input_disabled_value !== (input_disabled_value = !/*license*/ ctx[25].valid)) {
				input.disabled = input_disabled_value;
			}

			if (dirty[0] & /*worstCaseMode*/ 8192) {
				input.checked = /*worstCaseMode*/ ctx[13];
			}

			if (!/*license*/ ctx[25].valid) {
				if (if_block2) ; else {
					if_block2 = create_if_block_5();
					if_block2.c();
					if_block2.m(label, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty[0] & /*license*/ 33554432 && label_class_value !== (label_class_value = "fg-mr-wc " + (!/*license*/ ctx[25].valid ? 'fg-dis' : '') + " svelte-lyzie7")) {
				attr(label, "class", label_class_value);
			}

			if (/*worstCaseMode*/ ctx[13] && /*modelResults*/ ctx[11].length > 1) {
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
				detach(t1);
				detach(div);
				detach(t4);
				detach(if_block3_anchor);
			}

			if (if_block0) if_block0.d(detaching);
			if_block1.d(detaching);
			destroy_each(each_blocks, detaching);
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (86:22) 
function create_if_block_2(ctx) {
	let div;
	let t_1;

	return {
		c() {
			div = element("div");
			t_1 = text(/*error*/ ctx[4]);
			attr(div, "class", "fg-err svelte-lyzie7");
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

// (84:6) {#if loading}
function create_if_block_1(ctx) {
	let div1;
	let div0;
	let t0;

	let t1_value = (/*worstCaseMode*/ ctx[13]
	? 'all models'
	: /*selectedModel*/ ctx[12]) + "";

	let t1;
	let t2;

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text(" Loading ");
			t1 = text(t1_value);
			t2 = text("…");
			attr(div0, "class", "fg-spin svelte-lyzie7");
			attr(div1, "class", "fg-load svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div1, t0);
			append(div1, t1);
			append(div1, t2);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*worstCaseMode, selectedModel*/ 12288 && t1_value !== (t1_value = (/*worstCaseMode*/ ctx[13]
			? 'all models'
			: /*selectedModel*/ ctx[12]) + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}
		}
	};
}

// (89:8) {#if heat.isBanPeriod}
function create_if_block_11(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "🚫 LEGAL WORK BAN · 12:30–15:30";
			attr(div, "class", "fg-ban svelte-lyzie7");
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

// (151:8) {:else}
function create_else_block_1(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "↑ Select a card above";
			attr(div, "class", "fg-det-hint svelte-lyzie7");
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

// (132:41) 
function create_if_block_9(ctx) {
	let div1;
	let div0;

	let t0_value = (/*isNight*/ ctx[16]
	? '🌙 Night — No Solar'
	: '☀ Solar — ' + /*solarLabel*/ ctx[24]) + "";

	let t0;
	let t1;

	function select_block_type_5(ctx, dirty) {
		if (/*isNight*/ ctx[16]) return create_if_block_10;
		return create_else_block;
	}

	let current_block_type = select_block_type_5(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			if_block.c();
			attr(div0, "class", "fg-det-ti svelte-lyzie7");
			set_style(div0, "color", /*solarColor*/ ctx[23]);
			attr(div1, "class", "fg-det svelte-lyzie7");
			set_style(div1, "border-color", /*solarColor*/ ctx[23]);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div1, t1);
			if_block.m(div1, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*isNight, solarLabel*/ 16842752 && t0_value !== (t0_value = (/*isNight*/ ctx[16]
			? '🌙 Night — No Solar'
			: '☀ Solar — ' + /*solarLabel*/ ctx[24]) + "")) set_data(t0, t0_value);

			if (dirty[0] & /*solarColor*/ 8388608) {
				set_style(div0, "color", /*solarColor*/ ctx[23]);
			}

			if (current_block_type === (current_block_type = select_block_type_5(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (dirty[0] & /*solarColor*/ 8388608) {
				set_style(div1, "border-color", /*solarColor*/ ctx[23]);
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

// (123:40) 
function create_if_block_8(ctx) {
	let div5;
	let div0;
	let t0;
	let t1_value = /*rainResult*/ ctx[10]?.riskLabel + "";
	let t1;
	let t2;
	let div3;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[7]?.rainMmH.toFixed(1) + "";
	let t3;
	let span1;
	let t5;
	let div2;
	let span2;
	let t6_value = /*rainResult*/ ctx[10]?.intensityLabel + "";
	let t6;
	let span3;
	let t8;
	let div4;
	let t9;
	let t10_value = /*settings*/ ctx[29].rainWarnMmh + "";
	let t10;
	let t11;
	let t12_value = /*settings*/ ctx[29].rainDangerMmh + "";
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
			attr(div0, "class", "fg-det-ti svelte-lyzie7");
			set_style(div0, "color", /*rainResult*/ ctx[10]?.riskColor);
			attr(span0, "class", "fg-dv svelte-lyzie7");
			attr(span1, "class", "fg-dl svelte-lyzie7");
			attr(div1, "class", "fg-dc svelte-lyzie7");
			attr(span2, "class", "fg-dv svelte-lyzie7");
			attr(span3, "class", "fg-dl svelte-lyzie7");
			attr(div2, "class", "fg-dc svelte-lyzie7");
			attr(div3, "class", "fg-det-g svelte-lyzie7");
			attr(div4, "class", "fg-dthr svelte-lyzie7");
			attr(div5, "class", "fg-det svelte-lyzie7");
			set_style(div5, "border-color", /*rainResult*/ ctx[10]?.riskColor);
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
			if (dirty[0] & /*rainResult*/ 1024 && t1_value !== (t1_value = /*rainResult*/ ctx[10]?.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*rainResult*/ 1024) {
				set_style(div0, "color", /*rainResult*/ ctx[10]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 128 && t3_value !== (t3_value = /*rawData*/ ctx[7]?.rainMmH.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rainResult*/ 1024 && t6_value !== (t6_value = /*rainResult*/ ctx[10]?.intensityLabel + "")) set_data(t6, t6_value);
			if (dirty[0] & /*settings*/ 536870912 && t10_value !== (t10_value = /*settings*/ ctx[29].rainWarnMmh + "")) set_data(t10, t10_value);
			if (dirty[0] & /*settings*/ 536870912 && t12_value !== (t12_value = /*settings*/ ctx[29].rainDangerMmh + "")) set_data(t12, t12_value);

			if (dirty[0] & /*rainResult*/ 1024) {
				set_style(div5, "border-color", /*rainResult*/ ctx[10]?.riskColor);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div5);
			}
		}
	};
}

// (113:40) 
function create_if_block_7(ctx) {
	let div6;
	let div0;
	let t0;
	let t1_value = /*windResult*/ ctx[9]?.riskLabel + "";
	let t1;
	let t2;
	let div4;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[7]?.windMs.toFixed(1) + "";
	let t3;
	let span1;
	let t5;
	let div2;
	let span2;
	let t6_value = ((/*rawData*/ ctx[7]?.windMs ?? 0) * 3.6).toFixed(1) + "";
	let t6;
	let span3;
	let t8;
	let div3;
	let span4;
	let t9;
	let t10_value = /*windResult*/ ctx[9]?.beaufort + "";
	let t10;
	let span5;
	let t11_value = /*windResult*/ ctx[9]?.beaufortDesc + "";
	let t11;
	let t12;
	let div5;
	let t13;
	let t14_value = /*settings*/ ctx[29].windWarnMs + "";
	let t14;
	let t15;
	let t16_value = /*settings*/ ctx[29].windDangerMs + "";
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
			attr(div0, "class", "fg-det-ti svelte-lyzie7");
			set_style(div0, "color", /*windResult*/ ctx[9]?.riskColor);
			attr(span0, "class", "fg-dv svelte-lyzie7");
			attr(span1, "class", "fg-dl svelte-lyzie7");
			attr(div1, "class", "fg-dc svelte-lyzie7");
			attr(span2, "class", "fg-dv svelte-lyzie7");
			attr(span3, "class", "fg-dl svelte-lyzie7");
			attr(div2, "class", "fg-dc svelte-lyzie7");
			attr(span4, "class", "fg-dv svelte-lyzie7");
			attr(span5, "class", "fg-dl svelte-lyzie7");
			attr(div3, "class", "fg-dc svelte-lyzie7");
			attr(div4, "class", "fg-det-g svelte-lyzie7");
			attr(div5, "class", "fg-dthr svelte-lyzie7");
			attr(div6, "class", "fg-det svelte-lyzie7");
			set_style(div6, "border-color", /*windResult*/ ctx[9]?.riskColor);
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
			if (dirty[0] & /*windResult*/ 512 && t1_value !== (t1_value = /*windResult*/ ctx[9]?.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*windResult*/ 512) {
				set_style(div0, "color", /*windResult*/ ctx[9]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 128 && t3_value !== (t3_value = /*rawData*/ ctx[7]?.windMs.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rawData*/ 128 && t6_value !== (t6_value = ((/*rawData*/ ctx[7]?.windMs ?? 0) * 3.6).toFixed(1) + "")) set_data(t6, t6_value);
			if (dirty[0] & /*windResult*/ 512 && t10_value !== (t10_value = /*windResult*/ ctx[9]?.beaufort + "")) set_data(t10, t10_value);
			if (dirty[0] & /*windResult*/ 512 && t11_value !== (t11_value = /*windResult*/ ctx[9]?.beaufortDesc + "")) set_data(t11, t11_value);
			if (dirty[0] & /*settings*/ 536870912 && t14_value !== (t14_value = /*settings*/ ctx[29].windWarnMs + "")) set_data(t14, t14_value);
			if (dirty[0] & /*settings*/ 536870912 && t16_value !== (t16_value = /*settings*/ ctx[29].windDangerMs + "")) set_data(t16, t16_value);

			if (dirty[0] & /*windResult*/ 512) {
				set_style(div6, "border-color", /*windResult*/ ctx[9]?.riskColor);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div6);
			}
		}
	};
}

// (92:8) {#if activeCard === 'heat'}
function create_if_block_6(ctx) {
	let div15;
	let div0;
	let t0;
	let t1_value = /*heat*/ ctx[8].zoneInfo.riskLabel + "";
	let t1;
	let t2;
	let div7;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[7]?.tempC + "";
	let t3;
	let t4;
	let span1;
	let t6;
	let div2;
	let span2;
	let t7_value = /*rawData*/ ctx[7]?.humidity + "";
	let t7;
	let t8;
	let span3;
	let t10;
	let div3;
	let span4;
	let t11_value = /*heat*/ ctx[8].apparentTemp1 + "";
	let t11;
	let t12;
	let span5;
	let t14;
	let div4;
	let span6;

	let t15_value = (/*heat*/ ctx[8].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[8].apparentTempFinal + '°C') + "";

	let t15;
	let span7;
	let t17;
	let div5;
	let span8;
	let t18_value = /*heat*/ ctx[8].wbgtBase + "";
	let t18;
	let t19;
	let span9;
	let t21;
	let div6;
	let span10;
	let t22_value = /*heat*/ ctx[8].wbgtAdjusted + "";
	let t22;
	let t23;
	let span11;
	let t25;
	let div12;
	let div8;
	let span12;
	let span13;
	let t27_value = /*heat*/ ctx[8].workRestSchedule.light + "";
	let t27;
	let t28;
	let div9;
	let span14;
	let span15;
	let t30_value = /*heat*/ ctx[8].workRestSchedule.heavy + "";
	let t30;
	let t31;
	let div10;
	let span16;
	let span17;
	let t33_value = /*heat*/ ctx[8].hydration + "";
	let t33;
	let t34;
	let div11;
	let span18;
	let span19;
	let t36_value = /*heat*/ ctx[8].zoneInfo.monitoringSchedule + "";
	let t36;
	let t37;
	let div13;
	let t39;
	let t40;
	let div14;
	let t41;
	let t42_value = PPE_PROFILES[/*settings*/ ctx[29].ppeProfile].label + "";
	let t42;
	let t43;
	let t44_value = PPE_PROFILES[/*settings*/ ctx[29].ppeProfile].adjustment + "";
	let t44;
	let t45;
	let each_value_2 = ensure_array_like(/*heat*/ ctx[8].zoneInfo.mandatoryControls);
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
			attr(div0, "class", "fg-det-ti svelte-lyzie7");
			set_style(div0, "color", /*heat*/ ctx[8].zoneInfo.color);
			attr(span0, "class", "fg-dv svelte-lyzie7");
			attr(span1, "class", "fg-dl svelte-lyzie7");
			attr(div1, "class", "fg-dc svelte-lyzie7");
			attr(span2, "class", "fg-dv svelte-lyzie7");
			attr(span3, "class", "fg-dl svelte-lyzie7");
			attr(div2, "class", "fg-dc svelte-lyzie7");
			attr(span4, "class", "fg-dv svelte-lyzie7");
			attr(span5, "class", "fg-dl svelte-lyzie7");
			attr(div3, "class", "fg-dc svelte-lyzie7");
			attr(span6, "class", "fg-dv svelte-lyzie7");
			set_style(span6, "color", /*heat*/ ctx[8].zoneInfo.color);
			attr(span7, "class", "fg-dl svelte-lyzie7");
			attr(div4, "class", "fg-dc svelte-lyzie7");
			attr(span8, "class", "fg-dv svelte-lyzie7");
			attr(span9, "class", "fg-dl svelte-lyzie7");
			attr(div5, "class", "fg-dc svelte-lyzie7");
			attr(span10, "class", "fg-dv svelte-lyzie7");
			attr(span11, "class", "fg-dl svelte-lyzie7");
			attr(div6, "class", "fg-dc svelte-lyzie7");
			attr(div7, "class", "fg-det-g svelte-lyzie7");
			attr(span12, "class", "fg-drl svelte-lyzie7");
			attr(span13, "class", "fg-drv svelte-lyzie7");
			attr(div8, "class", "fg-dr svelte-lyzie7");
			attr(span14, "class", "fg-drl svelte-lyzie7");
			attr(span15, "class", "fg-drv svelte-lyzie7");
			attr(div9, "class", "fg-dr svelte-lyzie7");
			attr(span16, "class", "fg-drl svelte-lyzie7");
			attr(span17, "class", "fg-drv svelte-lyzie7");
			attr(div10, "class", "fg-dr svelte-lyzie7");
			attr(span18, "class", "fg-drl svelte-lyzie7");
			attr(span19, "class", "fg-drv svelte-lyzie7");
			set_style(span19, "font-size", "8px");
			attr(div11, "class", "fg-dr svelte-lyzie7");
			attr(div12, "class", "fg-ds svelte-lyzie7");
			attr(div13, "class", "fg-dct svelte-lyzie7");
			attr(div14, "class", "fg-dppe svelte-lyzie7");
			attr(div15, "class", "fg-det svelte-lyzie7");
			set_style(div15, "border-color", /*heat*/ ctx[8].zoneInfo.color);
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
			if (dirty[0] & /*heat*/ 256 && t1_value !== (t1_value = /*heat*/ ctx[8].zoneInfo.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*heat*/ 256) {
				set_style(div0, "color", /*heat*/ ctx[8].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 128 && t3_value !== (t3_value = /*rawData*/ ctx[7]?.tempC + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rawData*/ 128 && t7_value !== (t7_value = /*rawData*/ ctx[7]?.humidity + "")) set_data(t7, t7_value);
			if (dirty[0] & /*heat*/ 256 && t11_value !== (t11_value = /*heat*/ ctx[8].apparentTemp1 + "")) set_data(t11, t11_value);

			if (dirty[0] & /*heat*/ 256 && t15_value !== (t15_value = (/*heat*/ ctx[8].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[8].apparentTempFinal + '°C') + "")) set_data(t15, t15_value);

			if (dirty[0] & /*heat*/ 256) {
				set_style(span6, "color", /*heat*/ ctx[8].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 256 && t18_value !== (t18_value = /*heat*/ ctx[8].wbgtBase + "")) set_data(t18, t18_value);
			if (dirty[0] & /*heat*/ 256 && t22_value !== (t22_value = /*heat*/ ctx[8].wbgtAdjusted + "")) set_data(t22, t22_value);
			if (dirty[0] & /*heat*/ 256 && t27_value !== (t27_value = /*heat*/ ctx[8].workRestSchedule.light + "")) set_data(t27, t27_value);
			if (dirty[0] & /*heat*/ 256 && t30_value !== (t30_value = /*heat*/ ctx[8].workRestSchedule.heavy + "")) set_data(t30, t30_value);
			if (dirty[0] & /*heat*/ 256 && t33_value !== (t33_value = /*heat*/ ctx[8].hydration + "")) set_data(t33, t33_value);
			if (dirty[0] & /*heat*/ 256 && t36_value !== (t36_value = /*heat*/ ctx[8].zoneInfo.monitoringSchedule + "")) set_data(t36, t36_value);

			if (dirty[0] & /*heat*/ 256) {
				each_value_2 = ensure_array_like(/*heat*/ ctx[8].zoneInfo.mandatoryControls);
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

			if (dirty[0] & /*settings*/ 536870912 && t42_value !== (t42_value = PPE_PROFILES[/*settings*/ ctx[29].ppeProfile].label + "")) set_data(t42, t42_value);
			if (dirty[0] & /*settings*/ 536870912 && t44_value !== (t44_value = PPE_PROFILES[/*settings*/ ctx[29].ppeProfile].adjustment + "")) set_data(t44, t44_value);

			if (dirty[0] & /*heat*/ 256) {
				set_style(div15, "border-color", /*heat*/ ctx[8].zoneInfo.color);
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

// (137:12) {:else}
function create_else_block(ctx) {
	let div3;
	let div0;
	let span0;
	let t0_value = /*rawData*/ ctx[7]?.solarWm2 + "";
	let t0;
	let t1;
	let span1;
	let t3;
	let div1;
	let span2;
	let t4;
	let t5;
	let span3;
	let t7;
	let div2;
	let span4;
	let t8;
	let t9;
	let span5;
	let t11;
	let div8;
	let div4;
	let span6;
	let span7;
	let t13;
	let t14;
	let div5;
	let span8;
	let span9;
	let t16;
	let t17;
	let div6;
	let span10;
	let span11;
	let t19;
	let t20;
	let div7;
	let span12;
	let span13;
	let t22;
	let t23;
	let t24;

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = text(" W/m²");
			span1 = element("span");
			span1.textContent = "Irradiance";
			t3 = space();
			div1 = element("div");
			span2 = element("span");
			t4 = text("UV ~");
			t5 = text(/*uvIndex*/ ctx[18]);
			span3 = element("span");
			span3.textContent = "Index";
			t7 = space();
			div2 = element("div");
			span4 = element("span");
			t8 = text(/*solarElevDeg*/ ctx[17]);
			t9 = text("°");
			span5 = element("span");
			span5.textContent = "Sun angle";
			t11 = space();
			div8 = element("div");
			div4 = element("div");
			span6 = element("span");
			span6.textContent = "Sunrise";
			span7 = element("span");
			t13 = text(/*sunriseTime*/ ctx[19]);
			t14 = space();
			div5 = element("div");
			span8 = element("span");
			span8.textContent = "Solar noon";
			span9 = element("span");
			t16 = text(/*solarNoonTime*/ ctx[21]);
			t17 = space();
			div6 = element("div");
			span10 = element("span");
			span10.textContent = "Sunset";
			span11 = element("span");
			t19 = text(/*sunsetTime*/ ctx[20]);
			t20 = space();
			div7 = element("div");
			span12 = element("span");
			span12.textContent = "WBGT solar +";
			span13 = element("span");
			t22 = text("+");
			t23 = text(/*wbgtSolarContrib*/ ctx[22]);
			t24 = text("°C");
			attr(span0, "class", "fg-dv svelte-lyzie7");
			attr(span1, "class", "fg-dl svelte-lyzie7");
			attr(div0, "class", "fg-dc svelte-lyzie7");
			attr(span2, "class", "fg-dv svelte-lyzie7");
			attr(span3, "class", "fg-dl svelte-lyzie7");
			attr(div1, "class", "fg-dc svelte-lyzie7");
			attr(span4, "class", "fg-dv svelte-lyzie7");
			attr(span5, "class", "fg-dl svelte-lyzie7");
			attr(div2, "class", "fg-dc svelte-lyzie7");
			attr(div3, "class", "fg-det-g svelte-lyzie7");
			attr(span6, "class", "fg-drl svelte-lyzie7");
			attr(span7, "class", "fg-drv svelte-lyzie7");
			attr(div4, "class", "fg-dr svelte-lyzie7");
			attr(span8, "class", "fg-drl svelte-lyzie7");
			attr(span9, "class", "fg-drv svelte-lyzie7");
			attr(div5, "class", "fg-dr svelte-lyzie7");
			attr(span10, "class", "fg-drl svelte-lyzie7");
			attr(span11, "class", "fg-drv svelte-lyzie7");
			attr(div6, "class", "fg-dr svelte-lyzie7");
			attr(span12, "class", "fg-drl svelte-lyzie7");
			attr(span13, "class", "fg-drv svelte-lyzie7");
			attr(div7, "class", "fg-dr svelte-lyzie7");
			attr(div8, "class", "fg-ds svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div0, span0);
			append(span0, t0);
			append(span0, t1);
			append(div0, span1);
			append(div3, t3);
			append(div3, div1);
			append(div1, span2);
			append(span2, t4);
			append(span2, t5);
			append(div1, span3);
			append(div3, t7);
			append(div3, div2);
			append(div2, span4);
			append(span4, t8);
			append(span4, t9);
			append(div2, span5);
			insert(target, t11, anchor);
			insert(target, div8, anchor);
			append(div8, div4);
			append(div4, span6);
			append(div4, span7);
			append(span7, t13);
			append(div8, t14);
			append(div8, div5);
			append(div5, span8);
			append(div5, span9);
			append(span9, t16);
			append(div8, t17);
			append(div8, div6);
			append(div6, span10);
			append(div6, span11);
			append(span11, t19);
			append(div8, t20);
			append(div8, div7);
			append(div7, span12);
			append(div7, span13);
			append(span13, t22);
			append(span13, t23);
			append(span13, t24);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 128 && t0_value !== (t0_value = /*rawData*/ ctx[7]?.solarWm2 + "")) set_data(t0, t0_value);
			if (dirty[0] & /*uvIndex*/ 262144) set_data(t5, /*uvIndex*/ ctx[18]);
			if (dirty[0] & /*solarElevDeg*/ 131072) set_data(t8, /*solarElevDeg*/ ctx[17]);
			if (dirty[0] & /*sunriseTime*/ 524288) set_data(t13, /*sunriseTime*/ ctx[19]);
			if (dirty[0] & /*solarNoonTime*/ 2097152) set_data(t16, /*solarNoonTime*/ ctx[21]);
			if (dirty[0] & /*sunsetTime*/ 1048576) set_data(t19, /*sunsetTime*/ ctx[20]);
			if (dirty[0] & /*wbgtSolarContrib*/ 4194304) set_data(t23, /*wbgtSolarContrib*/ ctx[22]);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
				detach(t11);
				detach(div8);
			}
		}
	};
}

// (135:12) {#if isNight}
function create_if_block_10(ctx) {
	let div;
	let t0;
	let br;
	let small;
	let t1;
	let t2;
	let t3;
	let t4;

	return {
		c() {
			div = element("div");
			t0 = text("🌙 Zero solar at night");
			br = element("br");
			small = element("small");
			t1 = text("Sunrise: ");
			t2 = text(/*sunriseTime*/ ctx[19]);
			t3 = text(" · Sunset: ");
			t4 = text(/*sunsetTime*/ ctx[20]);
			set_style(small, "color", "#4a6090");
			attr(div, "class", "fg-night svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, br);
			append(div, small);
			append(small, t1);
			append(small, t2);
			append(small, t3);
			append(small, t4);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sunriseTime*/ 524288) set_data(t2, /*sunriseTime*/ ctx[19]);
			if (dirty[0] & /*sunsetTime*/ 1048576) set_data(t4, /*sunsetTime*/ ctx[20]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (110:12) {#each heat.zoneInfo.mandatoryControls as c}
function create_each_block_2(ctx) {
	let div;
	let t0;
	let t1_value = /*c*/ ctx[83] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("▸ ");
			t1 = text(t1_value);
			attr(div, "class", "fg-dci svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 256 && t1_value !== (t1_value = /*c*/ ctx[83] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (156:12) {#each MODELS as m}
function create_each_block_1(ctx) {
	let option;
	let t_1_value = /*m*/ ctx[80].label + "";
	let t_1;

	return {
		c() {
			option = element("option");
			t_1 = text(t_1_value);
			option.__value = /*m*/ ctx[80].key;
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

// (161:12) {#if !license.valid}
function create_if_block_5(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-proch svelte-lyzie7");
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

// (164:8) {#if worstCaseMode && modelResults.length > 1}
function create_if_block_4(ctx) {
	let table;
	let thead;
	let t4;
	let tbody;
	let each_value = ensure_array_like(/*modelResults*/ ctx[11]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			table = element("table");
			thead = element("thead");
			thead.innerHTML = `<tr><th class="svelte-lyzie7">Model</th><th class="svelte-lyzie7">Zone</th><th class="svelte-lyzie7">App.T</th><th class="svelte-lyzie7">Wind</th></tr>`;
			t4 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(table, "class", "fg-tbl svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, table, anchor);
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
			if (dirty[0] & /*modelResults*/ 2048) {
				each_value = ensure_array_like(/*modelResults*/ ctx[11]);
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
				detach(table);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (168:14) {#each modelResults as mr}
function create_each_block(ctx) {
	let tr;
	let td0;
	let t0_value = /*mr*/ ctx[77].modelLabel + "";
	let t0;
	let t1_value = (/*mr*/ ctx[77].isWorst ? ' ⚡' : '') + "";
	let t1;
	let t2;
	let td1;
	let t3_value = /*mr*/ ctx[77].heat.zoneInfo.riskLabel + "";
	let t3;
	let t4;
	let td2;

	let t5_value = (/*mr*/ ctx[77].heat.apparentTempFinal === 999
	? 'NW'
	: /*mr*/ ctx[77].heat.apparentTempFinal + '°C') + "";

	let t5;
	let t6;
	let td3;
	let t7_value = /*mr*/ ctx[77].raw.windMs.toFixed(1) + "";
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
			attr(td0, "class", "svelte-lyzie7");
			set_style(td1, "color", /*mr*/ ctx[77].heat.zoneInfo.color);
			attr(td1, "class", "svelte-lyzie7");
			set_style(td2, "color", /*mr*/ ctx[77].heat.zoneInfo.color);
			attr(td2, "class", "svelte-lyzie7");
			set_style(td3, "color", /*mr*/ ctx[77].wind.riskColor);
			attr(td3, "class", "svelte-lyzie7");
			attr(tr, "class", tr_class_value = "" + (null_to_empty(/*mr*/ ctx[77].isWorst ? 'fg-tbl-b' : '') + " svelte-lyzie7"));
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
			if (dirty[0] & /*modelResults*/ 2048 && t0_value !== (t0_value = /*mr*/ ctx[77].modelLabel + "")) set_data(t0, t0_value);
			if (dirty[0] & /*modelResults*/ 2048 && t1_value !== (t1_value = (/*mr*/ ctx[77].isWorst ? ' ⚡' : '') + "")) set_data(t1, t1_value);
			if (dirty[0] & /*modelResults*/ 2048 && t3_value !== (t3_value = /*mr*/ ctx[77].heat.zoneInfo.riskLabel + "")) set_data(t3, t3_value);

			if (dirty[0] & /*modelResults*/ 2048) {
				set_style(td1, "color", /*mr*/ ctx[77].heat.zoneInfo.color);
			}

			if (dirty[0] & /*modelResults*/ 2048 && t5_value !== (t5_value = (/*mr*/ ctx[77].heat.apparentTempFinal === 999
			? 'NW'
			: /*mr*/ ctx[77].heat.apparentTempFinal + '°C') + "")) set_data(t5, t5_value);

			if (dirty[0] & /*modelResults*/ 2048) {
				set_style(td2, "color", /*mr*/ ctx[77].heat.zoneInfo.color);
			}

			if (dirty[0] & /*modelResults*/ 2048 && t7_value !== (t7_value = /*mr*/ ctx[77].raw.windMs.toFixed(1) + "")) set_data(t7, t7_value);

			if (dirty[0] & /*modelResults*/ 2048) {
				set_style(td3, "color", /*mr*/ ctx[77].wind.riskColor);
			}

			if (dirty[0] & /*modelResults*/ 2048 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*mr*/ ctx[77].isWorst ? 'fg-tbl-b' : '') + " svelte-lyzie7"))) {
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
	let section;
	let div1;
	let img;
	let img_src_value;
	let t0;
	let span0;
	let t2;
	let div0;
	let t6;
	let button;
	let t7;
	let div2;
	let span3;
	let t9;
	let span4;
	let t10_value = (/*lat*/ ctx[1].toFixed(3) + ', ' + /*lon*/ ctx[2].toFixed(3)) + "";
	let t10;
	let t11;
	let span6;
	let span5;
	let t12;
	let t13;
	let t14;
	let div3;
	let t15;
	let div5;
	let div4;
	let t16;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*isNight*/ ctx[16]) return create_if_block_26;
		return create_else_block_6;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);

	function select_block_type_1(ctx, dirty) {
		if (/*loading*/ ctx[3]) return create_if_block_23;
		if (/*heat*/ ctx[8]) return create_if_block_24;
		return create_else_block_5;
	}

	let current_block_type_1 = select_block_type_1(ctx);
	let if_block1 = current_block_type_1(ctx);
	let each_value_7 = ensure_array_like(/*TABS*/ ctx[34]);
	let each_blocks = [];

	for (let i = 0; i < each_value_7.length; i += 1) {
		each_blocks[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
	}

	function select_block_type_2(ctx, dirty) {
		if (/*tab*/ ctx[0] === 'dashboard') return create_if_block;
		if (/*tab*/ ctx[0] === 'sos') return create_if_block_12;
		if (/*tab*/ ctx[0] === 'report') return create_if_block_15;
		if (/*tab*/ ctx[0] === 'settings') return create_if_block_18;
	}

	let current_block_type_2 = select_block_type_2(ctx);
	let if_block2 = current_block_type_2 && current_block_type_2(ctx);

	return {
		c() {
			section = element("section");
			div1 = element("div");
			img = element("img");
			t0 = space();
			span0 = element("span");
			span0.textContent = "🛡️";
			t2 = space();
			div0 = element("div");
			div0.innerHTML = `<span class="fg-head-title svelte-lyzie7">FieldGuard</span> <span class="fg-head-sub svelte-lyzie7">Real-time Heat &amp; Weather Safety</span>`;
			t6 = space();
			button = element("button");
			button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>`;
			t7 = space();
			div2 = element("div");
			span3 = element("span");
			span3.textContent = "📍";
			t9 = space();
			span4 = element("span");
			t10 = text(t10_value);
			t11 = space();
			span6 = element("span");
			span5 = element("span");
			t12 = text(/*currentTime*/ ctx[5]);
			t13 = space();
			if_block0.c();
			t14 = space();
			div3 = element("div");
			if_block1.c();
			t15 = space();
			div5 = element("div");
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t16 = space();
			if (if_block2) if_block2.c();
			attr(img, "class", "fg-head-logo svelte-lyzie7");
			if (!src_url_equal(img.src, img_src_value = "./assets/logo-white.png")) attr(img, "src", img_src_value);
			attr(img, "onerror", "this.style.display='none';this.nextElementSibling.style.display='block'");
			attr(img, "alt", "");
			attr(span0, "class", "fg-head-shield svelte-lyzie7");
			set_style(span0, "display", "none");
			attr(div0, "class", "fg-head-txt svelte-lyzie7");
			attr(button, "class", "fg-icon-btn svelte-lyzie7");
			attr(button, "title", "Refresh");
			attr(div1, "class", "fg-head desktophide svelte-lyzie7");
			attr(span4, "class", "fg-loc-name svelte-lyzie7");
			attr(span5, "class", "fg-loc-t svelte-lyzie7");
			attr(span6, "class", "fg-loc-r svelte-lyzie7");
			attr(div2, "class", "fg-loc desktophide svelte-lyzie7");
			attr(div3, "class", "fg-pills svelte-lyzie7");
			attr(div4, "class", "fg-tabs svelte-lyzie7");
			attr(div5, "class", "fg-desktop svelte-lyzie7");
			attr(section, "class", "plugin__content fg svelte-lyzie7");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, div1);
			append(div1, img);
			append(div1, t0);
			append(div1, span0);
			append(div1, t2);
			append(div1, div0);
			append(div1, t6);
			append(div1, button);
			append(section, t7);
			append(section, div2);
			append(div2, span3);
			append(div2, t9);
			append(div2, span4);
			append(span4, t10);
			append(div2, t11);
			append(div2, span6);
			append(span6, span5);
			append(span5, t12);
			append(span6, t13);
			if_block0.m(span6, null);
			append(section, t14);
			append(section, div3);
			if_block1.m(div3, null);
			append(section, t15);
			append(section, div5);
			append(div5, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			append(div5, t16);
			if (if_block2) if_block2.m(div5, null);

			if (!mounted) {
				dispose = listen(button, "click", /*refreshData*/ ctx[36]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*lat, lon*/ 6 && t10_value !== (t10_value = (/*lat*/ ctx[1].toFixed(3) + ', ' + /*lon*/ ctx[2].toFixed(3)) + "")) set_data(t10, t10_value);
			if (dirty[0] & /*currentTime*/ 32) set_data(t12, /*currentTime*/ ctx[5]);

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(span6, null);
				}
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type_1(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div3, null);
				}
			}

			if (dirty[0] & /*tab*/ 1 | dirty[1] & /*TABS*/ 8) {
				each_value_7 = ensure_array_like(/*TABS*/ ctx[34]);
				let i;

				for (i = 0; i < each_value_7.length; i += 1) {
					const child_ctx = get_each_context_7(ctx, each_value_7, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_7.length;
			}

			if (current_block_type_2 === (current_block_type_2 = select_block_type_2(ctx)) && if_block2) {
				if_block2.p(ctx, dirty);
			} else {
				if (if_block2) if_block2.d(1);
				if_block2 = current_block_type_2 && current_block_type_2(ctx);

				if (if_block2) {
					if_block2.c();
					if_block2.m(div5, null);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(section);
			}

			if_block0.d();
			if_block1.d();
			destroy_each(each_blocks, detaching);

			if (if_block2) {
				if_block2.d();
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
	let activeCard = 'heat';
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
		$$invalidate(16, isNight = sol.elev < -0.833);
		$$invalidate(17, solarElevDeg = Math.round(sol.elev * 10) / 10);

		$$invalidate(19, sunriseTime = fmtLocalSolarTime(sol.sunrise_LST));
		$$invalidate(20, sunsetTime = fmtLocalSolarTime(sol.sunset_LST));
		$$invalidate(21, solarNoonTime = fmtLocalSolarTime(sol.solarNoon_LST));
		$$invalidate(18, uvIndex = isNight ? 0 : Math.round(inputs.solarWm2 / 25));
		const albedo = 0.37, emiss = 0.95, sigma = 5.67e-8;
		const Tk = inputs.tempC + 273.15;
		const Tg_K = Math.pow((1 - albedo) * inputs.solarWm2 / (emiss * sigma) + Tk ** 4, 0.25);
		const Tg = Tg_K - 273.15;
		$$invalidate(22, wbgtSolarContrib = Math.round(0.2 * (Tg - inputs.tempC) * 10) / 10);
		const w = inputs.solarWm2;

		if (isNight) {
			$$invalidate(23, solarColor = '#a5b4fc');
			$$invalidate(24, solarLabel = 'NIGHT');
		} else if (w < 200) {
			$$invalidate(23, solarColor = '#16a34a');
			$$invalidate(24, solarLabel = 'LOW');
		} else if (w < 600) {
			$$invalidate(23, solarColor = '#d97706');
			$$invalidate(24, solarLabel = 'MODERATE');
		} else if (w < 900) {
			$$invalidate(23, solarColor = '#dc2626');
			$$invalidate(24, solarLabel = 'HIGH');
		} else {
			$$invalidate(23, solarColor = '#7c3aed');
			$$invalidate(24, solarLabel = 'EXTREME');
		}
	}

	function toggleCard(id) {
		$$invalidate(6, activeCard = activeCard === id ? null : id);
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
					$$invalidate(25, license = p);
					$$invalidate(13, worstCaseMode = true);
				}
			}
		} catch {
			
		}
	}

	async function activateLicense() {
		const key = licenseKeyInput.trim();
		if (!key) return;
		$$invalidate(27, licenseLoading = true);
		$$invalidate(28, licenseError = '');

		try {
			const res = await fetch('https://fieldguard-hse.com/api/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, fingerprint: navigator.userAgent })
			});

			if (!res.ok) throw new Error(`Server error: ${res.status}`);
			const data = await res.json();

			if (data.valid) {
				$$invalidate(25, license = {
					valid: true,
					tier: data.tier,
					expires: data.expires,
					token: data.token
				});

				localStorage.setItem('fg_license', JSON.stringify(license));
				$$invalidate(26, licenseKeyInput = '');
				$$invalidate(13, worstCaseMode = true);
				refreshData();
			} else {
				$$invalidate(28, licenseError = data.message ?? 'Invalid license key.');
			}
		} catch(e) {
			$$invalidate(28, licenseError = (e.message?.includes('fetch'))
			? 'Cannot reach fieldguard-hse.com'
			: e.message ?? 'Activation failed.');
		}

		$$invalidate(27, licenseLoading = false);
	}

	function deactivateLicense() {
		$$invalidate(25, license = { valid: false, tier: '', expires: '' });
		localStorage.removeItem('fg_license');
		$$invalidate(13, worstCaseMode = false);
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

			$$invalidate(11, modelResults = results);
			$$invalidate(7, rawData = results[0].raw);
			$$invalidate(8, heat = results[0].heat);
			$$invalidate(9, windResult = results[0].wind);
			$$invalidate(10, rainResult = results[0].rain);
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

		if (heat.zone !== 'green') $$invalidate(14, alertLog = [
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

		if (windResult.exceedsThreshold) $$invalidate(14, alertLog = [
			...alertLog,
			{
				time,
				type: '💨 WIND ALERT',
				color: windResult.riskColor,
				message: `${rawData?.windMs.toFixed(1)} m/s — Bft ${windResult.beaufort} (${windResult.beaufortDesc})`
			}
		]);

		if (rainResult.exceedsThreshold) $$invalidate(14, alertLog = [
			...alertLog,
			{
				time,
				type: '🌧 RAIN ALERT',
				color: rainResult.riskColor,
				message: `${rawData?.rainMmH.toFixed(1)} mm/h — ${rainResult.intensityLabel}`
			}
		]);

		if (heat.isBanPeriod) $$invalidate(14, alertLog = [
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
		$$invalidate(29, settings = { ...DEFAULT_SETTINGS });
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

		$$invalidate(15, reportText = generateWeeklyReport(rd));
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
			if (s) $$invalidate(29, settings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) });
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
	const click_handler = () => toggleCard('heat');
	const click_handler_1 = () => toggleCard('wind');
	const click_handler_2 = () => toggleCard('rain');
	const click_handler_3 = () => toggleCard('solar');
	const click_handler_4 = t => $$invalidate(0, tab = t.id);

	function select_change_handler() {
		selectedModel = select_value(this);
		$$invalidate(12, selectedModel);
		$$invalidate(35, MODELS);
	}

	function input_change_handler() {
		worstCaseMode = this.checked;
		$$invalidate(13, worstCaseMode);
	}

	function input0_input_handler() {
		reportMeta.projectName = this.value;
		$$invalidate(30, reportMeta);
	}

	function input1_input_handler() {
		reportMeta.country = this.value;
		$$invalidate(30, reportMeta);
	}

	function input2_input_handler() {
		reportMeta.clientName = this.value;
		$$invalidate(30, reportMeta);
	}

	function input3_input_handler() {
		reportMeta.contractorName = this.value;
		$$invalidate(30, reportMeta);
	}

	function input4_input_handler() {
		reportMeta.hseManagerName = this.value;
		$$invalidate(30, reportMeta);
	}

	function select_change_handler_1() {
		reportMeta.fidic = select_value(this);
		$$invalidate(30, reportMeta);
	}

	function input_input_handler() {
		licenseKeyInput = this.value;
		$$invalidate(26, licenseKeyInput);
	}

	function input_change_handler_1() {
		settings.ppeProfile = this.__value;
		$$invalidate(29, settings);
	}

	function input0_change_input_handler() {
		settings.wbgtWarnC = to_number(this.value);
		$$invalidate(29, settings);
	}

	function input1_change_input_handler() {
		settings.wbgtDangerC = to_number(this.value);
		$$invalidate(29, settings);
	}

	function input2_change_input_handler() {
		settings.windWarnMs = to_number(this.value);
		$$invalidate(29, settings);
	}

	function input3_change_input_handler() {
		settings.rainWarnMmh = to_number(this.value);
		$$invalidate(29, settings);
	}

	function input0_change_handler() {
		settings.soundAlerts = this.checked;
		$$invalidate(29, settings);
	}

	function input1_change_handler() {
		settings.autoRefresh = this.checked;
		$$invalidate(29, settings);
	}

	return [
		tab,
		lat,
		lon,
		loading,
		error,
		currentTime,
		activeCard,
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
		toggleCard,
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
		select_change_handler,
		input_change_handler,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler,
		input3_input_handler,
		input4_input_handler,
		select_change_handler_1,
		input_input_handler,
		input_change_handler_1,
		$$binding_groups,
		input0_change_input_handler,
		input1_change_input_handler,
		input2_change_input_handler,
		input3_change_input_handler,
		input0_change_handler,
		input1_change_handler
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 43 }, add_css, [-1, -1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[43];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
