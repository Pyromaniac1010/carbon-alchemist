import { useState, useEffect } from 'react';
import { initFirebase } from '../lib/firebaseClient';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";

export default function AuthForm({ firebaseConfig }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (firebaseConfig) {
      try { initFirebase(firebaseConfig); } catch(_) {}
    }
  }, [firebaseConfig]);

  const onSignUp = async () => {
    setError(null);
    try {
      const { auth } = initFirebase(firebaseConfig);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  const onLogin = async () => {
    setError(null);
    try {
      const { auth } = initFirebase(firebaseConfig);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  const onGuest = async () => {
    setError(null);
    try {
      const { auth } = initFirebase(firebaseConfig);
      await signInAnonymously(auth);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-8 rounded-2xl">
      <h2 className="text-3xl h1-hand text-white">Welcome</h2>
      <p className="text-sm text-gray-200/70 mb-6">A space to turn feeling into craft.</p>

      {error && <div className="bg-red-900 text-red-200 p-2 rounded mb-4">{error}</div>}

      <input value={email} onChange={e => setEmail(e.target.value)}
        className="w-full p-3 mb-3 rounded-xl bg-white/6 border border-white/6 placeholder-white/50 text-white outline-none"
        placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)}
        type="password"
        className="w-full p-3 mb-4 rounded-xl bg-white/6 border border-white/6 placeholder-white/50 text-white outline-none"
        placeholder="Password" />

      <div className="flex gap-3">
        <button onClick={onLogin} className="flex-1 py-3 rounded-xl bg-white/8 text-white">Log in</button>
        <button onClick={onSignUp} className="flex-1 py-3 rounded-xl bg-violet-500 text-white">Sign up</button>
      </div>

      <button onClick={onGuest} className="mt-3 w-full py-2 text-xs text-white/80">Continue as guest</button>

      <p className="text-xs text-gray-300 mt-4">By continuing you accept the gentle terms of the alchemist ☿</p>
    </div>
  );
}
