export function initializeGoToTop() {
	const goToTopBtn = document.getElementById("goToTopBtn");

	if (!goToTopBtn) {
		console.error("Go to top button not found");
		return;
	}

	window.addEventListener("scroll", () => {
		if (window.scrollY > window.innerHeight) {
			goToTopBtn.classList.add("show");
		} else {
			goToTopBtn.classList.remove("show");
		}
	});

	goToTopBtn.addEventListener("click", (e) => {
		e.preventDefault();
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});
}
