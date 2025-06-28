// lib/types/validationError.ts
export interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}