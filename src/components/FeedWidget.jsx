import { useState, useEffect } from 'react';
import styles from './FeedWidget.module.css';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 30)  return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

async function fetchYouTube(channelId) {
  // /api/yt-feed is proxied to youtube.com by Vite (dev) and nginx (prod)
  const res = await fetch(`/api/yt-feed?channel_id=${channelId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();

  const doc   = new DOMParser().parseFromString(xml, 'text/xml');
  const entry = doc.querySelector('entry');
  if (!entry) throw new Error('no videos in feed — check channelId');

  const title     = entry.querySelector('title')?.textContent?.trim();
  const link      = entry.querySelector('link[rel="alternate"]')?.getAttribute('href');
  const published = entry.querySelector('published')?.textContent;

  // yt:videoId lives in the yt namespace — safest to extract from the link
  const videoId = link ? new URL(link).searchParams.get('v') : null;

  return {
    title,
    url:   link,
    date:  published,
    thumb: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null,
  };
}

async function fetchWordPress(apiUrl) {
  const res = await fetch(
    `${apiUrl}?per_page=1&_fields=id,title,link,date_gmt&orderby=date&order=desc`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const [post] = await res.json();
  if (!post) throw new Error('no posts');
  return {
    title: post.title.rendered.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c)),
    url:   post.link,
    date:  post.date_gmt + 'Z', // append Z so JS parses it as UTC, not local time
    thumb: null,
  };
}

export default function FeedWidget({ feed, index }) {
  const [state,  setState]  = useState('loading'); // loading | ok | error
  const [item,   setItem]   = useState(null);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let result;
        if (feed.type === 'youtube')        result = await fetchYouTube(feed.channelId);
        else if (feed.type === 'wordpress') result = await fetchWordPress(feed.apiUrl);
        if (!cancelled) { setItem(result); setState('ok'); }
      } catch (e) {
        console.error(`[FeedWidget:${feed.id}]`, e.message);
        if (!cancelled) { setErrMsg(e.message); setState('error'); }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [feed]);

  return (
    <a
      href={item?.url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.widget} ${state === 'ok' ? styles.ready : ''}`}
      style={{ '--delay': `${index * 120 + 400}ms` }}
      tabIndex={state !== 'ok' ? -1 : undefined}
    >
      <span className={styles.label}>// {feed.label}</span>

      {state === 'loading' && (
        <span className={styles.skeleton}>
          <span className={styles.skeletonLine} style={{ width: '70%' }} />
          <span className={styles.skeletonLine} style={{ width: '30%' }} />
        </span>
      )}

      {state === 'error' && (
        <span className={styles.error}>
          could not fetch
          {errMsg && <span className={styles.errDetail}> — {errMsg}</span>}
        </span>
      )}

      {state === 'ok' && item && (
        <span className={styles.content}>
          {item.thumb && (
            <img src={item.thumb} alt="" className={styles.thumb} loading="lazy" />
          )}
          <span className={styles.meta}>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.date}>{timeAgo(item.date)}</span>
          </span>
          <span className={styles.arrow}>→</span>
        </span>
      )}
    </a>
  );
}
