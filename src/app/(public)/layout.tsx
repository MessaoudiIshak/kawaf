// Public Layout - Navbar + Footer
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
