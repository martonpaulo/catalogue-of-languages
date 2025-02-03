import { AirtableRecordType } from "@/types/airtableRecord";
import { WritingSystemType } from "@/types/writingSystem";

export function mapRawDataToWritingSystemType(
  rawData: AirtableRecordType[]
): WritingSystemType[] {
  return rawData.map(({ id, fields }) => ({
    id: id as string,
    name: fields["Name"] as string,
  }));
}

function findWritingSystemNameById(
  id: string,
  writingSystems: WritingSystemType[]
): string | undefined {
  const writingSystem = writingSystems.find((n) => n.id === id);
  return writingSystem?.name;
}

export function transformWritingSystemIdsToNames(
  ids: string[],
  writingSystems: WritingSystemType[]
): string[] {
  return ids.map((id) => findWritingSystemNameById(id, writingSystems) || id);
}
