import { SpriteGenerator } from './SpriteGenerator.js';

export class MonkeySprite {
    constructor(game) {
        this.game = game;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.animationSpeed = 3; // Faster animations
        this.isLoaded = false;
        this.scale = 2; // Scale factor for the sprite
        this.loadSprite();
        
        // Animation states
        this.state = 'idle';
        this.direction = 1; // 1 for right, -1 for left
        this.rotationAngle = 0;
        
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

    setPose(pose, direction) {
        this.state = pose;
        this.direction = direction;
        this.currentFrame = 0;
        this.frameCount = 0;
    }

    update() {
        // Update animation frames
        this.frameCount++;
        if (this.frameCount >= this.animationSpeed) {
            this.frameCount = 0;
            this.currentFrame = (this.currentFrame + 1) % this.poses[this.state].frames;
        }
    }

    draw(ctx, x, y) {
        if (!this.isLoaded) return;
        
        const pose = this.poses[this.state];
        
        // Draw monkey
        if (this.sprite) {
            // Save context for transformations
            ctx.save();
            
            // Position at center point
            const centerX = x + (pose.width * this.scale) / 2;
            const centerY = y + pose.height + 10; // Added 10px offset to lower the monkey
            
            ctx.translate(centerX, centerY);
            
            // Apply scaling
            ctx.scale(this.scale, this.scale);
            
            // Flip horizontally if facing left
            if (this.direction === -1) {
                ctx.scale(-1, 1);
            }
            
            // Draw at half size to maintain quality but keep original dimensions
            ctx.drawImage(
                this.sprite,
                this.currentFrame * 130,
                Object.keys(this.poses).indexOf(this.state) * 120,
                130,
                120,
                -65/2,
                -60 + (pose.offsetY || 0),
                65,
                60
            );
            
            ctx.restore();
        }
        
        // Restore context
        ctx.restore();
    }
}
