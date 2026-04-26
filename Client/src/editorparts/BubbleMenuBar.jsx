import { BubbleMenu } from "@tiptap/react/menus";

const bubbleButtons = [
  { label: "Bold", action: "toggleBold", mark: "bold" },
  { label: "Code", action: "toggleCode", mark: "code" },
  { label: "Italic", action: "toggleItalic", mark: "italic" },
  { label: "Underline", action: "toggleUnderline", mark: "underline" },

  { label: "Strike", action: "toggleStrike", mark: "strike" },
];

export default function BubbleMenuBar({ editor }) {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      className="bg-white flex gap-2 p-2 rounded-2xl shadow z-90"
    >
      {bubbleButtons.map(({ label, action, mark }) => (
        <button
          key={mark}
          onClick={() => editor.chain().focus()[action]().run()}
          className={editor.isActive(mark) ? "text-blue-700" : ""}
        >
          {label}
        </button>
      ))}
      <div className="flex items-center gap-1">
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHighlight({
                color: editor.getAttributes("highlight").color || "#fef08a",
              })
              .run()
          }
          className={editor.isActive("highlight") ? "active" : ""}
        >
          Highlight
        </button>
        <input
          type="color"
          defaultValue="#fef08a"
          className="w-5 h-5 cursor-pointer rounded border-none"
          onChange={(e) =>
            editor.chain().focus().setHighlight({ color: e.target.value }).run()
          }
        />
      </div>
    </BubbleMenu>
  );
}
