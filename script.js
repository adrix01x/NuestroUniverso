// ==========================================
// 1. FUNCIÓN GLOBAL DE SCROLL LENTO (CON PROMINSA)
// ==========================================
// Usaremos esta única función tanto para los clics como para la secuencia inicial.
function scrollLento(elementoDestino) {
  return new Promise((resolve) => {
    if (!elementoDestino) return resolve();

    const posicionDestino = elementoDestino.getBoundingClientRect().top + window.scrollY;
    const posicionInicial = window.scrollY;
    const distancia = posicionDestino - posicionInicial;
    
    const duracion = 2500; // 2.5 segundos
    let tiempoInicio = null;

    function animacion(tiempoActual) {
      if (tiempoInicio === null) tiempoInicio = tiempoActual;
      const tiempoTranscurrido = tiempoActual - tiempoInicio;
      
      const proximaPosicion = easing(tiempoTranscurrido, posicionInicial, distancia, duracion);
      window.scrollTo(0, proximaPosicion);

      if (tiempoTranscurrido < duracion) {
        requestAnimationFrame(animacion);
      } else {
        // Asegura que quede exactamente en la posición final y resuelve la promesa
        window.scrollTo(0, posicionDestino);
        resolve(); 
      }
    }

    function easing(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animacion);
  });
}

// ==========================================
// 2. SUAVIZAR SCROLL AL HACER CLIC EN ENLACES
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
  enlace.addEventListener('click', function(e) {
    e.preventDefault(); 
    const destinoId = this.getAttribute('href');
    const elementoDestino = document.querySelector(destinoId);
    
    // Reutilizamos la función de abajo que ya funciona con promesas
    if (elementoDestino) {
      scrollLento(elementoDestino);
    }
  });
});

// ==========================================
// 3. CREAR ESTRELLAS ALEATORIAS
// ==========================================
const mensajes = [
    "Me encanta cuando me abrazas fuertezote.",
    "Amo verte cuando hablas de algo que te gusta.",
    "Amo cuando te pones en modo cariñosa.",
    "Me encanta tu cara cuando me miras y me sonríes de cerquita.",
    "Adoro tu forma de ser y tu forma de pensar.",
    "Me encanta la manera en que me amas.",
    "Me encantan tus piropos de multimedia, aunque no entienda algunos.",
    "Amo tus textos largos y profundos, que me hacen sentir especial.",
    "Amo lo dedicada que eres en todo lo que haces, incluso en los detalles más pequeños.",
    "Me encanta lo inteligente que eres, eres la mejor.",
    "Me encanta que me hagas sentir la persona más amada en el mundo cuando estamos juntos.",
    "Adoro tus fotos random, que me hacen sonreír cada vez que las veo.",
    "Me encanta cómo piensas en mí en cada momento, incluso estando lejos uno del otro.",
    "Me encantan tus outfits y tu estilo único, que solo te queda GENIAL a ti.",
    "Amo lo tierna que puedes ser después de fingir ser la persona más dura del mundo.",
    "Amo que te hayas aparecido en mi vida sin avisar.",
    "Amo todo lo que te hace ser tú.",
    "Adoro los mil apodos que me pones.",
    "Me encanta como te ves, sin importar que tengas puesto.",
    "Me encantan lo variado que son tus gustos musicales.",
    "Adoro tus stickers, son TOP, loca.",
    "Adoro que me des fuerzas para seguir adelante, sin importar qué.",
    "Amo lo fuerte que eres para llevar todo en la linea.",
    "Amo tu capacidad para confrontar todos los problemas que hayan.",
    "Admiro como puedes contenerte de llorar en momentos sensibles.",
    "Amo tu apoyo incondicional hacia mí.",
    "Me encanta cuando me hablas como un niño tiquito.",
    "Amo tus referencias romanticas de canciones.",
    "Adoro ser victima de tus impulsos amorosos.",
    "Adoro lo expresiva que eres con tus sentimientos.",
    "Amo lo bien que puedes hacerme sentir solo con tus palabras."
];

