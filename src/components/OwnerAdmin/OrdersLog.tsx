import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  DollarSign,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Edit,
  Save,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Order, StoreSettings } from '../../types';

interface OrdersLogProps {
  orders: Order[];
  settings: StoreSettings;
  onUpdateOrder: (updatedOrder: Order) => void;
  onRefundOrder: (orderId: string) => void;
}

const CARRIERS = ['FedEx', 'UPS', 'USPS', 'DHL Express', 'Standard Postal', 'Local Express Courier'];

export const OrdersLog: React.FC<OrdersLogProps> = ({
  orders,
  settings,
  onUpdateOrder,
  onRefundOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Tracking Edit Modal state
  const [editingTrackingOrder, setEditingTrackingOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('FedEx');
  const [statusInput, setStatusInput] = useState<Order['status']>('Processing');
  const [notesInput, setNotesInput] = useState('');

  // Packing Slip Printable Modal state
  const [packingSlipOrder, setPackingSlipOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.items.some((i) => i.product.name.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'NeedsFulfillment') matchesStatus = o.status === 'Pending' || o.status === 'Processing';
    else if (statusFilter === 'InTransit') matchesStatus = o.status === 'Shipped' || o.status === 'In Transit';
    else if (statusFilter === 'Delivered') matchesStatus = o.status === 'Delivered' || o.status === 'Completed';
    else if (statusFilter !== 'All') matchesStatus = o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const grossSales = orders
    .filter((o) => o.status !== 'Refunded')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingFulfillmentCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;

  const inTransitCount = orders.filter(
    (o) => o.status === 'Shipped' || o.status === 'In Transit'
  ).length;

  const completedCount = orders.filter(
    (o) => o.status === 'Delivered' || o.status === 'Completed'
  ).length;

  const openTrackingEdit = (order: Order) => {
    setEditingTrackingOrder(order);
    setTrackingNumberInput(order.trackingNumber || `TRK-${Math.floor(100000 + Math.random() * 900000)}`);
    setCarrierInput(order.carrier || 'FedEx');
    setStatusInput(order.status || 'Processing');
    setNotesInput(order.notes || '');
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrackingOrder) return;

    const updated: Order = {
      ...editingTrackingOrder,
      trackingNumber: trackingNumberInput,
      carrier: carrierInput,
      status: statusInput,
      notes: notesInput,
    };

    onUpdateOrder(updated);
    setEditingTrackingOrder(null);
  };

  // Helper status color styling
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Shipped':
      case 'In Transit':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Delivered':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Refunded':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* App-like Summary Metrics Dashboard Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">NEEDS FULFILLMENT</span>
            <p className="text-xl font-black text-slate-900">{pendingFulfillmentCount} Orders</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">IN TRANSIT</span>
            <p className="text-xl font-black text-indigo-600">{inTransitCount} Shipments</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">DELIVERED ORDERS</span>
            <p className="text-xl font-black text-emerald-600">{completedCount} Orders</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold">
            {settings.currencySymbol}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">GROSS SALES REVENUE</span>
            <p className="text-xl font-black text-slate-900">
              {settings.currencySymbol}{grossSales.toFixed(2)}
            </p>
          </div>
        </div>

      </div>

      {/* Search & Order Status Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, tracking number..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {[
            { id: 'All', label: 'All Orders' },
            { id: 'NeedsFulfillment', label: `Needs Shipping (${pendingFulfillmentCount})` },
            { id: 'InTransit', label: `In Transit (${inTransitCount})` },
            { id: 'Delivered', label: `Delivered (${completedCount})` },
            { id: 'Refunded', label: 'Refunded' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Orders List & Tracking Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-3">Order Ref</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer & Shipping</th>
                <th className="p-3">Carrier & Tracking</th>
                <th className="p-3">Total</th>
                <th className="p-3">Fulfillment Status</th>
                <th className="p-3 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No store orders found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const totalItems = order.items.reduce((a, b) => a + b.quantity, 0);

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        
                        {/* Order Number & Items Count */}
                        <td className="p-3">
                          <span className="font-mono font-black text-slate-900 block text-xs">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {totalItems} item{totalItems > 1 ? 's' : ''} ({order.paymentMethod})
                          </span>
                        </td>

                        {/* Date */}
                        <td className="p-3 text-slate-600 font-medium whitespace-nowrap">
                          {order.date}
                        </td>

                        {/* Customer & Address */}
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{order.customerName}</p>
                          <p className="text-[10px] text-slate-500">{order.customerEmail}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {order.shippingAddress}
                          </p>
                        </td>

                        {/* Carrier & Tracking */}
                        <td className="p-3">
                          {order.trackingNumber ? (
                            <div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-300">
                                {order.carrier || 'FedEx'}
                              </span>
                              <p className="font-mono font-bold text-indigo-600 text-[11px] mt-0.5">
                                {order.trackingNumber}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-600 italic">
                              No tracking assigned
                            </span>
                          )}
                        </td>

                        {/* Total */}
                        <td className="p-3 font-black text-slate-900">
                          {settings.currencySymbol}{order.total.toFixed(2)}
                        </td>

                        {/* Status Badge */}
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          
                          {/* Update Tracking Button */}
                          <button
                            onClick={() => openTrackingEdit(order)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] font-extrabold border border-indigo-200 transition-colors inline-flex items-center gap-1"
                            title="Assign tracking number and update status"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Track & Ship</span>
                          </button>

                          {/* Print Packing Slip */}
                          <button
                            onClick={() => setPackingSlipOrder(order)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors inline-flex"
                            title="Print Packing Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Expand Details */}
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors inline-flex"
                            title="View order breakdown"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {/* Refund Button */}
                          {order.status !== 'Refunded' && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Issue full refund for Order ${order.orderNumber}? Stock will be added back into inventory.`
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

                      {/* Expanded Order Breakdown & Progress Tracker */}
                      {isExpanded && (
                        <tr className="bg-slate-50 border-t border-b border-slate-200">
                          <td colSpan={7} className="p-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                              
                              {/* Order Lifecycle Visual Progress Bar */}
                              <div>
                                <h6 className="text-[10px] font-extrabold uppercase text-slate-500 mb-2">
                                  SHIPMENT STATUS LIFECYCLE TRACKER
                                </h6>
                                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                                  <div
                                    className={`p-2 rounded-lg border ${
                                      ['Pending', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'Completed'].includes(
                                        order.status
                                      )
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                                  >
                                    1. Order Placed
                                  </div>

                                  <div
                                    className={`p-2 rounded-lg border ${
                                      ['Processing', 'Shipped', 'In Transit', 'Delivered', 'Completed'].includes(
                                        order.status
                                      )
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                                  >
                                    2. Processing & Packed
                                  </div>

                                  <div
                                    className={`p-2 rounded-lg border ${
                                      ['Shipped', 'In Transit', 'Delivered', 'Completed'].includes(order.status)
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                                  >
                                    3. Shipped ({order.carrier || 'Pending'})
                                  </div>

                                  <div
                                    className={`p-2 rounded-lg border ${
                                      ['Delivered', 'Completed'].includes(order.status)
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                                  >
                                    4. Delivered to Customer
                                  </div>
                                </div>
                              </div>

                              {/* Items List */}
                              <div className="space-y-2">
                                <h6 className="text-xs font-black uppercase text-slate-900">
                                  ORDER ITEMS BREAKDOWN
                                </h6>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {order.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                                    >
                                      <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 text-xs truncate">
                                          {item.product.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                          Qty: {item.quantity} • Size: {item.selectedSize} • Color: {item.selectedColor}
                                        </p>
                                        <p className="text-[11px] font-black text-indigo-600">
                                          {settings.currencySymbol}
                                          {(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Additional Admin Notes */}
                              {order.notes && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                                  <span className="font-bold text-amber-900 uppercase">Fulfillment Note: </span>
                                  <span className="text-amber-800">{order.notes}</span>
                                </div>
                              )}

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

      {/* Modal 1: Edit Order Tracking & Status */}
      {editingTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  UPDATE TRACKING & STATUS — {editingTrackingOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setEditingTrackingOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Order Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as Order['status'])}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Pending">⏳ Pending (Order Received)</option>
                  <option value="Processing">📦 Processing (Packing)</option>
                  <option value="Shipped">🚚 Shipped (Dispatched)</option>
                  <option value="In Transit">🚛 In Transit (On the road)</option>
                  <option value="Delivered">✅ Delivered (Handed to Customer)</option>
                  <option value="Completed">🏁 Completed (Finalized)</option>
                  <option value="Refunded">↩️ Refunded</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Shipping Carrier
                  </label>
                  <select
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    {CARRIERS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    required
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. FX-992102"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Fulfillment Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Left with reception desk or custom packaging instructions..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTrackingOrder(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Tracking Info</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 2: Packing Slip Printable Modal */}
      {packingSlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  {settings.storeName}
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase mt-0.5">
                  STORE PACKING SLIP & ORDER RECEIPT
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-black text-indigo-600 block">
                  {packingSlipOrder.orderNumber}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Date: {packingSlipOrder.date}
                </span>
              </div>
            </div>

            {/* Customer info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="font-black text-slate-900 uppercase block mb-1">SHIP TO:</span>
                <p className="font-bold text-slate-800">{packingSlipOrder.customerName}</p>
                <p className="text-slate-600">{packingSlipOrder.customerEmail}</p>
                <p className="text-slate-600 mt-1">{packingSlipOrder.shippingAddress}</p>
              </div>

              <div>
                <span className="font-black text-slate-900 uppercase block mb-1">FULFILLMENT INFO:</span>
                <p className="text-slate-700"><span className="font-bold">Payment:</span> {packingSlipOrder.paymentMethod}</p>
                <p className="text-slate-700"><span className="font-bold">Carrier:</span> {packingSlipOrder.carrier || 'Standard'}</p>
                <p className="text-slate-700 font-mono"><span className="font-bold">Tracking:</span> {packingSlipOrder.trackingNumber || 'Unassigned'}</p>
              </div>
            </div>

            {/* Items table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-white font-extrabold uppercase">
                  <tr>
                    <th className="p-2.5">Item & SKU</th>
                    <th className="p-2.5">Variant</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {packingSlipOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-900">
                        {item.product.name}
                        <span className="block font-mono text-[10px] text-slate-500 font-normal">
                          SKU: {item.product.sku}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600">
                        Size: {item.selectedSize} | Color: {item.selectedColor}
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        {settings.currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-black text-slate-900 uppercase">
                TOTAL PAID: {settings.currencySymbol}{packingSlipOrder.total.toFixed(2)}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPackingSlipOrder(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-md flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
