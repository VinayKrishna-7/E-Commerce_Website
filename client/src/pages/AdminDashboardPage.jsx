import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Search,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../utils/formatters';
import { CATEGORIES } from '../utils/constants';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboardPage = () => {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Products Management State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // null or object
  const [showProductModal, setShowProductModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Form state for Add/Edit product
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    category: 'Audio & Electronics',
    stock: 10,
    featured: false,
  });

  // Orders Management State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Load stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await adminService.getStats();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load products
  const fetchAdminProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await adminService.getProducts({ search: productSearch });
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load admin products:', err);
      toastError(err.message || 'Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  // Load orders
  const fetchAdminOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await adminService.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      toastError(err.message || 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAdminProducts();
    fetchAdminOrders();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      imageUrl: '',
      category: 'Audio & Electronics',
      stock: 10,
      featured: false,
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || '',
      imageUrl: p.imageUrl,
      category: p.category,
      stock: p.stock,
      featured: p.featured || false,
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        name: prodForm.name.trim(),
        description: prodForm.description.trim(),
        price: parseFloat(prodForm.price),
        originalPrice: prodForm.originalPrice ? parseFloat(prodForm.originalPrice) : null,
        imageUrl: prodForm.imageUrl.trim(),
        category: prodForm.category,
        stock: parseInt(prodForm.stock, 10),
        featured: !!prodForm.featured,
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, payload);
        success('Product updated successfully');
      } else {
        await adminService.createProduct(payload);
        success('Product created successfully');
      }

      setShowProductModal(false);
      fetchAdminProducts();
      fetchStats();
    } catch (err) {
      toastError(err.message || 'Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    try {
      await adminService.deleteProduct(deletingProductId);
      success('Product deleted successfully');
      setDeletingProductId(null);
      fetchAdminProducts();
      fetchStats();
    } catch (err) {
      toastError(err.message || 'Failed to delete product');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      toastError(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* Page Header */}
      <div style={{ margin: 'var(--space-8) 0 var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-1)' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Catalog operations, stock inventory, and customer fulfillment.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button
            variant={activeTab === 'products' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('products')}
            icon={Package}
          >
            Products
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('orders')}
            icon={ShoppingCart}
          >
            Orders
          </Button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-icon">
            <DollarSign size={22} />
          </div>
          <div>
            <div className="admin-metric-value">
              {statsLoading ? '...' : formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <div className="admin-metric-label">Total Revenue</div>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon">
            <ShoppingCart size={22} />
          </div>
          <div>
            <div className="admin-metric-value">
              {statsLoading ? '...' : stats?.totalOrders ?? 0}
            </div>
            <div className="admin-metric-label">Completed Orders</div>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon">
            <Package size={22} />
          </div>
          <div>
            <div className="admin-metric-value">
              {statsLoading ? '...' : stats?.totalProducts ?? 0}
            </div>
            <div className="admin-metric-label">Active Products</div>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon">
            <Users size={22} />
          </div>
          <div>
            <div className="admin-metric-value">
              {statsLoading ? '...' : stats?.totalUsers ?? 0}
            </div>
            <div className="admin-metric-label">Customers</div>
          </div>
        </div>
      </div>

      {/* TAB: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Filter catalog products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAdminProducts()}
                className="form-input"
                style={{ width: '240px', minHeight: '38px', fontSize: 'var(--text-xs)' }}
              />
              <Button variant="secondary" size="sm" onClick={fetchAdminProducts} icon={Search}>
                Filter
              </Button>
            </div>

            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAddModal}>
              Add New Product
            </Button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsLoading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                      <LoadingSpinner text="Loading catalog..." />
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-secondary)' }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            style={{ width: 40, height: 40, borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {p.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-category">{p.category}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {formatCurrency(p.price)}
                        {p.originalPrice && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                            {formatCurrency(p.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td>
                        {p.stock <= 0 ? (
                          <span className="badge badge-error">Out ({p.stock})</span>
                        ) : p.stock <= 5 ? (
                          <span className="badge badge-warning">Low ({p.stock})</span>
                        ) : (
                          <span className="badge badge-success">{p.stock} units</span>
                        )}
                      </td>
                      <td>
                        {p.featured ? (
                          <span className="badge badge-success">Yes</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 'var(--space-1)' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(p)}
                            aria-label="Edit product"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingProductId(p.id)}
                            style={{ color: 'var(--status-error)' }}
                            aria-label="Delete product"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Customer Fulfillment Orders</h3>
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchAdminOrders}>
              Refresh
            </Button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersLoading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                      <LoadingSpinner text="Loading orders..." />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-secondary)' }}>
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const addr = typeof o.shippingAddressSnapshot === 'string'
                      ? JSON.parse(o.shippingAddressSnapshot)
                      : o.shippingAddressSnapshot || {};

                    return (
                      <tr key={o.id}>
                        <td>
                          <strong style={{ color: 'var(--accent-primary)' }}>{o.orderNumber || o.id.slice(0, 8)}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.paymentMethod}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{o.user?.name || addr.recipientName || 'Customer'}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{o.user?.email || addr.phone}</div>
                        </td>
                        <td style={{ fontSize: 'var(--text-xs)' }}>
                          {formatDate(o.createdAt)}
                        </td>
                        <td style={{ fontSize: 'var(--text-xs)' }}>
                          {o.items?.length} items
                        </td>
                        <td style={{ fontWeight: 700 }}>
                          {formatCurrency(o.totalAmount)}
                        </td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                            className="form-select"
                            style={{
                              padding: '0.2rem 0.6rem',
                              fontSize: 'var(--text-xs)',
                              minHeight: '32px',
                              width: 'auto',
                              fontWeight: 600,
                            }}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <FormInput
                label="Product Title"
                value={prodForm.name}
                onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                placeholder="e.g. Minimalist Ceramic Vessel"
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="form-select"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Products').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <FormInput
                  label="Stock Units"
                  type="number"
                  min="0"
                  value={prodForm.stock}
                  onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <FormInput
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={prodForm.price}
                  onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                  placeholder="89.00"
                  required
                />

                <FormInput
                  label="Original Price ($) (Optional)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={prodForm.originalPrice}
                  onChange={(e) => setProdForm({ ...prodForm, originalPrice: e.target.value })}
                  placeholder="110.00"
                />
              </div>

              <FormInput
                label="Image URL"
                value={prodForm.imageUrl}
                onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                required
              />

              <FormInput
                label="Description"
                as="textarea"
                rows={3}
                value={prodForm.description}
                onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                placeholder="Short editorial description of materials and features..."
                required
              />

              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', cursor: 'pointer', marginBottom: 'var(--space-4)' }}>
                <input
                  type="checkbox"
                  checked={prodForm.featured}
                  onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                />
                <span>Feature this product on homepage curated collection</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <Button variant="secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={savingProduct}>
                  {editingProduct ? 'Save Updates' : 'Publish Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProductId}
        title="Delete Product"
        message="Are you sure you want to delete this product? Historical orders that contain this product will be preserved, but it will be removed from the active catalog."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteProduct}
        onClose={() => setDeletingProductId(null)}
      />
    </div>
  );
};

export default AdminDashboardPage;
