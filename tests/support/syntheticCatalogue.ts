import type { Page, Route } from "@playwright/test";

import type { LanguageType } from "@/features/languages/types/language.type";
import { LanguageStatusEnum } from "@/features/languages/types/languageStatus.enum";
import type { NationType } from "@/features/nations/types/nation.type";
import type { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";

export const PAGE_SIZE = 25;

export const syntheticNations: NationType[] = [
  { id: "nat_br", name: "Brazil" },
  { id: "nat_pt", name: "Portugal" },
  { id: "nat_jp", name: "Japan" },
];

export const syntheticWritingSystems: WritingSystemType[] = [
  { id: "ws_latn", name: "Latin" },
  { id: "ws_jpan", name: "Japanese" },
];

/**
 * Statuses chosen so that one value is a strict substring of another
 * (`extinct` inside `nearly extinct`), which is what the status filter must not confuse.
 */
const STATUS_CYCLE: LanguageStatusEnum[] = [
  LanguageStatusEnum.NATIONAL,
  LanguageStatusEnum.EXTINCT,
  LanguageStatusEnum.NEARLY_EXTINCT,
  LanguageStatusEnum.VIGOROUS,
];

function buildLanguage(index: number): LanguageType {
  const code = `x${index.toString().padStart(2, "0")}`;
  const nation = syntheticNations[index % syntheticNations.length];
  const writingSystem =
    syntheticWritingSystems[index % syntheticWritingSystems.length];

  return {
    id: `rec_${code}`,
    code,
    name: `Synthetic Language ${index}`,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
    alternateNames: `Alt ${index}`,
    genealogy: "Indo-European, Romance",
    spokenInId: [nation.id],
    writingSystemId: [writingSystem.id],
    nationOfOriginId: [nation.id],
  };
}

/** 60 records: enough for three pages of 25, so pagination is exercised for real. */
export const syntheticLanguages: LanguageType[] = Array.from(
  { length: 60 },
  (_, index) => buildLanguage(index)
);

export const namedLanguage: LanguageType = {
  ...buildLanguage(0),
  id: "rec_por",
  code: "por",
  name: "Portuguese",
  status: LanguageStatusEnum.NATIONAL,
  description: "A Romance language of the Indo-European family.",
};

const ALL_LANGUAGES = [namedLanguage, ...syntheticLanguages];

function matchesText(value: string | undefined, query: string | null): boolean {
  if (!query) return true;
  return (value ?? "").toLowerCase().includes(query.toLowerCase());
}

function matchesList(
  ids: string[] | undefined,
  query: string | null,
  lookup: { id: string; name: string }[]
): boolean {
  if (!query) return true;
  const names = (ids ?? []).map(
    (id) => lookup.find((entry) => entry.id === id)?.name ?? ""
  );
  return names.some((name) => name.toLowerCase().includes(query.toLowerCase()));
}

/**
 * Mirrors the substring semantics of the server-side Airtable formula so the specs
 * observe the same matching behavior the deployed proxy produces.
 */
function selectLanguages(params: URLSearchParams): LanguageType[] {
  return ALL_LANGUAGES.filter(
    (language) =>
      matchesText(language.code, params.get("code")) &&
      matchesText(language.name, params.get("name")) &&
      matchesText(language.status, params.get("status")) &&
      matchesList(
        language.nationOfOriginId,
        params.get("nationOfOrigin"),
        syntheticNations
      ) &&
      matchesList(
        language.writingSystemId,
        params.get("writingSystem"),
        syntheticWritingSystems
      ) &&
      matchesList(language.spokenInId, params.get("spokenIn"), syntheticNations)
  );
}

export interface CatalogueMockOptions {
  /** Endpoints that must answer with a transport failure instead of data. */
  fail?: ("languages" | "languageDetails" | "nations" | "writingSystems")[];
  /** Milliseconds to hold each response, to observe pending states deterministically. */
  delayMs?: number;
  /** Language codes the details endpoint must report as missing. */
  missingCodes?: string[];
}

async function answer(
  route: Route,
  body: unknown,
  options: CatalogueMockOptions,
  endpoint: NonNullable<CatalogueMockOptions["fail"]>[number]
) {
  if (options.delayMs) {
    await new Promise((resolve) => setTimeout(resolve, options.delayMs));
  }

  if (options.fail?.includes(endpoint)) {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "Synthetic failure" }),
    });
    return;
  }

  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

/**
 * Intercepts every catalogue endpoint in the browser. No request reaches Airtable,
 * so the specs are reproducible on any machine and need no credentials.
 */
export async function mockCatalogueApi(
  page: Page,
  options: CatalogueMockOptions = {}
): Promise<void> {
  await page.route("**/api/nations", (route) =>
    answer(route, { data: syntheticNations }, options, "nations")
  );

  await page.route("**/api/writing-systems", (route) =>
    answer(route, { data: syntheticWritingSystems }, options, "writingSystems")
  );

  await page.route("**/api/languages/*", (route) => {
    const code = decodeURIComponent(
      new URL(route.request().url()).pathname.split("/").pop() ?? ""
    );
    const found = options.missingCodes?.includes(code)
      ? null
      : (ALL_LANGUAGES.find(
          (language) => language.code.toLowerCase() === code.toLowerCase()
        ) ?? null);

    return answer(route, { data: found }, options, "languageDetails");
  });

  await page.route("**/api/languages?*", (route) => {
    const params = new URL(route.request().url()).searchParams;
    const matches = selectLanguages(params);
    const start = Number(params.get("offset") ?? 0);
    const slice = matches.slice(start, start + PAGE_SIZE);
    const nextOffset =
      start + PAGE_SIZE < matches.length ? String(start + PAGE_SIZE) : null;

    return answer(route, { data: slice, nextOffset }, options, "languages");
  });
}
