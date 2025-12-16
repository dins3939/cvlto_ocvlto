// ==========================================
// SCRIPT.JS - CONTROLADOR PRINCIPAL Y VISUALES
// ==========================================

// --- CONFIGURACIÓN VISUAL ---
let isRitualActive = false;
let corruptionLevel = 0;
let isCrashing = false;

// Variables del DOM
const input = document.getElementById('codeInput');
const audio = document.getElementById('ambienceAudio');
const systemLog = document.getElementById('systemLog'); 

// GIFs DE GLITCH (Asegúrate que las rutas sean correctas)
const glitchGifs = [
    "./assets/face1.gif", 
    "./assets/face2.gif", 
    "./assets/gore1.gif", 
    "./assets/gore2.gif", 
    "./assets/gore3.gif",
    "./assets/gore4.gif",  
    "./assets/satan1.gif",
    "./assets/satan2.gif",
    "./assets/satan3.gif",
    "./assets/satan4.gif",
];

// --- PRELOADER ---
glitchGifs.forEach(url => { 
    const img = new Image(); 
    try { img.src = url; } catch(e){} 
});

// --- INICIO AUTOMÁTICO (MEMORIA) ---
if (localStorage.getItem('cult_awakened') === 'true') {
    window.addEventListener('load', () => {
        activateRitual(true); 
    });
}

// --- LÓGICA PRINCIPAL (ROUTER) ---
function processCommand() {
    if (!input) return;
    
    const rawInput = input.value.trim();
    // Limpieza: minúsculas y quitar espacios extra
    const cleanCode = rawInput.toLowerCase().replace(/\s+/g, ' ').trim(); 
    input.value = ''; 

    if (isCrashing) return;

    // 1. SALIDA DE EMERGENCIA (RESET)
    if (cleanCode === 'bereshit') {
        resetToChurch();
        return;
    }

    // 2. SECRETOS GLOBALES (game.js)
    if (typeof globalSecrets !== 'undefined' && globalSecrets[cleanCode]) {
        handleSecret(cleanCode);
        return;
    }

    // 3. INICIO DEL JUEGO RPG (game.js)
    if (cleanCode === 'quiero encontrar la verdad') {
        if (!isRitualActive) activateRitual();
        if (typeof startGame === 'function') startGame();
        return;
    }

    // 4. MODO RITUAL ACTIVO
    if (isRitualActive) {
        
        // --- ZONA DE COMANDOS DE SISTEMA (PRIORIDAD ALTA) ---
        
        // A. Subir Nivel
        if (cleanCode === 'oculto') {
            advanceLevel();
            return; // Detiene la función aquí
        }

        // B. Bajar Nivel / Reiniciar Ritual (TU ARREGLO)
        if (cleanCode === 'culto') {
            restartRitualLevel1();
            return; // Detiene la función aquí
        }

        // C. Otros comandos de sistema (Ejemplo: Silenciar)
        if (cleanCode === 'silencio') {
            if(audio) audio.pause();
            logSystem(">> Audio desactivado.");
            return;
        }

        // --- FIN ZONA DE SISTEMA ---

        // D. JUEGO RPG
        // Si no fue un comando de sistema, intentamos mandarlo al juego
        if (typeof isGameRunning !== 'undefined' && isGameRunning) {
            spawnGlitch(1); // Feedback visual suave
            handleGameInput(cleanCode); 
        } 
        
        // E. ERROR (Juego no iniciado y comando desconocido)
        else {
            // Verificamos que printToConsole exista antes de usarlo
            if (typeof printToConsole === 'function') {
                printToConsole("Acceso denegado. Se requiere la frase de iniciación.", 'system');
            }
            spawnGlitch(1);
        }
    } 
    
    // 5. MODO IGLESIA (NORMAL)
    else {
        if (rawInput === "Oculto") { 
            activateRitual(); 
        } else {
            alert("Sermón no encontrado. (Recuerda: La Fe respeta las Mayúsculas)");
        }
    }
}

// --- FUNCIONES VISUALES Y DE SISTEMA ---

function activateRitual(isAutoLoad = false) {
    if (isRitualActive) return;

    isRitualActive = true;
    localStorage.setItem('cult_awakened', 'true'); 
    document.body.classList.add('ritual-mode');
    
    if(input) input.placeholder = "ESPERANDO COMANDO DE INICIACIÓN...";

    // Limpiar consola visual al entrar al ritual
    const revArea = document.getElementById('revelationsArea');
    if(revArea) revArea.innerHTML = ''; 

    if(audio && !isAutoLoad) {
        audio.volume = 0.2;
        audio.play().catch(e => console.log("Audio requiere interacción"));
    }
    
    logSystem(">> SISTEMA ONLINE. Conexión establecida.");
}

