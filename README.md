# 🦗 Grasshopper Chrome Extension

A modern Chrome extension for quick Jira ticket navigation with an intuitive grasshopper-themed UI powered by Bootstrap 5.3.6.

## ✨ Features

### 🎯 Core Functionality
- **Quick Ticket Navigation**: Instantly open Jira tickets with keyboard shortcuts
- **Dual Project Support**: Configure two different Jira URLs for seamless project switching
- **Smart Tab Management**: Animated grasshopper head that follows your active project selection
- **Custom Labels**: Personalize project names for easy identification

### 🎨 Modern UI/UX
- **Bootstrap 5.3.6 Integration**: Professional, responsive design with modern themes
- **Bootstrap Icons**: Crisp, scalable icons throughout the interface
- **Animated Interactions**: Smooth transitions and hover effects
- **Accessible Design**: Full keyboard navigation and screen reader support
- **Mobile-First**: Responsive design that works on different screen sizes

### 🦗 Grasshopper Theme
- **Animated Eyes**: The grasshopper's eyes track your active project tab
- **Professional Styling**: Clean, modern interface with grasshopper branding
- **Visual Feedback**: Color-coded project cards and intuitive navigation

### ⚙️ Advanced Configuration
- **Customizable Shortcuts**: Easy keyboard shortcut modification through Chrome settings
- **Persistent Settings**: Your preferences are saved and synced across devices
- **Error Handling**: Comprehensive validation with helpful error messages
- **Chrome Extension Best Practices**: Manifest v3 compliant with secure CSP

## 🚀 Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this directory
4. The Grasshopper extension will appear in your toolbar

## 🎮 Usage

### Initial Setup
1. Click the Grasshopper icon in your Chrome toolbar
2. Configure your Project URLs:
   - **Project 1**: Enter your primary Jira URL (e.g., `https://company.atlassian.net/browse/`)
   - **Project 2**: Enter your secondary Jira URL
3. Set custom labels for easy project identification
4. Save your settings

### Quick Navigation
1. Use the keyboard shortcut (default: `Alt+Shift+J`) or click the extension icon
2. Watch the grasshopper's eyes track your project selection
3. Type your ticket number
4. Press `Enter` to open the ticket in a new tab
5. Use `Tab` to switch between projects, or `Esc` to close

### Customizing Shortcuts
1. In the extension popup, click the "Change" button next to the keyboard shortcut
2. Chrome will open the shortcuts configuration page
3. Set your preferred key combination

## 🏗️ Technical Details

### Architecture
- **Manifest Version**: 3 (latest Chrome extension standard)
- **Framework**: Bootstrap 5.3.6 with custom CSS enhancements
- **Icons**: Bootstrap Icons 1.11.0
- **Permissions**: Minimal required permissions for security
- **Storage**: Chrome sync storage for cross-device settings

### Files Structure
```
├── manifest.json          # Extension configuration
├── background.js           # Service worker for extension logic
├── popup.html             # Settings interface (Bootstrap themed)
├── popup.js               # Settings functionality
├── overlay.html           # Ticket input interface
├── overlay.js             # Input handling and navigation
├── styles.css             # Custom Bootstrap enhancements
├── icons/                 # Extension icons
└── README.md              # This file
```

### Bootstrap Integration
- **CDN**: Uses Bootstrap 5.3.6 and Bootstrap Icons from jsDelivr CDN
- **Components**: Cards, buttons, forms, alerts, badges, and input groups
- **Theming**: Custom CSS variables and utility classes
- **Animations**: CSS transitions and keyframe animations
- **Responsive**: Mobile-first design with responsive breakpoints

## 🔧 Development

### Prerequisites
- Chrome browser (version 88+)
- Basic knowledge of HTML, CSS, and JavaScript
- Understanding of Chrome extension development

### Customization
The extension uses Bootstrap's utility classes extensively. You can customize:
- **Colors**: Modify Bootstrap color variables in `styles.css`
- **Animations**: Adjust CSS transitions and keyframes
- **Layout**: Update Bootstrap grid and spacing classes
- **Icons**: Replace Bootstrap Icons with your preferred icon set

### Security
- **Content Security Policy**: Strict CSP prevents XSS attacks
- **Minimal Permissions**: Only requests necessary permissions
- **Input Validation**: Comprehensive validation for ticket numbers
- **Error Handling**: Graceful error handling with user feedback

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Bug Reports

If you encounter any issues, please report them on the GitHub issues page with:
- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior

---

**Made with 💚 and Bootstrap 5.3.6** 🦗  
