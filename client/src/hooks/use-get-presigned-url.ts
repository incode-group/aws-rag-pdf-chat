import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const useGetPresignedUrl = () => {
  const getPresignedUrl = async (fileName: string) => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      toast("Please log in to upload a file.");
      return;
    }

    const key = `${email}-${fileName}-${uuidv4()}`;

    const response = await axiosClient.post<{ url: string }>("/presigned-url", {
      key,
    });
    return response.data.url;
  };

  return useMutation({
    mutationFn: (fileName: string) => getPresignedUrl(fileName),
  });
};

export default useGetPresignedUrl;
