import useModeStore from "../../store/useStore";
import { Input } from "../Input";
import { LanguageSelector } from "../LanguageSelector";
import { LoadWord } from "../LoadWord";

const components = [
    {
      mode: 'neutro',
      component: <LanguageSelector/>,
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


const GameSection = () => {
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
}

export default GameSection