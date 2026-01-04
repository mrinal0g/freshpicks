import { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import { getAllOrders, updateOrderStatus } from "./api";
import { Package, Clock, CheckCircle, TrendingUp, RefreshCw } from "lucide-react";

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId) => {
    if (!window.confirm("Mark this order as delivered?")) return;
    
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, 'Delivered');
      fetchOrders();
    } catch (error) {
      alert(error.message || "Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
  const totalQuantity = orders.reduce((sum, o) => sum + o.quantity, 0);

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: Package },
    { label: "Pending", value: pendingOrders, icon: Clock },
    { label: "Delivered", value: deliveredOrders, icon: CheckCircle },
    { label: "Total Units", value: totalQuantity.toLocaleString(), icon: TrendingUp },
  ];

  return (
    <div>
      <Header />
      
      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Manage and track all customer orders</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="stat-card">
                <Icon size={32} style={{ color: '#2d5016', margin: '0 auto 0.5rem' }} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {isLoading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Package size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Orders Yet</h3>
            <p style={{ color: '#6b7280' }}>Orders will appear here once customers start placing them.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '2px solid #e5e7eb' }}>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>All Orders</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{orders.length} total orders</p>
              </div>
              <button onClick={fetchOrders} className="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Buyer</th>
                    <th className="address-header">Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{order.order_id}</td>
                      <td style={{ fontWeight: '500' }}>{order.product_name}</td>
                      <td>{order.quantity}</td>
                      <td>{order.buyer_name}</td>
                      <td className="address-cell" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.delivery_address}
                      </td>
                      <td>
                        <span className={`badge ${order.status.toLowerCase()}`}>
                          {order.status === "Delivered" ? (
                            <CheckCircle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          ) : (
                            <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          )}
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status === "Pending" && (
                          <button
                            onClick={() => handleUpdateStatus(order.id)}
                            disabled={updatingId === order.id}
                            className="success"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          >
                            {updatingId === order.id ? "Updating..." : "Mark Delivered"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

