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
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  LanguageFilterFormValues,
  languageFilterSchema,
} from "@/features/languages/components/languageFilters.schema";
import {
  DEFAULT_LANGUAGE_FILTERS,
  STATUS_OPTIONS,
} from "@/features/languages/utils/languageFiltersConstants";
import { useNations } from "@/features/nations/hooks/useNations";
import { useWritingSystems } from "@/features/writingSystems/hooks/useWritingSystems";
import { StatusChip } from "@/shared/components/StatusChip";
import {
  getStoredFilters,
  setStoredFilters,
} from "@/shared/utils/localStorageUtils";

interface LanguageFiltersProps {
  onFiltersChange: (filters: LanguageFilterFormValues) => void;
}

export function LanguageFilters({ onFiltersChange }: LanguageFiltersProps) {
  // Load stored filters or fall back to defaults
  const storedFilters = getStoredFilters("languageFilters");
  const initialFilters: LanguageFilterFormValues =
    storedFilters || DEFAULT_LANGUAGE_FILTERS;

  const { register, handleSubmit, reset } = useForm<LanguageFilterFormValues>({
    resolver: zodResolver(languageFilterSchema),
    defaultValues: initialFilters,
  });

  // Fetch nations and writing systems
  const { nations } = useNations();
  const { writingSystems } = useWritingSystems();

  const sortedNations = useMemo(
    () =>
      nations ? [...nations].sort((a, b) => a.name.localeCompare(b.name)) : [],
    [nations]
  );

  const sortedWritingSystems = useMemo(
    () =>
      writingSystems
        ? [...writingSystems].sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [writingSystems]
  );

  const onSubmit = useCallback(
    (data: LanguageFilterFormValues) => {
      setStoredFilters("languageFilters", data);
      onFiltersChange(data);
    },
    [onFiltersChange]
  );

  const handleReset = useCallback(() => {
    reset(DEFAULT_LANGUAGE_FILTERS);
    setStoredFilters("languageFilters", DEFAULT_LANGUAGE_FILTERS);
    onFiltersChange(DEFAULT_LANGUAGE_FILTERS);
  }, [onFiltersChange, reset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}
    >
      <TextField
        label="Language Code"
        helperText="Example: ENG"
        {...register("code")}
      />

      <TextField label="Language Name" {...register("name")} />

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select labelId="status-label" label="Status" {...register("status")}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              <StatusChip status={status} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="spokenIn-label">Country Where Spoken</InputLabel>
        <Select
          labelId="spokenIn-label"
          label="Country Where Spoken"
          {...register("spokenIn")}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {sortedNations.map((nation) => (
            <MenuItem key={nation.id} value={nation.name}>
              {nation.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="writingSystem-label">Writing System</InputLabel>
        <Select
          labelId="writingSystem-label"
          label="Writing System"
          {...register("writingSystem")}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {sortedWritingSystems.map((ws) => (
            <MenuItem key={ws.id} value={ws.name}>
              {ws.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="nationOfOrigin-label">Country of Origin</InputLabel>
        <Select
          labelId="nationOfOrigin-label"
          label="Country of Origin"
          {...register("nationOfOrigin")}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {sortedNations.map((nation) => (
            <MenuItem key={nation.id} value={nation.name}>
              {nation.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}
      >
        <Button type="submit" variant="contained" color="primary">
          Apply Filters
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
}
