import { AirtableRecordType } from "@/types/airtableRecord";
import { NationType } from "@/types/nation";

export function mapRawDataToNationType(
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
