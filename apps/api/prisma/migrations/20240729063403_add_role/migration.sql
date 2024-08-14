-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `Cashier` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'cashier';
