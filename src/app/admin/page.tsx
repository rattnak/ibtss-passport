import Link from "next/link";
import { STATIONS } from "@/lib/stations";

export default function AdminPage() {
  const gradients: Record<number, string> = {
    1: "from-blue-600 to-blue-800",
    2: "from-emerald-600 to-emerald-800",
    3: "from-violet-600 to-violet-800",
  };

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">Station QR Codes</h1>
        <p className="text-slate-400 text-sm">
          Open a station page and display it on the screen, or print it as a poster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {STATIONS.map((station) => (
          <Link
            key={station.id}
            href={`/admin/station/${station.id}`}
            className={`bg-gradient-to-br ${gradients[station.id]} rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-lg`}
          >
            <div className="text-5xl mb-3">{station.emoji}</div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
              Station {station.id} · {station.audience}
            </p>
            <p className="text-white font-bold mb-3">{station.title}</p>
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Open QR Page →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-3xl">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Setup checklist</p>
        <ul className="text-slate-300 text-sm space-y-2">
          <li>✓ Open each station page on a tablet or monitor at the station</li>
          <li>✓ Participants scan the QR code with their phone camera</li>
          <li>✓ They enter their email to collect the stamp</li>
          <li>✓ Resources are auto-emailed; completion triggers a final email + passport link</li>
        </ul>
      </div>
    </main>
  );
}
