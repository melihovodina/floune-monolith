import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getConcertsByIds, createOrder, updateConcert, deleteConcert } from '../api/api';
import { Concert } from '../types';
import { Calendar, MapPin, Ticket, User } from 'lucide-react';
import Notification from '../components/Notification';
import { useAuth } from '../store/useAuth';

export default function ConcertDetails() {
  const { id } = useParams<{ id: string }>();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'error' | 'info'; actions?: any[] } | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const navigate = useNavigate();

  // --- Edit state ---
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editVenue, setEditVenue] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editTicketPrice, setEditTicketPrice] = useState(0);
  const [editTicketsQuantity, setEditTicketsQuantity] = useState(0);
  const [editPicture, setEditPicture] = useState<File | null>(null);
  const [editPicturePreview, setEditPicturePreview] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const isOwner =
    user &&
    concert &&
    (
      (typeof concert.artist === 'object' && user._id === concert.artist._id) ||
      (typeof concert.artist === 'string' && user._id === concert.artist)
    );

  useEffect(() => {
    if (!id) return;
    const fetchConcert = async () => {
      setIsLoading(true);
      try {
        const res = await getConcertsByIds([id]);
        setConcert(res.data[0]);
      } catch (error) {
        setConcert(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConcert();
  }, [id]);

  const startEdit = () => {
    if (!concert) return;
    setEditVenue(concert.venue);
    setEditDescription(concert.description || '');
    setEditDate(concert.date ? new Date(concert.date).toISOString().slice(0, 16) : '');
    setEditCity(concert.city || '');
    setEditTicketPrice(concert.ticketPrice || 0);
    setEditTicketsQuantity(concert.ticketsQuantity || 0);
    setEditPicture(null);
    setEditPicturePreview(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditPicture(null);
    setEditPicturePreview(null);
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditPicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setEditPicturePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setEditPicturePreview(null);
    }
  };

  const handleEditSave = async () => {
    if (!concert) return;
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('venue', editVenue);
      formData.append('description', editDescription);
      formData.append('date', editDate);
      formData.append('city', editCity);
      formData.append('ticketPrice', String(editTicketPrice));
      formData.append('ticketsQuantity', String(editTicketsQuantity));
      if (editPicture) formData.append('files', editPicture);

      await updateConcert(concert._id, formData);
      const res = await getConcertsByIds([concert._id]);
      setConcert(res.data[0]);
      setIsEditing(false);
      setEditPicture(null);
      setEditPicturePreview(null);
      setNotification({ message: 'Concert updated successfully!', type: 'success' });
    } catch (e) {
      setNotification({ message: 'Failed to update concert', type: 'error' });
    }
    setEditLoading(false);
  };

  const handleDelete = async () => {
    if (!concert) return;
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
              await deleteConcert(concert._id);
              setNotification({ message: 'Concert deleted!', type: 'success' });
              setTimeout(() => {
                setNotification(null);
                navigate('/concerts');
              }, 1000);
            } catch (e) {
              setNotification({ message: 'Failed to delete concert', type: 'error' });
            }
          },
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!concert) {
    return (
      <div className="text-center text-white py-20">
        Concert not found.
      </div>
    );
  }

  const handleBuyTickets = async () => {
    setIsBuying(true);
    try {
      await createOrder({
        concertId: concert._id,
        date: new Date().toISOString(),
        ticketsQuantity: ticketCount,
        totalPrice: concert.ticketPrice * ticketCount,
      });
      setNotification({ message: `Successfully purchased ${ticketCount} ticket${ticketCount > 1 ? 's' : ''}!`, type: 'success' });
    } catch (error: any) {
      setNotification({ message: 'Failed to purchase tickets', type: 'error' });
    } finally {
      setIsBuying(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="bg-[#1a1f25] max-w-4xl mx-auto rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          actions={notification.actions}
        />
      )}
      <div className="flex-shrink-0">
        {/* Показываем превью новой обложки если выбрана, иначе старую */}
        {isEditing && editPicturePreview ? (
          <img
            src={editPicturePreview}
            alt="New cover"
            className="w-96 h-96 object-cover rounded-lg border border-zinc-800"
          />
        ) : (
          <img
            src={concert.picturePath ? `http://localhost:5000/${concert.picturePath}` : '/blank.webp'}
            alt={concert.venue}
            className="w-96 h-96 object-cover rounded-lg border border-zinc-800"
          />
        )}
        {concert.schemePath && !isEditing && (
          <div className="mt-6">
            <h2 className="text-white text-lg font-semibold mb-2">Hall Scheme</h2>
            <div className="max-h-96 max-w-96 flex justify-center items-center border border-zinc-800 rounded-lg bg-zinc-900 p-2">
              <img
                src={`http://localhost:5000/${concert.schemePath}`}
                alt="Hall Scheme"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {isEditing ? (
          <div className="mb-8 bg-zinc-900 p-4 rounded">
            <div className="mb-2">
              <label className="block text-gray-300 mb-1">Venue</label>
              <input
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={editVenue}
                onChange={e => setEditVenue(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-300 mb-1">Date</label>
              <input
                type="datetime-local"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-300 mb-1">City</label>
              <input
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={editCity}
                onChange={e => setEditCity(e.target.value)}
              />
            </div>
            <div className="mb-2 flex gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Ticket Price</label>
                <input
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={editTicketPrice}
                  onChange={e => setEditTicketPrice(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Tickets Quantity</label>
                <input
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={editTicketsQuantity}
                  onChange={e => setEditTicketsQuantity(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-gray-300 mb-1">Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="text-white"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={handleEditSave}
                disabled={editLoading}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                onClick={cancelEdit}
                disabled={editLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">{concert.venue}</h1>
            <div className="flex items-center gap-3 text-zinc-400">
              <User size={18} />
              <Link to={`/profile/${concert.artistName}`} className="text-orange-400 hover:underline">
                {concert.artistName}
              </Link>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Calendar size={18} />
              <span>{new Date(concert.date).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <MapPin size={18} />
              <span>{concert.city}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Ticket size={18} />
              <span>
                {concert.ticketsQuantity} tickets &middot; {concert.ticketPrice}$
              </span>
            </div>
            <div className="mt-4 text-white">
              <h2 className="font-semibold mb-1">Description</h2>
              <p className="text-zinc-300">{concert.description || 'No description.'}</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-300">Tickets:</span>
                <button
                  type="button"
                  onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                  className="bg-zinc-700 text-white px-2 rounded-l hover:bg-zinc-600 disabled:opacity-50"
                  disabled={ticketCount <= 1 || isBuying}
                >
                  -
                </button>
                <span className="w-4 text-center text-white select-none">{ticketCount}</span>
                <button
                  type="button"
                  onClick={() => setTicketCount((prev) => Math.min(concert.ticketsQuantity, prev + 1))}
                  className="bg-zinc-700 text-white px-2 rounded-r hover:bg-zinc-600 disabled:opacity-50"
                  disabled={ticketCount >= concert.ticketsQuantity || isBuying}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleBuyTickets}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
                disabled={concert.ticketsQuantity === 0 || isBuying}
              >
                {isBuying ? 'Processing...' : `${ticketCount > 1 ? `Book tickets (${ticketCount})` : 'Book a ticket'}`}
              </button>
            </div>
          </>
        )}
        {isOwner && !isEditing && (
          <div className="flex flex-row gap-2 mt-4">
            <button
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition"
              onClick={startEdit}
            >
              Edit concert
            </button>
            <button
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              onClick={handleDelete}
            >
              Delete concert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}