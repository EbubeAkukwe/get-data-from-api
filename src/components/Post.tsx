type postType = {
  id: number;
  title: string;
  userId: number;
  author?: string; //optional to say the author
  body: string;
};

const Post = ({ id, userId, author, title, body }: postType) => {
  return (
    <div className="post-card">
      <p className="post-title">
        <span className="label">Title:</span> {title}
      </p>
      <p className="post-author">
        <span className="label">Author:</span> {author || userId}
      </p>
      <p className="post-body">
        <span className="label">Body:</span> {body}
      </p>
    </div>
  );
};

export default Post;
