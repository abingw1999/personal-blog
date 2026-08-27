package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 音乐实体
 */
@Data
@TableName("music")
public class Music {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String title;
    private String artist;
    private String url;
    private String cover;
    private Integer sortOrder;
    private Boolean enabled;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
