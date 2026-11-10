import Image from "next/image";

type Props = {
  size?: number;          // 아이콘 크기(px)
  subtitle?: string;      // 로고 아래 작은 글씨 (선택)
  onClick?: () => void;   // 눌렀을 때 동작 (선택)
};

export default function Logo({ size = 40, subtitle, onClick }: Props) {
  const textH = Math.round(size * 0.55); // NEURON 글자 높이
  const lightW = Math.round((textH * 745) / 188);
  const darkW = Math.round((textH * 739) / 188);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="NEURON 대시보드로 이동"
      className="flex items-center gap-3 text-left"
    >
      <Image
        src="/neuron-icon.png" alt="" width={size} height={size} priority
        className="rounded-[22%] shadow-md shadow-violet-500/20"
      />
      <span className="flex flex-col gap-1">
        <span className="relative block" style={{ width: lightW, height: textH }}>
          <Image
            src="/NEURON_light.svg" alt="NEURON" unoptimized priority
            width={lightW} height={Math.round((textH * 198) / 188)}
            className="absolute left-0 top-0 block dark:hidden"
          />
          <Image
            src="/NEURON_dark.svg" alt="NEURON" unoptimized priority
            width={darkW} height={textH}
            className="absolute left-0 top-0 hidden dark:block"
          />
        </span>
        {subtitle && (
          <span className="text-[11px] font-medium text-muted-foreground">{subtitle}</span>
        )}
      </span>
    </button>
  );
}