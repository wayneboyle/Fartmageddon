export class AnimationLoader {
    static async loadFrames(directory, prefix, frameCount, startFrame = 1, padLength = 4) {
        const frames = [];
        for (let i = startFrame; i <= frameCount; i++) {
            const paddedNumber = i.toString().padStart(padLength, '0');
            const img = new Image();
            img.src = `/src/assets/animations/${directory}/${prefix}${paddedNumber}-ipad.png`;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            frames.push(img);
        }
        return frames;
    }

    static async loadAnimations() {
        const animations = {
            dance: await this.loadFrames('monkey_dance', 'monkey_animation_happydance_', 160),
            flip: await this.loadFrames('monkey_flip', 'monkey_animation_Flip_', 38, 0)
        };
        return animations;
    }
}
