-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'seller', 'user') NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photos` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `photos_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `genres_name_key`(`name`),
    INDEX `genres_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('movie', 'game') NOT NULL,
    `price` DECIMAL(5, 2) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `rating` DECIMAL(2, 1) NOT NULL,

    INDEX `products_name_idx`(`name`),
    INDEX `products_type_idx`(`type`),
    INDEX `products_price_idx`(`price`),
    INDEX `products_rating_idx`(`rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'paid', 'shipped', 'delivered', 'canceled') NOT NULL DEFAULT 'pending',
    `total_amount` DECIMAL(5, 2) NOT NULL,
    `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `address` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `price` DECIMAL(5, 2) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paid_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('pending', 'authorized', 'captured', 'failed', 'refunded') NOT NULL,
    `payment_method` ENUM('pix', 'boleto', 'debit_card', 'credit_card') NOT NULL,
    `installments` INTEGER NOT NULL DEFAULT 1,
    `order_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `payments_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GenreToProduct` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_GenreToProduct_AB_unique`(`A`, `B`),
    INDEX `_GenreToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `photos` ADD CONSTRAINT `photos_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photos` ADD CONSTRAINT `photos_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GenreToProduct` ADD CONSTRAINT `_GenreToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `genres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GenreToProduct` ADD CONSTRAINT `_GenreToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
