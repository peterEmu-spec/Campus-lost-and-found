import "./App.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ReportItem from "./pages/ReportItem.jsx";
import Browse from "./pages/Browse.jsx";
import MyReports from "./pages/MyReports.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ItemDetails from "./pages/ItemDetails.jsx";
import MyClaims from "./pages/MyClaims.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function Home() {
  const role = localStorage.getItem("role");
  const fullName = localStorage.getItem("full_name");

  return (
    <div className="home-page">
      <header>
        <h1>Campus Lost &amp; Found</h1>

        <nav>
          <Link to="/home">Home</Link>
          <Link to="/browse">Browse Items</Link>

          {role === "admin" || role === "super_admin" ? (
            <Link to="/admin">Admin Dashboard</Link>
          ) : (
            <>
              <Link to="/report?type=lost">Report Item</Link>
              <Link to="/my-reports">My Reports</Link>
              <Link to="/my-claims">My Claims</Link>
            </>
          )}

          <span>Welcome, {fullName || "User"}</span>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("user_id");
              localStorage.removeItem("full_name");
              localStorage.removeItem("email");
              localStorage.removeItem("role");
              window.location.replace("/login");
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Lost Something? Found Something?</h2>

          <p>
            Campus Lost &amp; Found helps students report, search and recover
            lost items around campus. Find what is missing or help someone
            recover what they have lost.
          </p>

          <div className="home-actions">
            <Link to="/report?type=lost" className="home-button">
              Report Lost Item
            </Link>

            <Link
              to="/report?type=found"
              className="home-button secondary-button"
            >
              Report Found Item
            </Link>
          </div>
        </section>

        <section className="features">
          <h2>How It Works</h2>

          <p className="home-intro">
            A simple way for students to report missing belongings, find
            recovered items, and reconnect people with their property.
          </p>

          <div className="feature-list">
            <div className="feature-card">
              <h3>1. Report</h3>
              <p>Report an item you have lost or found on campus.</p>
            </div>

            <div className="feature-card">
              <h3>2. Search</h3>
              <p>Browse and search through reported items.</p>
            </div>

            <div className="feature-card">
              <h3>3. Match</h3>
              <p>
                Identify possible matches between lost and found belongings.
              </p>
            </div>

            <div className="feature-card">
              <h3>4. Recover</h3>
              <p>Submit a claim and work towards recovering your belongings.</p>
            </div>
          </div>
        </section>

        <section className="home-browse">
          <h2>Looking for a Lost Item?</h2>
          <p>
            Browse reported items to see whether your missing belongings have
            been found.
          </p>

          <Link to="/browse" className="home-button">
            Browse Items
          </Link>
        </section>
      </main>

      <footer>
        <p>© 2026 Campus Lost &amp; Found System</p>
        <p>Helping campus belongings find their way home.</p>
      </footer>
    </div>
  );
}

function App() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin" || role === "super_admin";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={role ? (isAdmin ? "/admin" : "/home") : "/login"}
              replace
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["student", "admin", "super_admin"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse"
          element={
            <ProtectedRoute allowedRoles={["student", "admin", "super_admin"]}>
              <Browse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ReportItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-claims"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyClaims />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/items/:id"
          element={
            <ProtectedRoute allowedRoles={["student", "admin", "super_admin"]}>
              <ItemDetails />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
