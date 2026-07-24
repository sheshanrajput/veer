"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  CheckSquare,
  X,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function OrdersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create", "edit", "view"
  const [currentOrderId, setCurrentOrderId] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const defaultForm = {
    orderName: "",
    mobile: "",
    orderEmail: "",
    description: "",
    status: "Pending",
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    setIsMounted(true);
    const loadOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error("Error fetching orders from API", e);
      }
      setIsInitialized(true);
    };
    loadOrders();
  }, []);

  useEffect(() => {
    if (isMounted && isInitialized) {
      // Save to API
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders)
      }).catch(e => console.error("Error saving orders to API", e));
    }
  }, [orders, isMounted, isInitialized]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateBillingId = () => {
    const nextNum = orders.length + 1;
    return String(nextNum).padStart(3, '0');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "view") return;

    if (modalMode === "edit") {
      setOrders(orders.map(order => 
        order.id === currentOrderId ? { ...order, ...formData } : order
      ));
    } else {
      const newOrder = {
        ...formData,
        billingId: generateBillingId(),
        id: Date.now(),
        createdAt: new Date().toLocaleDateString(),
      };
      setOrders([newOrder, ...orders]);
    }
    
    setIsModalOpen(false);
  };

  const handleCreateClick = () => {
    setFormData(defaultForm);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleViewClick = (order) => {
    setFormData(order);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditClick = (order) => {
    setFormData(order);
    setCurrentOrderId(order.id);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setOrderToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders(orders.filter(order => order.id !== orderToDelete));
    }
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Shipped": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case "Processing": return <Package className="w-3.5 h-3.5 mr-1.5" />;
      case "Shipped": return <Truck className="w-3.5 h-3.5 mr-1.5" />;
      case "Delivered": return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
      default: return null;
    }
  };

  if (!isMounted) return <div className="min-h-screen"></div>;

  return (
    <div className="font-sans text-neutral-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center">
            <span className="bg-orange-500 text-white p-2 rounded-lg mr-4">
              <Package className="w-6 h-6" />
            </span>
            Order Management
          </h1>
          <p className="text-neutral-500 mt-2">Manage logistics orders and update tracking statuses.</p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleCreateClick}
            className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors flex items-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Order
          </button>
        </div>
      </div>

      {/* Main Content Area - Listing Format */}
      <div className="">
        {orders.length === 0 ? (
          <div className="border border-neutral-800 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center bg-neutral-900/30 backdrop-blur-sm">
            <Package className="w-16 h-16 text-neutral-700 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
            <p className="text-neutral-500 max-w-sm">You haven't created any orders yet. Click the button above to create your first order.</p>
          </div>
        ) : (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-neutral-900 border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Billing ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Order Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tracking</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {orders.map((order) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={order.id}
                      className="hover:bg-neutral-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-neutral-400 bg-neutral-950 px-2 py-1 rounded-md border border-neutral-800">
                          #{order.billingId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white max-w-[200px] truncate">{order.orderName}</div>
                        {order.description && (
                          <div className="text-xs text-neutral-500 max-w-[200px] truncate mt-1">{order.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {order.trackingId ? (
                          <span className="text-sm font-mono text-neutral-300">{order.trackingId}</span>
                        ) : (
                          <span className="text-sm text-neutral-600 italic">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center text-sm text-neutral-300">
                          <Phone className="w-3.5 h-3.5 text-neutral-500 mr-2" />
                          {order.mobile}
                        </div>
                        <div className="flex items-center text-sm text-neutral-400">
                          <Mail className="w-3.5 h-3.5 text-neutral-500 mr-2" />
                          {order.orderEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {order.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border items-center ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center space-x-1">
                          <button 
                            className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" 
                            title="View"
                            onClick={() => handleViewClick(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-neutral-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors" 
                            title="Edit"
                            onClick={() => handleEditClick(order)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                            title="Delete"
                            onClick={() => handleDeleteClick(order.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Main Order Form Modal (Create, Edit, View) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
                <h2 className="text-xl font-medium text-white flex items-center">
                  <Package className="w-5 h-5 text-orange-500 mr-3" />
                  {modalMode === "create" && "Create New Order"}
                  {modalMode === "edit" && "Edit Order"}
                  {modalMode === "view" && "View Order"}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-neutral-900 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto">
                <form id="create-order-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Order Name {modalMode !== "view" && "*"}</label>
                      <input 
                        required={modalMode !== "view"}
                        disabled={modalMode === "view"}
                        type="text" 
                        name="orderName"
                        value={formData.orderName}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        placeholder="e.g. 50x Industrial Pallets"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Mobile Number {modalMode !== "view" && "*"}</label>
                      <input 
                        required={modalMode !== "view"}
                        disabled={modalMode === "view"}
                        type="tel" 
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Email ID {modalMode !== "view" && "*"}</label>
                      <input 
                        required={modalMode !== "view"}
                        disabled={modalMode === "view"}
                        type="email" 
                        name="orderEmail"
                        value={formData.orderEmail}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        placeholder="client@domain.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Tracking ID</label>
                      <input 
                        disabled={modalMode === "view"}
                        type="text" 
                        name="trackingId"
                        value={formData.trackingId}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        placeholder="Leave blank to auto-assign later"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Order Status</label>
                      <div className="relative">
                        <select 
                          disabled={modalMode === "view"}
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-orange-500 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Description</label>
                      <textarea 
                        disabled={modalMode === "view"}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none disabled:opacity-70 disabled:cursor-not-allowed"
                        placeholder="Add any specific instructions or details..."
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-5 border-t border-neutral-800 bg-neutral-950/50 flex items-center justify-between">
                <p className="text-xs text-neutral-500 flex items-center">
                  Billing ID: 
                  <span className="font-mono text-neutral-300 ml-1 bg-neutral-900 px-2 py-1 rounded">
                    #{modalMode === "create" ? generateBillingId() : formData.billingId}
                  </span>
                </p>
                <div className="flex space-x-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 font-medium transition-colors"
                  >
                    {modalMode === "view" ? "Close" : "Cancel"}
                  </button>
                  
                  {modalMode !== "view" && (
                    <button 
                      type="submit"
                      form="create-order-form"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center"
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      {modalMode === "create" ? "Save Order" : "Update Order"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Delete Order?</h3>
              <p className="text-neutral-500 mb-8 text-sm">
                Are you sure you want to delete this order? This action cannot be undone and will permanently remove the record.
              </p>
              
              <div className="flex space-x-3 w-full">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
