import {
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";
import { useRef } from "react";

const headings = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6];

export default function HeadingButtons({ editor }) {
  const detailsRef = useRef(null);

  return (
    <details ref={detailsRef} className="relative">
      <summary className="list-none flex items-center justify-center w-7 h-7 rounded-md text-stone-600 hover:bg-[#c5e8b0] hover:text-[#2f6938] cursor-pointer transition-all duration-100">
        <Heading size={14} />
      </summary>

      <div
        className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-stone-200 rounded-lg shadow-lg p-1 flex flex-col gap-0.5 min-w-[44px] items-stretch"
        onClick={() => detailsRef.current.removeAttribute("open")}
      >
        {headings.map((Icon, i) => (
          <span
            key={i}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: i + 1 })
                .run()
            }
            className={`flex items-center justify-center p-1.5 rounded-md cursor-pointer transition-all duration-100
              ${
                editor.isActive("heading", { level: i + 1 })
                  ? "bg-[#3a7d44] text-white"
                  : "text-stone-600 hover:bg-[#c5e8b0] hover:text-[#2f6938]"
              }`}
          >
            <Icon size={14} />
          </span>
        ))}
      </div>
    </details>
  );
}
