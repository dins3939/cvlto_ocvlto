// ==========================================
// GAME.JS - MOTOR DE AVENTURA DE TEXTO & SECRETOS
// ==========================================

// --- ESTADO DEL JUEGO ---
let isGameRunning = false;
let currentGameNode = 'start';
let inventory = [];

// --- 1. BASE DE DATOS DE SECRETOS (CHEAT CODES) ---
// Estos funcionan SIEMPRE (en la iglesia o en el ritual)
const globalSecrets = {
    'buitre': { 
        text: "Has invocado al espíritu carroñero.", 
        html: 'DESCARGA: <a href="#" target="_blank" style="color:red">[Demo_Voz.mp3]</a>',
        effect: 'glitch' 
    },
    '1984': {
        text: "La verdad os hará libres.",
        html: 'CÓDIGO DE DESCUENTO: <strong style="color:gold">CULTO20</strong>',
        effect: 'normal'
    },
    'sangre': {
        text: "Pacto aceptado.",
        html: '<span style="color:red">Has desbloqueado el Nivel Oculto.</span>',
        effect: 'scare'
    },
    'vacio': {
        text: "Miras al abismo y el abismo te devuelve la mirada.",
        html: 'LINK OCULTO: <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank">[VIDEO_PROHIBIDO]</a>',
        effect: 'glitch'
    }
};

// --- 2. EL MAPA DEL JUEGO (LA HISTORIA) ---
const gameMap = {
    'start': {
        text: "Te encuentras en una habitación oscura. Huele a incienso viejo y humedad. Al norte hay una puerta de madera. En el centro, un altar sucio.",
        options: {
            'ver altar': 'altar_view',
            'abrir puerta': 'door_locked',
            'ver puerta': 'door_view'
        }
    },
    'altar_view': {
        text: "El altar tiene manchas de cera roja. Hay una nota arrugada clavada con un cuchillo.",
        options: {
            'leer nota': 'read_note',
            'ver altar': 'altar_view',
            'volver': 'start'
        }
    },
    'read_note': {
        text: "La nota dice: 'La verdad requiere sacrificio. Busca la llave en el vacío'. (Pista: A veces los códigos están en la etiqueta de tu ropa).",
        options: {
            'volver': 'start'
        }
    },
    'door_locked': {
        text: "La puerta está cerrada. Necesitas una llave.",
        options: {
            'volver': 'start'
        }
    },
     'door_view': {
        text: "Es una puerta robusta de roble. Tiene rasguños en la parte inferior, como si algo hubiera intentado entrar... o salir.",
        options: {
            'volver': 'start',
            'abrir puerta' : 'door_locked'
        }
    },
    // Agrega más habitaciones aquí...
};

// --- 3. FUNCIONES DEL MOTOR DE JUEGO ---

// Iniciar el juego (cuando escriben "Quiero encontrar la verdad")
function startGame() {
    if (isGameRunning) {
        printToConsole("Ya has iniciado el camino. No mires atrás.", 'system');
        return;
    }

    isGameRunning = true;
    currentGameNode = 'start'; // Aseguramos inicio

    // Imprimimos instrucciones
    printToConsole("------------------------------------------------", 'system');
    printToConsole("INICIANDO PROTOCOLO DE VERDAD...", 'system');
    printToConsole("Instrucciones: Escribe una ACCIÓN + OBJETO (ej: 'ver altar', 'abrir puerta').", 'system');
    printToConsole("------------------------------------------------", 'system');
    
    // Pequeño delay dramático para el primer texto
    setTimeout(() => {
        printToConsole(gameMap['start'].text, 'system');
    }, 500);
}

// Procesar movimientos dentro del juego
function handleGameInput(cmd) {
    const node = gameMap[currentGameNode];
    
    // A. Mostrar lo que escribió el jugador (eco)
    printToConsole(cmd, 'player');

    // B. Verificar si el comando existe en la habitación actual
    if (node.options && node.options[cmd]) {
        const nextNodeId = node.options[cmd];
        currentGameNode = nextNodeId; // Cambiamos de habitación
        const nextNode = gameMap[nextNodeId];

        // Imprimir la descripción del nuevo lugar
        printToConsole(nextNode.text, 'system');

        // (Aquí podrías agregar lógica de items o muertes si el nodo es especial)

    } else {
        // C. Comando no reconocido en esta habitación
        const errors = [
            "No puedes hacer eso.",
            "Intenta otra cosa.",
            "Eso no funciona aquí.",
            "Tu voz resuena en el vacío sin respuesta."
        ];

        // Verificamos que la función exista para evitar errores si abres solo el JS
        if (typeof spawnGlitch === 'function') {
            spawnGlitch(5); // 5 glitches = Castigo visual más fuerte
        }

        // Elige un error al azar
        const randomError = errors[Math.floor(Math.random() * errors.length)];
        printToConsole(randomError, 'system');
    }
}

// Ejecutar un secreto global
function handleSecret(code) {
    const secret = globalSecrets[code];

    // Si estamos en la Iglesia, forzamos la entrada al Ritual para ver la consola
    if (typeof isRitualActive !== 'undefined' && !isRitualActive) {
        activateRitual(true); 
    }

    // Efectos externos (definidos en script.js, nos aseguramos que existan)
    if (typeof spawnGlitch === 'function' && secret.effect === 'glitch') spawnGlitch(8);
    if (typeof spawnPersistent === 'function' && secret.effect === 'scare') spawnPersistent(); // asume scaryImages[0]
    
    // Imprimir premio
    printToConsole(`¡REVELACIÓN DESBLOQUEADA! [${code.toUpperCase()}]`, 'system');
    printToConsole(secret.text, 'revelation');
    
    if (secret.html) {
        printToConsole(secret.html, 'revelation');
    }
}

// Utilidad para imprimir en la consola HTML
function printToConsole(text, type = 'system') {
    const area = document.getElementById('revelationsArea');
    if (!area) return;

    const div = document.createElement('div');
    div.className = `game-msg ${type}`;
    div.innerHTML = `> ${text}`;
    
    // Insertar al principio (porque usamos flex-direction: column-reverse en CSS)
    area.prepend(div); 
}

// Función para reiniciar variables del juego (llamada desde script.js al salir)
function resetGameState() {
    isGameRunning = false;
    currentGameNode = 'start';
    inventory = [];
}