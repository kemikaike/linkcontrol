let domain;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    domain = getHostname(tabs[0].url);
    document.querySelector('section#site-config h2').innerText = domain;
});

chrome.storage.sync.get(null, function(config){
        switch(config.global_settings.link_behaviour){
            case 'same' :
            document.getElementById('global-same-tab').checked = true;
            break;
            case 'new' :
            document.getElementById('global-new-tab').checked = true;
            break;
            default:
        }
        if(config[domain]){
            switch(config[domain].link_behaviour){
                case 'off' :
                document.getElementById('site-off').checked = true;
                break;
                case 'same' :
                document.getElementById('site-same-tab').checked = true;
                break;
                case 'new' :
                document.getElementById('site-new-tab').checked = true;
                break;
                default:
            }

        }
});

document.addEventListener('change',function(event){
    if(event.target.form){
        if(event.target.form.name == 'global_settings' || event.target.form.name == 'site_settings'){
            saveSettings(new FormData(event.target.form), event.target.form.name);

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
                chrome.tabs.sendMessage(tabs[0].id, {event: 'configUpdated'});
            });            
        }
    }
});

document.querySelectorAll('.close-button').forEach(function(elem){
    elem.addEventListener('click', function(){
        window.close();
    });
});

function saveSettings(form, name){
    let formObj = {};
    form.forEach(function(value, key){
        formObj[key] = value;
    });
    if(name == 'global_settings'){
        chrome.storage.sync.set({global_settings: formObj});
    }
    if(name == 'site_settings'){
        let newConfig = {};
        newConfig[domain] = formObj;
        chrome.storage.sync.set(newConfig);
    }
}

function getHostname(url) {
    let hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}
