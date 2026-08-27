package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 访客徽章关联实体
 */
@Data
@TableName("visitor_badges")
public class VisitorBadge {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String visitorId;
    private Long badgeId;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime earnedAt;
}
