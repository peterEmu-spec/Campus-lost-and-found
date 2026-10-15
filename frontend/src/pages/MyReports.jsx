import { useState } from "react";
import { Link } from "react-router-dom";

function MyReports() {
  const [reports, setReports] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("campusReports") || "[]");
    } catch {
      return [];
    }
  });

  function deleteReport(indexToDelete) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?",
    );

    if (!confirmDelete) return;

    const updatedReports = reports.filter(
      (_, index) => index !== indexToDelete,
    );

    localStorage.setItem("campusReports", JSON.stringify(updatedReports));
    setReports(updatedReports);
  }

  return (
    <div className="my-reports-page">
      <header className="site-header">
        <div className="header-content">
          <Link to="/home" className="logo">
            Campus Lost &amp; Found
          </Link>

          <nav className="main-nav">
            <Link to="/home">Home</Link>
            <Link to="/browse">Browse Items</Link>
            <Link to="/report?type=lost">Report Lost</Link>
            <Link to="/report?type=found">Report Found</Link>
            <Link to="/my-reports">My Reports</Link>
          </nav>
        </div>
      </header>

      <main className="my-reports-content">
        <section className="my-reports-heading">
          <h1>My Reports</h1>
          <p>View and manage the items you have reported.</p>
        </section>

        <div className="my-reports-summary">
          <div className="summary-card">
            <span>Total Reports</span>
            <strong>{reports.length}</strong>
          </div>

          <div className="summary-card">
            <span>Lost Items</span>
            <strong>
              {reports.filter((report) => report.itemType === "lost").length}
            </strong>
          </div>

          <div className="summary-card">
            <span>Found Items</span>
            <strong>
              {reports.filter((report) => report.itemType === "found").length}
            </strong>
          </div>
        </div>

        {reports.length > 0 ? (
          <section className="my-reports-list">
            {reports.map((report, index) => (
              <article
                className="my-report-card"
                key={`${report.itemName}-${index}`}
              >
                <div className="my-report-details">
                  <span className={`item-type-badge ${report.itemType}`}>
                    {report.itemType === "lost" ? "Lost Item" : "Found Item"}
                  </span>

                  <h2>{report.itemName}</h2>

                  <p>
                    <strong>Category:</strong> {report.category}
                  </p>

                  <p>
                    <strong>Colour:</strong> {report.colour || "Not specified"}
                  </p>

                  <p>
                    <strong>Location:</strong> {report.location}
                  </p>

                  <p>
                    <strong>Date:</strong> {report.date}
                  </p>

                  {report.description && <p>{report.description}</p>}

                  <p className="report-status">
                    <strong>Status:</strong> Reported
                  </p>
                </div>

                <button
                  type="button"
                  className="delete-report-button"
                  onClick={() => deleteReport(index)}
                >
                  Delete Report
                </button>
              </article>
            ))}
          </section>
        ) : (
          <section className="empty-results">
            <h2>You haven't reported any items yet.</h2>
            <p>Your lost and found reports will appear here.</p>

            <Link to="/report?type=lost" className="home-button">
              Report an Item
            </Link>
          </section>
        )}

        <div className="my-reports-actions">
          <Link to="/report?type=lost" className="home-button">
            Report Lost Item
          </Link>

          <Link to="/report?type=found" className="secondary-button">
            Report Found Item
          </Link>
        </div>
      </main>
    </div>
  );
}

export default MyReports;
