const domain = window.location.hostname;
const targetOptions = {
    same: '_self',
    new: '_blank'
}

let targetAction;

chrome.runtime.sendMessage({event: 'pageLoad'});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    if(request.event == 'configUpdated'){
        run();
    }
});

run();

function run(){
    chrome.storage.sync.get(null, function(config){        
        if(config[domain]){
            switch(config[domain].link_behaviour){
                case 'same' :
                addLinkListener(targetOptions.same);
                break;
                case 'new' :
                addLinkListener(targetOptions.new);
                break;
                case 'global' :
                if(targetOptions[config.global_settings.link_behaviour]){
                    addLinkListener(targetOptions[config.global_settings.link_behaviour]);
                }
                break;
                default:
                addLinkListener(null);
            }
        } else {
            switch(config.global_settings.link_behaviour){
                case 'same' :
                addLinkListener(targetOptions.same);
                break;
                case 'new' :
                addLinkListener(targetOptions.new);
                break;
                default:
                addLinkListener(null);
            }
        }
    });
}

function addLinkListener(action){
    document.removeEventListener('click', changeLinkTarget);
    targetAction = action;
    if(!targetAction) return;
    document.addEventListener('click', changeLinkTarget);
}

function changeLinkTarget(event){
    if(event.target.closest('a')){
        event.target.closest('a').target = targetAction;
    }
}
