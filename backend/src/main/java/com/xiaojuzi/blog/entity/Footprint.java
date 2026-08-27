package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 足迹实体
 */
@Data
@TableName("footprints")
public class Footprint {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String place;
    private Double lat;
    private Double lng;
    private String date;
    private String description;
    private String photo;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableLogic
    private Integer deleted;
}
