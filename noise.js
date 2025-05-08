let animationFrameId;

function initNoise() {
    console.log('Attempting to initialize noise...');
    const canvas = document.getElementById('noise-canvas');
    if (!canvas) {
        console.error('Noise canvas not found! Check if <canvas id="noise-canvas"> exists in the HTML.');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get 2D context for canvas!');
        return;
    }
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    let offset = 0;
    try {
        offset = parseFloat(localStorage.getItem('noiseOffset')) || 0;
    } catch (e) {
        console.warn('localStorage is not available. Using default offset.');
    }
    const spacing = 50;
    const cycleLength = canvas.height + spacing;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        offset += 0.2;
        if (offset > cycleLength) {
            offset -= cycleLength;
        }

        for (let x = -canvas.height; x < canvas.width + canvas.height; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x + offset, 0);
            ctx.lineTo(x + offset - canvas.height, canvas.height);
            ctx.strokeStyle = 'rgba(144, 238, 144, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        try {
            localStorage.setItem('noiseOffset', offset.toString());
        } catch (e) {
            console.warn('Unable to save noiseOffset to localStorage.');
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    console.log('Starting noise animation...');
    animate();
    
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationFrameId);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing noise...');
    initNoise();
});
