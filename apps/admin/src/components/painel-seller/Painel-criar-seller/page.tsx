"use client";

import { useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/authFetch";

const GENRES = [
  "Ação", "Aventura", "Comédia", "Drama", "Ficção Científica",
  "Terror", "RPG", "Esportes", "Corrida", "Puzzle",
];

interface MediaType {
  id: number;
  name: string;
}

interface PhotoSlot {
  file: File | null;
  preview: string | null;
}

export default function PainelPostSeller() {
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [precoDesconto, setPrecoDesconto] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [cep, setCep] = useState("");
  const [numParcelas, setNumParcelas] = useState("");
  const [mediaTypeId, setMediaTypeId] = useState<number | "">("");
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(false);

  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
  ]);

  const fileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const valorParcela =
    valor && numParcelas && Number(numParcelas) > 1
      ? (Number(valor) / Number(numParcelas)).toFixed(2)
      : "";

  useEffect(() => {
    async function fetchMediaTypes() {
      try {
        const res = await fetch("/api/products/media-types");
        const data = await res.json();
        setMediaTypes(Array.isArray(data) ? data : []);
      } catch {}
    }
    fetchMediaTypes();
  }, []);

  function labelForMediaType(name: string) {
    if (name === "MOVIE") return "Filme";
    if (name === "GAME") return "Jogo";
    return name;
  }

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
    setDescricao("");
    setValor("");
    setPrecoDesconto("");
    setQuantidade("1");
    setCep("");
    setNumParcelas("");
    setMediaTypeId("");
    setPhotos([
      { file: null, preview: null },
      { file: null, preview: null },
      { file: null, preview: null },
    ]);
  }

  async function handleSubmit() {
    if (!titulo || !valor || !mediaTypeId || !cep) {
      alert("Preencha os campos obrigatórios: Título, Tipo de Mídia, Valor e CEP.");
      return;
    }

    setLoading(true);
    try {
      const productRes = await authFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: titulo,
          description: descricao || titulo,
          price: Number(valor),
          discountPrice: precoDesconto ? Number(precoDesconto) : undefined,
          amount: Number(quantidade) || 1,
          cep,
          mediaTypeId: Number(mediaTypeId),
          maxInstallments: numParcelas ? Number(numParcelas) : 1,
          freeInstallments: 1,
          genres: genero ? [genero] : [],
        }),
      });

      if (!productRes.ok) {
        const err = await productRes.json().catch(() => ({}));
        throw new Error(err?.message || "Erro ao criar produto");
      }

      const product = await productRes.json();

      // BUG FIX: rota correta para upload de fotos é POST /api/uploads/products/:productId
      const photoFiles = photos.filter((p) => p.file !== null);
      if (photoFiles.length > 0) {
        const formData = new FormData();
        photoFiles.forEach((photo) => formData.append("files", photo.file as File));

        const uploadRes = await authFetch(`/api/uploads/products/${product.id}`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err?.message || "Produto criado, mas erro ao enviar fotos");
        }
      }

      alert("Produto cadastrado com sucesso!");
      handleClear();
    } catch (err: any) {
      alert(err.message || "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none focus:border-[#BF372A] transition-colors";
  const labelClass = "mb-1 text-[13px] font-bold text-[#261F1A]";

  return (
    <div className="max-w-[780px] rounded-xl p-8">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className={labelClass}>Título: *</label>
          <input
            className={inputClass}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Gênero:</label>
          <input
            list="generos"
            className={inputClass}
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            placeholder="Ex: Ação"
          />
          <datalist id="generos">
            {GENRES.map((g) => <option key={g} value={g} />)}
          </datalist>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Tipo de Mídia: *</label>
          <select
            className={inputClass}
            value={mediaTypeId}
            onChange={(e) => setMediaTypeId(Number(e.target.value))}
          >
            <option value="">Selecione...</option>
            {mediaTypes.map((m) => (
              <option key={m.id} value={m.id}>
                {labelForMediaType(m.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Estoque / Qtd:</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className={labelClass}>Descrição:</label>
          <textarea
            className={`${inputClass} resize-none h-20`}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>CEP: *</label>
          <input
            className={inputClass}
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="00000-000"
            maxLength={9}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Preço de Desconto (R$)</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            value={precoDesconto}
            onChange={(e) => setPrecoDesconto(e.target.value)}
            placeholder="Opcional"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className={`${labelClass} block`}>Fotos Promocionais:</label>
        <div className="mt-2 flex flex-wrap gap-4">
          {photos.map((slot, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                onClick={() => !slot.preview && fileRefs[i].current?.click()}
                className={`relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#A6A39F] bg-[#A6A39F55] ${
                  slot.preview ? "cursor-default" : "cursor-pointer hover:bg-[#A6A39F77]"
                } transition-colors`}
              >
                {slot.preview ? (
                  <>
                    <img src={slot.preview} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemovePhoto(i); }}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#BF372A] text-[11px] text-white hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="text-[28px] text-[#A6A39F]">+</span>
                )}
              </div>
              {i === 0 && (
                <span className="text-[11px] font-bold text-[#261F1A] bg-[#F2EFDC] px-2 py-0.5 rounded-full border border-[#D9A13B]">
                  Principal
                </span>
              )}
              <input
                ref={fileRefs[i]}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(i, e.target.files?.[0] ?? null)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-5">
        <div className="flex flex-col">
          <label className={labelClass}>Valor (R$): *</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Máx. Parcelas:</label>
          <input
            className={inputClass}
            type="number"
            min="1"
            max="24"
            placeholder="1"
            value={numParcelas}
            onChange={(e) => setNumParcelas(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Valor p/ Parcela (Aprox.)</label>
          <input
            className={`${inputClass} text-[#A6A39F] bg-gray-100 border-gray-300`}
            readOnly
            value={valorParcela ? `R$ ${valorParcela}` : ""}
            placeholder="Calculado"
          />
        </div>
      </div>

      <div className="mt-7 flex justify-end gap-3 border-t border-[#A6A39F44] pt-4">
        <button
          onClick={handleClear}
          className="rounded-md bg-[#A6A39F] px-7 py-2.5 text-[15px] font-bold text-[#F2EFDC] hover:bg-[#8f8c88] transition-colors"
        >
          Limpar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-md bg-[#D9A13B] px-7 py-2.5 text-[15px] font-bold text-[#261F1A] hover:bg-[#c28f30] disabled:opacity-70 transition-colors"
        >
          {loading ? "Postando..." : "Postar"}
        </button>
      </div>
    </div>
  );
}