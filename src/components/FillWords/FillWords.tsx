import React, { useState, useEffect, useRef } from 'react';
import useModeStore from '../../store/useStore';
import { OPTIONS } from '../../utils/constants';
import { Word } from '../../interfaces/input.interface';

interface Props {
  option: string;
}

const FillWords: React.FC<Props> = ({ option }) => {
  const { wordsWithoutTranslate, wordsWithTranslate, setWordsWithTranslate, setWordsWithoutTranslate } = useModeStore();
  const { setMode } = useModeStore();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wordsList, setWordsList] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [translatedCount, setTranslatedCount] = useState(0);
  const [totalWordsCount, setTotalWordsCount] = useState(0);
  const [deletedWords, setDeletedWords] = useState<Word[]>([]);
  const translationRef = useRef<HTMLInputElement>(null);

  const initializeWordsList = () => (
    option === OPTIONS.WITH ? wordsWithTranslate : wordsWithoutTranslate
  );

  useEffect(() => {
    const list = initializeWordsList() || [];
    setWordsList(list);
    setTotalWordsCount(list.length);
  }, [option, wordsWithTranslate, wordsWithoutTranslate]);

  const handleSendWords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/filledwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordsList,
          deletedWords
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Respuesta del servidor:', data);
        // Actualiza wordsWithTranslate concatenando los elementos de wordsList
        const auxwordsWithTranslate = wordsWithTranslate as Word[];
         // Crea un conjunto de palabras traducidas sin duplicados
      const combinedWordsList = [...auxwordsWithTranslate, ...wordsList];
      const uniqueWordsList = Array.from(
        new Map(combinedWordsList.map((word) => [word.MainWord, word])).values()
      );

      setWordsWithTranslate(uniqueWordsList);

      // Limpia wordsWithoutTranslate
      setWordsWithoutTranslate([]);
      } else {
        console.error('Error en la respuesta del servidor:', data);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    } finally {
      setIsLoading(false);
      setMode('neutro');
    }
  };

  const handleNext = () => {
    const translation = translationRef.current?.value.trim() || '';
    if (translation) {
      const updatedWordsList = [...wordsList];
      updatedWordsList[currentWordIndex].TranslateWord = translation;

      setWordsList(updatedWordsList);
      if (translationRef.current) translationRef.current.value = '';
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setTranslatedCount((prevCount) => prevCount + 1);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setTranslatedCount( (prevIndex) => prevIndex - 1)
      setCurrentWordIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleDeleteWord = () => {
    if (wordsList.length === 0) return;
  
    // Eliminar la palabra actual de la lista y agregarla a la lista de eliminadas
    const wordToDelete = wordsList[currentWordIndex];
    setDeletedWords((prevDeletedWords) => [...prevDeletedWords, wordToDelete]);
  
    // Filtrar la lista para eliminar la palabra actual
    const updatedWordsList = wordsList.filter((_, index) => index !== currentWordIndex);
    setWordsList(updatedWordsList);
    setTotalWordsCount(updatedWordsList.length);
  
    // Ajustar el índice actual
    if (updatedWordsList.length === 0) {
      // Si la lista está vacía, restablecer el índice a 0
      setCurrentWordIndex(0);
      handleSendWords();
    } else if (currentWordIndex >= updatedWordsList.length) {
      // Si el índice actual es mayor o igual que la longitud de la lista actualizada,
      // retroceder al último índice válido
      setCurrentWordIndex(updatedWordsList.length - 1);
    } else {
      // Mantener el índice actual si es válido
      setCurrentWordIndex(currentWordIndex);
    }
  };
  

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleNext();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <p className="text-lg">Cargando...</p>
          {/* Puedes agregar aquí un spinner o un indicador de carga */}
        </div>
      </div>
    );
  }

  if (!wordsList.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <p className="text-lg">No hay palabras disponibles.</p>
        </div>
      </div>
    );
  }

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
                ref={translationRef}
                onKeyPress={handleKeyPress}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Introduce la traducción"
              />
            </div>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={handlePrevious}
                className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                disabled={currentWordIndex === 0}
              >
                Anterior
              </button>
              <button
                onClick={handleDeleteWord}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Eliminar Palabra
              </button>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Siguiente
            </button>
          </>
        ) : (
          <>
            <p className="text-lg">¡Todas las palabras han sido traducidas!</p>
            <button
              onClick={handleSendWords}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
            >
              Finalizar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FillWords;
