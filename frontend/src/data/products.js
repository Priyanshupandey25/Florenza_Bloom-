/**
 * Default Handcrafted Bouquets Catalog (Fallback & Seed)
 * Uses assets stored in /public/products/
 */

export const defaultProducts = [
  {
    id: "default-bouquet-1",
    _id: "default-bouquet-1",
    name: "Azure Serenade Bouquet",
    title: "Azure Serenade Bouquet",
    tag: "SIGNATURE BOTANICAL",
    category: "SIGNATURE BOTANICAL",
    description:
      "A serene composition of powder-blue hydrangeas, sea-holly thistles, and delicate ivory roses, wrapped in artisanal blush paper.",
    price: 2499,
    stock: 15,
    images: [
      "/products/bouquet-blue/bouquet-blue-1.png",
    ],
  },
  {
    id: "default-bouquet-2",
    _id: "default-bouquet-2",
    name: "Lavender Twilight Gathering",
    title: "Lavender Twilight Gathering",
    tag: "DRIED & PRESERVED",
    category: "DRIED & PRESERVED",
    description:
      "Fragrant wild Provence lavender interwoven with silvery eucalyptus and soft lilac lisianthus. Crafted to evoke quiet summer evenings.",
    price: 1899,
    stock: 8,
    images: [
      "/products/bouquet-lavender/bouquet-lavender-1.png",
    ],
  },
  {
    id: "default-bouquet-3",
    _id: "default-bouquet-3",
    name: "Velvet Petal Symphony",
    title: "Velvet Petal Symphony",
    tag: "LUXURY FLORAL",
    category: "LUXURY FLORAL",
    description:
      "Deep aubergine calla lilies with imperial violet orchids and garden-fresh spray roses for an opulent, dramatic centerpiece.",
    price: 3299,
    stock: 5,
    images: [
      "/products/bouquet-purple/bouquet-purple-1.png",
    ],
  },
  {
    id: "default-bouquet-4",
    _id: "default-bouquet-4",
    name: "Porcelain Ceramic Arrangement",
    title: "Porcelain Ceramic Arrangement",
    tag: "VASE EDITION",
    category: "VASE EDITION",
    description:
      "An ethereal tablescape arrangement presented in a matte textured terracotta-blush ceramic vessel with garden foliage.",
    price: 3799,
    stock: 12,
    images: [
      "/products/bouquet-vase/bouquet-vase-1.png",
      "/products/bouquet-vase/bouquet-vase-2.png",
    ],
  },
  {
    id: "default-bouquet-5",
    _id: "default-bouquet-5",
    name: "Golden Solstice Bloom",
    title: "Golden Solstice Bloom",
    tag: "SUNLIT BOTANICAL",
    category: "SUNLIT BOTANICAL",
    description:
      "Radiant golden sunflowers paired with chamomile, craspedia globes, and rustic burlap ribbon for pure, contagious warmth.",
    price: 1699,
    stock: 18,
    images: [
      "/products/sunflower.png",
    ],
  },
];

export default defaultProducts;
