import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Trophy, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistProps {
  user: {
    name: string;
    completedTasks: number;
    totalTasks: number;
    points: number;
  };
}

export function Checklist({ user }: ChecklistProps) {
  const [expandedSection, setExpandedSection] = useState<string>('first-week');
  
  const sections = [
    {
      id: 'first-week',
      title: 'First Week Tasks',
      subtitle: 'Essential steps for your arrival',
      color: 'from-[#3b82f6] to-[#2563eb]',
      tasks: [
        { id: 1, title: 'Get Polish SIM card', completed: true, points: 10 },
        { id: 2, title: 'Open bank account', completed: true, points: 20 },
        { id: 3, title: 'Get transport card', completed: true, points: 10 },
        { id: 4, title: 'Find local grocery store', completed: true, points: 5 },
        { id: 5, title: 'Explore neighborhood', completed: false, points: 15 }
      ]
    },
    {
      id: 'first-month',
      title: 'First Month Tasks',
      subtitle: 'Getting properly settled',
      color: 'from-[#f59e0b] to-[#d97706]',
      tasks: [
        { id: 6, title: 'Get PESEL number', completed: true, points: 30 },
        { id: 7, title: 'Register address (Zameldowanie)', completed: true, points: 25 },
        { id: 8, title: 'Sort out health insurance', completed: true, points: 25 },
        { id: 9, title: 'Learn basic Polish phrases', completed: true, points: 15 },
        { id: 10, title: 'Join expat communities', completed: false, points: 10 },
        { id: 11, title: 'Save emergency numbers', completed: false, points: 10 }
      ]
    },
    {
      id: 'settling-in',
      title: 'Settling In (2-6 months)',
      subtitle: 'Building your new life',
      color: 'from-[#10b981] to-[#059669]',
      tasks: [
        { id: 12, title: 'Apply for residence permit', completed: false, points: 40 },
        { id: 13, title: 'Get NIP (tax number)', completed: false, points: 25 },
        { id: 14, title: 'Find English-speaking doctor', completed: false, points: 20 },
        { id: 15, title: 'Find dentist', completed: false, points: 15 },
        { id: 16, title: 'Join gym or fitness activity', completed: false, points: 15 },
        { id: 17, title: 'Find social hobby or group', completed: false, points: 20 }
      ]
    },
    {
      id: 'long-term',
      title: 'Long-term Goals',
      subtitle: 'Becoming a local',
      color: 'from-[#ec4899] to-[#db2777]',
      tasks: [
        { id: 18, title: 'Start Polish language lessons', completed: false, points: 50 },
        { id: 19, title: 'Get Polish driving license', completed: false, points: 30 },
        { id: 20, title: 'Find your own apartment', completed: false, points: 40 },
        { id: 21, title: 'Build professional network', completed: false, points: 35 },
        { id: 22, title: 'Explore other Polish cities', completed: false, points: 25 }
      ]
    }
  ];

  const [taskStates, setTaskStates] = useState(sections);

  const toggleTask = (sectionId: string, taskId: number) => {
    setTaskStates(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.map(task => {
            if (task.id === taskId) {
              const newCompleted = !task.completed;
              if (newCompleted) {
                toast.success(`🎉 Task completed! +${task.points} points`, {
                  description: task.title
                });
              }
              return { ...task, completed: newCompleted };
            }
            return task;
          })
        };
      }
      return section;
    }));
  };

  const calculateProgress = (tasks: typeof sections[0]['tasks']) => {
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const overallProgress = Math.round(
    (taskStates.flatMap(s => s.tasks).filter(t => t.completed).length /
      taskStates.flatMap(s => s.tasks).length) * 100
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative px-5 pt-12 pb-6">
        <div className="relative">
          <h1 className="text-[20px] font-bold mb-2">My Checklist</h1>
          <p className="text-[13px] text-white/50 mb-6">Track your journey in Poland</p>
          
          {/* Overall Progress */}
          <div className="rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[32px] font-bold">{overallProgress}%</p>
                <p className="text-[13px] text-white/50">Overall Progress</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-full blur-lg opacity-40"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_16px_rgba(245,158,11,0.4)]">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="w-full h-3 bg-[#0a0f1a] rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#3b9eff] to-[#0066cc] rounded-full shadow-[0_0_12px_rgba(59,158,255,0.6)] transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-5 space-y-4 pb-8">
        {taskStates.map((section) => {
          const progress = calculateProgress(section.tasks);
          const isExpanded = expandedSection === section.id;
          
          return (
            <div
              key={section.id}
              className="rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? '' : section.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${section.color} flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[15px] mb-1">{section.title}</h3>
                    <p className="text-[13px] text-white/50">{section.subtitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-24 h-1.5 bg-[#0a0f1a] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${section.color} rounded-full transition-all`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[12px] text-white/50">{progress}%</span>
                    </div>
                  </div>
                </div>
                
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-white/50" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/50" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-5 pb-5 space-y-2">
                  {section.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(section.id, task.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-[16px] hover:bg-white/[0.03] transition-all active:scale-[0.98]"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-[#10b981] flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-white/30 flex-shrink-0" />
                      )}
                      <span className={`flex-1 text-left text-[13px] ${task.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                        {task.title}
                      </span>
                      <span className="text-[12px] text-[#fbbf24] font-semibold">+{task.points}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
