import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '@/lib/auth-client';

interface LoginFormProps {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const LoginForm = ({ showError, showSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        showError(result.error.message || 'Login failed');
      } else {
        showSuccess('Successfully logged in!');
        navigate('/bug/list');
      }
    } catch (error) {
      showError('An error occurred during login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-3 text-center">
            <a href="/register">Don't have an account? Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;