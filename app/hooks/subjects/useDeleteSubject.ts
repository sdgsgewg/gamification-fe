"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectProvider } from "@/app/functions/SubjectProvider";

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => subjectProvider.deleteSubject(id),
    onSuccess: () => {
      // invalidate query agar data otomatis refresh
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
