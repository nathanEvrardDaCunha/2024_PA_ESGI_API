/*
  Warnings:

  - You are about to drop the `_GeneralAssemblyToTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GeneralAssemblyToTopic" DROP CONSTRAINT "_GeneralAssemblyToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_GeneralAssemblyToTopic" DROP CONSTRAINT "_GeneralAssemblyToTopic_B_fkey";

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "generalAssemblyId" TEXT;

-- DropTable
DROP TABLE "_GeneralAssemblyToTopic";

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_generalAssemblyId_fkey" FOREIGN KEY ("generalAssemblyId") REFERENCES "GeneralAssembly"("id") ON DELETE SET NULL ON UPDATE CASCADE;
