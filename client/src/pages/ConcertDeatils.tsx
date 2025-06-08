import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConcertsByIds, createOrder } from '../api/api';
import { Concert } from '../types';
import { Calendar, MapPin, Ticket, User } from 'lucide-react';
import Notification from '../components/Notification';

export default function ConcertDetails() {
  const { id } = useParams<{ id: string }>();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

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
      setNotification(`Successfully purchased ${ticketCount} ticket${ticketCount > 1 ? 's' : ''}!`);
    } catch (error: any) {
      setNotification('Failed to purchase tickets');
    } finally {
      setIsBuying(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {notification && <Notification message={notification} />}
      <div className="bg-[#1a1f25] rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <img
            src={concert.picturePath ? `http://localhost:5000/${concert.picturePath}` : '/blank.webp'}
            alt={concert.venue}
            className="w-96 h-96 object-cover rounded-lg border border-zinc-800"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
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
                className="bg-zinc-700 text-white px-3 py-1 rounded-l hover:bg-zinc-600 disabled:opacity-50"
                disabled={ticketCount <= 1 || isBuying}
              >
                -
              </button>
              <span className="w-10 text-center text-white select-none">{ticketCount}</span>
              <button
                type="button"
                onClick={() => setTicketCount((prev) => Math.min(concert.ticketsQuantity, prev + 1))}
                className="bg-zinc-700 text-white px-3 py-1 rounded-r hover:bg-zinc-600 disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
} 