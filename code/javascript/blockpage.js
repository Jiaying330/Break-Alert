const textarea = document.getElementById("textarea");
const save = document.getElementById("save");
const blockedcheckbox = document.getElementById("blockedcheckbox");

if (textarea != null){
  textarea.placeholder = [
    "After insert link as example, press save and click checkbox to enable the function.",
    "",
    "Example:",
    "facebook.com",
    "youtube.com",
    "twitter.com"
  ].join("\n");
}

save.addEventListener("click", () => {
  const blocked = textarea.value.split("\n").map(s => s.trim()).filter(Boolean);

  chrome.storage.local.set({ blocked });
});

blockedcheckbox.addEventListener("change", (event) => {
  const enabled = event.target.checked;

  chrome.storage.local.set({ enabled });
});

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["blocked", "enabled"], function (local) {
    const { blocked, enabled } = local;
    if (!Array.isArray(blocked)) {
      return;
    }

    // blocked
    var value = blocked.join("\r\n"); // display every blocked in new line
    textarea.value = value;

    // enabled
    blockedcheckbox.checked = enabled;

    // show controls
    document.body.classList.add("ready");
  });
});
