"use client";

import { useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/authFetch";

const MEDIA_TYPES = [
  { label: "Filme", value: "movie", id: 1 },
  { label: "Jogo", value: "game", id: 2 },
];

interface PhotoSlot {
  id?: string;         // existing photo id from DB
  file: File | null;
  preview: string | null;
  isExisting: boolean;
}

interface Props {
  productId: string | null;
  onBack?: () => void;
}

export default function PainelEditSeller({ productId, onBack }: Props) {
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [numParcelas, setNumParcelas] = useState("");
  const [mediaTypeId, setMediaTypeId] = useState<number | "">("");
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { file: null, preview: null, isExisting: false },
    { file: null, preview: null, isExisting: false },
    { file: null, preview: null, isExisting: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const valorParcela =
    valor && numParcelas && Number(numParcelas) > 0
      ? (Number(valor) / Number(numParcelas)).toFixed(2)
      : "";

  // Load product data when productId changes
  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      setFetching(true);
      try {
        const res = await authFetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const product = await res.json();

        setTitulo(product.name ?? "");
        setDescricao(product.description ?? "");
        setValor(String(product.price ?? ""));
        setNumParcelas(String(product.maxInstallments ?? "1"));
        setMediaTypeId(product.mediaTypeId ?? "");
        setTipo(
          product.mediaType?.name === "movie" ? "movie" :
          product.mediaType?.name === "game" ? "game" : ""
        );

        // Map up to 3 existing photos into slots
        const existingPhotos: PhotoSlot[] = (product.photos ?? []).slice(0, 3).map(
          (p: { id: string; url: string }) => ({
            id: p.id,
            file: null,
            preview: p.url,
            isExisting: true,
          })
        );
        // Fill remaining slots
        while (existingPhotos.length < 3) {
          existingPhotos.push({ file: null, preview: null, isExisting: false });
        }
        setPhotos(existingPhotos);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setFetching(false);
      }
    }

    loadProduct();
  }, [productId]);

  function handlePhotoChange(index: number, file: File | null) {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotos((prev) => {
      const updated = [...prev];
      updated[index] = { file, preview, isExisting: false };
      return updated;
    });
  }

  async function handleRemovePhoto(index: number) {
    const slot = photos[index];

    if (slot.isExisting && slot.id) {
      await authFetch(`/api/uploads/photo/${slot.id}`, {
        method: "DELETE",
      });
    }

    setPhotos((prev) => {
      const updated = [...prev];
      updated[index] = { file: null, preview: null, isExisting: false };
      return updated;
    });
  }

  async function handleUpdate() {
    if (!productId) return;
    setLoading(true);
    try {
      // 1. Update product data
      const res = await authFetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: titulo,
          description: descricao,
          price: Number(valor),
          mediaTypeId: Number(mediaTypeId),
          maxInstallments: numParcelas ? Number(numParcelas) : 1,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar produto");

      // 2. Upload new photos
      const newPhotos = photos.filter((p) => !p.isExisting && p.file !== null);
      if (newPhotos.length > 0) {
        const formData = new FormData();
        newPhotos.forEach((p) => formData.append("files", p.file as File));
        await authFetch(`/api/uploads/products/${productId}`, {
          method: "POST",
          body: formData,
        });
      }

      alert("Produto atualizado com sucesso!");
      onBack?.();
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!productId) return;
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    setLoading(true);
    try {
      const res = await authFetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar produto");
      alert("Produto deletado com sucesso.");
      onBack?.();
    } catch (err: any) {
      alert(err.message || "Erro ao deletar produto");
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

  if (!productId) {
    return (
      <div
        style={{
          backgroundColor: "#f8c0b8",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "780px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
        }}
      >
        <p style={{ color: "#261F1A", fontSize: "16px" }}>
          Selecione um produto em "Seus produtos" para editar.
        </p>
      </div>
    );
  }

  if (fetching) {
    return (
      <div
        style={{
          backgroundColor: "#f8c0b8",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "780px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
        }}
      >
        <p style={{ color: "#261F1A", fontSize: "16px" }}>Carregando produto...</p>
      </div>
    );
  }

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
          <input style={inputStyle} value={genero} onChange={(e) => setGenero(e.target.value)} />
        </div>

        {/* Tipo */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Tipo:</label>
          <select
            style={inputStyle}
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

      {/* Fotos */}
      <div style={{ marginTop: "24px" }}>
        <label style={labelStyle}>Fotos Promocionais:</label>
        <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
          {photos.map((slot, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div
                onClick={() => !slot.preview && fileRefs[i].current?.click()}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "8px",
                  backgroundColor: "#A6A39F55",
                  border: "2px dashed #A6A39F",
                  cursor: slot.preview ? "default" : "pointer",
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
            value={numParcelas}
            onChange={(e) => setNumParcelas(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Valor Parc.</label>
          <input
            style={{ ...inputStyle, color: "#A6A39F" }}
            readOnly
            value={valorParcela ? `R$ ${valorParcela}` : ""}
            placeholder="Calculado"
          />
        </div>
      </div>

      {/* Botões */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: "10px 28px",
            backgroundColor: "#BF372A",
            color: "#F2EFDC",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "bold",
            opacity: loading ? 0.7 : 1,
          }}
        >
          Deletar
        </button>
        <button
          onClick={handleUpdate}
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
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>
    </div>
  );
}