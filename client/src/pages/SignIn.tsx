import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import { login as loginApi } from '../api/api';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginApi({ email, password });
      const { token, _id, name, likedTracks, following } = response.data;

      const authUser = { token, _id, name, likedTracks, following: following || [] };
      localStorage.setItem('token', token);
      setAuth(authUser);

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e1216]">
      <div className="w-full max-w-md mx-auto p-6 flex flex-col justify-center">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <div className="text-orange-500 mr-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 14.5C12 13.672 12.672 13 13.5 13C14.328 13 15 13.672 15 14.5C15 15.328 14.328 16 13.5 16C12.672 16 12 15.328 12 14.5Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V20H8C8.55229 20 9 19.5523 9 19V13.5C9 11.0147 11.0147 9 13.5 9C15.9853 9 18 11.0147 18 13.5C18 15.9853 15.9853 18 13.5 18C12.2744 18 11.1469 17.5403 10.2812 16.7812C10.1039 16.9489 10 17.1734 10 17.4142V19C10 20.1046 9.10457 21 8 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-2xl">Floune</span>
          </Link>
        </div>

        <div className="bg-[#1a1f25] rounded-lg shadow-xl p-8">
          <h1 className="text-white text-2xl font-bold mb-6">Sign in to your account</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded mb-4">
              {error}
              <button
                className="float-right text-red-500/80 hover:text-red-500"
                onClick={() => setError(null)}
              >
                &times;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-400 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-gray-400 text-sm font-medium"
                >
                  Password
                </label>
                {/* <Link
                  to="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-400"
                >
                  Forgot password?
                </Link> */}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-orange-500 hover:text-orange-400"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;