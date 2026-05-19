import { useState } from "react";

interface ApiCallOptions {
  endpoint: string;
  body: Record<string, any>;
  isFormData?: boolean;
}

export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = async (options: ApiCallOptions) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8000${options.endpoint}`, {
        method: "POST",
        ...(options.isFormData
          ? { body: options.body as FormData }
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(options.body),
            }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error };
}
