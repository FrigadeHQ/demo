const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the actual effect without a browser: hidden/reduced-motion canvases
// must stop scheduling frames, and unmount must release every observer/listener.
const source = readFileSync(resolve(__dirname, '../src/components/animated-dots.tsx'), 'utf8');
const effects = [], frames = new Map(), listeners = new Map(), observers = [];
let nextFrame = 1;
const pixels = [];
const context = { clearRect() { pixels.length = 0; }, setTransform() {}, fillRect(x, y, w, h) { pixels.push([x, y, w, h, this.globalAlpha]); } };
const canvas = { clientWidth: 160, clientHeight: 56, getContext: () => context };
const motion = { matches: false, addEventListener: (key, fn) => listeners.set('motion:' + key, fn), removeEventListener: key => listeners.delete('motion:' + key) };
const document = { hidden: false, addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) };
class Observer {
  constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
  observe(element) { assert.equal(element, canvas); }
  disconnect() { this.disconnected = true; }
}
const componentExports = {};
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } }).outputText;
vm.runInNewContext(code, {
  exports: componentExports,
  require(name) {
    if (name === 'react') return { useRef: current => ({ current }), useEffect: effect => effects.push(effect) };
    if (name === 'react/jsx-runtime') return { jsx: (tag, props) => ({ tag, props }) };
    throw new Error('Unexpected dependency: ' + name);
  },
  window: { devicePixelRatio: 3, matchMedia: () => motion }, document,
  getComputedStyle: () => ({ color: 'rgb(255, 255, 255)' }),
  ResizeObserver: Observer, IntersectionObserver: Observer,
  requestAnimationFrame: callback => { const id = nextFrame++; frames.set(id, callback); return id; },
  cancelAnimationFrame: id => frames.delete(id),
});
const element = componentExports.AnimatedDots({});
element.props.ref.current = canvas;
const cleanup = effects[0]();
const [size, visibility] = observers;
assert.equal(canvas.width, 320, 'pixel density is capped at 2x');
assert.equal(canvas.height, 112);
assert.ok(pixels.length > 0, 'static field is painted before animation');
assert.ok(pixels.every(([x, y, w, h, alpha]) => x < 160 && y < 56 && w === 1.5 && h === 1.5 && [0, .12, .4].includes(alpha)));
assert.equal(frames.size, 0, 'offscreen canvas stays idle');
visibility.callback([{ isIntersecting: true }]);
assert.equal(frames.size, 1, 'visible canvas starts one loop');
const [id, tick] = frames.entries().next().value; frames.delete(id); tick(100);
assert.equal(frames.size, 1, 'each frame schedules exactly one successor');
document.hidden = true; listeners.get('visibilitychange')();
assert.equal(frames.size, 0, 'background tabs stop animation');
document.hidden = false; listeners.get('visibilitychange')();
assert.equal(frames.size, 1);
motion.matches = true; listeners.get('motion:change')();
assert.equal(frames.size, 0, 'reduced motion keeps a static field');
canvas.clientWidth = 375; size.callback();
assert.equal(canvas.width, 750, 'resize redraws at the current width');
motion.matches = false; listeners.get('motion:change')();
visibility.callback([{ isIntersecting: false }]);
assert.equal(frames.size, 0, 'scrolling out of view stops animation');
cleanup();
assert.equal(listeners.size, 0);
assert.ok(observers.every(observer => observer.disconnected));
assert.equal(frames.size, 0);
console.log('Animated dots: pixel states, resizing, visibility, reduced motion, and cleanup pass.');
