/*
  Warnings:

  - You are about to drop the column `authorFirstName` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `authorLastName` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `billId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `renewalDate` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `renewalFrequency` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `billId` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the `Bill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActivityToDocument` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_billId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_billId_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToDocument" DROP CONSTRAINT "_ActivityToDocument_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToDocument" DROP CONSTRAINT "_ActivityToDocument_B_fkey";

-- DropIndex
DROP INDEX "Donation_billId_key";

-- DropIndex
DROP INDEX "Membership_billId_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "authorFirstName",
DROP COLUMN "authorLastName",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "billId",
DROP COLUMN "renewalDate",
DROP COLUMN "renewalFrequency";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "billId";

-- DropTable
DROP TABLE "Bill";

-- DropTable
DROP TABLE "_ActivityToDocument";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMembership" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "GroupMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembership_personId_groupId_key" ON "GroupMembership"("personId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentGroups_AB_unique" ON "_DocumentGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentGroups_B_index" ON "_DocumentGroups"("B");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentGroups" ADD CONSTRAINT "_DocumentGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentGroups" ADD CONSTRAINT "_DocumentGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
