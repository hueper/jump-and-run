export function playBassDrum(audioContext) {
    const bassOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    bassOscillator.type = 'sine';
    bassOscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);

    bassOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    bassOscillator.start();
    bassOscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    bassOscillator.stop(audioContext.currentTime + 0.1);
}

export function playSnareDrum(audioContext) {
    const bufferSize = audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(3000, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noise.start();
    noise.stop(audioContext.currentTime + 0.1);

    setTimeout(() => {
        const noise2 = audioContext.createBufferSource();
        noise2.buffer = noiseBuffer;

        const noiseFilter2 = audioContext.createBiquadFilter();
        noiseFilter2.type = 'bandpass';
        noiseFilter2.frequency.setValueAtTime(3000, audioContext.currentTime);

        const gainNode2 = audioContext.createGain();
        gainNode2.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        noise2.connect(noiseFilter2);
        noiseFilter2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        noise2.start();
        noise2.stop(audioContext.currentTime + 0.1);
    }, 50);
}
