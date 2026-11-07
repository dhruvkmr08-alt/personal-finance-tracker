import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveLogin } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (isSignup && !name.trim()) return setError("Please enter your name.");
    if (!email.trim() || !password) return setError("Email and password are required.");
    if (isSignup && password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";
      const response = await api.post(endpoint, isSignup ? { name, email, password } : { email, password });
      saveLogin(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <div className="brand light">Pocket<span>Track</span></div>
        <h1>Make every rupee count.</h1>
        <p>A simple place to understand your income, control your expenses and plan your monthly budget.</p>
        <div className="auth-decoration">₹</div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-card" onSubmit={submit}>
          <p className="eyebrow">{isSignup ? "GET STARTED" : "WELCOME BACK"}</p>
          <h2>{isSignup ? "Create your account" : "Log in to PocketTrack"}</h2>
          <p className="muted">{isSignup ? "Enter your details to start tracking." : "Enter your account details below."}</p>
          {error && <p className="message error">{error}</p>}
          {isSignup && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>}
          <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /></label>
          <button className="primary-btn full" disabled={loading}>{loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}</button>
          <p className="switch-auth">{isSignup ? "Already have an account?" : "New to PocketTrack?"} <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create account"}</Link></p>
        </form>
      </div>
    </div>
  );
}
