import {useState} from 'react';
import type {StoreImage} from '~/lib/types';

/** PDP media gallery: hero image + thumbnail strip (BLUEPRINT §2.1). */
export function MediaGallery({
  images,
  alt,
}: {
  images: StoreImage[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return <div className="aspect-square w-full bg-sand" aria-hidden="true" />;
  }
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <img
        src={current.url}
        alt={current.altText ?? alt}
        className="aspect-square w-full bg-sand object-cover"
      />
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {images.slice(0, 12).map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={`overflow-hidden border-2 ${
                index === active ? 'border-laurel-900' : 'border-transparent'
              }`}
            >
              <img
                src={image.url}
                alt=""
                aria-hidden="true"
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
