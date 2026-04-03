import { Product } from "@/components/ProductCard";

export const products: Product[] = [
  // ── K1 ──────────────────────────────────────
  {
    id: "p1", reference: "K1",
    description: "Un collier magnifique pour marquer vos moments les plus précieux.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k1f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k1-2f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k1m.png"],
    weightGrams: 12.5, pricePerGram: 65, dateAdded: "2024-01-10T10:00:00Z"
  },
  // ── K2 ──────────────────────────────────────
  {
    id: "p2", reference: "K2",
    description: "Bague élégante ornée de détails subtils en or jaune.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k2f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k2-2f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k2m.png"],
    weightGrams: 4.2, pricePerGram: 68, dateAdded: "2024-01-12T10:00:00Z"
  },
  // ── K3 ──────────────────────────────────────
  {
    id: "p3", reference: "K3",
    description: "Un design épuré pour un porté quotidien luxueux.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k3f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k3m.png"],
    weightGrams: 15.0, pricePerGram: 60, dateAdded: "2024-01-15T10:00:00Z"
  },
  // ── K4 ──────────────────────────────────────
  {
    id: "p4", reference: "K4",
    description: "Boucles d'oreilles pendantes au design étoilé.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k4f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k4m.png"],
    weightGrams: 6.8, pricePerGram: 62, dateAdded: "2024-01-16T10:00:00Z"
  },
  // ── K5 ──────────────────────────────────────
  {
    id: "p5", reference: "K5",
    description: "Fin et délicat, parfait pour s'accorder avec toutes vos tenues.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k5f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k5m.png"],
    weightGrams: 8.5, pricePerGram: 61, dateAdded: "2024-01-20T10:00:00Z"
  },
  // ── K6 ──────────────────────────────────────
  {
    id: "p6", reference: "K6",
    description: "La pièce maîtresse pour une demande inoubliable.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k6f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k6m.jpg", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k6-2m.jpg"],
    weightGrams: 5.5, pricePerGram: 70, dateAdded: "2024-01-25T10:00:00Z"
  },
  // ── K7 ──────────────────────────────────────
  {
    id: "p7", reference: "K7",
    description: "Un ensemble inspiré de la nature.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k7f.jpg", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k7m.png"],
    weightGrams: 22.0, pricePerGram: 58, dateAdded: "2024-02-01T10:00:00Z"
  },
  // ── K8 ──────────────────────────────────────
  {
    id: "p8", reference: "K8",
    description: "Symbole éternel gravé dans l'or.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k8f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k8m.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k8-2m.png"],
    weightGrams: 11.2, pricePerGram: 63, dateAdded: "2024-02-05T10:00:00Z"
  },
  // ── K9 ──────────────────────────────────────
  {
    id: "p9", reference: "K9",
    description: "L'éclat pur d'un diamant serti sur or.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k9f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k9m.png"],
    weightGrams: 3.8, pricePerGram: 120, dateAdded: "2024-02-10T10:00:00Z"
  },
  // ── K10 ─────────────────────────────────────
  {
    id: "p10", reference: "K10",
    description: "La beauté dans la simplicité.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k10f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k10m.png"],
    weightGrams: 7.0, pricePerGram: 59, dateAdded: "2024-02-15T10:00:00Z"
  },
  // ── K11 ─────────────────────────────────────
  {
    id: "p11", reference: "K11",
    description: "L'association de l'or et de perles de culture.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k11f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k11m.png"],
    weightGrams: 5.1, pricePerGram: 66, dateAdded: "2024-02-20T10:00:00Z"
  },
  // ── K12 ─────────────────────────────────────
  {
    id: "p12", reference: "K12",
    description: "L'iconique bague de fiançailles.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k12f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k12m.jpg"],
    weightGrams: 4.5, pricePerGram: 85, dateAdded: "2024-02-25T10:00:00Z"
  },
  // ── K13 ─────────────────────────────────────
  {
    id: "p13", reference: "K13",
    description: "Un bracelet texturé d'une rare élégance.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k13f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k13m.jpg", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k13-2m.png"],
    weightGrams: 18.5, pricePerGram: 64, dateAdded: "2024-03-01T10:00:00Z"
  },
  // ── K14 ─────────────────────────────────────
  {
    id: "p14", reference: "K14",
    description: "Une pièce imposante pour les grandes occasions.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k14f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k14m.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k14-2m.jpg"],
    weightGrams: 25.0, pricePerGram: 55, dateAdded: "2024-03-05T10:00:00Z"
  },
  // ── K15 ─────────────────────────────────────
  {
    id: "p15", reference: "K15",
    description: "Bague raffinée au galbe parfait, un incontournable du luxe.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k15f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k15m.jpg", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k15-2f.png"],
    weightGrams: 6.0, pricePerGram: 67, dateAdded: "2024-03-10T10:00:00Z"
  },
  // ── K16 ─────────────────────────────────────
  {
    id: "p16", reference: "K16",
    description: "Design contemporain aux lignes épurées, parfait pour chaque occasion.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k16f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k16m.jpg", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k16-2f.png"],
    weightGrams: 7.2, pricePerGram: 63, dateAdded: "2024-03-12T10:00:00Z"
  },
  // ── K17 ─────────────────────────────────────
  {
    id: "p17", reference: "K17",
    description: "Bague sculptée à la main, symbole d'élégance intemporelle.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k17f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k17m.png"],
    weightGrams: 9.5, pricePerGram: 68, dateAdded: "2024-03-14T10:00:00Z"
  },
  // ── K18 ─────────────────────────────────────
  {
    id: "p18", reference: "K18",
    description: "Pièce unique alliant tradition et modernité dans un or lumineux.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k18f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k18m.png"],
    weightGrams: 5.8, pricePerGram: 72, dateAdded: "2024-03-16T10:00:00Z"
  },
  // ── K19 ─────────────────────────────────────
  {
    id: "p19", reference: "K19",
    description: "Finesse et caractère, pour une femme qui sait ce qu'elle veut.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k19f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k19m.png"],
    weightGrams: 4.8, pricePerGram: 65, dateAdded: "2024-03-18T10:00:00Z"
  },
  // ── K20 ─────────────────────────────────────
  {
    id: "p20", reference: "K20",
    description: "Éclat doré discret, idéal pour une élégance au quotidien.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k20f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k20m.jpg"],
    weightGrams: 6.5, pricePerGram: 61, dateAdded: "2024-03-20T10:00:00Z"
  },
  // ── K21 ─────────────────────────────────────
  {
    id: "p21", reference: "K21",
    description: "Design architectural audacieux, pour marquer les esprits.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k21f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k21m.jpg", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k21-2m.png"],
    weightGrams: 11.0, pricePerGram: 66, dateAdded: "2024-03-22T10:00:00Z"
  },
  // ── K22 ─────────────────────────────────────
  {
    id: "p22", reference: "K22",
    description: "Bague jonc dorée, minimaliste et terriblement chic.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k22f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k22m.png"],
    weightGrams: 8.0, pricePerGram: 60, dateAdded: "2024-03-24T10:00:00Z"
  },
  // ── K23 ─────────────────────────────────────
  {
    id: "p23", reference: "K23",
    description: "Tourbillon d'or mat et brillant, une œuvre portée.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k23f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k23m.jpg"],
    weightGrams: 5.3, pricePerGram: 74, dateAdded: "2024-03-26T10:00:00Z"
  },
  // ── K24 ─────────────────────────────────────
  {
    id: "p24", reference: "K24",
    description: "Subtile torsade en or, portée seule ou en superposition.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k24f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k24m.png"],
    weightGrams: 4.0, pricePerGram: 69, dateAdded: "2024-03-28T10:00:00Z"
  },
  // ── K25 ─────────────────────────────────────
  {
    id: "p25", reference: "K25",
    description: "Alliance classique au brillant incomparable, pour un oui éternel.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k25f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k25m.jpg"],
    weightGrams: 7.8, pricePerGram: 78, dateAdded: "2024-03-30T10:00:00Z"
  },
  // ── K26 ─────────────────────────────────────
  {
    id: "p26", reference: "K26",
    description: "Bague de fiançailles délicate, pour promettre l'éternité.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k26f.jpg", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k26m.png"],
    weightGrams: 5.0, pricePerGram: 80, dateAdded: "2024-04-01T10:00:00Z"
  },
  // ── K27 ─────────────────────────────────────
  {
    id: "p27", reference: "K27",
    description: "Pièce artisanale ciselée à la main, hommage au savoir-faire.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k27f.png","https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k27m.jpg"],
    weightGrams: 13.0, pricePerGram: 62, dateAdded: "2024-04-02T10:00:00Z"
  },
  // ── K28 ─────────────────────────────────────
  {
    id: "p28", reference: "K28",
    description: "Or texturé aux reflets changeants, charme naturel et moderne.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k28f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k28m.jpg"],
    weightGrams: 6.3, pricePerGram: 64, dateAdded: "2024-04-03T10:00:00Z"
  },
  // ── K29 ─────────────────────────────────────
  {
    id: "p29", reference: "K29",
    description: "Anneau orné d'un entrelacs délicat, symbole de liens indéfectibles.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k29f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k29m.jpg"],
    weightGrams: 4.7, pricePerGram: 71, dateAdded: "2024-04-04T10:00:00Z"
  },
  // ── K30 ─────────────────────────────────────
  {
    id: "p30", reference: "K30",
    description: "Bague ronde au poli miroir, d'une sobriété absolue.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k30f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k30m.png"],
    weightGrams: 5.5, pricePerGram: 63, dateAdded: "2024-04-05T10:00:00Z"
  },
  // ── K31 ─────────────────────────────────────
  {
    id: "p31", reference: "K31",
    description: "Élégance structurée, pour celles qui aiment le détail parfait.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k31f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k31m.png"],
    weightGrams: 9.0, pricePerGram: 66, dateAdded: "2024-04-06T10:00:00Z"
  },
  // ── K32 ─────────────────────────────────────
  {
    id: "p32", reference: "K32",
    description: "Finition satinée sur or jaune, pour un style contemporain affirmé.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k32f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k32m.png"],
    weightGrams: 6.8, pricePerGram: 65, dateAdded: "2024-04-07T10:00:00Z"
  },
  // ── K33 ─────────────────────────────────────
  {
    id: "p33", reference: "K33",
    description: "Bague multi-rangs à l'allure royale, une pièce qui ne passe pas inaperçue.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k33f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k33m.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k33-2m.png"],
    weightGrams: 14.0, pricePerGram: 67, dateAdded: "2024-04-08T10:00:00Z"
  },
  // ── K35 ─────────────────────────────────────
  {
    id: "p35", reference: "K35",
    description: "Forme libre sculptée, pour une personnalité unique et affirmée.",
    category: "bagues", subCategory: "fiancailles",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k35f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k35m.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k35-2f.png"],
    weightGrams: 7.5, pricePerGram: 70, dateAdded: "2024-04-09T10:00:00Z"
  },
  // ── K36 ─────────────────────────────────────
  {
    id: "p36", reference: "K36",
    description: "Anneau à motifs géométriques, alliance de précision et d'art.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k36f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k36m.png"],
    weightGrams: 5.9, pricePerGram: 63, dateAdded: "2024-04-10T10:00:00Z"
  },
  // ── K37 ─────────────────────────────────────
  {
    id: "p37", reference: "K37",
    description: "Bague pavée d'or, rayonnante de lumière à chaque mouvement.",
    category: "bagues", subCategory: "mariage",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k37f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k37m.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k37-2f.png"],
    weightGrams: 10.2, pricePerGram: 72, dateAdded: "2024-04-11T10:00:00Z"
  },
  // ── K38 ─────────────────────────────────────
  {
    id: "p38", reference: "K38",
    description: "Chevalière élégante en or, entre classicisme et modernité.",
    category: "bagues", subCategory: "quotidien",
    images: ["https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k38f.png", "https://qtupyxjrglebbmusxzuo.supabase.co/storage/v1/object/public/products-images/k38m.png"],
    weightGrams: 8.4, pricePerGram: 64, dateAdded: "2024-04-12T10:00:00Z"
  }
];
