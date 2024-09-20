let y = 0;
let autoRotateInterval;
let mouseMoveTimeout;
const sensitivity = 0.5; // Чутливість для миші
const touchSensitivity = 0.05; // Зменшена чутливість для сенсорного вводу

const fusifyTag = document.querySelector("fusifytag");
const dataItems = JSON.parse(getValue("data-items", fusifyTag.attributes));
const autoSpeed = getValue("auto-speed", fusifyTag.attributes) || 100;

function makeHTML() {
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

  const htmlContent =
    '<div class="cube">' +
    faces
      .map(
        (face) =>
          `<a href="${face.link}" class="${face.class}" target="_blank">
              ${face.content}
           </a>`
      )
      .join("") +
    "</div>";

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
  const body = document.querySelector("body");
  body.style.height = "100vh";
  body.style.display = "flex";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.perspective = "1500px";
  body.style.margin = "0";
  body.style.padding = "0";
  body.style.boxSizing = "border-box";

  const cube = document.querySelector(".cube");
  cube.style.display = "block";
  cube.style.width = "300px";
  cube.style.height = "300px";
  cube.style.position = "relative";
  cube.style.transformStyle = "preserve-3d";
  cube.style.willChange = "transform";

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

  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.pointerEvents = "none";
  });

  const front = document.querySelector(".front");
  front.style.transform = "translateZ(150px)";

  const back = document.querySelector(".back");
  back.style.transform = "rotateY(180deg) translateZ(150px)";

  const left = document.querySelector(".left");
  left.style.transform = "rotateY(-90deg) translateZ(150px)";

  const right = document.querySelector(".right");
  right.style.transform = "rotateY(90deg) translateZ(150px)";

  setCubeSize();
}

function setCubeSize() {
  const cube = document.querySelector(".cube");
  const front = document.querySelector(".front");
  const back = document.querySelector(".back");
  const left = document.querySelector(".left");
  const right = document.querySelector(".right");

  let cubeSize;
  let translateZ;

  if (window.innerWidth <= 600) {
    cubeSize = 150;
    translateZ = 75;
  } else if (window.innerWidth <= 1024) {
    cubeSize = 200;
    translateZ = 100;
  } else {
    cubeSize = 300;
    translateZ = 150;
  }

  cube.style.width = `${cubeSize}px`;
  cube.style.height = `${cubeSize}px`;

  front.style.transform = `translateZ(${translateZ}px)`;
  back.style.transform = `rotateY(180deg) translateZ(${translateZ}px)`;
  left.style.transform = `rotateY(-90deg) translateZ(${translateZ}px)`;
  right.style.transform = `rotateY(90deg) translateZ(${translateZ}px)`;

  scaleImages(cubeSize);
}

function scaleImages(cubeSize) {
  const images = document.querySelectorAll(".side img");
  const videos = document.querySelectorAll(".side video");

  images.forEach((image) => {
    image.style.width = `${cubeSize}px`;
    image.style.height = `${cubeSize}px`;
    image.style.objectFit = "cover";
  });

  videos.forEach((video) => {
    video.style.width = `${cubeSize}px`;
    video.style.height = `${cubeSize}px`;
    video.style.objectFit = "cover";
  });
}

window.onload = function () {
  makeHTML();
  replaceCSS();
  startAutoRotate();
};

window.onresize = function () {
  setCubeSize();
};

function startAutoRotate() {
  function rotate() {
    y += autoSpeed / 100;
    updateCubeRotation();
    autoRotateInterval = requestAnimationFrame(rotate);
  }
  autoRotateInterval = requestAnimationFrame(rotate);
}

function stopAutoRotate() {
  cancelAnimationFrame(autoRotateInterval);
}

// Зупиняє автообертання під час руху миші і знову запускає через 3 секунди
function handleMouseMove(e) {
  stopAutoRotate();
  y += e.movementX * sensitivity;
  updateCubeRotation();
  resetAutoRotate();
}

// Додаємо таймаут для відновлення автообертання через 3 секунди після того, як користувач припинить рух миші
function resetAutoRotate() {
  clearTimeout(mouseMoveTimeout);
  mouseMoveTimeout = setTimeout(startAutoRotate, 3000);
}

// Сенсорне управління для мобільних пристроїв
function handleTouchMove(e) {
  const touch = e.touches[0];
  stopAutoRotate();
  y += (touch.clientX - window.innerWidth / 2) * touchSensitivity;
  updateCubeRotation();
  resetAutoRotate();
}

function updateCubeRotation() {
  document.querySelector(".cube").style.transform = `rotateY(${y}deg)`;
}

document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("touchmove", handleTouchMove);
