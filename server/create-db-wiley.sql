
DROP DATABASE IF EXISTS `wiley`;
CREATE DATABASE `wiley`;
USE `wiley`;


CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES (1,'Tessa','Brazda','402-326-6623','tessa.brazda@doane.edu');
INSERT INTO `users` VALUES (2,'John','Smith', null,'john.smith@doane.edu');


CREATE TABLE `app_statuses` (
  `app_status_id` tinyint(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`app_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `app_statuses` VALUES (1,'Submitted');
INSERT INTO `app_statuses` VALUES (2,'Approved, Not Paid');
INSERT INTO `app_statuses` VALUES (3,'Approved, Paid');
INSERT INTO `app_statuses` VALUES (4,'Rejected');

CREATE TABLE `app_budget` (
  `budget_id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` decimal(4,2) NOT NULL,
  `pay_by` date NOT NULL,
  `usage_description` varchar(2000) NOT NULL,
  PRIMARY KEY (`budget_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `app_budget` VALUES (1,0.00,'2022-12-15','Test Budget');

CREATE TABLE `apps` (
  `app_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `budget_id` int(11) NOT NULL,
  `app_date` date NOT NULL,
  `app_status_id` tinyint(4) NOT NULL DEFAULT '1',
  `summary` varchar(255) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `department` varchar(50) NOT NULL,
  `sponsor` varchar(50) DEFAULT NULL,
  `paid_date` date DEFAULT NULL,
  PRIMARY KEY (`app_id`),
  KEY `fk_apps_users_idx` (`user_id`),
  KEY `fk_apps_app_statuses_idx` (`app_status_id`),
  CONSTRAINT `fk_apps_users_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_apps_app_budget_idx` FOREIGN KEY (`budget_id`) REFERENCES `app_budget` (`budget_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_apps_app_status_id_idx` FOREIGN KEY (`app_status_id`) REFERENCES `app_statuses` (`app_status_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `apps` VALUES (1,2,1,'2022-11-14',1,'Test Submission',NULL,'Computer Science',NULL,NULL);
INSERT INTO `apps` VALUES (2,1,1,'2022-11-14',2,'Wiley Mini Grant Project','A full stack web app for grant application and management','Computer Science','Alec Engebretson',NULL);


CREATE TABLE `wiley`.`app_notes` (
  `note_id` INT NOT NULL,
  `app_Id` INT NOT NULL,
  `note` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`note_id`));

INSERT INTO `app_notes` (`note_id`, `app_Id`, `note`) VALUES ('1', '1', 'first note');
INSERT INTO `app_notes` (`note_id`, `app_Id`, `note`) VALUES ('2', '1', 'update budget');
