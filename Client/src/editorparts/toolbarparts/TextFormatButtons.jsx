import { Subscript, Superscript, Code, Pilcrow, Quote } from "lucide-react";

export default function TextFormatButtons({ editor }) {
  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={editor.isActive("subscript") ? "active" : ""}
      >
        <Subscript />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={editor.isActive("superscript") ? "active" : ""}
      >
        <Superscript />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "active" : ""}
      >
        <Pilcrow />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "active" : ""}
      >
        <Quote />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "active" : ""}
      >
        <Code />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        ———
      </button>
    </>
  );
}
