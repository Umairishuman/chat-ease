interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-8 rounded-3xl backdrop-blur-xl bg-surface border border-border hover:bg-surface-hover hover:border-primary-400/50 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(20,184,166,0.2)] hover:-translate-y-2">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl backdrop-blur-md bg-surface border border-border text-2xl mb-8 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:border-primary-400/30 transition-all duration-500 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-foreground">{title}</h3>
      <p className="text-muted leading-relaxed font-light">{description}</p>
    </div>
  );
}
