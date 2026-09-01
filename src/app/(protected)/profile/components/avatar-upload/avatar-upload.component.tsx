"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flex } from "@/components/ui/flex";
import { Box } from "@/components/ui/box";
import { useAvatarUpload } from "../../hooks/use-avatar-upload/use-avatar-upload.hook";
import { ACCEPTED_IMAGE_TYPES } from "../../utils/file-utils/file-utils.utils";
import { Camera } from "lucide-react";

interface AvatarUploadProps {
  name: string;
  image: string;
  onImageChange: (url: string) => void;
  onRemoveImage: () => void;
  removeText: string;
}

export function AvatarUpload({
  name,
  image,
  onImageChange,
  onRemoveImage,
  removeText,
}: AvatarUploadProps) {
  const { fileInputRef, triggerFileInput, handleFileChange } = useAvatarUpload({
    onUpload: onImageChange,
  });

  const fallbackLetter = name.charAt(0).toUpperCase() || "?";

  return (
    <Flex direction="col" align="center" gap={3}>
      <Box className="relative">
        <Avatar className="h-20 w-20">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-duo-rose-light text-duo-rose-dark text-2xl font-bold">
            {fallbackLetter}
          </AvatarFallback>
        </Avatar>
        
        <Button
          type="button"
          variant="default"
          size="icon"
          onClick={triggerFileInput}
          className="absolute bottom-0 right-0 rounded-full shadow-lg hover:opacity-90 transition-opacity bg-duo-rose text-white hover:bg-duo-rose/90"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </Box>

      <Input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        onChange={handleFileChange}
        className="hidden"
      />

      {image && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-destructive"
          onClick={onRemoveImage}
        >
          {removeText}
        </Button>
      )}
    </Flex>
  );
}
