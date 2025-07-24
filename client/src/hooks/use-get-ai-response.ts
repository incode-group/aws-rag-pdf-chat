import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const useGetAiResponse = () => {
  const getAiResponse = async (query: string) => {
    const fileKey = localStorage.getItem("fileKey");

    const response = (await axiosClient.post)<{ response: string }>("/ask-ai", {
      key: fileKey,
      query,
    });

    return response;
  };

  return useMutation({
    mutationFn: (query: string) => getAiResponse(query),
  });
};

export default useGetAiResponse;
