"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Photo } from "./primitives";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { updateMainImage } from "@/actions/updateMainImage";
import { useRouter } from "next/navigation";
import type { ImageType } from "@/utils/types";

export function PlaceGallery({
  images,
  title,
  editableImages = [],
}: {
  images: string[];
  title: string;
  editableImages?: ImageType[];
}) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const { isAdmin } = useIsAdmin();
  const router = useRouter();
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
    dialog.current?.close();
  }, [open]);
  if (!images.length) return null;
  const current = editableImages.find(
    (image) => image.path === images[selected],
  );
  async function chooseCover(id: string) {
    setSaving(true);
    setMessage("");
    try {
      const result = await updateMainImage(id);
      setMessage(
        result.success
          ? "Обложка сохранена."
          : "Не удалось сохранить обложку. Попробуйте ещё раз.",
      );
      if (result.success) router.refresh();
    } catch {
      setMessage("Не удалось сохранить обложку. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.slice(0, 4).map((src, index) => (
          <button
            key={src}
            className="group relative cursor-pointer rounded-[24px]"
            onClick={() => {
              setSelected(index);
              setOpen(true);
              setMessage("");
            }}
            aria-label={`Открыть фото ${index + 1}: ${title}`}
          >
            <Photo
              src={src}
              alt={`${title} — фото ${index + 1}`}
              className="aspect-square"
              sizes="(max-width: 767px) 45vw, 260px"
            />
            {index === 3 && images.length > 4 && (
              <span className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-black/40 text-2xl text-white">
                +{images.length - 4}
              </span>
            )}
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        aria-label={`Фотографии: ${title}`}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft")
            setSelected((selected + images.length - 1) % images.length);
          if (event.key === "ArrowRight")
            setSelected((selected + 1) % images.length);
        }}
        className="bg-background text-foreground fixed inset-0 m-auto w-[calc(100%_-_24px)] max-w-5xl rounded-[24px] p-4 backdrop:bg-black/80 md:p-6"
      >
        {open && (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p>
                {title} · {selected + 1} / {images.length}
              </p>
              <button
                autoFocus
                aria-label="Закрыть фотографии"
                onClick={() => setOpen(false)}
                className="hover:bg-secondary flex size-11 items-center justify-center rounded-xl"
              >
                <X size={24} />
              </button>
            </div>
            <Photo
              src={images[selected]}
              alt={`${title} — фото ${selected + 1}`}
              className="h-[60svh] [&_img]:object-contain"
              sizes="100vw"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                aria-label="Предыдущее фото"
                disabled={images.length < 2}
                onClick={() =>
                  setSelected((selected + images.length - 1) % images.length)
                }
                className="bg-secondary flex size-11 items-center justify-center rounded-xl disabled:opacity-40"
              >
                <ChevronLeft />
              </button>
              {isAdmin && current && (
                <button
                  disabled={saving || current.mainImage}
                  onClick={() => chooseCover(current.id)}
                  className="bg-primary min-h-11 rounded-xl px-4 text-white disabled:opacity-50"
                >
                  {saving
                    ? "Сохраняем…"
                    : current.mainImage
                      ? "Обложка места"
                      : "Сделать обложкой"}
                </button>
              )}
              <button
                aria-label="Следующее фото"
                disabled={images.length < 2}
                onClick={() => setSelected((selected + 1) % images.length)}
                className="bg-secondary flex size-11 items-center justify-center rounded-xl disabled:opacity-40"
              >
                <ChevronRight />
              </button>
            </div>
            <p role="status" className="mt-2 text-center text-sm">
              {message}
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
