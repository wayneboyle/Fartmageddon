export class EnemySprite {
    constructor(type) {
        this.type = type;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.animationSpeed = 4;
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
        // Body
        ctx.fillStyle = '#2E8B57';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width/2, height/3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.ellipse(x + width * 0.8, y + height/2, width/4, height/4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Jaws
        ctx.beginPath();
        ctx.moveTo(x + width * 0.7, y + height/2);
        ctx.lineTo(x + width, y + height/2);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + width * 0.85, y + height * 0.4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Legs
        this.drawLeg(ctx, x + width * 0.3, y + height * 0.8, 10, Math.sin(this.currentFrame/10) * 0.2);
        this.drawLeg(ctx, x + width * 0.6, y + height * 0.8, 10, -Math.sin(this.currentFrame/10) * 0.2);
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
