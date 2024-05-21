document.addEventListener("DOMContentLoaded", () => {
    const secciones = document.querySelectorAll("main section");
    const botones = document.querySelectorAll("nav button");
    const nuevaAventuraBtn = document.getElementById("nueva-aventura-btn");
    const cargarPartidaBtn = document.getElementById("cargar-partida-btn");
    const textoHistoria = document.getElementById("texto-historia");
    const personajesSecundarios = document.getElementById("personajes-secundarios");
    const opciones = document.getElementById("opciones");
    const imagenesFondo = document.getElementById("imagenes-fondo");
    const personajesEncontrados = document.getElementById("personajes-encontrados");
    const retirarseBtn = document.getElementById("retirarse-btn");

    let historia = "";
    let lugaresVisitados = new Set();
    let personajesEncontradosSet = new Set();

    function mostrarSeccion(id) {
        secciones.forEach(seccion => seccion.classList.remove("active"));
        document.getElementById(id).classList.add("active");
    }

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarSeccion(boton.id.replace("-btn", ""));
            if (boton.id === "galeria-fondo-btn") {
                actualizarGaleriaFondos();
            }
            if (boton.id === "galeria-personajes-btn") {
                actualizarGaleriaPersonajes();
            }
        });
    });

    nuevaAventuraBtn.addEventListener("click", () => {
        iniciarNuevaAventura();
    });

    cargarPartidaBtn.addEventListener("click", () => {
        cargarPartida();
    });

    retirarseBtn.addEventListener("click", () => {
        mostrarSeccion("inicio");
    });

    function iniciarNuevaAventura() {
        historia = "Comienzas tu aventura en un pequeño pueblo...";
        textoHistoria.innerHTML = `<p>${historia}</p>`;
        mostrarSeccion("historia");
        actualizarOpcionesIniciales();
    }

    function cargarPartida() {
        const estadoGuardado = cargarJuego();
        if (estadoGuardado) {
            historia = estadoGuardado.historia;
            lugaresVisitados = new Set(estadoGuardado.lugaresVisitados);
            personajesEncontradosSet = new Set(estadoGuardado.personajesEncontrados);
            textoHistoria.innerHTML = `<p>${historia}</p>`;
            mostrarSeccion("historia");
        } else {
            console.log("No hay partida guardada");
        }
    }

    function avanzarHistoria(opcion, fondo) {
        cambiarFondo(fondo);
        lugaresVisitados.add(fondo);

        switch(opcion) {
            case "aldea":
                historia += "<br>Decides ir a la aldea. Al llegar, encuentras a unos bandidos atacando el pueblo.";
                mostrarPersonajesSecundarios(["bandido1", "bandido2"]);
                personajesEncontradosSet.add("bandido1");
                personajesEncontradosSet.add("bandido2");
                actualizarOpcionesAldea();
                break;
            case "bosque":
                historia += "<br>Te adentras en el bosque y encuentras a unos elfos luchando contra arañas gigantes.";
                mostrarPersonajesSecundarios(["elfo", "araña1", "araña2"]);
                personajesEncontradosSet.add("elfo");
                personajesEncontradosSet.add("araña1");
                personajesEncontradosSet.add("araña2");
                actualizarOpcionesBosque();
                break;
            case "castillo":
                historia += "<br>Llegas al castillo y el rey te encomienda la misión de derrotar al dragón en la cueva.";
                mostrarPersonajesSecundarios(["rey"]);
                personajesEncontradosSet.add("rey");
                actualizarOpcionesCastillo();
                break;
            case "bandidos":
                historia += "<br>Decides enfrentarte a los bandidos y logras apresarlos, salvando el pueblo.";
                mostrarPersonajesSecundarios([]);
                break;
            case "ayudar_bandidos":
                historia += "<br>Decides ayudar a los bandidos a saquear la aldea.";
                mostrarPersonajesSecundarios([]);
                break;
            case "aranas":
                historia += "<br>Ayudas a los elfos a eliminar las arañas gigantes, ganándote su gratitud.";
                mostrarPersonajesSecundarios([]);
                break;
            case "ayudar_aranas":
                historia += "<br>Decides no ayudar a los elfos y sigues tu camino.";
                mostrarPersonajesSecundarios([]);
                break;
            case "dragon":
                historia += "<br>Te aventuras en la cueva y logras derrotar al dragón, obteniendo su tesoro.";
                mostrarPersonajesSecundarios([]);
                lugaresVisitados.add("cueva");
                personajesEncontradosSet.add("dragon");
                break;
            case "no_dragon":
                historia += "<br>Decides no enfrentarte al dragón y vuelves al castillo.";
                mostrarPersonajesSecundarios(["rey"]);
                break;
        }

        textoHistoria.innerHTML = `<p>${historia}</p>`;

        // Posibilidad de evento aleatorio
        if (Math.random() < 0.3) { // 30% de probabilidad
            historia += "<br>Encuentras a un mago misterioso que te ofrece pociones mágicas.";
            textoHistoria.innerHTML = `<p>${historia}</p>`;
            mostrarPersonajesSecundarios(["mago"]);
            personajesEncontradosSet.add("mago");
            actualizarOpcionesMago();
        }

        guardarEstado(); // Guarda el estado actual del juego
    }

    function actualizarOpcionesIniciales() {
        opciones.innerHTML = `
            <button class="opcion-btn" data-siguiente="aldea" data-fondo="aldea">Ir a la Aldea</button>
            <button class="opcion-btn" data-siguiente="bosque" data-fondo="bosque">Ir al Bosque</button>
            <button class="opcion-btn" data-siguiente="castillo" data-fondo="castillo">Ir al Castillo</button>
        `;
        agregarListenersOpciones();
    }

    function actualizarOpcionesAldea() {
        opciones.innerHTML = `
            <button class="opcion-btn" data-siguiente="bandidos" data-fondo="aldea">Enfrentar a los Bandidos</button>
            <button class="opcion-btn" data-siguiente="ayudar_bandidos" data-fondo="aldea">Ayudar a los Bandidos</button>
        `;
        agregarListenersOpciones();
    }

    function actualizarOpcionesBosque() {
        opciones.innerHTML = `
            <button class="opcion-btn" data-siguiente="aranas" data-fondo="bosque">Ayudar a los Elfos con las Arañas</button>
            <button class="opcion-btn" data-siguiente="ayudar_aranas" data-fondo="bosque">No Ayudar a los Elfos</button>
        `;
        agregarListenersOpciones();
    }

    function actualizarOpcionesCastillo() {
        opciones.innerHTML = `
            <button class="opcion-btn" data-siguiente="dragon" data-fondo="cueva">Ir a la Cueva del Dragón</button>
            <button class="opcion-btn" data-siguiente="no_dragon" data-fondo="castillo">No Ir a la Cueva</button>
        `;
        agregarListenersOpciones();
    }

    function actualizarOpcionesMago() {
        opciones.innerHTML = `
            <button class="opcion-btn" data-siguiente="comprar_pociones" data-fondo="misterioso">Comprar Pociones</button>
            <button class="opcion-btn" data-siguiente="robar_pociones" data-fondo="misterioso">Robar Pociones</button>
        `;
        agregarListenersOpciones();
    }

    function agregarListenersOpciones() {
        const opcionBotones = document.querySelectorAll(".opcion-btn");
        opcionBotones.forEach(boton => {
            boton.addEventListener("click", () => {
                avanzarHistoria(boton.dataset.siguiente, boton.dataset.fondo);
            });
        });
    }

    function cambiarFondo(fondo) {
        document.body.style.backgroundImage = `url('imagenes/${fondo}.jpg')`;
    }

    function mostrarPersonajesSecundarios(personajes) {
        personajesSecundarios.innerHTML = "";
        personajes.forEach(personaje => {
            const img = document.createElement("img");
            img.src = `imagenes/${personaje}.jpg`;
            img.alt = personaje;
            personajesSecundarios.appendChild(img);
        });
    }

    function actualizarGaleriaFondos() {
        imagenesFondo.innerHTML = "";
        lugaresVisitados.forEach(lugar => {
            const img = document.createElement("img");
            img.src = `imagenes/${lugar}.jpg`;
            img.alt = lugar;
            imagenesFondo.appendChild(img);
        });
    }

    function actualizarGaleriaPersonajes() {
        personajesEncontrados.innerHTML = "";
        personajesEncontradosSet.forEach(personaje => {
            const img = document.createElement("img");
            img.src = `imagenes/${personaje}.jpg`;
            img.alt = personaje;
            personajesEncontrados.appendChild(img);
        });
    }

    function guardarJuego(estado) {
        localStorage.setItem("estadoJuego", JSON.stringify(estado));
    }

    function cargarJuego() {
        const estadoGuardado = localStorage.getItem("estadoJuego");
        if (estadoGuardado) {
            return JSON.parse(estadoGuardado);
        }
        return null;
    }

    function guardarEstado() {
        const estadoJuego = {
            historia,
            lugaresVisitados: Array.from(lugaresVisitados),
            personajesEncontrados: Array.from(personajesEncontradosSet)
        };
        guardarJuego(estadoJuego);
    }

    // Cargar el estado del juego al inicio
    const estadoCargado = cargarJuego();
    if (estadoCargado) {
        historia = estadoCargado.historia;
        lugaresVisitados = new Set(estadoCargado.lugaresVisitados);
        personajesEncontradosSet = new Set(estadoCargado.personajesEncontrados);
        textoHistoria.innerHTML = `<p>${historia}</p>`;
        actualizarOpcionesIniciales();
    }
});

