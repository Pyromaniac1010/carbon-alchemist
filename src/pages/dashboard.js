import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { initFirebase } from '../lib/firebaseClient';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot } from "firebase/firestore";
import ArtifactCard from '../components/ArtifactCard';
import Link from 'next/link';

export default function Dashboard() {
  const [artifacts, setArtifacts] = useState([]);

  useEffect(() => {
    const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) : null;
    if (!firebaseConfig) return;
    const { auth, db } = initFirebase(firebaseConfig);

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setArtifacts([]);
        return;
      }
      const path = `/artifacts/${process.env.NEXT_PUBLIC_APP_ID || 'default-app'}/users/${user.uid}/artifacts`;
      const col = collection(db, path);
      const q = query(col);
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a,b) => {
          const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tb - ta;
        });
        setArtifacts(data);
      });
      return () => unsub();
    });

    return () => unsubAuth();
  }, []);

  return (
    <Layout>
      <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl h1-hand">Your Archive</h2>
            <p className="text-sm text-gray-200/60">Saved drafts & creations</p>
          </div>
          <Link href="/create"><a className="px-4 py-2 rounded-xl bg-violet-500 text-white">New Creation</a></Link>
        </div>

        {artifacts.length === 0 ? (
          <div className="text-gray-300/60">No artifacts yet — start a new flow.</div>
        ) : (
          <div className="grid gap-4">
            {artifacts.map(a => <ArtifactCard key={a.id} artifact={a} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
