import Airtable from "airtable";
import axios from "axios";
import { NextResponse } from "next/server";

import { LanguageType } from "@/types/language";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY as string;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID as string;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME as string;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
  throw new Error("Missing Airtable environment variables");
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

const DEFAULT_MAX_RECORDS = 50;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const maxRecords =
    Number(searchParams.get("maxRecords")) || DEFAULT_MAX_RECORDS;

  try {
    // find all records
    const records = await base(AIRTABLE_TABLE_NAME)
      .select({ maxRecords })
      .all();

    const formattedRecords: LanguageType[] = records.map((record) => ({
      id: record.id as string,
      code: record.fields["ISO 639-3"] as string,
      name: record.fields["Official Name"] as string,
      status: record.fields["Language Status"] as string,
      spokenIn: record.fields["Principal in"] as string[],
      writingSystem: record.fields["Writing System"] as string[],
      nationOfOrigin: record.fields["Nation of Origin"] as string[],
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error("Error fetching data from Airtable:", error);

    // error handling based on Airtable response
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data || "Airtable API error" },
        { status: error.response?.status || 500 }
      );
    }

    // fallback error handling
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
