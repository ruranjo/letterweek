import React, { useState, useEffect } from 'react';
import { Language } from '../../interfaces/input.interface';
import useModeStore from '../../store/useStore';

const LanguageSelector: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filteredBaseLanguages, setFilteredBaseLanguages] = useState<Language[]>([]);
  const [filteredLearningLanguages, setFilteredLearningLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // New state for button

  const {
    baseLanguage,
    learningLanguage,
    setBaseLanguage,
    setLearningLanguage,
    setMode
  } = useModeStore();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('http://localhost:3000/languages');
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        if (contentType && contentType.includes('application/json')) {
          const data: Language[] = await response.json();
          setLanguages(data);
          setFilteredBaseLanguages(data);
          setFilteredLearningLanguages(data);
        } else {
          throw new Error('Response was not JSON');
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    if (baseLanguage) {
      setFilteredLearningLanguages(languages.filter(lang => lang.ID !== baseLanguage.ID));
      setIsButtonDisabled(!learningLanguage); // Enable button if both languages are selected
    } else {
      setFilteredLearningLanguages([]);
      setIsButtonDisabled(true); // Disable button if baseLanguage is not selected
    }
  }, [baseLanguage, languages, learningLanguage]);

  useEffect(() => {
    if (learningLanguage) {
      setFilteredBaseLanguages(languages.filter(lang => lang.ID !== learningLanguage.ID));
      setIsButtonDisabled(!baseLanguage); // Enable button if both languages are selected
    } else {
      setFilteredBaseLanguages(languages);
      setIsButtonDisabled(true); // Disable button if learningLanguage is not selected
    }
  }, [learningLanguage, languages, baseLanguage]);

  const handleBaseLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguageID = parseInt(event.target.value);
    const selectedLanguage = languages.find(lang => lang.ID === selectedLanguageID) || null;
    if (selectedLanguage && selectedLanguage.ID !== learningLanguage?.ID) {
      setBaseLanguage(selectedLanguage);
      if (learningLanguage && learningLanguage.ID === selectedLanguage.ID) {
        setLearningLanguage(null); // Clear learning language if it's the same as the new base language
      }
    }
  };

  const handleLearningLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguageID = parseInt(event.target.value);
    const selectedLanguage = languages.find(lang => lang.ID === selectedLanguageID) || null;
    if (selectedLanguage && selectedLanguage.ID !== baseLanguage?.ID) {
      setLearningLanguage(selectedLanguage);
    }
  };

  const handleConfirm = () => {
    // Implement the action to take upon confirmation
    setMode("push")
    // Additional actions, like saving or processing the selected languages, can be added here
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="mb-4">
        <label htmlFor="base-language" className="block text-gray-700 font-bold mb-2">
          Base Language:
        </label>
        <select
          id="base-language"
          value={baseLanguage ? baseLanguage.ID : ''}
          onChange={handleBaseLanguageChange}
          className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          <option value="">Select a language</option>
          {filteredBaseLanguages.map((language) => (
            <option key={language.ID + language.Flag} value={language.ID}>
              {language.Flag} - {language.Name}
            </option>
          ))}
          
        </select>
        
      </div>

      <div>
        <label htmlFor="learning-language" className="block text-gray-700 font-bold mb-2">
          Learning Language:
        </label>
        <select
          id="learning-language"
          value={learningLanguage ? learningLanguage.ID : ''}
          onChange={handleLearningLanguageChange}
          disabled={!baseLanguage} // Disable if baseLanguage is not selected
          className={`block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${!baseLanguage ? 'cursor-not-allowed' : ''}`}
        >
          <option value="">Select a language</option>
          {filteredLearningLanguages.map((language) => (
            <option key={language.ID} value={language.ID}>
              {language.Flag} - {language.Name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleConfirm}
          disabled={isButtonDisabled}
          className={`py-2 px-4 rounded-lg font-bold ${isButtonDisabled ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors duration-300`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
