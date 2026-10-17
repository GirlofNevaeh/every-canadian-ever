let audio: AudioContext | null = null;
let armed = false;
let poked = false;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audio) audio = new Ctx();
  return audio;
}

export function unlockQuizAudio() {
  try {
    const ctx = context();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    if (poked) return;
    poked = true;
    const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const blip = ctx.createBufferSource();
    blip.buffer = buffer;
    blip.connect(ctx.destination);
    blip.start(0);
  } catch {
    /* keep going */
  }
}

export function armQuizAudio() {
  if (armed || typeof window === "undefined") return;
  armed = true;
  const wake = () => unlockQuizAudio();
  window.addEventListener("pointerdown", wake);
  window.addEventListener("keydown", wake);
  window.addEventListener("touchend", wake);
}

async function ready(): Promise<AudioContext | null> {
  const ctx = context();
  if (!ctx) return null;
  unlockQuizAudio();
  try {
    if (ctx.state !== "running") await ctx.resume();
  } catch {
    return null;
  }
  return ctx.state === "running" ? ctx : null;
}

function whiteNoise(ctx: AudioContext, seconds: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function brownRasp(ctx: AudioContext, seconds: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  let phase = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.8 + white * 0.2;
    const freq = 46 + (22 - 46) * (i / length);
    phase += (2 * Math.PI * freq) / ctx.sampleRate;
    const gate = Math.abs(Math.sin(phase));
    data[i] = (last + white * 0.12) * gate;
  }
  let peak = 0;
  for (let i = 0; i < length; i += 1) peak = Math.max(peak, Math.abs(data[i]!));
  if (peak > 0) {
    for (let i = 0; i < length; i += 1) data[i] = data[i]! / peak;
  }
  return buffer;
}

export async function playCheer() {
  try {
    const ctx = await ready();
    if (!ctx) return;
    const now = ctx.currentTime;
    const burst = ctx.createBufferSource();
    burst.buffer = whiteNoise(ctx, 0.22);
    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 1200;
    const burstGain = ctx.createGain();
    burstGain.gain.setValueAtTime(0.12, now);
    burstGain.gain.setValueAtTime(0.12, now + 0.18);
    burstGain.gain.linearRampToValueAtTime(0.0001, now + 0.22);
    burst.connect(high);
    high.connect(burstGain);
    burstGain.connect(ctx.destination);
    burst.start(now);
    burst.stop(now + 0.22);

    for (const [index, freq] of [523.25, 659.25, 783.99, 1046.5].entries()) {
      const start = now + index * 0.09;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, start);
      gain.gain.setValueAtTime(0.28, start + 0.29);
      gain.gain.linearRampToValueAtTime(0.0001, start + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.32);
    }
  } catch {
    /* a failed sound should not stop the quiz */
  }
}

export async function playFart() {
  try {
    const ctx = await ready();
    if (!ctx) return;
    const now = ctx.currentTime;
    const end = now + 0.7;
    const source = ctx.createBufferSource();
    source.buffer = brownRasp(ctx, 0.7);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.7;
    band.frequency.setValueAtTime(720, now);
    band.frequency.exponentialRampToValueAtTime(180, end);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.9, now + 0.18);
    gain.gain.linearRampToValueAtTime(0.001, end);
    source.connect(band);
    band.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(end);

    for (const [from, to] of [
      [150, 62],
      [300, 124],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(from, now);
      osc.frequency.exponentialRampToValueAtTime(to, end);
      const tone = ctx.createGain();
      tone.gain.setValueAtTime(0.07, now);
      tone.gain.linearRampToValueAtTime(0.0001, end);
      osc.connect(tone);
      tone.connect(ctx.destination);
      osc.start(now);
      osc.stop(end);
    }
  } catch {
    /* a failed sound should not stop the quiz */
  }
}
