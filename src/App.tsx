import { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";

const App = () => {
  const [apiPosts, setApiPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState(() => {
    const storedPosts = localStorage.getItem("posts");
    return storedPosts ? JSON.parse(storedPosts) : [];
  });

  //Fade out popup after sometime
  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      id: Date.now(),
      title,
      userId,
      author,
      body,
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setCurrentPage(1);

    setTitle("");
    setUserId("");
    setAuthor("");
    setBody("");

    setSuccessMessage("Post added successfully!");
  };

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        setApiPosts(data);
        setIsLoading(false);
      });
  }, []);

  const allPosts = [...posts, ...apiPosts];

  const postsPerPage = 10;
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = allPosts.slice(firstPostIndex, lastPostIndex);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  if (isLoading) {
    //I can actually add anything here to show data is loading, like a rolling animation etc
    return (
      <>
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="app">
          <h1 className="page-title">List of posts</h1>
          <h3>Loading Posts ...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="app">
        <h1 className="page-title">List of posts</h1>

        <div className="posts-list">
          {currentPosts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              title={post.title}
              userId={post.userId}
              author={post.author}
              body={post.body}
            />
          ))}
        </div>

        <div className="pagination">
          <button
            className="page-btn"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="page-indicator">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="page-btn"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <div id="form-container" className="form-wrapper">
          <form onSubmit={handleSubmit} className="post-form">
            <h2 className="form-title">Create a Post</h2>

            <label className="form-label">
              <span>Title</span>
              <input
                className="form-input"
                placeholder="Title of post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="form-label">
              <span>Author</span>
              <input
                className="form-input"
                placeholder="Author of post"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </label>

            <label className="form-label">
              <span>UserId</span>
              <input
                className="form-input"
                placeholder="Id of user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </label>

            <label className="form-label">
              <span>Body</span>
              <textarea
                className="form-textarea"
                placeholder="Body of post"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </label>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default App;
