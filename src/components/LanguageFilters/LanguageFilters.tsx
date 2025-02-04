import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

import { StatusChip } from "@/components/StatusChip";
import { useNations } from "@/hooks/useNations";
import { useWritingSystems } from "@/hooks/useWritingSystems";
import { getStoredFilters, setStoredFilters } from "@/utils/storage";

import {
  LanguageFilterFormValues,
  languageFilterSchema,
} from "./languageFilterSchema";

interface LanguageFiltersProps {
  onFiltersChange: (filters: LanguageFilterFormValues) => void;
}

export function LanguageFilters({ onFiltersChange }: LanguageFiltersProps) {
  // Retrieve stored filters from localStorage, if any
  const storedFilters = getStoredFilters("languageFilters");
  const initialValues: LanguageFilterFormValues = storedFilters || {};

  const { register, handleSubmit } = useForm<LanguageFilterFormValues>({
    resolver: zodResolver(languageFilterSchema),
    defaultValues: initialValues,
  });

  const { nations } = useNations();
  const { writingSystems } = useWritingSystems();

  // Change this to match the status options
  const statusOptions = ["Active", "Inactive", "Extinct", "Historical"];

  const onSubmit = (data: LanguageFilterFormValues) => {
    setStoredFilters("languageFilters", data);
    onFiltersChange(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}
      noValidate
      autoComplete="off"
    >
      {/* Language Code */}
      <TextField
        label="Language Code"
        {...register("code")}
        helperText="Example: ENG"
        inputProps={{ maxLength: 3 }}
      />

      {/* Language Name */}
      <TextField label="Language Name" {...register("name")} />

      {/* Language Status */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          label="Status"
          defaultValue=""
          {...register("status")}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              <StatusChip status={status} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Country Where Spoken */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="spokenIn-label">Country Where Spoken</InputLabel>
        <Select
          labelId="spokenIn-label"
          label="Country Where Spoken"
          defaultValue=""
          {...register("spokenIn")}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {nations?.map((nation) => (
            <MenuItem key={nation.id} value={nation.name}>
              {nation.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Writing System */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="writingSystem-label">Writing System</InputLabel>
        <Select
          labelId="writingSystem-label"
          label="Writing System"
          defaultValue=""
          {...register("writingSystem")}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {writingSystems?.map((ws) => (
            <MenuItem key={ws.id} value={ws.name}>
              {ws.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Nation of Origin */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="nationOfOrigin-label">Nation of Origin</InputLabel>
        <Select
          labelId="nationOfOrigin-label"
          label="Nation of Origin"
          defaultValue=""
          {...register("nationOfOrigin")}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {nations?.map((nation) => (
            <MenuItem key={nation.id} value={nation.name}>
              {nation.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Button type="submit" variant="contained" color="primary">
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
}
