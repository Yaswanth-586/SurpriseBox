import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDashboardSurprises, deleteSurprise } from '../api/client';
import { removeToken } from '../utils/auth';
import { Gift, LogOut, Copy, ExternalLink, Trash2, Clock, Lock, Unlock, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [surprises, setSurprises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurprises();
  }, []);

  const fetchSurprises = async () => {
    try {
      const data = await getDashboardSurprises();
      setSurprises(data);
    } catch (err) {
      // If unauthorized, redirect to login
      removeToken();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this surprise?')) {
      try {
        await deleteSurprise(id);
        setSurprises(surprises.filter(s => s.id !== id));
      } catch (err) {
        alert('Failed to delete surprise');
      }
    }
  };

  const handleCopyLink = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex-1 w-full bg-slate-900 relative overflow-hidden">
      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Surprises</h1>
            <p className="text-white/60">Manage your created surprise boxes</p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            Create New
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/50">Loading your surprises...</div>
        ) : surprises.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-white/10">
            <Gift className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No surprises yet</h3>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              You haven't created any surprise boxes. Get started by creating your first digital gift!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
            >
              Create Surprise
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surprises.map(surprise => (
              <div key={surprise.id} className="glass rounded-2xl p-6 border border-white/10 flex flex-col group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white truncate pr-4" title={surprise.title}>{surprise.title}</h3>
                    <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                      For <span className="text-pink-400 font-medium">{surprise.recipient_name}</span>
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shrink-0 ${surprise.is_locked ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {surprise.is_locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {surprise.is_locked ? 'LOCKED' : 'UNLOCKED'}
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <span className="text-xl">{surprise.occasion_icon || '🎁'}</span>
                    <span>{surprise.occasion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Unlocks: {format(new Date(surprise.unlock_at), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Link
                    to={surprise.url}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </Link>
                  <button
                    onClick={() => handleCopyLink(surprise.url)}
                    className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
                
                <button
                  onClick={() => handleDelete(surprise.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
                  title="Delete Surprise"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
