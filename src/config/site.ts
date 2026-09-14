/**
 * 站点静态配置
 *
 * 站点名、头像、标语、社交链接这类是「站点自身」的信息，
 * 后端没有对应的表和接口，保留在前端维护即可（相当于静态站点配置）。
 * 想改这些值直接改这个文件，改完重新构建前端。
 */
import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  siteName: '小橘子的日常',
  siteDescription: '记录生活中的小确幸，分享有趣的知识与故事',
  avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=orange&backgroundColor=ffdfbf',
  nickname: '小橘子',
  tagline: '生活就像一盒巧克力，你永远不知道下一颗是什么味道 🍊',
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
    { name: 'Email', url: 'mailto:hello@example.com', icon: '📧' },
  ],
  announcements: ['🎉 网站全新上线啦！', '📝 正在学习 Vue3，记录学习笔记'],
  siteStartDate: '2024-01-01',
  shopEnabled: false,
}
