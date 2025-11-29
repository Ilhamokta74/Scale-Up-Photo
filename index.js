const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Folder input & output
const inputFolder = path.join(__dirname, 'input');
const outputFolder = path.join(__dirname, 'output');

// Scale factor (ubah sesuka kamu)
const SCALE_FACTOR = 6;

// Buat folder output jika belum ada
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

async function upscaleImages() {
    const files = fs.readdirSync(inputFolder);

    for (const file of files) {
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(outputFolder, file);

        if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) {
            console.log(`Lewati non-image: ${file}`);
            continue;
        }

        try {
            const meta = await sharp(inputPath).metadata();

            const newWidth = Math.round(meta.width * SCALE_FACTOR);
            const newHeight = Math.round(meta.height * SCALE_FACTOR);

            await sharp(inputPath)
                .resize({
                    width: newWidth,
                    height: newHeight,
                    kernel: sharp.kernel.lanczos3 // terbaik untuk upscale
                })
                .sharpen({
                    sigma: 1.2,      // tingkat ketajaman (1.0 – 2.0 bagus)
                    m1: 0.8,         // kontras edge
                    m2: 1.2          // penambah detail halus
                })
                .toFile(outputPath);

            console.log(`Upscale & sharpen: ${file} → ${newWidth}x${newHeight}`);
        } catch (err) {
            console.error(`Gagal proses ${file}:`, err.message);
        }
    }
}

upscaleImages();
