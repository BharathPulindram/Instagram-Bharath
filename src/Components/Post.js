import React, { useState, useEffect } from "react";
import "./Post.css";
import { Avatar } from "@material-ui/core";
import { db } from "./Firebase";
import firebase from "firebase";

function Posts({ user, postId, imageUrl, caption, username }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        /* .orderBy("timestamp", "desc") */
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      {/*  header -> avatar + username */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          src="https://cdn3.vectorstock.com/i/1000x1000/38/17/male-face-avatar-logo-template-pictogram-vector-11333817.jpg"
          alt="avatar"
        />
        <h3>{username} </h3>
      </div>

      {/* image */}
      <img alt="logoImage" className="post__image" src={imageUrl} />

      {/* username  + caption */}
      <h4 className="post__text">
        {" "}
        <strong>{username} </strong> : {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => {
          return (
            <p>
              <strong>{comment.username} :</strong> {comment.text}
            </p>
          );
        })}
      </div>
      <form className="post__commentBox">
        <input
          className="post__input"
          type="text"
          placeholder="Add Comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={!comment}
          className="post__button"
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Posts;
