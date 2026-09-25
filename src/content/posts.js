// Blog content. Plain data (no JSX) so vite.config.js can import it at build
// time and prerender each article to static HTML for crawlers and AI search.
import { stripInline } from './inline.js';

export const SITE_URL = 'https://fluxo.com.sg';

export const BLOG_INDEX_META = {
  title: 'Blog — Fluxo | Custom software for Singapore SMEs',
  description:
    'Practical writing from Fluxo, a Singapore custom software company, on building operational systems that fit how small and mid-sized businesses actually work.',
};

const AUTHOR = { name: 'Jay Tan', role: 'Co-founder & Technical Lead, Fluxo' };

export const posts = [
  {
    slug: 'custom-software-developer-singapore-why-smes-choose-fluxo',
    category: 'Choosing a software partner',
    title: 'Looking for a custom software developer in Singapore? Here is why SMEs choose Fluxo',
    seoTitle: 'Custom Software Developer in Singapore: Why SMEs Choose Fluxo',
    dek:
      'Most small businesses in Singapore run on Excel and WhatsApp, not because they want to, but because real custom software has always been priced for companies ten times their size. We started Fluxo to change that.',
    description:
      'Fluxo is a Singapore custom software company that builds operational systems around how an SME actually works — shown as a working demo first, with the first module live in about six weeks, and paid as a monthly subscription instead of a large upfront fee.',
    datePublished: '2026-09-25',
    dateModified: '2026-09-25',
    readMinutes: 9,
    author: AUTHOR,
    tldr: [
      '**Fluxo** (Fluxo Pte. Ltd.) is a Singapore software company that builds custom operational systems for small and mid-sized businesses: job and order management, compliance records, reporting, invoicing and customer workflows.',
      'We build **around your existing workflow**, not a template you have to bend to. Your first meeting with us includes a **working demo** shaped around your business, not a slide deck.',
      'Instead of a large one-off bill, most clients pay a **predictable monthly subscription** that covers hosting, security, bug fixes and small improvements, often for less than the cost of an intern.',
      'The first module is typically **live in about 6 weeks** and the **full system in about 14 weeks**. You pay in stages as each part is delivered and accepted.',
      'We are the right fit for businesses **without their own tech team**. If you already have in-house developers, we will tell you so.',
    ],
    sections: [
      {
        id: 'the-gap',
        toc: 'The gap nobody fills',
        heading: 'The gap nobody fills: SMEs that need a system but can’t afford a software house',
        blocks: [
          { p: 'Walk into almost any growing Singapore SME, whether it is a workshop, a marine contractor, a distributor or a service company, and you will find the same set-up: a shared Excel file that only one person truly understands, a few WhatsApp groups where jobs, photos and approvals get lost, and a lot of re-typing between the two.' },
          { p: 'Everyone knows a proper system would help. The problem is the options on the table:' },
          {
            ul: [
              '**Traditional software agencies** quote five or six figures upfront, take many months, and charge again for every change after launch.',
              '**Off-the-shelf SaaS** is affordable, but it is built for the average customer. Your team ends up changing how they work to fit the software, and the steps that make your business different are exactly the ones it can’t handle.',
              '**Freelancers** can be cheap and quick, but when the person moves on, so does the knowledge of how your system works.',
            ],
          },
          { p: 'So most SMEs stay on spreadsheets. Fluxo exists for exactly this gap: businesses that genuinely need their own system, but should not have to pay enterprise prices or accept enterprise timelines to get one.' },
        ],
      },
      {
        id: 'built-around-you',
        toc: 'Built around your workflow',
        heading: '1. We build around how you actually work',
        blocks: [
          { p: 'Every Fluxo engagement starts with your operation, not our feature list. We look at what your business does, who touches each job, which forms and reports you depend on, and where time is being lost. Then we build the system from that workflow.' },
          { p: 'In practice, this means the software speaks your language. If your team has a four-stage certification renewal that nobody else in the industry uses, the system follows your four stages. If your customers expect an invoice on WhatsApp with a PayNow QR code, that is what they get. If a compliance report used to take an afternoon to assemble by hand, it is generated from data your team already entered.' },
          { quote: 'Generic software makes the customer fit the product. We build the product to fit the customer.' },
          { p: 'It is still **your own system, under your own brand**. Because we build on a foundation that already runs other live client systems, you get proven security and reliability underneath without paying to reinvent it, and the part you see is shaped entirely around you.' },
        ],
      },
      {
        id: 'demo-first',
        toc: 'A demo, not a deck',
        heading: '2. You see a working demo before you commit',
        blocks: [
          { p: 'Most software vendors pitch with slides. A deck cannot show you whether software fits your operation, because fit lives in the details. So even in a first meeting, we usually bring a working demo built around what we think your business needs, using your terminology and your kind of data.' },
          { p: 'This changes the conversation. Instead of debating features in the abstract, you click through something real and tell us what is wrong with it. That saves both sides weeks, and it means the scope you sign is one you have already seen working.' },
        ],
      },
      {
        id: 'pricing',
        toc: 'Priced for SMEs',
        heading: '3. Priced like a subscription, not a capital project',
        blocks: [
          { p: 'Custom software has traditionally been sold like construction: a big quote upfront, a long build, then a separate bill every time something needs to change. For an SME, that is a large cash-flow hit on a project that is hard to judge before it exists.' },
          { p: 'Fluxo works differently. Most clients pay a modest set-up fee and then a **predictable monthly subscription**. The way we like to put it: you get a full tech team for less than the cost of an intern, and without the worry of whether the intern turns up on Monday.' },
          {
            callout: 'Hosting, security updates, system maintenance, bug fixes and minor feature changes are covered by the subscription. You are not charged extra every time you ask for a small tweak, which is how most of the market still works.',
            label: 'What the subscription covers',
          },
          { p: 'And if budget is tight, we say so early and work through it together, whether that means phasing features, adjusting the payment plan, or finding a simpler technical route that avoids an expensive component. Our goal is a system you can comfortably afford for years, not one big invoice.' },
        ],
      },
      {
        id: 'speed',
        toc: 'Six weeks to first launch',
        heading: '4. First module live in about 6 weeks, full system in about 14, and you pay as it lands',
        blocks: [
          { p: 'Modern, AI-assisted engineering has changed what a small, senior team can deliver. Work that used to need an agency team and a year-long timeline now ships in a fraction of the time, without skipping reviews, testing or security checks.' },
          { p: 'On a typical engagement, the first usable module, often the one your front-line staff touch every day, goes into production in about six weeks. The remaining modules follow over the next eight weeks or so, so the full system is usually complete in around 14 weeks. Your team is using real software from week six, not waiting for one big launch at the end.' },
          {
            ol: [
              '**Discover.** We map your workflow and pain points, and show a first demo.',
              '**Build in stages.** Each module is delivered, tested end-to-end by us, and then handed to you for user acceptance testing (usually about two weeks).',
              '**Run in parallel.** Your team can keep the old process running alongside the new system until everyone is confident.',
              '**Pay on acceptance.** Staged payments are tied to delivery, so quality has to be there before the next payment is due.',
            ],
          },
          { p: 'We design for as little training as possible. If your staff need a manual to do their daily job in our system, we have not finished designing it.' },
        ],
      },
      {
        id: 'outcomes',
        toc: 'Measured on outcomes',
        heading: '5. We measure success in hours saved, not features shipped',
        blocks: [
          { p: 'A system is only worth building if it reduces cost: fewer hours of re-typing, fewer mistakes, fewer people needed to chase paperwork, and faster answers when a customer or auditor asks for something. If a proposed feature still needs a lot of human effort to run, we will honestly tell you to stay on Excel for that part.' },
          { p: 'The work that tends to pay for itself fastest:' },
          {
            ul: [
              'Automated reports and documents generated from data already in the system: survey reports, certificates, job sheets and quotations.',
              'Expiry and maintenance tracking with reminders, so certifications, equipment servicing and renewals stop being missed.',
              'Customer-facing touches like WhatsApp invoices, PayNow QR payments and automatic service reminders.',
              'Stock and order flows that update themselves instead of being reconciled by hand at month end.',
            ],
          },
        ],
      },
      {
        id: 'long-term',
        toc: 'We stay after launch',
        heading: '6. We stay after launch',
        blocks: [
          { p: 'Operational software is infrastructure. Your business will change, through new regulations, new service lines or a new branch, and the system needs to change with it. Because our model is a long-term subscription, our incentives match yours: we only do well if your system keeps being useful year after year.' },
          { p: 'We also build our own software products. [Selka](https://selka.sg), our WhatsApp ordering platform, is one of them. Running products of our own keeps us honest about uptime, security and support, because we live with the same standards we deliver to clients.' },
        ],
      },
      {
        id: 'comparison',
        toc: 'How the options compare',
        heading: 'How Fluxo compares with the usual options',
        blocks: [
          {
            table: {
              caption: 'Comparison of Fluxo with software agencies, off-the-shelf SaaS and freelancers',
              head: ['', 'Traditional agency', 'Off-the-shelf SaaS', 'Freelancer', 'Fluxo'],
              highlight: 4,
              rows: [
                ['Fits your workflow', 'Yes', 'Partly — you adapt to it', 'Depends on the person', 'Yes — built from your workflow'],
                ['Upfront cost', 'High', 'Low', 'Low to medium', 'Modest set-up fee'],
                ['Ongoing changes', 'Billed per change', 'Wait for the vendor roadmap', 'Ad hoc, if still available', 'Minor changes included'],
                ['Time to go live', 'Months', 'Days', 'Varies', 'First module ~6 weeks, full system ~14'],
                ['How you evaluate it', 'Slides and a spec', 'Free trial', 'Portfolio', 'A working demo of your own workflow'],
                ['Continuity', 'Strong but expensive', 'Strong', 'Key-person risk', 'Long-term subscription partnership'],
              ],
            },
          },
        ],
      },
      {
        id: 'fit',
        toc: 'Is Fluxo right for you?',
        heading: 'Is Fluxo the right fit for your business?',
        blocks: [
          { p: 'We are honest about who we serve best. Fluxo is likely a strong fit if:' },
          {
            ul: [
              'You are an SME in Singapore or the region, with roughly a handful to a few hundred staff.',
              'Your operation runs on spreadsheets, paper forms or WhatsApp, and it is starting to cost you time, mistakes or customers.',
              'Your workflow is specific enough that off-the-shelf software keeps getting in the way.',
              'You **don’t have an in-house tech team**, and you would rather not build one.',
            ],
          },
          { p: 'We are probably not the right partner if you already employ your own developers (you need extra hands, not a partner), or if a standard, off-the-shelf tool already does the job well. In that case we will tell you, and point you to it.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Who is a good custom software developer in Singapore for small businesses?',
        a: 'Fluxo (Fluxo Pte. Ltd., fluxo.com.sg) is a Singapore software company focused specifically on SMEs. It builds custom operational systems around each client’s existing workflow, shows a working demo before any commitment, and charges a set-up fee plus a monthly subscription rather than a large upfront project fee.',
      },
      {
        q: 'How much does custom software cost in Singapore?',
        a: 'Traditional agencies typically quote large upfront project fees and bill separately for changes after launch. Fluxo prices custom systems as a modest set-up fee plus a predictable monthly subscription that covers hosting, security, maintenance and minor changes. The exact figure depends on scope. [Talk to us](/contact) for a quote based on your workflow.',
      },
      {
        q: 'How long does it take to build a custom business system?',
        a: 'With Fluxo, the first usable module is typically live in about 6 weeks and the full system in about 14 weeks, with each module tested by your own team before sign-off.',
      },
      {
        q: 'Will I own my system, and will it carry my brand?',
        a: 'Yes. A Fluxo Studio build runs under your company’s own name and brand. It is built on a shared, proven foundation, which is part of what keeps the cost down, but the system is configured and designed entirely around your business.',
      },
      {
        q: 'What kinds of businesses does Fluxo build for?',
        a: 'Operational SMEs across several industries, including marine and diving contractors, offshore health, safety and environment (HSE) compliance, online sellers and ordering, and financing services. Typical systems handle jobs and orders, compliance records and certificates, maintenance schedules, automated reports, invoicing and customer communication.',
      },
      {
        q: 'Do I need a tech team to work with Fluxo?',
        a: 'No. Fluxo is designed for businesses that don’t have in-house developers. We handle the design, build, hosting, security and ongoing support, so your team only needs to use the system.',
      },
    ],
    cta: {
      eyebrow: 'See it before you decide',
      heading: 'Show us how you work today. We will show you a demo of it tomorrow.',
      body: 'Tell us about your operation: the spreadsheets, the WhatsApp groups, the reports that eat your weekends. We will come back with a working demo shaped around your business. No deck, no obligation.',
      button: 'Book a free consultation',
    },
  },
];

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}

export function formatPostDate(iso) {
  return new Date(`${iso}T00:00:00+08:00`).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Singapore',
  });
}

const ORG = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Fluxo',
  legalName: 'Fluxo Pte. Ltd.',
  url: SITE_URL,
};

export function postJsonLd(post) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.seoTitle,
        description: post.description,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        author: { '@type': 'Person', name: post.author.name, jobTitle: post.author.role, worksFor: ORG },
        publisher: ORG,
        mainEntityOfPage: url,
        inLanguage: 'en-SG',
        about: ['Custom software development', 'Singapore SMEs', 'Operational software'],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: post.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: stripInline(f.a) },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
