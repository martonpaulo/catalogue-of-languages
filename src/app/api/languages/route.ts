import { NextResponse } from "next/server";

import { buildAirtableApiFilters } from "@/features/languages/utils/languageFilters";
import { transformAirtableRecordsToBasicLanguages } from "@/features/languages/utils/languageMappers";
import { getAirtableRecords } from "@/shared/services/airtableAPI";
import { handleError } from "@/shared/utils/fetchErrorHandler";

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
      data: transformAirtableRecordsToBasicLanguages(languageData.records),
      nextOffset: languageData.offset || null,
    });
  } catch (error) {
    return handleError({ message: "Failed to fetch languages data", error });
  }
}

function buildQueryParams(
  searchParams: URLSearchParams
): Record<string, string> {
  const queryParams: Record<string, string> = {
    pageSize: PAGE_SIZE.toString(),
  };

  queryParams.filterByFormula = buildAirtableApiFilters(searchParams);

  const offset = searchParams.get("offset");
  if (offset) queryParams.offset = offset;

  return queryParams;
}
