/**
 * Web Audio API synthesizer for authentic Indian Railway station chime and wake-up alerts.
 * Generates tones natively without external mp3 dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays the iconic 3-tone railway station announcement chime (Indian Railways style: F5 - G#5 - C6)
 */
export function playRailwayChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // 3 classic chime frequencies
      const notes = [
        { freq: 698.46, time: 0.0, dur: 0.35 }, // F5
        { freq: 830.61, time: 0.35, dur: 0.35 }, // G#5
        { freq: 1046.50, time: 0.70, dur: 0.60 }, // C6
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm chime timbre using sine + subtle harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        // Envelope
        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.25, now + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });

      setTimeout(() => {
        resolve();
      }, 1500);
    } catch {
      resolve();
    }
  });
}

/**
 * Plays a pleasant repeating alert tone for train destination / wake-up alarm
 */
export function playWakeupAlarm(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const beepTimes = [0, 0.25, 0.5, 0.75, 1.2, 1.45, 1.7];
    beepTimes.forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now + t); // A5

      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(0.3, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + t);
      osc.stop(now + t + 0.18);
    });
  } catch (err) {
    console.error('Wakeup audio error:', err);
  }
}
