type LogoMarkProps = {
  size?: number;
  title?: string;
  decorative?: boolean;
  style?: React.CSSProperties;
};

export default function LogoMark({ size = 42, title = 'Smakvärlden', decorative = false, style }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      style={{ borderRadius: size * 0.23, display: 'block', flexShrink: 0, ...style }}
    >
      <defs>
        <radialGradient id="logo-mark-bg" cx="32%" cy="24%" r="82%">
          <stop offset="0%" stopColor="#4a2718" />
          <stop offset="100%" stopColor="#241008" />
        </radialGradient>
      </defs>
      <rect width="96" height="96" rx="22" fill="url(#logo-mark-bg)" />
      <path d="M22 58h50" fill="none" stroke="#d7b45a" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M25 56c2-16.5 14.2-27.5 29-27.5S81 39.5 83 56" fill="none" stroke="#d7b45a" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M49 28v-5.5" fill="none" stroke="#d7b45a" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M44 22.5h10" fill="none" stroke="#d7b45a" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M26 62h38" fill="none" stroke="#d7b45a" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M33 56l13-12 12 11 15-17" fill="none" stroke="#d7b45a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M63 38h10v10" fill="none" stroke="#d7b45a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M47 58v24" fill="none" stroke="#d7b45a" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M39 58v12M43 58v12M51 58v12M39 70c0 4.8 3 7.3 8 7.3s8-2.5 8-7.3" fill="none" stroke="#d7b45a" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
