import { Container } from "@mui/material";
import type { Metadata } from "next";

import { AppThemeProvider } from "@/providers/AppThemeProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { poppins } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "Catalogue of Languages",
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
      <body className={poppins.variable}>
        <AppThemeProvider>
          <ReactQueryProvider>
            <Container>{children}</Container>
          </ReactQueryProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
