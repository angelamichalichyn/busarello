-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "emoji" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_logs_orderId_idx" ON "email_logs"("orderId");

-- CreateTable
CREATE TABLE "store_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "storeName" TEXT NOT NULL DEFAULT 'Busarello Estofados',
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "maxInstallments" INTEGER NOT NULL DEFAULT 10,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed the two existing categories
INSERT INTO "categories" ("id", "name", "slug", "emoji", "createdAt", "updatedAt")
VALUES
  ('cat_colchao', 'Colchões', 'colchao', '🛏️', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_estofado', 'Estofados', 'estofado', '🛋️', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable: add nullable categoryId first so we can backfill safely
ALTER TABLE "products" ADD COLUMN "categoryId" TEXT;

-- DropIndex (old enum-based index)
DROP INDEX IF EXISTS "products_category_idx";

-- Backfill categoryId from the old enum column
UPDATE "products" SET "categoryId" = 'cat_colchao' WHERE "category" = 'COLCHAO';
UPDATE "products" SET "categoryId" = 'cat_estofado' WHERE "category" = 'ESTOFADO';

-- Now that every row has a categoryId, drop the old enum column and enum type
ALTER TABLE "products" DROP COLUMN "category";
DROP TYPE IF EXISTS "ProductCategory";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
