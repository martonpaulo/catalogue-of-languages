import axios from "axios";

export async function fetchProxyData<T>(url: string): Promise<T> {
  try {
    const { data } = await axios.get<T>(url);
    return data;
  } catch (error) {
    throw handleFetchError(error, url);
  }
}

function handleFetchError(error: unknown, url: string): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || "Unknown";
    const statusText = error.response?.statusText || "No status text";
    return new Error(`Failed to fetch from ${url}: ${status} - ${statusText}`);
  }

  return new Error(`Unexpected error occurred while fetching ${url}`);
}
