import "./globals.css";
import { Providers } from "@/lib/providers";
export const metadata = {
  title: {
    default: "PeakHire — Smart Hiring, Simplified",
    template: "%s | PeakHire ATS",
  },
  description:
    "PeakHire is a full-featured Applicant Tracking System that connects top candidates with great companies. Smart hiring, simplified.",
  keywords: ["ATS", "applicant tracking", "hiring", "jobs", "recruitment"],
  openGraph: {
    type: "website",
    siteName: "PeakHire",
    title: "PeakHire — Smart Hiring, Simplified",
    description: "A full-featured Applicant Tracking System.",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
