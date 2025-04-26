import { supabase } from './supabaseClient';

export async function uploadImageToSupabase(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `menu-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from('menu-images') // your bucket name
    .upload(filePath, file);

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  // Get public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('menu-images')
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl ?? null;
} 