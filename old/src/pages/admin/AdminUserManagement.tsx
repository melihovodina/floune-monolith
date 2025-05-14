import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, UserX } from 'lucide-react';
import { User } from '../../types';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArtist, setFilterArtist] = useState<boolean | null>(null);
  
  // Mock data loading
  useEffect(() => {
    setTimeout(() => {
      const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
        id: `user-${i + 1}`,
        username: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        profilePicture: i % 3 === 0 ? `https://picsum.photos/seed/user${i + 1}/300/300` : undefined,
        isArtist: i % 4 === 0,
        bio: i % 5 === 0 ? `This is the bio for user ${i + 1}` : undefined,
        createdAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setUsers(mockUsers);
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
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterArtist === null || user.isArtist === filterArtist;
    
    return matchesSearch && matchesFilter;
  });
  
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
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center transition">
          <RefreshCw size={18} className="mr-2" /> Refresh
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Search users..."
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={filterArtist === null ? 'all' : filterArtist ? 'artist' : 'regular'}
              onChange={(e) => {
                if (e.target.value === 'all') setFilterArtist(null);
                else if (e.target.value === 'artist') setFilterArtist(true);
                else setFilterArtist(false);
              }}
            >
              <option value="all">All Users</option>
              <option value="artist">Artists Only</option>
              <option value="regular">Regular Users</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-750 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profilePicture ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={user.profilePicture} 
                            alt={user.username} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isArtist 
                        ? 'bg-orange-500/20 text-orange-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.isArtist ? 'Artist' : 'Regular User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orange-500 hover:text-orange-400 mr-3">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-400">
                      <UserX size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="py-8 text-center text-gray-400">
            No users found matching your search criteria
          </div>
        )}
        
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
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

export default AdminUserManagement;