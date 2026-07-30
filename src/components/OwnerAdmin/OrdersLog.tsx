import React, { useState } from 'react';
import { Search, ShoppingBag, DollarSign, ArrowUpRight, CheckCircle2, RefreshCw, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Order, StoreSettings } from '../../types';

interface OrdersLogProps {
  orders: Order[];
  settings: StoreSettings;
  onRefundOrder: (orderId: string) => void;
}

export const OrdersLog: React.FC<OrdersLogProps> = ({
  orders,
  settings,
  onRefundOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Processing' | 'Refunded'>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.product.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSalesRevenue = orders
    .filter((o) => o.status === 'Completed')
    .reduce((acc, o) => acc + o.total, 0);

  const totalItemsSold = orders
    .filter((o) => o.status === 'Completed')
    .reduce((acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Gross Sales</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {settings.currencySymbol}{totalSalesRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Completed Orders</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {orders.filter((o) => o.status === 'Completed').length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Units Sold</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {totalItemsSold}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer name, email..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {(['All', 'Completed', 'Processing', 'Refunded'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-3">Order Ref</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    No matching sales orders found in log.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {order.orderNumber}
                        </td>
                        <td className="p-3 text-slate-600 font-medium whitespace-nowrap">
                          {order.date}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{order.customerName}</p>
                          <p className="text-[10px] text-slate-500">{order.customerEmail}</p>
                        </td>
                        <td className="p-3 font-bold text-slate-700">
                          {order.items.reduce((a, b) => a + b.quantity, 0)} pcs
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          {order.paymentMethod}
                        </td>
                        <td className="p-3 font-black text-indigo-600">
                          {settings.currencySymbol}{order.total.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              order.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Refunded'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() =>
                              setExpandedOrderId(isExpanded ? null : order.id)
                            }
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold transition-colors"
                            title="View order breakdown"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          {order.status === 'Completed' && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Issue refund for order ${order.orderNumber}? Items will be added back into inventory.`
                                  )
                                ) {
                                  onRefundOrder(order.id);
                                }
                              }}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[10px] font-bold border border-red-200 transition-colors"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Expanded Order Items Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50 border-t border-b border-slate-200">
                          <td colSpan={8} className="p-4">
                            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                              <h5 className="text-xs font-extrabold uppercase text-slate-800">
                                Order Breakdown — {order.orderNumber}
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-2 border border-slate-100 rounded-md bg-slate-50"
                                  >
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-slate-900 truncate">
                                        {item.product.name}
                                      </p>
                                      <p className="text-[10px] text-slate-500">
                                        Qty: {item.quantity} • Size: {item.selectedSize} • Color: {item.selectedColor}
                                      </p>
                                      <p className="text-[10px] font-bold text-indigo-600">
                                        {settings.currencySymbol}
                                        {(item.product.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                                <span>Shipping Address: {order.shippingAddress}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
