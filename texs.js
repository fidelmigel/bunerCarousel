var cube,
  imagesetArray,
  radioGroup,
  linkTop,
  linkBottom,
  linkRight,
  linkLeft,
  linkFront,
  linkBack,
  classesArray;
var width, height;
var currentClass = "";
let intervalId;
let isPaused = false;
var fusifyTag = document.querySelector("fusifytag");
var clickTag = getValue("clickmacro", fusifyTag.attributes);
var linkStatic = getValue("static_image", fusifyTag.attributes);
var viewability = getValue("viewability", fusifyTag.attributes) * 0.01;
var animationFlow = getValue("animation_flow", fusifyTag.attributes);
var animationSide = getValue("animation_side", fusifyTag.attributes);
var bgColor = getValue("background_color", fusifyTag.attributes);
var bannerSpeed = getValue("speed", fusifyTag.attributes);
var bannerDelay = getValue("delay", fusifyTag.attributes) * 1e3;
var imagesetValue = fusifyTag.getAttribute("imageset");
document.creationWidth = 0;
document.creationHeight = 0;
function getValue(nam, attr) {
  var newVal = null;
  for (var j = 0; j < attr.length; j++) {
    if (attr[j].name !== "imageset") {
      if (attr[j].name == nam) {
        newVal = attr[j].value;
      }
    }
  }
  return newVal;
}
function textToBoolean(text) {
  return text.toLowerCase() === "true";
}
if (imagesetValue) {
  imagesetArray = JSON.parse(imagesetValue);
  setVars();
}
function setVars() {
  if (imagesetArray.length <= 2) {
    var iaLength = imagesetArray.length;
    for (var i = 0; i < iaLength; i++) {
      imagesetArray.push(imagesetArray[i]);
    }
  }
  const img = new Image();
  img.src = linkStatic;
  img.onload = function () {
    if (animationFlow == "vertical") {
      document.creationWidth = img.width * 2;
      document.creationHeight = img.height;
      classesArray = ["bottom", "front", "top", "back"];
      currentClass = "back";
    } else if (animationFlow == "horizontal") {
      document.creationWidth = img.width;
      document.creationHeight = img.height * 2;
      classesArray = ["back", "left", "front", "right"];
      currentClass = "back";
    }
    width = img.width;
    height = img.height;
    console.log("Image width: " + document.creationWidth + "px");
    console.log("Image height: " + document.creationHeight + "px");
    makeHTML();
  };
  img.onerror = function () {
    console.error("Failed to load the image.");
  };
}
function makeHTML() {
  console.log("run");
  var htmlContent =
    '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<div class="banner">\n<a href="javascript:window.open(window.clickTag)">\n<div class="centered-content">\n<div class="stat"></div>\n<div class="scene">\n<div class="cube">\n<div class="cube__face cube__face--front"></div>\n<div class="cube__face cube__face--back"></div>\n<div class="cube__face cube__face--top"></div>\n<div class="cube__face cube__face--bottom"></div>\n<div class="cube__face cube__face--left"></div>\n<div class="cube__face cube__face--right"></div>\n</div>\n</div>\n</div>\n</a>\n</div>\n</body>\n</html>';
  fusifyTag.innerHTML = htmlContent;
  replaceCSS();
}
function replaceCSS() {
  const body = document.querySelector("body");
  body.style.overflow = "hidden";
  const centeredContent = document.querySelector(".centered-content");
  centeredContent.classList.add("centered-content");
  centeredContent.style.display = "flex";
  centeredContent.style.justifyContent = "center";
  centeredContent.style.alignItems = "center";
  centeredContent.style.minHeight = "100vh";
  centeredContent.style.overflow = "hidden";
  const scene = document.querySelector(".scene");
  scene.classList.add("scene");
  scene.style.width = width + "px";
  scene.style.height = height + "px";
  scene.style.position = "absolute";
  scene.style.perspective = width + "px";
  const stat = document.querySelector(".stat");
  stat.classList.add("stat");
  stat.style.width = width + "px";
  stat.style.height = height + "px";
  stat.style.position = "absolute";
  stat.style.background = "url(" + linkStatic + ") no-repeat";
  cube = document.querySelector(".cube");
  cube.classList.add("cube");
  cube.style.width = width + "px";
  cube.style.height = height + "px";
  cube.style.position = "relative";
  cube.style.transformStyle = "preserve-3d";
  cube.style.transform = "translateZ(-" + width / 2 + "px)";
  cube.style.transition = "transform " + bannerSpeed + "s";
  if (animationFlow == "vertical" && animationSide == 2) {
    scene.style.marginLeft = width + "px";
    stat.style.marginLeft = -width + "px";
  } else if (animationFlow == "vertical") {
    stat.style.marginLeft = width + "px";
    scene.style.marginLeft = -width + "px";
  } else {
    stat.style.marginLeft = "0px";
    scene.style.marginLeft = "0px";
  }
  if (animationFlow == "horizontal" && animationSide == 2) {
    scene.style.marginTop = height + "px";
    stat.style.marginTop = -height + "px";
  } else if (animationFlow == "horizontal") {
    scene.style.marginTop = -height + "px";
    stat.style.marginTop = height + "px";
  } else {
    stat.style.marginTop = "0px";
    scene.style.marginTop = "0px";
  }
  const cubeFaces = document.querySelectorAll(".cube__face");
  cubeFaces.forEach((face) => {
    face.style.position = "absolute";
    face.style.width = width + "px";
    face.style.height = height + "px";
  });
  const cubeFaceFront = document.querySelector(".cube__face--front");
  const cubeFaceBack = document.querySelector(".cube__face--back");
  const cubeFaceTop = document.querySelector(".cube__face--top");
  const cubeFaceBottom = document.querySelector(".cube__face--bottom");
  const cubeFaceLeft = document.querySelector(".cube__face--left");
  const cubeFaceRight = document.querySelector(".cube__face--right");
  if (animationFlow == "vertical") {
    cubeFaceFront.style.background = "no-repeat url(" + imagesetArray[1] + ")";
    cubeFaceFront.style.transform =
      "rotateY(0deg) translateZ(" + height / 2 + "px)";
    cubeFaceBack.style.background = "no-repeat url(" + imagesetArray[3] + ")";
    cubeFaceBack.style.transform =
      "rotateX(-180deg) translateZ(" + height / 2 + "px)";
    cubeFaceTop.style.background = "no-repeat url(" + imagesetArray[2] + ")";
    cubeFaceTop.style.transform =
      "rotateX(90deg) translateZ(" + height / 2 + "px)";
    cubeFaceBottom.style.background = "no-repeat url(" + imagesetArray[0] + ")";
    cubeFaceBottom.style.transform =
      "rotateX(-90deg) translateZ(" + height / 2 + "px)";
  } else {
    cubeFaceFront.style.background = "no-repeat url(" + imagesetArray[1] + ")";
    cubeFaceFront.style.transform =
      "rotateY(0deg) translateZ(" + width / 2 + "px)";
    cubeFaceBack.style.background = "no-repeat url(" + imagesetArray[3] + ")";
    cubeFaceBack.style.transform =
      "rotateY(180deg) translateZ(" + width / 2 + "px)";
    cubeFaceLeft.style.background = "no-repeat url(" + imagesetArray[0] + ")";
    cubeFaceLeft.style.transform =
      "rotateY(-90deg) translateZ(" + width / 2 + "px)";
    cubeFaceRight.style.background = "no-repeat url(" + imagesetArray[2] + ")";
    cubeFaceRight.style.transform =
      "rotateY(90deg) translateZ(" + width / 2 + "px)";
  }
  changeSide();
  startRotate();
  setupIntersectionObserver();
}
function setSideClasses() {
  if (cube.classList.contains("show-front")) {
    if (animationFlow == "vertical") {
      cube.style.transform = "translateZ(-" + height / 2 + "px) rotateY(0deg)";
    } else {
      cube.style.transform = "translateZ(-" + width / 2 + "px) rotateY(0deg)";
    }
  }
  if (cube.classList.contains("show-back")) {
    if (animationFlow == "vertical") {
      cube.style.transform =
        "translateZ(-" + height / 2 + "px) rotateX(-180deg)";
    } else {
      cube.style.transform =
        "translateZ(-" + width / 2 + "px) rotateY(-180deg)";
    }
  }
  if (cube.classList.contains("show-top")) {
    cube.style.transform = "translateZ(-" + height / 2 + "px) rotateX(-90deg)";
  }
  if (cube.classList.contains("show-bottom")) {
    cube.style.transform = "translateZ(-" + height / 2 + "px) rotateX(90deg)";
  }
  if (cube.classList.contains("show-left")) {
    cube.style.transform = "translateZ(-" + width / 2 + "px) rotateY(90deg)";
  }
  if (cube.classList.contains("show-right")) {
    cube.style.transform = "translateZ(-" + width / 2 + "px) rotateY(-90deg)";
  }
}
function changeSide() {
  const currentIndex = classesArray.indexOf(currentClass);
  const nextIndex = (currentIndex + 1) % classesArray.length;
  var showClass = "show-" + classesArray[nextIndex];
  if (currentClass) {
    cube.classList.remove("show-" + currentClass);
  }
  cube.classList.add(showClass);
  currentClass = classesArray[nextIndex];
  setSideClasses();
}
function startRotate() {
  if (isPaused) {
    return;
  }
  intervalId = setInterval(() => {
    changeSide();
  }, bannerDelay);
}
function pauseRotate() {
  if (intervalId) {
    clearInterval(intervalId);
    isPaused = true;
  }
}
function resumeRotate() {
  if (isPaused) {
    isPaused = false;
    startRotate();
  }
}
function setupIntersectionObserver() {
  var imgElement = document.querySelector(".centered-content");
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.intersectionRatio < viewability) {
        console.log("pause");
        if (isPaused === false) {
          pauseRotate();
        }
      } else {
        console.log("unpause");
        if (isPaused === true) {
          resumeRotate();
        }
      }
    },
    { threshold: viewability }
  );
  observer.observe(imgElement);
}
/*Цей код відповідає за створення банера із кубом, на якому зображення перемикаються з певним інтервалом. Він також включає функціонал для обробки зміни сторін куба залежно від напрямку анімації (горизонтального або вертикального) і спостереження за видимістю банера на екрані користувача. Ось детальний опис кожної функції:

1. getValue(nam, attr)
Призначення: Функція отримує значення атрибутів з елементу HTML, переданого у змінній fusifyTag. Вона приймає два аргументи: ім'я атрибуту і масив атрибутів. Якщо атрибут знайдений, функція повертає його значення.
Що робить: Проходить через всі атрибути об'єкту і повертає значення, що відповідає переданому імені атрибуту (nam).
2. textToBoolean(text)
Призначення: Конвертує текстове значення ("true" або "false") в булеве значення.
Що робить: Повертає true, якщо текст дорівнює "true" (незалежно від регістру), інакше повертає false.
3. setVars()
Призначення: Налаштовує початкові змінні для розміру зображення, класів сторін куба і напрямку анімації (горизонтальної або вертикальної).
Що робить:
Якщо кількість зображень у imagesetArray менше або дорівнює двом, вона дублює ці зображення для заповнення масиву.
Створює новий об'єкт зображення та завантажує статичне зображення з атрибуту linkStatic.
На основі напрямку анімації (горизонтальний або вертикальний) обчислює розміри створюваного куба і призначає класи для сторін.
4. makeHTML()
Призначення: Створює HTML-контент для банера, включаючи куб і всі необхідні елементи.
Що робить: Вставляє структуру HTML, яка містить банер із кубом, у елемент fusifyTag. Після цього викликає функцію replaceCSS().
5. replaceCSS()
Призначення: Створює і налаштовує CSS-стилі для всіх елементів банера, зокрема куба, його сторін і загальної сцени.
Що робить:
Налаштовує параметри стилю для банера, сцени, статичного зображення і сторін куба.
Визначає початкове розташування і трансформацію куба залежно від напрямку анімації.
6. setSideClasses()
Призначення: Оновлює трансформацію куба залежно від того, яка сторона зараз активна.
Що робить:
Залежно від класу сторони (show-front, show-back, show-top, і т.д.), змінює трансформацію куба (обертання і позицію).
7. changeSide()
Призначення: Перемикає сторони куба на наступну сторону, використовуючи масив класів для сторін.
Що робить:
Знаходить поточну сторону куба за допомогою масиву класів, перемикає куб на наступну сторону і застосовує новий клас.
8. startRotate()
Призначення: Запускає цикл автоматичної зміни сторін куба з певною затримкою.
Що робить:
Якщо анімація не на паузі, починає інтервал, який кожен раз через заданий інтервал часу (визначений змінною bannerDelay) викликає функцію changeSide() для перемикання сторін.
9. pauseRotate()
Призначення: Ставить анімацію куба на паузу.
Що робить: Якщо інтервал анімації активний, очищує його і змінює прапорець isPaused на true.
10. resumeRotate()
markdown
Копіювати код
- **Призначення**: Відновлює анімацію, якщо вона була на паузі.
- **Що робить**: Якщо анімація була на паузі, знову викликає функцію `startRotate()` і змінює прапорець `isPaused` на `false`.
11. setupIntersectionObserver()
Призначення: Спостерігає за тим, коли банер стає видимим або невидимим на екрані, і відповідно зупиняє або відновлює анімацію.
Що робить:
Використовує IntersectionObserver, щоб відстежувати, коли банер перетинає заданий поріг видимості (viewability).
Якщо банер видимий менше, ніж заданий поріг, анімація зупиняється; якщо більше — відновлюється.
Загальний функціонал
Цей код забезпечує створення банера у вигляді куба з кількома сторонами, які змінюються через певний час. Анімація може працювати в горизонтальному або вертикальному напрямку. Також є функція, яка зупиняє анімацію, якщо банер невидимий на екрані, що допомагає зберегти ресурси.*/
