"use client";

import { useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/authFetch";

const GENRES = [
  "Ação", "Aventura", "Comédia", "Drama", "Ficção Científica",
  "Terror", "RPG", "Esportes", "Corrida", "Puzzle", "Rock", "Pop", "Jazz"
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
    "w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-[#261F1A] placeholder-gray-400 outline-none focus:border-[#BF372A] focus:bg-white focus:ring-1 focus:ring-[#BF372A] transition-all duration-200";
  const labelClass = "mb-1.5 text-[13px] font-semibold text-[#59524C] tracking-wide";

  return (
    <div className="w-full">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-[#261F1A]">Cadastrar Novo Produto</h2>
        <p className="text-xs text-gray-400">Preencha os campos abaixo para disponibilizar seu produto na vitrine.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className={labelClass}>Título do anúncio *</label>
          <input className={inputClass} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Vinil Clássico Pink Floyd" />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Gênero</label>
          <input 
            list="create-generos" 
            className={inputClass} 
            value={genero} 
            onChange={(e) => setGenero(e.target.value)} 
            placeholder="Selecione ou digite o gênero..." 
          />
          <datalist id="create-generos">
            {GENRES.map((g) => <option key={g} value={g} />)}
          </datalist>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Tipo de Mídia *</label>
          <select className={inputClass} value={mediaTypeId} onChange={(e) => setMediaTypeId(Number(e.target.value))}>
            <option value="">Selecione...</option>
            {mediaTypes.map((m) => (
              <option key={m.id} value={m.id}>
                {labelForMediaType(m.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Estoque / Quantidade</label>
          <input className={inputClass} type="number" min="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        </div>

        <div className="flex flex-col col-span-2">
          <label className={labelClass}>Descrição do produto</label>
          <textarea className={`${inputClass} resize-none h-24`} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva as condições estruturais, encartes..." />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>CEP de Origem *</label>
          <input className={inputClass} value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" maxLength={9} />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Preço de Desconto</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-gray-400 font-medium">R$</span>
            <input className={`${inputClass} pl-10`} type="number" min="0" step="0.01" value={precoDesconto} onChange={(e) => setPrecoDesconto(e.target.value)} placeholder="Opcional" />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <label className={labelClass}>Fotos do produto</label>
        <div className="mt-3 flex flex-wrap gap-4">
          {photos.map((slot, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                onClick={() => !slot.preview && fileRefs[i].current?.click()}
                className={`relative flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-200 bg-gray-50/50 ${
                  slot.preview ? "cursor-default border-solid border-gray-200 shadow-sm" : "cursor-pointer hover:bg-gray-100/70 hover:border-gray-300"
                } transition-all`}
              >
                {slot.preview ? (
                  <>
                    <img src={slot.preview} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemovePhoto(i); }}
                      className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white hover:bg-[#BF372A] transition-colors shadow-sm"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <span className="text-xl font-light">+</span>
                    <span className="text-[11px] font-medium">Adicionar</span>
                  </div>
                )}
              </div>
              {i === 0 && (
                <span className="text-[10px] font-bold tracking-wide text-[#BF372A] bg-red-50/70 px-2 py-0.5 rounded-md border border-red-100">
                  Principal
                </span>
              )}
              <input ref={fileRefs[i]} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(i, e.target.files?.[0] ?? null)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 border-t border-gray-100 pt-6">
        <div className="flex flex-col">
          <label className={labelClass}>Valor de Venda *</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-gray-400 font-medium">R$</span>
            <input className={`${inputClass} pl-10`} type="number" min="0" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" />
          </div>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Máx. Parcelas</label>
          <input className={inputClass} type="number" min="1" max="24" value={numParcelas} onChange={(e) => setNumParcelas(e.target.value)} placeholder="1" />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Valor p/ Parcela (Aprox.)</label>
          <input className="w-full rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-2.5 text-sm font-medium text-gray-400 outline-none" readOnly value={valorParcela ? `R$ ${valorParcela}` : ""} placeholder="Calculado" />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">
        <button onClick={handleClear} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Limpar campos
        </button>
        <button onClick={handleSubmit} disabled={loading} className="rounded-lg bg-[#BF372A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-70">
          {loading ? "Postando..." : "Publicar Anúncio"}
        </button>
      </div>
    </div>
  );
}