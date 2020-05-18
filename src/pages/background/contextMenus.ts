chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'sampleContextMenu',
        title: 'Sample Context Menu',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    alert(info.menuItemId);
});