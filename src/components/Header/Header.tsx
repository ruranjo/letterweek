import React from 'react';

interface HeaderProps {
  onSelect: (component: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSelect }) => {
  return (
    <div className="flex justify-around p-4 bg-gray-800 text-white">
      <button
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
        onClick={() => onSelect('tableWord')}
      >
        TableWord
      </button>
      <button
        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
        onClick={() => onSelect('gameSection')}
      >
        GameSection
      </button>
    </div>
  );
};

export default Header;