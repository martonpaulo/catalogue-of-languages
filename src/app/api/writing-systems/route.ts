import { NextResponse } from "next/server";

import { mapRawDataToWritingSystemType } from "@/features/writingSystems/utils/writingSystemMapper";
import { getAirtableRecords } from "@/shared/services/airtableAPI";

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
      data: mapRawDataToWritingSystemType(writingSystemData.records),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch writing system data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
