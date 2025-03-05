export class Food {
    constructor(game, type, x, y) {
        this.game = game;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velocityX = -3;
        
        // Food type specific properties
        this.properties = {
            broccoli: {
                energyValue: 25
            },
            cheese: {
                energyValue: 35
            },
            'ghost-pepper': {
                energyValue: 75
            },
            atomic: {
                energyValue: 100
            }
        };
    }

    update() {
        this.x += this.velocityX;
        
        // Check collision with player
        if (this.checkCollision(this.game.player)) {
            // Increase food counter instead of energy
            this.game.foodCounts[this.type] += this.properties[this.type].energyValue;
            return true; // Mark for removal
        }
        
        // Remove if off screen
        if (this.x + this.width < 0) {
            return true;
        }
        
        return false;
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
        const emoji = {
            broccoli: '🥦',
            'ghost-pepper': '🌶️',
            cheese: '🧀',
            atomic: '⚛️'
        }[this.type];

        ctx.font = `${this.width}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw the emoji
        ctx.fillText(
            emoji,
            this.x + this.width/2,
            this.y + this.height/2
        );
    }


}
