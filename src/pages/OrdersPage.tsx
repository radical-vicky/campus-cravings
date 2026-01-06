import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Package } from 'lucide-react';

const orders = [
  {
    id: 'ORD-2024-001',
    restaurant: 'Campus Grill House',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100',
    items: 2,
    total: 31.39,
    status: 'on_the_way',
    statusLabel: 'On the way',
    date: 'Today, 12:30 PM',
  },
  {
    id: 'ORD-2024-002',
    restaurant: 'Napoli Pizza Co.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100',
    items: 1,
    total: 18.99,
    status: 'delivered',
    statusLabel: 'Delivered',
    date: 'Yesterday, 7:45 PM',
  },
  {
    id: 'ORD-2024-003',
    restaurant: 'The Coffee Lab',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100',
    items: 3,
    total: 12.47,
    status: 'delivered',
    statusLabel: 'Delivered',
    date: 'Dec 28, 2024',
  },
];

export default function OrdersPage() {
  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const pastOrders = orders.filter((o) => o.status === 'delivered');

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-4 py-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </header>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <section className="px-4 mb-8">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
            Active Orders
          </h2>
          <div className="space-y-3">
            {activeOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/order/${order.id}`}
                  className="block bg-card rounded-xl p-4 shadow-card hover:shadow-soft transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={order.image}
                      alt={order.restaurant}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{order.restaurant}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.items} items • ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                          {order.statusLabel}
                        </span>
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Past Orders */}
      <section className="px-4">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          Past Orders
        </h2>
        {pastOrders.length > 0 ? (
          <div className="space-y-3">
            {pastOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-card"
              >
                <div className="flex gap-4">
                  <img
                    src={order.image}
                    alt={order.restaurant}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{order.restaurant}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.items} items • ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{order.date}</span>
                      <button className="text-sm text-primary font-medium">
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No past orders yet</p>
          </div>
        )}
      </section>
    </div>
  );
}
