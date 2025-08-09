export class CustomSelect {
	constructor(containerId, options, onSelectCallback) {
		this.container = document.getElementById(containerId);
		this.options = options;
		this.onSelect = onSelectCallback;
		this.isOpen = false;

		this.render();
		this.addEventListeners();
	}

	render() {
		this.container.innerHTML = `
      <div class="custom-select">
        <div class="select-selected">
          ${this.options[0].text}
        </div>
        <div class="select-items select-hide">
          ${this.options.map((opt) => `<div data-value="${opt.value}">${opt.text}</div>`).join("")}
        </div>
      </div>
    `;

		this.selectedEl = this.container.querySelector(".select-selected");
		this.itemsEl = this.container.querySelector(".select-items");
	}

	addEventListeners() {
		this.selectedEl.addEventListener("click", (e) => {
			e.stopPropagation();
			this.toggle();
		});

		for (const item of this.itemsEl.querySelectorAll("div")) {
			item.addEventListener("click", (e) => {
				const value = e.target.dataset.value;
				const text = e.target.textContent;

				this.selectedEl.textContent = text;
				this.close();

				if (this.onSelect) {
					this.onSelect(value);
				}
			});
		}

		document.addEventListener("click", () => {
			if (this.isOpen) {
				this.close();
			}
		});
	}

	toggle() {
		if (this.isOpen) {
			this.close();
		} else {
			this.open();
		}
	}

	open() {
		this.itemsEl.classList.remove("select-hide");
		this.isOpen = true;
	}

	close() {
		this.itemsEl.classList.add("select-hide");
		this.isOpen = false;
	}
}
