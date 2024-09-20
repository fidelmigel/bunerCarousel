let y = 0;
let autoRotateInterval;
let mouseMoveTimeout;
const sensitivity = 0.5; // Чутливість для миші
const touchSensitivity = 0.05; // Зменшена чутливість для сенсорного вводу

const fusifyTag = document.querySelector("fusifytag");
const dataItems = JSON.parse(getValue("data-items", fusifyTag.attributes));
const autoSpeed = getValue("auto-speed", fusifyTag.attributes);

function makeHTML() {
  // Масив об'єктів з інформацією для кожної грані куба
  const faces = [
    {
      class: "side front",
      content:
        '<video src="images/tel.mp4" muted playsinline autoplay loop></video>',
      link: dataItems[0].link,
    },
    {
      class: "side back",
      content: '<img src="images/burger.png">',
      link: dataItems[1].link,
    },
    {
      class: "side left",
      content: '<img src="images/chiken.png">',
      link: dataItems[2].link,
    },
    {
      class: "side right",
      content: '<img src="images/meat.png">',
      link: dataItems[3].link,
    },
  ];

  // Генерація HTML для куба через map і join
  const htmlContent =
    '<div class="cube">' +
    faces
      .map(
        (face) =>
          '<a href="' +
          face.link +
          '" class="' +
          face.class +
          '" target="_blank">' +
          face.content +
          "</a>"
      )
      .join("") +
    "</div>";

  // Вставка згенерованого HTML у DOM
  fusifyTag.innerHTML = htmlContent;
}

function getValue(name, attr) {
  for (var j = 0; j < attr.length; j++) {
    if (attr[j].name == name) {
      return attr[j].value;
    }
  }

  return null;
}

function replaceCSS() {
  // Стилізація body
  const body = document.querySelector("body");
  body.style.height = "100vh";
  body.style.display = "flex";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.perspective = "1500px";
  body.style.margin = "0";
  body.style.padding = "0";
  body.style.boxSizing = "border-box";

  // Стилізація куба
  const cube = document.querySelector(".cube");
  cube.style.display = "block";
  cube.style.width = "300px";
  cube.style.height = "300px";
  cube.style.position = "relative";
  cube.style.transformStyle = "preserve-3d";
  cube.style.willChange = "transform";

  // Стилізація сторін куба
  const sides = document.querySelectorAll(".side");
  sides.forEach((side) => {
    side.style.border = "2px solid #fff";
    side.style.width = "100%";
    side.style.height = "100%";
    side.style.display = "flex";
    side.style.justifyContent = "center";
    side.style.alignItems = "center";
    side.style.position = "absolute";
    side.style.backfaceVisibility = "hidden";
    side.style.backgroundSize = "cover";
    side.style.backgroundPosition = "center";
    side.style.textDecoration = "none";
    side.style.willChange = "transform";
  });

  // Стилізація відео
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.pointerEvents = "none";
  });

  // Стилізація кожної сторони куба
  const front = document.querySelector(".front");
  front.style.transform = "translateZ(150px)";

  const back = document.querySelector(".back");
  back.style.transform = "rotateY(180deg) translateZ(150px)";

  const left = document.querySelector(".left");
  left.style.transform = "rotateY(-90deg) translateZ(150px)";

  const right = document.querySelector(".right");
  right.style.transform = "rotateY(90deg) translateZ(150px)";

  // Адаптивна стилізація для малих екранів
  if (window.innerWidth <= 600) {
    cube.style.width = "150px";
    cube.style.height = "150px";
    front.style.transform = "translateZ(75px)";
    back.style.transform = "rotateY(180deg) translateZ(75px)";
    left.style.transform = "rotateY(-90deg) translateZ(75px)";
    right.style.transform = "rotateY(90deg) translateZ(75px)";
  } else if (window.innerWidth <= 1024) {
    cube.style.width = "200px";
    cube.style.height = "200px";
    front.style.transform = "translateZ(100px)";
    back.style.transform = "rotateY(180deg) translateZ(100px)";
    left.style.transform = "rotateY(-90deg) translateZ(100px)";
    right.style.transform = "rotateY(90deg) translateZ(100px)";
  }
}

// Виклик функції після завантаження сторінки
window.onload = function () {
  replaceCSS();
};

// Функція для автоматичного обертання з використанням requestAnimationFrame
function startAutoRotate() {
  function rotate() {
    y += 0.5;
    updateCubeRotation();
    autoRotateInterval = requestAnimationFrame(rotate);
  }
  autoRotateInterval = requestAnimationFrame(rotate);
}

// Зупиняємо автоматичне обертання
function stopAutoRotate() {
  cancelAnimationFrame(autoRotateInterval);
}

// Функція для відновлення автоматичного обертання після 3 секунд без руху курсора
function resetAutoRotate() {
  clearTimeout(mouseMoveTimeout);
  mouseMoveTimeout = setTimeout(startAutoRotate, 3000); // 3 секунди
}

// Управління за допомогою миші
function handleMouseMove(e) {
  stopAutoRotate();
  y += e.movementX * sensitivity; // Рух миші по горизонталі
  updateCubeRotation();
  resetAutoRotate();
}

// Управління за допомогою сенсорного вводу (смартфон)
function handleTouchMove(e) {
  const touch = e.touches[0];
  e.preventDefault(); // Забороняє скролінг лише при взаємодії з кубом
  stopAutoRotate();
  y += (touch.clientX - window.innerWidth / 2) * touchSensitivity; // Рух пальця по горизонталі
  updateCubeRotation();
  resetAutoRotate();
}

// Функція для оновлення трансформації куба
function updateCubeRotation() {
  document.querySelector(".cube").style.transform = `rotateY(${y}deg)`;
}

// Примусове відтворення відео та налаштування циклічного відтворення
function forcePlayVideos() {
  document.querySelectorAll("video").forEach((video) => {
    video.play().catch((error) => {
      console.log("Autoplay failed:", error);
    });

    // Додаємо обробник події для циклічного відтворення
    video.addEventListener("ended", () => {
      video.currentTime = 0; // Повертаємося на початок відео
      video.play().catch((error) => {
        console.log("Play failed:", error);
      });
    });
  });
}

// Додаємо подію для відтворення відео при взаємодії користувача
function addVideoPlayOnClick() {
  document.querySelector(".front").addEventListener("click", () => {
    const video = document.querySelector(".front video");
    video.play().catch((error) => {
      console.log("Play failed:", error);
    });
  });
}

// Додаткові події для сенсорного введення
function handleTouchStart(e) {
  stopAutoRotate();
}

function handleTouchEnd(e) {
  resetAutoRotate();
}

// Ініціалізація подій
function initEvents() {
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("touchmove", handleTouchMove);
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);
}

// Запуск функцій при завантаженні сторінки
function init() {
  makeHTML();
  startAutoRotate();
  forcePlayVideos();
  addVideoPlayOnClick();
  initEvents();
}

init();
