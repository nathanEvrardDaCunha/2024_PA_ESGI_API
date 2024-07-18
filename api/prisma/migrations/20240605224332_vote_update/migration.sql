/*
  Warnings:

  - You are about to drop the `_PersonToTopic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `round` to the `Choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quorum` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PersonToTopic" DROP CONSTRAINT "_PersonToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToTopic" DROP CONSTRAINT "_PersonToTopic_B_fkey";

-- AlterTable
ALTER TABLE "Choice" ADD COLUMN     "round" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "currentRound" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "quorum" INTEGER NOT NULL,
ADD COLUMN     "totalRounds" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "_PersonToTopic";
