// Random Number Generator - Main JavaScript
class RandomNumberApp {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('numberHistory')) || [];
        this.settings = JSON.parse(localStorage.getItem('appSettings')) || {
            minRange: 1,
            maxRange: 100000000000,
            soundEnabled: true,
            effectsEnabled: true
        };
        this.currentNumber = null;
        this.particles = [];
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.initParticles();
        this.updateStats();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateNumber());
        }

        // Range inputs
        const minInput = document.getElementById('minRange');
        const maxInput = document.getElementById('maxRange');
        if (minInput && maxInput) {
            minInput.addEventListener('change', (e) => {
                this.settings.minRange = parseInt(e.target.value) || 1;
                this.saveSettings();
            });
            maxInput.addEventListener('change', (e) => {
                this.settings.maxRange = parseInt(e.target.value) || 100000000000;
                this.saveSettings();
            });
        }

        // Clear history button
        const clearBtn = document.getElementById('clearHistory');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearHistory());
        }

        // Settings toggles
        const soundToggle = document.getElementById('soundToggle');
        const effectsToggle = document.getElementById('effectsToggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                this.settings.soundEnabled = e.target.checked;
                this.saveSettings();
            });
        }
        if (effectsToggle) {
            effectsToggle.addEventListener('change', (e) => {
                this.settings.effectsEnabled = e.target.checked;
                this.saveSettings();
            });
        }
    }

    generateNumber() {
        const min = this.settings.minRange;
        const max = this.settings.maxRange;
        
        // Generate random number
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        this.currentNumber = randomNumber;
        
        // Add to history
        this.history.unshift({
            number: randomNumber,
            timestamp: new Date().toISOString(),
            range: { min, max }
        });
        
        // Keep only last 100 numbers
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
        
        // Save to localStorage
        localStorage.setItem('numberHistory', JSON.stringify(this.history));
        
        // Animate the number display
        this.animateNumberDisplay(randomNumber);
        
        // Trigger particle effects
        if (this.settings.effectsEnabled) {
            this.triggerParticleBurst();
        }
        
        // Update statistics
        this.updateStats();
        
        // Play sound effect (if enabled)
        if (this.settings.soundEnabled) {
            this.playGenerationSound();
        }
    }

    animateNumberDisplay(number) {
        const display = document.getElementById('numberDisplay');
        if (!display) return;
        
        // Animate counting up to the number
        anime({
            targets: { value: 0 },
            value: number,
            duration: 2000,
            easing: 'easeOutExpo',
            update: (anim) => {
                display.textContent = Math.floor(anim.animatables[0].target.value).toLocaleString('fa-IR');
            },
            complete: () => {
                display.textContent = number.toLocaleString('fa-IR');
                this.addGlowEffect(display);
            }
        });
    }

    addGlowEffect(element) {
        element.style.textShadow = '0 0 20px #D4AF37, 0 0 40px #D4AF37, 0 0 60px #D4AF37';
        element.style.color = '#D4AF37';
        
        setTimeout(() => {
            element.style.textShadow = 'none';
            element.style.color = '#F8F8FF';
        }, 3000);
    }

    triggerParticleBurst() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        
        // Create particle burst effect
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                decay: 0.02,
                color: `hsl(${Math.random() * 60 + 40}, 100%, 70%)`
            });
        }
    }

    initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Initialize background particles
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: Math.random(),
                decay: 0.001,
                color: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
                size: Math.random() * 3 + 1
            });
        }
        
        this.animateParticles(ctx, canvas);
    }

    animateParticles(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size || 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            return particle.life > 0;
        });
        
        this.animationId = requestAnimationFrame(() => this.animateParticles(ctx, canvas));
    }

    updateStats() {
        // Update history count
        const historyCount = document.getElementById('historyCount');
        if (historyCount) {
            historyCount.textContent = this.history.length;
        }
        
        // Update recent numbers
        const recentList = document.getElementById('recentNumbers');
        if (recentList) {
            recentList.innerHTML = '';
            this.history.slice(0, 5).forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.number.toLocaleString('fa-IR');
                li.className = 'text-sm text-gray-300 mb-1';
                recentList.appendChild(li);
            });
        }
        
        // Update statistics page if visible
        this.updateStatisticsPage();
    }

    updateStatisticsPage() {
        if (this.history.length === 0) return;
        
        const statsContainer = document.getElementById('statisticsContainer');
        if (!statsContainer) return;
        
        const numbers = this.history.map(item => item.number);
        const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        
        statsContainer.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-4 mb-4">
                <h3 class="text-lg font-bold text-teal-400 mb-2">آمار کلی</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-gray-400">تعداد اعداد:</span>
                        <span class="text-white">${numbers.length}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">میانگین:</span>
                        <span class="text-white">${Math.round(avg).toLocaleString('fa-IR')}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">کوچکترین:</span>
                        <span class="text-white">${min.toLocaleString('fa-IR')}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">بزرگترین:</span>
                        <span class="text-white">${max.toLocaleString('fa-IR')}</span>
                    </div>
                </div>
            </div>
        `;
    }

    clearHistory() {
        if (confirm('آیا مطمئن هستید که می‌خواهید تاریخچه را پاک کنید؟')) {
            this.history = [];
            localStorage.removeItem('numberHistory');
            this.updateStats();
            
            // Show confirmation
            const message = document.createElement('div');
            message.textContent = 'تاریخچه پاک شد!';
            message.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-4 py-2 rounded-lg z-50';
            document.body.appendChild(message);
            
            setTimeout(() => {
                document.body.removeChild(message);
            }, 3000);
        }
    }

    loadSettings() {
        // Load range settings
        const minInput = document.getElementById('minRange');
        const maxInput = document.getElementById('maxRange');
        if (minInput) minInput.value = this.settings.minRange;
        if (maxInput) maxInput.value = this.settings.maxRange;
        
        // Load toggle settings
        const soundToggle = document.getElementById('soundToggle');
        const effectsToggle = document.getElementById('effectsToggle');
        if (soundToggle) soundToggle.checked = this.settings.soundEnabled;
        if (effectsToggle) effectsToggle.checked = this.settings.effectsEnabled;
    }

    saveSettings() {
        localStorage.setItem('appSettings', JSON.stringify(this.settings));
    }

    setupNavigation() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
            }
        });
    }

    navigateToPage(page) {
        // Simple page navigation for mobile webapp
        window.location.href = `${page}.html`;
    }

    playGenerationSound() {
        // Create a simple audio context beep
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    // Lucky number generation with special effects
    generateLuckyNumber() {
        const luckyNumbers = [7, 13, 21, 42, 77, 99, 777, 999, 7777, 9999];
        const randomLucky = luckyNumbers[Math.floor(Math.random() * luckyNumbers.length)];
        
        // Enhanced animation for lucky numbers
        this.animateNumberDisplay(randomLucky);
        this.triggerEnhancedParticles();
        
        return randomLucky;
    }

    triggerEnhancedParticles() {
        // More dramatic particle effects for lucky numbers
        this.triggerParticleBurst();
        setTimeout(() => this.triggerParticleBurst(), 500);
        setTimeout(() => this.triggerParticleBurst(), 1000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.randomNumberApp = new RandomNumberApp();
});

// Handle window resize for particle canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
