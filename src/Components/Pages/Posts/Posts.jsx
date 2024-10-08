import { useEffect, useState } from "react";
import "./posts.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";


import {
  fetchPosts,
  deletePost,
  addPost,
  updatePost,
} from "../../../APIs/postsApis";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faAdd } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import UpdatePostModal from "./UpdatePostModal";

function Posts() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postsData.posts);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
  });
  const [currentPost, setCurrentPost] = useState({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    dispatch(fetchPosts())
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading posts, please wait...</p>
      </div>
    );
  }

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId)).finally(() => {
      toast.success("Your post has been deleted successfully");
    });
  };

  const handleAddPost = () => {
    setErrors({ title: "", body: "" });
  
    if (newPost.title.length < 10) {
      setErrors(prev => ({ ...prev, title: "Title must be at least 10 characters." }));
      return;
    }
    if (newPost.title.length > 150) {
      setErrors(prev => ({ ...prev, title: "Title must not exceed 150 characters." }));
      return;
    }
    if (newPost.body.length < 50) {
      setErrors(prev => ({ ...prev, body: "Body must be at least 50 characters." }));
      return;
    }
    if (newPost.body.length > 300) {
      setErrors(prev => ({ ...prev, body: "Body must not exceed 300 characters." }));
      return;
    }
  
    dispatch(addPost(newPost)).finally(() => {
      setNewPost({ title: "", body: "" });
      toast.success("Your post has been added successfully");
    });
  };

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = (post) => {
    setCurrentPost(post);
    setShowModal(true);
  };

  const handleUpdatePost = () => {
    setErrors({ title: "", body: "" });
  
    if (currentPost.title.length < 10) {
      setErrors(prev => ({ ...prev, title: "Title must be at least 10 characters." }));
      return;
    }
    if (currentPost.title.length > 150) {
      setErrors(prev => ({ ...prev, title: "Title must not exceed 150 characters." }));
      return;
    }
    if (currentPost.body.length < 50) {
      setErrors(prev => ({ ...prev, body: "Body must be at least 50 characters." }));
      return;
    }
    if (currentPost.body.length > 300) {
      setErrors(prev => ({ ...prev, body: "Body must not exceed 300 characters." }));
      return;
    }
  
    const updatedPostData = { title: currentPost.title, body: currentPost.body };
    dispatch(updatePost({ id: currentPost.id, updatedData: updatedPostData })).finally(() => {
      handleCloseModal();
      toast.success("Your post has been updated successfully");
    });
  };

  return (
    <>
      <div className="posts-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {posts &&
                posts.map((post) => (
                  <div className="card post-item" key={post.id}>
                    <div className="card-body">
                      <h5>
                      <Link to={`/posts/${post.id}`} className="card post-item" key={post.id}>{post.id} - {post.title}</Link>
                      </h5>
                      <p className="card-text">{post.body}</p>
                      <div className="postControlButtons">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            handleShowModal(post);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Update
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="col-lg-4">
              <div className="add-post-form">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Title"
                  value={newPost.title}
                  onChange={(e) => {
                    setNewPost({ ...newPost, title: e.target.value });
                  }}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Body"
                  rows="4"
                  value={newPost.body}
                  onChange={(e) => {
                    setNewPost({ ...newPost, body: e.target.value });
                  }}
                />
                <button
                  className="btn btn-success"
                  onClick={handleAddPost}
                  disabled={
                    newPost.title.length < 10 ||
                    newPost.title.length > 150 ||
                    newPost.body.length < 50 ||
                    newPost.body.length > 300
                  }
                >
                  <FontAwesomeIcon icon={faAdd} /> Add Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdatePostModal
        handleCloseModal={handleCloseModal}
        showModal={showModal}
        currentPost={currentPost}
        handleChangedData={setCurrentPost}
        handleUpdatePost={handleUpdatePost}
        errors={errors}
      />

      <ToastContainer />
    </>
  );
}

export default Posts;
