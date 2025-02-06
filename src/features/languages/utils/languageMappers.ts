import { LanguageType } from "@/features/languages/types/language.type";
import { LanguageStatusEnum } from "@/features/languages/types/languageStatus.enum";
import { AirtableRecordType } from "@/shared/types/airtableRecord.type";

export function transformAirtableRecordsToDetailedLanguages(
  records: AirtableRecordType[]
): LanguageType[] {
  return records.map(({ id, fields }) => {
    return mapFieldsToLanguage({ id, fields, includeDetails: true });
  });
}

export function transformAirtableRecordsToBasicLanguages(
  records: AirtableRecordType[]
): LanguageType[] {
  return records.map(({ id, fields }) => {
    return mapFieldsToLanguage({ id, fields });
  });
}

interface FieldsToLanguagesParams {
  id: string;
  fields: AirtableRecordType["fields"];
  includeDetails?: boolean;
}

function mapFieldsToLanguage({
  id,
  fields,
  includeDetails = false,
}: FieldsToLanguagesParams): LanguageType {
  const {
    "ISO 639-3": isoCode,
    "Official Name": officialName,
    "Alternate Names": alternateNames,
    Dialects: dialects,
    "Language Status": languageStatusString,
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
    status: mapStringToStatusEnum(languageStatusString as string),
    spokenInId: spokenInId as string[],
    writingSystemId: writingSystemId as string[],
    nationOfOriginId: nationOfOriginId as string[],
    ...(includeDetails && {
      alternateNames: alternateNames as string,
      dialects: dialects as string,
      statusNotes: statusNotes as string,
      genealogy: genealogy as string,
      demographics: demographics as string,
      use: languageUse as string,
      development: development as string,
      typology: typology as string,
      comments: comments as string,
      description: description as string,
    }),
  };
}

function mapStringToStatusEnum(status: string): LanguageStatusEnum {
  const statusMap: Record<string, LanguageStatusEnum> = {
    "1 - National": LanguageStatusEnum.NATIONAL,
    "2 - Provincial": LanguageStatusEnum.PROVINCIAL,
    "3 - Wider communication": LanguageStatusEnum.WIDER_COMMUNICATION,
    "4 - Educational": LanguageStatusEnum.EDUCATIONAL,
    "5 - Developing": LanguageStatusEnum.DEVELOPING,
    "6a - Vigorous": LanguageStatusEnum.VIGOROUS,
    "6b - Threatened": LanguageStatusEnum.THREATENED,
    "7 - Shifting": LanguageStatusEnum.SHIFTING,
    "8a - Moribund": LanguageStatusEnum.MORIBUND,
    "8b - Nearly extinct": LanguageStatusEnum.NEARLY_EXTINCT,
    "9 - Reawakening": LanguageStatusEnum.REAWAKENING,
    "9 - Second language only": LanguageStatusEnum.SECOND_LANGUAGE_ONLY,
    "10 - Extinct": LanguageStatusEnum.EXTINCT,
    "Unattested.": LanguageStatusEnum.UNATTESTED,
  };

  return statusMap[status] || LanguageStatusEnum.UNATTESTED;
}
