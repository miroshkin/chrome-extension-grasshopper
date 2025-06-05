document.addEventListener('DOMContentLoaded', function() {
    const jiraUrl1Input = document.getElementById('jira-url1');
    const jiraUrl2Input = document.getElementById('jira-url2');
    const jira1Label = document.getElementById('jira1-label');
    const jira2Label = document.getElementById('jira2-label');
    const shortcutDisplay = document.getElementById('shortcut-display');
    const saveSettingsBtn = document.getElementById('save-settings');
    const changeShortcutBtn = document.getElementById('change-shortcut-btn');
    const statusMessage = document.getElementById('status-message');
    const statusText = document.getElementById('status-text');

    // Check if all required elements exist
    if (!jiraUrl1Input || !jiraUrl2Input || !jira1Label || !jira2Label || !shortcutDisplay || !saveSettingsBtn || !changeShortcutBtn || !statusMessage || !statusText) {
        console.error('One or more required DOM elements not found');
        return;
    }

    // Load saved settings
    chrome.storage.sync.get(['jiraUrl1', 'jiraUrl2', 'jira1Label', 'jira2Label'], function(result) {
        if (result.jiraUrl1) {
            jiraUrl1Input.value = result.jiraUrl1;
        }
        if (result.jiraUrl2) {
            jiraUrl2Input.value = result.jiraUrl2;
        }
        if (result.jira1Label) {
            jira1Label.value = result.jira1Label;
        }
        if (result.jira2Label) {
            jira2Label.value = result.jira2Label;
        }
    });

    // Get current shortcut setting
    chrome.commands.getAll(function(commands) {
        const toggleCommand = commands.find(cmd => cmd.name === 'toggle-feature');
        if (toggleCommand) {
            shortcutDisplay.textContent = toggleCommand.shortcut;
        } else {
            // Fallback to default if no shortcut is set
            shortcutDisplay.textContent = 'Alt+J';
        }
    });

    // Handle save settings
    saveSettingsBtn.addEventListener('click', function() {
        const jiraUrl1 = jiraUrl1Input.value.trim();
        const jiraUrl2 = jiraUrl2Input.value.trim();
        const jira1LabelValue = jira1Label.value.trim() || '1';
        const jira2LabelValue = jira2Label.value.trim() || '2';
        
        if (!jiraUrl1 && !jiraUrl2) {
            showStatus('Please enter at least one Jira URL', 'error');
            return;
        }

        chrome.storage.sync.set({ 
            jiraUrl1: jiraUrl1, 
            jiraUrl2: jiraUrl2,
            jira1Label: jira1LabelValue,
            jira2Label: jira2LabelValue
        }, function() {
            showStatus('Settings saved successfully', 'success');
        });
    });

    // Handle change shortcut button click
    changeShortcutBtn.addEventListener('click', function() {
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });



    // Helper function to show status messages
    function showStatus(message, type) {
        statusText.textContent = message;
        statusMessage.className = `alert alert-dismissible fade show alert-${type === 'success' ? 'success' : 'danger'}`;
        statusMessage.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
            statusMessage.classList.remove('show');
        }, 3000);
    }
});
