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

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Please login first.");
    }

    return data.token;
  };

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
        } catch {}

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

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-6 sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-emerald-600 sm:text-base">
            ShobaiMile
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            My Certificates
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
            View and download your volunteering certificates.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-600 sm:p-4 sm:text-base">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="min-w-0 break-words">{error}</p>
          </div>
        )}

        {!error && certificates.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-8 text-center shadow-sm sm:px-8 sm:py-12">
            <FileX className="mx-auto h-10 w-10 text-gray-300 sm:h-12 sm:w-12" />

            <h2 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
              No Certificates Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
              Complete a volunteer event and get your attendance verified to
              earn a certificate.
            </p>
          </div>
        )}

        {!error && certificates.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {certificates.map((certificate) => (
              <div key={certificate.certificateId} className="min-w-0">
                <CertificateCard
                  certificate={certificate}
                  onDownload={handleDownload}
                />

                {downloading === certificate.certificateId && (
                  <p className="mt-2 text-center text-xs text-gray-500 sm:text-sm">
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
