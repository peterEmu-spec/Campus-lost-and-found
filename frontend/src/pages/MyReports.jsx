import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000/api";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchReports() {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        if (!ignore) {
          setError("Please log in to view your reports.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/my-reports/${encodeURIComponent(userId)}`,
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Failed to load your reports.");
        }

        const result = Array.isArray(data)
          ? data
          : Array.isArray(data.reports)
            ? data.reports
            : null;

        if (!result) {
          throw new Error("The server returned an unexpected reports format.");
        }

        if (!ignore) {
          setReports(result);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.message === "Failed to fetch"
              ? "Cannot connect to the server. Make sure Flask is running."
              : err.message || "Unable to load your reports.",
          );
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
  }, [retryCount]);

  const lostReports = reports.filter(
    (report) =>
      (report.item_type || report.itemType || "").toLowerCase() === "lost",
  );

  const foundReports = reports.filter(
    (report) =>
      (report.item_type || report.itemType || "").toLowerCase() === "found",
  );

  function formatDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString();
  }

  function handleRetry() {
    setLoading(true);
    setError("");
    setRetryCount((count) => count + 1);
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
            <Link to="/my-claims">My Claims</Link>
          </nav>
        </div>
      </header>

      <main className="my-reports-content">
        <section className="my-reports-heading">
          <h1>My Reports</h1>
          <p>View and manage the items you have reported.</p>
        </section>

        {loading ? (
          <p>Loading your reports...</p>
        ) : error ? (
          <section className="empty-results">
            <h2>Unable to load reports</h2>
            <p>{error}</p>
            <button type="button" onClick={handleRetry}>
              Try Again
            </button>
          </section>
        ) : (
          <>
            <section className="my-reports-summary">
              <div className="summary-card">
                <span>Total Reports</span>
                <strong>{reports.length}</strong>
              </div>

              <div className="summary-card">
                <span>Lost Items</span>
                <strong>{lostReports.length}</strong>
              </div>

              <div className="summary-card">
                <span>Found Items</span>
                <strong>{foundReports.length}</strong>
              </div>
            </section>

            {reports.length > 0 ? (
              <section className="my-reports-list">
                {reports.map((report, index) => {
                  const itemType = (
                    report.item_type ||
                    report.itemType ||
                    ""
                  ).toLowerCase();

                  const status = (report.status || "reported").toLowerCase();

                  return (
                    <article
                      className="my-report-card"
                      key={report.item_id ?? report.report_id ?? index}
                    >
                      <div className="my-report-details">
                        <span className={`item-type-badge ${itemType}`}>
                          {itemType === "lost" ? "Lost Item" : "Found Item"}
                        </span>

                        <h2>
                          {report.item_name ||
                            report.itemName ||
                            "Unnamed item"}
                        </h2>

                        <p>
                          <strong>Category:</strong>{" "}
                          {report.category || "Not specified"}
                        </p>

                        <p>
                          <strong>Colour:</strong>{" "}
                          {report.colour || report.color || "Not specified"}
                        </p>

                        <p>
                          <strong>Location:</strong>{" "}
                          {report.location || "Not specified"}
                        </p>

                        <p>
                          <strong>Date:</strong>{" "}
                          {formatDate(
                            report.date_lost_found ||
                              report.date ||
                              report.created_at,
                          )}
                        </p>

                        {report.description && (
                          <p>
                            <strong>Description:</strong> {report.description}
                          </p>
                        )}

                        <p className="report-status">
                          <strong>Status:</strong> {status}
                        </p>
                      </div>
                    </article>
                  );
                })}
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
          </>
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
