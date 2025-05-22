import React, { useState } from "react";
import CharacterSelector from "./components/CharacterSelector";
import FlashcardViewer from "./components/FlashcardViewer"; // Import the new component
import { Character } from "./types";
import { allJapaneseCharacters } from "./data/characterData";

const App: React.FC = () => {
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(
    null
  );

  const getRandomCharacter = (characters: Character[]): Character | null => {
    if (characters.length === 0) {
      return null;
    }
    if (characters.length === 1) {
      return characters[0];
    }
    let newChar;
    do {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newChar = characters[randomIndex];
    } while (
      currentCharacter &&
      newChar.id === currentCharacter.id &&
      characters.length > 1
    );
    return newChar;
  };

  const handleSelectionChange = (selectedCharacterIds: string[]) => {
    if (selectedCharacterIds.length === 0) {
      setFilteredCharacters([]);
      setCurrentCharacter(null);
      return;
    }

    const newFilteredCharacters = allJapaneseCharacters.filter((char) => {
      // Check if the character's ID (converted to string) is in the selectedCharacterIds array
      return selectedCharacterIds.includes(char.id.toString());
    });

    setFilteredCharacters(newFilteredCharacters);
    setCurrentCharacter(getRandomCharacter(newFilteredCharacters));
  };

  const handleNextCharacter = () => {
    if (filteredCharacters.length > 0) {
      setCurrentCharacter(getRandomCharacter(filteredCharacters));
    }
  };

  const getDisplayMessage = () => {
    if (filteredCharacters.length === 0 && !currentCharacter) {
      // Check if initial state or filters cleared
      return "Select character types or classes to display flashcards.";
    }
    if (filteredCharacters.length > 0 && !currentCharacter) {
      // Should not happen if logic is correct, but as a fallback
      return "No character selected. Click Next or change selection.";
    }
    if (filteredCharacters.length > 0 && currentCharacter) {
      return ""; // No message needed if a character is displayed
    }
    // This case implies filters are selected, but newFilteredCharacters was empty
    return "No characters match the current selection.";
  };

  return (
    <>
      <h1>Kanji Flashcard Application</h1>
      <div
        className="app"
        style={{
          display: "flex",
          alignItems: "flex-start", // Change from "center" to "flex-start"
          justifyContent: "center", // Keep horizontally centered
          width: "100%", // Take full width of parent
          gap: "2rem", // Add spacing between components
        }}
      >
        <div
          style={{
            height: "auto",
            minWidth: "300px",
            overflowY: "auto",
            alignSelf: "flex-start",
          }}
        >
          <CharacterSelector onChange={handleSelectionChange} />
        </div>

        <div style={{ alignSelf: "flex-start" }}>
          <FlashcardViewer
            currentCharacter={currentCharacter}
            onNextCharacter={handleNextCharacter}
            showNextButton={filteredCharacters.length > 0}
            disableNextButton={
              filteredCharacters.length <= 1 && currentCharacter !== null
            }
            message={getDisplayMessage()}
          />
        </div>
      </div>
    </>
  );
};

export default App;
