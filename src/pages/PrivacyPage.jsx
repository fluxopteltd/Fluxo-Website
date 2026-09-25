import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const UPDATED = '25 September 2026';
const EMAIL = 'business@fluxo.com.sg';

const linkClass = 'text-primary underline underline-offset-4';

function H2({ children }) {
  return (
    <h2 className="text-2xl md:text-[1.75rem] font-bold text-foreground tracking-tight leading-tight mt-14 mb-5">
      {children}
    </h2>
  );
}

function P({ children }) {
  return <p className="text-[17px] leading-[1.8] text-foreground/85 mb-6">{children}</p>;
}

function UL({ items }) {
  return (
    <ul className="mb-7 space-y-3 list-none pl-0">
      {items.map((item, i) => (
        <li key={i} className="relative pl-6 text-[17px] leading-[1.75] text-foreground/85">
          <span
            className="absolute left-0 top-[0.7em] w-2 h-2 rounded-sm bg-gradient-to-br from-[#2A9EFF] to-[#7C28D8]"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Fluxo</title>
        <meta
          name="description"
          content="How Fluxo Pte. Ltd. collects, uses, protects and retains personal data through fluxo.com.sg and its business dealings, in line with Singapore's PDPA."
        />
        <link rel="canonical" href="https://fluxo.com.sg/privacy" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <Header />

        <main className="flex-1">
          <header className="relative pt-24 lg:pt-32 pb-12 lg:pb-16 border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-4">Legal</p>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-[-0.03em] leading-[1.06] mb-5">
                  Privacy Policy
                </h1>
                <p className="text-sm font-mono text-muted-foreground">Last updated: {UPDATED}</p>
              </div>
            </div>
          </header>

          <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <div className="max-w-3xl mx-auto">
              <P>
                Fluxo Pte. Ltd. (&ldquo;Fluxo&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a Singapore company
                that builds custom software and runs its own software products. We handle personal data in line
                with Singapore&rsquo;s Personal Data Protection Act 2012 (&ldquo;PDPA&rdquo;). This policy explains
                what we collect through fluxo.com.sg and in our business dealings with you, why we collect it, and
                the choices you have.
              </P>

              <H2>What this policy covers</H2>
              <P>
                This policy covers the fluxo.com.sg website and the enquiries, proposals and correspondence we have
                with prospective and existing clients. It does not cover our software products. Each Fluxo product
                (for example, Selka at selka.sg) has its own privacy policy and terms, and those govern how that
                product handles data. Work we build for a client is governed by the agreement signed for that
                engagement, including any data protection terms in it.
              </P>

              <H2>What we collect</H2>
              <UL
                items={[
                  <>
                    <strong className="text-foreground">When you use our contact form:</strong> your name and email
                    address, and, if you choose to give them, your company name and phone number, plus the message
                    you write and the page you sent it from.
                  </>,
                  <>
                    <strong className="text-foreground">To protect the form from spam:</strong> a one-way hashed
                    version of your IP address (we do not store the address itself) and your browser&rsquo;s user
                    agent string.
                  </>,
                  <>
                    <strong className="text-foreground">When you email or message us:</strong> whatever you choose
                    to send, including your contact details and the content of the conversation. This includes
                    messages sent through the WhatsApp link on our site.
                  </>,
                  <>
                    <strong className="text-foreground">When you work with us:</strong> business contact details,
                    project information, and billing records needed to quote, deliver and invoice the work.
                  </>,
                  <>
                    <strong className="text-foreground">Site usage statistics:</strong> aggregated page-view data
                    (see &ldquo;Analytics and browser storage&rdquo; below).
                  </>,
                ]}
              />
              <P>Please don&rsquo;t send us sensitive personal data (such as NRIC numbers or health information) through the contact form.</P>

              <H2>Why we use it</H2>
              <UL
                items={[
                  'To reply to your enquiry and follow up on the conversation you started.',
                  'To prepare proposals and quotations, deliver the work you engage us for, and invoice for it.',
                  'To keep the website and contact form secure and free of spam and abuse.',
                  'To understand, in aggregate, which pages are useful so we can improve the site.',
                  'To keep business records and meet our legal, accounting and tax obligations.',
                ]}
              />
              <P>
                We use your data only for the purposes above, or for other purposes we tell you about and you agree
                to. We do not sell your personal data, and we do not add you to a marketing list because you filled
                in the contact form.
              </P>

              <H2>Analytics and browser storage</H2>
              <P>
                We use Vercel Web Analytics to count page views. According to{' '}
                <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Vercel&rsquo;s documentation
                </a>
                , it does not use third-party cookies, identifies visits by a hash of the incoming request that is
                discarded after 24 hours, and gives us aggregated statistics (such as page, referrer, country, device
                type and browser) rather than data about individual visitors.
              </P>
              <P>
                The site stores your light or dark theme choice in your browser&rsquo;s local storage so it is
                remembered next time. It stays on your device and is not sent to us. Our fonts are loaded from Google
                Fonts, which means your browser connects to Google&rsquo;s servers to download them.
              </P>

              <H2>Who we share it with</H2>
              <P>We share personal data only where needed for the purposes above:</P>
              <UL
                items={[
                  'Service providers who host and run our systems on our behalf, including Vercel (website hosting and analytics), Supabase (the database behind our internal enquiry system), and our email and messaging providers.',
                  'Professional advisers such as our accountants, auditors and lawyers, where needed.',
                  'Authorities or other parties where the law requires or permits us to disclose it.',
                ]}
              />

              <H2>Transfers outside Singapore</H2>
              <P>
                Some of our service providers store or process data on servers outside Singapore. When personal data
                is transferred overseas, the PDPA requires us to ensure the recipient is bound by legally enforceable
                obligations to protect it to a standard at least comparable to the PDPA. We do this by using
                providers that are bound by contractual data protection terms.
              </P>

              <H2>How we protect it</H2>
              <P>
                We make reasonable security arrangements to protect personal data. Data sent through our website is
                encrypted in transit, access to our internal systems is limited to the people who need it, and our
                enquiry system is protected by access controls at the database level. No system is completely secure,
                but we take care to reduce the risk of unauthorised access, loss or misuse.
              </P>

              <H2>How long we keep it</H2>
              <P>
                We keep personal data only for as long as it serves the purpose it was collected for, or as needed
                for legal or business reasons such as accounting and tax records. Enquiries that do not lead to a
                project are deleted or anonymised once they are no longer needed. Records of client engagements are
                kept for as long as required by law and by our agreements with clients.
              </P>

              <H2>Withdrawing consent</H2>
              <P>
                You can withdraw your consent for us to collect, use or disclose your personal data at any time by
                emailing us at the address below. Once we receive your notice, we will let you know the likely
                consequences (for example, that we can no longer continue a conversation or deliver a project), and
                then stop using the data for the purposes you withdrew consent for, unless the law requires or
                permits us to keep using it. Withdrawing consent does not by itself mean all records are deleted; we
                may still need to keep some records as described under &ldquo;How long we keep it&rdquo;.
              </P>

              <H2>Access and correction</H2>
              <P>
                You can ask us for a copy of the personal data we hold about you and how it has been used or
                disclosed in the past year, or ask us to correct data that is wrong or incomplete. Send your request
                to our Data Protection Officer. We may need to verify your identity first. We will respond as soon as
                reasonably possible. If we cannot respond within 30 days of receiving your request, we will tell you
                in writing within that time when we will be able to respond. We may charge a reasonable fee for an
                access request, but only after giving you a written estimate first.
              </P>

              <H2>Data Protection Officer</H2>
              <P>
                For any question, request or complaint about how we handle personal data, contact our Data
                Protection Officer:
              </P>
              <div className="mb-8 rounded-2xl border border-border bg-muted/40 p-6 text-[16px] leading-[1.75] text-foreground/85">
                <p className="font-semibold text-foreground">Data Protection Officer, Fluxo Pte. Ltd.</p>
                <p>
                  Email:{' '}
                  <a href={`mailto:${EMAIL}`} className={linkClass}>
                    {EMAIL}
                  </a>
                </p>
                <p>Address: Ark@KB, 68 Kaki Bukit Ave 6, #04-19, Singapore 417896</p>
              </div>
              <P>
                If you are not satisfied with our response, you may contact the Personal Data Protection Commission
                (PDPC) at{' '}
                <a href="https://www.pdpc.gov.sg" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  pdpc.gov.sg
                </a>
                .
              </P>

              <H2>Changes to this policy</H2>
              <P>
                We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top shows
                the current version. Please also read our{' '}
                <Link to="/terms" className={linkClass}>
                  Terms of Use
                </Link>
                .
              </P>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default PrivacyPage;
