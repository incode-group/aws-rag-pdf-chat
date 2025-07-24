import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const useUploadToS3 = () => {
  const uploadToS3 = async ({ url, file }: { url: string; file: File }) => {
    await axios.put(url, file);
  };

  return useMutation({
    mutationFn: ({ url, file }: { url: string; file: File }) =>
      uploadToS3({ url, file }),
    onSuccess: () => {
      toast.success("PDF uploaded successfully!");
    },
  });
};

export default useUploadToS3;
