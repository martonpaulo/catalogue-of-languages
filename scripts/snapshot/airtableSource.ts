import { AirtableRecordType } from "@/shared/types/airtableRecord.type";

const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;
const PAGE_SIZE = 100;

export interface AirtableCredentials {
  apiKey: string;
  baseId: string;
}

/**
 * Build-only Airtable reader. It exists under scripts/ so no browser bundle can import it
 * and no credential can reach a deployed artifact. Errors are reported without the request
 * URL or headers, because both carry the base identifier and the bearer token.
 */
export async function fetchAllRecords(
  credentials: AirtableCredentials,
  tableId: string,
  apiUrl: string = AIRTABLE_API_URL
): Promise<AirtableRecordType[]> {
  const records: AirtableRecordType[] = [];
  let offset: string | undefined;

  do {
    const page = await fetchPage(credentials, tableId, offset, apiUrl);
    records.push(...page.records);
    offset = page.offset;
  } while (offset);

  return records;
}

interface AirtablePage {
  records: AirtableRecordType[];
  offset?: string;
}

async function fetchPage(
  { apiKey, baseId }: AirtableCredentials,
  tableId: string,
  offset: string | undefined,
  apiUrl: string
): Promise<AirtablePage> {
  const url = new URL(`${apiUrl}/${baseId}/${tableId}`);
  url.searchParams.set("pageSize", String(PAGE_SIZE));
  if (offset) url.searchParams.set("offset", offset);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        // A rejected request will be rejected again; only transport faults are retried.
        throw new RequestRejected(
          `Airtable responded ${response.status} for table ${tableId}`
        );
      }

      const page = (await response.json()) as AirtablePage;
      if (!Array.isArray(page.records)) {
        throw new Error(`Airtable returned no record array for ${tableId}`);
      }

      return page;
    } catch (error) {
      if (error instanceof RequestRejected) {
        throw new Error(`Failed to read table ${tableId}: ${error.message}`);
      }
      if (attempt === MAX_ATTEMPTS) {
        throw new Error(
          `Failed to read table ${tableId} after ${MAX_ATTEMPTS} attempts: ${describe(error)}`
        );
      }
      await delay(attempt * 1_000);
    }
  }

  throw new Error(`Unreachable pagination state for table ${tableId}`);
}

class RequestRejected extends Error {}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
