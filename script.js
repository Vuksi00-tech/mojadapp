(() => {
  const c = window.DATE_APP_SETTINGS || {};
  const $ = id => document.getElementById(id);
  const set = (id, value) => { if (value != null) $(id).textContent = value; };
  const escapeHtml = s => String(s).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  document.title = "Jedno važno pitanje 💌";
  ["eyebrow","tagline","intro","yesButton","noButton","initialReaction","successTitle","dateIntro","dateLabel","timeLabel","planLabel","noteLabel","notePlaceholder","confirmButton","whatsappHint","musicTitle","musicIntro","musicEmpty","outfitTitle","outfitIntro","outfitByline","outfitText","closingText"].forEach(k => {
    const ids = {yesButton:"yesBtn",noButton:"noBtn",initialReaction:"reaction",notePlaceholder:"note",confirmButton:"confirmBtn",whatsappHint:"whatsappHint",musicEmpty:"musicPlayer"};
    set(ids[k] || k, c[k]);
  });
  $("headline").innerHTML = `Hej, <span>${escapeHtml(c.herName && c.herName !== "IME_NJEZINO" ? c.herName : (c.headlineFallback || "ljepotice"))}</span>${c.headlineAfter || "…<br>imaš li planove sa mnom? 🌷"}`;
  const labels = {dateLabel:"dateLabel",timeLabel:"timeLabel",planLabel:"planLabel",noteLabel:"noteLabel"};
  Object.keys(labels).forEach(k => set(labels[k], c[k]));
  // Re-label visible form labels via matching IDs.
  document.querySelector('label[for="date"]').textContent = c.dateLabel || "Koji datum ti paše?";
  document.querySelector('label[for="time"]').textContent = c.timeLabel || "A vrijeme?";
  document.querySelector('label[for="plan"]').textContent = c.planLabel || "Što bi ti se radilo?";
  document.querySelector('label[for="note"]').textContent = c.noteLabel || "Posebna želja (nije obavezno)";
  $("note").placeholder = c.notePlaceholder || "";

  const no = $("noBtn"), stage = $("buttonStage");
  let attempts = 0;
  function dodge() {
    if (attempts >= 3) return;
    attempts++;
    $("reaction").textContent = (c.noMessages || [])[attempts - 1] || "Još jedan pokušaj… 😏";
    if (attempts >= 3) {
      no.classList.add("hidden");
      $("reaction").textContent = c.finalNoReaction || "Ostaje samo DA. 💗";
      return;
    }
    no.style.left = `${Math.round(Math.random() * Math.max(0, stage.clientWidth - no.offsetWidth))}px`;
    no.style.top = `${Math.round(Math.random() * Math.max(0, stage.clientHeight - no.offsetHeight))}px`;
  }
  no.addEventListener("click", dodge);
  no.addEventListener("pointerenter", e => { if (e.pointerType === "mouse" && attempts < 3) dodge(); });
  $("yesBtn").addEventListener("click", () => {
    $("datePanel").classList.remove("hidden");
    $("reaction").textContent = c.afterYesReaction || "Odličan izbor! ❤️";
    $("datePanel").scrollIntoView({behavior:"smooth",block:"start"});
  });

  const today = new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
  $("date").min = today;
  function videoId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || ((u.pathname.match(/\/embed\/([^/]+)/)||[])[1] || "");
    } catch (_) {}
    return "";
  }
  const id = videoId(c.youtubeUrl || "");
  if (id) {
    const frame = document.createElement("iframe");
    frame.className = "player"; frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    frame.title = "Naša pjesma na YouTubeu";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    $("musicPlayer").replaceWith(frame);
    $("openSong").href = c.youtubeUrl; $("openSong").classList.remove("hidden");
  }

  $("dateForm").addEventListener("submit", event => {
    event.preventDefault();
    const status = $("formStatus");
    const number = String(c.whatsappNumber || "").replace(/\D/g, "");
    if (!number || number.includes("X") || number.length < 8) {
      status.textContent = "Prvo upiši svoj WhatsApp broj u settings.js (whatsappNumber), bez +, razmaka i početne nule.";
      return;
    }
    const date = $("date").value, time = $("time").value;
    if (!date || !time) { status.textContent = "Odaberi datum i vrijeme pa nastavi. 💌"; return; }
    const [y,m,d] = date.split("-");
    const note = $("note").value.trim();
    const lines = [
      `Hej ${c.yourName || "ti"}! 💌`, "",
      c.whatsappGreeting || "Prihvaćeno — imamo dejt! ❤️",
      `📅 ${c.whatsappDateLabel || "Datum"}: ${d}.${m}.${y}.`,
      `🕒 ${c.whatsappTimeLabel || "Vrijeme"}: ${time}`,
      `✨ ${c.whatsappPlanLabel || "Plan"}: ${$("plan").value}`,
      note ? `💭 ${c.whatsappNoteLabel || "Posebna želja"}: ${note}` : "",
      "", c.whatsappClosing || "E, sad već pričamo o nečemu! 😉"
    ].filter(Boolean);
    status.textContent = "Otvaram WhatsApp s pripremljenom porukom…";
    window.location.href = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
  });
})();
