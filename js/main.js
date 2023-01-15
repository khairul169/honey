function onload() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "config/config.json");
	xhr.onload = function() {
		CONFIG = JSON.parse(this.responseText);
		for_all("back", (btn) => {
			btn.onclick = show;
		});
		switch_theme(config("dark_mode") == "true");
		load_apps();
		setTimeout(() => {
			show();
			document.body.classList.remove("init");
		}, 50);
	};
	xhr.send();
}

function show(id) {
	if (typeof(id) != "string") id = "page-home";
	CURRENT_VIEW = id;
	for_all("page", (page) => {
		page.classList.add("hidden");
	});
	get(id).classList.remove("hidden");
	get(id).scrollTop = 0;
	let bg = get("background").classList;
	if (CURRENT_VIEW == "page-home") bg.add("scaled");
	else bg.remove("scaled");
}

function switch_theme(value) {
	let is_dark = get_bool("dark_mode");
	if (value === undefined) is_dark = !is_dark; 
	config("dark_mode", is_dark);
	get("css_dark").disabled = !is_dark;
	let bg = get("background").classList;
	let setting = get("setting-theme");
	let icon = get("theme-indicator");
	if (is_dark) {
		setting.classList.add("checked");
		icon.innerText = "dark_mode";
		bg.add("dark");
		get_background().src = "img/background-dark.jpg";
	}
	else {
		setting.classList.remove("checked");
		icon.innerText = "light_mode";
		bg.remove("dark");
		get_background().src = "img/background.jpg";
	}
}

function load_apps() {
	let final = "";
	for (let i = 0; i < CONFIG["services"].length; i++) {
		let app = mk_entry(CONFIG["services"][i]);
		final += app;
	}
	get("applist").innerHTML = final;
}

let S_TAP_LOCK;
function open_screen(button) {
	if (S_TAP_LOCK) return;
	S_TAP_LOCK = true;
	let parent = button.parentNode;
	let cursor = parent.getElementsByClassName("bg")[0];
	let items = parent.getElementsByClassName("entry");
	let clicked_id = 0;
	for (let i = 0; i < items.length; i++) {
		if (items[i] === button) {
			clicked_id = i;
			break;
		}
	}
	cursor.style.left = `${100 * clicked_id / items.length}%`;
	let wrapper = parent.parentNode.parentNode;
	let screens = get_class("screens", wrapper)[0];
	let from_height = screens.clientHeight;
	for_all("screen", (screen) => {
		screen.classList.add("hidden");
	}, wrapper);
	screens.children[clicked_id].classList.remove("hidden");
	let to_height = screens.children[clicked_id].clientHeight;
	screens.style.transform = `translateX(calc(-${clicked_id}% * (100 / var(--screens))))`;
	screens.style.height = `${from_height}px`;
	setTimeout(() => {
		screens.style.height = `${to_height}px`;
	}, 10);
	setTimeout(() => {
		screens.style.height = null;
		S_TAP_LOCK = false;
	}, 420);
}