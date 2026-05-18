export function GrindLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polygon
        fill="white"
        points="143.61 385.49 198.34 326.26 114.09 217.41 205.11 124.54 416.66 124.54 492.3 37.21 166.98 37.21 7.7 211.35 143.61 385.49"
      />
      <polygon
        fill="white"
        points="205.11 462.79 261.68 462.79 475.08 206.95 227.8 206.95 205.11 236.47 242.01 285.67 307.19 285.67 182.35 430.81 205.11 462.79"
      />
    </svg>
  )
}
