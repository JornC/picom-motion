// Videos load and play while they are on screen, and not at all with reduced motion.
const videos = [...document.querySelectorAll("video")];

// A video whose files are missing is hidden, so its frame shows which file it waits for.
for (const v of videos) {
	const sources = v.querySelectorAll("source");
	const last = sources[sources.length - 1];
	if (last) last.addEventListener("error", () => { v.style.visibility = "hidden"; });
}

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
	for (const v of videos) {
		v.removeAttribute("autoplay");
		v.pause();
		v.controls = true;
	}
} else {
	const playWhenVisible = new IntersectionObserver((entries) => {
		for (const e of entries) {
			if (e.isIntersecting) e.target.play().catch(() => {});
			else e.target.pause();
		}
	});
	for (const v of videos) playWhenVisible.observe(v);
}

// A link's #part finds its section whatever its case: #Styles goes to id="styles". The web font can
// arrive after the browser scrolled there and push the section down, so once the fonts and the page
// are in, go there again, unless the reader has moved since.
function hashTarget() {
	const want = decodeURIComponent(location.hash.slice(1));
	if (!want) return null;
	return document.getElementById(want)
		|| [...document.querySelectorAll("[id]")].find((e) => e.id.toLowerCase() === want.toLowerCase());
}
function toHash() {
	const el = hashTarget();
	if (el) el.scrollIntoView();
}
let readerMoved = false;
for (const type of ["wheel", "touchstart", "keydown", "mousedown"]) {
	addEventListener(type, () => { readerMoved = true; }, { once: true, passive: true });
}
addEventListener("hashchange", toHash);
if (location.hash) {
	toHash();
	const loaded = new Promise((done) => addEventListener("load", done, { once: true }));
	// Instant, so a page that didn't move doesn't slide again.
	Promise.all([document.fonts.ready, loaded]).then(() => { if (!readerMoved) hashTarget()?.scrollIntoView({ behavior: "instant" }); });
}
