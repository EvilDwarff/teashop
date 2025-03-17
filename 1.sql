CREATE DATABASE TeaShop;
USE TeaShop;

-- Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Таблица продуктов (чаев)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    collection VARCHAR(255),
    price_per_gram DECIMAL(10,2),
    country VARCHAR(100),
    flavor TEXT,
    qualities TEXT,
    caffeine TEXT,
    allergens TEXT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Удаление таблиц в правильном порядке
DROP TABLE IF EXISTS cart_items; -- Сначала удаляем дочернюю таблицу
DROP TABLE IF EXISTS cart;

-- Создаем таблицу корзины ПЕРВОЙ
CREATE TABLE cart (
  id int NOT NULL AUTO_INCREMENT,
  id_user int NOT NULL,
  PRIMARY KEY (id),
  KEY id_user (id_user),
  CONSTRAINT cart_fk_user 
    FOREIGN KEY (id_user) 
    REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Создаем таблицу элементов корзины ПОСЛЕ основной таблицы
CREATE TABLE cart_items (
  id int NOT NULL AUTO_INCREMENT,
  cart_id int NOT NULL,
  product_id int NOT NULL,
  quantity int NOT NULL DEFAULT 1, 
  PRIMARY KEY (id),
  KEY cart_id (cart_id),
  KEY product_id (product_id),
  CONSTRAINT cart_items_fk_cart 
    FOREIGN KEY (cart_id) 
    REFERENCES cart(id) 
    ON DELETE CASCADE,
  CONSTRAINT cart_items_fk_product 
    FOREIGN KEY (product_id) 
    REFERENCES products(id) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT * FROM cart_items;

show tables;

drop table if exists `orders`;
CREATE TABLE `order` (
  id INT NOT NULL AUTO_INCREMENT,
  id_user INT NOT NULL,
  address TEXT NOT NULL,
  payment_method VARCHAR(255) NOT NULL,
  id_status INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_status) REFERENCES order_status (id) ON DELETE CASCADE ON UPDATE CASCADE
);


DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES `order` (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT TABLE_NAME FROM information_schema.tables 
WHERE table_schema = 'TeaShop';
SELECT TABLE_NAME FROM information_schema.tables 
WHERE table_schema = 'TeaShop';


DROP TABLE IF EXISTS `order_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

select * from products;
SHOW CREATE TABLE cart;

INSERT INTO products (image, name, collection, price_per_gram, country, flavor, qualities, caffeine, allergens) VALUES
-- Black Tea
('/products/black/1.jpg', 'Earl Grey', 'black tea', 0.04, 'Sri Lanka', 'Citrus, Bergamot', 'Rich, Aromatic', 'High', 'None'),
('/products/black/2.jpg', 'English Breakfast', 'black tea', 0.06, 'India', 'Malty, Strong', 'Full-bodied, Energizing', 'High', 'None'),
('/products/black/3.jpg', 'Assam Gold', 'black tea', 0.05, 'India', 'Bold, Malty', 'Smooth, Robust', 'High', 'None'),
('/products/black/4.jpg', 'Darjeeling First Flush', 'black tea', 0.08, 'India', 'Floral, Muscatel', 'Light, Refreshing', 'Medium', 'None'),
('/products/black/5.jpg', 'Lapsang Souchong', 'black tea', 0.03, 'China', 'Smoky, Pine', 'Strong, Unique', 'Medium', 'None'),
('/products/black/6.jpg', 'Keemun Mao Feng', 'black tea', 0.04, 'China', 'Chocolate, Winey', 'Smooth, Complex', 'Medium', 'None'),

-- Green Tea
('/products/green/1.jpg', 'Sencha', 'green tea', 0.03, 'Japan', 'Grassy, Sweet', 'Refreshing, Umami', 'Medium', 'None'),
('/products/green/2.jpg', 'Dragon Well', 'green tea', 0.05, 'China', 'Nutty, Sweet', 'Delicate, Smooth', 'Medium', 'None'),
('/products/green/3.jpg', 'Gunpowder Green', 'green tea', 0.07, 'China', 'Bold, Smoky', 'Strong, Lasting', 'High', 'None'),
('/products/green/4.jpg', 'Jasmine Pearls', 'green tea', 0.04, 'China', 'Floral, Fragrant', 'Delicate, Soothing', 'Medium', 'None'),
('/products/green/5.jpg', 'Matcha Ceremonial', 'green tea', 0.06, 'Japan', 'Umami, Sweet', 'Vibrant, Energizing', 'High', 'None'),
('/products/green/6.jpg', 'Genmaicha', 'green tea', 0.08, 'Japan', 'Toasty, Nutty', 'Comforting, Smooth', 'Medium', 'None'),

-- White Tea
('/products/white/1.jpg', 'Silver Needle', 'white teas', 0.03, 'China', 'Honey, Floral', 'Delicate, Smooth', 'Low', 'None'),
('/products/white/2.jpg', 'White Peony', 'white teas', 0.05, 'China', 'Mellow, Sweet', 'Refreshing, Light', 'Low', 'None'),
('/products/white/3.jpg', 'Moonlight White', 'white teas', 0.04, 'China', 'Fruity, Floral', 'Soft, Complex', 'Low', 'None'),
('/products/white/4.jpg', 'Darjeeling White', 'white teas', 0.05, 'India', 'Floral, Muscatel', 'Elegant, Crisp', 'Low', 'None'),
('/products/white/5.jpg', 'Shou Mei', 'white teas', 0.06, 'China', 'Earthy, Nutty', 'Bold, Smooth', 'Low', 'None'),
('/products/white/6.jpg', 'Bai Mu Dan', 'white teas', 0.04, 'China', 'Herbal, Fruity', 'Light, Aromatic', 'Low', 'None'),

-- Oolong Tea
('/products/oolong/1.jpg', 'Tie Guan Yin', 'oolong', 0.07, 'China', 'Floral, Creamy', 'Smooth, Refreshing', 'Medium', 'None'),
('/products/oolong/2.jpg', 'Da Hong Pao', 'oolong', 0.05, 'China', 'Roasty, Bold', 'Complex, Rich', 'Medium', 'None'),
('/products/oolong/3.jpg', 'Ali Shan', 'oolong', 0.03, 'Taiwan', 'Milky, Sweet', 'Velvety, Aromatic', 'Medium', 'None'),
('/products/oolong/4.jpg', 'Wuyi Rock Tea', 'oolong', 0.08, 'China', 'Mineral, Smoky', 'Strong, Roasted', 'Medium', 'None'),
('/products/oolong/5.jpg', 'Jin Xuan', 'oolong', 0.06, 'Taiwan', 'Butter, Floral', 'Creamy, Soft', 'Medium', 'None'),
('/products/oolong/6.jpg', 'Phoenix Dan Cong', 'oolong', 0.04, 'China', 'Fruity, Honey', 'Rich, Aromatic', 'Medium', 'None'),

-- Rooibos Tea
('/products/rooibos/1.jpg', 'Classic Rooibos', 'rooibos', 0.03, 'South Africa', 'Earthy, Sweet', 'Smooth, Caffeine-Free', 'None', 'None'),
('/products/rooibos/2.jpg', 'Vanilla Rooibos', 'rooibos', 0.04, 'South Africa', 'Vanilla, Creamy', 'Sweet, Relaxing', 'None', 'Vanilla'),
('/products/rooibos/3.jpg', 'Chai Rooibos', 'rooibos', 0.05, 'South Africa', 'Spicy, Bold', 'Warming, Full-bodied', 'None', 'Cinnamon, Cloves'),
('/products/rooibos/4.jpg', 'Honeybush', 'rooibos', 0.06, 'South Africa', 'Honey, Floral', 'Soft, Naturally Sweet', 'None', 'None'),
('/products/rooibos/5.jpg', 'Green Rooibos', 'rooibos', 0.05, 'South Africa', 'Fresh, Herbal', 'Light, Refreshing', 'None', 'None'),
('/products/rooibos/6.jpg', 'Citrus Rooibos', 'rooibos', 0.07, 'South Africa', 'Orange, Lemon', 'Bright, Zesty', 'None', 'Citrus'),

-- Red Tea
('/products/red/1.jpg', 'Pu-erh Ripe', 'red tea', 0.08, 'China', 'Earthy, Smooth', 'Rich, Aged', 'Medium', 'None'),
('/products/red/2.jpg', 'Pu-erh Raw', 'red tea', 0.05, 'China', 'Fruity, Fresh', 'Evolving, Crisp', 'Medium', 'None'),
('/products/red/3.jpg', 'Liu Bao', 'red tea', 0.04, 'China', 'Woody, Sweet', 'Smooth, Dark', 'Medium', 'None'),
('/products/red/4.jpg', 'Fu Zhuan Brick', 'red tea', 0.03, 'China', 'Mellow, Malty', 'Strong, Warming', 'Medium', 'None'),
('/products/red/5.jpg', 'Hunan Dark', 'red tea', 0.05, 'China', 'Nutty, Roasty', 'Aged, Complex', 'Medium', 'None'),
('/products/red/6.jpg', 'Yunnan Red', 'red tea', 0.04, 'China', 'Sweet, Bold', 'Robust, Smooth', 'Medium', 'None');

