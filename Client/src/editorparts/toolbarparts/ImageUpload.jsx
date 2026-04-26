import { Image } from "lucide-react";
import { useRef } from "react";
import { api } from "../../axios";

export default function ImageUpload({ editor }) {
  const inputRef = useRef(null);

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return null;

    for (const file of files) {
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const res = await api.post("/images/upload", formData);
        const imageUrl = res.data.url;
        console.log("full response", res);
        editor.chain().focus().setImage({ src: imageUrl }).run();
        editor.chain().focus().createParagraphNear().run();
      } catch (err) {
        console.log(err);
      }
    }
    e.target.value = "";
  }

  return (
    <>
      <Image
        className="cursor-pointer"
        onClick={() => inputRef.current.click()}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        ref={inputRef}
      />
    </>
  );
}
