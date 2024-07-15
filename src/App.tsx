// components/Input.tsx
import React from 'react';
import './App.css'
import { Input, LoadWord } from './components'
import useModeStore from './store/useStore';


const components = [
  {
    mode: 'neutro',
    component: <button>Introducir palabras</button>,
  },
  {
    mode: 'push',
    component: <Input />,
  },
  {
    mode: 'pull',
    component: <LoadWord/>,
  },
];

const App: React.FC = () => {
  const { mode, setMode } = useModeStore();

  const handleModeChange = (newMode: "neutro" | "push" | "pull") => {
    setMode(newMode);
  };

  const currentComponent = components.find(c => c.mode === mode)?.component;

  return (
    <div>
      <select value={mode} onChange={(e) => handleModeChange(e.target.value as "neutro" | "push" | "pull")}>
        <option value="neutro">Neutro</option>
        <option value="push">Push</option>
        <option value="pull">Pull</option>
      </select>
      <div>
        {currentComponent}
      </div>
    </div>
  );
};

export default App;