ALTER TABLE `users` DROP CONSTRAINT `users_role_id_roles_id_fkey`;--> statement-breakpoint
DROP INDEX `users_role_id_roles_id_fkey` ON `users`--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `name` TO `full_name`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `full_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `username` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `role_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `is_active`;