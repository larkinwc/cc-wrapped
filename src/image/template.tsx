import type { ClaudeCodeStats, WeekdayActivity } from "../types";
import { formatNumberFull, formatCostFull, formatDate } from "../utils/format";
import { ActivityHeatmap } from "./heatmap";
import { colors, typography, spacing, layout, components } from "./design-tokens";

// Embedded Claude Code logo SVG
const CLAUDE_LOGO_SVG = `<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><g id="g314"><path id="path147" fill="#d97757" stroke="none" d="M 233.959793 800.214905 L 468.644287 668.536987 L 472.590637 657.100647 L 468.644287 650.738403 L 457.208069 650.738403 L 417.986633 648.322144 L 283.892639 644.69812 L 167.597321 639.865845 L 54.926208 633.825623 L 26.577238 627.785339 L 3.3e-05 592.751709 L 2.73832 575.27533 L 26.577238 559.248352 L 60.724873 562.228149 L 136.187973 567.382629 L 249.422867 575.194763 L 331.570496 580.026978 L 453.261841 592.671082 L 472.590637 592.671082 L 475.328857 584.859009 L 468.724915 580.026978 L 463.570557 575.194763 L 346.389313 495.785217 L 219.543671 411.865906 L 153.100723 363.543762 L 117.181267 339.060425 L 99.060455 316.107361 L 91.248367 266.01355 L 123.865784 230.093994 L 167.677887 233.073853 L 178.872513 236.053772 L 223.248367 270.201477 L 318.040283 343.570496 L 441.825592 434.738342 L 459.946411 449.798706 L 467.194672 444.64447 L 468.080597 441.020203 L 459.946411 427.409485 L 392.617493 305.718323 L 320.778564 181.932983 L 288.80542 130.630859 L 280.348999 99.865845 C 277.369171 87.221436 275.194641 76.590698 275.194641 63.624268 L 312.322174 13.20813 L 332.8591 6.604126 L 382.389313 13.20813 L 403.248352 31.328979 L 434.013519 101.71814 L 483.865753 212.537048 L 561.181274 363.221497 L 583.812134 407.919434 L 595.892639 449.315491 L 600.40271 461.959839 L 608.214783 461.959839 L 608.214783 454.711609 L 614.577271 369.825623 L 626.335632 265.61084 L 637.771851 131.516846 L 641.718201 93.745117 L 660.402832 48.483276 L 697.530334 24.000122 L 726.52356 37.852417 L 750.362549 72 L 747.060486 94.067139 L 732.886047 186.201416 L 705.100708 330.52356 L 686.979919 427.167847 L 697.530334 427.167847 L 709.61084 415.087341 L 758.496704 350.174561 L 840.644348 247.490051 L 876.885925 206.738342 L 919.167847 161.71814 L 946.308838 140.29541 L 997.61084 140.29541 L 1035.38269 196.429626 L 1018.469849 254.416199 L 965.637634 321.422852 L 921.825562 378.201538 L 859.006714 462.765259 L 819.785278 530.41626 L 823.409424 535.812073 L 832.75177 534.92627 L 974.657776 504.724915 L 1051.328979 490.872559 L 1142.818848 475.167786 L 1184.214844 494.496582 L 1188.724854 514.147644 L 1172.456421 554.335693 L 1074.604126 578.496765 L 959.838989 601.449829 L 788.939636 641.879272 L 786.845764 643.409485 L 789.261841 646.389343 L 866.255127 653.637634 L 899.194702 655.409424 L 979.812134 655.409424 L 1129.932861 666.604187 L 1169.154419 692.537109 L 1192.671265 724.268677 L 1188.724854 748.429688 L 1128.322144 779.194641 L 1046.818848 759.865845 L 856.590759 714.604126 L 791.355774 698.335754 L 782.335693 698.335754 L 782.335693 703.731567 L 836.69812 756.885986 L 936.322205 846.845581 L 1061.073975 962.81897 L 1067.436279 991.490112 L 1051.409424 1014.120911 L 1034.496704 1011.704712 L 924.885986 929.234924 L 882.604126 892.107544 L 786.845764 811.48999 L 780.483276 811.48999 L 780.483276 819.946289 L 802.550415 852.241699 L 919.087341 1027.409424 L 925.127625 1081.127686 L 916.671204 1098.604126 L 886.469849 1109.154419 L 853.288696 1103.114136 L 785.073914 1007.355835 L 714.684631 899.516785 L 657.906067 802.872498 L 650.979858 806.81897 L 617.476624 1167.704834 L 601.771851 1186.147705 L 565.530212 1200 L 535.328857 1177.046997 L 519.302124 1139.919556 L 535.328857 1066.550537 L 554.657776 970.792053 L 570.362488 894.68457 L 584.536926 800.134277 L 592.993347 768.724976 L 592.429626 766.630859 L 585.503479 767.516968 L 514.22821 865.369263 L 405.825531 1011.865906 L 320.053711 1103.677979 L 299.516815 1111.812256 L 263.919525 1093.369263 L 267.221497 1060.429688 L 287.114136 1031.114136 L 405.825531 880.107361 L 477.422913 786.52356 L 523.651062 732.483276 L 523.328918 724.671265 L 520.590698 724.671265 L 205.288605 929.395935 L 149.154434 936.644409 L 124.993355 914.01355 L 127.973183 876.885986 L 139.409409 864.80542 L 234.201385 799.570435 L 233.879227 799.8927 Z"/></g></svg>`;
const CLAUDE_LOGO_DATA_URL = `data:image/svg+xml;base64,${Buffer.from(CLAUDE_LOGO_SVG).toString("base64")}`;

