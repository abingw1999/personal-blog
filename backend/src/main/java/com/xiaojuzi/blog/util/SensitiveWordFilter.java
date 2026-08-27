package com.xiaojuzi.blog.util;

import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

/**
 * 敏感词过滤器
 */
@Component
public class SensitiveWordFilter {
    
    private static final List<String> SENSITIVE_WORDS = Arrays.asList(
            "垃圾", "傻逼", "操你", "妈的", "去死", "fuck", "shit", "damn"
    );
    
    /**
     * 检查文本是否包含敏感词
     */
    public boolean containsSensitiveWord(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        String lowerText = text.toLowerCase();
        return SENSITIVE_WORDS.stream().anyMatch(lowerText::contains);
    }
    
    /**
     * 过滤敏感词
     */
    public String filter(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        String result = text;
        for (String word : SENSITIVE_WORDS) {
            result = result.replaceAll("(?i)" + word, "***");
        }
        return result;
    }
}
