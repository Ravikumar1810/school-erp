"use client";

import Link from "next/link";
import { GitBranch, Globe, Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Logo } from "@/components/common/Logo";
import { siteConfig } from "@/config/site";

type FooterLink = {
  label: string;
  href: string;
};

const productLinks: FooterLink[] = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Dashboard", href: "/login" },
  { label: "Login", href: "/login" },
];

const companyLinks: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

const githubUrl = siteConfig.links?.github ?? "#";
const linkedinUrl = siteConfig.links?.linkedin ?? "#";

export function Footer(): React.JSX.Element {
  return (
    <footer id="contact" className="border-t border-white/10 bg-slate-950">
      <Container>
        <div className="grid gap-14 py-20 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />

            <p className="mt-6 max-w-md leading-8 text-slate-400">
              A modern School ERP platform built to simplify school administration
              with secure role-based access for principals, teachers, students
              and parents.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="h-5 w-5 text-emerald-400" />
                Bangalore, Karnataka
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="h-5 w-5 text-emerald-400" />
                +91 1234567890
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="h-5 w-5 text-emerald-400" />
                support@schoolerp.com
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Product</h3>

            <ul className="mt-6 space-y-4">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Company</h3>

            <ul className="mt-6 space-y-4">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Legal</h3>

            <ul className="mt-6 space-y-4">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex gap-4">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-emerald-500 hover:bg-emerald-500"
              >
                <GitBranch className="h-5 w-5 text-white" />
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-emerald-500 hover:bg-emerald-500"
              >
                <Globe className="h-5 w-5 text-white"  />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-sm text-slate-500 md:flex-row">
          <p>{siteConfig.footer?.copyright}</p>

          <p>
            Made with ❤️ by{" "}
            <a
              href="https://www.linkedin.com/in/ravikumar-n-k/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-emerald-400"
            >
              Ravikumar N K
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}