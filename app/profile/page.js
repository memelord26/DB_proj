"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';

const ProfilePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showPasswordAuth, setShowPasswordAuth] = useState(true);
  
  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState('email');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, []);

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.type = 'module';
    script1.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.noModule = true;
    script2.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
    document.body.appendChild(script2);
  }, []);

  // Authenticate user with current password
  const handleAuthentication = async (e) => {
    e.preventDefault();
    setLoading(true);

    const username = sessionStorage.getItem('username') || 'currentUser';

    try {
      const res = await fetch('/api/users/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: currentPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        setNewEmail(data.user.email);
        setShowPasswordAuth(false);
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Update email
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          newEmail,
          currentPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Email updated successfully!');
        setUser({ ...user, email: newEmail });
      } else {
        alert(data.error || 'Email update failed');
      }
    } catch (err) {
      console.error('Email update error:', err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          newPassword,
          currentPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.error || 'Password update failed');
      }
    } catch (err) {
      console.error('Password update error:', err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('Please enter your password to confirm deletion');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          password: deletePassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Account deleted successfully');
        sessionStorage.removeItem('isLoggedIn');
        router.replace('/login');
      } else {
        alert(data.error || 'Account deletion failed');
      }
    } catch (err) {
      console.error('Delete account error:', err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  //show password btn
  const togglePasswordVisibility = (type) => {
    if (type === 'view') setPasswordVisible(!PasswordVisible);
    if (type === 'confirm') setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const getPasswordIcon = (password, isVisible) => {
    if (password.length === 0) return 'lock-closed-outline';
    return isVisible ? 'eye-off-outline' : 'eye-outline';
  };

  if (showPasswordAuth) {
    return (
      <div className="min-h-screen flex items-center justify-content" style={{
        backgroundImage: 'url("/app/images/background.jpg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="w-full max-w-md mx-auto p-4">
          <div className="border border-white/30 rounded-3xl backdrop-blur-lg bg-white/10 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              Verify Your Identity
            </h2>
            <form onSubmit={handleAuthentication} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Enter your current password:
                </label>
                <div className="relative">
                  <input
                    type={PasswordVisible ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-14 px-5 pr-12 bg-white/20 backdrop-blur-lg border-none rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-md"
                    placeholder="Password"
                    required
                  />
                  <ion-icon 
                    name={getPasswordIcon(currentPassword, PasswordVisible)}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white w-5 h-5"
                    onClick={() => togglePasswordVisibility('view')}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-14 bg-purple-600/80 hover:bg-purple-700/80 backdrop-blur-lg text-white font-medium rounded-full transition-all duration-300 disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-medium rounded-full transition-all duration-300 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{
      backgroundImage: 'url("/app/images/background.jpg")',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="border border-white/30 rounded-3xl backdrop-blur-lg bg-white/10 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-white">Profile Settings</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-medium rounded-full transition-all duration-300 shadow-md text-sm"
            >
              Back
            </button>
          </div>

          <div className="mb-6">
            <div className="flex space-x-1 border-b border-white/20">
              <button
                onClick={() => setActiveSection('email')}
                className={`py-2 px-4 font-medium rounded-t-lg transition-all duration-300 text-sm ${
                  activeSection === 'email' 
                    ? 'text-white bg-white/20 border-b-2 border-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Update Email
              </button>
              <button
                onClick={() => setActiveSection('password')}
                className={`py-2 px-4 font-medium rounded-t-lg transition-all duration-300 text-sm ${
                  activeSection === 'password' 
                    ? 'text-white bg-white/20 border-b-2 border-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveSection('delete')}
                className={`py-2 px-4 font-medium rounded-t-lg transition-all duration-300 text-sm ${
                  activeSection === 'delete' 
                    ? 'text-red-300 bg-red-500/20 border-b-2 border-red-300' 
                    : 'text-red-400/70 hover:text-red-300 hover:bg-red-500/10'
                }`}
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-md">
            <h3 className="text-lg font-semibold text-white mb-2">Current Account Info:</h3>
            <p className="text-white/90 mb-1 text-sm">Username: <span className="font-medium">{user.username}</span></p>
            <p className="text-white/90 text-sm">Email: <span className="font-medium">{user.email}</span></p>
          </div>

          {/* Update Email Section */}
          {activeSection === 'email' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-md">
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <h2 className="text-lg font-semibold text-white mb-3">Update Email Address</h2>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    New Email Address:
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full h-12 px-4 pr-10 bg-white/20 backdrop-blur-lg border-none rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-md text-sm"
                      placeholder="Enter new email"
                      required
                    />
                    <ion-icon 
                      name="mail-outline" 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-4 h-4"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-purple-600/80 hover:bg-purple-700/80 backdrop-blur-lg text-white font-medium rounded-full transition-all duration-300 disabled:opacity-50 shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? 'Updating...' : 'Update Email'}
                  {!loading && <ion-icon name="arrow-forward-outline" className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}

          {/* Change Password Section */}
          {activeSection === 'password' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-md">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <h2 className="text-lg font-semibold text-white mb-3">Change Password</h2>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    New Password:
                  </label>
                  <div className="relative">
                    <input
                      type={PasswordVisible ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 px-4 pr-10 bg-white/20 backdrop-blur-lg border-none rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-md text-sm"
                      placeholder="Enter new password"
                      required
                    />
                    <ion-icon 
                      name={getPasswordIcon(newPassword, PasswordVisible)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-4 h-4"
                      onClick={() => togglePasswordVisibility('view')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Confirm New Password:
                  </label>
                  <div className="relative">
                    <input
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 px-4 pr-10 bg-white/20 backdrop-blur-lg border-none rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-md text-sm"
                      placeholder="Confirm new password"
                      required
                    />
                    <ion-icon 
                      name={getPasswordIcon(confirmPassword, confirmPasswordVisible)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-4 h-4"
                      onClick={() => togglePasswordVisibility('confirm')}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-purple-600/80 hover:bg-purple-700/80 backdrop-blur-lg text-white font-medium rounded-full transition-all duration-300 disabled:opacity-50 shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? 'Updating...' : 'Change Password'}
                  {!loading && <ion-icon name="refresh-outline" className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}

          {/* Delete Account Section */}
          {activeSection === 'delete' && (
            <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-5 border border-red-300/30 shadow-md">
              <h2 className="text-lg font-semibold text-red-300 mb-3">Delete Account</h2>
              <div className="bg-red-500/20 backdrop-blur-lg p-3 rounded-xl border border-red-300/30 mb-4">
                <p className="text-red-200 text-sm">
                  <strong>Warning:</strong> This action cannot be undone. Your account and all associated data will be permanently deleted.
                </p>
              </div>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-red-500/80 hover:bg-red-600/80 backdrop-blur-lg text-white font-medium rounded-full transition-all duration-300 shadow-md text-sm"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Enter your password to confirm deletion:
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full h-12 px-4 pr-10 bg-white/20 backdrop-blur-lg border-none rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-300/30 shadow-md text-sm"
                        placeholder="Current password"
                        required
                      />
                      <ion-icon 
                        name="lock-closed-outline" 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-4 h-4"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="flex-1 h-12 bg-red-500/80 hover:bg-red-600/80 backdrop-blur-lg text-white font-medium rounded-full transition-all duration-300 disabled:opacity-50 shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? 'Deleting...' : 'Confirm Delete'}
                      {!loading && <ion-icon name="trash-outline" className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-medium rounded-full transition-all duration-300 shadow-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
