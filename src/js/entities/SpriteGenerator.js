import { AnimationLoader } from './AnimationLoader.js';

export class SpriteGenerator {
    static async createMonkeySprite() {
        // Create high-res canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: true });
        
        // Load high quality monkey image
        const monkeyImg = new Image();
        monkeyImg.src = '/src/assets/characters/monkey_1.png';
        
        await new Promise((resolve, reject) => {
            monkeyImg.onload = resolve;
            monkeyImg.onerror = reject;
        });
        
        // Calculate dimensions to maintain aspect ratio
        const scale = 120 / monkeyImg.height; // Double the original height for better quality
        const scaledWidth = monkeyImg.width * scale;
        
        // Set canvas size for sprite sheet (doubled for quality)
        canvas.width = 130 * 8;  // Double the original width per frame
        canvas.height = 120 * 6; // Double the original height per state
        
        // Configure for high quality rendering
        ctx.imageSmoothingEnabled = false;
        
        // Generate frames for each state
        const states = ['idle', 'running', 'atomic', 'broccoli', 'ghostPepper', 'cheese'];
        states.forEach((state, stateIndex) => {
            const frameCount = state === 'ghostPepper' ? 8 : 
                             state === 'atomic' ? 6 :
                             state === 'running' ? 4 : 2;
            
            for (let frame = 0; frame < frameCount; frame++) {
                const x = frame * 130; // Double width spacing
                const y = stateIndex * 120; // Double height spacing
                
                ctx.save();
                ctx.translate(x + 65, y + 60); // Center point
                
                // Draw high quality frame
                ctx.drawImage(monkeyImg, -scaledWidth/2, -60, scaledWidth, 120);
                ctx.restore();
            }
        });
        
        return canvas.toDataURL();
    }
    
    static createAlligatorSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size for alligator sprite
        canvas.width = 65 * 4;  // 4 frames
        canvas.height = 60;     // 1 state
        
        // Load alligator image
        const alligatorImg = new Image();
        alligatorImg.src = '/src/assets/characters/Alligator_1.png';
        
        return new Promise((resolve) => {
            alligatorImg.onload = () => {
                // Scale to match original dimensions
                const scale = 60 / alligatorImg.height;
                const scaledWidth = alligatorImg.width * scale;
                
                // Generate 4 frames with simple walking animation
                for (let frame = 0; frame < 4; frame++) {
                    const x = frame * 65;
                    
                    ctx.save();
                    ctx.translate(x + 32, 30);
                    
                    // Add walking animation
                    ctx.translate(0, Math.sin(frame * Math.PI) * 3);
                    
                    // Draw alligator image scaled to match dimensions
                    ctx.drawImage(alligatorImg, -scaledWidth/2, -30, scaledWidth, 60);
                    ctx.restore();
                }
                
                resolve(canvas.toDataURL());
            };
        });
    }
}
