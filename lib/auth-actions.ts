'use server';

import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth';

export async function signInAction(provider: string, callbackUrl?: string) {
  await authSignIn(provider, { redirectTo: callbackUrl || '/' });
}

export async function signInCredentials(email: string, password: string) {
  try {
    const result = await authSignIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      return { success: false, error: result.error };
    }
    
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
    return { success: false, error: errorMessage };
  }
}

export async function signOutAction() {
  await authSignOut({ redirectTo: '/' });
}
