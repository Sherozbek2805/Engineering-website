export default function BackgroundGradient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* Radial glow at top-center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(102,51,238,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Faint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(102,51,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(102,51,238,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
