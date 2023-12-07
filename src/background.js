chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createOptionPage") {
    chrome.tabs.create({ url: request.url });
  }
  sendResponse({ SUCCESS: "success" });
});
