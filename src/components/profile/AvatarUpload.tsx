
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Camera } from "lucide-react";

interface AvatarUploadProps {
  onAvatarChange?: (url: string) => void;
}

const AvatarUpload = ({ onAvatarChange }: AvatarUploadProps) => {
  const { profile, uploadAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload file
    setIsUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      if (onAvatarChange) {
        onAvatarChange(avatarUrl);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCancelPreview = () => {
    setPreviewUrl(null);
  };
  
  // Get display name or initial for avatar fallback
  const getInitial = () => {
    if (!profile?.name) return "U";
    return profile.name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={previewUrl || profile?.avatar_url} 
            alt={profile?.name || "User"} 
          />
          <AvatarFallback className="bg-bhoj-primary text-white text-xl">
            {getInitial()}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        
        {previewUrl && !isUploading && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleCancelPreview}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md cursor-pointer">
          <Camera className="h-5 w-5 text-bhoj-primary" />
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Click on the camera icon to upload a profile picture
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;
