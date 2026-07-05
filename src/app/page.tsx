// Visual-verification placeholder (Tasks 3.2–3.3): exercises the semantic
// color tokens, the typography scale, and the score→tier→color utility so a
// glance confirms everything is wired. NOT real UI — replaced in Groups 4–6.
import { scoreToColorClass, scoreToTier } from "@/lib/scoring";

const SAMPLE_SCORES = [95, 78, 60, 40, 20, 5];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-page bg-bg px-6 py-section text-center font-sans text-fg">
      <div className="space-y-2">
        <h1 className="text-display font-bold tracking-tight">Display</h1>
        <h2 className="text-heading font-semibold">Heading</h2>
        <h3 className="text-title font-semibold text-fg-muted">Title</h3>
        <p className="text-body">Body — Inter, dark theme, tokens online.</p>
        <p className="text-caption text-fg-muted">Caption · text-caption</p>
        <p className="text-micro text-fg-subtle">MICRO · text-micro</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-card">
        {SAMPLE_SCORES.map((score) => (
          <span
            key={score}
            className={`rounded-full border border-border bg-surface px-3 py-1 text-micro font-medium ${scoreToColorClass(score)}`}
          >
            {score} · {scoreToTier(score)}
          </span>
        ))}
      </div>

      <a href="#" className="text-caption font-medium text-primary hover:underline">
        primary link
      </a>
    </main>
  );
}
