export function AmbientBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none -z-20 opacity-60 [mask-image:linear-gradient(to_bottom,white_30%,transparent_90%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[260px] bg-teal-500/10 dark:bg-[#2FA69A]/10 rounded-full blur-2xl pointer-events-none -z-10 transform-gpu" />
    </>
  );
}
