import React, { useState, useEffect } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import { ArtistRequest } from '../../types';

const AdminArtistRequests: React.FC = () => {
  const [requests, setRequests] = useState<ArtistRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ArtistRequest | null>(null);
  
  // Mock data loading
  useEffect(() => {
    setTimeout(() => {
      const mockRequests: ArtistRequest[] = Array.from({ length: 5 }, (_, i) => ({
        id: `req-${i + 1}`,
        userId: `user-${i + 1}`,
        user: {
          id: `user-${i + 1}`,
          username: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          profilePicture: `https://picsum.photos/seed/user${i + 1}/300/300`,
          isArtist: false,
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        },
        reason: `I am a professional musician with ${i + 2} years of experience. I have released music on various platforms and would like to share my creations on SoundWave as well. My music style is ${['rock', 'electronic', 'jazz', 'hip-hop', 'ambient'][i]} and I have a following of about ${(i + 1) * 1000} fans across different platforms.`,
        status: 'pending',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleApprove = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved' as const, updatedAt: new Date().toISOString() } 
        : req
    ));
    
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: 'approved', updatedAt: new Date().toISOString() });
    }
  };
  
  const handleReject = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as const, updatedAt: new Date().toISOString() } 
        : req
    ));
    
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: 'rejected', updatedAt: new Date().toISOString() });
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold text-white mb-6">Artist Requests</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
        <div className="lg:col-span-1 bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Pending Requests</h2>
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {requests.filter(req => req.status === 'pending').length}
            </span>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-14rem)]">
            {requests.map((request) => (
              <div 
                key={request.id}
                className={`p-4 border-b border-gray-700 cursor-pointer transition hover:bg-gray-750 ${
                  selectedRequest?.id === request.id ? 'bg-gray-750' : ''
                }`}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0">
                    {request.user.profilePicture ? (
                      <img 
                        src={request.user.profilePicture} 
                        alt={request.user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-600 rounded-full" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{request.user.username}</p>
                    <p className="text-sm text-gray-400">{request.user.email}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {formatDate(request.createdAt)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {request.status === 'pending' ? 'Pending' :
                     request.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-gray-800 rounded-lg">
          {selectedRequest ? (
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedRequest.user.username}'s Request</h2>
                  <p className="text-gray-400 text-sm mt-1">Submitted on {formatDate(selectedRequest.createdAt)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedRequest.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  selectedRequest.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {selectedRequest.status === 'pending' ? 'Pending Review' :
                   selectedRequest.status === 'approved' ? 'Approved' : 'Rejected'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">User Since</h3>
                  <p className="text-white">{formatDate(selectedRequest.user.createdAt)}</p>
                </div>
                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                  <p className="text-white truncate">{selectedRequest.user.email}</p>
                </div>
                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Account Status</h3>
                  <p className="text-green-400">Active</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto mb-6">
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-2">Request Reason</h3>
                  <div className="bg-gray-750 rounded-lg p-4">
                    <p className="text-gray-300">{selectedRequest.reason}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Social Links</h3>
                  <div className="bg-gray-750 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-gray-300">Instagram</span>
                      </div>
                      <a 
                        href="#" 
                        className="text-orange-500 hover:text-orange-400 flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-gray-300">Spotify</span>
                      </div>
                      <a 
                        href="#" 
                        className="text-orange-500 hover:text-orange-400 flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-300">YouTube</span>
                      </div>
                      <a 
                        href="#" 
                        className="text-orange-500 hover:text-orange-400 flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-650 text-white rounded-md flex items-center justify-center transition"
                  >
                    <X size={18} className="mr-2 text-red-500" /> Reject Request
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center justify-center transition"
                  >
                    <Check size={18} className="mr-2" /> Approve Request
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminArtistRequests;