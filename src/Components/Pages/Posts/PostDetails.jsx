import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './PostDetails.css';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      setPost(response.data);
    };

    const fetchComments = async () => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      setComments(response.data);
    };

    fetchPost();
    fetchComments();
  }, [postId]);

  if (!post) return <div className="post-details-loading"><p>Loading Post Details, Please Wait...</p></div>;

  return (
    <div className="post-details">
      <h2>{post.title}</h2>
      <p>{post.body}</p>

      <h3>Comments:</h3>
      <ul className="comments-list">
        {comments.map(comment => (
          <li key={comment.id} className="comment">
            <img src="https://placehold.co/50x50" alt="Commenter Image" />
            <strong className="comment-name">{comment.name} </strong> <span className="comment-email">{comment.email}</span> : <br /> {comment.body}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetails;
