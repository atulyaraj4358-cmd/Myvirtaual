// Cloudflare Worker proxy (free plan). Deploy karke URL browser ke ⚙ Settings mein daalo.
// Sirf apne istemal ke liye. ALLOW mein apni GitHub Pages site daalo taaki koi aur use na kare.
const ALLOW = ""; // jaise "https://atulyaraj4358-cmd.github.io"

export default {
  async fetch(request) {
    const u = new URL(request.url);
    const cors = { "access-control-allow-origin": "*" };
    const ref = request.headers.get("referer") || "";
    if (ALLOW && !(ref.startsWith(ALLOW) || ref.startsWith(u.origin))) return new Response("Forbidden", { status: 403 });
    let target = u.searchParams.get("url");
    if (!target) return new Response("Use ?url=https://example.com", { status: 400, headers: cors });
    if (!/^https?:\/\//i.test(target)) target = "https://" + target;
    let t;
    try { t = new URL(target); } catch (e) { return new Response("Bad url", { status: 400, headers: cors }); }

    const h = new Headers(request.headers);
    ["origin", "referer", "host", "cf-connecting-ip", "x-forwarded-for"].forEach((k) => h.delete(k));
    const r = await fetch(t.href, {
      method: request.method, headers: h, redirect: "follow",
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body
    });

    const out = new Headers(r.headers);
    ["x-frame-options", "content-security-policy", "content-security-policy-report-only", "content-encoding", "content-length"].forEach((k) => out.delete(k));
    out.set("access-control-allow-origin", "*");
    const res = new Response(r.body, { status: r.status, headers: out });
    if (!(out.get("content-type") || "").includes("text/html")) return res;

    const base = u.origin + "/?url=";
    const inject = '<base href="' + t.href + '"><script>' +
      "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.href;if(/^https?:/i.test(h)&&h.indexOf('" + u.origin + "')!==0){e.preventDefault();location.href='" + base + "'+encodeURIComponent(h);}},true);" +
      "document.addEventListener('submit',function(e){var f=e.target;if((f.method||'get').toLowerCase()!=='get')return;e.preventDefault();var x=new URL(f.action||'" + t.href + "');new FormData(f).forEach(function(v,k){x.searchParams.set(k,v)});location.href='" + base + "'+encodeURIComponent(x.href);},true);" +
      "<\/script>";
    return new HTMLRewriter().on("head", { element(el) { el.prepend(inject, { html: true }); } }).transform(res);
  }
};
