const __pluginConfig =  {
  "name": "windy-plugin-fieldguard",
  "version": "1.1.0",
  "icon": "🛡️",
  "title": "FieldGuard — HSE Field Safety",
  "description": "Real-time HSE safety monitor for field workers. Heat stress zones (ISO 7243/7933), wind & rain alerts, worst-case multi-model engine, ISO 7933 weekly reports.",
  "author": "FieldGuard HSE",
  "desktopUI": "rhpane",
  "mobileUI": "small",
  "desktopWidth": 260,
  "routerPath": "/fieldguard/:lat?/:lon?",
  "listenToLocationChange": true,
  "addToContextmenu": true,
  "built": 1779553627591,
  "builtReadable": "2026-05-23T16:27:07.591Z",
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
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
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
	append_styles(target, "svelte-14d77el", ":root{--amb:#e8962a;--n1:#050a18;--n2:#0a1228;--n4:#1a2d55;--sl:#8a9cc8;--sl2:#4a6090}.fg-wrap.svelte-14d77el.svelte-14d77el{position:absolute;bottom:110px;left:10px;width:300px;z-index:1000;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;font-size:12px}.fg-bar.svelte-14d77el.svelte-14d77el{background:rgba(5,10,24,0.94);border:1px solid rgba(232,150,42,0.5);border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.5)}.fg-bar.fg-expanded.svelte-14d77el.svelte-14d77el{border-radius:10px 10px 0 0;border-bottom:none}.fg-bar-brand.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:7px;padding:6px 10px;background:rgba(5,10,24,0.98);border-bottom:1px solid rgba(232,150,42,0.3);cursor:pointer;user-select:none}.fg-bar-brand.svelte-14d77el.svelte-14d77el:hover{background:rgba(10,18,40,0.98)}.fg-bar-logo.svelte-14d77el.svelte-14d77el{width:20px;height:20px;object-fit:contain}.fg-bar-title.svelte-14d77el.svelte-14d77el{font-size:12px;font-weight:800;color:#fff;flex:1}.fg-bar-chevron.svelte-14d77el.svelte-14d77el{font-size:9px;color:var(--sl2)}.fg-bar-pills.svelte-14d77el.svelte-14d77el{display:flex;align-items:stretch;gap:4px;padding:6px 7px}.fg-p.svelte-14d77el.svelte-14d77el{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 2px;background:rgba(10,18,40,0.8);border:1px solid var(--c,#2d4080);border-radius:7px;cursor:pointer;transition:all 0.15s}.fg-p.svelte-14d77el.svelte-14d77el:hover{filter:brightness(1.2)}.fg-p.fg-p-on.svelte-14d77el.svelte-14d77el{border-width:2px;background:rgba(18,32,68,0.95)}.fg-p-ic.svelte-14d77el.svelte-14d77el{font-size:13px;line-height:1}.fg-p-vl.svelte-14d77el.svelte-14d77el{font-size:12px;font-weight:800;line-height:1.1}.fg-p-lb.svelte-14d77el.svelte-14d77el{font-size:7px;font-weight:800;text-transform:uppercase;letter-spacing:0.3px}.fg-rfr.svelte-14d77el.svelte-14d77el{width:24px;flex-shrink:0;align-self:center;background:rgba(10,18,40,0.7);border:1px solid rgba(45,64,128,0.5);border-radius:6px;color:var(--sl);font-size:14px;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;transition:all 0.15s}.fg-rfr.svelte-14d77el.svelte-14d77el:hover{border-color:var(--amb);color:var(--amb)}.fg-bar-loading.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:7px;padding:8px 10px;font-size:10px;color:var(--sl)}.fg-bar-tap.svelte-14d77el.svelte-14d77el{width:100%;padding:8px 10px;background:transparent;border:none;color:var(--sl);font-size:10px;cursor:pointer;text-align:left}.fg-panel.svelte-14d77el.svelte-14d77el{background:rgba(5,10,24,0.96);border:1px solid rgba(232,150,42,0.4);border-top:none;border-radius:0 0 10px 10px;max-height:420px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.5)}.fg-loc.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;justify-content:space-between;padding:4px 9px;font-size:9px;color:var(--sl);border-bottom:1px solid rgba(255,255,255,0.04)}.fg-loc-r.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:4px}.fg-dbadge.svelte-14d77el.svelte-14d77el{background:#78350f;color:#fcd34d;border-radius:3px;padding:1px 4px;font-size:7px;font-weight:700}.fg-nbadge.svelte-14d77el.svelte-14d77el{background:#1e1b4b;color:#a5b4fc;border-radius:3px;padding:1px 4px;font-size:7px;font-weight:700}.fg-tabs.svelte-14d77el.svelte-14d77el{display:flex;border-bottom:1px solid rgba(255,255,255,0.05)}.fg-tab.svelte-14d77el.svelte-14d77el{flex:1;padding:5px 2px;background:transparent;border:none;color:var(--sl2);cursor:pointer;font-size:8px;border-bottom:2px solid transparent;transition:all 0.15s}.fg-tab.fg-tab-on.svelte-14d77el.svelte-14d77el{color:var(--amb);border-bottom-color:var(--amb)}.fg-ban.svelte-14d77el.svelte-14d77el{padding:5px 9px;background:rgba(124,45,18,0.85);color:#fed7aa;font-size:9px;font-weight:700;text-align:center}.fg-det.svelte-14d77el.svelte-14d77el{background:rgba(5,10,24,0.7);border:1px solid;margin:5px 7px;border-radius:7px;padding:8px}.fg-det-ti.svelte-14d77el.svelte-14d77el{font-size:9px;font-weight:800;text-transform:uppercase;margin-bottom:6px}.fg-det-g.svelte-14d77el.svelte-14d77el{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-bottom:5px}.fg-dc.svelte-14d77el.svelte-14d77el{background:rgba(5,10,22,0.6);border-radius:4px;padding:4px 2px;text-align:center}.fg-dv.svelte-14d77el.svelte-14d77el{font-size:11px;font-weight:800;color:#fff;display:block}.fg-dl.svelte-14d77el.svelte-14d77el{font-size:7px;color:var(--sl2);text-transform:uppercase}.fg-ds.svelte-14d77el.svelte-14d77el{background:rgba(5,10,22,0.4);border-radius:4px;padding:4px;margin-bottom:3px}.fg-dr.svelte-14d77el.svelte-14d77el{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(10,18,38,0.9);font-size:8px}.fg-dr.svelte-14d77el.svelte-14d77el:last-child{border:none}.fg-drl.svelte-14d77el.svelte-14d77el{color:var(--sl2)}.fg-drv.svelte-14d77el.svelte-14d77el{color:var(--sl);font-weight:500}.fg-dct.svelte-14d77el.svelte-14d77el{font-size:8px;color:var(--amb);text-transform:uppercase;font-weight:700;margin:4px 0 3px}.fg-dci.svelte-14d77el.svelte-14d77el{font-size:8px;color:var(--sl);padding:1px 0;border-bottom:1px solid rgba(10,18,38,0.7)}.fg-dci.svelte-14d77el.svelte-14d77el:last-child{border:none}.fg-night.svelte-14d77el.svelte-14d77el{padding:8px;text-align:center;font-size:10px;color:#a5b4fc}.fg-mr.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:5px;padding:5px 7px;border-top:1px solid rgba(255,255,255,0.05)}.fg-mr-sel.svelte-14d77el.svelte-14d77el{background:rgba(10,18,40,0.8);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:3px 5px;border-radius:4px;font-size:9px}.fg-mr-wc.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:3px;margin-left:auto;font-size:8px;color:var(--sl);cursor:pointer}.fg-proch.svelte-14d77el.svelte-14d77el{background:var(--amb);color:#0f1d42;font-size:7px;font-weight:800;padding:1px 3px;border-radius:2px}.fg-emg.svelte-14d77el.svelte-14d77el{padding:8px}.fg-emg-w.svelte-14d77el.svelte-14d77el{font-size:10px;font-weight:700;color:#f87171;margin-bottom:5px}.fg-emg-syms.svelte-14d77el.svelte-14d77el{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px}.fg-sym.svelte-14d77el.svelte-14d77el{background:rgba(61,10,10,0.8);color:#fca5a5;border-radius:3px;padding:2px 5px;font-size:8px}.fg-emg-hd.svelte-14d77el.svelte-14d77el{font-size:8px;color:var(--sl2);text-transform:uppercase;font-weight:700;margin-bottom:4px}.fg-emg-step.svelte-14d77el.svelte-14d77el{display:flex;gap:5px;padding:3px 0;font-size:8px;color:var(--sl);border-bottom:1px solid rgba(10,18,38,0.8)}.fg-emg-step.svelte-14d77el.svelte-14d77el:last-child{border:none}.fg-emg-n.svelte-14d77el.svelte-14d77el{background:rgba(45,64,128,0.6);color:#e8edf8;border-radius:2px;padding:1px 4px;font-size:7px;font-weight:700;flex-shrink:0}.fg-emg-crit.svelte-14d77el.svelte-14d77el{color:#f87171 !important;font-weight:700}.fg-emg-crit.svelte-14d77el .fg-emg-n.svelte-14d77el{background:#dc2626}.fg-rform.svelte-14d77el.svelte-14d77el{padding:6px 8px;display:grid;grid-template-columns:1fr 1fr;gap:4px}label.svelte-14d77el.svelte-14d77el{display:block;color:var(--sl);font-size:9px}label.svelte-14d77el input.svelte-14d77el{display:block;width:100%;background:rgba(5,10,22,0.9);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:4px 6px;border-radius:4px;font-size:9px;margin-top:2px;box-sizing:border-box}.fg-btn.svelte-14d77el.svelte-14d77el{display:block;width:100%;padding:8px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:var(--amb);color:#0f1d42}.fg-btn-amb.svelte-14d77el.svelte-14d77el{display:block;text-align:center;text-decoration:none;background:var(--amb);color:#0f1d42 !important;padding:6px;border-radius:4px;font-size:10px;font-weight:800;margin-top:4px}.fg-rep.svelte-14d77el.svelte-14d77el{background:rgba(5,10,22,0.9);overflow:hidden}.fg-rep-bar.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:5px;padding:4px 7px;background:rgba(10,18,40,0.9);border-bottom:1px solid rgba(45,64,128,0.3);font-size:9px;color:var(--sl2)}.fg-rep-bar.svelte-14d77el span.svelte-14d77el{flex:1}.fg-rep-btn.svelte-14d77el.svelte-14d77el{background:rgba(45,64,128,0.5);border:none;color:var(--sl);padding:2px 6px;border-radius:3px;cursor:pointer;font-size:8px}.fg-rep-txt.svelte-14d77el.svelte-14d77el{padding:6px;font-size:8px;color:var(--sl);white-space:pre;overflow:auto;max-height:150px;font-family:monospace;line-height:1.4}.fg-grp.svelte-14d77el.svelte-14d77el{padding:7px 8px;border-bottom:1px solid rgba(45,64,128,0.2)}.fg-grp-hd.svelte-14d77el.svelte-14d77el{font-size:9px;font-weight:700;color:var(--amb);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}.fg-lic-act.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.fg-lic-b.svelte-14d77el.svelte-14d77el{background:rgba(5,46,22,0.8);color:#4ade80;border:1px solid #16a34a;border-radius:4px;padding:2px 6px;font-size:9px;font-weight:700}.fg-lic-i.svelte-14d77el.svelte-14d77el{font-size:9px;color:#86efac;flex:1}.fg-lic-d.svelte-14d77el.svelte-14d77el{background:rgba(10,18,40,0.8);border:1px solid rgba(45,64,128,0.5);color:var(--sl);padding:2px 6px;border-radius:4px;cursor:pointer;font-size:8px}.fg-lic-free.svelte-14d77el.svelte-14d77el{background:rgba(5,10,22,0.6);border-radius:4px;padding:6px;margin-bottom:5px}.fg-lic-ft.svelte-14d77el.svelte-14d77el{font-size:8px;font-weight:700;color:var(--sl2);text-transform:uppercase;margin-bottom:3px}.fg-lic-fl.svelte-14d77el.svelte-14d77el{font-size:9px;color:var(--sl2);line-height:1.6;margin-bottom:4px}.fg-lic-row.svelte-14d77el.svelte-14d77el{display:flex;gap:4px}.fg-lic-in.svelte-14d77el.svelte-14d77el{flex:1;background:rgba(5,10,22,0.9);border:1px solid rgba(45,64,128,0.5);color:#e8edf8;padding:4px 6px;border-radius:4px;font-size:9px;font-family:monospace}.fg-lic-in.svelte-14d77el.svelte-14d77el:disabled{opacity:0.5}.fg-lic-ab.svelte-14d77el.svelte-14d77el{background:var(--amb);border:none;color:#0f1d42;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:9px;font-weight:800;white-space:nowrap}.fg-lic-ab.svelte-14d77el.svelte-14d77el:disabled{background:rgba(45,64,128,0.4);color:var(--sl2);cursor:not-allowed}.fg-lic-err.svelte-14d77el.svelte-14d77el{margin-top:4px;font-size:9px;color:#f87171;padding:3px 6px;background:rgba(61,10,10,0.8);border-radius:3px}.fg-radio.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:5px;padding:3px 0;cursor:pointer;border-bottom:1px solid rgba(5,10,22,0.8);font-size:9px;color:#c8d4f0}.fg-radio.svelte-14d77el.svelte-14d77el:last-child{border-bottom:none}.fg-radio.svelte-14d77el span.svelte-14d77el{flex:1}.fg-adjch.svelte-14d77el.svelte-14d77el{background:rgba(5,10,22,0.8);color:var(--sl);border-radius:2px;padding:1px 3px;font-size:8px}.fg-slbl.svelte-14d77el.svelte-14d77el{display:block;color:var(--sl);font-size:9px;margin-bottom:3px}.fg-srow.svelte-14d77el.svelte-14d77el{display:flex;align-items:center;gap:5px;margin-top:2px}.fg-srow.svelte-14d77el input[type=\"range\"].svelte-14d77el{flex:1;accent-color:var(--amb)}.fg-srow.svelte-14d77el span.svelte-14d77el{min-width:45px;text-align:right;color:var(--amb);font-size:9px;font-weight:700}input[type=\"checkbox\"].svelte-14d77el.svelte-14d77el{accent-color:var(--amb)}.fg-gate.svelte-14d77el.svelte-14d77el{padding:14px 10px;text-align:center}.fg-gate-ic.svelte-14d77el.svelte-14d77el{font-size:26px;margin-bottom:5px}.fg-gate-ti.svelte-14d77el.svelte-14d77el{font-size:12px;font-weight:800;color:#fff;margin-bottom:5px}.fg-gate-btn.svelte-14d77el.svelte-14d77el{display:block;background:var(--amb);color:#0f1d42 !important;text-decoration:none;padding:7px 10px;border-radius:5px;font-size:10px;font-weight:800}.fg-spin.svelte-14d77el.svelte-14d77el{width:13px;height:13px;border:2px solid rgba(45,64,128,0.5);border-top-color:var(--amb);border-radius:50%;animation:svelte-14d77el-spin 0.8s linear infinite;flex-shrink:0}@keyframes svelte-14d77el-spin{to{transform:rotate(360deg)}}.fg-dis.svelte-14d77el.svelte-14d77el{opacity:0.4;pointer-events:none}");
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[85] = list[i][0];
	child_ctx[86] = list[i][1];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[79] = list[i];
	child_ctx[81] = i;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[82] = list[i];
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[73] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[76] = list[i];
	return child_ctx;
}

