import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.isAwake = false;
        this.isGameOver = false;
    }

    preload() {
        this.load.image('player', require('../assets/images/player.jpg'));
        this.load.image('enemy', require('../assets/images/enemy.jpg'));
    }

    create() {
        // Player setup
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.3); // Decreased player size

        // Enemy setup
        this.enemies = this.physics.add.group();
        const enemy = this.enemies.create(400, 300, 'enemy');
        enemy.setCollideWorldBounds(true);
        enemy.setScale(0.4);

        // Wake-up prompt
        this.wakeUpText = this.add.text(150, 250, 'Press SPACE to wake up!', {
            font: '28px Arial',
            fill: '#ffffff'
        });

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Collision detection
        this.physics.add.overlap(this.player, this.enemies, this.onPlayerCaught, null, this);
    }

    update() {
        if (this.isGameOver) return;

        if (!this.isAwake && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.isAwake = true;
            if (this.wakeUpText) this.wakeUpText.destroy();

            this.player.setAlpha(0);
            this.tweens.add({
                targets: this.player,
                alpha: 1,
                duration: 800,
                ease: 'Power2'
            });
        }

        if (this.isAwake) {
            this.handlePlayerMovement();

            const SPEED = 100;
            const CHASE_RADIUS = 1000;

            this.enemies.getChildren().forEach(enemy => {
                const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                if (distance < CHASE_RADIUS) {
                    this.physics.moveToObject(enemy, this.player, SPEED);
                } else {
                    enemy.setVelocity(0, 0);
                }
            });
        }
    }

    handlePlayerMovement() {
        const speed = 300; // Increased speed
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }

    onPlayerCaught(player, enemy) {
        if (this.isGameOver) return;
        this.isGameOver = true;

        this.physics.pause();
        player.setTint(0xff0000);
        player.setVelocity(0);

        if (this.wakeUpText) this.wakeUpText.destroy();

        this.add.text(150, 250, '💀 You were caught!', {
            font: '32px Arial',
            fill: '#ff0000'
        });
    }
}
