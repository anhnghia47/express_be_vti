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
    DepartmentName NVARCHAR(30) NOT NULL UNIQUE KEY
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
    FullName NVARCHAR(50) NOT NULL,
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
    reveiverPhoneNumber NVARCHAR(50) NOT NULL,
    createTime DATETIME DEFAULT NOW(),
    shippingFee VARCHAR(50),
    packageWeight VARCHAR(50),
    employeeSignatureImage VARCHAR(50)
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
        '5',
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
    ),
    (
        'Email4@gmail.com',
        'Username4',
        'Fullname4',
        '3',
        '4',
        '2020-03-08',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    ),
    (
        'Email5@gmail.com',
        'Username5',
        'Fullname5',
        '4',
        '4',
        '2020-03-10',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    ),
    (
        'Email6@gmail.com',
        'Username6',
        'Fullname6',
        '6',
        '3',
        '2020-04-05',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    ),
    (
        'Email7@gmail.com',
        'Username7',
        'Fullname7',
        '2',
        '2',
        '2020-04-05',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    ),
    (
        'Email8@gmail.com',
        'Username8',
        'Fullname8',
        '8',
        '1',
        '2020-04-07',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    ),
    (
        'Email9@gmail.com',
        'Username9',
        'Fullname9',
        '2',
        '2',
        '2020-04-07',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
    ),
    (
        'Email10@gmail.com',
        'Username10',
        'Fullname10',
        '10',
        '1',
        '2020-04-09',
        '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi',
        0
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
VALUES ('Điện thoại'),
    ('Tablet'),
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
        'Samsung Galaxy A52s 5G',
        9000000,
        'Hiệu năng ưu việt, đa nhiệm- Chip xử lí Snapdragon 778G 5G và RAM 8GB',
        'ProductDetail2',
        4,
        Null,
        '1',
        '1'
    ),
    (
        'Samsung Galaxy A72',
        10100000,
        'Màn hình Super AMOLED tần số quét 90Hz, độ sáng cao 800 nit.',
        'ProductDetail3',
        3,
        Null,
        '1',
        '1'
    ),
    (
        'iPhone 11 64GB I Chính hãng',
        11690000,
        'Hiệu năng mượt mà, ổn định - Chip A13, RAM 4GB',
        'ProductDetail4',
        4,
        Null,
        '2',
        '1'
    ),
    (
        'iPhone 13 Pro Max 128GB',
        29690000,
        'Hiệu năng vượt trội - Chip Apple A15 Bionic mạnh mẽ, hỗ trợ mạng 5G',
        'ProductDetail5',
        5,
        Null,
        '2',
        '1'
    ),
    (
        'Apple iPad Pro 11 2021',
        19990000,
        'Đỉnh cao công nghệ màn hình - Màn hình Liquid Retina, tần số quét 120Hz',
        'ProductDetail6',
        4,
        Null,
        '2',
        '2'
    ),
    (
        'Xiaomi Pad 5',
        8990000,
        'Thiết kế mỏng nhẹ, tinh tế - Thiết kế vuông vức, chỉ dày khoảng 7mm',
        'ProductDetail7',
        5,
        Null,
        '3',
        '2'
    ),
    (
        'Apple MacBook Pro 13',
        30300000,
        'Xử lý đồ hoạ mượt mà - Chip M1',
        'ProductDetail8',
        5,
        Null,
        '2',
        '3'
    ),
    (
        'Apple Mac mini M1 256GB',
        17500000,
        'Đa nhiệm tốt - Ram 8GB cho phép mở cùng lúc nhiều ứng dụng',
        'ProductDetail9',
        4,
        Null,
        '2',
        '3'
    );