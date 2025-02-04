import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  Typography,
} from "@mui/material";

import { LanguageType } from "@/types/language";

interface LanguageDetailsProps {
  language: LanguageType;
}

export default function LanguageDetails({ language }: LanguageDetailsProps) {
  return (
    <Card sx={{ maxWidth: 800, width: "100%", mx: "auto", my: 2, p: 1 }}>
      <CardContent>
        {language.alternateNames && (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1">Alternate Names:</Typography>
            <List disablePadding>
              {language.alternateNames.split(", ").map((name) => (
                <ListItem key={name} disableGutters>
                  <Typography variant="body2">{name}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box sx={{ my: 2 }}>
          <Typography variant="body1">
            <strong>Code:</strong> {language.code}
          </Typography>
        </Box>

        {language.dialects && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Dialects:</strong> {language.dialects}
            </Typography>
          </Box>
        )}

        {language.status && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Status:</strong> {language.status}
            </Typography>
          </Box>
        )}

        {language.statusNotes && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Status Notes:</strong> {language.statusNotes}
            </Typography>
          </Box>
        )}

        {language.genealogy && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Genealogy:</strong>{" "}
              {language.genealogy.split(", ").join(" > ")}
            </Typography>
          </Box>
        )}

        {language.demographics && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Demographics:</strong> {language.demographics}
            </Typography>
          </Box>
        )}

        {language.use && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Language Use:</strong> {language.use}
            </Typography>
          </Box>
        )}

        {language.development && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Language Development:</strong> {language.development}
            </Typography>
          </Box>
        )}

        {language.typology && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Typology:</strong> {language.typology}
            </Typography>
          </Box>
        )}

        {language.comments && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Comments:</strong> {language.comments}
            </Typography>
          </Box>
        )}

        {language.description && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Description:</strong> {language.description}
            </Typography>
          </Box>
        )}

        {language.spokenIn?.length ? (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Spoken In:</strong> {language.spokenIn.join(", ")}
            </Typography>
          </Box>
        ) : null}

        {language.writingSystem?.length ? (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Writing System:</strong>{" "}
              {language.writingSystem.join(", ")}
            </Typography>
          </Box>
        ) : null}

        {language.nationOfOrigin?.length ? (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Nation of Origin:</strong>{" "}
              {language.nationOfOrigin.join(", ")}
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}
