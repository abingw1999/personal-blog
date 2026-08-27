package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 更新日志实体
 */
@Data
@TableName("changelog")
public class Changelog {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String title;
    private String content;
    private String type; // feature, fix, optimize, theme
    private String date;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableLogic
    private Integer deleted;
}
