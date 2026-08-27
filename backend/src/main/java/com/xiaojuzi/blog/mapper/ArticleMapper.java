package com.xiaojuzi.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xiaojuzi.blog.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
    @Update("UPDATE articles SET views = views + 1 WHERE id = #{id} AND deleted = 0")
    void incrementViews(Long id);
}
