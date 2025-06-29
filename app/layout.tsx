import { SpeedInsights } from "@vercel/speed-insights/next";
import './globals.css'; // 导入全局样式

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 页面内容会自动注入这里 */}
        {children}
        
        {/* 添加性能监控 */}
        <SpeedInsights />
      </body>
    </html>
  );
}