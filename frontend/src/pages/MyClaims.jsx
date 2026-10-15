import { useState } from "react";
import { Link } from "react-router-dom";

function MyClaims() {
  const [claims, setClaims] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("campusClaims") || "[]");
    } catch {
      return [];
    }
  });

  function deleteClaim(indexToDelete) {
    if (!window.confirm("Are you sure you want to delete this claim?")) {
      return;
    }

    const updatedClaims = claims.filter((_, index) => index !== indexToDelete);

    localStorage.setItem("campusClaims", JSON.stringify(updatedClaims));
    setClaims(updatedClaims);
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

        <section className="claims-summary">
          <article className="claim-summary-card">
            <span>Total Claims</span>
            <strong>{claims.length}</strong>
          </article>

          <article className="claim-summary-card">
            <span>Pending</span>
            <strong>
              {claims.filter((claim) => claim.status === "pending").length}
            </strong>
          </article>

          <article className="claim-summary-card">
            <span>Approved</span>
            <strong>
              {claims.filter((claim) => claim.status === "approved").length}
            </strong>
          </article>
        </section>

        {claims.length > 0 ? (
          <section className="claims-list">
            {claims.map((claim, index) => (
              <article
                className="claim-card"
                key={`${claim.itemName}-${index}`}
              >
                <div>
                  <span className={`claim-status ${claim.status || "pending"}`}>
                    {claim.status || "pending"}
                  </span>

                  <h2>{claim.itemName}</h2>

                  <p>
                    <strong>Category:</strong> {claim.category}
                  </p>

                  <p>
                    <strong>Location:</strong> {claim.location}
                  </p>

                  <p>
                    <strong>Reason for claim:</strong> {claim.reason}
                  </p>

                  <p>
                    <strong>Date submitted:</strong> {claim.submittedAt}
                  </p>
                </div>

                <button
                  type="button"
                  className="delete-report-button"
                  onClick={() => deleteClaim(index)}
                >
                  Delete Claim
                </button>
              </article>
            ))}
          </section>
        ) : (
          <section className="empty-results">
            <h2>You have no claims yet.</h2>
            <p>
              Browse found items and submit a claim when you recognise something
              that belongs to you.
            </p>
            <Link to="/browse" className="home-button">
              Browse Items
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

export default MyClaims;
