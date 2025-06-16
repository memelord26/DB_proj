"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import MainPage from '../page.js';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [logPasswordVisible, setLogPasswordVisible] = useState(false);
  const [regPasswordVisible, setRegPasswordVisible] = useState(false);
  const [logPassword, setLogPassword] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const uname = "admin";
  const pwd = "admin1234";
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === uname && logPassword === pwd) {
      sessionStorage.setItem("loggedIn", "true");
      window.location.href = "/";
    } else {
      alert('Invalid username or password');
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

  const togglePasswordVisibility = (type) => {
    if (type === 'login') setLogPasswordVisible(!logPasswordVisible);
    if (type === 'register') setRegPasswordVisible(!regPasswordVisible);
  };

  const getPasswordIcon = (password, isVisible) => {
    if (password.length === 0) return 'lock-closed-outline';
    return isVisible ? 'eye-off-outline' : 'eye-outline';
  };

  if (loggedIn) return <MainPage />;

  return (
    <div className={styles['form-container']}>
      <div className={styles['form-col']}>
        <div className={styles['btn-box']}>
          <button
            id="register"
            className={`${styles.btn} ${!isLogin ? styles['btn-1'] : styles['btn-2']}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          <button
            id="login"
            className={`${styles.btn} ${isLogin ? styles['btn-1'] : styles['btn-2']}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
        </div>

        {/* Login Form */}
        <form
          className={`${styles['form-box']} ${styles['login-form']}`}
          style={{ left: isLogin ? '50%' : '150%', opacity: isLogin ? 1 : 0 }}
          onSubmit={handleSubmit}
        >
          <div className={styles['form-title']}><span>Sign In</span></div>
          <div className={styles['form-inputs']}>
            <div className={styles['input-box']}>
              <input
                type="text"
                className={`${styles.inputs} ${styles['input-field']}`}
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <ion-icon name="person-outline" class="icon" />
            </div>
            <div className={styles['input-box']}>
              <input
                type={logPasswordVisible ? 'text' : 'password'}
                className={`${styles.inputs} ${styles['input-field']}`}
                placeholder="Password"
                required
                value={logPassword}
                onChange={(e) => setLogPassword(e.target.value)}
              />
              <ion-icon
                name={getPasswordIcon(logPassword, logPasswordVisible)}
                class="icon"
                onClick={() => togglePasswordVisibility('login')}
              />
            </div>
            <div className={styles['forgot-pass']}>
              <a href="#">Forgot Password?</a>
            </div>
            <div className={styles['input-box']}>
              <button type="submit" className={`${styles.inputs} ${styles['submit-btn']}`}>
                <span>Sign In</span>
                <ion-icon name="arrow-forward-outline" />
              </button>
            </div>
          </div>
        </form>

        {/* Register Form */}
        <form
          className={`${styles['form-box']} ${styles['register-form']}`}
          style={{ left: isLogin ? '-50%' : '50%', opacity: isLogin ? 0 : 1 }}
        >
          <div className={styles['form-title']}><span>Sign Up</span></div>
          <div className={styles['form-inputs']}>
            <div className={styles['input-box']}>
              <input type="email" className={`${styles.inputs} ${styles['input-field']}`} placeholder="Email" required />
              <ion-icon name="mail-outline" class="icon" />
            </div>
            <div className={styles['input-box']}>
              <input type="text" className={`${styles.inputs} ${styles['input-field']}`} placeholder="Username" required />
              <ion-icon name="person-outline" class="icon" />
            </div>
            <div className={styles['input-box']}>
              <input
                type={regPasswordVisible ? 'text' : 'password'}
                className={`${styles.inputs} ${styles['input-field']}`}
                placeholder="Password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <ion-icon
                name={getPasswordIcon(regPassword, regPasswordVisible)}
                class="icon"
                onClick={() => togglePasswordVisibility('register')}
              />
            </div>
            <div className={styles['input-box']}>
              <button type="submit" className={`${styles.inputs} ${styles['submit-btn']}`}>
                <span>Sign Up</span>
                <ion-icon name="arrow-forward-outline" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
