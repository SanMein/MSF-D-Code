// Архив кодов
let archive = [];
let auditCounter = 1; // Счетчик для нумерации записей

// Получаем элементы
const generateFighterBtn = document.getElementById('generate-fighter-code');
const fighterCodeBox = document.getElementById('fighter-code');
const downloadQRBtn = document.getElementById('download-qr-btn');
const fighterTimestamp = document.getElementById('fighter-timestamp');

const generateAuditBtn = document.getElementById('generate-audit-number');
const auditNumberBox = document.getElementById('audit-number');
const accessLevel = document.getElementById('access-level');
const unitBindingInput = document.getElementById('unit-binding');
const errorMessage = document.getElementById('error-message');
const auditButton = document.getElementById('audit-button');
const auditWindow = document.getElementById('audit-window');
const closeAudit = document.getElementById('close-audit');
const auditCount = document.getElementById('audit-count');

// Загружаем архив из localStorage при загрузке страницы
function loadArchiveFromLocalStorage() {
    const savedArchive = localStorage.getItem('archive');
    if (savedArchive) {
        archive = JSON.parse(savedArchive); // Восстанавливаем массив из JSON
        updateAuditCount(); // Обновляем счетчик записей
    }
}

// Сохраняем архив в localStorage
function saveArchiveToLocalStorage() {
    localStorage.setItem('archive', JSON.stringify(archive)); // Сохраняем массив в JSON
}

// Функция для записи в архив
function addToArchive(type, code) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // День с ведущим нулём
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяц с ведущим нулём
    const year = String(now.getFullYear()).slice(-2); // Последние две цифры года
    const hours = String(now.getHours()).padStart(2, '0'); // Часы
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Минуты
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Секунды

    // Определяем смещение относительно UTC
    const offsetMinutes = now.getTimezoneOffset(); // Смещение в минутах (минус для часов впереди UTC)
    const offsetHours = Math.abs(Math.floor(offsetMinutes / 60)); // Часовая часть смещения
    const offsetSign = offsetMinutes > 0 ? '-' : '+'; // Знак смещения (+ или -)
    const utcOffset = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(Math.abs(offsetMinutes % 60)).padStart(2, '0')}`;

    // Получаем текущий уровень доступа
    const currentAccessLevel = accessLevel.textContent.split(": ")[1].split(" //")[0];

    // Формируем запись в новом формате
    const logEntry = `${day}/${month}/${year} | ${utcOffset} - ${seconds}/${minutes}/${hours} | role: ${currentAccessLevel} | ${type} | ${code}`;

    // Добавляем запись в архив
    archive.push(logEntry);
    updateAuditCount(); // Обновляем счетчик записей
    saveArchiveToLocalStorage(); // Сохраняем архив в localStorage
}

// Функция для отображения архива
function showAuditLog() {
    const auditLog = document.getElementById('audit-log');
    auditLog.textContent = archive.join('\n-----------------------\n'); // Соединяем записи разделителем
}

// Обновление счетчика записей
function updateAuditCount() {
    auditCount.textContent = archive.length; // Обновляем текст счетчика
}

// Генерация случайного кода бойца
function generateFighterCode() {
    const prefix = "SFO-";
    const randomPart1 = Math.random().toString(36).substr(2, 4).toUpperCase();
    const randomPart2 = Math.random().toString(36).substr(2, 4).toUpperCase();
    const randomPart3 = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${randomPart1}-${randomPart2}-${randomPart3}`;
}

// Генерация номера аудита
function generateAuditNumber() {
    const prefix = "MSF-D-";
    const mainNumber = Math.floor(100000 + Math.random() * 900000); // Шестизначное число
    const statusNumber = Math.floor(Math.random() * 10); // Однозначное число
    return `${prefix}${mainNumber}-${statusNumber}`;
}

