-- CreateTable
CREATE TABLE "Choice" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VoterChoices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VoterChoices_AB_unique" ON "_VoterChoices"("A", "B");

-- CreateIndex
CREATE INDEX "_VoterChoices_B_index" ON "_VoterChoices"("B");

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VoterChoices" ADD CONSTRAINT "_VoterChoices_A_fkey" FOREIGN KEY ("A") REFERENCES "Choice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VoterChoices" ADD CONSTRAINT "_VoterChoices_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
