import Link from 'next/link';

export default function ArtifactCard({ artifact }) {
  return (
    <Link href={`/artifact/${artifact.id}`}>
      <a className="block p-4 rounded-xl bg-white/4 hover:bg-white/6 transition">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg text-white font-semibold">{artifact.title || 'Untitled'}</h3>
            <p className="text-sm text-gray-300/70 mt-1">{artifact.medium || '—'}</p>
          </div>
          <div className="text-xs text-gray-400">{artifact.createdAt ? new Date(artifact.createdAt.toDate()).toLocaleString() : '...'}</div>
        </div>
      </a>
    </Link>
  );
}
