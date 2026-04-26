import { Pipette } from "lucide-react";
import { useRef } from "react";
export default function ColorPicker({ editor }) {
  const colorPickerRef = useRef(null);
  return (
    <>
      <input
        hidden
        ref={colorPickerRef}
        type="color"
        onInput={(e) =>
          editor.chain().focus().setColor(e.currentTarget.value).run()
        }
        data-testid="setColor"
      />
      <button onClick={() => colorPickerRef.current.click()}>
        <Pipette />
      </button>
    </>
  );
}
