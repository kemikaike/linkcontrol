chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get(null, function(config){
        if(!config.global_settings){
            chrome.storage.sync.set({global_settings: {link_behaviour: 'off'}});
        }
    });
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab){
            if(tab.url.match('https?://*/*')){
                chrome.pageAction.show(tab.id);
            }
        });
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(typeof message === 'object' && message.event === 'pageLoad') {
        chrome.pageAction.show(sender.tab.id);
    }
});
