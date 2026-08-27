package com.xiaojuzi.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xiaojuzi.blog.entity.Comment;
import com.xiaojuzi.blog.mapper.CommentMapper;
import com.xiaojuzi.blog.util.SensitiveWordFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 评论服务
 */
@Service
public class CommentService {
    
    @Autowired
    private CommentMapper commentMapper;
    
    @Autowired
    private SensitiveWordFilter sensitiveWordFilter;
    
    @Autowired(required = false)
    private StringRedisTemplate redisTemplate;
    
    /**
     * 获取所有评论（树形结构）
     */
    public List<Comment> getComments() {
        // 获取所有顶级评论
        List<Comment> topComments = commentMapper.selectList(
            new LambdaQueryWrapper<Comment>()
                .isNull(Comment::getParentId)
                .eq(Comment::getApproved, true)
                .orderByDesc(Comment::getCreatedAt)
        );
        
        // 为每个顶级评论加载回复
        for (Comment comment : topComments) {
            List<Comment> replies = commentMapper.selectList(
                new LambdaQueryWrapper<Comment>()
                    .eq(Comment::getParentId, comment.getId())
                    .eq(Comment::getApproved, true)
                    .orderByAsc(Comment::getCreatedAt)
            );
            // 使用transient字段或DTO来避免序列化问题
        }
        
        return topComments;
    }
    
    /**
     * 创建评论
     */
    public Comment createComment(Comment comment, String ip) {
        // 检查敏感词
        if (sensitiveWordFilter.containsSensitiveWord(comment.getContent())) {
            throw new RuntimeException("评论包含敏感词，请修改后重新发布");
        }
        
        // 频率限制（使用Redis）
        if (redisTemplate != null) {
            String key = "comment:limit:" + ip;
            Long count = redisTemplate.opsForValue().increment(key);
            if (count == 1) {
                redisTemplate.expire(key, 60, TimeUnit.SECONDS);
            }
            if (count > 5) {
                throw new RuntimeException("评论过于频繁，请稍后再试");
            }
        }
        
        // 过滤敏感词
        comment.setContent(sensitiveWordFilter.filter(comment.getContent()));
        comment.setIp(ip);
        comment.setApproved(true); // 默认审核通过，可改为false需要站长审核
        
        commentMapper.insert(comment);
        return comment;
    }
    
    /**
     * 删除评论
     */
    public void deleteComment(Long id) {
        commentMapper.deleteById(id);
    }
    
    /**
     * 审核评论
     */
    public void approveComment(Long id) {
        Comment comment = commentMapper.selectById(id);
        if (comment != null) {
            comment.setApproved(true);
            commentMapper.updateById(comment);
        }
    }
}
