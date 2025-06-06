document.addEventListener('DOMContentLoaded', function() {
    // Optimize DOM manipulation by caching elements
    const url1Input = document.getElementById('url1');
    const url2Input = document.getElementById('url2');
    const url1Label = document.getElementById('url1-label');
    const url2Label = document.getElementById('url2-label');
    const shortcutDisplay = document.getElementById('shortcut-display');
    const saveSettingsBtn = document.getElementById('save-settings');
    const changeShortcutBtn = document.getElementById('change-shortcut-btn');

    if (!url1Input || !url2Input || !url1Label || !url2Label || !shortcutDisplay || !saveSettingsBtn || !changeShortcutBtn) {
        console.error('One or more required DOM elements are missing or inaccessible');
        return;
    }

    // Load saved settings with error handling
    chrome.storage.sync.get(['url1', 'url2', 'url1Label', 'url2Label'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError);
            return;
        }

        if (result.url1) {
            url1Input.value = result.url1;
        }
        if (result.url2) {
            url2Input.value = result.url2;
        }
        if (result.url1Label) {
            url1Label.value = result.url1Label;
        }
        if (result.url2Label) {
            url2Label.value = result.url2Label;
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
        const url1 = url1Input.value.trim();
        const url2 = url2Input.value.trim();
        const url1LabelValue = url1Label.value.trim() || '1';
        const url2LabelValue = url2Label.value.trim() || '2';

        if (!url1 && !url2) {
            updateButtonState('error', 'Error');
            return;
        }

        chrome.storage.sync.set({
            url1: url1,
            url2: url2,
            url1Label: url1LabelValue,
            url2Label: url2LabelValue
        }, function() {
            if (chrome.runtime.lastError) {
                updateButtonState('error', 'Error');
            } else {
                updateButtonState('success', 'Success');
                // Notify overlays to update tab labels
                chrome.runtime.sendMessage({ action: 'updateTabLabels' });
            }
        });
    });

    // Handle change shortcut button click
    changeShortcutBtn.addEventListener('click', function() {
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });

    function updateButtonState(state, text) {
        saveSettingsBtn.textContent = text;
        saveSettingsBtn.style.backgroundColor = state === 'success' ? '#e6f7e6' : '#fbe6e6';
        saveSettingsBtn.style.color = state === 'success' ? '#2d7a2d' : '#a12d2d';
        saveSettingsBtn.style.padding = '10px 20px'; // Ensure consistent button size
        saveSettingsBtn.style.fontSize = '1em';

        setTimeout(() => {
            saveSettingsBtn.textContent = 'Save Settings';
            saveSettingsBtn.style.backgroundColor = '#2196F3';
            saveSettingsBtn.style.color = '#fff';
        }, 3000);
    }
});
