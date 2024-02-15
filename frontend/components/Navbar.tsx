import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5">
      <Link href="/">
        <Image src="/pbot.png" alt="logo" width={64} height={19} />
      </Link>
      <ul className="flex h-full gap-12 items-center lg:items-stretch">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-white cursor-pointer pb-1.5 transition-all hover:font-bold hover:text-vanilla"
            style={{ whiteSpace: "nowrap" }}
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;