import { useState, useEffect } from 'react';
import MatrixRain from './components/MatrixRain';
import LinkCard from './components/LinkCard';
import FeedWidget from './components/FeedWidget';
import config from './links.json';
import styles from './App.module.css';

function TypingText({ text, speed = 70 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <span className={done ? styles.cursorBlink : styles.cursor}>█</span>
    </span>
  );
}

function Prompt({ cmd }) {
  const { handle } = config.profile;
  return (
    <div className={styles.promptLine}>
      <span className={styles.promptUser}>{handle}</span>
      <span className={styles.promptAt}>@</span>
      <span className={styles.promptHost}>links</span>
      <span className={styles.promptColon}>:</span>
      <span className={styles.promptPath}>~</span>
      <span className={styles.promptSym}>$</span>
      <span className={styles.promptCmd}>&nbsp;{cmd}</span>
    </div>
  );
}

export default function App() {
  const { profile, links, feeds } = config;

  return (
    <div className={styles.root}>
      <MatrixRain />

      <main className={styles.container}>
        {/* Terminal chrome bar */}
        <div className={styles.terminalBar}>
          <div className={styles.dots}>
            <span className={styles.dot} style={{ background: '#ff5f56' }} />
            <span className={styles.dot} style={{ background: '#ffbd2e' }} />
            <span className={styles.dot} style={{ background: '#27c93f' }} />
          </div>
          <span className={styles.termTitle}>links.sh — {profile.handle}</span>
          <span className={styles.termRight} />
        </div>

        {/* Terminal body */}
        <div className={styles.termBody}>

          {/* whoami */}
          <Prompt cmd="whoami" />
          <div className={styles.whoamiOut}>
            <p className={styles.name}>{profile.name}</p>
            <p className={styles.tagline}>
              <TypingText text={`// ${profile.tagline}`} speed={65} />
            </p>
          </div>

          {/* latest content */}
          {feeds?.length > 0 && (
            <>
              <Prompt cmd="cat ./latest" />
              <div className={styles.feeds}>
                {feeds.map((feed, i) => (
                  <FeedWidget key={feed.id} feed={feed} index={i} />
                ))}
              </div>
            </>
          )}

          {/* links */}
          <Prompt cmd="ls -la ./socials/" />
          <div className={styles.links}>
            {links.map((link, i) => (
              <LinkCard key={link.id} link={link} index={i} />
            ))}
          </div>

          {/* footer */}
          <div className={styles.footer}>
            <span className={styles.green}>✓</span>
            <span className={styles.dimText}>&nbsp;{links.length} entries found</span>
            <span className={styles.sep}>&nbsp;·&nbsp;</span>
            <span className={styles.dimText}>made with</span>
            <span className={styles.green}>&nbsp;&lt;3</span>
            <span className={styles.dimText}>&nbsp;& bun</span>
          </div>
        </div>
      </main>
    </div>
  );
}
