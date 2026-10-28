import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  // Size and border classes, e.g. "w-12 h-12 border border-border"
  className?: string;
}

export default function Avatar({ src, alt, className = "" }: AvatarProps) {
  return (
    <div className={`relative rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      <Image src={src} alt={alt} fill sizes="64px" className="object-cover" />
    </div>
  );
}
