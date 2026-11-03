/**
 * Small WebAudio voices for the garden. Sound only ever starts from a
 * deliberate click or pluck (never on load or hover alone), and one shared
 * mute switch (persisted per tab) silences all of it.
 */
let ac: AudioContext | null = null;
let muted = false;
try {
  muted = typeof sessionStorage !== "undefined" && sessionStorage.getItem("garden-muted") === "1";
} catch {}

const listeners = new Set<(m: boolean) => void>();
export const isMuted = () => muted;
export const setMuted = (m: boolean) => {
  muted = m;
  try {
    sessionStorage.setItem("garden-muted", m ? "1" : "0");
  } catch {}
  listeners.forEach((f) => f(m));
};
export const onMute = (f: (m: boolean) => void) => {
  listeners.add(f);
  return () => {
    listeners.delete(f);
  };
};

const ctx = () => {
  if (muted || typeof window === "undefined") return null;
  ac ||= new AudioContext();
  if (ac.state === "suspended") void ac.resume();
  return ac;
};

export function tone(f: number, o: { type?: OscillatorType; vol?: number; dur?: number; lp?: number; at?: number } = {}) {
  const a = ctx();
  if (!a) return;
  const t = a.currentTime + (o.at || 0),
    dur = o.dur || 1.4,
    osc = a.createOscillator(),
    g = a.createGain(),
    lp = a.createBiquadFilter();
  osc.type = o.type || "triangle";
  osc.frequency.value = f;
  lp.type = "lowpass";
  lp.frequency.value = o.lp || 1000;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(o.vol || 0.16, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(lp);
  lp.connect(g);
  g.connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export function meow() {
  const a = ctx();
  if (!a) return;
  const t = a.currentTime,
    o = a.createOscillator(),
    g = a.createGain(),
    f1 = a.createBiquadFilter(),
    v = a.createOscillator(),
    vg = a.createGain();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(520, t);
  o.frequency.linearRampToValueAtTime(820, t + 0.18);
  o.frequency.linearRampToValueAtTime(600, t + 0.5);
  v.frequency.value = 7;
  vg.gain.value = 14;
  v.connect(vg);
  vg.connect(o.frequency);
  f1.type = "bandpass";
  f1.frequency.setValueAtTime(900, t);
  f1.frequency.linearRampToValueAtTime(1500, t + 0.2);
  f1.frequency.linearRampToValueAtTime(800, t + 0.5);
  f1.Q.value = 6;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.16, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  o.connect(f1);
  f1.connect(g);
  g.connect(a.destination);
  o.start(t);
  v.start(t);
  o.stop(t + 0.65);
  v.stop(t + 0.65);
}

export function purr() {
  const a = ctx();
  if (!a) return;
  const t = a.currentTime,
    o = a.createOscillator(),
    g = a.createGain(),
    lfo = a.createOscillator(),
    lg = a.createGain(),
    lp = a.createBiquadFilter();
  o.type = "sawtooth";
  o.frequency.value = 52;
  lp.type = "lowpass";
  lp.frequency.value = 260;
  lfo.frequency.value = 24;
  lg.gain.value = 0.05;
  lfo.connect(lg);
  lg.connect(g.gain);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.06, t + 0.15);
  g.gain.linearRampToValueAtTime(0, t + 1.1);
  o.connect(lp);
  lp.connect(g);
  g.connect(a.destination);
  o.start(t);
  lfo.start(t);
  o.stop(t + 1.2);
  lfo.stop(t + 1.2);
}

/** a sung vowel ("la") with vibrato */
export function la(f: number, at: number, dur: number) {
  const a = ctx();
  if (!a) return;
  const t = a.currentTime + at,
    o = a.createOscillator(),
    v = a.createOscillator(),
    vg = a.createGain(),
    g = a.createGain(),
    f1 = a.createBiquadFilter(),
    f2 = a.createBiquadFilter();
  o.type = "sawtooth";
  o.frequency.value = f;
  v.frequency.value = 5.5;
  vg.gain.value = f * 0.012;
  v.connect(vg);
  vg.connect(o.frequency);
  f1.type = "bandpass";
  f1.frequency.value = 800;
  f1.Q.value = 5;
  f2.type = "bandpass";
  f2.frequency.value = 1150;
  f2.Q.value = 6;
  o.connect(f1);
  o.connect(f2);
  f1.connect(g);
  f2.connect(g);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3, t + 0.06);
  g.gain.setValueAtTime(0.3, t + dur - 0.08);
  g.gain.linearRampToValueAtTime(0, t + dur);
  g.connect(a.destination);
  o.start(t);
  v.start(t);
  o.stop(t + dur + 0.02);
  v.stop(t + dur + 0.02);
}

export function scratch() {
  const a = ctx();
  if (!a) return;
  const t = a.currentTime,
    n = a.createBufferSource(),
    buf = a.createBuffer(1, a.sampleRate * 0.45, a.sampleRate),
    dd = buf.getChannelData(0);
  for (let i = 0; i < dd.length; i++) dd[i] = (Math.random() * 2 - 1) * Math.sin((i / dd.length) * Math.PI);
  n.buffer = buf;
  const bp = a.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 3;
  bp.frequency.setValueAtTime(600, t);
  bp.frequency.linearRampToValueAtTime(2400, t + 0.2);
  bp.frequency.linearRampToValueAtTime(500, t + 0.45);
  const g = a.createGain();
  g.gain.value = 0.25;
  n.connect(bp);
  bp.connect(g);
  g.connect(a.destination);
  n.start(t);
}

export const chime = (f: number, at = 0) => {
  tone(f, { type: "sine", vol: 0.08, dur: 1.1, at });
  tone(f * 1.5, { type: "sine", vol: 0.03, dur: 0.8, at: at + 0.05 });
};

/* ---------------------------------------------------------------------------
 * Interface sounds (wired up in components/SiteSounds.tsx). All soft, short
 * and matte: music-box ticks and paper and tape, never beeps. Each answers a
 * click the visitor made; none plays on hover or scroll.
 * ------------------------------------------------------------------------- */
let noiseBuf: AudioBuffer | null = null;
/** a burst of filtered noise: paper, air, tape */
function noise(o: { dur: number; vol: number; type: BiquadFilterType; from: number; to?: number; q?: number; at?: number }) {
  const a = ctx();
  if (!a) return;
  if (!noiseBuf) {
    noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = a.currentTime + (o.at || 0),
    src = a.createBufferSource(),
    f = a.createBiquadFilter(),
    g = a.createGain();
  src.buffer = noiseBuf;
  f.type = o.type;
  f.Q.value = o.q ?? 0.9;
  f.frequency.setValueAtTime(o.from, t);
  if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(o.vol, t + Math.min(0.03, o.dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start(t, Math.random() * 0.5);
  src.stop(t + o.dur + 0.05);
}

/** switching a tab or a thumbnail: one music-box tick */
export const tick = () => {
  tone(1568, { type: "sine", vol: 0.045, dur: 0.22, lp: 4000 });
  tone(3136, { type: "sine", vol: 0.012, dur: 0.12, lp: 6000 });
};
/** a button pressed: a soft round pop */
export const pop = () => tone(660, { type: "sine", vol: 0.06, dur: 0.16, lp: 2400 });
/** turning to the next or previous piece: a page sliding past */
export const page = (dir: 1 | -1) =>
  noise({ dur: 0.22, vol: 0.05, type: "bandpass", from: dir > 0 ? 900 : 2600, to: dir > 0 ? 2600 : 900, q: 1.2 });
/** opening a poster: paper lifted, with a little chime */
export const paper = () => {
  noise({ dur: 0.18, vol: 0.05, type: "highpass", from: 2200 });
  tone(1046.5, { type: "sine", vol: 0.035, dur: 0.5, lp: 3000, at: 0.05 });
};
/** closing it again: two notes down */
export const close = () => {
  tone(784, { type: "sine", vol: 0.04, dur: 0.25, lp: 3000 });
  tone(587.33, { type: "sine", vol: 0.035, dur: 0.35, lp: 3000, at: 0.07 });
};
/** picking a clip on the timeline: the click of a tape deck */
export const tape = () => {
  noise({ dur: 0.04, vol: 0.09, type: "bandpass", from: 3200, q: 2 });
  tone(220, { type: "triangle", vol: 0.05, dur: 0.12, lp: 900, at: 0.01 });
};
/** pressing play: tape catching, then three notes up */
export const playFx = () => {
  tape();
  [523.25, 659.25, 783.99].forEach((f, k) => tone(f, { type: "sine", vol: 0.04, dur: 0.5, lp: 3000, at: 0.08 + k * 0.07 }));
};
/** jumping through the page: a breath of air */
export const whoosh = (up = false) =>
  noise({ dur: 0.45, vol: 0.045, type: "bandpass", from: up ? 500 : 2400, to: up ? 2400 : 500, q: 0.7 });
/** typing in the form: the quietest pencil tick */
export const typeTick = () => noise({ dur: 0.03, vol: 0.025, type: "highpass", from: 3000 + Math.random() * 1500 });
/** the message went: a little rising sparkle */
export const sent = () =>
  [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, k) => tone(f, { type: "sine", vol: 0.045, dur: 0.9, lp: 4000, at: k * 0.08 }));
/** it did not: one soft low note, not an alarm */
export const oops = () => {
  tone(233.08, { type: "triangle", vol: 0.07, dur: 0.35, lp: 800 });
  tone(196, { type: "triangle", vol: 0.06, dur: 0.45, lp: 800, at: 0.12 });
};
