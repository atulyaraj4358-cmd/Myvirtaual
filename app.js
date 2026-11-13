const $ = (s) => document.querySelector(s);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const photos = [];
let cleanup = null, recent = [];

const apps = [
  { id: "clock", name: "Clock", icon: "🕒", bg: "#4f8cff", open: clockApp },
  { id: "calc", name: "Calculator", icon: "🧮", bg: "#f59e0b", open: calcApp },
  { id: "notes", name: "Notes", icon: "📝", bg: "#eab308", open: notesApp },
  { id: "camera", name: "Camera", icon: "📷", bg: "#ef4444", open: cameraApp },
  { id: "gallery", name: "Gallery", icon: "🖼️", bg: "#a855f7", open: galleryApp },
  { id: "browser", name: "Browser", icon: "🌐", bg: "#0ea5e9", open: browserApp },
  { id: "settings", name: "Settings", icon: "⚙️", bg: "#64748b", open: settingsApp }
];

function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }

/* ---------- shell ---------- */
function buildHome() {
  const h = $("#home");
  h.innerHTML = "";
  h.append(el('<div class="widget"><b id="wt"></b><span id="wd"></span></div>'));
  apps.forEach((a) => {
    const b = el(`<button class="icon"><i style="background:${a.bg}">${a.icon}</i>${a.name}</button>`);
    b.addEventListener("click", () => openApp(a.id));
    h.append(b);
  });
}
function openApp(id) {
  closeApp();
  const a = apps.find((x) => x.id === id);
  recent = [id, ...recent.filter((x) => x !== id)].slice(0, 6);
  const box = $("#app");
  box.innerHTML = "";
  box.append(el(`<div class="appbar">${a.name}</div>`));
  const body = el('<div class="body"></div>');
  box.append(body);
  box.hidden = false;
  $("#recents").hidden = true;
  cleanup = a.open(body) || null;
}
function closeApp() {
  if (cleanup) { cleanup(); cleanup = null; }
  $("#app").hidden = true;
  $("#app").innerHTML = "";
}
function showRecents() {
  const r = $("#recents");
  if (!r.hidden) { r.hidden = true; return; }
  r.innerHTML = "";
  if (!recent.length) r.append(el('<p class="mute">Koi recent app nahi.</p>'));
  recent.forEach((id) => {
    const a = apps.find((x) => x.id === id);
    const c = el(`<button class="card">${a.icon} ${a.name}</button>`);
    c.addEventListener("click", () => openApp(id));
    r.append(c);
  });
  r.hidden = false;
}
$("#homebtn").addEventListener("click", () => { closeApp(); $("#recents").hidden = true; });
$("#back").addEventListener("click", () => {
  if (!$("#recents").hidden) $("#recents").hidden = true;
  else closeApp();
});
$("#rec").addEventListener("click", showRecents);

function tick() {
  const d = new Date();
  const t = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  $("#clock").textContent = t;
  $("#wt").textContent = t;
  $("#wd").textContent = d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
}
setInterval(tick, 10000);
if (navigator.getBattery) {
  navigator.getBattery().then((b) => {
    const u = () => { $("#batt").textContent = Math.round(b.level * 100) + "%"; };
    u(); b.addEventListener("levelchange", u);
  }).catch(() => {});
}

/* ---------- apps ---------- */
function clockApp(b) {
  b.innerHTML = '<div class="big" id="ct"></div><div class="mid" id="sw">00:00.0</div><div class="row"><button id="s1">Start</button><button id="s2">Reset</button></div>';
  let acc = 0, t0 = 0, run = false;
  const fmt = (ms) => { const s = ms / 1000; return String(Math.floor(s / 60)).padStart(2, "0") + ":" + (s % 60).toFixed(1).padStart(4, "0"); };
  const draw = () => {
    $("#ct").textContent = new Date().toLocaleTimeString();
    $("#sw").textContent = fmt(acc + (run ? Date.now() - t0 : 0));
  };
  const id = setInterval(draw, 100); draw();
  $("#s1").addEventListener("click", () => {
    if (run) { acc += Date.now() - t0; run = false; $("#s1").textContent = "Start"; $("#s1").classList.remove("on"); }
    else { t0 = Date.now(); run = true; $("#s1").textContent = "Stop"; $("#s1").classList.add("on"); }
  });
  $("#s2").addEventListener("click", () => { acc = 0; t0 = Date.now(); draw(); });
  return () => clearInterval(id);
}

