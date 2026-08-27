package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 收藏实体（书单/影单/游戏单）
 */
@Data
@TableName("collections")
public class Collection {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String type; // book, movie, game
    private String title;
    private String cover;
    private Integer rating;
    private String status;
    private String comment;
    private String link;
    private String completedAt;
    private Integer sortOrder;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableLogic
    private Integer deleted;
}
