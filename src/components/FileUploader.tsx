"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if Pinata JWT exists in env
    const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!pinataJwt) {
      toast.error("IPFS Config Missing", {
        description: "Please add NEXT_PUBLIC_PINATA_JWT to your .env.local"
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const url = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      
      setUploadedUrl(url);
      onUploadSuccess(url);
      toast.success("File Pinned to IPFS!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", {
        description: "Check your Pinata configuration and try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`
        relative border-2 border-dashed rounded-xl p-8 transition-all
        ${uploadedUrl ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-primary/50 bg-white/5'}
      `}>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileChange}
          disabled={isUploading || !!uploadedUrl}
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <div className="font-bold">Uploading to IPFS...</div>
              <p className="text-xs text-muted-foreground mt-2">Pinning your evidence permanently to the decentralized web.</p>
            </>
          ) : uploadedUrl ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
              <div className="font-bold text-green-500">Evidence Ready</div>
              <div className="flex items-center mt-2 text-xs text-muted-foreground font-mono truncate max-w-xs">
                <FileIcon className="h-3 w-3 mr-2" /> {uploadedUrl.split('/').pop()}
              </div>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <div className="font-bold">Select Proof of Work</div>
              <p className="text-xs text-muted-foreground mt-2">PDF, PNG, or JPG (Max 10MB)</p>
            </>
          )}
        </div>
      </div>
      
      {uploadedUrl && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-muted-foreground text-xs"
          onClick={() => setUploadedUrl(null)}
        >
          Replace File
        </Button>
      )}
    </div>
  );
}
