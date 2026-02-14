// Web Audio API based sound effects
// Minimalistic, synthesized sounds to avoid external assets

class SoundFX {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Global volume
        this.masterGain.connect(this.ctx.destination);
    }

    playTone(freq, type, duration, startTime = 0) {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playSuccess() {
        // Ascending major arpeggio
        this.playTone(440, 'sine', 0.1, 0);       // A4
        this.playTone(554.37, 'sine', 0.1, 0.1);  // C#5
        this.playTone(659.25, 'sine', 0.2, 0.2);  // E5
        this.playTone(880, 'sine', 0.4, 0.3);     // A5
    }

    playFailure() {
        // Descending discordant tritone
        this.playTone(110, 'sawtooth', 0.3, 0);     // A2
        this.playTone(77.78, 'sawtooth', 0.3, 0.2); // Eb2
    }

    playClick() {
        // Short high pitched blip
        this.playTone(1200, 'square', 0.05, 0);
    }

    playStartup() {
        // Power up sweep
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }
}

export const sfx = new SoundFX();
