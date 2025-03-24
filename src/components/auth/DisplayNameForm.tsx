
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DisplayNameForm: React.FC = () => {
  const { user, setDisplayName } = useAuth();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Pre-populate with user's name if available
  useEffect(() => {
    if (user?.fullName) {
      setName(user.fullName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name (3-20 chars, at least one letter)
    if (!name.trim() || name.length < 3 || name.length > 20 || !/[a-zA-Z]/.test(name)) {
      toast({
        title: "Invalid Name",
        description: "Display name must be 3-20 characters and contain at least one letter.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await setDisplayName(name);
      toast({
        title: "Welcome!",
        description: "Your display name has been set successfully.",
      });
      navigate('/home');
    } catch (error) {
      console.error("Error setting display name:", error);
      toast({
        title: "Error",
        description: "Failed to set display name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cendy-gray p-4">
      <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 space-y-3 text-center">
          <h1 className="text-2xl font-bold text-cendy-text">Choose a Display Name</h1>
          <p className="text-sm text-cendy-text-secondary">
            This is how other students will see you on Cendy.
            {user?.fullName ? " We've suggested a name based on your account." : ""}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your display name"
              className="w-full rounded-xl border border-cendy-gray-medium bg-white px-4 py-3 focus:border-cendy-blue focus:outline-none focus:ring-1 focus:ring-cendy-blue"
              maxLength={20}
              minLength={3}
              required
              autoFocus
            />
            <p className="text-xs text-cendy-text-secondary">
              3-20 characters. This will be visible to others.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-cendy-text-secondary">
              Your real name will be kept private. Only your display name will be shown to other users.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cendy-blue px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-cendy-blue-dark focus:outline-none focus:ring-2 focus:ring-cendy-blue focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Save & Continue
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DisplayNameForm;
