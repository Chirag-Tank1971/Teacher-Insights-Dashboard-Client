
import "./globals.css";

export const metadata = {
  title: "Teacher Insights Dashboard",
  description: "Admin panel for teacher activity analytics"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

