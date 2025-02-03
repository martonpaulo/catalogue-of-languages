import { NextResponse } from "next/server";

import { getAirtableRecords } from "@/services/airtableService";
import { mapRawDataToNationType } from "@/utils/nationMapper";

const NATIONS_TABLE_ID = process.env.NATIONS_TABLE_ID;

if (!NATIONS_TABLE_ID) {
  throw new Error("Missing Airtable table ID for nations");
}

export async function GET() {
  try {
    const nationData = await getAirtableRecords({
      tableId: NATIONS_TABLE_ID!,
      fetchAll: true,
    });

    return NextResponse.json({
      data: mapRawDataToNationType(nationData.records),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch nation data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
