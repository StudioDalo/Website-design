import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement> & { name?: string };
export function Icon({ name = "arrow", ...props }: Props) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    down: <path d="M12 4v16m-6-6 6 6 6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    wall: (
      <>
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
      </>
    ),
    index: <path d="M3 5h18M3 12h18M3 19h18" />,
    left: <path d="M20 12H4m6-6-6 6 6 6" />,
    right: <path d="M4 12h16m-6-6 6 6-6 6" />,
    plus: <path d="M12 4v16M4 12h16" />,
    share: (
      <>
        <path d="M12 15V3m-5 5 5-5 5 5M5 13v7h14v-7" />
      </>
    ),
    menu: <path d="M3 8h18M3 16h18" />,
    expand: <path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6" />,
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6h10c14 0 20 26 0 26H6V6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M13 32 27 6M19 22h11" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
