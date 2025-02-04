import { LanguageType } from "@/features/languages/types/language.type";
import { AirtableRecordType } from "@/shared/types/airtableRecord.type";

export function mapAirtableRecordsToLanguages(
  records: AirtableRecordType[]
): LanguageType[] {
  return records.map(({ id, fields }) => {
    const {
      "ISO 639-3": isoCode,
      "Official Name": officialName,
      "Alternate Names": alternateNames,
      Dialects: dialects,
      "Language Status": status,
      "Language Status Notes": statusNotes,
      Genealogy: genealogy,
      Demographics: demographics,
      "Language Use": languageUse,
      "Language Development": development,
      Typology: typology,
      "Other Comments": comments,
      Description: description,
      "Principal in": spokenInId,
      "Writing System": writingSystemId,
      "Nation of Origin": nationOfOriginId,
    } = fields;

    return {
      id: id as string,
      code: isoCode as string,
      name: officialName as string,
      alternateNames: alternateNames as string,
      dialects: dialects as string,
      status: status as string,
      statusNotes: statusNotes as string,
      genealogy: genealogy as string,
      demographics: demographics as string,
      use: languageUse as string,
      development: development as string,
      typology: typology as string,
      comments: comments as string,
      description: description as string,
      spokenInId: spokenInId as string[],
      writingSystemId: writingSystemId as string[],
      nationOfOriginId: nationOfOriginId as string[],
    };
  });
}
