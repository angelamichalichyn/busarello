export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-sand/30 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-clay rounded-full animate-spin" />
      </div>
      <p className="text-ink/50 text-sm animate-pulse">Carregando...</p>
    </div>
  );
}
