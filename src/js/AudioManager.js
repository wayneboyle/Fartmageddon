export class AudioManager {
    constructor() {
        this.sounds = {};
        this.bgMusic = null;
        this.loadSounds();
        this.initBackgroundMusic();
    }

    initBackgroundMusic() {
        this.bgMusic = new Audio('src/assets/sounds/Mouse_House_Main2_022711.wav');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3; // Increased volume but still in background
    }

    loadSounds() {
        // Mapping fart types to sound files based on their characteristics
        const soundMap = {
            // Atomic fart - EVP series for supernatural effect
            atomic: 'EVP_fart_4_120310.wav',
            
            // Broccoli fog - EVP style
            broccoli: 'EVP_fart_3_120310.wav',
            
            // Ghost pepper - supernatural EVP effect
            ghostPepper: 'EVP_fart_2_120310.wav',
            
            // Cheese bomb - wet and splatty
            cheese: 'wet_fart_2.wav',
            
            // Combo sounds
            comboBreak: 'FartAaah.wav',
            
            // Additional variations for variety
            juicy: ['juicy_fart_2.wav', 'juicy_fart_3.wav'],
            dry: ['dry_fart_1.wav', 'dry_fart_2.wav'],
            evp: ['EVP_fart_1_120310.wav', 'EVP_fart_2_120310.wav', 'EVP_fart_3_120310.wav'],
            
            // Explosion effect for atomic fart
            explosion: 'explosion-03.wav',
            
            // Jump sound effect
            jump: 'funny-spring-2.mp3',
            
            // Landing sound effect
            land: 'whizpop.wav',
            
            // Bonk sound when enemy hits player
            bonk: 'bonkpopb.wav'
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
        console.log('Attempting to play sound:', soundType);
        const sound = this.sounds[soundType];
        if (!sound) {
            console.log('Sound not found:', soundType);
            return;
        }
        console.log('Found sound:', soundType);

        if (Array.isArray(sound)) {
            // Play random variation from array
            const randomIndex = Math.floor(Math.random() * sound.length);
            this.playSound(sound[randomIndex]);
        } else {
            this.playSound(sound);
        }
    }

    playSound(audio) {
        // Create a fresh Audio instance each time
        const sound = new Audio(audio.src);
        sound.volume = 1.0;
        
        // Force load and play
        sound.load();
        sound.play();
        
        // Clean up after playing
        sound.onended = () => sound.remove();
    }

    async startBackgroundMusic() {
        if (this.bgMusic) {
            try {
                await this.bgMusic.play();
                console.log('Background music started successfully');
            } catch (e) {
                console.log('Background music failed to start:', e);
                // Try to start music on next user interaction
                document.addEventListener('click', () => {
                    this.bgMusic.play().catch(e => console.log('Still failed:', e));
                }, { once: true });
            }
        }
    }

    stopBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    playFartSound(type, combo = 0) {
        // Play the specific fart sound
        this.play(type);

        // For atomic fart, add explosion sound after a delay
        if (type === 'atomic') {
            setTimeout(() => this.play('explosion'), 300);
        }

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
