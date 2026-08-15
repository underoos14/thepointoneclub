export function Footer() {
  return (
    <footer className="bg-green-900 text-paper/80">
      <div className="container-site flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          <p className="display-heading text-2xl text-paper">
            THE POINT ONE<span className="text-red-500">.</span> CLUB
          </p>
          <p className="mt-4 text-sm leading-relaxed text-paper/60">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold uppercase tracking-wider text-paper/50">Hyderabad</span>
          <a
            href="mailto:hello@thepointone.club"
            className="transition-colors hover:text-paper"
          >
            hello@thepointone.club
          </a>
          <span className="text-paper/50">© {new Date().getFullYear()} The Point One Club</span>
        </div>
      </div>
    </footer>
  );
}
