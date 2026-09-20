
import './App.css'

function App() {
  return (
    <>
      <header>
        <h1>Campus Lost & Found</h1>

        <nav>
          <a href="/">Home</a>
          <a href="/browse">Browse Items</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Lost Something? Found Something?</h2>

          <p>
            Campus Lost & Found helps students report, search and recover
            lost items around campus.
          </p>

          <div>
            <button>Report Lost Item</button>
            <button>Report Found Item</button>
          </div>
        </section>

        <section className="features">
          <h2>How It Works</h2>

          <div className="feature-list">

            <div className="feature-card">
              <h3>1. Report</h3>
              <p>
                Report an item you have lost or an item you have found
                on campus.
              </p>
            </div>

            <div className="feature-card">
              <h3>2. Search</h3>
              <p>
                Browse and search through reported lost and found items.
              </p>
            </div>

            <div className="feature-card">
              <h3>3. Match</h3>
              <p>
                Our system can identify possible matches between lost
                and found items.
              </p>
            </div>

            <div className="feature-card">
              <h3>4. Recover</h3>
              <p>
                Submit a claim and work towards getting your item back.
              </p>
            </div>

          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Campus Lost & Found System</p>
      </footer>
    </>
  )
}

export default App

