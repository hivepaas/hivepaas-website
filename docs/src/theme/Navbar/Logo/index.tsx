import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useThemeConfig } from '@docusaurus/theme-common';

/**
 * The landing page's brand: its logo, glowing amber, and "Hive" with "PaaS" in
 * amber. The link and the image are the navbar config's.
 */
export default function NavbarLogo(): ReactNode {
  const {
    navbar: { logo },
  } = useThemeConfig();
  const logoLink = useBaseUrl(logo?.href || '/');
  const logoSrc = useBaseUrl(logo?.src ?? 'img/logo.svg');

  return (
    <Link
      to={logoLink}
      className="navbar__brand hp-brand"
      aria-label="HivePaaS Home"
      {...(logo?.target && { target: logo.target })}
    >
      <span className="hp-brand__icon">
        <img src={logoSrc} width={30} height={30} alt="" />
      </span>
      <span className="hp-brand__name">
        Hive<span className="hp-brand__highlight">PaaS</span>
      </span>
    </Link>
  );
}
