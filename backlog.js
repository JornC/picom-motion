// The backlog: sort by a column, filter by goal, status and text, open every row, keep the totals.
(() => {
	const table = document.querySelector(".sheet");
	if (!table) return;
	const tbody = table.tBodies[0];
	// Each change is a row and, right after it, the row its details open into.
	const rows = [...tbody.rows].filter((r) => !r.classList.contains("more"));
	const active = { goal: new Set(), status: new Set() };
	const numeric = new Set(["num", "goal", "status", "outlook", "size"]);
	const search = document.querySelector(".tools input[type=search]");
	let query = "";
	let sortKey = null;
	let sortDir = 1;

	const value = (row, key) => row.querySelector(`td.${key}`).dataset.v;

	function apply() {
		let count = 0;
		let lines = 0;
		for (const row of rows) {
			const show = (!active.goal.size || active.goal.has(row.dataset.goal))
				&& (!active.status.size || active.status.has(row.dataset.status))
				&& (!query || row.dataset.text.includes(query));
			row.hidden = !show;
			row.nextElementSibling.hidden = !show;
			if (show) {
				count++;
				lines += Math.max(0, Number(value(row, "size")));
			}
		}
		document.querySelector('[data-total="rows"]').textContent = count;
		document.querySelector('[data-total="lines"]').textContent = lines.toLocaleString("en");
		for (const group of document.querySelectorAll(".filters")) {
			group.toggleAttribute("data-any", !!group.querySelector('[aria-pressed="true"]'));
		}
	}

	function sortBy(key, th) {
		// Size and outlook start with the largest; the rest start from the top.
		sortDir = key === sortKey ? -sortDir : (key === "size" || key === "outlook" ? -1 : 1);
		sortKey = key;
		const order = (a, b) => Number(value(a, "num")) - Number(value(b, "num"));
		// Rows without a rating or a size go last, whichever way the column sorts.
		const none = (v) => (key === "outlook" && v === "-9") || (key === "size" && v === "-1");
		rows.sort((a, b) => {
			const x = value(a, key);
			const y = value(b, key);
			if (none(x) !== none(y)) return none(x) ? 1 : -1;
			const c = numeric.has(key) ? Number(x) - Number(y) : x.localeCompare(y);
			return c * sortDir || order(a, b);
		});
		tbody.append(...rows.flatMap((r) => [r, r.nextElementSibling]));
		for (const h of table.tHead.rows[0].cells) h.removeAttribute("aria-sort");
		th.setAttribute("aria-sort", sortDir > 0 ? "ascending" : "descending");
	}

	for (const button of table.tHead.querySelectorAll("button[data-sort]")) {
		button.addEventListener("click", () => sortBy(button.dataset.sort, button.closest("th")));
	}
	for (const button of document.querySelectorAll("button[data-filter]")) {
		button.addEventListener("click", () => {
			const set = active[button.dataset.filter];
			const on = button.getAttribute("aria-pressed") !== "true";
			button.setAttribute("aria-pressed", String(on));
			if (on) set.add(button.dataset.key);
			else set.delete(button.dataset.key);
			apply();
		});
	}
	search.addEventListener("input", () => {
		query = search.value.trim().toLowerCase();
		apply();
	});
	const expand = document.querySelector('[data-action="expand"]');
	expand.addEventListener("click", () => {
		const open = expand.textContent === "Open all";
		for (const d of tbody.querySelectorAll("details")) d.open = open;
		expand.textContent = open ? "Close all" : "Open all";
	});
	document.querySelector('[data-action="reset"]').addEventListener("click", () => {
		active.goal.clear();
		active.status.clear();
		for (const b of document.querySelectorAll("button[data-filter]")) b.setAttribute("aria-pressed", "false");
		search.value = "";
		query = "";
		apply();
	});
	apply();
})();
