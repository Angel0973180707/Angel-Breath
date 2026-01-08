if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

const data = {
    quotes: {
        kids: ["你像小樹一樣，慢慢呼吸就會長大。", "心情像天氣，雲飄走了太陽就出來了。", "你是最棒的小寶貝，大家都很愛你。", "抱抱自己，感覺心跳跳得好神氣。", "像吹泡泡一樣，把煩惱輕輕吹走。", "閉上眼睛，聽聽肚子裡的小秘密。", "每一次吸氣，都像在聞最香的花。", "你的眼睛亮晶晶，能發現小寶藏。", "不管是哭哭或笑笑，Angel 都陪著你。", "現在就給自己一個甜甜的微笑吧。"],
        teen: ["外面的標籤是別人的，空間是自己的。", "你不必總是完美，真實更有力量。", "情緒就像彈幕，讓它飄過去就好。", "在人群中覺得吵鬧時，回到呼吸節奏。", "別人的期待，不一定要成為你的阻礙。", "感受當下，那是唯一屬於你的時間。", "現在的混亂，是為了重組更好的你。", "不需要證明什麼，你的存在就有價值。", "暫停不是放棄，是為了更清醒地進步。", "你的內心深處，有一片誰也闖不進的森林。"],
        adult: ["偏見是心靈的陰影，覺察則是光。", "在情緒的海浪下，你依然是平靜的海床。", "最重要的不是發生了什麼，而是你如何看它。", "看見自己的偏見，它就開始失去了力量。", "暫停一下，讓靈魂跟上你的腳步。", "放下評論，世界會展現新的樣貌。", "偏見往往來自恐懼，而恐懼來自不了解。", "心如明鏡，只是反映而不評判。", "練習在回應前，留出一口呼吸的空間。", "簡單的覺察，就是療癒的開始。"]
    },
    steps: [
        {s:"👀 視覺", t:"找一個你最喜歡的顏色，注視它。"},
        {s:"👂 聽覺", t:"閉上眼，聽聽看最遠處的聲音。"},
        {s:"✋ 觸覺", t:"感覺雙腳踩在地面穩穩的力量。"},
        {s:"🌬️ 呼吸", t:"觀察氣息進入鼻腔時微涼的感覺。"},
        {s:"🌍 空間", t:"留意肩膀的重量，把它放鬆下來。"}
    ]
};

let cfg = { t: 10, v: 'on' };

function setCfg(type, val) {
    cfg[type] = val;
    document.querySelectorAll(`#${type}-row .opt`).forEach(o => o.classList.remove('active'));
    document.getElementById(`${type}-${val}`).classList.add('active');
}

function toggleModal(show) {
    document.getElementById('install-modal').style.display = show ? 'flex' : 'none';
}

function startFlow(cat) {
    let pool = cat === 'all' ? [...data.quotes.kids, ...data.quotes.teen, ...data.quotes.adult] : data.quotes[cat];
    document.getElementById('quote-display').innerText = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => {
        document.getElementById('home-page').classList.remove('active-page');
        document.getElementById('content-page').classList.add('active-page');
        runPractice(data.steps.sort(() => 0.5 - Math.random()).slice(0, 2));
    }, 1200);
}

function runPractice(steps) {
    let i = 0;
    const run = () => {
        if (i >= steps.length) {
            document.getElementById('step-content').innerHTML = "<div class='step-text'>練習完成 ✨<br>帶走這份平靜。</div>";
            setTimeout(() => location.reload(), 3000);
            return;
        }
        const item = steps[i];
        document.getElementById('step-content').innerHTML = `<div class="sense-tag">${item.s}</div><div class="step-text">${item.t}</div>`;
        if(cfg.v === 'on') {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(item.t);
            u.lang = 'zh-TW'; u.rate = 0.9;
            window.speechSynthesis.speak(u);
        }
        let count = cfg.t;
        document.getElementById('timer').innerText = count;
        const timer = setInterval(() => {
            count--;
            document.getElementById('timer').innerText = count > 0 ? count : "✨";
            if (count <= 0) { clearInterval(timer); i++; setTimeout(run, 1000); }
        }, 1000);
    };
    run();
}
