-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `registerNumber` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `batch` VARCHAR(191) NULL,
    `cgpa` DOUBLE NULL,
    `profileCompleted` BOOLEAN NOT NULL DEFAULT false,
    `placementStatus` ENUM('NOT_PLACED', 'PLACED') NOT NULL DEFAULT 'NOT_PLACED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_registerNumber_key`(`registerNumber`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_role_idx`(`role`),
    INDEX `User_department_idx`(`department`),
    INDEX `User_placementStatus_idx`(`placementStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentInterest` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `domain` ENUM('SOFTWARE_DEV', 'AI_ML', 'DATA_SCIENCE', 'DEVOPS', 'CYBER_SECURITY', 'CORE_ENGINEERING', 'NON_IT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudentInterest_userId_idx`(`userId`),
    INDEX `StudentInterest_domain_idx`(`domain`),
    UNIQUE INDEX `StudentInterest_userId_domain_key`(`userId`, `domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `jobRole` VARCHAR(191) NOT NULL,
    `ctc` DOUBLE NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `industryType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Company_companyName_idx`(`companyName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlacementDrive` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `eligibilityCgpa` DOUBLE NOT NULL,
    `allowedDepartments` JSON NOT NULL,
    `driveDate` DATETIME(3) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `maxOffers` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PlacementDrive_companyId_idx`(`companyId`),
    INDEX `PlacementDrive_active_idx`(`active`),
    INDEX `PlacementDrive_driveDate_idx`(`driveDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `driveId` VARCHAR(191) NOT NULL,
    `status` ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'SELECTED', 'REJECTED') NOT NULL DEFAULT 'APPLIED',
    `appliedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Application_studentId_idx`(`studentId`),
    INDEX `Application_driveId_idx`(`driveId`),
    INDEX `Application_status_idx`(`status`),
    UNIQUE INDEX `Application_studentId_driveId_key`(`studentId`, `driveId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentInterest` ADD CONSTRAINT `StudentInterest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlacementDrive` ADD CONSTRAINT `PlacementDrive_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_driveId_fkey` FOREIGN KEY (`driveId`) REFERENCES `PlacementDrive`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

