import { AirtableRecordType } from "@/types/airtableRecord";
import { LanguageType } from "@/types/language";
import { NationType } from "@/types/nation";
import { WritingSystemType } from "@/types/writingSystem";
import { transformNationIdsToNames } from "@/utils/nationMapper";
import { transformWritingSystemIdsToNames } from "@/utils/writingSystemMapper";

export function mapRawDataToLanguageType(
  rawData: AirtableRecordType[]
): LanguageType[] {
  return rawData.map(({ id, fields }) => ({
    id: id as string,
    code: fields["ISO 639-3"] as string,
    name: fields["Official Name"] as string,
    alternateNames: fields["Alternate Names"] as string,
    dialects: fields["Dialects"] as string,
    status: fields["Language Status"] as string,
    statusNotes: fields["Language Status Notes"] as string,
    genealogy: fields["Genealogy"] as string,
    demographics: fields["Demographics"] as string,
    use: fields["Language Use"] as string,
    development: fields["Language Development"] as string,
    typology: fields["Typology"] as string,
    comments: fields["Other Comments"] as string,
    description: fields["Description"] as string,
    spokenInId: fields["Principal in"] as string[],
    writingSystemId: fields["Writing System"] as string[],
    nationOfOriginId: fields["Nation of Origin"] as string[],
  }));
}

export function enrichLanguageDataWithNames(
  languages: LanguageType[],
  nations: NationType[],
  writingSystems: WritingSystemType[]
): LanguageType[] {
  return languages.map((language) => ({
    ...language,
    spokenIn: language.spokenInId
      ? transformNationIdsToNames(language.spokenInId, nations)
      : [],
    writingSystem: language.writingSystemId
      ? transformWritingSystemIdsToNames(
          language.writingSystemId,
          writingSystems
        )
      : [],
    nationOfOrigin: language.nationOfOriginId
      ? transformNationIdsToNames(language.nationOfOriginId, nations)
      : [],
  }));
}

export function findLanguageByCode(
  languages: LanguageType[],
  code: string
): LanguageType | undefined {
  const language = languages.find((language) => language.code === code);
  return language ?? undefined;
}
