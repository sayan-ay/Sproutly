export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute inset-0 rounded-full border-t-4 border-l-4 border-[#76c893] border-solid animate-spin" />
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border border-stone-100 relative z-10">
          <span className="text-4xl">🌿</span>
        </div>
      </div>
    </div>
  );
}
