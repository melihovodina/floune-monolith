import React from 'react';
import { Users, Music, Flag, BarChart3, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

const AdminOverview: React.FC = () => {
  // Sample stat cards data
  const statCards = [
    {
      title: 'Total Users',
      value: '12,547',
      icon: <Users size={20} className="text-blue-500" />,
      change: '+12.5%',
      trend: 'up',
      timeframe: 'since last month'
    },
    {
      title: 'Tracks Uploaded',
      value: '35,842',
      icon: <Music size={20} className="text-orange-500" />,
      change: '+8.3%',
      trend: 'up',
      timeframe: 'since last month'
    },
    {
      title: 'Active Artists',
      value: '1,287',
      icon: <TrendingUp size={20} className="text-green-500" />,
      change: '+15.2%',
      trend: 'up',
      timeframe: 'since last month'
    },
    {
      title: 'Content Reports',
      value: '24',
      icon: <Flag size={20} className="text-red-500" />,
      change: '-5.1%',
      trend: 'down',
      timeframe: 'since last month'
    }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <h2 className="text-white text-2xl font-bold mt-1">{card.value}</h2>
              </div>
              <div className="p-2 bg-gray-750 rounded-lg">
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {card.trend === 'up' ? (
                <ArrowUp size={16} className="text-green-500 mr-1" />
              ) : (
                <ArrowDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={card.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {card.change}
              </span>
              <span className="text-gray-400 text-sm ml-1.5">{card.timeframe}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">New User Registrations</h2>
            <select className="bg-gray-700 border border-gray-600 rounded-md py-1 px-3 text-sm text-white">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between px-2">
            {Array.from({ length: 7 }, (_, i) => {
              const height = 30 + Math.random() * 70;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-gray-400 text-xs mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Artist Requests</h2>
            <a href="/admin/artist-requests" className="text-orange-500 hover:text-orange-400 text-sm">View All</a>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={`https://picsum.photos/seed/user${i + 1}/40/40`}
                    alt={`User ${i + 1}`} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-white text-sm font-medium">User {i + 1}</p>
                    <p className="text-gray-400 text-xs">user{i + 1}@example.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-red-500 hover:text-red-400 p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="text-green-500 hover:text-green-400 p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Top Tracks This Week</h2>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center p-2 hover:bg-gray-750 rounded-md transition">
                <div className="w-8 text-center text-gray-400 font-medium">{i + 1}</div>
                <div className="w-10 h-10 ml-2">
                  <img 
                    src={`https://picsum.photos/seed/track${i + 1}/40/40`}
                    alt={`Track ${i + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-white text-sm font-medium">Popular Track {i + 1}</p>
                  <p className="text-gray-400 text-xs">Artist {i + 1}</p>
                </div>
                <div className="text-gray-400 text-sm">{(50 - i * 5)}K plays</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Flagged Content</h2>
            <a href="/admin/reports" className="text-orange-500 hover:text-orange-400 text-sm">View All</a>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center p-2 hover:bg-gray-750 rounded-md transition">
                <div className="w-10 h-10">
                  <img 
                    src={`https://picsum.photos/seed/report${i + 1}/40/40`}
                    alt={`Report ${i + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-white text-sm font-medium">Reported Track {i + 1}</p>
                  <p className="text-gray-400 text-xs">Reported for: {['Copyright', 'Inappropriate', 'Spam', 'Misinformation', 'Other'][i]}</p>
                </div>
                <div className="text-yellow-500">
                  <Flag size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;