/**
 * Copied from:
 * https://dev.to/penge/learn-the-most-useful-chrome-apis-by-creating-block-site-chrome-extension-2de8#:~:text=Block%20Site%20is%20a%20simple,you%20say%20so%20in%20Options
 */
const textarea = document.getElementById("textarea");
const save = document.getElementById("save");
const clearlink = document.getElementById("clearlink");
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

if (save != null){
  save.addEventListener("click", () => {
    const blocked = textarea.value.split("\n").map(s => s.trim()).filter(Boolean);
    chrome.storage.local.set({ blocked });
  });
}

if (clearlink != null){
  clearlink.addEventListener("click", () => {
    textarea.value = '';
    const blocked = null;
    chrome.storage.local.set({blocked});
  });
}

if (blockedcheckbox != null){
  blockedcheckbox.addEventListener("change", (event) => {
    const enabled = event.target.checked;

    chrome.storage.local.set({ enabled });
  });
}

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
