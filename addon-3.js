/* addon-3.js: (1) app icons ab real images hain (colored SVG images), (2) saara Hinglish text English mein. */
(function () {
  /* ---------- 1. English text ---------- */
  const D = [
    ["Koi recent app nahi.", "No recent apps."], ["Yahan likho...", "Write here..."],
    ["Is browser mein camera support nahi hai.", "This browser does not support the camera."],
    ["Camera ki permission nahi mili. Browser settings mein allow karo.", "Camera permission denied. Allow it in your browser settings."],
    ["Photo Gallery mein save hui.", "Photo saved to Gallery."], ["Abhi koi photo nahi. Camera se photo lo.", "No photos yet. Take one with the Camera."],
    ["Kuch websites yahan nahi khulti, unki security ki wajah se.", "Some websites cannot open here because of their security settings."],
    ["Apne phone/computer se gaana chuno.", "Choose a song from your phone or computer."],
    ["Game over. Koi bhi button dabao, restart.", "Game over. Press any button to restart."],
    ["Unlock karne ke liye tap karo", "Tap to unlock"], ["Torch on hai. Band karne ke liye tap karo.", "Torch is on. Tap to turn it off."],
    ["Link daalo, video chalao", "Paste a link and play videos"], ["Koi bhi jagah search karo", "Search any place"],
    ["Kisi bhi sheher ka mausam", "Weather for any city"], ["Live hawa ka map", "Live wind map"],
    ["Khali dikhe toh ", "If it looks blank, "], ["browser mein kholo", "open in browser"],
    ["YouTube link ya video ID", "YouTube link or video ID"], ["Video ka link paste karo. YouTube search yahan available nahi hai.", "Paste a video link. YouTube search is not available here."],
    ["Link sahi nahi hai.", "That link is not valid."], ["Jagah ya address search karo", "Search a place or address"],
    ["Sheher ka naam", "City name"], ["Meri location", "My location"], ["Load ho raha hai...", "Loading..."],
    [" · Saaf aasman", " · Clear sky"], [" · Badal", " · Cloudy"], [" · Kohra", " · Fog"], [" · Baarish", " · Rain"], [" · Barf", " · Snow"], [" · Fuhaar", " · Showers"], [" · Toofan", " · Thunderstorm"],
    ["Mehsoos: ", "Feels like: "], ["Nami: ", "Humidity: "], ["Hawa: ", "Wind: "], ["Aaj: ", "Today: "], ["° se ", "° to "],
    ["Mausam load nahi hua. Internet check karo.", "Could not load weather. Check your internet."], ["Dhoondh raha hoon...", "Searching..."],
    ["Sheher nahi mila.", "City not found."], ["Search nahi ho paya. Internet check karo.", "Search failed. Check your internet."],
    ["Location support nahi hai.", "Location is not supported."], ["Location ki permission nahi mili.", "Location permission denied."],
    ["Naya app ka naam", "New app name"], ["Website link, jaise example.com", "Website link, e.g. example.com"],
    ["Naam aur link dono daalo.", "Enter both a name and a link."], ["Home screen par add ho gaya.", "Added to the home screen."],
    ["Naye apps aaye hain. Tap karke dekho.", "New apps are available. Tap to view."], ["Naye apps install karo", "Install new apps"],
    ["Photo lo, Gallery mein dekho", "Take a photo and see it in Gallery"], ["Drawing banao aur save karo", "Draw something and save it"],
    ["Search ya website address", "Search or enter a website address"], ["Upar search ya website address likho.", "Type a search or website address above."],
    ["Khali ya refuse dikhe toh ", "If blank or refused, tap "], [" dabake Reader view lo.", " for Reader view."],
    ["Reader view (r.jina.ai se). Links yahin khulte hain, 👁 se asli Page view try karo.", "Reader view (via r.jina.ai). Links open here; tap 👁 to try the real Page view."],
    ["Ye page reader mein load nahi hua. 👁 se Page view try karo ya ↗ dabao.", "This page could not be loaded in Reader view. Try Page view with 👁 or open it with ↗."],
    ["Search ho raha hai...", "Searching..."], ["Search results r.jina.ai (third-party) se aate hain.", "Search results come from r.jina.ai (third-party)."],
    ["Results nahi mile. ⚙ mein Google ya Wikipedia engine try karo.", "No results found. Try the Google or Wikipedia engine in ⚙."],
    ["Search load nahi hua. Internet check karo ya ⚙ mein dusra engine chuno.", "Search failed. Check your internet or pick another engine in ⚙."],
    ["Pehle koi website kholo.", "Open a website first."], ["Proxy save ho gaya.", "Proxy saved."], ["Proxy hata diya.", "Proxy removed."],
    ["Websites default", "Default for websites"], ["Proxy (optional, sirf Page view ke liye)", "Proxy (optional, Page view only)"]
  ].sort((a, b) => b[0].length - a[0].length);
  const tr = (s) => { if (typeof s !== "string" || s.length < 3) return s; for (const [a, b] of D) if (s.includes(a)) s = s.split(a).join(b); return s; };

  const wrapSet = (proto, prop) => {
    const d = Object.getOwnPropertyDescriptor(proto, prop);
    if (d && d.set) Object.defineProperty(proto, prop, { get: d.get, set(v) { d.set.call(this, typeof v === "string" ? tr(v) : v); }, configurable: true, enumerable: d.enumerable });
  };
  wrapSet(Node.prototype, "textContent");
  wrapSet(Element.prototype, "innerHTML");
  wrapSet(HTMLInputElement.prototype, "placeholder");
  ["append", "prepend"].forEach((m) => { const o = Element.prototype[m]; Element.prototype[m] = function (...a) { return o.apply(this, a.map((x) => (typeof x === "string" ? tr(x) : x))); }; });
  document.documentElement.lang = "en";
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), list = [];
  while (w.nextNode()) if (!/^(SCRIPT|STYLE|TEXTAREA)$/i.test(w.currentNode.parentNode.nodeName)) list.push(w.currentNode);
  list.forEach((n) => { n.nodeValue = tr(n.nodeValue); });
  document.querySelectorAll("[placeholder],[aria-label],[title]").forEach((e) => ["placeholder", "aria-label", "title"].forEach((a) => { if (e.hasAttribute(a)) e.setAttribute(a, tr(e.getAttribute(a))); }));

  /* ---------- 2. Image icons ---------- */
  const GL = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    gallery: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
    browser: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    settings: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    paint: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><path d="M8 11h.01M12 7.5h.01M16 11h.01"/>',
    snake: '<rect x="3" y="8" width="18" height="10" rx="5"/><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01"/>',
    cal: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    store: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    yt: '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="M10 9.5v5l4.5-2.5z"/>',
    maps: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    wx: '<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.5-1A4.5 4.5 0 0 1 17 18z"/>',
    wiki: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
    dict: '<path d="M12 6c-2-2-5-2-8-1v13c3-1 6-1 8 1 2-2 5-2 8-1V5c-3-1-6-1-8 1z"/><path d="M12 6v13"/>',
    photopea: '<path d="M14 4l6 6-8 8H6v-6z"/><path d="M5 20h6"/>',
    draw: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
    meet: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
    windy: '<path d="M3 8h10a3 3 0 1 0-3-3"/><path d="M3 13h15a3 3 0 1 1-3 3"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>'
  };
  const DIAL = { Google: ["search", "#2563eb"], Wikipedia: ["wiki", "#475569"], Dictionary: ["dict", "#7c3aed"], Photopea: ["photopea", "#0f766e"], Excalidraw: ["draw", "#6366f1"], Meet: ["meet", "#0891b2"] };
  const cache = {};
  const art = (g, bg) => {
    const k = g + bg;
    if (!cache[k]) {
      const s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="' + bg + '"/><rect width="64" height="64" rx="16" fill="url(#h)"/><g transform="translate(14 14) scale(1.5)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + g + "</g></svg>";
      cache[k] = "data:image/svg+xml;utf8," + encodeURIComponent(s);
    }
    return cache[k];
  };
  const iconFor = (name) => {
    if (!name) return null;
    name = name.trim();
    const a = apps.find((x) => x.name === name);
    if (a) return art(GL[a.id.replace(/^i_/, "")] || GL.browser, a.bg);
    const d = DIAL[name];
    return d ? art(GL[d[0]], d[1]) : null;
  };
  const mkImg = (src) => { const m = document.createElement("img"); m.src = src; m.alt = ""; m.className = "aimg"; m.draggable = false; return m; };
  const swap = (el, name) => {
    if (!el || el.dataset.ai) return;
    const s = iconFor(name); if (!s) return;
    el.dataset.ai = "1"; el.textContent = ""; el.append(mkImg(s)); el.classList.add("hasimg");
  };
  const own = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join("").trim();
  function scan(root) {
    root.querySelectorAll("button.icon").forEach((b) => swap(b.querySelector("i"), b.getAttribute("aria-label") || own(b)));
    root.querySelectorAll(".scard").forEach((r) => { const n = r.querySelector("b"); swap(r.querySelector("i"), n && n.textContent); });
    root.querySelectorAll(".dials .tile").forEach((t) => swap(t.querySelector("i"), own(t)));
    root.querySelectorAll(".nc,.hu").forEach((c) => { const n = c.querySelector("b"); swap(c.querySelector("span"), n && n.textContent); });
    root.querySelectorAll("#recents .card").forEach((c) => {
      if (c.dataset.ai) return;
      const s = iconFor(c.textContent); if (!s) return;
      c.dataset.ai = "1"; const m = mkImg(s); m.className = "aimg rimg";
      const old = c.querySelector("svg.ic"); if (old) old.replaceWith(m); else c.prepend(m);
    });
  }
  const st = document.createElement("style");
  st.textContent = ".hasimg{background:none!important;overflow:hidden;padding:0}.hasimg .aimg{width:100%;height:100%;display:block;border-radius:inherit;pointer-events:none}.dials .tile i.hasimg{width:44px;height:44px;display:block}.nc span.hasimg,.hu span.hasimg{width:34px;height:34px;display:block;flex:none}.rimg{width:28px!important;height:28px!important;border-radius:8px;vertical-align:middle;margin-right:8px;display:inline-block!important}";
  document.head.append(st);
  const phone = document.getElementById("phone");
  if (!phone) return;
  const CFG = { childList: true, subtree: true };
  const obs = new MutationObserver(() => { obs.disconnect(); scan(phone); obs.observe(phone, CFG); });
  scan(phone); obs.observe(phone, CFG);
})();
