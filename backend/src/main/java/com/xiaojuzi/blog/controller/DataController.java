package com.xiaojuzi.blog.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xiaojuzi.blog.dto.Result;
import com.xiaojuzi.blog.entity.*;
import com.xiaojuzi.blog.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 数据控制器 - 提供前端所需的各种数据
 */
@RestController
@RequestMapping("/api")
public class DataController {
    
    @Autowired private FriendLinkMapper friendLinkMapper;
    @Autowired private ProductMapper productMapper;
    @Autowired private MusicMapper musicMapper;
    @Autowired private CollectionMapper collectionMapper;
    @Autowired private NowStatusMapper nowStatusMapper;
    @Autowired private FootprintMapper footprintMapper;
    @Autowired private BadgeMapper badgeMapper;
    @Autowired private ChangelogMapper changelogMapper;
    
    // ===== 友情链接 =====
    @GetMapping("/friends")
    public Result<List<FriendLink>> getFriends() {
        return Result.success(friendLinkMapper.selectList(
            new LambdaQueryWrapper<FriendLink>().orderByAsc(FriendLink::getSortOrder)));
    }
    
    // ===== 商品橱窗 =====
    @GetMapping("/products")
    public Result<List<Product>> getProducts() {
        return Result.success(productMapper.selectList(
            new LambdaQueryWrapper<Product>().eq(Product::getEnabled, true).orderByAsc(Product::getSortOrder)));
    }
    
    // ===== 音乐列表 =====
    @GetMapping("/music")
    public Result<List<Music>> getMusic() {
        return Result.success(musicMapper.selectList(
            new LambdaQueryWrapper<Music>().eq(Music::getEnabled, true).orderByAsc(Music::getSortOrder)));
    }
    
    // ===== 收藏单 =====
    @GetMapping("/collections")
    public Result<List<Collection>> getCollections(@RequestParam(required = false) String type) {
        LambdaQueryWrapper<Collection> wrapper = new LambdaQueryWrapper<>();
        if (type != null && !type.isEmpty()) {
            wrapper.eq(Collection::getType, type);
        }
        wrapper.orderByAsc(Collection::getSortOrder);
        return Result.success(collectionMapper.selectList(wrapper));
    }
    
    // ===== Now状态 =====
    @GetMapping("/now-status")
    public Result<List<NowStatus>> getNowStatus() {
        return Result.success(nowStatusMapper.selectList(null));
    }
    
    // ===== 足迹 =====
    @GetMapping("/footprints")
    public Result<List<Footprint>> getFootprints() {
        return Result.success(footprintMapper.selectList(null));
    }
    
    // ===== 徽章 =====
    @GetMapping("/badges")
    public Result<List<Badge>> getBadges() {
        return Result.success(badgeMapper.selectList(
            new LambdaQueryWrapper<Badge>().orderByAsc(Badge::getSortOrder)));
    }
    
    // ===== 更新日志 =====
    @GetMapping("/changelog")
    public Result<List<Changelog>> getChangelog() {
        return Result.success(changelogMapper.selectList(
            new LambdaQueryWrapper<Changelog>().orderByDesc(Changelog::getCreatedAt)));
    }
}
