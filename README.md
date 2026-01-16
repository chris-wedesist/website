# Auth.js v5 Migration

This project has been successfully migrated from `next-auth` v4 to Auth.js v5 (next-auth v5 beta).

## Key Changes

### Authentication Architecture
- **Centralized Configuration**: All auth logic is now centralized in `lib/auth.ts`
- **API Routes**: Migrated from `api/auth/[...nextauth]` to `api/auth/[...auth]` 
- **Session Management**: Using server-side session handling with client hooks
- **Server Actions**: Authentication actions (sign in, sign out) now use Next.js server actions

### Migration Highlights
1. ✅ Removed `next-auth` v4.24.11
2. ✅ Installed `next-auth` v5.0.0-beta.30 (Auth.js v5)
3. ✅ Updated `@auth/prisma-adapter` to latest version
4. ✅ Created centralized auth config in `lib/auth.ts`
5. ✅ Implemented server actions for authentication (`lib/auth-actions.ts`)
6. ✅ Created custom session hook (`lib/use-session.ts`)
7. ✅ Updated all components to use new Auth.js v5 patterns
8. ✅ Prisma schema already compatible with Auth.js v5 models

### Authentication Setup

#### Environment Variables
Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for development)
- `GOOGLE_CLIENT_ID`: (Optional) For Google OAuth
- `GOOGLE_CLIENT_SECRET`: (Optional) For Google OAuth

#### Supported Authentication Methods
1. **Credentials**: Email/password authentication
2. **Google OAuth**: OAuth 2.0 authentication with Google

#### Usage Examples

**Client Component Session:**
```tsx
import { useSession } from '@/lib/use-session';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not signed in</div>;
  
  return <div>Welcome {session.user.name}</div>;
}
```

**Server Component Session:**
```tsx
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    return <div>Not authenticated</div>;
  }
  
  return <div>Welcome {session.user.name}</div>;
}
```

**Sign In/Out Actions:**
```tsx
import { signInAction, signOutAction } from '@/lib/auth-actions';

// Sign in with Google
await signInAction('google', '/dashboard');

// Sign out
await signOutAction();
```

### Database Models

The application uses Prisma with the following Auth.js v5 compatible models:
- `Account`: OAuth account information
- `Session`: User session data
- `User`: User profile and credentials
- `VerificationToken`: Email verification tokens

Run migrations:
```bash
npx prisma generate
npx prisma db push
```

## Development

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Linting and Formatting
```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format code with Prettier
```

## Updates
- Migrated authentication from next-auth v4 to Auth.js v5
- Refined user login process with server actions
- Updated documentation to reflect changes in authentication method
- Centralized authentication configuration
- Improved type safety with TypeScript
