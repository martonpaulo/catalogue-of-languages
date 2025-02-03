import axios, { AxiosError } from "axios";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error("Missing Airtable API key or base ID");
}

const apiClient = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  },
});

interface FetchAirtableParams {
  tableId: string;
  fetchAll?: boolean;
  queryParams?: Record<string, string>;
}

export async function getAirtableRecords({
  tableId,
  fetchAll = false,
  queryParams,
}: FetchAirtableParams) {
  try {
    const { data } = await apiClient.get(`/${tableId}`, {
      params: queryParams ?? {},
    });

    if (fetchAll && data.offset) {
      const records = data.records;
      let offset = data.offset;

      while (offset) {
        const response = await apiClient.get(`/${tableId}`, {
          params: { offset },
        });

        records.push(...response.data.records);
        offset = response.data.offset;
      }

      return { records };
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(`Airtable API error: ${error.message}`);
    }
    throw new Error("Unexpected error while fetching Airtable data");
  }
}
