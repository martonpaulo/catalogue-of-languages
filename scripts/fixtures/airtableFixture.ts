import { AirtableRecordType } from "@/shared/types/airtableRecord.type";

import { SnapshotSource } from "../snapshot/buildSnapshot";

const NATIONS: AirtableRecordType[] = [
  { id: "nat_br", fields: { Polities: "Brazil" } },
  { id: "nat_pt", fields: { Polities: "Portugal" } },
  { id: "nat_jp", fields: { Polities: "Japan" } },
  { id: "nat_blank", fields: {} },
];

const WRITING_SYSTEMS: AirtableRecordType[] = [
  { id: "ws_latn", fields: { Name: "Latin" } },
  { id: "ws_jpan", fields: { Name: "Japanese" } },
];

const LANGUAGES: AirtableRecordType[] = [
  {
    id: "rec_por",
    fields: {
      "ISO 639-3": "por",
      "Official Name": 'Portuguese "Lusophone"',
      "Language Status": "1 - National",
      "Alternate Names": "Português",
      Genealogy: "Indo-European, Romance",
      Description: "A Romance language of the Indo-European family.",
      "Principal in": ["nat_br", "nat_pt"],
      "Writing System": ["ws_latn"],
      "Nation of Origin": ["nat_pt"],
    },
  },
  {
    id: "rec_jpn",
    fields: {
      "ISO 639-3": "jpn",
      "Official Name": "Japanese",
      "Language Status": "1 - National",
      "Principal in": ["nat_jp"],
      "Writing System": ["ws_jpan"],
      "Nation of Origin": ["nat_jp"],
    },
  },
  {
    // Minimal record: every optional detail field is absent.
    id: "rec_xtc",
    fields: {
      "ISO 639-3": "xtc",
      "Official Name": "Extinct Sample",
      "Language Status": "10 - Extinct",
    },
  },
  {
    id: "rec_xne",
    fields: {
      "ISO 639-3": "xne",
      "Official Name": "Nearly Extinct Sample",
      "Language Status": "8b - Nearly extinct",
      "Principal in": ["nat_br"],
    },
  },
  {
    id: "rec_una",
    fields: {
      "ISO 639-3": "una",
      "Official Name": "Unattested Sample",
      "Language Status": "Unattested.",
    },
  },
  {
    id: "rec_unk",
    fields: {
      // An unrecognized source label must not enter a known category by accident.
      "ISO 639-3": "unk",
      "Official Name": "Unknown Status Sample",
      "Language Status": "42 - Not a real label",
      "Principal in": ["nat_missing"],
    },
  },
  {
    id: "rec_thr",
    fields: {
      "ISO 639-3": "thr",
      "Official Name": "Threatened Sample",
      "Language Status": "6b - Threatened",
      "Writing System": ["ws_latn"],
    },
  },
  {
    // Rejected: duplicate of rec_por's code.
    id: "rec_dup",
    fields: { "ISO 639-3": "POR", "Official Name": "Duplicate Portuguese" },
  },
  {
    // Rejected: a code that is not three letters.
    id: "rec_bad",
    fields: { "ISO 639-3": "portuguese", "Official Name": "Bad Code" },
  },
  {
    // Rejected: no usable name.
    id: "rec_noname",
    fields: { "ISO 639-3": "nnm", "Official Name": "   " },
  },
];

/**
 * A credential-free source that exercises the generator's validation branches. The padding
 * records exist so the catalogue has more languages than one reveal step, which is what the
 * incremental-loading acceptance needs.
 */
export function fixtureSource(paddingCount = 60): SnapshotSource {
  return {
    languages: [...LANGUAGES, ...paddingLanguages(paddingCount)],
    nations: NATIONS,
    writingSystems: WRITING_SYSTEMS,
  };
}

function paddingLanguages(count: number): AirtableRecordType[] {
  return scaledFixtureSource(count).languages;
}

/**
 * Grows the fixture to an arbitrary language count for feasibility measurement. Every
 * generated record is synthetic; no real dataset is reproduced here.
 */
export function scaledFixtureSource(languageCount: number): SnapshotSource {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const generated: AirtableRecordType[] = [];

  for (let index = 0; index < languageCount; index += 1) {
    const code =
      alphabet[Math.floor(index / 676) % 26] +
      alphabet[Math.floor(index / 26) % 26] +
      alphabet[index % 26];

    generated.push({
      id: `rec_pad_${code}`,
      fields: {
        "ISO 639-3": code,
        "Official Name": `Synthetic Language ${index}`,
        "Language Status": index % 2 === 0 ? "6a - Vigorous" : "7 - Shifting",
        "Alternate Names": `Alt ${index}`,
        Genealogy: "Indo-European, Romance",
        Demographics: `Approximately ${index * 100} speakers.`,
        "Principal in": ["nat_br"],
        "Writing System": ["ws_latn"],
        "Nation of Origin": ["nat_br"],
      },
    });
  }

  return {
    languages: generated,
    nations: NATIONS,
    writingSystems: WRITING_SYSTEMS,
  };
}
