
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ItemDetails() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [submitting, setSubmitting] = useState(false);

  // Fetch the selected item from MySQL through Flask
  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      setFetchError("");

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/items/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load this item.");
        }

        setReport(data);
      } catch (error) {
        console.error("Error loading item:", error);
        setFetchError(
          error.message || "Could not connect to the server."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  // Submit the claim to Flask, which saves it in MySQL
  async function handleClaimSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("error");

    if (!report) {
      setMessage("Item details are not available.");
      return;
    }

    const userId = localStorage.getItem("user_id");

    if (!userId || !Number.isInteger(Number(userId))) {
      setMessage("Please log in before submitting a claim.");
      return;
    }

    if (report.item_type !== "found") {
      setMessage("You can only submit a claim for a found item.");
      return;
    }

    if ((report.status || "reported") !== "reported") {
      setMessage("This item is no longer available for claims.");
      return;
    }

    if (reason.trim().length < 10) {
      setMessage("Please provide at least 10 characters explaining your claim.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/claims",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            item_id: Number(report.item_id),
            claim_description: reason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit your claim."
        );
      }

      setReason("");
      setMessage(
        `Claim submitted successfully! Your claim ID is ${data.claim_id}. Status: pending review.`
      );
      setMessageType("success");
    } catch (error) {
      console.error("Error submitting claim:", error);
      setMessage(
        error.message || "Could not connect to the server."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  const itemDate = report?.date_lost_found
    ? String(report.date_lost_found).slice(0, 10)
    : "Not specified";

  const itemStatus = report?.status || "reported";

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

        {loading ? (
          <section className="empty-results">
            <h1>Loading Item...</h1>
            <p>Please wait while we retrieve the report.</p>
          </section>
        ) : fetchError || !report ? (
          <section className="empty-results">
            <h1>Item Not Found</h1>
            <p>
              {fetchError ||
                "This report may have been deleted or may no longer exist."}
            </p>
            <Link to="/browse" className="home-button">
              Back to Browse Items
            </Link>
          </section>
        ) : (
          <article className="item-details-card">
            <div className="details-heading">
              <span className={`item-type-badge ${report.item_type}`}>
                {report.item_type === "lost" ? "Lost Item" : "Found Item"}
              </span>

              <span className="details-category">
                {report.category}
              </span>
            </div>

            <h1>{report.item_name}</h1>

            <p className="details-description">
              {report.description ||
                "No additional description was provided."}
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
                <span>
                  Date {report.item_type === "lost" ? "lost" : "found"}
                </span>
                <strong>{itemDate}</strong>
              </div>

              <div className="details-information-row">
                <span>Report status</span>
                <strong>{itemStatus}</strong>
              </div>
            </div>

            {report.item_type === "found" &&
              itemStatus === "reported" && (
                <section className="claim-form-section">
                  <h2>Claim This Item</h2>

                  <p>
                    Explain how you can identify this item as yours.
                    Avoid including passwords or other sensitive information.
                  </p>

                  <form
                    onSubmit={handleClaimSubmit}
                    className="claim-form"
                  >
                    <label htmlFor="claimReason">
                      Reason for your claim
                    </label>

                    <textarea
                      id="claimReason"
                      rows="4"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      placeholder="Describe identifying details that can help verify ownership."
                      required
                      minLength={10}
                      disabled={submitting}
                    />

                    <button
                      type="submit"
                      className="auth-button"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Claim"}
                    </button>

                    {message && (
                      <p
                        className={`claim-message ${messageType}`}
                        role="status"
                      >
                        {message}
                      </p>
                    )}
                  </form>
                </section>
              )}

            {report.item_type === "lost" && (
              <p className="claim-info">
                This is a lost-item report. Browse found items to find an
                item you may be able to claim.
              </p>
            )}

            {itemStatus !== "reported" && (
              <p className="claim-info">
                This item is marked as {itemStatus} and is not accepting
                claims.
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
        )}
      </main>
    </div>
  );
}

export default ItemDetails;
