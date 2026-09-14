package com.xiaojuzi.blog.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiaojuzi.blog.dto.PageResult;
import com.xiaojuzi.blog.dto.Result;
import com.xiaojuzi.blog.entity.*;
import com.xiaojuzi.blog.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 管理后台控制器 - 需要认证（/api/admin/** 在 SecurityConfig 里已要求 authenticated）
 *
 * 说明：这里直接用 Mapper，不走 Service——单表 CRUD 没有业务逻辑，
 * 加一层 Service 只会多一层转发。
 * 前台接口（DataController / CommentController）保持不变，
 * 管理端额外提供「能看见未启用/未审核数据」的列表接口。
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private ArticleMapper articleMapper;
    @Autowired private CommentMapper commentMapper;
    @Autowired private FriendLinkMapper friendLinkMapper;
    @Autowired private ProductMapper productMapper;
    @Autowired private MusicMapper musicMapper;
    @Autowired private CollectionMapper collectionMapper;
    @Autowired private NowStatusMapper nowStatusMapper;
    @Autowired private FootprintMapper footprintMapper;
    @Autowired private BadgeMapper badgeMapper;
    @Autowired private ChangelogMapper changelogMapper;
    @Autowired private VisitorBadgeMapper visitorBadgeMapper;
    @Autowired private AdminUserMapper adminUserMapper;
    @Autowired private PasswordEncoder passwordEncoder;

    // ==========================================================
    // 概览统计
    // ==========================================================

    /**
     * 后台首页的统计卡片数据。
     * 一次性返回，避免前端并发发十来个请求。
     */
    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        Map<String, Object> data = new HashMap<>();
        data.put("articles", articleMapper.selectCount(null));
        data.put("comments", commentMapper.selectCount(null));
        data.put("pendingComments", commentMapper.selectCount(
                new LambdaQueryWrapper<Comment>().eq(Comment::getApproved, false)));
        data.put("friends", friendLinkMapper.selectCount(null));
        data.put("products", productMapper.selectCount(null));
        data.put("music", musicMapper.selectCount(null));
        data.put("collections", collectionMapper.selectCount(null));
        data.put("nowStatus", nowStatusMapper.selectCount(null));
        data.put("footprints", footprintMapper.selectCount(null));
        data.put("badges", badgeMapper.selectCount(null));
        data.put("changelog", changelogMapper.selectCount(null));

        // 总阅读量
        List<Article> articles = articleMapper.selectList(null);
        int totalViews = articles.stream()
                .mapToInt(a -> a.getViews() == null ? 0 : a.getViews())
                .sum();
        data.put("totalViews", totalViews);

        // 最近 5 篇文章（后台首页快捷入口）
        data.put("recentArticles", articleMapper.selectList(
                new LambdaQueryWrapper<Article>()
                        .orderByDesc(Article::getCreatedAt)
                        .last("LIMIT 5")));

        return Result.success(data);
    }

    // ==========================================================
    // 文章管理
    // ==========================================================

    /**
     * 文章列表（分页）。与前台 /api/articles 的区别：
     * 支持按「精选 / 分类」筛选，且返回全文（后台编辑要用）。
     */
    @GetMapping("/articles")
    public Result<PageResult<Article>> listArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured) {

        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(Article::getTitle, keyword)
                    .or().like(Article::getSlug, keyword)
                    .or().like(Article::getExcerpt, keyword));
        }
        if (category != null && !category.isBlank()) {
            wrapper.eq(Article::getCategory, category);
        }
        if (featured != null) {
            wrapper.eq(Article::getFeatured, featured);
        }
        wrapper.orderByDesc(Article::getCreatedAt);

        Page<Article> pageObj = new Page<>(page, size);
        articleMapper.selectPage(pageObj, wrapper);
        return Result.success(PageResult.of(pageObj.getRecords(), pageObj.getTotal(), page, size));
    }

    /** 按主键取单篇（编辑回填用；前台是按 slug 取的） */
    @GetMapping("/articles/{id}")
    public Result<Article> getArticle(@PathVariable Long id) {
        return Result.success(articleMapper.selectById(id));
    }

    @PostMapping("/articles")
    public Result<Article> createArticle(@RequestBody Article article) {
        normalizeArticle(article);
        articleMapper.insert(article);
        return Result.success(article);
    }

    @PutMapping("/articles/{id}")
    public Result<Article> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        article.setId(id);
        // 这几个字段前端不传，置空以免被 updateById 覆盖成 null
        article.setViews(null);
        article.setDeleted(null);
        articleMapper.updateById(article);
        return Result.success(article);
    }

    @DeleteMapping("/articles/{id}")
    public Result<Void> deleteArticle(@PathVariable Long id) {
        articleMapper.deleteById(id);
        return Result.success();
    }

    /** 补默认值、统计字数、自动算阅读时长（按 400 字/分钟） */
    private void normalizeArticle(Article article) {
        if (article.getViews() == null) article.setViews(0);
        if (article.getFeatured() == null) article.setFeatured(false);

        String content = article.getContent() == null ? "" : article.getContent();
        int words = content.replaceAll("\\s", "").length();
        if (article.getWordCount() == null || article.getWordCount() == 0) {
            article.setWordCount(words);
        }
        if (article.getReadTime() == null || article.getReadTime() == 0) {
            article.setReadTime(Math.max(1, (int) Math.round(words / 400.0)));
        }
        if (article.getExcerpt() == null || article.getExcerpt().isBlank()) {
            String plain = content.replaceAll("[#*`>\\-\\[\\]()]", "").trim();
            article.setExcerpt(plain.length() > 80 ? plain.substring(0, 80) : plain);
        }
    }

    // ==========================================================
    // 留言管理
    // ==========================================================

    /**
     * 留言列表（含未审核）。前台 /api/comments 只返回 approved=true 的，
     * 后台必须能看到全部，否则没审核的留言无处可寻。
     */
    @GetMapping("/comments")
    public Result<List<Comment>> listComments() {
        List<Comment> all = commentMapper.selectList(
                new LambdaQueryWrapper<Comment>().orderByDesc(Comment::getCreatedAt));
        // 未审核的排在前面，方便处理
        all.sort((a, b) -> {
            boolean aPending = a.getApproved() == null || !a.getApproved();
            boolean bPending = b.getApproved() == null || !b.getApproved();
            if (aPending != bPending) return aPending ? -1 : 1;
            return 0;
        });
        return Result.success(all);
    }

    /** 审核通过 */
    @PutMapping("/comments/{id}/approve")
    public Result<Void> approveComment(@PathVariable Long id) {
        setApproved(id, true);
        return Result.success();
    }

    /** 驳回（打回未审核状态，前台不再展示） */
    @PutMapping("/comments/{id}/reject")
    public Result<Void> rejectComment(@PathVariable Long id) {
        setApproved(id, false);
        return Result.success();
    }

    @DeleteMapping("/comments/{id}")
    public Result<Void> deleteComment(@PathVariable Long id) {
        commentMapper.deleteById(id);
        return Result.success();
    }

    /**
     * 管理员回复留言。站长自己回复不需要审核，直接 approved=true。
     */
    @PostMapping("/comments/{id}/reply")
    public Result<Comment> replyComment(@PathVariable Long id, @RequestBody Comment payload) {
        Comment parent = commentMapper.selectById(id);
        if (parent == null) {
            return Result.error(404, "要回复的留言不存在");
        }
        Comment reply = new Comment();
        reply.setNickname(payload.getNickname() == null || payload.getNickname().isBlank()
                ? "站长" : payload.getNickname());
        reply.setAvatar(payload.getAvatar());
        reply.setContent(payload.getContent());
        reply.setEmoji(payload.getEmoji());
        // 统一挂到顶层留言下，避免出现三层嵌套（前台只渲染两级）
        reply.setParentId(parent.getParentId() == null ? parent.getId() : parent.getParentId());
        reply.setApproved(true);
        commentMapper.insert(reply);
        return Result.success(reply);
    }

    private void setApproved(Long id, boolean approved) {
        Comment comment = commentMapper.selectById(id);
        if (comment != null) {
            comment.setApproved(approved);
            commentMapper.updateById(comment);
        }
    }

    // ==========================================================
    // 友链管理
    // ==========================================================

    @GetMapping("/friends")
    public Result<List<FriendLink>> listFriends() {
        return Result.success(friendLinkMapper.selectList(
                new LambdaQueryWrapper<FriendLink>().orderByAsc(FriendLink::getSortOrder)));
    }

    @PostMapping("/friends")
    public Result<FriendLink> createFriend(@RequestBody FriendLink friend) {
        friendLinkMapper.insert(friend);
        return Result.success(friend);
    }

    @PutMapping("/friends/{id}")
    public Result<FriendLink> updateFriend(@PathVariable Long id, @RequestBody FriendLink friend) {
        friend.setId(id);
        friendLinkMapper.updateById(friend);
        return Result.success(friend);
    }

    @DeleteMapping("/friends/{id}")
    public Result<Void> deleteFriend(@PathVariable Long id) {
        friendLinkMapper.deleteById(id);
        return Result.success();
    }

    // ==========================================================
    // 商品橱窗
    // ==========================================================

    @GetMapping("/products")
    public Result<List<Product>> listProducts() {
        return Result.success(productMapper.selectList(
                new LambdaQueryWrapper<Product>().orderByAsc(Product::getSortOrder)));
    }

    @PostMapping("/products")
    public Result<Product> createProduct(@RequestBody Product product) {
        productMapper.insert(product);
        return Result.success(product);
    }

    @PutMapping("/products/{id}")
    public Result<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        productMapper.updateById(product);
        return Result.success(product);
    }

    @DeleteMapping("/products/{id}")
    public Result<Void> deleteProduct(@PathVariable Long id) {
        productMapper.deleteById(id);
        return Result.success();
    }

    // ==========================================================
    // 音乐
    // ==========================================================

    @GetMapping("/music")
    public Result<List<Music>> listMusic() {
        return Result.success(musicMapper.selectList(
                new LambdaQueryWrapper<Music>().orderByAsc(Music::getSortOrder)));
    }

    @PostMapping("/music")
    public Result<Music> createMusic(@RequestBody Music music) {
        musicMapper.insert(music);
        return Result.success(music);
    }

    @PutMapping("/music/{id}")
    public Result<Music> updateMusic(@PathVariable Long id, @RequestBody Music music) {
        music.setId(id);
        musicMapper.updateById(music);
        return Result.success(music);
    }

    @DeleteMapping("/music/{id}")
    public Result<Void> deleteMusic(@PathVariable Long id) {
        musicMapper.deleteById(id);
        return Result.success();
    }

    // ==========================================================
    // 收藏单（书 / 影 / 游戏）
    // ==========================================================

    @GetMapping("/collections")
    public Result<List<Collection>> listCollections(@RequestParam(required = false) String type) {
        LambdaQueryWrapper<Collection> wrapper = new LambdaQueryWrapper<>();
        if (type != null && !type.isBlank()) {
            wrapper.eq(Collection::getType, type);
        }
        wrapper.orderByAsc(Collection::getSortOrder);
        return Result.success(collectionMapper.selectList(wrapper));
    }

    @PostMapping("/collections")
    public Result<Collection> createCollection(@RequestBody Collection collection) {
        collectionMapper.insert(collection);
        return Result.success(collection);
    }

    @PutMapping("/collections/{id}")
    public Result<Collection> updateCollection(@PathVariable Long id, @RequestBody Collection collection) {
        collection.setId(id);
        collectionMapper.updateById(collection);
        return Result.success(collection);
    }

    @DeleteMapping("/collections/{id}")
    public Result<Void> deleteCollection(@PathVariable Long id) {
        collectionMapper.deleteById(id);
        return Result.success();
    }

    // ==========================================================
    // Now 状态
    // ==========================================================

    @GetMapping("/now-status")
    public Result<List<NowStatus>> listNowStatus() {
        return Result.success(nowStatusMapper.selectList(null));
    }

    @PostMapping("/now-status")
    public Result<NowStatus> createNowStatus(@RequestBody NowStatus status) {
        nowStatusMapper.insert(status);
        return Result.success(status);
    }

    @PutMapping("/now-status/{id}")
    public Result<NowStatus> updateNowStatus(@PathVariable Long id, @RequestBody NowStatus status) {
        status.setId(id);
        // updatedAt 是 @TableField(fill = INSERT) 自动填的，
        // 手动改一下才能体现「刚刚更新过」
        status.setUpdatedAt(LocalDateTime.now());
        nowStatusMapper.updateById(status);
        return Result.success(status);
    }

    @DeleteMapping("/now-status/{id}")
    public Result<Void> deleteNowStatus(@PathVariable Long id) {
        nowStatusMapper.deleteById(id);
        return Result.success();
    }

    // ==========================================================
    // 足迹
    // ==========================================================

    @GetMapping("/footprints")
    public Result<List<Footprint>> listFootprints() {
        return Result.success(footprintMapper.selectList(null));
    }

    @PostMapping("/footprints")
    public Result<Footprint> createFootprint(@RequestBody Footprint footprint) {
        footprintMapper.insert(footprint);
        return Result.success(footprint);
    }

    @PutMapping("/footprints/{id}")
    public Result<Footprint> updateFootprint(@PathVariable Long id, @RequestBody Footprint footprint) {
        footprint.setId(id);
        footprintMapper.updateById(footprint);
        return Result.success(footprint);
    }

    @DeleteMapping("/footprints/{id}")
    public Result<Void> deleteFootprint(@PathVariable Long id) {
        footprintMapper.deleteById(id);
        return Result.success();
    }

    // ==========================================================
    // 徽章
    // ==========================================================

    @GetMapping("/badges")
    public Result<List<Badge>> listBadges() {
        return Result.success(badgeMapper.selectList(
                new LambdaQueryWrapper<Badge>().orderByAsc(Badge::getSortOrder)));
    }

    @PostMapping("/badges")
    public Result<Badge> createBadge(@RequestBody Badge badge) {
        badgeMapper.insert(badge);
        return Result.success(badge);
    }

    @PutMapping("/badges/{id}")
    public Result<Badge> updateBadge(@PathVariable Long id, @RequestBody Badge badge) {
        badge.setId(id);
        badgeMapper.updateById(badge);
        return Result.success(badge);
    }

    @DeleteMapping("/badges/{id}")
    public Result<Void> deleteBadge(@PathVariable Long id) {
        badgeMapper.deleteById(id);
        // 同时清掉游客的获得记录，避免留下指向不存在徽章的脏数据
        visitorBadgeMapper.delete(
                new LambdaQueryWrapper<VisitorBadge>().eq(VisitorBadge::getBadgeId, id));
        return Result.success();
    }

    // ==========================================================
    // 建站日记（更新日志）
    // ==========================================================

    @GetMapping("/changelog")
    public Result<List<Changelog>> listChangelog() {
        return Result.success(changelogMapper.selectList(
                new LambdaQueryWrapper<Changelog>().orderByDesc(Changelog::getCreatedAt)));
    }

    @PostMapping("/changelog")
    public Result<Changelog> createChangelog(@RequestBody Changelog changelog) {
        changelogMapper.insert(changelog);
        return Result.success(changelog);
    }

    @PutMapping("/changelog/{id}")
    public Result<Changelog> updateChangelog(@PathVariable Long id, @RequestBody Changelog changelog) {
        changelog.setId(id);
        changelogMapper.updateById(changelog);
        return Result.success(changelog);
    }

    @DeleteMapping("/changelog/{id}")
    public Result<Void> deleteChangelog(@PathVariable Long id) {
        changelogMapper.deleteById(id);
        return Result.success();
    }

    // ==========================================================
    // 账号
    // ==========================================================

    /** 当前登录的管理员信息 */
    @GetMapping("/profile")
    public Result<AdminUser> profile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AdminUser user = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUser>().eq(AdminUser::getUsername, username));
        if (user != null) {
            // 密码哈希不下发到前端
            user.setPassword(null);
        }
        return Result.success(user);
    }

    /**
     * 修改密码。
     * 必须校验原密码 —— 否则 token 一旦泄漏，攻击者可以直接改掉密码把站长锁在门外。
     */
    @PutMapping("/password")
    public Result<Void> changePassword(@RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");

        if (newPassword == null || newPassword.length() < 6) {
            return Result.error(400, "新密码至少 6 位");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AdminUser user = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUser>().eq(AdminUser::getUsername, username));
        if (user == null) {
            return Result.error(404, "账号不存在");
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return Result.error(400, "原密码不正确");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        adminUserMapper.updateById(user);
        return Result.success();
    }
}
