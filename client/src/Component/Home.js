import "../Styles/Home.css";
import Login from "./Login";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="home">
      {/* Main Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Unlock Your Potential. <span className="accent">Power</span>
        </h1>

        <h1 className="hero-title">
          <span className="accent">UTAS Businesses.</span>
        </h1>

        <p className="hero-text">
          Connect ambitious students with Dhofar companies and ministries for
          flexible, part-time work. Training options are available for
          newcomers.
        </p>
        <Link to="/login">
          <button className="hero-btn">Get Start</button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
