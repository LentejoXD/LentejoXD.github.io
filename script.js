// Carrusel
let scrollIndex = 0;
function moverCarrusel(direccion) {
    const carrusel = document.getElementById('carrusel-imagenes');
    const items = carrusel.children.length;
    scrollIndex += direccion;
    if (scrollIndex < 0) scrollIndex = items - 3;
    if (scrollIndex > items - 3) scrollIndex = 0;
    carrusel.style.transform = `translateX(-${scrollIndex * (100 / 3)}%)`;
}

// Recuerdos
function mostrarRecuerdo(texto, imagen) {
    document.getElementById('recuerdo-texto').textContent = texto;
    const img = document.getElementById('recuerdo-imagen');
    img.src = imagen;
    img.style.display = "inline-block";
}

// Fechas y confeti
function formatearFecha(fechaISO) {
    if (!fechaISO) return "";
    const partes = fechaISO.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
function validarFecha(idInput, fechaCorrecta, idMensaje) {
    const input = document.getElementById(idInput).value;
    const mensaje = document.getElementById(idMensaje);
    const fechaUsuario = formatearFecha(input);
    if (fechaUsuario === fechaCorrecta) {
        mensaje.textContent = "¡Correcto! 🎉";
        lanzarConfeti();
    } else {
        mensaje.textContent = "Incorrecto, intenta de nuevo.";
    }
}
function lanzarConfeti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;
    (function frame() {
        confetti({
            particleCount: 5,
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

// --- Minijuego de Gato (Tic Tac Toe con IA Minimax) ---
let celdas = Array(9).fill("");
let jugador = "X";
let jugando = true;
const celdasDOM = document.querySelectorAll(".cell");
const combinacionesGanadoras = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

celdasDOM.forEach(cell => {
    cell.addEventListener("click", () => manejarClick(cell));
});

function manejarClick(cell) {
    const index = cell.getAttribute("data-index");
    if (celdas[index] === "" && jugando) {
        celdas[index] = jugador;
        cell.textContent = jugador;
        if (verificarGanador(jugador)) {
            document.getElementById("game-status").textContent = "¡Ganaste! 🎉";
            jugando = false;
            lanzarConfeti();
            return;
        }
        if (celdas.every(c => c !== "")) {
            document.getElementById("game-status").textContent = "¡Empate!";
            jugando = false;
            return;
        }
        jugador = "O";
        setTimeout(turnoMaquina, 500);
    }
}

function turnoMaquina() {
    const mejorMovimiento = obtenerMejorMovimiento();
    celdas[mejorMovimiento] = "O";
    celdasDOM[mejorMovimiento].textContent = "O";
    if (verificarGanador("O")) {
        document.getElementById("game-status").textContent = "¡La máquina ganó!";
        jugando = false;
    } else if (celdas.every(c => c !== "")) {
        document.getElementById("game-status").textContent = "¡Empate!";
        jugando = false;
    } else {
        jugador = "X";
    }
}

function obtenerMejorMovimiento() {
    let mejorPuntaje = -Infinity;
    let movimiento;
    for (let i = 0; i < celdas.length; i++) {
        if (celdas[i] === "") {
            celdas[i] = "O";
            let puntaje = minimax(celdas, 0, false);
            celdas[i] = "";
            if (puntaje > mejorPuntaje) {
                mejorPuntaje = puntaje;
                movimiento = i;
            }
        }
    }
    return movimiento;
}

function minimax(tablero, profundidad, esMax) {
    if (verificarGanador("O", tablero)) return 10 - profundidad;
    if (verificarGanador("X", tablero)) return profundidad - 10;
    if (tablero.every(c => c !== "")) return 0;

    if (esMax) {
        let mejor = -Infinity;
        for (let i = 0; i < tablero.length; i++) {
            if (tablero[i] === "") {
                tablero[i] = "O";
                let valor = minimax(tablero, profundidad + 1, false);
                tablero[i] = "";
                mejor = Math.max(mejor, valor);
            }
        }
        return mejor;
    } else {
        let mejor = Infinity;
        for (let i = 0; i < tablero.length; i++) {
            if (tablero[i] === "") {
                tablero[i] = "X";
                let valor = minimax(tablero, profundidad + 1, true);
                tablero[i] = "";
                mejor = Math.min(mejor, valor);
            }
        }
        return mejor;
    }
}

function verificarGanador(j, tablero = celdas) {
    return combinacionesGanadoras.some(comb => comb.every(idx => tablero[idx] === j));
}

function reiniciarJuego() {
    celdas = Array(9).fill("");
    jugador = "X";
    jugando = true;
    document.getElementById("game-status").textContent = "Tu turno (X)";
    celdasDOM.forEach(cell => cell.textContent = "");
}
