import { NationType } from "@/types/nation";

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
