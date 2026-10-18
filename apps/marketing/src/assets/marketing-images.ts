import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import generation from './showcase-generation.webp';
import storage from './showcase-storage.webp';
import infrastructure from './showcase-infrastructure.webp';
import operator from './who-serve-asset-operator.webp';
import investor from './who-serve-green-investor.webp';
import skyline from './skyline.webp';

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
}

async function responsive(src: ImageMetadata, sizes: string): Promise<ResponsiveImage> {
  const width = Math.min(1200, src.width);
  const image = await getImage({ src, width, widths: [480, 800, width], sizes, format: 'webp', quality: 80 });
  return { src: image.src, srcSet: image.srcSet.attribute, sizes, width, height: Math.round(width * src.height / src.width) };
}

// Called from Astro frontmatter so image transforms stay in the build/server boundary.
export async function getMarketingImages() {
  const half = '(min-width: 1284px) 570px, (min-width: 768px) 45vw, calc(100vw - 40px)';
  const [generationImage, storageImage, infrastructureImage, operatorImage, investorImage, skylineImage] = await Promise.all([
    responsive(generation, half), responsive(storage, half), responsive(infrastructure, half),
    responsive(operator, half), responsive(investor, half),
    responsive(skyline, '(min-width: 768px) 560px, calc(100vw - 40px)'),
  ]);
  return {
    showcase: { generation: generationImage, storage: storageImage, infrastructure: infrastructureImage },
    audience: { operator: operatorImage, investor: investorImage },
    skyline: skylineImage,
  };
}
