"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { BodyBlock } from "@/lib/blocks";
import { blocksToDoc, docToBlocks } from "@/lib/blocks";

interface BlockEditorProps {
  value: BodyBlock[];
  onChange: (blocks: BodyBlock[]) => void;
  label?: string;
}

function ToolbarBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? "var(--pk-accent-deep)" : "transparent",
        color: active ? "#fff" : "var(--pk-text)",
        border: "1px solid var(--pk-line)",
        borderRadius: 6,
        padding: "3px 11px",
        fontSize: "0.8rem",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "var(--ui)",
        lineHeight: 1.5,
        transition: "background 0.1s",
      }}
    >
      {children}
    </button>
  );
}

export default function BlockEditor({
  value,
  onChange,
  label,
}: BlockEditorProps) {
  const safeValue = value ?? [];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Keep: paragraph, heading, blockquote, bold, italic, text, doc, history
        heading: { levels: [2] },
        // Disable extensions we don't use
        code: false,
        codeBlock: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        strike: false,
      }),
    ],
    content: blocksToDoc(safeValue),
    // Required for Next.js 15 + Tiptap SSR: prevents hydration mismatch
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(docToBlocks(editor.getJSON()));
    },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && (
        <label
          style={{
            fontFamily: "var(--ui)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--pk-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          border: "1px solid var(--pk-line)",
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--pk-card, #fff)",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "8px 10px",
            borderBottom: "1px solid var(--pk-line)",
            background: "var(--pk-panel)",
          }}
        >
          <ToolbarBtn
            active={editor?.isActive("paragraph") ?? false}
            onClick={() => editor?.chain().focus().setParagraph().run()}
          >
            P
          </ToolbarBtn>
          <ToolbarBtn
            active={editor?.isActive("heading", { level: 2 }) ?? false}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </ToolbarBtn>
          <ToolbarBtn
            active={editor?.isActive("blockquote") ?? false}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            &ldquo;
          </ToolbarBtn>
        </div>

        {/* Editor area */}
        <EditorContent
          editor={editor}
          style={{
            minHeight: 220,
            padding: "12px 14px",
            fontFamily: "var(--ui)",
            fontSize: "0.92rem",
            lineHeight: 1.65,
            color: "var(--pk-text)",
          }}
        />
      </div>
    </div>
  );
}
