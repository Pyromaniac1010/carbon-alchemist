import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { initFirebase } from '../../lib/firebaseClient';
import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";

export default function ArtifactView() {
  const router = useRouter();
  const { id } = router.query;
  const [artifact, setArtifact] = useState(null);

  useEffect(() => {
    if (!id) return;
    const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) : null;
    if (!firebaseConfig) return;
    const { db } = initFirebase(firebaseConfig);

    const pathPrefix = `/artifacts/${process.env.NEXT_PUBLIC_APP_ID || 'default-app'}/users`;
    // This route expects you to know user's id or that public read is allowed; more robust approach is to pass userId or look up via dashboard link.
    // We'll attempt to search the current user's collection by id in an alternative flow, but keeping simple:
    const tryGet = async () => {
      try {
        // If caller included NEXT_PUBLIC_USER_ID (not ideal), use it:
        const userIdEnv = process.env.NEXT_PUBLIC_USER_ID || '';
        if (userIdEnv) {
          const ref = doc(db, `${pathPrefix}/${userIdEnv}/artifacts`, id);
          const d = await getDoc(ref);
          if (d.exists()) {
            setArtifact({ id: d.id, ...d.data() });
            return;
          }
        }
        // fallback: naive search across likely path (not efficient) — in production supply user's id via route params
      } catch (e) {
        console.error(e);
      }
    };
    tryGet();
  }, [id]);

  if (!artifact) {
    return (
      <Layout>
        <div className="glass p-8 rounded-xl">Loading or artifact not found...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="glass p-6 rounded-2xl">
        <h2 className="h1-hand text-3xl">{artifact.title}</h2>
        <p className="text-sm text-gray-200/60">{artifact.medium} • {artifact.createdAt ? new Date(artifact.createdAt.toDate()).toLocaleString() : ''}</p>
        <div className="mt-4 p-4 rounded-xl bg-white/6">
          <p className="italic text-gray-100">{artifact.prompt}</p>
          <pre className="mt-4 whitespace-pre-wrap font-mono text-sm text-gray-100">{artifact.content}</pre>
        </div>
      </div>
    </Layout>
  );
}
