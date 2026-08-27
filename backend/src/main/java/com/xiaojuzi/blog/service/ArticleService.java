package com.xiaojuzi.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiaojuzi.blog.dto.PageResult;
import com.xiaojuzi.blog.entity.Article;
import com.xiaojuzi.blog.mapper.ArticleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 文章服务
 */
@Service
public class ArticleService {
    
    @Autowired
    private ArticleMapper articleMapper;
    
    /**
     * 分页查询文章
     */
    public PageResult<Article> getArticles(int page, int size, String category, String keyword) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        
        if (category != null && !category.isEmpty() && !category.equals("全部")) {
            wrapper.eq(Article::getCategory, category);
        }
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like(Article::getTitle, keyword)
                    .or().like(Article::getExcerpt, keyword)
                    .or().like(Article::getTags, keyword));
        }
        
        wrapper.orderByDesc(Article::getCreatedAt);
        
        Page<Article> pageObj = new Page<>(page, size);
        articleMapper.selectPage(pageObj, wrapper);
        
        return PageResult.of(pageObj.getRecords(), pageObj.getTotal(), page, size);
    }
    
    /**
     * 根据slug获取文章
     */
    public Article getArticleBySlug(String slug) {
        return articleMapper.selectOne(new LambdaQueryWrapper<Article>().eq(Article::getSlug, slug));
    }
    
    /**
     * 获取精选文章
     */
    public List<Article> getFeaturedArticles() {
        return articleMapper.selectList(
            new LambdaQueryWrapper<Article>()
                .eq(Article::getFeatured, true)
                .orderByDesc(Article::getCreatedAt)
                .last("LIMIT 6")
        );
    }
    
    /**
     * 增加阅读量
     */
    public void incrementViews(Long id) {
        articleMapper.incrementViews(id);
    }
    
    /**
     * 获取所有分类
     */
    public List<String> getCategories() {
        return articleMapper.selectList(null)
                .stream()
                .map(Article::getCategory)
                .distinct()
                .toList();
    }
    
    /**
     * 获取随机文章
     */
    public Article getRandomArticle() {
        List<Article> articles = articleMapper.selectList(null);
        if (articles.isEmpty()) return null;
        int randomIndex = (int) (Math.random() * articles.size());
        return articles.get(randomIndex);
    }
    
    /**
     * 创建文章
     */
    public Article createArticle(Article article) {
        articleMapper.insert(article);
        return article;
    }
    
    /**
     * 更新文章
     */
    public Article updateArticle(Article article) {
        articleMapper.updateById(article);
        return article;
    }
    
    /**
     * 删除文章
     */
    public void deleteArticle(Long id) {
        articleMapper.deleteById(id);
    }
}
