-- ============================================
-- 小橘子的日常 - 数据库初始化脚本
-- ============================================

CREATE DATABASE IF NOT EXISTS xiaojuzi_blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE xiaojuzi_blog;

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    cover VARCHAR(1000),
    category VARCHAR(100),
    tags VARCHAR(1000),
    read_time INT DEFAULT 0,
    word_count INT DEFAULT 0,
    views INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_category (category),
    INDEX idx_featured (featured),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 评论/留言表
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(100),
    avatar VARCHAR(1000),
    content TEXT,
    emoji VARCHAR(50),
    parent_id BIGINT DEFAULT NULL,
    approved BOOLEAN DEFAULT TRUE,
    ip VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_parent_id (parent_id),
    INDEX idx_approved (approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 友情链接表
CREATE TABLE IF NOT EXISTS friend_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    avatar VARCHAR(1000),
    description TEXT,
    category VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品表
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    image VARCHAR(1000),
    link VARCHAR(1000),
    category VARCHAR(100),
    recommended BOOLEAN DEFAULT FALSE,
    enabled BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 音乐表
CREATE TABLE IF NOT EXISTS music (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    artist VARCHAR(200),
    url VARCHAR(1000) NOT NULL,
    cover VARCHAR(1000),
    sort_order INT DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 收藏表（书单/影单/游戏单）
CREATE TABLE IF NOT EXISTS collections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL COMMENT 'book/movie/game',
    title VARCHAR(500) NOT NULL,
    cover VARCHAR(1000),
    rating INT DEFAULT 0,
    status VARCHAR(100),
    comment TEXT,
    link VARCHAR(1000),
    completed_at VARCHAR(50),
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Now状态表
CREATE TABLE IF NOT EXISTS now_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    content TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 足迹表
CREATE TABLE IF NOT EXISTS footprints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    place VARCHAR(200) NOT NULL,
    lat DOUBLE,
    lng DOUBLE,
    date VARCHAR(50),
    description TEXT,
    photo VARCHAR(1000),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 徽章表
CREATE TABLE IF NOT EXISTS badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    condition_desc VARCHAR(500),
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 访客徽章关联表
CREATE TABLE IF NOT EXISTS visitor_badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(100) NOT NULL,
    badge_id BIGINT NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_visitor (visitor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 更新日志表
CREATE TABLE IF NOT EXISTS changelog (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    type VARCHAR(50) COMMENT 'feature/fix/optimize/theme',
    date VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 管理员用户表
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    avatar VARCHAR(1000),
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 初始化示例数据
-- ============================================

-- 管理员（密码: admin123，BCrypt加密）
-- 注意：下方哈希是通过 BCryptPasswordEncoder 真实生成并验证过的（matches("admin123") == true）。
--      上线生产环境请务必改掉这个默认密码！
-- ON DUPLICATE KEY UPDATE 是为了让本文件在已初始化的库上重跑时也能刷新密码。
INSERT INTO admin_users (username, password, nickname, avatar) VALUES
('admin', '$2a$10$wjRxZVtI7a5rLHfkWDhANezSplyqOJHqoNVbsXNklWGF4b6k3ZjfG', '小橘子', 'https://api.dicebear.com/7.0/thumbs/svg?seed=orange')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- 示例文章
INSERT INTO articles (slug, title, excerpt, content, cover, category, tags, read_time, word_count, views, featured) VALUES
('hello-world', '你好，世界！', '这是我的第一篇博客', '# 你好世界\n\n这是我的第一篇博客文章。', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', '生活', '["随笔","开始"]', 3, 520, 128, TRUE),
('vue3-notes', 'Vue3 学习笔记', 'Composition API 入门', '# Vue3\n\n## setup函数\n\n使用ref和reactive创建响应式数据。', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', '知识', '["Vue3","前端"]', 8, 1500, 256, TRUE),
('indie-games', '独立游戏推荐', '2024年值得一玩的独立游戏', '# 独立游戏\n\n## Celeste\n\n关于攀登的像素游戏。', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', '游戏', '["独立游戏","推荐"]', 6, 1100, 342, TRUE);

-- 示例友链
INSERT INTO friend_links (name, url, avatar, description, category, sort_order) VALUES
('小明技术博客', 'https://example.com/xiaoming', 'https://api.dicebear.com/7.0/thumbs/svg?seed=xiaoming', '专注前端开发', '技术博客', 1),
('旅行日记', 'https://example.com/travel', 'https://api.dicebear.com/7.0/thumbs/svg?seed=travel', '用镜头记录世界', '生活分享', 2);

-- 示例音乐
INSERT INTO music (title, artist, url, cover, sort_order, enabled) VALUES
('A Little Story', 'Valentin', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100', 1, TRUE),
('Spring In My Step', 'Silent Partner', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100', 2, TRUE);

-- 示例徽章
INSERT INTO badges (name, icon, description, condition_desc, sort_order) VALUES
('初来乍到', '🌱', '首次访问网站', '访问网站', 1),
('话痨达人', '💬', '首次留言', '发表第一条留言', 2),
('阅读者', '📖', '阅读10篇文章', '阅读10篇文章', 3),
('社交达人', '🤝', '留言被回复5次', '留言被回复5次', 4),
('铁杆粉丝', '⭐', '连续访问7天', '连续访问7天', 5);
