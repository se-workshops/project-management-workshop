import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || t('login.loginError'));
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">{t('login.title')}</h1>
          <h2 className="login-subtitle">{t('login.subtitle')}</h2>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              type="email"
              label={t('login.email')}
              value={email}
              onChange={setEmail}
              placeholder={t('login.emailPlaceholder')}
              required
            />

            <Input
              type="password"
              label={t('login.password')}
              value={password}
              onChange={setPassword}
              placeholder={t('login.passwordPlaceholder')}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              {t('login.loginButton')}
            </Button>
          </form>

          <div className="demo-accounts">
            <h3>{t('login.demoAccounts')}</h3>
            <ul>
              <li>tanaka@example.com / password123</li>
              <li>yamada@example.com / password123</li>
              <li>suzuki@example.com / password123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
