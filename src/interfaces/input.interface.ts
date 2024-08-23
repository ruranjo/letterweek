export interface Word {
    ID: number;
    MainWord: string;
    BaseLanguageID: number;
    TranslateWord: string | null;
    LearningLanguageID: number;
  }

export interface Language {
    ID: number;
    Name: string;
    Flag: string;
}