import React, { useState, ChangeEvent } from 'react';
import useModeStore from '../../store/useStore';

interface Props {}

const Input: React.FC<Props> = () => {
  const { setMode, setWordsWithTranslate, setWordsWithoutTranslate } = useModeStore();
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const maxLength = 5000;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      console.log(response)
      console.log(data)
      if (response.ok && (data.wordswithouttranslate || data.wordswithtranslate)) {
        setWordsWithoutTranslate(data.wordswithouttranslate);
        setWordsWithTranslate(data.wordswithtranslate);
        
      } else {
        console.error('Error en la respuesta del servidor:', data);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    } finally {
      setIsLoading(false);
      setMode('pull');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Entrada de Texto</h1>
      <label className="mb-2 text-customPrimary font-medium">
        Puedes escribir hasta {maxLength} caracteres
      </label>
      <textarea
        className="w-full max-w-2xl h-96 p-4 border text-black rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-customPrimary"
        maxLength={maxLength}
        value={text}
        onChange={handleChange}
        placeholder="Escribe aquí tu párrafo..."
      />
      <div className="mt-2 text-customPrimary font-medium">
        {text.length}/{maxLength} caracteres
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-customPrimary text-white font-bold rounded hover:bg-customPrimary-dark focus:outline-none focus:ring-2 focus:ring-customPrimary focus:ring-opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>
      {isLoading && <div className="mt-4">Cargando...</div>}
    </div>
  );
};

export default Input;
