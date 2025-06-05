import { useState } from 'react';
import { Concert } from '../types';

interface ConcertCardProps {
  concert: Concert;
}

export default function ConcertCard({ concert }: ConcertCardProps) {
  const [count, setCount] = useState(1);

  return (
    <div
      className="bg-[#1a1f25] rounded-lg p-4 flex flex-col sm:flex-row gap-4 transition"
    >
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
          <h2 className="text-xl font-bold text-white mb-1">{concert.artistName}</h2>
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
          <div className="flex items-center gap-2 ml-4">
            <button
              className="bg-zinc-700 text-white px-2 rounded disabled:opacity-50"
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              disabled={count <= 1}
              aria-label="Decrease"
            >-</button>
            <span className="w-8 text-center text-white ">{count}</span>
            <button
              className="bg-zinc-700 text-white px-2 rounded disabled:opacity-50"
              onClick={() => setCount((c) => Math.min(concert.ticketsQuantity, c + 1))}
              disabled={count >= concert.ticketsQuantity}
              aria-label="Increase"
            >+</button>
            <button
              className="ml-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition"
              disabled={concert.ticketsQuantity === 0}
              onClick={() => alert(`Ordered ${count} ticket(s)!`)}
            >
              Order
            </button>
          </div>
        </div>  
      </div>
    </div>
  );
}