import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Heart, Share2, Play as PlaylistAdd, MessageSquare, Download, Clock } from 'lucide-react';
import { Track, Comment } from '../../types';
import { usePlayerStore } from '../../store/playerStore';
import WaveformDisplay from '../../components/waveform/WaveformDisplay';

const TrackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  
  const isCurrentTrack = currentTrack?.id === id;
  
  // Mock data loading
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockUser = {
        id: '1',
        username: 'Artist Name',
        email: 'artist@example.com',
        profilePicture: 'https://picsum.photos/seed/artist/300/300',
        isArtist: true,
        bio: 'Electronic music producer from Berlin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const mockTrack: Track = {
        id: id || 'track-1',
        title: 'Awesome Track Title',
        description: 'This is a sample track description with some details about how it was created.',
        coverArt: 'https://picsum.photos/seed/cover/600/600',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 240,
        userId: mockUser.id,
        user: mockUser,
        plays: 12500,
        likes: 843,
        commentsCount: 36,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        updatedAt: new Date().toISOString()
      };
      
      const mockComments: Comment[] = Array.from({ length: 12 }, (_, i) => ({
        id: `comment-${i}`,
        content: `This is comment ${i + 1}. Great track, I really like the beat at 1:${i < 10 ? '0' + i : i}!`,
        timestamp: i * 20,
        userId: `user-${i % 5}`,
        user: {
          id: `user-${i % 5}`,
          username: `User ${i % 5 + 1}`,
          email: `user${i % 5 + 1}@example.com`,
          profilePicture: `https://picsum.photos/seed/user${i % 5}/300/300`,
          isArtist: i % 3 === 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        trackId: id || 'track-1',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setTrack(mockTrack);
      setComments(mockComments);
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  const handlePlayPause = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else if (track) {
      playTrack(track);
    }
  };
  
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
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !track) return;
    
    // In a real app, this would be an API call
    const newCommentObj: Comment = {
      id: `comment-new-${Date.now()}`,
      content: newComment,
      userId: 'current-user',
      user: {
        id: 'current-user',
        username: 'Current User',
        email: 'currentuser@example.com',
        profilePicture: 'https://picsum.photos/seed/current/300/300',
        isArtist: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      trackId: track.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
    
    // Update comment count
    setTrack({
      ...track,
      commentsCount: track.commentsCount + 1
    });
  };
  
  if (isLoading || !track) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto pb-8">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Track Cover & Info */}
            <div className="md:w-1/3">
              {track.coverArt ? (
                <img 
                  src={track.coverArt} 
                  alt={track.title}
                  className="w-full aspect-square object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">{track.title}</span>
                </div>
              )}
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-white transition group flex items-center">
                    <Heart size={20} className="group-hover:text-pink-500" />
                    <span className="ml-1 text-sm">{formatNumber(track.likes)}</span>
                  </button>
                  <button className="text-gray-400 hover:text-white transition group flex items-center">
                    <MessageSquare size={20} />
                    <span className="ml-1 text-sm">{formatNumber(track.commentsCount)}</span>
                  </button>
                  <button className="text-gray-400 hover:text-white transition group flex items-center">
                    <PlaylistAdd size={20} />
                  </button>
                  <button className="text-gray-400 hover:text-white transition group flex items-center">
                    <Share2 size={20} />
                  </button>
                  <button className="text-gray-400 hover:text-white transition group flex items-center">
                    <Download size={20} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock size={14} />
                  <span>{formatTime(track.duration)}</span>
                  <span className="mx-1">•</span>
                  <span>{formatDate(track.createdAt)}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-700">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Artist</h3>
                  <div className="flex items-center">
                    {track.user.profilePicture ? (
                      <img 
                        src={track.user.profilePicture} 
                        alt={track.user.username}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded-full mr-3" />
                    )}
                    <div>
                      <p className="text-white font-medium">{track.user.username}</p>
                      <p className="text-sm text-gray-400">{formatNumber(12500)} followers</p>
                    </div>
                    <button className="ml-auto bg-transparent hover:bg-gray-700 text-gray-300 text-sm border border-gray-600 rounded-full px-4 py-1 transition">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Waveform & Comments */}
            <div className="md:w-2/3">
              <div className="flex items-center mb-4">
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 mr-4 transition"
                  onClick={handlePlayPause}
                >
                  {isCurrentTrack && isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">{track.title}</h1>
                  <p className="text-gray-400">{track.user.username}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <WaveformDisplay 
                  audioUrl={track.audioUrl}
                  isPlaying={isCurrentTrack && isPlaying}
                  onPlayPause={handlePlayPause}
                  height={80}
                  waveColor="rgba(255, 255, 255, 0.3)"
                  progressColor="#f97316"
                />
              </div>
              
              {track.description && (
                <div className="mb-8 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300">{track.description}</p>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Comments ({track.commentsCount})
                </h2>
                
                <form onSubmit={handleAddComment} className="mb-6 flex">
                  <img 
                    src="https://picsum.photos/seed/current/300/300"
                    alt="Your profile"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment"
                      className="w-full bg-gray-700 border border-gray-600 rounded-full py-2 px-4 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 20V4L22 12L3 20ZM5 17L16.85 12L5 7V10.5L11 12L5 13.5V17Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </form>
                
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex">
                      <img 
                        src={comment.user.profilePicture || `https://picsum.photos/seed/${comment.userId}/300/300`}
                        alt={comment.user.username}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-white mr-2">{comment.user.username}</span>
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.timestamp !== undefined && (
                            <button className="ml-2 text-xs text-orange-500 hover:text-orange-400 transition">
                              at {formatTime(comment.timestamp)}
                            </button>
                          )}
                        </div>
                        <p className="text-gray-300">{comment.content}</p>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-400">
                          <button className="hover:text-white transition">Like</button>
                          <button className="hover:text-white transition">Reply</button>
                          <button className="hover:text-white transition">Share</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetailPage;