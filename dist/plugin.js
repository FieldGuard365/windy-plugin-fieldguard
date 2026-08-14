const __pluginConfig =  {
  "name": "windy-plugin-fieldguard",
  "version": "3.1.0",
  "icon": "🛡️",
  "title": "FieldGuard — HSE Field Safety",
  "description": "Real-time HSE safety monitor for outdoor crews. Six site hazards on one pin — heat stress (WBGT), cold (wind chill), wind, rain, storm/lightning and solar/UV — across all Windy models, with a worst-case engine, configurable thresholds and 24/7 email alerts (browser closed). Site tier adds real-time lightning strike stop-work rings, Forecast Watch lookahead, and one-click ISO 7933 / FIDIC 8.4 audit reports.",
  "author": "FieldGuard HSE",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "routerPath": "/fieldguard/:lat?/:lon?",
  "listenToLocationChange": true,
  "hooks": "contextmenu",
  "built": 1786706272427,
  "builtReadable": "2026-08-14T11:17:52.427Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import { map } from '@windy/map';
const { map } = W.map;

// transformCode: import broadcast from '@windy/broadcast';
const broadcast = W.broadcast;


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

function null_to_empty(value) {
	return value == null ? '' : value;
}

function action_destroyer(action_result) {
	return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
 * @returns {(event: any) => any} */
function stop_propagation(fn) {
	return function (event) {
		event.stopPropagation();
		// @ts-ignore
		return fn.call(this, event);
	};
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
 * FieldGuard HSE Calculations
 *
 * Standards alignment:
 *   - ISO 7243:2017 — WBGT heat-stress index
 *   - ISO 7933:2004 — Analytical determination of thermal strain (PHS)
 *   - ACGIH TLV® — heat- and cold-stress action levels
 *
 * Core method: 2-step Apparent Temperature lookup
 *   Step 1: Temp (°C) + Humidity (%) → Apparent Temp (°C) [Chart A]
 *   Step 2: Apparent Temp + Wind (m/s) → Final Apparent Temp [Chart B]
 *   Output zone: Green / Amber / Red / Purple / Black (No Work)
 *
 * Midday outdoor work ban (configurable): 12:30–15:30, June/July/August.
 * Stop work when temp exceeds 50°C ambient (when monitor unavailable).
 */ // Heat-stress zones (Apparent Temperature bands → controls)
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
// ─── Chart A: Temp × Humidity → Apparent Temp ───────────────────────────────
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
// ─── Chart B: Apparent Temp × Wind → Final Apparent Temp ────────────────────
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
function assessHeatStress(inputs, ppeKey, localHour, month, ban) {
    const appTemp1 = calcApparentTemp(inputs.tempC, inputs.humidity);
    const appTempFinal = calcFinalApparentTemp(appTemp1, inputs.windMs);
    const zone = apparentTempToZone(appTempFinal, inputs.tempC);
    const zoneInfo = ZONES[zone];
    const wbgtBase = calcWBGT(inputs);
    const wbgtAdj = calcAdjustedWBGT(wbgtBase, ppeKey);
    const heatIdx = calcHeatIndex(inputs.tempC, inputs.humidity);
    // Statutory midday outdoor-work ban for the pin's country (if any).
    const isBanPeriod = !!ban && ban.months.includes(month) && localHour >= ban.start && localHour < ban.end;
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
// ─── Symptom & Emergency reference ───────────────────────────────────────────
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
/** Wind chill in °C (Environment Canada / NWS 2001). Valid for T ≤ 10°C and wind ≥ ~5 km/h. */ function calcWindChill(tempC, windMs) {
    const vKmh = windMs * 3.6;
    if (tempC > 10 || vKmh < 4.8) return Math.round(tempC * 10) / 10;
    const v16 = Math.pow(vKmh, 0.16);
    const wc = 13.12 + 0.6215 * tempC - 11.37 * v16 + 0.3965 * tempC * v16;
    return Math.round(wc * 10) / 10;
}
function assessColdStress(tempC, windMs) {
    const wc = calcWindChill(tempC, windMs);
    const active = tempC <= 10;
    // Environment Canada wind-chill risk bands
    let riskLabel = 'SAFE', riskColor = '#16a34a', bgColor = '#14532d', frostbite = 'Low risk', exceeds = false;
    let controls = [
        'No cold-stress controls required',
        'Keep dry; carry a windproof layer if conditions change'
    ];
    if (wc <= -55) {
        riskLabel = 'DANGER';
        riskColor = '#6b7280';
        bgColor = '#030712';
        frostbite = 'Frostbite in UNDER 2 min on exposed skin';
        exceeds = true;
        controls = [
            'OUTDOOR WORK STOPPED — conditions dangerous for any exposed skin',
            'Only emergency work, fully covered, with continuous buddy checks',
            'Heated shelter within immediate reach; rotate crews continuously'
        ];
    } else if (wc <= -48) {
        riskLabel = 'EXTREME';
        riskColor = '#7c3aed';
        bgColor = '#2e1065';
        frostbite = 'Frostbite in 2–5 min on exposed skin';
        exceeds = true;
        controls = [
            'Business-critical work only; cover ALL exposed skin',
            'Heated warm-up shelter ≤ a few minutes away; scheduled warm-up breaks',
            'Continuous buddy system; watch for frostnip (white/waxy skin)',
            'Insulated, windproof PPE + face/eye protection'
        ];
    } else if (wc <= -40) {
        riskLabel = 'VERY COLD';
        riskColor = '#dc2626';
        bgColor = '#450a0a';
        frostbite = 'Frostbite in 5–10 min on exposed skin';
        exceeds = true;
        controls = [
            'Frequent scheduled warm-up breaks (ACGIH Cold Stress TLV)',
            'Cover all exposed skin; windproof outer layer mandatory',
            'Buddy system; monitor for hypothermia & frostbite',
            'Warm, sweet drinks; no alcohol/caffeine before exposure'
        ];
    } else if (wc <= -28) {
        riskLabel = 'COLD';
        riskColor = '#f97316';
        bgColor = '#451a03';
        frostbite = 'Frostbite possible in 10–30 min on exposed skin';
        exceeds = true;
        controls = [
            'Layer clothing; keep dry; add windproof shell',
            'Scheduled warm-up breaks; limit continuous exposure',
            'Watch extremities (fingers, toes, ears, nose)'
        ];
    } else if (wc <= -10) {
        riskLabel = 'COOL';
        riskColor = '#d97706';
        bgColor = '#451a03';
        frostbite = 'Low frostbite risk; hypothermia risk with long exposure';
        controls = [
            'Dress in layers; keep dry',
            'Take warm-up breaks on long shifts'
        ];
    } else if (active) {
        riskLabel = 'MILD COLD';
        riskColor = '#16a34a';
        bgColor = '#14532d';
        frostbite = 'Low risk';
        controls = [
            'Light cold-weather layers; keep dry'
        ];
    }
    return {
        windChillC: wc,
        riskLabel,
        riskColor,
        bgColor,
        frostbite,
        exceedsThreshold: exceeds,
        controls,
        active
    };
}
function assessThunderstorm(capeJkg, cloudCoverPct, precipMmH) {
    if (capeJkg === undefined || capeJkg === null || Number.isNaN(capeJkg)) {
        return {
            available: false,
            capeJkg: 0,
            riskLabel: 'N/A',
            riskColor: '#475569',
            instability: 'CAPE not provided by this model — switch model or enable Worst-case',
            exceedsThreshold: false,
            guidance: [
                'Live lightning-strike detection is not part of the weather model.',
                'Apply the 30-30 rule: if thunder follows a flash within 30 s (≈10 km),',
                'suspend outdoor work; resume only 30 min after the last thunder.'
            ]
        };
    }
    const cape = Math.max(0, Math.round(capeJkg));
    let riskLabel = 'LOW', riskColor = '#16a34a', instability = 'Stable — thunderstorms unlikely', exceeds = false;
    if (cape >= 2500) {
        riskLabel = 'SEVERE';
        riskColor = '#7c3aed';
        instability = 'Extreme instability — severe thunderstorm / lightning potential';
        exceeds = true;
    } else if (cape >= 1000) {
        riskLabel = 'HIGH';
        riskColor = '#dc2626';
        instability = 'Strong instability — thunderstorms likely';
        exceeds = true;
    } else if (cape >= 300) {
        riskLabel = 'MODERATE';
        riskColor = '#f97316';
        instability = 'Marginal instability — isolated storms possible';
        exceeds = false;
    }
    // CAPE is only the fuel; a storm also needs a trigger (cloud build-up or
    // precipitation). High CAPE under clear, dry skies is LATENT instability, not an
    // active storm, so we do not raise a storm warning on it. Gate only when sky data
    // is present; with no cloud/precip info, fall back to CAPE alone (never miss).
    const _cloud = Number.isFinite(cloudCoverPct) ? cloudCoverPct : undefined;
    const _precip = Number.isFinite(precipMmH) ? precipMmH : 0;
    const _skyKnown = _cloud !== undefined || _precip > 0;
    const _hasTrigger = _precip > 0 || _cloud !== undefined && _cloud >= 40;
    if (exceeds && _skyKnown && !_hasTrigger) {
        riskLabel = 'NO STORM';
        riskColor = '#16a34a';
        instability = `Skies clear/dry - no storm developing (unstable air only, CAPE ${cape})`;
        exceeds = false;
    }
    return {
        available: true,
        capeJkg: cape,
        riskLabel,
        riskColor,
        instability,
        exceedsThreshold: exceeds,
        guidance: [
            'CAPE shows storm POTENTIAL, not live strikes.',
            '30-30 rule: suspend work if thunder follows a flash within 30 s (≈10 km).',
            'Resume only 30 min after the last thunder; clear elevated/exposed areas.'
        ]
    };
}
/** Format a Celsius value; NW sentinel (999) renders as the no-work marker. */ function fmtTemp(c, units, withUnit = true) {
    if (c === NW || c === 999) return 'NO WORK';
    if (units === 'imperial') {
        const f = c * 9 / 5 + 32;
        return Math.round(f * 10) / 10 + (withUnit ? '°F' : '');
    }
    return Math.round(c * 10) / 10 + (withUnit ? '°C' : '');
}
/** Primary wind speed: m/s (metric) or mph (imperial). */ function fmtWind(ms, units, withUnit = true) {
    if (units === 'imperial') return Math.round(ms * 2.23694 * 10) / 10 + (withUnit ? ' mph' : '');
    return Math.round(ms * 10) / 10 + (withUnit ? ' m/s' : '');
}
/** Secondary wind speed: km/h (metric) or knots (imperial). */ function fmtWindSecondary(ms, units) {
    if (units === 'imperial') return {
        val: (Math.round(ms * 1.94384 * 10) / 10).toString(),
        lbl: 'knots'
    };
    return {
        val: (Math.round(ms * 3.6 * 10) / 10).toString(),
        lbl: 'km/h'
    };
}
/** Rainfall rate: mm/h (metric) or in/h (imperial). */ function fmtRain(mmh, units, withUnit = true) {
    if (units === 'imperial') return Math.round(mmh * 0.0393701 * 100) / 100 + (withUnit ? ' in/h' : '');
    return Math.round(mmh * 10) / 10 + (withUnit ? ' mm/h' : '');
}
// ════════════════════════════════════════════════════════════════════════════
//  SOLAR POSITION (day/night + elevation) and SOLAR IRRADIANCE BAND
// ════════════════════════════════════════════════════════════════════════════
/** Solar elevation angle (degrees above horizon) for a lat/lon at a given time. */ function solarElevationDeg(lat, lon, date) {
    const rad = Math.PI / 180;
    const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
    const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000);
    const decl = 23.45 * Math.sin(rad * (360 / 365) * (dayOfYear + 284)); // solar declination
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
    const solarTime = utcHours + lon / 15; // approx local solar time
    const H = 15 * (solarTime - 12); // hour angle (deg)
    const elev = Math.asin(Math.sin(lat * rad) * Math.sin(decl * rad) + Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(H * rad)) / rad;
    return Math.round(elev * 10) / 10;
}
function isDaytime(lat, lon, date) {
    return solarElevationDeg(lat, lon, date) > 0;
}
/** Qualitative solar-radiation band from irradiance (W/m²). At night returns NIGHT
 *  regardless of irradiance; by day, low irradiance is LOW (e.g. high-latitude sun). */ function solarBand(wm2, day = true) {
    if (!day) return {
        label: 'NIGHT',
        color: '#475569'
    };
    if (wm2 < 200) return {
        label: 'LOW',
        color: '#16a34a'
    };
    if (wm2 < 500) return {
        label: 'MODERATE',
        color: '#d97706'
    };
    if (wm2 < 800) return {
        label: 'HIGH',
        color: '#f97316'
    };
    return {
        label: 'EXTREME',
        color: '#dc2626'
    };
}
const MIDDAY_BANS = {
    OM: {
        country: 'Oman',
        months: [
            6,
            7,
            8
        ],
        start: 12.5,
        end: 15.5,
        label: '12:30–15:30, Jun–Aug'
    },
    AE: {
        country: 'United Arab Emirates',
        months: [
            6,
            7,
            8,
            9
        ],
        start: 12.5,
        end: 15.0,
        label: '12:30–15:00, 15 Jun–15 Sep'
    },
    SA: {
        country: 'Saudi Arabia',
        months: [
            6,
            7,
            8,
            9
        ],
        start: 12.0,
        end: 15.0,
        label: '12:00–15:00, 15 Jun–15 Sep'
    },
    QA: {
        country: 'Qatar',
        months: [
            6,
            7,
            8,
            9
        ],
        start: 10.0,
        end: 15.5,
        label: '10:00–15:30, 1 Jun–15 Sep'
    },
    KW: {
        country: 'Kuwait',
        months: [
            6,
            7,
            8
        ],
        start: 11.0,
        end: 16.0,
        label: '11:00–16:00, Jun–Aug'
    },
    BH: {
        country: 'Bahrain',
        months: [
            7,
            8
        ],
        start: 12.0,
        end: 16.0,
        label: '12:00–16:00, Jul–Aug'
    }
};
function getMiddayBan(countryCode) {
    return MIDDAY_BANS[(countryCode || '').toUpperCase()] ?? null;
}
const HAZARD_EMERGENCIES = [
    {
        key: 'heat',
        icon: '🌡️',
        title: 'Heat Stress',
        danger: 'The body starts shutting down and cannot recover without help.',
        signsLabel: 'SYMPTOMS TO MONITOR (every 2 hours)',
        signs: HEAT_STRESS_SYMPTOMS,
        response: EMERGENCY_RESPONSE
    },
    {
        key: 'cold',
        icon: '❄️',
        title: 'Cold Stress / Hypothermia',
        danger: 'Hypothermia and frostbite develop silently — judgment fails before the body does.',
        signsLabel: 'SYMPTOMS TO MONITOR',
        signs: [
            'Uncontrollable shivering — then shivering STOPS (danger sign)',
            'Numb, waxy, white or grey skin (frostbite)',
            'Slurred speech, clumsiness, confusion',
            'Drowsiness or extreme exhaustion'
        ],
        response: [
            'Move to a heated shelter immediately',
            'Remove wet clothing; wrap in dry blankets',
            'Warm the core first (chest, neck, groin) — not the hands/feet',
            'Give warm sweet drinks only if fully conscious',
            'Do NOT rub frostbitten skin',
            'FOR NO SHIVERING / UNCONSCIOUS: handle gently — GET IMMEDIATE MEDICAL CARE'
        ]
    },
    {
        key: 'wind',
        icon: '💨',
        title: 'High Wind',
        danger: 'High wind topples lifts and scaffolds and turns loose material into projectiles.',
        signsLabel: 'WARNING SIGNS',
        signs: [
            'Gusts making footing or balance difficult',
            'Suspended loads swinging / crane in-service limits reached',
            'Dust storm reducing visibility',
            'Loose sheeting, netting or tools starting to lift'
        ],
        response: [
            'Stop crane, MEWP and all working-at-height operations',
            'Land and secure suspended loads',
            'Secure or remove loose materials and light structures',
            'Move crews clear of scaffolds, signage and temporary structures',
            'Resume only when sustained wind AND gusts fall below limits'
        ]
    },
    {
        key: 'rain',
        icon: '🌧️',
        title: 'Heavy Rain / Flooding',
        danger: 'Heavy rain floods excavations, collapses trench walls and creates electrocution hazards.',
        signsLabel: 'WARNING SIGNS',
        signs: [
            'Water pooling in or near excavations / trenches',
            'Ground becoming soft, slippery or unstable',
            'Reduced visibility for plant and traffic',
            'Water reaching live electrical equipment / temporary supplies'
        ],
        response: [
            'Evacuate excavations and trenches — risk of collapse',
            'De-energise exposed temporary electrical equipment',
            'Stop earthworks, hot works and road operations',
            'Move crews to a safe, dry muster point',
            'Inspect ground and shoring before resuming'
        ]
    },
    {
        key: 'thunder',
        icon: '⛈️',
        title: 'Thunderstorm / Lightning',
        danger: 'Lightning kills instantly and can strike up to 10 km from the storm — before the rain arrives.',
        signsLabel: 'WARNING SIGNS',
        signs: [
            'Thunder heard — any thunder means lightning is in range',
            'Flash-to-bang under 30 seconds (≈10 km away)',
            'Towering dark cloud build-up, sudden wind shift',
            'Hair standing on end or buzzing metal (imminent strike)'
        ],
        response: [
            'Apply the 30-30 rule: suspend work when flash-to-bang < 30 s',
            'Get off elevated ground; leave cranes, scaffolds and roofs',
            'Shelter in a hard-roofed vehicle or building — never under trees',
            'Avoid metal, water and open ground',
            'Resume only 30 minutes after the last thunder'
        ]
    },
    {
        key: 'solar',
        icon: '☀️',
        title: 'Solar Radiation / UV',
        danger: 'Prolonged solar radiation causes burns, dehydration, heat load and long-term skin damage.',
        signsLabel: 'WARNING SIGNS',
        signs: [
            'Intense midday sun / high UV index',
            'Reddening skin or sunburn on exposed areas',
            'Glare reducing visibility',
            'Rising solar heat load adding to WBGT'
        ],
        response: [
            'Provide and use shade for rest and fixed tasks',
            'Cover exposed skin; apply SPF 30+ sunscreen',
            'Wear UV-rated eye protection',
            'Increase hydration and rest frequency',
            'Reschedule sustained tasks away from the solar peak (10:00–15:00)'
        ]
    }
];

/**
 * FieldGuard Weekly Report Generator
 * Heat-stress zone method: 2-step Apparent Temperature (Temp×RH, then ×Wind)
 * Standards: ISO 7933:2004 / ISO 7243:2017 / ACGIH TLV / FIDIC Clause 8.4
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
    const mon = (key)=>!d.monitoredHazards || d.monitoredHazards.includes(key);
    const hazardSection = ()=>{
        const h = d.hazardSnapshot;
        if (!h) return '  Multi-hazard snapshot not available for this report.';
        const line = (label, value, risk, note)=>`  ${pad(label, 16)} ${pad(value, 20)} ${pad(risk, 12)} ${note}`;
        const rows = [];
        if (mon('wind')) rows.push(line('Wind', h.wind.speed, h.wind.label, h.wind.beaufort));
        if (mon('rain')) rows.push(line('Rain', h.rain.rate, h.rain.label, h.rain.intensity));
        if (mon('thunder')) rows.push(line('Thunderstorm', h.thunder.available ? h.thunder.cape : 'N/A', h.thunder.label, h.thunder.instability));
        if (mon('cold')) rows.push(line('Cold stress', h.cold.active ? h.cold.windChill : 'Not active', h.cold.active ? h.cold.label : '—', h.cold.active ? h.cold.frostbite : 'Ambient above 10°C — cold stress not in play'));
        if (mon('solar')) rows.push(line('Solar radiation', h.solar.irradiance, h.solar.label, h.solar.period));
        if (mon('heat')) rows.push(line('Heat stress', 'see Section D', '', 'PPE-adjusted WBGT / Apparent Temperature zone'));
        if (!rows.length) rows.push('  No hazards selected for monitoring.');
        return [
            `  ${pad('HAZARD', 16)} ${pad('READING', 20)} ${pad('RISK', 12)} DETAIL`,
            '─'.repeat(88),
            ...rows,
            '─'.repeat(88)
        ].join('\n');
    };
    const forecastSection = ()=>{
        if (!d.forecastEnabled) return '  Forecast Watch disabled — enable it in Config to include a lookahead.';
        if (!d.forecastRows || d.forecastRows.length === 0) return `  No threshold crossings forecast in the next ${d.forecastHorizon ?? '24 h'}.`;
        const rows = d.forecastRows.map((r)=>`  ${pad(r.label, 16)} ${pad(r.peak, 12)} expected ${r.hoursAway === 0 ? 'within 1 hour' : `in ~${r.hoursAway} h`} (${r.when})`).join('\n');
        return [
            `  Lookahead horizon: next ${d.forecastHorizon ?? '24 h'} (selected model)`,
            '─'.repeat(88),
            rows,
            '─'.repeat(88)
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
Method: 2-step Apparent Temperature + PPE-adjusted WBGT (ACGIH TLV)
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
FieldGuard Version:     v3.0.8
Heat Stress Method:     2-Step Apparent Temperature (Charts A & B)


SECTION B — EXECUTIVE SUMMARY
──────────────────────────────────────────────────────────────────────────────
During the week of ${d.weekStart} to ${d.weekEnd}, site "${d.projectName}" at
${d.siteAddress} recorded ${d.wbgtLog.length} heat stress exceedance events per
the FieldGuard zone system (ISO 7243 / ISO 7933, PPE-Adjusted WBGT).

Peak Adjusted WBGT:          ${peakEntry.wbgtAdj}°C at ${peakEntry.time} on ${peakEntry.date}
PPE Profile:                 ${d.ppeProfile} (+${d.ppeAdjustment}°C)
Total exceedance hours:      ${totalExceedH} hours across ${d.wbgtLog.length} events
Work suspension hours:       ${d.totalSuspensionHours.toFixed(1)} hours
Morning Gap events:          ${d.morningGap.length} events (WBGT exceedance before legal ban)
Legal Work Ban:              ${d.banStart}–${d.banEnd} (${d.banMonths})

FIDIC Clause 8.4 Assessment: ${d.fidic}
Estimated delay:             ${d.delayDays} calendar day(s)

Note: Zones determined by a 2-step Apparent Temperature method (Chart A: Temp×RH;
Chart B: Apparent Temp × Wind).
Zone system: Green (safe) → Amber (attention) → Red (alert) → Purple (extreme) → Black (no work)
Stop-work rule applied when ambient temp exceeds 50°C or NW (No Work) on Chart B.


SECTION C — METEOROLOGICAL DATA SUMMARY
──────────────────────────────────────────────────────────────────────────────
Data Source:     FieldGuard — Open-Meteo multi-model point forecast
                 (ECMWF, GFS, ICON, GEM, ARPEGE, ACCESS-G)
Method:          Worst-case across all available forecast models
Measurement:     Every 2 hours per field

${metTable()}
Weekly Max Temp:     ${Math.max(...d.dailyMet.map((m)=>m.maxTemp))}°C
Weekly Max Humidity: ${Math.max(...d.dailyMet.map((m)=>m.maxRH))}%
Weekly Max Wind:     ${Math.max(...d.dailyMet.map((m)=>m.maxWind))} m/s


SECTION C2 — MULTI-HAZARD RISK SNAPSHOT (CURRENT)
──────────────────────────────────────────────────────────────────────────────
FieldGuard tracks six field hazards. This site is configured to monitor:
${d.monitoredHazards ? '  ' + d.monitoredHazards.map((h)=>h.toUpperCase()).join(', ') : '  ALL HAZARDS'}
Heat stress is analysed in full in Section D; the current status of the other
monitored hazards at the pin is summarised below.

${hazardSection()}

Hazard controls (apply when the corresponding risk is active):
${[
        mon('wind') ? '  ● Wind        — stop lifting/height work, secure loads & loose materials' : '',
        mon('rain') ? '  ● Rain        — evacuate excavations, de-energise exposed electrics, stop earthworks' : '',
        mon('thunder') ? '  ● Thunderstorm— 30-30 rule; clear elevated/exposed areas; shelter in hard-roofed vehicle' : '',
        mon('cold') ? '  ● Cold stress — cover exposed skin, scheduled warm-up breaks, buddy system' : '',
        mon('solar') ? '  ● Solar/UV    — shade, SPF 30+, UV eye protection, extra hydration' : ''
    ].filter(Boolean).join('\n')}
Full response steps for every monitored hazard are on the FieldGuard SOS screen.


SECTION D — HEAT STRESS ZONE ANALYSIS (ISO 7243 / ISO 7933)
──────────────────────────────────────────────────────────────────────────────
Zone System Reference: FieldGuard 2-step Apparent Temperature method
WBGT Supplement:      ISO 7933:2004 — Analytical Determination of Thermal Stress (PHS)

PPE Profile Applied:    ${d.ppeProfile}
ISO 7933 Adjustment:    +${d.ppeAdjustment}°C to base WBGT

ZONE THRESHOLDS (Apparent Temperature, °C):
  ● < 35°C  — GREEN  (Unrestricted): No limits on self-paced work
  ● 35–42°C — AMBER  (Attention):   Shade, no working alone, restricted heavy work
  ● 43–49°C — RED    (Alert):       Strict work/rest, stand-by vehicle, no solo work
  ● 50–54°C — PURPLE (Extreme):     Business-critical only, continuous monitoring, 30 min from medical
  ● ≥ 55°C  — BLACK  (No Work):    All outdoor work STOPPED — A/C shelter only
  ● "NW"    — NO WORK on Chart B:  Stop work regardless of temperature

WORK/REST SCHEDULES:
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
  □ Appendix D: Supervisor attendance records (monitoring log)
  □ Appendix E: ISO 7933 PPE adjustment calculation worksheet
  □ Appendix F: FieldGuard Heat Stress dashboard screenshots
  □ Appendix G: National meteorological station records


SECTION H — REGULATORY COMPLIANCE CHECKLIST
──────────────────────────────────────────────────────────────────────────────
Based on: ISO 7933 / ISO 7243 / ACGIH TLV + ${d.regulatoryRef}

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
FieldGuard Worst-Case Engine: All available forecast models queried simultaneously
(ECMWF, GFS, ICON, GEM, ARPEGE, ACCESS-G). Highest-severity result across all
models used for zone determination and alerts.

CURRENT WEEK ASSESSMENT:
${d.forecastNarrative}

FORECAST OUTLOOK (Forecast Watch — all hazards):
${forecastSection()}

IMPORTANT: Risk of heat stress increases when apparent temperature exceeds 35°C.
Heat is not defined by temperature alone but also depends on relative humidity and
wind speed.


SECTION J — SIGNATURES & CERTIFICATION
──────────────────────────────────────────────────────────────────────────────
FieldGuard Data: Windy.com API + Open-Meteo (ECMWF/ICON)
Method: 2-step Apparent Temperature (Charts A & B) + ISO 7933 WBGT
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
Zone system: FieldGuard 2-step Apparent Temperature method
WBGT method: Liljegren (2008) | Apparent Temp: 2-step Chart A+B
================================================================================
END OF REPORT — ${reportId}
================================================================================
`;
}

/* src\plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-sq5a06", ".fieldguard.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;color:#e2e8f0;font-size:13px;padding:0 0 14px;background:#0f172a;min-height:100%}.fg-header.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0f172a;border-bottom:1px solid #1e293b}.fg-logo.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:26px;flex-shrink:0}.fg-titlewrap.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{min-width:0;flex:1;overflow:hidden}.fg-title.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:16px;font-weight:700;color:#f8fafc;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fg-subtitle.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fg-settings-btn.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin-left:auto;background:#1e293b;border:1px solid #334155;color:#94a3b8;padding:4px 8px;border-radius:5px;cursor:pointer;font-size:11px}.fg-tabs.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;background:#0f172a;border-bottom:1px solid #1e293b}.fg-tab.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{flex:1;padding:7px 2px;background:transparent;border:none;color:#64748b;cursor:pointer;font-size:11px}.fg-tab.active.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{color:#38bdf8;border-bottom:2px solid #38bdf8}.fg-location-row.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:6px;padding:6px 12px;background:#1e293b;font-size:11px;color:#94a3b8}.fg-loc-text.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fg-active-site.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{padding:6px 12px;font-size:12px;color:#cbd5e1;background:#0b1220;border-bottom:1px solid #1e293b}.fg-active-site.svelte-sq5a06 b.svelte-sq5a06.svelte-sq5a06{color:#38bdf8}.fg-site-hint.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{color:#f59e0b;font-size:11px}.fg-model-row.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:8px;padding:5px 12px;background:#0f172a;font-size:11px;color:#94a3b8}.fg-model-row.svelte-sq5a06 select.svelte-sq5a06.svelte-sq5a06{background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:3px 6px;border-radius:4px;font-size:11px}.fg-worst-label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:4px;cursor:pointer;margin-left:auto}.fg-mini-btn.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#334155;border:none;color:#94a3b8;padding:2px 6px;border-radius:4px;cursor:pointer;font-size:11px}.fg-mini-btn.locked.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#b45309;color:#fff}.fg-sites.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;flex-wrap:wrap;gap:5px;align-items:center;padding:6px 12px;background:#1e293b;border-top:1px solid #0f172a}.fg-site-chip.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:inline-flex;align-items:center;gap:4px;background:#0f172a;border:1px solid #334155;color:#cbd5e1;padding:3px 7px;border-radius:14px;cursor:pointer;font-size:10px}.fg-site-chip.active.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{border-color:#38bdf8;color:#38bdf8}.fg-site-dot.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{width:7px;height:7px;border-radius:50%;flex-shrink:0}.fg-site-x.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{color:#64748b;font-weight:700;padding:0 2px}.fg-site-x.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06:hover{color:#f87171}.fg-site-name.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:3px 7px;border-radius:14px;font-size:10px;width:74px;box-sizing:border-box}.fg-site-add.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#0284c7;border:none;color:#fff;padding:3px 9px;border-radius:14px;cursor:pointer;font-size:10px;font-weight:600}.fg-site-max.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:9px;color:#64748b}.fg-site-locked.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#0f172a;border:1px dashed #334155;color:#94a3b8;padding:3px 9px;border-radius:14px;font-size:10px;text-decoration:none}.fg-stale.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin:6px 12px 0;padding:5px 10px;background:#422006;border:1px solid #a16207;color:#fde68a;font-size:10px;border-radius:6px}.fg-mon-list.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin-top:8px;display:flex;flex-direction:column;gap:4px}.fg-mon-item.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:7px;background:#0f172a;border:1px solid #334155;border-radius:6px;padding:5px 8px;font-size:11px;color:#cbd5e1}.fg-mon-dot.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{width:8px;height:8px;border-radius:50%;flex-shrink:0}.fg-daynight.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;padding:2px 8px;border-radius:10px;white-space:nowrap;flex-shrink:0}.fg-daynight.day.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#78350f;color:#fcd34d}.fg-daynight.night.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#1e3a8a;color:#bfdbfe}.fg-ban-info.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin:5px 12px 0;padding:6px 10px;background:#0f172a;border:1px solid #334155;border-radius:6px;font-size:10px;color:#94a3b8}.fg-hazard-strip.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;gap:6px;padding:8px 12px 4px}.fg-hz.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{flex:1;background:#1e293b;border:2px solid #334155;border-radius:10px;padding:8px 4px 7px;cursor:pointer;text-align:center;min-width:0}.fg-hz.sel.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{outline:2px solid #f8fafc;outline-offset:-2px}.fg-hz-ic.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:16px;line-height:1}.fg-hz-val.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:15px;font-weight:800;color:#f8fafc;margin-top:3px;line-height:1;white-space:nowrap}.fg-hz-u.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:9px;font-weight:600;color:#94a3b8;margin-left:1px}.fg-hz-st.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:8.5px;font-weight:700;letter-spacing:0.3px;margin-top:4px}.fg-loading.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{padding:20px;text-align:center;color:#64748b}.fg-error.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{padding:12px;background:#450a0a;color:#fca5a5;border-radius:6px;margin:8px 12px}.fg-ban-alert.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin:6px 12px;padding:10px 12px;background:#7c2d12;border:1px solid #ea580c;border-radius:7px;color:#fed7aa;font-size:12px;font-weight:600;text-align:center}.fg-ban-alert.svelte-sq5a06 small.svelte-sq5a06.svelte-sq5a06{font-weight:400;font-size:10px;display:block;margin-top:3px;color:#fdba74}.fg-zone-banner.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:10px;margin:8px 12px;padding:10px 12px;border-radius:8px;border:1px solid}.fg-zone-dot.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{width:14px;height:14px;border-radius:50%;flex-shrink:0}.fg-zone-main.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{flex:1}.fg-zone-name.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:17px;font-weight:800;letter-spacing:1px}.fg-zone-label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px;color:#94a3b8}.fg-zone-sub.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#64748b;margin-top:2px}.fg-zone-time.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#475569}.fg-card.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#1e293b;border:1px solid #334155;border-left-width:3px;border-radius:8px;margin:5px 12px;padding:10px}.fg-card-flat.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#1e293b;border:1px solid #334155;border-radius:8px;margin:5px 12px;padding:10px}.fg-card-header.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-weight:600;font-size:12px;margin-bottom:8px;color:#f1f5f9;display:flex;align-items:center}.fg-badge.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin-left:auto;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;color:#fff}.fg-metrics-grid.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:8px}.fg-metric.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#0f172a;border-radius:6px;padding:5px;text-align:center}.fg-metric-val.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:14px;font-weight:700;color:#f8fafc}.fg-metric-lbl.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:9px;color:#64748b;text-transform:uppercase}.fg-work-schedule.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#0f172a;border-radius:6px;padding:7px;margin-bottom:6px}.fg-ws-row.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:baseline;gap:6px;padding:2px 0}.fg-ws-icon.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px}.fg-ws-label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#64748b;min-width:70px}.fg-ws-val.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px;color:#94a3b8;font-weight:500}.fg-ppe-row.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#475569;margin-top:4px}.fg-control-item.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px;color:#94a3b8;padding:3px 0;border-bottom:1px solid #0f172a}.fg-control-item.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06:last-child{border-bottom:none}.fg-threshold-row.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#475569;margin-top:4px}.fg-overlay-hint.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px;color:#94a3b8;margin-top:10px;padding:8px 10px;background:#0b1220;border:1px solid #1e293b;border-radius:6px;line-height:1.45}.fg-overlay-hint.svelte-sq5a06 b.svelte-sq5a06.svelte-sq5a06{color:#38bdf8}.fg-table.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{width:100%;border-collapse:collapse;font-size:11px}.fg-table.svelte-sq5a06 th.svelte-sq5a06.svelte-sq5a06{color:#64748b;text-align:left;padding:3px 4px;border-bottom:1px solid #334155}.fg-table.svelte-sq5a06 td.svelte-sq5a06.svelte-sq5a06{padding:3px 4px;color:#94a3b8}.fg-worst-row.svelte-sq5a06 td.svelte-sq5a06.svelte-sq5a06{color:#f1f5f9;font-weight:600;background:#0f172a}.fg-section-title.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{padding:10px 12px 4px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px}.fg-empty.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{padding:16px;text-align:center;color:#475569;font-size:11px}.fg-alert-item.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin:3px 12px;padding:7px 10px;background:#1e293b;border-radius:6px}.fg-alert-time.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#64748b}.fg-alert-type.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:12px;font-weight:600;color:#f1f5f9}.fg-alert-msg.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px;color:#94a3b8}.fg-forecast.svelte-sq5a06 .fg-card-header.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:6px}.fg-fc-busy.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:9px;color:#64748b;font-weight:400;margin-left:auto}.fg-fc-row.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:8px;margin:3px 12px;padding:6px 10px;background:#1e293b;border-radius:6px}.fg-fc-ic.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:15px;flex-shrink:0}.fg-fc-name.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:12px;font-weight:600;color:#f1f5f9;flex:1}.fg-fc-badge.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:9px;font-weight:800;color:#fff;padding:2px 6px;border-radius:4px;letter-spacing:0.3px}.fg-fc-when.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#cbd5e1;text-align:right;line-height:1.3;flex-shrink:0}.fg-fc-when.svelte-sq5a06 small.svelte-sq5a06.svelte-sq5a06{color:#64748b}.fg-emg-jump.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;flex-wrap:wrap;gap:5px;padding:4px 12px 2px}.fg-emg-chip.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:inline-flex;align-items:center;gap:4px;background:#1e293b;border:2px solid #334155;border-radius:14px;padding:4px 9px;cursor:pointer;font-size:14px;line-height:1}.fg-emg-chip.sel.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{outline:2px solid #f8fafc;outline-offset:-2px}.fg-emg-chip-st.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:8px;font-weight:800;letter-spacing:0.3px}.fg-emergency-card.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#1e293b;border-radius:8px;margin:6px 12px;padding:12px;border:1px solid #dc2626}.fg-emg-title.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:700;color:#f87171;margin-bottom:4px}.fg-emg-sub.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px;color:#94a3b8;margin-bottom:10px}.fg-emg-section.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin-bottom:12px}.fg-emg-label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}.fg-emg-item.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px;color:#fca5a5;padding:2px 0}.fg-emg-step.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;gap:8px;align-items:flex-start;padding:4px 0;font-size:11px;color:#94a3b8}.fg-emg-num.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#334155;color:#e2e8f0;border-radius:3px;padding:1px 5px;font-size:10px;font-weight:700;flex-shrink:0}.fg-emg-critical.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{color:#f87171 !important;font-weight:600}.fg-emg-critical.svelte-sq5a06 .fg-emg-num.svelte-sq5a06.svelte-sq5a06{background:#dc2626}.fg-report-note.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin:0 12px 6px;padding:7px 10px;background:#1e293b;border-radius:6px;font-size:10px;color:#64748b}.fg-form.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{padding:0 12px;display:grid;grid-template-columns:1fr 1fr;gap:5px}label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:block;color:#94a3b8;font-size:11px;margin-bottom:4px}.fg-form.svelte-sq5a06 label.svelte-sq5a06 input.svelte-sq5a06,.fg-form.svelte-sq5a06 label.svelte-sq5a06 select.svelte-sq5a06{display:block;width:100%;background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:5px 8px;border-radius:5px;font-size:11px;margin-top:2px;box-sizing:border-box}.fg-radio-label.svelte-sq5a06 input[type=\"radio\"].svelte-sq5a06.svelte-sq5a06,.fg-toggle-label.svelte-sq5a06 input[type=\"checkbox\"].svelte-sq5a06.svelte-sq5a06,.fg-worst-label.svelte-sq5a06 input[type=\"checkbox\"].svelte-sq5a06.svelte-sq5a06{width:auto;flex:0 0 auto;margin:0}.fg-radio-text.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{text-align:left}.fg-btn.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:block;width:calc(100% - 24px);margin:6px 12px;padding:9px;border:none;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer}.fg-btn-primary.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#0284c7;color:#fff}.fg-btn-secondary.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#334155;color:#94a3b8}.fg-report-preview.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin:6px 12px;background:#0f172a;border:1px solid #334155;border-radius:8px;overflow:hidden}.fg-report-toolbar.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:8px;padding:6px 10px;background:#1e293b;border-bottom:1px solid #334155;font-size:11px;color:#64748b}.fg-report-toolbar.svelte-sq5a06 span.svelte-sq5a06.svelte-sq5a06{flex:1}.fg-report-text.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{padding:10px;font-size:9px;color:#94a3b8;white-space:pre;overflow:auto;max-height:280px;font-family:'Courier New',monospace;line-height:1.5}.fg-settings-section.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#1e293b;border-radius:8px;margin:5px 12px;padding:10px}.fg-settings-label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;font-weight:600;color:#38bdf8;margin-bottom:7px;text-transform:uppercase;letter-spacing:0.5px}.fg-note.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:10px;color:#475569;margin-bottom:7px}.fg-radio-label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;border-bottom:1px solid #0f172a}.fg-radio-label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06:last-child{border-bottom:none}.fg-radio-text.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:11px;color:#cbd5e1;flex:1}.fg-adj.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#334155;color:#94a3b8;border-radius:3px;padding:1px 5px;font-size:9px;margin-left:4px}.fg-pro-tag.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#f59e0b;color:#0f172a;border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;margin-left:6px;letter-spacing:0.5px}.fg-tier.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{font-size:9px;font-weight:700;letter-spacing:0.5px;padding:2px 7px;border-radius:4px;margin-left:6px;flex-shrink:0}.fg-tier.free.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#334155;color:#94a3b8}.fg-tier.pro.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#f59e0b;color:#0f172a}.fg-license-active.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:8px;font-size:11px;color:#cbd5e1}.fg-pro-badge.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#16a34a;color:#fff;font-weight:700;font-size:10px;padding:2px 8px;border-radius:4px}.fg-license-row.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;gap:6px;margin-top:6px}.fg-license-input.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{flex:1;min-width:0;background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:6px 8px;border-radius:5px;font-size:12px;font-family:monospace;letter-spacing:0.5px;text-transform:uppercase}.fg-btn-inline.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#0284c7;color:#fff;border:none;border-radius:5px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap}.fg-btn-inline.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06:disabled{opacity:0.6;cursor:default}.fg-buy-link.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:inline-block;margin-top:7px;font-size:11px;color:#38bdf8;text-decoration:none}.fg-license-msg.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin-top:7px;font-size:11px;color:#fcd34d}.fg-upgrade.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin:8px 12px;padding:12px;background:#1e293b;border:1px solid var(--amber, #f59e0b);border-radius:8px;font-size:12px;color:#fcd34d;line-height:1.6}input.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06:disabled{opacity:0.45;cursor:not-allowed}.fg-lock.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{margin-top:8px;padding:8px 10px;background:#0f172a;border:1px dashed #475569;border-radius:6px;font-size:10px;color:#94a3b8;display:flex;flex-direction:column;gap:7px}.fg-lock-btn.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{background:#f59e0b;color:#0f172a;border:none;border-radius:5px;padding:7px 10px;font-size:11px;font-weight:700;cursor:pointer}.fg-pro-feature.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{text-align:center;padding:32px 16px}.fg-pro-feature.svelte-sq5a06 .pf-ic.svelte-sq5a06.svelte-sq5a06{font-size:34px}.fg-pro-feature.svelte-sq5a06 .pf-t.svelte-sq5a06.svelte-sq5a06{font-size:15px;font-weight:700;color:#f1f5f9;margin:10px 0 16px}.fg-pro-feature.svelte-sq5a06 .pf-btn.svelte-sq5a06.svelte-sq5a06{display:inline-block;background:#f59e0b;color:#0f172a;border:none;border-radius:7px;padding:10px 28px;font-size:13px;font-weight:700;cursor:pointer}.fg-slider-row.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:8px}.fg-slider-row.svelte-sq5a06 input[type=\"range\"].svelte-sq5a06.svelte-sq5a06{flex:1}.fg-slider-row.svelte-sq5a06 span.svelte-sq5a06.svelte-sq5a06{min-width:55px;text-align:right;color:#38bdf8;font-size:11px;font-weight:600}.fg-toggle-label.svelte-sq5a06.svelte-sq5a06.svelte-sq5a06{display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:11px;color:#cbd5e1}");
}

function get_each_context_16(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[206] = list[i];
	return child_ctx;
}

function get_each_context_17(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[228] = list[i][0];
	child_ctx[229] = list[i][1];
	return child_ctx;
}

function get_each_context_18(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[215] = list[i];
	child_ctx[232] = list;
	child_ctx[233] = i;
	return child_ctx;
}

function get_each_context_11(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[212] = list[i];
	return child_ctx;
}

function get_each_context_12(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[215] = list[i];
	return child_ctx;
}

function get_each_context_13(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[219] = list[i];
	child_ctx[221] = i;
	return child_ctx;
}

function get_each_context_14(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[209] = list[i];
	return child_ctx;
}

function get_if_ctx(ctx) {
	const child_ctx = ctx.slice();
	const constants_0 = /*currentHazardStatus*/ child_ctx[64](/*hz*/ child_ctx[215].key);
	child_ctx[218] = constants_0;
	return child_ctx;
}

function get_each_context_15(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[215] = list[i];
	const constants_0 = /*currentHazardStatus*/ child_ctx[64](/*hz*/ child_ctx[215].key);
	child_ctx[218] = constants_0;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[183] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[183] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[183] = list[i];
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[183] = list[i];
	return child_ctx;
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[192] = list[i];
	return child_ctx;
}

function get_each_context_5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[195] = list[i];
	return child_ctx;
}

function get_each_context_6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[198] = list[i];
	return child_ctx;
}

function get_each_context_7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[198] = list[i];
	return child_ctx;
}

function get_each_context_8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[203] = list[i];
	return child_ctx;
}

function get_each_context_9(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[206] = list[i];
	return child_ctx;
}

function get_each_context_10(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[209] = list[i];
	return child_ctx;
}

function get_each_context_19(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[234] = list[i];
	return child_ctx;
}

// (20:4) {#each TABS as t}
function create_each_block_19(ctx) {
	let button;
	let t0_value = /*t*/ ctx[234].icon + "";
	let t0;
	let t1;
	let t2_value = /*t*/ ctx[234].label + "";
	let t2;
	let t3;
	let button_class_value;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[88](/*t*/ ctx[234]);
	}

	return {
		c() {
			button = element("button");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			attr(button, "class", button_class_value = "fg-tab " + (/*tab*/ ctx[15] === /*t*/ ctx[234].id ? 'active' : '') + " svelte-sq5a06");
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

			if (dirty[0] & /*tab*/ 32768 && button_class_value !== (button_class_value = "fg-tab " + (/*tab*/ ctx[15] === /*t*/ ctx[234].id ? 'active' : '') + " svelte-sq5a06")) {
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

// (603:31) 
function create_if_block_56(ctx) {
	let div0;
	let t1;
	let div2;
	let div1;
	let t3;
	let t4;
	let t5;
	let div5;
	let div3;
	let t7;
	let div4;
	let t9;
	let t10;
	let show_if = !Object.values(/*settings*/ ctx[12].monitorHazards).some(Boolean);
	let t11;
	let div8;
	let div6;
	let t12;
	let t13;
	let label0;
	let input0;
	let input0_disabled_value;
	let t14;
	let span1;
	let t17;
	let label1;
	let input1;
	let input1_disabled_value;
	let t18;
	let span3;
	let t21;
	let div7;
	let t23;
	let div11;
	let div9;
	let t24;
	let t25;
	let div10;
	let t27;
	let label2;
	let input2;
	let input2_disabled_value;
	let t28;
	let span5;
	let t29;
	let span4;
	let t30;
	let t31_value = (/*units*/ ctx[53] === 'imperial' ? '50°F' : '10°C') + "";
	let t31;
	let t32;
	let label3;
	let input3;
	let input3_disabled_value;
	let t33;
	let span6;
	let t35;
	let label4;
	let input4;
	let input4_disabled_value;
	let t36;
	let span7;
	let t38;
	let div13;
	let div12;
	let t40;
	let t41;
	let div18;
	let div14;
	let t42;
	let t43;
	let div15;
	let t45;
	let label5;
	let t46;
	let t47_value = (/*units*/ ctx[53] === 'imperial' ? '°F' : '°C') + "";
	let t47;
	let t48;
	let div16;
	let input5;
	let input5_disabled_value;
	let t49;
	let span8;
	let t50_value = fmtTemp(/*settings*/ ctx[12].wbgtWarnC, /*units*/ ctx[53]) + "";
	let t50;
	let t51;
	let label6;
	let t52;
	let t53_value = (/*units*/ ctx[53] === 'imperial' ? '°F' : '°C') + "";
	let t53;
	let t54;
	let div17;
	let input6;
	let input6_disabled_value;
	let t55;
	let span9;
	let t56_value = fmtTemp(/*settings*/ ctx[12].wbgtDangerC, /*units*/ ctx[53]) + "";
	let t56;
	let t57;
	let div22;
	let div19;
	let t58;
	let t59;
	let label7;
	let t60;
	let t61_value = (/*units*/ ctx[53] === 'imperial' ? 'mph' : 'm/s') + "";
	let t61;
	let t62;
	let div20;
	let input7;
	let input7_disabled_value;
	let t63;
	let span10;
	let t64_value = fmtWind(/*settings*/ ctx[12].windWarnMs, /*units*/ ctx[53]) + "";
	let t64;
	let t65;
	let label8;
	let t66;
	let t67_value = (/*units*/ ctx[53] === 'imperial' ? 'mph' : 'm/s') + "";
	let t67;
	let t68;
	let div21;
	let input8;
	let input8_disabled_value;
	let t69;
	let span11;
	let t70_value = fmtWind(/*settings*/ ctx[12].windDangerMs, /*units*/ ctx[53]) + "";
	let t70;
	let t71;
	let div26;
	let div23;
	let t72;
	let t73;
	let label9;
	let t74;
	let t75_value = (/*units*/ ctx[53] === 'imperial' ? 'in/h' : 'mm/h') + "";
	let t75;
	let t76;
	let div24;
	let input9;
	let input9_disabled_value;
	let t77;
	let span12;
	let t78_value = fmtRain(/*settings*/ ctx[12].rainWarnMmh, /*units*/ ctx[53]) + "";
	let t78;
	let t79;
	let label10;
	let t80;
	let t81_value = (/*units*/ ctx[53] === 'imperial' ? 'in/h' : 'mm/h') + "";
	let t81;
	let t82;
	let div25;
	let input10;
	let input10_disabled_value;
	let t83;
	let span13;
	let t84_value = fmtRain(/*settings*/ ctx[12].rainDangerMmh, /*units*/ ctx[53]) + "";
	let t84;
	let t85;
	let div29;
	let div27;
	let t86;
	let t87;
	let div28;
	let t91;
	let label11;
	let input11;
	let input11_disabled_value;
	let t92;
	let t93;
	let t94;
	let div31;
	let div30;
	let t96;
	let label12;
	let input12;
	let t97;
	let t98;
	let label13;
	let input13;
	let input13_disabled_value;
	let t99;
	let t100;
	let label14;
	let input14;
	let input14_disabled_value;
	let t101;
	let t102;
	let t103;
	let div34;
	let div32;
	let t104;
	let t105;
	let div33;
	let t106;
	let b1;
	let t108;
	let t109_value = (HAZARD_EMERGENCIES.filter(/*func*/ ctx[148]).map(func_1).join(' ') || 'none selected') + "";
	let t109;
	let t110;
	let b2;
	let t112;
	let t113;
	let t114;
	let t115;
	let button;
	let binding_group;
	let binding_group_1;
	let mounted;
	let dispose;

	function select_block_type_17(ctx, dirty) {
		if (/*isPro*/ ctx[13]) return create_if_block_77;
		return create_else_block_13;
	}

	let current_block_type = select_block_type_17(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*licenseMsg*/ ctx[34] && create_if_block_76(ctx);
	let each_value_18 = ensure_array_like(HAZARD_EMERGENCIES);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_18.length; i += 1) {
		each_blocks_1[i] = create_each_block_18(get_each_context_18(ctx, each_value_18, i));
	}

	let if_block2 = show_if && create_if_block_75();
	let if_block3 = !/*isPro*/ ctx[13] && create_if_block_74();
	let if_block4 = !/*isPro*/ ctx[13] && create_if_block_73();
	let each_value_17 = ensure_array_like(Object.entries(PPE_PROFILES));
	let each_blocks = [];

	for (let i = 0; i < each_value_17.length; i += 1) {
		each_blocks[i] = create_each_block_17(get_each_context_17(ctx, each_value_17, i));
	}

	let if_block5 = !/*isPro*/ ctx[13] && create_if_block_72();
	let if_block6 = !/*isPro*/ ctx[13] && create_if_block_71();
	let if_block7 = !/*isPro*/ ctx[13] && create_if_block_70();
	let if_block8 = !/*isSite*/ ctx[52] && create_if_block_69();
	let if_block9 = !/*isSite*/ ctx[52] && create_if_block_68();

	function select_block_type_18(ctx, dirty) {
		if (/*isSite*/ ctx[52] && /*settings*/ ctx[12].monitorHazards.lightning) return create_if_block_66;
		if (!/*isSite*/ ctx[52]) return create_if_block_67;
	}

	let current_block_type_1 = select_block_type_18(ctx);
	let if_block10 = current_block_type_1 && current_block_type_1(ctx);
	let if_block11 = !/*isPro*/ ctx[13] && create_if_block_65();
	let if_block12 = !/*isSite*/ ctx[52] && create_if_block_64();

	function select_block_type_19(ctx, dirty) {
		if (/*isSite*/ ctx[52] && /*settings*/ ctx[12].forecastAlerts) return create_if_block_62;
		if (!/*isSite*/ ctx[52]) return create_if_block_63;
	}

	let current_block_type_2 = select_block_type_19(ctx);
	let if_block13 = current_block_type_2 && current_block_type_2(ctx);
	let if_block14 = !/*isPro*/ ctx[13] && create_if_block_61();
	let if_block15 = !/*isPro*/ ctx[13] && create_if_block_60();
	let if_block16 = /*isPro*/ ctx[13] && create_if_block_58(ctx);
	let if_block17 = /*monitorMsg*/ ctx[41] && create_if_block_57(ctx);
	binding_group = init_binding_group(/*$$binding_groups*/ ctx[126][1]);
	binding_group_1 = init_binding_group(/*$$binding_groups*/ ctx[126][2]);

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
			if (if_block1) if_block1.c();
			t5 = space();
			div5 = element("div");
			div3 = element("div");
			div3.textContent = "🎯 Hazards to Monitor";
			t7 = space();
			div4 = element("div");
			div4.textContent = "Choose which hazards FieldGuard actively monitors. This drives live alerts, the SOS page, the weekly report and the 24/7 email monitor.";
			t9 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t10 = space();
			if (if_block2) if_block2.c();
			t11 = space();
			div8 = element("div");
			div6 = element("div");
			t12 = text("🌐 Units & Display ");
			if (if_block3) if_block3.c();
			t13 = space();
			label0 = element("label");
			input0 = element("input");
			t14 = space();
			span1 = element("span");
			span1.innerHTML = `Metric <span class="fg-adj svelte-sq5a06">°C · m/s · mm/h</span>`;
			t17 = space();
			label1 = element("label");
			input1 = element("input");
			t18 = space();
			span3 = element("span");
			span3.innerHTML = `Imperial <span class="fg-adj svelte-sq5a06">°F · mph · in/h</span>`;
			t21 = space();
			div7 = element("div");
			div7.textContent = "WBGT/heat-stress standards (ISO 7933/7243) are defined in °C; values are converted for display.";
			t23 = space();
			div11 = element("div");
			div9 = element("div");
			t24 = text("❄ Winter / Cold-Stress Monitoring ");
			if (if_block4) if_block4.c();
			t25 = space();
			div10 = element("div");
			div10.textContent = "Wind chill (Environment Canada) + ACGIH cold-stress zones & frostbite times.";
			t27 = space();
			label2 = element("label");
			input2 = element("input");
			t28 = space();
			span5 = element("span");
			t29 = text("Auto ");
			span4 = element("span");
			t30 = text("show when ≤ ");
			t31 = text(t31_value);
			t32 = space();
			label3 = element("label");
			input3 = element("input");
			t33 = space();
			span6 = element("span");
			span6.textContent = "Always on";
			t35 = space();
			label4 = element("label");
			input4 = element("input");
			t36 = space();
			span7 = element("span");
			span7.textContent = "Off";
			t38 = space();
			div13 = element("div");
			div12 = element("div");
			div12.textContent = "👷 PPE Profile (ISO 7933:2004)";
			t40 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t41 = space();
			div18 = element("div");
			div14 = element("div");
			t42 = text("🌡 WBGT Custom Thresholds (ISO 7933) ");
			if (if_block5) if_block5.c();
			t43 = space();
			div15 = element("div");
			div15.textContent = "Zone system uses a 2-step Apparent Temperature method. WBGT thresholds are used for FIDIC reports.";
			t45 = space();
			label5 = element("label");
			t46 = text("Warning (");
			t47 = text(t47_value);
			t48 = text(")\r\n        ");
			div16 = element("div");
			input5 = element("input");
			t49 = space();
			span8 = element("span");
			t50 = text(t50_value);
			t51 = space();
			label6 = element("label");
			t52 = text("Danger (");
			t53 = text(t53_value);
			t54 = text(")\r\n        ");
			div17 = element("div");
			input6 = element("input");
			t55 = space();
			span9 = element("span");
			t56 = text(t56_value);
			t57 = space();
			div22 = element("div");
			div19 = element("div");
			t58 = text("💨 Wind Thresholds ");
			if (if_block6) if_block6.c();
			t59 = space();
			label7 = element("label");
			t60 = text("Warning (");
			t61 = text(t61_value);
			t62 = text(")\r\n        ");
			div20 = element("div");
			input7 = element("input");
			t63 = space();
			span10 = element("span");
			t64 = text(t64_value);
			t65 = space();
			label8 = element("label");
			t66 = text("Danger (");
			t67 = text(t67_value);
			t68 = text(")\r\n        ");
			div21 = element("div");
			input8 = element("input");
			t69 = space();
			span11 = element("span");
			t70 = text(t70_value);
			t71 = space();
			div26 = element("div");
			div23 = element("div");
			t72 = text("🌧 Rain Thresholds ");
			if (if_block7) if_block7.c();
			t73 = space();
			label9 = element("label");
			t74 = text("Warning (");
			t75 = text(t75_value);
			t76 = text(")\r\n        ");
			div24 = element("div");
			input9 = element("input");
			t77 = space();
			span12 = element("span");
			t78 = text(t78_value);
			t79 = space();
			label10 = element("label");
			t80 = text("Danger (");
			t81 = text(t81_value);
			t82 = text(")\r\n        ");
			div25 = element("div");
			input10 = element("input");
			t83 = space();
			span13 = element("span");
			t84 = text(t84_value);
			t85 = space();
			div29 = element("div");
			div27 = element("div");
			t86 = text("⚡ Real-time lightning strikes");
			if (if_block8) if_block8.c();
			t87 = space();
			div28 = element("div");
			div28.innerHTML = `Live strike detection on the FieldGuard backend — separate from the storm-potential (CAPE) card. When on, the 24/7 monitor checks strikes <b>every 2 minutes</b> and emails a stop-work alert the moment lightning enters your stop-work ring, plus a 30-minute all-clear. Re-register the site to apply changes.`;
			t91 = space();
			label11 = element("label");
			input11 = element("input");
			t92 = text("\r\n        Enable real-time lightning stop-work alerts");
			if (if_block9) if_block9.c();
			t93 = space();
			if (if_block10) if_block10.c();
			t94 = space();
			div31 = element("div");
			div30 = element("div");
			div30.textContent = "🔔 Alerts";
			t96 = space();
			label12 = element("label");
			input12 = element("input");
			t97 = text("\r\n        Browser notifications for danger zones");
			t98 = space();
			label13 = element("label");
			input13 = element("input");
			t99 = text("\r\n        Auto-refresh + background site monitor (every 15 min, tab open)");
			if (if_block11) if_block11.c();
			t100 = space();
			label14 = element("label");
			input14 = element("input");
			t101 = text("\r\n        Forecast Watch — alert me before hazards hit (lookahead)");
			if (if_block12) if_block12.c();
			t102 = space();
			if (if_block13) if_block13.c();
			t103 = space();
			div34 = element("div");
			div32 = element("div");
			t104 = text("📡 24/7 Monitoring — email me ");
			if (if_block14) if_block14.c();
			t105 = space();
			div33 = element("div");
			t106 = text("Our server checks this site every 15 min and emails an alert when any of your ");
			b1 = element("b");
			b1.textContent = "monitored hazards";
			t108 = text(" (");
			t109 = text(t109_value);
			t110 = text(") reaches a danger condition — ");
			b2 = element("b");
			b2.textContent = "even with your browser closed";
			t112 = text(". Re-register a site to apply changes to which hazards it monitors. ");
			if (if_block15) if_block15.c();
			t113 = space();
			if (if_block16) if_block16.c();
			t114 = space();
			if (if_block17) if_block17.c();
			t115 = space();
			button = element("button");
			button.textContent = "↩ Reset to Defaults";
			attr(div0, "class", "fg-section-title svelte-sq5a06");
			attr(div1, "class", "fg-settings-label svelte-sq5a06");
			attr(div2, "class", "fg-settings-section svelte-sq5a06");
			attr(div3, "class", "fg-settings-label svelte-sq5a06");
			attr(div4, "class", "fg-note svelte-sq5a06");
			attr(div5, "class", "fg-settings-section svelte-sq5a06");
			attr(div6, "class", "fg-settings-label svelte-sq5a06");
			attr(input0, "type", "radio");
			input0.__value = "metric";
			set_input_value(input0, input0.__value);
			input0.disabled = input0_disabled_value = !/*isPro*/ ctx[13];
			attr(input0, "class", "svelte-sq5a06");
			attr(span1, "class", "fg-radio-text svelte-sq5a06");
			attr(label0, "class", "fg-radio-label svelte-sq5a06");
			attr(input1, "type", "radio");
			input1.__value = "imperial";
			set_input_value(input1, input1.__value);
			input1.disabled = input1_disabled_value = !/*isPro*/ ctx[13];
			attr(input1, "class", "svelte-sq5a06");
			attr(span3, "class", "fg-radio-text svelte-sq5a06");
			attr(label1, "class", "fg-radio-label svelte-sq5a06");
			attr(div7, "class", "fg-note svelte-sq5a06");
			attr(div8, "class", "fg-settings-section svelte-sq5a06");
			attr(div9, "class", "fg-settings-label svelte-sq5a06");
			attr(div10, "class", "fg-note svelte-sq5a06");
			attr(input2, "type", "radio");
			input2.__value = "auto";
			set_input_value(input2, input2.__value);
			input2.disabled = input2_disabled_value = !/*isPro*/ ctx[13];
			attr(input2, "class", "svelte-sq5a06");
			attr(span4, "class", "fg-adj svelte-sq5a06");
			attr(span5, "class", "fg-radio-text svelte-sq5a06");
			attr(label2, "class", "fg-radio-label svelte-sq5a06");
			attr(input3, "type", "radio");
			input3.__value = "on";
			set_input_value(input3, input3.__value);
			input3.disabled = input3_disabled_value = !/*isPro*/ ctx[13];
			attr(input3, "class", "svelte-sq5a06");
			attr(span6, "class", "fg-radio-text svelte-sq5a06");
			attr(label3, "class", "fg-radio-label svelte-sq5a06");
			attr(input4, "type", "radio");
			input4.__value = "off";
			set_input_value(input4, input4.__value);
			input4.disabled = input4_disabled_value = !/*isPro*/ ctx[13];
			attr(input4, "class", "svelte-sq5a06");
			attr(span7, "class", "fg-radio-text svelte-sq5a06");
			attr(label4, "class", "fg-radio-label svelte-sq5a06");
			attr(div11, "class", "fg-settings-section svelte-sq5a06");
			attr(div12, "class", "fg-settings-label svelte-sq5a06");
			attr(div13, "class", "fg-settings-section svelte-sq5a06");
			attr(div14, "class", "fg-settings-label svelte-sq5a06");
			attr(div15, "class", "fg-note svelte-sq5a06");
			attr(input5, "type", "range");
			attr(input5, "min", "28");
			attr(input5, "max", "38");
			attr(input5, "step", "0.5");
			input5.disabled = input5_disabled_value = !/*isPro*/ ctx[13];
			attr(input5, "class", "svelte-sq5a06");
			attr(span8, "class", "svelte-sq5a06");
			attr(div16, "class", "fg-slider-row svelte-sq5a06");
			attr(label5, "class", "svelte-sq5a06");
			attr(input6, "type", "range");
			attr(input6, "min", "30");
			attr(input6, "max", "42");
			attr(input6, "step", "0.5");
			input6.disabled = input6_disabled_value = !/*isPro*/ ctx[13];
			attr(input6, "class", "svelte-sq5a06");
			attr(span9, "class", "svelte-sq5a06");
			attr(div17, "class", "fg-slider-row svelte-sq5a06");
			attr(label6, "class", "svelte-sq5a06");
			attr(div18, "class", "fg-settings-section svelte-sq5a06");
			attr(div19, "class", "fg-settings-label svelte-sq5a06");
			attr(input7, "type", "range");
			attr(input7, "min", "5");
			attr(input7, "max", "25");
			attr(input7, "step", "0.5");
			input7.disabled = input7_disabled_value = !/*isPro*/ ctx[13];
			attr(input7, "class", "svelte-sq5a06");
			attr(span10, "class", "svelte-sq5a06");
			attr(div20, "class", "fg-slider-row svelte-sq5a06");
			attr(label7, "class", "svelte-sq5a06");
			attr(input8, "type", "range");
			attr(input8, "min", "10");
			attr(input8, "max", "35");
			attr(input8, "step", "0.5");
			input8.disabled = input8_disabled_value = !/*isPro*/ ctx[13];
			attr(input8, "class", "svelte-sq5a06");
			attr(span11, "class", "svelte-sq5a06");
			attr(div21, "class", "fg-slider-row svelte-sq5a06");
			attr(label8, "class", "svelte-sq5a06");
			attr(div22, "class", "fg-settings-section svelte-sq5a06");
			attr(div23, "class", "fg-settings-label svelte-sq5a06");
			attr(input9, "type", "range");
			attr(input9, "min", "1");
			attr(input9, "max", "25");
			attr(input9, "step", "0.5");
			input9.disabled = input9_disabled_value = !/*isPro*/ ctx[13];
			attr(input9, "class", "svelte-sq5a06");
			attr(span12, "class", "svelte-sq5a06");
			attr(div24, "class", "fg-slider-row svelte-sq5a06");
			attr(label9, "class", "svelte-sq5a06");
			attr(input10, "type", "range");
			attr(input10, "min", "5");
			attr(input10, "max", "60");
			attr(input10, "step", "1");
			input10.disabled = input10_disabled_value = !/*isPro*/ ctx[13];
			attr(input10, "class", "svelte-sq5a06");
			attr(span13, "class", "svelte-sq5a06");
			attr(div25, "class", "fg-slider-row svelte-sq5a06");
			attr(label10, "class", "svelte-sq5a06");
			attr(div26, "class", "fg-settings-section svelte-sq5a06");
			attr(div27, "class", "fg-settings-label svelte-sq5a06");
			attr(div28, "class", "fg-note svelte-sq5a06");
			attr(input11, "type", "checkbox");
			input11.disabled = input11_disabled_value = !/*isSite*/ ctx[52];
			attr(input11, "class", "svelte-sq5a06");
			attr(label11, "class", "fg-toggle-label svelte-sq5a06");
			attr(div29, "class", "fg-settings-section svelte-sq5a06");
			attr(div30, "class", "fg-settings-label svelte-sq5a06");
			attr(input12, "type", "checkbox");
			attr(input12, "class", "svelte-sq5a06");
			attr(label12, "class", "fg-toggle-label svelte-sq5a06");
			attr(input13, "type", "checkbox");
			input13.disabled = input13_disabled_value = !/*isPro*/ ctx[13];
			attr(input13, "class", "svelte-sq5a06");
			attr(label13, "class", "fg-toggle-label svelte-sq5a06");
			attr(input14, "type", "checkbox");
			input14.disabled = input14_disabled_value = !/*isSite*/ ctx[52];
			attr(input14, "class", "svelte-sq5a06");
			attr(label14, "class", "fg-toggle-label svelte-sq5a06");
			attr(div31, "class", "fg-settings-section svelte-sq5a06");
			attr(div32, "class", "fg-settings-label svelte-sq5a06");
			attr(div33, "class", "fg-note svelte-sq5a06");
			attr(div34, "class", "fg-settings-section svelte-sq5a06");
			attr(button, "class", "fg-btn fg-btn-secondary svelte-sq5a06");
			binding_group.p(input2, input3, input4);
			binding_group_1.p(input0, input1);
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div2, anchor);
			append(div2, div1);
			append(div2, t3);
			if_block0.m(div2, null);
			append(div2, t4);
			if (if_block1) if_block1.m(div2, null);
			insert(target, t5, anchor);
			insert(target, div5, anchor);
			append(div5, div3);
			append(div5, t7);
			append(div5, div4);
			append(div5, t9);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div5, null);
				}
			}

			append(div5, t10);
			if (if_block2) if_block2.m(div5, null);
			insert(target, t11, anchor);
			insert(target, div8, anchor);
			append(div8, div6);
			append(div6, t12);
			if (if_block3) if_block3.m(div6, null);
			append(div8, t13);
			append(div8, label0);
			append(label0, input0);
			input0.checked = input0.__value === /*settings*/ ctx[12].units;
			append(label0, t14);
			append(label0, span1);
			append(div8, t17);
			append(div8, label1);
			append(label1, input1);
			input1.checked = input1.__value === /*settings*/ ctx[12].units;
			append(label1, t18);
			append(label1, span3);
			append(div8, t21);
			append(div8, div7);
			insert(target, t23, anchor);
			insert(target, div11, anchor);
			append(div11, div9);
			append(div9, t24);
			if (if_block4) if_block4.m(div9, null);
			append(div11, t25);
			append(div11, div10);
			append(div11, t27);
			append(div11, label2);
			append(label2, input2);
			input2.checked = input2.__value === /*settings*/ ctx[12].winterMode;
			append(label2, t28);
			append(label2, span5);
			append(span5, t29);
			append(span5, span4);
			append(span4, t30);
			append(span4, t31);
			append(div11, t32);
			append(div11, label3);
			append(label3, input3);
			input3.checked = input3.__value === /*settings*/ ctx[12].winterMode;
			append(label3, t33);
			append(label3, span6);
			append(div11, t35);
			append(div11, label4);
			append(label4, input4);
			input4.checked = input4.__value === /*settings*/ ctx[12].winterMode;
			append(label4, t36);
			append(label4, span7);
			insert(target, t38, anchor);
			insert(target, div13, anchor);
			append(div13, div12);
			append(div13, t40);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div13, null);
				}
			}

			insert(target, t41, anchor);
			insert(target, div18, anchor);
			append(div18, div14);
			append(div14, t42);
			if (if_block5) if_block5.m(div14, null);
			append(div18, t43);
			append(div18, div15);
			append(div18, t45);
			append(div18, label5);
			append(label5, t46);
			append(label5, t47);
			append(label5, t48);
			append(label5, div16);
			append(div16, input5);
			set_input_value(input5, /*settings*/ ctx[12].wbgtWarnC);
			append(div16, t49);
			append(div16, span8);
			append(span8, t50);
			append(div18, t51);
			append(div18, label6);
			append(label6, t52);
			append(label6, t53);
			append(label6, t54);
			append(label6, div17);
			append(div17, input6);
			set_input_value(input6, /*settings*/ ctx[12].wbgtDangerC);
			append(div17, t55);
			append(div17, span9);
			append(span9, t56);
			insert(target, t57, anchor);
			insert(target, div22, anchor);
			append(div22, div19);
			append(div19, t58);
			if (if_block6) if_block6.m(div19, null);
			append(div22, t59);
			append(div22, label7);
			append(label7, t60);
			append(label7, t61);
			append(label7, t62);
			append(label7, div20);
			append(div20, input7);
			set_input_value(input7, /*settings*/ ctx[12].windWarnMs);
			append(div20, t63);
			append(div20, span10);
			append(span10, t64);
			append(div22, t65);
			append(div22, label8);
			append(label8, t66);
			append(label8, t67);
			append(label8, t68);
			append(label8, div21);
			append(div21, input8);
			set_input_value(input8, /*settings*/ ctx[12].windDangerMs);
			append(div21, t69);
			append(div21, span11);
			append(span11, t70);
			insert(target, t71, anchor);
			insert(target, div26, anchor);
			append(div26, div23);
			append(div23, t72);
			if (if_block7) if_block7.m(div23, null);
			append(div26, t73);
			append(div26, label9);
			append(label9, t74);
			append(label9, t75);
			append(label9, t76);
			append(label9, div24);
			append(div24, input9);
			set_input_value(input9, /*settings*/ ctx[12].rainWarnMmh);
			append(div24, t77);
			append(div24, span12);
			append(span12, t78);
			append(div26, t79);
			append(div26, label10);
			append(label10, t80);
			append(label10, t81);
			append(label10, t82);
			append(label10, div25);
			append(div25, input10);
			set_input_value(input10, /*settings*/ ctx[12].rainDangerMmh);
			append(div25, t83);
			append(div25, span13);
			append(span13, t84);
			insert(target, t85, anchor);
			insert(target, div29, anchor);
			append(div29, div27);
			append(div27, t86);
			if (if_block8) if_block8.m(div27, null);
			append(div29, t87);
			append(div29, div28);
			append(div29, t91);
			append(div29, label11);
			append(label11, input11);
			input11.checked = /*settings*/ ctx[12].monitorHazards.lightning;
			append(label11, t92);
			if (if_block9) if_block9.m(label11, null);
			append(div29, t93);
			if (if_block10) if_block10.m(div29, null);
			insert(target, t94, anchor);
			insert(target, div31, anchor);
			append(div31, div30);
			append(div31, t96);
			append(div31, label12);
			append(label12, input12);
			input12.checked = /*settings*/ ctx[12].soundAlerts;
			append(label12, t97);
			append(div31, t98);
			append(div31, label13);
			append(label13, input13);
			input13.checked = /*settings*/ ctx[12].autoRefresh;
			append(label13, t99);
			if (if_block11) if_block11.m(label13, null);
			append(div31, t100);
			append(div31, label14);
			append(label14, input14);
			input14.checked = /*settings*/ ctx[12].forecastAlerts;
			append(label14, t101);
			if (if_block12) if_block12.m(label14, null);
			append(div31, t102);
			if (if_block13) if_block13.m(div31, null);
			insert(target, t103, anchor);
			insert(target, div34, anchor);
			append(div34, div32);
			append(div32, t104);
			if (if_block14) if_block14.m(div32, null);
			append(div34, t105);
			append(div34, div33);
			append(div33, t106);
			append(div33, b1);
			append(div33, t108);
			append(div33, t109);
			append(div33, t110);
			append(div33, b2);
			append(div33, t112);
			if (if_block15) if_block15.m(div33, null);
			append(div34, t113);
			if (if_block16) if_block16.m(div34, null);
			append(div34, t114);
			if (if_block17) if_block17.m(div34, null);
			insert(target, t115, anchor);
			insert(target, button, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_handler*/ ctx[125]),
					listen(input0, "change", /*saveSettings*/ ctx[68]),
					listen(input1, "change", /*input1_change_handler*/ ctx[127]),
					listen(input1, "change", /*saveSettings*/ ctx[68]),
					listen(input2, "change", /*input2_change_handler*/ ctx[128]),
					listen(input2, "change", /*saveSettings*/ ctx[68]),
					listen(input3, "change", /*input3_change_handler*/ ctx[129]),
					listen(input3, "change", /*saveSettings*/ ctx[68]),
					listen(input4, "change", /*input4_change_handler*/ ctx[130]),
					listen(input4, "change", /*saveSettings*/ ctx[68]),
					listen(input5, "change", /*input5_change_input_handler*/ ctx[132]),
					listen(input5, "input", /*input5_change_input_handler*/ ctx[132]),
					listen(input5, "change", /*saveSettings*/ ctx[68]),
					listen(input6, "change", /*input6_change_input_handler*/ ctx[133]),
					listen(input6, "input", /*input6_change_input_handler*/ ctx[133]),
					listen(input6, "change", /*saveSettings*/ ctx[68]),
					listen(input7, "change", /*input7_change_input_handler*/ ctx[134]),
					listen(input7, "input", /*input7_change_input_handler*/ ctx[134]),
					listen(input7, "change", /*saveSettings*/ ctx[68]),
					listen(input8, "change", /*input8_change_input_handler*/ ctx[135]),
					listen(input8, "input", /*input8_change_input_handler*/ ctx[135]),
					listen(input8, "change", /*saveSettings*/ ctx[68]),
					listen(input9, "change", /*input9_change_input_handler*/ ctx[136]),
					listen(input9, "input", /*input9_change_input_handler*/ ctx[136]),
					listen(input9, "change", /*saveSettings*/ ctx[68]),
					listen(input10, "change", /*input10_change_input_handler*/ ctx[137]),
					listen(input10, "input", /*input10_change_input_handler*/ ctx[137]),
					listen(input10, "change", /*saveSettings*/ ctx[68]),
					listen(input11, "change", /*input11_change_handler*/ ctx[138]),
					listen(input11, "change", /*saveSettings*/ ctx[68]),
					listen(input12, "change", /*input12_change_handler*/ ctx[144]),
					listen(input12, "change", /*saveSettings*/ ctx[68]),
					listen(input13, "change", /*input13_change_handler*/ ctx[145]),
					listen(input13, "change", /*setupAutoRefresh*/ ctx[70]),
					listen(input14, "change", /*input14_change_handler*/ ctx[146]),
					listen(input14, "change", /*saveSettings*/ ctx[68]),
					listen(button, "click", /*resetSettings*/ ctx[69])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_17(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div2, t4);
				}
			}

			if (/*licenseMsg*/ ctx[34]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_76(ctx);
					if_block1.c();
					if_block1.m(div2, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[2] & /*saveSettings*/ 64) {
				each_value_18 = ensure_array_like(HAZARD_EMERGENCIES);
				let i;

				for (i = 0; i < each_value_18.length; i += 1) {
					const child_ctx = get_each_context_18(ctx, each_value_18, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_18(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div5, t10);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_18.length;
			}

			if (dirty[0] & /*settings*/ 4096) show_if = !Object.values(/*settings*/ ctx[12].monitorHazards).some(Boolean);

			if (show_if) {
				if (if_block2) ; else {
					if_block2 = create_if_block_75();
					if_block2.c();
					if_block2.m(div5, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (!/*isPro*/ ctx[13]) {
				if (if_block3) ; else {
					if_block3 = create_if_block_74();
					if_block3.c();
					if_block3.m(div6, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (dirty[0] & /*isPro*/ 8192 && input0_disabled_value !== (input0_disabled_value = !/*isPro*/ ctx[13])) {
				input0.disabled = input0_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				input0.checked = input0.__value === /*settings*/ ctx[12].units;
			}

			if (dirty[0] & /*isPro*/ 8192 && input1_disabled_value !== (input1_disabled_value = !/*isPro*/ ctx[13])) {
				input1.disabled = input1_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				input1.checked = input1.__value === /*settings*/ ctx[12].units;
			}

			if (!/*isPro*/ ctx[13]) {
				if (if_block4) ; else {
					if_block4 = create_if_block_73();
					if_block4.c();
					if_block4.m(div9, null);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (dirty[0] & /*isPro*/ 8192 && input2_disabled_value !== (input2_disabled_value = !/*isPro*/ ctx[13])) {
				input2.disabled = input2_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				input2.checked = input2.__value === /*settings*/ ctx[12].winterMode;
			}

			if (dirty[1] & /*units*/ 4194304 && t31_value !== (t31_value = (/*units*/ ctx[53] === 'imperial' ? '50°F' : '10°C') + "")) set_data(t31, t31_value);

			if (dirty[0] & /*isPro*/ 8192 && input3_disabled_value !== (input3_disabled_value = !/*isPro*/ ctx[13])) {
				input3.disabled = input3_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				input3.checked = input3.__value === /*settings*/ ctx[12].winterMode;
			}

			if (dirty[0] & /*isPro*/ 8192 && input4_disabled_value !== (input4_disabled_value = !/*isPro*/ ctx[13])) {
				input4.disabled = input4_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				input4.checked = input4.__value === /*settings*/ ctx[12].winterMode;
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 | dirty[2] & /*saveSettings*/ 64) {
				each_value_17 = ensure_array_like(Object.entries(PPE_PROFILES));
				let i;

				for (i = 0; i < each_value_17.length; i += 1) {
					const child_ctx = get_each_context_17(ctx, each_value_17, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_17(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div13, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_17.length;
			}

			if (!/*isPro*/ ctx[13]) {
				if (if_block5) ; else {
					if_block5 = create_if_block_72();
					if_block5.c();
					if_block5.m(div14, null);
				}
			} else if (if_block5) {
				if_block5.d(1);
				if_block5 = null;
			}

			if (dirty[1] & /*units*/ 4194304 && t47_value !== (t47_value = (/*units*/ ctx[53] === 'imperial' ? '°F' : '°C') + "")) set_data(t47, t47_value);

			if (dirty[0] & /*isPro*/ 8192 && input5_disabled_value !== (input5_disabled_value = !/*isPro*/ ctx[13])) {
				input5.disabled = input5_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input5, /*settings*/ ctx[12].wbgtWarnC);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t50_value !== (t50_value = fmtTemp(/*settings*/ ctx[12].wbgtWarnC, /*units*/ ctx[53]) + "")) set_data(t50, t50_value);
			if (dirty[1] & /*units*/ 4194304 && t53_value !== (t53_value = (/*units*/ ctx[53] === 'imperial' ? '°F' : '°C') + "")) set_data(t53, t53_value);

			if (dirty[0] & /*isPro*/ 8192 && input6_disabled_value !== (input6_disabled_value = !/*isPro*/ ctx[13])) {
				input6.disabled = input6_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input6, /*settings*/ ctx[12].wbgtDangerC);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t56_value !== (t56_value = fmtTemp(/*settings*/ ctx[12].wbgtDangerC, /*units*/ ctx[53]) + "")) set_data(t56, t56_value);

			if (!/*isPro*/ ctx[13]) {
				if (if_block6) ; else {
					if_block6 = create_if_block_71();
					if_block6.c();
					if_block6.m(div19, null);
				}
			} else if (if_block6) {
				if_block6.d(1);
				if_block6 = null;
			}

			if (dirty[1] & /*units*/ 4194304 && t61_value !== (t61_value = (/*units*/ ctx[53] === 'imperial' ? 'mph' : 'm/s') + "")) set_data(t61, t61_value);

			if (dirty[0] & /*isPro*/ 8192 && input7_disabled_value !== (input7_disabled_value = !/*isPro*/ ctx[13])) {
				input7.disabled = input7_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input7, /*settings*/ ctx[12].windWarnMs);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t64_value !== (t64_value = fmtWind(/*settings*/ ctx[12].windWarnMs, /*units*/ ctx[53]) + "")) set_data(t64, t64_value);
			if (dirty[1] & /*units*/ 4194304 && t67_value !== (t67_value = (/*units*/ ctx[53] === 'imperial' ? 'mph' : 'm/s') + "")) set_data(t67, t67_value);

			if (dirty[0] & /*isPro*/ 8192 && input8_disabled_value !== (input8_disabled_value = !/*isPro*/ ctx[13])) {
				input8.disabled = input8_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input8, /*settings*/ ctx[12].windDangerMs);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t70_value !== (t70_value = fmtWind(/*settings*/ ctx[12].windDangerMs, /*units*/ ctx[53]) + "")) set_data(t70, t70_value);

			if (!/*isPro*/ ctx[13]) {
				if (if_block7) ; else {
					if_block7 = create_if_block_70();
					if_block7.c();
					if_block7.m(div23, null);
				}
			} else if (if_block7) {
				if_block7.d(1);
				if_block7 = null;
			}

			if (dirty[1] & /*units*/ 4194304 && t75_value !== (t75_value = (/*units*/ ctx[53] === 'imperial' ? 'in/h' : 'mm/h') + "")) set_data(t75, t75_value);

			if (dirty[0] & /*isPro*/ 8192 && input9_disabled_value !== (input9_disabled_value = !/*isPro*/ ctx[13])) {
				input9.disabled = input9_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input9, /*settings*/ ctx[12].rainWarnMmh);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t78_value !== (t78_value = fmtRain(/*settings*/ ctx[12].rainWarnMmh, /*units*/ ctx[53]) + "")) set_data(t78, t78_value);
			if (dirty[1] & /*units*/ 4194304 && t81_value !== (t81_value = (/*units*/ ctx[53] === 'imperial' ? 'in/h' : 'mm/h') + "")) set_data(t81, t81_value);

			if (dirty[0] & /*isPro*/ 8192 && input10_disabled_value !== (input10_disabled_value = !/*isPro*/ ctx[13])) {
				input10.disabled = input10_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input10, /*settings*/ ctx[12].rainDangerMmh);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t84_value !== (t84_value = fmtRain(/*settings*/ ctx[12].rainDangerMmh, /*units*/ ctx[53]) + "")) set_data(t84, t84_value);

			if (!/*isSite*/ ctx[52]) {
				if (if_block8) ; else {
					if_block8 = create_if_block_69();
					if_block8.c();
					if_block8.m(div27, null);
				}
			} else if (if_block8) {
				if_block8.d(1);
				if_block8 = null;
			}

			if (dirty[1] & /*isSite*/ 2097152 && input11_disabled_value !== (input11_disabled_value = !/*isSite*/ ctx[52])) {
				input11.disabled = input11_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				input11.checked = /*settings*/ ctx[12].monitorHazards.lightning;
			}

			if (!/*isSite*/ ctx[52]) {
				if (if_block9) ; else {
					if_block9 = create_if_block_68();
					if_block9.c();
					if_block9.m(label11, null);
				}
			} else if (if_block9) {
				if_block9.d(1);
				if_block9 = null;
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_18(ctx)) && if_block10) {
				if_block10.p(ctx, dirty);
			} else {
				if (if_block10) if_block10.d(1);
				if_block10 = current_block_type_1 && current_block_type_1(ctx);

				if (if_block10) {
					if_block10.c();
					if_block10.m(div29, null);
				}
			}

			if (dirty[0] & /*settings*/ 4096) {
				input12.checked = /*settings*/ ctx[12].soundAlerts;
			}

			if (dirty[0] & /*isPro*/ 8192 && input13_disabled_value !== (input13_disabled_value = !/*isPro*/ ctx[13])) {
				input13.disabled = input13_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				input13.checked = /*settings*/ ctx[12].autoRefresh;
			}

			if (!/*isPro*/ ctx[13]) {
				if (if_block11) ; else {
					if_block11 = create_if_block_65();
					if_block11.c();
					if_block11.m(label13, null);
				}
			} else if (if_block11) {
				if_block11.d(1);
				if_block11 = null;
			}

			if (dirty[1] & /*isSite*/ 2097152 && input14_disabled_value !== (input14_disabled_value = !/*isSite*/ ctx[52])) {
				input14.disabled = input14_disabled_value;
			}

			if (dirty[0] & /*settings*/ 4096) {
				input14.checked = /*settings*/ ctx[12].forecastAlerts;
			}

			if (!/*isSite*/ ctx[52]) {
				if (if_block12) ; else {
					if_block12 = create_if_block_64();
					if_block12.c();
					if_block12.m(label14, null);
				}
			} else if (if_block12) {
				if_block12.d(1);
				if_block12 = null;
			}

			if (current_block_type_2 === (current_block_type_2 = select_block_type_19(ctx)) && if_block13) {
				if_block13.p(ctx, dirty);
			} else {
				if (if_block13) if_block13.d(1);
				if_block13 = current_block_type_2 && current_block_type_2(ctx);

				if (if_block13) {
					if_block13.c();
					if_block13.m(div31, null);
				}
			}

			if (!/*isPro*/ ctx[13]) {
				if (if_block14) ; else {
					if_block14 = create_if_block_61();
					if_block14.c();
					if_block14.m(div32, null);
				}
			} else if (if_block14) {
				if_block14.d(1);
				if_block14 = null;
			}

			if (!/*isPro*/ ctx[13]) {
				if (if_block15) ; else {
					if_block15 = create_if_block_60();
					if_block15.c();
					if_block15.m(div33, null);
				}
			} else if (if_block15) {
				if_block15.d(1);
				if_block15 = null;
			}

			if (/*isPro*/ ctx[13]) {
				if (if_block16) {
					if_block16.p(ctx, dirty);
				} else {
					if_block16 = create_if_block_58(ctx);
					if_block16.c();
					if_block16.m(div34, t114);
				}
			} else if (if_block16) {
				if_block16.d(1);
				if_block16 = null;
			}

			if (/*monitorMsg*/ ctx[41]) {
				if (if_block17) {
					if_block17.p(ctx, dirty);
				} else {
					if_block17 = create_if_block_57(ctx);
					if_block17.c();
					if_block17.m(div34, null);
				}
			} else if (if_block17) {
				if_block17.d(1);
				if_block17 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div2);
				detach(t5);
				detach(div5);
				detach(t11);
				detach(div8);
				detach(t23);
				detach(div11);
				detach(t38);
				detach(div13);
				detach(t41);
				detach(div18);
				detach(t57);
				detach(div22);
				detach(t71);
				detach(div26);
				detach(t85);
				detach(div29);
				detach(t94);
				detach(div31);
				detach(t103);
				detach(div34);
				detach(t115);
				detach(button);
			}

			if_block0.d();
			if (if_block1) if_block1.d();
			destroy_each(each_blocks_1, detaching);
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
			destroy_each(each_blocks, detaching);
			if (if_block5) if_block5.d();
			if (if_block6) if_block6.d();
			if (if_block7) if_block7.d();
			if (if_block8) if_block8.d();
			if (if_block9) if_block9.d();

			if (if_block10) {
				if_block10.d();
			}

			if (if_block11) if_block11.d();
			if (if_block12) if_block12.d();

			if (if_block13) {
				if_block13.d();
			}

			if (if_block14) if_block14.d();
			if (if_block15) if_block15.d();
			if (if_block16) if_block16.d();
			if (if_block17) if_block17.d();
			binding_group.r();
			binding_group_1.r();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (559:29) 
function create_if_block_52(ctx) {
	let div0;
	let t1;
	let div1;
	let t3;
	let div2;
	let t4;
	let b;
	let t5;
	let t6;
	let if_block1_anchor;
	let if_block0 = !/*activeIsSaved*/ ctx[56] && create_if_block_55();

	function select_block_type_16(ctx, dirty) {
		if (!/*isPro*/ ctx[13]) return create_if_block_53;
		return create_else_block_12;
	}

	let current_block_type = select_block_type_16(ctx);
	let if_block1 = current_block_type(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = "📄 Weekly ISO 7933 Report";
			t1 = space();
			div1 = element("div");
			div1.textContent = "Aligned to ISO 7933:2004 / ISO 7243:2017 / ACGIH TLV / FIDIC Clause 8.4";
			t3 = space();
			div2 = element("div");
			t4 = text("📄 Report for: ");
			b = element("b");
			t5 = text(/*activeSiteLabel*/ ctx[57]);
			if (if_block0) if_block0.c();
			t6 = space();
			if_block1.c();
			if_block1_anchor = empty();
			attr(div0, "class", "fg-section-title svelte-sq5a06");
			attr(div1, "class", "fg-report-note svelte-sq5a06");
			attr(b, "class", "svelte-sq5a06");
			attr(div2, "class", "fg-active-site svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			insert(target, t3, anchor);
			insert(target, div2, anchor);
			append(div2, t4);
			append(div2, b);
			append(b, t5);
			if (if_block0) if_block0.m(div2, null);
			insert(target, t6, anchor);
			if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[1] & /*activeSiteLabel*/ 67108864) set_data(t5, /*activeSiteLabel*/ ctx[57]);

			if (!/*activeIsSaved*/ ctx[56]) {
				if (if_block0) ; else {
					if_block0 = create_if_block_55();
					if_block0.c();
					if_block0.m(div2, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_16(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
				detach(t3);
				detach(div2);
				detach(t6);
				detach(if_block1_anchor);
			}

			if (if_block0) if_block0.d();
			if_block1.d(detaching);
		}
	};
}

// (485:32) 
function create_if_block_43(ctx) {
	let if_block_anchor;

	function select_block_type_13(ctx, dirty) {
		if (!/*isPro*/ ctx[13]) return create_if_block_44;
		return create_else_block_9;
	}

	let current_block_type = select_block_type_13(ctx);
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
			if (current_block_type === (current_block_type = select_block_type_13(ctx)) && if_block) {
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

// (28:2) {#if tab === 'dashboard'}
function create_if_block(ctx) {
	let div0;
	let span0;
	let t1;
	let span1;
	let t2_value = (/*locationName*/ ctx[2] || /*lat*/ ctx[0].toFixed(3) + ', ' + /*lon*/ ctx[1].toFixed(3)) + "";
	let t2;
	let t3;
	let span2;
	let t4_value = (/*isDay*/ ctx[20] ? '☀ Day' : '🌙 Night') + "";
	let t4;
	let span2_class_value;
	let t5;
	let button0;
	let t6_value = (/*locked*/ ctx[19] ? '🔒' : '🔓') + "";
	let t6;
	let button0_class_value;
	let button0_title_value;
	let t7;
	let button1;
	let t9;
	let div1;
	let t10;
	let t11;
	let t12;
	let div2;
	let label0;
	let t14;
	let select;
	let t15;
	let label1;
	let input;
	let input_disabled_value;
	let t16;
	let t17;
	let if_block3_anchor;
	let mounted;
	let dispose;
	let each_value_10 = ensure_array_like(/*savedSites*/ ctx[10]);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_10.length; i += 1) {
		each_blocks_1[i] = create_each_block_10(get_each_context_10(ctx, each_value_10, i));
	}

	function select_block_type_2(ctx, dirty) {
		if (/*canAddMore*/ ctx[58]) return create_if_block_40;
		if (/*isPro*/ ctx[13]) return create_if_block_41;
		return create_else_block_7;
	}

	let current_block_type = select_block_type_2(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*isStale*/ ctx[48] && create_if_block_39(ctx);
	let each_value_9 = ensure_array_like(/*MODELS*/ ctx[62]);
	let each_blocks = [];

	for (let i = 0; i < each_value_9.length; i += 1) {
		each_blocks[i] = create_each_block_9(get_each_context_9(ctx, each_value_9, i));
	}

	let if_block2 = !/*isPro*/ ctx[13] && create_if_block_38();

	function select_block_type_3(ctx, dirty) {
		if (/*loading*/ ctx[16]) return create_if_block_1;
		if (/*error*/ ctx[17]) return create_if_block_2;
		if (/*heat*/ ctx[3]) return create_if_block_3;
	}

	let current_block_type_1 = select_block_type_3(ctx);
	let if_block3 = current_block_type_1 && current_block_type_1(ctx);

	return {
		c() {
			div0 = element("div");
			span0 = element("span");
			span0.textContent = "📍";
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			span2 = element("span");
			t4 = text(t4_value);
			t5 = space();
			button0 = element("button");
			t6 = text(t6_value);
			t7 = space();
			button1 = element("button");
			button1.textContent = "🔄";
			t9 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t10 = space();
			if_block0.c();
			t11 = space();
			if (if_block1) if_block1.c();
			t12 = space();
			div2 = element("div");
			label0 = element("label");
			label0.textContent = "Model:";
			t14 = space();
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t15 = space();
			label1 = element("label");
			input = element("input");
			t16 = text("\r\n        Worst-case ⚡");
			if (if_block2) if_block2.c();
			t17 = space();
			if (if_block3) if_block3.c();
			if_block3_anchor = empty();
			attr(span1, "class", "fg-loc-text svelte-sq5a06");
			attr(span2, "class", span2_class_value = "fg-daynight " + (/*isDay*/ ctx[20] ? 'day' : 'night') + " svelte-sq5a06");
			attr(button0, "class", button0_class_value = "fg-mini-btn " + (/*locked*/ ctx[19] ? 'locked' : '') + " svelte-sq5a06");

			attr(button0, "title", button0_title_value = /*locked*/ ctx[19]
			? 'Unlock pin (map clicks move it)'
			: 'Lock pin to this location');

			attr(button1, "class", "fg-mini-btn svelte-sq5a06");
			attr(button1, "title", "Refresh");
			attr(div0, "class", "fg-location-row svelte-sq5a06");
			attr(div1, "class", "fg-sites svelte-sq5a06");
			set_style(label0, "margin", "0");
			attr(label0, "class", "svelte-sq5a06");
			attr(select, "class", "svelte-sq5a06");
			if (/*selectedModel*/ ctx[37] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[98].call(select));
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = !/*isPro*/ ctx[13];
			attr(input, "class", "svelte-sq5a06");
			attr(label1, "class", "fg-worst-label svelte-sq5a06");
			set_style(label1, "margin", "0");
			attr(div2, "class", "fg-model-row svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, span0);
			append(div0, t1);
			append(div0, span1);
			append(span1, t2);
			append(div0, t3);
			append(div0, span2);
			append(span2, t4);
			append(div0, t5);
			append(div0, button0);
			append(button0, t6);
			append(div0, t7);
			append(div0, button1);
			insert(target, t9, anchor);
			insert(target, div1, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div1, null);
				}
			}

			append(div1, t10);
			if_block0.m(div1, null);
			insert(target, t11, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t12, anchor);
			insert(target, div2, anchor);
			append(div2, label0);
			append(div2, t14);
			append(div2, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			select_option(select, /*selectedModel*/ ctx[37], true);
			append(div2, t15);
			append(div2, label1);
			append(label1, input);
			input.checked = /*worstCaseMode*/ ctx[9];
			append(label1, t16);
			if (if_block2) if_block2.m(label1, null);
			insert(target, t17, anchor);
			if (if_block3) if_block3.m(target, anchor);
			insert(target, if_block3_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_2*/ ctx[89]),
					listen(button1, "click", /*refreshData*/ ctx[67]),
					listen(select, "change", /*select_change_handler*/ ctx[98]),
					listen(select, "change", /*refreshData*/ ctx[67]),
					listen(input, "change", /*input_change_handler*/ ctx[99]),
					listen(input, "change", /*refreshData*/ ctx[67])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*locationName, lat, lon*/ 7 && t2_value !== (t2_value = (/*locationName*/ ctx[2] || /*lat*/ ctx[0].toFixed(3) + ', ' + /*lon*/ ctx[1].toFixed(3)) + "")) set_data(t2, t2_value);
			if (dirty[0] & /*isDay*/ 1048576 && t4_value !== (t4_value = (/*isDay*/ ctx[20] ? '☀ Day' : '🌙 Night') + "")) set_data(t4, t4_value);

			if (dirty[0] & /*isDay*/ 1048576 && span2_class_value !== (span2_class_value = "fg-daynight " + (/*isDay*/ ctx[20] ? 'day' : 'night') + " svelte-sq5a06")) {
				attr(span2, "class", span2_class_value);
			}

			if (dirty[0] & /*locked*/ 524288 && t6_value !== (t6_value = (/*locked*/ ctx[19] ? '🔒' : '🔓') + "")) set_data(t6, t6_value);

			if (dirty[0] & /*locked*/ 524288 && button0_class_value !== (button0_class_value = "fg-mini-btn " + (/*locked*/ ctx[19] ? 'locked' : '') + " svelte-sq5a06")) {
				attr(button0, "class", button0_class_value);
			}

			if (dirty[0] & /*locked*/ 524288 && button0_title_value !== (button0_title_value = /*locked*/ ctx[19]
			? 'Unlock pin (map clicks move it)'
			: 'Lock pin to this location')) {
				attr(button0, "title", button0_title_value);
			}

			if (dirty[0] & /*savedSites, activeSiteId*/ 3072 | dirty[1] & /*editName, editingSiteId, bgStatus*/ 622592 | dirty[2] & /*commitRename, selectSite, startRename, removeSite*/ 7864320) {
				each_value_10 = ensure_array_like(/*savedSites*/ ctx[10]);
				let i;

				for (i = 0; i < each_value_10.length; i += 1) {
					const child_ctx = get_each_context_10(ctx, each_value_10, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_10(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div1, t10);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_10.length;
			}

			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div1, null);
				}
			}

			if (/*isStale*/ ctx[48]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_39(ctx);
					if_block1.c();
					if_block1.m(t12.parentNode, t12);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty[2] & /*MODELS*/ 1) {
				each_value_9 = ensure_array_like(/*MODELS*/ ctx[62]);
				let i;

				for (i = 0; i < each_value_9.length; i += 1) {
					const child_ctx = get_each_context_9(ctx, each_value_9, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_9(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_9.length;
			}

			if (dirty[1] & /*selectedModel*/ 64 | dirty[2] & /*MODELS*/ 1) {
				select_option(select, /*selectedModel*/ ctx[37]);
			}

			if (dirty[0] & /*isPro*/ 8192 && input_disabled_value !== (input_disabled_value = !/*isPro*/ ctx[13])) {
				input.disabled = input_disabled_value;
			}

			if (dirty[0] & /*worstCaseMode*/ 512) {
				input.checked = /*worstCaseMode*/ ctx[9];
			}

			if (!/*isPro*/ ctx[13]) {
				if (if_block2) ; else {
					if_block2 = create_if_block_38();
					if_block2.c();
					if_block2.m(label1, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_3(ctx)) && if_block3) {
				if_block3.p(ctx, dirty);
			} else {
				if (if_block3) if_block3.d(1);
				if_block3 = current_block_type_1 && current_block_type_1(ctx);

				if (if_block3) {
					if_block3.c();
					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t9);
				detach(div1);
				detach(t11);
				detach(t12);
				detach(div2);
				detach(t17);
				detach(if_block3_anchor);
			}

			destroy_each(each_blocks_1, detaching);
			if_block0.d();
			if (if_block1) if_block1.d(detaching);
			destroy_each(each_blocks, detaching);
			if (if_block2) if_block2.d();

			if (if_block3) {
				if_block3.d(detaching);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (614:6) {:else}
function create_else_block_13(ctx) {
	let div0;
	let t1;
	let div1;
	let input;
	let t2;
	let button;
	let t3_value = (/*licenseChecking*/ ctx[35] ? '…' : 'Activate') + "";
	let t3;
	let t4;
	let a;
	let mounted;
	let dispose;

	return {
		c() {
			div0 = element("div");
			div0.textContent = "Free tier. A license key unlocks Pro: imperial units, worst-case engine, cold-stress/winter, lightning, custom thresholds & ISO 7933 reports.";
			t1 = space();
			div1 = element("div");
			input = element("input");
			t2 = space();
			button = element("button");
			t3 = text(t3_value);
			t4 = space();
			a = element("a");
			a.textContent = "Get a license →";
			attr(div0, "class", "fg-note svelte-sq5a06");
			attr(input, "class", "fg-license-input svelte-sq5a06");
			attr(input, "type", "text");
			attr(input, "placeholder", "FG-XXXX-XXXX-XXXX");
			attr(input, "spellcheck", "false");
			attr(button, "class", "fg-btn-inline svelte-sq5a06");
			button.disabled = /*licenseChecking*/ ctx[35];
			attr(div1, "class", "fg-license-row svelte-sq5a06");
			attr(a, "class", "fg-buy-link svelte-sq5a06");
			attr(a, "href", "https://fieldguard-hse.com/#pricing");
			attr(a, "target", "_blank");
			attr(a, "rel", "noopener");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			append(div1, input);
			set_input_value(input, /*licenseKey*/ ctx[32]);
			append(div1, t2);
			append(div1, button);
			append(button, t3);
			insert(target, t4, anchor);
			insert(target, a, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler_1*/ ctx[122]),
					listen(input, "keydown", /*keydown_handler_2*/ ctx[123]),
					listen(button, "click", /*activateLicense*/ ctx[71])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[1] & /*licenseKey*/ 2 && input.value !== /*licenseKey*/ ctx[32]) {
				set_input_value(input, /*licenseKey*/ ctx[32]);
			}

			if (dirty[1] & /*licenseChecking*/ 16 && t3_value !== (t3_value = (/*licenseChecking*/ ctx[35] ? '…' : 'Activate') + "")) set_data(t3, t3_value);

			if (dirty[1] & /*licenseChecking*/ 16) {
				button.disabled = /*licenseChecking*/ ctx[35];
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
				detach(t4);
				detach(a);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (608:6) {#if isPro}
function create_if_block_77(ctx) {
	let div;
	let span0;
	let t0;
	let t1_value = (/*licenseTier*/ ctx[8] === 'site' ? 'SITE' : 'PRO') + "";
	let t1;
	let t2;
	let span1;
	let t3;

	let t4_value = (/*licenseExpires*/ ctx[33]
	? ' · expires ' + /*licenseExpires*/ ctx[33]
	: '') + "";

	let t4;
	let t5;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			span0 = element("span");
			t0 = text("✓ ");
			t1 = text(t1_value);
			t2 = space();
			span1 = element("span");
			t3 = text("Active");
			t4 = text(t4_value);
			t5 = space();
			button = element("button");
			button.textContent = "Deactivate";
			attr(span0, "class", "fg-pro-badge svelte-sq5a06");
			set_style(span1, "flex", "1");
			attr(button, "class", "fg-mini-btn svelte-sq5a06");
			attr(div, "class", "fg-license-active svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(span0, t0);
			append(span0, t1);
			append(div, t2);
			append(div, span1);
			append(span1, t3);
			append(span1, t4);
			append(div, t5);
			append(div, button);

			if (!mounted) {
				dispose = listen(button, "click", /*deactivateLicense*/ ctx[72]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*licenseTier*/ 256 && t1_value !== (t1_value = (/*licenseTier*/ ctx[8] === 'site' ? 'SITE' : 'PRO') + "")) set_data(t1, t1_value);

			if (dirty[1] & /*licenseExpires*/ 4 && t4_value !== (t4_value = (/*licenseExpires*/ ctx[33]
			? ' · expires ' + /*licenseExpires*/ ctx[33]
			: '') + "")) set_data(t4, t4_value);
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

// (623:6) {#if licenseMsg}
function create_if_block_76(ctx) {
	let div;
	let t_1;

	return {
		c() {
			div = element("div");
			t_1 = text(/*licenseMsg*/ ctx[34]);
			attr(div, "class", "fg-license-msg svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t_1);
		},
		p(ctx, dirty) {
			if (dirty[1] & /*licenseMsg*/ 8) set_data(t_1, /*licenseMsg*/ ctx[34]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (629:6) {#each HAZARD_EMERGENCIES as hz}
function create_each_block_18(ctx) {
	let label;
	let input;
	let t0;
	let t1_value = /*hz*/ ctx[215].icon + "";
	let t1;
	let t2;
	let t3_value = /*hz*/ ctx[215].title + "";
	let t3;
	let mounted;
	let dispose;

	function input_change_handler_1() {
		/*input_change_handler_1*/ ctx[124].call(input, /*hz*/ ctx[215]);
	}

	return {
		c() {
			label = element("label");
			input = element("input");
			t0 = space();
			t1 = text(t1_value);
			t2 = space();
			t3 = text(t3_value);
			attr(input, "type", "checkbox");
			attr(input, "class", "svelte-sq5a06");
			attr(label, "class", "fg-toggle-label svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			input.checked = /*settings*/ ctx[12].monitorHazards[/*hz*/ ctx[215].key];
			append(label, t0);
			append(label, t1);
			append(label, t2);
			append(label, t3);

			if (!mounted) {
				dispose = [
					listen(input, "change", input_change_handler_1),
					listen(input, "change", /*saveSettings*/ ctx[68])
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*settings*/ 4096) {
				input.checked = /*settings*/ ctx[12].monitorHazards[/*hz*/ ctx[215].key];
			}
		},
		d(detaching) {
			if (detaching) {
				detach(label);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (635:6) {#if !Object.values(settings.monitorHazards).some(Boolean)}
function create_if_block_75(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "⚠ No hazards selected — nothing will be monitored or alerted.";
			attr(div, "class", "fg-license-msg svelte-sq5a06");
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

// (641:60) {#if !isPro}
function create_if_block_74(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (654:71) {#if !isPro}
function create_if_block_73(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (672:6) {#each Object.entries(PPE_PROFILES) as [key, prof]}
function create_each_block_17(ctx) {
	let label;
	let input;
	let t0;
	let span1;
	let t1_value = /*prof*/ ctx[229].label + "";
	let t1;
	let t2;
	let span0;
	let t3_value = fmtAdj(/*prof*/ ctx[229].adjustment, /*units*/ ctx[53]) + "";
	let t3;
	let t4;
	let binding_group;
	let mounted;
	let dispose;
	binding_group = init_binding_group(/*$$binding_groups*/ ctx[126][0]);

	return {
		c() {
			label = element("label");
			input = element("input");
			t0 = space();
			span1 = element("span");
			t1 = text(t1_value);
			t2 = space();
			span0 = element("span");
			t3 = text(t3_value);
			t4 = space();
			attr(input, "type", "radio");
			input.__value = /*key*/ ctx[228];
			set_input_value(input, input.__value);
			attr(input, "class", "svelte-sq5a06");
			attr(span0, "class", "fg-adj svelte-sq5a06");
			attr(span1, "class", "fg-radio-text svelte-sq5a06");
			attr(label, "class", "fg-radio-label svelte-sq5a06");
			binding_group.p(input);
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			input.checked = input.__value === /*settings*/ ctx[12].ppeProfile;
			append(label, t0);
			append(label, span1);
			append(span1, t1);
			append(span1, t2);
			append(span1, span0);
			append(span0, t3);
			append(label, t4);

			if (!mounted) {
				dispose = [
					listen(input, "change", /*input_change_handler_2*/ ctx[131]),
					listen(input, "change", /*saveSettings*/ ctx[68])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 4096) {
				input.checked = input.__value === /*settings*/ ctx[12].ppeProfile;
			}

			if (dirty[1] & /*units*/ 4194304 && t3_value !== (t3_value = fmtAdj(/*prof*/ ctx[229].adjustment, /*units*/ ctx[53]) + "")) set_data(t3, t3_value);
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

// (681:74) {#if !isPro}
function create_if_block_72(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (698:56) {#if !isPro}
function create_if_block_71(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (714:56) {#if !isPro}
function create_if_block_70(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (730:66) {#if !isSite}
function create_if_block_69(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "SITE";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (734:51) {#if !isSite}
function create_if_block_68(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "SITE";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (768:24) 
function create_if_block_67(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.innerHTML = `Real-time lightning strike alerts (range rings + stop-work + all-clear) are available on the <b>Site</b> licence tier.`;
			attr(div, "class", "fg-note svelte-sq5a06");
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

// (736:6) {#if isSite && settings.monitorHazards.lightning}
function create_if_block_66(ctx) {
	let label0;
	let t0;
	let div0;
	let input0;
	let t1;
	let span0;
	let t2_value = ringLbl(/*settings*/ ctx[12].lightningStopInnerMi, /*units*/ ctx[53]) + "";
	let t2;
	let t3;
	let label1;
	let t4;
	let div1;
	let input1;
	let t5;
	let span1;
	let t6_value = ringLbl(/*settings*/ ctx[12].lightningStopMi, /*units*/ ctx[53]) + "";
	let t6;
	let t7;
	let label2;
	let t8;
	let div2;
	let input2;
	let t9;
	let span2;
	let t10_value = ringLbl(/*settings*/ ctx[12].lightningWarnMi, /*units*/ ctx[53]) + "";
	let t10;
	let t11;
	let label3;
	let t12;
	let div3;
	let input3;
	let t13;
	let span3;
	let t14_value = ringLbl(/*settings*/ ctx[12].lightningAdvisoryMi, /*units*/ ctx[53]) + "";
	let t14;
	let t15;
	let label4;
	let t16;
	let div4;
	let input4;
	let t17;
	let span4;
	let t18_value = /*settings*/ ctx[12].lightningAllClearMin + "";
	let t18;
	let t19;
	let t20;
	let div5;
	let t21;
	let t22_value = ringLbl(/*settings*/ ctx[12].lightningStopInnerMi, /*units*/ ctx[53]) + "";
	let t22;
	let t23;
	let t24_value = ringLbl(/*settings*/ ctx[12].lightningStopMi, /*units*/ ctx[53]) + "";
	let t24;
	let t25;
	let t26_value = ringLbl(/*settings*/ ctx[12].lightningWarnMi, /*units*/ ctx[53]) + "";
	let t26;
	let t27;
	let t28_value = ringLbl(/*settings*/ ctx[12].lightningAdvisoryMi, /*units*/ ctx[53]) + "";
	let t28;
	let t29;
	let mounted;
	let dispose;

	return {
		c() {
			label0 = element("label");
			t0 = text("Stop-work ring — inner (RED) — strikes within\r\n          ");
			div0 = element("div");
			input0 = element("input");
			t1 = space();
			span0 = element("span");
			t2 = text(t2_value);
			t3 = space();
			label1 = element("label");
			t4 = text("Stop-work ring — outer (RED) — strikes within\r\n          ");
			div1 = element("div");
			input1 = element("input");
			t5 = space();
			span1 = element("span");
			t6 = text(t6_value);
			t7 = space();
			label2 = element("label");
			t8 = text("Warning ring — within\r\n          ");
			div2 = element("div");
			input2 = element("input");
			t9 = space();
			span2 = element("span");
			t10 = text(t10_value);
			t11 = space();
			label3 = element("label");
			t12 = text("Advisory ring — within\r\n          ");
			div3 = element("div");
			input3 = element("input");
			t13 = space();
			span3 = element("span");
			t14 = text(t14_value);
			t15 = space();
			label4 = element("label");
			t16 = text("All-clear wait (30-30 rule)\r\n          ");
			div4 = element("div");
			input4 = element("input");
			t17 = space();
			span4 = element("span");
			t18 = text(t18_value);
			t19 = text(" min");
			t20 = space();
			div5 = element("div");
			t21 = text("Rings: ≤");
			t22 = text(t22_value);
			t23 = text(" & ≤");
			t24 = text(t24_value);
			t25 = text(" = stop-work (RED) · ≤");
			t26 = text(t26_value);
			t27 = text(" = warning · ≤");
			t28 = text(t28_value);
			t29 = text(" = advisory. Decision-support only — the stop-work call stays with your competent person.");
			attr(input0, "type", "range");
			attr(input0, "min", "2");
			attr(input0, "max", "10");
			attr(input0, "step", "1");
			attr(input0, "class", "svelte-sq5a06");
			attr(span0, "class", "svelte-sq5a06");
			attr(div0, "class", "fg-slider-row svelte-sq5a06");
			attr(label0, "class", "svelte-sq5a06");
			attr(input1, "type", "range");
			attr(input1, "min", "3");
			attr(input1, "max", "15");
			attr(input1, "step", "1");
			attr(input1, "class", "svelte-sq5a06");
			attr(span1, "class", "svelte-sq5a06");
			attr(div1, "class", "fg-slider-row svelte-sq5a06");
			attr(label1, "class", "svelte-sq5a06");
			attr(input2, "type", "range");
			attr(input2, "min", "5");
			attr(input2, "max", "25");
			attr(input2, "step", "1");
			attr(input2, "class", "svelte-sq5a06");
			attr(span2, "class", "svelte-sq5a06");
			attr(div2, "class", "fg-slider-row svelte-sq5a06");
			attr(label2, "class", "svelte-sq5a06");
			attr(input3, "type", "range");
			attr(input3, "min", "10");
			attr(input3, "max", "30");
			attr(input3, "step", "1");
			attr(input3, "class", "svelte-sq5a06");
			attr(span3, "class", "svelte-sq5a06");
			attr(div3, "class", "fg-slider-row svelte-sq5a06");
			attr(label3, "class", "svelte-sq5a06");
			attr(input4, "type", "range");
			attr(input4, "min", "10");
			attr(input4, "max", "60");
			attr(input4, "step", "5");
			attr(input4, "class", "svelte-sq5a06");
			attr(span4, "class", "svelte-sq5a06");
			attr(div4, "class", "fg-slider-row svelte-sq5a06");
			attr(label4, "class", "svelte-sq5a06");
			attr(div5, "class", "fg-note svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, label0, anchor);
			append(label0, t0);
			append(label0, div0);
			append(div0, input0);
			set_input_value(input0, /*settings*/ ctx[12].lightningStopInnerMi);
			append(div0, t1);
			append(div0, span0);
			append(span0, t2);
			insert(target, t3, anchor);
			insert(target, label1, anchor);
			append(label1, t4);
			append(label1, div1);
			append(div1, input1);
			set_input_value(input1, /*settings*/ ctx[12].lightningStopMi);
			append(div1, t5);
			append(div1, span1);
			append(span1, t6);
			insert(target, t7, anchor);
			insert(target, label2, anchor);
			append(label2, t8);
			append(label2, div2);
			append(div2, input2);
			set_input_value(input2, /*settings*/ ctx[12].lightningWarnMi);
			append(div2, t9);
			append(div2, span2);
			append(span2, t10);
			insert(target, t11, anchor);
			insert(target, label3, anchor);
			append(label3, t12);
			append(label3, div3);
			append(div3, input3);
			set_input_value(input3, /*settings*/ ctx[12].lightningAdvisoryMi);
			append(div3, t13);
			append(div3, span3);
			append(span3, t14);
			insert(target, t15, anchor);
			insert(target, label4, anchor);
			append(label4, t16);
			append(label4, div4);
			append(div4, input4);
			set_input_value(input4, /*settings*/ ctx[12].lightningAllClearMin);
			append(div4, t17);
			append(div4, span4);
			append(span4, t18);
			append(span4, t19);
			insert(target, t20, anchor);
			insert(target, div5, anchor);
			append(div5, t21);
			append(div5, t22);
			append(div5, t23);
			append(div5, t24);
			append(div5, t25);
			append(div5, t26);
			append(div5, t27);
			append(div5, t28);
			append(div5, t29);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_input_handler*/ ctx[139]),
					listen(input0, "input", /*input0_change_input_handler*/ ctx[139]),
					listen(input0, "change", /*saveSettings*/ ctx[68]),
					listen(input1, "change", /*input1_change_input_handler*/ ctx[140]),
					listen(input1, "input", /*input1_change_input_handler*/ ctx[140]),
					listen(input1, "change", /*saveSettings*/ ctx[68]),
					listen(input2, "change", /*input2_change_input_handler*/ ctx[141]),
					listen(input2, "input", /*input2_change_input_handler*/ ctx[141]),
					listen(input2, "change", /*saveSettings*/ ctx[68]),
					listen(input3, "change", /*input3_change_input_handler*/ ctx[142]),
					listen(input3, "input", /*input3_change_input_handler*/ ctx[142]),
					listen(input3, "change", /*saveSettings*/ ctx[68]),
					listen(input4, "change", /*input4_change_input_handler*/ ctx[143]),
					listen(input4, "input", /*input4_change_input_handler*/ ctx[143]),
					listen(input4, "change", /*saveSettings*/ ctx[68])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input0, /*settings*/ ctx[12].lightningStopInnerMi);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t2_value !== (t2_value = ringLbl(/*settings*/ ctx[12].lightningStopInnerMi, /*units*/ ctx[53]) + "")) set_data(t2, t2_value);

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input1, /*settings*/ ctx[12].lightningStopMi);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t6_value !== (t6_value = ringLbl(/*settings*/ ctx[12].lightningStopMi, /*units*/ ctx[53]) + "")) set_data(t6, t6_value);

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input2, /*settings*/ ctx[12].lightningWarnMi);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t10_value !== (t10_value = ringLbl(/*settings*/ ctx[12].lightningWarnMi, /*units*/ ctx[53]) + "")) set_data(t10, t10_value);

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input3, /*settings*/ ctx[12].lightningAdvisoryMi);
			}

			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t14_value !== (t14_value = ringLbl(/*settings*/ ctx[12].lightningAdvisoryMi, /*units*/ ctx[53]) + "")) set_data(t14, t14_value);

			if (dirty[0] & /*settings*/ 4096) {
				set_input_value(input4, /*settings*/ ctx[12].lightningAllClearMin);
			}

			if (dirty[0] & /*settings*/ 4096 && t18_value !== (t18_value = /*settings*/ ctx[12].lightningAllClearMin + "")) set_data(t18, t18_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t22_value !== (t22_value = ringLbl(/*settings*/ ctx[12].lightningStopInnerMi, /*units*/ ctx[53]) + "")) set_data(t22, t22_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t24_value !== (t24_value = ringLbl(/*settings*/ ctx[12].lightningStopMi, /*units*/ ctx[53]) + "")) set_data(t24, t24_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t26_value !== (t26_value = ringLbl(/*settings*/ ctx[12].lightningWarnMi, /*units*/ ctx[53]) + "")) set_data(t26, t26_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t28_value !== (t28_value = ringLbl(/*settings*/ ctx[12].lightningAdvisoryMi, /*units*/ ctx[53]) + "")) set_data(t28, t28_value);
		},
		d(detaching) {
			if (detaching) {
				detach(label0);
				detach(t3);
				detach(label1);
				detach(t7);
				detach(label2);
				detach(t11);
				detach(label3);
				detach(t15);
				detach(label4);
				detach(t20);
				detach(div5);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (781:71) {#if !isPro}
function create_if_block_65(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (785:64) {#if !isSite}
function create_if_block_64(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "SITE";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (798:24) 
function create_if_block_63(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.innerHTML = `Forecast Watch (hourly lookahead alerts) is available on the <b>Site</b> licence tier.`;
			attr(div, "class", "fg-note svelte-sq5a06");
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

// (787:6) {#if isSite && settings.forecastAlerts}
function create_if_block_62(ctx) {
	let label;
	let t0;
	let div0;
	let select;
	let option0;
	let option1;
	let option2;
	let t4;
	let div1;
	let mounted;
	let dispose;

	return {
		c() {
			label = element("label");
			t0 = text("Lookahead horizon\r\n          ");
			div0 = element("div");
			select = element("select");
			option0 = element("option");
			option0.textContent = "Next 24 hours (1 day)";
			option1 = element("option");
			option1.textContent = "Next 48 hours (2 days)";
			option2 = element("option");
			option2.textContent = "Next 72 hours (3 days)";
			t4 = space();
			div1 = element("div");
			div1.textContent = "Scans the hourly forecast for the current model and flags the first hour each hazard is predicted to cross your warning/danger thresholds.";
			option0.__value = 1;
			set_input_value(option0, option0.__value);
			option1.__value = 2;
			set_input_value(option1, option1.__value);
			option2.__value = 3;
			set_input_value(option2, option2.__value);
			set_style(select, "background", "#1e293b");
			set_style(select, "border", "1px solid #334155");
			set_style(select, "color", "#e2e8f0");
			set_style(select, "padding", "3px 6px");
			set_style(select, "border-radius", "4px");
			set_style(select, "font-size", "11px");
			attr(select, "class", "svelte-sq5a06");
			if (/*settings*/ ctx[12].forecastDays === void 0) add_render_callback(() => /*select_change_handler_2*/ ctx[147].call(select));
			attr(div0, "class", "fg-slider-row svelte-sq5a06");
			attr(label, "class", "svelte-sq5a06");
			attr(div1, "class", "fg-note svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, t0);
			append(label, div0);
			append(div0, select);
			append(select, option0);
			append(select, option1);
			append(select, option2);
			select_option(select, /*settings*/ ctx[12].forecastDays, true);
			insert(target, t4, anchor);
			insert(target, div1, anchor);

			if (!mounted) {
				dispose = [
					listen(select, "change", /*select_change_handler_2*/ ctx[147]),
					listen(select, "change", /*saveSettings*/ ctx[68])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 4096) {
				select_option(select, /*settings*/ ctx[12].forecastDays);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(label);
				detach(t4);
				detach(div1);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (804:67) {#if !isPro}
function create_if_block_61(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (805:364) {#if !isPro}
function create_if_block_60(ctx) {
	let t_1;

	return {
		c() {
			t_1 = text("Requires a Pro or Site license.");
		},
		m(target, anchor) {
			insert(target, t_1, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t_1);
			}
		}
	};
}

// (806:6) {#if isPro}
function create_if_block_58(ctx) {
	let div0;
	let input;
	let t0;
	let button;
	let t1_value = (/*monitorBusy*/ ctx[42] ? '…' : '🔔 Monitor') + "";
	let t1;
	let t2;
	let div1;
	let t3;
	let t4_value = /*lat*/ ctx[0].toFixed(5) + "";
	let t4;
	let t5;
	let t6_value = /*lon*/ ctx[1].toFixed(5) + "";
	let t6;
	let t7;
	let t8_value = /*maxSites*/ ctx[60]() + "";
	let t8;
	let t9;
	let t10_value = (/*maxSites*/ ctx[60]() > 1 ? 's' : '') + "";
	let t10;
	let t11;
	let t12;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*monitoredSites*/ ctx[43].length > 0 && create_if_block_59(ctx);

	return {
		c() {
			div0 = element("div");
			input = element("input");
			t0 = space();
			button = element("button");
			t1 = text(t1_value);
			t2 = space();
			div1 = element("div");
			t3 = text("Registers the current pin (");
			t4 = text(t4_value);
			t5 = text(", ");
			t6 = text(t6_value);
			t7 = text("). Up to ");
			t8 = text(t8_value);
			t9 = text(" site");
			t10 = text(t10_value);
			t11 = text(" on your license. Add several recipients for this site, comma-separated — each site can have its own list. For a bigger team (10+), use one internal distribution address instead.");
			t12 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(input, "class", "fg-license-input svelte-sq5a06");
			attr(input, "type", "text");
			attr(input, "placeholder", "you@company.com, super@company.com");
			attr(input, "spellcheck", "false");
			attr(button, "class", "fg-btn-inline svelte-sq5a06");
			button.disabled = /*monitorBusy*/ ctx[42];
			attr(div0, "class", "fg-license-row svelte-sq5a06");
			attr(div1, "class", "fg-note svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, input);
			set_input_value(input, /*alertEmail*/ ctx[40]);
			append(div0, t0);
			append(div0, button);
			append(button, t1);
			insert(target, t2, anchor);
			insert(target, div1, anchor);
			append(div1, t3);
			append(div1, t4);
			append(div1, t5);
			append(div1, t6);
			append(div1, t7);
			append(div1, t8);
			append(div1, t9);
			append(div1, t10);
			append(div1, t11);
			insert(target, t12, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler_2*/ ctx[149]),
					listen(button, "click", /*register24*/ ctx[74])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[1] & /*alertEmail*/ 512 && input.value !== /*alertEmail*/ ctx[40]) {
				set_input_value(input, /*alertEmail*/ ctx[40]);
			}

			if (dirty[1] & /*monitorBusy*/ 2048 && t1_value !== (t1_value = (/*monitorBusy*/ ctx[42] ? '…' : '🔔 Monitor') + "")) set_data(t1, t1_value);

			if (dirty[1] & /*monitorBusy*/ 2048) {
				button.disabled = /*monitorBusy*/ ctx[42];
			}

			if (dirty[0] & /*lat*/ 1 && t4_value !== (t4_value = /*lat*/ ctx[0].toFixed(5) + "")) set_data(t4, t4_value);
			if (dirty[0] & /*lon*/ 2 && t6_value !== (t6_value = /*lon*/ ctx[1].toFixed(5) + "")) set_data(t6, t6_value);

			if (/*monitoredSites*/ ctx[43].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_59(ctx);
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
				detach(t2);
				detach(div1);
				detach(t12);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (812:8) {#if monitoredSites.length > 0}
function create_if_block_59(ctx) {
	let div;
	let each_value_16 = ensure_array_like(/*monitoredSites*/ ctx[43]);
	let each_blocks = [];

	for (let i = 0; i < each_value_16.length; i += 1) {
		each_blocks[i] = create_each_block_16(get_each_context_16(ctx, each_value_16, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "fg-mon-list svelte-sq5a06");
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
			if (dirty[1] & /*monitoredSites*/ 4096 | dirty[2] & /*removeMonitor, monZoneColor*/ 10240) {
				each_value_16 = ensure_array_like(/*monitoredSites*/ ctx[43]);
				let i;

				for (i = 0; i < each_value_16.length; i += 1) {
					const child_ctx = get_each_context_16(ctx, each_value_16, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_16(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_16.length;
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

// (814:12) {#each monitoredSites as m}
function create_each_block_16(ctx) {
	let div;
	let span0;
	let t0;
	let span1;
	let t1_value = /*m*/ ctx[206].name + "";
	let t1;
	let t2;
	let button;
	let t4;
	let mounted;
	let dispose;

	function click_handler_15() {
		return /*click_handler_15*/ ctx[150](/*m*/ ctx[206]);
	}

	return {
		c() {
			div = element("div");
			span0 = element("span");
			t0 = space();
			span1 = element("span");
			t1 = text(t1_value);
			t2 = space();
			button = element("button");
			button.textContent = "✕";
			t4 = space();
			attr(span0, "class", "fg-mon-dot svelte-sq5a06");
			set_style(span0, "background", /*monZoneColor*/ ctx[73](/*m*/ ctx[206].last_zone));
			set_style(span1, "flex", "1");
			attr(button, "class", "fg-mini-btn svelte-sq5a06");
			attr(div, "class", "fg-mon-item svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(div, t0);
			append(div, span1);
			append(span1, t1);
			append(div, t2);
			append(div, button);
			append(div, t4);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_15);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[1] & /*monitoredSites*/ 4096) {
				set_style(span0, "background", /*monZoneColor*/ ctx[73](/*m*/ ctx[206].last_zone));
			}

			if (dirty[1] & /*monitoredSites*/ 4096 && t1_value !== (t1_value = /*m*/ ctx[206].name + "")) set_data(t1, t1_value);
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

// (824:6) {#if monitorMsg}
function create_if_block_57(ctx) {
	let div;
	let t_1;

	return {
		c() {
			div = element("div");
			t_1 = text(/*monitorMsg*/ ctx[41]);
			attr(div, "class", "fg-license-msg svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t_1);
		},
		p(ctx, dirty) {
			if (dirty[1] & /*monitorMsg*/ 1024) set_data(t_1, /*monitorMsg*/ ctx[41]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (564:71) {#if !activeIsSaved}
function create_if_block_55(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "· current map location — pick a saved site on Live to report on it";
			attr(span, "class", "fg-site-hint svelte-sq5a06");
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

// (568:4) {:else}
function create_else_block_12(ctx) {
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
	let input5;
	let t11;
	let label6;
	let t12;
	let input6;
	let t13;
	let label7;
	let t14;
	let input7;
	let t15;
	let label8;
	let t16;
	let input8;
	let t17;
	let label9;
	let t18;
	let input9;
	let t19;
	let label10;
	let t20;
	let select;
	let option0;
	let option1;
	let option2;
	let t24;
	let label11;
	let t25;
	let input10;
	let t26;
	let button;
	let t28;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*reportText*/ ctx[39] && create_if_block_54(ctx);

	return {
		c() {
			div = element("div");
			label0 = element("label");
			t0 = text("Project Name");
			input0 = element("input");
			t1 = space();
			label1 = element("label");
			t2 = text("Contract No.");
			input1 = element("input");
			t3 = space();
			label2 = element("label");
			t4 = text("Country / Jurisdiction");
			input2 = element("input");
			t5 = space();
			label3 = element("label");
			t6 = text("Client / Employer");
			input3 = element("input");
			t7 = space();
			label4 = element("label");
			t8 = text("Main Contractor");
			input4 = element("input");
			t9 = space();
			label5 = element("label");
			t10 = text("HSE Manager");
			input5 = element("input");
			t11 = space();
			label6 = element("label");
			t12 = text("Regulatory Reference");
			input6 = element("input");
			t13 = space();
			label7 = element("label");
			t14 = text("Work Ban Start");
			input7 = element("input");
			t15 = space();
			label8 = element("label");
			t16 = text("Work Ban End");
			input8 = element("input");
			t17 = space();
			label9 = element("label");
			t18 = text("Ban Months");
			input9 = element("input");
			t19 = space();
			label10 = element("label");
			t20 = text("FIDIC Assessment\r\n        ");
			select = element("select");
			option0 = element("option");
			option0.textContent = "ELIGIBLE";
			option1 = element("option");
			option1.textContent = "NOT ELIGIBLE";
			option2 = element("option");
			option2.textContent = "UNDER REVIEW";
			t24 = space();
			label11 = element("label");
			t25 = text("Est. Delay Days");
			input10 = element("input");
			t26 = space();
			button = element("button");
			button.textContent = "📋 Generate ISO 7933 Report";
			t28 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(input0, "placeholder", "Site/Project Name");
			attr(input0, "class", "svelte-sq5a06");
			attr(label0, "class", "svelte-sq5a06");
			attr(input1, "placeholder", "CONTRACT-001");
			attr(input1, "class", "svelte-sq5a06");
			attr(label1, "class", "svelte-sq5a06");
			attr(input2, "placeholder", "UAE, Qatar, Saudi Arabia…");
			attr(input2, "class", "svelte-sq5a06");
			attr(label2, "class", "svelte-sq5a06");
			attr(input3, "placeholder", "Client Name");
			attr(input3, "class", "svelte-sq5a06");
			attr(label3, "class", "svelte-sq5a06");
			attr(input4, "placeholder", "Contractor Name");
			attr(input4, "class", "svelte-sq5a06");
			attr(label4, "class", "svelte-sq5a06");
			attr(input5, "placeholder", "Name, Cert. No.");
			attr(input5, "class", "svelte-sq5a06");
			attr(label5, "class", "svelte-sq5a06");
			attr(input6, "placeholder", "e.g. local midday-work regulation");
			attr(input6, "class", "svelte-sq5a06");
			attr(label6, "class", "svelte-sq5a06");
			attr(input7, "placeholder", "12:30");
			attr(input7, "class", "svelte-sq5a06");
			attr(label7, "class", "svelte-sq5a06");
			attr(input8, "placeholder", "15:30");
			attr(input8, "class", "svelte-sq5a06");
			attr(label8, "class", "svelte-sq5a06");
			attr(input9, "placeholder", "June, July, August");
			attr(input9, "class", "svelte-sq5a06");
			attr(label9, "class", "svelte-sq5a06");
			option0.__value = "ELIGIBLE";
			set_input_value(option0, option0.__value);
			option1.__value = "NOT ELIGIBLE";
			set_input_value(option1, option1.__value);
			option2.__value = "UNDER REVIEW";
			set_input_value(option2, option2.__value);
			attr(select, "class", "svelte-sq5a06");
			if (/*reportMeta*/ ctx[51].fidic === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[120].call(select));
			attr(label10, "class", "svelte-sq5a06");
			attr(input10, "type", "number");
			attr(input10, "min", "0");
			attr(input10, "class", "svelte-sq5a06");
			attr(label11, "class", "svelte-sq5a06");
			attr(div, "class", "fg-form svelte-sq5a06");
			attr(button, "class", "fg-btn fg-btn-primary svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, label0);
			append(label0, t0);
			append(label0, input0);
			set_input_value(input0, /*reportMeta*/ ctx[51].projectName);
			append(div, t1);
			append(div, label1);
			append(label1, t2);
			append(label1, input1);
			set_input_value(input1, /*reportMeta*/ ctx[51].contractNumber);
			append(div, t3);
			append(div, label2);
			append(label2, t4);
			append(label2, input2);
			set_input_value(input2, /*reportMeta*/ ctx[51].country);
			append(div, t5);
			append(div, label3);
			append(label3, t6);
			append(label3, input3);
			set_input_value(input3, /*reportMeta*/ ctx[51].clientName);
			append(div, t7);
			append(div, label4);
			append(label4, t8);
			append(label4, input4);
			set_input_value(input4, /*reportMeta*/ ctx[51].contractorName);
			append(div, t9);
			append(div, label5);
			append(label5, t10);
			append(label5, input5);
			set_input_value(input5, /*reportMeta*/ ctx[51].hseManagerName);
			append(div, t11);
			append(div, label6);
			append(label6, t12);
			append(label6, input6);
			set_input_value(input6, /*reportMeta*/ ctx[51].regulatoryRef);
			append(div, t13);
			append(div, label7);
			append(label7, t14);
			append(label7, input7);
			set_input_value(input7, /*reportMeta*/ ctx[51].banStart);
			append(div, t15);
			append(div, label8);
			append(label8, t16);
			append(label8, input8);
			set_input_value(input8, /*reportMeta*/ ctx[51].banEnd);
			append(div, t17);
			append(div, label9);
			append(label9, t18);
			append(label9, input9);
			set_input_value(input9, /*reportMeta*/ ctx[51].banMonths);
			append(div, t19);
			append(div, label10);
			append(label10, t20);
			append(label10, select);
			append(select, option0);
			append(select, option1);
			append(select, option2);
			select_option(select, /*reportMeta*/ ctx[51].fidic, true);
			append(div, t24);
			append(div, label11);
			append(label11, t25);
			append(label11, input10);
			set_input_value(input10, /*reportMeta*/ ctx[51].delayDays);
			insert(target, t26, anchor);
			insert(target, button, anchor);
			insert(target, t28, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler_1*/ ctx[110]),
					listen(input1, "input", /*input1_input_handler_1*/ ctx[111]),
					listen(input2, "input", /*input2_input_handler*/ ctx[112]),
					listen(input3, "input", /*input3_input_handler*/ ctx[113]),
					listen(input4, "input", /*input4_input_handler*/ ctx[114]),
					listen(input5, "input", /*input5_input_handler*/ ctx[115]),
					listen(input6, "input", /*input6_input_handler*/ ctx[116]),
					listen(input7, "input", /*input7_input_handler*/ ctx[117]),
					listen(input8, "input", /*input8_input_handler*/ ctx[118]),
					listen(input9, "input", /*input9_input_handler*/ ctx[119]),
					listen(select, "change", /*select_change_handler_1*/ ctx[120]),
					listen(input10, "input", /*input10_input_handler*/ ctx[121]),
					listen(button, "click", /*generateReport*/ ctx[76])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[1] & /*reportMeta*/ 1048576 && input0.value !== /*reportMeta*/ ctx[51].projectName) {
				set_input_value(input0, /*reportMeta*/ ctx[51].projectName);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input1.value !== /*reportMeta*/ ctx[51].contractNumber) {
				set_input_value(input1, /*reportMeta*/ ctx[51].contractNumber);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input2.value !== /*reportMeta*/ ctx[51].country) {
				set_input_value(input2, /*reportMeta*/ ctx[51].country);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input3.value !== /*reportMeta*/ ctx[51].clientName) {
				set_input_value(input3, /*reportMeta*/ ctx[51].clientName);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input4.value !== /*reportMeta*/ ctx[51].contractorName) {
				set_input_value(input4, /*reportMeta*/ ctx[51].contractorName);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input5.value !== /*reportMeta*/ ctx[51].hseManagerName) {
				set_input_value(input5, /*reportMeta*/ ctx[51].hseManagerName);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input6.value !== /*reportMeta*/ ctx[51].regulatoryRef) {
				set_input_value(input6, /*reportMeta*/ ctx[51].regulatoryRef);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input7.value !== /*reportMeta*/ ctx[51].banStart) {
				set_input_value(input7, /*reportMeta*/ ctx[51].banStart);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input8.value !== /*reportMeta*/ ctx[51].banEnd) {
				set_input_value(input8, /*reportMeta*/ ctx[51].banEnd);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && input9.value !== /*reportMeta*/ ctx[51].banMonths) {
				set_input_value(input9, /*reportMeta*/ ctx[51].banMonths);
			}

			if (dirty[1] & /*reportMeta*/ 1048576) {
				select_option(select, /*reportMeta*/ ctx[51].fidic);
			}

			if (dirty[1] & /*reportMeta*/ 1048576 && to_number(input10.value) !== /*reportMeta*/ ctx[51].delayDays) {
				set_input_value(input10, /*reportMeta*/ ctx[51].delayDays);
			}

			if (/*reportText*/ ctx[39]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_54(ctx);
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
				detach(t26);
				detach(button);
				detach(t28);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (566:4) {#if !isPro}
function create_if_block_53(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.innerHTML = `🔒 ISO 7933 report generation is a <b>Pro</b> feature. Activate a license in <b>Config</b> to produce defensible weekly reports &amp; FIDIC 8.4 evidence.`;
			attr(div, "class", "fg-upgrade svelte-sq5a06");
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

// (590:4) {#if reportText}
function create_if_block_54(ctx) {
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
			t6 = text(/*reportText*/ ctx[39]);
			attr(span, "class", "svelte-sq5a06");
			attr(button0, "class", "fg-mini-btn svelte-sq5a06");
			attr(button1, "class", "fg-mini-btn svelte-sq5a06");
			attr(div0, "class", "fg-report-toolbar svelte-sq5a06");
			attr(pre, "class", "fg-report-text svelte-sq5a06");
			attr(div1, "class", "fg-report-preview svelte-sq5a06");
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
					listen(button0, "click", /*copyReport*/ ctx[77]),
					listen(button1, "click", /*downloadReport*/ ctx[78])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[1] & /*reportText*/ 256) set_data(t6, /*reportText*/ ctx[39]);
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

// (492:4) {:else}
function create_else_block_9(ctx) {
	let div0;
	let t1;
	let div1;
	let t2;
	let b;
	let t3;
	let t4;
	let t5;
	let div3;
	let div2;
	let t6;
	let t7;
	let if_block0 = !/*activeIsSaved*/ ctx[56] && create_if_block_51();

	function select_block_type_14(ctx, dirty) {
		if (/*sosHazards*/ ctx[14].length === 0) return create_if_block_47;
		return create_else_block_11;
	}

	let current_block_type = select_block_type_14(ctx);
	let if_block1 = current_block_type(ctx);
	let if_block2 = /*alertLog*/ ctx[38].length > 0 && create_if_block_46(ctx);

	function select_block_type_15(ctx, dirty) {
		if (/*alertLog*/ ctx[38].length === 0) return create_if_block_45;
		return create_else_block_10;
	}

	let current_block_type_1 = select_block_type_15(ctx);
	let if_block3 = current_block_type_1(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = "🚨 Emergency Response — All Hazards";
			t1 = space();
			div1 = element("div");
			t2 = text("📍 ");
			b = element("b");
			t3 = text(/*activeSiteLabel*/ ctx[57]);
			if (if_block0) if_block0.c();
			t4 = space();
			if_block1.c();
			t5 = space();
			div3 = element("div");
			div2 = element("div");
			t6 = text("📋 Alerts Log (This Session)\r\n        ");
			if (if_block2) if_block2.c();
			t7 = space();
			if_block3.c();
			attr(div0, "class", "fg-section-title svelte-sq5a06");
			attr(b, "class", "svelte-sq5a06");
			attr(div1, "class", "fg-active-site svelte-sq5a06");
			attr(div2, "class", "fg-card-header svelte-sq5a06");
			attr(div3, "class", "fg-card svelte-sq5a06");
			set_style(div3, "border-color", "#d97706");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			append(div1, t2);
			append(div1, b);
			append(b, t3);
			if (if_block0) if_block0.m(div1, null);
			insert(target, t4, anchor);
			if_block1.m(target, anchor);
			insert(target, t5, anchor);
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, t6);
			if (if_block2) if_block2.m(div2, null);
			append(div3, t7);
			if_block3.m(div3, null);
		},
		p(ctx, dirty) {
			if (dirty[1] & /*activeSiteLabel*/ 67108864) set_data(t3, /*activeSiteLabel*/ ctx[57]);

			if (!/*activeIsSaved*/ ctx[56]) {
				if (if_block0) ; else {
					if_block0 = create_if_block_51();
					if_block0.c();
					if_block0.m(div1, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_14(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(t5.parentNode, t5);
				}
			}

			if (/*alertLog*/ ctx[38].length > 0) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_46(ctx);
					if_block2.c();
					if_block2.m(div2, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_15(ctx)) && if_block3) {
				if_block3.p(ctx, dirty);
			} else {
				if_block3.d(1);
				if_block3 = current_block_type_1(ctx);

				if (if_block3) {
					if_block3.c();
					if_block3.m(div3, null);
				}
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
				detach(t4);
				detach(t5);
				detach(div3);
			}

			if (if_block0) if_block0.d();
			if_block1.d(detaching);
			if (if_block2) if_block2.d();
			if_block3.d();
		}
	};
}

// (486:4) {#if !isPro}
function create_if_block_44(ctx) {
	let div2;
	let div0;
	let t1;
	let div1;
	let t3;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			div0.textContent = "🚨";
			t1 = space();
			div1 = element("div");
			div1.textContent = "SOS — Pro Feature";
			t3 = space();
			button = element("button");
			button.textContent = "Upgrade";
			attr(div0, "class", "pf-ic svelte-sq5a06");
			attr(div1, "class", "pf-t svelte-sq5a06");
			attr(button, "class", "pf-btn svelte-sq5a06");
			attr(div2, "class", "fg-pro-feature svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div2, t1);
			append(div2, div1);
			append(div2, t3);
			append(div2, button);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_13*/ ctx[108]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			mounted = false;
			dispose();
		}
	};
}

// (494:59) {#if !activeIsSaved}
function create_if_block_51(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "· current map location (not a saved site)";
			attr(span, "class", "fg-site-hint svelte-sq5a06");
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

// (498:4) {:else}
function create_else_block_11(ctx) {
	let div;
	let t_1;
	let each1_anchor;
	let each_value_15 = ensure_array_like(/*sosHazards*/ ctx[14]);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_15.length; i += 1) {
		each_blocks_1[i] = create_each_block_15(get_each_context_15(ctx, each_value_15, i));
	}

	let each_value_12 = ensure_array_like(/*sosHazards*/ ctx[14]);
	let each_blocks = [];

	for (let i = 0; i < each_value_12.length; i += 1) {
		each_blocks[i] = create_each_block_12(get_each_context_12(ctx, each_value_12, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t_1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each1_anchor = empty();
			attr(div, "class", "fg-emg-jump svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div, null);
				}
			}

			insert(target, t_1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*emgHazard, sosHazards*/ 16448 | dirty[2] & /*currentHazardStatus*/ 4) {
				each_value_15 = ensure_array_like(/*sosHazards*/ ctx[14]);
				let i;

				for (i = 0; i < each_value_15.length; i += 1) {
					const child_ctx = get_each_context_15(ctx, each_value_15, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_15(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_15.length;
			}

			if (dirty[0] & /*sosHazards, emgHazard*/ 16448 | dirty[2] & /*currentHazardStatus*/ 4) {
				each_value_12 = ensure_array_like(/*sosHazards*/ ctx[14]);
				let i;

				for (i = 0; i < each_value_12.length; i += 1) {
					const child_ctx = get_each_context_12(ctx, each_value_12, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_12(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_12.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
				detach(t_1);
				detach(each1_anchor);
			}

			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (496:4) {#if sosHazards.length === 0}
function create_if_block_47(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.innerHTML = `No hazards selected to monitor. Enable hazards in <b>Config → Hazards to Monitor</b>.`;
			attr(div, "class", "fg-empty svelte-sq5a06");
			set_style(div, "padding", "16px 12px");
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

// (505:10) {#if st}
function create_if_block_50(ctx) {
	let span;
	let t_1_value = /*st*/ ctx[218].label + "";
	let t_1;

	return {
		c() {
			span = element("span");
			t_1 = text(t_1_value);
			attr(span, "class", "fg-emg-chip-st svelte-sq5a06");
			set_style(span, "color", /*st*/ ctx[218].color);
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t_1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sosHazards*/ 16384 && t_1_value !== (t_1_value = /*st*/ ctx[218].label + "")) set_data(t_1, t_1_value);

			if (dirty[0] & /*sosHazards*/ 16384) {
				set_style(span, "color", /*st*/ ctx[218].color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (501:6) {#each sosHazards as hz}
function create_each_block_15(ctx) {
	let button;
	let span;
	let t0_value = /*hz*/ ctx[215].icon + "";
	let t0;
	let t1;
	let t2;
	let button_class_value;
	let button_style_value;
	let mounted;
	let dispose;
	let if_block = /*st*/ ctx[218] && create_if_block_50(ctx);

	function click_handler_14() {
		return /*click_handler_14*/ ctx[109](/*hz*/ ctx[215]);
	}

	return {
		c() {
			button = element("button");
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();

			attr(button, "class", button_class_value = "fg-emg-chip " + (/*emgHazard*/ ctx[6] === /*hz*/ ctx[215].key
			? 'sel'
			: '') + " svelte-sq5a06");

			attr(button, "style", button_style_value = /*st*/ ctx[218]
			? `border-color:${/*st*/ ctx[218].color}`
			: '');
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, span);
			append(span, t0);
			append(button, t1);
			if (if_block) if_block.m(button, null);
			append(button, t2);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_14);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*sosHazards*/ 16384 && t0_value !== (t0_value = /*hz*/ ctx[215].icon + "")) set_data(t0, t0_value);

			if (/*st*/ ctx[218]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_50(ctx);
					if_block.c();
					if_block.m(button, t2);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*emgHazard, sosHazards*/ 16448 && button_class_value !== (button_class_value = "fg-emg-chip " + (/*emgHazard*/ ctx[6] === /*hz*/ ctx[215].key
			? 'sel'
			: '') + " svelte-sq5a06")) {
				attr(button, "class", button_class_value);
			}

			if (dirty[0] & /*sosHazards*/ 16384 && button_style_value !== (button_style_value = /*st*/ ctx[218]
			? `border-color:${/*st*/ ctx[218].color}`
			: '')) {
				attr(button, "style", button_style_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

// (511:6) {#if emgHazard === hz.key}
function create_if_block_48(ctx) {
	let div6;
	let div0;
	let t0_value = /*hz*/ ctx[215].icon + "";
	let t0;
	let t1;
	let t2_value = /*hz*/ ctx[215].title + "";
	let t2;
	let t3;
	let t4;
	let div1;
	let t5_value = /*hz*/ ctx[215].danger + "";
	let t5;
	let t6;
	let div3;
	let div2;
	let t7;
	let t8_value = /*hz*/ ctx[215].signsLabel + "";
	let t8;
	let t9;
	let t10;
	let div5;
	let div4;
	let t12;
	let t13;
	let div6_style_value;
	let if_block = /*st*/ ctx[218] && create_if_block_49(ctx);
	let each_value_14 = ensure_array_like(/*hz*/ ctx[215].signs);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_14.length; i += 1) {
		each_blocks_1[i] = create_each_block_14(get_each_context_14(ctx, each_value_14, i));
	}

	let each_value_13 = ensure_array_like(/*hz*/ ctx[215].response);
	let each_blocks = [];

	for (let i = 0; i < each_value_13.length; i += 1) {
		each_blocks[i] = create_each_block_13(get_each_context_13(ctx, each_value_13, i));
	}

	return {
		c() {
			div6 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = text(" Is Life-Threatening\r\n            ");
			if (if_block) if_block.c();
			t4 = space();
			div1 = element("div");
			t5 = text(t5_value);
			t6 = space();
			div3 = element("div");
			div2 = element("div");
			t7 = text("🔴 ");
			t8 = text(t8_value);
			t9 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t10 = space();
			div5 = element("div");
			div4 = element("div");
			div4.textContent = "🚑 IMMEDIATE RESPONSE STEPS";
			t12 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t13 = space();
			attr(div0, "class", "fg-emg-title svelte-sq5a06");
			attr(div1, "class", "fg-emg-sub svelte-sq5a06");
			attr(div2, "class", "fg-emg-label svelte-sq5a06");
			attr(div3, "class", "fg-emg-section svelte-sq5a06");
			attr(div4, "class", "fg-emg-label svelte-sq5a06");
			attr(div5, "class", "fg-emg-section svelte-sq5a06");
			attr(div6, "class", "fg-emergency-card svelte-sq5a06");

			attr(div6, "style", div6_style_value = /*st*/ ctx[218]
			? `border-color:${/*st*/ ctx[218].color}`
			: '');
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div0);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			append(div0, t3);
			if (if_block) if_block.m(div0, null);
			append(div6, t4);
			append(div6, div1);
			append(div1, t5);
			append(div6, t6);
			append(div6, div3);
			append(div3, div2);
			append(div2, t7);
			append(div2, t8);
			append(div3, t9);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div3, null);
				}
			}

			append(div6, t10);
			append(div6, div5);
			append(div5, div4);
			append(div5, t12);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div5, null);
				}
			}

			append(div6, t13);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sosHazards*/ 16384 && t0_value !== (t0_value = /*hz*/ ctx[215].icon + "")) set_data(t0, t0_value);
			if (dirty[0] & /*sosHazards*/ 16384 && t2_value !== (t2_value = /*hz*/ ctx[215].title + "")) set_data(t2, t2_value);

			if (/*st*/ ctx[218]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_49(ctx);
					if_block.c();
					if_block.m(div0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*sosHazards*/ 16384 && t5_value !== (t5_value = /*hz*/ ctx[215].danger + "")) set_data(t5, t5_value);
			if (dirty[0] & /*sosHazards*/ 16384 && t8_value !== (t8_value = /*hz*/ ctx[215].signsLabel + "")) set_data(t8, t8_value);

			if (dirty[0] & /*sosHazards*/ 16384) {
				each_value_14 = ensure_array_like(/*hz*/ ctx[215].signs);
				let i;

				for (i = 0; i < each_value_14.length; i += 1) {
					const child_ctx = get_each_context_14(ctx, each_value_14, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_14(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div3, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_14.length;
			}

			if (dirty[0] & /*sosHazards*/ 16384) {
				each_value_13 = ensure_array_like(/*hz*/ ctx[215].response);
				let i;

				for (i = 0; i < each_value_13.length; i += 1) {
					const child_ctx = get_each_context_13(ctx, each_value_13, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_13(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div5, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_13.length;
			}

			if (dirty[0] & /*sosHazards*/ 16384 && div6_style_value !== (div6_style_value = /*st*/ ctx[218]
			? `border-color:${/*st*/ ctx[218].color}`
			: '')) {
				attr(div6, "style", div6_style_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div6);
			}

			if (if_block) if_block.d();
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (516:12) {#if st}
function create_if_block_49(ctx) {
	let span;
	let t_1_value = /*st*/ ctx[218].label + "";
	let t_1;

	return {
		c() {
			span = element("span");
			t_1 = text(t_1_value);
			attr(span, "class", "fg-badge svelte-sq5a06");
			set_style(span, "background", /*st*/ ctx[218].color);
			set_style(span, "margin-left", "auto");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t_1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sosHazards*/ 16384 && t_1_value !== (t_1_value = /*st*/ ctx[218].label + "")) set_data(t_1, t_1_value);

			if (dirty[0] & /*sosHazards*/ 16384) {
				set_style(span, "background", /*st*/ ctx[218].color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (522:12) {#each hz.signs as s}
function create_each_block_14(ctx) {
	let div;
	let t0;
	let t1_value = /*s*/ ctx[209] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("● ");
			t1 = text(t1_value);
			attr(div, "class", "fg-emg-item svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sosHazards*/ 16384 && t1_value !== (t1_value = /*s*/ ctx[209] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (529:12) {#each hz.response as step, i}
function create_each_block_13(ctx) {
	let div;
	let span;
	let t1;
	let t2_value = /*step*/ ctx[219] + "";
	let t2;
	let t3;
	let div_class_value;

	return {
		c() {
			div = element("div");
			span = element("span");
			span.textContent = `${/*i*/ ctx[221] + 1}`;
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			attr(span, "class", "fg-emg-num svelte-sq5a06");

			attr(div, "class", div_class_value = "fg-emg-step " + ((/SEVERE|IMMEDIATE MEDICAL|EMERGENCY MEDICAL/).test(/*step*/ ctx[219])
			? 'fg-emg-critical'
			: '') + " svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span);
			append(div, t1);
			append(div, t2);
			append(div, t3);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sosHazards*/ 16384 && t2_value !== (t2_value = /*step*/ ctx[219] + "")) set_data(t2, t2_value);

			if (dirty[0] & /*sosHazards*/ 16384 && div_class_value !== (div_class_value = "fg-emg-step " + ((/SEVERE|IMMEDIATE MEDICAL|EMERGENCY MEDICAL/).test(/*step*/ ctx[219])
			? 'fg-emg-critical'
			: '') + " svelte-sq5a06")) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (510:4) {#each sosHazards as hz}
function create_each_block_12(ctx) {
	let if_block_anchor;
	let if_block = /*emgHazard*/ ctx[6] === /*hz*/ ctx[215].key && create_if_block_48(get_if_ctx(ctx));

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
			if (/*emgHazard*/ ctx[6] === /*hz*/ ctx[215].key) {
				if (if_block) {
					if_block.p(get_if_ctx(ctx), dirty);
				} else {
					if_block = create_if_block_48(get_if_ctx(ctx));
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
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

// (542:8) {#if alertLog.length > 0}
function create_if_block_46(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "CSV";
			attr(button, "class", "fg-mini-btn svelte-sq5a06");
			set_style(button, "margin-left", "auto");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*downloadCSV*/ ctx[85]);
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

// (546:6) {:else}
function create_else_block_10(ctx) {
	let each_1_anchor;
	let each_value_11 = ensure_array_like([.../*alertLog*/ ctx[38]].reverse().slice(0, 15));
	let each_blocks = [];

	for (let i = 0; i < each_value_11.length; i += 1) {
		each_blocks[i] = create_each_block_11(get_each_context_11(ctx, each_value_11, i));
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
			if (dirty[1] & /*alertLog*/ 128) {
				each_value_11 = ensure_array_like([.../*alertLog*/ ctx[38]].reverse().slice(0, 15));
				let i;

				for (i = 0; i < each_value_11.length; i += 1) {
					const child_ctx = get_each_context_11(ctx, each_value_11, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_11(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_11.length;
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

// (544:6) {#if alertLog.length === 0}
function create_if_block_45(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "No alerts triggered yet.";
			attr(div, "class", "fg-empty svelte-sq5a06");
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

// (547:8) {#each [...alertLog].reverse().slice(0, 15) as alert}
function create_each_block_11(ctx) {
	let div3;
	let div0;
	let t0_value = /*alert*/ ctx[212].time + "";
	let t0;
	let t1;
	let div1;
	let t2_value = /*alert*/ ctx[212].type + "";
	let t2;
	let t3;
	let div2;
	let t4_value = /*alert*/ ctx[212].message + "";
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
			attr(div0, "class", "fg-alert-time svelte-sq5a06");
			attr(div1, "class", "fg-alert-type svelte-sq5a06");
			attr(div2, "class", "fg-alert-msg svelte-sq5a06");
			attr(div3, "class", "fg-alert-item svelte-sq5a06");
			set_style(div3, "border-left", "3px solid " + /*alert*/ ctx[212].color);
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
			if (dirty[1] & /*alertLog*/ 128 && t0_value !== (t0_value = /*alert*/ ctx[212].time + "")) set_data(t0, t0_value);
			if (dirty[1] & /*alertLog*/ 128 && t2_value !== (t2_value = /*alert*/ ctx[212].type + "")) set_data(t2, t2_value);
			if (dirty[1] & /*alertLog*/ 128 && t4_value !== (t4_value = /*alert*/ ctx[212].message + "")) set_data(t4, t4_value);

			if (dirty[1] & /*alertLog*/ 128) {
				set_style(div3, "border-left", "3px solid " + /*alert*/ ctx[212].color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}
		}
	};
}

// (45:8) {:else}
function create_else_block_8(ctx) {
	let button;
	let span0;
	let t0_value = /*s*/ ctx[209].name + "";
	let t0;
	let span1;
	let button_class_value;
	let mounted;
	let dispose;

	function click_handler_3() {
		return /*click_handler_3*/ ctx[92](/*s*/ ctx[209]);
	}

	function click_handler_4() {
		return /*click_handler_4*/ ctx[93](/*s*/ ctx[209]);
	}

	function dblclick_handler() {
		return /*dblclick_handler*/ ctx[94](/*s*/ ctx[209]);
	}

	return {
		c() {
			button = element("button");
			span0 = element("span");
			t0 = text(t0_value);
			span1 = element("span");
			span1.textContent = "×";
			attr(span0, "class", "fg-site-dot svelte-sq5a06");
			set_style(span0, "background", /*bgStatus*/ ctx[50][/*s*/ ctx[209].id]?.color || '#475569');
			attr(span1, "class", "fg-site-x svelte-sq5a06");
			attr(span1, "title", "Remove");

			attr(button, "class", button_class_value = "fg-site-chip " + (/*s*/ ctx[209].id === /*activeSiteId*/ ctx[11]
			? 'active'
			: '') + " svelte-sq5a06");

			attr(button, "title", "Click to view · double-click to rename");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, span0);
			append(button, t0);
			append(button, span1);

			if (!mounted) {
				dispose = [
					listen(span1, "click", stop_propagation(click_handler_3)),
					listen(button, "click", click_handler_4),
					listen(button, "dblclick", dblclick_handler)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*savedSites*/ 1024 | dirty[1] & /*bgStatus*/ 524288) {
				set_style(span0, "background", /*bgStatus*/ ctx[50][/*s*/ ctx[209].id]?.color || '#475569');
			}

			if (dirty[0] & /*savedSites*/ 1024 && t0_value !== (t0_value = /*s*/ ctx[209].name + "")) set_data(t0, t0_value);

			if (dirty[0] & /*savedSites, activeSiteId*/ 3072 && button_class_value !== (button_class_value = "fg-site-chip " + (/*s*/ ctx[209].id === /*activeSiteId*/ ctx[11]
			? 'active'
			: '') + " svelte-sq5a06")) {
				attr(button, "class", button_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (41:8) {#if editingSiteId === s.id}
function create_if_block_42(ctx) {
	let input;
	let mounted;
	let dispose;

	return {
		c() {
			input = element("input");
			attr(input, "class", "fg-site-name svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, /*editName*/ ctx[47]);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[90]),
					action_destroyer(focusInput.call(null, input)),
					listen(input, "keydown", /*keydown_handler*/ ctx[91]),
					listen(input, "blur", /*commitRename*/ ctx[82])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[1] & /*editName*/ 65536 && input.value !== /*editName*/ ctx[47]) {
				set_input_value(input, /*editName*/ ctx[47]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(input);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (40:6) {#each savedSites as s}
function create_each_block_10(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*editingSiteId*/ ctx[46] === /*s*/ ctx[209].id) return create_if_block_42;
		return create_else_block_8;
	}

	let current_block_type = select_block_type_1(ctx);
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
			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
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

// (58:6) {:else}
function create_else_block_7(ctx) {
	let a;

	return {
		c() {
			a = element("a");
			a.textContent = "＋ Save more sites — Pro";
			attr(a, "class", "fg-site-locked svelte-sq5a06");
			attr(a, "href", "https://fieldguard-hse.com");
			attr(a, "target", "_blank");
		},
		m(target, anchor) {
			insert(target, a, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(a);
			}
		}
	};
}

// (56:22) 
function create_if_block_41(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = `Max ${/*maxSites*/ ctx[60]()} sites on this licence`;
			attr(span, "class", "fg-site-max svelte-sq5a06");
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

// (51:6) {#if canAddMore}
function create_if_block_40(ctx) {
	let input0;
	let t0;
	let button0;
	let t2;
	let input1;
	let t3;
	let button1;
	let mounted;
	let dispose;

	return {
		c() {
			input0 = element("input");
			t0 = space();
			button0 = element("button");
			button0.textContent = "＋ Save pin";
			t2 = space();
			input1 = element("input");
			t3 = space();
			button1 = element("button");
			button1.textContent = "＋ Coords";
			attr(input0, "class", "fg-site-name svelte-sq5a06");
			attr(input0, "placeholder", "Name…");
			attr(button0, "class", "fg-site-add svelte-sq5a06");
			attr(button0, "title", "Save current pin as a site");
			attr(input1, "class", "fg-site-name svelte-sq5a06");
			attr(input1, "placeholder", "lat, lon");
			attr(button1, "class", "fg-site-add svelte-sq5a06");
			attr(button1, "title", "Add a site by exact coordinates");
		},
		m(target, anchor) {
			insert(target, input0, anchor);
			set_input_value(input0, /*newSiteName*/ ctx[44]);
			insert(target, t0, anchor);
			insert(target, button0, anchor);
			insert(target, t2, anchor);
			insert(target, input1, anchor);
			set_input_value(input1, /*coordInput*/ ctx[45]);
			insert(target, t3, anchor);
			insert(target, button1, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[95]),
					listen(button0, "click", /*addCurrentSite*/ ctx[79]),
					listen(input1, "input", /*input1_input_handler*/ ctx[96]),
					listen(input1, "keydown", /*keydown_handler_1*/ ctx[97]),
					listen(button1, "click", /*addSiteByCoords*/ ctx[80])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[1] & /*newSiteName*/ 8192 && input0.value !== /*newSiteName*/ ctx[44]) {
				set_input_value(input0, /*newSiteName*/ ctx[44]);
			}

			if (dirty[1] & /*coordInput*/ 16384 && input1.value !== /*coordInput*/ ctx[45]) {
				set_input_value(input1, /*coordInput*/ ctx[45]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(input0);
				detach(t0);
				detach(button0);
				detach(t2);
				detach(input1);
				detach(t3);
				detach(button1);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (63:4) {#if isStale}
function create_if_block_39(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚠ Offline — showing last saved reading from ");
			t1 = text(/*staleTime*/ ctx[49]);
			attr(div, "class", "fg-stale svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[1] & /*staleTime*/ 262144) set_data(t1, /*staleTime*/ ctx[49]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (70:8) {#each MODELS as m}
function create_each_block_9(ctx) {
	let option;
	let t_1_value = /*m*/ ctx[206].label + "";
	let t_1;

	return {
		c() {
			option = element("option");
			t_1 = text(t_1_value);
			option.__value = /*m*/ ctx[206].key;
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

// (74:20) {#if !isPro}
function create_if_block_38(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "PRO";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
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

// (82:19) 
function create_if_block_3(ctx) {
	let t0;
	let div12;
	let button0;
	let div0;
	let t2;
	let div1;
	let t3_value = fmtTemp(/*rawData*/ ctx[23]?.tempC ?? 0, /*units*/ ctx[53], false) + "";
	let t3;
	let span0;
	let t5;
	let div2;
	let t6_value = (/*tempStatus*/ ctx[55]?.label || /*heat*/ ctx[3].zoneInfo.riskLabel) + "";
	let t6;
	let button0_class_value;
	let t7;
	let button1;
	let div3;
	let t9;
	let div4;
	let t10_value = fmtWind(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53], false) + "";
	let t10;
	let span1;
	let t11_value = (/*units*/ ctx[53] === 'imperial' ? 'mph' : 'm/s') + "";
	let t11;
	let t12;
	let div5;
	let t13_value = /*windResult*/ ctx[24]?.riskLabel + "";
	let t13;
	let button1_class_value;
	let t14;
	let button2;
	let div6;
	let t16;
	let div7;
	let t17_value = fmtRain(/*rawData*/ ctx[23]?.rainMmH ?? 0, /*units*/ ctx[53], false) + "";
	let t17;
	let span2;
	let t18_value = (/*units*/ ctx[53] === 'imperial' ? 'in' : 'mm') + "";
	let t18;
	let t19;
	let div8;
	let t20_value = /*rainResult*/ ctx[25]?.riskLabel + "";
	let t20;
	let button2_class_value;
	let t21;
	let button3;
	let div9;
	let t23;
	let div10;
	let t24_value = (/*rawData*/ ctx[23]?.solarWm2 ?? 0) + "";
	let t24;
	let span3;
	let t26;
	let div11;
	let t27_value = solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).label + "";
	let t27;
	let button3_class_value;
	let t28;
	let div13;
	let t29;
	let b;

	let t30_value = (/*selectedHazard*/ ctx[5] === 'wind'
	? 'Wind'
	: /*selectedHazard*/ ctx[5] === 'rain'
		? 'Rain, thunder'
		: /*selectedHazard*/ ctx[5] === 'solar'
			? 'Clouds'
			: 'Temperature') + "";

	let t30;
	let t31;
	let t32;
	let t33;
	let t34;
	let t35;
	let t36;
	let if_block6_anchor;
	let mounted;
	let dispose;

	function select_block_type_4(ctx, dirty) {
		if (/*heat*/ ctx[3].isBanPeriod && /*activeBan*/ ctx[22]) return create_if_block_36;
		if (/*activeBan*/ ctx[22]) return create_if_block_37;
	}

	let current_block_type = select_block_type_4(ctx);
	let if_block0 = current_block_type && current_block_type(ctx);
	let if_block1 = /*selectedHazard*/ ctx[5] === 'rain' && create_if_block_35();
	let if_block2 = /*isSite*/ ctx[52] && /*settings*/ ctx[12].forecastAlerts && create_if_block_32(ctx);

	function select_block_type_6(ctx, dirty) {
		if (/*selectedHazard*/ ctx[5] === 'heat') return create_if_block_16;
		if (/*selectedHazard*/ ctx[5] === 'wind') return create_if_block_26;
		if (/*selectedHazard*/ ctx[5] === 'rain') return create_if_block_28;
		if (/*selectedHazard*/ ctx[5] === 'solar') return create_if_block_30;
	}

	let current_block_type_1 = select_block_type_6(ctx);
	let if_block3 = current_block_type_1 && current_block_type_1(ctx);
	let if_block4 = /*selectedHazard*/ ctx[5] === 'rain' && /*isPro*/ ctx[13] && /*thunderResult*/ ctx[26] && create_if_block_13(ctx);
	let if_block5 = /*selectedHazard*/ ctx[5] === 'rain' && /*isSite*/ ctx[52] && /*settings*/ ctx[12].monitorHazards.lightning && create_if_block_8(ctx);
	let if_block6 = /*worstCaseMode*/ ctx[9] && /*modelResults*/ ctx[7].length > 1 && create_if_block_4(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			div12 = element("div");
			button0 = element("button");
			div0 = element("div");
			div0.textContent = "🌡️";
			t2 = space();
			div1 = element("div");
			t3 = text(t3_value);
			span0 = element("span");
			span0.textContent = "°";
			t5 = space();
			div2 = element("div");
			t6 = text(t6_value);
			t7 = space();
			button1 = element("button");
			div3 = element("div");
			div3.textContent = "💨";
			t9 = space();
			div4 = element("div");
			t10 = text(t10_value);
			span1 = element("span");
			t11 = text(t11_value);
			t12 = space();
			div5 = element("div");
			t13 = text(t13_value);
			t14 = space();
			button2 = element("button");
			div6 = element("div");
			div6.textContent = "🌧️";
			t16 = space();
			div7 = element("div");
			t17 = text(t17_value);
			span2 = element("span");
			t18 = text(t18_value);
			t19 = space();
			div8 = element("div");
			t20 = text(t20_value);
			t21 = space();
			button3 = element("button");
			div9 = element("div");
			div9.textContent = "☀️";
			t23 = space();
			div10 = element("div");
			t24 = text(t24_value);
			span3 = element("span");
			span3.textContent = "W";
			t26 = space();
			div11 = element("div");
			t27 = text(t27_value);
			t28 = space();
			div13 = element("div");
			t29 = text("🗺️ See it across the map: open Windy's overlay menu (the layers icon) and pick\r\n        ");
			b = element("b");
			t30 = text(t30_value);
			if (if_block1) if_block1.c();
			t31 = text(".");
			t32 = space();
			if (if_block2) if_block2.c();
			t33 = space();
			if (if_block3) if_block3.c();
			t34 = space();
			if (if_block4) if_block4.c();
			t35 = space();
			if (if_block5) if_block5.c();
			t36 = space();
			if (if_block6) if_block6.c();
			if_block6_anchor = empty();
			attr(div0, "class", "fg-hz-ic svelte-sq5a06");
			attr(span0, "class", "fg-hz-u svelte-sq5a06");
			attr(div1, "class", "fg-hz-val svelte-sq5a06");
			attr(div2, "class", "fg-hz-st svelte-sq5a06");
			set_style(div2, "color", /*tempStatus*/ ctx[55]?.color || /*heat*/ ctx[3].zoneInfo.color);
			attr(button0, "class", button0_class_value = "fg-hz " + (/*selectedHazard*/ ctx[5] === 'heat' ? 'sel' : '') + " svelte-sq5a06");
			set_style(button0, "border-color", /*tempStatus*/ ctx[55]?.color || /*heat*/ ctx[3].zoneInfo.color);
			attr(div3, "class", "fg-hz-ic svelte-sq5a06");
			attr(span1, "class", "fg-hz-u svelte-sq5a06");
			attr(div4, "class", "fg-hz-val svelte-sq5a06");
			attr(div5, "class", "fg-hz-st svelte-sq5a06");
			set_style(div5, "color", /*windResult*/ ctx[24]?.riskColor);
			attr(button1, "class", button1_class_value = "fg-hz " + (/*selectedHazard*/ ctx[5] === 'wind' ? 'sel' : '') + " svelte-sq5a06");
			set_style(button1, "border-color", /*windResult*/ ctx[24]?.riskColor);
			attr(div6, "class", "fg-hz-ic svelte-sq5a06");
			attr(span2, "class", "fg-hz-u svelte-sq5a06");
			attr(div7, "class", "fg-hz-val svelte-sq5a06");
			attr(div8, "class", "fg-hz-st svelte-sq5a06");
			set_style(div8, "color", /*rainResult*/ ctx[25]?.riskColor);
			attr(button2, "class", button2_class_value = "fg-hz " + (/*selectedHazard*/ ctx[5] === 'rain' ? 'sel' : '') + " svelte-sq5a06");
			set_style(button2, "border-color", /*rainResult*/ ctx[25]?.riskColor);
			attr(div9, "class", "fg-hz-ic svelte-sq5a06");
			attr(span3, "class", "fg-hz-u svelte-sq5a06");
			attr(div10, "class", "fg-hz-val svelte-sq5a06");
			attr(div11, "class", "fg-hz-st svelte-sq5a06");
			set_style(div11, "color", solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
			attr(button3, "class", button3_class_value = "fg-hz " + (/*selectedHazard*/ ctx[5] === 'solar' ? 'sel' : '') + " svelte-sq5a06");
			set_style(button3, "border-color", solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
			attr(div12, "class", "fg-hazard-strip svelte-sq5a06");
			attr(b, "class", "svelte-sq5a06");
			attr(div13, "class", "fg-overlay-hint svelte-sq5a06");
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			insert(target, div12, anchor);
			append(div12, button0);
			append(button0, div0);
			append(button0, t2);
			append(button0, div1);
			append(div1, t3);
			append(div1, span0);
			append(button0, t5);
			append(button0, div2);
			append(div2, t6);
			append(div12, t7);
			append(div12, button1);
			append(button1, div3);
			append(button1, t9);
			append(button1, div4);
			append(div4, t10);
			append(div4, span1);
			append(span1, t11);
			append(button1, t12);
			append(button1, div5);
			append(div5, t13);
			append(div12, t14);
			append(div12, button2);
			append(button2, div6);
			append(button2, t16);
			append(button2, div7);
			append(div7, t17);
			append(div7, span2);
			append(span2, t18);
			append(button2, t19);
			append(button2, div8);
			append(div8, t20);
			append(div12, t21);
			append(div12, button3);
			append(button3, div9);
			append(button3, t23);
			append(button3, div10);
			append(div10, t24);
			append(div10, span3);
			append(button3, t26);
			append(button3, div11);
			append(div11, t27);
			insert(target, t28, anchor);
			insert(target, div13, anchor);
			append(div13, t29);
			append(div13, b);
			append(b, t30);
			if (if_block1) if_block1.m(div13, null);
			append(div13, t31);
			insert(target, t32, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert(target, t33, anchor);
			if (if_block3) if_block3.m(target, anchor);
			insert(target, t34, anchor);
			if (if_block4) if_block4.m(target, anchor);
			insert(target, t35, anchor);
			if (if_block5) if_block5.m(target, anchor);
			insert(target, t36, anchor);
			if (if_block6) if_block6.m(target, anchor);
			insert(target, if_block6_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_5*/ ctx[100]),
					listen(button1, "click", /*click_handler_6*/ ctx[101]),
					listen(button2, "click", /*click_handler_7*/ ctx[102]),
					listen(button3, "click", /*click_handler_8*/ ctx[103])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if (if_block0) if_block0.d(1);
				if_block0 = current_block_type && current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			}

			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t3_value !== (t3_value = fmtTemp(/*rawData*/ ctx[23]?.tempC ?? 0, /*units*/ ctx[53], false) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*tempStatus*/ 16777216 && t6_value !== (t6_value = (/*tempStatus*/ ctx[55]?.label || /*heat*/ ctx[3].zoneInfo.riskLabel) + "")) set_data(t6, t6_value);

			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*tempStatus*/ 16777216) {
				set_style(div2, "color", /*tempStatus*/ ctx[55]?.color || /*heat*/ ctx[3].zoneInfo.color);
			}

			if (dirty[0] & /*selectedHazard*/ 32 && button0_class_value !== (button0_class_value = "fg-hz " + (/*selectedHazard*/ ctx[5] === 'heat' ? 'sel' : '') + " svelte-sq5a06")) {
				attr(button0, "class", button0_class_value);
			}

			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*tempStatus*/ 16777216) {
				set_style(button0, "border-color", /*tempStatus*/ ctx[55]?.color || /*heat*/ ctx[3].zoneInfo.color);
			}

			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t10_value !== (t10_value = fmtWind(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53], false) + "")) set_data(t10, t10_value);
			if (dirty[1] & /*units*/ 4194304 && t11_value !== (t11_value = (/*units*/ ctx[53] === 'imperial' ? 'mph' : 'm/s') + "")) set_data(t11, t11_value);
			if (dirty[0] & /*windResult*/ 16777216 && t13_value !== (t13_value = /*windResult*/ ctx[24]?.riskLabel + "")) set_data(t13, t13_value);

			if (dirty[0] & /*windResult*/ 16777216) {
				set_style(div5, "color", /*windResult*/ ctx[24]?.riskColor);
			}

			if (dirty[0] & /*selectedHazard*/ 32 && button1_class_value !== (button1_class_value = "fg-hz " + (/*selectedHazard*/ ctx[5] === 'wind' ? 'sel' : '') + " svelte-sq5a06")) {
				attr(button1, "class", button1_class_value);
			}

			if (dirty[0] & /*windResult*/ 16777216) {
				set_style(button1, "border-color", /*windResult*/ ctx[24]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t17_value !== (t17_value = fmtRain(/*rawData*/ ctx[23]?.rainMmH ?? 0, /*units*/ ctx[53], false) + "")) set_data(t17, t17_value);
			if (dirty[1] & /*units*/ 4194304 && t18_value !== (t18_value = (/*units*/ ctx[53] === 'imperial' ? 'in' : 'mm') + "")) set_data(t18, t18_value);
			if (dirty[0] & /*rainResult*/ 33554432 && t20_value !== (t20_value = /*rainResult*/ ctx[25]?.riskLabel + "")) set_data(t20, t20_value);

			if (dirty[0] & /*rainResult*/ 33554432) {
				set_style(div8, "color", /*rainResult*/ ctx[25]?.riskColor);
			}

			if (dirty[0] & /*selectedHazard*/ 32 && button2_class_value !== (button2_class_value = "fg-hz " + (/*selectedHazard*/ ctx[5] === 'rain' ? 'sel' : '') + " svelte-sq5a06")) {
				attr(button2, "class", button2_class_value);
			}

			if (dirty[0] & /*rainResult*/ 33554432) {
				set_style(button2, "border-color", /*rainResult*/ ctx[25]?.riskColor);
			}

			if (dirty[0] & /*rawData*/ 8388608 && t24_value !== (t24_value = (/*rawData*/ ctx[23]?.solarWm2 ?? 0) + "")) set_data(t24, t24_value);
			if (dirty[0] & /*rawData, isDay*/ 9437184 && t27_value !== (t27_value = solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).label + "")) set_data(t27, t27_value);

			if (dirty[0] & /*rawData, isDay*/ 9437184) {
				set_style(div11, "color", solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
			}

			if (dirty[0] & /*selectedHazard*/ 32 && button3_class_value !== (button3_class_value = "fg-hz " + (/*selectedHazard*/ ctx[5] === 'solar' ? 'sel' : '') + " svelte-sq5a06")) {
				attr(button3, "class", button3_class_value);
			}

			if (dirty[0] & /*rawData, isDay*/ 9437184) {
				set_style(button3, "border-color", solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
			}

			if (dirty[0] & /*selectedHazard*/ 32 && t30_value !== (t30_value = (/*selectedHazard*/ ctx[5] === 'wind'
			? 'Wind'
			: /*selectedHazard*/ ctx[5] === 'rain'
				? 'Rain, thunder'
				: /*selectedHazard*/ ctx[5] === 'solar'
					? 'Clouds'
					: 'Temperature') + "")) set_data(t30, t30_value);

			if (/*selectedHazard*/ ctx[5] === 'rain') {
				if (if_block1) ; else {
					if_block1 = create_if_block_35();
					if_block1.c();
					if_block1.m(div13, t31);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*isSite*/ ctx[52] && /*settings*/ ctx[12].forecastAlerts) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_32(ctx);
					if_block2.c();
					if_block2.m(t33.parentNode, t33);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_6(ctx)) && if_block3) {
				if_block3.p(ctx, dirty);
			} else {
				if (if_block3) if_block3.d(1);
				if_block3 = current_block_type_1 && current_block_type_1(ctx);

				if (if_block3) {
					if_block3.c();
					if_block3.m(t34.parentNode, t34);
				}
			}

			if (/*selectedHazard*/ ctx[5] === 'rain' && /*isPro*/ ctx[13] && /*thunderResult*/ ctx[26]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);
				} else {
					if_block4 = create_if_block_13(ctx);
					if_block4.c();
					if_block4.m(t35.parentNode, t35);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (/*selectedHazard*/ ctx[5] === 'rain' && /*isSite*/ ctx[52] && /*settings*/ ctx[12].monitorHazards.lightning) {
				if (if_block5) {
					if_block5.p(ctx, dirty);
				} else {
					if_block5 = create_if_block_8(ctx);
					if_block5.c();
					if_block5.m(t36.parentNode, t36);
				}
			} else if (if_block5) {
				if_block5.d(1);
				if_block5 = null;
			}

			if (/*worstCaseMode*/ ctx[9] && /*modelResults*/ ctx[7].length > 1) {
				if (if_block6) {
					if_block6.p(ctx, dirty);
				} else {
					if_block6 = create_if_block_4(ctx);
					if_block6.c();
					if_block6.m(if_block6_anchor.parentNode, if_block6_anchor);
				}
			} else if (if_block6) {
				if_block6.d(1);
				if_block6 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(div12);
				detach(t28);
				detach(div13);
				detach(t32);
				detach(t33);
				detach(t34);
				detach(t35);
				detach(t36);
				detach(if_block6_anchor);
			}

			if (if_block0) {
				if_block0.d(detaching);
			}

			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d(detaching);

			if (if_block3) {
				if_block3.d(detaching);
			}

			if (if_block4) if_block4.d(detaching);
			if (if_block5) if_block5.d(detaching);
			if (if_block6) if_block6.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (80:20) 
function create_if_block_2(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚠ ");
			t1 = text(/*error*/ ctx[17]);
			attr(div, "class", "fg-error svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*error*/ 131072) set_data(t1, /*error*/ ctx[17]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (78:4) {#if loading}
function create_if_block_1(ctx) {
	let div;
	let t0;

	let t1_value = (/*worstCaseMode*/ ctx[9]
	? 'all models'
	: /*selectedModel*/ ctx[37]) + "";

	let t1;
	let t2;

	return {
		c() {
			div = element("div");
			t0 = text("⏳ Fetching ");
			t1 = text(t1_value);
			t2 = text("…");
			attr(div, "class", "fg-loading svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, t2);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*worstCaseMode*/ 512 | dirty[1] & /*selectedModel*/ 64 && t1_value !== (t1_value = (/*worstCaseMode*/ ctx[9]
			? 'all models'
			: /*selectedModel*/ ctx[37]) + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (90:26) 
function create_if_block_37(ctx) {
	let div;
	let t0;
	let t1_value = /*activeBan*/ ctx[22].country + "";
	let t1;
	let t2;
	let t3_value = /*activeBan*/ ctx[22].label + "";
	let t3;

	return {
		c() {
			div = element("div");
			t0 = text("ℹ ");
			t1 = text(t1_value);
			t2 = text(" statutory midday work ban: ");
			t3 = text(t3_value);
			attr(div, "class", "fg-ban-info svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, t2);
			append(div, t3);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*activeBan*/ 4194304 && t1_value !== (t1_value = /*activeBan*/ ctx[22].country + "")) set_data(t1, t1_value);
			if (dirty[0] & /*activeBan*/ 4194304 && t3_value !== (t3_value = /*activeBan*/ ctx[22].label + "")) set_data(t3, t3_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (85:6) {#if heat.isBanPeriod && activeBan}
function create_if_block_36(ctx) {
	let div;
	let t0;
	let t1_value = /*activeBan*/ ctx[22].country + "";
	let t1;
	let t2;
	let t3_value = /*activeBan*/ ctx[22].label + "";
	let t3;
	let br;
	let t4;
	let small;

	return {
		c() {
			div = element("div");
			t0 = text("🚫 LEGAL WORK BAN (");
			t1 = text(t1_value);
			t2 = text(") — ");
			t3 = text(t3_value);
			br = element("br");
			t4 = space();
			small = element("small");
			small.textContent = "Outdoor work prohibited now — workers must be in a shaded / A/C environment";
			attr(small, "class", "svelte-sq5a06");
			attr(div, "class", "fg-ban-alert svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, t2);
			append(div, t3);
			append(div, br);
			append(div, t4);
			append(div, small);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*activeBan*/ 4194304 && t1_value !== (t1_value = /*activeBan*/ ctx[22].country + "")) set_data(t1, t1_value);
			if (dirty[0] & /*activeBan*/ 4194304 && t3_value !== (t3_value = /*activeBan*/ ctx[22].label + "")) set_data(t3, t3_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (122:153) {#if selectedHazard === 'rain'}
function create_if_block_35(ctx) {
	let t0;
	let b0;
	let t2;
	let b1;
	let t4;

	return {
		c() {
			t0 = text("— or ");
			b0 = element("b");
			b0.textContent = "Radar";
			t2 = text(" / ");
			b1 = element("b");
			b1.textContent = "Satellite";
			t4 = text(" for live storm cells");
			attr(b0, "class", "svelte-sq5a06");
			attr(b1, "class", "svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, b0, anchor);
			insert(target, t2, anchor);
			insert(target, b1, anchor);
			insert(target, t4, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(b0);
				detach(t2);
				detach(b1);
				detach(t4);
			}
		}
	};
}

// (126:6) {#if isSite && settings.forecastAlerts}
function create_if_block_32(ctx) {
	let div1;
	let div0;
	let t0;
	let t1_value = /*horizonLabel*/ ctx[63]() + "";
	let t1;
	let t2;
	let t3;
	let if_block0 = /*forecastBusy*/ ctx[30] && create_if_block_34();

	function select_block_type_5(ctx, dirty) {
		if (/*forecastList*/ ctx[29].length === 0) return create_if_block_33;
		return create_else_block_6;
	}

	let current_block_type = select_block_type_5(ctx);
	let if_block1 = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text("⏱ Forecast Watch — next ");
			t1 = text(t1_value);
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			if_block1.c();
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(div1, "class", "fg-card fg-forecast svelte-sq5a06");
			set_style(div1, "border-color", /*forecastList*/ ctx[29][0]?.peakColor || '#334155');
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			if (if_block0) if_block0.m(div0, null);
			append(div1, t3);
			if_block1.m(div1, null);
		},
		p(ctx, dirty) {
			if (/*forecastBusy*/ ctx[30]) {
				if (if_block0) ; else {
					if_block0 = create_if_block_34();
					if_block0.c();
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_5(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div1, null);
				}
			}

			if (dirty[0] & /*forecastList*/ 536870912) {
				set_style(div1, "border-color", /*forecastList*/ ctx[29][0]?.peakColor || '#334155');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			if (if_block0) if_block0.d();
			if_block1.d();
		}
	};
}

// (129:12) {#if forecastBusy}
function create_if_block_34(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "scanning…";
			attr(span, "class", "fg-fc-busy svelte-sq5a06");
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

// (133:10) {:else}
function create_else_block_6(ctx) {
	let each_1_anchor;
	let each_value_8 = ensure_array_like(/*forecastList*/ ctx[29]);
	let each_blocks = [];

	for (let i = 0; i < each_value_8.length; i += 1) {
		each_blocks[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
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
			if (dirty[0] & /*forecastList*/ 536870912) {
				each_value_8 = ensure_array_like(/*forecastList*/ ctx[29]);
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
				detach(each_1_anchor);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (131:10) {#if forecastList.length === 0}
function create_if_block_33(ctx) {
	let div;
	let t_1_value = (/*forecastNote*/ ctx[31] || '✓ No threshold crossings forecast.') + "";
	let t_1;

	return {
		c() {
			div = element("div");
			t_1 = text(t_1_value);
			attr(div, "class", "fg-empty svelte-sq5a06");
			set_style(div, "padding", "8px 12px");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t_1);
		},
		p(ctx, dirty) {
			if (dirty[1] & /*forecastNote*/ 1 && t_1_value !== (t_1_value = (/*forecastNote*/ ctx[31] || '✓ No threshold crossings forecast.') + "")) set_data(t_1, t_1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (134:12) {#each forecastList as f}
function create_each_block_8(ctx) {
	let div;
	let span0;
	let t0_value = /*f*/ ctx[203].icon + "";
	let t0;
	let t1;
	let span1;
	let t2_value = /*f*/ ctx[203].label + "";
	let t2;
	let t3;
	let span2;
	let t4_value = /*f*/ ctx[203].peakLabel + "";
	let t4;
	let t5;
	let span3;

	let t6_value = (/*f*/ ctx[203].hoursAway === 0
	? 'within 1 h'
	: `in ~${/*f*/ ctx[203].hoursAway} h`) + "";

	let t6;
	let br;
	let small;
	let t7_value = /*f*/ ctx[203].firstLocal + "";
	let t7;
	let t8;

	return {
		c() {
			div = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			span2 = element("span");
			t4 = text(t4_value);
			t5 = space();
			span3 = element("span");
			t6 = text(t6_value);
			br = element("br");
			small = element("small");
			t7 = text(t7_value);
			t8 = space();
			attr(span0, "class", "fg-fc-ic svelte-sq5a06");
			attr(span1, "class", "fg-fc-name svelte-sq5a06");
			attr(span2, "class", "fg-fc-badge svelte-sq5a06");
			set_style(span2, "background", /*f*/ ctx[203].peakColor);
			attr(small, "class", "svelte-sq5a06");
			attr(span3, "class", "fg-fc-when svelte-sq5a06");
			attr(div, "class", "fg-fc-row svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(span0, t0);
			append(div, t1);
			append(div, span1);
			append(span1, t2);
			append(div, t3);
			append(div, span2);
			append(span2, t4);
			append(div, t5);
			append(div, span3);
			append(span3, t6);
			append(span3, br);
			append(span3, small);
			append(small, t7);
			append(div, t8);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*forecastList*/ 536870912 && t0_value !== (t0_value = /*f*/ ctx[203].icon + "")) set_data(t0, t0_value);
			if (dirty[0] & /*forecastList*/ 536870912 && t2_value !== (t2_value = /*f*/ ctx[203].label + "")) set_data(t2, t2_value);
			if (dirty[0] & /*forecastList*/ 536870912 && t4_value !== (t4_value = /*f*/ ctx[203].peakLabel + "")) set_data(t4, t4_value);

			if (dirty[0] & /*forecastList*/ 536870912) {
				set_style(span2, "background", /*f*/ ctx[203].peakColor);
			}

			if (dirty[0] & /*forecastList*/ 536870912 && t6_value !== (t6_value = (/*f*/ ctx[203].hoursAway === 0
			? 'within 1 h'
			: `in ~${/*f*/ ctx[203].hoursAway} h`) + "")) set_data(t6, t6_value);

			if (dirty[0] & /*forecastList*/ 536870912 && t7_value !== (t7_value = /*f*/ ctx[203].firstLocal + "")) set_data(t7, t7_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (338:43) 
function create_if_block_30(ctx) {
	let div1;
	let div0;
	let t0;
	let span;
	let t1_value = solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).label + "";
	let t1;
	let t2;

	function select_block_type_10(ctx, dirty) {
		if (/*isPro*/ ctx[13]) return create_if_block_31;
		return create_else_block_5;
	}

	let current_block_type = select_block_type_10(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text("☀ Solar Radiation\r\n          ");
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			if_block.c();
			attr(span, "class", "fg-badge svelte-sq5a06");
			set_style(span, "background", solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(div1, "class", "fg-card svelte-sq5a06");
			set_style(div1, "border-color", solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div0, span);
			append(span, t1);
			append(div1, t2);
			if_block.m(div1, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData, isDay*/ 9437184 && t1_value !== (t1_value = solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).label + "")) set_data(t1, t1_value);

			if (dirty[0] & /*rawData, isDay*/ 9437184) {
				set_style(span, "background", solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
			}

			if (current_block_type === (current_block_type = select_block_type_10(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (dirty[0] & /*rawData, isDay*/ 9437184) {
				set_style(div1, "border-color", solarBand(/*rawData*/ ctx[23]?.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
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

// (306:42) 
function create_if_block_28(ctx) {
	let div1;
	let div0;
	let t0;
	let span;
	let t1_value = /*rainResult*/ ctx[25]?.riskLabel + "";
	let t1;
	let t2;

	function select_block_type_9(ctx, dirty) {
		if (/*isPro*/ ctx[13]) return create_if_block_29;
		return create_else_block_4;
	}

	let current_block_type = select_block_type_9(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text("🌧 Rain\r\n          ");
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			if_block.c();
			attr(span, "class", "fg-badge svelte-sq5a06");
			set_style(span, "background", /*rainResult*/ ctx[25]?.riskColor);
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(div1, "class", "fg-card svelte-sq5a06");
			set_style(div1, "border-color", /*rainResult*/ ctx[25]?.riskColor);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div0, span);
			append(span, t1);
			append(div1, t2);
			if_block.m(div1, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rainResult*/ 33554432 && t1_value !== (t1_value = /*rainResult*/ ctx[25]?.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*rainResult*/ 33554432) {
				set_style(span, "background", /*rainResult*/ ctx[25]?.riskColor);
			}

			if (current_block_type === (current_block_type = select_block_type_9(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (dirty[0] & /*rainResult*/ 33554432) {
				set_style(div1, "border-color", /*rainResult*/ ctx[25]?.riskColor);
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

// (270:42) 
function create_if_block_26(ctx) {
	let div1;
	let div0;
	let t0;
	let span;
	let t1_value = /*windResult*/ ctx[24]?.riskLabel + "";
	let t1;
	let t2;

	function select_block_type_8(ctx, dirty) {
		if (/*isPro*/ ctx[13]) return create_if_block_27;
		return create_else_block_3;
	}

	let current_block_type = select_block_type_8(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text("💨 Wind\r\n          ");
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			if_block.c();
			attr(span, "class", "fg-badge svelte-sq5a06");
			set_style(span, "background", /*windResult*/ ctx[24]?.riskColor);
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(div1, "class", "fg-card svelte-sq5a06");
			set_style(div1, "border-color", /*windResult*/ ctx[24]?.riskColor);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div0, span);
			append(span, t1);
			append(div1, t2);
			if_block.m(div1, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*windResult*/ 16777216 && t1_value !== (t1_value = /*windResult*/ ctx[24]?.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*windResult*/ 16777216) {
				set_style(span, "background", /*windResult*/ ctx[24]?.riskColor);
			}

			if (current_block_type === (current_block_type = select_block_type_8(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (dirty[0] & /*windResult*/ 16777216) {
				set_style(div1, "border-color", /*windResult*/ ctx[24]?.riskColor);
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

// (146:6) {#if selectedHazard === 'heat'}
function create_if_block_16(ctx) {
	let t0;
	let show_if = /*showColdCard*/ ctx[66](/*coldResult*/ ctx[4]) && /*coldResult*/ ctx[4];
	let t1;
	let div5;
	let div0;
	let t2;
	let t3;
	let t4;
	let div4;
	let div1;
	let span0;
	let t6;
	let span1;
	let t8;
	let span2;
	let t9_value = /*heat*/ ctx[3].workRestSchedule.light + "";
	let t9;
	let t10;
	let div2;
	let span3;
	let t12;
	let span4;
	let t14;
	let span5;
	let t15_value = /*heat*/ ctx[3].workRestSchedule.heavy + "";
	let t15;
	let t16;
	let div3;
	let span6;
	let t18;
	let span7;
	let t20;
	let span8;
	let t21_value = /*heat*/ ctx[3].hydration + "";
	let t21;
	let t22;
	let t23;
	let t24;
	let if_block6_anchor;
	let if_block0 = !/*coldDominates*/ ctx[54] && create_if_block_24(ctx);
	let if_block1 = show_if && create_if_block_23(ctx);
	let if_block2 = /*isPro*/ ctx[13] && create_if_block_22();
	let if_block3 = /*isPro*/ ctx[13] && create_if_block_21(ctx);
	let if_block4 = /*isPro*/ ctx[13] && create_if_block_20(ctx);

	function select_block_type_7(ctx, dirty) {
		if (/*isPro*/ ctx[13]) return create_if_block_18;
		return create_else_block_2;
	}

	let current_block_type = select_block_type_7(ctx);
	let if_block5 = current_block_type(ctx);
	let if_block6 = /*isPro*/ ctx[13] && create_if_block_17(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			div5 = element("div");
			div0 = element("div");
			t2 = text("🌡 Heat Stress ");
			if (if_block2) if_block2.c();
			t3 = space();
			if (if_block3) if_block3.c();
			t4 = space();
			div4 = element("div");
			div1 = element("div");
			span0 = element("span");
			span0.textContent = "🕐";
			t6 = space();
			span1 = element("span");
			span1.textContent = "Light work:";
			t8 = space();
			span2 = element("span");
			t9 = text(t9_value);
			t10 = space();
			div2 = element("div");
			span3 = element("span");
			span3.textContent = "💪";
			t12 = space();
			span4 = element("span");
			span4.textContent = "Heavy work:";
			t14 = space();
			span5 = element("span");
			t15 = text(t15_value);
			t16 = space();
			div3 = element("div");
			span6 = element("span");
			span6.textContent = "💧";
			t18 = space();
			span7 = element("span");
			span7.textContent = "Hydration:";
			t20 = space();
			span8 = element("span");
			t21 = text(t21_value);
			t22 = space();
			if (if_block4) if_block4.c();
			t23 = space();
			if_block5.c();
			t24 = space();
			if (if_block6) if_block6.c();
			if_block6_anchor = empty();
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(span0, "class", "fg-ws-icon svelte-sq5a06");
			attr(span1, "class", "fg-ws-label svelte-sq5a06");
			attr(span2, "class", "fg-ws-val svelte-sq5a06");
			attr(div1, "class", "fg-ws-row svelte-sq5a06");
			attr(span3, "class", "fg-ws-icon svelte-sq5a06");
			attr(span4, "class", "fg-ws-label svelte-sq5a06");
			attr(span5, "class", "fg-ws-val svelte-sq5a06");
			attr(div2, "class", "fg-ws-row svelte-sq5a06");
			attr(span6, "class", "fg-ws-icon svelte-sq5a06");
			attr(span7, "class", "fg-ws-label svelte-sq5a06");
			attr(span8, "class", "fg-ws-val svelte-sq5a06");
			attr(div3, "class", "fg-ws-row svelte-sq5a06");
			attr(div4, "class", "fg-work-schedule svelte-sq5a06");
			attr(div5, "class", "fg-card svelte-sq5a06");
			set_style(div5, "border-color", /*heat*/ ctx[3].zoneInfo.color);
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t1, anchor);
			insert(target, div5, anchor);
			append(div5, div0);
			append(div0, t2);
			if (if_block2) if_block2.m(div0, null);
			append(div5, t3);
			if (if_block3) if_block3.m(div5, null);
			append(div5, t4);
			append(div5, div4);
			append(div4, div1);
			append(div1, span0);
			append(div1, t6);
			append(div1, span1);
			append(div1, t8);
			append(div1, span2);
			append(span2, t9);
			append(div4, t10);
			append(div4, div2);
			append(div2, span3);
			append(div2, t12);
			append(div2, span4);
			append(div2, t14);
			append(div2, span5);
			append(span5, t15);
			append(div4, t16);
			append(div4, div3);
			append(div3, span6);
			append(div3, t18);
			append(div3, span7);
			append(div3, t20);
			append(div3, span8);
			append(span8, t21);
			append(div4, t22);
			if (if_block4) if_block4.m(div4, null);
			append(div5, t23);
			if_block5.m(div5, null);
			insert(target, t24, anchor);
			if (if_block6) if_block6.m(target, anchor);
			insert(target, if_block6_anchor, anchor);
		},
		p(ctx, dirty) {
			if (!/*coldDominates*/ ctx[54]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_24(ctx);
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty[0] & /*coldResult*/ 16) show_if = /*showColdCard*/ ctx[66](/*coldResult*/ ctx[4]) && /*coldResult*/ ctx[4];

			if (show_if) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_23(ctx);
					if_block1.c();
					if_block1.m(t1.parentNode, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*isPro*/ ctx[13]) {
				if (if_block2) ; else {
					if_block2 = create_if_block_22();
					if_block2.c();
					if_block2.m(div0, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*isPro*/ ctx[13]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block_21(ctx);
					if_block3.c();
					if_block3.m(div5, t4);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (dirty[0] & /*heat*/ 8 && t9_value !== (t9_value = /*heat*/ ctx[3].workRestSchedule.light + "")) set_data(t9, t9_value);
			if (dirty[0] & /*heat*/ 8 && t15_value !== (t15_value = /*heat*/ ctx[3].workRestSchedule.heavy + "")) set_data(t15, t15_value);
			if (dirty[0] & /*heat*/ 8 && t21_value !== (t21_value = /*heat*/ ctx[3].hydration + "")) set_data(t21, t21_value);

			if (/*isPro*/ ctx[13]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);
				} else {
					if_block4 = create_if_block_20(ctx);
					if_block4.c();
					if_block4.m(div4, null);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_7(ctx)) && if_block5) {
				if_block5.p(ctx, dirty);
			} else {
				if_block5.d(1);
				if_block5 = current_block_type(ctx);

				if (if_block5) {
					if_block5.c();
					if_block5.m(div5, null);
				}
			}

			if (dirty[0] & /*heat*/ 8) {
				set_style(div5, "border-color", /*heat*/ ctx[3].zoneInfo.color);
			}

			if (/*isPro*/ ctx[13]) {
				if (if_block6) {
					if_block6.p(ctx, dirty);
				} else {
					if_block6 = create_if_block_17(ctx);
					if_block6.c();
					if_block6.m(if_block6_anchor.parentNode, if_block6_anchor);
				}
			} else if (if_block6) {
				if_block6.d(1);
				if_block6 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
				detach(div5);
				detach(t24);
				detach(if_block6_anchor);
			}

			if (if_block0) if_block0.d(detaching);
			if (if_block1) if_block1.d(detaching);
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
			if_block5.d();
			if (if_block6) if_block6.d(detaching);
		}
	};
}

// (361:8) {:else}
function create_else_block_5(ctx) {
	let div3;
	let div2;
	let div0;
	let t0_value = (/*rawData*/ ctx[23]?.solarWm2 ?? 0) + "";
	let t0;
	let span;
	let t2;
	let div1;
	let t4;
	let div4;
	let t5;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			span = element("span");
			span.textContent = "W/m²";
			t2 = space();
			div1 = element("div");
			div1.textContent = "Irradiance";
			t4 = space();
			div4 = element("div");
			t5 = text("🔒 UV index, sun angle, sunrise/sunset & WBGT solar contribution\r\n          ");
			button = element("button");
			button.textContent = "Upgrade to Pro →";
			set_style(span, "font-size", "9px");
			attr(div0, "class", "fg-metric-val svelte-sq5a06");
			attr(div1, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div2, "class", "fg-metric svelte-sq5a06");
			attr(div3, "class", "fg-metrics-grid svelte-sq5a06");
			attr(button, "class", "fg-lock-btn svelte-sq5a06");
			attr(div4, "class", "fg-lock svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div0);
			append(div0, t0);
			append(div0, span);
			append(div2, t2);
			append(div2, div1);
			insert(target, t4, anchor);
			insert(target, div4, anchor);
			append(div4, t5);
			append(div4, button);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_12*/ ctx[107]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 8388608 && t0_value !== (t0_value = (/*rawData*/ ctx[23]?.solarWm2 ?? 0) + "")) set_data(t0, t0_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
				detach(t4);
				detach(div4);
			}

			mounted = false;
			dispose();
		}
	};
}

// (345:8) {#if isPro}
function create_if_block_31(ctx) {
	let div9;
	let div2;
	let div0;
	let t0_value = (/*rawData*/ ctx[23]?.solarWm2 ?? 0) + "";
	let t0;
	let span;
	let t2;
	let div1;
	let t4;
	let div5;
	let div3;
	let t5;
	let t6;
	let t7;
	let div4;
	let t9;
	let div8;
	let div6;
	let t10_value = (/*isDay*/ ctx[20] ? '☀ Day' : '🌙 Night') + "";
	let t10;
	let t11;
	let div7;
	let t13;
	let div10;

	return {
		c() {
			div9 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			span = element("span");
			span.textContent = "W/m²";
			t2 = space();
			div1 = element("div");
			div1.textContent = "Irradiance";
			t4 = space();
			div5 = element("div");
			div3 = element("div");
			t5 = text(/*sunElevation*/ ctx[21]);
			t6 = text("°");
			t7 = space();
			div4 = element("div");
			div4.textContent = "Sun Angle";
			t9 = space();
			div8 = element("div");
			div6 = element("div");
			t10 = text(t10_value);
			t11 = space();
			div7 = element("div");
			div7.textContent = "Daylight";
			t13 = space();
			div10 = element("div");
			div10.textContent = "Adds to WBGT globe temperature — peak solar load drives heat stress.";
			set_style(span, "font-size", "9px");
			attr(div0, "class", "fg-metric-val svelte-sq5a06");
			attr(div1, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div2, "class", "fg-metric svelte-sq5a06");
			attr(div3, "class", "fg-metric-val svelte-sq5a06");
			attr(div4, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div5, "class", "fg-metric svelte-sq5a06");
			attr(div6, "class", "fg-metric-val svelte-sq5a06");
			attr(div7, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div8, "class", "fg-metric svelte-sq5a06");
			attr(div9, "class", "fg-metrics-grid svelte-sq5a06");
			attr(div10, "class", "fg-threshold-row svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div9, anchor);
			append(div9, div2);
			append(div2, div0);
			append(div0, t0);
			append(div0, span);
			append(div2, t2);
			append(div2, div1);
			append(div9, t4);
			append(div9, div5);
			append(div5, div3);
			append(div3, t5);
			append(div3, t6);
			append(div5, t7);
			append(div5, div4);
			append(div9, t9);
			append(div9, div8);
			append(div8, div6);
			append(div6, t10);
			append(div8, t11);
			append(div8, div7);
			insert(target, t13, anchor);
			insert(target, div10, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 8388608 && t0_value !== (t0_value = (/*rawData*/ ctx[23]?.solarWm2 ?? 0) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*sunElevation*/ 2097152) set_data(t5, /*sunElevation*/ ctx[21]);
			if (dirty[0] & /*isDay*/ 1048576 && t10_value !== (t10_value = (/*isDay*/ ctx[20] ? '☀ Day' : '🌙 Night') + "")) set_data(t10, t10_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div9);
				detach(t13);
				detach(div10);
			}
		}
	};
}

// (325:8) {:else}
function create_else_block_4(ctx) {
	let div3;
	let div2;
	let div0;
	let t0_value = fmtRain(/*rawData*/ ctx[23]?.rainMmH ?? 0, /*units*/ ctx[53]) + "";
	let t0;
	let t1;
	let div1;
	let t3;
	let div4;
	let t4;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			div1.textContent = "Rate";
			t3 = space();
			div4 = element("div");
			t4 = text("🔒 Intensity scale & custom thresholds\r\n          ");
			button = element("button");
			button.textContent = "Upgrade to Pro →";
			attr(div0, "class", "fg-metric-val svelte-sq5a06");
			attr(div1, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div2, "class", "fg-metric svelte-sq5a06");
			attr(div3, "class", "fg-metrics-grid svelte-sq5a06");
			attr(button, "class", "fg-lock-btn svelte-sq5a06");
			attr(div4, "class", "fg-lock svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div0);
			append(div0, t0);
			append(div2, t1);
			append(div2, div1);
			insert(target, t3, anchor);
			insert(target, div4, anchor);
			append(div4, t4);
			append(div4, button);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_11*/ ctx[106]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t0_value !== (t0_value = fmtRain(/*rawData*/ ctx[23]?.rainMmH ?? 0, /*units*/ ctx[53]) + "")) set_data(t0, t0_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
				detach(t3);
				detach(div4);
			}

			mounted = false;
			dispose();
		}
	};
}

// (313:8) {#if isPro}
function create_if_block_29(ctx) {
	let div6;
	let div2;
	let div0;
	let t0_value = fmtRain(/*rawData*/ ctx[23]?.rainMmH ?? 0, /*units*/ ctx[53]) + "";
	let t0;
	let t1;
	let div1;
	let t3;
	let div5;
	let div3;
	let t4_value = /*rainResult*/ ctx[25]?.intensityLabel + "";
	let t4;
	let t5;
	let div4;
	let t7;
	let div7;
	let t8;
	let t9_value = fmtRain(/*settings*/ ctx[12].rainWarnMmh, /*units*/ ctx[53]) + "";
	let t9;
	let t10;
	let t11_value = fmtRain(/*settings*/ ctx[12].rainDangerMmh, /*units*/ ctx[53]) + "";
	let t11;

	return {
		c() {
			div6 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			div1.textContent = "Rate";
			t3 = space();
			div5 = element("div");
			div3 = element("div");
			t4 = text(t4_value);
			t5 = space();
			div4 = element("div");
			div4.textContent = "Intensity";
			t7 = space();
			div7 = element("div");
			t8 = text("⚠ Warn: ");
			t9 = text(t9_value);
			t10 = text("  |  🛑 Danger: ");
			t11 = text(t11_value);
			attr(div0, "class", "fg-metric-val svelte-sq5a06");
			attr(div1, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div2, "class", "fg-metric svelte-sq5a06");
			attr(div3, "class", "fg-metric-val svelte-sq5a06");
			attr(div4, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div5, "class", "fg-metric svelte-sq5a06");
			attr(div6, "class", "fg-metrics-grid svelte-sq5a06");
			attr(div7, "class", "fg-threshold-row svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div2);
			append(div2, div0);
			append(div0, t0);
			append(div2, t1);
			append(div2, div1);
			append(div6, t3);
			append(div6, div5);
			append(div5, div3);
			append(div3, t4);
			append(div5, t5);
			append(div5, div4);
			insert(target, t7, anchor);
			insert(target, div7, anchor);
			append(div7, t8);
			append(div7, t9);
			append(div7, t10);
			append(div7, t11);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t0_value !== (t0_value = fmtRain(/*rawData*/ ctx[23]?.rainMmH ?? 0, /*units*/ ctx[53]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*rainResult*/ 33554432 && t4_value !== (t4_value = /*rainResult*/ ctx[25]?.intensityLabel + "")) set_data(t4, t4_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t9_value !== (t9_value = fmtRain(/*settings*/ ctx[12].rainWarnMmh, /*units*/ ctx[53]) + "")) set_data(t9, t9_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t11_value !== (t11_value = fmtRain(/*settings*/ ctx[12].rainDangerMmh, /*units*/ ctx[53]) + "")) set_data(t11, t11_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div6);
				detach(t7);
				detach(div7);
			}
		}
	};
}

// (293:8) {:else}
function create_else_block_3(ctx) {
	let div3;
	let div2;
	let div0;
	let t0_value = fmtWind(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]) + "";
	let t0;
	let t1;
	let div1;
	let t3;
	let div4;
	let t4;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			div1.textContent = "Speed";
			t3 = space();
			div4 = element("div");
			t4 = text("🔒 Beaufort scale, km/h & custom thresholds\r\n          ");
			button = element("button");
			button.textContent = "Upgrade to Pro →";
			attr(div0, "class", "fg-metric-val svelte-sq5a06");
			attr(div1, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div2, "class", "fg-metric svelte-sq5a06");
			attr(div3, "class", "fg-metrics-grid svelte-sq5a06");
			attr(button, "class", "fg-lock-btn svelte-sq5a06");
			attr(div4, "class", "fg-lock svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div0);
			append(div0, t0);
			append(div2, t1);
			append(div2, div1);
			insert(target, t3, anchor);
			insert(target, div4, anchor);
			append(div4, t4);
			append(div4, button);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_10*/ ctx[105]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t0_value !== (t0_value = fmtWind(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]) + "")) set_data(t0, t0_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
				detach(t3);
				detach(div4);
			}

			mounted = false;
			dispose();
		}
	};
}

// (277:8) {#if isPro}
function create_if_block_27(ctx) {
	let div9;
	let div2;
	let div0;
	let t0_value = fmtWind(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]) + "";
	let t0;
	let t1;
	let div1;
	let t3;
	let div5;
	let div3;
	let t4_value = fmtWindSecondary(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]).val + "";
	let t4;
	let t5;
	let div4;
	let t6_value = fmtWindSecondary(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]).lbl + "";
	let t6;
	let t7;
	let div8;
	let div6;
	let t8;
	let t9_value = /*windResult*/ ctx[24]?.beaufort + "";
	let t9;
	let t10;
	let div7;
	let t11_value = /*windResult*/ ctx[24]?.beaufortDesc + "";
	let t11;
	let t12;
	let div10;
	let t13;
	let t14_value = fmtWind(/*settings*/ ctx[12].windWarnMs, /*units*/ ctx[53]) + "";
	let t14;
	let t15;
	let t16_value = fmtWind(/*settings*/ ctx[12].windDangerMs, /*units*/ ctx[53]) + "";
	let t16;

	return {
		c() {
			div9 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			div1.textContent = "Speed";
			t3 = space();
			div5 = element("div");
			div3 = element("div");
			t4 = text(t4_value);
			t5 = space();
			div4 = element("div");
			t6 = text(t6_value);
			t7 = space();
			div8 = element("div");
			div6 = element("div");
			t8 = text("Bft ");
			t9 = text(t9_value);
			t10 = space();
			div7 = element("div");
			t11 = text(t11_value);
			t12 = space();
			div10 = element("div");
			t13 = text("⚠ Warn: ");
			t14 = text(t14_value);
			t15 = text("  |  🛑 Danger: ");
			t16 = text(t16_value);
			attr(div0, "class", "fg-metric-val svelte-sq5a06");
			attr(div1, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div2, "class", "fg-metric svelte-sq5a06");
			attr(div3, "class", "fg-metric-val svelte-sq5a06");
			attr(div4, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div5, "class", "fg-metric svelte-sq5a06");
			attr(div6, "class", "fg-metric-val svelte-sq5a06");
			attr(div7, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div8, "class", "fg-metric svelte-sq5a06");
			attr(div9, "class", "fg-metrics-grid svelte-sq5a06");
			attr(div10, "class", "fg-threshold-row svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div9, anchor);
			append(div9, div2);
			append(div2, div0);
			append(div0, t0);
			append(div2, t1);
			append(div2, div1);
			append(div9, t3);
			append(div9, div5);
			append(div5, div3);
			append(div3, t4);
			append(div5, t5);
			append(div5, div4);
			append(div4, t6);
			append(div9, t7);
			append(div9, div8);
			append(div8, div6);
			append(div6, t8);
			append(div6, t9);
			append(div8, t10);
			append(div8, div7);
			append(div7, t11);
			insert(target, t12, anchor);
			insert(target, div10, anchor);
			append(div10, t13);
			append(div10, t14);
			append(div10, t15);
			append(div10, t16);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t0_value !== (t0_value = fmtWind(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t4_value !== (t4_value = fmtWindSecondary(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]).val + "")) set_data(t4, t4_value);
			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t6_value !== (t6_value = fmtWindSecondary(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]).lbl + "")) set_data(t6, t6_value);
			if (dirty[0] & /*windResult*/ 16777216 && t9_value !== (t9_value = /*windResult*/ ctx[24]?.beaufort + "")) set_data(t9, t9_value);
			if (dirty[0] & /*windResult*/ 16777216 && t11_value !== (t11_value = /*windResult*/ ctx[24]?.beaufortDesc + "")) set_data(t11, t11_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t14_value !== (t14_value = fmtWind(/*settings*/ ctx[12].windWarnMs, /*units*/ ctx[53]) + "")) set_data(t14, t14_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t16_value !== (t16_value = fmtWind(/*settings*/ ctx[12].windDangerMs, /*units*/ ctx[53]) + "")) set_data(t16, t16_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div9);
				detach(t12);
				detach(div10);
			}
		}
	};
}

// (147:6) {#if !coldDominates}
function create_if_block_24(ctx) {
	let div6;
	let div0;
	let t0;
	let div4;
	let div1;
	let t1_value = /*heat*/ ctx[3].zoneInfo.riskLabel + "";
	let t1;
	let t2;
	let div2;
	let t3_value = /*heat*/ ctx[3].zoneInfo.label + "";
	let t3;
	let t4;
	let div3;
	let t5;
	let t6_value = fmtTemp(/*heat*/ ctx[3].apparentTempFinal, /*units*/ ctx[53]) + "";
	let t6;
	let t7;
	let div5;
	let t8;
	let if_block = /*isPro*/ ctx[13] && create_if_block_25(ctx);

	return {
		c() {
			div6 = element("div");
			div0 = element("div");
			t0 = space();
			div4 = element("div");
			div1 = element("div");
			t1 = text(t1_value);
			t2 = space();
			div2 = element("div");
			t3 = text(t3_value);
			t4 = space();
			div3 = element("div");
			t5 = text("Apparent Temp: ");
			t6 = text(t6_value);
			if (if_block) if_block.c();
			t7 = space();
			div5 = element("div");
			t8 = text(/*currentTime*/ ctx[18]);
			attr(div0, "class", "fg-zone-dot svelte-sq5a06");
			set_style(div0, "background", /*heat*/ ctx[3].zoneInfo.color);
			attr(div1, "class", "fg-zone-name svelte-sq5a06");
			set_style(div1, "color", /*heat*/ ctx[3].zoneInfo.color);
			attr(div2, "class", "fg-zone-label svelte-sq5a06");
			attr(div3, "class", "fg-zone-sub svelte-sq5a06");
			attr(div4, "class", "fg-zone-main svelte-sq5a06");
			attr(div5, "class", "fg-zone-time svelte-sq5a06");
			attr(div6, "class", "fg-zone-banner svelte-sq5a06");
			set_style(div6, "background", /*heat*/ ctx[3].zoneInfo.bgColor);
			set_style(div6, "border-color", /*heat*/ ctx[3].zoneInfo.color);
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div0);
			append(div6, t0);
			append(div6, div4);
			append(div4, div1);
			append(div1, t1);
			append(div4, t2);
			append(div4, div2);
			append(div2, t3);
			append(div4, t4);
			append(div4, div3);
			append(div3, t5);
			append(div3, t6);
			if (if_block) if_block.m(div3, null);
			append(div6, t7);
			append(div6, div5);
			append(div5, t8);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 8) {
				set_style(div0, "background", /*heat*/ ctx[3].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 8 && t1_value !== (t1_value = /*heat*/ ctx[3].zoneInfo.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*heat*/ 8) {
				set_style(div1, "color", /*heat*/ ctx[3].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 8 && t3_value !== (t3_value = /*heat*/ ctx[3].zoneInfo.label + "")) set_data(t3, t3_value);
			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*units*/ 4194304 && t6_value !== (t6_value = fmtTemp(/*heat*/ ctx[3].apparentTempFinal, /*units*/ ctx[53]) + "")) set_data(t6, t6_value);

			if (/*isPro*/ ctx[13]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_25(ctx);
					if_block.c();
					if_block.m(div3, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*currentTime*/ 262144) set_data(t8, /*currentTime*/ ctx[18]);

			if (dirty[0] & /*heat*/ 8) {
				set_style(div6, "background", /*heat*/ ctx[3].zoneInfo.bgColor);
			}

			if (dirty[0] & /*heat*/ 8) {
				set_style(div6, "border-color", /*heat*/ ctx[3].zoneInfo.color);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div6);
			}

			if (if_block) if_block.d();
		}
	};
}

// (154:90) {#if isPro}
function create_if_block_25(ctx) {
	let t0;
	let t1_value = fmtTemp(/*heat*/ ctx[3].wbgtAdjusted, /*units*/ ctx[53]) + "";
	let t1;

	return {
		c() {
			t0 = text("| WBGT+PPE: ");
			t1 = text(t1_value);
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*units*/ 4194304 && t1_value !== (t1_value = fmtTemp(/*heat*/ ctx[3].wbgtAdjusted, /*units*/ ctx[53]) + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
			}
		}
	};
}

// (162:6) {#if showColdCard(coldResult) && coldResult}
function create_if_block_23(ctx) {
	let div12;
	let div0;
	let t0;
	let span;
	let t1_value = /*coldResult*/ ctx[4].riskLabel + "";
	let t1;
	let t2;
	let div10;
	let div3;
	let div1;
	let t3_value = fmtTemp(/*rawData*/ ctx[23]?.tempC ?? 0, /*units*/ ctx[53]) + "";
	let t3;
	let t4;
	let div2;
	let t6;
	let div6;
	let div4;
	let t7_value = fmtTemp(/*coldResult*/ ctx[4].windChillC, /*units*/ ctx[53]) + "";
	let t7;
	let t8;
	let div5;
	let t10;
	let div9;
	let div7;
	let t11_value = fmtWind(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]) + "";
	let t11;
	let t12;
	let div8;
	let t14;
	let div11;
	let t15;
	let t16_value = /*coldResult*/ ctx[4].frostbite + "";
	let t16;
	let t17;
	let each_value_7 = ensure_array_like(/*coldResult*/ ctx[4].controls);
	let each_blocks = [];

	for (let i = 0; i < each_value_7.length; i += 1) {
		each_blocks[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
	}

	return {
		c() {
			div12 = element("div");
			div0 = element("div");
			t0 = text("❄ Cold Stress / Wind Chill\r\n            ");
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			div10 = element("div");
			div3 = element("div");
			div1 = element("div");
			t3 = text(t3_value);
			t4 = space();
			div2 = element("div");
			div2.textContent = "Air Temp";
			t6 = space();
			div6 = element("div");
			div4 = element("div");
			t7 = text(t7_value);
			t8 = space();
			div5 = element("div");
			div5.textContent = "Wind Chill";
			t10 = space();
			div9 = element("div");
			div7 = element("div");
			t11 = text(t11_value);
			t12 = space();
			div8 = element("div");
			div8.textContent = "Wind";
			t14 = space();
			div11 = element("div");
			t15 = text("🥶 ");
			t16 = text(t16_value);
			t17 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(span, "class", "fg-badge svelte-sq5a06");
			set_style(span, "background", /*coldResult*/ ctx[4].riskColor);
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(div1, "class", "fg-metric-val svelte-sq5a06");
			attr(div2, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div3, "class", "fg-metric svelte-sq5a06");
			attr(div4, "class", "fg-metric-val svelte-sq5a06");
			set_style(div4, "color", /*coldResult*/ ctx[4].riskColor);
			attr(div5, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div6, "class", "fg-metric svelte-sq5a06");
			attr(div7, "class", "fg-metric-val svelte-sq5a06");
			attr(div8, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div9, "class", "fg-metric svelte-sq5a06");
			attr(div10, "class", "fg-metrics-grid svelte-sq5a06");
			attr(div11, "class", "fg-threshold-row svelte-sq5a06");
			attr(div12, "class", "fg-card svelte-sq5a06");
			set_style(div12, "border-color", /*coldResult*/ ctx[4].riskColor);
		},
		m(target, anchor) {
			insert(target, div12, anchor);
			append(div12, div0);
			append(div0, t0);
			append(div0, span);
			append(span, t1);
			append(div12, t2);
			append(div12, div10);
			append(div10, div3);
			append(div3, div1);
			append(div1, t3);
			append(div3, t4);
			append(div3, div2);
			append(div10, t6);
			append(div10, div6);
			append(div6, div4);
			append(div4, t7);
			append(div6, t8);
			append(div6, div5);
			append(div10, t10);
			append(div10, div9);
			append(div9, div7);
			append(div7, t11);
			append(div9, t12);
			append(div9, div8);
			append(div12, t14);
			append(div12, div11);
			append(div11, t15);
			append(div11, t16);
			append(div12, t17);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div12, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*coldResult*/ 16 && t1_value !== (t1_value = /*coldResult*/ ctx[4].riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*coldResult*/ 16) {
				set_style(span, "background", /*coldResult*/ ctx[4].riskColor);
			}

			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t3_value !== (t3_value = fmtTemp(/*rawData*/ ctx[23]?.tempC ?? 0, /*units*/ ctx[53]) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*coldResult*/ 16 | dirty[1] & /*units*/ 4194304 && t7_value !== (t7_value = fmtTemp(/*coldResult*/ ctx[4].windChillC, /*units*/ ctx[53]) + "")) set_data(t7, t7_value);

			if (dirty[0] & /*coldResult*/ 16) {
				set_style(div4, "color", /*coldResult*/ ctx[4].riskColor);
			}

			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t11_value !== (t11_value = fmtWind(/*rawData*/ ctx[23]?.windMs ?? 0, /*units*/ ctx[53]) + "")) set_data(t11, t11_value);
			if (dirty[0] & /*coldResult*/ 16 && t16_value !== (t16_value = /*coldResult*/ ctx[4].frostbite + "")) set_data(t16, t16_value);

			if (dirty[0] & /*coldResult*/ 16) {
				each_value_7 = ensure_array_like(/*coldResult*/ ctx[4].controls);
				let i;

				for (i = 0; i < each_value_7.length; i += 1) {
					const child_ctx = get_each_context_7(ctx, each_value_7, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div12, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_7.length;
			}

			if (dirty[0] & /*coldResult*/ 16) {
				set_style(div12, "border-color", /*coldResult*/ ctx[4].riskColor);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div12);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (183:10) {#each coldResult.controls as ctrl}
function create_each_block_7(ctx) {
	let div;
	let t0;
	let t1_value = /*ctrl*/ ctx[198] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("▸ ");
			t1 = text(t1_value);
			attr(div, "class", "fg-control-item svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*coldResult*/ 16 && t1_value !== (t1_value = /*ctrl*/ ctx[198] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (191:51) {#if isPro}
function create_if_block_22(ctx) {
	let t_1;

	return {
		c() {
			t_1 = text("Analysis");
		},
		m(target, anchor) {
			insert(target, t_1, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t_1);
			}
		}
	};
}

// (192:8) {#if isPro}
function create_if_block_21(ctx) {
	let div18;
	let div2;
	let div0;
	let t0_value = fmtTemp(/*rawData*/ ctx[23]?.tempC ?? 0, /*units*/ ctx[53]) + "";
	let t0;
	let t1;
	let div1;
	let t3;
	let div5;
	let div3;
	let t4_value = /*rawData*/ ctx[23]?.humidity + "";
	let t4;
	let t5;
	let t6;
	let div4;
	let t8;
	let div8;
	let div6;
	let t9_value = fmtTemp(/*heat*/ ctx[3].apparentTemp1, /*units*/ ctx[53]) + "";
	let t9;
	let t10;
	let div7;
	let t12;
	let div11;
	let div9;

	let t13_value = (/*heat*/ ctx[3].apparentTempFinal === 999
	? 'NW'
	: fmtTemp(/*heat*/ ctx[3].apparentTempFinal, /*units*/ ctx[53])) + "";

	let t13;
	let t14;
	let div10;
	let t16;
	let div14;
	let div12;
	let t17_value = fmtTemp(/*heat*/ ctx[3].wbgtBase, /*units*/ ctx[53]) + "";
	let t17;
	let t18;
	let div13;
	let t20;
	let div17;
	let div15;
	let t21_value = fmtTemp(/*heat*/ ctx[3].wbgtAdjusted, /*units*/ ctx[53]) + "";
	let t21;
	let t22;
	let div16;

	return {
		c() {
			div18 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			div1.textContent = "Temp";
			t3 = space();
			div5 = element("div");
			div3 = element("div");
			t4 = text(t4_value);
			t5 = text("%");
			t6 = space();
			div4 = element("div");
			div4.textContent = "Humidity";
			t8 = space();
			div8 = element("div");
			div6 = element("div");
			t9 = text(t9_value);
			t10 = space();
			div7 = element("div");
			div7.textContent = "App.Temp A";
			t12 = space();
			div11 = element("div");
			div9 = element("div");
			t13 = text(t13_value);
			t14 = space();
			div10 = element("div");
			div10.textContent = "App.Temp B";
			t16 = space();
			div14 = element("div");
			div12 = element("div");
			t17 = text(t17_value);
			t18 = space();
			div13 = element("div");
			div13.textContent = "WBGT";
			t20 = space();
			div17 = element("div");
			div15 = element("div");
			t21 = text(t21_value);
			t22 = space();
			div16 = element("div");
			div16.textContent = "WBGT+PPE";
			attr(div0, "class", "fg-metric-val svelte-sq5a06");
			attr(div1, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div2, "class", "fg-metric svelte-sq5a06");
			attr(div3, "class", "fg-metric-val svelte-sq5a06");
			attr(div4, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div5, "class", "fg-metric svelte-sq5a06");
			attr(div6, "class", "fg-metric-val svelte-sq5a06");
			attr(div7, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div8, "class", "fg-metric svelte-sq5a06");
			attr(div9, "class", "fg-metric-val svelte-sq5a06");
			set_style(div9, "color", /*heat*/ ctx[3].zoneInfo.color);
			attr(div10, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div11, "class", "fg-metric svelte-sq5a06");
			attr(div12, "class", "fg-metric-val svelte-sq5a06");
			attr(div13, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div14, "class", "fg-metric svelte-sq5a06");
			attr(div15, "class", "fg-metric-val svelte-sq5a06");

			set_style(div15, "color", /*heat*/ ctx[3].wbgtAdjusted >= /*settings*/ ctx[12].wbgtDangerC
			? '#dc2626'
			: /*heat*/ ctx[3].wbgtAdjusted >= /*settings*/ ctx[12].wbgtWarnC
				? '#f97316'
				: '#94a3b8');

			attr(div16, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div17, "class", "fg-metric svelte-sq5a06");
			attr(div18, "class", "fg-metrics-grid svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div18, anchor);
			append(div18, div2);
			append(div2, div0);
			append(div0, t0);
			append(div2, t1);
			append(div2, div1);
			append(div18, t3);
			append(div18, div5);
			append(div5, div3);
			append(div3, t4);
			append(div3, t5);
			append(div5, t6);
			append(div5, div4);
			append(div18, t8);
			append(div18, div8);
			append(div8, div6);
			append(div6, t9);
			append(div8, t10);
			append(div8, div7);
			append(div18, t12);
			append(div18, div11);
			append(div11, div9);
			append(div9, t13);
			append(div11, t14);
			append(div11, div10);
			append(div18, t16);
			append(div18, div14);
			append(div14, div12);
			append(div12, t17);
			append(div14, t18);
			append(div14, div13);
			append(div18, t20);
			append(div18, div17);
			append(div17, div15);
			append(div15, t21);
			append(div17, t22);
			append(div17, div16);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rawData*/ 8388608 | dirty[1] & /*units*/ 4194304 && t0_value !== (t0_value = fmtTemp(/*rawData*/ ctx[23]?.tempC ?? 0, /*units*/ ctx[53]) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*rawData*/ 8388608 && t4_value !== (t4_value = /*rawData*/ ctx[23]?.humidity + "")) set_data(t4, t4_value);
			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*units*/ 4194304 && t9_value !== (t9_value = fmtTemp(/*heat*/ ctx[3].apparentTemp1, /*units*/ ctx[53]) + "")) set_data(t9, t9_value);

			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*units*/ 4194304 && t13_value !== (t13_value = (/*heat*/ ctx[3].apparentTempFinal === 999
			? 'NW'
			: fmtTemp(/*heat*/ ctx[3].apparentTempFinal, /*units*/ ctx[53])) + "")) set_data(t13, t13_value);

			if (dirty[0] & /*heat*/ 8) {
				set_style(div9, "color", /*heat*/ ctx[3].zoneInfo.color);
			}

			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*units*/ 4194304 && t17_value !== (t17_value = fmtTemp(/*heat*/ ctx[3].wbgtBase, /*units*/ ctx[53]) + "")) set_data(t17, t17_value);
			if (dirty[0] & /*heat*/ 8 | dirty[1] & /*units*/ 4194304 && t21_value !== (t21_value = fmtTemp(/*heat*/ ctx[3].wbgtAdjusted, /*units*/ ctx[53]) + "")) set_data(t21, t21_value);

			if (dirty[0] & /*heat, settings*/ 4104) {
				set_style(div15, "color", /*heat*/ ctx[3].wbgtAdjusted >= /*settings*/ ctx[12].wbgtDangerC
				? '#dc2626'
				: /*heat*/ ctx[3].wbgtAdjusted >= /*settings*/ ctx[12].wbgtWarnC
					? '#f97316'
					: '#94a3b8');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div18);
			}
		}
	};
}

// (240:10) {#if isPro}
function create_if_block_20(ctx) {
	let div;
	let span0;
	let t1;
	let span1;
	let t3;
	let span2;
	let t4_value = /*heat*/ ctx[3].zoneInfo.monitoringSchedule + "";
	let t4;

	return {
		c() {
			div = element("div");
			span0 = element("span");
			span0.textContent = "👁";
			t1 = space();
			span1 = element("span");
			span1.textContent = "Monitoring:";
			t3 = space();
			span2 = element("span");
			t4 = text(t4_value);
			attr(span0, "class", "fg-ws-icon svelte-sq5a06");
			attr(span1, "class", "fg-ws-label svelte-sq5a06");
			attr(span2, "class", "fg-ws-val svelte-sq5a06");
			set_style(span2, "font-size", "9px");
			attr(div, "class", "fg-ws-row svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(div, t1);
			append(div, span1);
			append(div, t3);
			append(div, span2);
			append(span2, t4);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 8 && t4_value !== (t4_value = /*heat*/ ctx[3].zoneInfo.monitoringSchedule + "")) set_data(t4, t4_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (253:8) {:else}
function create_else_block_2(ctx) {
	let div;
	let t0;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			t0 = text("🔒 WBGT, Apparent Temp A/B, mandatory controls & monitoring schedule\r\n            ");
			button = element("button");
			button.textContent = "Upgrade to Pro →";
			attr(button, "class", "fg-lock-btn svelte-sq5a06");
			attr(div, "class", "fg-lock svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, button);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_9*/ ctx[104]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			mounted = false;
			dispose();
		}
	};
}

// (248:8) {#if isPro}
function create_if_block_18(ctx) {
	let div;
	let t0;
	let t1_value = PPE_PROFILES[/*settings*/ ctx[12].ppeProfile].label + "";
	let t1;
	let t2;
	let t3_value = fmtAdj(PPE_PROFILES[/*settings*/ ctx[12].ppeProfile].adjustment, /*units*/ ctx[53]) + "";
	let t3;
	let t4;
	let t5;
	let if_block_anchor;
	let if_block = /*worstCaseMode*/ ctx[9] && /*worstModelLabel*/ ctx[36] && create_if_block_19(ctx);

	return {
		c() {
			div = element("div");
			t0 = text("PPE: ");
			t1 = text(t1_value);
			t2 = text(" (");
			t3 = text(t3_value);
			t4 = text(")");
			t5 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div, "class", "fg-ppe-row svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, t2);
			append(div, t3);
			append(div, t4);
			insert(target, t5, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*settings*/ 4096 && t1_value !== (t1_value = PPE_PROFILES[/*settings*/ ctx[12].ppeProfile].label + "")) set_data(t1, t1_value);
			if (dirty[0] & /*settings*/ 4096 | dirty[1] & /*units*/ 4194304 && t3_value !== (t3_value = fmtAdj(PPE_PROFILES[/*settings*/ ctx[12].ppeProfile].adjustment, /*units*/ ctx[53]) + "")) set_data(t3, t3_value);

			if (/*worstCaseMode*/ ctx[9] && /*worstModelLabel*/ ctx[36]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_19(ctx);
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
				detach(t5);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

// (250:10) {#if worstCaseMode && worstModelLabel}
function create_if_block_19(ctx) {
	let div;
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("⚡ Worst case: ");
			t1 = text(/*worstModelLabel*/ ctx[36]);
			attr(div, "class", "fg-ppe-row svelte-sq5a06");
			set_style(div, "color", "#38bdf8");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[1] & /*worstModelLabel*/ 32) set_data(t1, /*worstModelLabel*/ ctx[36]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (261:6) {#if isPro}
function create_if_block_17(ctx) {
	let div1;
	let div0;
	let t0;
	let t1_value = /*heat*/ ctx[3].zoneInfo.riskLabel + "";
	let t1;
	let t2;
	let t3;
	let each_value_6 = ensure_array_like(/*heat*/ ctx[3].zoneInfo.mandatoryControls);
	let each_blocks = [];

	for (let i = 0; i < each_value_6.length; i += 1) {
		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
	}

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text("⚠ Mandatory Controls (");
			t1 = text(t1_value);
			t2 = text(")");
			t3 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(div1, "class", "fg-card svelte-sq5a06");
			set_style(div1, "border-color", /*heat*/ ctx[3].zoneInfo.color);
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			append(div1, t3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 8 && t1_value !== (t1_value = /*heat*/ ctx[3].zoneInfo.riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*heat*/ 8) {
				each_value_6 = ensure_array_like(/*heat*/ ctx[3].zoneInfo.mandatoryControls);
				let i;

				for (i = 0; i < each_value_6.length; i += 1) {
					const child_ctx = get_each_context_6(ctx, each_value_6, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_6.length;
			}

			if (dirty[0] & /*heat*/ 8) {
				set_style(div1, "border-color", /*heat*/ ctx[3].zoneInfo.color);
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

// (264:8) {#each heat.zoneInfo.mandatoryControls as ctrl}
function create_each_block_6(ctx) {
	let div;
	let t0;
	let t1_value = /*ctrl*/ ctx[198] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("▸ ");
			t1 = text(t1_value);
			attr(div, "class", "fg-control-item svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*heat*/ 8 && t1_value !== (t1_value = /*ctrl*/ ctx[198] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (376:6) {#if selectedHazard === 'rain' && isPro && thunderResult}
function create_if_block_13(ctx) {
	let div3;
	let div0;
	let t0;
	let span;
	let t1_value = /*thunderResult*/ ctx[26].riskLabel + "";
	let t1;
	let t2;
	let div2;
	let div1;
	let t3_value = /*thunderResult*/ ctx[26].instability + "";
	let t3;
	let t4;
	let t5;
	let if_block = /*thunderResult*/ ctx[26].available && create_if_block_14(ctx);
	let each_value_5 = ensure_array_like(/*thunderResult*/ ctx[26].guidance);
	let each_blocks = [];

	for (let i = 0; i < each_value_5.length; i += 1) {
		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
	}

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			t0 = text("⛈ Storm Outlook\r\n            ");
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			div2 = element("div");
			div1 = element("div");
			t3 = text(t3_value);
			t4 = space();
			if (if_block) if_block.c();
			t5 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(span, "class", "fg-badge svelte-sq5a06");
			set_style(span, "background", /*thunderResult*/ ctx[26].riskColor);
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(div1, "class", "fg-metric-val svelte-sq5a06");
			set_style(div1, "font-size", "13px");
			set_style(div1, "line-height", "1.4");
			set_style(div1, "color", /*thunderResult*/ ctx[26].riskColor);
			attr(div2, "class", "fg-metric svelte-sq5a06");
			set_style(div2, "padding", "8px 0");
			attr(div3, "class", "fg-card svelte-sq5a06");
			set_style(div3, "border-color", /*thunderResult*/ ctx[26].riskColor);
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div0, t0);
			append(div0, span);
			append(span, t1);
			append(div3, t2);
			append(div3, div2);
			append(div2, div1);
			append(div1, t3);
			append(div3, t4);
			if (if_block) if_block.m(div3, null);
			append(div3, t5);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div3, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*thunderResult*/ 67108864 && t1_value !== (t1_value = /*thunderResult*/ ctx[26].riskLabel + "")) set_data(t1, t1_value);

			if (dirty[0] & /*thunderResult*/ 67108864) {
				set_style(span, "background", /*thunderResult*/ ctx[26].riskColor);
			}

			if (dirty[0] & /*thunderResult*/ 67108864 && t3_value !== (t3_value = /*thunderResult*/ ctx[26].instability + "")) set_data(t3, t3_value);

			if (dirty[0] & /*thunderResult*/ 67108864) {
				set_style(div1, "color", /*thunderResult*/ ctx[26].riskColor);
			}

			if (/*thunderResult*/ ctx[26].available) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_14(ctx);
					if_block.c();
					if_block.m(div3, t5);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*thunderResult*/ 67108864) {
				each_value_5 = ensure_array_like(/*thunderResult*/ ctx[26].guidance);
				let i;

				for (i = 0; i < each_value_5.length; i += 1) {
					const child_ctx = get_each_context_5(ctx, each_value_5, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div3, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_5.length;
			}

			if (dirty[0] & /*thunderResult*/ 67108864) {
				set_style(div3, "border-color", /*thunderResult*/ ctx[26].riskColor);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}

			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
		}
	};
}

// (385:10) {#if thunderResult.available}
function create_if_block_14(ctx) {
	let div;
	let t0;
	let t1_value = /*thunderResult*/ ctx[26].capeJkg + "";
	let t1;
	let t2;
	let if_block = !/*isSite*/ ctx[52] && create_if_block_15();

	return {
		c() {
			div = element("div");
			t0 = text("Forecast storm potential from the models (CAPE ");
			t1 = text(t1_value);
			t2 = text(" J/kg, gated on cloud & rain) — not live strike detection.");
			if (if_block) if_block.c();
			attr(div, "class", "fg-threshold-row svelte-sq5a06");
			set_style(div, "opacity", "0.65");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, t2);
			if (if_block) if_block.m(div, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*thunderResult*/ 67108864 && t1_value !== (t1_value = /*thunderResult*/ ctx[26].capeJkg + "")) set_data(t1, t1_value);

			if (!/*isSite*/ ctx[52]) {
				if (if_block) ; else {
					if_block = create_if_block_15();
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if (if_block) if_block.d();
		}
	};
}

// (386:195) {#if !isSite}
function create_if_block_15(ctx) {
	let t_1;

	return {
		c() {
			t_1 = text("Site adds real-time lightning strikes.");
		},
		m(target, anchor) {
			insert(target, t_1, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t_1);
			}
		}
	};
}

// (388:10) {#each thunderResult.guidance as g}
function create_each_block_5(ctx) {
	let div;
	let t0;
	let t1_value = /*g*/ ctx[195] + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("▸ ");
			t1 = text(t1_value);
			attr(div, "class", "fg-control-item svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*thunderResult*/ 67108864 && t1_value !== (t1_value = /*g*/ ctx[195] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (395:6) {#if selectedHazard === 'rain' && isSite && settings.monitorHazards.lightning}
function create_if_block_8(ctx) {
	let div2;
	let div0;
	let t0;
	let span;
	let t2;
	let t3;
	let t4;
	let t5;
	let div1;
	let if_block0 = /*lightningResult*/ ctx[27] && create_if_block_12(ctx);

	function select_block_type_11(ctx, dirty) {
		if (!/*lightningResult*/ ctx[27]) return create_if_block_10;
		if (/*lightningResult*/ ctx[27].status === 'clear') return create_if_block_11;
		return create_else_block_1;
	}

	let current_block_type = select_block_type_11(ctx);
	let if_block1 = current_block_type(ctx);
	let if_block2 = /*lightningResult*/ ctx[27] && /*lightningResult*/ ctx[27].rings && create_if_block_9(ctx);

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			t0 = text("⚡ Lightning Strikes ");
			span = element("span");
			span.textContent = "LIVE";
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			if_block1.c();
			t4 = space();
			if (if_block2) if_block2.c();
			t5 = space();
			div1 = element("div");
			div1.textContent = "▸ Live strikes emailed to your team the moment lightning enters a stop-work ring; 30-min all-clear after.";
			attr(span, "class", "fg-pro-tag svelte-sq5a06");
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(div1, "class", "fg-control-item svelte-sq5a06");
			attr(div2, "class", "fg-card svelte-sq5a06");

			set_style(div2, "border-color", /*lightningResult*/ ctx[27]
			? lightningColor(/*lightningResult*/ ctx[27].status)
			: '#334155');
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, t0);
			append(div0, span);
			append(div0, t2);
			if (if_block0) if_block0.m(div0, null);
			append(div2, t3);
			if_block1.m(div2, null);
			append(div2, t4);
			if (if_block2) if_block2.m(div2, null);
			append(div2, t5);
			append(div2, div1);
		},
		p(ctx, dirty) {
			if (/*lightningResult*/ ctx[27]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_12(ctx);
					if_block0.c();
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_11(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div2, t4);
				}
			}

			if (/*lightningResult*/ ctx[27] && /*lightningResult*/ ctx[27].rings) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_9(ctx);
					if_block2.c();
					if_block2.m(div2, t5);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty[0] & /*lightningResult*/ 134217728) {
				set_style(div2, "border-color", /*lightningResult*/ ctx[27]
				? lightningColor(/*lightningResult*/ ctx[27].status)
				: '#334155');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			if (if_block0) if_block0.d();
			if_block1.d();
			if (if_block2) if_block2.d();
		}
	};
}

// (399:12) {#if lightningResult}
function create_if_block_12(ctx) {
	let span;
	let t_1_value = lightningLabel(/*lightningResult*/ ctx[27].status) + "";
	let t_1;

	return {
		c() {
			span = element("span");
			t_1 = text(t_1_value);
			attr(span, "class", "fg-badge svelte-sq5a06");
			set_style(span, "background", lightningColor(/*lightningResult*/ ctx[27].status));
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t_1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*lightningResult*/ 134217728 && t_1_value !== (t_1_value = lightningLabel(/*lightningResult*/ ctx[27].status) + "")) set_data(t_1, t_1_value);

			if (dirty[0] & /*lightningResult*/ 134217728) {
				set_style(span, "background", lightningColor(/*lightningResult*/ ctx[27].status));
			}
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (405:10) {:else}
function create_else_block_1(ctx) {
	let div6;
	let div2;
	let div0;
	let t0_value = (/*lightningResult*/ ctx[27].nearestMi ?? '—') + "";
	let t0;
	let t1;
	let div1;
	let t2;
	let t3_value = (/*lightningResult*/ ctx[27].nearestBearing || 'mi') + "";
	let t3;
	let t4;
	let div5;
	let div3;
	let t5_value = /*lightningResult*/ ctx[27].strikeCount + "";
	let t5;
	let t6;

	let t7_value = (/*lightningResult*/ ctx[27].resumeAtISO
	? ` · all-clear in ${/*lightningResult*/ ctx[27].minutesUntilAllClear} min`
	: '') + "";

	let t7;
	let t8;
	let div4;

	let t9_value = (/*lightningResult*/ ctx[27].status === 'red'
	? 'STOP WORK — shelter now'
	: 'Storm approaching') + "";

	let t9;

	return {
		c() {
			div6 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			t2 = text("nearest ");
			t3 = text(t3_value);
			t4 = space();
			div5 = element("div");
			div3 = element("div");
			t5 = text(t5_value);
			t6 = text(" strike(s) in range");
			t7 = text(t7_value);
			t8 = space();
			div4 = element("div");
			t9 = text(t9_value);
			attr(div0, "class", "fg-metric-val svelte-sq5a06");
			set_style(div0, "color", lightningColor(/*lightningResult*/ ctx[27].status));
			attr(div1, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div2, "class", "fg-metric svelte-sq5a06");
			attr(div3, "class", "fg-metric-val svelte-sq5a06");
			set_style(div3, "font-size", "12px");
			set_style(div3, "color", lightningColor(/*lightningResult*/ ctx[27].status));
			attr(div4, "class", "fg-metric-lbl svelte-sq5a06");
			attr(div5, "class", "fg-metric svelte-sq5a06");
			set_style(div5, "grid-column", "span 2");
			attr(div6, "class", "fg-metrics-grid svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div2);
			append(div2, div0);
			append(div0, t0);
			append(div2, t1);
			append(div2, div1);
			append(div1, t2);
			append(div1, t3);
			append(div6, t4);
			append(div6, div5);
			append(div5, div3);
			append(div3, t5);
			append(div3, t6);
			append(div3, t7);
			append(div5, t8);
			append(div5, div4);
			append(div4, t9);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*lightningResult*/ 134217728 && t0_value !== (t0_value = (/*lightningResult*/ ctx[27].nearestMi ?? '—') + "")) set_data(t0, t0_value);

			if (dirty[0] & /*lightningResult*/ 134217728) {
				set_style(div0, "color", lightningColor(/*lightningResult*/ ctx[27].status));
			}

			if (dirty[0] & /*lightningResult*/ 134217728 && t3_value !== (t3_value = (/*lightningResult*/ ctx[27].nearestBearing || 'mi') + "")) set_data(t3, t3_value);
			if (dirty[0] & /*lightningResult*/ 134217728 && t5_value !== (t5_value = /*lightningResult*/ ctx[27].strikeCount + "")) set_data(t5, t5_value);

			if (dirty[0] & /*lightningResult*/ 134217728 && t7_value !== (t7_value = (/*lightningResult*/ ctx[27].resumeAtISO
			? ` · all-clear in ${/*lightningResult*/ ctx[27].minutesUntilAllClear} min`
			: '') + "")) set_data(t7, t7_value);

			if (dirty[0] & /*lightningResult*/ 134217728) {
				set_style(div3, "color", lightningColor(/*lightningResult*/ ctx[27].status));
			}

			if (dirty[0] & /*lightningResult*/ 134217728 && t9_value !== (t9_value = (/*lightningResult*/ ctx[27].status === 'red'
			? 'STOP WORK — shelter now'
			: 'Storm approaching') + "")) set_data(t9, t9_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div6);
			}
		}
	};
}

// (403:55) 
function create_if_block_11(ctx) {
	let div1;

	return {
		c() {
			div1 = element("div");
			div1.innerHTML = `<div class="fg-metric-val svelte-sq5a06" style="font-size:13px;color:#16a34a">No strikes within your rings. Clear to work.</div>`;
			attr(div1, "class", "fg-metric svelte-sq5a06");
			set_style(div1, "padding", "8px 0");
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

// (401:10) {#if !lightningResult}
function create_if_block_10(ctx) {
	let div;

	let t_1_value = (/*lightningBusy*/ ctx[28]
	? 'Checking live strikes…'
	: 'No live strike data yet — refresh the site.') + "";

	let t_1;

	return {
		c() {
			div = element("div");
			t_1 = text(t_1_value);
			attr(div, "class", "fg-threshold-row svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t_1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*lightningBusy*/ 268435456 && t_1_value !== (t_1_value = (/*lightningBusy*/ ctx[28]
			? 'Checking live strikes…'
			: 'No live strike data yet — refresh the site.') + "")) set_data(t_1, t_1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (417:10) {#if lightningResult && lightningResult.rings}
function create_if_block_9(ctx) {
	let div;
	let each_value_4 = ensure_array_like(/*lightningResult*/ ctx[27].rings);
	let each_blocks = [];

	for (let i = 0; i < each_value_4.length; i += 1) {
		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "fg-threshold-row svelte-sq5a06");
			set_style(div, "opacity", "0.7");
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
			if (dirty[0] & /*lightningResult*/ 134217728) {
				each_value_4 = ensure_array_like(/*lightningResult*/ ctx[27].rings);
				let i;

				for (i = 0; i < each_value_4.length; i += 1) {
					const child_ctx = get_each_context_4(ctx, each_value_4, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_4.length;
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

// (418:62) {#each lightningResult.rings as r}
function create_each_block_4(ctx) {
	let t0;
	let t1_value = /*r*/ ctx[192].mi + "";
	let t1;
	let t2;
	let t3_value = /*r*/ ctx[192].count + "";
	let t3;
	let t4;

	return {
		c() {
			t0 = text("≤");
			t1 = text(t1_value);
			t2 = text("mi: ");
			t3 = text(t3_value);
			t4 = text("  ");
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
			insert(target, t2, anchor);
			insert(target, t3, anchor);
			insert(target, t4, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*lightningResult*/ 134217728 && t1_value !== (t1_value = /*r*/ ctx[192].mi + "")) set_data(t1, t1_value);
			if (dirty[0] & /*lightningResult*/ 134217728 && t3_value !== (t3_value = /*r*/ ctx[192].count + "")) set_data(t3, t3_value);
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
				detach(t2);
				detach(t3);
				detach(t4);
			}
		}
	};
}

// (425:6) {#if worstCaseMode && modelResults.length > 1}
function create_if_block_4(ctx) {
	let div1;
	let div0;
	let t0;

	let t1_value = (/*selectedHazard*/ ctx[5] === 'wind'
	? 'Wind'
	: /*selectedHazard*/ ctx[5] === 'rain'
		? 'Rain'
		: /*selectedHazard*/ ctx[5] === 'solar' ? 'Solar' : 'Heat') + "";

	let t1;
	let t2;
	let table;

	function select_block_type_12(ctx, dirty) {
		if (/*selectedHazard*/ ctx[5] === 'wind') return create_if_block_5;
		if (/*selectedHazard*/ ctx[5] === 'rain') return create_if_block_6;
		if (/*selectedHazard*/ ctx[5] === 'solar') return create_if_block_7;
		return create_else_block;
	}

	let current_block_type = select_block_type_12(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text("📊 Model Comparison — ");
			t1 = text(t1_value);
			t2 = space();
			table = element("table");
			if_block.c();
			attr(div0, "class", "fg-card-header svelte-sq5a06");
			attr(table, "class", "fg-table svelte-sq5a06");
			attr(div1, "class", "fg-card fg-card-flat svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div0, t1);
			append(div1, t2);
			append(div1, table);
			if_block.m(table, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*selectedHazard*/ 32 && t1_value !== (t1_value = (/*selectedHazard*/ ctx[5] === 'wind'
			? 'Wind'
			: /*selectedHazard*/ ctx[5] === 'rain'
				? 'Rain'
				: /*selectedHazard*/ ctx[5] === 'solar' ? 'Solar' : 'Heat') + "")) set_data(t1, t1_value);

			if (current_block_type === (current_block_type = select_block_type_12(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(table, null);
				}
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

// (464:12) {:else}
function create_else_block(ctx) {
	let thead;
	let t3;
	let tbody;
	let each_value_3 = ensure_array_like(/*modelResults*/ ctx[7]);
	let each_blocks = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	return {
		c() {
			thead = element("thead");
			thead.innerHTML = `<tr><th class="svelte-sq5a06">Model</th><th class="svelte-sq5a06">Zone</th><th class="svelte-sq5a06">App.T</th></tr>`;
			t3 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
		},
		m(target, anchor) {
			insert(target, thead, anchor);
			insert(target, t3, anchor);
			insert(target, tbody, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(tbody, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey, units*/ 272629760) {
				each_value_3 = ensure_array_like(/*modelResults*/ ctx[7]);
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
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
				detach(thead);
				detach(t3);
				detach(tbody);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (453:49) 
function create_if_block_7(ctx) {
	let thead;
	let t3;
	let tbody;
	let each_value_2 = ensure_array_like(/*modelResults*/ ctx[7]);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	return {
		c() {
			thead = element("thead");
			thead.innerHTML = `<tr><th class="svelte-sq5a06">Model</th><th class="svelte-sq5a06">Irradiance</th><th class="svelte-sq5a06">Band</th></tr>`;
			t3 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
		},
		m(target, anchor) {
			insert(target, thead, anchor);
			insert(target, t3, anchor);
			insert(target, tbody, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(tbody, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults, isDay*/ 1048704 | dirty[1] & /*cmpWorstKey*/ 268435456) {
				each_value_2 = ensure_array_like(/*modelResults*/ ctx[7]);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(thead);
				detach(t3);
				detach(tbody);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (441:48) 
function create_if_block_6(ctx) {
	let thead;
	let t4;
	let tbody;
	let each_value_1 = ensure_array_like(/*modelResults*/ ctx[7]);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			thead = element("thead");
			thead.innerHTML = `<tr><th class="svelte-sq5a06">Model</th><th class="svelte-sq5a06">Rate</th><th class="svelte-sq5a06">Intensity</th><th class="svelte-sq5a06">Risk</th></tr>`;
			t4 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
		},
		m(target, anchor) {
			insert(target, thead, anchor);
			insert(target, t4, anchor);
			insert(target, tbody, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(tbody, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey, units*/ 272629760) {
				each_value_1 = ensure_array_like(/*modelResults*/ ctx[7]);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(thead);
				detach(t4);
				detach(tbody);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (429:12) {#if selectedHazard === 'wind'}
function create_if_block_5(ctx) {
	let thead;
	let t4;
	let tbody;
	let each_value = ensure_array_like(/*modelResults*/ ctx[7]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			thead = element("thead");
			thead.innerHTML = `<tr><th class="svelte-sq5a06">Model</th><th class="svelte-sq5a06">Speed</th><th class="svelte-sq5a06">Beaufort</th><th class="svelte-sq5a06">Risk</th></tr>`;
			t4 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
		},
		m(target, anchor) {
			insert(target, thead, anchor);
			insert(target, t4, anchor);
			insert(target, tbody, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(tbody, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey, units*/ 272629760) {
				each_value = ensure_array_like(/*modelResults*/ ctx[7]);
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
				detach(thead);
				detach(t4);
				detach(tbody);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (467:16) {#each modelResults as mr}
function create_each_block_3(ctx) {
	let tr;
	let td0;
	let t0_value = /*mr*/ ctx[183].modelLabel + "";
	let t0;

	let t1_value = (/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
	? ' ⚡'
	: '') + "";

	let t1;
	let t2;
	let td1;
	let t3_value = /*mr*/ ctx[183].heat.zoneInfo.riskLabel + "";
	let t3;
	let t4;
	let td2;

	let t5_value = (/*mr*/ ctx[183].heat.apparentTempFinal === 999
	? 'NW'
	: fmtTemp(/*mr*/ ctx[183].heat.apparentTempFinal, /*units*/ ctx[53])) + "";

	let t5;
	let t6;
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
			attr(td0, "class", "svelte-sq5a06");
			set_style(td1, "color", /*mr*/ ctx[183].heat.zoneInfo.color);
			attr(td1, "class", "svelte-sq5a06");
			set_style(td2, "color", /*mr*/ ctx[183].heat.zoneInfo.color);
			attr(td2, "class", "svelte-sq5a06");

			attr(tr, "class", tr_class_value = "" + (null_to_empty(/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? 'fg-worst-row'
			: '') + " svelte-sq5a06"));
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
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 128 && t0_value !== (t0_value = /*mr*/ ctx[183].modelLabel + "")) set_data(t0, t0_value);

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey*/ 268435456 && t1_value !== (t1_value = (/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? ' ⚡'
			: '') + "")) set_data(t1, t1_value);

			if (dirty[0] & /*modelResults*/ 128 && t3_value !== (t3_value = /*mr*/ ctx[183].heat.zoneInfo.riskLabel + "")) set_data(t3, t3_value);

			if (dirty[0] & /*modelResults*/ 128) {
				set_style(td1, "color", /*mr*/ ctx[183].heat.zoneInfo.color);
			}

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*units*/ 4194304 && t5_value !== (t5_value = (/*mr*/ ctx[183].heat.apparentTempFinal === 999
			? 'NW'
			: fmtTemp(/*mr*/ ctx[183].heat.apparentTempFinal, /*units*/ ctx[53])) + "")) set_data(t5, t5_value);

			if (dirty[0] & /*modelResults*/ 128) {
				set_style(td2, "color", /*mr*/ ctx[183].heat.zoneInfo.color);
			}

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey*/ 268435456 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? 'fg-worst-row'
			: '') + " svelte-sq5a06"))) {
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

// (456:16) {#each modelResults as mr}
function create_each_block_2(ctx) {
	let tr;
	let td0;
	let t0_value = /*mr*/ ctx[183].modelLabel + "";
	let t0;

	let t1_value = (/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
	? ' ⚡'
	: '') + "";

	let t1;
	let t2;
	let td1;
	let t3_value = (/*mr*/ ctx[183].raw.solarWm2 ?? 0) + "";
	let t3;
	let t4;
	let t5;
	let td2;
	let t6_value = solarBand(/*mr*/ ctx[183].raw.solarWm2 ?? 0, /*isDay*/ ctx[20]).label + "";
	let t6;
	let t7;
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
			t4 = text(" W/m²");
			t5 = space();
			td2 = element("td");
			t6 = text(t6_value);
			t7 = space();
			attr(td0, "class", "svelte-sq5a06");
			attr(td1, "class", "svelte-sq5a06");
			set_style(td2, "color", solarBand(/*mr*/ ctx[183].raw.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
			attr(td2, "class", "svelte-sq5a06");

			attr(tr, "class", tr_class_value = "" + (null_to_empty(/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? 'fg-worst-row'
			: '') + " svelte-sq5a06"));
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, t0);
			append(td0, t1);
			append(tr, t2);
			append(tr, td1);
			append(td1, t3);
			append(td1, t4);
			append(tr, t5);
			append(tr, td2);
			append(td2, t6);
			append(tr, t7);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 128 && t0_value !== (t0_value = /*mr*/ ctx[183].modelLabel + "")) set_data(t0, t0_value);

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey*/ 268435456 && t1_value !== (t1_value = (/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? ' ⚡'
			: '') + "")) set_data(t1, t1_value);

			if (dirty[0] & /*modelResults*/ 128 && t3_value !== (t3_value = (/*mr*/ ctx[183].raw.solarWm2 ?? 0) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*modelResults, isDay*/ 1048704 && t6_value !== (t6_value = solarBand(/*mr*/ ctx[183].raw.solarWm2 ?? 0, /*isDay*/ ctx[20]).label + "")) set_data(t6, t6_value);

			if (dirty[0] & /*modelResults, isDay*/ 1048704) {
				set_style(td2, "color", solarBand(/*mr*/ ctx[183].raw.solarWm2 ?? 0, /*isDay*/ ctx[20]).color);
			}

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey*/ 268435456 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? 'fg-worst-row'
			: '') + " svelte-sq5a06"))) {
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

// (444:16) {#each modelResults as mr}
function create_each_block_1(ctx) {
	let tr;
	let td0;
	let t0_value = /*mr*/ ctx[183].modelLabel + "";
	let t0;

	let t1_value = (/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
	? ' ⚡'
	: '') + "";

	let t1;
	let t2;
	let td1;
	let t3_value = fmtRain(/*mr*/ ctx[183].raw.rainMmH ?? 0, /*units*/ ctx[53]) + "";
	let t3;
	let t4;
	let td2;
	let t5_value = /*mr*/ ctx[183].rain.intensityLabel + "";
	let t5;
	let t6;
	let td3;
	let t7_value = /*mr*/ ctx[183].rain.riskLabel + "";
	let t7;
	let t8;
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
			t8 = space();
			attr(td0, "class", "svelte-sq5a06");
			attr(td1, "class", "svelte-sq5a06");
			attr(td2, "class", "svelte-sq5a06");
			set_style(td3, "color", /*mr*/ ctx[183].rain.riskColor);
			attr(td3, "class", "svelte-sq5a06");

			attr(tr, "class", tr_class_value = "" + (null_to_empty(/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? 'fg-worst-row'
			: '') + " svelte-sq5a06"));
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
			append(tr, t8);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 128 && t0_value !== (t0_value = /*mr*/ ctx[183].modelLabel + "")) set_data(t0, t0_value);

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey*/ 268435456 && t1_value !== (t1_value = (/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? ' ⚡'
			: '') + "")) set_data(t1, t1_value);

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*units*/ 4194304 && t3_value !== (t3_value = fmtRain(/*mr*/ ctx[183].raw.rainMmH ?? 0, /*units*/ ctx[53]) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*modelResults*/ 128 && t5_value !== (t5_value = /*mr*/ ctx[183].rain.intensityLabel + "")) set_data(t5, t5_value);
			if (dirty[0] & /*modelResults*/ 128 && t7_value !== (t7_value = /*mr*/ ctx[183].rain.riskLabel + "")) set_data(t7, t7_value);

			if (dirty[0] & /*modelResults*/ 128) {
				set_style(td3, "color", /*mr*/ ctx[183].rain.riskColor);
			}

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey*/ 268435456 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? 'fg-worst-row'
			: '') + " svelte-sq5a06"))) {
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

// (432:16) {#each modelResults as mr}
function create_each_block(ctx) {
	let tr;
	let td0;
	let t0_value = /*mr*/ ctx[183].modelLabel + "";
	let t0;

	let t1_value = (/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
	? ' ⚡'
	: '') + "";

	let t1;
	let t2;
	let td1;
	let t3_value = fmtWind(/*mr*/ ctx[183].raw.windMs ?? 0, /*units*/ ctx[53]) + "";
	let t3;
	let t4;
	let td2;
	let t5;
	let t6_value = /*mr*/ ctx[183].wind.beaufort + "";
	let t6;
	let t7;
	let td3;
	let t8_value = /*mr*/ ctx[183].wind.riskLabel + "";
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
			t5 = text("Bft ");
			t6 = text(t6_value);
			t7 = space();
			td3 = element("td");
			t8 = text(t8_value);
			t9 = space();
			attr(td0, "class", "svelte-sq5a06");
			attr(td1, "class", "svelte-sq5a06");
			attr(td2, "class", "svelte-sq5a06");
			set_style(td3, "color", /*mr*/ ctx[183].wind.riskColor);
			attr(td3, "class", "svelte-sq5a06");

			attr(tr, "class", tr_class_value = "" + (null_to_empty(/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? 'fg-worst-row'
			: '') + " svelte-sq5a06"));
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
			append(td2, t6);
			append(tr, t7);
			append(tr, td3);
			append(td3, t8);
			append(tr, t9);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*modelResults*/ 128 && t0_value !== (t0_value = /*mr*/ ctx[183].modelLabel + "")) set_data(t0, t0_value);

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey*/ 268435456 && t1_value !== (t1_value = (/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? ' ⚡'
			: '') + "")) set_data(t1, t1_value);

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*units*/ 4194304 && t3_value !== (t3_value = fmtWind(/*mr*/ ctx[183].raw.windMs ?? 0, /*units*/ ctx[53]) + "")) set_data(t3, t3_value);
			if (dirty[0] & /*modelResults*/ 128 && t6_value !== (t6_value = /*mr*/ ctx[183].wind.beaufort + "")) set_data(t6, t6_value);
			if (dirty[0] & /*modelResults*/ 128 && t8_value !== (t8_value = /*mr*/ ctx[183].wind.riskLabel + "")) set_data(t8, t8_value);

			if (dirty[0] & /*modelResults*/ 128) {
				set_style(td3, "color", /*mr*/ ctx[183].wind.riskColor);
			}

			if (dirty[0] & /*modelResults*/ 128 | dirty[1] & /*cmpWorstKey*/ 268435456 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*mr*/ ctx[183].modelKey === /*cmpWorstKey*/ ctx[59]
			? 'fg-worst-row'
			: '') + " svelte-sq5a06"))) {
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
	let span0;
	let t1;
	let div2;
	let t5;
	let span1;

	let t6_value = (/*isPro*/ ctx[13]
	? /*licenseTier*/ ctx[8] === 'site' ? 'SITE' : 'PRO'
	: 'FREE') + "";

	let t6;
	let span1_class_value;
	let t7;
	let button;
	let t8_value = (/*tab*/ ctx[15] === 'settings' ? '← Back' : '⚙ Config') + "";
	let t8;
	let t9;
	let div4;
	let t10;
	let mounted;
	let dispose;
	let each_value_19 = ensure_array_like(/*TABS*/ ctx[61]);
	let each_blocks = [];

	for (let i = 0; i < each_value_19.length; i += 1) {
		each_blocks[i] = create_each_block_19(get_each_context_19(ctx, each_value_19, i));
	}

	function select_block_type(ctx, dirty) {
		if (/*tab*/ ctx[15] === 'dashboard') return create_if_block;
		if (/*tab*/ ctx[15] === 'emergency') return create_if_block_43;
		if (/*tab*/ ctx[15] === 'report') return create_if_block_52;
		if (/*tab*/ ctx[15] === 'settings') return create_if_block_56;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	return {
		c() {
			section = element("section");
			div3 = element("div");
			span0 = element("span");
			span0.textContent = "🛡️";
			t1 = space();
			div2 = element("div");
			div2.innerHTML = `<div class="fg-title svelte-sq5a06">FieldGuard</div> <div class="fg-subtitle svelte-sq5a06">Heat · Cold · Wind · Rain · Storm</div>`;
			t5 = space();
			span1 = element("span");
			t6 = text(t6_value);
			t7 = space();
			button = element("button");
			t8 = text(t8_value);
			t9 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t10 = space();
			if (if_block) if_block.c();
			attr(span0, "class", "fg-logo svelte-sq5a06");
			attr(div2, "class", "fg-titlewrap svelte-sq5a06");
			attr(span1, "class", span1_class_value = "fg-tier " + (/*isPro*/ ctx[13] ? 'pro' : 'free') + " svelte-sq5a06");
			attr(button, "class", "fg-settings-btn svelte-sq5a06");
			attr(div3, "class", "fg-header svelte-sq5a06");
			attr(div4, "class", "fg-tabs svelte-sq5a06");
			attr(section, "class", "plugin__content fieldguard svelte-sq5a06");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, div3);
			append(div3, span0);
			append(div3, t1);
			append(div3, div2);
			append(div3, t5);
			append(div3, span1);
			append(span1, t6);
			append(div3, t7);
			append(div3, button);
			append(button, t8);
			append(section, t9);
			append(section, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			append(section, t10);
			if (if_block) if_block.m(section, null);

			if (!mounted) {
				dispose = [
					listen(button, "click", /*click_handler*/ ctx[87]),
					listen(section, "keydown", stop_propagation(keydown_handler_3)),
					listen(section, "keyup", stop_propagation(keyup_handler))
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*isPro, licenseTier*/ 8448 && t6_value !== (t6_value = (/*isPro*/ ctx[13]
			? /*licenseTier*/ ctx[8] === 'site' ? 'SITE' : 'PRO'
			: 'FREE') + "")) set_data(t6, t6_value);

			if (dirty[0] & /*isPro*/ 8192 && span1_class_value !== (span1_class_value = "fg-tier " + (/*isPro*/ ctx[13] ? 'pro' : 'free') + " svelte-sq5a06")) {
				attr(span1, "class", span1_class_value);
			}

			if (dirty[0] & /*tab*/ 32768 && t8_value !== (t8_value = (/*tab*/ ctx[15] === 'settings' ? '← Back' : '⚙ Config') + "")) set_data(t8, t8_value);

			if (dirty[0] & /*tab*/ 32768 | dirty[1] & /*TABS*/ 1073741824) {
				each_value_19 = ensure_array_like(/*TABS*/ ctx[61]);
				let i;

				for (i = 0; i < each_value_19.length; i += 1) {
					const child_ctx = get_each_context_19(ctx, each_value_19, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_19(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_19.length;
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
			run_all(dispose);
		}
	};
}

const MONITOR_API = 'https://fieldguard-monitor.almarhoobimoza.workers.dev';
const LIGHTNING_API = 'https://fieldguard-hse.com/api/lightning';
const LICENSE_API = 'https://fieldguard-hse.com/api/validate';

function lightningColor(s) {
	return s === 'red'
	? '#dc2626'
	: s === 'warning'
		? '#f59e0b'
		: s === 'advisory' ? '#3b82f6' : '#16a34a';
}

function lightningLabel(s) {
	return s === 'red'
	? 'STOP WORK'
	: s === 'warning'
		? 'WARNING'
		: s === 'advisory' ? 'ADVISORY' : 'CLEAR';
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

function focusInput(node) {
	node.focus();
	node.select();
}

function fmtAdj(c, u) {
	if (u === 'imperial') {
		const f = c * 1.8;
		return `+${Number.isInteger(f) ? f : f.toFixed(1)}°F`;
	}

	return `+${c}°C`;
}

function ringLbl(mi, u) {
	return u === 'imperial'
	? `${mi} mi`
	: `${(mi * 1.60934).toFixed(1)} km`;
}

const func_1 = h => h.icon;

const keydown_handler_3 = () => {
	
};

const keyup_handler = () => {
	
};

function instance($$self, $$props, $$invalidate) {
	let cmpWorstKey;
	let isPro;
	let isSite;
	let units;
	let canAddMore;
	let activeSiteLabel;
	let activeIsSaved;
	let tempStatus;
	let coldDominates;
	let sosHazards;
	let tab = 'dashboard';
	let lat = 23.6, lon = 58.6;
	let locationName = '';
	let loading = false, error = '';
	let currentTime = '';
	let locked = false;
	let isDay = true;
	let sunElevation = 0;
	let countryCode = '', countryName = '';
	let activeBan = null;
	let geocodedFor = '';
	let rawData = null;
	let heat = null;
	let windResult = null;
	let rainResult = null;
	let coldResult = null;
	let thunderResult = null;
	let lightningResult = null;
	let lightningBusy = false;
	let selectedHazard = 'heat';
	let emgHazard = 'heat';
	let modelResults = [];
	let forecastList = [];
	let forecastBusy = false;
	let forecastNote = '';
	let licenseKey = '';
	let licenseTier = '';
	let licenseExpires = '';
	let licenseMsg = '';
	let licenseChecking = false;
	let worstModelLabel = '';
	let selectedModel = 'ecmwf';
	let worstCaseMode = true;
	let alertLog = [];
	let reportText = '';
	let autoRefreshTimer = null;
	let alertEmail = '';
	let monitorMsg = '';
	let monitorBusy = false;
	let monitoredSites = [];
	let savedSites = [];
	let activeSiteId = '';
	let newSiteName = '';
	let coordInput = '';
	let editingSiteId = '';
	let editName = '';
	let isStale = false, staleTime = '';
	let bgStatus = {};

	function maxSites() {
		if (!isPro) return 1;
		return licenseTier === 'site' ? 10 : 3;
	}

	function canAddSite() {
		return savedSites.length < maxSites();
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
		{
			key: 'ecmwf',
			label: 'ECMWF',
			om: 'ecmwf_ifs025'
		},
		{
			key: 'gfs',
			label: 'GFS',
			om: 'gfs_global'
		},
		{
			key: 'icon',
			label: 'ICON',
			om: 'icon_global'
		},
		{
			key: 'gem',
			label: 'GEM',
			om: 'gem_global'
		},
		{
			key: 'arpege',
			label: 'ARPEGE',
			om: 'meteofrance_arpege_world'
		},
		{
			key: 'access',
			label: 'ACCESS-G',
			om: 'bom_access_global'
		}
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
		autoRefresh: false,
		units: 'metric',
		winterMode: 'auto',
		lightningRadiusKm: 10,
		lightningStopInnerMi: 6,
		lightningStopMi: 8,
		lightningWarnMi: 10,
		lightningAdvisoryMi: 20,
		lightningAllClearMin: 30,
		forecastAlerts: false,
		forecastDays: 1,
		monitorHazards: {
			heat: true,
			cold: true,
			wind: true,
			rain: true,
			thunder: true,
			solar: true,
			lightning: false
		}
	};

	let settings = { ...DEFAULT_SETTINGS };

	let reportMeta = {
		projectName: '',
		contractNumber: '',
		country: '',
		clientName: '',
		contractorName: '',
		hseManagerName: '',
		regulatoryRef: '',
		banStart: '12:30',
		banEnd: '15:30',
		banMonths: 'June, July, August',
		fidic: 'UNDER REVIEW',
		delayDays: 0
	};

	async function fetchModelData(modelKey) {
		try {
			const m = MODELS.find(x => x.key === modelKey);
			const om = m ? m.om : 'best_match';
			const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` + `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,shortwave_radiation,cloud_cover` + `&hourly=cape&wind_speed_unit=ms&forecast_days=1&models=${om}`;
			const res = await fetch(url);
			if (!res.ok) return null;
			const j = await res.json();
			const c = j && j.current;
			if (!c || c.temperature_2m === undefined || c.temperature_2m === null) return null;
			let capeJkg;
			const capeArr = j && j.hourly && j.hourly.cape;

			if (Array.isArray(capeArr) && capeArr.length && capeArr[0] !== null && capeArr[0] !== undefined) {
				capeJkg = Math.max(0, Math.round(capeArr[0]));
			}

			return {
				tempC: Math.round(c.temperature_2m * 10) / 10,
				humidity: Math.min(100, Math.max(0, Math.round(c.relative_humidity_2m ?? 50))),
				windMs: Math.max(0, Math.round((c.wind_speed_10m ?? 0) * 10) / 10),
				solarWm2: Math.max(0, Math.round(c.shortwave_radiation ?? 0)),
				rainMmH: Math.max(0, Math.round((c.precipitation ?? 0) * 10) / 10),
				cloudCoverPct: c.cloud_cover != null
				? Math.min(100, Math.max(0, Math.round(c.cloud_cover)))
				: undefined,
				capeJkg
			};
		} catch {
			return null;
		}
	}

	async function fetchForecastSeries() {
		try {
			const om = MODELS.find(x => x.key === selectedModel)?.om ?? 'best_match';
			const days = Math.min(3, Math.max(1, settings.forecastDays || 1));
			const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` + `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,shortwave_radiation,cape,cloud_cover` + `&wind_speed_unit=ms&forecast_days=${days}&models=${om}`;
			const res = await fetch(url);
			if (!res.ok) return null;
			const j = await res.json();
			const h = j && j.hourly;
			if (!h || !Array.isArray(h.time) || !h.time.length) return null;
			const n = h.time.length;
			const at = (arr, i, d = 0) => Array.isArray(arr) && arr[i] != null ? arr[i] : d;
			const series = [];

			for (let i = 0; i < n; i++) {
				series.push({
					tempC: at(h.temperature_2m, i),
					humidity: Math.min(100, Math.max(0, at(h.relative_humidity_2m, i, 50))),
					windMs: Math.max(0, at(h.wind_speed_10m, i)),
					solarWm2: Math.max(0, at(h.shortwave_radiation, i)),
					rainMmH: Math.max(0, at(h.precipitation, i)),
					cloudCoverPct: Array.isArray(h.cloud_cover) && h.cloud_cover[i] != null
					? Math.min(100, Math.max(0, Math.round(h.cloud_cover[i])))
					: undefined,
					capeJkg: Array.isArray(h.cape) && h.cape[i] != null
					? Math.max(0, Math.round(h.cape[i]))
					: undefined
				});
			}

			return { times: h.time, series };
		} catch {
			return null;
		}
	}

	function scanForecast(times, series) {
		const nowMs = Date.now();

		const windSev = l => ({
			SAFE: 0,
			CAUTION: 1,
			WARNING: 2,
			DANGER: 3
		})[l] ?? 0;

		const rainSev = l => ({
			CLEAR: 0,
			CAUTION: 1,
			WARNING: 2,
			DANGER: 3
		})[l] ?? 0;

		const coldSev = l => ({
			SAFE: 0,
			'MILD COLD': 0,
			COOL: 1,
			COLD: 2,
			'VERY COLD': 3,
			EXTREME: 4,
			DANGER: 5
		})[l] ?? 0;

		const thunSev = l => ({
			'N/A': 0,
			LOW: 0,
			MODERATE: 1,
			HIGH: 2,
			SEVERE: 3
		})[l] ?? 0;

		const solarSev = l => ({
			NIGHT: 0,
			LOW: 0,
			MODERATE: 1,
			HIGH: 2,
			EXTREME: 3
		})[l] ?? 0;

		const defs = [
			{
				key: 'heat',
				icon: '🌡️',
				label: 'Heat',
				enabled: true,
				exceeds: a => a.heat.zone !== 'green',
				sev: a => zoneSeverity(a.heat.zone),
				lbl: a => ({
					label: a.heat.zoneInfo.riskLabel,
					color: a.heat.zoneInfo.color
				})
			},
			{
				key: 'wind',
				icon: '💨',
				label: 'Wind',
				enabled: true,
				exceeds: a => a.wind.exceedsThreshold,
				sev: a => windSev(a.wind.riskLabel),
				lbl: a => ({
					label: a.wind.riskLabel,
					color: a.wind.riskColor
				})
			},
			{
				key: 'rain',
				icon: '🌧️',
				label: 'Rain',
				enabled: true,
				exceeds: a => a.rain.exceedsThreshold,
				sev: a => rainSev(a.rain.riskLabel),
				lbl: a => ({
					label: a.rain.riskLabel,
					color: a.rain.riskColor
				})
			},
			{
				key: 'thunder',
				icon: '⛈️',
				label: 'Thunderstorm',
				enabled: true,
				exceeds: a => a.thunder.exceedsThreshold,
				sev: a => thunSev(a.thunder.riskLabel),
				lbl: a => ({
					label: a.thunder.riskLabel,
					color: a.thunder.riskColor
				})
			},
			{
				key: 'cold',
				icon: '❄️',
				label: 'Cold',
				enabled: settings.winterMode !== 'off',
				exceeds: a => a.cold.exceedsThreshold,
				sev: a => coldSev(a.cold.riskLabel),
				lbl: a => ({
					label: a.cold.riskLabel,
					color: a.cold.riskColor
				})
			},
			{
				key: 'solar',
				icon: '☀️',
				label: 'Solar',
				enabled: true,
				exceeds: (_a, inp, day) => solarSev(solarBand(inp.solarWm2, day).label) >= 2,
				sev: (_a, inp, day) => solarSev(solarBand(inp.solarWm2, day).label),
				lbl: (_a, inp, day) => solarBand(inp.solarWm2, day)
			}
		];

		const out = [];

		for (const d of defs) {
			if (!d.enabled || !isMonitored(d.key)) continue;
			let firstISO = null, firstLocal = null, hoursAway = null;
			let peakSev = -1, peakLabel = '', peakColor = '';

			for (let i = 0; i < times.length; i++) {
				const t = new Date(times[i]);
				const tMs = t.getTime();
				if (tMs < nowMs - 30 * 60 * 1000) continue;
				const day = isDaytime(lat, lon, t);
				const a = assessAt(series[i], t);
				if (!d.exceeds(a, series[i], day)) continue;

				if (firstISO === null) {
					firstISO = times[i];

					firstLocal = t.toLocaleString([], {
						weekday: 'short',
						hour: '2-digit',
						minute: '2-digit'
					});

					hoursAway = Math.max(0, Math.round((tMs - nowMs) / 3600000));
				}

				const s = d.sev(a, series[i], day);

				if (s > peakSev) {
					peakSev = s;
					const info = d.lbl(a, series[i], day);
					peakLabel = info.label;
					peakColor = info.color;
				}
			}

			if (firstISO !== null) {
				out.push({
					hazard: d.key,
					icon: d.icon,
					label: d.label,
					willExceed: true,
					firstISO,
					firstLocal,
					hoursAway,
					peakLabel,
					peakColor
				});
			}
		}

		out.sort((a, b) => (a.hoursAway ?? 0) - (b.hoursAway ?? 0));
		return out;
	}

	async function runLightning() {
		if (!isSite || !settings.monitorHazards.lightning || !licenseKey) {
			$$invalidate(27, lightningResult = null);
			return;
		}

		$$invalidate(28, lightningBusy = true);

		try {
			const body = {
				key: licenseKey,
				lat,
				lon,
				rings: [
					{
						mi: settings.lightningStopInnerMi,
						level: 'red',
						label: 'Stop work'
					},
					{
						mi: settings.lightningStopMi,
						level: 'red',
						label: 'Stop work'
					},
					{
						mi: settings.lightningWarnMi,
						level: 'warning',
						label: 'Prepare to suspend'
					},
					{
						mi: settings.lightningAdvisoryMi,
						level: 'advisory',
						label: 'Monitor'
					}
				],
				allClearMinutes: settings.lightningAllClearMin
			};

			const r = await fetch(LIGHTNING_API, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			const j = await r.json();
			$$invalidate(27, lightningResult = j && j.ok ? j : null);
		} catch {
			$$invalidate(27, lightningResult = null);
		}

		$$invalidate(28, lightningBusy = false);
	}

	async function runForecast() {
		if (!isSite || !settings.forecastAlerts) {
			$$invalidate(29, forecastList = []);
			$$invalidate(31, forecastNote = '');
			return;
		}

		$$invalidate(30, forecastBusy = true);
		$$invalidate(31, forecastNote = '');

		try {
			const data = await fetchForecastSeries();

			if (!data) {
				$$invalidate(29, forecastList = []);
				$$invalidate(31, forecastNote = 'Forecast unavailable for this model — try another.');
				$$invalidate(30, forecastBusy = false);
				return;
			}

			$$invalidate(29, forecastList = scanForecast(data.times, data.series));
			const horizon = horizonLabel();

			$$invalidate(31, forecastNote = forecastList.length
			? `Next ${horizon}: ${forecastList.length} hazard${forecastList.length > 1 ? 's' : ''} forecast to cross thresholds.`
			: `No threshold crossings forecast in the next ${horizon}.`);

			const urgent = forecastList.find(f => (/DANGER|RED|PURPLE|BLACK|SEVERE|EXTREME|VERY COLD/).test(f.peakLabel));

			if (settings.soundAlerts && urgent) {
				triggerNotification(`⏱ Forecast: ${urgent.label} ${urgent.peakLabel}`, `Expected ${urgent.hoursAway === 0
				? 'within the hour'
				: `in ~${urgent.hoursAway} h`} (${urgent.firstLocal})`);
			}
		} catch {
			$$invalidate(29, forecastList = []);
			$$invalidate(31, forecastNote = 'Forecast scan failed.');
		}

		$$invalidate(30, forecastBusy = false);
	}

	function horizonLabel() {
		const d = Math.min(3, Math.max(1, settings.forecastDays || 1));
		return d === 1 ? '24 h' : `${d * 24} h`;
	}

	async function resolveCountry() {
		const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
		if (key === geocodedFor) return;
		geocodedFor = key;

		try {
			const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
			const j = await (await fetch(url)).json();
			countryCode = j.countryCode || '';
			countryName = j.countryName || '';
			$$invalidate(2, locationName = [j.city || j.locality, j.principalSubdivision, countryName].filter(Boolean).join(', '));
			$$invalidate(22, activeBan = getMiddayBan(countryCode));
		} catch {
			countryCode = '';
			countryName = '';
			$$invalidate(22, activeBan = null);
		}
	}

	function assessAt(inputs, when) {
		const localHour = when.getUTCHours() + lon / 15;
		const month = when.getMonth() + 1;

		return {
			heat: assessHeatStress(inputs, settings.ppeProfile, localHour, month, activeBan),
			wind: assessWind(inputs.windMs, settings.windWarnMs, settings.windDangerMs),
			rain: assessRain(inputs.rainMmH, settings.rainWarnMmh, settings.rainDangerMmh),
			cold: assessColdStress(inputs.tempC, inputs.windMs),
			thunder: assessThunderstorm(inputs.capeJkg, inputs.cloudCoverPct, inputs.rainMmH)
		};
	}

	function processInputs(inputs) {
		const now = new Date();
		$$invalidate(20, isDay = isDaytime(lat, lon, now));
		$$invalidate(21, sunElevation = solarElevationDeg(lat, lon, now));
		return assessAt(inputs, now);
	}

	function currentHazardStatus(key) {
		switch (key) {
			case 'heat':
				return heat
				? {
						label: heat.zoneInfo.riskLabel,
						color: heat.zoneInfo.color
					}
				: null;
			case 'wind':
				return windResult
				? {
						label: windResult.riskLabel,
						color: windResult.riskColor
					}
				: null;
			case 'rain':
				return rainResult
				? {
						label: rainResult.riskLabel,
						color: rainResult.riskColor
					}
				: null;
			case 'cold':
				return coldResult && coldResult.active
				? {
						label: coldResult.riskLabel,
						color: coldResult.riskColor
					}
				: null;
			case 'thunder':
				return thunderResult && thunderResult.available
				? {
						label: thunderResult.riskLabel,
						color: thunderResult.riskColor
					}
				: null;
			case 'solar':
				if (!rawData) return null;
				{
					const b = solarBand(rawData.solarWm2, isDay);
					return { label: b.label, color: b.color };
				}
			default:
				return null;
		}
	}

	const COLOR_SEV = {
		'#16a34a': 0,
		'#22c55e': 0,
		'#d97706': 1,
		'#f59e0b': 1,
		'#f97316': 2,
		'#dc2626': 3,
		'#ef4444': 3,
		'#7c3aed': 4,
		'#a855f7': 4,
		'#6b7280': 5,
		'#111827': 5,
		'#030712': 5
	};

	function sev(hex) {
		return COLOR_SEV[(hex || '').toLowerCase()] ?? 0;
	}

	function worstStatus(items) {
		let best = null, bestSev = -1;

		for (const { key, st } of items) {
			if (!st || !isMonitored(key)) continue;
			const sv = sev(st.color);

			if (sv > bestSev) {
				bestSev = sv;
				best = st;
			}
		}

		return best;
	}

	function isMonitored(key) {
		if (settings.monitorHazards?.[key] === false) return false;
		if (key === 'cold' && settings.winterMode === 'off') return false;
		return true;
	}

	function showColdCard(c) {
		if (!isPro || !c) return false;
		if (settings.winterMode === 'off') return false;
		if (settings.winterMode === 'on') return true;
		return c.active;
	}

	async function refreshData() {
		$$invalidate(16, loading = true);
		$$invalidate(17, error = '');
		$$invalidate(18, currentTime = new Date().toLocaleTimeString());

		try {
			await resolveCountry();
			const results = [];

			if (worstCaseMode) {
				for (const model of MODELS) {
					const inputs = await fetchModelData(model.key);
					if (!inputs) continue;
					const { heat: h, wind: w, rain: r, cold: cd, thunder: th } = processInputs(inputs);

					results.push({
						modelKey: model.key,
						modelLabel: model.label,
						raw: inputs,
						heat: h,
						wind: w,
						rain: r,
						cold: cd,
						thunder: th,
						isWorst: false
					});
				}
			}

			if (results.length === 0) {
				const inputs = await fetchModelData(selectedModel);
				if (!inputs) throw new Error('No data available');
				const { heat: h, wind: w, rain: r, cold: cd, thunder: th } = processInputs(inputs);

				results.push({
					modelKey: selectedModel,
					modelLabel: MODELS.find(m => m.key === selectedModel)?.label ?? selectedModel,
					raw: inputs,
					heat: h,
					wind: w,
					rain: r,
					cold: cd,
					thunder: th,
					isWorst: true
				});
			}

			$$invalidate(7, modelResults = results);

			if (results.length === 1) {
				results[0].isWorst = true;
				$$invalidate(23, rawData = results[0].raw);
				$$invalidate(3, heat = results[0].heat);
				$$invalidate(24, windResult = results[0].wind);
				$$invalidate(25, rainResult = results[0].rain);
				$$invalidate(4, coldResult = results[0].cold);
				$$invalidate(26, thunderResult = results[0].thunder);
				$$invalidate(36, worstModelLabel = results[0].modelLabel);
			} else {
				const worstBy = (sel, better) => results.reduce((best, r) => better(sel(r), sel(best)) ? r : best, results[0]);

				const heatW = [...results].sort((a, b) => {
					const zd = zoneSeverity(b.heat.zone) - zoneSeverity(a.heat.zone);
					if (zd !== 0) return zd;

					return (b.heat.apparentTempFinal === 999
					? 99
					: b.heat.apparentTempFinal) - (a.heat.apparentTempFinal === 999
					? 99
					: a.heat.apparentTempFinal);
				})[0];

				const windW = worstBy(r => r.raw.windMs ?? 0, (a, b) => a > b);
				const rainW = worstBy(r => r.raw.rainMmH ?? 0, (a, b) => a > b);
				const capeW = worstBy(r => r.raw.capeJkg ?? 0, (a, b) => a > b);
				const coldW = worstBy(r => r.cold?.windChillC ?? 999, (a, b) => a < b);
				const solarMax = Math.max(...results.map(r => r.raw.solarWm2 ?? 0));
				results.forEach(r => r.isWorst = false);
				heatW.isWorst = true;
				$$invalidate(3, heat = heatW.heat);
				$$invalidate(24, windResult = windW.wind);
				$$invalidate(25, rainResult = rainW.rain);
				$$invalidate(4, coldResult = coldW.cold);
				$$invalidate(26, thunderResult = capeW.thunder);
				$$invalidate(36, worstModelLabel = heatW.modelLabel);

				$$invalidate(23, rawData = {
					tempC: heatW.raw.tempC,
					humidity: heatW.raw.humidity,
					windMs: windW.raw.windMs,
					solarWm2: solarMax,
					rainMmH: rainW.raw.rainMmH,
					capeJkg: capeW.raw.capeJkg,
					cloudCoverPct: capeW.raw.cloudCoverPct
				});
			}

			$$invalidate(48, isStale = false);
			if (rawData) cacheReading(rawData);

			if (activeSiteId && heat) {
				const w = worstStatus(['heat', 'cold', 'wind', 'rain', 'thunder', 'solar'].map(k => ({ key: k, st: currentHazardStatus(k) }))) || {
					color: heat.zoneInfo.color,
					label: heat.zoneInfo.riskLabel
				};

				$$invalidate(50, bgStatus = {
					...bgStatus,
					[activeSiteId]: {
						color: w.color,
						label: w.label,
						time: new Date().toLocaleTimeString()
					}
				});
			}

			checkAlerts();
			runForecast();
			runLightning();
		} catch(e) {
			const cached = loadCachedReading();

			if (cached) {
				const { heat: h, wind: w, rain: r, cold: cd, thunder: th } = processInputs(cached.inputs);
				$$invalidate(23, rawData = cached.inputs);
				$$invalidate(3, heat = h);
				$$invalidate(24, windResult = w);
				$$invalidate(25, rainResult = r);
				$$invalidate(4, coldResult = cd);
				$$invalidate(26, thunderResult = th);

				$$invalidate(7, modelResults = [
					{
						modelKey: selectedModel,
						modelLabel: 'cached',
						raw: cached.inputs,
						heat: h,
						wind: w,
						rain: r,
						cold: cd,
						thunder: th,
						isWorst: true
					}
				]);

				$$invalidate(36, worstModelLabel = 'cached');
				$$invalidate(48, isStale = true);
				$$invalidate(49, staleTime = cached.time);
				$$invalidate(17, error = '');
			} else {
				$$invalidate(17, error = 'Failed to fetch data. Check network or try a different model.');
			}
		}

		$$invalidate(16, loading = false);
	}

	function checkAlerts() {
		if (!heat || !windResult || !rainResult) return;
		const time = new Date().toLocaleTimeString();

		if (isMonitored('heat') && heat.zone !== 'green') {
			const entry = {
				time,
				type: `🌡 HEAT — ${heat.zoneInfo.riskLabel}`,
				color: heat.zoneInfo.color,
				message: `App.Temp: ${heat.apparentTempFinal === 999
				? 'NO WORK'
				: heat.apparentTempFinal + '°C'} | ${heat.zoneInfo.label}`
			};

			$$invalidate(38, alertLog = [...alertLog, entry]);

			if (settings.soundAlerts && (heat.zone === 'red' || heat.zone === 'purple' || heat.zone === 'black')) {
				triggerNotification(entry.type, entry.message);
			}
		}

		if (isMonitored('wind') && windResult.exceedsThreshold) {
			const entry = {
				time,
				type: '💨 WIND ALERT',
				color: windResult.riskColor,
				message: `${rawData?.windMs.toFixed(1)} m/s — Bft ${windResult.beaufort} (${windResult.beaufortDesc})`
			};

			$$invalidate(38, alertLog = [...alertLog, entry]);
			if (settings.soundAlerts) triggerNotification(entry.type, entry.message);
		}

		if (isMonitored('rain') && rainResult.exceedsThreshold) {
			const entry = {
				time,
				type: '🌧 RAIN ALERT',
				color: rainResult.riskColor,
				message: `${rawData?.rainMmH.toFixed(1)} mm/h — ${rainResult.intensityLabel}`
			};

			$$invalidate(38, alertLog = [...alertLog, entry]);
			if (settings.soundAlerts) triggerNotification(entry.type, entry.message);
		}

		if (isPro && isMonitored('cold') && coldResult && coldResult.exceedsThreshold) {
			const entry = {
				time,
				type: `❄ COLD — ${coldResult.riskLabel}`,
				color: coldResult.riskColor,
				message: `Wind chill ${fmtTemp(coldResult.windChillC, units)} — ${coldResult.frostbite}`
			};

			$$invalidate(38, alertLog = [...alertLog, entry]);
			if (settings.soundAlerts) triggerNotification(entry.type, entry.message);
		}

		if (isPro && isMonitored('thunder') && thunderResult && thunderResult.exceedsThreshold) {
			const entry = {
				time,
				type: `⛈ STORM — ${thunderResult.riskLabel}`,
				color: thunderResult.riskColor,
				message: `CAPE ${thunderResult.capeJkg} J/kg — ${thunderResult.instability}`
			};

			$$invalidate(38, alertLog = [...alertLog, entry]);
			if (settings.soundAlerts) triggerNotification(entry.type, entry.message);
		}

		const sBand = solarBand(rawData?.solarWm2 ?? 0, isDay);

		if (isMonitored('solar') && (sBand.label === 'HIGH' || sBand.label === 'EXTREME')) {
			const entry = {
				time,
				type: `☀ SOLAR — ${sBand.label}`,
				color: sBand.color,
				message: `${rawData?.solarWm2 ?? 0} W/m² — high solar heat load`
			};

			$$invalidate(38, alertLog = [...alertLog, entry]);
			if (settings.soundAlerts) triggerNotification(entry.type, entry.message);
		}

		if (heat.isBanPeriod) {
			$$invalidate(38, alertLog = [
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
		$$invalidate(12, settings = { ...DEFAULT_SETTINGS });
		saveSettings();
	}

	function setupAutoRefresh() {
		if (autoRefreshTimer) {
			clearInterval(autoRefreshTimer);
			autoRefreshTimer = null;
		}

		if (settings.autoRefresh) autoRefreshTimer = setInterval(backgroundTick, 15 * 60 * 1000);
	}

	function loadLicense() {
		try {
			const s = localStorage.getItem('fieldguard_license');
			if (!s) return;
			const o = JSON.parse(s);

			if (o && o.tier && o.expires && new Date(o.expires) > new Date()) {
				$$invalidate(32, licenseKey = o.key || '');
				$$invalidate(8, licenseTier = o.tier);
				$$invalidate(33, licenseExpires = o.expires);
			} else {
				localStorage.removeItem('fieldguard_license');
			}
		} catch {
			
		}
	}

	async function activateLicense() {
		const key = (licenseKey || '').trim().toUpperCase();
		$$invalidate(32, licenseKey = key);

		if (!(/^FGS?-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/).test(key)) {
			$$invalidate(34, licenseMsg = 'Invalid key format — expected FG-XXXX-XXXX-XXXX');
			return;
		}

		$$invalidate(35, licenseChecking = true);
		$$invalidate(34, licenseMsg = 'Checking…');

		try {
			const res = await fetch(LICENSE_API, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key })
			});

			const j = await res.json();

			if (j && j.valid) {
				$$invalidate(8, licenseTier = j.tier || 'individual');
				$$invalidate(33, licenseExpires = j.expires || '');

				try {
					localStorage.setItem('fieldguard_license', JSON.stringify({
						key,
						tier: licenseTier,
						expires: licenseExpires
					}));
				} catch {
					
				}

				$$invalidate(34, licenseMsg = '✓ Activated — Pro features unlocked');
				refreshData();
				listMonitors();
			} else {
				$$invalidate(8, licenseTier = '');
				$$invalidate(33, licenseExpires = '');

				$$invalidate(34, licenseMsg = j && j.reason === 'expired'
				? 'This key has expired — please renew.'
				: 'Key not found or invalid.');
			}
		} catch {
			$$invalidate(34, licenseMsg = 'Could not reach the license server. Check your connection.');
		}

		$$invalidate(35, licenseChecking = false);
	}

	function deactivateLicense() {
		$$invalidate(8, licenseTier = '');
		$$invalidate(33, licenseExpires = '');
		$$invalidate(32, licenseKey = '');
		$$invalidate(34, licenseMsg = '');

		try {
			localStorage.removeItem('fieldguard_license');
		} catch {
			
		}

		$$invalidate(43, monitoredSites = []);
		refreshData();
	}

	const MON_ZONE_COLORS = {
		green: '#22c55e',
		amber: '#f59e0b',
		red: '#ef4444',
		purple: '#a855f7',
		black: '#111827'
	};

	function monZoneColor(z) {
		return MON_ZONE_COLORS[z] || '#64748b';
	}

	function loadMonitorEmail() {
		try {
			$$invalidate(40, alertEmail = localStorage.getItem('fieldguard_alert_email') || '');
		} catch {
			
		}
	}

	async function listMonitors() {
		if (!licenseKey) {
			$$invalidate(43, monitoredSites = []);
			return;
		}

		try {
			const r = await fetch(`${MONITOR_API}/monitors?key=${encodeURIComponent(licenseKey)}`);
			const j = await r.json();
			$$invalidate(43, monitoredSites = Array.isArray(j.monitors) ? j.monitors : []);
		} catch {
			
		}
	}

	async function register24() {
		$$invalidate(41, monitorMsg = '');

		if (!isPro) {
			$$invalidate(41, monitorMsg = '24/7 email alerts require a Pro or Site license.');
			return;
		}

		const emails = (alertEmail || '').split(',').map(e => e.trim()).filter(Boolean);
		const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

		if (!emails.length || !emails.every(e => emailRe.test(e))) {
			$$invalidate(41, monitorMsg = 'Enter one or more valid emails (comma-separated).');
			return;
		}

		if (emails.length > 10) {
			$$invalidate(41, monitorMsg = 'Up to 10 direct recipients — for a bigger team use one distribution address.');
			return;
		}

		const email = emails.join(',');

		try {
			localStorage.setItem('fieldguard_alert_email', email);
		} catch {
			
		}

		$$invalidate(42, monitorBusy = true);

		try {
			const r = await fetch(`${MONITOR_API}/monitor`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					key: licenseKey,
					email,
					name: savedSites.find(s => s.id === activeSiteId)?.name || (locationName
					? locationName.split(',')[0]
					: `${lat.toFixed(3)}, ${lon.toFixed(3)}`),
					lat,
					lon,
					ppe: settings.ppeProfile,
					cfg: {
						hazards: [
							...HAZARD_EMERGENCIES.map(h => h.key).filter(k => isMonitored(k)),
							...isSite && settings.monitorHazards.lightning
							? ['lightning']
							: []
						],
						units,
						windWarnMs: settings.windWarnMs,
						windDangerMs: settings.windDangerMs,
						rainWarnMmh: settings.rainWarnMmh,
						rainDangerMmh: settings.rainDangerMmh,
						...isSite && settings.monitorHazards.lightning
						? {
								rings: [
									{
										mi: settings.lightningStopInnerMi,
										level: 'red',
										label: 'Stop work'
									},
									{
										mi: settings.lightningStopMi,
										level: 'red',
										label: 'Stop work'
									},
									{
										mi: settings.lightningWarnMi,
										level: 'warning',
										label: 'Prepare to suspend'
									},
									{
										mi: settings.lightningAdvisoryMi,
										level: 'advisory',
										label: 'Monitor'
									}
								],
								allClearMinutes: settings.lightningAllClearMin
							}
						: {}
					}
				})
			});

			const j = await r.json();

			if (r.ok && j.ok) {
				$$invalidate(41, monitorMsg = `✓ Monitored 24/7 — alerts email to ${email}`);
				await listMonitors();
			} else {
				$$invalidate(41, monitorMsg = j.error || 'Could not register this site.');
			}
		} catch {
			$$invalidate(41, monitorMsg = 'Could not reach the monitoring server.');
		}

		$$invalidate(42, monitorBusy = false);
	}

	async function removeMonitor(id) {
		try {
			await fetch(`${MONITOR_API}/monitor?key=${encodeURIComponent(licenseKey)}&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
			await listMonitors();
		} catch {
			
		}
	}

	async function generateReport() {
		if (isSite && settings.forecastAlerts) await runForecast();
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

		const hazardSnapshot = windResult && rainResult
		? {
				wind: {
					speed: fmtWind(rawData?.windMs ?? 0, units),
					label: windResult.riskLabel,
					beaufort: `Bft ${windResult.beaufort} (${windResult.beaufortDesc})`
				},
				rain: {
					rate: fmtRain(rawData?.rainMmH ?? 0, units),
					intensity: rainResult.intensityLabel,
					label: rainResult.riskLabel
				},
				thunder: {
					available: !!thunderResult?.available,
					cape: `${thunderResult?.capeJkg ?? 0} J/kg`,
					label: thunderResult?.riskLabel ?? 'N/A',
					instability: thunderResult?.instability ?? ''
				},
				cold: {
					active: !!coldResult?.active,
					windChill: fmtTemp(coldResult?.windChillC ?? 0, units),
					label: coldResult?.riskLabel ?? '',
					frostbite: coldResult?.frostbite ?? ''
				},
				solar: {
					irradiance: `${rawData?.solarWm2 ?? 0} W/m²`,
					label: solarBand(rawData?.solarWm2 ?? 0, isDay).label,
					period: isDay ? 'Daytime' : 'Night'
				}
			}
		: undefined;

		const forecastRows = forecastList.map(f => ({
			icon: f.icon,
			label: f.label,
			peak: f.peakLabel,
			hoursAway: f.hoursAway ?? 0,
			when: f.firstLocal ?? ''
		}));

		const rd = {
			...reportMeta,
			siteAddress: locationName || `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
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
			forecastNarrative: `FieldGuard worst-case analysis at ${locationName || `${lat.toFixed(3)}, ${lon.toFixed(3)}`} ` + `shows ${heat?.zoneInfo.riskLabel ?? 'N/A'} zone (Apparent Temp: ${heat?.apparentTempFinal === 999
			? 'NO WORK'
			: (heat?.apparentTempFinal ?? 'N/A') + '°C'}, ` + `WBGT+PPE: ${heat?.wbgtAdjusted ?? 'N/A'}°C). ${heat?.zoneInfo.mandatoryControls[0] ?? ''}`,
			hazardSnapshot,
			monitoredHazards: HAZARD_EMERGENCIES.map(h => h.key).filter(k => isMonitored(k)),
			forecastEnabled: isSite && settings.forecastAlerts,
			forecastHorizon: horizonLabel(),
			forecastRows
		};

		$$invalidate(39, reportText = generateWeeklyReport(rd));
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

	function loadSites() {
		try {
			const s = localStorage.getItem('fieldguard_sites');
			if (s) $$invalidate(10, savedSites = JSON.parse(s));
		} catch {
			
		}
	}

	function persistSites() {
		try {
			localStorage.setItem('fieldguard_sites', JSON.stringify(savedSites));
		} catch {
			
		}
	}

	function addCurrentSite() {
		if (!canAddSite()) return;
		const id = `${Date.now()}`;

		const name = (newSiteName || '').trim() || (locationName
		? locationName.split(',')[0]
		: `Site ${savedSites.length + 1}`);

		$$invalidate(10, savedSites = [...savedSites, { id, name, lat, lon }]);
		$$invalidate(11, activeSiteId = id);
		$$invalidate(44, newSiteName = '');
		persistSites();
	}

	function addSiteByCoords() {
		if (!canAddSite()) return;
		const m = (coordInput || '').trim().match(/^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/);

		if (!m) {
			$$invalidate(2, locationName = 'Enter coords as: lat, lon');
			return;
		}

		const la = parseFloat(m[1]), lo = parseFloat(m[2]);

		if (la < -90 || la > 90 || lo < -180 || lo > 180) {
			$$invalidate(2, locationName = 'Coords out of range');
			return;
		}

		const id = `${Date.now()}`;
		const name = (newSiteName || '').trim() || `${la.toFixed(3)}, ${lo.toFixed(3)}`;
		$$invalidate(10, savedSites = [...savedSites, { id, name, lat: la, lon: lo }]);
		$$invalidate(11, activeSiteId = id);
		$$invalidate(44, newSiteName = '');
		$$invalidate(45, coordInput = '');
		$$invalidate(0, lat = la);
		$$invalidate(1, lon = lo);
		$$invalidate(2, locationName = name);
		$$invalidate(19, locked = true);
		geocodedFor = '';
		panMap(la, lo);
		persistSites();
		refreshData();
	}

	function startRename(s) {
		$$invalidate(46, editingSiteId = s.id);
		$$invalidate(47, editName = s.name);
	}

	function commitRename() {
		if (!editingSiteId) return;
		const nm = (editName || '').trim();

		if (nm) {
			$$invalidate(10, savedSites = savedSites.map(x => x.id === editingSiteId ? { ...x, name: nm } : x));
			if (activeSiteId === editingSiteId) $$invalidate(2, locationName = nm);
			persistSites();
		}

		$$invalidate(46, editingSiteId = '');
	}

	function panMap(la, lo) {
		try {
			let z = 11;

			try {
				z = Math.max(map.getZoom(), 11);
			} catch {
				
			}

			map.setView([la, lo], z, { animate: true });
		} catch {
			try {
				map.panTo([la, lo], { animate: true });
			} catch {
				
			}
		}

		try {
			broadcast.emit('rqstOpen', 'picker', { lat: la, lon: lo });
		} catch {
			
		}
	}

	function selectSite(s) {
		$$invalidate(11, activeSiteId = s.id);
		$$invalidate(19, locked = true);
		$$invalidate(0, lat = s.lat);
		$$invalidate(1, lon = s.lon);
		$$invalidate(2, locationName = s.name);
		geocodedFor = '';
		panMap(s.lat, s.lon);
		refreshData();
	}

	function removeSite(s) {
		$$invalidate(10, savedSites = savedSites.filter(x => x.id !== s.id));
		if (activeSiteId === s.id) $$invalidate(11, activeSiteId = '');
		persistSites();
	}

	function cacheKey() {
		return `${lat.toFixed(3)},${lon.toFixed(3)}`;
	}

	function cacheReading(inputs) {
		try {
			const all = JSON.parse(localStorage.getItem('fieldguard_cache') || '{}');

			all[cacheKey()] = {
				inputs,
				time: new Date().toLocaleString()
			};

			localStorage.setItem('fieldguard_cache', JSON.stringify(all));
		} catch {
			
		}
	}

	function loadCachedReading() {
		try {
			const all = JSON.parse(localStorage.getItem('fieldguard_cache') || '{}');
			return all[cacheKey()] ?? null;
		} catch {
			return null;
		}
	}

	function downloadCSV() {
		const head = ['Time', 'Type', 'Message', 'Site'];

		const rows = alertLog.map(a => [
			a.time,
			String(a.type).replace(/[^\x20-\x7E]/g, '').trim(),
			a.message,
			locationName || cacheKey()
		]);

		const esc = v => `"${String(v).replace(/"/g, '""')}"`;
		const csv = [head, ...rows].map(r => r.map(esc).join(',')).join('\r\n');
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
		a.download = `FieldGuard-log-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
	}

	async function monitorSites() {
		if (savedSites.length === 0) return;
		const om = MODELS.find(m => m.key === selectedModel)?.om ?? 'best_match';

		for (const s of savedSites) {
			try {
				const url = `https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lon}` + `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,shortwave_radiation,cloud_cover` + `&hourly=cape&wind_speed_unit=ms&forecast_days=1&models=${om}`;
				const res = await fetch(url);
				if (!res.ok) continue;
				const j = await res.json();
				const c = j && j.current;
				if (!c || c.temperature_2m == null) continue;
				const capeArr = j && j.hourly && j.hourly.cape;

				const capeJkg = Array.isArray(capeArr) && capeArr[0] != null
				? Math.max(0, Math.round(capeArr[0]))
				: undefined;

				const inputs = {
					tempC: c.temperature_2m,
					humidity: c.relative_humidity_2m ?? 50,
					windMs: Math.max(0, c.wind_speed_10m ?? 0),
					solarWm2: Math.max(0, c.shortwave_radiation ?? 0),
					rainMmH: Math.max(0, c.precipitation ?? 0),
					capeJkg,
					cloudCoverPct: c.cloud_cover ?? undefined
				};

				const now = new Date();
				const localHour = now.getUTCHours() + s.lon / 15, month = now.getMonth() + 1;
				const h = assessHeatStress(inputs, settings.ppeProfile, localHour, month, null);
				const wnd = assessWind(inputs.windMs, settings.windWarnMs, settings.windDangerMs);
				const rn = assessRain(inputs.rainMmH, settings.rainWarnMmh, settings.rainDangerMmh);
				const cd = assessColdStress(inputs.tempC, inputs.windMs);
				const th = assessThunderstorm(inputs.capeJkg, inputs.cloudCoverPct, inputs.rainMmH);
				const sb = solarBand(inputs.solarWm2, isDaytime(s.lat, s.lon, now));

				const w = worstStatus([
					{
						key: 'heat',
						st: {
							label: h.zoneInfo.riskLabel,
							color: h.zoneInfo.color
						}
					},
					{
						key: 'cold',
						st: cd.active
						? { label: cd.riskLabel, color: cd.riskColor }
						: null
					},
					{
						key: 'wind',
						st: {
							label: wnd.riskLabel,
							color: wnd.riskColor
						}
					},
					{
						key: 'rain',
						st: { label: rn.riskLabel, color: rn.riskColor }
					},
					{
						key: 'thunder',
						st: th.available
						? { label: th.riskLabel, color: th.riskColor }
						: null
					},
					{
						key: 'solar',
						st: { label: sb.label, color: sb.color }
					}
				]) || {
					color: h.zoneInfo.color,
					label: h.zoneInfo.riskLabel
				};

				$$invalidate(50, bgStatus = {
					...bgStatus,
					[s.id]: {
						color: w.color,
						label: w.label,
						time: now.toLocaleTimeString()
					}
				});

				if (settings.soundAlerts && s.id !== activeSiteId && sev(w.color) >= 3) {
					triggerNotification(`⚠ ${s.name} — ${w.label}`, `${s.name}: a monitored hazard is at danger level.`);
				}
			} catch {
				
			}
		}
	}

	function backgroundTick() {
		refreshData();
		monitorSites();
	}

	function onVisible() {
		if (document.visibilityState === 'visible') {
			refreshData();
			monitorSites();
		}
	}

	function onMapClick(e) {
		if (!locked) {
			$$invalidate(0, lat = e.latlng.lat);
			$$invalidate(1, lon = e.latlng.lng);
			refreshData();
		}

		try {
			broadcast.emit('rqstOpen', 'windy-plugin-fieldguard', { lat, lon });
		} catch {
			
		}
	}

	onMount(() => {
		try {
			const s = localStorage.getItem('fieldguard_settings');

			if (s) {
				const saved = JSON.parse(s);

				$$invalidate(12, settings = {
					...DEFAULT_SETTINGS,
					...saved,
					monitorHazards: {
						...DEFAULT_SETTINGS.monitorHazards,
						...saved.monitorHazards || {}
					}
				});
			}
		} catch {
			
		}

		loadLicense();
		loadSites();
		loadMonitorEmail();
		listMonitors();

		try {
			const c = map.getCenter();
			$$invalidate(0, lat = c.lat);
			$$invalidate(1, lon = c.lng);
		} catch {
			
		}

		map.on('click', onMapClick);
		document.addEventListener('visibilitychange', onVisible);
		refreshData();
		monitorSites();
		setupAutoRefresh();
		if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
	});

	onDestroy(() => {
		if (autoRefreshTimer) clearInterval(autoRefreshTimer);
		map.off('click', onMapClick);
		document.removeEventListener('visibilitychange', onVisible);
	});

	const onopen = params => {
		if (params?.lat && params?.lon) {
			$$invalidate(0, lat = parseFloat(params.lat));
			$$invalidate(1, lon = parseFloat(params.lon));
			refreshData();
		}
	};

	const $$binding_groups = [[], [], []];
	const click_handler = () => $$invalidate(15, tab = tab === 'settings' ? 'dashboard' : 'settings');
	const click_handler_1 = t => $$invalidate(15, tab = t.id);
	const click_handler_2 = () => $$invalidate(19, locked = !locked);

	function input_input_handler() {
		editName = this.value;
		$$invalidate(47, editName);
	}

	const keydown_handler = e => {
		if (e.key === 'Enter') commitRename(); else if (e.key === 'Escape') $$invalidate(46, editingSiteId = '');
	};

	const click_handler_3 = s => removeSite(s);
	const click_handler_4 = s => selectSite(s);
	const dblclick_handler = s => startRename(s);

	function input0_input_handler() {
		newSiteName = this.value;
		$$invalidate(44, newSiteName);
	}

	function input1_input_handler() {
		coordInput = this.value;
		$$invalidate(45, coordInput);
	}

	const keydown_handler_1 = e => e.key === 'Enter' && addSiteByCoords();

	function select_change_handler() {
		selectedModel = select_value(this);
		$$invalidate(37, selectedModel);
		$$invalidate(62, MODELS);
	}

	function input_change_handler() {
		worstCaseMode = this.checked;
		(($$invalidate(9, worstCaseMode), $$invalidate(13, isPro)), $$invalidate(8, licenseTier));
	}

	const click_handler_5 = () => $$invalidate(5, selectedHazard = 'heat');
	const click_handler_6 = () => $$invalidate(5, selectedHazard = 'wind');
	const click_handler_7 = () => $$invalidate(5, selectedHazard = 'rain');
	const click_handler_8 = () => $$invalidate(5, selectedHazard = 'solar');
	const click_handler_9 = () => $$invalidate(15, tab = 'settings');
	const click_handler_10 = () => $$invalidate(15, tab = 'settings');
	const click_handler_11 = () => $$invalidate(15, tab = 'settings');
	const click_handler_12 = () => $$invalidate(15, tab = 'settings');
	const click_handler_13 = () => $$invalidate(15, tab = 'settings');
	const click_handler_14 = hz => $$invalidate(6, emgHazard = hz.key);

	function input0_input_handler_1() {
		reportMeta.projectName = this.value;
		$$invalidate(51, reportMeta);
	}

	function input1_input_handler_1() {
		reportMeta.contractNumber = this.value;
		$$invalidate(51, reportMeta);
	}

	function input2_input_handler() {
		reportMeta.country = this.value;
		$$invalidate(51, reportMeta);
	}

	function input3_input_handler() {
		reportMeta.clientName = this.value;
		$$invalidate(51, reportMeta);
	}

	function input4_input_handler() {
		reportMeta.contractorName = this.value;
		$$invalidate(51, reportMeta);
	}

	function input5_input_handler() {
		reportMeta.hseManagerName = this.value;
		$$invalidate(51, reportMeta);
	}

	function input6_input_handler() {
		reportMeta.regulatoryRef = this.value;
		$$invalidate(51, reportMeta);
	}

	function input7_input_handler() {
		reportMeta.banStart = this.value;
		$$invalidate(51, reportMeta);
	}

	function input8_input_handler() {
		reportMeta.banEnd = this.value;
		$$invalidate(51, reportMeta);
	}

	function input9_input_handler() {
		reportMeta.banMonths = this.value;
		$$invalidate(51, reportMeta);
	}

	function select_change_handler_1() {
		reportMeta.fidic = select_value(this);
		$$invalidate(51, reportMeta);
	}

	function input10_input_handler() {
		reportMeta.delayDays = to_number(this.value);
		$$invalidate(51, reportMeta);
	}

	function input_input_handler_1() {
		licenseKey = this.value;
		$$invalidate(32, licenseKey);
	}

	const keydown_handler_2 = e => {
		if (e.key === 'Enter') activateLicense();
	};

	function input_change_handler_1(hz) {
		settings.monitorHazards[hz.key] = this.checked;
		$$invalidate(12, settings);
	}

	function input0_change_handler() {
		settings.units = this.__value;
		$$invalidate(12, settings);
	}

	function input1_change_handler() {
		settings.units = this.__value;
		$$invalidate(12, settings);
	}

	function input2_change_handler() {
		settings.winterMode = this.__value;
		$$invalidate(12, settings);
	}

	function input3_change_handler() {
		settings.winterMode = this.__value;
		$$invalidate(12, settings);
	}

	function input4_change_handler() {
		settings.winterMode = this.__value;
		$$invalidate(12, settings);
	}

	function input_change_handler_2() {
		settings.ppeProfile = this.__value;
		$$invalidate(12, settings);
	}

	function input5_change_input_handler() {
		settings.wbgtWarnC = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input6_change_input_handler() {
		settings.wbgtDangerC = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input7_change_input_handler() {
		settings.windWarnMs = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input8_change_input_handler() {
		settings.windDangerMs = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input9_change_input_handler() {
		settings.rainWarnMmh = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input10_change_input_handler() {
		settings.rainDangerMmh = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input11_change_handler() {
		settings.monitorHazards.lightning = this.checked;
		$$invalidate(12, settings);
	}

	function input0_change_input_handler() {
		settings.lightningStopInnerMi = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input1_change_input_handler() {
		settings.lightningStopMi = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input2_change_input_handler() {
		settings.lightningWarnMi = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input3_change_input_handler() {
		settings.lightningAdvisoryMi = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input4_change_input_handler() {
		settings.lightningAllClearMin = to_number(this.value);
		$$invalidate(12, settings);
	}

	function input12_change_handler() {
		settings.soundAlerts = this.checked;
		$$invalidate(12, settings);
	}

	function input13_change_handler() {
		settings.autoRefresh = this.checked;
		$$invalidate(12, settings);
	}

	function input14_change_handler() {
		settings.forecastAlerts = this.checked;
		$$invalidate(12, settings);
	}

	function select_change_handler_2() {
		settings.forecastDays = select_value(this);
		$$invalidate(12, settings);
	}

	const func = h => isMonitored(h.key);

	function input_input_handler_2() {
		alertEmail = this.value;
		$$invalidate(40, alertEmail);
	}

	const click_handler_15 = m => removeMonitor(m.id);

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*modelResults, selectedHazard*/ 160) {
			$$invalidate(59, cmpWorstKey = (() => {
				if (!modelResults || modelResults.length < 2) return '';
				if (selectedHazard === 'wind') return modelResults.reduce((b, r) => (r.raw?.windMs ?? 0) > (b.raw?.windMs ?? 0) ? r : b, modelResults[0]).modelKey;
				if (selectedHazard === 'rain') return modelResults.reduce((b, r) => (r.raw?.rainMmH ?? 0) > (b.raw?.rainMmH ?? 0) ? r : b, modelResults[0]).modelKey;
				if (selectedHazard === 'solar') return modelResults.reduce((b, r) => (r.raw?.solarWm2 ?? 0) > (b.raw?.solarWm2 ?? 0) ? r : b, modelResults[0]).modelKey;

				return [...modelResults].sort((a, b) => {
					const zd = zoneSeverity(b.heat.zone) - zoneSeverity(a.heat.zone);
					if (zd !== 0) return zd;

					return (b.heat.apparentTempFinal === 999
					? 99
					: b.heat.apparentTempFinal) - (a.heat.apparentTempFinal === 999
					? 99
					: a.heat.apparentTempFinal);
				})[0].modelKey;
			})());
		}

		if ($$self.$$.dirty[0] & /*licenseTier*/ 256) {
			$$invalidate(13, isPro = licenseTier === 'individual' || licenseTier === 'site');
		}

		if ($$self.$$.dirty[0] & /*licenseTier*/ 256) {
			$$invalidate(52, isSite = licenseTier === 'site');
		}

		if ($$self.$$.dirty[0] & /*isPro, settings*/ 12288) {
			$$invalidate(53, units = isPro && settings.units === 'imperial'
			? 'imperial'
			: 'metric');
		}

		if ($$self.$$.dirty[0] & /*isPro, worstCaseMode*/ 8704) {
			if (!isPro && worstCaseMode) $$invalidate(9, worstCaseMode = false);
		}

		if ($$self.$$.dirty[0] & /*savedSites*/ 1024) {
			$$invalidate(58, canAddMore = savedSites.length < maxSites());
		}

		if ($$self.$$.dirty[0] & /*savedSites, activeSiteId, locationName, lat, lon*/ 3079) {
			$$invalidate(57, activeSiteLabel = savedSites.find(s => s.id === activeSiteId)?.name || locationName || `${lat.toFixed(3)}, ${lon.toFixed(3)}`);
		}

		if ($$self.$$.dirty[0] & /*activeSiteId, savedSites*/ 3072) {
			$$invalidate(56, activeIsSaved = !!activeSiteId && savedSites.some(s => s.id === activeSiteId));
		}

		if ($$self.$$.dirty[0] & /*heat, coldResult*/ 24) {
			$$invalidate(55, tempStatus = (() => {
				const h = heat
				? {
						label: heat.zoneInfo.riskLabel,
						color: heat.zoneInfo.color
					}
				: null;

				const c = coldResult && coldResult.active && isMonitored('cold')
				? {
						label: coldResult.riskLabel,
						color: coldResult.riskColor
					}
				: null;

				if (c && (!h || sev(c.color) > sev(h.color))) return c;
				return h;
			})());
		}

		if ($$self.$$.dirty[0] & /*coldResult, heat*/ 24) {
			$$invalidate(54, coldDominates = !!(coldResult && coldResult.active && isMonitored('cold') && sev(coldResult.riskColor) > sev(heat?.zoneInfo?.color ?? '#16a34a')));
		}

		if ($$self.$$.dirty[0] & /*settings*/ 4096) {
			$$invalidate(14, sosHazards = HAZARD_EMERGENCIES.filter(h => settings.monitorHazards?.[h.key] !== false));
		}

		if ($$self.$$.dirty[0] & /*sosHazards, emgHazard*/ 16448) {
			if (sosHazards.length && !sosHazards.some(h => h.key === emgHazard)) $$invalidate(6, emgHazard = sosHazards[0].key);
		}
	};

	return [
		lat,
		lon,
		locationName,
		heat,
		coldResult,
		selectedHazard,
		emgHazard,
		modelResults,
		licenseTier,
		worstCaseMode,
		savedSites,
		activeSiteId,
		settings,
		isPro,
		sosHazards,
		tab,
		loading,
		error,
		currentTime,
		locked,
		isDay,
		sunElevation,
		activeBan,
		rawData,
		windResult,
		rainResult,
		thunderResult,
		lightningResult,
		lightningBusy,
		forecastList,
		forecastBusy,
		forecastNote,
		licenseKey,
		licenseExpires,
		licenseMsg,
		licenseChecking,
		worstModelLabel,
		selectedModel,
		alertLog,
		reportText,
		alertEmail,
		monitorMsg,
		monitorBusy,
		monitoredSites,
		newSiteName,
		coordInput,
		editingSiteId,
		editName,
		isStale,
		staleTime,
		bgStatus,
		reportMeta,
		isSite,
		units,
		coldDominates,
		tempStatus,
		activeIsSaved,
		activeSiteLabel,
		canAddMore,
		cmpWorstKey,
		maxSites,
		TABS,
		MODELS,
		horizonLabel,
		currentHazardStatus,
		isMonitored,
		showColdCard,
		refreshData,
		saveSettings,
		resetSettings,
		setupAutoRefresh,
		activateLicense,
		deactivateLicense,
		monZoneColor,
		register24,
		removeMonitor,
		generateReport,
		copyReport,
		downloadReport,
		addCurrentSite,
		addSiteByCoords,
		startRename,
		commitRename,
		selectSite,
		removeSite,
		downloadCSV,
		onopen,
		click_handler,
		click_handler_1,
		click_handler_2,
		input_input_handler,
		keydown_handler,
		click_handler_3,
		click_handler_4,
		dblclick_handler,
		input0_input_handler,
		input1_input_handler,
		keydown_handler_1,
		select_change_handler,
		input_change_handler,
		click_handler_5,
		click_handler_6,
		click_handler_7,
		click_handler_8,
		click_handler_9,
		click_handler_10,
		click_handler_11,
		click_handler_12,
		click_handler_13,
		click_handler_14,
		input0_input_handler_1,
		input1_input_handler_1,
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
		input_input_handler_1,
		keydown_handler_2,
		input_change_handler_1,
		input0_change_handler,
		$$binding_groups,
		input1_change_handler,
		input2_change_handler,
		input3_change_handler,
		input4_change_handler,
		input_change_handler_2,
		input5_change_input_handler,
		input6_change_input_handler,
		input7_change_input_handler,
		input8_change_input_handler,
		input9_change_input_handler,
		input10_change_input_handler,
		input11_change_handler,
		input0_change_input_handler,
		input1_change_input_handler,
		input2_change_input_handler,
		input3_change_input_handler,
		input4_change_input_handler,
		input12_change_handler,
		input13_change_handler,
		input14_change_handler,
		select_change_handler_2,
		func,
		input_input_handler_2,
		click_handler_15
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 86 }, add_css, [-1, -1, -1, -1, -1, -1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[86];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
