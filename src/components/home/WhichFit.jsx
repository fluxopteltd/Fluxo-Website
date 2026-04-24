import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench, Layers, ArrowRight, RotateCcw, Sparkles, CheckCircle2,
} from 'lucide-react';

/**
 * WhichFit
 * Interactive 3-question decider that recommends Fluxo Studio or
 * Fluxo Platform based on the visitor's answers. Replaces a flat CTA
 * button with a guided conversation.
 */

const QUESTIONS = [
  {
    id: 'workflow',
    title: 'How unique is your operation\'s workflow?',
    options: [
      {
        label: 'Pretty standard for my industry',
        sub: 'We do things roughly like everyone else',
        score: 'platform',
      },
      {
        label: 'Has specific quirks we can\'t compromise on',
        sub: 'Our process is part of what makes us different',
        score: 'studio',
      },
    ],
  },
  {
    id: 'timeline',
    title: 'When do you need to be operational?',
    options: [
      {
        label: 'Within weeks',
        sub: 'We need something running fast',
        score: 'platform',
      },
      {
        label: 'A couple of months is fine — if it fits',
        sub: 'We\'d rather wait for the right system',
        score: 'studio',
      },
    ],
  },
  {
    id: 'control',
    title: 'How much control do you want over data and infrastructure?',
    options: [
      {
        label: 'Full ownership — dedicated stack, our data, our rules',
        sub: 'Critical for compliance or our business model',
        score: 'studio',
      },
      {
        label: 'Shared infrastructure is fine',
        sub: 'Standard SaaS trust model works for us',
        score: 'platform',
      },
    ],
  },
];

const RESULTS = {
  studio: {
    key: 'studio',
    Icon: Wrench,
    label: 'Fluxo Studio',
    status: 'Available now',
    statusTone: 'bg-primary/10 text-primary border-primary/20',
    accent: 'from-primary to-[hsl(var(--fluxo-cyan))]',
    lede: 'Custom-built, shaped around your operation.',
    reasons: [
      'Your workflow has specifics worth fitting exactly',
      'Dedicated infrastructure + full data ownership',
      '4–8 weeks to deploy a system designed for you',
    ],
    ctaHref: '/contact?plan=studio',
    ctaLabel: 'Start your custom build',
  },
  platform: {
    key: 'platform',
    Icon: Layers,
    label: 'Fluxo Platform',
    status: 'Launching 2027',
    statusTone: 'bg-secondary/15 text-secondary-foreground border-secondary/30',
    accent: 'from-[hsl(var(--fluxo-cyan))] to-sky-400',
    lede: 'Proven SaaS patterns, ready to deploy.',
    reasons: [
      'Your workflow is mostly standard for your industry',
      'Fast deployment — days not weeks',
      'Month-to-month, predictable subscription pricing',
    ],
    ctaHref: '/contact?plan=platform',
    ctaLabel: 'Join the waitlist',
  },
};

export default function WhichFit() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const reset = () => {
    setStarted(false);
    setStep(0);
    setAnswers([]);
  };

  const handleAnswer = (score) => {
    const next = [...answers, score];
    setAnswers(next);
    if (next.length < QUESTIONS.length) {
      setStep(step + 1);
    }
    // else: done → result screen shows automatically
  };

  const done = answers.length === QUESTIONS.length;
  const studioScore = answers.filter((a) => a === 'studio').length;
  const recommendation = done
    ? studioScore >= 2
      ? RESULTS.studio
      : RESULTS.platform
    : null;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Find your fit</span>
        </div>
        {(started || done) && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <RotateCcw className="w-3 h-3" />
            Restart
          </button>
        )}
      </div>

      {/* Progress bar */}
      {started && !done && (
        <div className="h-1 bg-muted relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-[hsl(var(--fluxo-cyan))]"
            initial={false}
            animate={{ width: `${((step) / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}

      {/* Body */}
      <div className="p-6 md:p-8 min-h-[300px] flex flex-col">
        <AnimatePresence mode="wait">
          {!started && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col flex-1 justify-center text-center"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                90 seconds · 3 questions
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
                Which Fluxo option fits your operation?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Answer 3 quick questions about how you run. We'll recommend Studio or Platform — and tell you why.
              </p>
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="mx-auto inline-flex items-center gap-2 px-5 h-11 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Start
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {started && !done && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col flex-1"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Question {step + 1} of {QUESTIONS.length}
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 tracking-tight">
                {QUESTIONS[step].title}
              </h3>
              <div className="space-y-3 flex-1">
                {QUESTIONS[step].options.map((opt, i) => (
                  <motion.button
                    key={opt.label}
                    type="button"
                    onClick={() => handleAnswer(opt.score)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                    whileHover={{ x: 4 }}
                    className="w-full group text-left px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                        <ArrowRight className="w-2.5 h-2.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground mb-0.5">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.sub}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {done && recommendation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col flex-1"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Based on your answers
              </p>

              <div className="flex items-center gap-3 mb-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${recommendation.accent} flex items-center justify-center text-white flex-shrink-0`}>
                  <recommendation.Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                    {recommendation.label}
                  </h3>
                  <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${recommendation.statusTone}`}>
                    {recommendation.status}
                  </span>
                </div>
              </div>

              <p className="text-base text-muted-foreground mb-5">{recommendation.lede}</p>

              <div className="space-y-2 mb-6">
                <p className="text-[10px] font-mono tracking-wider text-muted-foreground">WHY IT FITS YOU</p>
                {recommendation.reasons.map((r, i) => (
                  <motion.div
                    key={r}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{r}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-2">
                <a
                  href={recommendation.ctaHref}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 h-11 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  {recommendation.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center px-5 h-11 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted/60 transition-colors"
                >
                  Not sure? Just talk to us
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
