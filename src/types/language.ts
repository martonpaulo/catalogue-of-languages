export type LanguageType = {
  id: string;
  code: string; // 'ISO 639-3'
  name: string; // 'Official Name'
  status?: string; // 'Language Status'
  spokenIn?: string[]; // 'Principal in + Territories'
  writingSystem?: string[]; // 'Writing System'
  nationOfOrigin?: string[]; // 'Nation of Origin'
};
