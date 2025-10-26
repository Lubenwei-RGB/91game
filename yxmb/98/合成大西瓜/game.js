// 游戏类
class WatermelonGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // 游戏状态
        this.isGameRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.gameOver = false;
        
        // Matter.js 物理引擎
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.render = null;
        
        // 游戏对象
        this.fruits = [];
        this.currentFruit = null;
        this.nextFruitType = 0;
        this.dropLine = null;
        this.mouseX = this.canvas.width / 2;
        
        // 水果配置 (默认)
        this.fruitConfig = [
            { size: 20, points: 1, color: '#FF6B9D', name: '樱桃', emoji: '🍒' },
            { size: 30, points: 3, color: '#C44569', name: '草莓', emoji: '🍓' },
            { size: 40, points: 6, color: '#FFA726', name: '橙子', emoji: '🍊' },
            { size: 50, points: 10, color: '#FFEB3B', name: '柠檬', emoji: '🍋' },
            { size: 60, points: 15, color: '#4CAF50', name: '苹果', emoji: '🍎' },
            { size: 70, points: 21, color: '#FF5722', name: '桃子', emoji: '🍑' },
            { size: 80, points: 28, color: '#9C27B0', name: '李子', emoji: '🟣' },
            { size: 90, points: 36, color: '#673AB7', name: '葡萄', emoji: '🍇' },
            { size: 100, points: 45, color: '#3F51B5', name: '梨', emoji: '🍐' },
            { size: 120, points: 55, color: '#2196F3', name: '椰子', emoji: '🥥' },
            { size: 140, points: 66, color: '#00BCD4', name: '西瓜', emoji: '🍉' }
        ];
        
        // 自定义图片
        this.customImages = {};
        this.imageCache = {};
        
        this.init();
    }
    
    init() {
        this.setupPhysics();
        this.setupEventListeners();
        this.loadCustomImages();
        this.updateDisplay();
        this.generateNextFruit();
        this.startGame();
    }
    
    setupPhysics() {
        // 重力设置
        this.engine.world.gravity.y = 0.8;
        
        // 创建边界
        const wallThickness = 10;
        const ground = Matter.Bodies.rectangle(
            this.canvas.width / 2, 
            this.canvas.height + wallThickness / 2, 
            this.canvas.width, 
            wallThickness, 
            { isStatic: true }
        );
        
        const leftWall = Matter.Bodies.rectangle(
            -wallThickness / 2, 
            this.canvas.height / 2, 
            wallThickness, 
            this.canvas.height, 
            { isStatic: true }
        );
        
        const rightWall = Matter.Bodies.rectangle(
            this.canvas.width + wallThickness / 2, 
            this.canvas.height / 2, 
            wallThickness, 
            this.canvas.height, 
            { isStatic: true }
        );
        
        Matter.World.add(this.world, [ground, leftWall, rightWall]);
        
        // 碰撞检测
        Matter.Events.on(this.engine, 'collisionStart', (event) => {
            this.handleCollisions(event.pairs);
        });
    }
    
    setupEventListeners() {
        // 鼠标移动
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isGameRunning || this.isPaused) return;
            
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.updateDropLine();
        });
        
        // 鼠标点击投放水果
        this.canvas.addEventListener('click', (e) => {
            if (!this.isGameRunning || this.isPaused || this.currentFruit) return;
            this.dropFruit();
        });
        
        // 触摸支持
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.isGameRunning || this.isPaused) return;
            
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.updateDropLine();
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.isGameRunning || this.isPaused || this.currentFruit) return;
            this.dropFruit();
        });
        
        // 控制按钮
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('restartFromModal').addEventListener('click', () => {
            this.hideGameOverModal();
            this.restartGame();
        });
        
        // 图片上传
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('imageUpload').click();
        });
        
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            this.handleImageUpload(e.files);
        });
        
        document.getElementById('resetImages').addEventListener('click', () => {
            this.resetToDefaultImages();
        });
    }
    
    generateNextFruit() {
        // 只生成前5种水果
        this.nextFruitType = Math.floor(Math.random() * Math.min(5, this.fruitConfig.length));
        this.drawNextFruit();
    }
    
    drawNextFruit() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        const fruit = this.fruitConfig[this.nextFruitType];
        const x = this.nextCanvas.width / 2;
        const y = this.nextCanvas.height / 2;
        const scale = 0.6;
        
        if (this.customImages[this.nextFruitType]) {
            this.drawFruitImage(this.nextCtx, this.customImages[this.nextFruitType], x, y, fruit.size * scale);
        } else {
            this.drawDefaultFruit(this.nextCtx, fruit, x, y, fruit.size * scale);
        }
    }
    
    dropFruit() {
        if (this.currentFruit || !this.isGameRunning) return;
        
        const fruitType = this.nextFruitType;
        const fruit = this.fruitConfig[fruitType];
        
        // 确保在边界内
        const x = Math.max(fruit.size / 2, Math.min(this.canvas.width - fruit.size / 2, this.mouseX));
        
        // 创建物理体
        const body = Matter.Bodies.circle(x, 50, fruit.size / 2, {
            restitution: 0.3,
            friction: 0.1,
            frictionAir: 0.01
        });
        
        // 添加自定义属性
        body.fruitType = fruitType;
        body.isNewlyDropped = true;
        
        Matter.World.add(this.world, body);
        this.fruits.push(body);
        this.currentFruit = body;
        
        // 短暂延迟后允许下一个水果
        setTimeout(() => {
            this.currentFruit = null;
            this.generateNextFruit();
        }, 500);
        
        this.createDropEffect(x, 50);
    }
    
    handleCollisions(pairs) {
        pairs.forEach(pair => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            
            // 检查是否为水果碰撞
            if (bodyA.fruitType !== undefined && bodyB.fruitType !== undefined) {
                // 相同类型且都不是新投放的
                if (bodyA.fruitType === bodyB.fruitType && 
                    !bodyA.isNewlyDropped && !bodyB.isNewlyDropped &&
                    bodyA.fruitType < this.fruitConfig.length - 1) {
                    
                    this.mergeFruits(bodyA, bodyB);
                }
            }
            
            // 移除新投放标记
            if (bodyA.isNewlyDropped) bodyA.isNewlyDropped = false;
            if (bodyB.isNewlyDropped) bodyB.isNewlyDropped = false;
        });
    }
    
    mergeFruits(fruitA, fruitB) {
        // 计算合成位置
        const x = (fruitA.position.x + fruitB.position.x) / 2;
        const y = (fruitA.position.y + fruitB.position.y) / 2;
        
        // 移除原来的水果
        Matter.World.remove(this.world, [fruitA, fruitB]);
        this.fruits = this.fruits.filter(f => f !== fruitA && f !== fruitB);
        
        // 创建新水果
        const newType = fruitA.fruitType + 1;
        const newFruit = this.fruitConfig[newType];
        
        const newBody = Matter.Bodies.circle(x, y, newFruit.size / 2, {
            restitution: 0.3,
            friction: 0.1,
            frictionAir: 0.01
        });
        
        newBody.fruitType = newType;
        
        Matter.World.add(this.world, newBody);
        this.fruits.push(newBody);
        
        // 更新分数
        this.score += newFruit.points;
        this.updateDisplay();
        
        // 合成特效
        this.createMergeEffect(x, y, newFruit);
        
        // 检查是否达到西瓜
        if (newType === this.fruitConfig.length - 1) {
            this.createWatermelonEffect(x, y);
        }
    }
    
    createDropEffect(x, y) {
        // 简单的粒子效果
        for (let i = 0; i < 5; i++) {
            this.createParticle(x, y, '#FFF');
        }
    }
    
    createMergeEffect(x, y, fruit) {
        // 合成爆炸效果
        for (let i = 0; i < 10; i++) {
            this.createParticle(x, y, fruit.color);
        }
    }
    
    createWatermelonEffect(x, y) {
        // 西瓜特殊效果
        for (let i = 0; i < 20; i++) {
            this.createParticle(x, y, '#FF6B9D');
        }
    }
    
    createParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = (this.canvas.offsetLeft + x) + 'px';
        particle.style.top = (this.canvas.offsetTop + y) + 'px';
        particle.style.backgroundColor = color;
        particle.style.width = '4px';
        particle.style.height = '4px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
    
    updateDropLine() {
        // 更新投放预览线
        if (!this.dropLine) {
            this.dropLine = document.createElement('div');
            this.dropLine.className = 'drop-line';
            this.canvas.parentNode.appendChild(this.dropLine);
        }
        
        this.dropLine.style.left = (this.canvas.offsetLeft + this.mouseX) + 'px';
        this.dropLine.style.top = this.canvas.offsetTop + 'px';
        this.dropLine.style.height = this.canvas.height + 'px';
    }
    
    gameLoop() {
        if (!this.isGameRunning || this.isPaused) return;
        
        // 更新物理引擎
        Matter.Engine.update(this.engine);
        
        // 检查游戏结束
        this.checkGameOver();
        
        // 渲染
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制所有水果
        this.fruits.forEach(fruit => {
            this.drawFruit(fruit);
        });
        
        // 绘制预览水果
        if (!this.currentFruit && this.mouseX !== null) {
            this.drawPreviewFruit();
        }
    }
    
    drawFruit(body) {
        const fruit = this.fruitConfig[body.fruitType];
        const x = body.position.x;
        const y = body.position.y;
        const radius = fruit.size / 2;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(body.angle);
        
        if (this.customImages[body.fruitType]) {
            this.drawFruitImage(this.ctx, this.customImages[body.fruitType], 0, 0, fruit.size);
        } else {
            this.drawDefaultFruit(this.ctx, fruit, 0, 0, fruit.size);
        }
        
        this.ctx.restore();
    }
    
    drawDefaultFruit(ctx, fruit, x, y, size) {
        const radius = size / 2;
        
        // 渐变背景
        const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius);
        gradient.addColorStop(0, this.lightenColor(fruit.color, 30));
        gradient.addColorStop(1, fruit.color);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = this.darkenColor(fruit.color, 20);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 表情符号
        ctx.font = `${radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFF';
        ctx.fillText(fruit.emoji, x, y);
    }
    
    drawFruitImage(ctx, image, x, y, size) {
        const radius = size / 2;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.clip();
        
        ctx.drawImage(image, x - radius, y - radius, size, size);
        
        ctx.restore();
        
        // 边框
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawPreviewFruit() {
        const fruit = this.fruitConfig[this.nextFruitType];
        const x = this.mouseX;
        const y = 50;
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.6;
        
        if (this.customImages[this.nextFruitType]) {
            this.drawFruitImage(this.ctx, this.customImages[this.nextFruitType], x, y, fruit.size);
        } else {
            this.drawDefaultFruit(this.ctx, fruit, x, y, fruit.size);
        }
        
        this.ctx.restore();
    }
    
    checkGameOver() {
        // 检查是否有水果超出顶部边界
        const dangerLine = 100;
        for (let fruit of this.fruits) {
            if (fruit.position.y < dangerLine && Math.abs(fruit.velocity.y) < 0.1) {
                this.endGame();
                return;
            }
        }
    }
    
    endGame() {
        this.isGameRunning = false;
        this.gameOver = true;
        
        // 更新最高分
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
            this.updateDisplay();
        }
        
        this.showGameOverModal();
    }
    
    showGameOverModal() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverModal').style.display = 'block';
    }
    
    hideGameOverModal() {
        document.getElementById('gameOverModal').style.display = 'none';
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('pauseBtn');
        btn.textContent = this.isPaused ? '▶️ 继续' : '⏸️ 暂停';
        
        if (!this.isPaused) {
            this.gameLoop();
        }
    }
    
    restartGame() {
        // 清除所有水果
        this.fruits.forEach(fruit => {
            Matter.World.remove(this.world, fruit);
        });
        this.fruits = [];
        
        // 重置游戏状态
        this.score = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.currentFruit = null;
        this.mouseX = this.canvas.width / 2;
        
        // 重置按钮文本
        document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
        
        this.updateDisplay();
        this.generateNextFruit();
        this.startGame();
    }
    
    startGame() {
        this.isGameRunning = true;
        this.gameLoop();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('bestScore').textContent = this.bestScore;
        this.updateFruitList();
    }
    
    // 图片上传功能
    handleImageUpload(files) {
        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/') && index < this.fruitConfig.length) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        this.customImages[index] = img;
                        this.saveCustomImages();
                        this.updateFruitList();
                        this.drawNextFruit();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    saveCustomImages() {
        const imageData = {};
        Object.keys(this.customImages).forEach(key => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = this.customImages[key];
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            imageData[key] = canvas.toDataURL();
        });
        
        localStorage.setItem('customImages', JSON.stringify(imageData));
    }
    
    loadCustomImages() {
        const saved = localStorage.getItem('customImages');
        if (saved) {
            const imageData = JSON.parse(saved);
            Object.keys(imageData).forEach(key => {
                const img = new Image();
                img.onload = () => {
                    this.customImages[key] = img;
                    this.updateFruitList();
                };
                img.src = imageData[key];
            });
        }
    }
    
    resetToDefaultImages() {
        this.customImages = {};
        localStorage.removeItem('customImages');
        this.updateFruitList();
        this.drawNextFruit();
    }
    
    updateFruitList() {
        const fruitList = document.getElementById('fruitList');
        fruitList.innerHTML = '';
        
        this.fruitConfig.forEach((fruit, index) => {
            const fruitItem = document.createElement('div');
            fruitItem.className = 'fruit-item';
            fruitItem.onclick = () => this.selectFruitForUpload(index);
            
            const img = document.createElement('img');
            if (this.customImages[index]) {
                img.src = this.customImages[index].src;
            } else {
                // 创建默认图片
                const canvas = document.createElement('canvas');
                canvas.width = 40;
                canvas.height = 40;
                const ctx = canvas.getContext('2d');
                this.drawDefaultFruit(ctx, fruit, 20, 20, 36);
                img.src = canvas.toDataURL();
            }
            
            const label = document.createElement('span');
            label.textContent = fruit.name;
            
            fruitItem.appendChild(img);
            fruitItem.appendChild(label);
            fruitList.appendChild(fruitItem);
        });
    }
    
    selectFruitForUpload(index) {
        const input = document.getElementById('imageUpload');
        input.onchange = (e) => {
            if (e.target.files[0]) {
                this.uploadSpecificFruit(index, e.target.files[0]);
            }
        };
        input.click();
    }
    
    uploadSpecificFruit(index, file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.customImages[index] = img;
                this.saveCustomImages();
                this.updateFruitList();
                this.drawNextFruit();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // 颜色工具函数
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
                     (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
                     (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 + 
                     (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 + 
                     (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new WatermelonGame();
});

