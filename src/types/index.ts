export interface Character {
  id: number;
  character: string;
  type: "hiragana" | "katakana" | "kanji";
  class?: string; // e.g., 's-letters', 't-letters'
  jlptLevel?: number; // e.g., 1, 2, 3, 4, 5 for JLPT levels
}

export interface CharacterSelection {
  selectedCharacters: Character[];
  selectedTypes: ("hiragana" | "katakana" | "kanji")[];
  selectedClasses: string[];
  selectedJLPTLevels: number[];
}

export interface CharacterType {
  label: string;
  value: "hiragana" | "katakana" | "kanji";
}

export interface CharacterClass {
  label: string;
  value: string; // e.g., 's-letters', 't-letters'
}
