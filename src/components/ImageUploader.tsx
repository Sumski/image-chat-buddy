
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (image: File | null) => void;
  selectedImage: File | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  selectedImage 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    } else {
      setPreviewUrl(null);
      onImageSelect(null);
    }
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };
  
  const clearSelectedImage = () => {
    setPreviewUrl(null);
    onImageSelect(null);
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="image-upload"
        className="sr-only"
        accept="image/*"
        onChange={handleImageChange}
      />
      
      {!previewUrl ? (
        <label 
          htmlFor="image-upload" 
          className={cn(
            "cursor-pointer flex items-center justify-center rounded-full p-2",
            "hover:bg-muted transition-colors duration-200"
          )}
        >
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Upload image</span>
        </label>
      ) : (
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-md overflow-hidden border border-border">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full"
              onClick={clearSelectedImage}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
