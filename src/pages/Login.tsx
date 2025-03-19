
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginButton from '@/components/auth/LoginButton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Mail, Apple, MailIcon } from 'lucide-react';

// Custom icons for SSO providers
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 11H0V0h11v11z" fill="#F25022" />
    <path d="M23 11H12V0h11v11z" fill="#7FBA00" />
    <path d="M11 23H0V12h11v11z" fill="#00A4EF" />
    <path d="M23 23H12V12h11v11z" fill="#FFB900" />
  </svg>
);

const Login: React.FC = () => {
  const { isLoading, loginWithGoogle, loginWithMicrosoft, loginWithApple, loginWithEmail } = useAuth();
  const [isOtherOptionsOpen, setIsOtherOptionsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithEmail(email, password);
  };
  
  return (
    <div className="flex min-h-screen flex-col justify-center bg-cendy-gray p-4">
      <div className="mx-auto w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-cendy-text">Cendy</h1>
          <p className="text-sm text-cendy-text-secondary">The College Connection App</p>
        </div>
        
        <div className="space-y-4">
          <LoginButton
            onClick={loginWithGoogle}
            icon={<GoogleIcon />}
            label="Continue with Google"
            isLoading={isLoading}
          />
          
          <LoginButton
            onClick={loginWithMicrosoft}
            icon={<MicrosoftIcon />}
            label="Continue with Microsoft"
            isLoading={isLoading}
          />
          
          <LoginButton
            onClick={loginWithApple}
            icon={<Apple size={20} />}
            label="Continue with Apple"
            isLoading={isLoading}
          />
          
          <Collapsible open={isOtherOptionsOpen} onOpenChange={setIsOtherOptionsOpen} className="space-y-4 pt-2">
            <CollapsibleTrigger className="flex w-full items-center justify-center gap-1 text-sm text-cendy-text-secondary">
              Other options
              <ChevronDown size={16} className={`transition-transform duration-300 ${isOtherOptionsOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full rounded-xl border border-cendy-gray-medium px-4 py-3 focus:border-cendy-blue focus:outline-none focus:ring-1 focus:ring-cendy-blue"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-cendy-gray-medium px-4 py-3 focus:border-cendy-blue focus:outline-none focus:ring-1 focus:ring-cendy-blue"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cendy-blue px-4 py-3 font-medium text-white transition-all duration-300 hover:bg-cendy-blue-dark focus:outline-none focus:ring-2 focus:ring-cendy-blue focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <MailIcon size={20} />
                      <span>Continue with Email</span>
                    </>
                  )}
                </button>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="mt-8 text-center text-xs text-cendy-text-secondary">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
