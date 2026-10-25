import { type CSSProperties } from "react";
import {
  HOSTED_CHECKOUT_OVERVIEW,
  REVOLUT_CHECKOUT_OVERVIEW,
  SERVER_TO_SERVER_OVERVIEW,
  SUBSCRIPTION_APIS_OVERVIEW,
} from "../../constants/comparisonOverview";
import { OVERVIEW_TILES, type OverviewTile } from "../../constants/overviewTiles";
import { IndividualSDKPanel } from "./IndividualSDKPanel";
import { PluginsPanel } from "./PluginsPanel";
import { SolutionOverviewPanel } from "./SolutionOverviewPanel";

function TileBody({ id }: { id: OverviewTile["id"] }) {
  if (id === "embedded") {
    return (
      <SolutionOverviewPanel
        as="div"
        className="overview-inline-panel"
        data={{ title: "Embedded Checkout", ...REVOLUT_CHECKOUT_OVERVIEW }}
      />
    );
  }
  if (id === "hosted") {
    return (
      <SolutionOverviewPanel
        as="div"
        className="overview-inline-panel"
        data={{
          title: "Redirect Checkout/Hosted Payment Page",
          bestSuitedFor: HOSTED_CHECKOUT_OVERVIEW.bestSuitedFor,
          merchantExperience: HOSTED_CHECKOUT_OVERVIEW.merchantExperience,
          whyChoose: HOSTED_CHECKOUT_OVERVIEW.whyChoose,
        }}
      />
    );
  }
  if (id === "individual-sdks") {
    return <IndividualSDKPanel as="div" className="overview-inline-panel" />;
  }
  if (id === "plugins") {
    return <PluginsPanel as="div" className="overview-inline-panel" />;
  }
  if (id === "subscription-apis") {
    return (
      <SolutionOverviewPanel
        as="div"
        className="overview-inline-panel"
        data={{ title: "Subscription APIs", ...SUBSCRIPTION_APIS_OVERVIEW }}
      />
    );
  }
  return (
    <SolutionOverviewPanel
      as="div"
      className="overview-inline-panel"
      data={{ title: "Server-to-Server Integration", ...SERVER_TO_SERVER_OVERVIEW }}
    />
  );
}

function FloatingCard({ tile, index }: { tile: OverviewTile; index: number }) {
  return (
    <div className={`overview-reveal overview-reveal-${index + 1}`}>
      <div
        className={`overview-float-slot overview-float-slot-${index + 1}`}
        style={{ "--float-delay": `${index * 0.45}s` } as CSSProperties}
      >
        <article className={`overview-float overview-float-${tile.accent}`}>
          <TileBody id={tile.id} />
        </article>
      </div>
    </div>
  );
}

export function FloatingOverview() {
  return (
    <div className="overview-stage">
      <div className="overview-orbit" aria-hidden="true" />
      <div className="overview-grid">
        {OVERVIEW_TILES.map((tile, index) => (
          <FloatingCard key={tile.id} tile={tile} index={index} />
        ))}
      </div>
    </div>
  );
}
