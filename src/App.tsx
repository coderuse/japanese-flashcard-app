import React, { useEffect, useState } from "react";
import CharacterSelector from "./components/CharacterSelector";
import FlashcardViewer from "./components/FlashcardViewer"; // Import the new component
import { Character } from "./types";
import { allJapaneseCharacters } from "./data/characterData";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

const App: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
    <div className="app">
      <h1>Kanji Flashcard Application</h1>
      <div
        style={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column-reverse",
          alignItems: isDesktop ? "flex-start" : "center",
          justifyContent: isDesktop ? "center" : "flex-start",
          width: "100%",
          gap: "2rem",
        }}
      >
        <div
          style={{
            height: "auto",
            width: "100%",
            maxWidth: "300px",
            overflowY: "auto",
            alignSelf: isDesktop ? "flex-start" : "center",
          }}
        >
          <CharacterSelector onChange={handleSelectionChange} />
        </div>

        <div
          style={{
            alignSelf: isDesktop ? "flex-start" : "center",
            width: "100%",
            maxWidth: "300px",
            minWidth: isDesktop ? "300px" : "auto",
            minHeight: "400px",
          }}
        >
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
    </div>
  );
};

export default App;
