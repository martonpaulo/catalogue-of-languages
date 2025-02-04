import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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
}

export function ControlledSelect({
  name,
  label,
  control,
  defaultValue,
  options,
  renderOption,
  sx,
}: ControlledSelectProps) {
  return (
    <FormControl size="small" sx={{ width: "100%", ...sx }}>
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
    </FormControl>
  );
}
