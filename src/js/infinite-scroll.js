let observer;

export function setupIntersectionObserver(sentinelElement, callback) {
	if (observer) {
		observer.disconnect();
	}

	const options = {
		root: null,
		rootMargin: "0px 0px 300px 0px",
		threshold: 0,
	};

	observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) {
			callback();
		}
	}, options);

	observer.observe(sentinelElement);
}

export function disconnectObserver() {
	if (observer) {
		observer.disconnect();
	}
}
