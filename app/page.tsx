import Link from "next/link";
import TypedText from "@/components/TypedText";
import TitleAnimator from "@/components/TitleAnimator";
import FooterIcon from "@/components/FooterIcon";

const socialLinks = [
  {
    href: "https://github.com/fvcified",
    tooltip: "github/fvcified",
    src: "/images/github.svg",
    alt: "GitHub",
  },
  {
    href: "https://open.spotify.com/user/31gupde4ngfbbksvy5q6pb6b2474",
    tooltip: "Spotify",
    src: "/images/spotify.svg",
    alt: "Spotify",
  },
  {
    href: "https://gitlab.com/fvcified",
    tooltip: "gitlab/fvcified",
    src: "/images/gitlab.svg",
    alt: "GitLab",
  },
  {
    href: "mailto:fvskid@gmail.com",
    tooltip: "fvskid@gmail.com",
    src: "/images/email.svg",
    alt: "Email",
  },
];

export default function Home() {
  return (
    <>
      <TitleAnimator />
      <main>
        <div className="container">
          <div className="square">
            <div className="details">
              <h1 className="centered">
                <TypedText />
                <span className="cursor">_</span>
              </h1>
              <p className="centered">
                Informatics Engineering Student ; Developer &amp; Builder ; Tech
                &amp; Cybersecurity Enthusiast ; Research
              </p>
            </div>

            <div className="links">
              <Link
                href="https://dontasktoask.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                dontasktoask
              </Link>
              {" ; "}
              <Link
                href="https://fvkidsite.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="copyright-link"
              >
                <span>{"{ fvkid.site }"}</span>
              </Link>
              {" ; "}
              <Link
                href="https://itsmy.gitbook.io/user/"
                target="_blank"
                rel="noopener noreferrer"
              >
                README
              </Link>
              {" ; "}
              <Link
                href="https://noskid.today/"
                target="_blank"
                rel="noopener noreferrer"
              >
                no fvskid
              </Link>
            </div>

            <div className="footer-icons">
              {socialLinks.map((link) => (
                <FooterIcon
                  key={link.alt}
                  href={link.href}
                  tooltip={link.tooltip}
                  src={link.src}
                  alt={link.alt}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
