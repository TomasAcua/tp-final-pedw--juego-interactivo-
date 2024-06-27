document.addEventListener("DOMContentLoaded", () => {
    const logrosDescripcion = {
        heroe_pueblo: "Se desbloquea al salvar al pueblo enfrentando a los bandidos.",
        lider_bandidos: "Se desbloquea al ayudar a los bandidos a saquear la aldea.",
        amigo_elfos: "Se desbloquea al ayudar a los elfos a eliminar las arañas gigantes.",
        asesinado_aranas: "Se desbloquea al ser emboscado y asesinado por las arañas.",
        rey_reino: "Se desbloquea al derrotar al dragón y convertirte en el próximo rey.",
        devorado_dragon: "Se desbloquea al ser devorado por el dragón.",
        maldicion_cerdo: "Se desbloquea al intentar robar las pociones del mago y ser maldecido."
    };

    const lugares = ["aldea", "bosque", "castillo", "cueva", "misterioso"];
    const personajes = ["bandido1", "bandido2", "elfo", "araña1", "araña2", "rey", "mago", "cerdo", "heroe-rey", "aldeano"];

    function actualizarGaleriaFondos() {
        const imagenesFondo = document.getElementById("imagenes-fondo");
        imagenesFondo.innerHTML = "";
        lugares.forEach(lugar => {
            const item = document.createElement("div");
            item.className = "galeria-item";
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
        const personajesEncontrados = document.getElementById("personajes-encontrados");
        personajesEncontrados.innerHTML = "";
        personajes.forEach(personaje => {
            const item = document.createElement("div");
            item.className = "galeria-item";
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
        const listaLogros = document.getElementById("lista-logros");
        listaLogros.innerHTML = "";
        for (const [logro, descripcion] of Object.entries(logrosDescripcion)) {
            const div = document.createElement("div");
            div.className = "logro";
            div.innerHTML = `<strong>${logro.replace(/_/g, ' ')}</strong>: ${descripcion}`;
            listaLogros.appendChild(div);
        }
    }

    actualizarGaleriaFondos();
    actualizarGaleriaPersonajes();
    actualizarLogros();

    // Validar formulario de contacto
    const contactForm = document.getElementById("contact-form");
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Por favor, ingresa un correo electrónico válido.");
            return;
        }
        alert("Formulario enviado exitosamente.");
        contactForm.reset();
    });
});
