import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000/api";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchClaims() {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        if (!ignore) {
          setError("Please log in to view your claims.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/my-claims/${encodeURIComponent(userId)}`,
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Failed to load your claims.");
        }

        const result = Array.isArray(data)
          ? data
          : Array.isArray(data.claims)
            ? data.claims
            : null;

        if (!result) {
          throw new Error("The server returned an unexpected claims format.");
        }

        if (!ignore) {
          setClaims(result);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.message === "Failed to fetch"
              ? "Cannot connect to the server. Check that Flask is running."
              : err.message || "Unable to load your claims.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchClaims();

    return () => {
      ignore = true;
    };
  }, [retryCount]);

  const pendingClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "pending",
  );

  const approvedClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "approved",
  );

  const rejectedClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "rejected",
  );

  function formatDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleString();
  }

  function handleRetry() {
    setLoading(true);
    setError("");
    setRetryCount((count) => count + 1);
  }

  return (
    <div className="my-claims-page">
      <header className="site-header">
        <div className="header-content">
          <Link to="/home" className="logo">
            Campus Lost &amp; Found
          </Link>

          <nav className="main-nav">
            <Link to="/home">Home</Link>
            <Link to="/browse">Browse Items</Link>
            <Link to="/my-reports">My Reports</Link>
            <Link to="/my-claims">My Claims</Link>
          </nav>
        </div>
      </header>

      <main className="my-claims-content">
        <section className="my-claims-heading">
          <h1>My Claims</h1>
          <p>Track the items you have requested to claim.</p>
        </section>

        {loading ? (
          <p>Loading your claims...</p>
        ) : error ? (
          <section className="empty-results">
            <h2>Unable to load claims</h2>
            <p>{error}</p>
            <button type="button" onClick={handleRetry}>
              Try Again
            </button>
          </section>
        ) : (
          <>
            <section className="claims-summary">
              <article className="claim-summary-card">
                <span>Total Claims</span>
                <strong>{claims.length}</strong>
              </article>

              <article className="claim-summary-card">
                <span>Pending</span>
                <strong>{pendingClaims.length}</strong>
              </article>

              <article className="claim-summary-card">
                <span>Approved</span>
                <strong>{approvedClaims.length}</strong>
              </article>

              <article className="claim-summary-card">
                <span>Rejected</span>
                <strong>{rejectedClaims.length}</strong>
              </article>
            </section>

            {claims.length > 0 ? (
              <section className="claims-list">
                {claims.map((claim, index) => {
                  const status = (claim.status || "pending").toLowerCase();

                  return (
                    <article
                      className="claim-card"
                      key={claim.claim_id ?? `${claim.item_id}-${index}`}
                    >
                      <div>
                        <span className={`claim-status ${status}`}>
                          {status}
                        </span>

                        <h2>
                          {claim.item_name || claim.itemName || "Unknown item"}
                        </h2>

                        <p>
                          <strong>Category:</strong>{" "}
                          {claim.category || "Not specified"}
                        </p>

                        <p>
                          <strong>Location:</strong>{" "}
                          {claim.location || "Not specified"}
                        </p>

                        <p>
                          <strong>Reason for claim:</strong>{" "}
                          {claim.claim_description ||
                            claim.reason ||
                            "Not provided"}
                        </p>

                        <p>
                          <strong>Date submitted:</strong>{" "}
                          {formatDate(claim.claim_date || claim.submittedAt)}
                        </p>

                        {status === "rejected" && (
                          <p>Your claim was rejected.</p>
                        )}

                        {status === "approved" && (
                          <p>Your claim has been approved.</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : (
              <section className="empty-results">
                <h2>You have no claims yet.</h2>
                <p>
                  Browse found items and submit a claim when you recognise
                  something that belongs to you.
                </p>

                <Link to="/browse" className="home-button">
                  Browse Items
                </Link>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default MyClaims;
