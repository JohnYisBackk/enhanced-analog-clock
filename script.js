// Premenné pre vlastný čas
let isCustomTime = false;
let customTime = new Date();

// SVG kruhy
const hh = document.getElementById("hh");
const mm = document.getElementById("mm");
const ss = document.getElementById("ss");

// Bodky
const sec_dot = document.querySelector(".sec-dot");
const min_dot = document.querySelector(".min-dot");
const hr_dot = document.querySelector(".hr-dot");

// Ručičky
const hr = document.getElementById("hr");
const mn = document.getElementById("mn");
const sc = document.getElementById("sc");

//Buttony
const resetBtn = document.getElementById("resetBtn");
const setBtn = document.getElementById("setBtn");
const submitTime = document.getElementById("submitTime");
const timePanel = document.getElementById("timePanel");
const modeBtn = document.getElementById("modeBtn");

// ked klikneš na nastavenie času pridas časový panel
setBtn.onclick = () => {
  timePanel.classList.toggle("show");
};

// ked klikneš na reset, vráti sa na aktuálny čas
resetBtn.onclick = () => {
  isCustomTime = false;

  const now = new Date();
  secAngle = now.getSeconds() * 6;
  minAngle = now.getMinutes() * 6;

  timePanel.classList.remove("show");
  localStorage.removeItem("customTime");
};

// nastavenie vlastného času podľa vstupov
submitTime.onclick = () => {
  const h = +hInput.value || 0;
  const m = +mInput.value || 0;
  const s = +sInput.value || 0;

  // nastavenie vlastného času
  customTime = new Date();
  customTime.setHours(h, m, s);
  isCustomTime = true;

  // synchronizácia uhlov – inak sa ručičky „roztrhnú“
  secAngle = s * 6;
  minAngle = m * 6;

  timePanel.classList.remove("show");

  // ✅ VYČISTENIE INPUTOV
  hInput.value = "";
  mInput.value = "";
  sInput.value = "";

  // Uloženie do localStorage
  localStorage.setItem("customTime", JSON.stringify({ h, m, s }));
};

// 🌙 NIGHT MODE
const themeIcon = document.getElementById("themeIcon");

// Vždy zacat v NIGHT MODE
document.body.classList.add("night");
themeIcon.textContent = "🌙";

modeBtn.onclick = () => {
  const isNight = document.body.classList.toggle("night");

  themeIcon.textContent = isNight ? "🌙" : "☀️";
  modeBtn.classList.toggle("active", !isNight);
};
// Aktualizacia každu sekundu
let secAngle = 0;
let minAngle = 0;
let hrAngle = 0;

function syncAnglesFromDate(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  secAngle = s * 6;
  minAngle = m * 6;
  hrAngle = (h % 12) * 30 + m * 0.5;

  // Sekundy
  sc.style.transform = `rotateZ(${secAngle}deg)`;
  sec_dot.style.transform = `rotateZ(${secAngle}deg)`;

  // --- MINÚTY (každých 60s +6°) ---
  // Minúty
  mn.style.transform = `rotateZ(${minAngle}deg)`;
  min_dot.style.transform = `rotateZ(${minAngle}deg)`;

  // --- HODINY (plynule podľa času) ---
  hr.style.transform = `rotateZ(${hrAngle}deg)`;
  hr_dot.style.transform = `rotateZ(${hrAngle}deg)`;
}

// -------------------- Zvuk + mute --------------------
window.addEventListener("load", () => {
  const tick = document.getElementById("tickSound");
  const soundIcon = document.getElementById("soundIcon");
  const overlay = document.getElementById("soundOverlay");
  const enableBtn = document.getElementById("enableSoundBtn");
  let soundOn = true;
  let soundInitialized = false;

  // prepínanie ikonky
  soundIcon.onclick = () => {
    soundOn = !soundOn;
    soundIcon.textContent = soundOn ? "🔊" : "🔇";
    if (!soundOn) tick.pause();
  };

  // klik kdekoľvek na overlay alebo stránku pre istotu
  enableBtn.onclick = () => {
    if (!soundInitialized && soundOn) {
      tick.currentTime = 0;
      tick.play().catch(() => {});
      soundInitialized = true;
      overlay.classList.add("hide");
    }
  };

  // Hlavný interval pre hodiny a tik-tak
  setInterval(() => {
    const now = isCustomTime
      ? (customTime.setSeconds(customTime.getSeconds() + 1), customTime)
      : new Date();

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    hh.style.strokeDashoffset = 510 - (510 * (h % 12)) / 12;
    mm.style.strokeDashoffset = 630 - (630 * m) / 60;
    ss.style.strokeDashoffset = 760 - (760 * s) / 60;

    syncAnglesFromDate(now);

    if (soundOn && soundInitialized) {
      tick.currentTime = 0;
      tick.play().catch(() => {});
    }
  }, 1000);
});
