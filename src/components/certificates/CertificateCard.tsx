type Certificate = {
  certificateId: string;
  eventTitle: string;
  volunteerHours: number;
  totalPoints: number;
  verifiedAt: string;
};

type CertificateCardProps = {
  certificate: Certificate;
  onDownload: (certificateId: string) => void;
};

export default function CertificateCard({
  certificate,
  onDownload,
}: CertificateCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-3xl">📜</span>

          <h3 className="mt-3 text-lg font-bold text-gray-900">
            {certificate.eventTitle}
          </h3>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Verified
        </span>
      </div>

      <div className="mt-5 space-y-2 text-sm text-gray-600">
        <p>
          Volunteer Hours:{" "}
          <span className="font-semibold text-gray-900">
            {certificate.volunteerHours}
          </span>
        </p>

        <p>
          Total Points:{" "}
          <span className="font-semibold text-gray-900">
            {certificate.totalPoints}
          </span>
        </p>

        <p>
          Verified Date:{" "}
          <span className="font-semibold text-gray-900">
            {new Date(certificate.verifiedAt).toLocaleDateString()}
          </span>
        </p>
      </div>

      <button
        onClick={() => onDownload(certificate.certificateId)}
        className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
      >
        Download Certificate
      </button>
    </div>
  );
}
