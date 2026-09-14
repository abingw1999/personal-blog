package com.xiaojuzi.blog.controller;

import com.xiaojuzi.blog.dto.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/**
 * 图片上传（仅管理端可用）
 *
 * 原项目只有 WebMvcConfig 把 /uploads/** 映射到磁盘目录做静态服务，
 * 没有接收上传的接口，所以后台想换封面只能去别处传好再粘外链。
 * 这里补上。
 *
 * 存储位置：{file.upload-path}/{yyyy}/{MM}/{uuid}.{ext}
 * 访问地址：/uploads/{yyyy}/{MM}/{uuid}.{ext}   —— 走 Nginx 反代到后端静态映射
 */
@RestController
@RequestMapping("/api/admin/upload")
public class UploadController {

    private static final Logger log = LoggerFactory.getLogger(UploadController.class);

    /** 允许的图片类型。不校验真实文件头，只认扩展名——内网自用够，公网上传场景要加 magic number 校验 */
    private static final List<String> ALLOWED_EXT = Arrays.asList(
            "jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "ico");

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB

    /** docker-compose 里 uploads 卷挂在 /app/uploads；本地直接跑时可用 FILE_UPLOAD_PATH 覆盖 */
    @Value("${file.upload-path:/app/uploads/}")
    private String uploadDir;

    @PostMapping
    public Result<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return Result.error(400, "没有选择文件");
        }
        if (file.getSize() > MAX_SIZE) {
            return Result.error(400, "图片不能超过 5MB");
        }

        String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) {
            ext = original.substring(dot + 1).toLowerCase(Locale.ROOT);
        }
        if (!ALLOWED_EXT.contains(ext)) {
            return Result.error(400, "只支持图片格式：" + String.join(" / ", ALLOWED_EXT));
        }

        // 按年月分目录，避免单目录堆几千个文件
        String sub = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        String filename = UUID.randomUUID().toString().replace("-", "") + "." + ext;

        try {
            Path dir = Paths.get(uploadDir, sub);
            Files.createDirectories(dir);
            Path target = dir.resolve(filename);
            file.transferTo(target.toFile());

            String url = "/uploads/" + sub + "/" + filename;
            log.info("图片已保存: {} ({} bytes)", target, file.getSize());

            Map<String, String> data = new HashMap<>();
            data.put("url", url);
            data.put("name", original);
            data.put("size", String.valueOf(file.getSize()));
            return Result.success(data);
        } catch (IOException e) {
            log.error("图片保存失败", e);
            return Result.error(500, "图片保存失败：" + e.getMessage());
        }
    }

    /**
     * 删除已上传的图片（传错图时清理用）。
     * 只允许删除 uploadDir 下的文件，并且显式拦截 ../，防止路径穿越。
     */
    @DeleteMapping
    public Result<Void> delete(@RequestParam("path") String path) {
        if (path == null || !path.startsWith("/uploads/")) {
            return Result.error(400, "只能删除 /uploads/ 下的文件");
        }
        String relative = path.substring("/uploads/".length());
        if (relative.contains("..") || relative.startsWith("/")) {
            return Result.error(400, "非法路径");
        }

        try {
            Path root = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path target = root.resolve(relative).normalize();
            if (!target.startsWith(root)) {
                return Result.error(400, "非法路径");
            }
            boolean removed = Files.deleteIfExists(target);
            return removed ? Result.success() : Result.error(404, "文件不存在");
        } catch (IOException e) {
            log.error("图片删除失败", e);
            return Result.error(500, "删除失败：" + e.getMessage());
        }
    }
}
