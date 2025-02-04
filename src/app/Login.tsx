'use client';

import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

import { useAuth } from './context/AuthContext';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

export default function Login() {
  const { signInWithEmail } = useAuth();
   const theme = useTheme();

   const signIn: (provider: AuthProvider, formData: FormData) => void = async (
  provider,
  formData,
) => {
  const promise = new Promise<void>((resolve) => {    
      signInWithEmail( 
        (formData.get('email') as string) ?? '',
  (formData.get('password') as string) ?? ''
    )
      resolve();
  });
  return promise;
};

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{ emailField: { autoFocus: false } }}
      />
    </AppProvider>
  );
}