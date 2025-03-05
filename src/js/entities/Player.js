import { MonkeySprite } from './MonkeySprite.js';

export class Player {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.sprite = new MonkeySprite(game);
        this.width = 65;  // Original width
        this.height = 60; // Original height
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -25; // Even stronger jump
        this.gravity = 0.5;  // Further reduced gravity for higher jumps
        this.isGrounded = false;
        this.direction = 1; // 1 for right, -1 for left
        
        // Fart system
        this.fartPowers = {
            atomic: { energy: 0, maxEnergy: 100, duration: 45 },      // ~1.5 seconds
            broccoli: { energy: 50, maxEnergy: 100, duration: 60 },   // 2 seconds
            'ghost-pepper': { energy: 0, maxEnergy: 100, duration: 35 }, // ~1.2 seconds
            cheese: { energy: 30, maxEnergy: 100, duration: 25 }      // ~0.8 seconds
        };
        
        this.poseTimer = 0;
        this.isPerformingTrick = false;
    }

    update() {
        // Update sprite animation
        this.sprite.update();
        
        // Update pose timer
        if (this.poseTimer > 0) {
            this.poseTimer--;
            if (this.poseTimer === 0) {
                this.isPerformingTrick = false;
                this.sprite.setPose('idle', this.velocityX > 0 ? 1 : -1);
            }
        }
        
        // Horizontal movement
        this.x += this.velocityX;
        
        // Update running animation
        if (!this.isPerformingTrick) {
            if (this.velocityX !== 0) {
                this.sprite.setPose('running', this.velocityX > 0 ? 1 : -1);
            } else {
                this.sprite.setPose('idle', this.sprite.direction);
            }
        }
        
        // Vertical movement & gravity
        if (!this.isGrounded) {
            this.velocityY += this.gravity;
        }
        this.y += this.velocityY;

        // Ground collision
        if (this.y + this.height > this.game.canvas.height - 200) {
            // Only play landing sound if we were falling
            if (this.velocityY > 1) {
                this.game.audio.play('land');
            }
            
            this.y = this.game.canvas.height - 200 - this.height;
            this.velocityY = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }



        // Keep player in bounds
        this.x = Math.max(0, Math.min(this.game.canvas.width - this.width, this.x));
    }

    jump() {
        if (this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
            // Play jump sound
            this.game.audio.play('jump');
        }
    }

    useFartPower(type, direction) {
        // Get energy from game's food count instead of internal energy
        if (this.game.foodCounts[type] <= 0) return false;
        
        this.isPerformingTrick = true;
        this.sprite.setPose(type, direction);
        this.poseTimer = this.fartPowers[type].duration;
        this.sprite.direction = direction;
        
        return true;
    }



    draw(ctx) {
        this.sprite.draw(ctx, this.x, this.y);
    }
}
