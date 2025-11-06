import { useState, useEffect } from 'react';
import { initFirebase } from '../lib/firebaseClient';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously
} from "firebase/auth";

export default function AuthForm({ firebaseConfig }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (firebaseConfig) {
      try { initFirebase(firebaseConfig); } catch (_) {}
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
    <div className="max-w-md mx-auto bg-white/60 backdrop-blur-xl shadow-lg p-8 rounded-2xl border border-white/30">
      <h2 className="text-3xl h1-hand text-indigo-900 mb-2">Welcome</h2>
      <p className="text-sm text-slate-700 mb-6">A space to turn feeling into craft.</p>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-3 mb-3 rounded-xl bg-white/90 border border-indigo-200 placeholder-slate-400 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        className="w-full p-3 mb-4 rounded-xl bg-white/90 border border-indigo-200 placeholder-slate-400 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="Password"
      />

      <div className="flex gap-3">
        <button
          onClick={onLogin}
          className="flex-1 py-3 rounded-xl bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition"
        >
          Log in
        </button>
        <button
          onClick={onSignUp}
          className="flex-1 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          Sign up
        </button>
      </div>

      <button
        onClick={onGuest}
        className="mt-4 w-full py-2 text-xs text-indigo-700 hover:text-indigo-900 transition"
      >
        Continue as guest
      </button>

      <p className="text-xs text-slate-600 mt-5 text-center">
        By continuing you accept the gentle terms of the alchemist ☿
      </p>
    </div>
  );
}
