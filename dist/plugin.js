const __pluginConfig =  {
  "name": "windy-plugin-fieldguard",
  "version": "1.0.0",
  "icon": "🛡️",
  "title": "FieldGuard — HSE Field Safety",
  "description": "Real-time HSE safety monitor for field workers. Calculates Heat Index (WBGT), Wind & Rain alerts across all Windy models. Worst-case scenario engine, customizable thresholds, and ISO 7933-compliant weekly PDF reports.",
  "author": "FieldGuard HSE",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "routerPath": "/fieldguard/:lat?/:lon?",
  "listenToLocationChange": true,
  "hooks": "contextmenu",
  "built": 1778924982695,
  "builtReadable": "2026-05-16T09:49:42.695Z"
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
	append_styles(target, "svelte-1sqt39u", ".fieldguard.svelte-1sqt39u.svelte-1sqt39u{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;color:#1a2b5e;font-size:13px;padding:0;background:#f5f7fb}.fg-header.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#ffffff;border-bottom:2px solid #e8962a;box-shadow:0 1px 4px rgba(26,43,94,0.08)}.fg-logo-img.svelte-1sqt39u.svelte-1sqt39u{width:36px;height:36px;object-fit:contain;flex-shrink:0}.fg-header-text.svelte-1sqt39u.svelte-1sqt39u{flex:1}.fg-title.svelte-1sqt39u.svelte-1sqt39u{font-size:17px;font-weight:800;color:#1a2b5e;letter-spacing:0.3px;line-height:1.1}.fg-subtitle.svelte-1sqt39u.svelte-1sqt39u{font-size:9px;color:#8a97b0;text-transform:uppercase;letter-spacing:1.2px;margin-top:1px}.fg-settings-btn.svelte-1sqt39u.svelte-1sqt39u{background:#f5f7fb;border:1px solid #dde3ee;color:#4a5d82;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:11px;transition:border-color 0.15s}.fg-settings-btn.svelte-1sqt39u.svelte-1sqt39u:hover{border-color:#e8962a;color:#e8962a}.fg-tabs.svelte-1sqt39u.svelte-1sqt39u{display:flex;background:#ffffff;border-bottom:1px solid #dde3ee}.fg-tab.svelte-1sqt39u.svelte-1sqt39u{flex:1;padding:8px 2px;background:transparent;border:none;color:#8a97b0;cursor:pointer;font-size:11px;transition:color 0.15s;border-bottom:2px solid transparent}.fg-tab.active.svelte-1sqt39u.svelte-1sqt39u{color:#e8962a;border-bottom:2px solid #e8962a;font-weight:600}.fg-tab.svelte-1sqt39u.svelte-1sqt39u:hover:not(.active){color:#1a2b5e}.fg-location-row.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:6px;padding:6px 12px;background:#eef1f7;font-size:11px;color:#4a5d82;border-bottom:1px solid #dde3ee}.fg-loc-text.svelte-1sqt39u.svelte-1sqt39u{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fg-model-row.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:8px;padding:5px 12px;background:#ffffff;font-size:11px;color:#4a5d82;border-bottom:1px solid #dde3ee}.fg-model-row.svelte-1sqt39u select.svelte-1sqt39u{background:#f5f7fb;border:1px solid #dde3ee;color:#1a2b5e;padding:3px 6px;border-radius:4px;font-size:11px}.fg-worst-label.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:4px;cursor:pointer;margin-left:auto}.fg-mini-btn.svelte-1sqt39u.svelte-1sqt39u{background:#f5f7fb;border:1px solid #dde3ee;color:#4a5d82;padding:2px 7px;border-radius:4px;cursor:pointer;font-size:11px}.fg-mini-btn.svelte-1sqt39u.svelte-1sqt39u:hover{border-color:#e8962a;color:#e8962a}.fg-loading.svelte-1sqt39u.svelte-1sqt39u{padding:24px;text-align:center;color:#8a97b0}.fg-error.svelte-1sqt39u.svelte-1sqt39u{padding:12px;background:#fff1f0;color:#c0392b;border-radius:6px;margin:8px 12px;border:1px solid #fcc}.fg-ban-alert.svelte-1sqt39u.svelte-1sqt39u{margin:6px 12px;padding:10px 12px;background:#fff4e5;border:1px solid #e8962a;border-radius:7px;color:#7c4a00;font-size:12px;font-weight:600;text-align:center}.fg-ban-alert.svelte-1sqt39u small.svelte-1sqt39u{font-weight:400;font-size:10px;display:block;margin-top:3px;color:#a06010}.fg-zone-banner.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:10px;margin:8px 12px;padding:11px 12px;border-radius:9px;border:1px solid;background:#ffffff;box-shadow:0 1px 4px rgba(26,43,94,0.07)}.fg-zone-dot.svelte-1sqt39u.svelte-1sqt39u{width:14px;height:14px;border-radius:50%;flex-shrink:0;box-shadow:0 0 6px currentColor}.fg-zone-main.svelte-1sqt39u.svelte-1sqt39u{flex:1}.fg-zone-name.svelte-1sqt39u.svelte-1sqt39u{font-size:18px;font-weight:800;letter-spacing:1.5px}.fg-zone-label.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#4a5d82;margin-top:1px}.fg-zone-sub.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;color:#8a97b0;margin-top:3px}.fg-zone-time.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;color:#8a97b0}.fg-card.svelte-1sqt39u.svelte-1sqt39u{background:#ffffff;border:1px solid #dde3ee;border-left-width:3px;border-radius:8px;margin:5px 12px;padding:10px;box-shadow:0 1px 3px rgba(26,43,94,0.05)}.fg-card-flat.svelte-1sqt39u.svelte-1sqt39u{background:#ffffff;border:1px solid #dde3ee;border-radius:8px;margin:5px 12px;padding:10px;box-shadow:0 1px 3px rgba(26,43,94,0.05)}.fg-card-header.svelte-1sqt39u.svelte-1sqt39u{font-weight:700;font-size:12px;margin-bottom:8px;color:#1a2b5e;display:flex;align-items:center;text-transform:uppercase;letter-spacing:0.5px}.fg-badge.svelte-1sqt39u.svelte-1sqt39u{margin-left:auto;padding:2px 9px;border-radius:4px;font-size:10px;font-weight:700;color:#fff}.fg-metrics-grid.svelte-1sqt39u.svelte-1sqt39u{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:8px}.fg-metric.svelte-1sqt39u.svelte-1sqt39u{background:#eef1f7;border-radius:6px;padding:6px;text-align:center;border:1px solid #dde3ee}.fg-metric-val.svelte-1sqt39u.svelte-1sqt39u{font-size:15px;font-weight:700;color:#1a2b5e}.fg-metric-lbl.svelte-1sqt39u.svelte-1sqt39u{font-size:9px;color:#8a97b0;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px}.fg-work-schedule.svelte-1sqt39u.svelte-1sqt39u{background:#eef1f7;border-radius:6px;padding:8px;margin-bottom:6px;border:1px solid #dde3ee}.fg-ws-row.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:baseline;gap:6px;padding:2px 0}.fg-ws-icon.svelte-1sqt39u.svelte-1sqt39u{font-size:11px}.fg-ws-label.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;color:#8a97b0;min-width:72px}.fg-ws-val.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#1a2b5e;font-weight:600}.fg-ppe-row.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;color:#8a97b0;margin-top:4px}.fg-control-item.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#4a5d82;padding:4px 0;border-bottom:1px solid #eef1f7}.fg-control-item.svelte-1sqt39u.svelte-1sqt39u:last-child{border-bottom:none}.fg-threshold-row.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;color:#8a97b0;margin-top:4px}.fg-table.svelte-1sqt39u.svelte-1sqt39u{width:100%;border-collapse:collapse;font-size:11px}.fg-table.svelte-1sqt39u th.svelte-1sqt39u{color:#8a97b0;text-align:left;padding:3px 4px;border-bottom:1px solid #dde3ee;font-weight:600}.fg-table.svelte-1sqt39u td.svelte-1sqt39u{padding:3px 4px;color:#4a5d82}.fg-worst-row.svelte-1sqt39u td.svelte-1sqt39u{color:#1a2b5e;font-weight:700;background:#eef1f7}.fg-section-title.svelte-1sqt39u.svelte-1sqt39u{padding:10px 12px 6px;font-size:10px;color:#8a97b0;text-transform:uppercase;letter-spacing:1.5px;font-weight:700}.fg-empty.svelte-1sqt39u.svelte-1sqt39u{padding:16px;text-align:center;color:#8a97b0;font-size:11px}.fg-alert-item.svelte-1sqt39u.svelte-1sqt39u{margin:3px 12px;padding:7px 10px;background:#ffffff;border-radius:6px;border:1px solid #dde3ee}.fg-alert-time.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;color:#8a97b0}.fg-alert-type.svelte-1sqt39u.svelte-1sqt39u{font-size:12px;font-weight:700;color:#1a2b5e}.fg-alert-msg.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#4a5d82}.fg-emergency-card.svelte-1sqt39u.svelte-1sqt39u{background:#fff8f8;border-radius:8px;margin:6px 12px;padding:12px;border:1px solid #fcc}.fg-emg-title.svelte-1sqt39u.svelte-1sqt39u{font-size:14px;font-weight:700;color:#c0392b;margin-bottom:4px}.fg-emg-sub.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#4a5d82;margin-bottom:10px}.fg-emg-section.svelte-1sqt39u.svelte-1sqt39u{margin-bottom:12px}.fg-emg-label.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;color:#8a97b0;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;font-weight:700}.fg-emg-item.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#c0392b;padding:2px 0}.fg-emg-step.svelte-1sqt39u.svelte-1sqt39u{display:flex;gap:8px;align-items:flex-start;padding:4px 0;font-size:11px;color:#4a5d82}.fg-emg-num.svelte-1sqt39u.svelte-1sqt39u{background:#eef1f7;color:#1a2b5e;border-radius:3px;padding:1px 5px;font-size:10px;font-weight:700;flex-shrink:0}.fg-emg-critical.svelte-1sqt39u.svelte-1sqt39u{color:#c0392b !important;font-weight:600}.fg-emg-critical.svelte-1sqt39u .fg-emg-num.svelte-1sqt39u{background:#c0392b;color:#fff}.fg-report-note.svelte-1sqt39u.svelte-1sqt39u{margin:0 12px 6px;padding:7px 10px;background:#eef1f7;border-radius:6px;font-size:10px;color:#4a5d82;border:1px solid #dde3ee}.fg-form.svelte-1sqt39u.svelte-1sqt39u{padding:0 12px;display:grid;grid-template-columns:1fr 1fr;gap:5px}label.svelte-1sqt39u.svelte-1sqt39u{display:block;color:#4a5d82;font-size:11px;margin-bottom:4px}label.svelte-1sqt39u input.svelte-1sqt39u,label.svelte-1sqt39u select.svelte-1sqt39u{display:block;width:100%;background:#f5f7fb;border:1px solid #dde3ee;color:#1a2b5e;padding:5px 8px;border-radius:5px;font-size:11px;margin-top:2px;box-sizing:border-box}label.svelte-1sqt39u input.svelte-1sqt39u:focus,label.svelte-1sqt39u select.svelte-1sqt39u:focus{outline:none;border-color:#e8962a}.fg-btn.svelte-1sqt39u.svelte-1sqt39u{display:block;width:calc(100% - 24px);margin:6px 12px;padding:9px;border:none;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;transition:opacity 0.15s}.fg-btn.svelte-1sqt39u.svelte-1sqt39u:hover{opacity:0.88}.fg-btn-primary.svelte-1sqt39u.svelte-1sqt39u{background:#e8962a;color:#ffffff}.fg-btn-secondary.svelte-1sqt39u.svelte-1sqt39u{background:#eef1f7;color:#4a5d82;border:1px solid #dde3ee}.fg-report-preview.svelte-1sqt39u.svelte-1sqt39u{margin:6px 12px;background:#f5f7fb;border:1px solid #dde3ee;border-radius:8px;overflow:hidden}.fg-report-toolbar.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:8px;padding:6px 10px;background:#eef1f7;border-bottom:1px solid #dde3ee;font-size:11px;color:#4a5d82}.fg-report-toolbar.svelte-1sqt39u span.svelte-1sqt39u{flex:1}.fg-report-text.svelte-1sqt39u.svelte-1sqt39u{padding:10px;font-size:9px;color:#4a5d82;white-space:pre;overflow:auto;max-height:280px;font-family:'Courier New', monospace;line-height:1.5}.fg-settings-section.svelte-1sqt39u.svelte-1sqt39u{background:#ffffff;border-radius:8px;margin:5px 12px;padding:10px;border:1px solid #dde3ee}.fg-settings-label.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;font-weight:700;color:#e8962a;margin-bottom:7px;text-transform:uppercase;letter-spacing:0.8px}.fg-note.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;color:#8a97b0;margin-bottom:7px}.fg-radio-label.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;border-bottom:1px solid #eef1f7}.fg-radio-label.svelte-1sqt39u.svelte-1sqt39u:last-child{border-bottom:none}.fg-radio-text.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#1a2b5e;flex:1}.fg-adj.svelte-1sqt39u.svelte-1sqt39u{background:#eef1f7;color:#8a97b0;border-radius:3px;padding:1px 5px;font-size:9px;margin-left:4px;border:1px solid #dde3ee}.fg-slider-row.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:8px}.fg-slider-row.svelte-1sqt39u input[type=\"range\"].svelte-1sqt39u{flex:1;accent-color:#e8962a}.fg-slider-row.svelte-1sqt39u span.svelte-1sqt39u{min-width:55px;text-align:right;color:#e8962a;font-size:11px;font-weight:700}.fg-toggle-label.svelte-1sqt39u.svelte-1sqt39u{display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:11px;color:#1a2b5e}input[type=\"checkbox\"].svelte-1sqt39u.svelte-1sqt39u{accent-color:#e8962a}.fg-license-section.svelte-1sqt39u.svelte-1sqt39u{border:1px solid #e8962a !important}.fg-license-active.svelte-1sqt39u.svelte-1sqt39u{background:#f0fdf4;border:1px solid #16a34a;border-radius:7px;padding:10px}.fg-license-badge.svelte-1sqt39u.svelte-1sqt39u{font-size:12px;font-weight:700;color:#16a34a;letter-spacing:1px;margin-bottom:4px}.fg-license-detail.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#4a5d82;margin-bottom:8px}.fg-btn-deactivate.svelte-1sqt39u.svelte-1sqt39u{background:#f5f7fb;border:1px solid #dde3ee;color:#4a5d82;padding:4px 10px;border-radius:5px;cursor:pointer;font-size:11px}.fg-license-free.svelte-1sqt39u.svelte-1sqt39u{background:#f5f7fb;border-radius:7px;padding:10px;margin-bottom:8px;border:1px solid #dde3ee}.fg-free-badge.svelte-1sqt39u.svelte-1sqt39u{font-size:10px;font-weight:700;color:#8a97b0;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}.fg-free-desc.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#4a5d82;line-height:1.7;margin-bottom:10px}.fg-free-desc.svelte-1sqt39u strong.svelte-1sqt39u{color:#1a2b5e}.fg-buy-btn.svelte-1sqt39u.svelte-1sqt39u{display:block;text-align:center;background:#e8962a;color:#ffffff !important;padding:9px 12px;border-radius:7px;font-size:12px;font-weight:800;text-decoration:none;margin-top:6px;letter-spacing:0.3px}.fg-buy-btn.svelte-1sqt39u.svelte-1sqt39u:hover{background:#d4851f}.fg-license-input-group.svelte-1sqt39u.svelte-1sqt39u{display:flex;gap:6px;margin-top:4px}.fg-license-input.svelte-1sqt39u.svelte-1sqt39u{flex:1;background:#f5f7fb;border:1px solid #dde3ee;color:#1a2b5e;padding:6px 8px;border-radius:5px;font-size:11px;font-family:monospace}.fg-license-input.svelte-1sqt39u.svelte-1sqt39u:focus{outline:none;border-color:#e8962a}.fg-license-input.svelte-1sqt39u.svelte-1sqt39u:disabled{opacity:0.5}.fg-activate-btn.svelte-1sqt39u.svelte-1sqt39u{background:#e8962a;border:none;color:#ffffff;padding:6px 14px;border-radius:5px;cursor:pointer;font-size:12px;font-weight:800;white-space:nowrap}.fg-activate-btn.svelte-1sqt39u.svelte-1sqt39u:disabled{background:#dde3ee;color:#8a97b0;cursor:not-allowed}.fg-activate-btn.loading.svelte-1sqt39u.svelte-1sqt39u{opacity:0.7}.fg-license-error.svelte-1sqt39u.svelte-1sqt39u{margin-top:6px;font-size:11px;color:#c0392b;padding:6px 8px;background:#fff1f0;border-radius:5px;border:1px solid #fcc}.fg-locked.svelte-1sqt39u.svelte-1sqt39u{opacity:0.4;pointer-events:none}.fg-pro-tag.svelte-1sqt39u.svelte-1sqt39u{background:#e8962a;color:#ffffff;font-size:8px;font-weight:800;padding:1px 5px;border-radius:3px;margin-left:6px;vertical-align:middle;letter-spacing:0.5px}.fg-gate-msg.svelte-1sqt39u.svelte-1sqt39u{font-size:11px;color:#8a97b0;padding:6px 0}.fg-toggle-disabled.svelte-1sqt39u.svelte-1sqt39u{opacity:0.4}.fg-pro-gate.svelte-1sqt39u.svelte-1sqt39u{margin:20px 12px;padding:22px 16px;background:#ffffff;border:1px solid #dde3ee;border-radius:10px;text-align:center;box-shadow:0 1px 4px rgba(26,43,94,0.07)}.fg-pro-gate-icon.svelte-1sqt39u.svelte-1sqt39u{font-size:34px;margin-bottom:8px}.fg-pro-gate-title.svelte-1sqt39u.svelte-1sqt39u{font-size:15px;font-weight:800;color:#1a2b5e;margin-bottom:8px}.fg-pro-gate-desc.svelte-1sqt39u.svelte-1sqt39u{font-size:12px;color:#4a5d82;line-height:1.7;margin-bottom:14px}");
}

