/* Extra apps + lock screen. Loaded before app.js */
window.extraApps = [
  { id: "paint", name: "Paint", icon: "🎨", bg: "#ec4899", open: paintApp },
  { id: "snake", name: "Snake", icon: "🐍", bg: "#16a34a", open: snakeApp },
  { id: "cal", name: "Calendar", icon: "📅", bg: "#2563eb", open: calApp },
  { id: "music", name: "Music", icon: "🎵", bg: "#f97316", open: musicApp }
];

function paintApp(b) {
  b.innerHTML = '<canvas id="pc" width="360" height="440" style="width:100%;border-radius:16px;background:#fff;touch-action:none;flex:1;min-height:0"></canvas><div class="row" id="pcol"></div><div class="row"><button id="pclr">Clear</button><button id="psave">Save to Gallery</button></div>';
  const c = $("#pc"), x = c.getContext("2d");
  x.fillStyle = "#fff"; x.fillRect(0, 0, 360, 440);
  x.lineWidth = 4; x.lineCap = "round"; x.strokeStyle = "#111";
  ["#111", "#ef4444", "#22c55e", "#3b82f6", "#eab308"].forEach((col) => {
    const k = el('<button aria-label="Color" style="width:36px;height:36px;padding:0;border-radius:50%;border:2px solid #fff;background:' + col + '"></button>');
    k.addEventListener("click", () => { x.strokeStyle = col; });
    $("#pcol").append(k);
  });
  let on = false;
  const pt = (e) => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * 360 / r.width, (e.clientY - r.top) * 440 / r.height]; };
  c.addEventListener("pointerdown", (e) => { on = true; const [a, b2] = pt(e); x.beginPath(); x.moveTo(a, b2); });
  c.addEventListener("pointermove", (e) => { if (!on) return; const [a, b2] = pt(e); x.lineTo(a, b2); x.stroke(); });
  ["pointerup", "pointerleave"].forEach((n) => c.addEventListener(n, () => { on = false; }));
  $("#pclr").addEventListener("click", () => { x.fillStyle = "#fff"; x.fillRect(0, 0, 360, 440); });
  $("#psave").addEventListener("click", () => { photos.unshift(c.toDataURL("image/png")); $("#psave").textContent = "Saved"; });
}

