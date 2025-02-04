import { NextResponse } from "next/server";

import { mapAirtableRecordsToLanguages } from "@/features/languages/utils/languageMappers";
import { getAirtableRecords } from "@/shared/services/airtableAPI";

const LANGUAGES_TABLE_ID = process.env.LANGUAGES_TABLE_ID;
const PAGE_SIZE = 50;

if (!LANGUAGES_TABLE_ID) {
  throw new Error("Missing Airtable table ID for languages");
}

export async function GET(req: Request) {
  try {
    const queryParams = buildQueryParams(new URL(req.url).searchParams);
    const languageData = await getAirtableRecords({
      tableId: LANGUAGES_TABLE_ID!,
      queryParams,
    });

    return NextResponse.json({
      data: mapAirtableRecordsToLanguages(languageData.records),
      nextOffset: languageData.offset || null,
    });
  } catch (error) {
    return handleError(error);
  }
}

function buildQueryParams(
  searchParams: URLSearchParams
): Record<string, string> {
  const queryParams: Record<string, string> = {
    pageSize: PAGE_SIZE.toString(),
  };

  queryParams.filterByFormula = buildFilters(searchParams);

  const offset = searchParams.get("offset");
  if (offset) queryParams.offset = offset;

  return queryParams;
}

function buildFilters(searchParams: URLSearchParams): string {
  const filters: string[] = [];
  const filterFields = [
    { param: "code", field: "ISO 639-3" },
    { param: "name", field: "Official Name" },
    { param: "status", field: "Language Status" },
    { param: "nationOfOrigin", field: "Nation of Origin" },
    { param: "writingSystem", field: "Writing System" },
    { param: "spokenIn", field: "Principal in" },
  ];

  filterFields.forEach(({ param, field }) => {
    const value = searchParams.get(param) || "";
    filters.push(`(SEARCH(LOWER("${value}"), LOWER({${field}})) > 0)`);
  });

  return `AND(${filters[0]}, ${filters[1]}, ${filters[2]}, ${filters[3]}, ${filters[4]}, ${filters[5]})`;
}

function handleError(error: unknown) {
  return NextResponse.json(
    {
      message: "Failed to fetch language data",
      error: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}
