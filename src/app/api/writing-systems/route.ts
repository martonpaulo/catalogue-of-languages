import { NextResponse } from "next/server";

import { mapAirtableRecordsToWritingSystems } from "@/features/writingSystems/utils/writingSystemMapper";
import { getAirtableRecords } from "@/shared/services/airtableAPI";
import { handleError } from "@/shared/utils/fetchErrorHandler";

const WRITING_SYSTEMS_TABLE_ID = process.env.WRITING_SYSTEMS_TABLE_ID;

if (!WRITING_SYSTEMS_TABLE_ID) {
  throw new Error("Missing Airtable table ID for writing systems");
}

export async function GET() {
  try {
    const writingSystemData = await getAirtableRecords({
      tableId: WRITING_SYSTEMS_TABLE_ID!,
      fetchAll: true,
    });

    return NextResponse.json({
      data: mapAirtableRecordsToWritingSystems(writingSystemData.records),
    });
  } catch (error) {
    return handleError({
      message: "Failed to fetch writing systems data",
      error,
    });
  }
}