function get_each_context_5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[89] = list[i];
	return child_ctx;
}

// (54:4) {:else}
function create_else_block_5(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "⚡ Tap to load";
			attr(button, "class", "fg-bar-tap svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*refreshData*/ ctx[31]);
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

// (52:22) 
function create_if_block_20(ctx) {
	let div1;

	return {
		c() {
			div1 = element("div");
			div1.innerHTML = `<div class="fg-spin svelte-14d77el"></div> <span>Loading…</span>`;
			attr(div1, "class", "fg-bar-loading svelte-14d77el");
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

// (24:4) {#if heat}
function create_if_block_19(ctx) {
	let div;
	let button0;
	let span0;
	let t1;
	let span1;

	let t2_value = (/*heat*/ ctx[7].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[7].apparentTempFinal + '°') + "";

	let t2;
	let t3;
	let span2;
	let t4_value = /*heat*/ ctx[7].zoneInfo.riskLabel + "";
	let t4;
	let button0_class_value;
	let t5;
	let button1;
	let span3;
	let t7;
	let span4;
	let t8_value = /*rawData*/ ctx[6]?.windMs.toFixed(1) + "";
	let t8;
	let t9;
	let span5;
	let t10_value = /*windResult*/ ctx[8]?.riskLabel + "";
	let t10;
	let button1_class_value;
	let t11;
	let button2;
	let span6;
	let t13;
	let span7;
	let t14_value = /*rawData*/ ctx[6]?.rainMmH.toFixed(1) + "";
	let t14;
	let t15;
	let span8;
	let t16_value = /*rainResult*/ ctx[9]?.riskLabel + "";
	let t16;
	let button2_class_value;
	let t17;
	let button3;
	let span9;
	let t18_value = (/*isNight*/ ctx[13] ? '🌙' : '☀') + "";
	let t18;
	let t19;
	let span10;

	let t20_value = (/*isNight*/ ctx[13]
	? '--'
	: /*rawData*/ ctx[6]?.solarWm2) + "";

	let t20;
	let t21;
	let span11;
	let t22;
	let button3_class_value;
	let t23;
	let button4;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
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
			span4 = element("span");
			t8 = text(t8_value);
			t9 = space();
			span5 = element("span");
			t10 = text(t10_value);
			t11 = space();
			button2 = element("button");
			span6 = element("span");
			span6.textContent = "🌧";
			t13 = space();
			span7 = element("span");
			t14 = text(t14_value);
			t15 = space();
			span8 = element("span");
			t16 = text(t16_value);
			t17 = space();
			button3 = element("button");
			span9 = element("span");
			t18 = text(t18_value);
			t19 = space();
			span10 = element("span");
			t20 = text(t20_value);
			t21 = space();
			span11 = element("span");
			t22 = text(/*solarLabel*/ ctx[19]);
			t23 = space();
			button4 = element("button");
			button4.textContent = "↻";
			attr(span0, "class", "fg-p-ic svelte-14d77el");
			attr(span1, "class", "fg-p-vl svelte-14d77el");
			set_style(span1, "color", /*heat*/ ctx[7].zoneInfo.color);
			attr(span2, "class", "fg-p-lb svelte-14d77el");
			set_style(span2, "color", /*heat*/ ctx[7].zoneInfo.color);
			attr(button0, "class", button0_class_value = "fg-p " + (/*activeCard*/ ctx[5] === 'heat' ? 'fg-p-on' : '') + " svelte-14d77el");
			set_style(button0, "--c", /*heat*/ ctx[7].zoneInfo.color);
			attr(span3, "class", "fg-p-ic svelte-14d77el");
			attr(span4, "class", "fg-p-vl svelte-14d77el");
			set_style(span4, "color", /*windResult*/ ctx[8]?.riskColor);
			attr(span5, "class", "fg-p-lb svelte-14d77el");
			set_style(span5, "color", /*windResult*/ ctx[8]?.riskColor);
			attr(button1, "class", button1_class_value = "fg-p " + (/*activeCard*/ ctx[5] === 'wind' ? 'fg-p-on' : '') + " svelte-14d77el");
			set_style(button1, "--c", /*windResult*/ ctx[8]?.riskColor);
			attr(span6, "class", "fg-p-ic svelte-14d77el");
			attr(span7, "class", "fg-p-vl svelte-14d77el");
			set_style(span7, "color", /*rainResult*/ ctx[9]?.riskColor);
			attr(span8, "class", "fg-p-lb svelte-14d77el");
			set_style(span8, "color", /*rainResult*/ ctx[9]?.riskColor);
			attr(button2, "class", button2_class_value = "fg-p " + (/*activeCard*/ ctx[5] === 'rain' ? 'fg-p-on' : '') + " svelte-14d77el");
			set_style(button2, "--c", /*rainResult*/ ctx[9]?.riskColor);
			attr(span9, "class", "fg-p-ic svelte-14d77el");
			attr(span10, "class", "fg-p-vl svelte-14d77el");
			set_style(span10, "color", /*solarColor*/ ctx[18]);
			attr(span11, "class", "fg-p-lb svelte-14d77el");
			set_style(span11, "color", /*solarColor*/ ctx[18]);
			attr(button3, "class", button3_class_value = "fg-p " + (/*activeCard*/ ctx[5] === 'solar' ? 'fg-p-on' : '') + " svelte-14d77el");
			set_style(button3, "--c", /*solarColor*/ ctx[18]);
			attr(button4, "class", "fg-rfr svelte-14d77el");
			attr(button4, "title", "Refresh");
			attr(div, "class", "fg-bar-pills svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button0);
			append(button0, span0);
			append(button0, t1);
			append(button0, span1);
			append(span1, t2);
			append(button0, t3);
			append(button0, span2);
			append(span2, t4);
			append(div, t5);
			append(div, button1);
			append(button1, span3);
			append(button1, t7);
			append(button1, span4);
			append(span4, t8);
			append(button1, t9);
			append(button1, span5);
			append(span5, t10);
			append(div, t11);
			append(div, button2);
			append(button2, span6);
			append(button2, t13);
			append(button2, span7);
			append(span7, t14);
			append(button2, t15);
			append(button2, span8);
			append(span8, t16);
			append(div, t17);
			append(div, button3);
			append(button3, span9);
			append(span9, t18);
			append(button3, t19);
			append(button3, span10);
			append(span10, t20);
			append(button3, t21);
			append(button3, span11);
			append(span11, t22);
			append(div, t23);
			append(div, button4);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_1*/ ctx[38]),
					listen(button1, "click", /*click_handler_2*/ ctx[39]),
					listen(button2, "click", /*click_handler_3*/ ctx[40]),
					listen(button3, "click", /*click_handler_4*/ ctx[41]),
					listen(button4, "click", /*refreshData*/ ctx[31])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 128 && t2_value !== (t2_value = (/*heat*/ ctx[7].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[7].apparentTempFinal + '°') + "")) set_data(t2, t2_value);

			if (dirty[0] & /*heat*/ 128) {
				set_style(span1, "color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 128 && t4_value !== (t4_value = /*heat*/ ctx[7].zoneInfo.riskLabel + "")) set_data(t4, t4_value);

			if (dirty[0] & /*heat*/ 128) {
				set_style(span2, "color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*activeCard*/ 32 && button0_class_value !== (button0_class_value = "fg-p " + (/*activeCard*/ ctx[5] === 'heat' ? 'fg-p-on' : '') + " svelte-14d77el")) {
				attr(button0, "class", button0_class_value);
			}

			if (dirty[0] & /*heat*/ 128) {
				set_style(button0, "--c", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 64 && t8_value !== (t8_value = /*rawData*/ ctx[6]?.windMs.toFixed(1) + "")) set_data(t8, t8_value);

			if (dirty[0] & /*windResult*/ 256) {
				set_style(span4, "color", /*windResult*/ ctx[8]?.riskColor);
			}

			if (dirty[0] & /*windResult*/ 256 && t10_value !== (t10_value = /*windResult*/ ctx[8]?.riskLabel + "")) set_data(t10, t10_value);

			if (dirty[0] & /*windResult*/ 256) {
				set_style(span5, "color", /*windResult*/ ctx[8]?.riskColor);
			}

			if (dirty[0] & /*activeCard*/ 32 && button1_class_value !== (button1_class_value = "fg-p " + (/*activeCard*/ ctx[5] === 'wind' ? 'fg-p-on' : '') + " svelte-14d77el")) {
				attr(button1, "class", button1_class_value);
			}

			if (dirty[0] & /*windResult*/ 256) {
				set_style(button1, "--c", /*windResult*/ ctx[8]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 64 && t14_value !== (t14_value = /*rawData*/ ctx[6]?.rainMmH.toFixed(1) + "")) set_data(t14, t14_value);

			if (dirty[0] & /*rainResult*/ 512) {
				set_style(span7, "color", /*rainResult*/ ctx[9]?.riskColor);
			}

			if (dirty[0] & /*rainResult*/ 512 && t16_value !== (t16_value = /*rainResult*/ ctx[9]?.riskLabel + "")) set_data(t16, t16_value);

			if (dirty[0] & /*rainResult*/ 512) {
				set_style(span8, "color", /*rainResult*/ ctx[9]?.riskColor);
			}

			if (dirty[0] & /*activeCard*/ 32 && button2_class_value !== (button2_class_value = "fg-p " + (/*activeCard*/ ctx[5] === 'rain' ? 'fg-p-on' : '') + " svelte-14d77el")) {
				attr(button2, "class", button2_class_value);
			}

			if (dirty[0] & /*rainResult*/ 512) {
				set_style(button2, "--c", /*rainResult*/ ctx[9]?.riskColor);
			}

			if (dirty[0] & /*isNight*/ 8192 && t18_value !== (t18_value = (/*isNight*/ ctx[13] ? '🌙' : '☀') + "")) set_data(t18, t18_value);

			if (dirty[0] & /*isNight, rawData*/ 8256 && t20_value !== (t20_value = (/*isNight*/ ctx[13]
			? '--'
			: /*rawData*/ ctx[6]?.solarWm2) + "")) set_data(t20, t20_value);

			if (dirty[0] & /*solarColor*/ 262144) {
				set_style(span10, "color", /*solarColor*/ ctx[18]);
			}

			if (dirty[0] & /*solarLabel*/ 524288) set_data(t22, /*solarLabel*/ ctx[19]);

			if (dirty[0] & /*solarColor*/ 262144) {
				set_style(span11, "color", /*solarColor*/ ctx[18]);
			}

			if (dirty[0] & /*activeCard*/ 32 && button3_class_value !== (button3_class_value = "fg-p " + (/*activeCard*/ ctx[5] === 'solar' ? 'fg-p-on' : '') + " svelte-14d77el")) {
				attr(button3, "class", button3_class_value);
			}

			if (dirty[0] & /*solarColor*/ 262144) {
				set_style(button3, "--c", /*solarColor*/ ctx[18]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (60:2) {#if expanded && heat}
function create_if_block(ctx) {
	let div2;
	let div0;
	let span0;
	let t0;
	let t1_value = (/*lat*/ ctx[1].toFixed(3) + ', ' + /*lon*/ ctx[2].toFixed(3)) + "";
	let t1;
	let t2;
	let span2;
	let span1;
	let t3;
	let t4;
	let t5;
	let div1;
	let t6;

	function select_block_type_1(ctx, dirty) {
		if (/*isNight*/ ctx[13]) return create_if_block_18;
		return create_else_block_4;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block0 = current_block_type(ctx);
	let each_value_5 = ensure_array_like(/*TABS*/ ctx[29]);
	let each_blocks = [];

	for (let i = 0; i < each_value_5.length; i += 1) {
		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
	}

	function select_block_type_2(ctx, dirty) {
		if (/*tab*/ ctx[0] === 'dashboard') return create_if_block_1;
		if (/*tab*/ ctx[0] === 'sos') return create_if_block_9;
		if (/*tab*/ ctx[0] === 'report') return create_if_block_11;
		if (/*tab*/ ctx[0] === 'settings') return create_if_block_14;
	}

	let current_block_type_1 = select_block_type_2(ctx);
	let if_block1 = current_block_type_1 && current_block_type_1(ctx);

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text("📍 ");
			t1 = text(t1_value);
			t2 = space();
			span2 = element("span");
			span1 = element("span");
			t3 = text(/*currentTime*/ ctx[4]);
			t4 = space();
			if_block0.c();
			t5 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t6 = space();
			if (if_block1) if_block1.c();
			attr(span2, "class", "fg-loc-r svelte-14d77el");
			attr(div0, "class", "fg-loc svelte-14d77el");
			attr(div1, "class", "fg-tabs svelte-14d77el");
			attr(div2, "class", "fg-panel svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, span0);
			append(span0, t0);
			append(span0, t1);
			append(div0, t2);
			append(div0, span2);
			append(span2, span1);
			append(span1, t3);
			append(span2, t4);
			if_block0.m(span2, null);
			append(div2, t5);
			append(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}

			append(div2, t6);
			if (if_block1) if_block1.m(div2, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*lat, lon*/ 6 && t1_value !== (t1_value = (/*lat*/ ctx[1].toFixed(3) + ', ' + /*lon*/ ctx[2].toFixed(3)) + "")) set_data(t1, t1_value);
			if (dirty[0] & /*currentTime*/ 16) set_data(t3, /*currentTime*/ ctx[4]);

			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(span2, null);
				}
			}

			if (dirty[0] & /*tab, TABS*/ 536870913) {
				each_value_5 = ensure_array_like(/*TABS*/ ctx[29]);
				let i;

				for (i = 0; i < each_value_5.length; i += 1) {
					const child_ctx = get_each_context_5(ctx, each_value_5, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_5.length;
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if (if_block1) if_block1.d(1);
				if_block1 = current_block_type_1 && current_block_type_1(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div2, null);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			if_block0.d();
			destroy_each(each_blocks, detaching);

			if (if_block1) {
				if_block1.d();
			}
		}
	};
}

// (69:10) {:else}
function create_else_block_4(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "☀";
			attr(span, "class", "fg-dbadge svelte-14d77el");
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

// (68:10) {#if isNight}
function create_if_block_18(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "🌙";
			attr(span, "class", "fg-nbadge svelte-14d77el");
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

// (75:8) {#each TABS as t}
function create_each_block_5(ctx) {
	let button;
	let t0_value = /*t*/ ctx[89].icon + "";
	let t0;
	let t1;
	let t2_value = /*t*/ ctx[89].label + "";
	let t2;
	let t3;
	let button_class_value;
	let mounted;
	let dispose;

	function click_handler_5() {
		return /*click_handler_5*/ ctx[42](/*t*/ ctx[89]);
	}

	return {
		c() {
			button = element("button");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			attr(button, "class", button_class_value = "fg-tab " + (/*tab*/ ctx[0] === /*t*/ ctx[89].id ? 'fg-tab-on' : '') + " svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t0);
			append(button, t1);
			append(button, t2);
			append(button, t3);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_5);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*tab*/ 1 && button_class_value !== (button_class_value = "fg-tab " + (/*tab*/ ctx[0] === /*t*/ ctx[89].id ? 'fg-tab-on' : '') + " svelte-14d77el")) {
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

// (182:35) 
function create_if_block_14(ctx) {
	let div1;
	let div0;
	let t1;
	let t2;
	let div3;
	let div2;
	let t4;
	let t5;
	let if_block1_anchor;

	function select_block_type_7(ctx, dirty) {
		if (/*license*/ ctx[20].valid) return create_if_block_16;
		return create_else_block_3;
	}

	let current_block_type = select_block_type_7(ctx);
	let if_block0 = current_block_type(ctx);
	let each_value_4 = ensure_array_like(Object.entries(PPE_PROFILES));
	let each_blocks = [];

	for (let i = 0; i < each_value_4.length; i += 1) {
		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
	}

	let if_block1 = /*license*/ ctx[20].valid && create_if_block_15(ctx);

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
			div2.textContent = "👷 PPE Profile";
			t4 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			attr(div0, "class", "fg-grp-hd svelte-14d77el");
			attr(div1, "class", "fg-grp svelte-14d77el");
			attr(div2, "class", "fg-grp-hd svelte-14d77el");
			attr(div3, "class", "fg-grp svelte-14d77el");
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
			insert(target, if_block1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_7(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div1, null);
				}
			}

			if (dirty[0] & /*settings*/ 16777216 | dirty[1] & /*saveSettings*/ 2) {
				each_value_4 = ensure_array_like(Object.entries(PPE_PROFILES));
				let i;

				for (i = 0; i < each_value_4.length; i += 1) {
					const child_ctx = get_each_context_4(ctx, each_value_4, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div3, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_4.length;
			}

			if (/*license*/ ctx[20].valid) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_15(ctx);
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
				detach(t2);
				detach(div3);
				detach(t5);
				detach(if_block1_anchor);
			}

			if_block0.d();
			destroy_each(each_blocks, detaching);
			if (if_block1) if_block1.d(detaching);
		}
	};
}

// (163:33) 
function create_if_block_11(ctx) {
	let if_block_anchor;

	function select_block_type_6(ctx, dirty) {
		if (!/*license*/ ctx[20].valid) return create_if_block_12;
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

// (149:30) 
function create_if_block_9(ctx) {
	let if_block_anchor;

	function select_block_type_5(ctx, dirty) {
		if (!/*license*/ ctx[20].valid) return create_if_block_10;
		return create_else_block_1;
	}

	let current_block_type = select_block_type_5(ctx);
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
			if (current_block_type !== (current_block_type = select_block_type_5(ctx))) {
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

// (83:6) {#if tab === 'dashboard'}
function create_if_block_1(ctx) {
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
	let mounted;
	let dispose;
	let if_block0 = /*heat*/ ctx[7].isBanPeriod && create_if_block_8();

	function select_block_type_3(ctx, dirty) {
		if (/*activeCard*/ ctx[5] === 'heat') return create_if_block_3;
		if (/*activeCard*/ ctx[5] === 'wind') return create_if_block_4;
		if (/*activeCard*/ ctx[5] === 'rain') return create_if_block_5;
		if (/*activeCard*/ ctx[5] === 'solar') return create_if_block_6;
	}

	let current_block_type = select_block_type_3(ctx);
	let if_block1 = current_block_type && current_block_type(ctx);
	let each_value = ensure_array_like(/*MODELS*/ ctx[30]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	let if_block2 = !/*license*/ ctx[20].valid && create_if_block_2();

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			div = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			label = element("label");
			input = element("input");
			t3 = text("\n            Worst-case ");
			if (if_block2) if_block2.c();
			attr(select, "class", "fg-mr-sel svelte-14d77el");
			if (/*selectedModel*/ ctx[10] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[43].call(select));
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = !/*license*/ ctx[20].valid;
			attr(input, "class", "svelte-14d77el");
			attr(label, "class", label_class_value = "fg-mr-wc " + (!/*license*/ ctx[20].valid ? 'fg-dis' : '') + " svelte-14d77el");
			attr(div, "class", "fg-mr svelte-14d77el");
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t1, anchor);
			insert(target, div, anchor);
			append(div, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			select_option(select, /*selectedModel*/ ctx[10], true);
			append(div, t2);
			append(div, label);
			append(label, input);
			input.checked = /*worstCaseMode*/ ctx[11];
			append(label, t3);
			if (if_block2) if_block2.m(label, null);

			if (!mounted) {
				dispose = [
					listen(select, "change", /*select_change_handler*/ ctx[43]),
					listen(select, "change", /*refreshData*/ ctx[31]),
					listen(input, "change", /*input_change_handler*/ ctx[44]),
					listen(input, "change", /*refreshData*/ ctx[31])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*heat*/ ctx[7].isBanPeriod) {
				if (if_block0) ; else {
					if_block0 = create_if_block_8();
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if (if_block1) if_block1.d(1);
				if_block1 = current_block_type && current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(t1.parentNode, t1);
				}
			}

			if (dirty[0] & /*MODELS*/ 1073741824) {
				each_value = ensure_array_like(/*MODELS*/ ctx[30]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty[0] & /*selectedModel, MODELS*/ 1073742848) {
				select_option(select, /*selectedModel*/ ctx[10]);
			}

			if (dirty[0] & /*license*/ 1048576 && input_disabled_value !== (input_disabled_value = !/*license*/ ctx[20].valid)) {
				input.disabled = input_disabled_value;
			}

			if (dirty[0] & /*worstCaseMode*/ 2048) {
				input.checked = /*worstCaseMode*/ ctx[11];
			}

			if (!/*license*/ ctx[20].valid) {
				if (if_block2) ; else {
					if_block2 = create_if_block_2();
					if_block2.c();
					if_block2.m(label, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty[0] & /*license*/ 1048576 && label_class_value !== (label_class_value = "fg-mr-wc " + (!/*license*/ ctx[20].valid ? 'fg-dis' : '') + " svelte-14d77el")) {
				attr(label, "class", label_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
				detach(div);
			}

			if (if_block0) if_block0.d(detaching);

			if (if_block1) {
				if_block1.d(detaching);
			}

			destroy_each(each_blocks, detaching);
			if (if_block2) if_block2.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (187:10) {:else}
function create_else_block_3(ctx) {
	let div2;
	let t3;
	let div3;
	let input;
	let button;
	let t4_value = (/*licenseLoading*/ ctx[22] ? '…' : 'Activate') + "";
	let t4;
	let button_disabled_value;
	let t5;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*licenseError*/ ctx[23] && create_if_block_17(ctx);

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = `<div class="fg-lic-ft svelte-14d77el">FREE</div><div class="fg-lic-fl svelte-14d77el">⚡ Worst-case · 📄 Reports · 🚨 SOS</div><a class="fg-btn fg-btn-amb svelte-14d77el" href="https://fieldguard-hse.com" target="_blank">Get Pro</a>`;
			t3 = space();
			div3 = element("div");
			input = element("input");
			button = element("button");
			t4 = text(t4_value);
			t5 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div2, "class", "fg-lic-free svelte-14d77el");
			attr(input, "class", "fg-lic-in svelte-14d77el");
			attr(input, "placeholder", "License key…");
			input.disabled = /*licenseLoading*/ ctx[22];
			attr(button, "class", "fg-lic-ab svelte-14d77el");
			button.disabled = button_disabled_value = /*licenseLoading*/ ctx[22] || !/*licenseKeyInput*/ ctx[21].trim();
			attr(div3, "class", "fg-lic-row svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			insert(target, t3, anchor);
			insert(target, div3, anchor);
			append(div3, input);
			set_input_value(input, /*licenseKeyInput*/ ctx[21]);
			append(div3, button);
			append(button, t4);
			insert(target, t5, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[49]),
					listen(button, "click", /*activateLicense*/ ctx[27])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseLoading*/ 4194304) {
				input.disabled = /*licenseLoading*/ ctx[22];
			}

			if (dirty[0] & /*licenseKeyInput*/ 2097152 && input.value !== /*licenseKeyInput*/ ctx[21]) {
				set_input_value(input, /*licenseKeyInput*/ ctx[21]);
			}

			if (dirty[0] & /*licenseLoading*/ 4194304 && t4_value !== (t4_value = (/*licenseLoading*/ ctx[22] ? '…' : 'Activate') + "")) set_data(t4, t4_value);

			if (dirty[0] & /*licenseLoading, licenseKeyInput*/ 6291456 && button_disabled_value !== (button_disabled_value = /*licenseLoading*/ ctx[22] || !/*licenseKeyInput*/ ctx[21].trim())) {
				button.disabled = button_disabled_value;
			}

			if (/*licenseError*/ ctx[23]) {
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

// (185:10) {#if license.valid}
function create_if_block_16(ctx) {
	let div;
	let span0;
	let span1;
	let t1_value = /*license*/ ctx[20].tier?.toUpperCase() + "";
	let t1;
	let t2;
	let t3_value = /*license*/ ctx[20].expires?.slice(0, 10) + "";
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
			attr(span0, "class", "fg-lic-b svelte-14d77el");
			attr(span1, "class", "fg-lic-i svelte-14d77el");
			attr(button, "class", "fg-lic-d svelte-14d77el");
			attr(div, "class", "fg-lic-act svelte-14d77el");
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
				dispose = listen(button, "click", /*deactivateLicense*/ ctx[28]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*license*/ 1048576 && t1_value !== (t1_value = /*license*/ ctx[20].tier?.toUpperCase() + "")) set_data(t1, t1_value);
			if (dirty[0] & /*license*/ 1048576 && t3_value !== (t3_value = /*license*/ ctx[20].expires?.slice(0, 10) + "")) set_data(t3, t3_value);
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

// (190:12) {#if licenseError}
function create_if_block_17(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚠ ");
			t1 = text(/*licenseError*/ ctx[23]);
			attr(div, "class", "fg-lic-err svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseError*/ 8388608) set_data(t1, /*licenseError*/ ctx[23]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (195:10) {#each Object.entries(PPE_PROFILES) as [key, prof]}
function create_each_block_4(ctx) {
	let label;
	let input;
	let span0;
	let span1;
	let binding_group;
	let mounted;
	let dispose;
	binding_group = init_binding_group(/*$$binding_groups*/ ctx[51][0]);

	return {
		c() {
			label = element("label");
			input = element("input");
			span0 = element("span");
			span0.textContent = `${/*prof*/ ctx[86].label}`;
			span1 = element("span");
			span1.textContent = `+${/*prof*/ ctx[86].adjustment}°C`;
			attr(input, "type", "radio");
			input.__value = /*key*/ ctx[85];
			set_input_value(input, input.__value);
			attr(input, "class", "svelte-14d77el");
			attr(span0, "class", "svelte-14d77el");
			attr(span1, "class", "fg-adjch svelte-14d77el");
			attr(label, "class", "fg-radio svelte-14d77el");
			binding_group.p(input);
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			input.checked = input.__value === /*settings*/ ctx[24].ppeProfile;
			append(label, span0);
			append(label, span1);

			if (!mounted) {
				dispose = [
					listen(input, "change", /*input_change_handler_1*/ ctx[50]),
					listen(input, "change", /*saveSettings*/ ctx[32])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 16777216) {
				input.checked = input.__value === /*settings*/ ctx[24].ppeProfile;
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

// (199:8) {#if license.valid}
function create_if_block_15(ctx) {
	let div3;
	let div0;
	let t1;
	let label0;
	let t2;
	let div1;
	let input0;
	let span0;
	let t3_value = /*settings*/ ctx[24].windWarnMs + "";
	let t3;
	let t4;
	let t5;
	let label1;
	let t6;
	let div2;
	let input1;
	let span1;
	let t7_value = /*settings*/ ctx[24].rainWarnMmh + "";
	let t7;
	let t8;
	let mounted;
	let dispose;

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			div0.textContent = "🎛 Thresholds";
			t1 = space();
			label0 = element("label");
			t2 = text("Wind Warn");
			div1 = element("div");
			input0 = element("input");
			span0 = element("span");
			t3 = text(t3_value);
			t4 = text(" m/s");
			t5 = space();
			label1 = element("label");
			t6 = text("Rain Warn");
			div2 = element("div");
			input1 = element("input");
			span1 = element("span");
			t7 = text(t7_value);
			t8 = text(" mm/h");
			attr(div0, "class", "fg-grp-hd svelte-14d77el");
			attr(input0, "type", "range");
			attr(input0, "min", "5");
			attr(input0, "max", "25");
			attr(input0, "step", "0.5");
			attr(input0, "class", "svelte-14d77el");
			attr(span0, "class", "svelte-14d77el");
			attr(div1, "class", "fg-srow svelte-14d77el");
			attr(label0, "class", "fg-slbl svelte-14d77el");
			attr(input1, "type", "range");
			attr(input1, "min", "1");
			attr(input1, "max", "25");
			attr(input1, "step", "0.5");
			attr(input1, "class", "svelte-14d77el");
			attr(span1, "class", "svelte-14d77el");
			attr(div2, "class", "fg-srow svelte-14d77el");
			attr(label1, "class", "fg-slbl svelte-14d77el");
			attr(div3, "class", "fg-grp svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div3, t1);
			append(div3, label0);
			append(label0, t2);
			append(label0, div1);
			append(div1, input0);
			set_input_value(input0, /*settings*/ ctx[24].windWarnMs);
			append(div1, span0);
			append(span0, t3);
			append(span0, t4);
			append(div3, t5);
			append(div3, label1);
			append(label1, t6);
			append(label1, div2);
			append(div2, input1);
			set_input_value(input1, /*settings*/ ctx[24].rainWarnMmh);
			append(div2, span1);
			append(span1, t7);
			append(span1, t8);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_input_handler*/ ctx[52]),
					listen(input0, "input", /*input0_change_input_handler*/ ctx[52]),
					listen(input0, "change", /*saveSettings*/ ctx[32]),
					listen(input1, "change", /*input1_change_input_handler*/ ctx[53]),
					listen(input1, "input", /*input1_change_input_handler*/ ctx[53]),
					listen(input1, "change", /*saveSettings*/ ctx[32])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 16777216) {
				set_input_value(input0, /*settings*/ ctx[24].windWarnMs);
			}

			if (dirty[0] & /*settings*/ 16777216 && t3_value !== (t3_value = /*settings*/ ctx[24].windWarnMs + "")) set_data(t3, t3_value);

			if (dirty[0] & /*settings*/ 16777216) {
				set_input_value(input1, /*settings*/ ctx[24].rainWarnMmh);
			}

			if (dirty[0] & /*settings*/ 16777216 && t7_value !== (t7_value = /*settings*/ ctx[24].rainWarnMmh + "")) set_data(t7, t7_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (166:8) {:else}
function create_else_block_2(ctx) {
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
	let button;
	let t9;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*reportText*/ ctx[12] && create_if_block_13(ctx);

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
			t6 = text("HSE Manager");
			input3 = element("input");
			t7 = space();
			button = element("button");
			button.textContent = "📋 Generate ISO 7933 Report";
			t9 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(input0, "placeholder", "Project Name");
			attr(input0, "class", "svelte-14d77el");
			attr(label0, "class", "svelte-14d77el");
			attr(input1, "placeholder", "Oman, UAE…");
			attr(input1, "class", "svelte-14d77el");
			attr(label1, "class", "svelte-14d77el");
			attr(input2, "class", "svelte-14d77el");
			attr(label2, "class", "svelte-14d77el");
			attr(input3, "class", "svelte-14d77el");
			attr(label3, "class", "svelte-14d77el");
			attr(div, "class", "fg-rform svelte-14d77el");
			attr(button, "class", "fg-btn svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, label0);
			append(label0, t0);
			append(label0, input0);
			set_input_value(input0, /*reportMeta*/ ctx[25].projectName);
			append(div, t1);
			append(div, label1);
			append(label1, t2);
			append(label1, input1);
			set_input_value(input1, /*reportMeta*/ ctx[25].country);
			append(div, t3);
			append(div, label2);
			append(label2, t4);
			append(label2, input2);
			set_input_value(input2, /*reportMeta*/ ctx[25].clientName);
			append(div, t5);
			append(div, label3);
			append(label3, t6);
			append(label3, input3);
			set_input_value(input3, /*reportMeta*/ ctx[25].hseManagerName);
			insert(target, t7, anchor);
			insert(target, button, anchor);
			insert(target, t9, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[45]),
					listen(input1, "input", /*input1_input_handler*/ ctx[46]),
					listen(input2, "input", /*input2_input_handler*/ ctx[47]),
					listen(input3, "input", /*input3_input_handler*/ ctx[48]),
					listen(button, "click", /*generateReport*/ ctx[33])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*reportMeta*/ 33554432 && input0.value !== /*reportMeta*/ ctx[25].projectName) {
				set_input_value(input0, /*reportMeta*/ ctx[25].projectName);
			}

			if (dirty[0] & /*reportMeta*/ 33554432 && input1.value !== /*reportMeta*/ ctx[25].country) {
				set_input_value(input1, /*reportMeta*/ ctx[25].country);
			}

			if (dirty[0] & /*reportMeta*/ 33554432 && input2.value !== /*reportMeta*/ ctx[25].clientName) {
				set_input_value(input2, /*reportMeta*/ ctx[25].clientName);
			}

			if (dirty[0] & /*reportMeta*/ 33554432 && input3.value !== /*reportMeta*/ ctx[25].hseManagerName) {
				set_input_value(input3, /*reportMeta*/ ctx[25].hseManagerName);
			}

			if (/*reportText*/ ctx[12]) {
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
				detach(div);
				detach(t7);
				detach(button);
				detach(t9);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (164:8) {#if !license.valid}
function create_if_block_12(ctx) {
	let div2;

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = `<div class="fg-gate-ic svelte-14d77el">📄</div><div class="fg-gate-ti svelte-14d77el">Reports — Pro Feature</div><a class="fg-gate-btn svelte-14d77el" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a>`;
			attr(div2, "class", "fg-gate svelte-14d77el");
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

// (174:10) {#if reportText}
function create_if_block_13(ctx) {
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
			span.textContent = "Ready";
			button0 = element("button");
			button0.textContent = "Copy";
			button1 = element("button");
			button1.textContent = ".txt";
			t3 = space();
			pre = element("pre");
			t4 = text(/*reportText*/ ctx[12]);
			attr(span, "class", "svelte-14d77el");
			attr(button0, "class", "fg-rep-btn svelte-14d77el");
			attr(button1, "class", "fg-rep-btn svelte-14d77el");
			attr(div0, "class", "fg-rep-bar svelte-14d77el");
			attr(pre, "class", "fg-rep-txt svelte-14d77el");
			attr(div1, "class", "fg-rep svelte-14d77el");
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
					listen(button0, "click", /*copyReport*/ ctx[34]),
					listen(button1, "click", /*downloadReport*/ ctx[35])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*reportText*/ 4096) set_data(t4, /*reportText*/ ctx[12]);
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

// (152:8) {:else}
function create_else_block_1(ctx) {
	let div3;
	let div0;
	let t1;
	let div1;
	let t2;
	let div2;
	let t4;
	let each_value_3 = ensure_array_like(HEAT_STRESS_SYMPTOMS);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	let each_value_2 = ensure_array_like(EMERGENCY_RESPONSE);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

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
			div2.textContent = "🚑 Response";
			t4 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", "fg-emg-w svelte-14d77el");
			attr(div1, "class", "fg-emg-syms svelte-14d77el");
			attr(div2, "class", "fg-emg-hd svelte-14d77el");
			attr(div3, "class", "fg-emg svelte-14d77el");
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
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}

			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (150:8) {#if !license.valid}
function create_if_block_10(ctx) {
	let div2;

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = `<div class="fg-gate-ic svelte-14d77el">🚨</div><div class="fg-gate-ti svelte-14d77el">SOS — Pro Feature</div><a class="fg-gate-btn svelte-14d77el" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a>`;
			attr(div2, "class", "fg-gate svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}
		}
	};
}

// (155:37) {#each HEAT_STRESS_SYMPTOMS as s}
function create_each_block_3(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = `${/*s*/ ctx[82]}`;
			attr(span, "class", "fg-sym svelte-14d77el");
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

// (157:12) {#each EMERGENCY_RESPONSE as step, i}
function create_each_block_2(ctx) {
	let div;
	let span;
	let t1;
	let t2;

	return {
		c() {
			div = element("div");
			span = element("span");
			span.textContent = `${/*i*/ ctx[81] + 1}`;
			t1 = space();
			t2 = text(/*step*/ ctx[79]);
			attr(span, "class", "fg-emg-n svelte-14d77el");
			attr(div, "class", "fg-emg-step " + (/*step*/ ctx[79].includes('SEVERE') ? 'fg-emg-crit' : '') + " svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span);
			append(div, t1);
			append(div, t2);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (84:8) {#if heat.isBanPeriod}
function create_if_block_8(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "🚫 LEGAL WORK BAN · 12:30–15:30";
			attr(div, "class", "fg-ban svelte-14d77el");
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

// (124:41) 
function create_if_block_6(ctx) {
	let div1;
	let div0;

	let t0_value = (/*isNight*/ ctx[13]
	? '🌙 Night'
	: '☀ Solar — ' + /*solarLabel*/ ctx[19]) + "";

	let t0;
	let t1;

	function select_block_type_4(ctx, dirty) {
		if (/*isNight*/ ctx[13]) return create_if_block_7;
		return create_else_block;
	}

	let current_block_type = select_block_type_4(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			if_block.c();
			attr(div0, "class", "fg-det-ti svelte-14d77el");
			set_style(div0, "color", /*solarColor*/ ctx[18]);
			attr(div1, "class", "fg-det svelte-14d77el");
			set_style(div1, "border-color", /*solarColor*/ ctx[18]);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div1, t1);
			if_block.m(div1, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*isNight, solarLabel*/ 532480 && t0_value !== (t0_value = (/*isNight*/ ctx[13]
			? '🌙 Night'
			: '☀ Solar — ' + /*solarLabel*/ ctx[19]) + "")) set_data(t0, t0_value);

			if (dirty[0] & /*solarColor*/ 262144) {
				set_style(div0, "color", /*solarColor*/ ctx[18]);
			}

			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (dirty[0] & /*solarColor*/ 262144) {
				set_style(div1, "border-color", /*solarColor*/ ctx[18]);
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

// (116:40) 
function create_if_block_5(ctx) {
	let div4;
	let div0;
	let t0;
	let t1_value = /*rainResult*/ ctx[9]?.riskLabel + "";
	let t1;
	let t2;
	let div3;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[6]?.rainMmH.toFixed(1) + "";
	let t3;
	let span1;
	let t5;
	let div2;
	let span2;
	let t6_value = /*rainResult*/ ctx[9]?.intensityLabel + "";
	let t6;
	let span3;

	return {
		c() {
			div4 = element("div");
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
			attr(div0, "class", "fg-det-ti svelte-14d77el");
			set_style(div0, "color", /*rainResult*/ ctx[9]?.riskColor);
			attr(span0, "class", "fg-dv svelte-14d77el");
			attr(span1, "class", "fg-dl svelte-14d77el");
			attr(div1, "class", "fg-dc svelte-14d77el");
			attr(span2, "class", "fg-dv svelte-14d77el");
			attr(span3, "class", "fg-dl svelte-14d77el");
			attr(div2, "class", "fg-dc svelte-14d77el");
			attr(div3, "class", "fg-det-g svelte-14d77el");
			attr(div4, "class", "fg-det svelte-14d77el");
			set_style(div4, "border-color", /*rainResult*/ ctx[9]?.riskColor);
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div0);
			append(div0, t0);
			append(div0, t1);
			append(div4, t2);
			append(div4, div3);
			append(div3, div1);
			append(div1, span0);
			append(span0, t3);
			append(div1, span1);
			append(div3, t5);
			append(div3, div2);
			append(div2, span2);
			append(span2, t6);
			append(div2, span3);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rainResult*/ 512 && t1_value !== (t1_value = /*rainResult*/ ctx[9]?.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*rainResult*/ 512) {
				set_style(div0, "color", /*rainResult*/ ctx[9]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 64 && t3_value !== (t3_value = /*rawData*/ ctx[6]?.rainMmH.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rainResult*/ 512 && t6_value !== (t6_value = /*rainResult*/ ctx[9]?.intensityLabel + "")) set_data(t6, t6_value);

			if (dirty[0] & /*rainResult*/ 512) {
				set_style(div4, "border-color", /*rainResult*/ ctx[9]?.riskColor);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div4);
			}
		}
	};
}

// (107:40) 
function create_if_block_4(ctx) {
	let div5;
	let div0;
	let t0;
	let t1_value = /*windResult*/ ctx[8]?.riskLabel + "";
	let t1;
	let t2;
	let div4;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[6]?.windMs.toFixed(1) + "";
	let t3;
	let t4;
	let span1;
	let t6;
	let div2;
	let span2;
	let t7_value = ((/*rawData*/ ctx[6]?.windMs ?? 0) * 3.6).toFixed(1) + "";
	let t7;
	let span3;
	let t9;
	let div3;
	let span4;
	let t10;
	let t11_value = /*windResult*/ ctx[8]?.beaufort + "";
	let t11;
	let span5;
	let t12_value = /*windResult*/ ctx[8]?.beaufortDesc + "";
	let t12;

	return {
		c() {
			div5 = element("div");
			div0 = element("div");
			t0 = text("💨 Wind — ");
			t1 = text(t1_value);
			t2 = space();
			div4 = element("div");
			div1 = element("div");
			span0 = element("span");
			t3 = text(t3_value);
			t4 = text(" m/s");
			span1 = element("span");
			span1.textContent = "Speed";
			t6 = space();
			div2 = element("div");
			span2 = element("span");
			t7 = text(t7_value);
			span3 = element("span");
			span3.textContent = "km/h";
			t9 = space();
			div3 = element("div");
			span4 = element("span");
			t10 = text("Bft ");
			t11 = text(t11_value);
			span5 = element("span");
			t12 = text(t12_value);
			attr(div0, "class", "fg-det-ti svelte-14d77el");
			set_style(div0, "color", /*windResult*/ ctx[8]?.riskColor);
			attr(span0, "class", "fg-dv svelte-14d77el");
			attr(span1, "class", "fg-dl svelte-14d77el");
			attr(div1, "class", "fg-dc svelte-14d77el");
			attr(span2, "class", "fg-dv svelte-14d77el");
			attr(span3, "class", "fg-dl svelte-14d77el");
			attr(div2, "class", "fg-dc svelte-14d77el");
			attr(span4, "class", "fg-dv svelte-14d77el");
			attr(span5, "class", "fg-dl svelte-14d77el");
			attr(div3, "class", "fg-dc svelte-14d77el");
			attr(div4, "class", "fg-det-g svelte-14d77el");
			attr(div5, "class", "fg-det svelte-14d77el");
			set_style(div5, "border-color", /*windResult*/ ctx[8]?.riskColor);
		},
		m(target, anchor) {
			insert(target, div5, anchor);
			append(div5, div0);
			append(div0, t0);
			append(div0, t1);
			append(div5, t2);
			append(div5, div4);
			append(div4, div1);
			append(div1, span0);
			append(span0, t3);
			append(span0, t4);
			append(div1, span1);
			append(div4, t6);
			append(div4, div2);
			append(div2, span2);
			append(span2, t7);
			append(div2, span3);
			append(div4, t9);
			append(div4, div3);
			append(div3, span4);
			append(span4, t10);
			append(span4, t11);
			append(div3, span5);
			append(span5, t12);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*windResult*/ 256 && t1_value !== (t1_value = /*windResult*/ ctx[8]?.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*windResult*/ 256) {
				set_style(div0, "color", /*windResult*/ ctx[8]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 64 && t3_value !== (t3_value = /*rawData*/ ctx[6]?.windMs.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rawData*/ 64 && t7_value !== (t7_value = ((/*rawData*/ ctx[6]?.windMs ?? 0) * 3.6).toFixed(1) + "")) set_data(t7, t7_value);
			if (dirty[0] & /*windResult*/ 256 && t11_value !== (t11_value = /*windResult*/ ctx[8]?.beaufort + "")) set_data(t11, t11_value);
			if (dirty[0] & /*windResult*/ 256 && t12_value !== (t12_value = /*windResult*/ ctx[8]?.beaufortDesc + "")) set_data(t12, t12_value);

			if (dirty[0] & /*windResult*/ 256) {
				set_style(div5, "border-color", /*windResult*/ ctx[8]?.riskColor);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div5);
			}
		}
	};
}

// (88:8) {#if activeCard === 'heat'}
function create_if_block_3(ctx) {
	let div13;
	let div0;
	let t0;
	let t1_value = /*heat*/ ctx[7].zoneInfo.riskLabel + "";
	let t1;
	let t2;
	let div7;
	let div1;
	let span0;
	let t3_value = /*rawData*/ ctx[6]?.tempC + "";
	let t3;
	let t4;
	let span1;
	let t6;
	let div2;
	let span2;
	let t7_value = /*rawData*/ ctx[6]?.humidity + "";
	let t7;
	let t8;
	let span3;
	let t10;
	let div3;
	let span4;
	let t11_value = /*heat*/ ctx[7].apparentTemp1 + "";
	let t11;
	let t12;
	let span5;
	let t14;
	let div4;
	let span6;

	let t15_value = (/*heat*/ ctx[7].apparentTempFinal === 999
	? 'NW'
	: /*heat*/ ctx[7].apparentTempFinal + '°C') + "";

	let t15;
	let span7;
	let t17;
	let div5;
	let span8;
	let t18_value = /*heat*/ ctx[7].wbgtBase + "";
	let t18;
	let t19;
	let span9;
	let t21;
	let div6;
	let span10;
	let t22_value = /*heat*/ ctx[7].wbgtAdjusted + "";
	let t22;
	let t23;
	let span11;
	let t25;
	let div11;
	let div8;
	let span12;
	let span13;
	let t27_value = /*heat*/ ctx[7].workRestSchedule.light + "";
	let t27;
	let t28;
	let div9;
	let span14;
	let span15;
	let t30_value = /*heat*/ ctx[7].workRestSchedule.heavy + "";
	let t30;
	let t31;
	let div10;
	let span16;
	let span17;
	let t33_value = /*heat*/ ctx[7].hydration + "";
	let t33;
	let t34;
	let div12;
	let t36;
	let each_value_1 = ensure_array_like(/*heat*/ ctx[7].zoneInfo.mandatoryControls);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			div13 = element("div");
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
			span12.textContent = "🕐 Light";
			span13 = element("span");
			t27 = text(t27_value);
			t28 = space();
			div9 = element("div");
			span14 = element("span");
			span14.textContent = "💪 Heavy";
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

			attr(div0, "class", "fg-det-ti svelte-14d77el");
			set_style(div0, "color", /*heat*/ ctx[7].zoneInfo.color);
			attr(span0, "class", "fg-dv svelte-14d77el");
			attr(span1, "class", "fg-dl svelte-14d77el");
			attr(div1, "class", "fg-dc svelte-14d77el");
			attr(span2, "class", "fg-dv svelte-14d77el");
			attr(span3, "class", "fg-dl svelte-14d77el");
			attr(div2, "class", "fg-dc svelte-14d77el");
			attr(span4, "class", "fg-dv svelte-14d77el");
			attr(span5, "class", "fg-dl svelte-14d77el");
			attr(div3, "class", "fg-dc svelte-14d77el");
			attr(span6, "class", "fg-dv svelte-14d77el");
			set_style(span6, "color", /*heat*/ ctx[7].zoneInfo.color);
			attr(span7, "class", "fg-dl svelte-14d77el");
			attr(div4, "class", "fg-dc svelte-14d77el");
			attr(span8, "class", "fg-dv svelte-14d77el");
			attr(span9, "class", "fg-dl svelte-14d77el");
			attr(div5, "class", "fg-dc svelte-14d77el");
			attr(span10, "class", "fg-dv svelte-14d77el");
			attr(span11, "class", "fg-dl svelte-14d77el");
			attr(div6, "class", "fg-dc svelte-14d77el");
			attr(div7, "class", "fg-det-g svelte-14d77el");
			attr(span12, "class", "fg-drl svelte-14d77el");
			attr(span13, "class", "fg-drv svelte-14d77el");
			attr(div8, "class", "fg-dr svelte-14d77el");
			attr(span14, "class", "fg-drl svelte-14d77el");
			attr(span15, "class", "fg-drv svelte-14d77el");
			attr(div9, "class", "fg-dr svelte-14d77el");
			attr(span16, "class", "fg-drl svelte-14d77el");
			attr(span17, "class", "fg-drv svelte-14d77el");
			attr(div10, "class", "fg-dr svelte-14d77el");
			attr(div11, "class", "fg-ds svelte-14d77el");
			attr(div12, "class", "fg-dct svelte-14d77el");
			attr(div13, "class", "fg-det svelte-14d77el");
			set_style(div13, "border-color", /*heat*/ ctx[7].zoneInfo.color);
		},
		m(target, anchor) {
			insert(target, div13, anchor);
			append(div13, div0);
			append(div0, t0);
			append(div0, t1);
			append(div13, t2);
			append(div13, div7);
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
			append(div13, t25);
			append(div13, div11);
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
			append(div13, t34);
			append(div13, div12);
			append(div13, t36);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div13, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 128 && t1_value !== (t1_value = /*heat*/ ctx[7].zoneInfo.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*heat*/ 128) {
				set_style(div0, "color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 64 && t3_value !== (t3_value = /*rawData*/ ctx[6]?.tempC + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rawData*/ 64 && t7_value !== (t7_value = /*rawData*/ ctx[6]?.humidity + "")) set_data(t7, t7_value);
			if (dirty[0] & /*heat*/ 128 && t11_value !== (t11_value = /*heat*/ ctx[7].apparentTemp1 + "")) set_data(t11, t11_value);

			if (dirty[0] & /*heat*/ 128 && t15_value !== (t15_value = (/*heat*/ ctx[7].apparentTempFinal === 999
			? 'NW'
			: /*heat*/ ctx[7].apparentTempFinal + '°C') + "")) set_data(t15, t15_value);

			if (dirty[0] & /*heat*/ 128) {
				set_style(span6, "color", /*heat*/ ctx[7].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 128 && t18_value !== (t18_value = /*heat*/ ctx[7].wbgtBase + "")) set_data(t18, t18_value);
			if (dirty[0] & /*heat*/ 128 && t22_value !== (t22_value = /*heat*/ ctx[7].wbgtAdjusted + "")) set_data(t22, t22_value);
			if (dirty[0] & /*heat*/ 128 && t27_value !== (t27_value = /*heat*/ ctx[7].workRestSchedule.light + "")) set_data(t27, t27_value);
			if (dirty[0] & /*heat*/ 128 && t30_value !== (t30_value = /*heat*/ ctx[7].workRestSchedule.heavy + "")) set_data(t30, t30_value);
			if (dirty[0] & /*heat*/ 128 && t33_value !== (t33_value = /*heat*/ ctx[7].hydration + "")) set_data(t33, t33_value);

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
						each_blocks[i].m(div13, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}

			if (dirty[0] & /*heat*/ 128) {
				set_style(div13, "border-color", /*heat*/ ctx[7].zoneInfo.color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div13);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (129:12) {:else}
function create_else_block(ctx) {
	let div3;
	let div0;
	let span0;
	let t0_value = /*rawData*/ ctx[6]?.solarWm2 + "";
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
			t5 = text(/*uvIndex*/ ctx[15]);
			span3 = element("span");
			span3.textContent = "Index";
			t7 = space();
			div2 = element("div");
			span4 = element("span");
			t8 = text(/*solarElevDeg*/ ctx[14]);
			t9 = text("°");
			span5 = element("span");
			span5.textContent = "Sun angle";
			attr(span0, "class", "fg-dv svelte-14d77el");
			attr(span1, "class", "fg-dl svelte-14d77el");
			attr(div0, "class", "fg-dc svelte-14d77el");
			attr(span2, "class", "fg-dv svelte-14d77el");
			attr(span3, "class", "fg-dl svelte-14d77el");
			attr(div1, "class", "fg-dc svelte-14d77el");
			attr(span4, "class", "fg-dv svelte-14d77el");
			attr(span5, "class", "fg-dl svelte-14d77el");
			attr(div2, "class", "fg-dc svelte-14d77el");
			attr(div3, "class", "fg-det-g svelte-14d77el");
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
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 64 && t0_value !== (t0_value = /*rawData*/ ctx[6]?.solarWm2 + "")) set_data(t0, t0_value);
			if (dirty[0] & /*uvIndex*/ 32768) set_data(t5, /*uvIndex*/ ctx[15]);
			if (dirty[0] & /*solarElevDeg*/ 16384) set_data(t8, /*solarElevDeg*/ ctx[14]);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (127:12) {#if isNight}
function create_if_block_7(ctx) {
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
			t2 = text(/*sunriseTime*/ ctx[16]);
			t3 = text(" · Sunset: ");
			t4 = text(/*sunsetTime*/ ctx[17]);
			attr(div, "class", "fg-night svelte-14d77el");
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
			if (dirty[0] & /*sunriseTime*/ 65536) set_data(t2, /*sunriseTime*/ ctx[16]);
			if (dirty[0] & /*sunsetTime*/ 131072) set_data(t4, /*sunsetTime*/ ctx[17]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (105:12) {#each heat.zoneInfo.mandatoryControls as c}
function create_each_block_1(ctx) {
	let div;
	let t0;
	let t1_value = /*c*/ ctx[76] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("▸ ");
			t1 = text(t1_value);
			attr(div, "class", "fg-dci svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 128 && t1_value !== (t1_value = /*c*/ ctx[76] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (141:12) {#each MODELS as m}
function create_each_block(ctx) {
	let option;
	let t_1_value = /*m*/ ctx[73].label + "";
	let t_1;

	return {
		c() {
			option = element("option");
			t_1 = text(t_1_value);
			option.__value = /*m*/ ctx[73].key;
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

// (145:23) {#if !license.valid}
function create_if_block_2(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-proch svelte-14d77el");
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

function create_fragment(ctx) {
	let div2;
	let div1;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let span0;
	let t2;
	let span1;
	let t4;
	let t5;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*heat*/ ctx[7]) return create_if_block_19;
		if (/*loading*/ ctx[3]) return create_if_block_20;
		return create_else_block_5;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = expanded && /*heat*/ ctx[7] && create_if_block(ctx);

	return {
		c() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			span0 = element("span");
			span0.textContent = "FieldGuard";
			t2 = space();
			span1 = element("span");
			span1.textContent = `${expanded ? '▲' : '▼'}`;
			t4 = space();
			if_block0.c();
			t5 = space();
			if (if_block1) if_block1.c();
			attr(img, "class", "fg-bar-logo svelte-14d77el");
			if (!src_url_equal(img.src, img_src_value = "./assets/logo-white.png")) attr(img, "src", img_src_value);
			attr(img, "onerror", "this.style.display='none'");
			attr(img, "alt", "FG");
			attr(span0, "class", "fg-bar-title svelte-14d77el");
			attr(span1, "class", "fg-bar-chevron svelte-14d77el");
			attr(div0, "class", "fg-bar-brand svelte-14d77el");
			attr(div1, "class", "fg-bar svelte-14d77el");
			toggle_class(div1, "fg-expanded", expanded);
			attr(div2, "class", "fg-wrap svelte-14d77el");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div1);
			append(div1, div0);
			append(div0, img);
			append(div0, t0);
			append(div0, span0);
			append(div0, t2);
			append(div0, span1);
			append(div1, t4);
			if_block0.m(div1, null);
			append(div2, t5);
			if (if_block1) if_block1.m(div2, null);

			if (!mounted) {
				dispose = listen(div0, "click", /*click_handler*/ ctx[37]);
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
					if_block0.m(div1, null);
				}
			}

			if (expanded && /*heat*/ ctx[7]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(div2, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			if_block0.d();
			if (if_block1) if_block1.d();
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
	let loading = false;
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
	let solarColor = '#4a6090';
	let solarLabel = 'LOW';

	function updateSolarState(inputs) {
		const now = new Date();
		const sol = calcSolarPosition(lat, lon, now);
		$$invalidate(13, isNight = sol.elev < -0.833);
		$$invalidate(14, solarElevDeg = Math.round(sol.elev * 10) / 10);

		$$invalidate(16, sunriseTime = fmtLocalSolarTime(sol.sunrise_LST));
		$$invalidate(17, sunsetTime = fmtLocalSolarTime(sol.sunset_LST));
		fmtLocalSolarTime(sol.solarNoon_LST);
		$$invalidate(15, uvIndex = isNight ? 0 : Math.round(inputs.solarWm2 / 25));
		const albedo = 0.37, emiss = 0.95, sigma = 5.67e-8;
		const Tk = inputs.tempC + 273.15;
		const Tg_K = Math.pow((1 - albedo) * inputs.solarWm2 / (emiss * sigma) + Tk ** 4, 0.25);
		const Tg = Tg_K - 273.15;
		Math.round(0.2 * (Tg - inputs.tempC) * 10) / 10;
		const w = inputs.solarWm2;

		if (isNight) {
			$$invalidate(18, solarColor = '#a5b4fc');
			$$invalidate(19, solarLabel = 'NIGHT');
		} else if (w < 200) {
			$$invalidate(18, solarColor = '#16a34a');
			$$invalidate(19, solarLabel = 'LOW');
		} else if (w < 600) {
			$$invalidate(18, solarColor = '#d97706');
			$$invalidate(19, solarLabel = 'MODERATE');
		} else if (w < 900) {
			$$invalidate(18, solarColor = '#dc2626');
			$$invalidate(19, solarLabel = 'HIGH');
		} else {
			$$invalidate(18, solarColor = '#7c3aed');
			$$invalidate(19, solarLabel = 'EXTREME');
		}
	}

	function toggleAndExpand(id) {
		if (activeCard === id) {
			expanded = !expanded;
		} else {
			$$invalidate(5, activeCard = id);
			expanded = true;
		}
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
					$$invalidate(20, license = p);
					$$invalidate(11, worstCaseMode = true);
				}
			}
		} catch {
			
		}
	}

	async function activateLicense() {
		const key = licenseKeyInput.trim();
		if (!key) return;
		$$invalidate(22, licenseLoading = true);
		$$invalidate(23, licenseError = '');

		try {
			const res = await fetch('https://fieldguard-hse.com/api/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, fingerprint: navigator.userAgent })
			});

			if (!res.ok) throw new Error(`Server error: ${res.status}`);
			const data = await res.json();

			if (data.valid) {
				$$invalidate(20, license = {
					valid: true,
					tier: data.tier,
					expires: data.expires,
					token: data.token
				});

				localStorage.setItem('fg_license', JSON.stringify(license));
				$$invalidate(21, licenseKeyInput = '');
				$$invalidate(11, worstCaseMode = true);
				refreshData();
			} else {
				$$invalidate(23, licenseError = data.message ?? 'Invalid license key.');
			}
		} catch(e) {
			$$invalidate(23, licenseError = (e.message?.includes('fetch'))
			? 'Cannot reach fieldguard-hse.com'
			: e.message ?? 'Activation failed.');
		}

		$$invalidate(22, licenseLoading = false);
	}

	function deactivateLicense() {
		$$invalidate(20, license = { valid: false, tier: '', expires: '' });
		localStorage.removeItem('fg_license');
		$$invalidate(11, worstCaseMode = false);
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
		$$invalidate(4, currentTime = new Date().toLocaleTimeString());

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

			modelResults = results;
			$$invalidate(6, rawData = results[0].raw);
			$$invalidate(7, heat = results[0].heat);
			$$invalidate(8, windResult = results[0].wind);
			$$invalidate(9, rainResult = results[0].rain);
			worstModelLabel = results[0].modelLabel;
			updateSolarState(rawData);
			checkAlerts();
		} catch {
		}

		$$invalidate(3, loading = false);
	}

	function checkAlerts() {
		if (!heat || !windResult || !rainResult) return;
		const time = new Date().toLocaleTimeString();

		if (heat.zone !== 'green') alertLog = [
			...alertLog,
			{
				time,
				type: `🌡 HEAT — ${heat.zoneInfo.riskLabel}`,
				color: heat.zoneInfo.color,
				message: `App.Temp: ${heat.apparentTempFinal === 999
				? 'NO WORK'
				: heat.apparentTempFinal + '°C'} | ${heat.zoneInfo.label}`
			}
		];

		if (windResult.exceedsThreshold) alertLog = [
			...alertLog,
			{
				time,
				type: '💨 WIND ALERT',
				color: windResult.riskColor,
				message: `${rawData?.windMs.toFixed(1)} m/s — Bft ${windResult.beaufort} (${windResult.beaufortDesc})`
			}
		];

		if (rainResult.exceedsThreshold) alertLog = [
			...alertLog,
			{
				time,
				type: '🌧 RAIN ALERT',
				color: rainResult.riskColor,
				message: `${rawData?.rainMmH.toFixed(1)} mm/h — ${rainResult.intensityLabel}`
			}
		];

		if (heat.isBanPeriod) alertLog = [
			...alertLog,
			{
				time,
				type: '🚫 LEGAL WORK BAN',
				color: '#f97316',
				message: `12:30–15:30 outdoor ban active`
			}
		];

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

		$$invalidate(12, reportText = generateWeeklyReport(rd));
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
			if (s) $$invalidate(24, settings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) });
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
	const click_handler = () => expanded = !expanded;
	const click_handler_1 = () => toggleAndExpand('heat');
	const click_handler_2 = () => toggleAndExpand('wind');
	const click_handler_3 = () => toggleAndExpand('rain');
	const click_handler_4 = () => toggleAndExpand('solar');
	const click_handler_5 = t => $$invalidate(0, tab = t.id);

	function select_change_handler() {
		selectedModel = select_value(this);
		$$invalidate(10, selectedModel);
		$$invalidate(30, MODELS);
	}

	function input_change_handler() {
		worstCaseMode = this.checked;
		$$invalidate(11, worstCaseMode);
	}

	function input0_input_handler() {
		reportMeta.projectName = this.value;
		$$invalidate(25, reportMeta);
	}

	function input1_input_handler() {
		reportMeta.country = this.value;
		$$invalidate(25, reportMeta);
	}

	function input2_input_handler() {
		reportMeta.clientName = this.value;
		$$invalidate(25, reportMeta);
	}

	function input3_input_handler() {
		reportMeta.hseManagerName = this.value;
		$$invalidate(25, reportMeta);
	}

	function input_input_handler() {
		licenseKeyInput = this.value;
		$$invalidate(21, licenseKeyInput);
	}

	function input_change_handler_1() {
		settings.ppeProfile = this.__value;
		$$invalidate(24, settings);
	}

	function input0_change_input_handler() {
		settings.windWarnMs = to_number(this.value);
		$$invalidate(24, settings);
	}

	function input1_change_input_handler() {
		settings.rainWarnMmh = to_number(this.value);
		$$invalidate(24, settings);
	}

	return [
		tab,
		lat,
		lon,
		loading,
		currentTime,
		activeCard,
		rawData,
		heat,
		windResult,
		rainResult,
		selectedModel,
		worstCaseMode,
		reportText,
		isNight,
		solarElevDeg,
		uvIndex,
		sunriseTime,
		sunsetTime,
		solarColor,
		solarLabel,
		license,
		licenseKeyInput,
		licenseLoading,
		licenseError,
		settings,
		reportMeta,
		toggleAndExpand,
		activateLicense,
		deactivateLicense,
		TABS,
		MODELS,
		refreshData,
		saveSettings,
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
		select_change_handler,
		input_change_handler,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler,
		input3_input_handler,
		input_input_handler,
		input_change_handler_1,
		$$binding_groups,
		input0_change_input_handler,
		input1_change_input_handler
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 36 }, add_css, [-1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[36];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
