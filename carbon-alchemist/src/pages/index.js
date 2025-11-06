import Layout from '../components/Layout';
import AuthForm from '../components/AuthForm';

export default function Home() {
  const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG
    ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
    : null;

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center">
        <div className="w-full">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-6xl h1-hand text-white leading-tight">Carbon</h1>
            <p className="text-gray-200/70 -mt-2">the alchemist</p>
          </div>

          <AuthForm firebaseConfig={firebaseConfig} />
        </div>
      </div>
    </Layout>
  );
}
