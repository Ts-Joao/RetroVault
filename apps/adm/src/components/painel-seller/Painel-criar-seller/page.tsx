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

      const photoFiles = photos.filter((p) => p.file !== null);
      if (photoFiles.length > 0) {
      const formData = new FormData();

      photoFiles.forEach((photo) => {
  formData.append("files", photo.file as File);
});

    const uploadRes = await authFetch(
    `/api/uploads/products/${product.id}`,
    {
      method: "POST",
      body: formData,
    }
  );

  console.log(await uploadRes.json());
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
  <div className="max-w-[780px] rounded-xl bg-[#f8c0b8] p-8">
    <div className="grid grid-cols-2 gap-5">
      <div className="flex flex-col">
        <label className="mb-1 text-[13px] font-bold text-[#261F1A]">
          Título:
        </label>

        <input
          className="w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-[13px] font-bold text-[#261F1A]">
          Gênero:
        </label>

        <input
          list="generos"
          className="w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          placeholder="Ex: Ação"
        />

        <datalist id="generos">
          {GENRES.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-[13px] font-bold text-[#261F1A]">
          Tipo:
        </label>

        <select
          className="w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none"
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setMediaTypeId(e.target.value === "movie" ? 1 : 2);
          }}
        >
          <option value="">Selecione...</option>

          {MEDIA_TYPES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-[13px] font-bold text-[#261F1A]">
          Descrição:
        </label>

        <input
          className="w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>
    </div>

    <div className="mt-6">
      <label className="mb-1 block text-[13px] font-bold text-[#261F1A]">
        Fotos Promocionais:
      </label>

      <div className="mt-2 flex flex-wrap gap-4">
        {photos.map((slot, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              onClick={() => fileRefs[i].current?.click()}
              className="relative flex h-[120px] w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#A6A39F] bg-[#A6A39F55]"
            >
              {slot.preview ? (
                <>
                  <img
                    src={slot.preview}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(i);
                    }}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#BF372A] text-[11px] text-white"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span className="text-[28px] text-[#A6A39F]">
                  +
                </span>
              )}
            </div>

            {i === 0 && (
              <span className="text-[11px] font-bold text-[#261F1A]">
                Principal
              </span>
            )}

            <input
              ref={fileRefs[i]}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handlePhotoChange(
                  i,
                  e.target.files?.[0] ?? null
                )
              }
            />
          </div>
        ))}
      </div>
    </div>

    <div className="mt-6 grid grid-cols-3 gap-5">
      <div className="flex flex-col">
        <label className="mb-1 text-[13px] font-bold text-[#261F1A]">
          Valor
        </label>

        <input
          className="w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none"
          type="number"
          min="0"
          step="0.01"
          placeholder="R$ 0,00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-[13px] font-bold text-[#261F1A]">
          Num. Parcelas:
        </label>

        <input
          className="w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none"
          type="number"
          min="1"
          max="24"
          placeholder="1"
          value={numParcelas}
          onChange={(e) => setNumParcelas(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-[13px] font-bold text-[#261F1A]">
          Valor Parc.
        </label>

        <input
          className="w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#A6A39F] outline-none"
          readOnly
          value={valorParcela ? `R$ ${valorParcela}` : ""}
          placeholder="Calculado"
        />
      </div>
    </div>

    <div className="mt-7 flex justify-end gap-3">
      <button
        onClick={handleClear}
        className="rounded-md bg-[#A6A39F] px-7 py-2.5 text-[15px] font-bold text-[#F2EFDC]"
      >
        Limpar
      </button>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-md bg-[#D9A13B] px-7 py-2.5 text-[15px] font-bold text-[#261F1A] disabled:opacity-70"
      >
        {loading ? "Postando..." : "Postar"}
      </button>
    </div>
  </div>
);  

}