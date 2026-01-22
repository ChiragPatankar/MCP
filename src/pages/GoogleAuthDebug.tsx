import React from 'react';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { useAuth } from '@/context/AuthContext';

const GoogleAuthDebug: React.FC = () => {
  const { loginWithGoogle, signupWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl border border-slate-200 p-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Google Auth Debug
          </h1>
          <p className="text-sm text-slate-600">
            This page is for testing and debugging Google authentication integration.
          </p>
        </header>

        <section className="space-y-4">
          <p className="text-sm text-slate-700">
            Use the buttons below to trigger the real Google sign-in flow and verify that:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
            <li>The Google One Tap / popup renders correctly.</li>
            <li>The credential is exchanged with the backend at <code>/auth/google</code>.</li>
            <li>The user object and token are stored in local storage.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <GoogleAuthButton
            mode="signin"
            onSuccess={async () => {
              await loginWithGoogle();
            }}
            onError={(error) => {
              // eslint-disable-next-line no-console
              console.error('Google sign-in error:', error);
            }}
          />

          <GoogleAuthButton
            mode="signup"
            onSuccess={async () => {
              await signupWithGoogle();
            }}
            onError={(error) => {
              // eslint-disable-next-line no-console
              console.error('Google signup error:', error);
            }}
          />
        </section>

        <section className="pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            If you encounter issues, open the browser console to inspect Google auth logs
            and network requests to the backend.
          </p>
        </section>
      </div>
    </div>
  );
};

export default GoogleAuthDebug;



