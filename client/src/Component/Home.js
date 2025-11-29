import "../Styles/Home.css";
import { Link } from "react-router-dom";
import Posts from "./Posts";

const Home = () => {
  return (
    <div className="home">
      {/* ------------ HERO SECTION ------------ */}
      <section className="hero">
        <h1 className="hero-title">
          Unlock Your Potential. <span className="accent">Power</span>
        </h1>

        <h1 className="hero-title">
          <span className="accent">UTAS Businesses.</span>
        </h1>

        <p className="hero-text">
          Connecting ambitious students with Dhofar companies and ministries
          to access flexible, part-time work opportunities.
        </p>

        <Link to="/login">
          <button className="hero-btn">Get Start</button>
        </Link>
      </section>

      {/* ------------ POSTS BOX SECTION ------------ */}
      <section className="posts-container">
        <h2 className="section-title">Recent Posts</h2>
        <Posts />
      </section>
    </div>
  );
};

export default Home;
