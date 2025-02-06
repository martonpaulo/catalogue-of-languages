import { NextRequest, NextResponse } from "next/server";

import { transformAirtableRecordsToDetailedLanguages } from "@/features/languages/utils/languageMappers";
import { getAirtableRecords } from "@/shared/services/airtableAPI";
import { handleError } from "@/shared/utils/fetchErrorHandler";

const LANGUAGES_TABLE_ID = process.env.LANGUAGES_TABLE_ID;

if (!LANGUAGES_TABLE_ID) {
  throw new Error("Missing Airtable table ID for languages");
}

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(request: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const { code } = params;

    const queryParams = {
      filterByFormula: `LOWER("${code}")=LOWER({ISO 639-3})`,
    };

    const languageData = await getAirtableRecords({
      tableId: LANGUAGES_TABLE_ID!,
      queryParams,
    });

    const mappedLanguages = transformAirtableRecordsToDetailedLanguages(
      languageData.records
    );
    return NextResponse.json({
      data: mappedLanguages.length > 0 ? mappedLanguages[0] : null,
    });
  } catch (error) {
    return handleError({ message: "Failed to fetch language data", error });
  }
}
