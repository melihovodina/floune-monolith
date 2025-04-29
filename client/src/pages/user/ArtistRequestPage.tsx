import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ArtistRequestPage: React.FC = () => {
  const [reason, setReason] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason || !agreement) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    }, 1500);
  };
  
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 text-green-500 mx-auto w-20 h-20 flex items-center justify-center">
            <CheckCircle size={80} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Request Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Your artist request has been successfully submitted and is now pending review. 
            We'll notify you once your request has been processed.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition"
          >
            Return to Profile
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Become an Artist</h1>
        
        <div className="mb-8 p-4 bg-gray-700/50 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-2">Artist Benefits</h2>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Upload unlimited tracks to share with the SoundWave community
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Gain access to detailed analytics and insights about your audience
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Get a verified artist badge on your profile
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Appear in artist-only sections and promotions
            </li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="reason" className="block text-gray-300 font-medium mb-2">
              Why do you want to become an artist on SoundWave?*
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-32"
              placeholder="Tell us about yourself and your music..."
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="social-links" className="block text-gray-300 font-medium mb-2">
              Social Media & Music Links (Optional)
            </label>
            <textarea
              id="social-links"
              value={socialLinks}
              onChange={(e) => setSocialLinks(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-24"
              placeholder="Add links to your Spotify, YouTube, Instagram, etc."
            />
            <p className="mt-1 text-sm text-gray-400">
              Adding links helps us verify your identity and music background
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreement"
                  type="checkbox"
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  className="w-4 h-4 bg-gray-700 border-gray-600 rounded"
                  required
                />
              </div>
              <label htmlFor="agreement" className="ml-3 text-sm text-gray-300">
                I agree to the <a href="/terms" className="text-orange-500 hover:text-orange-400">Terms of Service</a> and acknowledge 
                that my request will be reviewed by the SoundWave team. I understand that I need to 
                comply with all platform policies regarding copyright and content guidelines.
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason || !agreement || isSubmitting}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtistRequestPage;