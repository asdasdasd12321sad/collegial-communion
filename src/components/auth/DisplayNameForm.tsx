
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const DisplayNameForm: React.FC = () => {
  const { setDisplayName } = useAuth();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name (3-20 chars, at least one letter)
    if (!name.trim() || name.length < 3 || name.length > 20 || !/[a-zA-Z]/.test(name)) {
      toast({
        title: "Invalid Name",
        description: "Name must be 3-20 characters and contain at least one letter.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate a short delay for better UX
    setTimeout(() => {
      setDisplayName(name);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-md animate-fade-in px-4 py-8 text-center">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-cendy-text">Choose a Display Name</h1>
        <p className="text-sm text-cendy-text-secondary">
          This is how other students will see you on Cendy
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
          <p className="text-xs text-cendy-text-secondary">3-20 characters</p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-xl bg-cendy-blue px-4 py-3 font-medium text-white transition-all duration-300 hover:bg-cendy-blue-dark focus:outline-none focus:ring-2 focus:ring-cendy-blue focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Save & Continue'
          )}
        </button>
      </form>
    </div>
  );
};

export default DisplayNameForm;
