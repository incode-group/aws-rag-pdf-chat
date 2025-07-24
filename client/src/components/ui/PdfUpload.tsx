import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileText, Paperclip, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface PdfUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PdfUpload = ({
  onFileSelect,
  selectedFile,
  isLoading,
  setIsLoading,
}: PdfUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setIsLoading(true);
    setIsOpen(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    onFileSelect(file);
    setIsLoading(false);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="group h-10 gap-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-600 bg-transparent"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                Processing...
              </>
            ) : (
              <>
                <Paperclip className="group-hover:rotate-270 transition w-4 h-4" />
                Attach PDF
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">PDF Attachment</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• You can only attach 1 PDF file</p>
              <p>• Maximum file size: 10MB</p>
              <p>• PDF is required to start chatting</p>
            </div>
            <Button
              onClick={triggerFileInput}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose PDF File
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedFile && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <FileText className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800 font-medium cursor-pointer hover:underline">
            {selectedFile.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="h-auto p-1 text-green-600 hover:text-green-800 hover:bg-green-100"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
