# Kanji Flashcard App

## Overview
The Kanji Flashcard App is a single-page application designed to help users learn Japanese characters, including Hiragana, Katakana, and Kanji. The application features a user-friendly interface with nested selection checkboxes that allow users to filter characters based on type and class, making it easier to focus on specific sets of characters.

## Features
- **Character Selection**: Users can select characters from different categories:
  - Hiragana
  - Katakana
  - Kanji
- **Class Filtering**: Users can filter characters by class (e.g., s-letters, t-letters) and JLPT levels for Kanji.
- **Flashcard Display**: Selected characters are displayed in a flashcard format, showing relevant details.

## Project Structure
```
japanese-flashcard-app
├── public
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── components
│   │   ├── Flashcard.tsx
│   │   └── CharacterSelector.tsx
│   ├── styles
│   │   └── main.scss
│   ├── data
│   │   └── characterData.ts
│   └── types
│       └── index.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/japanese-flashcard-app.git
   cd japanese-flashcard-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` to view the application.

## Technologies Used
- **React**: For building the user interface.
- **TypeScript**: For type safety and better development experience.
- **SCSS**: For styling the application.
- **Ant Design**: For UI components and design consistency.
- **Vite**: For fast development and build process.

## Future Enhancements
- Populate the character sets with actual Japanese characters and Kanji.
- Add user authentication for personalized learning experiences.
- Implement progress tracking for users to monitor their learning journey.