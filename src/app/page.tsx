'use client';

import { useAuth } from './context/AuthContext';
import Login from './Login';

export default function Home() {
  const { user, logOut, loading, error } = useAuth();

  if (error) {
    return 'Error';
  }

    if (loading) {
    return 'loading...';
  }

  if (user) {
    console.log(user)
  }

  if (!user) {
    return <Login />;
  }

  return (
    <main>
      <button onClick={logOut}>Sign out</button>
      <p>{user.email}</p>
    </main>
  );
}