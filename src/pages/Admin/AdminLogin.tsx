import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Logo from '../../components/Logo';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { loginEmail, loginGoogle, sendPasswordReset, enableDemoAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await loginEmail(email.trim(), password);
      showToast('Admin logged in successfully', 'success');
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      console.warn('Firebase email login error:', err);
      // Helpful message for Firebase Auth setup
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/operation-not-allowed') || msg.includes('auth/configuration-not-found')) {
        setErrorMsg('Email/Password provider is not enabled in Firebase Console yet. Use Google Sign-In or Quick Demo Admin Mode below.');
      } else if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found')) {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      } else {
        setErrorMsg('Authentication failed: ' + (err instanceof Error ? err.message : 'Please check credentials.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginGoogle();
      showToast('Google Sign-in verified', 'success');
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      console.warn('Google sign in notice:', err);
      setErrorMsg('Google Sign-In was closed or cancelled. Try again or use Quick Demo Admin Mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email to receive password reset link.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await sendPasswordReset(email.trim());
      setResetSent(true);
      showToast('Password reset link sent to ' + email, 'success');
    } catch (err: unknown) {
      setErrorMsg('Could not send reset email: ' + (err instanceof Error ? err.message : 'Error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminLogin = () => {
    enableDemoAdmin();
    showToast('Admin access granted (Preview Mode)', 'success');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-md p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full w-fit mx-auto border border-emerald-200/60">
            <Shield className="w-3.5 h-3.5 text-[#0e6245]" />
            <span>Secure Administration Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isResetMode ? 'Reset Admin Password' : 'Administrator Login'}
          </h1>
          <p className="text-xs text-gray-500">
            {isResetMode
              ? 'Enter your registered email address to receive reset instructions.'
              : 'Authorized foundation personnel only. All access is logged and protected.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {resetSent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3 text-xs text-emerald-900">
            <p className="font-semibold">Reset instructions have been dispatched.</p>
            <p className="text-gray-600">Please check your inbox at {email}.</p>
            <button
              onClick={() => {
                setResetSent(false);
                setIsResetMode(false);
              }}
              className="font-bold text-[#0e6245] hover:underline cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : isResetMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aftab2012ka@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#0e6245] hover:bg-[#0b4d36] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Send Password Reset Link</span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="text-xs text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Primary Action: Google Sign In */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-gray-600 tracking-wider flex items-center justify-between">
                <span>Recommended Sign-In</span>
                <span className="text-[11px] font-normal text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Pre-configured</span>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border-2 border-emerald-700/30 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-600 text-gray-900 font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs group"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900 group-hover:text-emerald-950">Sign In with Google</div>
                  <div className="text-[11px] text-gray-500 font-normal">Authorized: aftab2012ka@gmail.com</div>
                </div>
              </button>
            </div>

            {/* Quick Demo Preview Access */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center space-y-1.5">
              <div className="text-xs text-gray-600">Want to preview the admin management tools instantly?</div>
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="text-xs text-[#0e6245] hover:text-[#0a4631] font-bold py-1 px-3 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Enter Admin Dashboard (Preview Mode)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Collapsible / Alternative Email & Password */}
            <details className="group border border-gray-200 rounded-xl p-3.5">
              <summary className="text-xs font-semibold text-gray-600 cursor-pointer flex items-center justify-between select-none">
                <span>Or Sign In with Email & Password</span>
                <span className="text-[10px] text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <form onSubmit={handleEmailLogin} className="space-y-3.5 pt-3">
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60 leading-relaxed">
                  Note: Email/Password login requires enabling "Email/Password" in Firebase Console &gt; Authentication &gt; Sign-in method. Google Sign-In above is ready to use immediately.
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aftab2012ka@gmail.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsResetMode(true)}
                      className="text-[11px] text-emerald-800 hover:underline font-medium"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking Credentials...</span>
                    </>
                  ) : (
                    <span>Sign In with Password</span>
                  )}
                </button>
              </form>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
