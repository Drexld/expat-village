import { MessageSquare, ThumbsUp, Star } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      user: 'Maria K.',
      action: 'shared a tip in',
      target: 'Banking Guide',
      time: '2h ago',
      likes: 12
    },
    {
      user: 'James R.',
      action: 'completed',
      target: 'First Month Checklist',
      time: '5h ago',
      badge: true
    },
    {
      user: 'Sophie L.',
      action: 'asked in',
      target: 'Town Hall',
      time: '8h ago',
      replies: 7
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Community Activity</h2>
        <button className="text-sm text-[#59b4f7] hover:underline">View all</button>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-[0_4px_12px_rgba(0,102,204,0.3)]">
                {activity.user[0]}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[13px] mb-1">
                  <span className="font-semibold">{activity.user}</span>
                  <span className="text-white/50"> {activity.action} </span>
                  <span className="text-[#3b9eff]">{activity.target}</span>
                </p>
                
                <div className="flex items-center gap-4 text-[12px] text-white/40">
                  <span>{activity.time}</span>
                  {activity.likes && (
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {activity.likes}
                    </span>
                  )}
                  {activity.replies && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {activity.replies} replies
                    </span>
                  )}
                  {activity.badge && (
                    <span className="flex items-center gap-1 text-[#fbbf24]">
                      <Star className="w-3 h-3 fill-[#fbbf24]" />
                      Badge earned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}