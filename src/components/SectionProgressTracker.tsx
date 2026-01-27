import { Check, Lock, Circle } from 'lucide-react';

interface Section {
    number: number;
    name: string;
    icon?: string;
}

interface SectionProgressTrackerProps {
    sections: Section[];
    currentSection: number;
    completedSections: number[];
}

export function SectionProgressTracker({
    sections,
    currentSection,
    completedSections
}: SectionProgressTrackerProps) {
    return (
        <div className="bg-secondary/10 border border-border/40 rounded-3xl p-6">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                Progress
            </h3>
            <div className="space-y-3">
                {sections.map((section) => {
                    const isCompleted = completedSections.includes(section.number);
                    const isCurrent = section.number === currentSection;
                    const isLocked = section.number > currentSection;

                    return (
                        <div
                            key={section.number}
                            className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${isCurrent
                                    ? 'bg-primary/10 border-2 border-primary/40'
                                    : isCompleted
                                        ? 'bg-green-500/5 border border-green-500/20'
                                        : 'bg-secondary/5 border border-border/20 opacity-40'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${isCurrent
                                    ? 'bg-primary text-white'
                                    : isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-secondary text-muted-foreground'
                                }`}>
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : isLocked ? (
                                    <Lock className="w-3.5 h-3.5" />
                                ) : isCurrent ? (
                                    <Circle className="w-3 h-3 fill-current" />
                                ) : (
                                    section.number
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {section.icon && <span className="text-sm">{section.icon}</span>}
                                    <span className={`text-xs font-black uppercase tracking-wide ${isCurrent ? 'text-primary' : 'text-foreground'
                                        }`}>
                                        {section.name}
                                    </span>
                                </div>
                                <span className="text-[8px] font-bold uppercase text-muted-foreground">
                                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : isLocked ? 'Locked' : 'Pending'}
                                </span>
                            </div>

                            {isCurrent && (
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
