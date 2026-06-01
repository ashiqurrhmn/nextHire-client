import Image from "next/image";

const Stats = () => {
  const stats = [
    {
      icon: "jobs",
      value: "50K",
      label: "Active Jobs",
    },
    {
      icon: "companies",
      value: "12K",
      label: "Companies",
    },
    {
      icon: "seekers",
      value: "2M",
      label: "Job Seekers",
    },
    {
      icon: "rate",
      value: "97%",
      label: "Satisfaction Rate",
    },
  ];

  return (
    <section className="relative isolate min-h-180 overflow-hidden px-5 pt-24 pb-8 sm:min-h-[680px] md:min-h-160 md:px-8 md:pt-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/Assets/globe.png"
          alt=""
          width={1440}
          height={1882}
          className="absolute left-1/2 top-0 h-auto w-245 max-w-none -translate-x-1/2 -translate-y-[300px] select-none opacity-90 sm:w-[1120px] sm:-translate-y-[420px] md:w-[1110px] md:-translate-y-[482px] lg:w-[1180px] lg:-translate-y-[520px]"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_18%,rgba(0,0,0,0.18)_58%,rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-[968px] flex-col justify-end sm:min-h-[600px] md:min-h-[540px]">
        <h2 className="mx-auto mb-9 max-w-[560px] text-center text-[27px] font-light leading-[1.36] tracking-[-0.01em] text-white/72 sm:text-[30px]">
          Assisting over{" "}
          <span className="font-normal text-white">15,000</span> job seekers
          <br className="hidden sm:block" /> find their dream positions.
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="flex h-[186px] flex-col justify-between rounded-lg border border-white/[0.08] bg-black/60 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-sm"
            >
              <StatIcon type={stat.icon} />
              <div>
                <p className="text-[42px] font-semibold leading-none tracking-[-0.04em] text-white">
                  {stat.value}
                </p>
                <p className="mt-4 text-[12px] font-normal leading-none text-white">
                  {stat.label}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatIcon = ({ type }) => {
  const iconClass = "h-[18px] w-[18px] text-white";

  if (type === "companies") {
    return (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 20h16" />
        <path d="M6 20V9h4v11" />
        <path d="M14 20V4h4v16" />
        <path d="M10 13h4" />
      </svg>
    );
  }

  if (type === "seekers") {
    return (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
        <path d="M8.5 11a2 2 0 1 0 4 0" />
        <path d="M8 8.2h.01" />
        <path d="M13 8.2h.01" />
      </svg>
    );
  }

  if (type === "rate") {
    return (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 4 1.9 4 4.4.6-3.2 3.1.8 4.4-3.9-2.1-3.9 2.1.8-4.4-3.2-3.1 4.4-.6L12 4Z" />
        <path d="M12 9.2v2.8" />
        <path d="M10.6 10.6h2.8" />
      </svg>
    );
  }

  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
      <path d="M6 7h10a2 2 0 0 1 2 2v3.5" />
      <path d="M6 7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6" />
      <circle cx="17" cy="17" r="3" />
      <path d="m19.2 19.2 1.8 1.8" />
    </svg>
  );
};

export default Stats;
