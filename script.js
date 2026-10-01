const studioSection = document.getElementById("studio");
const downloadPage = document.getElementById("downloadPage");
const stepsPanel = document.getElementById("stepsPanel");
const toast = document.getElementById("toast");
const ideaInput = document.getElementById("idea");
const modResult = document.getElementById("modResult");
const acceptGuidelines = document.getElementById("acceptGuidelines");
const localPreferences = document.getElementById("localPreferences");
const diagnostics = document.getElementById("diagnostics");
const downloadStatus = document.getElementById("downloadStatus");
const releaseList = document.getElementById("releaseList");
const releaseCount = document.getElementById("releaseCount");
const selectedPackage = document.getElementById("selectedPackage");

const build = {
  version: "26.1.2",
  loader: "Fabric",
  edition: "Java",
  name: "Limitless Client",
  releaseReady: true
};

const releases = [
  {
    id: "current",
    label: "Local Practice Update",
    version: "26.1.2",
    loader: "Fabric",
    edition: "Java",
    file: "my mods/Limitless Client 26.1.2-v0.0.0.4.jar",
    path: "my%20mods/Limitless%20Client%2026.1.2-v0.0.0.4.jar",
    size: "9.0 KB",
    badge: "Latest",
    contributors: "Naman Raj, Zen!CC, Raizen2.0XT, VN Sensei"
  },
  {
    id: "collaborative-003",
    label: "Collaborative build",
    version: "26.1.2",
    loader: "Fabric",
    edition: "Java",
    file: "my mods/Limitless Client 26.1.2-v0.0.0.3.jar",
    path: "my%20mods/Limitless%20Client%2026.1.2-v0.0.0.3.jar",
    size: "7.9 KB",
    badge: "Previous",
    contributors: "Naman Raj, Zen!CC, Raizen2.0XT, VN Sensei"
  },
  {
    id: "legacy",
    label: "Legacy build",
    version: "26.1.2",
    loader: "Fabric",
    edition: "Java",
    file: "older-mods/Limitless Client 26.1.2.jar",
    path: "older-mods/Limitless%20Client%2026.1.2.jar",
    size: "4.2 KB",
    badge: "Older"
  },
  {
    id: "previous",
    label: "Previous collaborative build",
    version: "26.1.2",
    loader: "Fabric",
    edition: "Java",
    file: "my mods/Limitless Client 26.1.2-v0.0.0.2.jar",
    path: "my%20mods/Limitless%20Client%2026.1.2-v0.0.0.2.jar",
    size: "6.8 KB",
    badge: "Previous"
  }
];

let selectedRelease = releases[0];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

function routeToDownload() {
  downloadPage.classList.remove("hidden");
  downloadPage.setAttribute("aria-hidden", "false");
  if (location.hash !== "#download") {
    history.replaceState(null, "", "#download");
  }
  downloadPage.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Download flow opened");
}

