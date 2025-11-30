import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { likePost, dislikePost, fetchPosts } from "../Features/PostSlice";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "../Styles/PostsGrid.css";

const Posts = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.users);

  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch posts
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Like handler
  const handleLike = (id) => {
    if (!user) {
      alert("Please login to like this post.");
      return;
    }
    dispatch(likePost({ postId: id, userId: user?.email }));
  };

  // Dislike handler
  const handleDislike = (id) => {
    if (!user) {
      alert("Please login to dislike this post.");
      return;
    }
    dispatch(dislikePost({ postId: id, userId: user?.email }));
  };

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [posts.length]);

  return (
    <div className="carousel-wrapper">
      {/* SLIDER TRACK */}
      <div
        className="carousel-track"
        ref={carouselRef}
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {posts.map((post) => {
          const isCompany = post.role === "company";

          const profileImg = post.profileImage
            ? post.profileImage
            : isCompany
            ? "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

          return (
            <div className="post-card" key={post._id}>
              {/* HEADER */}
              <div className="post-header">
                <div className="profile-box">
                  <img src={profileImg} className="profile-img" alt="dp" />

                  <div>
                    <p className="profile-name">
                      {post.name ? post.name : "Anonymous"}
                    </p>

                    <p className="post-time">
                      {moment(post.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>

              {/* MESSAGE */}
              <p className="message">{post.postMsg}</p>

              {/* LOCATION (ONLY IF BOTH EXIST) */}
              {post.location?.country && post.location?.region ? (
                <p className="location">
                  📍 {post.location.country}, {post.location.region}
                </p>
              ) : (
                <p className="location" style={{ visibility: "hidden" }}>.</p>
              )}

              {/* LIKE / DISLIKE */}
              <div className="actions">
                {/* LIKE */}
                <span
                  className="act-btn"
                  onClick={() => handleLike(post._id)}
                >
                  <FaThumbsUp /> ({post.likes.count})
                </span>

                {/* DISLIKE */}
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

      {/* DOTS */}
      <div className="carousel-dots">
        {posts.map((_, idx) => (
          <span
            key={idx}
            className={idx === activeIndex ? "active" : ""}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Posts;
