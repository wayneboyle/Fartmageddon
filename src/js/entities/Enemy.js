import { EnemySprite } from './EnemySprite.js';

export class Enemy {
    constructor(game, type, x, y) {
        this.game = game;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.velocityX = -2; // Move left towards player
        this.isDestroyed = false;
        this.destructionTimer = 0;
        this.destructionColor = null;
        this.sprite = new EnemySprite(type);
        
        // Enemy type specific properties
        this.properties = {
            alligator: {
                color: '#2E8B57',
                points: 30,
                size: { width: 60, height: 40 }
            },
            crab: {
                color: '#FF4040',
                points: 20,
                size: { width: 40, height: 30 }
            },
            scorpion: {
                color: '#8B4513',
                points: 40,
                size: { width: 45, height: 35 }
            }
        };
        
        // Set size based on type
        if (this.properties[type]) {
            this.width = this.properties[type].size.width;
            this.height = this.properties[type].size.height;
        }
    }

    update() {
        if (this.isDestroyed) {
            this.destructionTimer++;
            return this.destructionTimer > 60; // Remove after 1 second
        }
        
        // Update sprite animation
        this.sprite.update();

        this.x += this.velocityX;
        
        // Check collision with player if not destroyed
        if (this.checkCollision(this.game.player)) {
            if (this.game.player.y + this.game.player.height < this.y + this.height/2) {
                // Player successfully jumped over enemy
                this.game.addScore(this.properties[this.type].points);
                this.destroy('jump');
            } else {
                // Player collision without jumping - reduce score
                this.game.addScore(-this.properties[this.type].points * 2);
                this.destroy('collision');
            }
        }
        
        // Remove if off screen
        return this.x + this.width < 0;
    }

    destroy(type) {
        if (this.isDestroyed) return; // Prevent double destruction
        
        this.isDestroyed = true;
        this.destructionColor = type === 'collision' ? '#FF0000' : 
                              type === 'jump' ? '#FFFFFF' : 
                              this.game.getFartColor(type);
        
        // Only award extra points for fart kills
        if (type !== 'collision' && type !== 'jump') {
            this.game.addScore(this.properties[this.type].points * 2);
        }
    }

    checkCollision(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }

    draw(ctx) {
        if (this.isDestroyed) {
            // Draw destruction animation (dust cloud)
            this.drawDestructionCloud(ctx);
            return;
        }

        // Draw enemy using sprite
        this.sprite.draw(ctx, this.x, this.y, this.width, this.height);
    }

    drawDestructionCloud(ctx) {
        const particles = 8;
        const radius = 10 * (1 - this.destructionTimer/60);
        
        ctx.fillStyle = this.destructionColor;
        for (let i = 0; i < particles; i++) {
            const angle = (Math.PI * 2 * i) / particles;
            const spread = this.destructionTimer * 2;
            const x = this.x + this.width/2 + Math.cos(angle) * spread;
            const y = this.y + this.height/2 + Math.sin(angle) * spread;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