// RESTAURAR IGLESIA (RESET TOTAL)
function resetToChurch() {
    isRitualActive = false;
    corruptionLevel = 0;
    
    if(typeof resetGameState === 'function') resetGameState();

    localStorage.removeItem('cult_awakened');
    document.body.className = ''; 
    
    document.querySelectorAll('.persistent-element').forEach(e => e.remove());
    document.querySelectorAll('.glitch-temp').forEach(e => e.remove());

    if(input) input.placeholder = "Buscar...";
    
    const revArea = document.getElementById('revelationsArea');
    if(revArea) revArea.innerHTML = ''; 

    if(audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    if(systemLog) systemLog.innerHTML = '';
    
    alert("El sistema ha sido purificado.");
}

// REINICIAR SOLO EL RITUAL A NIVEL 1 (EL COMANDO 'CULTO')
function restartRitualLevel1() {
    corruptionLevel = 1;
    
    // Quitamos todas las clases de niveles altos
    document.body.classList.remove('level-2', 'level-3', 'level-4', 'level-5', 'level-6', 'level-7');
    
    // Aseguramos nivel 1
    document.body.classList.add('level-1');
    
    // Borramos las imágenes de sustos (persistentes)
    document.querySelectorAll('.persistent-element').forEach(e => e.remove());
    
    // Reset visual
    if(input) input.placeholder = "NIVEL DE CORRUPCIÓN: 1";
    if(audio) audio.volume = 0.2;
    
    logSystem(">> Nivel 1 Restaurado. La corrupción ha descendido.");
    spawnGlitch(2);
}

// AVANZAR NIVELES DE CORRUPCIÓN
function advanceLevel() {
    corruptionLevel++;
    if(input) input.placeholder = `NIVEL DE CORRUPCIÓN: ${corruptionLevel}`;
    
    document.body.classList.add(`level-${corruptionLevel}`);
    
    spawnGlitch(corruptionLevel * 2);
    logSystem(`>> Nivel ${corruptionLevel} activado.`);
    
    if (corruptionLevel >= 7) triggerCrash();
}

// UTILIDADES DE SISTEMA (MODO SILENCIOSO)
function logSystem(text) {
    // En lugar de escribir en la pantalla, escribimos en la consola del navegador (F12)
    // El %c permite ponerle estilo CSS al mensaje de consola.
    console.log(
        `%c>> SISTEMA: ${text}`, 
        "color: #ff0000; background: #000000; padding: 4px; font-weight: bold;"
    );
}

function spawnGlitch(cantidad = 1) {
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        try {
            img.src = glitchGifs[Math.floor(Math.random() * glitchGifs.length)];
        } catch(e) { img.src = ""; }
        
        img.className = 'glitch-temp';
        img.style.top = Math.random() * 80 + 'vh';
        img.style.left = Math.random() * 80 + 'vw';
        img.style.width = (Math.random() * 200 + 100) + 'px';
        document.body.appendChild(img);
        setTimeout(() => { img.remove(); }, 300);
    }
}

function spawnPersistent(url) {
    try {
        if (!url) return;
        const img = document.createElement('img');
        img.src = url;
        img.className = 'persistent-element';
        img.style.width = "200px"; 
        setRandomPosition(img);
        document.body.appendChild(img);
    } catch(e) {}
}

function setRandomPosition(element) {
    element.style.top = Math.random() * 80 + 'vh';
    element.style.left = Math.random() * 80 + 'vw';
}

function triggerCrash() {
    isCrashing = true;
    if(input) input.disabled = true;
    const overlay = document.getElementById('crashOverlay');
    if(overlay) overlay.style.display = 'flex';
    localStorage.removeItem('cult_awakened'); 
    
    let count = 3;
    const timer = document.getElementById('countdown');
    const interval = setInterval(() => {
        count--;
        if(timer) timer.innerText = count;
        if (count <= 0) {
            clearInterval(interval);
            window.location.href = "https://www.google.com"; 
        }
    }, 1000);
}

// Listener para Enter
if(input) {
    input.addEventListener("keypress", (e) => {
        if(e.key === "Enter") processCommand();
    });
}

// Listener para Links (Glitches al navegar)
const allLinks = document.querySelectorAll('nav a, .band-nav a, button, .cult-social-header');
allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.target === "_blank") { spawnGlitch(5); return; }
        if (this.href && this.href !== "#") {
            e.preventDefault();
            spawnGlitch(15);
            if(audio) audio.volume = 1.0; 
            const targetUrl = this.href;
            setTimeout(() => { window.location.href = targetUrl; }, 500);
        }
    });
});