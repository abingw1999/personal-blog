package com.xiaojuzi.blog.controller;

import com.xiaojuzi.blog.dto.PageResult;
import com.xiaojuzi.blog.dto.Result;
import com.xiaojuzi.blog.entity.Article;
import com.xiaojuzi.blog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 文章控制器
 */
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    
    /**
     * 分页获取文章列表
     */
    @GetMapping
    public Result<PageResult<Article>> getArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        return Result.success(articleService.getArticles(page, size, category, keyword));
    }
    
    /**
     * 根据slug获取文章详情
     */
    @GetMapping("/{slug}")
    public Result<Article> getArticle(@PathVariable String slug) {
        Article article = articleService.getArticleBySlug(slug);
        if (article == null) {
            return Result.error(404, "文章不存在");
        }
        // 增加阅读量
        articleService.incrementViews(article.getId());
        return Result.success(article);
    }
    
    /**
     * 获取精选文章
     */
    @GetMapping("/featured")
    public Result<List<Article>> getFeaturedArticles() {
        return Result.success(articleService.getFeaturedArticles());
    }
    
    /**
     * 获取所有分类
     */
    @GetMapping("/categories")
    public Result<List<String>> getCategories() {
        return Result.success(articleService.getCategories());
    }
    
    /**
     * 获取随机文章
     */
    @GetMapping("/random")
    public Result<Article> getRandomArticle() {
        Article article = articleService.getRandomArticle();
        if (article == null) {
            return Result.error(404, "没有文章");
        }
        return Result.success(article);
    }
}
