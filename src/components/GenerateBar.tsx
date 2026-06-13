import React, { useState } from "react";

const PRESETS: { label: string; topic: string }[] = [
  { label: "Brand", topic: "the BlackCrown brand as a whole" },
  { label: "Korvus", topic: "Korvus Industries, the real-time market intel terminal" },
  { label: "Intelligence", topic: "BlackCrown Intelligence, the personal AI" },
  { label: "Collective", topic: "The Collective, the private network for operators" },
  { label: "Surprise me", topic: "any BlackCrown product or theme, your pick, make it fresh" },
];

export const GenerateBar: React.FC<{
  busy: boolean;
  error?: string | null;
  onGenerate: (topic: string) => void;
}> = ({ busy, error, onGenerate }) => {
  const [custom, setCustom] = useState("");

  return (
    <div className="genbar">
      <div className="genbar-head">
        <span className="eyebrow">Generate a new ad</span>
        {busy ? <span className="gen-busy">Claude is writing...</span> : null}
      </div>
      <div className="gen-presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="gen-pill"
            disabled={busy}
            onClick={() => onGenerate(p.topic)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="gen-custom">
        <input
          type="text"
          placeholder="Or describe an angle (optional)"
          value={custom}
          disabled={busy}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && custom.trim() && !busy) onGenerate(custom.trim());
          }}
        />
        <button
          className="gen-go"
          disabled={busy || !custom.trim()}
          onClick={() => onGenerate(custom.trim())}
        >
          Generate
        </button>
      </div>
      {error ? <div className="gen-error">{error}</div> : null}
    </div>
  );
};
