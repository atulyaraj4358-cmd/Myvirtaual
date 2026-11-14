// Cloudflare Worker proxy v2 (free plan). Deploy karke URL browser ke ⚙ Settings mein daalo.
// ALLOW mein aapki GitHub Pages site hai, taaki koi aur is proxy ko use na kar sake.
const ALLOW = "https://atulyaraj4358-cmd.github.io";

const J = (s) => JSON.stringify(s).replace(/</g, "\\u003c");

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

    // Cookies kabhi forward nahi hote (sites ke beech leak na ho)
    const h = new Headers(request.headers);
    ["origin", "referer", "host", "cookie", "x-forwarded-for"].forEach((k) => h.delete(k));
    for (const k of [...h.keys()]) if (k.startsWith("sec-fetch-") || k.startsWith("cf-")) h.delete(k);

    let r;
    try {
      r = await fetch(t.href, {
        method: request.method, headers: h, redirect: "follow",
        body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body
      });
    } catch (e) { return new Response("Site tak nahi pahunch paya", { status: 502, headers: cors }); }

    const out = new Headers(r.headers);
    ["x-frame-options", "content-security-policy", "content-security-policy-report-only", "cross-origin-opener-policy",
     "cross-origin-embedder-policy", "cross-origin-resource-policy", "set-cookie", "content-encoding", "content-length"].forEach((k) => out.delete(k));
    out.set("access-control-allow-origin", "*");
    const res = new Response(r.body, { status: r.status, headers: out });
    if (!(out.get("content-type") || "").includes("text/html")) return res;

    const finalUrl = r.url || t.href;
    const base = u.origin + "/?url=";
    const js = "(function(){var O=" + J(u.origin) + ",B=" + J(base) + ",D=" + J(finalUrl) + ";" +
      "function P(x){location.href=B+encodeURIComponent(x)}" +
      "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.href;" +
      "if(!/^https?:/i.test(h)||h.indexOf(O)===0)return;if(h.split('#')[0]===D.split('#')[0])return;e.preventDefault();P(h);},true);" +
      "document.addEventListener('submit',function(e){var f=e.target;if((f.method||'get').toLowerCase()!=='get')return;e.preventDefault();" +
      "var x=new URL(f.action||D);new FormData(f).forEach(function(v,k){x.searchParams.set(k,v)});P(x.href);},true);})();";
    const inject = '<base href="' + finalUrl.replace(/"/g, "%22") + '"><script>' + js + "<\/script>";
    return new HTMLRewriter().on("head", { element(el) { el.prepend(inject, { html: true }); } }).transform(res);
  }
};
