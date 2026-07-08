import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@busarelloestofados.com.br";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Administrador",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin: ${adminEmail} / senha: ${adminPassword}`);

  const categoryColchao = await prisma.category.upsert({
    where: { slug: "colchao" },
    update: {},
    create: { id: "cat_colchao", name: "Colchões", slug: "colchao", emoji: "🛏️" },
  });
  const categoryEstofado = await prisma.category.upsert({
    where: { slug: "estofado" },
    update: {},
    create: { id: "cat_estofado", name: "Estofados", slug: "estofado", emoji: "🛋️" },
  });

  const colchao = await prisma.product.upsert({
    where: { slug: "colchao-molas-ensacadas-conforto" },
    update: {},
    create: {
      name: "Colchão Molas Ensacadas Conforto",
      slug: "colchao-molas-ensacadas-conforto",
      categoryId: categoryColchao.id,
      description:
        "Colchão com molas ensacadas individualmente para maior conforto e menor transferência de movimento. Ideal para casais.",
      images: [],
      active: true,
      variants: {
        create: [
          {
            size: "Solteiro",
            sku: "COL-CONF-SOL",
            price: 899.9,
            stockQuantity: 15,
            weightKg: 18,
            heightCm: 25,
            widthCm: 88,
            lengthCm: 30,
          },
          {
            size: "Casal",
            sku: "COL-CONF-CAS",
            price: 1299.9,
            stockQuantity: 12,
            weightKg: 28,
            heightCm: 25,
            widthCm: 138,
            lengthCm: 30,
          },
          {
            size: "Queen",
            sku: "COL-CONF-QUE",
            price: 1599.9,
            stockQuantity: 8,
            weightKg: 32,
            heightCm: 25,
            widthCm: 158,
            lengthCm: 30,
          },
          {
            size: "King",
            sku: "COL-CONF-KIN",
            price: 1899.9,
            stockQuantity: 5,
            weightKg: 36,
            heightCm: 25,
            widthCm: 193,
            lengthCm: 30,
          },
        ],
      },
    },
  });

  const colchaoEspuma = await prisma.product.upsert({
    where: { slug: "colchao-espuma-d33-firme" },
    update: {},
    create: {
      name: "Colchão Espuma D33 Firme",
      slug: "colchao-espuma-d33-firme",
      categoryId: categoryColchao.id,
      description:
        "Colchão 100% espuma D33 de alta densidade, firmeza ideal para quem busca suporte para a coluna.",
      images: [],
      active: true,
      variants: {
        create: [
          {
            size: "Solteiro",
            sku: "COL-ESP-SOL",
            price: 599.9,
            stockQuantity: 20,
            weightKg: 12,
            heightCm: 18,
            widthCm: 88,
            lengthCm: 30,
          },
          {
            size: "Casal",
            sku: "COL-ESP-CAS",
            price: 899.9,
            stockQuantity: 18,
            weightKg: 20,
            heightCm: 18,
            widthCm: 138,
            lengthCm: 30,
          },
        ],
      },
    },
  });

  const sofa = await prisma.product.upsert({
    where: { slug: "sofa-retratil-reclinavel-suede" },
    update: {},
    create: {
      name: "Sofá Retrátil e Reclinável em Suede",
      slug: "sofa-retratil-reclinavel-suede",
      categoryId: categoryEstofado.id,
      description:
        "Sofá retrátil e reclinável revestido em suede, estrutura em madeira maciça e espuma D28 injetada.",
      images: [],
      active: true,
      variants: {
        create: [
          {
            size: "2 Lugares",
            sku: "SOF-SUE-2L",
            price: 1799.9,
            stockQuantity: 6,
            weightKg: 45,
            heightCm: 90,
            widthCm: 160,
            lengthCm: 95,
          },
          {
            size: "3 Lugares",
            sku: "SOF-SUE-3L",
            price: 2299.9,
            stockQuantity: 4,
            weightKg: 60,
            heightCm: 90,
            widthCm: 210,
            lengthCm: 95,
          },
        ],
      },
    },
  });

  const poltrona = await prisma.product.upsert({
    where: { slug: "poltrona-do-papai-reclinavel" },
    update: {},
    create: {
      name: "Poltrona do Papai Reclinável",
      slug: "poltrona-do-papai-reclinavel",
      categoryId: categoryEstofado.id,
      description: "Poltrona reclinável com apoio para os pés, revestimento em courino.",
      images: [],
      active: true,
      variants: {
        create: [
          {
            size: "Único",
            sku: "POL-PAPAI-UN",
            price: 999.9,
            stockQuantity: 10,
            weightKg: 30,
            heightCm: 105,
            widthCm: 80,
            lengthCm: 90,
          },
        ],
      },
    },
  });

  console.log({ colchao: colchao.id, colchaoEspuma: colchaoEspuma.id, sofa: sofa.id, poltrona: poltrona.id });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
