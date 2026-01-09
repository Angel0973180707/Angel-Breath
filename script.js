/* Angel Breath - script.js */

const STORAGE_KEY = "angel_breath_cfg_v1";

const data = {
  quotes: {
    kids: [
      "你像小樹一樣，慢慢呼吸就會長大。",
      "心情像天氣，雲飄走了太陽就出來了。",
      "你是最棒的小寶貝，Angel 都在。",
      "抱抱自己，感覺心跳跳得好神氣。",
      "像吹泡泡一樣，把煩惱輕輕吹走。",
      "每一次吸氣，都像在聞最香的花。",
      "不管哭哭或笑笑，你都值得被愛。",
      "把手放胸口，說：我在這裡。",
      "慢慢數到三，心就會回來。",
      "今天先把自己照顧好，就是很棒。"
    ],
    primary: [
      "雖然有點生氣，但呼吸能讓你變平靜。",
      "像超人一樣，用呼吸拿回控制權。",
      "不需要急著說話，先聽聽心裡的聲音。",
      "把煩惱寫在雲上，讓它慢慢飄遠。",
      "你不需要完美，只需要當你自己。",
      "感覺腳掌貼在地面，你是最穩的。",
      "心裡的怪獸，呼吸一下就會變小。",
      "先停一下，再決定要怎麼說。",
      "你可以不同意，但也可以很溫柔。",
      "把注意力放回自己，你就更有力量。"
    ],
    teen: [
      "外面的標籤是別人的，空間是自己的。",
      "你不必總是完美，真實更有力量。",
      "情緒就像彈幕，讓它飄過去就好。",
      "在人群中覺得吵鬧時，回到呼吸節奏。",
      "別人的期待，不一定要成為你的阻礙。",
      "感受當下，那是唯一屬於你的時間。",
      "現在的混亂，是為了重組更好的你。",
      "你可以慢，不等於你不行。",
      "先穩住自己，再回應世界。",
      "你不是情緒，你是看見情緒的人。"
    ],
    adult: [
      "偏見是心靈的陰影，覺察則是光。",
      "在情緒海浪下，你依然是平靜的海床。",
      "最重要的不是發生了什麼，而是你如何看它。",
      "暫停一下，讓靈魂跟上你的腳步。",
      "看見自己的偏見，它就開始失去力量。",
      "簡單的覺察，就是療癒的開始。",
      "放下評論，世界會展現新的樣貌。",
      "先回呼吸，再回到關係。",
      "把心站穩，語氣就會柔軟。",
      "你不是來贏的，你是來回家的。"
    ]
  },
  steps: [
    { s: "👀 視覺", t: "找一個你最喜歡的顏色，注視它。" },
    { s: "👂 聽覺", t: "閉上眼，聽聽最遠處的聲音。" },
    { s: "✋ 觸覺", t: "感覺雙腳踩在地面，穩穩的力量。" },
    { s: "🌬️ 呼吸", t: "觀察氣息進入鼻腔時微涼的感覺。" }
  ]
};

let cfg = { t: 10, v: "on" };

let practice = {
  cat: null,
  steps: [],
  stepIndex: 0,
  timerId: null,
  count: 10
};

const $ = (id) => document.getElementById(id);

function loadCfg() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved && typeof saved === "object") {
      cfg = { ...cfg, ...saved };
    }
  } catch (_) {}
}

function saveCfg() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

function setCfg(type, val) {
  cfg[type] = val;
  saveCfg();

  const rowId = `${type}-row`;
  document.querySelectorAll(`#${rowId} .opt`).forEach((o) => o.classList.remove("active"));
  $(`${type}-${val}`).classList.add("active");

  // 若關閉語音，立即停止
  if (type === "v" && val === "off") {
    safeStopSpeech();
  }
}

function syncUIFromCfg() {
  // time
  ["10", "20", "30"].forEach((n) => $(`t-${n}`).classList.remove("active"));
  $(`t-${cfg.t}`).classList.add("active");
  // voice
  ["on", "off"].forEach((n) => $(`v-${n}`).classList.remove("active"));
  $(`v-${cfg.v}`).classList.add("active");
}