function routeToStudio() {
  studioSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderReleases() {
  const loader = document.getElementById("loaderFilter").value;
  const version = document.getElementById("versionFilter").value;
  const edition = document.getElementById("editionFilter").value;
  const matches = releases.filter((release) => release.loader === loader && release.version === version && release.edition === edition);
  releaseCount.textContent = `${matches.length} release${matches.length === 1 ? "" : "s"}`;
  releaseList.innerHTML = matches.map((release) => `
    <article class="release-card ${release.id === selectedRelease.id ? "is-selected" : ""}">
      <div class="release-card__main">
        <span class="release-card__badge">${release.badge}</span>
        <h4>${release.label}</h4>
        <p>${release.version} / ${release.loader} / ${release.edition} <span>•</span> ${release.size}</p>
        ${release.contributors ? `<small class="release-card__contributors">Collab: ${release.contributors}</small>` : ""}
      </div>
      <button class="btn btn--ghost release-select" data-release="${release.id}">${release.id === selectedRelease.id ? "Selected" : "Select"}</button>
    </article>
  `).join("");

  releaseList.querySelectorAll("[data-release]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRelease = releases.find((release) => release.id === button.dataset.release) || releases[0];
      selectedPackage.textContent = selectedRelease.file;
      renderReleases();
      showToast(`${selectedRelease.label} selected`);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30) || "custom-mod";
}

function buildFeatureList(prompt) {
  const lower = prompt.toLowerCase();
  const features = [];

  if (lower.includes("movement") || lower.includes("speed")) features.push("movement tuning and sprint utilities");
  if (lower.includes("hud") || lower.includes("ui")) features.push("minimal HUD panels and status overlays");
  if (lower.includes("combat")) features.push("non-automated local combat-practice notes and settings");
  if (lower.includes("utility") || lower.includes("tool")) features.push("quality-of-life tools and shortcuts");
  if (lower.includes("performance")) features.push("lightweight performance-focused settings");

  if (!features.length) {
    features.push("custom gameplay logic tailored to your prompt");
    features.push("clean modular settings");
    features.push("release checklist for a verified build");
  }

  return features;
}

function generateModBlueprint() {
  const prompt = ideaInput.value.trim();
  if (!prompt) {
    modResult.innerHTML = "<h3>Type a mod idea first</h3><p>Describe the behavior you want and the AI studio will generate a clean blueprint.</p>";
    showToast("Add a mod idea to generate a blueprint");
    return;
  }

  const name = `${prompt.split(/\s+/).slice(0, 3).map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ")} Pack`.trim();
  const features = buildFeatureList(prompt);
  const id = slugify(prompt);

  modResult.innerHTML = `
    <h3>${name}</h3>
    <p><strong>Package ID:</strong> ${id}</p>
    <p><strong>Target:</strong> ${build.version} / ${build.loader} / ${build.edition}</p>
    <p><strong>Blueprint:</strong> ${prompt}</p>
    <ul>
      ${features.map((feature) => `<li>${feature}</li>`).join("")}
    </ul>
  `;
  showToast("Blueprint generated");
}

function downloadJar() {
  if (!build.releaseReady) {
    showToast("The 26.1.2 build is not released yet");
    document.getElementById("guidelines").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (!acceptGuidelines.checked) {
    showToast("Accept the responsible-use guidelines first");
    document.getElementById("consentTitle").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const link = document.createElement("a");
  link.href = selectedRelease.path;
  link.download = selectedRelease.file.split("/").pop();
  document.body.appendChild(link);
  link.click();
  link.remove();
  downloadStatus.classList.remove("hidden");
  stepsPanel.classList.remove("hidden");
  showToast("Limitless Client 26.1.2 download started");
  window.setTimeout(() => {
    stepsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 250);
}

document.getElementById("openDownload").addEventListener("click", routeToDownload);
document.getElementById("openStudio").addEventListener("click", routeToStudio);
document.getElementById("generateMod").addEventListener("click", generateModBlueprint);
document.getElementById("clearIdea").addEventListener("click", () => {
  ideaInput.value = "";
  ideaInput.focus();
  modResult.innerHTML = "<h3>Awaiting your prompt</h3><p>Your mod concept, features, and package name will appear here.</p>";
});
document.getElementById("downloadJar").addEventListener("click", downloadJar);
document.getElementById("showSteps").addEventListener("click", () => {
  stepsPanel.classList.toggle("hidden");
  showToast(stepsPanel.classList.contains("hidden") ? "Install steps hidden" : "Install steps shown");
});

function savePrivacySettings() {
  if (localPreferences.checked) {
    localStorage.setItem("limitless-privacy", JSON.stringify({ diagnostics: diagnostics.checked }));
  } else {
    localStorage.removeItem("limitless-privacy");
  }
  showToast("Privacy settings saved locally");
}

const savedPrivacy = JSON.parse(localStorage.getItem("limitless-privacy") || "null");
if (savedPrivacy) diagnostics.checked = Boolean(savedPrivacy.diagnostics);
localPreferences.addEventListener("change", savePrivacySettings);
diagnostics.addEventListener("change", savePrivacySettings);
document.getElementById("clearPrivacy").addEventListener("click", () => {
  localStorage.removeItem("limitless-privacy");
  localPreferences.checked = false;
  diagnostics.checked = false;
  showToast("Saved privacy settings cleared");
});

document.querySelectorAll("#loaderFilter, #versionFilter, #editionFilter").forEach((filter) => {
  filter.addEventListener("change", renderReleases);
});
renderReleases();

window.addEventListener("hashchange", () => {
  if (location.hash === "#download") routeToDownload();
});

if (location.hash === "#download") {
  routeToDownload();
}
