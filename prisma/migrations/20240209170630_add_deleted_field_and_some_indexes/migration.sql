-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Items_deleted_idx" ON "Items" USING HASH ("deleted");

-- CreateIndex
CREATE INDEX "Items_name_idx" ON "Items" USING SPGIST ("name");
