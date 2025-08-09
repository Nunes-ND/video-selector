import { CustomSelect } from "./CustomSelect.js";
import { toggleMenu } from "./navbar.js";
import { filterVideos, initializeVideoManager, sortVideos } from "./video.js";

export async function init(videoListElement) {
	try {
		toggleMenu();
		const response = await fetch("../../data/videos.json");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const allVideos = await response.json();
		initializeVideoManager(allVideos, videoListElement);

		const selectOptions = [
			{ value: "all", text: "all" },
			{ value: "short", text: "short (up to 2 min)" },
			{ value: "medium", text: "medium (2-15 min)" },
			{ value: "long", text: "long (15-30 min)" },
			{ value: "extra-long", text: "extra long (over 30 min)" },
		];

		const sortOptions = [
			{ value: "asc", text: "shortest to longest" },
			{ value: "desc", text: "longest to shortest" },
		];

		new CustomSelect("custom-select-container", selectOptions, filterVideos);
		new CustomSelect("custom-sort-container", sortOptions, sortVideos);
	} catch (error) {
		console.error("Failed to load video data:", error);
		videoListElement.innerHTML =
			"<p>An error occurred when loading the videos. Try again later.</p>";
	}
}
