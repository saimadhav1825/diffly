# Diffly - Next-Gen Diff Checker

A modern, feature-rich diff checker website built with Next.js, TypeScript, and Tailwind CSS. Compare text, code, files, and folders with a beautiful, intuitive interface.

## ✨ Features

### 🔤 Text Diff Checker
- Side-by-side and inline diff views
- Real-time diff detection while typing
- Color-coded highlighting (green for added, red for removed, yellow for changed)
- Auto-scroll sync between panes
- Copy to clipboard functionality

### 💻 Code Diff Checker
- Syntax highlighting for 20+ programming languages
- Monaco Editor integration (VS Code editor)
- Line numbers and minimap
- Ignore whitespace changes option
- Expand/collapse unchanged code sections
- Smooth animations when diffs appear

### 📁 File Diff Checker
- Upload and compare files up to 10MB
- Support for various file types (txt, json, xml, html, css, js, etc.)
- File content preview
- Export diff results
- Secure file handling (no server storage)

### 📂 Folder Diff Checker
- Upload and compare zipped folders
- Tree-view with expandable/collapsible folders
- File structure comparison
- Highlight new, missing, and modified files

### 🎨 UI/UX Features
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Keyboard Shortcuts**: 
  - `Ctrl + Enter`: Compare/Process diff
  - `Ctrl + C`: Copy to clipboard
  - `Ctrl + K`: Clear all content
  - `Ctrl + E`: Export diff result
  - `Ctrl + D`: Toggle dark/light mode
- **Smooth Animations**: Framer Motion animations throughout the interface
- **Accessibility**: High-contrast mode and keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd diffly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **Diff Engine**: diff-match-patch and jsdiff
- **Icons**: Lucide React
- **Fonts**: Inter (UI) and JetBrains Mono (Code)

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Homepage with tabbed interface
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   └── tabs.tsx
│   ├── hero-section.tsx     # Landing page hero
│   ├── navigation.tsx       # Main navigation
│   ├── text-diff.tsx        # Text comparison component
│   ├── code-diff.tsx        # Code comparison component
│   ├── file-diff.tsx        # File upload and comparison
│   ├── folder-diff.tsx      # Folder comparison component
│   ├── features-section.tsx # Features showcase
│   ├── footer.tsx           # Site footer
│   ├── keyboard-shortcuts.tsx # Shortcuts modal
│   └── theme-provider.tsx   # Theme context provider
├── hooks/
│   └── use-keyboard-shortcuts.ts # Keyboard shortcuts hook
└── lib/
    └── utils.ts             # Utility functions
```

## 🎯 Key Features Implemented

### ✅ Core Functionalities
- [x] Text Diff Checker with side-by-side and inline views
- [x] Code Diff Checker with Monaco Editor and syntax highlighting
- [x] File Diff Checker with upload functionality
- [x] Folder Diff Checker with tree view (demo implementation)
- [x] Dark/Light mode toggle
- [x] Copy to clipboard functionality
- [x] Export diff results
- [x] Keyboard shortcuts
- [x] Responsive design
- [x] Smooth animations with Framer Motion

### 🎨 Design Features
- [x] Modern, clean UI with Tailwind CSS
- [x] Custom color palette for diff highlighting
- [x] Inter font for UI, JetBrains Mono for code
- [x] Smooth transitions and hover effects
- [x] Mobile-first responsive design
- [x] Accessibility features

## 🚀 Deployment

The application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

## 🔮 Future Enhancements

- [ ] Real folder diff implementation with JSZip
- [ ] Shareable links for diff results
- [ ] PDF and DOCX export functionality
- [ ] User accounts and diff history
- [ ] API endpoints for programmatic access
- [ ] Advanced diff algorithms
- [ ] Collaborative diff viewing
- [ ] Integration with Git repositories

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.