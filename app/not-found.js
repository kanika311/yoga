import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-script text-5xl text-gold">Namaste</p>
      <h1 className="mt-3 font-serif text-5xl text-forest">Page not found</h1>
      <Link href="/" className="btn-forest mt-8">
        Return home
      </Link>
    </section>
  );
}
