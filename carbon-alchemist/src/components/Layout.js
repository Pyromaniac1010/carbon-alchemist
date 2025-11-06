import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <Navbar />
        <main className="mt-8">{children}</main>
      </div>
    </div>
  );
}
