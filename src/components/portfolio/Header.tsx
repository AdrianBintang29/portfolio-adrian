export function Header() {
  return (
    <header className="border-b border-gray-blue/20 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-navy"
        >
          Muhammad Adrian Bintang Hariyanto
        </a>

        <nav aria-label="Navigasi utama">
          <ul className="flex items-center gap-6 text-sm font-medium text-gray-blue">
            <li>
              <a className="transition-colors hover:text-navy" href="#projects">
                Projects
              </a>
            </li>

            <li>
              <a className="transition-colors hover:text-navy" href="#about">
                About
              </a>
            </li>

            <li>
              <a className="transition-colors hover:text-navy" href="#skills">
                Skills
              </a>
            </li>

            <li>
              <a className="transition-colors hover:text-navy" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}