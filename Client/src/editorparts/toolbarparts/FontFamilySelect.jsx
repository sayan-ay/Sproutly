export default function FontFamilySelect({ editor }) {
  return (
    <select
      className="border border-black rounded bg-white"
      onChange={(e) =>
        editor.chain().focus().setFontFamily(e.target.value).run()
      }
    >
      <option value="Inter">Inter</option>
      <option value="Comic Sans MS">Comic Sans</option>
      <option value="serif">Serif</option>
      <option value="cursive">Cursive</option>
      <option value='"Exo 2"'>Exo 2</option>
      <option value="Roboto">Roboto</option>
      <option value="Playwrite IE">Playwrite Ireland</option>
      <option value="Carlito">Carlito</option>
    </select>
  );
}
