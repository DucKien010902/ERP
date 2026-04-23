'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/fields';
import { DEMO_ACCOUNTS, APP_NAME } from '@/lib/constants';
import { useToast } from '@/components/ui/toast-provider';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { login, session, loading } = useAuth();
  const [form, setForm] = useState({ email: 'admin@wmkalla.local', password: 'Admin@123' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      router.replace('/dashboard');
    }
  }, [loading, session, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success('Đăng nhập thành công', 'Chào mừng bạn quay lại hệ thống vật tư công trường.');
      router.replace('/dashboard');
    } catch (error) {
      toast.error('Đăng nhập thất bại', error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-sidebar)] px-4 py-8 text-white md:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900/70 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.35),transparent_22%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.2),transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-teal-100">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-400 font-bold text-slate-950">WM</span>
                {APP_NAME}
              </div>
              <h1 className="mt-8 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
                Giao diện quản lý vật tư công trường chuẩn doanh nghiệp lớn.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/85">
                Tối ưu cho một công ty có nhiều kho, nhiều công trình, chứng từ đầy đủ, RBAC theo vai trò và sẵn sàng mở rộng về sau.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['NestJS API đồng bộ', 'Form và trạng thái tương thích backend đã dựng.'],
                ['Dashboard điều hành', 'Theo dõi tồn kho, low stock, tiêu hao, nhập xuất.'],
                ['Single-company first', 'Không phức tạp hóa giao diện nhưng vẫn giữ nền tảng mở rộng.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-300">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="self-center rounded-[2rem] bg-white/95 backdrop-blur">
          <div className="grid gap-8 xl:grid-cols-1">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Đăng nhập</div>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Chào mừng trở lại</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Sử dụng tài khoản demo seed sẵn để kiểm tra dashboard, master data, nhập xuất tồn, hóa đơn và phân quyền.
              </p>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              <Input label="Mật khẩu" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              <Button type="submit" size="lg" loading={submitting}>Vào hệ thống</Button>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-900">Tài khoản demo nhanh</div>
              <div className="mt-4 grid gap-3">
                {DEMO_ACCOUNTS.map(([label, email, password]) => (
                  <button
                    type="button"
                    key={email}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-teal-200 hover:bg-teal-50"
                    onClick={() => setForm({ email, password })}
                  >
                    <div className="text-sm font-semibold text-slate-900">{label}</div>
                    <div className="mt-1 text-sm text-slate-500">{email}</div>
                    <div className="mt-2 text-xs text-slate-400">{password}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
