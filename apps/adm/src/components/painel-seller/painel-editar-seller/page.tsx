"use client";

import { useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/authFetch";

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

  // Busca mediaTypes reais do banco
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

  // Carrega produto
  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      setFetching(true);
      try {
        const res = await authFetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const product = await res.json();

        console.log("Produto carregado:", product);

        setTitulo(product.name ?? "");
        setDescricao(product.description ?? "");
        setValor(String(product.price ?? ""));
        setNumParcelas(String(product.maxInstallments ?? "1"));
        setMediaTypeId(product.mediaTypeId ?? "");

        // Gênero — pega o primeiro gênero do array
        if (product.genre && product.genre.length > 0) {
          setGenero(product.genre[0].name ?? "");
        }

        // Fotos existentes
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
      await authFetch(`/api/uploads/photo/${slot.id}`, { method: "DELETE" });
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
      const res = await authFetch(`/api/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: titulo,
          description: descricao,
          price: Number(valor),
          mediaTypeId: Number(mediaTypeId),
          maxInstallments: numParcelas ? Number(numParcelas) : 1,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar produto");

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

  const inputClass =
    "w-full rounded border-[1.5px] border-[#D9A13B] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none";
  const labelClass = "mb-1 text-[13px] font-bold text-[#261F1A]";

  if (!productId) {
    return (
      <div className="flex min-h-[200px] max-w-[780px] items-center justify-center rounded-xl bg-[#f8c0b8] p-8">
        <p className="text-base text-[#261F1A]">
          Selecione um produto em "Seus produtos" para editar.
        </p>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="flex min-h-[200px] max-w-[780px] items-center justify-center rounded-xl bg-[#f8c0b8] p-8">
        <p className="text-base text-[#261F1A]">Carregando produto...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[780px] rounded-xl bg-[#f8c0b8] p-8">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className={labelClass}>Título:</label>
          <input
            className={inputClass}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Gênero:</label>
          <input
            className={inputClass}
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Tipo:</label>
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
          <label className={labelClass}>Descrição:</label>
          <input
            className={inputClass}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
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
                  slot.preview ? "cursor-default" : "cursor-pointer"
                }`}
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
                  <span className="text-[28px] text-[#A6A39F]">+</span>
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
                  handlePhotoChange(i, e.target.files?.[0] ?? null)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-5">
        <div className="flex flex-col">
          <label className={labelClass}>Valor</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Num. Parcelas:</label>
          <input
            className={inputClass}
            type="number"
            min="1"
            max="24"
            value={numParcelas}
            onChange={(e) => setNumParcelas(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Valor Parc.</label>
          <input
            className={`${inputClass} text-[#A6A39F]`}
            readOnly
            value={valorParcela ? `R$ ${valorParcela}` : ""}
            placeholder="Calculado"
          />
        </div>
      </div>

      <div className="mt-7 flex justify-end gap-3">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-md bg-[#BF372A] px-7 py-2.5 text-[15px] font-bold text-[#F2EFDC] disabled:opacity-70"
        >
          Deletar
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="rounded-md bg-[#D9A13B] px-7 py-2.5 text-[15px] font-bold text-[#261F1A] disabled:opacity-70"
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>
    </div>
  );
}