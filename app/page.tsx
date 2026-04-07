"use client";

import { ChangeEvent, useState } from "react";

const sanitizeHex = (value: string) =>
  value.replace(/^0x/i, "").replace(/[^0-9a-f]/gi, "").toUpperCase();

const sanitizeDecimal = (value: string) => value.replace(/[^\d]/g, "");

export default function Home() {
  const [hexValue, setHexValue] = useState("FF");
  const [decimalValue, setDecimalValue] = useState("255");

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

        <div className="converter-grid">
          <label className="panel">
            <span className="panel-title">Hexadécimal</span>
            <span className="panel-hint">Caractères autorisés : 0-9, A-F</span>
            <div className="input-wrap">
              <span className="prefix">0x</span>
              <input
                inputMode="text"
                placeholder="1A3F"
                value={hexValue}
                onChange={handleHexChange}
              />
            </div>
          </label>

          <label className="panel">
            <span className="panel-title">Décimal</span>
            <span className="panel-hint">Nombres entiers positifs</span>
            <div className="input-wrap">
              <input
                inputMode="numeric"
                placeholder="6719"
                value={decimalValue}
                onChange={handleDecimalChange}
              />
            </div>
          </label>
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
      </section>
    </main>
  );
}