// Генерация QR-кода
function generateQRCode(code) {
    const qrCanvas = document.getElementById('qr-code');

    // Сначала делаем QR-код невидимым (убираем класс visible)
    qrCanvas.classList.remove('visible');

    // Генерируем QR-код
    QRCode.toCanvas(qrCanvas, code, { errorCorrectionLevel: 'H' }, (error) => {
        if (error) console.error("Ошибка при генерации QR-кода:", error);

        // После завершения генерации добавляем класс visible для плавного появления
        setTimeout(() => {
            qrCanvas.classList.add('visible');
        }, 50); // Небольшая задержка для эффекта
    });
}

// Скачивание QR-кода
downloadQRBtn.addEventListener('click', () => {
    const canvas = document.getElementById('qr-code');
    if (!canvas || !canvas.getContext) {
        alert("QR-код ещё не сгенерирован!");
        return;
    }

    // Создаём ссылку для скачивания
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg'); // Преобразуем canvas в изображение
    const now = new Date();
    const fileName = `QR-Code-${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}.jpg`;
    link.download = fileName; // Имя файла
    link.click(); // Скачиваем файл
});

// Генерация кода бойца
generateFighterBtn.addEventListener('click', () => {
    const code = generateFighterCode();
    fighterCodeBox.innerHTML = code;
    fighterTimestamp.textContent = new Date().toLocaleString();
    generateQRCode(code);
    addToArchive("UNIT IDENTITY", code); // Запись в архив
});

// Генерация номера аудита
generateAuditBtn.addEventListener('click', () => {
    const auditNumberHTML = generateAuditNumber();
    auditNumberBox.innerHTML = auditNumberHTML;
    addToArchive("OPERATIVE AUDIT", auditNumberHTML); // Запись в архив
});

// Обработка ввода кода доступа (только при нажатии Enter)
unitBindingInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const code = unitBindingInput.value.trim();
        handleAccessCode(code);
    }
});

// Обработка кода доступа
function handleAccessCode(code) {
    if (code === "GAMMAC-917230485619827364012398172034-TACOPS") {
        updateAccessLevel("γάμμα (Гамма)", "green");
        auditButton.classList.add('hidden'); // Скрываем кнопку аудита
    } else if (code === "BETACX-042918637561290837465120934576-CMDOPS") {
        updateAccessLevel("βῆτа (Бета)", "blue");
        auditButton.classList.add('hidden'); // Скрываем кнопку аудита
    } else if (code === "ALPHAC-781296540128399317460325120458-GENCOM") {
        updateAccessLevel("ἄλφα (Альфа)", "red");
        auditButton.classList.remove('hidden'); // Показываем кнопку аудита
    } else {
        showErrorMessage(); // Показываем ошибку при неправильном коде
        updateAccessLevel("δέλτα (Дельта)", "yellow"); // Сбрасываем уровень на Дельта
        auditButton.classList.add('hidden'); // Скрываем кнопку аудита
    }
}

// Обновление уровня доступа
function updateAccessLevel(levelText, levelColor) {
    accessLevel.textContent = `Уровень допуска: ${levelText} // Статус: Подключён`;
    accessLevel.style.color = levelColor;
}

// Показать сообщение об ошибке
function showErrorMessage() {
    errorMessage.classList.remove('hidden'); // Показываем сообщение
    errorMessage.classList.add('visible'); // Делаем его видимым

    // Через 5 секунд скрываем сообщение
    setTimeout(() => {
        errorMessage.classList.remove('visible'); // Прячем сообщение
        errorMessage.classList.add('hidden'); // Добавляем класс "hidden"
    }, 5000);
}

// Открытие и закрытие окна аудита
auditButton.addEventListener('click', () => {
    auditWindow.classList.remove('hidden');
    showAuditLog();
});

closeAudit.addEventListener('click', () => {
    auditWindow.classList.add('hidden');
});

// Плавное появление модулей
document.addEventListener('DOMContentLoaded', () => {
    loadArchiveFromLocalStorage(); // Загружаем архив из localStorage
    document.querySelectorAll('.module').forEach((module, index) => {
        setTimeout(() => {
            module.classList.add('visible');
        }, 500 + index * 300); // Задержка для каждого модуля
    });
});
