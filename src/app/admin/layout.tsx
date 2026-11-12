export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#192230] antialiased">
      {children}
    </div>
  );
}
