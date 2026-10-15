import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function ReportItem() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "found" ? "found" : "lost";

  const [itemType, setItemType] = useState(initialType);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [colour, setColour] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const report = {
      itemType,
      itemName,
      category,
      colour,
      location,
      date,
      description,
      photoName: photo ? photo.name : "",
    };

    // Temporary: save the report in the browser for demonstration.
    const existingReports = JSON.parse(
      localStorage.getItem("campusReports") || "[]",
    );

    existingReports.push(report);
    localStorage.setItem("campusReports", JSON.stringify(existingReports));

    setMessage("Your report has been saved in this browser for now.");
    setItemName("");
    setCategory("");
    setColour("");
    setLocation("");
    setDate("");
    setDescription("");
    setPhoto(null);
    event.target.reset();
  }

  return (
    <div className="placeholder-page">
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

      <main className="placeholder-content report-content">
        <h1>Report an Item</h1>
        <p>
          Provide the details below to report an item lost on campus or an item
          you have found.
        </p>

        <form className="auth-form report-form" onSubmit={handleSubmit}>
          <label htmlFor="itemType">Report type</label>
          <select
            id="itemType"
            value={itemType}
            onChange={(event) => setItemType(event.target.value)}
            required
          >
            <option value="lost">I lost an item</option>
            <option value="found">I found an item</option>
          </select>

          <label htmlFor="itemName">Item name</label>
          <input
            id="itemName"
            type="text"
            placeholder="e.g. Black backpack"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            required
          />

          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Bags">Bags</option>
            <option value="Clothing">Clothing</option>
            <option value="Books and Stationery">Books and Stationery</option>
            <option value="Identity Cards">Identity Cards</option>
            <option value="Keys">Keys</option>
            <option value="Accessories">Accessories</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="colour">Colour</label>
          <input
            id="colour"
            type="text"
            placeholder="e.g. Black"
            value={colour}
            onChange={(event) => setColour(event.target.value)}
          />

          <label htmlFor="location">Location on campus</label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Library, Block A"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />

          <label htmlFor="date">
            Date {itemType === "lost" ? "lost" : "found"}
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Describe the item and any details that may help identify it."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <label htmlFor="photo">Photo (optional)</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(event) => setPhoto(event.target.files[0] || null)}
          />

          <button type="submit" className="auth-button">
            Submit Report
          </button>

          {message && (
            <p className="notification success" role="status">
              {message}
            </p>
          )}
        </form>

        <p className="back-link">
          <Link to="/home">← Back to Home</Link>
        </p>
      </main>
    </div>
  );
}

export default ReportItem;
