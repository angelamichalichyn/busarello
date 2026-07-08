-- Enforce categoryId as required now that all rows are backfilled
ALTER TABLE "products" ALTER COLUMN "categoryId" SET NOT NULL;

-- Products must always reference an existing category (prevent deleting a category in use)
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
