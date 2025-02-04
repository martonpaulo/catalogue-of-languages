import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { useCallback, useMemo } from "react";
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

  const { register, handleSubmit, reset, control, watch } =
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

  const code = watch("code");
  const name = watch("name");
  const status = watch("status");
  const spokenIn = watch("spokenIn");
  const writingSystem = watch("writingSystem");
  const nationOfOrigin = watch("nationOfOrigin");

  const userHasEnteredFilters =
    code !== "" ||
    name !== "" ||
    status !== "" ||
    spokenIn !== "" ||
    writingSystem !== "" ||
    nationOfOrigin !== "";

  return (
    <Paper variant="outlined" sx={{ padding: 2 }}>
      <Stack
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        autoComplete="off"
        direction="column"
        spacing={2}
      >
        <Stack spacing={2} direction={{ mobile: "column", tablet: "row" }}>
          <TextField
            label="Language Code"
            helperText="Example: ENG"
            size="small"
            {...register("code")}
          />

          <TextField
            label="Language Name"
            fullWidth
            size="small"
            {...register("name")}
          />
        </Stack>

        <Stack
          spacing={2}
          direction={{ mobile: "column", tablet: "row" }}
          justifyContent="space-between"
        >
          <ControlledSelect
            name="status"
            label="Status"
            control={control}
            defaultValue={initialFilterValues.status}
            options={statusOptions}
            renderOption={(option) => (
              <LanguageStatusChip status={option.value} />
            )}
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
        </Stack>

        <Stack spacing={2} direction="row" justifyContent="flex-end" pt={2}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            disabled={!userHasEnteredFilters}
            onClick={handleFormReset}
            sx={{
              width: { mobile: "100%", tablet: "auto" },
            }}
          >
            Reset Filters
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!userHasEnteredFilters}
            sx={{
              width: { mobile: "100%", tablet: "auto" },
            }}
          >
            Apply Filters
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
