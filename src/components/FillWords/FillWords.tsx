import React, { useState, useEffect, useRef } from 'react';
import useModeStore from '../../store/useStore';
import { OPTIONS } from '../../utils/constants';
import { Word } from '../../interfaces/input.interface';

interface Props {
  option: string;
}

const FillWords: React.FC<Props> = ({ option }) => {
  const { wordsWithoutTranslate, wordsWithTranslate } = useModeStore();
  
  const initializeWordsList = () => (
    option === OPTIONS.WITH ? wordsWithTranslate : wordsWithoutTranslate
  );

  const [wordsList, setWordsList] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [translatedCount, setTranslatedCount] = useState(0);
  const [totalWordsCount, setTotalWordsCount] = useState(0);
  const translationRef = useRef('');

  useEffect(() => {
    const list = initializeWordsList() || [];
    setWordsList(list);
    setTotalWordsCount(list.length);
  }, []);

  const handleNext = () => {
    const translation = translationRef.current.trim();
    if (translation) {
      const updatedWordsList = [...wordsList];
      updatedWordsList[currentWordIndex].TranslateWord = translation;

      setWordsList(updatedWordsList);
      translationRef.current = '';
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setTranslatedCount((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleNext();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  if (!wordsList.length) {
    return <div>Loading...</div>;
  }

  console.log("wordsList: ", wordsList)
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {option === OPTIONS.WITH ? 'TRADUZCA LAS PALABRAS' : 'RELLENA LAS PALABRAS CON SU TRADUCCIÓN'}
        </h1>
        <div className="mb-4">
          <div className="w-full bg-gray-200 h-4 rounded-full">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${(translatedCount / totalWordsCount) * 100}%` }}
            ></div>
          </div>
          <p className="text-right mt-2">{translatedCount}/{totalWordsCount}</p>
        </div>
        {currentWordIndex < totalWordsCount ? (
          <>
            <div className="mb-4">
              <p className="text-lg">{wordsList[currentWordIndex].MainWord}</p>
            </div>
            <div className="mb-4">
              <input
                type="text"
                ref={(input) => {
                  if (input) input.value = translationRef.current;
                }}
                onChange={(e) => (translationRef.current = e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Introduce la traducción"
              />
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Siguiente
            </button>
          </>
        ) : (
          <p className="text-lg">¡Todas las palabras han sido traducidas!</p>
        )}
      </div>
    </div>
  );
};

export default FillWords;
