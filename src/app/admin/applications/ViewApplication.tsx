<div className="mb-8">
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#0099cc]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h1l2-3 4 7h9"
        />
      </svg>
      Van Summary
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-gray-700">
      {[
        { label: "Van ID", value: staticVan.id },
        { label: "Registration", value: staticVan.registrationNumber },
        { label: "Make & Model", value: staticVan.makeAndModel },
        { label: "Seating Capacity", value: staticVan.seatingCapacity },
        { label: "Owner", value: staticVan.ownerName },
        {
          label: "Status",
          value: staticVan.status,
          valueClass:
            staticVan.status === "Active"
              ? "text-green-600"
              : staticVan.status === "Inactive"
              ? "text-red-600"
              : "text-yellow-600",
        },
      ].map(({ label, value, valueClass }) => (
        <div key={label}>
          <p className="uppercase text-xs tracking-wide text-gray-400 mb-1">
            {label}
          </p>
          <p className={`font-semibold text-lg ${valueClass || ""}`}>{value}</p>
        </div>
      ))}
    </div>
  </div>
</div>;
