let y = 0;
let autoRotateInterval;
let mouseMoveTimeout;
const sensitivity = 0.5;
const touchSensitivity = 0.05;

const fusifyTag = document.querySelector("fusifytag");
const dataItems = JSON.parse(getValue("data-items", fusifyTag.attributes));
const autoSpeed = getValue("auto-speed", fusifyTag.attributes) || 100;
const resetTimeout =
  parseInt(getValue("reset-timeout", fusifyTag.attributes)) || 3000;
const rotationDirection =
  getValue("rotation-direction", fusifyTag.attributes) || "right";

// Напрямок автообертання: 1 для "right" і -1 для "left"
const autoRotationMultiplier = rotationDirection === "right" ? 1 : -1;

function makeHTML() {
  const faces = [
    {
      class: "side front",
      content: dataItems[0]["first-face"],
      link: dataItems[0].link,
    },
    {
      class: "side back",
      content: dataItems[1]["second-face"],
      link: dataItems[1].link,
      bgColor: dataItems[1]["background-color"],
      bgSize: dataItems[1]["background-size"],
      bgPos: dataItems[1]["background-position"],
    },
    {
      class: "side left",
      content: dataItems[2]["third-face"],
      link: dataItems[2].link,
      bgColor: dataItems[2]["background-color"],
      bgSize: dataItems[2]["background-size"],
      bgPos: dataItems[2]["background-position"],
    },
    {
      class: "side right",
      content: dataItems[3]["fourth-face"],
      link: dataItems[3].link,
      bgColor: dataItems[3]["background-color"],
      bgSize: dataItems[3]["background-size"],
      bgPos: dataItems[3]["background-position"],
    },
  ];

  const htmlContent =
    '<div class="cube">' +
    faces
      .map(
        (face) =>
          `<a href="${face.link}" class="${face.class}" target="_blank" 
           style="background-color: ${face.bgColor}; 
           background-image: url(${face.content});
           background-size: ${face.bgSize};
           background-position: ${face.bgPos};"></a>`
      )
      .join("") +
    "</div>";

  fusifyTag.innerHTML = htmlContent;
}

function getValue(name, attr) {
  for (let j = 0; j < attr.length; j++) {
    if (attr[j].name === name) {
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
    side.style.backgroundRepeat = "no-repeat";
    side.style.textDecoration = "none";
    side.style.willChange = "transform";
  });

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
    y += (autoSpeed / 100) * autoRotationMultiplier;
    updateCubeRotation();
    autoRotateInterval = requestAnimationFrame(rotate);
  }
  autoRotateInterval = requestAnimationFrame(rotate);
}

function stopAutoRotate() {
  cancelAnimationFrame(autoRotateInterval);
}

function resetAutoRotate() {
  clearTimeout(mouseMoveTimeout);
  mouseMoveTimeout = setTimeout(startAutoRotate, resetTimeout);
}

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

function handleMouseMove(e) {
  stopAutoRotate();
  y += e.movementX * sensitivity;
  updateCubeRotation();
  resetAutoRotate();
}
