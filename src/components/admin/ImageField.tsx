import Image from 'next/image';

type ImageFieldProps = {
  label: string;
  currentUrl: string | null;
  alt: string;
};

export function ImageField({ label, currentUrl, alt }: ImageFieldProps) {
  return (
    <div>
      <label htmlFor="image" className="block text-sm font-bold text-navy">
        {label}
      </label>

      {currentUrl && (
        <div className="relative mt-2 aspect-video w-48 border border-navy/20">
          <Image src={currentUrl} alt={alt} fill unoptimized sizes="192px" className="object-cover" />
        </div>
      )}

      <input
        id="image"
        name="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-describedby="image-hint"
        className="mt-2 block w-full text-sm text-navy"
      />
      <p id="image-hint" className="mt-1 text-xs text-gray-blue">
        JPG, PNG, atau WebP. Maksimal 2 MB. Kosongkan kalau tidak ingin mengganti.
      </p>

      {currentUrl && (
        <label className="mt-2 flex items-center gap-2 text-sm text-navy">
          <input type="checkbox" name="removeImage" />
          Hapus gambar saat ini
        </label>
      )}
    </div>
  );
}
