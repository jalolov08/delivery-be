import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function compressImage(
    filePath: string,
    outputDirectory: string,
    width: number,
    height: number
): Promise<string> {
    const fileName = path.basename(filePath);
    const outputPath = path.join(outputDirectory, `compressed_${fileName}`);

    try {
        await sharp(filePath)
            .resize({ width, height, fit: "cover" })
            .toFormat("jpeg")
            .toFile(outputPath);

        fs.unlink(filePath, (err) => {
            if (err) console.error(`Ошибка удаления файла ${filePath}:`, err);
        });

        return outputPath;
    } catch (error) {
        console.error(`Ошибка сжатия изображения ${filePath}:`, error);
        throw new Error("Не удалось сжать изображение");
    }
}
