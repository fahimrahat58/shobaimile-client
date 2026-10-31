"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, FileX, AlertCircle } from "lucide-react";

import CertificateCard from "@/components/certificates/CertificateCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Certificate = {
  certificateId: string;
  eventTitle: string;
  volunteerHours: number;
  totalPoints: number;
  verifiedAt: string;
};

type CertificatesResponse = {
  success: boolean;
  count: number;
  certificates: Certificate[];
  message?: string;
};

export default function CertificatesPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState("");

  // Get JWT token
  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Please login first.");
    }

    return data.token;
  };

  // Load certificates
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    const loadCertificates = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getToken();

        const response = await fetch(`${API_URL}/api/certificates/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result: CertificatesResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Certificates load করা যায়নি।");
        }

        setCertificates(result.certificates || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [session, isPending, router]);

  // Download certificate PDF
  async function handleDownload(certificateId: string) {
    try {
      setDownloading(certificateId);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/certificates/${encodeURIComponent(
          certificateId,
        )}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        let message = "Certificate download করা যায়নি।";

        try {
          const result = await response.json();
          message = result.message || message;
        } catch {
          // Response may not contain JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      const fileUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `certificate-${certificateId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release browser memory after download starts.
      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 1000);

      toast.success("Certificate downloaded successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading("");
    }
  }

  // Session loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="font-semibold text-emerald-600">ShobaiMile</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My Certificates
          </h1>

          <p className="mt-2 text-gray-500">
            View and download your volunteering certificates.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && certificates.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <FileX className="mx-auto h-12 w-12 text-gray-300" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No Certificates Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Complete a volunteer event and get your attendance verified to
              earn a certificate.
            </p>
          </div>
        )}

        {/* Certificates */}
        {!error && certificates.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <div key={certificate.certificateId}>
                <CertificateCard
                  certificate={certificate}
                  onDownload={handleDownload}
                />

                {downloading === certificate.certificateId && (
                  <p className="mt-2 text-center text-sm text-gray-500">
                    Preparing your certificate...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
