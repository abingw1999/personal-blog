package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 徽章实体
 */
@Data
@TableName("badges")
public class Badge {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    private String icon;
    private String description;
    private String condition;
    private Integer sortOrder;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
