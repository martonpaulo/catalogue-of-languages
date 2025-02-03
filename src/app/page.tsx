"use client";

import { Alert, Typography } from "@mui/material";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { ContentContainer } from "@/components/ContentContainer";
import { LanguagesTable } from "@/components/LanguagesTable";
import { useLanguages } from "@/hooks/useLanguages";

export default function Home() {
  const { ref, inView } = useInView();

  const {
    languages,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useLanguages();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <ContentContainer title="Home">
      {isLoading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : isError ? (
        <Alert severity="error">An error occurred</Alert>
      ) : (
        <>
          <LanguagesTable languages={languages} />
          {isFetchingNextPage && hasNextPage ? (
            <p className="text-center">Loading more posts...</p>
          ) : (
            <p className="text-center">No more posts found</p>
          )}

          <div ref={ref} />
        </>
      )}
    </ContentContainer>
  );
}
