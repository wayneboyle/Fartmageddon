import { SpriteGenerator } from './SpriteGenerator.js';

export class MonkeySprite {
    constructor(game) {
        this.game = game;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.animationSpeed = 3; // Faster animations
        this.isLoaded = false;
        this.scale = 2; // Scale factor for the sprite
        
        // Animation states
        this.state = 'idle';
        this.direction = 1; // 1 for right, -1 for left
        this.rotationAngle = 0;
        
        // Dance animation
        this.danceImages = [];
        this.isDancing = false;
        this.danceFrame = 0;
        this.danceFrameCount = 0;
        this.danceFramesLoaded = 0;
        this.totalDanceFrames = 50; // Total number of dance frames
        this.danceScale = 0.35; // Scale for dance animation
        
        // For 30fps animation (assuming game runs at ~60fps)
        this.danceFrameRate = 2; // Show new frame every 2 game frames (30fps)
        
        // Load sprite
        this.loadSprite();
        
        // Preload dance frames
        this.preloadDanceFrames();
        
        // Fart pose configurations
        this.poses = {
            idle: {
                width: 65,
                height: 60,
                offsetY: 0,
                frames: 2
            },
            running: {
                width: 65,
                height: 60,
                offsetY: 0,
                frames: 4
            },
            // Atomic Fart: Full backflip
            atomic: {
                width: 65,
                height: 60,
                offsetY: -5,
                frames: 8
            },
            // Broccoli Fog: Kung-fu stance
            broccoli: {
                width: 65,
                height: 60,
                offsetY: -2,
                frames: 6
            },
            // Ghost Pepper: Break-dance spin
            'ghost-pepper': {
                width: 65,
                height: 60,
                offsetY: 0,
                frames: 8
            },
            // Cheese Bomb: Booty shake
            cheese: {
                width: 65,
                height: 60,
                offsetY: -2,
                frames: 6
            }
        };
    }

    async loadSprite() {
        try {
            const spriteUrl = await SpriteGenerator.createMonkeySprite();
            this.sprite = new Image();
            await new Promise((resolve, reject) => {
                this.sprite.onload = resolve;
                this.sprite.onerror = reject;
                this.sprite.src = spriteUrl;
            });
            this.isLoaded = true;
        } catch (error) {
            console.error('Error loading monkey sprite:', error);
        }
    }



    preloadDanceFrames() {
        console.log('Preloading dance frames...');
        
        // Initialize array with exact size to maintain order
        this.danceImages = new Array(this.totalDanceFrames);
        this.danceFramesLoaded = 0;
        
        // Load all frames
        for (let i = 1; i <= this.totalDanceFrames; i++) {
            const img = new Image();
            const paddedNum = String(i).padStart(4, '0');
            const frameIndex = i - 1; // Convert to 0-based index
            
            // Set up event handlers before setting src
            img.onload = () => {
                this.danceFramesLoaded++;
                console.log(`Loaded dance frame ${i} (${this.danceFramesLoaded}/${this.totalDanceFrames})`);
            };
            
            img.onerror = () => {
                // Try with absolute path if relative path fails
                console.log(`Trying alternate path for frame ${i}`);
                img.src = `/src/assets/animations/monkey_dance/monkey_animation_happydance_${paddedNum}-ipad.png`;
            };
            
            // Start loading the image
            img.src = `src/assets/animations/monkey_dance/monkey_animation_happydance_${paddedNum}-ipad.png`;
            
            // Store at specific index to maintain order
            this.danceImages[frameIndex] = img;
        }
    }



    setPose(pose, direction) {
        this.state = pose;
        this.direction = direction;
        this.currentFrame = 0;
        this.frameCount = 0;

        // Start dance animation when using any fart power
        if (['atomic', 'broccoli', 'ghost-pepper', 'cheese'].includes(pose)) {
            console.log('Starting dance animation');
            this.isDancing = true;
            this.danceFrame = 0;
            this.danceFrameCount = 0;
            
            // Debug log to check if frames are loaded
            console.log(`Dance animation started. Frames loaded: ${this.danceFramesLoaded}/${this.totalDanceFrames}`);
        }
    }

