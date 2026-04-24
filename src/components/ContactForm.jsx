import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function FieldValidIndicator({ valid, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
            valid ? 'text-emerald-500' : 'text-destructive'
          }`}
        >
          {valid ? (
            <Check className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const fieldStates = useMemo(() => {
    const nameValid = formData.name.trim().length >= 2;
    const emailValid = validateEmail(formData.email);
    const messageLen = formData.message.trim().length;
    const messageValid = messageLen >= MESSAGE_MIN && messageLen <= MESSAGE_MAX;
    return {
      name: { valid: nameValid, show: touched.name && formData.name.length > 0 },
      email: { valid: emailValid, show: touched.email && formData.email.length > 0 },
      message: { valid: messageValid, show: touched.message && formData.message.length > 0 },
    };
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = "That doesn't look like a valid email";
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < MESSAGE_MIN) newErrors.message = `Tell us a bit more — at least ${MESSAGE_MIN} characters`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setTouched({ name: true, email: true, message: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now(),
      });
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

      // Small delay to make the send feel real
      await new Promise((r) => setTimeout(r, 900));

      setSent(true);
      toast({
        title: 'Message sent',
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form after showing success state
      setTimeout(() => {
        setFormData({ name: '', company: '', email: '', phone: '', message: '' });
        setTouched({});
        setErrors({});
        setSent(false);
      }, 3500);
    } catch (err) {
      toast({
        title: 'Failed to send message',
        description: 'Please try again or email business@fluxo.com.sg directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLen = formData.message.length;
  const messageCountTone =
    messageLen === 0
      ? 'text-muted-foreground'
      : messageLen < MESSAGE_MIN
        ? 'text-amber-600 dark:text-amber-400'
        : messageLen > MESSAGE_MAX
          ? 'text-destructive'
          : 'text-emerald-600 dark:text-emerald-400';

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-5"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={2} />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-xl font-bold text-foreground mb-2"
          >
            Message received.
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            We'll get back to you within 24 hours on business days.
          </motion.p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-background border-border text-foreground focus-visible:ring-primary shadow-sm pr-10"
                  placeholder="Your name"
                />
                <FieldValidIndicator valid={fieldStates.name.valid} show={fieldStates.name.show} />
              </div>
              {errors.name && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground font-medium">Company</Label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="bg-background border-border text-foreground focus-visible:ring-primary shadow-sm"
                placeholder="Your company"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-background border-border text-foreground focus-visible:ring-primary shadow-sm pr-10"
                  placeholder="your.email@example.com"
                />
                <FieldValidIndicator valid={fieldStates.email.valid} show={fieldStates.email.show} />
              </div>
              {errors.email && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-background border-border text-foreground focus-visible:ring-primary shadow-sm"
                placeholder="+65 1234 5678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message" className="text-foreground font-medium">
                Message <span className="text-destructive">*</span>
              </Label>
              <span className={`text-[11px] font-mono tabular-nums ${messageCountTone}`}>
                {messageLen} / {MESSAGE_MAX}
                {messageLen > 0 && messageLen < MESSAGE_MIN && (
                  <span className="ml-1">· {MESSAGE_MIN - messageLen} more</span>
                )}
              </span>
            </div>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={MESSAGE_MAX}
              className="bg-background border-border text-foreground focus-visible:ring-primary shadow-sm min-h-[150px]"
              placeholder="What's your operation, what's currently painful, and what would success look like?"
            />
            {errors.message && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message}</p>}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-[11px] text-muted-foreground">
              By sending you agree to Fluxo storing your message to respond.
            </p>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[160px] h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-sm font-medium"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full"
                  />
                  Sending…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Send message
                </span>
              )}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default ContactForm;
