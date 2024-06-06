import Link from "next/link";
import Image from "next/image";
// import logo from "@/public/logo.png";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src="/logo.png"
        height="60"
        width="60"
        quality={100}
        alt="The Wild Oasis logo"
      />
      {/* <Image src={logo} alt="The Wild Oasis logo" /> */}
      {/* 
      what this image component would do
      1. automatically serve correctly sized images in modern format (webp)
      2. prevents layout shifts
      3. automatically lazy laods images, only when they enter the veiwport */}
      <span className="text-xl font-semibold text-primary-100">
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
