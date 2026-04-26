export default function FallBackErrorBoundary({ error, resetErrorBoundary }) {
  return (
    <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
      <h2>Something went wrong</h2>
      <p className="text-red-800 text-shadow-amber-300">{error?.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-2 py-1 cursor-pointer "
      >
        Try again
      </button>
    </div>
  );
}
