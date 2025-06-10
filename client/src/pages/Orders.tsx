import { useEffect, useState } from 'react';
import { getAllOrders, cancelOrder, getConcertsByIds } from '../api/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

type Order = {
  _id: string;
  concertId: string;
  date: string;
  ticketsQuantity: number;
  totalPrice: number;
  cancelled?: boolean;
  concert?: {
    artistName: string;
    city: string;
    venue: string;
    date: string;
  };
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await getAllOrders(dateFrom, dateTo);
      const ordersData: Order[] = res.data;
      const concertIds = Array.from(new Set(ordersData.map(o => o.concertId)));
      const concertsRes = await getConcertsByIds(concertIds);
      const concerts = concertsRes.data;
      const concertsMap: Record<string, any> = {};
      concerts.forEach((c: any) => {
        concertsMap[c._id] = c;
      });
      const ordersWithConcert = ordersData.map(order => ({
        ...order,
        concert: concertsMap[order.concertId],
      }));
      setOrders(ordersWithConcert);
    } catch {
      setOrders([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleSearch = async () => {
    setSearching(true);
    await fetchOrders();
    setSearching(false);
  };

  const handleCancel = async (orderId: string) => {
    await cancelOrder(orderId);
    fetchOrders();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="bg-[#1a1f25] rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="bg-[#1a1f25] rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={searching}
          className="self-end bg-orange-500 hover:bg-orange-400 text-white font-medium rounded-lg px-6 py-2 transition"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {orders.map(order => (
            <div
              key={order._id}
              className={`rounded-lg p-4 bg-[#1a1f25] flex flex-col sm:flex-row justify-between items-start sm:items-center border ${order.cancelled ? 'border-red-500 opacity-60' : 'border-zinc-800'}`}
            >
              <div>
                <div className="font-semibold text-lg mb-1 text-white">
                  <Link
                    to={`/concerts/${order.concertId}`}
                    className="hover:underline text-orange-400"
                  >
                    {order.concert?.artistName || 'Concert'} — {order.concert?.city || ''}
                  </Link>
                </div>
                <div className="text-gray-400 text-sm mb-1">
                  Venue: {order.concert?.venue || '-'}
                </div>
                <div className="text-gray-400 text-sm mb-1">
                  Date: {order.concert?.date ? format(new Date(order.concert.date), 'dd.MM.yyyy') : (order.date ? format(new Date(order.date), 'dd.MM.yyyy') : '-')}
                </div>
                <div className="text-gray-400 text-sm">
                  Tickets: {order.ticketsQuantity} | Total: {order.totalPrice}$
                </div>
                {order.cancelled && (
                  <div className="text-red-500 text-xs mt-2 font-semibold">Cancelled</div>
                )}
              </div>
              {!order.cancelled && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="mt-4 sm:mt-0 sm:ml-6 bg-red-600 hover:bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No orders found</p>
        </div>
      )}
    </div>
  );
}