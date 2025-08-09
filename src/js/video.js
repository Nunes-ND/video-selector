import {
	disconnectObserver,
	setupIntersectionObserver,
} from "./infinite-scroll.js";

let allVideos = [];
let currentFilteredVideos = [];
let currentPage = 1;
const VIDEOS_PER_PAGE = 12;
let videoListElement;
let currentSortOrder = "asc";

function formatDuration(durationInSeconds) {
	const minutes = Math.floor(durationInSeconds / 60);
	const seconds = durationInSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getPageVideos(videos, page) {
	const start = (page - 1) * VIDEOS_PER_PAGE;
	const end = start + VIDEOS_PER_PAGE;
	return videos.slice(start, end);
}

function renderVideos(videos, options = { append: false }) {
	if (!videoListElement) return;

	if (videos.length === 0 && !options.append) {
		videoListElement.innerHTML = "<p>No video found for this filter.</p>";
		disconnectObserver();
		return;
	}

	const placeholderImage = "src/assets/images/placeholder.jpg";
	const videosHtml = videos
		.map((video) => {
			const imagePath = video.imageFile
				? `src/assets/images/${video.imageFile}`
				: placeholderImage;
			return `
			<a href="video.html?id=${video.id}" class="video-card">
				<div class="video-thumbnail-container">
					<img src="${imagePath}" alt="${video.title}" class="video-thumbnail" onerror="this.onerror=null;this.src='${placeholderImage}';">
				</div>
				<div class="video-info">
					<h3 class="video-title">${video.title}</h3>
					<p class="video-duration">Duration: ${formatDuration(
						video.duration,
					)}</p>
				</div>
			</a>
  	`;
		})
		.join("");

	if (options.append) {
		videoListElement.insertAdjacentHTML("beforeend", videosHtml);
	} else {
		videoListElement.innerHTML = videosHtml;
	}

	setupObserverForNextPage();
}

function loadMoreVideos() {
	currentPage++;
	const nextPageVideos = getPageVideos(currentFilteredVideos, currentPage);
	if (nextPageVideos.length > 0) {
		renderVideos(nextPageVideos, { append: true });
	}
}

function setupObserverForNextPage() {
	const oldSentinel = document.getElementById("sentinel");
	if (oldSentinel) {
		oldSentinel.remove();
	}

	const hasMoreVideos =
		currentPage * VIDEOS_PER_PAGE < currentFilteredVideos.length;

	if (hasMoreVideos) {
		const sentinel = document.createElement("div");
		sentinel.id = "sentinel";
		sentinel.innerHTML = `<div class="loader"></div>`;
		videoListElement.parentNode.insertBefore(
			sentinel,
			videoListElement.nextSibling,
		);
		setupIntersectionObserver(sentinel, loadMoreVideos);
	} else {
		disconnectObserver();
	}
}

function applySort(videos) {
	return videos.sort((a, b) => {
		return currentSortOrder === "asc"
			? a.duration - b.duration
			: b.duration - a.duration;
	});
}

export function sortVideos(sortValue) {
	currentSortOrder = sortValue;
	currentPage = 1;
	currentFilteredVideos = applySort(currentFilteredVideos);
	renderVideos(getPageVideos(currentFilteredVideos, currentPage), {
		append: false,
	});
}

export function filterVideos(filterValue) {
	currentPage = 1;
	let filtered;

	switch (filterValue) {
		case "short":
			filtered = allVideos.filter((v) => v.duration < 120);
			break;
		case "medium":
			filtered = allVideos.filter(
				(v) => v.duration >= 120 && v.duration <= 900,
			);
			break;
		case "long":
			filtered = allVideos.filter(
				(v) => v.duration > 900 && v.duration <= 1800,
			);
			break;
		case "extra-long":
			filtered = allVideos.filter((v) => v.duration > 1800);
			break;
		default:
			filtered = [...allVideos];
			break;
	}

	currentFilteredVideos = applySort(filtered);

	renderVideos(getPageVideos(currentFilteredVideos, currentPage), {
		append: false,
	});
}

export function initializeVideoManager(videosData, element) {
	allVideos = videosData;
	videoListElement = element;

	currentFilteredVideos = applySort([...allVideos]);
	renderVideos(getPageVideos(currentFilteredVideos, currentPage), {
		append: false,
	});
}
