-- CreateTable
CREATE TABLE "_ActivityDocuments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityDocuments_AB_unique" ON "_ActivityDocuments"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityDocuments_B_index" ON "_ActivityDocuments"("B");

-- AddForeignKey
ALTER TABLE "_ActivityDocuments" ADD CONSTRAINT "_ActivityDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityDocuments" ADD CONSTRAINT "_ActivityDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
