import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { PricingCTA } from '@/components/PricingCTA';
import RedirectIfLoggedIn from '@/components/RedirectIfLoggedIn';

export default function Home() {
  return (
    <RedirectIfLoggedIn>
    <div className="min-h-screen">
      <main>
        {/* Hero */}
        <section
          id="hero"
          className="relative overflow-hidden border-b border-[rgba(0,0,0,0.05)] safe-area-padding-x"
        >
          <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6 sm:pt-28 sm:pb-24 md:pt-32 md:pb-28 text-center">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-[#0057FF] animate-fade-in">
              For creators & founders
            </p>
            <h1
              className="mt-3 text-[1.875rem] leading-tight font-bold tracking-tight text-[#1A1A1A] sm:text-5xl sm:leading-[1.15] md:text-6xl lg:text-[3.5rem]"
              style={{ textShadow: '0 1px 2px rgba(255,255,255,0.6)' }}
            >
              Grow on X faster
              <br />
              <span className="bg-gradient-to-r from-[#0057FF] to-[#66B2FF] bg-clip-text text-transparent">
                with AI replies
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-xl mx-auto text-base sm:text-[1.25rem] font-normal text-[#333333] leading-relaxed px-1">
              Find the right tweets, get smart reply suggestions, and grow your following—without spending hours online.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <ButtonLink
                href="/login"
                variant="primary"
                size="lg"
                className="btn-cta-landing animate-bounce-hover shadow-[0_4px_20px_rgba(0,87,255,0.25)] min-h-[48px] touch-manipulation"
              >
                Get Started — Free
              </ButtonLink>
              <a
                href="#demo"
                className="btn-secondary-landing inline-flex items-center justify-center rounded-[12px] border border-[rgba(0,0,0,0.08)] bg-white px-6 py-3.5 min-h-[48px] text-base font-medium text-[#333333] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#0057FF] hover:bg-[#0057FF]/5 hover:text-[#0057FF] hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-[#0057FF] focus:ring-offset-2 touch-manipulation"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required · Start in 30 seconds</p>

            {/* Hero visual: radial gradient detrás para que destaque + efecto respiración */}
            <div className="mt-16 sm:mt-20 flex justify-center animate-slide-up">
              <div
                className="landing-card-hover relative w-full max-w-2xl rounded-[16px] border border-[rgba(0,0,0,0.06)] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] animate-breath"
                style={{
                  background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #FAFAFA 0%, #FFFFFF 50%)',
                }}
              >
                <div className="flex gap-3 text-left">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-24 rounded bg-gray-200" />
                      <span className="h-3 w-14 rounded bg-gray-100" />
                    </div>
                    <p className="text-[15px] text-[#333333]">
                      Building in public is the best decision I made. Week 1: $0. Week 52: $50k MRR.
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>❤️ 2.8k</span>
                      <span>💬 312</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3 rounded-[12px] bg-[#0057FF]/[0.08] border border-[#0057FF]/20 p-3 sm:p-4">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[#0057FF]/20" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#0057FF]">AI reply suggestion</p>
                    <p className="mt-1 text-sm text-[#333333] italic">
                      &ldquo;This is so true. We&apos;ve seen the same pattern while building our product.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-[rgba(0,0,0,0.05)] py-12 sm:py-20 safe-area-padding-x">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-center text-3xl font-semibold tracking-tight text-[#1A1A1A]">
                Everything you need to grow on X
              </h2>
              <p className="mt-2 text-center text-base text-[#333333]">
                One tool. Smarter replies. Real growth.
              </p>
            </ScrollReveal>
            <div className="mt-10 sm:mt-12 grid gap-8 sm:gap-12 sm:grid-cols-3">
              <ScrollReveal delay={1}>
                <Card padding="lg" className="landing-card-hover group" glass={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0057FF]/10 text-[#0057FF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#0057FF]/15">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-[#1A1A1A]">Find viral tweets instantly</h3>
                  <p className="mt-3 text-base font-normal text-[#333333] leading-relaxed">
                    Discover tweets in your niche. SaaS, AI, indie hackers — we surface what matters.
                  </p>
                </Card>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <Card padding="lg" className="landing-card-hover group" glass={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0057FF]/10 text-[#0057FF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#0057FF]/15">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-[#1A1A1A]">Generate AI replies in seconds</h3>
                  <p className="mt-3 text-base font-normal text-[#333333] leading-relaxed">
                    Get on-brand, helpful replies. Edit and send — no more staring at a blank box.
                  </p>
                </Card>
              </ScrollReveal>
              <ScrollReveal delay={3}>
                <Card padding="lg" className="landing-card-hover group" glass={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0057FF]/10 text-[#0057FF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#0057FF]/15">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-[#1A1A1A]">Track your growth analytics</h3>
                  <p className="mt-3 text-base font-normal text-[#333333] leading-relaxed">
                    Replies sent, engagement gained, followers growth. All in one dashboard.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Testimonials / Social proof */}
        <section className="border-t border-[rgba(0,0,0,0.05)] py-12 sm:py-20 safe-area-padding-x">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
                Loved by creators building in public
              </h2>
              <p className="mt-2 text-center text-base text-[#333333]">
                Join thousands growing on X with less effort.
              </p>
            </ScrollReveal>
            <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              <ScrollReveal delay={1}>
                <div className="rounded-[16px] bg-gradient-to-br from-[#0057FF] to-[#66B2FF] p-6 text-white shadow-[0_4px_20px_rgba(0,87,255,0.2)] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_12px_36px_rgba(0,87,255,0.28)] hover:scale-[1.02]">
                  <div className="flex items-center gap-2 animate-check-pop">
                    <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="text-sm font-medium opacity-90">Verified user</span>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed opacity-95">
                    &ldquo;Cut my reply time from 2 hours to 10 minutes. Game changer for my X growth.&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-medium">— Indie founder</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <div className="rounded-[16px] bg-gradient-to-br from-[#0057FF] to-[#66B2FF] p-6 text-white shadow-[0_4px_20px_rgba(0,87,255,0.2)] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_12px_36px_rgba(0,87,255,0.28)] hover:scale-[1.02]">
                  <div className="flex items-center gap-2 animate-check-pop">
                    <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="text-sm font-medium opacity-90">Verified user</span>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed opacity-95">
                    &ldquo;The AI suggestions sound like me. My engagement went up 3x in a month.&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-medium">— SaaS builder</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={3}>
                <div className="rounded-[16px] bg-gradient-to-br from-[#0057FF] to-[#66B2FF] p-6 text-white shadow-[0_4px_20px_rgba(0,87,255,0.2)] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_12px_36px_rgba(0,87,255,0.28)] hover:scale-[1.02]">
                  <div className="flex items-center gap-2 animate-check-pop">
                    <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="text-sm font-medium opacity-90">Verified user</span>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed opacity-95">
                    &ldquo;Finally a tool that gets my voice. Worth every penny.&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-medium">— Content creator</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="demo" className="border-t border-[rgba(0,0,0,0.05)] py-12 sm:py-20 safe-area-padding-x">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
                How it works
              </h2>
            </ScrollReveal>
            <div className="mt-10 sm:mt-14 flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
              <ScrollReveal delay={1}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#0057FF] text-xl font-semibold text-white shadow-[0_4px_20px_rgba(0,87,255,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,87,255,0.45)] active:scale-[0.98]">
                    1
                  </div>
                  <p className="mt-4 font-semibold text-[#1A1A1A]">Connect your account</p>
                  <p className="mt-1 text-sm text-[#333333] max-w-[180px]">Link X in one click (read-only)</p>
                </div>
              </ScrollReveal>
              <div className="hidden sm:block h-px w-12 bg-gray-200" />
              <ScrollReveal delay={2}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#0057FF] text-xl font-semibold text-white shadow-[0_4px_20px_rgba(0,87,255,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,87,255,0.45)] active:scale-[0.98]">
                    2
                  </div>
                  <p className="mt-4 font-semibold text-[#1A1A1A]">Find tweets</p>
                  <p className="mt-1 text-sm text-[#333333] max-w-[180px]">Browse by topic and engagement</p>
                </div>
              </ScrollReveal>
              <div className="hidden sm:block h-px w-12 bg-gray-200" />
              <ScrollReveal delay={3}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#0057FF] text-xl font-semibold text-white shadow-[0_4px_20px_rgba(0,87,255,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,87,255,0.45)] active:scale-[0.98]">
                    3
                  </div>
                  <p className="mt-4 font-semibold text-[#1A1A1A]">Generate replies</p>
                  <p className="mt-1 text-sm text-[#333333] max-w-[180px]">AI drafts, you edit and post</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-[rgba(0,0,0,0.05)] py-12 sm:py-20 safe-area-padding-x">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-center text-2xl sm:text-[2.25rem] font-semibold tracking-tight text-[#1A1A1A]">
                Simple pricing
              </h2>
              <p className="mt-2 text-center text-base text-[#333333]">Start free. No credit card required.</p>
            </ScrollReveal>
            <div className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
              <ScrollReveal delay={1}>
                <Card padding="lg" className="landing-card-hover border-2 border-gray-200" glass={false}>
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">Starter</h3>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[#1A1A1A]">$15<span className="text-base font-normal text-gray-500">/mo</span></p>
                  <p className="mt-1 text-sm text-[#333333]">7-day free trial</p>
                  <ul className="mt-6 space-y-3 text-left text-base text-[#333333]">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Up to 15 replies/day (~450/mo)
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Smart tweet discovery
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      3 regenerations per tweet
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      1 voice tone (Professional)
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Basic growth metrics
                    </li>
                    <li className="flex items-start gap-2.5 text-gray-500">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                      1 X account connection
                    </li>
                  </ul>
                  <PricingCTA plan="Starter" variant="secondary">
                    Get started
                  </PricingCTA>
                </Card>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <Card padding="lg" className="landing-card-hover relative border-2 border-[#0057FF] shadow-[0_8px_32px_rgba(0,87,255,0.15)]" glass={false}>
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0057FF] px-3 py-1 text-xs font-medium text-white">
                    Recommended
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-[#1A1A1A]">Growth</h3>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[#0057FF]">$29<span className="text-base font-normal text-gray-500">/mo</span></p>
                  <p className="mt-1 text-sm text-[#333333]">14-day free trial</p>
                  <ul className="mt-6 space-y-3 text-left text-base text-[#333333]">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Up to 30 replies/day (~900/mo)
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Enhanced smart discovery
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      5 regenerations per tweet
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      All tones (Professional, Casual, Friendly, Witty)
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Advanced metrics & charts
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Auto-reply mode (BETA)
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Priority support
                    </li>
                    <li className="flex items-start gap-2.5 text-gray-500">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                      2 X account connections
                    </li>
                  </ul>
                  <PricingCTA plan="Growth" variant="primary">
                    Get started
                  </PricingCTA>
                </Card>
              </ScrollReveal>
              <ScrollReveal delay={3}>
                <Card padding="lg" className="landing-card-hover border-2 border-gray-200" glass={false}>
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">Pro</h3>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[#1A1A1A]">$49<span className="text-base font-normal text-gray-500">/mo</span></p>
                  <p className="mt-1 text-sm text-[#333333]">14-day free trial</p>
                  <ul className="mt-6 space-y-3 text-left text-base text-[#333333]">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Up to 50 replies/day (~1,500/mo)
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Unlimited discovery
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Unlimited regenerations
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      All tones + Custom tone
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Enterprise metrics & CSV export
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Advanced auto-reply
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Thread detection
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      API access
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      Onboarding call & priority support
                    </li>
                    <li className="flex items-start gap-2.5 text-gray-500">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                      5 X account connections
                    </li>
                  </ul>
                  <PricingCTA plan="Pro" variant="secondary">
                    Get started
                  </PricingCTA>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[rgba(0,0,0,0.05)] py-8 sm:py-10 safe-area-padding-x safe-area-bottom">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center text-sm text-[#333333]">
            © {new Date().getFullYear()} repl.aiX. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
    </RedirectIfLoggedIn>
  );
}
