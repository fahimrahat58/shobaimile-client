
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const testJWT = async () => {
    try {
      setLoading(true);
      setResult("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error(
          tokenResult.error?.message || "JWT token unavailable",
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/protected",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      setResult(JSON.stringify(data, null, 2));
      toast.success("JWT verification successful!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      setResult(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-6">
      <h1 className="text-2xl font-bold">JWT Authentication Test</h1>

      <button
        onClick={testJWT}
        disabled={loading}
        className="rounded-md bg-cyan-600 px-6 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test JWT"}
      </button>

      {result && (
        <pre className="w-full max-w-2xl overflow-auto rounded-lg bg-gray-100 p-4 text-sm text-gray-900">
          {result}
        </pre>
      )}
    </main>
  );
}
