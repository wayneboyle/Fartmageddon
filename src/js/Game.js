import { Player } from './entities/Player.js';
import { Food } from './entities/Food.js';
import { AudioManager } from './AudioManager.js';

import { Enemy } from './entities/Enemy.js';

export class Game {
    constructor() {
        this.isPaused = false;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.foodCounts = {
            broccoli: 5,
            cheese: 5,
            'ghost-pepper': 5,
            atomic: 5
        };
        
        this.resizeCanvas();
        this.setupEventListeners();
        
        // Initialize audio
        this.audio = new AudioManager();
        
        // Game entities
        this.player = new Player(this, 100, 100);
        this.foods = [];
        this.enemies = [];
        this.particles = [];
        
        // Game state
        this.isRunning = false;
        this.foodSpawnTimer = 0;
        this.enemySpawnTimer = 0;
        this.foodSpawnInterval = 120; // Slower food spawn
        this.baseEnemySpawnInterval = 600; // Start with 10 seconds between enemies
        this.enemySpawnInterval = this.baseEnemySpawnInterval;
        this.gameOverFlag = false;
        this.lastSpeedIncreaseScore = 0;
        this.minEnemySpawnInterval = 300; // Never spawn faster than 5 seconds

        // Start game loop immediately but don't spawn enemies until game starts
        this.gameLoop();
        
        // Controls
        this.keys = {};
        
        // Available types
        this.foodTypes = {
            broccoli: 40,
            cheese: 30,
            'ghost-pepper': 30,
            atomic: 20  // More rare than other types
        };
        
        this.enemyTypes = [
            'alligator',
            'crab',
            'scorpion'
        ];
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Fart power controls
            switch(e.key) {
                case ' ':
                    this.tryFartPower('broccoli');
                    break;
                case 'z':
                    this.tryFartPower('atomic');
                    break;
                case 'x':
                    this.tryFartPower('ghost-pepper');
                    break;
                case 'c':
                    this.tryFartPower('cheese');
                    break;
                case 'p':
                    this.togglePause();
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener('resize', () => this.resizeCanvas());

        // Setup pause and stop buttons
        document.getElementById('pauseButton').addEventListener('click', () => this.togglePause());
        document.getElementById('stopButton').addEventListener('click', () => this.stopGame());

        // Setup movement buttons
        document.getElementById('leftButton').addEventListener('mousedown', () => this.keys['ArrowLeft'] = true);
        document.getElementById('leftButton').addEventListener('mouseup', () => this.keys['ArrowLeft'] = false);
        document.getElementById('leftButton').addEventListener('mouseleave', () => this.keys['ArrowLeft'] = false);
        
        document.getElementById('rightButton').addEventListener('mousedown', () => this.keys['ArrowRight'] = true);
        document.getElementById('rightButton').addEventListener('mouseup', () => this.keys['ArrowRight'] = false);
        document.getElementById('rightButton').addEventListener('mouseleave', () => this.keys['ArrowRight'] = false);
        
        document.getElementById('jumpButton').addEventListener('mousedown', () => this.keys['ArrowUp'] = true);
        document.getElementById('jumpButton').addEventListener('mouseup', () => this.keys['ArrowUp'] = false);
        document.getElementById('jumpButton').addEventListener('mouseleave', () => this.keys['ArrowUp'] = false);

        // Touch events for mobile support
        const addTouchEvents = (buttonId, key) => {
            const button = document.getElementById(buttonId);
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys[key] = true;
            });
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys[key] = false;
            });
        };

        addTouchEvents('leftButton', 'ArrowLeft');
        addTouchEvents('rightButton', 'ArrowRight');
        addTouchEvents('jumpButton', 'ArrowUp');

        // Setup fart buttons
        const setupFartButton = (buttonId, key) => {
            const button = document.getElementById(buttonId);
            const pressHandler = (e) => {
                e.preventDefault();
                this.tryFartPower(key);
            };
            button.addEventListener('mousedown', pressHandler);
            button.addEventListener('touchstart', pressHandler);
        };

        setupFartButton('broccoliButton', 'broccoli');
        setupFartButton('ghostPepperButton', 'ghost-pepper');
        setupFartButton('cheeseButton', 'cheese');
        setupFartButton('atomicButton', 'atomic');
    }

    tryFartPower(type) {
        if (!this.isRunning || this.foodCounts[type] <= 0) return;
        
        // Find the nearest enemy
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        for (let enemy of this.enemies) {
            if (!enemy.isDestroyed) {
                const distance = Math.abs(enemy.x - this.player.x);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = enemy;
                }
            }
        }
        
        // Default direction is based on player's current direction or nearest enemy
        let direction = nearestEnemy ? (nearestEnemy.x > this.player.x ? 1 : -1) : this.player.sprite.direction;
        
        if (this.player.useFartPower(type, direction)) {
            // Decrease food count by 1 but never below 0
            this.foodCounts[type] = Math.max(0, this.foodCounts[type] - 1);
            
            // Check for enemy hits in the direction we're facing
            const range = this.getFartRange(type);
            for (let enemy of this.enemies) {
                if (!enemy.isDestroyed) {
                    if (direction > 0 && enemy.x > this.player.x && enemy.x < this.player.x + range) {
                        enemy.destroy(type);
                    } else if (direction < 0 && enemy.x < this.player.x && enemy.x > this.player.x - range) {
                        enemy.destroy(type);
                    }
                }
            }
            
            // Create particles in the correct direction
            this.createFartParticles(type, direction);
            
            // Map the type to the correct sound name
            const soundType = type === 'ghost-pepper' ? 'ghostPepper' : type;
            this.audio.playFartSound(soundType, 0);
        }
    }

    getFartColor(type) {
        const particleColors = {
            broccoli: '#90EE90',
            atomic: '#FF4500',
            'ghost-pepper': '#FF0000',
            cheese: '#FFD700'
        };
        return particleColors[type] || '#90EE90';
    }

    getFartRange(type) {
        const ranges = {
            broccoli: 150,    // Shortest range
            'ghost-pepper': 250, // Medium-long range
            cheese: 200,     // Medium range
            atomic: 350      // Longest range
        };
        return ranges[type] || 150;
    }



    createFartParticles(type, direction) {
        const particleColors = {
            broccoli: '#90EE90',
            atomic: '#FF4500',
            'ghost-pepper': '#FF0000',
            cheese: '#FFD700'
        };

        if (type === 'atomic') {
            // Create mushroom cloud stem
            const stemHeight = 100; // Shorter stem
            const startX = this.player.x + (direction > 0 ? this.player.width : 0);
            const startY = this.player.y + this.player.height / 2;
            
            // Ground flash
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: startX + (direction * Math.random() * 20),
                    y: startY,
                    vx: direction * (Math.random() * 1),
                    vy: 0,
                    size: Math.random() * 20 + 10,
                    color: '#FFFFFF',
                    life: 0.3,
                    type: 'flash'
                });
            }
            
            // Stem particles
            for (let i = 0; i < 15; i++) {
                const height = Math.random() * stemHeight;
                const spread = Math.min(height / 4, 10); // Narrower spread
                this.particles.push({
                    x: startX + (direction * (Math.random() - 0.5) * spread),
                    y: startY - height,
                    vx: direction * (Math.random() * 1),
                    vy: -Math.random() * 4 - 2, // Slower upward movement
                    size: Math.random() * 15 + 10,
                    color: i % 2 === 0 ? '#FF4500' : '#8B0000',
                    life: 0.6,
                    type: 'stem',
                    originalY: startY - height
                });
            }
            
            // Mushroom cap particles
            const capWidth = 80; // Narrower cap
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 * i) / 20;
                const radius = capWidth * (0.8 + Math.random() * 0.4);
                this.particles.push({
                    x: startX + (direction * 30),
                    y: startY - stemHeight,
                    vx: direction * (Math.cos(angle) * 3),
                    vy: Math.sin(angle) * 3 - 1,
                    size: Math.random() * 20 + 10,
                    color: i % 2 === 0 ? '#FF4500' : '#8B0000',
                    life: 0.6,
                    type: 'cap',
                    angle: angle,
                    radius: radius
                });
            }
            
            // Fire ring at base
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI * 2 * i) / 10;
                this.particles.push({
                    x: startX,
                    y: startY,
                    vx: direction * (Math.cos(angle) * 5),
                    vy: Math.sin(angle) * 5,
                    size: Math.random() * 10 + 5,
                    color: '#FFA500',
                    life: 0.4,
                    type: 'ring'
                });
            }
        } else {
            // Regular fart particles for other types
            for (let i = 0; i < 10; i++) {
                this.particles.push({
                    x: this.player.x + (direction > 0 ? this.player.width : 0),
                    y: this.player.y + this.player.height / 2,
                    vx: direction * (Math.random() * 5 + 2),
                    vy: (Math.random() - 0.5) * 4,
                    size: Math.random() * 10 + 5,
                    color: particleColors[type],
                    life: 1
                });
            }
        }
    }

    showComboText() {
        const comboDisplay = document.getElementById('comboDisplay');
        comboDisplay.textContent = `${this.combo}x COMBO!`;
        comboDisplay.style.opacity = '1';
        
        setTimeout(() => {
            comboDisplay.style.opacity = '0';
        }, 1000);
    }

    spawnFood() {
        if (--this.foodSpawnTimer <= 0) {
            // Select food type based on weights
            const total = Object.values(this.foodTypes).reduce((a, b) => a + b, 0);
            let random = Math.random() * total;
            let selectedType;
            
            for (const [type, weight] of Object.entries(this.foodTypes)) {
                random -= weight;
                if (random <= 0) {
                    selectedType = type;
                    break;
                }
            }
            
            this.foods.push(new Food(
                this,
                selectedType,
                this.canvas.width,
                Math.random() * (this.canvas.height - 400) + 50
            ));
            
            this.foodSpawnTimer = this.foodSpawnInterval;
        }
    }

    spawnEnemy() {
        if (--this.enemySpawnTimer <= 0) {
            const randomType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            
            const enemy = new Enemy(this, randomType, this.canvas.width, 0);
            // Position enemy at ground level based on its height
            enemy.y = this.canvas.height - 200 - enemy.height; // Ground height (200) minus enemy height
            this.enemies.push(enemy);
            
            this.enemySpawnTimer = this.enemySpawnInterval;
        }
    }

    addScore(points) {
        this.score = Math.max(0, this.score + points); // Prevent score from going below 0
        
        // Check if we've crossed a 50-point threshold
        const scoreThreshold = Math.floor(this.score / 50) * 50;
        if (scoreThreshold > this.lastSpeedIncreaseScore) {
            this.lastSpeedIncreaseScore = scoreThreshold;
            // Decrease spawn interval more gradually, but never below minEnemySpawnInterval
            this.enemySpawnInterval = Math.max(
                this.minEnemySpawnInterval,
                Math.floor(this.enemySpawnInterval * 0.9)
            );
        }
    }

    gameOver() {
        this.gameOverFlag = true;
        this.isRunning = false;
        this.audio.stopBackgroundMusic();
    }

    start() {
        this.isRunning = true;
        this.audio.startBackgroundMusic();
        this.gameLoop();
    }

    getFartColor(type) {
        const colors = {
            broccoli: '#90EE90',
            ghostPepper: '#FF0000',
            cheese: '#FFD700'
        };
        return colors[type] || '#FFFFFF';
    }

    updateHUD() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('broccoli-count').textContent = this.foodCounts.broccoli;
        document.getElementById('ghost-pepper-count').textContent = this.foodCounts['ghost-pepper'];
        document.getElementById('cheese-count').textContent = this.foodCounts.cheese;
        document.getElementById('atomic-count').textContent = this.foodCounts.atomic;
    }

    update() {
        if (!this.isRunning || this.isPaused) return;

        // Update player
        if (this.keys['ArrowLeft']) this.player.velocityX = -this.player.speed;
        else if (this.keys['ArrowRight']) this.player.velocityX = this.player.speed;
        else this.player.velocityX = 0;
        
        if (this.keys['ArrowUp']) this.player.jump();
        
        this.player.update();

        // Spawn and update foods
        this.spawnFood();
        this.foods = this.foods.filter(food => !food.update());

        // Spawn and update enemies
        this.spawnEnemy();
        this.enemies = this.enemies.filter(enemy => !enemy.update());

        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.type === 'stem') {
                particle.life -= 0.02; // Faster fade
                particle.size *= 1.02; // Grow less
                // Gentler wave motion
                particle.y = particle.originalY + Math.sin(Date.now() / 200 + particle.originalY) * 2;
            } else if (particle.type === 'cap') {
                particle.life -= 0.02; // Faster fade
                particle.size *= 1.02; // Grow less
                // Less dramatic expansion
                const newRadius = particle.radius * (1 + (1 - particle.life) * 0.3);
                particle.x += Math.cos(particle.angle + Date.now() / 400) * newRadius * 0.01;
                particle.y += Math.sin(particle.angle + Date.now() / 400) * newRadius * 0.01;
            } else if (particle.type === 'flash') {
                particle.life -= 0.1; // Very quick fade for flash
                particle.size *= 1.05; // Less expansion
            } else if (particle.type === 'ring') {
                particle.life -= 0.05; // Faster fade for ring
                particle.size *= 0.98; // Shrink less
            } else {
                particle.life -= 0.02;
            }
            
            return particle.life > 0;
        });

        // Update HUD
        this.updateHUD();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 200, this.canvas.width, 200);

        // Draw instructions on ground
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('← → Move   ↑ Jump   Z: Atomic   X: Ghost Pepper   C: Cheese   Space: Broccoli', 
            this.canvas.width / 2, this.canvas.height - 90);
        this.ctx.fillText('Jump over or fart on enemies to score points! Collect food to power up your farts!',
            this.canvas.width / 2, this.canvas.height - 70);

        // Draw entities
        this.foods.forEach(food => food.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.player.draw(this.ctx);

        // Draw particles
        this.particles.forEach(particle => {
            if (particle.type === 'stem' || particle.type === 'cap') {
                // Enhanced glowing effect for mushroom cloud
                const glow = particle.life * 0.8;
                this.ctx.shadowBlur = 30;
                this.ctx.shadowColor = particle.color;
                this.ctx.fillStyle = `${particle.color}${Math.floor((particle.life + glow) * 200).toString(16).padStart(2, '0')}`;
            } else if (particle.type === 'flash') {
                // Bright flash effect
                this.ctx.shadowBlur = 50;
                this.ctx.shadowColor = '#FFFFFF';
                this.ctx.fillStyle = `${particle.color}${Math.floor(particle.life * 255).toString(16).padStart(2, '0')}`;
            } else if (particle.type === 'ring') {
                // Fire ring effect
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#FFA500';
                this.ctx.fillStyle = `${particle.color}${Math.floor(particle.life * 255).toString(16).padStart(2, '0')}`;
            } else {
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = `${particle.color}${Math.floor(particle.life * 255).toString(16).padStart(2, '0')}`;
            }
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.shadowBlur = 0;
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseButton = document.getElementById('pauseButton');
        pauseButton.textContent = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
    }

    stopGame() {
        this.gameOver();
        location.reload(); // Refresh the page to restart
    }

    start() {
        document.getElementById('startScreen').style.display = 'none';
        this.isRunning = true;
    }
}
