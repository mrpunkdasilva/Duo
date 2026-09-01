export type ValidationStrategy<T> = {
  validate: (data: unknown) => ValidationResult<T>;
};

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
