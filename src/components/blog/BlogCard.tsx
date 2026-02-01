import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  created_at: string;
}

export default function BlogCard({ id, title, slug, excerpt, published_at, created_at }: BlogCardProps) {
  const date = new Date(published_at || created_at);
  const year = format(date, 'yyyy');
  const dateStr = format(date, 'MMM dd');

  return (
    <div className="card">
      <style>{`
.card {
  box-sizing: border-box;
  display: flex;
  max-width: 320px;
  height: 280px;
  background-color: rgba(255, 255, 255, 1);
  transition: all .15s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.081);
}

.date-time-container {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  padding: 0.5rem;
}

.date-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 1rem;
  gap: 1rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 1);
}

.separator {
  width: 1px;
  flex: 1 1 0%;
  background-color: rgba(17, 24, 39, 0.1);
}

.content {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: space-between;
}

.infos {
  border-left: 1px solid rgba(17, 24, 39, 0.1);
  padding: 1rem;
}

.title {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 18.72px;
  color: rgba(17, 24, 39, 1);
  text-decoration: none;
  display: inline-block;
  transition: color 0.2s;
}

.title:hover {
  color: rgba(79, 70, 229, 1);
}

.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(55, 65, 81, 1);
}

.action {
  display: block;
  background-color: rgba(253, 224, 71, 1);
  padding: 0.75rem 1.25rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 1);
  transition: all .15s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.action:hover {
  background-color: rgba(250, 204, 21, 1);
}
      `}</style>

      <div className="date-time-container">
        <time className="date-time" dateTime={format(date, 'yyyy-MM-dd')}>
          <span>{year}</span>
          <span className="separator"></span>
          <span>{dateStr}</span>
        </time>
      </div>

      <div className="content">
        <div className="infos">
          <Link to={`/blog/${slug}`}>
            <span className="title">{title}</span>
          </Link>

          <p className="description">{excerpt}</p>
        </div>

        <Link className="action" to={`/blog/${slug}`}>
          Read Blog
        </Link>
      </div>
    </div>
  );
}
