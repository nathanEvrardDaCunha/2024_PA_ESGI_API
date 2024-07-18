-- DropForeignKey
ALTER TABLE "GeneralAssembly" DROP CONSTRAINT "GeneralAssembly_activityId_fkey";

-- DropIndex
DROP INDEX "GeneralAssembly_activityId_key";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "generalAssemblyId" TEXT;

-- AlterTable
ALTER TABLE "GeneralAssembly" ALTER COLUMN "activityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GeneralAssembly" ADD CONSTRAINT "GeneralAssembly_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
