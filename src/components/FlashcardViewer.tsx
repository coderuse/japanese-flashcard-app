import React from 'react';
import { Button } from 'antd';
import Flashcard from './Flashcard';
import { Character } from '../types';

interface FlashcardViewerProps {
  currentCharacter: Character | null;
  onNextCharacter: () => void;
  showNextButton: boolean;
  disableNextButton: boolean;
  message: string;
}

const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  currentCharacter,
  onNextCharacter,
  showNextButton,
  disableNextButton,
  message,
}) => {
  return (
    <div
      className="flashcard-display-area"
      style={{
        minWidth: '300px',
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textWrap: 'wrap',
      }}
    >
      {currentCharacter ? (
        <Flashcard
          key={currentCharacter.id}
          character={currentCharacter.character}
          details={`Type: ${currentCharacter.type}${
            currentCharacter.class ? `, Class: ${currentCharacter.class}` : ''
          }${
            currentCharacter.jlptLevel
              ? `, JLPT: N${currentCharacter.jlptLevel}`
              : ''
          }`}
        />
      ) : (
        <p style={{ marginTop: '20px' }}>{message}</p>
      )}

      {showNextButton && (
        <Button
          type="primary"
          onClick={onNextCharacter}
          disabled={disableNextButton}
        >
          Next Character
        </Button>
      )}
    </div>
  );
};

export default FlashcardViewer;