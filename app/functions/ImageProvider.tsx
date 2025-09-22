import { supabase } from "@/lib/supabaseClient";
import { RcFile } from "antd/es/upload";

export const imageProvider = {
  getFilePathFromPublicUrl(publicUrl: string, bucket: string): string {
    try {
      const url = new URL(publicUrl);
      const parts = url.pathname.split(`/public/${bucket}/`);
      if (parts.length < 2) throw new Error("Invalid public URL");
      return parts[1]; // bagian setelah bucket
    } catch {
      throw new Error("Gagal memproses URL");
    }
  },

  async uploadImage(file: RcFile, bucket: string): Promise<string> {
    const uniqueId = crypto.randomUUID(); // bikin UUID
    const ext = file.name.split(".").pop(); // ambil ekstensi file
    const fileName = `${uniqueId}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  },

  async deleteImage(publicUrl: string, bucket: string): Promise<void> {
    try {
      const filePath = imageProvider.getFilePathFromPublicUrl(
        publicUrl,
        bucket
      );
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) throw error;
    } catch (err) {
      console.warn("Gagal hapus file lama:", err);
    }
  },
};
