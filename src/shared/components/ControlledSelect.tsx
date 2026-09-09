import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";

export interface Option {
  value: string;
  label?: string;
}

export interface ControlledSelectProps {
  name:
    | "code"
    | "name"
    | "status"
    | "spokenIn"
    | "writingSystem"
    | "nationOfOrigin";
  label: string;
  control: Control<LanguageFilterFormValues>;
  defaultValue: string | undefined;
  options: Option[];
  renderOption?: (option: Option) => React.ReactNode;
  sx?: object;
  /** The options are still being loaded, so the control cannot be used yet. */
  isLoading?: boolean;
  /** The options are unavailable, so the control cannot be used. */
  isDisabled?: boolean;
  /** Explains the control's state instead of leaving it looking empty or wrong. */
  errorMessage?: string;
}

export function ControlledSelect({
  name,
  label,
  control,
  defaultValue,
  options,
  renderOption,
  sx,
  isLoading = false,
  isDisabled = false,
  errorMessage,
}: ControlledSelectProps) {
  const unavailable = isLoading || isDisabled;
  const helperText = errorMessage ?? (isLoading ? `Loading ${label}…` : null);

  return (
    <FormControl
      size="small"
      sx={{ width: "100%", ...sx }}
      error={Boolean(errorMessage)}
      disabled={unavailable}
    >
      <InputLabel id={`${name}-label`} size="small">
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select labelId={`${name}-label`} label={label} {...field}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {renderOption
                  ? renderOption(option)
                  : option.label || option.value}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
