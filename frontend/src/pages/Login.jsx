import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    if (loading) return;

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

     if (response.ok) {
  // Save the logged-in user's details
  localStorage.setItem("user_id", String(data.user.user_id));
  localStorage.setItem("full_name", data.user.full_name);
  localStorage.setItem("email", data.user.email);
  localStorage.setItem("role", data.user.role);

  setMessageType("success");
  setMessage("Login successful! Redirecting...");

  navigate("/home", { replace: true });
}
    else {
        setMessageType("error");
        setMessage(data.error || "Login failed. Please check your details.");
      }
    } catch {
      setMessageType("error");
      setMessage(
        "Could not connect to the server. Make sure Flask is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Campus Lost &amp; Found</h1>
        <h2>Login</h2>

        <p className="login-message">
          Login to manage your lost and found reports.
        </p>

        {message && (
          <div
            className={`notification ${messageType}`}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
