import React from "react";

interface FlashcardProps {
  character: string;
  details: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ character, details }) => {
  return (
    <div className="flashcard">
      <h2 className="flashcard-character">{character}</h2>
      {/* <p className="flashcard-details">{details}</p> */}
    </div>
  );
};

export default Flashcard;
