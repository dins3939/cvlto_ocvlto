// --- CONFIGURACIÓN ---
let isRitualActive = false;
let corruptionLevel = 0;
let isCrashing = false;

// TUS LINKS REALES
const realLinks = {
    yt: "https://youtube.com/TU_BANDA",
    ig: "https://instagram.com/TU_BANDA",
    sp: "https://spotify.com/TU_BANDA"
};

// LINKS FALSOS (IGLESIA) - Para restaurarlos al reiniciar
const fakeLinks = {
    yt: "https://youtube.com/CANAL_FAKE",
    ig: "https://instagram.com/IGLESIA_FAKE",
    sp: "#"
};

// BASE DE DATOS DE SECRETOS
const secrets = {
    'demo': '<strong>Archivo 01:</strong> <a href="#">Escuchar Demo.mp3</a>',
    'video': '<strong>Archivo 02:</strong> <a href="#">Ver Ritual.mp4</a>',
    'ayuda': 'Comandos: demo, video, Oculto'
};

// GIFs DE GLITCH
const glitchGifs = [
    "./assets/face1.gif",
    "./assets/face2.gif",
    "./assets/gore1.gif",
    "./assets/satan1.gif",
];

// IMÁGENES PERSISTENTES
const scaryImages = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Pentagram.svg/1200px-Pentagram.svg.png', 
    'https://www.pngall.com/wp-content/uploads/2016/06/Eye-Free-Download-PNG.png'
];

// --- PRELOADER (Carga silenciosa) ---
// Esto obliga al navegador a descargar los GIFs en memoria RAM
// para que cuando los llames, aparezcan INSTANTÁNEAMENTE sin lag.
glitchGifs.forEach(url => {
    const img = new Image();
    img.src = url;
});
// (Opcional) También precarga las imágenes persistentes
scaryImages.forEach(url => {
    const img = new Image();
    img.src = url;
});


// --- VARIABLES DEL DOM ---
const input = document.getElementById('codeInput');
const audio = document.getElementById('ambienceAudio');
const systemLog = document.getElementById('systemLog'); 

// --- VERIFICACIÓN DE MEMORIA AL INICIAR ---
if (localStorage.getItem('cult_awakened') === 'true') {
    window.addEventListener('load', () => {
        activateRitual(true); 
    });
}

// --- LÓGICA PRINCIPAL ---

function processCommand() {
    // Si no hay input (ej. merch.html), no hacemos nada
    if (!input) return;

    const rawInput = input.value.trim();
    input.value = ''; 

    if (isCrashing) return;

    // 1. COMANDO DE SALVACIÓN GLOBAL
    if (rawInput.toLowerCase() === 'bereshit') {
        resetToChurch();
        return;
    }

    // FASE 1: MODO IGLESIA
    if (!isRitualActive) {
        if (rawInput === "Oculto") { 
            activateRitual(); 
        } else {
            alert("Sermón no encontrado. (Recuerda: La Fe respeta las Mayúsculas)");
        }
    } 
    // FASE 2: MODO CULTO
    else {
        const cleanCode = rawInput.toLowerCase();
        
        if (cleanCode === 'oculto') {
            advanceLevel();
        } 
        else if (cleanCode === 'culto') {
            restartRitualLevel1();
        }
        else {
            if (secrets[cleanCode]) {
                addVerse(secrets[cleanCode]);
            } else {
                logSystem(">> ERROR: Comando desconocido.");
                spawnGlitch(); 
            }
        }
    }
}

// ACTIVAR RITUAL
function activateRitual(isAutoLoad = false) {
    isRitualActive = true;
    localStorage.setItem('cult_awakened', 'true'); 

    // AL PONER ESTA CLASE, EL CSS OCULTA LO NORMAL Y MUESTRA LO OCULTO
    document.body.classList.add('ritual-mode');
    
    // Cambiar placeholder solo si existe el input
    if(input) input.placeholder = "NIVEL DE CORRUPCIÓN: 0";

    // Limpiar área de revelaciones
    const revArea = document.getElementById('revelationsArea');
    if(revArea) revArea.innerHTML = ''; 

    // Audio
    if(audio && !isAutoLoad) {
        audio.volume = 0.2;
        audio.play().catch(e => console.log("Audio requiere interacción"));
    }
    
    logSystem(">> SISTEMA ONLINE. Escribe 'Oculto' para descender.");
}

