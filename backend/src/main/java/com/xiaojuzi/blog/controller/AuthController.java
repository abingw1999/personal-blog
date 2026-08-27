package com.xiaojuzi.blog.controller;

import com.xiaojuzi.blog.dto.LoginRequest;
import com.xiaojuzi.blog.dto.LoginResponse;
import com.xiaojuzi.blog.dto.Result;
import com.xiaojuzi.blog.entity.AdminUser;
import com.xiaojuzi.blog.mapper.AdminUserMapper;
import com.xiaojuzi.blog.util.JwtUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AdminUserMapper adminUserMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AdminUser user = adminUserMapper.selectOne(
            new LambdaQueryWrapper<AdminUser>()
                .eq(AdminUser::getUsername, request.getUsername())
                .eq(AdminUser::getEnabled, true)
        );
        
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return Result.error(401, "用户名或密码错误");
        }
        
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return Result.success(LoginResponse.of(token, user.getNickname(), user.getAvatar()));
    }
    
    /**
     * 验证Token
     */
    @GetMapping("/verify")
    public Result<Boolean> verify(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return Result.success(jwtUtil.validateToken(token));
        }
        return Result.success(false);
    }
}
