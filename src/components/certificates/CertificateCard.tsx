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
    <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <span className="text-2xl sm:text-3xl">📜</span>

          <h3 className="mt-3 break-words text-base font-bold leading-snug text-gray-900 sm:text-lg">
            {certificate.eventTitle}
          </h3>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:px-3 sm:text-xs">
          Verified
        </span>
      </div>

      <div className="mt-4 space-y-2.5 text-xs text-gray-600 sm:mt-5 sm:text-sm">
        <p className="flex flex-wrap items-center justify-between gap-1">
          <span>Volunteer Hours:</span>
          <span className="font-semibold text-gray-900">
            {certificate.volunteerHours}
          </span>
        </p>

        <p className="flex flex-wrap items-center justify-between gap-1">
          <span>Total Points:</span>
          <span className="font-semibold text-gray-900">
            {certificate.totalPoints}
          </span>
        </p>

        <p className="flex flex-wrap items-center justify-between gap-1">
          <span>Verified Date:</span>
          <span className="font-semibold text-gray-900">
            {new Date(certificate.verifiedAt).toLocaleDateString()}
          </span>
        </p>
      </div>

      <button
        onClick={() => onDownload(certificate.certificateId)}
        className="mt-5 w-full rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:mt-6 sm:py-3 sm:text-base"
      >
        Download Certificate
      </button>
    </div>
  );
}
