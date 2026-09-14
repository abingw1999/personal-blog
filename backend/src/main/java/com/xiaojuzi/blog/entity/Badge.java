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
    // 注意：表里的列名是 condition_desc（condition 是 MySQL 保留字，不能直接做列名），
    // 这里必须显式指定，否则 MyBatis-Plus 会按字段名生成 condition，查询时报 Unknown column
    @TableField("condition_desc")
    private String condition;
    private Integer sortOrder;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
