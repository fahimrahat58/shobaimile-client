"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
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
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState("");

  useEffect(() => {
    async function loadCertificates() {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(`${API_URL}/api/certificates/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result: CertificatesResponse = await response.json();

        if (!response.ok) {
          throw new Error("Certificates load করা যায়নি।");
        }

        setCertificates(result.certificates || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  async function handleDownload(certificateId: string) {
    try {
      setDownloading(certificateId);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API_URL}/api/certificates/${encodeURIComponent(certificateId)}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Certificate download করা যায়নি।");
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `certificate-${certificateId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(fileUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading("");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="font-semibold text-emerald-600">ShobaiMile</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My Certificates
          </h1>

          <p className="mt-2 text-gray-500">
            View and download your volunteering certificates.
          </p>
        </div>

        {loading && (
          <p className="py-10 text-center text-gray-500">
            Loading certificates...
          </p>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
        )}

        {!loading && !error && certificates.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📜</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No Certificates Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Complete a volunteer event and get your attendance verified to
              earn a certificate.
            </p>
          </div>
        )}

        {!loading && !error && certificates.length > 0 && (
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
