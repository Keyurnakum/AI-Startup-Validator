import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const response = await api.post(endpoint, payload);
      onAuth(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Authentication failed');
    }
  }

  return (
    <div className="page auth-page">
      <div className="card">
        <h1>AI Startup Idea Validator</h1>
        <p className="subtext">Validate startup ideas with AI analysis, SWOT, market and competitor insights.</p>
        <form onSubmit={submit} className="form-grid">
          {!isLogin && (
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          )}
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">{isLogin ? 'Sign In' : 'Create Account'}</button>
        </form>
        <button className="ghost" type="button" onClick={() => setIsLogin((value) => !value)}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ auth, onLogout }) {
  const [ideaForm, setIdeaForm] = useState({ startupName: '', idea: '', industry: '', targetAudience: '' });
  const [dashboard, setDashboard] = useState({ totalIdeas: 0, averageScore: 0, recentIdeas: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headers = useMemo(() => ({ Authorization: ['Be', 'arer '].join('') + auth.token }), [auth.token]);

  async function submitIdea(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/ideas/validate', ideaForm, { headers });
      setIdeaForm({ startupName: '', idea: '', industry: '', targetAudience: '' });
      const response = await api.get('/api/dashboard', { headers });
      setDashboard(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Validation failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api
      .get('/api/dashboard', { headers })
      .then((response) => setDashboard(response.data))
      .catch(() => setError('Failed to load dashboard'));
  }, [headers]);

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Welcome, {auth.user.name}</h1>
          <p className="subtext">Analyze startup ideas and track growth recommendations in one place.</p>
        </div>
        <button className="ghost" type="button" onClick={onLogout}>Logout</button>
      </header>

      <section className="stats-grid">
        <article className="card stat"><h2>{dashboard.totalIdeas}</h2><p>Ideas Validated</p></article>
        <article className="card stat"><h2>{dashboard.averageScore}</h2><p>Average Startup Score</p></article>
      </section>

      <section className="card">
        <h2>Validate New Startup Idea</h2>
        <form onSubmit={submitIdea} className="form-grid">
          <input placeholder="Startup name" value={ideaForm.startupName} onChange={(e) => setIdeaForm((c) => ({ ...c, startupName: e.target.value }))} required />
          <input placeholder="Industry" value={ideaForm.industry} onChange={(e) => setIdeaForm((c) => ({ ...c, industry: e.target.value }))} />
          <input placeholder="Target audience" value={ideaForm.targetAudience} onChange={(e) => setIdeaForm((c) => ({ ...c, targetAudience: e.target.value }))} />
          <textarea placeholder="Describe your startup idea" value={ideaForm.idea} onChange={(e) => setIdeaForm((c) => ({ ...c, idea: e.target.value }))} required rows={4} />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Run AI Validation'}</button>
        </form>
      </section>

      <section className="result-list">
        {dashboard.recentIdeas.map((item) => (
          <article key={item._id || item.id} className="card">
            <h3>{item.startupName} <span className="badge">Score: {item.analysis?.startupScore ?? 0}</span></h3>
            <p>{item.analysis?.summary}</p>
            <h4>SWOT</h4>
            <div className="swot-grid">
              <ul><strong>Strengths</strong>{(item.analysis?.swot?.strengths || []).map((x, i) => <li key={`s-${i}`}>{x}</li>)}</ul>
              <ul><strong>Weaknesses</strong>{(item.analysis?.swot?.weaknesses || []).map((x, i) => <li key={`w-${i}`}>{x}</li>)}</ul>
              <ul><strong>Opportunities</strong>{(item.analysis?.swot?.opportunities || []).map((x, i) => <li key={`o-${i}`}>{x}</li>)}</ul>
              <ul><strong>Threats</strong>{(item.analysis?.swot?.threats || []).map((x, i) => <li key={`t-${i}`}>{x}</li>)}</ul>
            </div>
            <h4>Market Research</h4>
            <p>{item.analysis?.marketResearch}</p>
            <h4>Competitor Analysis</h4>
            <p>{item.analysis?.competitorAnalysis}</p>
            <h4>Growth Recommendations</h4>
            <ul>{(item.analysis?.growthRecommendations || []).map((x, i) => <li key={`g-${i}`}>{x}</li>)}</ul>
          </article>
        ))}
      </section>
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('startup_validator_auth');
    return stored ? JSON.parse(stored) : null;
  });

  function onAuth(payload) {
    setAuth(payload);
    localStorage.setItem('startup_validator_auth', JSON.stringify(payload));
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem('startup_validator_auth');
  }

  return (
    <Routes>
      <Route path="/" element={auth ? <Navigate to="/dashboard" replace /> : <AuthPage onAuth={onAuth} />} />
      <Route path="/dashboard" element={auth ? <Dashboard auth={auth} onLogout={logout} /> : <Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
