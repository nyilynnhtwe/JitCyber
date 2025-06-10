// src/app/components/PasswordStrengthMeter.tsx
interface PasswordStrengthMeterProps {
  strength: number;
  color: string;
}

export default function PasswordStrengthMeter({ strength, color }: PasswordStrengthMeterProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${color}`}
        style={{ width: `${strength}%` }}
        role="progressbar"
        aria-valuenow={strength}
        aria-valuemin={0}       // Changed from "0"
        aria-valuemax={100}     // Changed from "100"
      ></div>
    </div>
  );
}