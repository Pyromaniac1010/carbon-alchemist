import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl h1-hand text-white">Carbon</h1>
        <p className="text-sm text-gray-200/70 -mt-2">the alchemist</p>
      </div>
      <nav className="flex items-center gap-3">
        <Link href="/create"><a className="px-4 py-2 rounded-xl bg-white/5 text-sm text-white glass hover:bg-white/7 transition">New</a></Link>
        <Link href="/dashboard"><a className="px-4 py-2 rounded-xl bg-white/5 text-sm text-white glass hover:bg-white/7 transition">Archive</a></Link>
      </nav>
    </header>
  );
}
