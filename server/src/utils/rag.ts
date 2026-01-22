/**
 * RAG-related utilities shared between routes.
 */

export type NormalizedCitation = {
  file_name?: string;
  page?: number;
  chunk_id?: string;
  text_preview?: string;
};

/**
 * Safely parse JSON from a string.
 * Returns null on parse error or non-string input.
 */
export function safeParseJson<T = any>(value: unknown): T | null {
  if (typeof value !== 'string') {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Normalize citations from RAG backend into a consistent, safe shape.
 * - Keeps only non-sensitive fields (file name, page, chunk id, snippet)
 * - Truncates text preview to 200 characters to avoid leaking full content
 */
export function normalizeCitations(raw: unknown): NormalizedCitation[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((item): NormalizedCitation => {
    const anyItem: any = item || {};

    const fileName =
      anyItem.file_name ||
      anyItem.filename ||
      anyItem.document_name ||
      anyItem.name;

    const page =
      typeof anyItem.page === 'number'
        ? anyItem.page
        : typeof anyItem.page_number === 'number'
          ? anyItem.page_number
          : undefined;

    const chunkId =
      anyItem.chunk_id ||
      anyItem.chunkId ||
      anyItem.id;

    const rawText: string =
      anyItem.text_preview ||
      anyItem.textPreview ||
      anyItem.snippet ||
      anyItem.text ||
      '';

    const textPreview =
      typeof rawText === 'string'
        ? rawText.slice(0, 200)
        : undefined;

    return {
      file_name: fileName,
      page,
      chunk_id: chunkId,
      text_preview: textPreview
    };
  });
}


