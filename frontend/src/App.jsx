import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  //useSearchParams,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ReportItem from "./pages/ReportItem.jsx";
import Browse from "./pages/Browse.jsx";
import MyReports from "./pages/MyReports.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ItemDetails from "./pages/ItemDetails.jsx";
import MyClaims from "./pages/MyClaims.jsx";

function Home() {
  return (
    <div className="home-page">
      <header>
        <h1>Campus Lost &amp; Found</h1>

        <nav>
          <Link to="/home">Home</Link>
          <Link to="/browse">Browse Items</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
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
              <p>
                Report an item you have lost or an item you have found on
                campus.
              </p>
            </div>

            <div className="feature-card">
              <h3>2. Search</h3>
              <p>Browse and search through reported lost and found items.</p>
            </div>

            <div className="feature-card">
              <h3>3. Match</h3>
              <p>
                Identify possible matches between lost and found belongings.
              </p>
            </div>

            <div className="feature-card">
              <h3>4. Recover</h3>
              <p>
                Submit a claim and work towards getting your belongings back.
              </p>
            </div>
          </div>
        </section>

        <section className="home-browse">
          <h2>Looking for a Lost Item?</h2>
          <p>
            Browse the items reported by other students to see whether your
            missing belongings have been found.
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/report" element={<ReportItem />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/my-claims" element={<MyClaims />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
