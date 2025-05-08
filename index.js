document.addEventListener('DOMContentLoaded', () => {
    gsap.set('.container', { opacity: 0 });
    gsap.set('.logo', { opacity: 0, scale: 0.8 });
    gsap.set('.access-level-display', { opacity: 0, x: 20 });
    gsap.set('.module', { opacity: 0, y: 20 });
    gsap.set('.animate-heading', { opacity: 0, y: -20 });
    gsap.set('.animate-text', { opacity: 0, x: -20 });
    gsap.set('.animate-btn', { opacity: 0, y: 20 });

    gsap.to('.logo', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
    });

    gsap.to('.access-level-display', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.to('.container', {
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out'
    });

    gsap.to('.module', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power2.out',
        delay: 0.4
    });

    gsap.to('.animate-heading', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.6
    });


    gsap.to('.animate-text', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.8
    });

    gsap.to('.animate-btn', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 1
    });

    setTimeout(() => {
        document.querySelectorAll('.container, .logo, .access-level-display, .module, .animate-heading, .animate-text, .animate-btn').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }, 2000);

    let archive = [];
    let auditCounter = 1;

    const generateFighterBtn = document.getElementById('generate-fighter-code');
    const fighterCodeBox = document.getElementById('fighter-code');
    const downloadQRBtn = document.getElementById('download-qr-btn');
    const fighterTimestamp = document.getElementById('fighter-timestamp');
    const generateAuditBtn = document.getElementById('generate-audit-number');
    const auditNumberBox = document.getElementById('audit-number');
    const accessLevel = document.getElementById('access-level');
    const unitBindingInput = document.getElementById('unit-binding');
    const notification = document.getElementById('notification');
    const auditButton = document.getElementById('audit-button');
    const auditWindow = document.getElementById('audit-window');
    const closeAudit = document.getElementById('close-audit');
    const clearAuditButton = document.getElementById('clear-audit');
    const auditCount = document.getElementById('audit-count');


    function loadArchiveFromLocalStorage() {
        const savedArchive = localStorage.getItem('archive');
        if (savedArchive) {
            archive = JSON.parse(savedArchive);
            updateAuditCount();
        }
    }

    function saveArchiveToLocalStorage() {
        localStorage.setItem('archive', JSON.stringify(archive));
    }

    function addToArchive(type, code) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const offsetMinutes = now.getTimezoneOffset();
        const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
        const offsetSign = offsetMinutes > 0 ? '-' : '+';
        const utcOffset = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(Math.abs(offsetMinutes % 60)).padStart(2, '0')}`;
        const currentAccessLevel = accessLevel.textContent.split(": ")[1].split(" //")[0];
        const logEntry = `${day}/${month}/${year} | ${utcOffset} - ${seconds}/${minutes}/${hours} | role: ${currentAccessLevel} | ${type} | ${code}`;
        archive.push(logEntry);
        updateAuditCount();
        saveArchiveToLocalStorage();
    }

    function showAuditLog() {
        const auditLog = document.getElementById('audit-log');
        auditLog.textContent = archive.join('\n----------------------\n');
    }

    function updateAuditCount() {
        auditCount.textContent = archive.length;
    }

    function generateFighterCode() {
        const prefix = "MSF-";
        const randomPart1 = Math.random().toString(36).substr(2, 4).toUpperCase();
        const randomPart2 = Math.random().toString(36).substr(2, 4).toUpperCase();
        const randomPart3 = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}${randomPart1}-${randomPart2}-${randomPart3}`;
    }

    function generateAuditNumber() {
        const prefix = "MSF-D-";
        const mainNumber = Math.floor(100000 + Math.random() * 900000);
        const statusNumber = Math.floor(Math.random() * 10);
        return `${prefix}${mainNumber}-${statusNumber}`;
    }

    function generateQRCode(code) {
        const qrCanvas = document.getElementById('qr-code');
        gsap.set(qrCanvas, { opacity: 0, scale: 0.5 });
        QRCode.toCanvas(qrCanvas, code, { errorCorrectionLevel: 'H' }, (error) => {
            if (error) console.error("Ошибка при генерации QR-кода:", error);
            gsap.to(qrCanvas, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
        });
    }

    downloadQRBtn.addEventListener('click', () => {
        const canvas = document.getElementById('qr-code');
        if (!canvas || !canvas.getContext) {
            showNotification('QR-код ещё не сгенерирован!');
            return;
        }
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        const now = new Date();
        const fileName = `QR-Code-${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}.jpg`;
        link.download = fileName;
        link.click();
    });

    generateFighterBtn.addEventListener('click', () => {
        const code = generateFighterCode();
        fighterCodeBox.textContent = code;
        fighterTimestamp.textContent = new Date().toLocaleString();
        generateQRCode(code);
        addToArchive("operate audit", code);
    });

    generateAuditBtn.addEventListener('click', () => {
        const auditNumber = generateAuditNumber();
        auditNumberBox.textContent = auditNumber;
        addToArchive("unit identity", auditNumber);
    });

    unitBindingInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const code = unitBindingInput.value.trim();
            handleAccessCode(code);
        }
    });

    function handleAccessCode(code) {
        if (code === "GAMMAC-917230485619827364012398172034-TACOPS") {
            updateAccessLevel("γάμμα (Гамма)", "green");
            auditButton.classList.add('hidden');
            showNotification("Доступ уровня Гамма подтверждён.");
        } else if (code === "BETACX-042918637561290837465120934576-CMDOPS") {
            updateAccessLevel("βῆτα (Бета)", "blue");
            auditButton.classList.add('hidden');
            showNotification("Доступ уровня Бета подтверждён.");
        } else if (code === "ALPHAC-781296540128399317460325120458-GENCOM") {
            updateAccessLevel("ἄλφα (Альфа)", "red");
            auditButton.classList.remove('hidden');
            gsap.fromTo(auditButton, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
            showNotification("Доступ уровня Альфа подтверждён. Архив доступен.");
        } else {
            updateAccessLevel("δέλτα (Дельта)", "yellow");
            auditButton.classList.add('hidden');
            showNotification("Ошибка доступа. Уровень сброшен на Дельта.");
        }
    }

    function updateAccessLevel(levelText, levelColor) {
        accessLevel.textContent = `Уровень допуска: ${levelText} // Статус: Подключён`;
        accessLevel.style.color = levelColor;
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.remove('hidden');
        gsap.fromTo(notification,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
        setTimeout(() => {
            gsap.to(notification, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    notification.classList.add('hidden');
                    notification.textContent = '';
                }
            });
        }, 3000);
    }

    function clearAudit() {
        archive = [];
        updateAuditCount();
        showAuditLog();
        saveArchiveToLocalStorage();
        showNotification('Архив успешно очищен.');
    }

    clearAuditButton.addEventListener('click', () => {
        if (confirm("Очистить архив?")) {
            clearAudit();
        }
    });

    auditButton.addEventListener('click', () => {
        auditWindow.classList.remove('hidden');
        showAuditLog();
        gsap.fromTo(auditWindow, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
    });

    closeAudit.addEventListener('click', () => {
        gsap.to(auditWindow, {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => auditWindow.classList.add('hidden')
        });
    });
    loadArchiveFromLocalStorage();
});
