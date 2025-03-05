export class AudioManager {
    constructor() {
        this.sounds = {};
        this.bgMusic = null;
        this.loadSounds();
        this.initBackgroundMusic();
    }

    initBackgroundMusic() {
        this.bgMusic = new Audio('src/assets/music/Mouse_House_Main2_022711.wav');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.2; // Low volume
    }

    loadSounds() {
        // Mapping fart types to sound files based on their characteristics
        const soundMap = {
            // Atomic fart - EVP series for supernatural effect
            atomic: 'EVP_fart_4_120310.wav',
            
            // Broccoli fog - dry and hissy
            broccoli: 'dry_fart_1.wav',
            
            // Ghost pepper - sharp and fiery
            'ghost-pepper': 'ZipFart.wav',
            
            // Cheese bomb - wet and splatty
            cheese: 'wet_fart_2.wav',
            
            // Combo sounds
            comboBreak: 'FartAaah.wav',
            
            // Additional variations for variety
            juicy: ['juicy_fart_2.wav', 'juicy_fart_3.wav'],
            dry: ['dry_fart_1.wav', 'dry_fart_2.wav'],
            evp: ['EVP_fart_1_120310.wav', 'EVP_fart_2_120310.wav', 'EVP_fart_3_120310.wav']
        };

        // Load all sounds
        for (const [key, value] of Object.entries(soundMap)) {
            if (Array.isArray(value)) {
                this.sounds[key] = value.map(filename => this.loadSound(filename));
            } else {
                this.sounds[key] = this.loadSound(value);
            }
        }
    }

    loadSound(filename) {
        const audio = new Audio(`src/assets/sounds/${filename}`);
        audio.preload = 'auto';
        return audio;
    }

    play(soundType) {
        const sound = this.sounds[soundType];
        if (!sound) return;

        if (Array.isArray(sound)) {
            // Play random variation from array
            const randomIndex = Math.floor(Math.random() * sound.length);
            this.playSound(sound[randomIndex]);
        } else {
            this.playSound(sound);
        }
    }

    playSound(audio) {
        // Clone the audio to allow overlapping sounds
        const clone = audio.cloneNode();
        clone.volume = 1.0; // Maximum volume for +6dB boost
        clone.play().catch(e => console.log('Audio playback failed:', e));
        
        // Clean up clone after playing
        clone.onended = () => clone.remove();
    }

    startBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.play().catch(e => console.log('Background music playback failed:', e));
        }
    }

    stopBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    playFartSound(type, combo = 0) {
        // Debug log to check the sound availability
        console.log('Available sounds:', Object.keys(this.sounds));
        console.log('Attempting to play sound for type:', type);
        console.log('Sound object for type:', this.sounds[type]);

        // Play the specific fart sound
        this.play(type);

        // Add combo sound effects
        if (combo > 2) {
            setTimeout(() => this.play('comboBreak'), 200);
        }

        // Add random variations for higher combos
        if (combo > 4) {
            setTimeout(() => {
                this.play(Math.random() > 0.5 ? 'juicy' : 'dry');
            }, 400);
        }
    }
}
