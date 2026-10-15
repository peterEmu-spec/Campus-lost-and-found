import { useState } from "react";
import { Link } from "react-router-dom";

function Browse() {
  const [reports] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("campusReports") || "[]");
    } catch {
      return [];
    }
  });

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports.filter((report) => {
    const matchesType = filterType === "all" || report.itemType === filterType;

    const matchesCategory =
      filterCategory === "all" || report.category === filterCategory;

    const searchText = [
      report.itemName,
      report.category,
      report.colour,
      report.location,
      report.description,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="browse-page">
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
          </nav>
        </div>
      </header>

      <main className="browse-content">
        <section className="browse-heading">
          <h1>Browse Lost &amp; Found Items</h1>
          <p>
            Search reported items to see whether someone has found what you lost
            or reported an item you found.
          </p>
        </section>

        <section className="browse-filters">
          <input
            type="search"
            placeholder="Search by item, colour, or location..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search reported items"
          />

          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
            aria-label="Filter by report type"
          >
            <option value="all">All reports</option>
            <option value="lost">Lost items</option>
            <option value="found">Found items</option>
          </select>

          <select
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Bags">Bags</option>
            <option value="Clothing">Clothing</option>
            <option value="Books and Stationery">Books and Stationery</option>
            <option value="Identity Cards">Identity Cards</option>
            <option value="Keys">Keys</option>
            <option value="Accessories">Accessories</option>
            <option value="Other">Other</option>
          </select>
        </section>

        <div className="browse-results-heading">
          <h2>Reported Items</h2>
          <span>{filteredReports.length} found</span>
        </div>

        {filteredReports.length > 0 ? (
          <section className="items-grid">
            {filteredReports.map((report, index) => (
              <article
                className="item-card"
                key={`${report.itemName}-${index}`}
              >
                <div className="item-card-top">
                  <span className={`item-type-badge ${report.itemType}`}>
                    {report.itemType === "lost" ? "Lost Item" : "Found Item"}
                  </span>
                  <span className="item-category">{report.category}</span>
                </div>

                <h3>{report.itemName}</h3>

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
                <Link to={`/items/${index}`} className="item-details-link">
                  View Details →
                </Link>
              </article>
            ))}
          </section>
        ) : (
          <section className="empty-results">
            <h3>No items found</h3>
            <p>
              There are no reports matching your search. Try another filter or
              report an item.
            </p>
            <Link to="/report?type=lost" className="home-button">
              Report a Lost Item
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

export default Browse;
