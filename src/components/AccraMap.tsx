export function AccraMap({ className = "" }: { className?: string }) {
  return (
    <iframe title="Map of Accra, Ghana" loading="lazy" className={`w-full rounded-2xl border-0 ${className}`}
      src="https://www.openstreetmap.org/export/embed.html?bbox=-0.30%2C5.52%2C-0.12%2C5.66&layer=mapnik&marker=5.6037%2C-0.1870" />
  );
}
