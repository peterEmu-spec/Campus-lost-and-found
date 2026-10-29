import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://127.0.0.1:5000/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const role = localStorage.getItem("role");

  // Check whether the logged-in user has an administrator role.
  useEffect(() => {
    if (role !== "admin" && role !== "super_admin") {
      navigate("/home", { replace: true });
    }
  }, [role, navigate]);

  // Load reports from the Flask backend.
  useEffect(() => {
    let ignore = false;

    async function fetchReports() {
      try {
        const response = await fetch(`${API_URL}/items`);

        if (!response.ok) {
          throw new Error(
            `Failed to load reports. Server returned ${response.status}.`,
          );
        }

        const data = await response.json();

        if (!Array.isArray(data) && !Array.isArray(data.items)) {
          throw new Error("The server returned an unexpected reports format.");
        }

        const items = Array.isArray(data) ? data : data.items;

        if (!ignore) {
          setReports(items);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load reports.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchReports();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  // Calculate dashboard statistics from the reports in the database.
  const totalReports = reports.length;

  const lostReports = reports.filter(
    (report) => report.item_type?.toLowerCase() === "lost",
  ).length;

  const foundReports = reports.filter(
    (report) => report.item_type?.toLowerCase() === "found",
  ).length;

  const returnedReports = reports.filter(
    (report) => report.status?.toLowerCase() === "returned",
  ).length;

  // Refresh the reports.
  function handleRefresh() {
    setLoading(true);
    setRefreshKey((previous) => previous + 1);
  }

  // Update an item's status in the backend.
  async function handleStatusChange(itemId, newStatus) {
    const previousReports = reports;

    setUpdatingId(itemId);
    setError("");

    // Update the screen immediately while the request is processed.
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.item_id === itemId ? { ...report, status: newStatus } : report,
      ),
    );

    try {
      const response = await fetch(`${API_URL}/items/${itemId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));

        throw new Error(result.error || "Failed to update the report status.");
      }

      // Reload the database records after a successful update.
      setRefreshKey((previous) => previous + 1);
    } catch (err) {
      // Restore the original records if the update fails.
      setReports(previousReports);
      setError(err.message || "Unable to update the report.");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  }

  if (role !== "admin" && role !== "super_admin") {
    return <p>Checking administrator access...</p>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Campus Lost &amp; Found</h1>
          <p>Administrator Dashboard</p>
        </div>

        <nav className="admin-nav">
          <Link to="/home">Home</Link>
          <Link to="/browse">Browse Items</Link>
          <button type="button" onClick={handleRefresh}>
            Refresh Reports
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="admin-main">
        <section className="dashboard-heading">
          <div>
            <h2>Dashboard Overview</h2>
            <p>Monitor lost and found reports submitted on campus.</p>
          </div>
        </section>

        {error && (
          <div className="admin-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={handleRefresh}>
              Try Again
            </button>
          </div>
        )}

        <section className="stats-grid">
          <article className="stat-card">
            <h3>Total Reports</h3>
            <p className="stat-number">{loading ? "..." : totalReports}</p>
          </article>

          <article className="stat-card">
            <h3>Lost Items</h3>
            <p className="stat-number">{loading ? "..." : lostReports}</p>
          </article>

          <article className="stat-card">
            <h3>Found Items</h3>
            <p className="stat-number">{loading ? "..." : foundReports}</p>
          </article>

          <article className="stat-card">
            <h3>Returned Items</h3>
            <p className="stat-number">{loading ? "..." : returnedReports}</p>
          </article>
        </section>

        <section className="reports-section">
          <div className="section-heading">
            <h2>All Item Reports</h2>
            <span>{loading ? "Loading..." : `${totalReports} reports`}</span>
          </div>

          {loading ? (
            <p className="loading-message">
              Loading reports from the database...
            </p>
          ) : reports.length === 0 ? (
            <p className="empty-message">
              No reports were returned by the server.
            </p>
          ) : (
            <div className="table-container">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map((report) => (
                    <tr key={report.item_id}>
                      <td>{report.item_id}</td>
                      <td>{report.item_name || "Unnamed item"}</td>
                      <td>{report.item_type || "N/A"}</td>
                      <td>{report.category || "N/A"}</td>
                      <td>{report.location || "N/A"}</td>
                      <td>
                        {report.date_lost_found
                          ? String(report.date_lost_found).slice(0, 10)
                          : "N/A"}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            report.status?.toLowerCase() || "reported"
                          }`}
                        >
                          {report.status || "reported"}
                        </span>
                      </td>
                      <td>
                        <select
                          aria-label={`Change status for ${report.item_name || "item"}`}
                          value={report.status || "reported"}
                          disabled={updatingId === report.item_id}
                          onChange={(event) =>
                            handleStatusChange(
                              report.item_id,
                              event.target.value,
                            )
                          }
                        >
                          <option value="reported">Reported</option>
                          <option value="claimed">Claimed</option>
                          <option value="returned">Returned</option>
                        </select>

                        {updatingId === report.item_id && (
                          <small> Saving...</small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="admin-footer">
        <p>Campus Lost &amp; Found System &copy; 2026</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
