package com.xiaojuzi.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 评论/留言实体
 */
@Data
@TableName("comments")
public class Comment {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String nickname;
    private String avatar;
    private String content;
    private String emoji;
    private Long parentId;
    private Boolean approved;
    private String ip;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableLogic
    private Integer deleted;
    
    /**
     * 子回复（非数据库字段）
     *
     * /api/comments 返回的是「主留言 + 内嵌 replies」的树形结构，
     * 前端留言板直接渲染这一层，无需再自己拼装。
     * exist = false 让 MyBatis-Plus 忽略该字段，不会参与 SQL 增删改查。
     */
    @TableField(exist = false)
    private List<Comment> replies = new ArrayList<>();
}
