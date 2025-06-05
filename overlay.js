document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('ticket-input');
    const jiraTab1 = document.getElementById('jira-tab1');
    const jiraTab2 = document.getElementById('jira-tab2');
    let activeTab = 1;

    // Load tab labels from storage
    function loadTabLabels() {
        chrome.storage.sync.get(['jira1Label', 'jira2Label'], function(result) {
            const label1 = result.jira1Label || '1';
            const label2 = result.jira2Label || '2';
            jiraTab1.textContent = label1;
            jiraTab2.textContent = label2;
            // Update data attributes for accessibility
            jiraTab1.setAttribute('aria-label', `Tab ${label1}`);
            jiraTab2.setAttribute('aria-label', `Tab ${label2}`);
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

    // Handle tab switching
    jiraTab1.addEventListener('click', () => {
        activeTab = 1;
        updateTabSelection(activeTab);
    });

    jiraTab2.addEventListener('click', () => {
        activeTab = 2;
        updateTabSelection(activeTab);
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
        jiraTab1.classList.toggle('active', tabNumber === 1);
        jiraTab2.classList.toggle('active', tabNumber === 2);
        chrome.storage.sync.set({ lastActiveTab: tabNumber });
    }

    // Handle Enter key
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const ticketNumber = input.value.trim();
            if (ticketNumber.length > 0 && ticketNumber.length <= 8 && /^[0-9]+$/.test(ticketNumber)) {
                // Send the ticket number and active tab to the background script
                chrome.runtime.sendMessage(
                    {
                        action: 'openTicket',
                        ticketNumber: ticketNumber,
                        tab: activeTab
                    },
                    function(response) {
                        if (response && response.success) {
                            window.close();
                        }
                    }
                );
            } else {
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 1000);
            }
        }
    });

    // Handle escape key to close the window
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.close();
        }
    });
});
