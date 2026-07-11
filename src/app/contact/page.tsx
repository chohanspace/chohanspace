import { ContactForm } from './ContactForm';

export default function ContactPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="section-shell px-6 py-10 text-center md:px-10 md:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Contact</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">Let&apos;s build something memorable.</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Share the vision, the challenge, and the next step. We&apos;ll shape a polished experience that feels effortless from the first click.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <div className="section-shell p-6 md:p-8">
            <h2 className="mb-6 text-center text-2xl font-semibold">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
