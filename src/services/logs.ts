import { api } from "@/services/api";

interface GetLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export async function getLogs(params?: GetLogsParams) {
  const response = await api.get("/logs", {
    params,
  });

  return response.data;
}
