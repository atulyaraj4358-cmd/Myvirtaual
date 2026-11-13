/* Atulya Store + real apps. Loaded after extras.js, before app.js */
(function () {
  const sget = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const sset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const mk = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt !== undefined) e.textContent = txt; return e; };
  const norm = (u) => { u = u.trim(); return /^https?:\/\//i.test(u) ? u : "https://" + u; };
  let inst = sget("inst", ["yt", "maps", "wx"]), custom = sget("custom", []);

  function webApp(b, url) {
    const f = document.createElement("iframe");
    f.title = "App"; f.allow = "camera; microphone; geolocation; fullscreen; clipboard-write; autoplay"; f.src = url;
    const p = mk("p", "mute", "Khali dikhe toh ");
    const a = mk("a", null, "browser mein kholo");
    a.href = url; a.target = "_blank"; a.rel = "noopener"; a.style.color = "var(--accent)";
    p.append(a, ".");
    b.style.padding = "0 10px 10px"; b.append(f, p);
  }

  function ytApp(b) {
    b.innerHTML = '<form><input type="text" id="yl" placeholder="YouTube link ya video ID" aria-label="YouTube link"><button class="pill">Play</button></form><div id="yv"></div><p class="mute" id="ym">Video ka link paste karo. YouTube search yahan available nahi hai.</p>';
    b.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = b.querySelector("#yl").value.trim();
      const m = v.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || v.match(/^([\w-]{11})$/);
      const box = b.querySelector("#yv"); box.innerHTML = "";
      if (!m) { b.querySelector("#ym").textContent = "Link sahi nahi hai."; return; }
      const f = document.createElement("iframe");
      f.title = "Video"; f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true;
      f.style.aspectRatio = "16/9"; f.style.flex = "none";
      f.src = "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&playsinline=1";
      box.append(f); b.querySelector("#ym").textContent = "";
    });
  }

  function mapsApp(b) {
    b.innerHTML = '<form><input type="text" id="mq" placeholder="Jagah ya address search karo" aria-label="Search place"><button class="pill">Go</button></form><iframe id="mf2" title="Maps"></iframe>';
    const f = b.querySelector("#mf2");
    const go = (q) => { f.src = "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed"; };
    go("India");
    b.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); const q = b.querySelector("#mq").value.trim(); if (q) go(q); });
  }

  function weatherApp(b) {
    b.innerHTML = '<form><input type="text" id="wc" placeholder="Sheher ka naam" aria-label="City"><button class="pill">Go</button></form><button class="card" id="wl">📍 Meri location</button><div id="wr"></div>';
    const out = b.querySelector("#wr");
    const WX = (c) => c === 0 ? ["☀️", "Saaf aasman"] : c <= 3 ? ["⛅", "Badal"] : c <= 48 ? ["🌫️", "Kohra"] : c <= 67 ? ["🌧️", "Baarish"] : c <= 77 ? ["❄️", "Barf"] : c <= 82 ? ["🌦️", "Fuhaar"] : ["⛈️", "Toofan"];
    const show = async (lat, lon, name) => {
      out.textContent = "Load ho raha hai...";
      try {
        const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto");
        const d = await r.json(), c = d.current, w = WX(c.weather_code);
        out.innerHTML = "";
        const big = mk("div", "big", w[0] + " " + Math.round(c.temperature_2m) + "°");
        const t = mk("div", "mid", name + " · " + w[1]); t.style.fontSize = "22px";
        const info = mk("p", "mute", "Mehsoos: " + Math.round(c.apparent_temperature) + "° · Nami: " + c.relative_humidity_2m + "% · Hawa: " + c.wind_speed_10m + " km/h · Aaj: " + Math.round(d.daily.temperature_2m_min[0]) + "° se " + Math.round(d.daily.temperature_2m_max[0]) + "°");
        info.style.textAlign = "center";
        out.append(big, t, info);
      } catch (e) { out.textContent = "Mausam load nahi hua. Internet check karo."; }
    };
    b.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const q = b.querySelector("#wc").value.trim(); if (!q) return;
      out.textContent = "Dhoondh raha hoon...";
      try {
        const r = await fetch("https://geocoding-api.open-meteo.com/v1/search?count=1&name=" + encodeURIComponent(q));
        const d = await r.json();
        if (!d.results || !d.results.length) { out.textContent = "Sheher nahi mila."; return; }
        show(d.results[0].latitude, d.results[0].longitude, d.results[0].name);
      } catch (err) { out.textContent = "Search nahi ho paya. Internet check karo."; }
    });
    b.querySelector("#wl").addEventListener("click", () => {
      if (!navigator.geolocation) { out.textContent = "Location support nahi hai."; return; }
      navigator.geolocation.getCurrentPosition((p) => show(p.coords.latitude, p.coords.longitude, "Meri location"), () => { out.textContent = "Location ki permission nahi mili."; });
    });
  }

  const CAT = [
    { id: "yt", name: "YouTube", icon: "▶️", bg: "#dc2626", d: "Link daalo, video chalao", open: ytApp },
    { id: "maps", name: "Maps", icon: "🗺️", bg: "#16a34a", d: "Koi bhi jagah search karo", open: mapsApp },
    { id: "wx", name: "Weather", icon: "⛅", bg: "#0284c7", d: "Kisi bhi sheher ka mausam", open: weatherApp },
    { id: "wiki", name: "Wikipedia", icon: "📚", bg: "#475569", d: "Encyclopedia", url: "https://en.m.wikipedia.org" },
    { id: "dict", name: "Dictionary", icon: "📖", bg: "#7c3aed", d: "Wiktionary", url: "https://en.m.wiktionary.org" },
    { id: "photopea", name: "Photopea", icon: "🖌️", bg: "#0f766e", d: "Photo editor", url: "https://www.photopea.com" },
    { id: "draw", name: "Excalidraw", icon: "✏️", bg: "#6366f1", d: "Whiteboard", url: "https://excalidraw.com" },
    { id: "meet", name: "Meet", icon: "📹", bg: "#0891b2", d: "Video call (Jitsi)", url: "https://meet.jit.si" },
    { id: "windy", name: "Weather Map", icon: "🌪️", bg: "#2563eb", d: "Live hawa ka map", url: "https://embed.windy.com/embed2.html?lat=22&lon=79&zoom=4&level=surface&overlay=wind" }
  ];

  const toApp = (it) => ({ id: "i_" + it.id, name: it.name, icon: it.icon, bg: it.bg, open: it.open || ((b) => webApp(b, it.url)) });
  const installed = () => [...CAT.filter((c) => inst.includes(c.id)), ...custom].map(toApp);
  function refresh() {
    for (let i = apps.length - 1; i >= 0; i--) if (apps[i].id.startsWith("i_")) apps.splice(i, 1);
    apps.push(...installed());
    buildHome(); tick();
  }

  function storeApp(b) {
    b.innerHTML = '<form style="flex-direction:column"><input type="text" id="cn" placeholder="Naya app ka naam" aria-label="App name"><input type="text" id="cu" placeholder="Website link, jaise example.com" aria-label="Website link"><button class="pill">Add custom app</button></form><p class="mute" id="sm"></p><div id="sl" style="display:grid;gap:10px"></div>';
    const list = b.querySelector("#sl");
    const draw = () => {
      list.innerHTML = "";
      [...CAT, ...custom].forEach((it) => {
        const on = it.custom || inst.includes(it.id);
        const row = mk("div", "scard");
        const i = mk("i", null, it.icon); i.style.background = it.bg;
        const d = mk("div"); d.append(mk("b", null, it.name), mk("small", null, it.d || it.url));
        const btn = mk("button", on ? "rm" : "", on ? "Remove" : "Install");
        btn.addEventListener("click", () => {
          if (it.custom) { custom = custom.filter((x) => x.id !== it.id); sset("custom", custom); }
          else { inst = on ? inst.filter((x) => x !== it.id) : [...inst, it.id]; sset("inst", inst); }
          refresh(); draw();
        });
        row.append(i, d, btn); list.append(row);
      });
    };
    b.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const n = b.querySelector("#cn").value.trim(), u = b.querySelector("#cu").value.trim();
      if (!n || !u) { b.querySelector("#sm").textContent = "Naam aur link dono daalo."; return; }
      custom.push({ id: "c" + Date.now(), name: n, url: norm(u), icon: "🌐", bg: "#475569", custom: true });
      sset("custom", custom); refresh(); draw();
      b.querySelector("#cn").value = ""; b.querySelector("#cu").value = "";
      b.querySelector("#sm").textContent = "Home screen par add ho gaya.";
    });
    draw();
  }

  window.extraApps.unshift({ id: "store", name: "Atulya Store", icon: "🛍️", bg: "#f43f5e", open: storeApp });
  window.extraApps.push(...installed());
})();
