/*
  Warnings:

  - You are about to drop the column `shiftID` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `shiftId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_shiftID_fkey`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `shiftID`,
    ADD COLUMN `shiftId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
