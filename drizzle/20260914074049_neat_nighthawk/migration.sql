CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(150) NOT NULL,
	`username` varchar(150) NOT NULL,
	`password` varchar(150) NOT NULL,
	`role_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `username_unique` UNIQUE INDEX(`username`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(100),
	`description` tinytext
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(100) NOT NULL,
	`description` tinytext NOT NULL
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` int,
	`permission_id` int
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`);--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`);--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`);