package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Now状态实体
 */
@Data
@TableName("now_status")
public class NowStatus {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String category;
    private String icon;
    private String content;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime updatedAt;
}
