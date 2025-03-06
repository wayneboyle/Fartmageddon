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
        let pathIndex = 0;
        const paths = [
            'src/assets/characters/Alligator_1.png',  // Relative path
            '/src/assets/characters/Alligator_1.png', // Full path from root
            'assets/characters/Alligator_1.png',      // Public path
            '/assets/characters/Alligator_1.png'      // Full public path
        ];
        
        const tryNextPath = () => {
            if (pathIndex >= paths.length) {
                console.error('Failed to load alligator sprite after trying all paths');
                return;
            }
            console.log('Trying to load alligator from:', paths[pathIndex]);
            alligatorImg.src = paths[pathIndex++];
        };
        
        alligatorImg.onerror = tryNextPath;
        tryNextPath(); // Start with first path
        
        return new Promise((resolve) => {
            let hasResolved = false;
            
            alligatorImg.onload = () => {
                if (hasResolved) return;
                hasResolved = true;
                
                console.log('Successfully loaded alligator sprite');
                
                // Scale to match original dimensions while maintaining aspect ratio
                const targetHeight = 50; // Slightly smaller height to match other characters
                const scale = targetHeight / alligatorImg.height;
                const scaledWidth = alligatorImg.width * scale;
                
                // Generate 4 frames with simple walking animation
                for (let frame = 0; frame < 4; frame++) {
                    const x = frame * 65;
                    
                    ctx.save();
                    ctx.translate(x + 32, 30);
                    
                    // Add walking animation
                    ctx.translate(0, Math.sin(frame * Math.PI) * 2); // Reduced bounce
                    
                    // Draw alligator image scaled to match dimensions
                    ctx.drawImage(alligatorImg, -scaledWidth/2, -25, scaledWidth, targetHeight);
                    ctx.restore();
                }
                
                resolve(canvas.toDataURL());
            };
            
            // If all paths fail, resolve with a fallback
            const originalOnError = alligatorImg.onerror;
            alligatorImg.onerror = (e) => {
                if (pathIndex < paths.length) {
                    originalOnError(e);
                } else if (!hasResolved) {
                    console.error('All alligator image paths failed, using fallback');
                    hasResolved = true;
                    
                    // Draw a simple green rectangle as fallback
                    for (let frame = 0; frame < 4; frame++) {
                        const x = frame * 65;
                        ctx.save();
                        ctx.translate(x + 32, 30);
                        ctx.fillStyle = '#2E8B57';
                        ctx.fillRect(-25, -25, 50, 50);
                        ctx.strokeRect(-25, -25, 50, 50);
                        ctx.restore();
                    }
                    
                    resolve(canvas.toDataURL());
                }
            };
        });
    }
}
