import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Github, Twitter, Linkedin, Database, Cpu, BarChart, ExternalLink } from 'lucide-react';
import T from './T';

const Footer = () => {
  return (
    <footer className="relative border-t border-brand-border bg-brand-surface-inset transition-colors duration-500 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden p-1 bg-white border border-emerald-500/30 shadow-glow-sm flex items-center justify-center shrink-0">
                <img src="/kisanvision_emblem_clean.png" alt="KisanVision Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-brand-text-primary font-display leading-none">
                  Kisan<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Vision</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-emerald-500 uppercase mt-1">
                  AI Agriculture Platform
                </span>
              </div>
            </div>
            <T as="p" className="text-brand-text-secondary text-sm leading-relaxed max-w-xs">
              Revolutionizing agriculture through explainable artificial intelligence. Empowering farmers with precise, data-driven crop recommendations.
            </T>
            <div className="flex gap-2.5">
              <SocialLink icon={<Twitter size={16} />} href="https://github.com/Miteshreddy/agroxai" />
              <SocialLink icon={<Linkedin size={16} />} href="https://github.com/Miteshreddy/agroxai" />
              <SocialLink icon={<Github size={16} />} href="https://github.com/Miteshreddy/agroxai" />
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <T as="h4" className="text-xs font-semibold uppercase text-brand-text-tertiary tracking-[0.15em] font-display">Platform</T>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-brand-text-secondary font-medium hover:text-brand-primary transition-colors inline-flex items-center gap-1"><T>Home</T></Link></li>
              <li><Link to="/recommend" className="text-sm text-brand-text-secondary font-medium hover:text-brand-primary transition-colors inline-flex items-center gap-1"><T>Recommend</T></Link></li>
              <li><Link to="/my-farm" className="text-sm text-brand-text-secondary font-medium hover:text-brand-primary transition-colors inline-flex items-center gap-1"><T>My Farm</T></Link></li>
              <li><Link to="/history" className="text-sm text-brand-text-secondary font-medium hover:text-brand-primary transition-colors inline-flex items-center gap-1"><T>History</T></Link></li>
              <li><Link to="/intelligence" className="text-sm text-brand-text-secondary font-medium hover:text-brand-primary transition-colors inline-flex items-center gap-1"><T>Intelligence</T></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-5">
            <T as="h4" className="text-xs font-semibold uppercase text-brand-text-tertiary tracking-[0.15em] font-display">Company</T>
            <ul className="space-y-3">
              <li><a href="https://github.com/Miteshreddy/agroxai" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-text-secondary font-medium hover:text-brand-primary transition-colors inline-flex items-center gap-1"><T>Privacy</T> <ExternalLink size={10} className="opacity-40" /></a></li>
              <li><a href="https://github.com/Miteshreddy/agroxai" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-text-secondary font-medium hover:text-brand-primary transition-colors inline-flex items-center gap-1"><T>Contact</T> <ExternalLink size={10} className="opacity-40" /></a></li>
              <li><a href="https://github.com/Miteshreddy/agroxai" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-text-secondary font-medium hover:text-brand-primary transition-colors inline-flex items-center gap-1"><T>Science</T> <ExternalLink size={10} className="opacity-40" /></a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-5">
            <T as="h4" className="text-xs font-semibold uppercase text-brand-text-tertiary tracking-[0.15em] font-display">Technology</T>
            <div className="flex flex-wrap gap-2">
              <TechBadge icon={<Cpu size={12} />} label="XGBoost" />
              <TechBadge icon={<BarChart size={12} />} label="SHAP" />
              <TechBadge icon={<Database size={12} />} label="MongoDB" />
              <TechBadge icon={<Leaf size={12} />} label="Explainable AI" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-brand-text-tertiary text-xs">
          <T as="p">© 2026 KisanVision. Precision Farming Systems.</T>
          <T as="p">Built with ❤️ for sustainable agriculture</T>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-brand-surface-elevated border border-brand-border rounded-xl flex items-center justify-center text-brand-text-tertiary hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-glow-sm transition-all duration-300">
    {icon}
  </a>
);

const TechBadge = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-surface-elevated border border-brand-border rounded-lg text-brand-text-secondary text-[11px] font-medium hover:border-brand-primary/15 hover:text-brand-primary transition-all duration-300 cursor-default">
    <span className="text-brand-primary">{icon}</span>
    {label}
  </div>
);

export default Footer;
