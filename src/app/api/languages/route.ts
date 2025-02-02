import { NextResponse } from "next/server";

import { fetchAirtableData } from "@/services/airtableService";
import { LanguageType } from "@/types/language";
import { handleError } from "@/utils/errorHandler";

const { LANGUAGES_TABLE_ID: TABLE_ID } = process.env;

if (!TABLE_ID) {
  throw new Error("Missing Airtable table ID for languages");
}

export async function GET() {
  try {
    const rawData = await fetchAirtableData(TABLE_ID!);

    if (!rawData || rawData.length === 0) {
      return NextResponse.json(
        { error: "No languages data found" },
        { status: 404 }
      );
    }

    const formattedData: LanguageType[] = rawData.map(({ id, fields }) => ({
      id: id as string,
      code: fields["ISO 639-3"] as string,
      name: fields["Official Name"] as string,
      status: fields["Language Status"] as string,
      spokenIn: fields["Principal in"] as string[],
      writingSystem: fields["Writing System"] as string[],
      nationOfOrigin: fields["Nation of Origin"] as string[],
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error in languages API:", error);
    return NextResponse.json({ error: handleError(error) }, { status: 500 });
  }
}
