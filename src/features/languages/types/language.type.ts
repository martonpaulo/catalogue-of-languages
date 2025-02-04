export type LanguageType = {
  id: string;
  code: string; // 'ISO 639-3'
  name: string; // 'Official Name'
  alternateNames?: string; // 'Alternate Names'
  dialects?: string; // 'Dialects'
  status?: string; // 'Language Status'
  statusNotes?: string; // 'Language Status Notes'
  genealogy?: string; // 'Genealogy'
  demographics?: string; // 'Demographics'
  use?: string; // 'Language Use'
  development?: string; // 'Language Development'
  typology?: string; // 'Typology'
  comments?: string; // 'Other Comments'
  description?: string; // 'Description'
  spokenInId?: string[];
  spokenIn?: string[]; // 'Principal in'
  writingSystemId?: string[];
  writingSystem?: string[]; // 'Writing System'
  nationOfOriginId?: string[];
  nationOfOrigin?: string[]; // 'Nation of Origin'
};
