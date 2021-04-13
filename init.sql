CREATE TABLE IF NOT EXISTS `Transactions` (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  `userId` VARCHAR(255) NOT NULL, 
  `amount` DECIMAL(10, 2),
  `type` ENUM ('debit', 'credit') NOT NULL,
  `category` ENUM ('gift', 'transportation', 'food', 'housing') NOT NULL,
  `icon_url` VARCHAR(255),
  `date_time` TIMESTAMP default NOW(),
  PRIMARY KEY (id)
);