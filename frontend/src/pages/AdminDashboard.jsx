import { useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [reports, setReports] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("campusReports") || "[]");
    } catch {
      return [];
    }
  });

  function updateStatus(index, newStatus) {
    const updatedReports = reports.map((report, reportIndex) =>
      reportIndex === index ? { ...report, status: newStatus } : report,
    );

    localStorage.setItem("campusReports", JSON.stringify(updatedReports));
    setReports(updatedReports);
  }

  function deleteReport(index) {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    const updatedReports = reports.filter(
      (_, reportIndex) => reportIndex !== index,
    );

    localStorage.setItem("campusReports", JSON.stringify(updatedReports));
    setReports(updatedReports);
  }

  const lostCount = reports.filter(
    (report) => report.itemType === "lost",
  ).length;

  const foundCount = reports.filter(
    (report) => report.itemType === "found",
  ).length;

  const returnedCount = reports.filter(
    (report) => report.status === "returned",
  ).length;

  return (
    <div className="admin-page">
      <header className="site-header">
        <div className="header-content">
          <Link to="/home" className="logo">
            Campus Lost &amp; Found
          </Link>

          <nav className="main-nav">
            <Link to="/home">Home</Link>
            <Link to="/browse">Browse Items</Link>
            <Link to="/my-reports">My Reports</Link>
            <Link to="/admin">Admin Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="admin-content">
        <section className="admin-heading">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview and management of campus lost and found reports.</p>
          </div>
          <span className="admin-label">Administrator</span>
        </section>

        <section className="admin-statistics">
          <article className="admin-stat-card">
            <span>Total Reports</span>
            <strong>{reports.length}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Lost Items</span>
            <strong>{lostCount}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Found Items</span>
            <strong>{foundCount}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Returned Items</span>
            <strong>{returnedCount}</strong>
          </article>
        </section>

        <section className="admin-reports-section">
          <div className="admin-section-heading">
            <div>
              <h2>Manage Reports</h2>
              <p>Review reports and update their status.</p>
            </div>
            <Link to="/report?type=lost" className="home-button">
              New Report
            </Link>
          </div>

          {reports.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map((report, index) => (
                    <tr key={`${report.itemName}-${index}`}>
                      <td>{report.itemName}</td>
                      <td>{report.itemType === "lost" ? "Lost" : "Found"}</td>
                      <td>{report.category}</td>
                      <td>{report.location}</td>
                      <td>{report.date}</td>
                      <td>
                        <select
                          value={report.status || "reported"}
                          onChange={(event) =>
                            updateStatus(index, event.target.value)
                          }
                          aria-label={`Status for ${report.itemName}`}
                        >
                          <option value="reported">Reported</option>
                          <option value="claimed">Claimed</option>
                          <option value="returned">Returned</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() => deleteReport(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-results">
              <h3>No reports to manage</h3>
              <p>Submitted reports will appear here.</p>
              <Link to="/browse" className="home-button">
                Browse Items
              </Link>
            </div>
          )}
        </section>

        <p className="admin-notice">
          Demonstration mode: changes are stored in this browser only.
          Administrator access control will be implemented when we connect the
          backend.
        </p>
      </main>
    </div>
  );
}

export default AdminDashboard;
