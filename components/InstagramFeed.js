export default function InstagramFeed({ username = 'huma_beauty.saloon', profileUrl, posts = [], embedded = false }) {
  const handle = String(username || '').replace(/^@/, '').trim() || 'huma_beauty.saloon';
  const href = profileUrl || `https://www.instagram.com/${handle}/`;
  const tiles = (posts.length > 0 ? posts : []).slice(0, 6);

  return (
    <div className={`instagram-feed${embedded ? ' instagram-feed--embedded' : ''}`}>
      <div className={`instagram-feed-header${embedded ? ' instagram-feed-header--embedded' : ''}`}>
        {!embedded ? (
          <div className="instagram-feed-copy">
            <div className="section-label">✦ Instagram</div>
            <h3 className="instagram-feed-title">Follow @{handle}</h3>
            <p className="instagram-feed-text">Latest bridal looks, facials & salon highlights — updated on Instagram.</p>
          </div>
        ) : (
          <p className="instagram-feed-handle">@{handle}</p>
        )}
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="instagram-feed-btn"
        >
          View Profile
        </a>
      </div>

      {tiles.length > 0 ? (
        <div className="instagram-feed-grid">
          {tiles.map((post, i) => (
            <a
              key={`${post.image_url}-${i}`}
              href={post.url || href}
              target="_blank"
              rel="noreferrer"
              className="instagram-feed-tile"
              aria-label={post.title || `Instagram post ${i + 1}`}
            >
              <img
                src={post.image_url}
                alt={post.title || `Instagram post ${i + 1}`}
                className="instagram-feed-img"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      ) : null}

      <p className="instagram-feed-note">
        Tap any photo to open our Instagram — new posts appear there first.
      </p>
    </div>
  );
}
