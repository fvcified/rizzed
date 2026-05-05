import Image from "next/image";
import Link from "next/link";

interface FooterIconProps {
  href: string;
  tooltip: string;
  src: string;
  alt: string;
}

export default function FooterIcon({ href, tooltip, src, alt }: FooterIconProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-icon inline-flex items-center justify-center transition-transform duration-500 ease-out"
      data-tooltip={tooltip}
    >
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        className="
          w-8 h-8 cursor-pointer
          brightness-0 saturate-100 invert-[26%]
          transition-all duration-300 ease-in-out
        "
      />
    </Link>
  );
}