package com.xiaojuzi.blog.controller;

import com.xiaojuzi.blog.dto.Result;
import com.xiaojuzi.blog.entity.*;
import com.xiaojuzi.blog.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 管理后台控制器 - 需要认证
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
    
    // ===== 文章管理 =====
    @PostMapping("/articles")
    public Result<Article> createArticle(@RequestBody Article article) {
        articleMapper.insert(article);
        return Result.success(article);
    }
    
    @PutMapping("/articles/{id}")
    public Result<Article> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        article.setId(id);
        articleMapper.updateById(article);
        return Result.success(article);
    }
    
    @DeleteMapping("/articles/{id}")
    public Result<Void> deleteArticle(@PathVariable Long id) {
        articleMapper.deleteById(id);
        return Result.success();
    }
    
    // ===== 评论管理 =====
    @DeleteMapping("/comments/{id}")
    public Result<Void> deleteComment(@PathVariable Long id) {
        commentMapper.deleteById(id);
        return Result.success();
    }
    
    @PutMapping("/comments/{id}/approve")
    public Result<Void> approveComment(@PathVariable Long id) {
        Comment comment = commentMapper.selectById(id);
        if (comment != null) {
            comment.setApproved(true);
            commentMapper.updateById(comment);
        }
        return Result.success();
    }
    
    // ===== 友链管理 =====
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
    
    // ===== 商品管理 =====
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
    
    // ===== 音乐管理 =====
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
    
    // ===== Now状态管理 =====
    @PostMapping("/now-status")
    public Result<NowStatus> createNowStatus(@RequestBody NowStatus status) {
        nowStatusMapper.insert(status);
        return Result.success(status);
    }
    
    @PutMapping("/now-status/{id}")
    public Result<NowStatus> updateNowStatus(@PathVariable Long id, @RequestBody NowStatus status) {
        status.setId(id);
        nowStatusMapper.updateById(status);
        return Result.success(status);
    }
    
    @DeleteMapping("/now-status/{id}")
    public Result<Void> deleteNowStatus(@PathVariable Long id) {
        nowStatusMapper.deleteById(id);
        return Result.success();
    }
    
    // ===== 更新日志管理 =====
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
}
