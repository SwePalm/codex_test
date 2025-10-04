const THEME_STORAGE_KEY = "learning-lab-theme";
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia
  ? window.matchMedia("(prefers-color-scheme: dark)")
  : null;

const readTheme = () => {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch (error) {
    console.warn("Unable to access theme preference", error);
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    if (theme) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } else {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Unable to persist theme preference", error);
  }
};

const currentTheme = () =>
  root.dataset.theme || (prefersDark?.matches ? "dark" : "light");

const updateToggle = () => {
  if (!themeToggle) return;
  const next = currentTheme() === "dark" ? "light" : "dark";
  themeToggle.textContent = next === "dark" ? "Dark" : "Light";
  themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
};

const applyTheme = (theme) => {
  if (theme) {
    root.dataset.theme = theme;
  } else {
    delete root.dataset.theme;
  }
  storeTheme(theme);
  updateToggle();
};

const savedTheme = readTheme();
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  updateToggle();
}

themeToggle?.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
});

prefersDark?.addEventListener?.("change", () => {
  if (!readTheme()) {
    updateToggle();
  }
});

const NOTES_STORAGE_KEY = "learning-lab-notes";
const notesList = document.getElementById("notes-list");
const notesForm = document.getElementById("notes-form");
const notesInput = document.getElementById("notes-input");
const notesClearButton = document.getElementById("notes-clear");

const loadNotes = () => {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Unable to load notes", error);
    return [];
  }
};

let notes = loadNotes();

const persistNotes = () => {
  if (!notes.length) {
    localStorage.removeItem(NOTES_STORAGE_KEY);
    return;
  }
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};

const renderNotes = () => {
  notesList.innerHTML = "";
  notes.forEach((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    notesList.appendChild(item);
  });
  if (notesClearButton) {
    notesClearButton.disabled = notes.length === 0;
  }
};

notesForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = notesInput.value.trim();
  if (!value) {
    notesInput.value = "";
    return;
  }

  notes = [...notes, value];
  persistNotes();
  renderNotes();
  notesInput.value = "";
  notesInput.focus();
});

notesClearButton?.addEventListener("click", () => {
  notes = [];
  persistNotes();
  renderNotes();
  notesInput.focus();
});

renderNotes();
