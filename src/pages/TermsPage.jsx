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

function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Use | Fluxo</title>
        <meta
          name="description"
          content="The terms that apply when you use fluxo.com.sg, the website of Fluxo Pte. Ltd., a Singapore software company."
        />
        <link rel="canonical" href="https://fluxo.com.sg/terms" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <Header />

        <main className="flex-1">
          <header className="relative pt-24 lg:pt-32 pb-12 lg:pb-16 border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-4">Legal</p>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-[-0.03em] leading-[1.06] mb-5">
                  Terms of Use
                </h1>
                <p className="text-sm font-mono text-muted-foreground">Last updated: {UPDATED}</p>
              </div>
            </div>
          </header>

          <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <div className="max-w-3xl mx-auto">
              <P>
                These terms apply to your use of fluxo.com.sg (the &ldquo;site&rdquo;), which is run by Fluxo Pte.
                Ltd. (&ldquo;Fluxo&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a company registered in Singapore. By
                using the site, you agree to these terms. If you don&rsquo;t agree, please don&rsquo;t use the site.
              </P>

              <H2>What these terms cover</H2>
              <P>
                These terms cover the website only. They do not govern our software products or our client work:
              </P>
              <UL
                items={[
                  'Each Fluxo product (for example, Selka at selka.sg) has its own terms of service and privacy policy, which apply when you use that product.',
                  'Custom software we build for a client is governed by the proposal, agreement or contract signed for that engagement. If anything on this site differs from a signed agreement, the signed agreement wins.',
                ]}
              />

              <H2>Using the site</H2>
              <P>You&rsquo;re welcome to browse, read and share links to the site. When you use it, please don&rsquo;t:</P>
              <UL
                items={[
                  'use the site for anything unlawful, fraudulent or harmful;',
                  'try to gain unauthorised access to the site, our systems or other people’s data, or interfere with how the site works;',
                  'send spam, automated or bulk submissions, or malicious content through the contact form;',
                  'scrape or copy the site in bulk, or use its content to build a competing or look-alike site; or',
                  'pretend to be Fluxo or suggest that we endorse you when we don’t.',
                ]}
              />
              <P>We may block access or take other reasonable steps if we believe these terms are being broken.</P>

              <H2>Our content and trade marks</H2>
              <P>
                The text, design, graphics, illustrations, code and other content on the site, and the Fluxo name
                and logo, belong to Fluxo or the people who licensed them to us. You may view the site and share
                links to it, and you may quote short extracts with credit and a link back. Otherwise, please ask us
                in writing before copying, republishing or adapting our content. Names and logos of clients and
                third parties shown on the site belong to their owners.
              </P>

              <H2>Information on the site</H2>
              <P>
                The site gives general information about Fluxo, our services and our products. We work to keep it
                accurate and up to date, but we don&rsquo;t promise that everything on it is complete, current or
                suitable for your situation. Articles and guides are general information, not legal, financial, tax
                or professional advice; please get advice for your own circumstances before acting on them.
              </P>
              <P>
                Examples, case studies, prices, timelines and feature descriptions on the site are indicative and are
                not an offer. What we commit to is set out in a written proposal or agreement. Information about
                government grants or schemes may change, and eligibility is decided by the relevant agency, not by
                Fluxo.
              </P>

              <H2>Links to other sites</H2>
              <P>
                The site links to websites and services run by others, such as our product sites, WhatsApp, social
                media and government agencies. We don&rsquo;t control those sites and aren&rsquo;t responsible for
                their content, availability or privacy practices. Your use of them is subject to their own terms.
              </P>

              <H2>Enquiries and messages you send us</H2>
              <P>
                When you send us an enquiry through the contact form, by email or on WhatsApp, please give accurate
                contact details and don&rsquo;t include confidential or sensitive information you aren&rsquo;t ready
                to share. Sending an enquiry doesn&rsquo;t create a contract or oblige either of us to work together.
                If you&rsquo;d like to share confidential business details before we start, tell us and we can sign
                a non-disclosure agreement first.
              </P>
              <P>
                Ideas, feedback or suggestions you send us about the site or our services are welcome. You keep any
                rights you have in them, but you agree that we may use general ideas and feedback to improve our
                services without owing you anything for it. Anything you share as part of a client engagement is
                instead covered by that engagement&rsquo;s agreement.
              </P>

              <H2>Security</H2>
              <P>
                If you think you&rsquo;ve found a security issue with the site, please tell us at the email address
                below rather than testing it further or sharing it publicly. We appreciate reports made in good faith
                and will look into them promptly.
              </P>

              <H2>Availability</H2>
              <P>
                We provide the site on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We may change,
                suspend or remove any part of it at any time, and we don&rsquo;t guarantee that it will always be
                available or free of errors or viruses.
              </P>

              <H2>Limitation of liability</H2>
              <P>
                To the fullest extent permitted by law, Fluxo is not liable for any loss or damage arising from your
                use of, or inability to use, the site or any content on it, or from relying on information on the
                site, including indirect or consequential loss and loss of profit, revenue, data or business. Nothing
                in these terms limits or excludes liability that cannot be limited or excluded by law.
              </P>

              <H2>Your personal data</H2>
              <P>
                How we handle personal data you give us through the site, including through the contact form, is
                explained in our{' '}
                <Link to="/privacy" className={linkClass}>
                  Privacy Policy
                </Link>
                .
              </P>

              <H2>Changes to these terms</H2>
              <P>
                We may update these terms from time to time. The &ldquo;last updated&rdquo; date at the top shows
                the current version. If you keep using the site after a change, the updated terms apply.
              </P>

              <H2>Governing law</H2>
              <P>
                These terms are governed by the laws of Singapore, and the courts of Singapore have jurisdiction over
                any dispute arising from them or from your use of the site.
              </P>

              <H2>Contact</H2>
              <P>
                Questions about these terms? Email{' '}
                <a href={`mailto:${EMAIL}`} className={linkClass}>
                  {EMAIL}
                </a>{' '}
                or write to Fluxo Pte. Ltd., Ark@KB, 68 Kaki Bukit Ave 6, #04-19, Singapore 417896.
              </P>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default TermsPage;
