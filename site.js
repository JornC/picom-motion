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