    update() {
        // Update dance animation if dancing
        if (this.isDancing) {
            this.danceFrameCount++;
            
            // Update at 30fps (if game runs at ~60fps)
            if (this.danceFrameCount >= this.danceFrameRate) {
                this.danceFrameCount = 0;
                this.danceFrame++;
                
                // Log each frame change for debugging
                console.log(`Dance frame updated to: ${this.danceFrame}`);
                
                // End dance animation when we reach the end of frames
                if (this.danceFrame >= this.totalDanceFrames) {
                    console.log('Dance animation complete');
                    this.isDancing = false;
                    this.danceFrame = 0;
                    this.state = 'idle';
                }
            }
        } else {
            // Update regular animation frames
            this.frameCount++;
            if (this.frameCount >= this.animationSpeed) {
                this.frameCount = 0;
                this.currentFrame = (this.currentFrame + 1) % this.poses[this.state].frames;
            }
        }
    }

    draw(ctx, x, y) {
        if (!this.isLoaded) return;
        
        // Save context for transformations
        ctx.save();
        
        // Draw dance animation if dancing
        if (this.isDancing && this.danceFrame < this.totalDanceFrames) {
            const danceImg = this.danceImages[this.danceFrame];
            
            if (danceImg && danceImg.complete) {
                // Center the dance animation on the monkey's position
                const centerX = x + (65 * this.scale) / 2;
                const centerY = y + (60 * this.scale) / 2 - 60; // Adjusted offset for better vertical positioning
                
                // Apply scaling and flipping
                ctx.translate(centerX, centerY);
                ctx.scale(this.danceScale, this.danceScale);
                
                if (this.direction === -1) {
                    ctx.scale(-1, 1);
                }
                
                // Draw the dance frame centered
                ctx.drawImage(
                    danceImg,
                    -danceImg.width / 2,
                    -danceImg.height / 2,
                    danceImg.width,
                    danceImg.height
                );
                
                // Debug info - only log occasionally to avoid console spam
                if (this.danceFrame % 5 === 0) {
                    console.log(`Drawing dance frame ${this.danceFrame+1} of ${this.totalDanceFrames}`);
                }
            } else {
                console.log(`Dance frame ${this.danceFrame+1} not ready yet`);
                // Draw regular sprite as fallback
                this.drawRegularSprite(ctx, x, y);
            }
        } 
        // Draw regular sprite if not dancing
        else if (this.sprite) {
            this.drawRegularSprite(ctx, x, y);
        }
        
        ctx.restore();
    }
    
    drawRegularSprite(ctx, x, y) {
        // If we have loaded dance frames, use the first one for regular state
        if (this.danceFramesLoaded > 0 && this.danceImages && this.danceImages[0] && this.danceImages[0].complete) {
            const danceImg = this.danceImages[0];
            const pose = this.poses[this.state];
            
            // Center the sprite - use same positioning logic as dance animation
            const centerX = x + (65 * this.scale) / 2;
            const centerY = y + (60 * this.scale) / 2 - 60; // Same offset as dance animation
            
            ctx.translate(centerX, centerY);
            ctx.scale(this.danceScale, this.danceScale);
            
            if (this.direction === -1) {
                ctx.scale(-1, 1);
            }
            
            // Draw the first dance frame
            ctx.drawImage(
                danceImg,
                -danceImg.width / 2,
                -danceImg.height / 2,
                danceImg.width,
                danceImg.height
            );
        }
        // Fallback to original sprite if dance frames aren't loaded yet
        else if (this.sprite) {
            const pose = this.poses[this.state];
            
            // Center the sprite
            const centerX = x + (pose.width * this.scale) / 2;
            const centerY = y + (pose.height * this.scale) / 2;
            
            ctx.translate(centerX, centerY);
            ctx.scale(this.scale, this.scale);
            
            if (this.direction === -1) {
                ctx.scale(-1, 1);
            }
            
            // Draw the sprite
            ctx.drawImage(
                this.sprite,
                this.currentFrame * pose.width,
                Object.keys(this.poses).indexOf(this.state) * pose.height,
                pose.width,  // Source width from sprite sheet
                pose.height, // Source height from sprite sheet
                -pose.width / 2,
                -pose.height / 2 + (pose.offsetY || 0),
                pose.width,  // Destination width
                pose.height  // Destination height
            );
        }
    }
}
