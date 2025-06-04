import { useEffect, useState, useMemo } from 'react';
import { getAllTracks, searchTracks, searchUsers } from '../api/api';
import { Track, User } from '../types';
import TrackCard from '../components/TrackCard';
import { Search as SearchIcon, ChevronDown } from 'lucide-react';
import { TracksSortBy } from '../types';
import { Listbox } from '@headlessui/react';
import * as Tabs from '@radix-ui/react-tabs';
import { useNavigate } from 'react-router-dom';

const searchByOptions = [
  { value: 'name', label: 'Track Name' },
  { value: 'artist', label: 'Artist' },
];

const sortByOptions = [
  { value: 'createdAt', label: 'Latest' },
  { value: 'listens', label: 'Most Played' },
  { value: 'likes', label: 'Most Liked' },
];

export default function Search() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'artist'>('name');
  const [sortBy, setSortBy] = useState<TracksSortBy>('createdAt');
  const [tab, setTab] = useState<'tracks' | 'artists'>('tracks');
  const [originalTracks, setOriginalTracks] = useState<Track[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === 'tracks') {
      fetchTracks();
    } else {
      fetchPopularArtists();
    }
  }, [tab]);

  const filteredTracks = useMemo(() => {
    let filtered = [...tracks];
    if (searchQuery.trim()) {
      filtered = filtered.filter((track: Track) =>
        (searchBy === 'artist'
          ? track.artistName.toLowerCase().includes(searchQuery.toLowerCase())
          : track.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    filtered.sort((a: Track, b: Track) => {
      switch (sortBy) {
        case 'listens':
          return b.listens - a.listens;
        case 'likes':
          return b.likes - a.likes;
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
    return filtered;
  }, [tracks, searchQuery, searchBy, sortBy]);

  const fetchTracks = async () => {
    setIsLoading(true);
    try {
      const response = await getAllTracks(50, 0, 'createdAt');
      setTracks(response.data);
      setOriginalTracks(response.data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularArtists = async () => {
    setIsLoading(true);
    try {
      const response = await searchUsers('');
      const sorted = [...response.data].sort((a, b) => (b.followers || 0) - (a.followers || 0));
      setArtists(sorted);
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTracks = async () => {
    if (!searchQuery.trim()) {
      setTracks(originalTracks);
      return;
    }
    setIsLoading(true);
    try {
      const response = await searchTracks(searchQuery);
      setTracks(response.data);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchArtists = async () => {
    if (!searchQuery.trim()) {
      fetchPopularArtists();
      return;
    }
    setIsLoading(true);
    try {
      const response = await searchUsers(searchQuery);
      const sorted = [...response.data].sort((a, b) => (b.followers || 0) - (a.followers || 0));
      setArtists(sorted);
    } catch (error) {
      console.error('Error searching artists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (tab === 'tracks') {
      handleSearchTracks();
    } else {
      handleSearchArtists();
    }
  };

  const handleChangeSortBy = (value: TracksSortBy) => {
    setSortBy(value);
  };

  const handleChangeSearchBy = (value: 'name' | 'artist') => {
    setSearchBy(value);
  };

  return (
    <Tabs.Root value={tab} onValueChange={v => setTab(v as 'tracks' | 'artists')} className="space-y-6">
      <Tabs.List className="flex gap-4 border-b border-zinc-800 mb-4 justify-center sm:justify-start">
        <Tabs.Trigger
          value="tracks"
          className="px-4 py-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
        >
          Tracks
        </Tabs.Trigger>
        <Tabs.Trigger
          value="artists"
          className="px-4 py-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
        >
          Artists
        </Tabs.Trigger>
      </Tabs.List>

      <div className="p-2 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={tab === 'tracks' ? "Search for tracks..." : "Search for artists..."}
              className="w-full bg-[#1a1f25] rounded-lg py-3 px-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              aria-label="Search"
            >
              <SearchIcon
                className="text-gray-400"
                size={20}
              />
            </button>
          </div>
          {tab === 'tracks' && (
            <div className="flex gap-4">
              {/* Custom Search By Listbox */}
              <Listbox value={searchBy} onChange={handleChangeSearchBy}>
                <div className="relative min-w-[120px]">
                  <Listbox.Button className="bg-[#1a1f25] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer flex items-center justify-between w-full">
                    <span>
                      {searchByOptions.find(opt => opt.value === searchBy)?.label}
                    </span>
                    <ChevronDown className="ml-2 text-gray-400" size={18} />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full bg-[#1a1f25] rounded-lg shadow-lg z-10">
                    {searchByOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 ${active ? 'bg-orange-500 text-white' : 'text-white'}`
                        }
                      >
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              <Listbox value={sortBy} onChange={handleChangeSortBy}>
                <div className="relative min-w-[120px]">
                  <Listbox.Button className="bg-[#1a1f25] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer flex items-center justify-between w-full">
                    <span>
                      {sortByOptions.find(opt => opt.value === sortBy)?.label}
                    </span>
                    <ChevronDown className="ml-2 text-gray-400" size={18} />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full bg-[#1a1f25] rounded-lg shadow-lg z-10">
                    {sortByOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 ${active ? 'bg-orange-500 text-white' : 'text-white'}`
                        }
                      >
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          )}
        </div>
      </div>

      <Tabs.Content value="tracks">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {filteredTracks.map((track) => (
              <TrackCard
                key={track._id}
                track={track}
                queue={filteredTracks}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No tracks found</p>
          </div>
        )}
      </Tabs.Content>

      <Tabs.Content value="artists">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6 py-4">
            {artists.map((artist) => (
              <button
                key={artist._id}
                className="flex flex-col items-center bg-[#1a1f25] rounded-lg p-4 transition focus:outline-none"
                onClick={() => navigate(`/user/${artist._id}`)}
                type="button"
                tabIndex={0}
              >
                <img
                  src={artist.picture ? `http://localhost:5000/${artist.picture}` : '/blank.webp'}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <div className="text-white font-medium text-center hover:underline">{artist.name}</div>
                <div className="text-sm text-zinc-400">{artist.followers} followers</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No artists found</p>
          </div>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
}