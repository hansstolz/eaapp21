"use server";
import getLogo from "@/lib/hooks/use-logo";
import fs from "fs";

export default async function saveImage(file: File) {
  const logo_path = await getLogo();

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${process.cwd()}/public${logo_path}`;
  fs.writeFile(filePath, new Uint8Array(buffer), (error) => {
    if (error) {
      console.error("Error saving file:", error);
    }
  });

  return "File saved successfully";
}
