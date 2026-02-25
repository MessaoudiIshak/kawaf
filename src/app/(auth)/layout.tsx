// Auth Layout - Minimalist center-box wrapper
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
