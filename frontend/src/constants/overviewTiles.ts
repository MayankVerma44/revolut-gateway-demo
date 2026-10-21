export type OverviewTileId = "embedded" | "hosted" | "individual-sdks" | "plugins";

export interface OverviewTile {
  id: OverviewTileId;
  title: string;
  description: string;
  accent: "ink" | "teal" | "success";
  chips: readonly string[];
}

export const OVERVIEW_TILES: readonly OverviewTile[] = [
  {
    id: "embedded",
    title: "Embedded Checkout",
    description: "Keep checkout on your site with Revolut as the primary provider.",
    accent: "ink",
    chips: ["Live demo"],
  },
  {
    id: "hosted",
    title: "Redirect Checkout/Hosted Payment Page",
    description: "Send customers to a Revolut-hosted checkout, then return them to your site.",
    accent: "ink",
    chips: ["Live demo"],
  },
  {
    id: "individual-sdks",
    title: "Individual SDKs",
    description: "Mount standalone express buttons freely on your site.",
    accent: "teal",
    chips: ["Cards", "Wallets"],
  },
  {
    id: "plugins",
    title: "Plugins",
    description: "Connect Revolut through supported ecommerce platform plugins.",
    accent: "success",
    chips: ["WooCommerce", "Magento", "PrestaShop"],
  },
];
