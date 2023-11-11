chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "requestPermission") {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        /* Use the stream */
        sendResponse({ success: true });
        console.log(stream);
      })
      .catch((err) => {
        /* Handle the error */
        sendResponse({ success: false });
        console.log(err);
      });
  }
  return true; // Will respond asynchronously.
});
