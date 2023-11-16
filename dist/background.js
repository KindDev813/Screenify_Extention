chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.includes("http")) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["./inject_script.js"],
      },
      () => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ["./foreground.bundle.js"],
          },
          () => {
            console.log("INJECTED AND EXECUTED");
          }
        );
      }
    );
  }
});