function snakeApp(b) {
  b.innerHTML = '<canvas id="sc" width="300" height="300" style="width:100%;border-radius:16px;background:var(--card)"></canvas><p class="mute" id="ss"></p><div class="row"><button data-d="U">▲</button></div><div class="row"><button data-d="L">◀</button><button data-d="D">▼</button><button data-d="R">▶</button></div>';
  const N = 15, S = 20, x = $("#sc").getContext("2d");
  const V = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
  let sn, dir, food, score, over;
  const spawn = () => { do { food = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; } while (sn.some((s) => s[0] === food[0] && s[1] === food[1])); };
  const reset = () => { sn = [[7, 7], [6, 7], [5, 7]]; dir = V.R; score = 0; over = false; spawn(); };
  const draw = () => {
    x.clearRect(0, 0, 300, 300);
    x.fillStyle = "#ef4444"; x.fillRect(food[0] * S + 2, food[1] * S + 2, S - 4, S - 4);
    x.fillStyle = "#3ddc84"; sn.forEach((s) => x.fillRect(s[0] * S + 1, s[1] * S + 1, S - 2, S - 2));
    $("#ss").textContent = over ? "Game over. Koi bhi button dabao, restart." : "Score: " + score;
  };
  const step = () => {
    if (over) return;
    const h = [sn[0][0] + dir[0], sn[0][1] + dir[1]];
    if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || sn.some((s) => s[0] === h[0] && s[1] === h[1])) { over = true; draw(); return; }
    sn.unshift(h);
    if (h[0] === food[0] && h[1] === food[1]) { score++; spawn(); } else sn.pop();
    draw();
  };
  const turn = (k) => {
    if (over) { reset(); draw(); return; }
    const d = V[k];
    if (d && !(d[0] === -dir[0] && d[1] === -dir[1])) dir = d;
  };
  b.querySelectorAll("[data-d]").forEach((k) => k.addEventListener("click", () => turn(k.dataset.d)));
  const key = (e) => { const m = { ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R" }[e.key]; if (m) { e.preventDefault(); turn(m); } };
  document.addEventListener("keydown", key);
  reset(); draw();
  const id = setInterval(step, 140);
  return () => { clearInterval(id); document.removeEventListener("keydown", key); };
}

function calApp(b) {
  let d = new Date(); d.setDate(1);
  const draw = () => {
    const today = new Date(), first = d.getDay(), days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    let h = '<div class="row"><button id="cp">‹</button><b style="align-self:center;min-width:150px;text-align:center">' + d.toLocaleDateString([], { month: "long", year: "numeric" }) + '</b><button id="cn">›</button></div><div class="keys" style="grid-template-columns:repeat(7,1fr);text-align:center;gap:6px">';
    ["S", "M", "T", "W", "T", "F", "S"].forEach((w) => { h += '<span class="mute">' + w + "</span>"; });
    for (let i = 0; i < first; i++) h += "<span></span>";
    for (let i = 1; i <= days; i++) {
      const t = i === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      h += '<span style="padding:10px 0;border-radius:50%;' + (t ? "background:var(--accent);color:#07210f;font-weight:700" : "") + '">' + i + "</span>";
    }
    b.innerHTML = h + "</div>";
    $("#cp").addEventListener("click", () => { d.setMonth(d.getMonth() - 1); draw(); });
    $("#cn").addEventListener("click", () => { d.setMonth(d.getMonth() + 1); draw(); });
  };
  draw();
}

function musicApp(b) {
  b.innerHTML = '<p class="mute">Apne phone/computer se gaana chuno.</p><input type="file" id="mf" accept="audio/*"><p id="mn"></p><audio id="ma" controls style="width:100%"></audio>';
  let url = null;
  $("#mf").addEventListener("change", (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(f);
    $("#ma").src = url; $("#ma").play().catch(() => {}); $("#mn").textContent = f.name;
  });
  return () => { if (url) URL.revokeObjectURL(url); };
}

(function lockScreen() {
  const l = document.createElement("div");
  l.id = "lock";
  l.innerHTML = '<b id="lt"></b><span id="ld"></span><p>Unlock karne ke liye tap karo</p>';
  document.getElementById("screen").append(l);
  const t = () => {
    const d = new Date();
    document.getElementById("lt").textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.getElementById("ld").textContent = d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
  };
  t(); setInterval(t, 10000);
  l.addEventListener("click", () => { l.style.transform = "translateY(-100%)"; setTimeout(() => l.remove(), 300); });
})();

/* Notch + control centre */
(function controlCenter() {
  const g = (id) => document.getElementById(id);
  const phone = g("phone"), screen = g("screen"), status = g("status");
  const notch = document.createElement("div");
  notch.id = "notch"; phone.append(notch);

  const wrap = document.createElement("div");
  wrap.id = "cc";
  wrap.innerHTML = '<div class="sheet"><div class="tiles"></div><label class="sl">☀️<input type="range" id="br" min="30" max="100" value="100" aria-label="Brightness"></label><label class="sl">🔊<input type="range" id="vo" min="0" max="100" value="100" aria-label="Volume"></label><div class="grab"></div></div>';
  screen.append(wrap);

  const tl = document.createElement("div");
  tl.id = "torch"; tl.hidden = true; tl.textContent = "Torch on hai. Band karne ke liye tap karo.";
  screen.append(tl);

  const defs = [["wifi", "📶", "Wi-Fi"], ["bt", "🔵", "Bluetooth"], ["air", "✈️", "Airplane"], ["torch", "🔦", "Torch"], ["dark", "🌙", "Dark"], ["rot", "🔄", "Rotate"], ["mute", "🔕", "Silent"], ["save", "🔋", "Saver"]];
  const state = {}, btns = {};
  let vol = 1;
  const set = (k, on) => { state[k] = on; btns[k].classList.toggle("on", on); };
  defs.forEach(([k, i, n]) => {
    const b = document.createElement("button");
    b.className = "tile"; b.innerHTML = "<i>" + i + "</i>" + n;
    btns[k] = b; state[k] = false;
    b.addEventListener("click", () => toggle(k));
    wrap.querySelector(".tiles").append(b);
  });

  function toggle(k) {
    const on = !state[k];
    set(k, on);
    if (k === "torch") tl.hidden = !on;
    if (k === "dark") {
      document.body.classList.toggle("light", !on);
      try { localStorage.setItem("theme", on ? "dark" : "light"); } catch (e) {}
    }
    if (k === "mute") document.querySelectorAll("audio,video").forEach((m) => { m.muted = on; });
    if (k === "air" && on) { set("wifi", false); set("bt", false); }
  }
  tl.addEventListener("click", () => toggle("torch"));

  set("wifi", navigator.onLine);
  window.addEventListener("online", () => set("wifi", true));
  window.addEventListener("offline", () => set("wifi", false));

  g("br").addEventListener("input", (e) => { screen.style.filter = "brightness(" + e.target.value / 100 + ")"; });
  g("vo").addEventListener("input", (e) => {
    vol = e.target.value / 100;
    document.querySelectorAll("audio,video").forEach((m) => { m.volume = vol; });
  });
  document.addEventListener("play", (e) => {
    const m = e.target;
    if (m.volume !== undefined) { m.volume = vol; if (state.mute) m.muted = true; }
  }, true);

  const isOpen = () => wrap.classList.contains("open");
  const open = (o) => {
    wrap.classList.toggle("open", o);
    if (o) set("dark", !document.body.classList.contains("light"));
  };
  let y0 = null, swiped = false;
  status.addEventListener("pointerdown", (e) => { y0 = e.clientY; });
  status.addEventListener("pointermove", (e) => { if (y0 !== null && e.clientY - y0 > 25) { open(true); swiped = true; y0 = null; } });
  ["pointerup", "pointercancel"].forEach((n) => status.addEventListener(n, () => { y0 = null; }));
  status.addEventListener("click", () => { if (swiped) { swiped = false; return; } open(!isOpen()); });
  wrap.addEventListener("click", (e) => { if (e.target === wrap) open(false); });
  g("back").addEventListener("click", (e) => { if (isOpen()) { open(false); e.stopImmediatePropagation(); } });
  g("homebtn").addEventListener("click", () => open(false));
})();