function get_each_context_6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[87] = list[i][0];
	child_ctx[88] = list[i][1];
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[78] = list[i];
	return child_ctx;
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[81] = list[i];
	child_ctx[83] = i;
	return child_ctx;
}

function get_each_context_5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[84] = list[i];
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[69] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[72] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[75] = list[i];
	return child_ctx;
}

function get_each_context_7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[91] = list[i];
	return child_ctx;
}

// (17:4) {#each TABS as t}
function create_each_block_7(ctx) {
	let button;
	let t0_value = /*t*/ ctx[91].icon + "";
	let t0;
	let t1;
	let t2_value = /*t*/ ctx[91].label + "";
	let t2;
	let t3;
	let button_class_value;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[35](/*t*/ ctx[91]);
	}

	return {
		c() {
			button = element("button");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			attr(button, "class", button_class_value = "fg-tab " + (/*tab*/ ctx[0] === /*t*/ ctx[91].id ? 'active' : '') + " svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t0);
			append(button, t1);
			append(button, t2);
			append(button, t3);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_1);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*tab*/ 1 && button_class_value !== (button_class_value = "fg-tab " + (/*tab*/ ctx[0] === /*t*/ ctx[91].id ? 'active' : '') + " svelte-1sqt39u")) {
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

// (315:31) 
function create_if_block_14(ctx) {
	let div0;
	let t1;
	let div2;
	let div1;
	let t3;
	let t4;
	let div4;
	let div3;
	let t6;
	let t7;
	let div6;
	let div5;
	let t8;
	let t9;
	let div6_class_value;
	let t10;
	let div8;
	let div7;
	let t11;
	let t12;
	let div8_class_value;
	let t13;
	let div10;
	let div9;
	let t14;
	let t15;
	let div10_class_value;
	let t16;
	let div12;
	let div11;
	let t18;
	let label0;
	let input0;
	let t19;
	let t20;
	let label1;
	let input1;
	let input1_disabled_value;
	let t21;
	let label1_class_value;
	let t22;
	let if_block8_anchor;
	let mounted;
	let dispose;

	function select_block_type_5(ctx, dirty) {
		if (/*license*/ ctx[16].valid) return create_if_block_23;
		return create_else_block_6;
	}

	let current_block_type = select_block_type_5(ctx);
	let if_block0 = current_block_type(ctx);
	let each_value_6 = ensure_array_like(Object.entries(PPE_PROFILES));
	let each_blocks = [];

	for (let i = 0; i < each_value_6.length; i += 1) {
		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
	}

	let if_block1 = !/*license*/ ctx[16].valid && create_if_block_22();

	function select_block_type_6(ctx, dirty) {
		if (/*license*/ ctx[16].valid) return create_if_block_21;
		return create_else_block_5;
	}

	let current_block_type_1 = select_block_type_6(ctx);
	let if_block2 = current_block_type_1(ctx);
	let if_block3 = !/*license*/ ctx[16].valid && create_if_block_20();

	function select_block_type_7(ctx, dirty) {
		if (/*license*/ ctx[16].valid) return create_if_block_19;
		return create_else_block_4;
	}

	let current_block_type_2 = select_block_type_7(ctx);
	let if_block4 = current_block_type_2(ctx);
	let if_block5 = !/*license*/ ctx[16].valid && create_if_block_18();

	function select_block_type_8(ctx, dirty) {
		if (/*license*/ ctx[16].valid) return create_if_block_17;
		return create_else_block_3;
	}

	let current_block_type_3 = select_block_type_8(ctx);
	let if_block6 = current_block_type_3(ctx);
	let if_block7 = !/*license*/ ctx[16].valid && create_if_block_16();
	let if_block8 = /*license*/ ctx[16].valid && create_if_block_15(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = "⚙ Configuration";
			t1 = space();
			div2 = element("div");
			div1 = element("div");
			div1.textContent = "🔑 License";
			t3 = space();
			if_block0.c();
			t4 = space();
			div4 = element("div");
			div3 = element("div");
			div3.textContent = "👷 PPE Profile (ISO 7933:2004)";
			t6 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t7 = space();
			div6 = element("div");
			div5 = element("div");
			t8 = text("🌡 WBGT Thresholds (ISO 7933)\n        ");
			if (if_block1) if_block1.c();
			t9 = space();
			if_block2.c();
			t10 = space();
			div8 = element("div");
			div7 = element("div");
			t11 = text("💨 Wind Thresholds\n        ");
			if (if_block3) if_block3.c();
			t12 = space();
			if_block4.c();
			t13 = space();
			div10 = element("div");
			div9 = element("div");
			t14 = text("🌧 Rain Thresholds\n        ");
			if (if_block5) if_block5.c();
			t15 = space();
			if_block6.c();
			t16 = space();
			div12 = element("div");
			div11 = element("div");
			div11.textContent = "🔔 Alerts";
			t18 = space();
			label0 = element("label");
			input0 = element("input");
			t19 = text("\n        Browser notifications for danger zones");
			t20 = space();
			label1 = element("label");
			input1 = element("input");
			t21 = text("\n        Auto-refresh every 15 min (monitoring schedule)\n        ");
			if (if_block7) if_block7.c();
			t22 = space();
			if (if_block8) if_block8.c();
			if_block8_anchor = empty();
			attr(div0, "class", "fg-section-title svelte-1sqt39u");
			attr(div1, "class", "fg-settings-label svelte-1sqt39u");
			attr(div2, "class", "fg-settings-section fg-license-section svelte-1sqt39u");
			attr(div3, "class", "fg-settings-label svelte-1sqt39u");
			attr(div4, "class", "fg-settings-section svelte-1sqt39u");
			attr(div5, "class", "fg-settings-label svelte-1sqt39u");
			attr(div6, "class", div6_class_value = "fg-settings-section " + (!/*license*/ ctx[16].valid ? 'fg-locked' : '') + " svelte-1sqt39u");
			attr(div7, "class", "fg-settings-label svelte-1sqt39u");
			attr(div8, "class", div8_class_value = "fg-settings-section " + (!/*license*/ ctx[16].valid ? 'fg-locked' : '') + " svelte-1sqt39u");
			attr(div9, "class", "fg-settings-label svelte-1sqt39u");
			attr(div10, "class", div10_class_value = "fg-settings-section " + (!/*license*/ ctx[16].valid ? 'fg-locked' : '') + " svelte-1sqt39u");
			attr(div11, "class", "fg-settings-label svelte-1sqt39u");
			attr(input0, "type", "checkbox");
			attr(input0, "class", "svelte-1sqt39u");
			attr(label0, "class", "fg-toggle-label svelte-1sqt39u");
			attr(input1, "type", "checkbox");
			input1.disabled = input1_disabled_value = !/*license*/ ctx[16].valid;
			attr(input1, "class", "svelte-1sqt39u");
			attr(label1, "class", label1_class_value = "fg-toggle-label " + (!/*license*/ ctx[16].valid ? 'fg-toggle-disabled' : '') + " svelte-1sqt39u");
			attr(div12, "class", "fg-settings-section svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div2, anchor);
			append(div2, div1);
			append(div2, t3);
			if_block0.m(div2, null);
			insert(target, t4, anchor);
			insert(target, div4, anchor);
			append(div4, div3);
			append(div4, t6);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			insert(target, t7, anchor);
			insert(target, div6, anchor);
			append(div6, div5);
			append(div5, t8);
			if (if_block1) if_block1.m(div5, null);
			append(div6, t9);
			if_block2.m(div6, null);
			insert(target, t10, anchor);
			insert(target, div8, anchor);
			append(div8, div7);
			append(div7, t11);
			if (if_block3) if_block3.m(div7, null);
			append(div8, t12);
			if_block4.m(div8, null);
			insert(target, t13, anchor);
			insert(target, div10, anchor);
			append(div10, div9);
			append(div9, t14);
			if (if_block5) if_block5.m(div9, null);
			append(div10, t15);
			if_block6.m(div10, null);
			insert(target, t16, anchor);
			insert(target, div12, anchor);
			append(div12, div11);
			append(div12, t18);
			append(div12, label0);
			append(label0, input0);
			input0.checked = /*settings*/ ctx[20].soundAlerts;
			append(label0, t19);
			append(div12, t20);
			append(div12, label1);
			append(label1, input1);
			input1.checked = /*settings*/ ctx[20].autoRefresh;
			append(label1, t21);
			if (if_block7) if_block7.m(label1, null);
			insert(target, t22, anchor);
			if (if_block8) if_block8.m(target, anchor);
			insert(target, if_block8_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_handler*/ ctx[59]),
					listen(input0, "change", /*saveSettings*/ ctx[27]),
					listen(input1, "change", /*input1_change_handler*/ ctx[60]),
					listen(input1, "change", /*setupAutoRefresh*/ ctx[29])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_5(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div2, null);
				}
			}

			if (dirty[0] & /*settings, saveSettings*/ 135266304) {
				each_value_6 = ensure_array_like(Object.entries(PPE_PROFILES));
				let i;

				for (i = 0; i < each_value_6.length; i += 1) {
					const child_ctx = get_each_context_6(ctx, each_value_6, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_6.length;
			}

			if (!/*license*/ ctx[16].valid) {
				if (if_block1) ; else {
					if_block1 = create_if_block_22();
					if_block1.c();
					if_block1.m(div5, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_6(ctx)) && if_block2) {
				if_block2.p(ctx, dirty);
			} else {
				if_block2.d(1);
				if_block2 = current_block_type_1(ctx);

				if (if_block2) {
					if_block2.c();
					if_block2.m(div6, null);
				}
			}

			if (dirty[0] & /*license*/ 65536 && div6_class_value !== (div6_class_value = "fg-settings-section " + (!/*license*/ ctx[16].valid ? 'fg-locked' : '') + " svelte-1sqt39u")) {
				attr(div6, "class", div6_class_value);
			}

			if (!/*license*/ ctx[16].valid) {
				if (if_block3) ; else {
					if_block3 = create_if_block_20();
					if_block3.c();
					if_block3.m(div7, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (current_block_type_2 === (current_block_type_2 = select_block_type_7(ctx)) && if_block4) {
				if_block4.p(ctx, dirty);
			} else {
				if_block4.d(1);
				if_block4 = current_block_type_2(ctx);

				if (if_block4) {
					if_block4.c();
					if_block4.m(div8, null);
				}
			}

			if (dirty[0] & /*license*/ 65536 && div8_class_value !== (div8_class_value = "fg-settings-section " + (!/*license*/ ctx[16].valid ? 'fg-locked' : '') + " svelte-1sqt39u")) {
				attr(div8, "class", div8_class_value);
			}

			if (!/*license*/ ctx[16].valid) {
				if (if_block5) ; else {
					if_block5 = create_if_block_18();
					if_block5.c();
					if_block5.m(div9, null);
				}
			} else if (if_block5) {
				if_block5.d(1);
				if_block5 = null;
			}

			if (current_block_type_3 === (current_block_type_3 = select_block_type_8(ctx)) && if_block6) {
				if_block6.p(ctx, dirty);
			} else {
				if_block6.d(1);
				if_block6 = current_block_type_3(ctx);

				if (if_block6) {
					if_block6.c();
					if_block6.m(div10, null);
				}
			}

			if (dirty[0] & /*license*/ 65536 && div10_class_value !== (div10_class_value = "fg-settings-section " + (!/*license*/ ctx[16].valid ? 'fg-locked' : '') + " svelte-1sqt39u")) {
				attr(div10, "class", div10_class_value);
			}

			if (dirty[0] & /*settings*/ 1048576) {
				input0.checked = /*settings*/ ctx[20].soundAlerts;
			}

			if (dirty[0] & /*license*/ 65536 && input1_disabled_value !== (input1_disabled_value = !/*license*/ ctx[16].valid)) {
				input1.disabled = input1_disabled_value;
			}

			if (dirty[0] & /*settings*/ 1048576) {
				input1.checked = /*settings*/ ctx[20].autoRefresh;
			}

			if (!/*license*/ ctx[16].valid) {
				if (if_block7) ; else {
					if_block7 = create_if_block_16();
					if_block7.c();
					if_block7.m(label1, null);
				}
			} else if (if_block7) {
				if_block7.d(1);
				if_block7 = null;
			}

			if (dirty[0] & /*license*/ 65536 && label1_class_value !== (label1_class_value = "fg-toggle-label " + (!/*license*/ ctx[16].valid ? 'fg-toggle-disabled' : '') + " svelte-1sqt39u")) {
				attr(label1, "class", label1_class_value);
			}

			if (/*license*/ ctx[16].valid) {
				if (if_block8) {
					if_block8.p(ctx, dirty);
				} else {
					if_block8 = create_if_block_15(ctx);
					if_block8.c();
					if_block8.m(if_block8_anchor.parentNode, if_block8_anchor);
				}
			} else if (if_block8) {
				if_block8.d(1);
				if_block8 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div2);
				detach(t4);
				detach(div4);
				detach(t7);
				detach(div6);
				detach(t10);
				detach(div8);
				detach(t13);
				detach(div10);
				detach(t16);
				detach(div12);
				detach(t22);
				detach(if_block8_anchor);
			}

			if_block0.d();
			destroy_each(each_blocks, detaching);
			if (if_block1) if_block1.d();
			if_block2.d();
			if (if_block3) if_block3.d();
			if_block4.d();
			if (if_block5) if_block5.d();
			if_block6.d();
			if (if_block7) if_block7.d();
			if (if_block8) if_block8.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (263:29) 
function create_if_block_11(ctx) {
	let if_block_anchor;

	function select_block_type_4(ctx, dirty) {
		if (!/*license*/ ctx[16].valid) return create_if_block_12;
		return create_else_block_2;
	}

	let current_block_type = select_block_type_4(ctx);
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
			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
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

// (210:32) 
function create_if_block_8(ctx) {
	let if_block_anchor;

	function select_block_type_2(ctx, dirty) {
		if (!/*license*/ ctx[16].valid) return create_if_block_9;
		return create_else_block;
	}

	let current_block_type = select_block_type_2(ctx);
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
				detach(if_block_anchor);
			}

			if_block.d(detaching);
		}
	};
}

// (25:2) {#if tab === 'dashboard'}
function create_if_block(ctx) {
	let div0;
	let span0;
	let t1;
	let span1;
	let t2_value = (/*lat*/ ctx[1].toFixed(3) + ', ' + /*lon*/ ctx[2].toFixed(3)) + "";
	let t2;
	let t3;
	let button;
	let t5;
	let div1;
	let label0;
	let t7;
	let select;
	let t8;
	let label1;
	let input;
	let input_disabled_value;
	let t9;
	let label1_class_value;
	let t10;
	let if_block1_anchor;
	let mounted;
	let dispose;
	let each_value_2 = ensure_array_like(/*MODELS*/ ctx[25]);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	let if_block0 = !/*license*/ ctx[16].valid && create_if_block_7();

	function select_block_type_1(ctx, dirty) {
		if (/*loading*/ ctx[3]) return create_if_block_1;
		if (/*error*/ ctx[4]) return create_if_block_2;
		if (/*heat*/ ctx[7]) return create_if_block_3;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block1 = current_block_type && current_block_type(ctx);

	return {
		c() {
			div0 = element("div");
			span0 = element("span");
			span0.textContent = "📍";
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			button = element("button");
			button.textContent = "🔄";
			t5 = space();
			div1 = element("div");
			label0 = element("label");
			label0.textContent = "Model:";
			t7 = space();
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t8 = space();
			label1 = element("label");
			input = element("input");
			t9 = text("\n        Worst-case ⚡");
			if (if_block0) if_block0.c();
			t10 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			attr(span1, "class", "fg-loc-text svelte-1sqt39u");
			attr(button, "class", "fg-mini-btn svelte-1sqt39u");
			attr(div0, "class", "fg-location-row svelte-1sqt39u");
			set_style(label0, "margin", "0");
			attr(label0, "class", "svelte-1sqt39u");
			attr(select, "class", "svelte-1sqt39u");
			if (/*selectedModel*/ ctx[12] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[36].call(select));
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = !/*license*/ ctx[16].valid;
			attr(input, "class", "svelte-1sqt39u");
			attr(label1, "class", label1_class_value = "fg-worst-label " + (!/*license*/ ctx[16].valid ? 'fg-toggle-disabled' : '') + " svelte-1sqt39u");
			set_style(label1, "margin", "0");
			attr(div1, "class", "fg-model-row svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, span0);
			append(div0, t1);
			append(div0, span1);
			append(span1, t2);
			append(div0, t3);
			append(div0, button);
			insert(target, t5, anchor);
			insert(target, div1, anchor);
			append(div1, label0);
			append(div1, t7);
			append(div1, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			select_option(select, /*selectedModel*/ ctx[12], true);
			append(div1, t8);
			append(div1, label1);
			append(label1, input);
			input.checked = /*worstCaseMode*/ ctx[13];
			append(label1, t9);
			if (if_block0) if_block0.m(label1, null);
			insert(target, t10, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(button, "click", /*refreshData*/ ctx[26]),
					listen(select, "change", /*select_change_handler*/ ctx[36]),
					listen(select, "change", /*refreshData*/ ctx[26]),
					listen(input, "change", /*input_change_handler*/ ctx[37]),
					listen(input, "change", /*refreshData*/ ctx[26])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*lat, lon*/ 6 && t2_value !== (t2_value = (/*lat*/ ctx[1].toFixed(3) + ', ' + /*lon*/ ctx[2].toFixed(3)) + "")) set_data(t2, t2_value);

			if (dirty[0] & /*MODELS*/ 33554432) {
				each_value_2 = ensure_array_like(/*MODELS*/ ctx[25]);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}

			if (dirty[0] & /*selectedModel, MODELS*/ 33558528) {
				select_option(select, /*selectedModel*/ ctx[12]);
			}

			if (dirty[0] & /*license*/ 65536 && input_disabled_value !== (input_disabled_value = !/*license*/ ctx[16].valid)) {
				input.disabled = input_disabled_value;
			}

			if (dirty[0] & /*worstCaseMode*/ 8192) {
				input.checked = /*worstCaseMode*/ ctx[13];
			}

			if (!/*license*/ ctx[16].valid) {
				if (if_block0) ; else {
					if_block0 = create_if_block_7();
					if_block0.c();
					if_block0.m(label1, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty[0] & /*license*/ 65536 && label1_class_value !== (label1_class_value = "fg-worst-label " + (!/*license*/ ctx[16].valid ? 'fg-toggle-disabled' : '') + " svelte-1sqt39u")) {
				attr(label1, "class", label1_class_value);
			}

			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if (if_block1) if_block1.d(1);
				if_block1 = current_block_type && current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t5);
				detach(div1);
				detach(t10);
				detach(if_block1_anchor);
			}

			destroy_each(each_blocks, detaching);
			if (if_block0) if_block0.d();

			if (if_block1) {
				if_block1.d(detaching);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (332:6) {:else}
function create_else_block_6(ctx) {
	let div2;
	let t12;
	let div3;
	let input;
	let t13;
	let button;
	let t14_value = (/*licenseLoading*/ ctx[18] ? '…' : 'Activate') + "";
	let t14;
	let button_class_value;
	let button_disabled_value;
	let t15;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*licenseError*/ ctx[19] && create_if_block_24(ctx);

	return {
		c() {
			div2 = element("div");

			div2.innerHTML = `<div class="fg-free-badge svelte-1sqt39u">FREE TIER</div> <div class="fg-free-desc svelte-1sqt39u">Upgrade to <strong class="svelte-1sqt39u">FieldGuard Pro</strong> to unlock:<br/>
            ⚡ Multi-model worst-case engine<br/>
            📄 ISO 7933 weekly report generator<br/>
            🚨 SOS emergency tab<br/>
            🎛 Custom wind / rain / WBGT thresholds<br/>
            🔄 Auto-refresh (15 min monitoring)</div> <a class="fg-buy-btn svelte-1sqt39u" href="https://fieldguard-hse.com" target="_blank">Get Pro — fieldguard-hse.com</a>`;

			t12 = space();
			div3 = element("div");
			input = element("input");
			t13 = space();
			button = element("button");
			t14 = text(t14_value);
			t15 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div2, "class", "fg-license-free svelte-1sqt39u");
			attr(input, "class", "fg-license-input svelte-1sqt39u");
			attr(input, "placeholder", "Paste your license key…");
			input.disabled = /*licenseLoading*/ ctx[18];
			attr(button, "class", button_class_value = "fg-activate-btn " + (/*licenseLoading*/ ctx[18] ? 'loading' : '') + " svelte-1sqt39u");
			button.disabled = button_disabled_value = /*licenseLoading*/ ctx[18] || !/*licenseKeyInput*/ ctx[17].trim();
			attr(div3, "class", "fg-license-input-group svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			insert(target, t12, anchor);
			insert(target, div3, anchor);
			append(div3, input);
			set_input_value(input, /*licenseKeyInput*/ ctx[17]);
			append(div3, t13);
			append(div3, button);
			append(button, t14);
			insert(target, t15, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[50]),
					listen(button, "click", /*activateLicense*/ ctx[22])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseLoading*/ 262144) {
				input.disabled = /*licenseLoading*/ ctx[18];
			}

			if (dirty[0] & /*licenseKeyInput*/ 131072 && input.value !== /*licenseKeyInput*/ ctx[17]) {
				set_input_value(input, /*licenseKeyInput*/ ctx[17]);
			}

			if (dirty[0] & /*licenseLoading*/ 262144 && t14_value !== (t14_value = (/*licenseLoading*/ ctx[18] ? '…' : 'Activate') + "")) set_data(t14, t14_value);

			if (dirty[0] & /*licenseLoading*/ 262144 && button_class_value !== (button_class_value = "fg-activate-btn " + (/*licenseLoading*/ ctx[18] ? 'loading' : '') + " svelte-1sqt39u")) {
				attr(button, "class", button_class_value);
			}

			if (dirty[0] & /*licenseLoading, licenseKeyInput*/ 393216 && button_disabled_value !== (button_disabled_value = /*licenseLoading*/ ctx[18] || !/*licenseKeyInput*/ ctx[17].trim())) {
				button.disabled = button_disabled_value;
			}

			if (/*licenseError*/ ctx[19]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_24(ctx);
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
				detach(t12);
				detach(div3);
				detach(t15);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (322:6) {#if license.valid}
function create_if_block_23(ctx) {
	let div2;
	let div0;
	let t1;
	let div1;
	let t2;
	let strong0;
	let t3_value = /*license*/ ctx[16].tier?.toUpperCase() + "";
	let t3;
	let t4;
	let strong1;
	let t5_value = /*license*/ ctx[16].expires?.slice(0, 10) + "";
	let t5;
	let t6;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			div0.textContent = "✓ PRO ACTIVATED";
			t1 = space();
			div1 = element("div");
			t2 = text("Tier: ");
			strong0 = element("strong");
			t3 = text(t3_value);
			t4 = text("  | \n            Expires: ");
			strong1 = element("strong");
			t5 = text(t5_value);
			t6 = space();
			button = element("button");
			button.textContent = "Deactivate";
			attr(div0, "class", "fg-license-badge svelte-1sqt39u");
			attr(div1, "class", "fg-license-detail svelte-1sqt39u");
			attr(button, "class", "fg-btn-deactivate svelte-1sqt39u");
			attr(div2, "class", "fg-license-active svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div2, t1);
			append(div2, div1);
			append(div1, t2);
			append(div1, strong0);
			append(strong0, t3);
			append(div1, t4);
			append(div1, strong1);
			append(strong1, t5);
			append(div2, t6);
			append(div2, button);

			if (!mounted) {
				dispose = listen(button, "click", /*deactivateLicense*/ ctx[23]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*license*/ 65536 && t3_value !== (t3_value = /*license*/ ctx[16].tier?.toUpperCase() + "")) set_data(t3, t3_value);
			if (dirty[0] & /*license*/ 65536 && t5_value !== (t5_value = /*license*/ ctx[16].expires?.slice(0, 10) + "")) set_data(t5, t5_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			mounted = false;
			dispose();
		}
	};
}

// (365:8) {#if licenseError}
function create_if_block_24(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚠ ");
			t1 = text(/*licenseError*/ ctx[19]);
			attr(div, "class", "fg-license-error svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseError*/ 524288) set_data(t1, /*licenseError*/ ctx[19]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (374:6) {#each Object.entries(PPE_PROFILES) as [key, prof]}
function create_each_block_6(ctx) {
	let label;
	let input;
	let t0;
	let span1;
	let t1_value = /*prof*/ ctx[88].label + "";
	let t1;
	let t2;
	let span0;
	let t6;
	let binding_group;
	let mounted;
	let dispose;
	binding_group = init_binding_group(/*$$binding_groups*/ ctx[52][0]);

	return {
		c() {
			label = element("label");
			input = element("input");
			t0 = space();
			span1 = element("span");
			t1 = text(t1_value);
			t2 = space();
			span0 = element("span");
			span0.textContent = `+${/*prof*/ ctx[88].adjustment}°C`;
			t6 = space();
			attr(input, "type", "radio");
			input.__value = /*key*/ ctx[87];
			set_input_value(input, input.__value);
			attr(input, "class", "svelte-1sqt39u");
			attr(span0, "class", "fg-adj svelte-1sqt39u");
			attr(span1, "class", "fg-radio-text svelte-1sqt39u");
			attr(label, "class", "fg-radio-label svelte-1sqt39u");
			binding_group.p(input);
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			input.checked = input.__value === /*settings*/ ctx[20].ppeProfile;
			append(label, t0);
			append(label, span1);
			append(span1, t1);
			append(span1, t2);
			append(span1, span0);
			append(label, t6);

			if (!mounted) {
				dispose = [
					listen(input, "change", /*input_change_handler_1*/ ctx[51]),
					listen(input, "change", /*saveSettings*/ ctx[27])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 1048576) {
				input.checked = input.__value === /*settings*/ ctx[20].ppeProfile;
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

// (386:8) {#if !license.valid}
function create_if_block_22(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-1sqt39u");
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

// (402:6) {:else}
function create_else_block_5(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Activate Pro to set custom WBGT thresholds";
			attr(div, "class", "fg-gate-msg svelte-1sqt39u");
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

// (388:6) {#if license.valid}
function create_if_block_21(ctx) {
	let div0;
	let t1;
	let label0;
	let t2;
	let div1;
	let input0;
	let t3;
	let span0;
	let t4_value = /*settings*/ ctx[20].wbgtWarnC + "";
	let t4;
	let t5;
	let t6;
	let label1;
	let t7;
	let div2;
	let input1;
	let t8;
	let span1;
	let t9_value = /*settings*/ ctx[20].wbgtDangerC + "";
	let t9;
	let t10;
	let mounted;
	let dispose;

	return {
		c() {
			div0 = element("div");
			div0.textContent = "WBGT thresholds are used for FIDIC reports alongside the zone system.";
			t1 = space();
			label0 = element("label");
			t2 = text("Warning (°C)\n          ");
			div1 = element("div");
			input0 = element("input");
			t3 = space();
			span0 = element("span");
			t4 = text(t4_value);
			t5 = text("°C");
			t6 = space();
			label1 = element("label");
			t7 = text("Danger (°C)\n          ");
			div2 = element("div");
			input1 = element("input");
			t8 = space();
			span1 = element("span");
			t9 = text(t9_value);
			t10 = text("°C");
			attr(div0, "class", "fg-note svelte-1sqt39u");
			attr(input0, "type", "range");
			attr(input0, "min", "28");
			attr(input0, "max", "38");
			attr(input0, "step", "0.5");
			attr(input0, "class", "svelte-1sqt39u");
			attr(span0, "class", "svelte-1sqt39u");
			attr(div1, "class", "fg-slider-row svelte-1sqt39u");
			attr(label0, "class", "svelte-1sqt39u");
			attr(input1, "type", "range");
			attr(input1, "min", "30");
			attr(input1, "max", "42");
			attr(input1, "step", "0.5");
			attr(input1, "class", "svelte-1sqt39u");
			attr(span1, "class", "svelte-1sqt39u");
			attr(div2, "class", "fg-slider-row svelte-1sqt39u");
			attr(label1, "class", "svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, label0, anchor);
			append(label0, t2);
			append(label0, div1);
			append(div1, input0);
			set_input_value(input0, /*settings*/ ctx[20].wbgtWarnC);
			append(div1, t3);
			append(div1, span0);
			append(span0, t4);
			append(span0, t5);
			insert(target, t6, anchor);
			insert(target, label1, anchor);
			append(label1, t7);
			append(label1, div2);
			append(div2, input1);
			set_input_value(input1, /*settings*/ ctx[20].wbgtDangerC);
			append(div2, t8);
			append(div2, span1);
			append(span1, t9);
			append(span1, t10);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_input_handler*/ ctx[53]),
					listen(input0, "input", /*input0_change_input_handler*/ ctx[53]),
					listen(input0, "change", /*saveSettings*/ ctx[27]),
					listen(input1, "change", /*input1_change_input_handler*/ ctx[54]),
					listen(input1, "input", /*input1_change_input_handler*/ ctx[54]),
					listen(input1, "change", /*saveSettings*/ ctx[27])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 1048576) {
				set_input_value(input0, /*settings*/ ctx[20].wbgtWarnC);
			}

			if (dirty[0] & /*settings*/ 1048576 && t4_value !== (t4_value = /*settings*/ ctx[20].wbgtWarnC + "")) set_data(t4, t4_value);

			if (dirty[0] & /*settings*/ 1048576) {
				set_input_value(input1, /*settings*/ ctx[20].wbgtDangerC);
			}

			if (dirty[0] & /*settings*/ 1048576 && t9_value !== (t9_value = /*settings*/ ctx[20].wbgtDangerC + "")) set_data(t9, t9_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(label0);
				detach(t6);
				detach(label1);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (411:8) {#if !license.valid}
function create_if_block_20(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-1sqt39u");
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

// (426:6) {:else}
function create_else_block_4(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Activate Pro to set custom wind thresholds";
			attr(div, "class", "fg-gate-msg svelte-1sqt39u");
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

// (413:6) {#if license.valid}
function create_if_block_19(ctx) {
	let label0;
	let t0;
	let div0;
	let input0;
	let t1;
	let span0;
	let t2_value = /*settings*/ ctx[20].windWarnMs + "";
	let t2;
	let t3;
	let t4;
	let label1;
	let t5;
	let div1;
	let input1;
	let t6;
	let span1;
	let t7_value = /*settings*/ ctx[20].windDangerMs + "";
	let t7;
	let t8;
	let mounted;
	let dispose;

	return {
		c() {
			label0 = element("label");
			t0 = text("Warning (m/s)\n          ");
			div0 = element("div");
			input0 = element("input");
			t1 = space();
			span0 = element("span");
			t2 = text(t2_value);
			t3 = text(" m/s");
			t4 = space();
			label1 = element("label");
			t5 = text("Danger (m/s)\n          ");
			div1 = element("div");
			input1 = element("input");
			t6 = space();
			span1 = element("span");
			t7 = text(t7_value);
			t8 = text(" m/s");
			attr(input0, "type", "range");
			attr(input0, "min", "5");
			attr(input0, "max", "25");
			attr(input0, "step", "0.5");
			attr(input0, "class", "svelte-1sqt39u");
			attr(span0, "class", "svelte-1sqt39u");
			attr(div0, "class", "fg-slider-row svelte-1sqt39u");
			attr(label0, "class", "svelte-1sqt39u");
			attr(input1, "type", "range");
			attr(input1, "min", "10");
			attr(input1, "max", "35");
			attr(input1, "step", "0.5");
			attr(input1, "class", "svelte-1sqt39u");
			attr(span1, "class", "svelte-1sqt39u");
			attr(div1, "class", "fg-slider-row svelte-1sqt39u");
			attr(label1, "class", "svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, label0, anchor);
			append(label0, t0);
			append(label0, div0);
			append(div0, input0);
			set_input_value(input0, /*settings*/ ctx[20].windWarnMs);
			append(div0, t1);
			append(div0, span0);
			append(span0, t2);
			append(span0, t3);
			insert(target, t4, anchor);
			insert(target, label1, anchor);
			append(label1, t5);
			append(label1, div1);
			append(div1, input1);
			set_input_value(input1, /*settings*/ ctx[20].windDangerMs);
			append(div1, t6);
			append(div1, span1);
			append(span1, t7);
			append(span1, t8);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_input_handler_1*/ ctx[55]),
					listen(input0, "input", /*input0_change_input_handler_1*/ ctx[55]),
					listen(input0, "change", /*saveSettings*/ ctx[27]),
					listen(input1, "change", /*input1_change_input_handler_1*/ ctx[56]),
					listen(input1, "input", /*input1_change_input_handler_1*/ ctx[56]),
					listen(input1, "change", /*saveSettings*/ ctx[27])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 1048576) {
				set_input_value(input0, /*settings*/ ctx[20].windWarnMs);
			}

			if (dirty[0] & /*settings*/ 1048576 && t2_value !== (t2_value = /*settings*/ ctx[20].windWarnMs + "")) set_data(t2, t2_value);

			if (dirty[0] & /*settings*/ 1048576) {
				set_input_value(input1, /*settings*/ ctx[20].windDangerMs);
			}

			if (dirty[0] & /*settings*/ 1048576 && t7_value !== (t7_value = /*settings*/ ctx[20].windDangerMs + "")) set_data(t7, t7_value);
		},
		d(detaching) {
			if (detaching) {
				detach(label0);
				detach(t4);
				detach(label1);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (435:8) {#if !license.valid}
function create_if_block_18(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-1sqt39u");
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

// (450:6) {:else}
function create_else_block_3(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Activate Pro to set custom rain thresholds";
			attr(div, "class", "fg-gate-msg svelte-1sqt39u");
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

// (437:6) {#if license.valid}
function create_if_block_17(ctx) {
	let label0;
	let t0;
	let div0;
	let input0;
	let t1;
	let span0;
	let t2_value = /*settings*/ ctx[20].rainWarnMmh + "";
	let t2;
	let t3;
	let t4;
	let label1;
	let t5;
	let div1;
	let input1;
	let t6;
	let span1;
	let t7_value = /*settings*/ ctx[20].rainDangerMmh + "";
	let t7;
	let t8;
	let mounted;
	let dispose;

	return {
		c() {
			label0 = element("label");
			t0 = text("Warning (mm/h)\n          ");
			div0 = element("div");
			input0 = element("input");
			t1 = space();
			span0 = element("span");
			t2 = text(t2_value);
			t3 = text(" mm/h");
			t4 = space();
			label1 = element("label");
			t5 = text("Danger (mm/h)\n          ");
			div1 = element("div");
			input1 = element("input");
			t6 = space();
			span1 = element("span");
			t7 = text(t7_value);
			t8 = text(" mm/h");
			attr(input0, "type", "range");
			attr(input0, "min", "1");
			attr(input0, "max", "25");
			attr(input0, "step", "0.5");
			attr(input0, "class", "svelte-1sqt39u");
			attr(span0, "class", "svelte-1sqt39u");
			attr(div0, "class", "fg-slider-row svelte-1sqt39u");
			attr(label0, "class", "svelte-1sqt39u");
			attr(input1, "type", "range");
			attr(input1, "min", "5");
			attr(input1, "max", "60");
			attr(input1, "step", "1");
			attr(input1, "class", "svelte-1sqt39u");
			attr(span1, "class", "svelte-1sqt39u");
			attr(div1, "class", "fg-slider-row svelte-1sqt39u");
			attr(label1, "class", "svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, label0, anchor);
			append(label0, t0);
			append(label0, div0);
			append(div0, input0);
			set_input_value(input0, /*settings*/ ctx[20].rainWarnMmh);
			append(div0, t1);
			append(div0, span0);
			append(span0, t2);
			append(span0, t3);
			insert(target, t4, anchor);
			insert(target, label1, anchor);
			append(label1, t5);
			append(label1, div1);
			append(div1, input1);
			set_input_value(input1, /*settings*/ ctx[20].rainDangerMmh);
			append(div1, t6);
			append(div1, span1);
			append(span1, t7);
			append(span1, t8);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_input_handler_2*/ ctx[57]),
					listen(input0, "input", /*input0_change_input_handler_2*/ ctx[57]),
					listen(input0, "change", /*saveSettings*/ ctx[27]),
					listen(input1, "change", /*input1_change_input_handler_2*/ ctx[58]),
					listen(input1, "input", /*input1_change_input_handler_2*/ ctx[58]),
					listen(input1, "change", /*saveSettings*/ ctx[27])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 1048576) {
				set_input_value(input0, /*settings*/ ctx[20].rainWarnMmh);
			}

			if (dirty[0] & /*settings*/ 1048576 && t2_value !== (t2_value = /*settings*/ ctx[20].rainWarnMmh + "")) set_data(t2, t2_value);

			if (dirty[0] & /*settings*/ 1048576) {
				set_input_value(input1, /*settings*/ ctx[20].rainDangerMmh);
			}

			if (dirty[0] & /*settings*/ 1048576 && t7_value !== (t7_value = /*settings*/ ctx[20].rainDangerMmh + "")) set_data(t7, t7_value);
		},
		d(detaching) {
			if (detaching) {
				detach(label0);
				detach(t4);
				detach(label1);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (466:8) {#if !license.valid}
function create_if_block_16(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-1sqt39u");
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

// (470:4) {#if license.valid}
function create_if_block_15(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "↩ Reset to Defaults";
			attr(button, "class", "fg-btn fg-btn-secondary svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*resetSettings*/ ctx[28]);
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

// (274:4) {:else}
function create_else_block_2(ctx) {
	let div0;
	let t1;
	let div1;
	let t3;
	let div2;
	let label0;
	let t4;
	let input0;
	let t5;
	let label1;
	let t6;
	let input1;
	let t7;
	let label2;
	let t8;
	let input2;
	let t9;
	let label3;
	let t10;
	let input3;
	let t11;
	let label4;
	let t12;
	let input4;
	let t13;
	let label5;
	let t14;
	let input5;
	let t15;
	let label6;
	let t16;
	let input6;
	let t17;
	let label7;
	let t18;
	let input7;
	let t19;
	let label8;
	let t20;
	let input8;
	let t21;
	let label9;
	let t22;
	let input9;
	let t23;
	let label10;
	let t24;
	let select;
	let option0;
	let option1;
	let option2;
	let t28;
	let label11;
	let t29;
	let input10;
	let t30;
	let button;
	let t32;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*reportText*/ ctx[15] && create_if_block_13(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = "📄 Weekly ISO 7933 Report";
			t1 = space();
			div1 = element("div");
			div1.textContent = "ISO 7933:2004 / ISO 7243:2017 / FIDIC Clause 8.4";
			t3 = space();
			div2 = element("div");
			label0 = element("label");
			t4 = text("Project Name");
			input0 = element("input");
			t5 = space();
			label1 = element("label");
			t6 = text("Contract No.");
			input1 = element("input");
			t7 = space();
			label2 = element("label");
			t8 = text("Country / Jurisdiction");
			input2 = element("input");
			t9 = space();
			label3 = element("label");
			t10 = text("Client / Employer");
			input3 = element("input");
			t11 = space();
			label4 = element("label");
			t12 = text("Main Contractor");
			input4 = element("input");
			t13 = space();
			label5 = element("label");
			t14 = text("HSE Manager");
			input5 = element("input");
			t15 = space();
			label6 = element("label");
			t16 = text("Regulatory Reference");
			input6 = element("input");
			t17 = space();
			label7 = element("label");
			t18 = text("Work Ban Start");
			input7 = element("input");
			t19 = space();
			label8 = element("label");
			t20 = text("Work Ban End");
			input8 = element("input");
			t21 = space();
			label9 = element("label");
			t22 = text("Ban Months");
			input9 = element("input");
			t23 = space();
			label10 = element("label");
			t24 = text("FIDIC Assessment\n        ");
			select = element("select");
			option0 = element("option");
			option0.textContent = "ELIGIBLE";
			option1 = element("option");
			option1.textContent = "NOT ELIGIBLE";
			option2 = element("option");
			option2.textContent = "UNDER REVIEW";
			t28 = space();
			label11 = element("label");
			t29 = text("Est. Delay Days");
			input10 = element("input");
			t30 = space();
			button = element("button");
			button.textContent = "📋 Generate ISO 7933 Report";
			t32 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div0, "class", "fg-section-title svelte-1sqt39u");
			attr(div1, "class", "fg-report-note svelte-1sqt39u");
			attr(input0, "placeholder", "Site/Project Name");
			attr(input0, "class", "svelte-1sqt39u");
			attr(label0, "class", "svelte-1sqt39u");
			attr(input1, "placeholder", "CONTRACT-001");
			attr(input1, "class", "svelte-1sqt39u");
			attr(label1, "class", "svelte-1sqt39u");
			attr(input2, "placeholder", "Oman, UAE, Qatar…");
			attr(input2, "class", "svelte-1sqt39u");
			attr(label2, "class", "svelte-1sqt39u");
			attr(input3, "placeholder", "Client Name");
			attr(input3, "class", "svelte-1sqt39u");
			attr(label3, "class", "svelte-1sqt39u");
			attr(input4, "placeholder", "Contractor Name");
			attr(input4, "class", "svelte-1sqt39u");
			attr(label4, "class", "svelte-1sqt39u");
			attr(input5, "placeholder", "Name, Cert. No.");
			attr(input5, "class", "svelte-1sqt39u");
			attr(label5, "class", "svelte-1sqt39u");
			attr(input6, "placeholder", "e.g. Min. Decision 286/2008");
			attr(input6, "class", "svelte-1sqt39u");
			attr(label6, "class", "svelte-1sqt39u");
			attr(input7, "placeholder", "12:30");
			attr(input7, "class", "svelte-1sqt39u");
			attr(label7, "class", "svelte-1sqt39u");
			attr(input8, "placeholder", "15:30");
			attr(input8, "class", "svelte-1sqt39u");
			attr(label8, "class", "svelte-1sqt39u");
			attr(input9, "placeholder", "June, July, August");
			attr(input9, "class", "svelte-1sqt39u");
			attr(label9, "class", "svelte-1sqt39u");
			option0.__value = "ELIGIBLE";
			set_input_value(option0, option0.__value);
			option1.__value = "NOT ELIGIBLE";
			set_input_value(option1, option1.__value);
			option2.__value = "UNDER REVIEW";
			set_input_value(option2, option2.__value);
			attr(select, "class", "svelte-1sqt39u");
			if (/*reportMeta*/ ctx[21].fidic === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[48].call(select));
			attr(label10, "class", "svelte-1sqt39u");
			attr(input10, "type", "number");
			attr(input10, "min", "0");
			attr(input10, "class", "svelte-1sqt39u");
			attr(label11, "class", "svelte-1sqt39u");
			attr(div2, "class", "fg-form svelte-1sqt39u");
			attr(button, "class", "fg-btn fg-btn-primary svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			insert(target, t3, anchor);
			insert(target, div2, anchor);
			append(div2, label0);
			append(label0, t4);
			append(label0, input0);
			set_input_value(input0, /*reportMeta*/ ctx[21].projectName);
			append(div2, t5);
			append(div2, label1);
			append(label1, t6);
			append(label1, input1);
			set_input_value(input1, /*reportMeta*/ ctx[21].contractNumber);
			append(div2, t7);
			append(div2, label2);
			append(label2, t8);
			append(label2, input2);
			set_input_value(input2, /*reportMeta*/ ctx[21].country);
			append(div2, t9);
			append(div2, label3);
			append(label3, t10);
			append(label3, input3);
			set_input_value(input3, /*reportMeta*/ ctx[21].clientName);
			append(div2, t11);
			append(div2, label4);
			append(label4, t12);
			append(label4, input4);
			set_input_value(input4, /*reportMeta*/ ctx[21].contractorName);
			append(div2, t13);
			append(div2, label5);
			append(label5, t14);
			append(label5, input5);
			set_input_value(input5, /*reportMeta*/ ctx[21].hseManagerName);
			append(div2, t15);
			append(div2, label6);
			append(label6, t16);
			append(label6, input6);
			set_input_value(input6, /*reportMeta*/ ctx[21].regulatoryRef);
			append(div2, t17);
			append(div2, label7);
			append(label7, t18);
			append(label7, input7);
			set_input_value(input7, /*reportMeta*/ ctx[21].banStart);
			append(div2, t19);
			append(div2, label8);
			append(label8, t20);
			append(label8, input8);
			set_input_value(input8, /*reportMeta*/ ctx[21].banEnd);
			append(div2, t21);
			append(div2, label9);
			append(label9, t22);
			append(label9, input9);
			set_input_value(input9, /*reportMeta*/ ctx[21].banMonths);
			append(div2, t23);
			append(div2, label10);
			append(label10, t24);
			append(label10, select);
			append(select, option0);
			append(select, option1);
			append(select, option2);
			select_option(select, /*reportMeta*/ ctx[21].fidic, true);
			append(div2, t28);
			append(div2, label11);
			append(label11, t29);
			append(label11, input10);
			set_input_value(input10, /*reportMeta*/ ctx[21].delayDays);
			insert(target, t30, anchor);
			insert(target, button, anchor);
			insert(target, t32, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[38]),
					listen(input1, "input", /*input1_input_handler*/ ctx[39]),
					listen(input2, "input", /*input2_input_handler*/ ctx[40]),
					listen(input3, "input", /*input3_input_handler*/ ctx[41]),
					listen(input4, "input", /*input4_input_handler*/ ctx[42]),
					listen(input5, "input", /*input5_input_handler*/ ctx[43]),
					listen(input6, "input", /*input6_input_handler*/ ctx[44]),
					listen(input7, "input", /*input7_input_handler*/ ctx[45]),
					listen(input8, "input", /*input8_input_handler*/ ctx[46]),
					listen(input9, "input", /*input9_input_handler*/ ctx[47]),
					listen(select, "change", /*select_change_handler_1*/ ctx[48]),
					listen(input10, "input", /*input10_input_handler*/ ctx[49]),
					listen(button, "click", /*generateReport*/ ctx[30])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*reportMeta*/ 2097152 && input0.value !== /*reportMeta*/ ctx[21].projectName) {
				set_input_value(input0, /*reportMeta*/ ctx[21].projectName);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input1.value !== /*reportMeta*/ ctx[21].contractNumber) {
				set_input_value(input1, /*reportMeta*/ ctx[21].contractNumber);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input2.value !== /*reportMeta*/ ctx[21].country) {
				set_input_value(input2, /*reportMeta*/ ctx[21].country);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input3.value !== /*reportMeta*/ ctx[21].clientName) {
				set_input_value(input3, /*reportMeta*/ ctx[21].clientName);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input4.value !== /*reportMeta*/ ctx[21].contractorName) {
				set_input_value(input4, /*reportMeta*/ ctx[21].contractorName);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input5.value !== /*reportMeta*/ ctx[21].hseManagerName) {
				set_input_value(input5, /*reportMeta*/ ctx[21].hseManagerName);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input6.value !== /*reportMeta*/ ctx[21].regulatoryRef) {
				set_input_value(input6, /*reportMeta*/ ctx[21].regulatoryRef);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input7.value !== /*reportMeta*/ ctx[21].banStart) {
				set_input_value(input7, /*reportMeta*/ ctx[21].banStart);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input8.value !== /*reportMeta*/ ctx[21].banEnd) {
				set_input_value(input8, /*reportMeta*/ ctx[21].banEnd);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && input9.value !== /*reportMeta*/ ctx[21].banMonths) {
				set_input_value(input9, /*reportMeta*/ ctx[21].banMonths);
			}

			if (dirty[0] & /*reportMeta*/ 2097152) {
				select_option(select, /*reportMeta*/ ctx[21].fidic);
			}

			if (dirty[0] & /*reportMeta*/ 2097152 && to_number(input10.value) !== /*reportMeta*/ ctx[21].delayDays) {
				set_input_value(input10, /*reportMeta*/ ctx[21].delayDays);
			}

			if (/*reportText*/ ctx[15]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_13(ctx);
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
				detach(t3);
				detach(div2);
				detach(t30);
				detach(button);
				detach(t32);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (264:4) {#if !license.valid}
function create_if_block_12(ctx) {
	let div3;

	return {
		c() {
			div3 = element("div");

			div3.innerHTML = `<div class="fg-pro-gate-icon svelte-1sqt39u">📄</div> <div class="fg-pro-gate-title svelte-1sqt39u">ISO 7933 Weekly Report</div> <div class="fg-pro-gate-desc svelte-1sqt39u">Generate ISO 7933-compliant weekly HSE audit reports with FIDIC Clause 8.4
          delay evidence, PPE-adjusted WBGT logs, and Morning Gap analysis.</div> <a class="fg-buy-btn svelte-1sqt39u" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a>`;

			attr(div3, "class", "fg-pro-gate svelte-1sqt39u");
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

// (301:4) {#if reportText}
function create_if_block_13(ctx) {
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
			span.textContent = "Report Ready";
			t1 = space();
			button0 = element("button");
			button0.textContent = "📋 Copy";
			t3 = space();
			button1 = element("button");
			button1.textContent = "⬇ Download .txt";
			t5 = space();
			pre = element("pre");
			t6 = text(/*reportText*/ ctx[15]);
			attr(span, "class", "svelte-1sqt39u");
			attr(button0, "class", "fg-mini-btn svelte-1sqt39u");
			attr(button1, "class", "fg-mini-btn svelte-1sqt39u");
			attr(div0, "class", "fg-report-toolbar svelte-1sqt39u");
			attr(pre, "class", "fg-report-text svelte-1sqt39u");
			attr(div1, "class", "fg-report-preview svelte-1sqt39u");
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
					listen(button0, "click", /*copyReport*/ ctx[31]),
					listen(button1, "click", /*downloadReport*/ ctx[32])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*reportText*/ 32768) set_data(t6, /*reportText*/ ctx[15]);
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

// (221:4) {:else}
function create_else_block(ctx) {
	let div0;
	let t1;
	let div7;
	let div1;
	let t3;
	let div2;
	let t5;
	let div4;
	let div3;
	let t7;
	let t8;
	let div6;
	let div5;
	let t10;
	let t11;
	let div9;
	let div8;
	let t13;
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

	function select_block_type_3(ctx, dirty) {
		if (/*alertLog*/ ctx[14].length === 0) return create_if_block_10;
		return create_else_block_1;
	}

	let current_block_type = select_block_type_3(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = "🚨 Emergency Response";
			t1 = space();
			div7 = element("div");
			div1 = element("div");
			div1.textContent = "⚠ Heat Stress Is Life-Threatening";
			t3 = space();
			div2 = element("div");
			div2.textContent = "The body starts shutting down and cannot recover without help.";
			t5 = space();
			div4 = element("div");
			div3 = element("div");
			div3.textContent = "🔴 SYMPTOMS TO MONITOR (every 2 hours)";
			t7 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t8 = space();
			div6 = element("div");
			div5 = element("div");
			div5.textContent = "🚑 IMMEDIATE RESPONSE STEPS";
			t10 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t11 = space();
			div9 = element("div");
			div8 = element("div");
			div8.textContent = "📋 Alerts Log (This Session)";
			t13 = space();
			if_block.c();
			attr(div0, "class", "fg-section-title svelte-1sqt39u");
			attr(div1, "class", "fg-emg-title svelte-1sqt39u");
			attr(div2, "class", "fg-emg-sub svelte-1sqt39u");
			attr(div3, "class", "fg-emg-label svelte-1sqt39u");
			attr(div4, "class", "fg-emg-section svelte-1sqt39u");
			attr(div5, "class", "fg-emg-label svelte-1sqt39u");
			attr(div6, "class", "fg-emg-section svelte-1sqt39u");
			attr(div7, "class", "fg-emergency-card svelte-1sqt39u");
			attr(div8, "class", "fg-card-header svelte-1sqt39u");
			attr(div9, "class", "fg-card svelte-1sqt39u");
			set_style(div9, "border-color", "#d97706");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div7, anchor);
			append(div7, div1);
			append(div7, t3);
			append(div7, div2);
			append(div7, t5);
			append(div7, div4);
			append(div4, div3);
			append(div4, t7);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div4, null);
				}
			}

			append(div7, t8);
			append(div7, div6);
			append(div6, div5);
			append(div6, t10);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div6, null);
				}
			}

			insert(target, t11, anchor);
			insert(target, div9, anchor);
			append(div9, div8);
			append(div9, t13);
			if_block.m(div9, null);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div9, null);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div7);
				detach(t11);
				detach(div9);
			}

			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			if_block.d();
		}
	};
}

// (211:4) {#if !license.valid}
function create_if_block_9(ctx) {
	let div3;

	return {
		c() {
			div3 = element("div");

			div3.innerHTML = `<div class="fg-pro-gate-icon svelte-1sqt39u">🚨</div> <div class="fg-pro-gate-title svelte-1sqt39u">SOS Emergency Response</div> <div class="fg-pro-gate-desc svelte-1sqt39u">Real-time emergency response steps, heat stress symptom checklist,
          and session alert history — available in FieldGuard Pro.</div> <a class="fg-buy-btn svelte-1sqt39u" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a>`;

			attr(div3, "class", "fg-pro-gate svelte-1sqt39u");
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

// (230:8) {#each HEAT_STRESS_SYMPTOMS as s}
function create_each_block_5(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = `● ${/*s*/ ctx[84]}`;
			attr(div, "class", "fg-emg-item svelte-1sqt39u");
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

// (237:8) {#each EMERGENCY_RESPONSE as step, i}
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
			span.textContent = `${/*i*/ ctx[83] + 1}`;
			t1 = space();
			t2 = text(/*step*/ ctx[81]);
			t3 = space();
			attr(span, "class", "fg-emg-num svelte-1sqt39u");

			attr(div, "class", "fg-emg-step " + (/*step*/ ctx[81].includes('SEVERE')
			? 'fg-emg-critical'
			: '') + " svelte-1sqt39u");
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

// (249:6) {:else}
function create_else_block_1(ctx) {
	let each_1_anchor;
	let each_value_3 = ensure_array_like([.../*alertLog*/ ctx[14]].reverse().slice(0, 15));
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
				detach(each_1_anchor);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (247:6) {#if alertLog.length === 0}
function create_if_block_10(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "No alerts triggered yet.";
			attr(div, "class", "fg-empty svelte-1sqt39u");
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

// (250:8) {#each [...alertLog].reverse().slice(0, 15) as alert}
function create_each_block_3(ctx) {
	let div3;
	let div0;
	let t0_value = /*alert*/ ctx[78].time + "";
	let t0;
	let t1;
	let div1;
	let t2_value = /*alert*/ ctx[78].type + "";
	let t2;
	let t3;
	let div2;
	let t4_value = /*alert*/ ctx[78].message + "";
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
			attr(div0, "class", "fg-alert-time svelte-1sqt39u");
			attr(div1, "class", "fg-alert-type svelte-1sqt39u");
			attr(div2, "class", "fg-alert-msg svelte-1sqt39u");
			attr(div3, "class", "fg-alert-item svelte-1sqt39u");
			set_style(div3, "border-left", "3px solid " + /*alert*/ ctx[78].color);
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
			if (dirty[0] & /*alertLog*/ 16384 && t0_value !== (t0_value = /*alert*/ ctx[78].time + "")) set_data(t0, t0_value);
			if (dirty[0] & /*alertLog*/ 16384 && t2_value !== (t2_value = /*alert*/ ctx[78].type + "")) set_data(t2, t2_value);
			if (dirty[0] & /*alertLog*/ 16384 && t4_value !== (t4_value = /*alert*/ ctx[78].message + "")) set_data(t4, t4_value);

			if (dirty[0] & /*alertLog*/ 16384) {
				set_style(div3, "border-left", "3px solid " + /*alert*/ ctx[78].color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (36:8) {#each MODELS as m}
function create_each_block_2(ctx) {
	let option;
	let t_1_value = /*m*/ ctx[75].label + "";
	let t_1;

	return {
		c() {
			option = element("option");
			t_1 = text(t_1_value);
			option.__value = /*m*/ ctx[75].key;
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

// (41:20) {#if !license.valid}
function create_if_block_7(ctx) {
	let t0;
	let span;

	return {
		c() {
			t0 = text(" ");
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(span);
			}
		}
	};
}

// (49:19) 
function create_if_block_3(ctx) {
	let t0;
	let div6;
	let div0;
	let t1;
	let div4;
	let div1;
	let t2_value = /*heat*/ ctx[7].zoneInfo.riskLabel + "";
	let t2;
	let t3;
	let div2;
	let t4_value = /*heat*/ ctx[7].zoneInfo.label + "";
	let t4;
	let t5;
	let div3;
	let t6;

	let t7_value = (/*heat*/ ctx[7].apparentTempFinal === 999
	? 'NO WORK'
	: /*heat*/ ctx[7].apparentTempFinal + '°C') + "";

	let t7;
	let t8;
	let t9_value = /*heat*/ ctx[7].wbgtAdjusted + "";
	let t9;
	let t10;
	let t11;
	let div5;
	let t12;
	let t13;
	let div33;
	let div7;
	let t15;
	let div26;
	let div10;
	let div8;
	let t16_value = /*rawData*/ ctx[6]?.tempC + "";
	let t16;
	let t17;
	let t18;
	let div9;
	let t20;
	let div13;
	let div11;
	let t21_value = /*rawData*/ ctx[6]?.humidity + "";
	let t21;
	let t22;
	let t23;
	let div12;
	let t25;
	let div16;
	let div14;
	let t26_value = /*heat*/ ctx[7].apparentTemp1 + "";
	let t26;
	let t27;
	let t28;
	let div15;
	let t30;
	let div19;
	let div17;

	let t31_value = (/*heat*/ ctx[7].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[7].apparentTempFinal + '°C') + "";

	let t31;
	let t32;
	let div18;
	let t34;
	let div22;
	let div20;
	let t35_value = /*heat*/ ctx[7].wbgtBase + "";
	let t35;
	let t36;
	let t37;
	let div21;
	let t39;
	let div25;
	let div23;
	let t40_value = /*heat*/ ctx[7].wbgtAdjusted + "";
	let t40;
	let t41;
	let t42;
	let div24;
	let t44;
	let div31;
	let div27;
	let span0;
	let t46;
	let span1;
	let t48;
	let span2;
	let t49_value = /*heat*/ ctx[7].workRestSchedule.light + "";
	let t49;
	let t50;
	let div28;
	let span3;
	let t52;
	let span4;
	let t54;
	let span5;
	let t55_value = /*heat*/ ctx[7].workRestSchedule.heavy + "";
	let t55;
	let t56;
	let div29;
	let span6;
	let t58;
	let span7;
	let t60;
	let span8;
	let t61_value = /*heat*/ ctx[7].hydration + "";
	let t61;
	let t62;
	let div30;
	let span9;
	let t64;
	let span10;
	let t66;
	let span11;
	let t67_value = /*heat*/ ctx[7].zoneInfo.monitoringSchedule + "";
	let t67;
	let t68;
	let div32;
	let t69;
	let t70_value = PPE_PROFILES[/*settings*/ ctx[20].ppeProfile].label + "";
	let t70;
	let t71;
	let t72_value = PPE_PROFILES[/*settings*/ ctx[20].ppeProfile].adjustment + "";
	let t72;
	let t73;
	let t74;
	let t75;
	let div35;
	let div34;
	let t76;
	let t77_value = /*heat*/ ctx[7].zoneInfo.riskLabel + "";
	let t77;
	let t78;
	let t79;
	let t80;
	let div48;
	let div36;
	let t81;
	let span12;
	let t82_value = /*windResult*/ ctx[8]?.riskLabel + "";
	let t82;
	let t83;
	let div46;
	let div39;
	let div37;
	let t84_value = /*rawData*/ ctx[6]?.windMs.toFixed(1) + "";
	let t84;
	let t85;
	let t86;
	let div38;
	let t88;
	let div42;
	let div40;
	let t89_value = ((/*rawData*/ ctx[6]?.windMs ?? 0) * 3.6).toFixed(1) + "";
	let t89;
	let t90;
	let t91;
	let div41;
	let t93;
	let div45;
	let div43;
	let t94;
	let t95_value = /*windResult*/ ctx[8]?.beaufort + "";
	let t95;
	let t96;
	let div44;
	let t97_value = /*windResult*/ ctx[8]?.beaufortDesc + "";
	let t97;
	let t98;
	let div47;
	let t99;
	let t100_value = /*settings*/ ctx[20].windWarnMs + "";
	let t100;
	let t101;
	let t102_value = /*settings*/ ctx[20].windDangerMs + "";
	let t102;
	let t103;
	let t104;
	let div61;
	let div49;
	let t105;
	let span13;
	let t106_value = /*rainResult*/ ctx[9]?.riskLabel + "";
	let t106;
	let t107;
	let div59;
	let div52;
	let div50;
	let t108_value = /*rawData*/ ctx[6]?.rainMmH.toFixed(1) + "";
	let t108;
	let t109;
	let t110;
	let div51;
	let t112;
	let div55;
	let div53;
	let t113_value = /*rainResult*/ ctx[9]?.intensityLabel + "";
	let t113;
	let t114;
	let div54;
	let t116;
	let div58;
	let div56;
	let t117_value = /*rawData*/ ctx[6]?.solarWm2 + "";
	let t117;
	let t118;
	let t119;
	let div57;
	let t121;
	let div60;
	let t122;
	let t123_value = /*settings*/ ctx[20].rainWarnMmh + "";
	let t123;
	let t124;
	let t125_value = /*settings*/ ctx[20].rainDangerMmh + "";
	let t125;
	let t126;
	let t127;
	let if_block2_anchor;
	let if_block0 = /*heat*/ ctx[7].isBanPeriod && create_if_block_6();
	let if_block1 = /*worstCaseMode*/ ctx[13] && /*worstModelLabel*/ ctx[11] && create_if_block_5(ctx);
	let each_value_1 = ensure_array_like(/*heat*/ ctx[7].zoneInfo.mandatoryControls);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let if_block2 = /*worstCaseMode*/ ctx[13] && /*modelResults*/ ctx[10].length > 1 && create_if_block_4(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			div6 = element("div");
			div0 = element("div");
			t1 = space();
			div4 = element("div");
			div1 = element("div");
			t2 = text(t2_value);
			t3 = space();
			div2 = element("div");
			t4 = text(t4_value);
			t5 = space();
			div3 = element("div");
			t6 = text("Apparent Temp: ");
			t7 = text(t7_value);
			t8 = text(" | WBGT+PPE: ");
			t9 = text(t9_value);
			t10 = text("°C");
			t11 = space();
			div5 = element("div");
			t12 = text(/*currentTime*/ ctx[5]);
			t13 = space();
			div33 = element("div");
			div7 = element("div");
			div7.textContent = "🌡 Heat Stress Analysis";
			t15 = space();
			div26 = element("div");
			div10 = element("div");
			div8 = element("div");
			t16 = text(t16_value);
			t17 = text("°C");
			t18 = space();
			div9 = element("div");
			div9.textContent = "Temp";
			t20 = space();
			div13 = element("div");
			div11 = element("div");
			t21 = text(t21_value);
			t22 = text("%");
			t23 = space();
			div12 = element("div");
			div12.textContent = "Humidity";
			t25 = space();
			div16 = element("div");
			div14 = element("div");
			t26 = text(t26_value);
			t27 = text("°C");
			t28 = space();
			div15 = element("div");
			div15.textContent = "App.Temp A";
			t30 = space();
			div19 = element("div");
			div17 = element("div");
			t31 = text(t31_value);
			t32 = space();
			div18 = element("div");
			div18.textContent = "App.Temp B";
			t34 = space();
			div22 = element("div");
			div20 = element("div");
			t35 = text(t35_value);
			t36 = text("°C");
			t37 = space();
			div21 = element("div");
			div21.textContent = "WBGT";
			t39 = space();
			div25 = element("div");
			div23 = element("div");
			t40 = text(t40_value);
			t41 = text("°C");
			t42 = space();
			div24 = element("div");
			div24.textContent = "WBGT+PPE";
			t44 = space();
			div31 = element("div");
			div27 = element("div");
			span0 = element("span");
			span0.textContent = "🕐";
			t46 = space();
			span1 = element("span");
			span1.textContent = "Light work:";
			t48 = space();
			span2 = element("span");
			t49 = text(t49_value);
			t50 = space();
			div28 = element("div");
			span3 = element("span");
			span3.textContent = "💪";
			t52 = space();
			span4 = element("span");
			span4.textContent = "Heavy work:";
			t54 = space();
			span5 = element("span");
			t55 = text(t55_value);
			t56 = space();
			div29 = element("div");
			span6 = element("span");
			span6.textContent = "💧";
			t58 = space();
			span7 = element("span");
			span7.textContent = "Hydration:";
			t60 = space();
			span8 = element("span");
			t61 = text(t61_value);
			t62 = space();
			div30 = element("div");
			span9 = element("span");
			span9.textContent = "👁";
			t64 = space();
			span10 = element("span");
			span10.textContent = "Monitoring:";
			t66 = space();
			span11 = element("span");
			t67 = text(t67_value);
			t68 = space();
			div32 = element("div");
			t69 = text("PPE: ");
			t70 = text(t70_value);
			t71 = text(" (+");
			t72 = text(t72_value);
			t73 = text("°C)");
			t74 = space();
			if (if_block1) if_block1.c();
			t75 = space();
			div35 = element("div");
			div34 = element("div");
			t76 = text("⚠ Mandatory Controls (");
			t77 = text(t77_value);
			t78 = text(")");
			t79 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t80 = space();
			div48 = element("div");
			div36 = element("div");
			t81 = text("💨 Wind\n          ");
			span12 = element("span");
			t82 = text(t82_value);
			t83 = space();
			div46 = element("div");
			div39 = element("div");
			div37 = element("div");
			t84 = text(t84_value);
			t85 = text(" m/s");
			t86 = space();
			div38 = element("div");
			div38.textContent = "Speed";
			t88 = space();
			div42 = element("div");
			div40 = element("div");
			t89 = text(t89_value);
			t90 = text(" km/h");
			t91 = space();
			div41 = element("div");
			div41.textContent = "km/h";
			t93 = space();
			div45 = element("div");
			div43 = element("div");
			t94 = text("Bft ");
			t95 = text(t95_value);
			t96 = space();
			div44 = element("div");
			t97 = text(t97_value);
			t98 = space();
			div47 = element("div");
			t99 = text("⚠ Warn: ");
			t100 = text(t100_value);
			t101 = text(" m/s  |  🛑 Danger: ");
			t102 = text(t102_value);
			t103 = text(" m/s");
			t104 = space();
			div61 = element("div");
			div49 = element("div");
			t105 = text("🌧 Rain\n          ");
			span13 = element("span");
			t106 = text(t106_value);
			t107 = space();
			div59 = element("div");
			div52 = element("div");
			div50 = element("div");
			t108 = text(t108_value);
			t109 = text(" mm/h");
			t110 = space();
			div51 = element("div");
			div51.textContent = "Rate";
			t112 = space();
			div55 = element("div");
			div53 = element("div");
			t113 = text(t113_value);
			t114 = space();
			div54 = element("div");
			div54.textContent = "Intensity";
			t116 = space();
			div58 = element("div");
			div56 = element("div");
			t117 = text(t117_value);
			t118 = text(" W/m²");
			t119 = space();
			div57 = element("div");
			div57.textContent = "Solar";
			t121 = space();
			div60 = element("div");
			t122 = text("⚠ Warn: ");
			t123 = text(t123_value);
			t124 = text(" mm/h  |  🛑 Danger: ");
			t125 = text(t125_value);
			t126 = text(" mm/h");
			t127 = space();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
			attr(div0, "class", "fg-zone-dot svelte-1sqt39u");
			set_style(div0, "background", /*heat*/ ctx[7].zoneInfo.color);
			attr(div1, "class", "fg-zone-name svelte-1sqt39u");
			set_style(div1, "color", /*heat*/ ctx[7].zoneInfo.color);
			attr(div2, "class", "fg-zone-label svelte-1sqt39u");
			attr(div3, "class", "fg-zone-sub svelte-1sqt39u");
			attr(div4, "class", "fg-zone-main svelte-1sqt39u");
			attr(div5, "class", "fg-zone-time svelte-1sqt39u");
			attr(div6, "class", "fg-zone-banner svelte-1sqt39u");
			set_style(div6, "background", /*heat*/ ctx[7].zoneInfo.bgColor);
			set_style(div6, "border-color", /*heat*/ ctx[7].zoneInfo.color);
			attr(div7, "class", "fg-card-header svelte-1sqt39u");
			attr(div8, "class", "fg-metric-val svelte-1sqt39u");
			attr(div9, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div10, "class", "fg-metric svelte-1sqt39u");
			attr(div11, "class", "fg-metric-val svelte-1sqt39u");
			attr(div12, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div13, "class", "fg-metric svelte-1sqt39u");
			attr(div14, "class", "fg-metric-val svelte-1sqt39u");
			attr(div15, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div16, "class", "fg-metric svelte-1sqt39u");
			attr(div17, "class", "fg-metric-val svelte-1sqt39u");
			set_style(div17, "color", /*heat*/ ctx[7].zoneInfo.color);
			attr(div18, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div19, "class", "fg-metric svelte-1sqt39u");
			attr(div20, "class", "fg-metric-val svelte-1sqt39u");
			attr(div21, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div22, "class", "fg-metric svelte-1sqt39u");
			attr(div23, "class", "fg-metric-val svelte-1sqt39u");

			set_style(div23, "color", /*heat*/ ctx[7].wbgtAdjusted >= /*settings*/ ctx[20].wbgtDangerC
			? '#dc2626'
			: /*heat*/ ctx[7].wbgtAdjusted >= /*settings*/ ctx[20].wbgtWarnC
				? '#f97316'
				: '#94a3b8');

			attr(div24, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div25, "class", "fg-metric svelte-1sqt39u");
			attr(div26, "class", "fg-metrics-grid svelte-1sqt39u");
			attr(span0, "class", "fg-ws-icon svelte-1sqt39u");
			attr(span1, "class", "fg-ws-label svelte-1sqt39u");
			attr(span2, "class", "fg-ws-val svelte-1sqt39u");
			attr(div27, "class", "fg-ws-row svelte-1sqt39u");
			attr(span3, "class", "fg-ws-icon svelte-1sqt39u");
			attr(span4, "class", "fg-ws-label svelte-1sqt39u");
			attr(span5, "class", "fg-ws-val svelte-1sqt39u");
			attr(div28, "class", "fg-ws-row svelte-1sqt39u");
			attr(span6, "class", "fg-ws-icon svelte-1sqt39u");
			attr(span7, "class", "fg-ws-label svelte-1sqt39u");
			attr(span8, "class", "fg-ws-val svelte-1sqt39u");
			attr(div29, "class", "fg-ws-row svelte-1sqt39u");
			attr(span9, "class", "fg-ws-icon svelte-1sqt39u");
			attr(span10, "class", "fg-ws-label svelte-1sqt39u");
			attr(span11, "class", "fg-ws-val svelte-1sqt39u");
			set_style(span11, "font-size", "9px");
			attr(div30, "class", "fg-ws-row svelte-1sqt39u");
			attr(div31, "class", "fg-work-schedule svelte-1sqt39u");
			attr(div32, "class", "fg-ppe-row svelte-1sqt39u");
			attr(div33, "class", "fg-card svelte-1sqt39u");
			set_style(div33, "border-color", /*heat*/ ctx[7].zoneInfo.color);
			attr(div34, "class", "fg-card-header svelte-1sqt39u");
			attr(div35, "class", "fg-card svelte-1sqt39u");
			set_style(div35, "border-color", /*heat*/ ctx[7].zoneInfo.color);
			attr(span12, "class", "fg-badge svelte-1sqt39u");
			set_style(span12, "background", /*windResult*/ ctx[8]?.riskColor);
			attr(div36, "class", "fg-card-header svelte-1sqt39u");
			attr(div37, "class", "fg-metric-val svelte-1sqt39u");
			attr(div38, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div39, "class", "fg-metric svelte-1sqt39u");
			attr(div40, "class", "fg-metric-val svelte-1sqt39u");
			attr(div41, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div42, "class", "fg-metric svelte-1sqt39u");
			attr(div43, "class", "fg-metric-val svelte-1sqt39u");
			attr(div44, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div45, "class", "fg-metric svelte-1sqt39u");
			attr(div46, "class", "fg-metrics-grid svelte-1sqt39u");
			attr(div47, "class", "fg-threshold-row svelte-1sqt39u");
			attr(div48, "class", "fg-card svelte-1sqt39u");
			set_style(div48, "border-color", /*windResult*/ ctx[8]?.riskColor);
			attr(span13, "class", "fg-badge svelte-1sqt39u");
			set_style(span13, "background", /*rainResult*/ ctx[9]?.riskColor);
			attr(div49, "class", "fg-card-header svelte-1sqt39u");
			attr(div50, "class", "fg-metric-val svelte-1sqt39u");
			attr(div51, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div52, "class", "fg-metric svelte-1sqt39u");
			attr(div53, "class", "fg-metric-val svelte-1sqt39u");
			attr(div54, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div55, "class", "fg-metric svelte-1sqt39u");
			attr(div56, "class", "fg-metric-val svelte-1sqt39u");
			attr(div57, "class", "fg-metric-lbl svelte-1sqt39u");
			attr(div58, "class", "fg-metric svelte-1sqt39u");
			attr(div59, "class", "fg-metrics-grid svelte-1sqt39u");
			attr(div60, "class", "fg-threshold-row svelte-1sqt39u");
			attr(div61, "class", "fg-card svelte-1sqt39u");
			set_style(div61, "border-color", /*rainResult*/ ctx[9]?.riskColor);
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			insert(target, div6, anchor);
			append(div6, div0);
			append(div6, t1);
			append(div6, div4);
			append(div4, div1);
			append(div1, t2);
			append(div4, t3);
			append(div4, div2);
			append(div2, t4);
			append(div4, t5);
			append(div4, div3);
			append(div3, t6);
			append(div3, t7);
			append(div3, t8);
			append(div3, t9);
			append(div3, t10);
			append(div6, t11);
			append(div6, div5);
			append(div5, t12);
			insert(target, t13, anchor);
			insert(target, div33, anchor);
			append(div33, div7);
			append(div33, t15);
			append(div33, div26);
			append(div26, div10);
			append(div10, div8);
			append(div8, t16);
			append(div8, t17);
			append(div10, t18);
			append(div10, div9);
			append(div26, t20);
			append(div26, div13);
			append(div13, div11);
			append(div11, t21);
			append(div11, t22);
			append(div13, t23);
			append(div13, div12);
			append(div26, t25);
			append(div26, div16);
			append(div16, div14);
			append(div14, t26);
			append(div14, t27);
			append(div16, t28);
			append(div16, div15);
			append(div26, t30);
			append(div26, div19);
			append(div19, div17);
			append(div17, t31);
			append(div19, t32);
			append(div19, div18);
			append(div26, t34);
			append(div26, div22);
			append(div22, div20);
			append(div20, t35);
			append(div20, t36);
			append(div22, t37);
			append(div22, div21);
			append(div26, t39);
			append(div26, div25);
			append(div25, div23);
			append(div23, t40);
			append(div23, t41);
			append(div25, t42);
			append(div25, div24);
			append(div33, t44);
			append(div33, div31);
			append(div31, div27);
			append(div27, span0);
			append(div27, t46);
			append(div27, span1);
			append(div27, t48);
			append(div27, span2);
			append(span2, t49);
			append(div31, t50);
			append(div31, div28);
			append(div28, span3);
			append(div28, t52);
			append(div28, span4);
			append(div28, t54);
			append(div28, span5);
			append(span5, t55);
			append(div31, t56);
			append(div31, div29);
			append(div29, span6);
			append(div29, t58);
			append(div29, span7);
			append(div29, t60);
			append(div29, span8);
			append(span8, t61);
			append(div31, t62);
			append(div31, div30);
			append(div30, span9);
			append(div30, t64);
			append(div30, span10);
			append(div30, t66);
			append(div30, span11);
			append(span11, t67);
			append(div33, t68);
			append(div33, div32);
			append(div32, t69);
			append(div32, t70);
			append(div32, t71);
			append(div32, t72);
			append(div32, t73);
			append(div33, t74);
			if (if_block1) if_block1.m(div33, null);
			insert(target, t75, anchor);
			insert(target, div35, anchor);
			append(div35, div34);
			append(div34, t76);
			append(div34, t77);
			append(div34, t78);
			append(div35, t79);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div35, null);
				}
			}

			insert(target, t80, anchor);
			insert(target, div48, anchor);
			append(div48, div36);
			append(div36, t81);
			append(div36, span12);
			append(span12, t82);
			append(div48, t83);
			append(div48, div46);
			append(div46, div39);
			append(div39, div37);
			append(div37, t84);
			append(div37, t85);
			append(div39, t86);
			append(div39, div38);
			append(div46, t88);
			append(div46, div42);
			append(div42, div40);
			append(div40, t89);
			append(div40, t90);
			append(div42, t91);
			append(div42, div41);
			append(div46, t93);
			append(div46, div45);
			append(div45, div43);
			append(div43, t94);
			append(div43, t95);
			append(div45, t96);
			append(div45, div44);
			append(div44, t97);
			append(div48, t98);
			append(div48, div47);
			append(div47, t99);
			append(div47, t100);
			append(div47, t101);
			append(div47, t102);
			append(div47, t103);
			insert(target, t104, anchor);
			insert(target, div61, anchor);
			append(div61, div49);
			append(div49, t105);
			append(div49, span13);
			append(span13, t106);
			append(div61, t107);
			append(div61, div59);
			append(div59, div52);
			append(div52, div50);
			append(div50, t108);
			append(div50, t109);
			append(div52, t110);
			append(div52, div51);
			append(div59, t112);
			append(div59, div55);
			append(div55, div53);
			append(div53, t113);
			append(div55, t114);
			append(div55, div54);
			append(div59, t116);
			append(div59, div58);
			append(div58, div56);
			append(div56, t117);
			append(div56, t118);
			append(div58, t119);
			append(div58, div57);
			append(div61, t121);
			append(div61, div60);
			append(div60, t122);
			append(div60, t123);
			append(div60, t124);
			append(div60, t125);
			append(div60, t126);
			insert(target, t127, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert(target, if_block2_anchor, anchor);
		},
		p(ctx, dirty) {
			if (/*heat*/ ctx[7].isBanPeriod) {
				if (if_block0) ; else {
					if_block0 = create_if_block_6();
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty[0] & /*heat*/ 128) {
				set_style(div0, "background", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 128 && t2_value !== (t2_value = /*heat*/ ctx[7].zoneInfo.riskLabel + "")) set_data(t2, t2_value);

			if (dirty[0] & /*heat*/ 128) {
				set_style(div1, "color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 128 && t4_value !== (t4_value = /*heat*/ ctx[7].zoneInfo.label + "")) set_data(t4, t4_value);

			if (dirty[0] & /*heat*/ 128 && t7_value !== (t7_value = (/*heat*/ ctx[7].apparentTempFinal === 999
			? 'NO WORK'
			: /*heat*/ ctx[7].apparentTempFinal + '°C') + "")) set_data(t7, t7_value);

			if (dirty[0] & /*heat*/ 128 && t9_value !== (t9_value = /*heat*/ ctx[7].wbgtAdjusted + "")) set_data(t9, t9_value);
			if (dirty[0] & /*currentTime*/ 32) set_data(t12, /*currentTime*/ ctx[5]);

			if (dirty[0] & /*heat*/ 128) {
				set_style(div6, "background", /*heat*/ ctx[7].zoneInfo.bgColor);
			}

			if (dirty[0] & /*heat*/ 128) {
				set_style(div6, "border-color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 64 && t16_value !== (t16_value = /*rawData*/ ctx[6]?.tempC + "")) set_data(t16, t16_value);
			if (dirty[0] & /*rawData*/ 64 && t21_value !== (t21_value = /*rawData*/ ctx[6]?.humidity + "")) set_data(t21, t21_value);
			if (dirty[0] & /*heat*/ 128 && t26_value !== (t26_value = /*heat*/ ctx[7].apparentTemp1 + "")) set_data(t26, t26_value);

			if (dirty[0] & /*heat*/ 128 && t31_value !== (t31_value = (/*heat*/ ctx[7].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[7].apparentTempFinal + '°C') + "")) set_data(t31, t31_value);

			if (dirty[0] & /*heat*/ 128) {
				set_style(div17, "color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 128 && t35_value !== (t35_value = /*heat*/ ctx[7].wbgtBase + "")) set_data(t35, t35_value);
			if (dirty[0] & /*heat*/ 128 && t40_value !== (t40_value = /*heat*/ ctx[7].wbgtAdjusted + "")) set_data(t40, t40_value);

			if (dirty[0] & /*heat, settings*/ 1048704) {
				set_style(div23, "color", /*heat*/ ctx[7].wbgtAdjusted >= /*settings*/ ctx[20].wbgtDangerC
				? '#dc2626'
				: /*heat*/ ctx[7].wbgtAdjusted >= /*settings*/ ctx[20].wbgtWarnC
					? '#f97316'
					: '#94a3b8');
			}

			if (dirty[0] & /*heat*/ 128 && t49_value !== (t49_value = /*heat*/ ctx[7].workRestSchedule.light + "")) set_data(t49, t49_value);
			if (dirty[0] & /*heat*/ 128 && t55_value !== (t55_value = /*heat*/ ctx[7].workRestSchedule.heavy + "")) set_data(t55, t55_value);
			if (dirty[0] & /*heat*/ 128 && t61_value !== (t61_value = /*heat*/ ctx[7].hydration + "")) set_data(t61, t61_value);
			if (dirty[0] & /*heat*/ 128 && t67_value !== (t67_value = /*heat*/ ctx[7].zoneInfo.monitoringSchedule + "")) set_data(t67, t67_value);
			if (dirty[0] & /*settings*/ 1048576 && t70_value !== (t70_value = PPE_PROFILES[/*settings*/ ctx[20].ppeProfile].label + "")) set_data(t70, t70_value);
			if (dirty[0] & /*settings*/ 1048576 && t72_value !== (t72_value = PPE_PROFILES[/*settings*/ ctx[20].ppeProfile].adjustment + "")) set_data(t72, t72_value);

			if (/*worstCaseMode*/ ctx[13] && /*worstModelLabel*/ ctx[11]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_5(ctx);
					if_block1.c();
					if_block1.m(div33, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty[0] & /*heat*/ 128) {
				set_style(div33, "border-color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 128 && t77_value !== (t77_value = /*heat*/ ctx[7].zoneInfo.riskLabel + "")) set_data(t77, t77_value);

			if (dirty[0] & /*heat*/ 128) {
				each_value_1 = ensure_array_like(/*heat*/ ctx[7].zoneInfo.mandatoryControls);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div35, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}

			if (dirty[0] & /*heat*/ 128) {
				set_style(div35, "border-color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*windResult*/ 256 && t82_value !== (t82_value = /*windResult*/ ctx[8]?.riskLabel + "")) set_data(t82, t82_value);

			if (dirty[0] & /*windResult*/ 256) {
				set_style(span12, "background", /*windResult*/ ctx[8]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 64 && t84_value !== (t84_value = /*rawData*/ ctx[6]?.windMs.toFixed(1) + "")) set_data(t84, t84_value);
			if (dirty[0] & /*rawData*/ 64 && t89_value !== (t89_value = ((/*rawData*/ ctx[6]?.windMs ?? 0) * 3.6).toFixed(1) + "")) set_data(t89, t89_value);
			if (dirty[0] & /*windResult*/ 256 && t95_value !== (t95_value = /*windResult*/ ctx[8]?.beaufort + "")) set_data(t95, t95_value);
			if (dirty[0] & /*windResult*/ 256 && t97_value !== (t97_value = /*windResult*/ ctx[8]?.beaufortDesc + "")) set_data(t97, t97_value);
			if (dirty[0] & /*settings*/ 1048576 && t100_value !== (t100_value = /*settings*/ ctx[20].windWarnMs + "")) set_data(t100, t100_value);
			if (dirty[0] & /*settings*/ 1048576 && t102_value !== (t102_value = /*settings*/ ctx[20].windDangerMs + "")) set_data(t102, t102_value);

			if (dirty[0] & /*windResult*/ 256) {
				set_style(div48, "border-color", /*windResult*/ ctx[8]?.riskColor);
			}

			if (dirty[0] & /*rainResult*/ 512 && t106_value !== (t106_value = /*rainResult*/ ctx[9]?.riskLabel + "")) set_data(t106, t106_value);

			if (dirty[0] & /*rainResult*/ 512) {
				set_style(span13, "background", /*rainResult*/ ctx[9]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 64 && t108_value !== (t108_value = /*rawData*/ ctx[6]?.rainMmH.toFixed(1) + "")) set_data(t108, t108_value);
			if (dirty[0] & /*rainResult*/ 512 && t113_value !== (t113_value = /*rainResult*/ ctx[9]?.intensityLabel + "")) set_data(t113, t113_value);
			if (dirty[0] & /*rawData*/ 64 && t117_value !== (t117_value = /*rawData*/ ctx[6]?.solarWm2 + "")) set_data(t117, t117_value);
			if (dirty[0] & /*settings*/ 1048576 && t123_value !== (t123_value = /*settings*/ ctx[20].rainWarnMmh + "")) set_data(t123, t123_value);
			if (dirty[0] & /*settings*/ 1048576 && t125_value !== (t125_value = /*settings*/ ctx[20].rainDangerMmh + "")) set_data(t125, t125_value);

			if (dirty[0] & /*rainResult*/ 512) {
				set_style(div61, "border-color", /*rainResult*/ ctx[9]?.riskColor);
			}

			if (/*worstCaseMode*/ ctx[13] && /*modelResults*/ ctx[10].length > 1) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_4(ctx);
					if_block2.c();
					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(div6);
				detach(t13);
				detach(div33);
				detach(t75);
				detach(div35);
				detach(t80);
				detach(div48);
				detach(t104);
				detach(div61);
				detach(t127);
				detach(if_block2_anchor);
			}

			if (if_block0) if_block0.d(detaching);
			if (if_block1) if_block1.d();
			destroy_each(each_blocks, detaching);
			if (if_block2) if_block2.d(detaching);
		}
	};
}

// (47:20) 
function create_if_block_2(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚠ ");
			t1 = text(/*error*/ ctx[4]);
			attr(div, "class", "fg-error svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*error*/ 16) set_data(t1, /*error*/ ctx[4]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (45:4) {#if loading}
function create_if_block_1(ctx) {
	let div;
	let t0;

	let t1_value = (/*worstCaseMode*/ ctx[13]
	? 'all models'
	: /*selectedModel*/ ctx[12]) + "";

	let t1;
	let t2;

	return {
		c() {
			div = element("div");
			t0 = text("⏳ Fetching ");
			t1 = text(t1_value);
			t2 = text("…");
			attr(div, "class", "fg-loading svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, t2);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*worstCaseMode, selectedModel*/ 12288 && t1_value !== (t1_value = (/*worstCaseMode*/ ctx[13]
			? 'all models'
			: /*selectedModel*/ ctx[12]) + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (52:6) {#if heat.isBanPeriod}
function create_if_block_6(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.innerHTML = `🚫 LEGAL WORK BAN — 12:30–15:30 (Jun/Jul/Aug)<br/> <small class="svelte-1sqt39u">Outdoor workers must be in shaded A/C environment</small>`;
			attr(div, "class", "fg-ban-alert svelte-1sqt39u");
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

// (126:8) {#if worstCaseMode && worstModelLabel}
function create_if_block_5(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚡ Worst case: ");
			t1 = text(/*worstModelLabel*/ ctx[11]);
			attr(div, "class", "fg-ppe-row svelte-1sqt39u");
			set_style(div, "color", "#38bdf8");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*worstModelLabel*/ 2048) set_data(t1, /*worstModelLabel*/ ctx[11]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (134:8) {#each heat.zoneInfo.mandatoryControls as ctrl}
function create_each_block_1(ctx) {
	let div;
	let t0;
	let t1_value = /*ctrl*/ ctx[72] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("▸ ");
			t1 = text(t1_value);
			attr(div, "class", "fg-control-item svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 128 && t1_value !== (t1_value = /*ctrl*/ ctx[72] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (186:6) {#if worstCaseMode && modelResults.length > 1}
function create_if_block_4(ctx) {
	let div1;
	let div0;
	let t1;
	let table;
	let thead;
	let t6;
	let tbody;
	let each_value = ensure_array_like(/*modelResults*/ ctx[10]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			div0.textContent = "📊 Model Comparison";
			t1 = space();
			table = element("table");
			thead = element("thead");
			thead.innerHTML = `<tr><th class="svelte-1sqt39u">Model</th><th class="svelte-1sqt39u">Zone</th><th class="svelte-1sqt39u">App.T</th><th class="svelte-1sqt39u">Wind</th></tr>`;
			t6 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", "fg-card-header svelte-1sqt39u");
			attr(table, "class", "fg-table svelte-1sqt39u");
			attr(div1, "class", "fg-card fg-card-flat svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div1, t1);
			append(div1, table);
			append(table, thead);
			append(table, t6);
			append(table, tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(tbody, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 1024) {
				each_value = ensure_array_like(/*modelResults*/ ctx[10]);
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
				detach(div1);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (192:14) {#each modelResults as mr}
function create_each_block(ctx) {
	let tr;
	let td0;
	let t0_value = /*mr*/ ctx[69].modelLabel + "";
	let t0;
	let t1_value = (/*mr*/ ctx[69].isWorst ? ' ⚡' : '') + "";
	let t1;
	let t2;
	let td1;
	let t3_value = /*mr*/ ctx[69].heat.zoneInfo.riskLabel + "";
	let t3;
	let t4;
	let td2;

	let t5_value = (/*mr*/ ctx[69].heat.apparentTempFinal === 999
	? 'NW'
	: /*mr*/ ctx[69].heat.apparentTempFinal + '°C') + "";

	let t5;
	let t6;
	let td3;
	let t7_value = /*mr*/ ctx[69].raw.windMs.toFixed(1) + "";
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
			attr(td0, "class", "svelte-1sqt39u");
			set_style(td1, "color", /*mr*/ ctx[69].heat.zoneInfo.color);
			attr(td1, "class", "svelte-1sqt39u");
			set_style(td2, "color", /*mr*/ ctx[69].heat.zoneInfo.color);
			attr(td2, "class", "svelte-1sqt39u");
			set_style(td3, "color", /*mr*/ ctx[69].wind.riskColor);
			attr(td3, "class", "svelte-1sqt39u");
			attr(tr, "class", tr_class_value = "" + (null_to_empty(/*mr*/ ctx[69].isWorst ? 'fg-worst-row' : '') + " svelte-1sqt39u"));
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
			if (dirty[0] & /*modelResults*/ 1024 && t0_value !== (t0_value = /*mr*/ ctx[69].modelLabel + "")) set_data(t0, t0_value);
			if (dirty[0] & /*modelResults*/ 1024 && t1_value !== (t1_value = (/*mr*/ ctx[69].isWorst ? ' ⚡' : '') + "")) set_data(t1, t1_value);
			if (dirty[0] & /*modelResults*/ 1024 && t3_value !== (t3_value = /*mr*/ ctx[69].heat.zoneInfo.riskLabel + "")) set_data(t3, t3_value);

			if (dirty[0] & /*modelResults*/ 1024) {
				set_style(td1, "color", /*mr*/ ctx[69].heat.zoneInfo.color);
			}

			if (dirty[0] & /*modelResults*/ 1024 && t5_value !== (t5_value = (/*mr*/ ctx[69].heat.apparentTempFinal === 999
			? 'NW'
			: /*mr*/ ctx[69].heat.apparentTempFinal + '°C') + "")) set_data(t5, t5_value);

			if (dirty[0] & /*modelResults*/ 1024) {
				set_style(td2, "color", /*mr*/ ctx[69].heat.zoneInfo.color);
			}

			if (dirty[0] & /*modelResults*/ 1024 && t7_value !== (t7_value = /*mr*/ ctx[69].raw.windMs.toFixed(1) + "")) set_data(t7, t7_value);

			if (dirty[0] & /*modelResults*/ 1024) {
				set_style(td3, "color", /*mr*/ ctx[69].wind.riskColor);
			}

			if (dirty[0] & /*modelResults*/ 1024 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*mr*/ ctx[69].isWorst ? 'fg-worst-row' : '') + " svelte-1sqt39u"))) {
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
	let div3;
	let img;
	let img_src_value;
	let t0;
	let div2;
	let t4;
	let button;
	let t5_value = (/*tab*/ ctx[0] === 'settings' ? '← Back' : '⚙ Config') + "";
	let t5;
	let t6;
	let div4;
	let t7;
	let mounted;
	let dispose;
	let each_value_7 = ensure_array_like(/*TABS*/ ctx[24]);
	let each_blocks = [];

	for (let i = 0; i < each_value_7.length; i += 1) {
		each_blocks[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
	}

	function select_block_type(ctx, dirty) {
		if (/*tab*/ ctx[0] === 'dashboard') return create_if_block;
		if (/*tab*/ ctx[0] === 'emergency') return create_if_block_8;
		if (/*tab*/ ctx[0] === 'report') return create_if_block_11;
		if (/*tab*/ ctx[0] === 'settings') return create_if_block_14;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	return {
		c() {
			section = element("section");
			div3 = element("div");
			img = element("img");
			t0 = space();
			div2 = element("div");
			div2.innerHTML = `<div class="fg-title svelte-1sqt39u">FieldGuard</div> <div class="fg-subtitle svelte-1sqt39u">Real-time Heat &amp; Weather Safety</div>`;
			t4 = space();
			button = element("button");
			t5 = text(t5_value);
			t6 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t7 = space();
			if (if_block) if_block.c();
			attr(img, "class", "fg-logo-img svelte-1sqt39u");
			if (!src_url_equal(img.src, img_src_value = "data:image/png;base64,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")) attr(img, "src", img_src_value);
			attr(img, "alt", "FieldGuard");
			attr(div2, "class", "fg-header-text svelte-1sqt39u");
			attr(button, "class", "fg-settings-btn svelte-1sqt39u");
			attr(div3, "class", "fg-header svelte-1sqt39u");
			attr(div4, "class", "fg-tabs svelte-1sqt39u");
			attr(section, "class", "plugin__content fieldguard svelte-1sqt39u");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, div3);
			append(div3, img);
			append(div3, t0);
			append(div3, div2);
			append(div3, t4);
			append(div3, button);
			append(button, t5);
			append(section, t6);
			append(section, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			append(section, t7);
			if (if_block) if_block.m(section, null);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[34]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*tab*/ 1 && t5_value !== (t5_value = (/*tab*/ ctx[0] === 'settings' ? '← Back' : '⚙ Config') + "")) set_data(t5, t5_value);

			if (dirty[0] & /*tab, TABS*/ 16777217) {
				each_value_7 = ensure_array_like(/*TABS*/ ctx[24]);
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

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(section, null);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(section);
			}

			destroy_each(each_blocks, detaching);

			if (if_block) {
				if_block.d();
			}

			mounted = false;
			dispose();
		}
	};
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

function triggerNotification(title, body) {
	if ('Notification' in window) {
		if (Notification.permission === 'granted') new Notification(`FieldGuard: ${title}`, { body }); else Notification.requestPermission();
	}
}

function instance($$self, $$props, $$invalidate) {
	let tab = 'dashboard';
	let lat = 23.6, lon = 58.6;
	let loading = false, error = '';
	let currentTime = '';
	let rawData = null;
	let heat = null;
	let windResult = null;
	let rainResult = null;
	let modelResults = [];
	let worstModelLabel = '';
	let selectedModel = 'ecmwf';
	let worstCaseMode = false;
	let alertLog = [];
	let reportText = '';
	let autoRefreshTimer = null;
	let license = { valid: false, tier: '', expires: '' };
	let licenseKeyInput = '';
	let licenseLoading = false;
	let licenseError = '';

	function isPro() {
		if (!license.valid) return false;
		if (!license.expires) return false;
		return new Date(license.expires) > new Date();
	}

	function loadLicense() {
		try {
			const stored = localStorage.getItem('fg_license');

			if (stored) {
				const parsed = JSON.parse(stored);

				if (parsed.valid && new Date(parsed.expires) > new Date()) {
					$$invalidate(16, license = parsed);
					$$invalidate(13, worstCaseMode = true);
				}
			}
		} catch {
			
		}
	}

	async function activateLicense() {
		const key = licenseKeyInput.trim();
		if (!key) return;
		$$invalidate(18, licenseLoading = true);
		$$invalidate(19, licenseError = '');

		try {
			const res = await fetch('https://fieldguard-hse.com/api/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, fingerprint: navigator.userAgent })
			});

			if (!res.ok) throw new Error(`Server error: ${res.status}`);
			const data = await res.json();

			if (data.valid) {
				$$invalidate(16, license = {
					valid: true,
					tier: data.tier,
					expires: data.expires,
					token: data.token
				});

				localStorage.setItem('fg_license', JSON.stringify(license));
				$$invalidate(17, licenseKeyInput = '');
				$$invalidate(13, worstCaseMode = true);
				refreshData();
			} else {
				$$invalidate(19, licenseError = data.message ?? 'Invalid license key. Check your key and try again.');
			}
		} catch(e) {
			if (e.message?.includes('Failed to fetch') || e.message?.includes('NetworkError')) {
				$$invalidate(19, licenseError = 'Cannot reach fieldguard-hse.com — check your internet connection.');
			} else {
				$$invalidate(19, licenseError = e.message ?? 'Activation failed. Please try again.');
			}
		}

		$$invalidate(18, licenseLoading = false);
	}

	function deactivateLicense() {
		$$invalidate(16, license = { valid: false, tier: '', expires: '' });
		localStorage.removeItem('fg_license');
		$$invalidate(13, worstCaseMode = false);
	}

	const TABS = [
		{
			id: 'dashboard',
			icon: '🏠',
			label: 'Live'
		},
		{
			id: 'emergency',
			icon: '🚨',
			label: 'SOS'
		},
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
			store.set('overlay', 'temp');
			await new Promise(r => setTimeout(r, 300));
			const tempInterp = await getLatLonInterpolator();
			const tempRaw = tempInterp ? await tempInterp({ lat, lon }) : null;

			const tempC = Array.isArray(tempRaw)
			? tempRaw[0] - 273.15
			: (tempRaw ?? 298) - 273.15;

			store.set('overlay', 'wind');
			await new Promise(r => setTimeout(r, 300));
			const windInterp = await getLatLonInterpolator();
			const windRaw = windInterp ? await windInterp({ lat, lon }) : null;

			const windMs = Array.isArray(windRaw)
			? Math.sqrt(windRaw[0] ** 2 + windRaw[1] ** 2)
			: windRaw ?? 0;

			store.set('overlay', 'rh');
			await new Promise(r => setTimeout(r, 300));
			const humInterp = await getLatLonInterpolator();
			const humRaw = humInterp ? await humInterp({ lat, lon }) : null;
			const humidity = Array.isArray(humRaw) ? humRaw[0] : humRaw ?? 50;
			store.set('overlay', 'rain');
			await new Promise(r => setTimeout(r, 300));
			const rainInterp = await getLatLonInterpolator();
			const rainRaw = rainInterp ? await rainInterp({ lat, lon }) : null;

			const rainMmH = Array.isArray(rainRaw)
			? Math.max(0, rainRaw[0])
			: Math.max(0, rainRaw ?? 0);

			store.set('overlay', 'lclouds');
			await new Promise(r => setTimeout(r, 300));
			const cloudInterp = await getLatLonInterpolator();
			const cloudRaw = cloudInterp ? await cloudInterp({ lat, lon }) : null;
			const cloudFrac = Math.min(1, Math.max(0, (Array.isArray(cloudRaw) ? cloudRaw[0] : cloudRaw ?? 30) / 100));
			const hourUTC = new Date().getUTCHours();
			const localSolarHour = hourUTC + lon / 15;
			const solarMax = 1000 * Math.max(0, Math.sin((localSolarHour - 6) * Math.PI / 12));
			const solarWm2 = Math.round(solarMax * (1 - 0.75 * cloudFrac));

			return {
				tempC: Math.round(tempC * 10) / 10,
				humidity: Math.min(100, Math.max(0, Math.round(humidity))),
				windMs: Math.max(0, Math.round(windMs * 10) / 10),
				solarWm2: Math.max(0, solarWm2),
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

			return {
				tempC: c.temperature_2m,
				humidity: c.relative_humidity_2m,
				windMs: c.wind_speed_10m,
				solarWm2: c.shortwave_radiation ?? 0,
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
					if (zd !== 0) return zd;

					return (b.heat.apparentTempFinal === 999
					? 99
					: b.heat.apparentTempFinal) - (a.heat.apparentTempFinal === 999
					? 99
					: a.heat.apparentTempFinal);
				});

				results[0].isWorst = true;
			}

			$$invalidate(10, modelResults = results);
			$$invalidate(6, rawData = results[0].raw);
			$$invalidate(7, heat = results[0].heat);
			$$invalidate(8, windResult = results[0].wind);
			$$invalidate(9, rainResult = results[0].rain);
			$$invalidate(11, worstModelLabel = results[0].modelLabel);
			checkAlerts();
		} catch(e) {
			$$invalidate(4, error = 'Failed to fetch data. Check network or try a different model.');
		}

		$$invalidate(3, loading = false);
	}

	function checkAlerts() {
		if (!heat || !windResult || !rainResult) return;
		const time = new Date().toLocaleTimeString();

		if (heat.zone !== 'green') {
			const entry = {
				time,
				type: `🌡 HEAT — ${heat.zoneInfo.riskLabel}`,
				color: heat.zoneInfo.color,
				message: `App.Temp: ${heat.apparentTempFinal === 999
				? 'NO WORK'
				: heat.apparentTempFinal + '°C'} | ${heat.zoneInfo.label}`
			};

			$$invalidate(14, alertLog = [...alertLog, entry]);

			if (settings.soundAlerts && (heat.zone === 'red' || heat.zone === 'purple' || heat.zone === 'black')) {
				triggerNotification(entry.type, entry.message);
			}
		}

		if (windResult.exceedsThreshold) {
			$$invalidate(14, alertLog = [
				...alertLog,
				{
					time,
					type: '💨 WIND ALERT',
					color: windResult.riskColor,
					message: `${rawData?.windMs.toFixed(1)} m/s — Bft ${windResult.beaufort} (${windResult.beaufortDesc})`
				}
			]);
		}

		if (rainResult.exceedsThreshold) {
			$$invalidate(14, alertLog = [
				...alertLog,
				{
					time,
					type: '🌧 RAIN ALERT',
					color: rainResult.riskColor,
					message: `${rawData?.rainMmH.toFixed(1)} mm/h — ${rainResult.intensityLabel}`
				}
			]);
		}

		if (heat.isBanPeriod) {
			$$invalidate(14, alertLog = [
				...alertLog,
				{
					time,
					type: '🚫 LEGAL WORK BAN',
					color: '#f97316',
					message: `12:30–15:30 outdoor ban active (${reportMeta.banMonths})`
				}
			]);
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
		$$invalidate(20, settings = { ...DEFAULT_SETTINGS });
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
		const today = new Date();
		const weekAgo = new Date(today);
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
			siteAddress: `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
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
			forecastNarrative: `FieldGuard worst-case analysis at ${`${lat.toFixed(3)}, ${lon.toFixed(3)}`} ` + `shows ${heat?.zoneInfo.riskLabel ?? 'N/A'} zone (Apparent Temp: ${heat?.apparentTempFinal === 999
			? 'NO WORK'
			: (heat?.apparentTempFinal ?? 'N/A') + '°C'}, ` + `WBGT+PPE: ${heat?.wbgtAdjusted ?? 'N/A'}°C). ${heat?.zoneInfo.mandatoryControls[0] ?? ''}`
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
			if (s) $$invalidate(20, settings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) });
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
	const click_handler = () => $$invalidate(0, tab = tab === 'settings' ? 'dashboard' : 'settings');
	const click_handler_1 = t => $$invalidate(0, tab = t.id);

	function select_change_handler() {
		selectedModel = select_value(this);
		$$invalidate(12, selectedModel);
		$$invalidate(25, MODELS);
	}

	function input_change_handler() {
		worstCaseMode = this.checked;
		$$invalidate(13, worstCaseMode);
	}

	function input0_input_handler() {
		reportMeta.projectName = this.value;
		$$invalidate(21, reportMeta);
	}

	function input1_input_handler() {
		reportMeta.contractNumber = this.value;
		$$invalidate(21, reportMeta);
	}

	function input2_input_handler() {
		reportMeta.country = this.value;
		$$invalidate(21, reportMeta);
	}

	function input3_input_handler() {
		reportMeta.clientName = this.value;
		$$invalidate(21, reportMeta);
	}

	function input4_input_handler() {
		reportMeta.contractorName = this.value;
		$$invalidate(21, reportMeta);
	}

	function input5_input_handler() {
		reportMeta.hseManagerName = this.value;
		$$invalidate(21, reportMeta);
	}

	function input6_input_handler() {
		reportMeta.regulatoryRef = this.value;
		$$invalidate(21, reportMeta);
	}

	function input7_input_handler() {
		reportMeta.banStart = this.value;
		$$invalidate(21, reportMeta);
	}

	function input8_input_handler() {
		reportMeta.banEnd = this.value;
		$$invalidate(21, reportMeta);
	}

	function input9_input_handler() {
		reportMeta.banMonths = this.value;
		$$invalidate(21, reportMeta);
	}

	function select_change_handler_1() {
		reportMeta.fidic = select_value(this);
		$$invalidate(21, reportMeta);
	}

	function input10_input_handler() {
		reportMeta.delayDays = to_number(this.value);
		$$invalidate(21, reportMeta);
	}

	function input_input_handler() {
		licenseKeyInput = this.value;
		$$invalidate(17, licenseKeyInput);
	}

	function input_change_handler_1() {
		settings.ppeProfile = this.__value;
		$$invalidate(20, settings);
	}

	function input0_change_input_handler() {
		settings.wbgtWarnC = to_number(this.value);
		$$invalidate(20, settings);
	}

	function input1_change_input_handler() {
		settings.wbgtDangerC = to_number(this.value);
		$$invalidate(20, settings);
	}

	function input0_change_input_handler_1() {
		settings.windWarnMs = to_number(this.value);
		$$invalidate(20, settings);
	}

	function input1_change_input_handler_1() {
		settings.windDangerMs = to_number(this.value);
		$$invalidate(20, settings);
	}

	function input0_change_input_handler_2() {
		settings.rainWarnMmh = to_number(this.value);
		$$invalidate(20, settings);
	}

	function input1_change_input_handler_2() {
		settings.rainDangerMmh = to_number(this.value);
		$$invalidate(20, settings);
	}

	function input0_change_handler() {
		settings.soundAlerts = this.checked;
		$$invalidate(20, settings);
	}

	function input1_change_handler() {
		settings.autoRefresh = this.checked;
		$$invalidate(20, settings);
	}

	return [
		tab,
		lat,
		lon,
		loading,
		error,
		currentTime,
		rawData,
		heat,
		windResult,
		rainResult,
		modelResults,
		worstModelLabel,
		selectedModel,
		worstCaseMode,
		alertLog,
		reportText,
		license,
		licenseKeyInput,
		licenseLoading,
		licenseError,
		settings,
		reportMeta,
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
		input9_input_handler,
		select_change_handler_1,
		input10_input_handler,
		input_input_handler,
		input_change_handler_1,
		$$binding_groups,
		input0_change_input_handler,
		input1_change_input_handler,
		input0_change_input_handler_1,
		input1_change_input_handler_1,
		input0_change_input_handler_2,
		input1_change_input_handler_2,
		input0_change_handler,
		input1_change_handler
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 33 }, add_css, [-1, -1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[33];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
