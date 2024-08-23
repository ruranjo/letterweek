import React, { useState } from 'react';
import { GameSection, Header, TableWord } from './components';



const App: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('tableWord');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'tableWord':
        return <TableWord />;
      case 'gameSection':
        return <GameSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header onSelect={setSelectedComponent} />
      <div className="p-4 ">
        {renderComponent()}
      </div>
    </div>
  );
};

export default App;