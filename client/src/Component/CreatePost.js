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

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleLike = (id) => {
    if (!user) return alert("Please login first.");
    dispatch(likePost({ postId: id, userId: user.email }));
  };

  const handleDislike = (id) => {
    if (!user) return alert("Please login first.");
    dispatch(dislikePost({ postId: id, userId: user.email }));
  };

  return (
    <div className="carousel-wrapper">
      <div
        className="carousel-track"
        ref={carouselRef}
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {posts.map((post) => {
          const profileImg =
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";

          return (
            <div className="post-card" key={post._id}>
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

              <p className="message">{post.postMsg}</p>

              <div className="actions">
                <span className="act-btn" onClick={() => handleLike(post._id)}>
                  <FaThumbsUp /> ({post.likes.count})
                </span>

                <span className="act-btn" onClick={() => handleDislike(post._id)}>
                  <FaThumbsDown /> ({post.dislikes.count})
                </span>
              </div>
            </div>
          );
        })}
      </div>

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

export default Posts;
