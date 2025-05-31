import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Music } from 'lucide-react';

const UploadTrack: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedCoverArt, setSelectedCoverArt] = useState<File | null>(null);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedAudioFile(e.target.files[0]);
    }
  };
  
  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedCoverArt(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setCoverArtPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveCoverArt = () => {
    setSelectedCoverArt(null);
    setCoverArtPreview(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAudioFile) {
      alert('Please select an audio file to upload');
      return;
    }
    
    // Simulate upload
    setIsUploading(true);
    
    // Mock progress updates
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Simulate delay for processing
          setTimeout(() => {
            setIsUploading(false);
            navigate('/');
          }, 1000);
          
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Upload Track</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Audio File Upload */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Track File
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 ${
              selectedAudioFile ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-orange-500'
            } transition text-center`}>
              {selectedAudioFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Music size={24} className="text-green-500 mr-3" />
                    <div className="text-left">
                      <p className="text-white font-medium truncate">{selectedAudioFile.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(selectedAudioFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAudioFile(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    id="audio-file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="audio-file"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload size={40} className="text-gray-400 mb-3" />
                    <p className="text-white font-medium mb-1">Drag and drop your audio file or click to browse</p>
                    <p className="text-gray-400 text-sm">MP3, WAV, FLAC, OGG, or AAC (max 50MB)</p>
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Art Upload */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Cover Art
              </label>
              <div className={`border-2 border-dashed rounded-lg ${
                selectedCoverArt ? 'border-green-500' : 'border-gray-600 hover:border-orange-500'
              } transition flex flex-col items-center justify-center h-48 overflow-hidden`}>
                {coverArtPreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={coverArtPreview}
                      alt="Cover Art Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveCoverArt}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="cover-art"
                      accept="image/*"
                      onChange={handleCoverArtChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="cover-art"
                      className="flex flex-col items-center cursor-pointer p-4"
                    >
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <p className="text-sm text-center text-gray-300">Upload cover image (optional)</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            {/* Track Info */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-300 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter track title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-24"
                  placeholder="Describe your track (optional)"
                />
              </div>
            </div>
          </div>
          
          {isUploading && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-300">Uploading... {uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mr-4 px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedAudioFile || isUploading}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Track'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadTrack;