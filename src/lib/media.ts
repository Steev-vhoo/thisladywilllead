import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";

// Paths starting with "/" (or a full URL) are images shipped with the site, not bucket files.
const isBundled = (path: string) => path.startsWith("/") || /^https?:\/\//.test(path);

export function mediaUrl(path: string) {
  return isBundled(path) ? path : supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Uploads an image to the media bucket under `folder` and returns its storage path. */
export async function uploadMedia(folder: "gallery" | "team" | "events", file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export async function removeMedia(path: string | null) {
  if (path && !isBundled(path)) await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return data;
    },
  });
}
