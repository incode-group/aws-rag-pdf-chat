import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export enum FileStatus {
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
}

const getFileStatus = async (key: string) => {
  const response = await axiosClient.get<{ status: FileStatus }>(
    `/file-status?key=${key}`
  );

  return response.data.status;
};

const useGetFileStatus = (isFileSelected: boolean) => {
  const fileKey = localStorage.getItem("fileKey");
  if (!fileKey) return;

  return useQuery({
    queryKey: ["file-status", fileKey],
    queryFn: () => getFileStatus(fileKey),
    refetchInterval: 1000,
    enabled: isFileSelected,
  });
};

export default useGetFileStatus;
