export type BodyBlock = { type: "p" | "h" | "q"; text: string };

// Extract concatenated plain text from a Tiptap node's content array.
function nodeText(node: any): string {
  if (!node?.content?.length) return "";
  return node.content
    .filter((c: any) => c?.type === "text")
    .map((c: any) => c.text ?? "")
    .join("");
}

/**
 * Convert a Tiptap JSON doc to BodyBlock[].
 * Supported node types: paragraph → "p", heading → "h", blockquote → "q".
 * Unknown types are skipped.
 */
export function docToBlocks(doc: any): BodyBlock[] {
  if (!doc?.content?.length) return [];
  const blocks: BodyBlock[] = [];
  for (const node of doc.content) {
    if (node?.type === "paragraph") {
      blocks.push({ type: "p", text: nodeText(node) });
    } else if (node?.type === "heading") {
      blocks.push({ type: "h", text: nodeText(node) });
    } else if (node?.type === "blockquote") {
      // A blockquote wraps one or more paragraphs; take text from the first one.
      const inner = node?.content?.[0];
      const text = inner ? nodeText(inner) : "";
      blocks.push({ type: "q", text });
    }
    // Unknown node types are intentionally skipped.
  }
  return blocks;
}

/** Convert a Tiptap text-content array, omitting it when text is empty. */
function textContent(text: string): any[] | undefined {
  return text ? [{ type: "text", text }] : undefined;
}

/**
 * Convert BodyBlock[] back to a Tiptap JSON doc.
 */
export function blocksToDoc(blocks: BodyBlock[]): any {
  const content = blocks.map((block) => {
    if (block.type === "p") {
      const node: any = { type: "paragraph" };
      const tc = textContent(block.text);
      if (tc) node.content = tc;
      return node;
    } else if (block.type === "h") {
      const node: any = { type: "heading", attrs: { level: 2 } };
      const tc = textContent(block.text);
      if (tc) node.content = tc;
      return node;
    } else {
      // "q" → blockquote wrapping a paragraph
      const inner: any = { type: "paragraph" };
      const tc = textContent(block.text);
      if (tc) inner.content = tc;
      return { type: "blockquote", content: [inner] };
    }
  });
  return { type: "doc", content };
}

// ponytail self-check:
// Round-trip invariant: blocksToDoc∘docToBlocks ≈ identity on supported types.
// Specifically, for any doc whose top-level nodes are all paragraph / heading / blockquote
// with only text children, docToBlocks extracts the plain text and blocksToDoc
// reconstructs structurally equivalent nodes — same type, same text, heading level
// fixed at 2. Nodes with mixed inline marks (bold, links) lose mark data (text is
// preserved). Unknown node types are dropped on the docToBlocks pass and therefore
// absent from the reconstructed doc. This is acceptable because BodyBlock is a
// content-storage type, not a lossless editor state.
