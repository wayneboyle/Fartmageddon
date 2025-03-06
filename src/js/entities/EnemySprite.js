export class EnemySprite {
    constructor(type) {
        this.type = type;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.animationSpeed = 4;
        this.imageLoadAttempted = false;
        this.imageLoaded = false;
        
        // Load alligator image if needed
        if (type === 'alligator') {
            this.loadAlligatorImage();
        }
    }

    loadAlligatorImage() {
        if (this.imageLoadAttempted) return;
        
        this.imageLoadAttempted = true;
        this.alligatorImg = new Image();
        
        // Try different paths that work in both local and production
        const tryLoadImage = (paths) => {
            if (paths.length === 0) {
                console.error('Failed to load alligator image after trying all paths');
                return;
            }
            
            const currentPath = paths[0];
            const remainingPaths = paths.slice(1);
            
            this.alligatorImg.onerror = () => {
                console.log('Failed to load from:', currentPath);
                tryLoadImage(remainingPaths);
            };
            
            this.alligatorImg.onload = () => {
                console.log('Successfully loaded alligator image from:', currentPath);
                this.imageLoaded = true;
                console.log('Alligator image dimensions:', {
                    width: this.alligatorImg.width,
                    height: this.alligatorImg.height
                });
            };
            
            this.alligatorImg.src = currentPath;
        };
        
        // Try paths in order (will try next on failure)
        tryLoadImage([
            '/assets/characters/Alligator_1.png',    // Vercel public path
            'assets/characters/Alligator_1.png',      // Relative public path
            '/src/assets/characters/Alligator_1.png', // Full path from root
            'src/assets/characters/Alligator_1.png',  // Relative path
            './src/assets/characters/Alligator_1.png' // Explicit relative path
        ]);

        // Log attempt for debugging
        console.log('Attempting to load alligator image...');
    }

    draw(ctx, x, y, width, height) {
        ctx.save();
        
        // Common enemy features
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        
        switch(this.type) {
            case 'alligator':
                this.drawAlligator(ctx, x, y, width, height);
                break;
            case 'crab':
                this.drawCrab(ctx, x, y, width, height);
                break;
            case 'scorpion':
                this.drawScorpion(ctx, x, y, width, height);
                break;
        }
        
        ctx.restore();
    }

    drawAlligator(ctx, x, y, width, height) {
        // Try to load the image if we haven't yet
        if (!this.imageLoadAttempted) {
            this.loadAlligatorImage();
        }
        
        // Add a slight bounce animation
        const bounceOffset = Math.sin(this.currentFrame/10) * 2;
        
        // If image is loaded and ready, draw it
        if (this.imageLoaded && this.alligatorImg && this.alligatorImg.complete && this.alligatorImg.naturalWidth > 0) {
            try {
                // Log the first time we successfully draw
                if (!this.hasDrawnOnce) {
                    console.log('Drawing alligator at:', { x, y, width, height });
                    this.hasDrawnOnce = true;
                }
                
                ctx.drawImage(this.alligatorImg, x, y + bounceOffset, width, height);
            } catch (error) {
                console.error('Error drawing alligator:', error);
                this.drawFallbackAlligator(ctx, x, y, width, height);
            }
        } else {
            // Draw fallback if image isn't ready
            this.drawFallbackAlligator(ctx, x, y, width, height);
            if (!this.imageLoaded) {
                console.log('Image not yet loaded, using fallback');
            }
        }
    }
    
    drawFallbackAlligator(ctx, x, y, width, height) {
        // Simple rectangle as fallback
        ctx.fillStyle = '#2E8B57';
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    drawCrab(ctx, x, y, width, height) {
        // Body
        ctx.fillStyle = '#FF4040';
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Eyes on stalks
        this.drawEyeStalk(ctx, x + width * 0.4, y + height * 0.3, 8);
        this.drawEyeStalk(ctx, x + width * 0.6, y + height * 0.3, 8);

        // Claws
        const clawAngle = Math.sin(this.currentFrame/10) * 0.2;
        this.drawClaw(ctx, x + width * 0.2, y + height/2, width * 0.3, height * 0.2, -clawAngle);
        this.drawClaw(ctx, x + width * 0.8, y + height/2, width * 0.3, height * 0.2, clawAngle);

        // Legs
        for(let i = 0; i < 3; i++) {
            const legAngle = Math.sin(this.currentFrame/10 + i) * 0.2;
            this.drawLeg(ctx, x + width * (0.3 + i * 0.2), y + height * 0.8, 8, legAngle);
            this.drawLeg(ctx, x + width * (0.3 + i * 0.2), y + height * 0.8, 8, -legAngle);
        }
    }

    drawScorpion(ctx, x, y, width, height) {
        // Body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(x + width * 0.4, y + height/2, width/4, height/3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Tail segments
        const tailAngle = Math.sin(this.currentFrame/15) * 0.3;
        this.drawTailSegment(ctx, x + width * 0.6, y + height * 0.4, width * 0.15, height * 0.15, tailAngle);
        this.drawTailSegment(ctx, x + width * 0.75, y + height * 0.3, width * 0.15, height * 0.15, tailAngle * 1.5);
        
        // Stinger
        ctx.beginPath();
        ctx.moveTo(x + width * 0.9, y + height * 0.2);
        ctx.lineTo(x + width * 0.95, y + height * 0.15);
        ctx.stroke();

        // Pincers
        const pincerAngle = Math.sin(this.currentFrame/10) * 0.2;
        this.drawPincer(ctx, x + width * 0.2, y + height * 0.4, width * 0.2, height * 0.15, -pincerAngle);
        this.drawPincer(ctx, x + width * 0.2, y + height * 0.6, width * 0.2, height * 0.15, pincerAngle);

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + width * 0.45, y + height * 0.4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Legs
        for(let i = 0; i < 4; i++) {
            const legAngle = Math.sin(this.currentFrame/10 + i) * 0.2;
            this.drawLeg(ctx, x + width * (0.3 + i * 0.15), y + height * 0.8, 8, legAngle);
            this.drawLeg(ctx, x + width * (0.3 + i * 0.15), y + height * 0.8, 8, -legAngle);
        }
    }

    drawLeg(ctx, x, y, length, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, length);
        ctx.stroke();
        ctx.restore();
    }

    drawEyeStalk(ctx, x, y, length) {
        ctx.beginPath();
        ctx.moveTo(x, y + length);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    drawClaw(ctx, x, y, width, height, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height/2);
        ctx.lineTo(width * 0.8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    drawPincer(ctx, x, y, width, height, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height/2);
        ctx.lineTo(width * 0.9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    drawTailSegment(ctx, x, y, width, height, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    update() {
        this.frameCount++;
        if (this.frameCount >= this.animationSpeed) {
            this.frameCount = 0;
            this.currentFrame = (this.currentFrame + 1) % 60; // Use 60 frames for smooth animation cycles
        }
    }
}
