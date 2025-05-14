import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Pause, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { Track } from '../../types';
import { usePlayerStore } from '../../store/playerStore';

const AdminTrackManagement: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  
  // Mock data loading
  useEffect(() => {
    setTimeout(() => {
      const mockUser = {
        id: '1',
        username: 'Artist Name',
        email: 'artist@example.com',
        isArtist: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const mockTracks: Track[] = Array.from({ length: 15 }, (_, i) => ({
        id: `track-${i + 1}`,
        title: `Track Title ${i + 1}`,
        description: i % 2 === 0 ? `Description for track ${i + 1}` : undefined,
        coverArt: i % 3 === 0 ? `https://picsum.photos/seed/track${i + 1}/300/300` : undefined,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 180 + i * 30,
        userId: i % 5 === 0 ? 'user-2' : mockUser.id,
        user: i % 5 === 0 ? { 
          ...mockUser, 
          id: 'user-2', 
          username: 'Another Artist' 
        } : mockUser,
        plays: 1000 + i * 100,
        likes: 120 + i * 15,
        commentsCount: 10 + i * 2,
        createdAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setTracks(mockTracks);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const filteredTracks = tracks.filter(track => {
    return track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           track.user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handlePlayPause = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Track Management</h1>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Search tracks..."
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Tracks</option>
              <option value="reported">Reported Only</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-10">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Track
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Artist
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stats
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredTracks.map((track, index) => {
                const isCurrentTrack = currentTrack?.id === track.id;
                
                return (
                  <tr key={track.id} className="hover:bg-gray-750 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <button 
                          onClick={() => handlePlayPause(track)}
                          className="group absolute inset-0 flex items-center justify-center transition bg-gray-700 hover:bg-orange-500 rounded-full"
                        >
                          {isCurrentTrack && isPlaying ? (
                            <Pause size={14} className="text-white" />
                          ) : (
                            <Play size={14} className="text-white" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {track.coverArt ? (
                            <img 
                              className="h-10 w-10 object-cover" 
                              src={track.coverArt} 
                              alt={track.title} 
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-700 flex items-center justify-center text-gray-300">
                              <span className="text-xs">{track.title.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {track.title}
                          </div>
                          {track.description && (
                            <div className="text-xs text-gray-400 truncate max-w-xs">
                              {track.description}
                            </div>
                          )}
                        </div>
                        {/* Flag for moderation */}
                        {index % 7 === 0 && (
                          <div className="ml-2 text-red-500" title="Reported for violation">
                            <AlertTriangle size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{track.user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(track.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {formatNumber(track.plays)} plays
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatNumber(track.likes)} likes • {formatNumber(track.commentsCount)} comments
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatTime(track.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left group">
                        <button className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-700 focus:outline-none">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-750 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden group-hover:block">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <a href="#" className="text-gray-300 block px-4 py-2 text-sm hover:bg-gray-700" role="menuitem">
                              View Track
                            </a>
                            <a href="#" className="text-gray-300 block px-4 py-2 text-sm hover:bg-gray-700" role="menuitem">
                              Edit Metadata
                            </a>
                            <a href="#" className="text-yellow-500 block px-4 py-2 text-sm hover:bg-gray-700" role="menuitem">
                              Flag Content
                            </a>
                            <a href="#" className="text-red-500 block px-4 py-2 text-sm hover:bg-gray-700" role="menuitem">
                              Remove Track
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredTracks.length === 0 && (
          <div className="py-8 text-center text-gray-400">
            No tracks found matching your search criteria
          </div>
        )}
        
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium">{filteredTracks.length}</span> of <span className="font-medium">{tracks.length}</span> tracks
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-600 rounded-md text-gray-400 hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-600 rounded-md text-gray-400 hover:bg-gray-700 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrackManagement;