import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Fragment } from "react";

import { LanguageType } from "@/features/languages/types/language.type";

interface LanguageDetailsProps {
  language: LanguageType;
}

export default function LanguageDetails({ language }: LanguageDetailsProps) {
  const details: React.ReactNode[] = [];

  if (language.alternateNames) {
    details.push(
      <Typography key="alternateNames" variant="body1">
        <strong>Alternate Names:</strong> {language.alternateNames}
      </Typography>
    );
  }

  if (language.dialects) {
    details.push(
      <Typography key="dialects" variant="body1">
        <strong>Dialects:</strong> {language.dialects}
      </Typography>
    );
  }

  if (language.statusNotes) {
    details.push(
      <Typography key="statusNotes" variant="body1">
        <strong>Status Notes:</strong> {language.statusNotes}
      </Typography>
    );
  }

  if (language.genealogy) {
    const genealogyItems = language.genealogy.split(", ");
    details.push(
      <Stack
        key="genealogy"
        direction="row"
        alignItems="center"
        flexWrap="wrap"
      >
        <Typography key="genealogy" mr={1}>
          <strong>Genealogy:</strong>{" "}
        </Typography>
        {genealogyItems.map((item, index) => (
          <Fragment key={item}>
            <Chip
              label={item}
              variant="outlined"
              size="small"
              sx={{ display: "inline-flex", marginY: 0.5 }}
            />
            {index < genealogyItems.length - 1 && (
              <KeyboardArrowRightIcon
                fontSize="small"
                sx={{
                  color: "text.secondary",
                  verticalAlign: "middle",
                }}
              />
            )}
          </Fragment>
        ))}
      </Stack>
    );
  }

  if (language.demographics) {
    details.push(
      <Typography key="demographics" variant="body1">
        <strong>Demographics:</strong> {language.demographics}
      </Typography>
    );
  }

  if (language.use) {
    details.push(
      <Typography key="languageUse" variant="body1">
        <strong>Language Use:</strong> {language.use}
      </Typography>
    );
  }

  if (language.development) {
    details.push(
      <Typography key="languageDevelopment" variant="body1">
        <strong>Language Development:</strong> {language.development}
      </Typography>
    );
  }

  if (language.typology) {
    details.push(
      <Typography key="typology" variant="body1">
        <strong>Typology:</strong> {language.typology}
      </Typography>
    );
  }

  if (language.description) {
    details.push(
      <Typography key="description" variant="body1">
        <strong>Description:</strong> {language.description}
      </Typography>
    );
  }

  if (language.spokenIn?.length) {
    details.push(
      <Typography key="spokenIn" variant="body1">
        <strong>Spoken In:</strong> {language.spokenIn.join(", ")}
      </Typography>
    );
  }

  if (language.writingSystem?.length) {
    details.push(
      <Typography key="writingSystem" variant="body1">
        <strong>Writing System:</strong> {language.writingSystem.join(", ")}
      </Typography>
    );
  }

  if (language.nationOfOrigin?.length) {
    details.push(
      <Typography key="nationOfOrigin" variant="body1">
        <strong>Nation of Origin:</strong> {language.nationOfOrigin.join(", ")}
      </Typography>
    );
  }

  if (language.comments) {
    details.push(
      <Typography key="comments" variant="body1">
        <strong>Other Comments:</strong> {language.comments}
      </Typography>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        {details.map((detail, index) => (
          <Box key={index} sx={index === 0 ? {} : { my: 2 }}>
            {detail}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
