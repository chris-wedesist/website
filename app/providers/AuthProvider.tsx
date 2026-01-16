'use client';

// Auth.js v5 doesn't require a SessionProvider wrapper
// Session is handled via server components and the auth() helper
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