export function WrappedTemplate({ stats }: { stats: ClaudeCodeStats }) {
  return (
    <div
      style={{
        width: layout.canvas.width,
        height: layout.canvas.height,
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.background,
        color: colors.text.primary,
        fontFamily: typography.fontFamily.mono,
        paddingLeft: layout.padding.horizontal,
        paddingRight: layout.padding.horizontal,
        paddingTop: layout.padding.top,
        paddingBottom: layout.padding.bottom,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -180,
          right: -120,
          width: 520,
          height: 520,
          backgroundColor: colors.accent.primary,
          opacity: 0.12,
          borderRadius: layout.radius.full,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -220,
          left: -140,
          width: 620,
          height: 620,
          backgroundColor: colors.accent.secondary,
          opacity: 0.12,
          borderRadius: layout.radius.full,
        }}
      />
      <Header year={stats.year} />

      <div style={{ marginTop: spacing[8], display: "flex", flexDirection: "row", gap: spacing[16], alignItems: "flex-start" }}>
        <HeroStatItem
          label="Started"
          subtitle={formatDate(stats.firstSessionDate)}
          value={`${stats.daysSinceFirstSession} Days Ago`}
        />
        <HeroStatItem
          label="Most Active Day"
          subtitle={stats.weekdayActivity.mostActiveDayName}
          value={stats.mostActiveDay?.formattedDate ?? "N/A"}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: colors.surface,
            borderRadius: layout.radius.lg,
            padding: spacing[8],
            border: `1px solid ${colors.surfaceBorder}`,
          }}
        >
          <span
            style={{
              fontSize: components.sectionHeader.fontSize,
              fontWeight: components.sectionHeader.fontWeight,
              color: components.sectionHeader.color,
              letterSpacing: components.sectionHeader.letterSpacing,
              textTransform: components.sectionHeader.textTransform,
            }}
          >
            Weekly
          </span>
          <WeeklyBarChart weekdayActivity={stats.weekdayActivity} />
        </div>
      </div>

      <Section title="Activity" marginTop={spacing[8]}>
        <ActivityHeatmap dailyActivity={stats.dailyActivity} year={stats.year} maxStreakDays={stats.maxStreakDays} />
      </Section>

      <div
        style={{
          marginTop: spacing[8],
          display: "flex",
          flexDirection: "row",
          gap: spacing[16],
        }}
      >
        <RankingList
          title="Top Models"
          items={stats.topModels.map((m) => ({
            name: m.name,
          }))}
        />
        <InsightCard stats={stats} />
      </div>

      <StatsGrid stats={stats} />
      <Footer />
    </div>
  );
}

function Header({ year }: { year: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing[2],
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: spacing[8],
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: spacing[4] }}>
          <img
            src={CLAUDE_LOGO_DATA_URL}
            height={72}
            style={{
              objectFit: "contain",
            }}
          />
          <span
            style={{
              fontSize: typography.size["6xl"],
              fontWeight: typography.weight.bold,
              letterSpacing: typography.letterSpacing.tight,
              color: colors.text.primary,
              lineHeight: typography.lineHeight.none,
            }}
          >
            Claude Code
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: spacing[2],
            textAlign: "right",
          }}
        >
          <span
            style={{
              fontSize: typography.size["3xl"],
              fontWeight: typography.weight.medium,
              letterSpacing: typography.letterSpacing.normal,
              color: colors.text.tertiary,
              lineHeight: typography.lineHeight.none,
            }}
          >
            wrapped
          </span>
          <span
            style={{
              fontSize: typography.size["3xl"],
              fontWeight: typography.weight.bold,
              letterSpacing: typography.letterSpacing.normal,
              color: colors.accent.primary,
              lineHeight: typography.lineHeight.none,
            }}
          >
            {year}
          </span>
        </div>
      </div>
    </div>
  );
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const BAR_HEIGHT = 100;
const BAR_WIDTH = 56;
const BAR_GAP = 12;

