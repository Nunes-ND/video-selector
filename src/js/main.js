import { init } from "./init.js";
import { initializeGoToTop } from "./go-to-top.js";

const videoListElement = document.getElementById("video-list");

document.addEventListener("DOMContentLoaded", () => {
	init(videoListElement);
	initializeGoToTop();
});
