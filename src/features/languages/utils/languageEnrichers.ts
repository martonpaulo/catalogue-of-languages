import { LanguageType } from "@/features/languages/types/language.type";
import { NationType } from "@/features/nations/types/nation.type";
import { transformNationIdsToNames } from "@/features/nations/utils/nationMappers";
import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";
import { transformWritingSystemIdsToNames } from "@/features/writingSystems/utils/writingSystemMapper";

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
