import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Great Catalogue of Languages",
  description:
    "Interactive table featuring all documented languages from the Wikitongues database.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