const MENSAJE_FINAL = "Y todavia faltan cosas que amo de tí, pero si seguimos aqui, no terminamos nunca, TE AMO✨";
let esUltimaEstrella = false;

createStar = (contenedor, nombre, cantidad, Y, X, min, max, espacioMinimo) => {
    const stars = document.querySelector(contenedor);
    const anchoContenedor = stars.offsetWidth;
    const altoContenedor = stars.offsetHeight;
    const posicionesOcupadas = []; // { xPx, yPx, radio } de cada estrella ya colocada
    const intentosMax = 30;

    for (let i = 0; i < cantidad; i++) {
        const nuevaEstrella = document.createElement("div")
        const mensaje = mensajes[i];

        const sizeRandom = Math.floor(Math.random() * (max - min + 1)) + min;
        const margen = sizeRandom / 10;

        // Genera posiciones al azar hasta encontrar una que respete el espacio mínimo,
        // o hasta agotar los intentos (para no trabarse si ya no cabe ninguna más)
        let XRandom, YRandom, xPx, yPx;
        let intento = 0;
        let posicionValida = false;

        do {
            XRandom = Math.random() * (X - margen * 2) + margen;
            YRandom = Math.random() * (Y - margen * 2) + margen;
            xPx = (XRandom / 100) * anchoContenedor;
            yPx = (YRandom / 100) * altoContenedor;

            posicionValida = posicionesOcupadas.every((p) => {
                const dx = xPx - p.xPx;
                const dy = yPx - p.yPx;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                const distanciaMinima = (sizeRandom / 2) + (p.radio / 2) + espacioMinimo;
                return distancia >= distanciaMinima;
            });

            intento++;
        } while (!posicionValida && intento < intentosMax);

        posicionesOcupadas.push({ xPx, yPx, radio: sizeRandom });

        nuevaEstrella.classList.add(`${nombre}`)
        nuevaEstrella.classList.add(`${nombre}-${i}`)
        nuevaEstrella.style.top = `${YRandom}%`
        nuevaEstrella.style.left = `${XRandom}%`
        nuevaEstrella.style.height = `${sizeRandom}px`
        nuevaEstrella.style.width = `${sizeRandom}px`
        nuevaEstrella.style.opacity = "0";
        nuevaEstrella.dataset.mensaje = mensaje;
        stars.appendChild(nuevaEstrella);

        setTimeout(() => {
            nuevaEstrella.style.opacity = "1";

            if (nombre !== "estrella") {
                setTimeout(() => {
                    nuevaEstrella.style.opacity = "";
                    nuevaEstrella.classList.add("parpadeando");
                }, 1000);
            }
        }, i * 30);

        if (sizeRandom <= 2) { nuevaEstrella.style.boxShadow = "0 0 4px 1px var(--color-star)"; }
        else if (sizeRandom === 3 || sizeRandom === 4) { nuevaEstrella.style.boxShadow = "0 0 7px 2px var(--color-star)"; }
        else if (sizeRandom === 5 || sizeRandom === 6) { nuevaEstrella.style.boxShadow = "0 0 12px 4px var(--color-star)"; }
        else if (sizeRandom <= 11) { nuevaEstrella.style.boxShadow = "0 0 10px 4px var(--color-star)"; }
        else if (sizeRandom <= 14) { nuevaEstrella.style.boxShadow = "0 0 12px 6px var(--color-star)"; }
        else { nuevaEstrella.style.boxShadow = "0 0 20px 8px var(--color-star)"; }

        nuevaEstrella.addEventListener("click", () => {
            imagenGrande.style.display = "none";
            polaroidGrande.classList.add("solo-texto");
            textoGrande.textContent = nuevaEstrella.dataset.mensaje;
            overlay.classList.add("active");
            nuevaEstrella.classList.add("apagada");

            const estrellasPendientes = document.querySelectorAll(`.${nombre}:not(.apagada)`);
            if (estrellasPendientes.length === 0) {
                esUltimaEstrella = true;
            }
        });
    }
}

