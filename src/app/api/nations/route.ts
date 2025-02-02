import { NextResponse } from "next/server";

import { fetchAirtableData } from "@/services/airtableService";
import { NationType } from "@/types/nation";
import { handleError } from "@/utils/errorHandler";

const { NATIONS_TABLE_ID: TABLE_ID } = process.env;

if (!TABLE_ID) {
  throw new Error("Missing Airtable table ID for nations");
}

export async function GET() {
  try {
    const rawData = await fetchAirtableData(TABLE_ID!);

    if (!rawData || rawData.length === 0) {
      return NextResponse.json(
        { error: "No nations data found" },
        { status: 404 }
      );
    }

    const formattedData: NationType[] = rawData.map(({ id, fields }) => ({
      id: id as string,
      name: fields["Polities"] as string,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error in nations API:", error);
    return NextResponse.json({ error: handleError(error) }, { status: 500 });
  }
}
