chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle-feature') {
        // Get the current tab
        chrome.windows.getLastFocused(function(win) {
            if (!win) {
                console.error('No focused window found');
                return;
            }

            var width = 330;
            var height = 140; // Increased height to accommodate tab selector
            var left = ((win.width / 2) - (width / 2)) + win.left;
            var top = ((win.height / 2) - (height / 2)) + win.top;
    
            // Ensure only one overlay instance is created
            chrome.windows.getAll({populate: true}, function(windows) {
                const overlayWindow = windows.find(win => win.tabs.some(tab => tab.url === chrome.runtime.getURL('overlay.html')));
                if (overlayWindow) {
                    chrome.windows.update(overlayWindow.id, {focused: true});
                } else {
                    chrome.windows.create({
                        url: chrome.runtime.getURL('overlay.html'),
                        width: width,
                        height: height,
                        top: Math.round(top),
                        left: Math.round(left),
                        type: 'popup'
                    });
                }
            });
         });
    }
});

// Load URLs when extension starts
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['url1', 'url2'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError);
            return;
        }

        const updates = {};
        if (!result.url1) {
            updates.url1 = 'https://example.com/project1/';
        }
        if (!result.url2) {
            updates.url2 = 'https://example.com/project2/';
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
        chrome.storage.sync.get(['url1', 'url2'], function(result) {
            if (chrome.runtime.lastError) {
                console.error('Error retrieving URLs:', chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
                return;
            }

            let url;
            if (request.tab === 1) {
                url = result.url1;
            } else if (request.tab === 2) {
                url = result.url2;
            }

            if (url) {
                try {
                    // Create the full ticket URL
                    const ticketUrl = `${url}${request.ticketNumber}`;
                    
                    // Create a new tab with the ticket URL
                    chrome.tabs.create({ url: ticketUrl }, function(tab) {
                        if (chrome.runtime.lastError) {
                            console.error('Error creating tab:', chrome.runtime.lastError);
                            sendResponse({ success: false, error: chrome.runtime.lastError.message });
                        } else {
                            sendResponse({ success: true });
                        }
                    });
                } catch (error) {
                    console.error('Error:', error);
                    sendResponse({ success: false, error: error.message });
                }
            } else {
                sendResponse({ success: false, error: 'URL not found' });
            }
        });
        return true; // Keep the message channel open for async response
    }
});
