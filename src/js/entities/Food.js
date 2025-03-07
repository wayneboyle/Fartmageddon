export class Food {
    constructor(game, type, x, y) {
        this.game = game;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 50;  // Increased size from 30 to 50
        this.height = 50; // Increased size from 30 to 50
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
        
        // Load the appropriate image
        this.image = new Image();
        
        // Map the food type to the new PNG files with transparent backgrounds
        const imageMap = {
            'broccoli': 'broccoli.png',
            'cheese': 'cheese.png',
            'ghost-pepper': 'pepper.png',
            'atomic': 'atomic.png'
        };
        
        // Set up error handler before setting src
        this.image.onerror = () => {
            console.error(`Failed to load image for food type: ${this.type}`);
            // Try with absolute path if relative path fails
            this.image.src = `/src/assets/foods/${imageMap[this.type]}`;
        };
        
        // Set up load handler
        this.image.onload = () => {
            console.log(`Successfully loaded image for food type: ${this.type}`);
        };
        
        // Start loading the image with relative path (same pattern as MonkeySprite)
        this.image.src = `src/assets/foods/${imageMap[this.type]}`;
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
        // Check if image is loaded
        if (this.image.complete) {
            // Draw the image with increased size (PNG files have natural transparency)
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Fallback to colored rectangle if image isn't loaded yet
            const colors = {
                broccoli: '#2ECC40',  // Green
                'ghost-pepper': '#FF4136',  // Red
                cheese: '#FFDC00',  // Yellow
                atomic: '#B10DC9'   // Purple
            };
            
            ctx.fillStyle = colors[this.type] || '#AAAAAA';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }


}
