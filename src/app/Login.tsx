'use client';

import { useAuth } from './context/AuthContext';

export default function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div>
      <h1>Please sign in to view content</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}