function openModal() {
  const modal = $("modal");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = $("modal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function gotoPracticePage() {
  $("home-page").classList.remove("active-page");
  $("content-page").classList.add("active-page");
}

function gotoHomePage() {
  stopPractice();
  $("content-page").classList.remove("active-page");
  $("home-page").classList.add("active-page");
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* iOS/Chrome 語音安全處理 */
function safeStopSpeech() {
  try {
    window.speechSynthesis?.cancel?.();
  } catch (_) {}
}

function speak(text) {
  if (cfg.v !== "on") return;
  if (!("speechSynthesis" in window)) return;

  safeStopSpeech();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-TW";
  u.rate = 0.92;
  u.pitch = 1.0;

  // iOS 有時需要先 getVoices() 才穩
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.speak(u);
  } catch (_) {}
}

function startFlow(cat) {
  practice.cat = cat;

  const quote = pickRandom(data.quotes[cat]);
  $("quote-display").innerText = quote;

  // 延遲一下讓使用者讀到金句再進入練習
  setTimeout(() => {
    gotoPracticePage();
    startPractice();
  }, 650);
}

function startPractice() {
  stopPractice();

  // 隨機挑 2 步：在「快」與「可落地」之間最剛好
  practice.steps = shuffle(data.steps).slice(0, 2);
  practice.stepIndex = 0;

  runStep();
}

function stopPractice() {
  if (practice.timerId) {
    clearInterval(practice.timerId);
    practice.timerId = null;
  }
  safeStopSpeech();
}

function runStep() {
  if (practice.stepIndex >= practice.steps.length) {
    $("timer").innerText = "✨";
    $("step-content").innerHTML = "練習完成 ✨<br><small style='opacity:.75'>帶著平靜回到生活</small>";

    // 1.4 秒後自動回主頁（不 reload，PWA 更穩）
    setTimeout(() => {
      gotoHomePage();
    }, 1400);
    return;
  }

  const item = practice.steps[practice.stepIndex];
  $("step-content").innerText = item.t;

  speak(item.t);

  practice.count = Number(cfg.t) || 10;
  $("timer").innerText = practice.count;

  practice.timerId = setInterval(() => {
    practice.count--;
    $("timer").innerText = practice.count > 0 ? String(practice.count) : "✨";

    if (practice.count <= 0) {
      clearInterval(practice.timerId);
      practice.timerId = null;
      practice.stepIndex++;
      setTimeout(runStep, 650);
    }
  }, 1000);
}

function skipToNextStep() {
  if (practice.timerId) {
    clearInterval(practice.timerId);
    practice.timerId = null;
  }
  safeStopSpeech();
  practice.stepIndex++;
  runStep();
}

function bindUI() {
  // 設定按鈕（10/20/30 & voice）
  document.querySelectorAll(".opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.cfg;
      const valRaw = btn.dataset.val;
      const val = type === "t" ? Number(valRaw) : valRaw;
      setCfg(type, val);
    });
  });

  // 2x2 年齡按鈕
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => startFlow(btn.dataset.cat));
  });

  // 安裝教學
  $("open-install").addEventListener("click", openModal);
  $("close-install").addEventListener("click", closeModal);
  $("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });

  // 練習頁按鈕
  $("btn-skip").addEventListener("click", skipToNextStep);
  $("btn-back").addEventListener("click", gotoHomePage);

  // 防止雙擊放大造成的誤觸（iOS）
  let lastTouchEnd = 0;
  document.addEventListener("touchend", (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });
}

function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js", { scope: "./" });
    } catch (err) {
      // SW 註冊失敗也不影響使用
      console.warn("Service Worker register failed:", err);
    }
  });
}

// init
document.addEventListener("DOMContentLoaded", () => {
  loadCfg();
  bindUI();
  syncUIFromCfg();
  registerSW();
});
