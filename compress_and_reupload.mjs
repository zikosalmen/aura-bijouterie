/**
 * compress_and_reupload.mjs
 * 
 * Compresses all images in public/imgs using Sharp (WebP + reduced size),
 * then re-uploads the optimized versions to Supabase Storage,
 * overwriting the originals.
 * 
 * Run: node compress_and_reupload.mjs
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.PROJET_DB_URL;
const key = process.env.SECRET_KEY;
const supabase = createClient(url, key);

const BUCKET = 'products-images';
const IMGS_DIR = path.join(process.cwd(), 'public', 'imgs');
const QUALITY = 75;           // WebP quality (0-100)
const MAX_WIDTH = 800;        // Max width in px — enough for all our grid sizes

async function compress(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isJpeg = ext === '.jpg' || ext === '.jpeg';

  const pipeline = sharp(filePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

  // Convert everything to WebP for best compression
  return pipeline.webp({ quality: QUALITY }).toBuffer();
}

async function run() {
  const files = fs.readdirSync(IMGS_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  console.log(`\n📦 Found ${files.length} images. Compressing and uploading...\n`);

  let success = 0;
  let errors = 0;

  for (const file of files) {
    const filePath = path.join(IMGS_DIR, file);
    const storagePath = file; // keep same filename in bucket

    try {
      const compressed = await compress(filePath);
      const originalSize = fs.statSync(filePath).size;
      const compressedSize = compressed.length;
      const ratio = Math.round((1 - compressedSize / originalSize) * 100);

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, compressed, {
          contentType: 'image/webp',
          upsert: true, // overwrite existing
        });

      if (error) {
        console.error(`  ❌ ${file} — upload failed: ${error.message}`);
        errors++;
      } else {
        console.log(`  ✅ ${file.padEnd(18)} ${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB  (-${ratio}%)`);
        success++;
      }
    } catch (err) {
      console.error(`  ❌ ${file} — compress failed: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n🎉 Done! ${success} optimized, ${errors} errors.\n`);
}

run();
