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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("success");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const userId = Number(localStorage.getItem("user_id"));

    if (!userId || userId <= 0) {
      setMessageType("error");
      setMessage("Please log in again before reporting an item.");
      setLoading(false);
      return;
    }

    const report = {
      user_id: userId,
      item_name: itemName.trim(),
      category,
      colour: colour.trim(),
      location: location.trim(),
      date_lost_found: date,
      description: description.trim(),
      item_type: itemType,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit the report.");
      }

      setMessageType("success");
      setMessage("Your report has been saved successfully!");

      setItemName("");
      setCategory("");
      setColour("");
      setLocation("");
      setDate("");
      setDescription("");
     

      event.target.reset();
    } catch (error) {
      setMessageType("error");
      setMessage(
        error.message || "Could not connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
           
          />

          <p className="notification">
            Photo upload is not connected yet. The report will be saved without
            the image.
          </p>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>

          {message && (
            <p className={`notification ${messageType}`} role="status">
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
