"use client";

import { Box, Typography } from "@mui/material";

export function ProjectAttribution() {
  return (
    <Box>
      <Typography variant="body2" fontSize={10}>
        This data is made available by Wikitongues. For additional details about
        this project, visit{" "}
        <a
          href="https://www.martonpaulo.com/?utm_source=catalogue-of-languages"
          target="_blank"
          rel="noreferrer"
          style={{ color: "inherit" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
          onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}
        >
          martonpaulo.com
        </a>
        .
      </Typography>
    </Box>
  );
}
