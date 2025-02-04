import { NextResponse } from "next/server";

import { mapAirtableRecordsToLanguages } from "@/features/languages/utils/languageMappers";
import { getAirtableRecords } from "@/shared/services/airtableAPI";

const LANGUAGES_TABLE_ID = process.env.LANGUAGES_TABLE_ID;

if (!LANGUAGES_TABLE_ID) {
  throw new Error("Missing Airtable table ID for languages");
}

const PAGE_SIZE = 50;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const offset = searchParams.get("offset");

    const queryParams: Record<string, string> = {
      pageSize: PAGE_SIZE.toString(),
    };

    if (offset) queryParams.offset = offset;

    const languageData = await getAirtableRecords({
      tableId: LANGUAGES_TABLE_ID!,
      queryParams,
    });

    return NextResponse.json({
      data: mapAirtableRecordsToLanguages(languageData.records),
      nextOffset: languageData.offset || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch language data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
