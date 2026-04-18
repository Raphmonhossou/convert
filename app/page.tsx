"use client";

import { ChangeEvent, useEffect, useState } from "react";

type HistoryEntry = {
  hex: string;
  decimal: string;
};

const sanitizeHex = (value: string) =>
  value.replace(/^0x/i, "").replace(/[^0-9a-f]/gi, "").toUpperCase();

const sanitizeDecimal = (value: string) => value.replace(/[^\d]/g, "");

const HISTORY_KEY = "convert-history";

export default function Home() {
  const [hexValue, setHexValue] = useState("FF");
  const [decimalValue, setDecimalValue] = useState("255");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState<"hex" | "decimal" | null>(null);
  const [reverseLayout, setReverseLayout] = useState(false);

  const handleHexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeHex(event.target.value);
    setHexValue(value);

    if (!value) {
      setDecimalValue("");
      return;
    }

    setDecimalValue(parseInt(value, 16).toString(10));
  };

  const handleDecimalChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeDecimal(event.target.value);
    setDecimalValue(value);

    if (!value) {
      setHexValue("");
      return;
    }

    setHexValue(Number.parseInt(value, 10).toString(16).toUpperCase());
  };

  useEffect(() => {
    const savedHistory = window.localStorage.getItem(HISTORY_KEY);

    if (!savedHistory) {
      return;
    }

    try {
      const parsed = JSON.parse(savedHistory) as HistoryEntry[];
      setHistory(parsed.slice(0, 8));
    } catch {
      window.localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  useEffect(() => {
    if (!hexValue || !decimalValue) {
      return;
    }

    setHistory((current) => {
      const nextEntry = { hex: `0x${hexValue}`, decimal: decimalValue };
      const nextHistory = [
        nextEntry,
        ...current.filter(
          (entry) =>
            entry.hex !== nextEntry.hex || entry.decimal !== nextEntry.decimal,
        ),
      ].slice(0, 8);

      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      return nextHistory;
    });
  }, [hexValue, decimalValue]);

  const copyValue = async (type: "hex" | "decimal") => {
    const value = type === "hex" ? `0x${hexValue}` : decimalValue;

    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied((current) => (current === type ? null : current)), 1600);
  };

  const panels = [
    {
      key: "hex",
      title: "Hexadécimal",
      hint: "Caractères autorisés : 0-9, A-F",
      prefix: "0x",
      placeholder: "1A3F",
      value: hexValue,
      onChange: handleHexChange,
      inputMode: "text" as const,
      copyType: "hex" as const,
    },
    {
      key: "decimal",
      title: "Décimal",
      hint: "Nombres entiers positifs",
      placeholder: "6719",
      value: decimalValue,
      onChange: handleDecimalChange,
      inputMode: "numeric" as const,
      copyType: "decimal" as const,
    },
  ];

  const orderedPanels = reverseLayout ? [...panels].reverse() : panels;

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Convertisseur de base</p>
          <h1>Hexadécimal ↔ Décimal</h1>
          <p className="lead">
            Saisis une valeur d&apos;un côté, l&apos;autre se met à jour
            instantanément.
          </p>
        </div>

        <div className="toolbar">
          <button
            type="button"
            className="ghost-button"
            onClick={() => setReverseLayout((current) => !current)}
          >
            Inverser les panneaux
          </button>
        </div>

        <div className={`converter-grid${reverseLayout ? " reverse" : ""}`}>
          {orderedPanels.map((panel) => (
            <label key={panel.key} className="panel">
              <span className="panel-title">{panel.title}</span>
              <span className="panel-hint">{panel.hint}</span>
              <div className="input-wrap">
                {panel.prefix ? <span className="prefix">{panel.prefix}</span> : null}
                <input
                  inputMode={panel.inputMode}
                  placeholder={panel.placeholder}
                  value={panel.value}
                  onChange={panel.onChange}
                />
              </div>
              <button
                type="button"
                className="copy-button"
                onClick={() => void copyValue(panel.copyType)}
              >
                {copied === panel.copyType ? "Copié" : "Copier"}
              </button>
            </label>
          ))}
        </div>

        <div className="result-bar">
          <div>
            <span className="result-label">Hex</span>
            <strong>{hexValue ? `0x${hexValue}` : "--"}</strong>
          </div>
          <div>
            <span className="result-label">Décimal</span>
            <strong>{decimalValue || "--"}</strong>
          </div>
        </div>

        <section className="history-panel">
          <div className="history-header">
            <div>
              <p className="eyebrow">Mémoire</p>
              <h2>Historique récent</h2>
            </div>
          </div>

          <div className="history-list">
            {history.length === 0 ? (
              <p className="history-empty">Aucune conversion enregistrée pour le moment.</p>
            ) : (
              history.map((entry) => (
                <button
                  type="button"
                  key={`${entry.hex}-${entry.decimal}`}
                  className="history-item"
                  onClick={() => {
                    setHexValue(entry.hex.replace(/^0x/i, ""));
                    setDecimalValue(entry.decimal);
                  }}
                >
                  <span>{entry.hex}</span>
                  <strong>{entry.decimal}</strong>
                </button>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
