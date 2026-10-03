import {
  SAMPLE_AVATAR,
  SAMPLE_HEIGHT,
  SAMPLE_HERO,
  SAMPLE_LIST,
  SAMPLE_MEALS,
  SAMPLE_NAV,
  SAMPLE_STATS,
  SAMPLE_WIDTH,
} from "@/lib/sample-content"
import { previewTokens, type PreviewKind } from "@/lib/moods"
import styles from "./SampleScreen.module.css"

/**
 * The built-in sample screen. One content tree, five looks: "original" is the plain starting point,
 * the four moods recompose it (layout, type, shape and colour) via data-mood in the stylesheet.
 * Purely visual, so it's exposed to assistive tech as a single labelled image.
 */
export function SampleScreen({
  kind,
  intensity,
  label,
}: {
  kind: PreviewKind
  intensity: number
  label: string
}) {
  return (
    <div
      className={styles.screen}
      data-mood={kind}
      role="img"
      aria-label={label}
      style={{ width: SAMPLE_WIDTH, height: SAMPLE_HEIGHT, ...previewTokens(kind, intensity) }}
    >
      <header className={styles.top}>
        <span className={styles.brand}>Larder</span>
        <nav className={styles.nav}>
          {SAMPLE_NAV.map((item, i) => (
            <span key={item} className={styles.navItem} data-on={i === 0 || undefined}>
              {item}
            </span>
          ))}
        </nav>
        <span className={styles.avatar}>{SAMPLE_AVATAR}</span>
      </header>

      <div className={styles.body}>
        <section className={styles.hero}>
          <p className={styles.kicker}>{SAMPLE_HERO.kicker}</p>
          <h2 className={styles.title}>{SAMPLE_HERO.title}</h2>
          <p className={styles.lede}>{SAMPLE_HERO.lede}</p>
          <div className={styles.actions}>
            <span className={`${styles.btn} ${styles.btnPrimary}`}>{SAMPLE_HERO.primary}</span>
            <span className={`${styles.btn} ${styles.btnGhost}`}>{SAMPLE_HERO.secondary}</span>
          </div>
        </section>

        <section className={styles.stats}>
          {SAMPLE_STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.num}>{s.value}</span>
              <span className={styles.lab}>{s.label}</span>
            </div>
          ))}
        </section>

        <ol className={styles.meals}>
          {SAMPLE_MEALS.map((m) => (
            <li key={m.day} className={styles.meal}>
              <span className={styles.day}>{m.day}</span>
              <span className={styles.mealMain}>
                <span className={styles.mealName}>{m.name}</span>
                <span className={styles.mealMeta}>{m.meta}</span>
              </span>
              <span className={styles.tag}>{m.tag}</span>
            </li>
          ))}
        </ol>

        <aside className={styles.side}>
          <h3 className={styles.sideTitle}>{SAMPLE_LIST.title}</h3>
          <ul className={styles.sideList}>
            {SAMPLE_LIST.items.map((item) => (
              <li key={item} className={styles.sideItem}>
                {item}
              </li>
            ))}
          </ul>
          <span className={styles.sideLink}>{SAMPLE_LIST.link} →</span>
        </aside>
      </div>
    </div>
  )
}
