"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';

const AuthForm = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [logPasswordVisible, setLogPasswordVisible] = useState(false);
  const [regPasswordVisible, setRegPasswordVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [logPassword, setLogPassword] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotUsername, setForgotUsername] = useState('');

  //login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: logPassword })
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        router.push('/');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    }
  };

  // Register form submit
  const handleRegister = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const username = e.target.username.value;
    const password = regPassword;

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful! You can now log in.');
        toggleView('login'); // Switch to login view
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong during registration.');
    }
  };

  // Forgot password form submit
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail || !forgotUsername || !forgotPassword) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotEmail, 
          username: forgotUsername, 
          newPassword: forgotPassword 
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Password reset successfully! You can now log in with your new password.');
        setIsForgotPassword(false);
        setIsLogin(true);
        // Clear forgot password form
        setForgotEmail('');
        setForgotUsername('');
        setForgotPassword('');
      } else {
        alert(data.error || 'Password reset failed.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong during password reset.');
    }
  };


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

  useEffect(() => {
    if (loggedIn) {
      sessionStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    }
  }, [loggedIn]);

  const toggleView = (view) => {
    if (view === 'login') {
      setIsLogin(true);
      setIsForgotPassword(false);
    } else if (view === 'register') {
      setIsLogin(false);
      setIsForgotPassword(false);
    } else if (view === 'forgot') {
      setIsLogin(false);
      setIsForgotPassword(true);
    }
  };

  const togglePasswordVisibility = (type) => {
    if (type === 'login') setLogPasswordVisible(!logPasswordVisible);
    if (type === 'register') setRegPasswordVisible(!regPasswordVisible);
    if (type === 'forgot') setForgotPasswordVisible(!forgotPasswordVisible);
  };

  const getPasswordIcon = (password, isVisible) => {
    if (password.length === 0) return 'lock-closed-outline';
    return isVisible ? 'eye-off-outline' : 'eye-outline';
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <div className={styles.formCol}>
          <div className={styles.btnBox}>
            <button
            id="register"
              className={`${styles.btn} ${!isLogin && !isForgotPassword ? styles.btn1 : styles.btn2}`}
              onClick={() => toggleView('register')}
            >
              Sign Up
            </button>
            <button
            id="login"
              className={`${styles.btn} ${(isLogin && !isForgotPassword) || isForgotPassword ? styles.btn1 : styles.btn2}`}
              onClick={() => toggleView('login')}
            >
              {/*{isForgotPassword ? 'Back to Sign In' : 'Sign In'}*/}
              {'Sign In'}
            </button>
          </div>

          {/* Login Form */}
          <form className={`${styles.formBox} ${styles.loginForm}`} style={{ left: isLogin && !isForgotPassword ? '50%' : '150%', opacity: isLogin && !isForgotPassword ? 1 : 0 }} onSubmit={handleSubmit}>
            <div className={styles.formTitle}><span>Sign In</span></div>
            <div className={styles.formInputs}>
              <div className={styles.inputBox}>
                <input 
                  type="text" 
                  className={`${styles.inputs} ${styles.inputField}`}
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
                <ion-icon name="person-outline" className={styles.icon} />
              </div>
              <div className={styles.inputBox}>
                <input
                  type={logPasswordVisible ? 'text' : 'password'}
                  className={`${styles.inputs} ${styles.inputField}`}
                  placeholder="Password"
                  required
                  value={logPassword}
                  onChange={(e) => setLogPassword(e.target.value)}
                />
                <ion-icon
                  name={getPasswordIcon(logPassword, logPasswordVisible)}
                  className={styles.icon}
                  onClick={() => togglePasswordVisibility('login')}
                />
              </div>
              <div className={styles.forgot}>
                <a href="#" onClick={(e) => { e.preventDefault(); toggleView('forgot'); }}>Forgot Password?</a>
              </div>
              <div className={styles.inputBox}>
                <button type="submit" className={`${styles.inputs} ${styles.submitBtn}`}>
                  <span>Sign In</span>
                  <ion-icon name="arrow-forward-outline" />
                </button>
              </div>
            </div>
          </form>

          {/* Register Form */}
          <form className={`${styles.formBox} ${styles.registerForm}`} style={{ left: !isLogin && !isForgotPassword ? '50%' : '-50%', opacity: !isLogin && !isForgotPassword ? 1 : 0 }} onSubmit={handleRegister}>
            <div className={styles.formTitle}><span>Sign Up</span></div>
            <div className={styles.formInputs}>
              <div className={styles.inputBox}>
                <input type="email" name="email" className={`${styles.inputs} ${styles.inputField}`} placeholder="Email" required />
                <ion-icon name="mail-outline" className={styles.icon} />
              </div>
              <div className={styles.inputBox}>
                <input type="text" name="username" className={`${styles.inputs} ${styles.inputField}`} placeholder="Username" required />
                <ion-icon name="person-outline" className={styles.icon} />
              </div>
              <div className={styles.inputBox}>
                <input
                  type={regPasswordVisible ? 'text' : 'password'}
                  className={`${styles.inputs} ${styles.inputField}`}
                  placeholder="Password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <ion-icon
                  name={getPasswordIcon(regPassword, regPasswordVisible)}
                  className={styles.icon}
                  onClick={() => togglePasswordVisibility('register')}
                />
              </div>
              <div className={styles.inputBox}>
                <button type="submit" className={`${styles.inputs} ${styles.submitBtn}`}>
                  <span>Sign Up</span>
                  <ion-icon name="arrow-forward-outline" />
                </button>
              </div>
            </div>
          </form>

          {/* Forgot Password Form */}
          <form className={`${styles.formBox} ${styles.forgotForm}`} style={{ left: isForgotPassword ? '50%' : '-150%', opacity: isForgotPassword ? 1 : 0 }} onSubmit={handleForgotPassword}>
            <div className={styles.formTitle}><span>Reset Password</span></div>
            <div className={styles.formInputs}>
              <div className={styles.inputBox}>
                <input 
                  type="email" 
                  className={`${styles.inputs} ${styles.inputField}`}
                  placeholder="Email" 
                  value={forgotEmail} 
                  onChange={(e) => setForgotEmail(e.target.value)} 
                  required 
                />
                <ion-icon name="mail-outline" className={styles.icon} />
              </div>
              <div className={styles.inputBox}>
                <input 
                  type="text" 
                  className={`${styles.inputs} ${styles.inputField}`}
                  placeholder="Username" 
                  value={forgotUsername} 
                  onChange={(e) => setForgotUsername(e.target.value)} 
                  required 
                />
                <ion-icon name="person-outline" className={styles.icon} />
              </div>
              <div className={styles.inputBox}>
                <input
                  type={forgotPasswordVisible ? 'text' : 'password'}
                  className={`${styles.inputs} ${styles.inputField}`}
                  placeholder="New Password"
                  required
                  value={forgotPassword}
                  onChange={(e) => setForgotPassword(e.target.value)}
                />
                <ion-icon
                  name={getPasswordIcon(forgotPassword, forgotPasswordVisible)}
                  className={styles.icon}
                  onClick={() => togglePasswordVisibility('forgot')}
                />
              </div>
              <div className={styles.inputBox}>
                <button type="submit" className={`${styles.inputs} ${styles.submitBtn}`}>
                  <span>Reset Password</span>
                  <ion-icon name="refresh-outline" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
