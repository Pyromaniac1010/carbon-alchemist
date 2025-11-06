import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { initFirebase } from '../lib/firebaseClient';
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Create() {
  const [feeling, setFeeling] = useState('');
  const [medium, setMedium] = useState('');
  const [generated, setGenerated] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [artifactTitle, setArtifactTitle] = useState('');
  const [content, setContent] = useState('');

  const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) : null;

  useEffect(() => {
    if (!firebaseConfig) return;
    const { auth } = initFirebase(firebaseConfig);
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return;
      setUserId(u.uid);
    });
    return () => unsub();
  }, []);

  const handleGenerate = async () => {
    if (!feeling.trim() || !medium) return alert('Please enter your feeling and choose medium');
    setIsLoading(true);
    setGenerated('');
    try {
      const res = await fetch('/api/generatePrompt', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ feeling, medium })
      });
      const json = await res.json();
      setGenerated(json.text || 'Failed to generate prompt');
      setContent('');
      setArtifactTitle(`New ${medium} Draft`);
    } catch (err) {
      console.error(err);
      setGenerated('Error generating prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!firebaseConfig) return alert('Firebase not configured');
    if (!userId) return alert('Not authenticated');
    if (!artifactTitle.trim() || !content.trim()) return alert('Title and content required');

    const { db } = initFirebase(firebaseConfig);
    const path = `/artifacts/${process.env.NEXT_PUBLIC_APP_ID || 'default-app'}/users/${userId}/artifacts`;
    const newDocRef = doc(collection(db, path));
    const payload = {
      feeling,
      medium,
      prompt: generated,
      title: artifactTitle.trim(),
      content: content.trim(),
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(newDocRef, payload);
      setFeeling('');
      setMedium('');
      setGenerated('');
      setContent('');
      setArtifactTitle('');
      alert('Saved');
    } catch (e) {
      console.error(e);
      alert('Save failed');
    }
  };

  return (
    <Layout>
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-2xl h1-hand mb-2">Create</h2>
        <p className="text-gray-200/70 mb-6">Set your feeling, choose a medium, and let the Pressure nudge you.</p>

        <div className="grid gap-4 md:grid-cols-3">
          <textarea value={feeling} onChange={e => setFeeling(e.target.value)}
            placeholder="Describe how you feel..."
            className="md:col-span-2 p-4 rounded-xl bg-white/6 text-white outline-none" rows="4" />

          <div className="space-y-2">
            <label className="text-sm text-gray-200/60">Medium</label>
            <div className="grid gap-2">
              {['Song','Script','Novel','Art'].map(m => (
                <button key={m} onClick={() => setMedium(m)}
                  className={`py-2 px-3 rounded-xl text-left ${medium === m ? 'bg-violet-600 text-white' : 'bg-white/6 text-white'}`}>
                  {m}
                </button>
              ))}
            </div>
            <button onClick={handleGenerate} disabled={isLoading || !feeling || !medium}
              className="mt-4 w-full py-2 rounded-xl bg-violet-500 text-white">
              {isLoading ? 'Generating…' : 'Generate Prompt'}
            </button>
          </div>
        </div>

        {generated && (
          <div className="mt-6 p-4 rounded-xl bg-white/4">
            <p className="text-sm text-gray-200/60">The Pressure</p>
            <p className="mt-2 italic text-white font-medium">{generated}</p>

            <input placeholder="Artifact title" value={artifactTitle} onChange={e => setArtifactTitle(e.target.value)}
              className="mt-4 w-full p-3 rounded-xl bg-white/6 outline-none" />

            <textarea placeholder="Start drafting..." value={content} onChange={e => setContent(e.target.value)}
              rows="8" className="mt-3 w-full p-4 rounded-xl bg-white/6 outline-none" />

            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-green-500 text-white">Save Artifact</button>
              <button onClick={() => { setGenerated(''); setContent(''); }} className="flex-1 py-3 rounded-xl bg-white/6">Reset Draft</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
