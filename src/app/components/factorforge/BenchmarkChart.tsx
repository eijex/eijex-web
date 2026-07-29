import {
  HISTORICAL_MEAN_CAI,
  NATIVE_REFERENCE_MEAN_CAI,
} from "../../lib/site-stats";

const bars = [
  {
    name: "FactorForge",
    value: parseFloat(HISTORICAL_MEAN_CAI),
    label: HISTORICAL_MEAN_CAI,
    fill: "fill-teal-500 dark:fill-teal-400",
    text: "fill-teal-700 dark:fill-teal-300",
  },
  {
    name: "Native reference (unoptimized)",
    value: parseFloat(NATIVE_REFERENCE_MEAN_CAI),
    label: NATIVE_REFERENCE_MEAN_CAI,
    fill: "fill-slate-400 dark:fill-slate-500",
    text: "fill-slate-600 dark:fill-slate-300",
  },
];

const CHART_TOP = 16;
const CHART_BOTTOM = 168;
const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP;
const GRIDLINES = [0, 0.25, 0.5, 0.75, 1];
const BAR_WIDTH = 88;
const BAR_GAP = 56;

export default function BenchmarkChart() {
  return (
    <div className="mt-6">
      <svg
        viewBox="0 0 360 220"
        role="img"
        aria-label={`Bar chart: FactorForge mean CAI ${bars[0].label} versus native reference (unoptimized) mean CAI ${bars[1].label}, same corpus.`}
        className="w-full max-w-md"
      >
        {GRIDLINES.map((g) => {
          const y = CHART_BOTTOM - g * CHART_HEIGHT;
          return (
            <g key={g}>
              <line
                x1={40}
                x2={340}
                y1={y}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth={1}
              />
              <text
                x={32}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
              >
                {g.toFixed(2)}
              </text>
            </g>
          );
        })}

        {bars.map((bar, i) => {
          const x = 72 + i * (BAR_WIDTH + BAR_GAP);
          const barHeight = bar.value * CHART_HEIGHT;
          const y = CHART_BOTTOM - barHeight;
          return (
            <g key={bar.name}>
              <title>{`${bar.name}: mean CAI ${bar.label}`}</title>
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={barHeight}
                rx={4}
                className={bar.fill}
              />
              <text
                x={x + BAR_WIDTH / 2}
                y={y - 10}
                textAnchor="middle"
                className={`text-lg font-extrabold ${bar.text}`}
              >
                {bar.label}
              </text>
              <text
                x={x + BAR_WIDTH / 2}
                y={CHART_BOTTOM + 20}
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400 text-[11px] font-semibold"
              >
                {bar.name}
              </text>
            </g>
          );
        })}

        <line x1={40} x2={340} y1={CHART_BOTTOM} y2={CHART_BOTTOM} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1} />
      </svg>

      <table className="sr-only">
        <caption>Mean CAI by reference, same corpus (n=49,257 CDS)</caption>
        <thead>
          <tr>
            <th scope="col">Reference</th>
            <th scope="col">Mean CAI</th>
          </tr>
        </thead>
        <tbody>
          {bars.map((bar) => (
            <tr key={bar.name}>
              <th scope="row">{bar.name}</th>
              <td>{bar.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
