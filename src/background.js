chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.includes("http")) {
    chrome.tabs.executeScript(
      tabId,
      { file: "./inject_script.js" },
      function () {
        chrome.tabs.executeScript(
          tabId,
          { file: "./foreground.bundle.js" },
          function () {
            console.log("INJECTED AND EXECUTED");
          }
        );
      }
    );
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
