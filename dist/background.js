chrome.tabs.onUpdated.addListener((function(e,t,c){"complete"===t.status&&c.url.includes("http")&&chrome.tabs.executeScript(e,{file:"./inject_script.js"},(function(){chrome.tabs.executeScript(e,{file:"./foreground.bundle.js"},(function(){console.log("INJECTED AND EXECUTED")}))}))})),chrome.tabs.onActivated.addListener((function(e){chrome.tabs.sendMessage(e.tabId,{command:"requestPermission"})}));