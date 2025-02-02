import axios from "axios";

export const fetchProxyData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await axios.get<T>(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = `Failed to fetch from ${endpoint}: ${error.response?.status} - ${error.response?.statusText}`;
      throw new Error(errorMessage);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
