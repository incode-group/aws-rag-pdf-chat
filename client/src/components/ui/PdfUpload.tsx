import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetFileStatus, { FileStatus } from "@/hooks/use-get-file-status";
import { FileText, Loader2, Paperclip, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface PdfUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  onFileStatusChange: (fileStatus: FileStatus) => void;
}

const PdfUpload = ({
  onFileSelect,
  selectedFile,
  onFileStatusChange,
}: PdfUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileStatusQuery = useGetFileStatus(!!selectedFile);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.warning("Please select a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warning("File size must be less than 10MB");
      return;
    }

    setIsOpen(false);
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Removed the PDF");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const fileStatus = getFileStatusQuery?.data || FileStatus.PENDING;

  useEffect(() => {
    onFileStatusChange(fileStatus);
    if (fileStatus === FileStatus.SUCCESS)
      toast.success("File successfully uploaded! You can now have a chat.");
  }, [fileStatus]);

  return (
    <>
      {selectedFile ? (
        <div className="h-10 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <FileText className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800 font-medium cursor-pointer hover:underline">
            {selectedFile.name}
          </span>

          {fileStatus === FileStatus.PENDING ||
          typeof fileStatus === "undefined" ? (
            <Loader2 className="w-4 h-4 ml-3 text-green-600 animate-spin" />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="h-auto p-1 text-green-600 hover:text-green-800 hover:bg-green-100"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      ) : (
        <>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="group h-10 gap-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-600 bg-transparent"
              >
                <Paperclip className="group-hover:rotate-270 transition w-4 h-4" />
                Attach PDF
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
        </>
      )}
    </>
  );
};

export default PdfUpload;
