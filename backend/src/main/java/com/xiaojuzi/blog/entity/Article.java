package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 文章实体
 */
@Data
@TableName("articles")
public class Article {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String slug;
    private String title;
    private String excerpt;
    
    @TableField("`content`")
    private String content;
    
    private String cover;
    private String category;
    private String tags; // JSON array
    private Integer readTime;
    private Integer wordCount;
    private Integer views;
    private Boolean featured;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer deleted;
}
