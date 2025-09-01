import { ContactForm } from './ContactForm';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Get In Touch</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Have a project in mind, a question, or just want to talk tech? We&apos;d love to hear from you.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">Send Us a Message</h2>
            <ContactForm />
      </div>
    </div>
  );
}
