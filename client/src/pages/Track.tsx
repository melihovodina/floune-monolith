import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, Pause, Heart, Share2, Music } from 'lucide-react';
import { getTrackById, getUserById, listenTrack } from '../api/api';
import { usePlayer } from '../store/usePlayer';
import { FastAverageColor } from 'fast-average-color';
import Notification from '../components/Notification';
import FollowButton from '../components/FollowButton';

const Track: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [artist, setArtist] = useState<any>(null);
  const [isArtistLoading, setIsArtistLoading] = useState(true);
  const [bgGradient, setBgGradient] = useState<string>('linear-gradient(to bottom, #2d3748, #1a202c)');
  const imgRef = useRef<HTMLImageElement>(null);
  const [showCopied, setShowCopied] = useState(false);
  const fac = new FastAverageColor();
  const {
    currentTrack,
    isPlaying,
    setTrack: setPlayerTrack,
    setIsPlaying,
  } = usePlayer();

  const isCurrentTrack = currentTrack?._id === id;

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setIsArtistLoading(true);
    getTrackById(id)
      .then(res => {
        setTrack(res.data);
        setIsLoading(false);

        if (res.data.artistId) {
          getUserById(res.data.artistId)
            .then(artistRes => {
              setArtist(artistRes.data);
              setIsArtistLoading(false);
            })
            .catch(() => setIsArtistLoading(false));
        } else {
          setIsArtistLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsArtistLoading(false);
      });
  }, [id]);

  const handlePlayPause = async () => {
    if (!track) return;
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayerTrack(track);
      await listenTrack(track._id);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  }

  const handleImgLoad = () => {
    if (imgRef.current) {
      fac.getColorAsync(imgRef.current)
        .then((color: { hex: string }) => {
          const from = darkenHex(color.hex, 0.6);
          setBgGradient(`linear-gradient(to bottom, ${from}, #1a202c)`);
        })
        .catch(() => {
          setBgGradient('linear-gradient(to bottom, #2d3748, #1a202c)');
        });
    }
  };

  const darkenHex = (hex: string, factor: number): string => {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const num = parseInt(hex, 16);
    let r = Math.floor(((num >> 16) & 0xff) * factor);
    let g = Math.floor(((num >> 8) & 0xff) * factor);
    let b = Math.floor((num & 0xff) * factor);
    return `rgb(${r},${g},${b})`;
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() ?? '';
  };

  const setArtistFollowers = (n: number) => {
    if (artist) setArtist({ ...artist, followers: n });
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
      {showCopied && <Notification message="Track link copied"/>}
      <div
        className="rounded-lg overflow-hidden shadow-lg mb-8"
        style={{ background: bgGradient }}
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              {track.picture ? (
                <img
                  ref={imgRef}
                  crossOrigin="anonymous"
                  src={`http://localhost:5000/${track.picture}`}
                  alt={track.name}
                  className="w-full aspect-square object-cover rounded-lg shadow-md"
                  onLoad={handleImgLoad}
                />
              ) : (
                <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">{track.name}</span>
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-gray-400 flex items-center">
                    <Music size={20} className="mr-1" />
                    <span className="text-sm">{formatNumber(track.listens ?? 0)}</span>
                  </div>
                  <div className="text-gray-400 transition group flex items-center">
                    <Heart size={20} />
                    <span className="ml-1 text-sm">{formatNumber(track.likes)}</span>
                  </div>
                  <button
                    className="text-gray-400 hover:text-white transition group flex items-center"
                    onClick={handleShare}
                    type="button"
                  >
                    <Share2 size={20} />
                  </button>
                  <span className="text-sm text-gray-400 mx-1">•</span>
                  <span className="text-sm text-gray-400">{formatDate(track.createdAt)}</span>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Artist</h3>
                  <div className="flex items-center">
                    {isArtistLoading ? (
                      <div className="w-10 h-10 bg-gray-700 rounded-full mr-3 animate-pulse" />
                    ) : artist && artist.picture ? (
                      <img
                        src={`http://localhost:5000/${artist.picture}`}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <img
                        src={`/blank.webp`}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    )}
                    <div>
                      <Link
                        to={artist ? `/profile/${artist.name}` : "#"}
                        className={`text-white font-medium hover:underline ${!artist ? "pointer-events-none opacity-60" : ""}`}
                      >
                        {artist ? artist.name : track.artistName}
                      </Link>
                      <p className="text-sm text-gray-400">{artist ? formatNumber(artist.followers || 0) : '—'} followers</p>
                    </div>
                    {artist && (
                      <FollowButton
                        targetUserId={artist._id}
                        followers={artist.followers || 0}
                        setFollowers={setArtistFollowers}
                        size="small"
                        className="ml-auto"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="flex items-center mb-4">
                <button
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#ff5500] rounded-full hover:bg-orange-600 text-white mr-4 transition"
                  onClick={handlePlayPause}
                >
                  {isCurrentTrack && isPlaying ? <Pause size={24} fill="white"/> : <Play size={24} className='ml-[2px]' fill="white"/>}
                </button>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white break-words">{track.name}</h1>
                </div>
              </div>

              <div className="mb-8 p-2">
                <p className="text-white text-xl">{track.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;