createStar(".estrellas", "estrella", 30, 90, 90, 9, 18, 20);
// ==========================================
// 4. SECUENCIA DEL SCROLL INICIAL
// ==========================================
const bigStar = document.querySelector('.estrella-grande');
const pantallaInicial = document.querySelector(".inicio");
const musica = document.querySelector("#musica-fondo");
const btnDiv = document.querySelector(".title-btn")
const intro1 = document.querySelector('.intro-1');
const intro2 = document.querySelector('.intro-2');
const intro3 = document.querySelector('.intro-3');
const intro4 = document.querySelector('.intro-4');
const title = document.querySelector('.title');

// ==========================================
// Utilidades de fade para el audio
// ==========================================

const limitarVolumen = (valor) => Math.min(1, Math.max(0, valor));

const fadeInMusic = (volumenFinal, duracion) => {
    return new Promise(resolve => {
        const volumenInicial = musica.volume;
        const inicio = performance.now();

        const aumentar = (tiempoActual) => {
            const progreso = Math.max(
                0,
                Math.min((tiempoActual - inicio) / duracion, 1)
            );
            musica.volume = limitarVolumen(
                volumenInicial + (volumenFinal - volumenInicial) * progreso
            );

            if (progreso < 1) {
                requestAnimationFrame(aumentar);
            } else {
                musica.volume = limitarVolumen(volumenFinal);
                resolve();
            }
        };
        requestAnimationFrame(aumentar);
    });
};

const fadeOutMusic = (duracion) => {
    return new Promise(resolve => {
        const volumenInicial = musica.volume;
        const inicio = performance.now();

        const bajar = (tiempoActual) => {
            const progreso = Math.max(
                0,
                Math.min((tiempoActual - inicio) / duracion, 1)
            );

            musica.volume = limitarVolumen(volumenInicial * (1 - progreso));

            if (progreso < 1) {
                requestAnimationFrame(bajar);
            } else {
                musica.volume = 0;
                musica.pause();
                resolve();
            }
        };

        requestAnimationFrame(bajar);
    });
};

const botonEntrada = document.querySelector(".btn-entrar");

botonEntrada.addEventListener("click", async () => {

    musica.volume = 0;
    await musica.play();

    scrollInicial();
});

const scrollInicial = async () => {
    // Espera inicial antes de arrancar
    musica.volume = 0;

    await new Promise(resolve => setTimeout(resolve, 500));
    createStar(".stars", "star", 30, 100, 100, 2, 6,10);
    fadeInMusic(0.5, 10000);
    await scrollLento(intro1);
    intro1.classList.add("visible");

    await new Promise(resolve => setTimeout(resolve, 1000));
    intro1.classList.remove("visible")
    intro1.classList.add("hidden");
    createStar(".stars", "star", 40, 100, 100, 2, 6,10);
    await scrollLento(intro2);
    intro2.classList.add("visible");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    intro2.classList.remove("visible")
    intro2.classList.add("hidden");
    createStar(".stars", "star", 60, 100, 100, 2, 6,10);
    await scrollLento(intro3);
    intro3.classList.add("visible");

    await new Promise(resolve => setTimeout(resolve, 1000));
    intro3.classList.remove("visible")
    intro3.classList.add("hidden");
    createStar(".stars", "star", 70, 100, 100, 2, 6,10);
    await scrollLento(intro4);
    intro4.classList.add("visible");

    await new Promise(resolve => setTimeout(resolve, 1000));
    intro4.classList.remove("visible")
    intro4.classList.add("hidden");
    createStar(".stars", "star", 80, 100, 100, 2, 6,10);
    await scrollLento(title);
    desaparecerEstrellas();
    bigStar.style.opacity = "1";
    await new Promise(resolve => setTimeout(resolve, 250));
    if (title) title.classList.add('visible');
    if (btnDiv) btnDiv.classList.add('visible');

    await new Promise(resolve => setTimeout(resolve, 250));
}

desaparecerEstrellas = async () => {
    const estrellas = document.querySelectorAll(".star");

    for (const estrella of estrellas) {

    estrella.classList.add("hidden");

    await new Promise(resolve => setTimeout(resolve, 30));
}
}

// ==========================================
// APARECER Y REPRODUCIR VIDEOS AL HACER SCROLL
// ==========================================
const videos = document.querySelectorAll('.primer-cap-video');

const observador = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    const video = entry.target;

    if (entry.isIntersecting) {
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.load(); // Fuerza la carga
      }

      video.addEventListener('canplaythrough', () => {
          video.classList.add('visible');
          video.play().catch(error => {
            console.log("Autoplay prevenido:", error);
          });
      }, { once: true }); // 'once: true' asegura que esto solo corra una vez por video

      if (video.readyState >= 3) {
        video.classList.add('visible');
        video.play().catch(()=>{});
      }

      // Dejamos de observar este video
      observer.unobserve(video);
    }
  });
}, {
  rootMargin: '200px 0px', 
  threshold: 0.1 // Se activa en cuanto asoma un 10% (sumado al margin)
});

// Conecta cada video con el observador
videos.forEach(video => observador.observe(video));

// ==========================================
// 6. DISPARADOR AL CARGAR LA PÁGINA
// ==========================================
window.addEventListener('load', () => {
    // Forzamos al navegador a ir arriba del todo antes de empezar la secuencia
    window.scrollTo(0, 0);

});

// ==========================================
// 7. EVENTO PARA CERRAR LA VENTANA DE FOTO AMPLIADA
// ==========================================
const polaroids = document.querySelectorAll(".foto");
const overlay = document.querySelector(".photo-overlay");

const polaroidGrande = document.querySelector(".foto-grande");
const imagenGrande = polaroidGrande.querySelector("img");
const textoGrande = polaroidGrande.querySelector("p");

polaroids.forEach(polaroid => {

    polaroid.addEventListener("click", () => {

        const imagen = polaroid.querySelector("img");
        const texto = polaroid.querySelector("p");

        imagenGrande.src = imagen.src;
        imagenGrande.style.display = "";
        polaroidGrande.classList.remove("solo-texto");
        textoGrande.textContent = texto.textContent;

        overlay.classList.add("active");
    });

});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("active");

        if (esUltimaEstrella) {
            esUltimaEstrella = false; // Desactivamos para evitar bucles

            setTimeout(() => {
                imagenGrande.style.display = "none";
                polaroidGrande.classList.add("solo-texto");
                textoGrande.textContent = MENSAJE_FINAL;
                overlay.classList.add("active");
            }, 1000); // 500ms de espera para un cambio suave
        }
    }
});

// ==========================================
// Reproductor de música - Capítulo 6
// ==========================================

const colorThief = new ColorThief();

// category puede ser: "mias", "tuyas" o "ambos"
const playlist = [
  { title: "As You Are", img: "img/asYouAre.jpg", audio: "songs/As You Are.mp3", category: "ambos" },
  { title: "Limon y Sal", img: "img/limonYSal.jpg", audio: "songs/Julieta Venegas - Limón y Sal ((Cover Audio) (Video)).mp3", category: "ambos"},
  { title: "La Gloria Eres Tú", img: "img/laGloriaEresTu.jpg", audio: "songs/Luis Miguel - La Gloria Eres Tú.mp3", category: "ambos" },
  { title: "Tu Sancho", img: "img/tuSancho.jpg", audio: "songs/Fuerza Regida - TU SANCHO.mp3", category: "ambos" },
  { title: "Dame Amor", img: "img/dameAmor.jpg", audio: "songs/Officialalex425 - Dame Amor (official Audio).mp3", category: "ambos" },
  { title: "Luther", img: "img/luther.jpg", audio: "songs/Kendrick Lamar - luther (Official Audio).mp3", category: "mias" },
  { title: "Tu Jardin Con Enanitos", img: "img/tuJardinConEnanitos.jpg", audio: "songs/Melendi - Tu jardín con enanitos (audio).mp3", category: "mias" },
  { title: "Nothing's gonna hurt you Baby", img: "img/NGHB.jpg", audio: "songs/Nothing's Gonna Hurt You Baby - Cigarettes After Sex.mp3", category: "mias" },
  { title: "Eres", img: "img/eres.jpg", audio: "songs/Café Tacvba - Eres (Video Oficial).mp3", category: "mias" },
  { title: "I wanna Be yours", img: "img/iWannaBeYours.png", audio: "songs/I Wanna Be Yours.mp3", category: "mias" },
  { title: "No podemos Ser Amigos", img: "img/noPodemosSerAmigos.jpg", audio: "songs/Álvaro Díaz - NO PODEMOS SER AMIGOS..mp3", category: "tuyas" },
  { title: "It's Just Us", img: "img/itJustUs.jpg", audio: "songs/Kali Uchis - It's Just Us (Audio).mp3", category: "tuyas" },
  { title: "All The Stars", img: "img/allTheStars.jpg", audio: "songs/Kendrick Lamar, SZA - All The Stars.mp3", category: "tuyas" },
  { title: "Take Me back To LA", img: "img/takeMeBackToLA.jpg", audio: "songs/The Weeknd - Take Me Back To LA (Audio).mp3", category: "tuyas" },
  { title: "Luna", img: "img/luna.jpg", audio: "songs/ZOE- Luna (Unplugged).mp3", category: "tuyas" }
];

const categoryLabels = {
  mias: "Mis canciones",
  tuyas: "Tus canciones",
  ambos: "Nuestras canciones",
};

let currentIndex = 0;
let isPlaying = false;

const audio = new Audio();

// Referencias al DOM
const contenedor = document.querySelector('.musica');
const img = document.querySelector('.song-img');
const imgLittle = document.querySelector('.song-img-little');
const titulo = document.querySelector('.musica h3');
const btnPrev = document.querySelector('.btn-prev');
const btnPlay = document.querySelector('.play-circle');
const btnNext = document.querySelector('.btn-next');
const btnMenu = document.querySelector('.cap-6-menu');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const firstCounter = document.querySelector('.first-counter p');
const lastCounter = document.querySelector('.last-counter p');

// ==========================================
// Fondo gradient VARIABLE (tu código original)
// ==========================================
function aplicarGradiente() {
  try {
    const paleta = colorThief.getPalette(img, 5);

    if (paleta && paleta.length >= 2) {
      const colorDominante = `rgb(${paleta[0].join(',')})`;
      const colorSecundario = `rgb(${paleta[1].join(',')})`;

      contenedor.style.background = `
        linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%), 
        linear-gradient(to bottom, ${colorDominante}, ${colorSecundario})`;
    }
  } catch (error) {
    console.error("Error al extraer colores de la imagen:", error);
  }
}

// ==========================================
// Formatear segundos a mm:ss
// ==========================================
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

// ==========================================
// Cargar una canción por índice
// ==========================================
function loadSong(index, autoplay = false) {
  currentIndex = (index + playlist.length) % playlist.length;
  const song = playlist[currentIndex];

  titulo.textContent = song.title;
  img.src = song.img;
  imgLittle.src = song.img;
  audio.src = song.audio;

  progressBar.style.width = '0%';
  firstCounter.textContent = "0:00";
  lastCounter.textContent = "0:00";
  actualizarActivo();

  if (img.complete && img.naturalWidth !== 0) {
    aplicarGradiente();
  } else {
    img.addEventListener('load', aplicarGradiente, { once: true });
  }

  if (autoplay) {
    audio.play();
    isPlaying = true;
    btnPlay.textContent = 'pause_circle';
  } else {
    isPlaying = false;
    btnPlay.textContent = 'play_circle';
  }
}

// ==========================================
// Play / Pausa
// ==========================================
btnPlay.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    btnPlay.textContent = 'play_circle';
    alternarMuteMusica(false); // reactiva la música de fondo
  } else {
    audio.play();
    btnPlay.textContent = 'pause_circle';
    alternarMuteMusica(true); // baja la música de fondo mientras suena la del capítulo
  }
  isPlaying = !isPlaying;
});

// ==========================================
// Canción anterior / siguiente
// ==========================================
btnPrev.addEventListener('click', () => loadSong(currentIndex - 1, isPlaying));
btnNext.addEventListener('click', () => loadSong(currentIndex + 1, isPlaying));

// Pasa a la siguiente automáticamente al terminar
audio.addEventListener('ended', () => loadSong(currentIndex + 1, true));

// ==========================================
// Barra de progreso
// ==========================================
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const porcentaje = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${porcentaje}%`;
    firstCounter.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener('loadedmetadata', () => {
  lastCounter.textContent = formatTime(audio.duration);
});

// Click en la barra para saltar a otra parte de la canción
progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const porcentaje = clickX / rect.width;
  audio.currentTime = porcentaje * audio.duration;
});

// ==========================================
// Menú (lista de canciones agrupada en 3 partes)
// ==========================================
const listaMenu = document.createElement('div');
listaMenu.classList.add('playlist-menu');
contenedor.appendChild(listaMenu);

function construirMenu() {
  listaMenu.innerHTML = '';
  const orden = ['tuyas', 'ambos', 'mias']; // cambia el orden si prefieres otro

  orden.forEach((cat) => {
    const canciones = playlist
      .map((song, i) => ({ ...song, index: i }))
      .filter((song) => song.category === cat);

    if (canciones.length === 0) return;

    const seccion = document.createElement('div');
    seccion.classList.add('playlist-section');

    const header = document.createElement('h4');
    header.textContent = categoryLabels[cat];
    seccion.appendChild(header);

    canciones.forEach((song) => {
      const item = document.createElement('div');
      item.classList.add('playlist-item');
      item.dataset.index = song.index;
      if (song.index === currentIndex) item.classList.add('active');

      const thumb = document.createElement('img');
      thumb.src = song.img;
      thumb.alt = song.title;
      thumb.classList.add('playlist-thumb');

      const nombre = document.createElement('span');
      nombre.textContent = song.title;

      item.appendChild(thumb);
      item.appendChild(nombre);
      item.addEventListener('click', () => loadSong(song.index, true));

      seccion.appendChild(item);
    });

    listaMenu.appendChild(seccion);
  });
}

function actualizarActivo() {
  document.querySelectorAll('.playlist-item').forEach((item) => {
    item.classList.toggle('active', Number(item.dataset.index) === currentIndex);
  });
}

btnMenu.addEventListener('click', () => {
  listaMenu.classList.toggle('active');
});

construirMenu();

// ==========================================
// Inicializar con la primera canción
// ==========================================
loadSong(0, false);

// ==========================================
// Puerta de acceso por nombre + inicio de música
// ==========================================

const NOMBRE_AUTORIZADO = "sarai camile grullon";

const beforeIntro = document.getElementById('beforeIntro');
const nombreInput = document.getElementById('nombreInput');
const btnEntrar = document.getElementById('btnEntrar');
const errorMsg = document.getElementById('errorMsg');
const introCard = document.querySelector('.intro-card');

function normalizar(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function verificarAcceso() {
  const valor = normalizar(nombreInput.value);

  if (valor === NOMBRE_AUTORIZADO) {
    await concederAcceso();
  } else {
    errorMsg.textContent = "Ese no es tu nombre. Inténtalo de nuevo.";
    introCard.classList.remove('shake');
    void introCard.offsetWidth; // reinicia la animación de shake
    introCard.classList.add('shake');
    nombreInput.value = '';
    nombreInput.focus();
  }
}

async function concederAcceso() {
  // Inicia la música de fondo, solo si "musica" existe en la página
  if (typeof musica !== 'undefined' && musica) {
    try {
      musica.volume = 0;
      await musica.play();
    } catch (error) {
      console.warn("No se pudo iniciar la música automáticamente:", error);
    }
  }

  beforeIntro.classList.add('oculto');
  document.body.style.overflow = 'auto';

  if (typeof scrollInicial === 'function') {
    scrollInicial();
  }
}

// El gate se muestra siempre al cargar la página
document.body.style.overflow = 'hidden';

btnEntrar.addEventListener('click', verificarAcceso);
nombreInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') verificarAcceso();
});

// ==========================================
// Sección final: estrella + texto escrito letra por letra + punto parpadeante
// ==========================================

const seccionFinal = document.querySelector('.final');
const estrellaFinal = document.getElementById('last-star');
const textoFinal = document.querySelector('.ewedihalehu');
const audioFinal = document.querySelector('.audioFinal');

// Guardamos el texto y vaciamos el contenedor
const textoCompleto = "EWEDIHALEHU";
textoFinal.textContent = '';

function escribirTexto(elemento, texto, velocidad = 450) {
  let i = 0;
  
  // Añadimos la clase para que el cursor empiece a parpadear
  elemento.classList.add('escribiendo');

  const intervalo = setInterval(() => {
    elemento.textContent += texto[i];
    i++;
    
    if (i === texto.length) {
      clearInterval(intervalo);
    }
  }, velocidad);
}

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const observadorFinal = new IntersectionObserver((entradas) => {
  entradas.forEach(async (entrada) => {
    if (entrada.isIntersecting) {
      estrellaFinal.classList.add('visible');

      estrellaFinal.addEventListener('transitionend', async () => {
        escribirTexto(textoFinal, textoCompleto);
        await esperar(1000);
        fadeOutMusic(DURACION_FADE);
        audio.pause();
        audioFinal.play();
      }, { once: true });

      observadorFinal.unobserve(seccionFinal); // solo se dispara una vez
    }
  });
}, { threshold: 0.7 });

observadorFinal.observe(seccionFinal);

// ==========================================
// Silenciar / activar la música de fondo
// (usado por la tecla M y por otros controles, como el reproductor del cap. 6)
// ==========================================

let muteado = false;
let volumenPrevio = null; // guarda el volumen justo antes de mutear
const DURACION_FADE = 600;

function mostrarIndicadorMute(estaMuteado) {
  let indicador = document.querySelector('.mute-indicador');
  if (!indicador) {
    indicador = document.createElement('div');
    indicador.classList.add('mute-indicador');
    document.body.appendChild(indicador);
  }

  indicador.textContent = estaMuteado ? '🔇 Música silenciada' : '🔊 Música activada';
  indicador.classList.add('visible');

  clearTimeout(indicador._timeout);
  indicador._timeout = setTimeout(() => {
    indicador.classList.remove('visible');
  }, 1500);
}

// forzar: true = mutear, false = activar, undefined = alternar el estado actual
function alternarMuteMusica(forzar) {
  if (typeof musica === 'undefined' || !musica) return;

  const nuevoEstado = forzar !== undefined ? forzar : !muteado;
  if (nuevoEstado === muteado) return; // ya está en ese estado, no repetir el fade

  muteado = nuevoEstado;

  if (muteado) {
    volumenPrevio = musica.volume;
    fadeOutMusic(DURACION_FADE);
  } else {
    musica.play(); // fadeOutMusic la dejó en pausa, hay que reanudarla antes de subir el volumen
    fadeInMusic(volumenPrevio ?? 0.5, DURACION_FADE);
  }

  mostrarIndicadorMute(muteado);
}

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() !== 'm') return;

  const etiquetaActiva = document.activeElement.tagName;
  if (etiquetaActiva === 'INPUT' || etiquetaActiva === 'TEXTAREA') return;

  alternarMuteMusica();
});