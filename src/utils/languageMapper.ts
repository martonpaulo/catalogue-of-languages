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
    status: fields["Language Status"] as string,
    spokenIn: fields["Principal in"] as string[],
    writingSystem: fields["Writing System"] as string[],
    nationOfOrigin: fields["Nation of Origin"] as string[],
  }));
}

export function enrichLanguageDataWithNames(
  languages: LanguageType[],
  nations: NationType[],
  writingSystems: WritingSystemType[]
): LanguageType[] {
  return languages.map((language) => ({
    ...language,
    spokenIn: language.spokenIn
      ? transformNationIdsToNames(language.spokenIn, nations)
      : [],
    writingSystem: language.writingSystem
      ? transformWritingSystemIdsToNames(language.writingSystem, writingSystems)
      : [],
    nationOfOrigin: language.nationOfOrigin
      ? transformNationIdsToNames(language.nationOfOrigin, nations)
      : [],
  }));
}