// RESTAURAR IGLESIA (RESET)
function resetToChurch() {
    isRitualActive = false;
    corruptionLevel = 0;

    localStorage.removeItem('cult_awakened');
    
    // AL QUITAR ESTA CLASE, EL CSS RESTAURA TODO AUTOMÁTICAMENTE
    document.body.className = ''; 
    
    // Limpieza de basura visual
    document.querySelectorAll('.persistent-element').forEach(e => e.remove());
    document.querySelectorAll('.glitch-temp').forEach(e => e.remove());

    // Restaurar placeholder
    if(input) input.placeholder = "Buscar...";
    
    // Limpiar área de revelaciones
    const revArea = document.getElementById('revelationsArea');
    if(revArea) revArea.innerHTML = ''; 

    // Apagar Audio
    if(audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    // Limpiar Log
    if(systemLog) systemLog.innerHTML = '';
    
    alert("El sistema ha sido purificado. Bienvenido de nuevo.");
}

// REINICIAR SOLO EL RITUAL A NIVEL 1
function restartRitualLevel1() {
    corruptionLevel = 1;
    
    document.body.classList.remove('level-2', 'level-3', 'level-4', 'level-5', 'level-6');
    document.body.classList.add('level-1');
    
    document.querySelectorAll('.persistent-element').forEach(e => e.remove());
    
    if(input) input.placeholder = "NIVEL DE CORRUPCIÓN: 1";
    if(audio) audio.volume = 0.2;
    
    logSystem(">> Nivel 1 Restaurado. Escribe 'bereshit' para regresar a lo seguro.");
}

// AVANZAR NIVELES
function advanceLevel() {
    corruptionLevel++;
    if(input) input.placeholder = `NIVEL DE CORRUPCIÓN: ${corruptionLevel}`;
    
    const safeMsg = "<br><span style='font-size:0.7em; opacity:0.7'>(Escribe 'bereshit' para regresar a lo seguro)</span>";

    switch(corruptionLevel) {
        case 1:
            document.body.classList.add('level-1');
            spawnGlitch(2); 
            logSystem(">> Nivel 1: Entorno oscurecido." + safeMsg);
            break;
        case 2:
            document.body.classList.add('level-2');
            spawnGlitch(2); 
            logSystem(">> Nivel 2: Falla de gravedad visual." + safeMsg);
            break;
        case 3:
            document.body.classList.add('level-3');
            spawnGlitch(4); 
            logSystem(">> Nivel 3: Inversión de espectro cromático." + safeMsg);
            break;
        case 4:
            document.body.classList.add('level-4');
            spawnPersistent(scaryImages[0]); 
            spawnGlitch(6); 
            logSystem(">> Nivel 4: Anomalía persistente detectada." + safeMsg);
            break;
        case 5:
            document.body.classList.add('level-5');
            if(audio) audio.volume = 0.6;
            spawnGlitch(13);
            logSystem(">> Nivel 5: Corrupción de datos crítica." + safeMsg);
            break;
        case 6:
            document.body.classList.add('level-6'); 
            spawnPersistent(scaryImages[1]); 
            spawnGlitch(20); 
            if(audio) audio.volume = 1.0;
            logSystem(">> Nivel 6: INESTABILIDAD ESTRUCTURAL." + safeMsg);
            break;
        case 7:
            document.body.classList.add('level-7'); 
            triggerCrash(); 
            logSystem(">> Nivel 7: COLAPSO DE REALIDAD INMINENTE. INICIANDO PURGA..." + safeMsg);
            break;
    }
}

// UTILIDADES VISUALES Y DE SISTEMA

function logSystem(text) {
    if(!systemLog) return;
    systemLog.innerHTML = ''; 
    const msg = document.createElement('div');
    msg.className = 'system-msg';
    msg.innerHTML = text; 
    msg.style.animation = "flashMsg 0.5s ease"; 
    systemLog.appendChild(msg); 
}

// Acepta un número (cantidad). Si no le pones nada, por defecto hace 1.
function spawnGlitch(cantidad = 1) {
    // Repetimos el código tantas veces como diga 'cantidad'
    for (let i = 0; i < cantidad; i++) {
        try {
            const img = document.createElement('img');
            // Selecciona un GIF al azar
            img.src = glitchGifs[Math.floor(Math.random() * glitchGifs.length)];
            img.className = 'glitch-temp';
            
            // Posición aleatoria
            setRandomPosition(img);
            
            // Tamaño aleatorio
            img.style.width = (Math.random() * 200 + 100) + 'px';
            
            document.body.appendChild(img);
            
            // Se borra a los 300ms (puedes variar esto si quieres que duren distinto)
            setTimeout(() => { if(img) img.remove(); }, 300);
            
        } catch(e) {
            console.error("Fallo en glitch individual");
        }
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
    
    // --- NUEVO: BORRAR MEMORIA AL MORIR ---
    // Así, si el usuario regresa después del crash, la página estará limpia.
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

function addVerse(html) {
    const div = document.createElement('div');
    div.className = 'verse';
    div.innerHTML = html;
    const area = document.getElementById('revelationsArea');
    if(area) area.prepend(div);
}

if(input) {
    input.addEventListener("keypress", (e) => {
        if(e.key === "Enter") processCommand();
    });
}

// --- TRANSICIONES MALDITAS (Glitch al navegar) ---

// 1. Buscamos todos los links dentro de la navegación y los botones
const allLinks = document.querySelectorAll('nav a, .band-nav a, button, .cult-social-header');

// 2. Les agregamos el evento a cada uno
allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        
        // A. Si el link abre en otra pestaña (target="_blank"), solo glitcheamos y dejamos que abra
        if (this.target === "_blank") {
            spawnGlitch(5); // Glitch moderado
            // No evitamos la navegación porque es otra pestaña
            return; 
        }

        // B. Si es un link interno (misma pestaña), INTERCEPTAMOS
        // Solo aplicamos si tiene un href válido
        if (this.href && this.href !== "#") {
            e.preventDefault(); // 1. DETENER la carga inmediata
            
            spawnGlitch(15); // 2. CAOS VISUAL (15 glitches)
            
            // Efecto de sonido extra si quieres (opcional)
            if(audio) audio.volume = 1.0; 

            // 3. ESPERAR Y LUEGO IR
            const targetUrl = this.href;
            setTimeout(() => {
                window.location.href = targetUrl; // Ir a la página manualmente
            }, 500); // 500ms de retraso (medio segundo)
        }
    });
});