import { useState, useEffect } from 'react';
import {
  getAllTracks,
  getAllConcerts,
  getAllUsers,
  deleteTrack,
  deleteConcert,
  adminUpdateUser,
  adminGetUserById,
  searchUsers,
} from '../api/api';
import { Track, Concert, User, UsersSortBy } from '../types';
import { Link } from 'react-router-dom';
import { Trash2, Music, Ticket, User as UserIcon, Crown, Mic2 } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import Notification from '../components/Notification';

export default function Admin() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'tracks' | 'concerts' | 'users'>('tracks');
  const [searchQuery, setSearchQuery] = useState('');
  const [usersSortBy, setUsersSortBy] = useState<UsersSortBy>('createdAt');
  const [notification, setNotification] = useState<{
    message: string;
    type?: 'success' | 'error' | 'info';
    actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }[];
  } | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [tab, usersSortBy]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (tab === 'tracks') {
        const tracksRes = await getAllTracks(100, 0);
        setTracks(tracksRes.data);
      } else if (tab === 'concerts') {
        const concertsRes = await getAllConcerts();
        setConcerts(concertsRes.data);
      } else if (tab === 'users') {
        const usersRes = await getAllUsers(100, 0, usersSortBy);
        setUsers(usersRes.data);
      }
    } catch (error) {
      setNotification({ message: 'Error fetching data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      if (tab === 'tracks') {
        const tracksRes = await getAllTracks(100, 0);
        setTracks(
          tracksRes.data.filter((track: Track) =>
            track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.artistName.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else if (tab === 'concerts') {
        const concertsRes = await getAllConcerts();
        setConcerts(
          concertsRes.data.filter((concert: Concert) =>
            concert.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
            concert.artistName.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else if (tab === 'users') {
        if (searchQuery.trim()) {
          const usersRes = await searchUsers(searchQuery);
          setUsers(usersRes.data);
        } else {
          const usersRes = await getAllUsers(100, 0, usersSortBy);
          setUsers(usersRes.data);
        }
      }
    } catch (error) {
      setNotification({ message: 'Error searching', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    setNotification({
      message: 'Are you sure you want to delete this track?',
      type: 'info',
      actions: [
        {
          label: 'Cancel',
          onClick: () => setNotification(null),
          variant: 'secondary',
        },
        {
          label: 'Delete',
          onClick: async () => {
            try {
              await deleteTrack(trackId);
              setTracks(tracks.filter(track => track._id !== trackId));
              setNotification({ message: 'Track deleted!', type: 'success' });
              setTimeout(() => setNotification(null), 1500);
            } catch (error) {
              setNotification({ message: 'Error deleting track', type: 'error' });
            }
          },
        },
      ],
    });
  };

  const handleDeleteConcert = async (concertId: string) => {
    setNotification({
      message: 'Are you sure you want to delete this concert?',
      type: 'info',
      actions: [
        {
          label: 'Cancel',
          onClick: () => setNotification(null),
          variant: 'secondary',
        },
        {
          label: 'Delete',
          onClick: async () => {
            try {
              await deleteConcert(concertId);
              setConcerts(concerts.filter(concert => concert._id !== concertId));
              setNotification({ message: 'Concert deleted!', type: 'success' });
              setTimeout(() => setNotification(null), 1500);
            } catch (error) {
              setNotification({ message: 'Error deleting concert', type: 'error' });
            }
          },
        },
      ],
    });
  };

  const handleChangeRole = async (userId: string, newRole: 'user' | 'artist' | 'admin') => {
    try {
      const userRes = await adminGetUserById(userId);
      const user = userRes.data;
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('role', newRole);
      formData.append('email', user.email);
      await adminUpdateUser(userId, formData);
      setUsers(users.map(u => (u._id === userId ? { ...u, role: newRole } : u)));
      setNotification({ message: `Role updated to ${newRole}`, type: 'success' });
      setTimeout(() => setNotification(null), 1500);
    } catch (error) {
      setNotification({ message: 'Error updating user role', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          actions={notification.actions}
        />
      )}
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <Tabs.Root value={tab} onValueChange={v => setTab(v as any)} className="space-y-6">
        <Tabs.List className="flex gap-4 border-b border-zinc-800 mb-4">
          <Tabs.Trigger
            value="tracks"
            className="px-4 py-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
          >
            Tracks
          </Tabs.Trigger>
          <Tabs.Trigger
            value="concerts"
            className="px-4 py-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
          >
            Concerts
          </Tabs.Trigger>
          <Tabs.Trigger
            value="users"
            className="px-4 py-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
          >
            Users
          </Tabs.Trigger>
        </Tabs.List>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder={
              tab === 'tracks'
                ? 'Search tracks or artist...'
                : tab === 'concerts'
                ? 'Search concerts or artist...'
                : 'Search users...'
            }
            className="flex-1 bg-[#1a1f25] rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {tab === 'users' && (
            <select
              value={usersSortBy}
              onChange={e => setUsersSortBy(e.target.value as UsersSortBy)}
              className="bg-[#1a1f25] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="createdAt">Latest</option>
              <option value="followers">Most Followed</option>
            </select>
          )}
          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        {/* TRACKS */}
        <Tabs.Content value="tracks">
          <div className="flex justify-end mb-4">
            <Link
              to="/upload"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Music size={20} />
              Add New Track
            </Link>
          </div>
          <div className="bg-[#1a1f25] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-zinc-400">Track</th>
                  <th className="text-left p-4 text-zinc-400">Artist</th>
                  <th className="text-left p-4 text-zinc-400">Listens</th>
                  <th className="text-left p-4 text-zinc-400">Likes</th>
                  <th className="text-right p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track) => (
                  <tr key={track._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`http://localhost:5000/${track.picture}`}
                          alt={track.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-white">{track.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400">{track.artistName}</td>
                    <td className="p-4 text-zinc-400">{track.listens}</td>
                    <td className="p-4 text-zinc-400">{track.likes}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteTrack(track._id)}
                        className="text-red-500 hover:text-red-600 p-2"
                        title="Delete track"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        {/* CONCERTS */}
        <Tabs.Content value="concerts">
          <div className="flex justify-end mb-4">
            <Link
              to="/concerts/create"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Ticket size={20} />
              Add New Concert
            </Link>
          </div>
          <div className="bg-[#1a1f25] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-zinc-400">Concert</th>
                  <th className="text-left p-4 text-zinc-400">Artist</th>
                  <th className="text-left p-4 text-zinc-400">Venue</th>
                  <th className="text-left p-4 text-zinc-400">Date</th>
                  <th className="text-left p-4 text-zinc-400">Tickets</th>
                  <th className="text-right p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {concerts.map((concert) => (
                  <tr key={concert._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {concert.picturePath ? (
                          <img
                            src={`http://localhost:5000/${concert.picturePath}`}
                            alt={concert.venue}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-zinc-700 flex items-center justify-center">
                            <Ticket size={20} className="text-zinc-500" />
                          </div>
                        )}
                        <span className="text-white">{concert.venue}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400">{concert.artistName}</td>
                    <td className="p-4 text-zinc-400">{concert.city}</td>
                    <td className="p-4 text-zinc-400">
                      {new Date(concert.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-zinc-400">{concert.ticketsQuantity}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteConcert(concert._id)}
                        className="text-red-500 hover:text-red-600 p-2"
                        title="Delete concert"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        {/* USERS */}
        <Tabs.Content value="users">
          <div className="bg-[#1a1f25] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-zinc-400">User</th>
                  <th className="text-left p-4 text-zinc-400">Role</th>
                  <th className="text-left p-4 text-zinc-400">Followers</th>
                  <th className="text-right p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.picture ? `http://localhost:5000/${user.picture}` : '/blank.webp'}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 capitalize">{user.role}</td>
                    <td className="p-4 text-zinc-400">{user.followers || 0}</td>
                    <td className="p-4 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => handleChangeRole(user._id, 'artist')}
                        className="text-orange-400 hover:text-orange-500 p-2"
                        title="Make Artist"
                        disabled={user.role === 'artist'}
                      >
                        <Mic2 size={18} />
                      </button>
                      <button
                        onClick={() => handleChangeRole(user._id, 'admin')}
                        className="text-yellow-400 hover:text-yellow-500 p-2"
                        title="Make Admin"
                        disabled={user.role === 'admin'}
                      >
                        <Crown size={18} />
                      </button>
                      <button
                        onClick={() => handleChangeRole(user._id, 'user')}
                        className="text-blue-400 hover:text-blue-500 p-2"
                        title="Make User"
                        disabled={user.role === 'user'}
                      >
                        <UserIcon size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}