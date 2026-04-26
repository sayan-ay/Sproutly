export default function FontSizeSelect({ editor }) {
  return (
    <input
      type="number"
      className="border border-black rounded  w-10  focus:outline-none bg-white"
      min="2"
      onChange={(e) =>
        editor.chain().focus().setFontSize(`${e.target.value}px`).run()
      }
      placeholder="24"
    />
  );
}
