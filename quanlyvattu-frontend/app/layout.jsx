import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { APP_NAME } from '@/lib/constants';

export const metadata = {
  title: `${APP_NAME} · Enterprise Frontend`,
  description: 'Frontend quản lý vật tư công trường với Next.js và Tailwind CSS.',
  icons:'https://bizweb.dktcdn.net/thumb/grande/100/549/106/themes/1033623/assets/section_about_product_1.png?1770866881694'
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
