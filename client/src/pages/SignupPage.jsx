import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup, currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (currentUser) {
    navigate('/listings');
    return null;
  }

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form.username, form.email, form.password);
      navigate('/listings');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-5 col-md-7 col-12 mx-auto">
          <div className="form-page-card">
            <h2 className="mb-1">Create account</h2>
            <p className="text-muted mb-4">Join TripNest and find your perfect stay</p>

            {error && (
              <div className="alert alert-danger py-2">{error}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-tripnest w-100"
                disabled={submitting}
              >
                {submitting ? 'Creating account…' : 'Sign up'}
              </button>
            </form>

            <p className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#fe424d', fontWeight: 600 }}>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
