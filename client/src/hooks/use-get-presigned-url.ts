import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const useGetPresignedUrl = () => {
  const getPresignedUrl = async ({
    fileName,
    contentType,
  }: {
    fileName: string;
    contentType: string;
  }) => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      toast.warning("Please log in to upload a file.");
      return;
    }

    const key = `${email}-${fileName}-${uuidv4()}`;

    const response = await axiosClient.post<{ url: string }>("/presigned-url", {
      key,
      contentType,
    });
    return response.data.url;
  };

  return useMutation({
    mutationFn: ({
      fileName,
      contentType,
    }: {
      fileName: string;
      contentType: string;
    }) => getPresignedUrl({ fileName, contentType }),
  });
};

export default useGetPresignedUrl;
