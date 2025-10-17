import { useEffect, useState } from 'react';
import { Search, Filter, Calendar, MapPin, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import type { Database } from '../lib/database.types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];

interface OpportunitiesProps {
  onAuthClick: () => void;
}

export function Opportunities({ onAuthClick }: OpportunitiesProps) {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  useEffect(() => {
    loadOpportunities();
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadOpportunities = async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setOpportunities(data);
    } else if (error) {
      console.error('Error loading opportunities:', error);
    }
    setLoading(false);
  };

  const loadApplications = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id);

    if (data) {
      setApplications(data);
    }
  };

  const handleSaveOpportunity = async (opportunityId: string) => {
    if (!user) {
      onAuthClick();
      return;
    }

    const existing = applications.find(app => app.opportunity_id === opportunityId);

    if (existing) {
      await supabase
        .from('applications')
        .delete()
        .eq('id', existing.id);
      setApplications(applications.filter(app => app.id !== existing.id));
    } else {
      const { data } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          opportunity_id: opportunityId,
          status: 'saved',
        })
        .select()
        .single();

      if (data) {
        setApplications([...applications, data]);
      }
    }
  };

  const handleApply = (url: string | null) => {
    if (!user) {
      onAuthClick();
      return;
    }
    if (url) {
      window.open(url, '_blank');
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || opp.type === typeFilter;
    const matchesGrade = gradeFilter === 'all' || opp.grade_levels.includes(gradeFilter);

    return matchesSearch && matchesType && matchesGrade;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, 'blue' | 'green' | 'purple' | 'teal' | 'peach'> = {
      internship: 'blue',
      scholarship: 'green',
      summer_program: 'purple',
      research: 'teal',
      competition: 'peach',
    };
    return colors[type] || 'gray';
  };

  const isSaved = (opportunityId: string) => {
    return applications.some(app => app.opportunity_id === opportunityId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-royal-purple mb-4">
            Explore Opportunities
          </h1>
          <p className="text-lg text-charcoal">
            Discover internships, scholarships, programs, and competitions tailored for high schoolers.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-charcoal">Filters:</span>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue"
            >
              <option value="all">All Types</option>
              <option value="internship">Internships</option>
              <option value="scholarship">Scholarships</option>
              <option value="summer_program">Summer Programs</option>
              <option value="research">Research</option>
              <option value="competition">Competitions</option>
            </select>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue"
            >
              <option value="all">All Grades</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
          </div>
        </div>

        {filteredOpportunities.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No opportunities found matching your criteria.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredOpportunities.map((opp) => (
              <Card key={opp.id} hover>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-charcoal mb-1">
                          {opp.title}
                        </h3>
                        <p className="text-electric-blue font-medium">
                          {opp.organization}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSaveOpportunity(opp.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isSaved(opp.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-electric-blue" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant={getTypeColor(opp.type)}>
                        {opp.type.replace('_', ' ')}
                      </Badge>
                      {opp.deadline && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(opp.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      {opp.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{opp.location}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {opp.description}
                    </p>

                    {opp.interests && opp.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {opp.interests.map((interest, index) => (
                          <Badge key={index} variant="gray" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 md:min-w-[140px]">
                    <Button
                      onClick={() => handleApply(opp.application_url)}
                      size="sm"
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Apply
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
