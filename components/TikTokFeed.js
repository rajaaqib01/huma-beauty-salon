const DEFAULT_PROFILE = 'https://www.tiktok.com/@humabeautysaloonjhe';

export default function TikTokFeed({
  username = 'humabeautysaloonjhe',
  profileUrl = DEFAULT_PROFILE,
  posts = [],
}) {
  const handle = String(username || '').replace(/^@/, '').trim() || 'humabeautysaloonjhe';
  const href = profileUrl || `https://www.tiktok.com/@${handle}`;
  const tiles = (posts.length > 0 ? posts : []).slice(0, 6);

  return (
    <div className="tiktok-feed tiktok-feed--embedded">
      <div className="tiktok-feed-header tiktok-feed-header--embedded">
        <p className="tiktok-feed-handle">@{handle}</p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="tiktok-feed-btn"
        >
          View Profile
        </a>
      </div>

      {tiles.length > 0 ? (
        <div className="tiktok-feed-grid">
          {tiles.map((post, i) => (
            <a
              key={`${post.image_url}-${i}`}
              href={post.url || href}
              target="_blank"
              rel="noreferrer"
              className="tiktok-feed-tile"
              aria-label={post.title || `TikTok video ${i + 1}`}
            >
              <img
                src={post.image_url}
                alt={post.title || `TikTok video ${i + 1}`}
                className="tiktok-feed-img"
                loading="lazy"
              />
              <span className="tiktok-feed-play" aria-hidden="true">▶</span>
            </a>
          ))}
        </div>
      ) : null}

      <p className="tiktok-feed-note">
        Tap any video to watch on TikTok — new reels uploaded regularly.
      </p>
    </div>
  );
}
