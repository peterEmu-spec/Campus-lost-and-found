import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function ItemDetails() {
  const { id } = useParams();

  const reports = (() => {
    try {
      return JSON.parse(localStorage.getItem("campusReports") || "[]");
    } catch {
      return [];
    }
  })();

  const reportIndex = Number(id);
  const report =
    Number.isInteger(reportIndex) && reportIndex >= 0
      ? reports[reportIndex]
      : null;

  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  function handleClaimSubmit(event) {
    event.preventDefault();

    if (report.itemType !== "found") {
      setMessage("You can only submit a claim for a found item.");
      setMessageType("error");
      return;
    }

    if ((report.status || "reported") !== "reported") {
      setMessage("This item is no longer available for claims.");
      setMessageType("error");
      return;
    }

    try {
      const existingClaims = JSON.parse(
        localStorage.getItem("campusClaims") || "[]",
      );

      existingClaims.push({
        itemName: report.itemName,
        category: report.category,
        location: report.location,
        reason: reason.trim(),
        status: "pending",
        submittedAt: new Date().toLocaleDateString(),
      });

      localStorage.setItem("campusClaims", JSON.stringify(existingClaims));

      setReason("");
      setMessage("Your claim has been submitted successfully.");
      setMessageType("success");
    } catch {
      setMessage("Unable to save your claim. Please try again.");
      setMessageType("error");
    }
  }

  if (!report) {
    return (
      <div className="item-details-page">
        <header className="site-header">
          <div className="header-content">
            <Link to="/home" className="logo">
              Campus Lost &amp; Found
            </Link>
            <nav className="main-nav">
              <Link to="/home">Home</Link>
              <Link to="/browse">Browse Items</Link>
              <Link to="/my-claims">My Claims</Link>
            </nav>
          </div>
        </header>

        <main className="item-details-content">
          <section className="empty-results">
            <h1>Item Not Found</h1>
            <p>This report may have been deleted or may no longer exist.</p>
            <Link to="/browse" className="home-button">
              Back to Browse Items
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="item-details-page">
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

      <main className="item-details-content">
        <Link to="/browse" className="details-back-link">
          ← Back to Browse Items
        </Link>

        <article className="item-details-card">
          <div className="details-heading">
            <span className={`item-type-badge ${report.itemType}`}>
              {report.itemType === "lost" ? "Lost Item" : "Found Item"}
            </span>
            <span className="details-category">{report.category}</span>
          </div>

          <h1>{report.itemName}</h1>

          <p className="details-description">
            {report.description || "No additional description was provided."}
          </p>

          <div className="details-information">
            <div className="details-information-row">
              <span>Colour</span>
              <strong>{report.colour || "Not specified"}</strong>
            </div>

            <div className="details-information-row">
              <span>Location on campus</span>
              <strong>{report.location}</strong>
            </div>

            <div className="details-information-row">
              <span>Date {report.itemType === "lost" ? "lost" : "found"}</span>
              <strong>{report.date}</strong>
            </div>

            <div className="details-information-row">
              <span>Report status</span>
              <strong>{report.status || "reported"}</strong>
            </div>
          </div>

          {report.itemType === "found" &&
            (report.status || "reported") === "reported" && (
              <section className="claim-form-section">
                <h2>Claim This Item</h2>
                <p>
                  Explain how you can identify this item as yours. Avoid
                  including passwords or other sensitive information.
                </p>

                <form onSubmit={handleClaimSubmit} className="claim-form">
                  <label htmlFor="claimReason">Reason for your claim</label>
                  <textarea
                    id="claimReason"
                    rows="4"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Describe identifying details that can help verify ownership."
                    required
                    minLength={10}
                  />

                  <button type="submit" className="auth-button">
                    Submit Claim
                  </button>

                  {message && (
                    <p className={`claim-message ${messageType}`} role="status">
                      {message}
                    </p>
                  )}
                </form>
              </section>
            )}

          {report.itemType === "lost" && (
            <p className="claim-info">
              This is a lost-item report. You can browse found items to submit a
              claim.
            </p>
          )}

          {(report.status || "reported") !== "reported" && (
            <p className="claim-info">
              This item is marked as {report.status} and is not accepting claims
              in this demonstration.
            </p>
          )}

          <div className="details-actions">
            <Link to="/browse" className="home-button">
              Browse More Items
            </Link>
            <Link to="/my-claims" className="secondary-button">
              View My Claims
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}

export default ItemDetails;
