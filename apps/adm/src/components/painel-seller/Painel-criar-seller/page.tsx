"use client";

import { useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/authFetch";

const GENRES = [
  "Ação", "Aventura", "Comédia", "Drama", "Ficção Científica",
  "Terror", "RPG", "Esportes", "Corrida", "Puzzle",
];

const MEDIA_TYPES = [
  { label: "Filme", value: "movie" },
  { label: "Jogo", value: "game" },
];

interface PhotoSlot {
  file: File | null;
  preview: string | null;
}

export default function PainelPostSeller() {
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [numParcelas, setNumParcelas] = useState("");
  const [mediaTypeId, setMediaTypeId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
  ]);

  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Valor por parcela
  const valorParcela =
    valor && numParcelas && Number(numParcelas) > 0
      ? (Number(valor) / Number(numParcelas)).toFixed(2)
      : "";

  function handlePhotoChange(index: number, file: File | null) {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotos((prev) => {
      const updated = [...prev];
      updated[index] = { file, preview };
      return updated;
    });
  }

  function handleRemovePhoto(index: number) {
    setPhotos((prev) => {
      const updated = [...prev];
      updated[index] = { file: null, preview: null };
      return updated;
    });
  }

  function handleClear() {
    setTitulo("");
    setGenero("");
    setTipo("");
    setDescricao("");
    setValor("");
    setNumParcelas("");
    setMediaTypeId("");
    setPhotos([
      { file: null, preview: null },
      { file: null, preview: null },
      { file: null, preview: null },
    ]);
  }

  async function handleSubmit() {
    if (!titulo || !valor || !tipo || !mediaTypeId) {
      alert("Preencha os campos obrigatórios: Título, Tipo, Valor e Tipo de Mídia.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create product
      const productRes = await authFetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: titulo,
          description: descricao,
          price: Number(valor),
          amount: 99,
          mediaTypeId: Number(mediaTypeId),
          maxInstallments: numParcelas ? Number(numParcelas) : 1,
          freeInstallments: 1,
        }),
      });

      if (!productRes.ok) throw new Error("Erro ao criar produto");
      const product = await productRes.json();

      // 2. Upload photos
      const photoFiles = photos.filter((p) => p.file !== null);
      if (photoFiles.length > 0) {
        const formData = new FormData();
        photoFiles.forEach((p) => formData.append("files", p.file as File));

        await authFetch(`/api/uploads/products/${product.id}`, {
          method: "POST",
          body: formData,
        });
      }

      alert("Produto cadastrado com sucesso!");
      handleClear();
    } catch (err: any) {
      alert(err.message || "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #D9A13B",
    borderRadius: "4px",
    padding: "10px 12px",
    backgroundColor: "#F2EFDC",
    fontSize: "14px",
    outline: "none",
    color: "#261F1A",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#261F1A",
    marginBottom: "4px",
  };

  return (
    <div
      style={{
        backgroundColor: "#f8c0b8",
        borderRadius: "12px",
        padding: "32px",
        maxWidth: "780px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Título */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Título:</label>
          <input style={inputStyle} value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        {/* Gênero */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Gênero:</label>
          <input
            list="generos"
            style={inputStyle}
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            placeholder="Ex: Ação"
          />
          <datalist id="generos">
            {GENRES.map((g) => <option key={g} value={g} />)}
          </datalist>
        </div>

        {/* Tipo (Mídia) */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Tipo:</label>
          <select
            style={{ ...inputStyle }}
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setMediaTypeId(e.target.value === "movie" ? 1 : 2);
            }}
          >
            <option value="">Selecione...</option>
            {MEDIA_TYPES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Descrição */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Descrição:</label>
          <input style={inputStyle} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
      </div>

      {/* Fotos Promocionais */}
      <div style={{ marginTop: "24px" }}>
        <label style={labelStyle}>Fotos Promocionais:</label>
        <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
          {photos.map((slot, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div
                onClick={() => fileRefs[i].current?.click()}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "8px",
                  backgroundColor: "#A6A39F55",
                  border: "2px dashed #A6A39F",
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {slot.preview ? (
                  <>
                    <img
                      src={slot.preview}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemovePhoto(i); }}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "#BF372A",
                        border: "none",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span style={{ color: "#A6A39F", fontSize: "28px" }}>+</span>
                )}
              </div>
              {i === 0 && (
                <span style={{ fontSize: "11px", color: "#261F1A", fontWeight: "bold" }}>Principal</span>
              )}
              <input
                ref={fileRefs[i]}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handlePhotoChange(i, e.target.files?.[0] ?? null)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Valor + Parcelas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Valor</label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            step="0.01"
            placeholder="R$ 0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Num. Parcelas:</label>
          <input
            style={inputStyle}
            type="number"
            min="1"
            max="24"
            placeholder="1"
            value={numParcelas}
            onChange={(e) => setNumParcelas(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Valor Parc.</label>
          <input
            style={{ ...inputStyle, backgroundColor: "#F2EFDC", color: "#A6A39F" }}
            readOnly
            value={valorParcela ? `R$ ${valorParcela}` : ""}
            placeholder="Calculado"
          />
        </div>
      </div>

      {/* Botões */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
        <button
          onClick={handleClear}
          style={{
            padding: "10px 28px",
            backgroundColor: "#A6A39F",
            color: "#F2EFDC",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          Limpar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 28px",
            backgroundColor: "#D9A13B",
            color: "#261F1A",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "bold",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Postando..." : "Postar"}
        </button>
      </div>
    </div>
  );
}