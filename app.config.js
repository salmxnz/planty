export default {
  expo: {
    name: "planty",
    slug: "planty",
    // Your other existing Expo config
    assetBundlePatterns: [
        "**/*"
      ],
    extra: {
      kindwiseIdentifyKey: process.env.KINDWISE_IDENTIFY_KEY,
      kindwiseHealthKey: process.env.KINDWISE_HEALTH_KEY,
      plantNetApiKey: process.env.PLANT_NET_API_KEY,
    },
  }
};