import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addressService } from '../services/addressService';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { User, MapPin, Plus, Trash2, LogOut, Check } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    recipientName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const loadAddresses = async () => {
    setAddressLoading(true);
    try {
      const res = await addressService.getAddresses();
      setAddresses(res.addresses || []);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const payload = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      await updateProfile(payload);
      success('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      await addressService.createAddress(newAddr);
      success('Address saved successfully');
      setShowAddAddress(false);
      setNewAddr({
        recipientName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        postalCode: '',
        isDefault: false,
      });
      loadAddresses();
    } catch (err) {
      toastError(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressService.deleteAddress(id);
      success('Address removed');
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toastError(err.message || 'Failed to delete address');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 'var(--space-16)' }}>
      <div style={{ margin: 'var(--space-8) 0 var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
          My Account
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Manage your personal information, saved delivery addresses, and security preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
        {/* Profile Details Form */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-3)' }}>
            <User size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Account Information</h3>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Role: </span>
            <span className="badge badge-category">{user?.role}</span>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <FormInput
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Change Password (Optional)</h4>

              <FormInput
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
              />

              <FormInput
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={profileSaving}
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
            >
              Save Profile Changes
            </Button>
          </form>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              onClick={logout}
              style={{ color: 'var(--status-error)', borderColor: 'var(--status-error)' }}
            >
              Sign Out of Account
            </Button>
          </div>
        </div>

        {/* Saved Addresses */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MapPin size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Saved Addresses</h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => setShowAddAddress((prev) => !prev)}
            >
              {showAddAddress ? 'Cancel' : 'Add New'}
            </Button>
          </div>

          {/* Add Address Form Modal / Inline */}
          {showAddAddress && (
            <form onSubmit={handleCreateAddress} style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                <FormInput
                  label="Recipient Name"
                  value={newAddr.recipientName}
                  onChange={(e) => setNewAddr({ ...newAddr, recipientName: e.target.value })}
                  required
                />
                <FormInput
                  label="Phone"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  required
                />
              </div>
              <FormInput
                label="Street Address"
                value={newAddr.addressLine}
                onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)' }}>
                <FormInput
                  label="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  required
                />
                <FormInput
                  label="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                />
                <FormInput
                  label="Postal Code"
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="sm" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                Save Delivery Address
              </Button>
            </form>
          )}

          {/* List of saved addresses */}
          {addresses.length === 0 && !showAddAddress ? (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              No addresses saved yet. They can also be saved automatically during checkout.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    padding: 'var(--space-4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  <div style={{ lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      {addr.recipientName} {addr.isDefault && <span className="badge badge-category">Default</span>}
                    </div>
                    <div>Phone: {addr.phone}</div>
                    <div>{addr.addressLine}</div>
                    <div>{addr.city}, {addr.state} {addr.postalCode}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}
                    aria-label="Delete address"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
