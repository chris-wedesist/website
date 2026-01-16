'use server';

import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth';

export async function signInAction(provider: string, callbackUrl?: string) {
  await authSignIn(provider, { redirectTo: callbackUrl || '/' });
}

export async function signInCredentials(email: string, password: string) {
  try {
    await authSignIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Invalid credentials' };
  }
}

export async function signOutAction() {
  await authSignOut({ redirectTo: '/' });
}
