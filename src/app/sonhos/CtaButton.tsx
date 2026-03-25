"use client";

export function CtaButton() {
  function handleClick() {
    const el = document.getElementById("dream-textarea") as HTMLTextAreaElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.focus(), 400);
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-full bg-gold hover:bg-gold-light text-mystic-bg font-body font-bold text-base px-10 py-4 shadow-gold hover:shadow-gold-lg transition-all duration-200"
    >
      INTERPRETAR MEU SONHO AGORA
    </button>
  );
}
