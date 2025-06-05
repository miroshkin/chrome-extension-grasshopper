chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle-feature') {
        // Get the current tab
        chrome.windows.getLastFocused(function(win) {
            if (!win) {
                console.error('No focused window found');
                return;
            }

            var width = 250;
            var height = 110; // Increased height to accommodate tab selector
            var left = ((win.width / 2) - (width / 2)) + win.left;
            var top = ((win.height / 2) - (height / 2)) + win.top;
    
            chrome.windows.create({
                url: chrome.runtime.getURL('overlay.html'),
                width: width,
                height: height,
                top: Math.round(top),
                left: Math.round(left),
                type: 'popup'
            });
         });
    }
});

// Load Jira URLs when extension starts
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['jiraUrl1', 'jiraUrl2'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError);
            return;
        }
        
        const updates = {};
        if (!result.jiraUrl1) {
            updates.jiraUrl1 = 'https://chromeextension.atlassian.net/browse/';
        }
        if (!result.jiraUrl2) {
            updates.jiraUrl2 = 'https://chromeextension.atlassian.net/browse/';
        }
        
        // Only update if needed
        if (Object.keys(updates).length > 0) {
            chrome.storage.sync.set(updates, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error saving settings:', chrome.runtime.lastError);
                }
            });
        }
    });
});

// Handle messages from the overlay
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'openTicket') {
        console.log('Received ticket number:', request.ticketNumber);
        
        // Get both Jira URLs from storage
        chrome.storage.sync.get(['jiraUrl1', 'jiraUrl2'], function(result) {
            console.log('Jira URLs from storage:', result);
            
            let jiraUrl;
            if (request.tab === 1) {
                jiraUrl = result.jiraUrl1;
            } else if (request.tab === 2) {
                jiraUrl = result.jiraUrl2;
            }

            if (jiraUrl) {
                try {
                    // Create the full ticket URL
                    const ticketUrl = `${jiraUrl}${request.ticketNumber}`;
                    
                    // Create a new tab with the ticket URL
                    chrome.tabs.create({url: ticketUrl}, function(tab) {
                        if (chrome.runtime.lastError) {
                            console.error('Error creating tab:', chrome.runtime.lastError);
                            sendResponse({success: false, error: chrome.runtime.lastError.message});
                        } else {
                            console.log('Tab created:', tab);
                            sendResponse({success: true});
                        }
                    });
                } catch (error) {
                    console.error('Error:', error);
                    sendResponse({success: false, error: error.message});
                }
            } else {
                console.error('No Jira URL set in settings');
                sendResponse({success: false, error: 'No Jira URL set in settings'});
            }
        });
        return true;  // Keep the message channel open until sendResponse is called
    }   
});
