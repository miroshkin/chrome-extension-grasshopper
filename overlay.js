document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('ticket-input');
    const tab1 = document.getElementById('tab1');
    const tab2 = document.getElementById('tab2');
    let activeTab = 1;

    // Check for required controls
    if (!input || !tab1 || !tab2) {
        document.body.innerHTML = '<div style="padding:24px;text-align:center;font-size:1.1em;color:#888;">This overlay must be opened from the extension icon.</div>';
        return;
    }

    // Load tab labels from storage
    function loadTabLabels() {
        // Ensure saved values are loaded correctly
        chrome.storage.sync.get(['url1Label', 'url2Label'], function(result) {
            const label1 = result.url1Label || '1';
            const label2 = result.url2Label || '2';
            tab1.textContent = label1;
            tab2.textContent = label2;
            // Update data attributes for accessibility
            tab1.setAttribute('aria-label', `Project ${label1}`);
            tab2.setAttribute('aria-label', `Project ${label2}`);
        });
    }

    // Store the last active tab in storage
    chrome.storage.sync.get(['lastActiveTab'], function(result) {
        if (result.lastActiveTab) {
            activeTab = result.lastActiveTab;
            updateTabSelection(activeTab);
        }
    });

    // Automatically focus the input and select tab 1
    input.focus();
    updateTabSelection(1);

    // Load tab labels
    loadTabLabels();

    // Update tab switching logic
    tab1.addEventListener('click', function() {
        activeTab = 1;
        updateTabSelection(activeTab);
        input.focus();
    });
    tab2.addEventListener('click', function() {
        activeTab = 2;
        updateTabSelection(activeTab);
        input.focus();
    });

    // Handle Tab key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            activeTab = activeTab === 1 ? 2 : 1;
            updateTabSelection(activeTab);
            input.focus();
        }
    });

    // Update tab selection and store it
    function updateTabSelection(tabNumber) {
        tab1.classList.toggle('active', tabNumber === 1);
        tab2.classList.toggle('active', tabNumber === 2);
        chrome.storage.sync.set({ lastActiveTab: tabNumber });
    }

    // Load URLs for validation
    chrome.storage.sync.get(['url1', 'url2'], function(result) {
        window.url1 = result.url1 || '';
        window.url2 = result.url2 || '';
    });

    // Handle Enter key
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const ticketNumber = input.value.trim();
            // Always get the latest URLs before checking
            chrome.storage.sync.get(['url1', 'url2'], function(result) {
                const url1 = result.url1 || '';
                const url2 = result.url2 || '';
                const currentUrl = activeTab === 1 ? url1 : url2;
                if (!currentUrl || currentUrl.trim() === '') {
                    input.value = '';
                    input.placeholder = 'URL not found for this tab!';
                    input.classList.add('error');
                    setTimeout(() => {
                        input.placeholder = 'Number/Text to add to the URL';
                        input.classList.remove('error');
                    }, 2000);
                    return;
                }
                // Send the ticket number and active tab to the background script
                chrome.runtime.sendMessage(
                    {
                        action: 'openTicket',
                        ticketNumber: ticketNumber,
                        tab: activeTab
                    },
                    function(response) {
                        if (chrome.runtime.lastError) {
                            console.error('Error sending message:', chrome.runtime.lastError);
                        } else if (response && response.success) {
                            // Ensure window.close is only called when the overlay is open
                            if (window.opener) {
                                window.close();
                            }
                        } else if (response && response.error) {
                            input.value = '';
                            input.placeholder = response.error === 'URL not found' ? 'URL not found for this tab!' : response.error;
                            input.classList.add('error');
                            setTimeout(() => {
                                input.placeholder = 'Number/Text to add to the URL';
                                input.classList.remove('error');
                            }, 2000);
                            // Do not log 'URL not found' error to console
                            if (response.error !== 'URL not found') {
                                console.error('Error:', response.error);
                            }
                        }
                    }
                );
                // Clear ticket number after pressing Enter
                input.style.transition = 'opacity 0.3s ease';
                input.style.opacity = '0';
                setTimeout(() => {
                    input.value = '';
                    input.style.opacity = '1';
                }, 300);
            });
        }
    });

    // Handle escape key to close the window
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.close();
        }
    });

    // Listen for messages to update tab labels
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'updateTabLabels') {
            loadTabLabels();
        }
    });

    // Call loadTabLabels to ensure saved settings are displayed
    loadTabLabels();
});
