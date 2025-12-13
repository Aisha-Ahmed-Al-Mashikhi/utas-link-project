// Import React and hooks
import React, { useEffect, useRef, useState } from "react";
// Import moment for date formatting
import moment from "moment";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import post actions
import { likePost, dislikePost, fetchPosts } from "../Features/PostSlice";
// Import icons
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
// Import styles
import "../Styles/PostsGrid.css";

// Define Posts component
const Posts = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Get posts from Redux
  const { posts } = useSelector((state) => state.posts);
  // Get user from Redux
  const { user } = useSelector((state) => state.users);

  // Reference for carousel
  const carouselRef = useRef(null);
  // Track active slide
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch posts on load
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Handle like action
  const handleLike = (id) => {
    if (!user) return alert("Please login first.");
    dispatch(likePost({ postId: id, userId: user.email }));
  };

  // Handle dislike action
  const handleDislike = (id) => {
    if (!user) return alert("Please login first.");
    dispatch(dislikePost({ postId: id, userId: user.email }));
  };

  // Return JSX
  return (
    // Carousel wrapper
    <div className="carousel-wrapper">
      {/* Carousel track */}
      <div
        className="carousel-track"
        ref={carouselRef}
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {/* Loop through posts */}
        {posts.map((post) => {
          // Default profile image
          const profileImg =
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";

          // Extract country
          const country = post.location?.country || "—";
          // Extract region
          const region = post.location?.region || "—";

          return (
            // Single post card
            <div className="post-card" key={post._id}>
              {/* Post header */}
              <div className="post-header">
                <div className="profile-box">
                  <img src={profileImg} className="profile-img" alt="dp" />
                  <div>
                    <p className="profile-name">
                      {post.authorName ? post.authorName : "Anonymous"}
                    </p>
                    <p className="post-time">
                      {moment(post.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post message */}
              <p className="message">{post.postMsg}</p>

              {/* Post location */}
              <p className="location">
                {country}, {region}
              </p>

              {/* Action buttons */}
              <div className="actions">
                <span className="act-btn" onClick={() => handleLike(post._id)}>
                  <FaThumbsUp /> ({post.likes.count})
                </span>

                <span
                  className="act-btn"
                  onClick={() => handleDislike(post._id)}
                >
                  <FaThumbsDown /> ({post.dislikes.count})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel dots */}
      <div className="carousel-dots">
        {posts.map((_, idx) => (
          <span
            key={idx}
            className={idx === activeIndex ? "active" : ""}
            onClick={() => setActiveIndex(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

// Export Posts component
export default Posts;
