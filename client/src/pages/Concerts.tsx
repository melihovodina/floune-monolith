import { useEffect, useState, useMemo } from 'react';
import { getAllConcerts } from '../api/api';
import { Concert } from '../types';
import { Search as SearchIcon, ChevronDown } from 'lucide-react';
import { Listbox } from '@headlessui/react';
import ConcertCard from '../components/ConcertCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

const searchByOptions = [
  { value: 'city', label: 'City' },
  { value: 'artist', label: 'Artist' },
];

const sortByOptions = [
  { value: 'new', label: 'Newest' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
];

export default function Concerts() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'city' | 'artist'>('city');
  const [sortBy, setSortBy] = useState<'new' | 'price_asc' | 'price_desc'>('new');
  const { user } = useAuth();

  useEffect(() => {
    fetchConcerts();
    // eslint-disable-next-line
  }, []);

  const fetchConcerts = async () => {
    setIsLoading(true);
    try {
      const res = await getAllConcerts(true);
      setConcerts(res.data);
    } catch (e) {
      setConcerts([]);
    }
    setIsLoading(false);
  };

  const filteredConcerts = useMemo(() => {
    let filtered = [...concerts];
    if (searchQuery.trim()) {
      filtered = filtered.filter((concert: Concert) => {
        if (searchBy === 'city') {
          return concert.city?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (searchBy === 'artist') {
          return (
            concert.artistName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof concert.artist === 'object' && concert.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        return true;
      });
    }
    filtered.sort((a: Concert, b: Concert) => {
      if (sortBy === 'new') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'price_asc') {
        return a.ticketPrice - b.ticketPrice;
      }
      if (sortBy === 'price_desc') {
        return b.ticketPrice - a.ticketPrice;
      }
      return 0;
    });
    return filtered;
  }, [concerts, searchQuery, searchBy, sortBy]);

  const handleSearch = () => {
    setSearchQuery(searchQuery.trim());
  };

  return (
    <div className="space-y-6">
      <div className="p-2 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={searchBy === 'city' ? "Search by city..." : "Search by artist..."}
              className="w-full bg-[#1a1f25] rounded-lg py-3 px-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              aria-label="Search"
            >
              <SearchIcon className="text-gray-400" size={20} />
            </button>
          </div>
          <div className="flex gap-4 justify-center">
            <Listbox value={searchBy} onChange={setSearchBy}>
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
            <Listbox value={sortBy} onChange={setSortBy}>
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
        </div>
      </div>
      {(user?.role === 'admin' || user?.role === 'artist') && (
        <div className="flex justify-center sm:justify-end mb-4">
          <Link
            to="/concerts/create"
            className="text-orange-500 hover:text-orange-400 text-sm font-medium ml-3 sm:mr-4"
          >
            Create Concert
          </Link>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredConcerts.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {filteredConcerts.map(concert => (
            <ConcertCard key={concert._id} concert={concert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No concerts found</p>
        </div>
      )}
    </div>
  );
}