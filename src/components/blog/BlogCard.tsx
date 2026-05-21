import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getProxiedUrl } from '@/lib/url';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  published_at: string;
  created_at: string;
}

export default function BlogCard({ id, title, slug, excerpt, featured_image, published_at, created_at }: BlogCardProps) {
  const date = new Date(published_at || created_at);
  const year = format(date, 'yyyy');
  const dateStr = format(date, 'MMM dd');

  return (
    <div className="card-wrapper group h-full flex flex-col bg-white rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-100">
      {/* Image Section */}
      <Link to={`/blog/${slug}`} className="block relative aspect-video overflow-hidden">
        {featured_image ? (
          <img
            src={getProxiedUrl(featured_image)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="text-4xl">🎒</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Legacy Card Content (Date strip + Text) */}
      <div className="card-body flex flex-1">
        <style>{`
          .card-body {
            display: flex;
            width: 100%;
            background-color: white;
          }

          .date-time-container {
            writing-mode: vertical-lr;
            transform: rotate(180deg);
            padding: 1rem 0.5rem;
            background-color: #f8fafc;
            border-right: 1px solid #f1f5f9;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .date-time {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            color: #334155;
            letter-spacing: 0.1em;
          }

          .separator {
            width: 1px;
            height: 24px;
            background-color: #cbd5e1;
          }

          .content {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
          }

          .infos {
            padding: 1.5rem;
          }

          .title {
            font-weight: 900;
            text-transform: uppercase;
            font-size: 1.1rem;
            line-height: 1.3;
            color: #0f172a;
            text-decoration: none;
            display: block;
            margin-bottom: 0.75rem;
            letter-spacing: -0.02em;
          }

          .description {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            font-size: 0.875rem;
            line-height: 1.6;
            color: #64748b;
            font-weight: 500;
          }

          .action-btn {
            background-color: #fde047;
            padding: 1rem;
            text-align: center;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #0f172a;
            transition: all 0.2s;
          }

          .action-btn:hover {
            background-color: #facc15;
            color: black;
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
              <span className="title group-hover:text-indigo-600 transition-colors">{title}</span>
            </Link>
            <p className="description">{excerpt}</p>
          </div>

          <Link className="action-btn" to={`/blog/${slug}`}>
            Read Article
          </Link>
        </div>
      </div>
    </div>
  );
}
