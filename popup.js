function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) callback(tabs[0].id);
  });
}

function renderVideos(videos) {
  const list = document.getElementById('video-list');
  if (!videos.length) {
    list.textContent = 'No videos found.';
    return;
  }
  list.innerHTML = '';
  videos.forEach((video, idx) => {
    const div = document.createElement('div');
    div.className = 'video-item';
    div.innerHTML = `
      <span class="video-url">${video.url}</span>
      <span class="video-format">[${video.format}]</span>
      <button data-url="${video.url}" data-format="${video.format}">Download</button>
    `;
    list.appendChild(div);
  });
  list.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      const format = btn.getAttribute('data-format');
      const filename = `video_${Date.now()}.${format}`;
      chrome.runtime.sendMessage({ type: 'DOWNLOAD_VIDEO', url, filename });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabId(tabId => {
    chrome.runtime.sendMessage({ type: 'GET_VIDEOS' }, videos => {
      renderVideos(videos || []);
    });
  });
}); 