import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  LanguageFilterFormValues,
  languageFilterSchema,
} from "@/features/languages/components/languageFilters.schema";
import { LanguageStatusChip } from "@/features/languages/components/LanguageStatusChip";
import { useLanguageStatuses } from "@/features/languages/hooks/useLanguageStatuses";
import {
  DEFAULT_LANGUAGE_FILTERS,
  filtersAfterRefresh,
} from "@/features/languages/utils/languageFilters";
import { useNations } from "@/features/nations/hooks/useNations";
import { useWritingSystems } from "@/features/writingSystems/hooks/useWritingSystems";
import { ControlledSelect } from "@/shared/components/ControlledSelect";
import { setStoredFilters } from "@/shared/utils/localStorageUtils";

interface LanguageFiltersProps {
  onFiltersChange: (filters: LanguageFilterFormValues) => void;
}

export function LanguageFilters({ onFiltersChange }: LanguageFiltersProps) {
  const { register, handleSubmit, reset, control, formState } =
    useForm<LanguageFilterFormValues>({
      resolver: zodResolver(languageFilterSchema),
      defaultValues: filtersAfterRefresh(),
    });

  const { nations, nationsIsLoading, nationsIsError } = useNations();
  const { writingSystems, writingSystemsIsLoading, writingSystemsIsError } =
    useWritingSystems();

  const nationsErrorMessage = nationsIsError
    ? "Nations could not be loaded."
    : undefined;
  const writingSystemsErrorMessage = writingSystemsIsError
    ? "Writing systems could not be loaded."
    : undefined;

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

  const publishedStatuses = useLanguageStatuses();
  const selectedStatus = useWatch({ control, name: "status" });

  // A stored selection the current snapshot no longer publishes stays visible and
  // selectable, so the person can see why the catalogue looks empty and reset it.
  const unsupportedStatus =
    selectedStatus && !(publishedStatuses as string[]).includes(selectedStatus)
      ? selectedStatus
      : undefined;

  const statusOptions = useMemo(
    () => [
      ...publishedStatuses.map((status) => ({ value: status })),
      ...(unsupportedStatus ? [{ value: unsupportedStatus }] : []),
    ],
    [publishedStatuses, unsupportedStatus]
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
            size="small"
            error={!!formState.errors.code}
            helperText={formState.errors?.code?.message}
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
            defaultValue={filtersAfterRefresh().status}
            options={statusOptions}
            errorMessage={
              unsupportedStatus
                ? "This status is not in the current catalogue."
                : undefined
            }
            renderOption={(option) => (
              <LanguageStatusChip status={option.value} />
            )}
          />

          <ControlledSelect
            name="nationOfOrigin"
            label="Nation of Origin"
            control={control}
            defaultValue={filtersAfterRefresh().nationOfOrigin}
            options={nationOptions}
            isLoading={nationsIsLoading}
            isDisabled={nationsIsError}
            errorMessage={nationsErrorMessage}
          />

          <ControlledSelect
            name="writingSystem"
            label="Writing System"
            control={control}
            defaultValue={filtersAfterRefresh().writingSystem}
            options={writingSystemOptions}
            isLoading={writingSystemsIsLoading}
            isDisabled={writingSystemsIsError}
            errorMessage={writingSystemsErrorMessage}
          />

          <ControlledSelect
            name="spokenIn"
            label="Spoken In"
            control={control}
            defaultValue={filtersAfterRefresh().spokenIn}
            options={nationOptions}
            isLoading={nationsIsLoading}
            isDisabled={nationsIsError}
            errorMessage={nationsErrorMessage}
          />
        </Stack>

        <Stack spacing={2} direction="row" justifyContent="flex-end" pt={2}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
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
