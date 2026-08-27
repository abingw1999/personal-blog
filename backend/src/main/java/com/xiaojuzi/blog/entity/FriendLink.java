package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 友情链接实体
 */
@Data
@TableName("friend_links")
public class FriendLink {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    private String url;
    private String avatar;
    private String description;
    private String category;
    private Integer sortOrder;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableLogic
    private Integer deleted;
}
