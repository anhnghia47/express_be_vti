/*============================== CREATE DATABASE =======================================*/
/*======================================================================================*/
DROP DATABASE IF EXISTS TestingSystem;
CREATE DATABASE TestingSystem;
USE TestingSystem;
/*============================== CREATE TABLE=== =======================================*/
/*======================================================================================*/
-- create table 1: Department
DROP TABLE IF EXISTS Department;
CREATE TABLE Department(
    DepartmentID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    DepartmentName VARCHAR(30) NOT NULL UNIQUE KEY
);
-- create table 2: Posittion
DROP TABLE IF EXISTS Position;
CREATE TABLE `Position` (
    PositionID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    PositionName ENUM('Dev', 'Test', 'Scrum_Master', 'PM') NOT NULL UNIQUE KEY
);
-- create table 3: Account
DROP TABLE IF EXISTS `Account`;
CREATE TABLE `Account`(
    AccountID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(50) NOT NULL UNIQUE KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    FullName VARCHAR(50) NOT NULL,
    DepartmentID TINYINT UNSIGNED,
    PositionID TINYINT UNSIGNED,
    CreateDate DATETIME DEFAULT NOW(),
    `password` VARCHAR(800),
    `status` TINYINT DEFAULT 0,
    -- 0: Not Active, 1: Active
    `PathImage` VARCHAR(50),
    isAdmin BOOLEAN DEFAULT FALSE,
    FOREIGN KEY(DepartmentID) REFERENCES Department(DepartmentID),
    FOREIGN KEY(PositionID) REFERENCES `Position`(PositionID)
);
-- create table 4: Order
DROP TABLE IF EXISTS `Shipping_Order`;
CREATE TABLE `Shipping_Order`(
    orderID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    senderName VARCHAR(50) NOT NULL,
    senderAddress VARCHAR(255) NOT NULL,
    senderPhoneNumber VARCHAR(20) NOT NULL,
    packageType VARCHAR(10) NOT NULL,
    receiverName VARCHAR(50) NOT NULL,
    receiverAddress VARCHAR(255) NOT NULL,
    reveiverPhoneNumber VARCHAR(50) NOT NULL,
    createTime DATETIME DEFAULT NOW(),
    shippingFee VARCHAR(50),
    packageWeight VARCHAR(50),
    employeeSignatureImage VARCHAR(50),
    branchId TINYINT UNSIGNED,
    FOREIGN KEY(branchId) REFERENCES Shipping_Branch(branchId)
);

DROP TABLE IF EXISTS `Shipping_Branch`;
CREATE TABLE `Shipping_Branch`(
    branchId TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    brnachName VARCHAR(50) NOT NULL,
    branchAddress VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Manufacturer;
CREATE TABLE Manufacturer(
    ManufacturerId SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ManufacturerName ENUM('SAMSUNG', 'APPLE', 'XIAOMI', 'OPPO') NOT NULL UNIQUE KEY
);
DROP TABLE IF EXISTS Category;
CREATE TABLE Category(
    CategoryId SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(30) NOT NULL UNIQUE KEY
);
DROP TABLE IF EXISTS Product;
CREATE TABLE Product(
    ProductId SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(50) NOT NULL UNIQUE KEY,
    ProductPrice VARCHAR(50) NOT NULL,
    ProductInfo VARCHAR(200) NOT NULL,
    ProductDetail VARCHAR(500),
    RatingStar TINYINT UNSIGNED,
    ProductImage VARCHAR(50),
    ManufacturerId SMALLINT UNSIGNED,
    CategoryId SMALLINT UNSIGNED,
    FOREIGN KEY (ManufacturerId) REFERENCES Manufacturer(ManufacturerId),
    FOREIGN KEY (CategoryId) REFERENCES Category(CategoryId)
);
-- create table 5: Posittion
DROP TABLE IF EXISTS Product_Review;
CREATE TABLE Product_Review (
    reviewId TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ProductId SMALLINT UNSIGNED,
    AccountID TINYINT UNSIGNED,
    rating SMALLINT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Product(ProductId),
    FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);
DROP TABLE IF EXISTS `Registration_User_Token`;
CREATE TABLE IF NOT EXISTS `Registration_User_Token` (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `token` CHAR(36) NOT NULL UNIQUE,
    `user_id` SMALLINT UNSIGNED NOT NULL,
    `expiryDate` DATETIME NOT NULL
);
/*============================== INSERT DATABASE =======================================*/
/*======================================================================================*/
-- Add data Department
INSERT INTO Department(DepartmentName)
VALUES (N'Marketing'),
    (N'Sale'),
    (N'Bảo vệ'),
    (N'Nhân sự'),
    (N'Kỹ thuật'),
    (N'Tài chính'),
    (N'Phó giám đốc'),
    (N'Giám đốc'),
    (N'Thư kí'),
    (N'Bán hàng');
-- Add data position
INSERT INTO Position (PositionName)
VALUES ('Dev'),
    ('Test'),
    ('Scrum_Master'),
    ('PM');
-- Add data Account
INSERT INTO `Account`(
        Email,
        Username,
        FullName,
        DepartmentID,
        PositionID,
        CreateDate,
        `password`,
        status
    )
VALUES (
        'Email1@gmail.com',
        'Username1',
        'Fullname1',
        '2',
        '1',
        '2020-03-05',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    ),
    (
        'Email2@gmail.com',
        'Username2',
        'Fullname2',
        '1',
        '2',
        '2020-03-05',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    ),
    (
        'Email3@gmail.com',
        'Username3',
        'Fullname3',
        '2',
        '2',
        '2020-03-07',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    );
/*============================== INSERT DATABASE =======================================*/
/*======================================================================================*/
-- Add data Manufacturer
INSERT INTO Manufacturer (ManufacturerName)
VALUES ('SAMSUNG'),
    ('APPLE'),
    ('XIAOMI'),
    ('OPPO');
-- Add data Category
INSERT INTO Category(CategoryName)
VALUES ('Tablet'),
    ('Laptop');
-- Add data Product
INSERT INTO Product (
        ProductName,
        ProductPrice,
        ProductInfo,
        ProductDetail,
        RatingStar,
        ProductImage,
        ManufacturerId,
        CategoryId
    )
VALUES (
        'Samsung Galaxy S22 Ultra 5G',
        30990000,
        '6.9 inches, Chip MediaTek Helio G85 (12nm) mạnh mẽ, Ram 4G, Pin 7000 mAh ',
        'ProductDetail1',
        5,
        Null,
        '1',
        '1'
    ),
    (
        'Apple Mac mini M1 256GB',
        17500000,
        'Đa nhiệm tốt - Ram 8GB cho phép mở cùng lúc nhiều ứng dụng',
        'ProductDetail9',
        4,
        Null,
        '2',
        '2'
    );