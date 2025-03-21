import { playBassDrum, playSnareDrum } from './sound.js';

(function() {
    let player = document.getElementById('player');
    let obstacle = document.getElementById('obstacle');
    let game = document.getElementById('game');
    let jumping = false;
    let audioStarted = false;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(audioContext.destination);

    function startRhythm() {
        setInterval(() => {
            playBassDrum(audioContext);
            setTimeout(() => playSnareDrum(audioContext), 250);
        }, 500);
    }

    function changeFrequencyRandomly() {
        const frequencies = [120, 260, 330, 190, 260, 330, 190];
        setInterval(() => {
            const randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
            oscillator.frequency.setValueAtTime(randomFrequency, audioContext.currentTime);
        }, Math.random() * (600 - 200) + 200);
    }

    function changeColorsAbsurdlyFast() {
        setInterval(() => {
            player.style.backgroundColor = getRandomColor();
            obstacle.style.backgroundColor = getRandomColor();
            game.style.backgroundColor = getRandomColor();
        }, 10); // Change color every 50 milliseconds
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    document.addEventListener('keydown', e => {
        if (e.key === ' ' && !jumping) {
            jumping = true;
            player.style.transition = 'bottom 0.5s';
            player.style.bottom = '800px';

            if (!audioStarted) {
                audioContext.resume().then(() => {
                    oscillator.start();
                    startRhythm();
                    changeFrequencyRandomly();
                    changeColorsAbsurdlyFast();
                    audioStarted = true;
                });
            }

            setTimeout(() => {
                player.style.bottom = '10px';
                setTimeout(() => jumping = false, 500);
            }, 1000);
        } else if (e.key === 'ArrowLeft') {
            movePlayer(-10);
        } else if (e.key === 'ArrowRight') {
            movePlayer(10);
        }
    });

    function movePlayer(distance) {
        let currentLeft = parseInt(player.style.left);
        let newLeft = currentLeft + distance;

        if (newLeft >= 0 && newLeft <= window.innerWidth - 30) {
            player.style.left = newLeft + 'px';
        }
    }

    function moveObstacle() {
        obstacle.style.right = '-30px';
        setInterval(() => {
            let pos = parseInt(obstacle.style.right) + 5;
            obstacle.style.right = pos + 'px';
            if (pos > window.innerWidth) obstacle.style.right = '-30px';

            let playerBottom = parseInt(player.style.bottom);
            let obstacleLeft = window.innerWidth - pos - 30;
            let playerLeft = parseInt(player.style.left);
            let playerRight = playerLeft + 30;

            if (obstacleLeft < playerRight && obstacleLeft + 30 > playerLeft && playerBottom <= 40) {
                alert('Game Over!');
                location.reload();
            }
        }, 30);
    }

    moveObstacle();
})();
