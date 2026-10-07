import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Field, Input, Button, Alert } from './ui';
import logo from './assets/globalhealth-logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated]); // navigate is stable, no need to include it

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
    }
    // Success navigation is handled inside login() in AuthContext
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Login Form */}
      <div className="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Bienvenue</h1>
            <p className="mt-2 text-sm text-gray-500">Veuillez saisir vos coordonnées pour vous connecter</p>
          </div>

          {error && <Alert tone="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Email" htmlFor="email">
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Bob@exemple.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Mot de passe" htmlFor="password">
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </Field>

            <div className="text-right">
              <a href="/forgot-password" className="text-sm font-medium text-brand-700 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" size="lg" loading={isLoading} className="w-full">
              {isLoading ? 'Connexion...' : 'Se Connecter'}
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Logo */}
      <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-brand-700 to-brand-950 p-12 lg:flex">
        <img
          src={logo}
          alt="GlobalHealth"
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default LoginPage;
