import { SpriteGenerator } from './SpriteGenerator.js';

export class MonkeySprite {
    constructor(game) {
        this.game = game;
        this.loadSprite();
        this.currentFrame = 0;
        this.frameCount = 0;
        this.animationSpeed = 3; // Faster animations
        
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
                offsetY: -10,
                frames: 8
            },
            // Broccoli Fog: Kung-fu stance
            broccoli: {
                width: 65,
                height: 60,
                offsetY: -5,
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
                offsetY: -5,
                frames: 6
            }
        };
    }

    loadSprite() {
        this.sprite = new Image();
        this.sprite.src = SpriteGenerator.createMonkeySprite();
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
        const pose = this.poses[this.state];
        
        // Save context for transformations
        ctx.save();
        
        // Position at center point
        ctx.translate(x + pose.width/2, y + pose.height/2);
        
        // Flip horizontally if facing left
        if (this.direction === -1) {
            ctx.scale(-1, 1);
        }
        
        // Special pose animations
        switch(this.state) {
            case 'atomic':
                // Full backflip rotation
                this.rotationAngle = (this.currentFrame / pose.frames) * Math.PI * 2;
                ctx.rotate(this.rotationAngle);
                break;
            case 'ghost-pepper':
                // Break-dance spin with horizontal flip
                this.rotationAngle = (this.currentFrame / pose.frames) * Math.PI * 4;
                ctx.rotate(this.rotationAngle);
                break;
            case 'broccoli':
                // Kung-fu stance with leg kick
                ctx.translate(0, Math.sin(this.currentFrame * Math.PI / 3) * 10);
                ctx.rotate(Math.sin(this.currentFrame * Math.PI / 3) * 0.3);
                break;
            case 'cheese':
                // Booty shake wiggle with squash and stretch
                ctx.scale(1 + Math.sin(this.currentFrame * Math.PI) * 0.2, 
                         1 - Math.sin(this.currentFrame * Math.PI) * 0.2);
                ctx.rotate(Math.sin(this.currentFrame * Math.PI / 2) * 0.3);
                break;
            case 'running':
                // Add bounce to running
                ctx.translate(0, Math.sin(this.currentFrame * Math.PI) * 5);
                break;
            case 'idle':
                // Gentle idle animation
                ctx.translate(0, Math.sin(this.currentFrame * Math.PI / 2) * 3);
                break;
        }
        
        // Draw monkey
        ctx.drawImage(
            this.sprite,
            this.currentFrame * pose.width,
            Object.keys(this.poses).indexOf(this.state) * pose.height,
            pose.width,
            pose.height,
            -pose.width/2,
            -pose.height/2 + pose.offsetY,
            pose.width,
            pose.height
        );
        
        // Restore context
        ctx.restore();
    }
}
