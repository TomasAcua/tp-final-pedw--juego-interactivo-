function choosePath(path) {
    var story = document.getElementById("story");
    var options = document.getElementById("options");

    switch(path) {
        case 1:
            story.textContent = "Te adentras en el bosque y encuentras un antiguo templo.";
            changeBackground("bosque");//ejemplo
            options.innerHTML = '<button onclick="choosePath(3)">Explorar el templo</button><button onclick="choosePath(4)">Volver al pueblo</button>';
            break;
        case 2:
            story.textContent = "Te aventuras en la cueva oscura y encuentras un tesoro escondido.";
            options.innerHTML = '<button onclick="choosePath(5)">Tomar el tesoro</button><button onclick="choosePath(4)">Volver al pueblo</button>';
            break;
        case 3:
            story.textContent = "Dentro del templo, descubres un pasadizo secreto.";
            options.innerHTML = '<button onclick="choosePath(6)">Seguir el pasadizo</button><button onclick="choosePath(4)">Volver al pueblo</button>';
            break;
        case 4:
            story.textContent = "Decides regresar al pueblo. Fin del juego.";
            options.innerHTML = '';
            break;
        case 5:
            story.textContent = "Al tomar el tesoro, despiertas a un dragón dormido.";
            options.innerHTML = '<button onclick="choosePath(7)">Luchar contra el dragón</button><button onclick="choosePath(4)">Volver al pueblo</button>';
            break;
        case 6:
            story.textContent = "El pasadizo te lleva a una habitación llena de riquezas.";
            options.innerHTML = '<button onclick="choosePath(8)">Tomar el tesoro</button><button onclick="choosePath(4)">Volver al pueblo</button>';
            break;
        case 7:
            var randomNumber = Math.floor(Math.random() * 2); // Genera un número aleatorio entre 0 y 1
            if (randomNumber === 0) {
                story.textContent = "Luchas valientemente contra el dragón y lo derrotas. Encuentras un cofre lleno de tesoros.";
                options.innerHTML = '<button onclick="choosePath(9)">Abrir el cofre</button><button onclick="choosePath(4)">Volver al pueblo</button>';
            } else {
                story.textContent = "Luchas valientemente contra el dragón, pero lamentablemente, pierdes la batalla. Fin del juego.";
                options.innerHTML = '';
            }
            break;
        case 8:
            story.textContent = "Has encontrado el tesoro perdido y te conviertes en el aventurero más famoso. ¡Felicidades!";
            options.innerHTML = '';
            break;
        case 9:
            story.textContent = "Dentro del cofre, encuentras un mapa que señala la ubicación de un tesoro aún más grande.";
            options.innerHTML = '<button onclick="choosePath(10)">Seguir el mapa</button><button onclick="choosePath(4)">Volver al pueblo</button>';
            break;
        case 10:
            story.textContent = "Sigues el mapa y finalmente encuentras el tesoro legendario. ¡Eres el aventurero más rico del mundo!";
            options.innerHTML = '';
            break;
    }
    function changeBackground(location) {
        var background = document.getElementById("game-background");
        switch(location) {
            case "bosque":
                background.style.backgroundImage = "https://concepto.de/wp-content/uploads/2018/10/bosque2-e1539893598295.jpg";
                break;
            case "cueva":
                background.style.backgroundImage = "url('cueva.jpg')";
                break;
            case "templo":
                background.style.backgroundImage = "url('templo.jpg')";
                break;
            // Agrega más casos para otras ubicaciones si es necesario
            default:
                background.style.backgroundImage = "url('default.jpg')";
        }
    }
}