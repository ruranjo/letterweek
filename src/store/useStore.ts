// store.ts
import { create } from 'zustand';
import { Word } from '../interfaces/input.interface';
import { Mode } from '../interfaces/store.interface';


interface ModeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  wordsWithoutTranslate: Word[] | null;
  wordsWithTranslate: Word[] | null;
  setWordsWithoutTranslate: (words: Word[] | null) => void;
  setWordsWithTranslate: (words: Word[] | null) => void;
}

const useModeStore = create<ModeState>((set) => ({
  mode: "neutro",
  setMode: (mode) => set({ mode }),
  wordsWithoutTranslate: [],
  wordsWithTranslate: [],
  setWordsWithoutTranslate: (words) => set({ wordsWithoutTranslate: words }),
  setWordsWithTranslate: (words) => set({ wordsWithTranslate: words }),
}));

export default useModeStore;