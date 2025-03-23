import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
ffmpeg.setFfmpegPath("/opt/homebrew/bin/ffmpeg");

export async function compressVideo(
  inputPath: string,
  outputDir: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, `${Date.now()}_compressed.mp4`);

    const ffmpegCommand = ffmpeg(inputPath);
    const fsModule = fs;

    ffmpegCommand
      .output(outputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .size("1280x720")
      .on("end", () => {
        fsModule.unlinkSync(inputPath);
        resolve(outputPath);
      })
      .on("error", (err: Error) => {
        reject(new Error("Error compressing video: " + err.message));
      })
      .run();
  });
}
