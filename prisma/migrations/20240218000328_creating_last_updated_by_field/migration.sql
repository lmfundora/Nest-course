-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "lastUpdatedBy" TEXT;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_lastUpdatedBy_fkey" FOREIGN KEY ("lastUpdatedBy") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
