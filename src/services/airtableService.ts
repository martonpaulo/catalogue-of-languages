import Airtable from "airtable";
import axios from "axios";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error("Missing Airtable environment variables");
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export async function fetchAirtableData(tableId: string) {
  try {
    const records = await base(tableId).select({ maxRecords: 1000 }).all();
    return records.map(({ id, fields }) => ({ id, fields }));
  } catch (error) {
    console.error("Error fetching data from Airtable:", error);
    handleAirtableError(error);
  }
}

function handleAirtableError(error: unknown) {
  if (axios.isAxiosError(error)) {
    throw new Error(
      error.response?.data?.error?.message || "Airtable API error"
    );
  }

  throw new Error("Unexpected error occurred while fetching Airtable data");
}
