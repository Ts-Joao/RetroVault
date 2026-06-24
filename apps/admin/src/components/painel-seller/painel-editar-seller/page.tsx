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
  id?: string;
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
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [precoDesconto, setPrecoDesconto] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [numParcelas, setNumParcelas] = useState("");
  const [mediaTypeId, setMediaTypeId] = useState<number | "">("");
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { file: null, preview: null, isExisting: false },
    { file: null, preview: null, isExisting: false },
    { file: null, preview: null, isExisting: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

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
        setPrecoDesconto(product.discountPrice ? String(product.discountPrice) : "");
        setQuantidade(String(product.amount ?? "1"));
        setCidade(product.city ?? "");
        setEstado(product.state ?? "");
        setNumParcelas(String(product.maxInstallments ?? "1"));
        setMediaTypeId(product.mediaTypeId ?? "");

        if (product.genre && product.genre.length > 0) {
          setGenero(product.genre[0].name ?? "");
        }

        const existingPhotos: PhotoSlot[] = (product.photos ?? [])
          .slice(0, 3)
          .map((p: { id: string; url: string }) => ({
            id: p.id,
            file: null,
            preview: p.url,
            isExisting: true,
          }));

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
      updated[index] = { file, preview, isExisting: false };
      return updated;
    });
  }

  async function handleRemovePhoto(index: number) {
    const slot = photos[index];
    if (slot.isExisting && slot.id) {
      try {
        await authFetch(`/api/uploads/photo/${slot.id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Erro ao deletar foto do servidor:", err);
      }
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
      const body = {
        name: titulo,
        description: descricao,
        price: Number(valor),
        discountPrice: precoDesconto ? Number(precoDesconto) : null,
        amount: Number(quantidade),
        city: cidade,
        state: estado,
        mediaTypeId: Number(mediaTypeId),
        maxInstallments: numParcelas ? Number(numParcelas) : 1,
        genres: genero ? [genero] : [],
      };

      const res = await authFetch(`/api/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData?.message ?? "Erro ao atualizar produto");

      for (const slot of photos) {
        if (slot.file && !slot.isExisting) {
          const formData = new FormData();
          formData.append("file", slot.file);
          await authFetch(`/api/uploads/products/${productId}`, {
            method: "POST",
            body: formData,
          });
        }
      }

      alert("Produto atualizado com sucesso!");
      onBack?.();
    } catch (err: any) {
      console.error("UPDATE ERROR:", err);
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
      const res = await authFetch(`/api/uploads/products/${productId}`, {
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

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-[#261F1A] placeholder-gray-400 outline-none focus:border-[#BF372A] focus:bg-white focus:ring-1 focus:ring-[#BF372A] transition-all duration-200";
  const labelClass = "mb-1.5 text-[13px] font-semibold text-[#59524C] tracking-wide";

  if (!productId) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-xl bg-gray-50 border border-dashed border-gray-200 p-8">
        <p className="text-sm text-gray-400">Seleciona um produto na lista para carregar os dados de edição.</p>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="flex min-h-[240px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#BF372A] border-t-transparent"></div>
          <p className="text-sm text-gray-400">Buscando informações do produto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <button onClick={onBack} className="text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-[#BF372A] transition-colors">
          ← Voltar para a lista
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className={labelClass}>Título do Produto</label>
          <input className={inputClass} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Vinil Clássico Pink Floyd" />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Gênero</label>
          <input 
            list="edit-generos" 
            className={inputClass} 
            value={genero} 
            onChange={(e) => setGenero(e.target.value)} 
            placeholder="Selecione ou digite o gênero..." 
          />
          <datalist id="edit-generos">
            {GENRES.map((g) => <option key={g} value={g} />)}
          </datalist>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Tipo de Mídia</label>
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
          <label className={labelClass}>Estoque disponível</label>
          <input className={inputClass} type="number" min="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        </div>

        <div className="flex flex-col col-span-2">
          <label className={labelClass}>Descrição detalhada</label>
          <textarea className={`${inputClass} resize-none h-28`} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva as condições do produto..." />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Cidade</label>
          <input className={inputClass} value={cidade} onChange={(e) => setCidade(e.target.value)} />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Estado (UF)</label>
          <input className={inputClass} maxLength={2} value={estado} onChange={(e) => setEstado(e.target.value.toUpperCase())} placeholder="Ex: SP" />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <label className={labelClass}>Fotos do anúncio</label>
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
                  Capa
                </span>
              )}
              <input ref={fileRefs[i]} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(i, e.target.files?.[0] ?? null)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 border-t border-gray-100 pt-6">
        <div className="flex flex-col">
          <label className={labelClass}>Preço Original</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-gray-400 font-medium">R$</span>
            <input className={`${inputClass} pl-10`} type="number" min="0" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Preço Promocional</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-gray-400 font-medium">R$</span>
            <input className={`${inputClass} pl-10`} type="number" min="0" step="0.01" value={precoDesconto} onChange={(e) => setPrecoDesconto(e.target.value)} placeholder="Nenhum" />
          </div>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Parcelamento Máx.</label>
          <input className={inputClass} type="number" min="1" max="24" value={numParcelas} onChange={(e) => setNumParcelas(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="w-1/3 flex flex-col">
          <label className={labelClass}>Parcelas Estimadas</label>
          <input className="w-full rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-2.5 text-sm font-medium text-gray-400 outline-none" disabled value={valorParcela ? `R$ ${valorParcela} / mês` : "Sem parcelamento"} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <button onClick={handleDelete} disabled={loading} className="rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50/60 px-4 py-2.5 transition-colors disabled:opacity-50">
          Excluir anúncio
        </button>
        <div className="flex gap-3">
          <button onClick={onBack} disabled={loading} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleUpdate} disabled={loading} className="rounded-lg bg-[#BF372A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-70">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}