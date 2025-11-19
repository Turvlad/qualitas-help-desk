// assets/js/autocomplete.js
// Helper genérico para autocompletado en inputs

(function () {
  function createAutocomplete(config) {
    const {
      inputId,
      listId,
      source = [],
      minChars = 0,
      match,
      getLabel,
      getValue,
      onSelected,
    } = config;

    const input = document.getElementById(inputId);
    const box = document.getElementById(listId);

    if (!input || !box) return;

    let cursorIndex = -1;
    let filtered = [];
    let isOpen = false;

    function close() {
      box.style.display = "none";
      box.innerHTML = "";
      cursorIndex = -1;
      isOpen = false;
    }

    function open() {
      if (!filtered.length) {
        close();
        return;
      }
      box.style.display = "block";
      isOpen = true;
    }

    function renderList() {
      box.innerHTML = "";
      if (!filtered.length) {
        close();
        return;
      }

      filtered.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.textContent = getLabel ? getLabel(item) : String(item);

        if (idx === cursorIndex) {
          li.classList.add("active");
        }

        li.addEventListener("click", () => {
          const value = getValue ? getValue(item) : String(item);
          input.value = value;
          if (typeof onSelected === "function") {
            onSelected(value, item);
          }
          close();
        });

        box.appendChild(li);
      });

      open();
    }

    input.addEventListener("input", () => {
      const q = (input.value || "").toLowerCase();

      if (q.length < minChars) {
        filtered = [];
        close();
        return;
      }

      filtered = source.filter((item) => {
        if (typeof match === "function") return match(q, item);
        const txt =
          typeof item === "string"
            ? item
            : JSON.stringify(item ?? "").toLowerCase();
        return txt.includes(q);
      });

      cursorIndex = -1;
      renderList();
    });

    input.addEventListener("keydown", (e) => {
      if (!isOpen || !filtered.length) return;

      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation(); // para que no dispare el handler del form (wizard)
      }

      if (e.key === "ArrowDown") {
        cursorIndex = (cursorIndex + 1) % filtered.length;
        renderList();
      }

      if (e.key === "ArrowUp") {
        cursorIndex = (cursorIndex - 1 + filtered.length) % filtered.length;
        renderList();
      }

      if (e.key === "Enter") {
        if (cursorIndex >= 0 && filtered[cursorIndex]) {
          const item = filtered[cursorIndex];
          const value = getValue ? getValue(item) : String(item);
          input.value = value;
          if (typeof onSelected === "function") {
            onSelected(value, item);
          }
        }
        close();
      }

      if (e.key === "Escape") {
        close();
      }
    });

    document.addEventListener("click", (e) => {
      if (!isOpen) return;
      if (!box.contains(e.target) && e.target !== input) {
        close();
      }
    });
  }

  // Exponer global
  window.HD_createAutocomplete = createAutocomplete;
})();