function calcApp(b) {
  b.innerHTML = '<div id="disp">0</div><div class="keys"></div>';
  const keys = ["C", "⌫", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "="];
  let e = "";
  const disp = $("#disp");
  const show = () => { disp.textContent = e || "0"; };
  const calc = () => {
    const x = e.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-").replace(/%/g, "/100");
    if (!/^[0-9+\-*/.() ]+$/.test(x)) return;
    try {
      const r = Function('"use strict";return (' + x + ")")();
      e = Number.isFinite(r) ? String(Math.round(r * 1e10) / 1e10) : "Error";
    } catch (err) { e = "Error"; }
  };
  keys.forEach((k) => {
    const btn = el(`<button class="${"÷×−+=".includes(k) ? "op" : ""} ${k === "0" ? "z" : ""}">${k}</button>`);
    btn.addEventListener("click", () => {
      if (e === "Error") e = "";
      if (k === "C") e = "";
      else if (k === "⌫") e = e.slice(0, -1);
      else if (k === "=") calc();
      else e += k;
      show();
    });
    b.querySelector(".keys").append(btn);
  });
}

function notesApp(b) {
  b.innerHTML = '<textarea id="n" placeholder="Yahan likho..."></textarea>';
  const n = $("#n");
  n.value = store.get("notes", "");
  n.addEventListener("input", () => store.set("notes", n.value));
}

function cameraApp(b) {
  b.innerHTML = '<video autoplay playsinline muted></video><div class="row"><button id="snap">Take photo</button></div><p class="mute" id="cm"></p>';
  const v = b.querySelector("video");
  let stream = null;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    $("#cm").textContent = "Is browser mein camera support nahi hai.";
  } else {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => { stream = s; v.srcObject = s; })
      .catch(() => { $("#cm").textContent = "Camera ki permission nahi mili. Browser settings mein allow karo."; });
  }
  $("#snap").addEventListener("click", () => {
    if (!v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    photos.unshift(c.toDataURL("image/jpeg", 0.85));
    $("#cm").textContent = "Photo Gallery mein save hui.";
  });
  return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
}

function galleryApp(b) {
  if (!photos.length) { b.innerHTML = '<p class="mute">Abhi koi photo nahi. Camera se photo lo.</p>'; return; }
  b.innerHTML = '<div class="grid"></div>';
  photos.forEach((p) => { const a = document.createElement("a"); a.href = p; a.download = "photo.png"; a.innerHTML = '<img alt="Photo" src="' + p + '">'; b.firstChild.append(a); });
}

function browserApp(b) {
  b.innerHTML = '<form><input type="text" id="u" value="https://en.m.wikipedia.org" aria-label="Address"><button class="pill">Go</button></form><iframe id="f" title="Browser" src="https://en.m.wikipedia.org"></iframe><p class="mute">Kuch websites yahan nahi khulti, unki security ki wajah se.</p>';
  b.querySelector("form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    let u = $("#u").value.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    $("#f").src = u;
  });
}

function settingsApp(b) {
  b.innerHTML = '<button class="card" id="th"></button><p class="mute">Wallpaper</p><div class="row"><button data-w="0">Blue</button><button data-w="1">Purple</button><button data-w="2">Green</button></div>';
  const th = $("#th");
  const label = () => { th.textContent = "Theme: " + (document.body.classList.contains("light") ? "Light" : "Dark"); };
  label();
  th.addEventListener("click", () => {
    document.body.classList.toggle("light");
    store.set("theme", document.body.classList.contains("light") ? "light" : "dark");
    label();
  });
  b.querySelectorAll("[data-w]").forEach((x) => x.addEventListener("click", () => {
    $("#screen").dataset.wp = x.dataset.w; store.set("wp", x.dataset.w);
  }));
}

/* ---------- start ---------- */
if (store.get("theme", "dark") === "light") document.body.classList.add("light");
$("#screen").dataset.wp = store.get("wp", "0");
if (window.extraApps) apps.push(...window.extraApps);
buildHome();
tick();
// Android Haptic Feedback & Ripple Effect
document.addEventListener('pointerdown', function(e) {
    const target = e.target.closest('.icon, .btn, .card, button, .pill');
    if (!target) return;
    
    // 1. Phone Vibrate (Haptic)
    if (navigator.vibrate) navigator.vibrate(15);

    // 2. Ripple Effect
    const circle = document.createElement('span');
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = target.querySelector('.ripple');
    if (ripple) ripple.remove();
    
    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(circle);
    
    setTimeout(() => circle.remove(), 600);
});
