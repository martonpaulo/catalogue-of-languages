import { NationType } from "@/features/nations/types/nation.type";
import { AirtableRecordType } from "@/shared/types/airtableRecord.type";

export function mapAirtableRecordsToNations(
  rawData: AirtableRecordType[]
): NationType[] {
  return rawData.map(({ id, fields }) => ({
    id: id as string,
    name: fields["Polities"] as string,
  }));
}

function findNationNameById(
  id: string,
  nations: NationType[]
): string | undefined {
  const nation = nations.find((n) => n.id === id);
  return nation?.name;
}

export function transformNationIdsToNames(
  ids: string[],
  nations: NationType[]
): string[] {
  return ids.map((id) => findNationNameById(id, nations) || id);
}
