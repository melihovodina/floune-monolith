import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Music } from 'lucide-react';
import { createTrack } from '../api/api';

const UploadTrack: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedCoverArt, setSelectedCoverArt] = useState<File | null>(null);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudioFile || !title.trim()) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', title);
      formData.append('text', description);
      formData.append('audio', selectedAudioFile);
      if (selectedCoverArt) {
        formData.append('picture', selectedCoverArt);
      }

      await createTrack(formData);

      setIsUploading(false);
      navigate('/library');
    } catch (error) {
      setIsUploading(false);
      alert('Failed to upload track');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-[#1a1f25] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Upload Track</h1>
        
        <form onSubmit={handleSubmit}>
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
                      <p className="text-white font-medium truncate max-w-[160px] sm:max-w-none ">{selectedAudioFile.name}</p>
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
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Cover Art
              </label>
              <div className={`w-[300px] h-[300px] border-2 border-dashed rounded-lg ${
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
                  className="w-full bg-zinc-800 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full bg-zinc-800 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-24 sm:h-52"
                  placeholder="Describe your track (optional)"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end relative">
            {isUploading && (
              <div className="absolute left-0">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="flex ml-auto">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadTrack;