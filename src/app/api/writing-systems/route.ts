import { NextResponse } from "next/server";

import { fetchAirtableData } from "@/services/airtableService";
import { WritingSystemType } from "@/types/writingSystem";
import { handleError } from "@/utils/errorHandler";

const { WRITING_SYSTEMS_TABLE_ID: TABLE_ID } = process.env;

if (!TABLE_ID) {
  throw new Error("Missing Airtable table ID for writing systems");
}

export async function GET() {
  try {
    const rawData = await fetchAirtableData(TABLE_ID!);

    if (!rawData || rawData.length === 0) {
      return NextResponse.json(
        { error: "No writing systems data found" },
        { status: 404 }
      );
    }

    const formattedData: WritingSystemType[] = rawData.map(
      ({ id, fields }) => ({
        id: id as string,
        name: fields["Name"] as string,
      })
    );

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error in writing systems API:", error);
    return NextResponse.json({ error: handleError(error) }, { status: 500 });
  }
}
