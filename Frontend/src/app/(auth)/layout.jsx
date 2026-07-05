export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Brand Panel (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#2563EB]">
        {/* Decorative abstract background element */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)",
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-md px-8">
          {/* Logo */}
          <div className="mb-8 w-16 h-16 rounded-xl bg-on-primary/10 backdrop-blur-sm border border-on-primary/20 flex items-center justify-center shadow-lg">
            <span
              className="material-symbols-outlined text-on-primary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              work
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-primary mb-4 tracking-tight">PeakHire</h1>
          <p className="font-body-lg text-body-lg text-primary-fixed-dim/90 font-light">
            Streamline your technical hiring process.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-12 bg-surface-container-lowest">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-secondary text-on-secondary flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                work
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">PeakHire</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
