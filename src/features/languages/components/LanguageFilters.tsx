import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  LanguageFilterFormValues,
  languageFilterSchema,
} from "@/features/languages/components/languageFilters.schema";
import { LanguageStatusChip } from "@/features/languages/components/LanguageStatusChip";
import { LanguageStatusEnum } from "@/features/languages/types/languageStatus.enum";
import { DEFAULT_LANGUAGE_FILTERS } from "@/features/languages/utils/languageFiltersConstants";
import { useNations } from "@/features/nations/hooks/useNations";
import { useWritingSystems } from "@/features/writingSystems/hooks/useWritingSystems";
import { ControlledSelect } from "@/shared/components/ControlledSelect";
import {
  getStoredFilters,
  setStoredFilters,
} from "@/shared/utils/localStorageUtils";

interface LanguageFiltersProps {
  onFiltersChange: (filters: LanguageFilterFormValues) => void;
}

export function LanguageFilters({ onFiltersChange }: LanguageFiltersProps) {
  // Merge default filters with any persisted filters
  const persistedFilters = getStoredFilters("language-filters");
  const initialFilterValues: LanguageFilterFormValues = {
    ...DEFAULT_LANGUAGE_FILTERS,
    ...(persistedFilters || {}),
  };

  const { register, handleSubmit, reset, control } =
    useForm<LanguageFilterFormValues>({
      resolver: zodResolver(languageFilterSchema),
      defaultValues: initialFilterValues,
    });

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

  const handleFormSubmit = useCallback(
    (data: LanguageFilterFormValues) => {
      setStoredFilters("language-filters", data);
      onFiltersChange(data);
    },
    [onFiltersChange]
  );

  const handleFormReset = useCallback(() => {
    reset(DEFAULT_LANGUAGE_FILTERS);
    setStoredFilters("language-filters", DEFAULT_LANGUAGE_FILTERS);
    onFiltersChange(DEFAULT_LANGUAGE_FILTERS);
  }, [onFiltersChange, reset]);

  const statusOptions = useMemo(
    () =>
      Object.values(LanguageStatusEnum).map((status) => ({
        value: status,
      })),
    []
  );

  const nationOptions = useMemo(
    () =>
      sortedNations.map((nation) => ({
        value: nation.name,
        label: nation.name,
      })),
    [sortedNations]
  );

  const writingSystemOptions = useMemo(
    () =>
      sortedWritingSystems.map((ws) => ({
        value: ws.name,
        label: ws.name,
      })),
    [sortedWritingSystems]
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
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

      <ControlledSelect
        name="status"
        label="Status"
        control={control}
        defaultValue={initialFilterValues.status}
        options={statusOptions}
        renderOption={(option) => <LanguageStatusChip status={option.value} />}
      />

      <ControlledSelect
        name="spokenIn"
        label="Country Where Spoken"
        control={control}
        defaultValue={initialFilterValues.spokenIn}
        options={nationOptions}
      />

      <ControlledSelect
        name="writingSystem"
        label="Writing System"
        control={control}
        defaultValue={initialFilterValues.writingSystem}
        options={writingSystemOptions}
      />

      <ControlledSelect
        name="nationOfOrigin"
        label="Country of Origin"
        control={control}
        defaultValue={initialFilterValues.nationOfOrigin}
        options={nationOptions}
      />

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
          onClick={handleFormReset}
        >
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
}
