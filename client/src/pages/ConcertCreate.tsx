import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { createConcert } from '../api/api';
import { useAuth } from '../store/useAuth';

export default function ConcertCreate() {
  const { user } = useAuth();
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketsQuantity, setTicketsQuantity] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user?.name || !venue.trim() || !city.trim() || !date || !ticketPrice || !ticketsQuantity) {
      setError('Please fill in all required fields');
      return;
    }

    const selectedDate = new Date(date);
    const now = new Date();
    const minDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    if (selectedDate < minDate) {
      setError('Concert date must be at least 3 days from now');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('artist', user._id);
      formData.append('artistName', user.name);
      formData.append('venue', venue);
      formData.append('city', city);
      formData.append('date', date);
      formData.append('description', description);
      formData.append('ticketPrice', ticketPrice);
      formData.append('ticketsQuantity', ticketsQuantity);
      if (selectedImage) {
        formData.append('picture', selectedImage);
      }

      await createConcert(formData);

      setIsUploading(false);

      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/concerts');
      }
    } catch (err: any) {
      setIsUploading(false);
      setError('Failed to create concert');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-[#1a1f25] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Create Concert</h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-2 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Concert Poster
              </label>
              <div className={`w-[300px] h-[300px] border-2 border-dashed rounded-lg ${
                selectedImage ? 'border-green-500' : 'border-gray-600 hover:border-orange-500'
              } transition flex flex-col items-center justify-center h-48 overflow-hidden`}>
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Concert Poster Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="concert-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="concert-image"
                      className="flex flex-col items-center cursor-pointer p-4"
                    >
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <p className="text-sm text-center text-gray-300">Upload concert poster (optional)</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Venue
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className="w-full bg-zinc-800 rounded-md py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Venue"
                    required
                  />
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-zinc-800 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Date & Time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-zinc-800 rounded-md py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                  <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-zinc-800 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Describe your concert"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Ticket Price ($)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={ticketPrice}
                      onChange={e => setTicketPrice(e.target.value)}
                      className="w-full bg-zinc-800 rounded-md py-2 px-4 pl-8 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Price"
                      required
                    />
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Tickets Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={ticketsQuantity}
                      onChange={e => setTicketsQuantity(e.target.value)}
                      className="w-full bg-zinc-800 rounded-md py-2 px-4 pl-8 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Quantity"
                      required
                    />
                    <Users className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
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
                onClick={() => navigate('/concerts')}
                className="mr-4 px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Creating...' : 'Create Concert'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}