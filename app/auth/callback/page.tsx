"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import supabase from "../../../utils/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already logged in before processing callback - check immediately
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if email is confirmed in our custom users table
          const { data: userData } = await supabase
            .from('users')
            .select('email_confirmed')
            .eq('id', session.user.id)
            .single();

          if (userData && userData.email_confirmed === true) {
            // User is already logged in and confirmed, redirect immediately
            router.replace('/account');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [router]);

  useEffect(() => {
    // Only process callback if not checking auth
    if (checkingAuth) return;

    const handleAuthCallback = async () => {
      try {
        // Check if this is a custom email confirmation
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const confirmed = urlParams.get('confirmed');
        
        if (email && confirmed === 'true') {
          // This is a custom email confirmation
          console.log('Custom email confirmation detected:', { email, confirmed });
          
          // Get pending user data from localStorage
          const pendingUserId = localStorage.getItem('pendingUserId');
          const pendingUserEmail = localStorage.getItem('pendingUserEmail');
          const pendingUserName = localStorage.getItem('pendingUserName');
          
          console.log('Pending user data:', { 
            pendingUserId, 
            pendingUserEmail, 
            pendingUserName,
            urlEmail: email 
          });
          
          // Decode the email from URL and compare
          const decodedEmail = decodeURIComponent(email);
          const emailMatches = pendingUserEmail === decodedEmail || pendingUserEmail === email;
          
          if (pendingUserId && emailMatches) {
            setStatus('success');
            setMessage('Email confirmed successfully! Activating your account...');
            
            // Mark email as confirmed in the database
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                email_confirmed: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', pendingUserId);

            if (updateError) {
              console.error('Error updating email confirmation:', updateError);
              // Continue anyway - user can still proceed
            } else {
              console.log('Email confirmation updated successfully for user:', pendingUserId);
            }
            
            // Update user data in localStorage
            localStorage.setItem('userId', pendingUserId);
            localStorage.setItem('userEmail', pendingUserEmail);
            localStorage.setItem('userName', pendingUserName || 'User');
            localStorage.setItem('emailConfirmed', 'true');
            
            // Clean up pending data
            localStorage.removeItem('pendingUserId');
            localStorage.removeItem('pendingUserEmail');
            localStorage.removeItem('pendingUserName');
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push("/auth/login");
            }, 2000);
          } else {
            console.error('Email validation failed:', {
              pendingUserId: !!pendingUserId,
              emailMatches,
              pendingUserEmail,
              urlEmail: email,
              decodedEmail
            });
            
            // Fallback: If localStorage data is missing, try to find the user in Supabase
            if (!pendingUserId || !pendingUserEmail) {
              console.log('Attempting fallback: checking Supabase for user with email:', decodedEmail);
              
              try {
                // Query the users table to find the user by email
                const { data: userData, error: queryError } = await supabase
                  .from('users')
                  .select('id, email, full_name, email_confirmed')
                  .eq('email', decodedEmail)
                  .single();
                
                if (userData && !queryError) {
                  console.log('User found in database:', userData);
                  
                  // Update email_confirmed to true
                  const { error: updateError } = await supabase
                    .from('users')
                    .update({ 
                      email_confirmed: true,
                      updated_at: new Date().toISOString()
                    })
                    .eq('id', userData.id);
                  
                  if (updateError) {
                    console.error('Error updating email confirmation:', updateError);
                  } else {
                    console.log('Email confirmation updated successfully for user:', userData.id);
                  }
                  
                  setStatus('success');
                  setMessage('Email confirmed! Please log in with your password.');
                  
                  // Redirect to login page
                  setTimeout(() => {
                    router.push("/auth/login");
                  }, 2000);
                  return;
                } else {
                  console.error('User not found in database:', queryError);
                }
              } catch (fallbackError) {
                console.error('Fallback check failed:', fallbackError);
              }
            }
            
            setStatus('error');
            setMessage('Invalid confirmation link. Please try registering again.');
          }
          return;
        }

        // Handle regular Supabase auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          return;
        }

        if (data.session) {
          // Check if this is an email confirmation
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email_confirmed_at) {
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting...');
            
            // Save user data to localStorage
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userEmail', user.email || '');
            localStorage.setItem('userName', user.user_metadata?.full_name || user.email || 'Anonymous User');
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push("/community");
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Email confirmation failed. Please try again.');
          }
        } else {
          setStatus('error');
          setMessage('No session found. Please try logging in again.');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [router, checkingAuth]);

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto p-8"
      >
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Success!</h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
} 