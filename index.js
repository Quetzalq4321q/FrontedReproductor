const baseUrl = "http://localhost:4567"; // Usa tu dominio Ngrok aquí si estás en producción
let historial = [];
let favoritos = [];

let offset = 0;
const limit = 100;

function cargarCanciones() {
    fetch(`${baseUrl}/canciones/paginado?offset=${offset}&limit=${limit}`)
        .then(res => res.json())
        .then(canciones => {
            mostrarLista(canciones);
            actualizarBotonesPaginacion(canciones.length);
        });
}

function mostrarLista(canciones) {
    const lista = document.getElementById("lista-canciones");
    lista.innerHTML = "";
    canciones.forEach(c => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${c.nombre} - ${c.artista} [${c.year}]
            <button onclick="reproducir('${c.nombre}')">▶</button>
            <button onclick="agregarFavorito('${c.nombre}')">⭐</button>
        `;
        lista.appendChild(li);
    });
}

function agregarCancion() {
    const nombre = document.getElementById("nombre").value;
    const artista = document.getElementById("artista").value;
    const year = document.getElementById("year").value;
    const duracion = document.getElementById("duracion").value;

    fetch(`${baseUrl}/agregar?nombre=${nombre}&artista=${artista}&year=${year}&duracion_ms=${duracion}`)
        .then(res => res.json())
        .then(msg => {
            alert(msg);
            cargarCanciones();
        });
}

function buscarCanciones() {
    const q = document.getElementById("buscar").value;
    fetch(`${baseUrl}/buscar/nombre?nombre=${q}`)
        .then(res => res.json())
        .then(canciones => mostrarLista(canciones));
}

function reproducir(nombre) {
    historial.push(nombre);
    alert("🎧 Reproduciendo: " + nombre);
}

function agregarFavorito(nombre) {
    if (!favoritos.includes(nombre)) {
        favoritos.push(nombre);
        alert("⭐ Agregado a favoritos: " + nombre);
    }
}

function mostrarHistorial() {
    alert("🕘 Historial: " + historial.join(", "));
}

function mostrarFavoritos() {
    alert("⭐ Favoritos: " + favoritos.join(", "));
}

function siguientePagina() {
    offset += limit;
    cargarCanciones();
}

function anteriorPagina() {
    if (offset >= limit) {
        offset -= limit;
        cargarCanciones();
    }
}

function actualizarBotonesPaginacion(numCanciones) {
    document.getElementById("btnAnterior").disabled = offset === 0;
    document.getElementById("btnSiguiente").disabled = numCanciones < limit;
}

window.addEventListener("DOMContentLoaded", () => {
    cargarCanciones();

    // Botones de paginación
    const controles = document.createElement("div");
    controles.innerHTML = `
        <button id="btnAnterior" onclick="anteriorPagina()">⬅ Anterior</button>
        <button id="btnSiguiente" onclick="siguientePagina()">Siguiente ➡</button>
    `;
    document.body.appendChild(controles);
});

function cancionAnterior() {
    if (indiceActual > 0) {
        reproducirCancion(indiceActual - 1);
    } else {
        alert("🚫 No hay canción anterior.");
    }
}

function cancionSiguiente() {
    if (indiceActual < canciones.length - 1) {
        reproducirCancion(indiceActual + 1);
    } else {
        alert("🚫 No hay siguiente canción.");
    }
}

function mostrarFavoritos() {
    const listaFav = document.getElementById("lista-favoritos");
    const ul = document.getElementById("favoritos-lista");

    if (favoritos.length === 0) {
        alert("No tienes canciones favoritas.");
        return;
    }

    ul.innerHTML = "";
    favoritos.forEach(nombre => {
        const li = document.createElement("li");
        li.textContent = nombre;
        ul.appendChild(li);
    });

    listaFav.style.display = "block";
}
