import React, { useState } from 'react';
import useModeStore from '../../store/useStore';
import { FillWords } from '../FillWords';
import { OPTIONS } from '../../utils/constants';



const LoadWord: React.FC = () => {
  const { wordsWithoutTranslate, wordsWithTranslate } = useModeStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [option, setOption] = useState<string | null>(null);

  const handlePlay = (opc: string) => {
    console.log('¡Botón Jugar presionado!');
    setIsPlaying(true);
    setOption(opc);
  };

  const hasWordsWithoutTranslate = wordsWithoutTranslate && wordsWithoutTranslate.length > 0;
  const hasWordsWithTranslate = wordsWithTranslate && wordsWithTranslate.length > 0;

  const renderCard = (title: string, count: number, disabled: boolean, opc: string) => (
    <div key={opc} className='flex flex-col justify-center items-center bg-blue-300 p-4 gap-4 rounded-md'>
      <h2 className="text-lg font-bold text-gray-900">{title.toUpperCase()}</h2>
      <span className='text-5xl text-gray-900'>{count}</span>
      <button
        className={`px-4 py-2 w-full text-white font-semibold rounded ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
        }`}
        onClick={!disabled ? () => handlePlay(opc) : undefined}
        disabled={disabled}
      >
        Jugar
      </button>
    </div>
  );

  return (
    <>
      {!isPlaying && (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex gap-4 bg-white p-6 rounded-lg shadow-lg">
            {renderCard("Palabras sin traducción", wordsWithoutTranslate?.length || 0, !hasWordsWithoutTranslate, OPTIONS.WITHOUT)}
            {renderCard("Palabras con traducción", wordsWithTranslate?.length || 0, !hasWordsWithTranslate, OPTIONS.WITH)}
          </div>
        </div>
      )}
      {isPlaying && option && <FillWords option={option} />}
    </>
  );
};

export default LoadWord;
