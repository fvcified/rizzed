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
      className="footer-icon"
      data-tooltip={tooltip}
    >
      <Image src={src} alt={alt} width={32} height={32} />
    </Link>
  );
}
