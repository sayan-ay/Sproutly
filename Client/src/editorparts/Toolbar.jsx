import ColorPicker from "./toolbarparts/ColorPicker";
import FontFamilySelect from "./toolbarparts/FontFamilySelect";
import FontSizeSelect from "./toolbarparts/FontSizeSelect";
import TextFormatButtons from "./toolbarparts/TextFormatButtons";
import ListButtons from "./toolbarparts/ListButtons";
import HeadingButtons from "./toolbarparts/HeadingButtons";
import ImageUpload from "./toolbarparts/ImageUpload";

//   return (
//     <div className="tool-bar">
//       <ColorPicker editor={editor} />
//       <FontFamilySelect editor={editor} />
//       <FontSizeSelect editor={editor} />
//       <TextFormatButtons editor={editor} />
//       <ListButtons editor={editor} />
//       <HeadingButtons editor={editor} />
//       <ImageUpload editor={editor} />
//     </div>
//   );
// }

export default function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="tool-bar">
      <ColorPicker editor={editor} />
      <FontFamilySelect editor={editor} />
      <FontSizeSelect editor={editor} />

      <div className="tool-bar-divider" />

      <TextFormatButtons editor={editor} />

      <div className="tool-bar-divider" />

      <ListButtons editor={editor} />
      <HeadingButtons editor={editor} />

      <div className="tool-bar-divider" />

      <ImageUpload editor={editor} />
    </div>
  );
}
