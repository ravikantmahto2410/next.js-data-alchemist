import { ValidationError } from '@/lib/validators/clientValidator';

interface ValidationPanelProps {
  errors: ValidationError[];
}

export default function ValidationPanel({ errors }: ValidationPanelProps) {
  return (
    <div className="p-4 border bg-gray-100 rounded">
      <h2 className="text-lg font-bold mb-2">Validation Summary</h2>
      {errors.length === 0 ? (
        <p className="text-green-600">All data is valid!</p>
      ) : (
        <ul className="list-disc pl-5">
          {errors.map((error, index) => (
            <li key={index} className="text-red-600">
              Row {error.rowIndex + 1}, {error.field}: {error.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}