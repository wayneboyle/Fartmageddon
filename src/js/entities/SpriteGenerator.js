// This is a temporary helper to generate a placeholder sprite sheet
export class SpriteGenerator {
    static createMonkeySprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size for sprite sheet (6 states, 8 frames each)
        canvas.width = 65 * 8;  // Max frame width * max frames
        canvas.height = 60 * 6; // Max height * number of states
        
        // Colors
        const colors = {
            body: '#8B4513',
            face: '#DEB887',
            details: '#000000'
        };
        
        // Generate frames for each state
        const states = ['idle', 'running', 'atomic', 'broccoli', 'ghostPepper', 'cheese'];
        states.forEach((state, stateIndex) => {
            const frameCount = state === 'ghostPepper' ? 8 : 
                             state === 'atomic' ? 6 :
                             state === 'running' ? 4 : 2;
            
            for (let frame = 0; frame < frameCount; frame++) {
                const x = frame * 65;
                const y = stateIndex * 60;
                
                // Save context for transformations
                ctx.save();
                ctx.translate(x + 32, y + 30);

                // Draw monkey body
                ctx.fillStyle = colors.body;
                // Body
                ctx.beginPath();
                ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
                ctx.fill();

                // Arms
                ctx.beginPath();
                ctx.ellipse(-18, 0, 8, 15, -Math.PI/4, 0, Math.PI * 2);
                ctx.ellipse(18, 0, 8, 15, Math.PI/4, 0, Math.PI * 2);
                ctx.fill();

                // Legs
                ctx.beginPath();
                ctx.ellipse(-10, 20, 8, 12, 0, 0, Math.PI * 2);
                ctx.ellipse(10, 20, 8, 12, 0, 0, Math.PI * 2);
                ctx.fill();

                // Tail (curved)
                ctx.beginPath();
                ctx.moveTo(0, 15);
                ctx.quadraticCurveTo(20, 15, 25, 0);
                ctx.lineWidth = 5;
                ctx.strokeStyle = colors.body;
                ctx.stroke();

                // Head
                ctx.fillStyle = colors.face;
                ctx.beginPath();
                ctx.ellipse(0, -15, 12, 15, 0, 0, Math.PI * 2);
                ctx.fill();

                // Face details
                ctx.fillStyle = colors.details;
                // Eyes
                ctx.beginPath();
                ctx.ellipse(-5, -18, 2, 3, 0, 0, Math.PI * 2);
                ctx.ellipse(5, -18, 2, 3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Nose
                ctx.beginPath();
                ctx.ellipse(0, -12, 4, 3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Mouth
                ctx.beginPath();
                ctx.arc(0, -8, 6, 0, Math.PI);
                ctx.strokeStyle = colors.details;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Ears
                ctx.fillStyle = colors.body;
                ctx.beginPath();
                ctx.ellipse(-12, -25, 5, 7, -Math.PI/6, 0, Math.PI * 2);
                ctx.ellipse(12, -25, 5, 7, Math.PI/6, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
                
                // Add state-specific animations
                switch(state) {
                    case 'idle':
                        // Slight body bounce
                        ctx.translate(0, Math.sin(frame * Math.PI) * 2);
                        break;
                        
                    case 'running':
                        // Running legs
                        ctx.beginPath();
                        ctx.moveTo(x + 25, y + 45);
                        ctx.lineTo(x + 25 + Math.sin(frame * Math.PI) * 10, y + 55);
                        ctx.moveTo(x + 39, y + 45);
                        ctx.lineTo(x + 39 + Math.sin(frame * Math.PI + Math.PI) * 10, y + 55);
                        ctx.stroke();
                        break;
                        
                    case 'atomic':
                        // Backflip rotation
                        ctx.translate(x + 32, y + 30);
                        ctx.rotate((frame / 6) * Math.PI * 2);
                        ctx.translate(-(x + 32), -(y + 30));
                        break;
                        
                    case 'broccoli':
                        // Kung-fu pose
                        ctx.beginPath();
                        ctx.moveTo(x + 32, y + 45);
                        ctx.lineTo(x + 50, y + 35 + Math.sin(frame * Math.PI) * 5);
                        ctx.stroke();
                        break;
                        
                    case 'ghostPepper':
                        // Break-dance spin
                        ctx.translate(x + 32, y + 30);
                        ctx.rotate((frame / 8) * Math.PI * 4);
                        ctx.translate(-(x + 32), -(y + 30));
                        break;
                        
                    case 'cheese':
                        // Booty shake
                        ctx.translate(x + 32, y + 30);
                        ctx.rotate(Math.sin(frame * Math.PI / 2) * 0.2);
                        ctx.translate(-(x + 32), -(y + 30));
                        break;
                }
                
                // Reset transformations
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        });
        
        // Convert canvas to data URL
        return canvas.toDataURL();
    }
}
