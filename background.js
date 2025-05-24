// Store videos per tab
const tabVideos = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'VIDEO_SOURCES' && sender.tab) {
    tabVideos[sender.tab.id] = message.videos;
  }
  if (message.type === 'GET_VIDEOS' && sender.tab) {
    sendResponse(tabVideos[sender.tab.id] || []);
  }
  if (message.type === 'DOWNLOAD_VIDEO') {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename || undefined,
      saveAs: true
    });
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener(tabId => {
  delete tabVideos[tabId];
}); 