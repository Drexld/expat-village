import { useState } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Plus, TrendingUp, Clock, Heart } from 'lucide-react';
import { toast } from 'sonner';

const topics = [
  {
    id: 1,
    category: 'Moving & Admin',
    title: 'PESEL appointment - how long is the wait?',
    author: 'Sarah M.',
    time: '2h ago',
    content: 'Just arrived in Warsaw. How long are people waiting for PESEL appointments these days?',
    replies: 12,
    likes: 8,
    isHot: true
  },
  {
    id: 2,
    category: 'Housing Search',
    title: 'Red flags in my rental contract - help!',
    author: 'James K.',
    time: '5h ago',
    content: 'Landlord wants 3 months deposit and says I can\'t register my address. Is this normal?',
    replies: 24,
    likes: 15,
    isHot: true
  },
  {
    id: 3,
    category: 'Jobs & Career',
    title: 'Salary expectations for software developers?',
    author: 'Maria L.',
    time: '8h ago',
    content: 'Moving to Warsaw for a tech job. What\'s a fair salary for 5 years experience?',
    replies: 18,
    likes: 22,
    isHot: false
  },
  {
    id: 4,
    category: 'Making Friends',
    title: 'Expat meetup this Saturday - Praga district',
    author: 'Tom R.',
    time: '1d ago',
    content: 'Organizing a casual meetup at a craft beer bar. All welcome!',
    replies: 9,
    likes: 31,
    isHot: false
  },
  {
    id: 5,
    category: 'Living in Warsaw',
    title: 'Where to buy affordable furniture?',
    author: 'Michael P.',
    time: '2d ago',
    content: 'Just got my apartment. Where do expats usually buy furniture?',
    replies: 20,
    likes: 17,
    isHot: false
  }
];

const categories = [
  'All Topics',
  'Moving & Admin',
  'Housing Search',
  'Jobs & Career',
  'Learning Polish',
  'Making Friends',
  'Living in Warsaw',
  'Vent & Celebrate'
];

export function TownHall() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast.success('Like removed');
      } else {
        newSet.add(postId);
        toast.success('Post liked! +5 points');
      }
      return newSet;
    });
  };

  const filteredTopics = selectedCategory === 'All Topics'
    ? topics
    : topics.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative px-5 pt-12 pb-6">
        <div className="relative">
          <h1 className="text-[20px] font-bold mb-2">Town Hall</h1>
          <p className="text-[13px] text-white/50 mb-6">Community discussions & support</p>
          
          {/* New Post Button - 3D glossy */}
          <button className="w-full py-3.5 rounded-[20px] bg-gradient-to-b from-[#3b9eff] to-[#0066cc] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_16px_rgba(59,158,255,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_24px_rgba(59,158,255,0.5)] transition-all active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-b from-[#3b9eff] to-[#0066cc] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(59,158,255,0.4)]'
                  : 'bg-gradient-to-b from-[#1a2642] to-[#0f1829] text-white/50 hover:text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_8px_rgba(0,0,0,0.2)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="px-5 space-y-3 pb-8">
        {filteredTopics.map((topic) => {
          const isLiked = likedPosts.has(topic.id);
          
          return (
            <div
              key={topic.id}
              className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-5"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[12px] text-white/50 font-medium">
                  {topic.category}
                </span>
                {topic.isHot && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#ff6b9d] to-[#ff8e53] text-[12px] text-white font-semibold shadow-[0_2px_8px_rgba(255,107,157,0.3)]">
                    <TrendingUp className="w-3 h-3" />
                    Hot
                  </span>
                )}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-[15px] mb-2">{topic.title}</h3>
              <p className="text-[13px] text-white/60 mb-3">{topic.content}</p>

              {/* Meta */}
              <div className="flex items-center justify-between text-[12px] text-white/40 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-white/50">{topic.author}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.time}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  onClick={() => handleLike(topic.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[14px] transition-all ${
                    isLiked
                      ? 'bg-gradient-to-b from-[#ec4899] to-[#db2777] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(236,72,153,0.4)]'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                  <span className="text-[13px] font-medium">{topic.likes + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 rounded-[14px] bg-white/5 text-white/50 hover:bg-white/10 transition-all">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[13px] font-medium">{topic.replies}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