const HERO_STAT_CONTENT_HEIGHT = BAR_HEIGHT + spacing[2] + 50;

function HeroStatItem({ label, subtitle, value }: { label: string; subtitle?: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: colors.surface,
        borderRadius: layout.radius.lg,
        padding: spacing[8],
        height: HERO_STAT_CONTENT_HEIGHT + spacing[8] * 2,
        border: `1px solid ${colors.surfaceBorder}`,
      }}
    >
      <span
        style={{
          fontSize: components.sectionHeader.fontSize,
          fontWeight: components.sectionHeader.fontWeight,
          color: components.sectionHeader.color,
          letterSpacing: components.sectionHeader.letterSpacing,
          textTransform: components.sectionHeader.textTransform,
        }}
      >
        {label}
      </span>
      {subtitle && (
        <span
          style={{
            fontSize: typography.size['xl'],
            fontWeight: typography.weight.medium,
            color: colors.text.tertiary,
          }}
        >
          {subtitle}
        </span>
      )}
      <span
        style={{
          fontSize: typography.size["4xl"],
          fontWeight: typography.weight.medium,
          color: colors.text.primary,
          lineHeight: typography.lineHeight.none,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function WeeklyBarChart({ weekdayActivity }: { weekdayActivity: WeekdayActivity }) {
  const { counts, mostActiveDay, maxCount } = weekdayActivity;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: BAR_GAP,
          height: BAR_HEIGHT,
        }}
      >
        {counts.map((count, i) => {
          const heightPercent = maxCount > 0 ? count / maxCount : 0;
          const barHeight = Math.max(8, Math.round(heightPercent * BAR_HEIGHT));
          const isHighlighted = i === mostActiveDay;

          return (
            <div
              key={i}
              style={{
                width: BAR_WIDTH,
                height: barHeight,
                backgroundColor: isHighlighted ? colors.accent.primary : colors.streak.level4,
                borderRadius: 4,
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: BAR_GAP,
        }}
      >
        {WEEKDAY_LABELS.map((label, i) => {
          const isHighlighted = i === mostActiveDay;
          return (
            <div
              key={i}
              style={{
                width: BAR_WIDTH,
                display: "flex",
                justifyContent: "center",
                fontSize: typography.size.sm,
                fontWeight: isHighlighted ? typography.weight.bold : typography.weight.regular,
                color: isHighlighted ? colors.accent.primary : colors.text.muted,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, marginTop = 0, children }: { title: string; marginTop?: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop,
        display: "flex",
        flexDirection: "column",
        gap: spacing[4],
      }}
    >
      <span
        style={{
          fontSize: components.sectionHeader.fontSize,
          fontWeight: components.sectionHeader.fontWeight,
          color: components.sectionHeader.color,
          letterSpacing: components.sectionHeader.letterSpacing,
          textTransform: components.sectionHeader.textTransform,
        }}
      >
        {title}
      </span>
      {children}
    </div>
  );
}

interface RankingItem {
  name: string;
  logoUrl?: string;
}

function RankingList({ title, items }: { title: string; items: RankingItem[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing[5],
        flex: 1,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surfaceBorder}`,
        borderRadius: layout.radius.lg,
        padding: spacing[6],
      }}
    >
      <span
        style={{
          fontSize: components.sectionHeader.fontSize,
          fontWeight: components.sectionHeader.fontWeight,
          color: components.sectionHeader.color,
          letterSpacing: components.sectionHeader.letterSpacing,
          textTransform: components.sectionHeader.textTransform,
        }}
      >
        {title}
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing[4],
        }}
      >
        {items.map((item, i) => (
          <RankingItemRow key={i} rank={i + 1} name={item.name} logoUrl={item.logoUrl} />
        ))}
      </div>
    </div>
  );
}

function InsightCard({ stats }: { stats: ClaudeCodeStats }) {
  const insights = [
    stats.totalCacheReadTokens > 0 && {
      label: "Cache Read",
      value: `${formatNumberFull(stats.totalCacheReadTokens)} tok`,
    },
    stats.totalCacheWriteTokens > 0 && {
      label: "Cache Write",
      value: `${formatNumberFull(stats.totalCacheWriteTokens)} tok`,
    },
    stats.cacheHitRate > 0 && {
      label: "Cache Hit",
      value: `${stats.cacheHitRate.toFixed(1)}%`,
    },
    stats.totalToolCalls > 0 && {
      label: "Tool Calls",
      value: formatNumberFull(stats.totalToolCalls),
    },
    stats.totalWebSearchRequests > 0 && {
      label: "Web Searches",
      value: formatNumberFull(stats.totalWebSearchRequests),
    },
    stats.peakContextWindow > 0 && {
      label: "Peak Context",
      value: `${formatNumberFull(stats.peakContextWindow)} tok`,
    },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing[5],
        flex: 1,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surfaceBorder}`,
        borderRadius: layout.radius.lg,
        padding: spacing[6],
      }}
    >
      <span
        style={{
          fontSize: components.sectionHeader.fontSize,
          fontWeight: components.sectionHeader.fontWeight,
          color: components.sectionHeader.color,
          letterSpacing: components.sectionHeader.letterSpacing,
          textTransform: components.sectionHeader.textTransform,
        }}
      >
        Cache Efficiency
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
        {insights.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing[4],
            }}
          >
            <span
              style={{
                fontSize: typography.size.md,
                fontWeight: typography.weight.medium,
                color: colors.text.tertiary,
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: typography.size.md,
                fontWeight: typography.weight.semibold,
                color: colors.text.primary,
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RankingItemRowProps {
  rank: number;
  name: string;
  logoUrl?: string;
}

function RankingItemRow({ rank, name, logoUrl }: RankingItemRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing[4],
      }}
    >
      <span
        style={{
          fontSize: components.ranking.numberSize,
          fontWeight: typography.weight.bold,
          color: colors.text.tertiary,
          width: components.ranking.numberWidth,
          textAlign: "right",
        }}
      >
        {rank}
      </span>

      {logoUrl && (
        <img
          src={logoUrl}
          width={components.ranking.logoSize}
          height={components.ranking.logoSize}
          style={{
            borderRadius: components.ranking.logoBorderRadius,
            background: "#ffffff",
          }}
        />
      )}

      <span
        style={{
          fontSize: components.ranking.itemSize,
          fontWeight: typography.weight.medium,
          color: colors.text.primary,
        }}
      >
        {name}
      </span>
    </div>
  );
}

function StatsGrid({ stats }: { stats: ClaudeCodeStats }) {
  const hasCost = stats.hasUsageCost;

  return (
    <div
      style={{
        marginTop: spacing[4],
        display: "flex",
        flexDirection: "column",
        gap: spacing[5],
      }}
    >
      {hasCost ? (
        <div style={{ display: "flex", flexDirection: "column", gap: spacing[5] }}>
          <div style={{ display: "flex", gap: spacing[5] }}>
            <StatBox label="Sessions" value={formatNumberFull(stats.totalSessions)} />
            <StatBox label="Messages" value={formatNumberFull(stats.totalMessages)} />
            <StatBox label="Total Tokens" value={formatNumberFull(stats.totalTokens)} />
          </div>

          <div style={{ display: "flex", gap: spacing[5] }}>
            <StatBox label="Projects" value={formatNumberFull(stats.totalProjects)} />
            <StatBox label="Streak" value={`${stats.maxStreak}d`} />
            <StatBox label="Usage Cost" value={formatCostFull(stats.totalCost)} />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: spacing[5] }}>
          <div style={{ display: "flex", gap: spacing[5] }}>
            <StatBox label="Sessions" value={formatNumberFull(stats.totalSessions)} />
            <StatBox label="Messages" value={formatNumberFull(stats.totalMessages)} />
            <StatBox label="Tokens" value={formatNumberFull(stats.totalTokens)} />
          </div>

          <div style={{ display: "flex", gap: spacing[5] }}>
            <StatBox label="Projects" value={formatNumberFull(stats.totalProjects)} />
            <StatBox label="Streak" value={`${stats.maxStreak}d`} />
          </div>
        </div>
      )}
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: components.statBox.background,
        paddingTop: components.statBox.padding.y,
        paddingBottom: components.statBox.padding.y,
        paddingLeft: components.statBox.padding.x,
        paddingRight: components.statBox.padding.x,
        gap: components.statBox.gap,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: components.statBox.borderRadius,
        border: `1px solid ${colors.surfaceBorder}`,
      }}
    >
      <span
        style={{
          fontSize: typography.size.lg,
          fontWeight: typography.weight.medium,
          color: colors.text.tertiary,
          textTransform: "uppercase",
          letterSpacing: typography.letterSpacing.wide,
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: typography.size["2xl"],
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
          lineHeight: typography.lineHeight.none,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        marginTop: spacing[2],
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: typography.size.lg,
          fontWeight: typography.weight.medium,
          color: colors.text.muted,
          letterSpacing: typography.letterSpacing.normal,
        }}
      >
        claude.ai/code
      </span>
    </div>
  );
}
