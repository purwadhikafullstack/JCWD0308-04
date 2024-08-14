/*
  Warnings:

  - You are about to drop the column `shiftId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `shiftID` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_shiftId_fkey`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `shiftId`,
    ADD COLUMN `shiftID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_shiftID_fkey` FOREIGN KEY (`shiftID`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
