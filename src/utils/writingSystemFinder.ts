import { WritingSystemType } from "@/types/writingSystem";

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
