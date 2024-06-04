document.addEventListener("DOMContentLoaded", () => {
    const secciones = document.querySelectorAll("main section");
    const botones = document.querySelectorAll("nav button");
    const nuevaAventuraBtn = document.getElementById("nueva-aventura-btn");
    const cargarPartidaBtn = document.getElementById("cargar-partida-btn");
    const textoHistoria = document.getElementById("texto-historia");
    const personajePrincipal = document.getElementById("personaje-principal").querySelector("img");
    const personajesSecundarios = document.getElementById("personajes-secundarios");
    const opciones = document.getElementById("opciones");
    const imagenesFondo = document.getElementById("imagenes-fondo");
    const personajesEncontrados = document.getElementById("personajes-encontrados");
    const retirarseBtn = document.getElementById("retirarse-btn");
    const listaLogros = document.getElementById("lista-logros");
    const musicaFondo = document.getElementById("musica-fondo");

    let historia = "";
    let lugaresVisitados = new Set();
    let personajesEncontradosSet = new Set();
    let logros = {
        heroe_pueblo: false,
        lider_bandidos: false,
        amigo_elfos: false,
        asesinado_aranas: false,
        rey_reino: false,
        devorado_dragon: false,
        maldicion_cerdo: false
    };
    let magoEncontrado = false;

    musicaFondo.volume = 0.1;
    musicaFondo.play();

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
            if (boton.id === "logros-btn") {
                actualizarLogros();
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
        personajePrincipal.src = "imagenes/guerrero.jpg";
        personajePrincipal.alt = "Personaje Principal";
        magoEncontrado = false;
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
            logros = estadoGuardado.logros;
            magoEncontrado = estadoGuardado.magoEncontrado;
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
                historia += "<br>Decides ir a la aldea. Al llegar, encuentras a unos bandidos atacando el pueblo y a un aldeano pidiendo ayuda.";
                mostrarPersonajesSecundarios(["bandido1", "bandido2", "aldeano"]);
                personajesEncontradosSet.add("bandido1");
                personajesEncontradosSet.add("bandido2");
                personajesEncontradosSet.add("aldeano");
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
                logros.heroe_pueblo = true;
                finalizarHistoria("¡Has desbloqueado el logro de Héroe del Pueblo!");
                break;
            case "ayudar_bandidos":
                historia += "<br>Decides ayudar a los bandidos a saquear la aldea.";
                mostrarPersonajesSecundarios([]);
                logros.lider_bandidos = true;
                finalizarHistoria("¡Has desbloqueado el logro de Líder de los Bandidos!");
                break;
            case "aranas":
                historia += "<br>Ayudas a los elfos a eliminar las arañas gigantes, ganándote su gratitud.";
                mostrarPersonajesSecundarios([]);
                logros.amigo_elfos = true;
                finalizarHistoria("¡Has desbloqueado el logro de Amigo de los Elfos!");
                break;
            case "ayudar_aranas":
                historia += "<br>Decides no ayudar a los elfos y sigues tu camino. Las arañas te emboscan y te asesinan.";
                mostrarPersonajesSecundarios([]);
                logros.asesinado_aranas = true;
                finalizarHistoria("¡Has sido asesinado por las arañas!");
                break;
            case "dragon":
                historia += "<br>Te aventuras en la cueva y logras derrotar al dragón, obteniendo su tesoro. Te conviertes en el próximo rey.";
                personajePrincipal.src = "imagenes/heroe-rey.jpg";
                personajePrincipal.alt = "Heroe Rey";
                mostrarPersonajesSecundarios([]);
                logros.rey_reino = true;
                finalizarHistoria("¡Has desbloqueado el logro de Rey del Reino!");
                break;
            case "no_dragon":
                historia += "<br>Decides no enfrentarte al dragón y vuelves al castillo. El dragón te encuentra y te come.";
                mostrarPersonajesSecundarios([]);
                logros.devorado_dragon = true;
                finalizarHistoria("¡Has sido devorado por el dragón!");
                break;
            case "comprar_pociones":
                historia += "<br>Compras las pociones del mago y él te regala una espada encantada.";
                mostrarPersonajesSecundarios([]);
                logros.espada_encantada = true;
                actualizarOpcionesPostMago("espada_encantada");
                break;
            case "robar_pociones":
                historia += "<br>Intentas robar las pociones del mago, pero él te maldice y te convierte en un cerdo.";
                personajePrincipal.src = "imagenes/cerdo.jpg";
                personajePrincipal.alt = "Cerdo";
                mostrarPersonajesSecundarios([]);
                logros.maldicion_cerdo = true;
                finalizarHistoria("¡Has sido maldecido y convertido en un cerdo!");
                break;
        }

        textoHistoria.innerHTML = `<p>${historia}</p>`;

        if (Math.random() < 0.3 && opcion !== "comprar_pociones" && opcion !== "robar_pociones" && !magoEncontrado) {
            historia += "<br>Encuentras a un mago misterioso que te ofrece pociones mágicas.";
            cambiarFondo("misterioso");
            textoHistoria.innerHTML = `<p>${historia}</p>`;
            mostrarPersonajesSecundarios(["mago"]);
            personajesEncontradosSet.add("mago");
            actualizarOpcionesMago();
            magoEncontrado = true;
        }

        guardarEstado();
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

    function actualizarOpcionesPostMago(recompensa) {
        switch (recompensa) {
            case "espada_encantada":
                historia += "<br>El mago te regala una espada encantada. Ahora te sientes más poderoso.";
                textoHistoria.innerHTML = `<p>${historia}</p>`;
                opciones.innerHTML = `
                    <button class="opcion-btn" data-siguiente="aldea" data-fondo="aldea">Ir a la Aldea</button>
                    <button class="opcion-btn" data-siguiente="bosque" data-fondo="bosque">Ir al Bosque</button>
                    <button class="opcion-btn" data-siguiente="castillo" data-fondo="castillo">Ir al Castillo</button>
                `;
                agregarListenersOpciones();
                break;
        }
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
        const lugares = ["aldea", "bosque", "castillo", "cueva", "misterioso"];
        imagenesFondo.innerHTML = "";
        lugares.forEach(lugar => {
            const item = document.createElement("div");
            item.className = "galeria-item";
            if (!lugaresVisitados.has(lugar)) {
                item.classList.add("hidden");
            }
            const img = document.createElement("img");
            img.src = `imagenes/${lugar}.jpg`;
            img.alt = lugar;
            const p = document.createElement("p");
            p.textContent = lugar;
            item.appendChild(img);
            item.appendChild(p);
            imagenesFondo.appendChild(item);
        });
    }

    function actualizarGaleriaPersonajes() {
        const personajes = ["bandido1", "bandido2", "elfo", "araña1", "araña2", "rey", "mago", "cerdo", "heroe-rey", "aldeano"];
        personajesEncontrados.innerHTML = "";
        personajes.forEach(personaje => {
            const item = document.createElement("div");
            item.className = "galeria-item";
            if (!personajesEncontradosSet.has(personaje)) {
                item.classList.add("hidden");
            }
            const img = document.createElement("img");
            img.src = `imagenes/${personaje}.jpg`;
            img.alt = personaje;
            const p = document.createElement("p");
            p.textContent = personaje;
            item.appendChild(img);
            item.appendChild(p);
            personajesEncontrados.appendChild(item);
        });
    }

    function actualizarLogros() {
        listaLogros.innerHTML = "";
        for (const [logro, desbloqueado] of Object.entries(logros)) {
            const div = document.createElement("div");
            div.className = "logro";
            div.textContent = desbloqueado ? logro.replace(/_/g, ' ') : "?";
            listaLogros.appendChild(div);
        }
    }

    function finalizarHistoria(mensaje) {
        historia += `<br><br>${mensaje}<br><button id="reiniciar-btn">Ver Logros</button>`;
        textoHistoria.innerHTML = `<p>${historia}</p>`;
        document.getElementById("reiniciar-btn").addEventListener("click", () => {
            mostrarSeccion("logros");
            actualizarLogros();
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
            personajesEncontrados: Array.from(personajesEncontradosSet),
            logros,
            magoEncontrado
        };
        guardarJuego(estadoJuego);
    }

    const estadoCargado = cargarJuego();
    if (estadoCargado) {
        historia = estadoCargado.historia;
        lugaresVisitados = new Set(estadoCargado.lugaresVisitados);
        personajesEncontradosSet = new Set(estadoCargado.personajesEncontrados);
        logros = estadoCargado.logros;
        magoEncontrado = estadoCargado.magoEncontrado;
        textoHistoria.innerHTML = `<p>${historia}</p>`;
        actualizarOpcionesIniciales();
    }
});
