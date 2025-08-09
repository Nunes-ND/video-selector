export function toggleMenu() {
	const navToggle = document.querySelector(".nav-toggle");
	const navList = document.querySelector(".nav-list");
	const mainNav = document.querySelector(".main-nav");

	if (navToggle) {
		navToggle.addEventListener("click", () => {
			navList.classList.toggle("nav-open");
			mainNav.classList.toggle("nav-open");
			navToggle.setAttribute(
				"aria-expanded",
				navList.classList.contains("nav-open"),
			);
		});
	}
}
