import { Concert } from '../types';
import { Link } from 'react-router-dom';

interface ConcertCardProps {
  concert: Concert;
}

export default function ConcertCard({ concert }: ConcertCardProps) {
  return (
    <Link to={`/concerts/${concert._id}`} className="block">
      <div className="bg-[#1a1f25] rounded-lg p-4 flex flex-col sm:flex-row gap-4 transition">
        <div className="w-32 h-32 flex-shrink-0 rounded bg-zinc-700 overflow-hidden flex items-center justify-center">
          {concert.picturePath ? (
            <img
              src={`http://localhost:5000/${concert.picturePath}`}
              alt={concert.venue}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-zinc-400">No Image</span>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 hover:underline">{concert.artistName}</h2>
            <p className="text-zinc-400 mb-1">
              {concert.city} • {concert.venue}
            </p>
            <p className="text-zinc-400 mb-1">
              {new Date(concert.date).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-orange-500 font-semibold text-lg">
              {concert.ticketPrice} $
            </span>
            <span className="text-zinc-400 text-sm ">
              Tickets: {concert.ticketsQuantity}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}