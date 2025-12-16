// --- CONFIGURACIÓN GLOBAL ---
// Defínelo aquí y controla TODO desde una sola línea.
let masterSize = 80; 

// Margen de seguridad para que no se corten las sombras o brillos
// (El lienzo será un poco más alto que el ojo)
let safetyMargin = 60; 

// NUEVO: Variables para guardar el color sorpresa
let irisR, irisG, irisB;

function setup() {
    let container = document.getElementById('eye-container');
    
    // Ancho del contenedor, o ancho de ventana si falla
    let w = container ? container.offsetWidth : windowWidth;
    
    // ALTURA DINÁMICA: El tamaño del ojo + el margen
    let h = masterSize + safetyMargin;
    
    let canvas = createCanvas(w, h);
    canvas.parent('eye-container');
    noStroke();

    // --- NUEVO: GENERADOR DE COLOR ---
    // Elegimos 3 números al azar entre 40 y 220 cada vez que se recarga la página.
    irisR = random(40, 220);
    irisG = random(40, 220);
    irisB = random(40, 220);

}

function draw() {
    clear();

    if (!document.body.classList.contains('ritual-mode')) {
        return;
    }

    // --- NUEVO: AUTO-CORRECCIÓN DE TAMAÑO ---
    // Esto arregla el bug de la "primera vez".
    // Si el lienzo tiene el tamaño incorrecto (ej. 0px) porque estaba oculto,
    // detectamos el tamaño real del contenedor y forzamos un resize.
    let container = document.getElementById('eye-container');
    if (container && container.offsetWidth !== width) {
        // Recalculamos la altura necesaria
        let correctHeight = masterSize + safetyMargin;
        // Ajustamos el canvas al ancho real del contenedor
        resizeCanvas(container.offsetWidth, correctHeight);
    }
    // ----------------------------------------

    // --- PROPORCIONES ---
    // Ya no definimos masterSize aquí, usamos la global de arriba.
    
    let cx = width / 2;
    let cy = height / 2;

    // Tamaños principales (Aumenté un poco iris/pupila como pediste antes)
    let eyeSize = masterSize;           
    let irisSize = masterSize * 0.50;   
    let pupilSize = masterSize * 0.23;  
    
    // Factores de escala
    let scaleFactorSmall = masterSize * 0.008; 
    let scaleFactorMedium = masterSize * 0.016; 
    let veinStep = masterSize * 0.02; 
    let irisOffset = masterSize * 0.012; 

    // --- MIRADA ---
    let angle = atan2(mouseY - cy, mouseX - cx);
    let distance = dist(mouseX, mouseY, cx, cy);
    let moveLimit = masterSize * 0.16;
    let shift = min(distance, moveLimit); 
    
    let pupilX = cx + cos(angle) * shift;
    let pupilY = cy + sin(angle) * shift;

    // --- DIBUJO ---

    // 1. GLOBO
    fill(235, 235, 230); 
    drawingContext.shadowBlur = masterSize * 0.12;
    drawingContext.shadowColor = 'black';
    ellipse(cx, cy, eyeSize, eyeSize);
    drawingContext.shadowBlur = 0; 

    // 2. VENAS
    push();
    translate(cx, cy);
    stroke(180, 40, 40, 80); 
    strokeWeight(masterSize * 0.017);
    noFill();
    for (let i = 0; i < 30; i++) {
        let veinAngle = map(i, 0, 30, 0, TWO_PI);
        beginShape();
        for (let r = eyeSize / 2 - veinStep; r > eyeSize / 2 - (eyeSize * 0.25); r -= veinStep) {
            let x = cos(veinAngle) * r + random(-scaleFactorSmall, scaleFactorSmall);
            let y = sin(veinAngle) * r + random(-scaleFactorSmall, scaleFactorSmall);
            vertex(x, y);
        }
        endShape();
    }
    pop();

    // 3. IRIS
    fill(irisR, irisG, irisB);
    ellipse(pupilX, pupilY, irisSize, irisSize);
    
    push();
    translate(pupilX, pupilY);
    stroke(irisR + 50, irisG + 50, irisB + 50, 150);
    strokeWeight(masterSize * 0.006);
    for (let i = 0; i < 360; i += 6) {
        let r = irisSize / 2;
        let x1 = cos(radians(i)) * (r - irisOffset);
        let y1 = sin(radians(i)) * (r - irisOffset);
        let randomVar = random(-scaleFactorMedium, scaleFactorMedium);
        let x2 = cos(radians(i)) * (r - (irisSize * 0.25) + randomVar);
        let y2 = sin(radians(i)) * (r - (irisSize * 0.25) + randomVar);
        line(x1, y1, x2, y2);
    }
    pop();

    // 4. PUPILA
    noStroke();
    fill(0); 
    ellipse(pupilX, pupilY, pupilSize, pupilSize);

    // 5. BRILLOS
    fill(255, 220); 
    ellipse(pupilX + (pupilSize * 0.4), pupilY - (pupilSize * 0.4), pupilSize * 0.3, pupilSize * 0.2);
    //ellipse(pupilX + (pupilSize * 0.55), pupilY - (pupilSize * 0.55), pupilSize * 0.13, pupilSize * 0.13);
}

function windowResized() {
    let container = document.getElementById('eye-container');
    let w = container ? container.offsetWidth : windowWidth;
    // También ajustamos al redimensionar
    resizeCanvas(w, masterSize + safetyMargin);
}