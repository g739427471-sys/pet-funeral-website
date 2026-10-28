import "dotenv/config";
import {
  PrismaClient,
  ProductCategory,
  ServiceType,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

type SeedProduct = {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock: number | null;
};

type SeedService = {
  slug: string;
  name: string;
  type: ServiceType;
  description: string;
  priceCents: number;
  durationMinutes: number | null;
};

const products: SeedProduct[] = [
  // 骨灰盒
  {
    slug: "wooden-urn",
    name: "原木静安骨灰盒",
    category: ProductCategory.URN,
    description: "温润原木质地，木纹自然。愿它安息于大地的怀抱，宁静而长久。",
    priceCents: 88000,
    imageUrl: "/images/products/urn.svg",
    stock: 50,
  },
  {
    slug: "porcelain-urn",
    name: "素白瓷面骨灰盒",
    category: ProductCategory.URN,
    description: "素白瓷面，温润如玉。简约而不失庄重，收纳一段安静的回忆。",
    priceCents: 128000,
    imageUrl: "/images/products/urn.svg",
    stock: 30,
  },
  {
    slug: "walnut-urn",
    name: "胡桃木珍藏骨灰盒",
    category: ProductCategory.URN,
    description: "深色胡桃木，沉稳内敛。铭刻思念，长久相伴。",
    priceCents: 168000,
    imageUrl: "/images/products/urn.svg",
    stock: 20,
  },
  // 纪念品
  {
    slug: "paw-print-plaque",
    name: "爪印纪念牌",
    category: ProductCategory.KEEPSAKE,
    description: "留存它独一无二的爪印，让这份触感，依旧近在咫尺。",
    priceCents: 26000,
    imageUrl: "/images/products/keepsake.svg",
    stock: 100,
  },
  {
    slug: "fur-keepsake-vial",
    name: "毛发纪念瓶",
    category: ProductCategory.KEEPSAKE,
    description: "一撮毛发，装进玻璃小瓶。珍藏它曾陪伴的温柔。",
    priceCents: 12000,
    imageUrl: "/images/products/keepsake.svg",
    stock: 100,
  },
  {
    slug: "ceramic-figure",
    name: "陶土纪念雕像",
    category: ProductCategory.KEEPSAKE,
    description: "手工陶土，还原它安静的模样，长久陪伴。",
    priceCents: 38000,
    imageUrl: "/images/products/keepsake.svg",
    stock: 40,
  },
  // 祭祀用品
  {
    slug: "memorial-candle",
    name: "暖光纪念蜡烛",
    category: ProductCategory.OFFERING,
    description: "一点暖光，为它点亮回家的路。",
    priceCents: 6800,
    imageUrl: "/images/products/offering.svg",
    stock: null,
  },
  {
    slug: "memorial-frame",
    name: "实木纪念相框",
    category: ProductCategory.OFFERING,
    description: "实木相框，安放它最美好的样子。",
    priceCents: 15800,
    imageUrl: "/images/products/offering.svg",
    stock: 60,
  },
  {
    slug: "offering-flowers",
    name: "祭祀鲜花",
    category: ProductCategory.OFFERING,
    description: "应季鲜花，以花寄思，安静地献上一份心意。",
    priceCents: 9800,
    imageUrl: "/images/products/offering.svg",
    stock: null,
  },
];

const services: SeedService[] = [
  {
    slug: "individual-cremation",
    name: "单独火化",
    type: ServiceType.CREMATION,
    description: "一对一的单独火化，全程专业安详，骨灰完整归还。",
    priceCents: 180000,
    durationMinutes: 120,
  },
  {
    slug: "farewell-ceremony",
    name: "温馨告别仪式",
    type: ServiceType.CEREMONY,
    description: "庄重而温暖的告别仪式，为它留下一段完整而郑重的告别。",
    priceCents: 120000,
    durationMinutes: 60,
  },
  {
    slug: "door-to-door-pickup",
    name: "24 小时上门接送",
    type: ServiceType.PICKUP,
    description: "全天候贴心上门，温柔地将它接来，也温柔地送它回家。",
    priceCents: 30000,
    durationMinutes: null,
  },
];

type SeedMemorial = {
  slug: string;
  petName: string;
  petType?: string;
  birthDate?: Date;
  passedDate?: Date;
  story: string;
  ownerName?: string;
  published: boolean;
};

const memorials: SeedMemorial[] = [
  {
    slug: "memorial-doubao",
    petName: "豆包",
    petType: "猫",
    birthDate: new Date("2015-03-12"),
    passedDate: new Date("2024-11-08"),
    story:
      "豆包是我们家最温柔的小猫。它总爱趴在窗台上晒太阳，尾巴轻轻一摇，日子就慢了下来。谢谢你陪我们走过的九年，愿你在彩虹桥那边，依然有暖和的阳光。",
    ownerName: "林女士",
    published: true,
  },
  {
    slug: "memorial-wangcai",
    petName: "旺财",
    petType: "狗",
    birthDate: new Date("2012-06-01"),
    passedDate: new Date("2024-05-20"),
    story:
      "旺财陪了我们十二年，从搬家到孩子长大，它一直都在。它不会说话，却比谁都懂我们的心事。谢谢你用一生守护这个家。",
    ownerName: "陈先生",
    published: true,
  },
  {
    slug: "memorial-xiaobai",
    petName: "小白",
    petType: "兔",
    passedDate: new Date("2023-02-14"),
    story:
      "小白是最安静的小家伙，爱吃胡萝卜，也爱在院子里蹦蹦跳跳。虽然相处的时间不长，但每一天都很快乐。",
    ownerName: "小禾",
    published: true,
  },
  {
    slug: "memorial-private-example",
    petName: "保密的小猫",
    petType: "猫",
    story: "这是一条未公开的纪念，仅用于演示新提交的纪念页默认为私密。",
    published: false,
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        category: p.category,
        description: p.description,
        priceCents: p.priceCents,
        imageUrl: p.imageUrl,
        stock: p.stock,
        active: true,
      },
      create: p,
    });
  }

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        type: s.type,
        description: s.description,
        priceCents: s.priceCents,
        durationMinutes: s.durationMinutes,
        active: true,
      },
      create: s,
    });
  }

  for (const m of memorials) {
    await prisma.memorial.upsert({
      where: { slug: m.slug },
      update: {
        petName: m.petName,
        petType: m.petType ?? null,
        birthDate: m.birthDate ?? null,
        passedDate: m.passedDate ?? null,
        story: m.story,
        ownerName: m.ownerName ?? null,
        published: m.published,
      },
      create: m,
    });
  }

  const productCount = await prisma.product.count();
  const serviceCount = await prisma.service.count();
  const memorialCount = await prisma.memorial.count();
  console.log(
    `✅ 种子数据写入完成：${productCount} 个产品，${serviceCount} 个服务，${memorialCount} 条纪念`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ 种子数据写入失败：", e);
    await prisma.$disconnect();
    process.exit(1);
  });
