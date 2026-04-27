import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, Color, FontSize } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Typography from "@tiptap/extension-typography";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Image from "@tiptap/extension-image";

import { X, Check } from "lucide-react";
import { useEdit } from "./editZustand";
import { useLocation, useNavigate } from "react-router-dom";

import Toolbar from "./editorparts/Toolbar";
import BubbleMenuBar from "./editorparts/BubbleMenuBar";

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&family=Roboto&family=Playwrite+IE:wght@100..400&family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap";

const extensions = [
  StarterKit.configure({
    subscript: false,
    superscript: false,
    underline: false,
    heading: {
      levels: [1, 2, 3, 4, 5, 6], // ← add this
    },
  }),

  Underline,
  Highlight.configure({ multicolor: true }),
  TextStyle,
  Color,
  Typography,
  Subscript,
  Superscript,
  FontSize,
  FontFamily,
  Image.configure({
    // add this
    inline: false,
    allowBase64: false,
  }),
  // Emoji.configure({
  //       emojis: gitHubEmojis,
  //       enableEmoticons: true,
  //       suggestion,
  //     }),
];

export default function Editor({ sendText }) {
  const { edit, setEdit, value, setValue, resetValue } = useEdit();
  const location = useLocation();
  const navigate = useNavigate();

  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
    transformPastedHTML(html) {
      return html;
    },
  });

  if (!editor || !edit) return null;

  function handleClose() {
    setEdit(false);
    if (location.pathname === "/add-post") navigate("/", { replace: true });
  }

  function handleSubmit() {
    sendText(value);
    resetValue();
    setEdit(false);
    if (location.pathname === "/add-post") navigate("/", { replace: true });
  }

  return (
    <>
      <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      <div className="fixed inset-0 flex flex-col z-50 bg-[#96d86a] p-5 pb-0 gap-3">
        {/* Header */}
        <div className="flex flex-row items-center">
          <div className="text-2xl text-white ml-4 cursor-default caret-transparent">
            Write a post
          </div>
          <div className="ml-auto mr-2 flex flex-row gap-3">
            <X
              size={22}
              className="cursor-pointer text-white hover:opacity-70"
              onClick={handleClose}
            />
            <Check
              size={22}
              className="cursor-pointer text-white hover:opacity-70"
              onClick={handleSubmit}
            />
          </div>
        </div>

        {/* Editor Area */}
        <div className="bg-white flex-1 w-full rounded-t-2xl overflow-y-auto">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
          <BubbleMenuBar editor={editor} />
        </div>
      </div>
    </>
  );
}
