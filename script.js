// 註冊 Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

const data = {
    quotes: {
        kids: ["你像小樹一樣，慢慢呼吸就會長大。", "心情像天氣，雲飄走了太陽就出來了。", "抱抱自己，感覺心跳跳得好神氣。", "像吹泡泡一樣，把煩惱輕輕吹走。", "每一次吸氣，都像在聞最香的花。", "不管是哭哭或笑笑，Angel 都陪著你。", "你是最棒的小寶貝，大家都很愛你。"],
        primary: ["雖然有點生氣，但呼吸能讓你變平靜。", "像超人一樣，用呼吸拿回控制權。", "不需要急著說話，先聽聽心裡的聲音。", "把煩惱寫在雲上，讓它慢慢飄遠。", "你不需要完美，只需要當你自己。", "感覺腳掌貼在地面，你是最穩的。", "心裡的怪獸，只要呼吸它就會變小。"],
        teen: ["外面的標籤是別人的，空間是自己的。", "你不必總是完美，真實更有力量。", "情緒就像彈幕，讓它飄過去就好。", "在人群中覺得吵鬧時，回到呼吸節奏。", "別人的期待，不一定要成為你的阻礙。", "感受當下，那是唯一屬於你的時間。", "現在的混亂，是為了重組更好的你。"],
        adult: ["偏見是心靈的陰影，覺察則是光。", "在情緒的海浪下，你依然是平靜的海床。", "最重要的不是發生了什麼，而是你如何看它。", "暫停一下，讓靈魂跟上你的腳步。", "看見自己的偏見，它就開始失去了力量。", "簡單的覺察，就是療癒的開始。", "放下評論，世界會展現新的樣貌。"]
    },
    steps: [
        {s:"👀 視覺", t:"找一個你最喜歡的顏色，注視它。"},
        {s:"👂 聽覺", t:"閉上眼，聽聽看最遠處的聲音。"},
        {s:"✋ 觸覺", t:"感覺雙腳踩在地面穩穩的力量。"},
        {s:"🌬️ 呼吸", t:"觀察氣息進入鼻腔時微涼的感覺。"}
    ]
};

let cfg = { t: 10, v: 'on' };

function setCfg(type, val) {
    cfg[type] = val;
    document.querySelectorAll(`#${type}-row .opt`).forEach(o => o.classList.remove('active'));
    document.getElementById(`${type}-${val}`).classList.add('active');
}

function openModal() { document.getElementById('modal').style.display = 'flex'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }

function startFlow(cat) {
    const pool = data.quotes[cat];
    const quote = pool[Math.floor(Math.random() * pool.length)];
    document.getElementById('quote-display').innerText = quote;

    setTimeout(() => {
        document.getElementById('home-page').classList.remove('active-page');
        document.getElementById('content-page').classList.add('active-page');
        runPractice();
    }, 1200);
}

function runPractice() {
    let i = 0;
    const shuffledSteps = data.steps.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const run = () => {
        if (i >= shuffledSteps.length) {
            document.getElementById('step-content').innerHTML = "練習完成 ✨<br><small>帶著平靜回到生活</small>";
            setTimeout(() => location.reload(), 3000);
            return;
        }
        
        const item = shuffledSteps[i];
        document.getElementById('step-content').innerText = item.t;
        
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
            if (count <= 0) {
                clearInterval(timer);
                i++;
                setTimeout(run, 1000);
            }
        }, 1000);
    };
    run();
}
