import React from "react";

export const Switch: React.FC<{
  on: boolean;
  label: string;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = ({ on, label, onChange, disabled }) => (
  <label className={`switch${disabled ? " sw-dis" : ""}`}>
    <input
      type="checkbox"
      checked={on}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="sw-track">
      <span className="sw-knob" />
    </span>
    <span className="sw-label">{label}</span>
  </label>
);
