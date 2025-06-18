"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';

const AuthForm = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [logPasswordVisible, setLogPasswordVisible] = useState(false);
  const [regPasswordVisible, setRegPasswordVisible] = useState(false);
  const [logPassword, setLogPassword] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('')
  const uname = "admin"; //hardcoded username
  const pwd = "admin1234"; //hardcoded pwd

  //hardcoded submit login
  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === uname && logPassword === pwd) {
      setLoggedIn(true);
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

  useEffect(() => {
    if (loggedIn) {
      sessionStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    }
  }, [loggedIn]);

  const toggleView = (view) => {
    setIsLogin(view === 'login');
  };

  const togglePasswordVisibility = (type) => {
    if (type === 'login') setLogPasswordVisible(!logPasswordVisible);
    if (type === 'register') setRegPasswordVisible(!regPasswordVisible);
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
              className={`${styles.btn} ${!isLogin ? styles.btn1 : styles.btn2}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            <button
            id="login"
              className={`${styles.btn} ${isLogin ? styles.btn1 : styles.btn2}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
          </div>

          {/* Login Form */}
          <form className={`${styles.formBox} ${styles.loginForm}`} style={{ left: isLogin ? '50%' : '150%', opacity: isLogin ? 1 : 0 }} onSubmit={handleSubmit}>
            <div className={styles.formTitle}><span>Sign In</span></div>
            <div className={styles.formInputs}>
              <div className={styles.inputBox}>
                <input 
                  type="text" 
                  className={`${styles.inputs} ${styles.inputField}`}
                  placeholder="Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                />
                <ion-icon name="person-outline" class={styles.icon} />
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
                  class={styles.icon}
                  onClick={() => togglePasswordVisibility('login')}
                />
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
          <form className={`${styles.formBox} ${styles.registerForm}`} style={{ left: isLogin ? '-50%' : '50%', opacity: isLogin ? 0 : 1 }}>
            <div className={styles.formTitle}><span>Sign Up</span></div>
            <div className={styles.formInputs}>
              <div className={styles.inputBox}>
                <input type="email" className={`${styles.inputs} ${styles.inputField}`} placeholder="Email" required />
                <ion-icon name="mail-outline" class={styles.icon} />
              </div>
              <div className={styles.inputBox}>
                <input type="text" className={`${styles.inputs} ${styles.inputField}`} placeholder="Username" required />
                <ion-icon name="person-outline" class={styles.icon} />
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
                  class={styles.icon}
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
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
