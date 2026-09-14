package com.xiaojuzi.blog.exception;

import com.xiaojuzi.blog.dto.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.stream.Collectors;

/**
 * 全局异常处理
 *
 * 加这一层的原因：管理后台需要「能看懂的错误提示」。
 * 没有它的时候，任何异常都由 Spring 默认处理成 HTTP 500 + 一页 JSON，
 * 前端 request() 只能拿到「请求失败 (HTTP 500)」，站长看不出到底哪里错了
 * ——比如 slug 重复，其实应该明确告诉他「slug 已存在」。
 *
 * 约定：统一返回 HTTP 200 + Result{code, message}，
 * 让前端的错误提示逻辑只有一条路径（code !== 200 即失败）。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 唯一索引冲突：文章 slug 重复、后台账号 username 重复等。
     * 这是后台最高频的报错，单独处理成人话。
     */
    @ExceptionHandler(DuplicateKeyException.class)
    public Result<Void> handleDuplicateKey(DuplicateKeyException e) {
        String raw = e.getMessage() == null ? "" : e.getMessage();
        String field = raw.contains("slug") ? "slug（网址标识）"
                : raw.contains("username") ? "用户名"
                : "唯一字段";
        log.warn("唯一索引冲突: {}", raw);
        return Result.error(409, field + "已存在，请换一个");
    }

    /** @Valid 校验失败 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + " " + err.getDefaultMessage())
                .collect(Collectors.joining("；"));
        return Result.error(400, message.isEmpty() ? "参数校验失败" : message);
    }

    /** 请求体不是合法 JSON */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Result<Void> handleUnreadable(HttpMessageNotReadableException e) {
        return Result.error(400, "请求数据格式不正确");
    }

    /**
     * 上传文件超过 spring.servlet.multipart.max-file-size。
     * 不单独接住的话会走到兜底分支，前端只能看到「服务器内部错误」，
     * 而实际上只是图片太大了。
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public Result<Void> handleMaxUploadSize(MaxUploadSizeExceededException e) {
        return Result.error(400, "图片不能超过 5MB");
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public Result<Void> handleNotFound(NoHandlerFoundException e) {
        return Result.error(404, "接口不存在: " + e.getRequestURL());
    }

    /**
     * 业务异常。
     * 现有 Service 层用 RuntimeException 表达业务错误（敏感词、评论频率限制等），
     * 这里把 message 原样透出，前端才能提示到点子上。
     */
    @ExceptionHandler(RuntimeException.class)
    public Result<Void> handleRuntime(RuntimeException e) {
        log.warn("业务异常: {}", e.getMessage());
        String message = e.getMessage();
        return Result.error(500, (message == null || message.isBlank()) ? "操作失败" : message);
    }

    /** 兜底：不把堆栈暴露给前端，但要完整记进日志 */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("未处理异常", e);
        return Result.error(500, "服务器内部错误，请查看后端日志");
    }
}
