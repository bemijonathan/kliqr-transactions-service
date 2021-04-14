CREATE TABLE IF NOT EXISTS `Transactions` (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED ,
  `amount` DECIMAL(10, 2),
  `type` ENUM ('debit', 'credit') NOT NULL,
  `category` VARCHAR(255),
  `icon_url` VARCHAR(255),
  `date_time` TIMESTAMP default NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(id)
);