"use client";
import { Field, FieldError } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { twMerge } from "tailwind-merge";
import { Input } from "./input";
import { Label } from "../ui/label";

type LabeledInputProps = React.ComponentProps<typeof Input> & {
  className?: string;
  type?: "text" | "textarea" | "password";
  label: string;
  control: any;
  name: string;
  rows?: number;
  ref?: React.Ref<HTMLInputElement>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => boolean;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function LabeledInput(props: LabeledInputProps) {
  const {
    className = "",
    rows = 6,
    type = "text",
    name,
    control,
    label,
    onInput,
    ...inputProps
  } = props;

  const get_text = (type: string) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field className="gap-1" data-invalid={fieldState.invalid}>
            <Label
              className={twMerge("text-stone-500", className)}
              htmlFor={`form-${label.toLowerCase()}`}
            >
              {label.toLocaleUpperCase()}
            </Label>
            <Input
              id={`form-${label.toLowerCase()}`}
              className={twMerge(
                "border-stone-300 bg-stone-50 border rounded-sm text-black",
                className,
              )}
              aria-invalid={fieldState.invalid}
              placeholder={label}
              autoComplete="off"
              autoFocus={inputProps.autoFocus}
              disabled={inputProps.disabled}
              type={type}
              {...field}
              value={field.value ?? ""}
              ref={props.ref ?? field.ref}
              onKeyDown={props.onKeyDown}
              onInput={onInput}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  };

  const get_text_area = () => {
    return (
      <div className="grid w-full  items-center gap-3">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <Label
                className="label-text"
                htmlFor={`form-${label.toLowerCase()}`}
              >
                {label.toLocaleUpperCase()}
              </Label>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id={`form-${label.toLowerCase()}`}
                  placeholder={label}
                  rows={rows}
                  className="min-h-24  border-stone-300 border rounded-sm resize-none input-text bg-stone-50"
                  aria-invalid={fieldState.invalid}
                  disabled={inputProps.disabled}
                  value={field.value ?? ""}
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    );
  };

  const get = () => {
    switch (type) {
      case "text":
      case "password":
        return get_text(type);
      case "textarea":
        return get_text_area();
    }
  };
  return get();
}
