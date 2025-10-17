import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import type { Database } from '../lib/database.types';
import { useNavigate } from 'react-router-dom';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'internship' as 'internship' | 'scholarship' | 'summer_program' | 'research' | 'competition',
    description: '',
    organization: '',
    location: '',
    deadline: '',
    application_url: '',
    grade_levels: [] as string[],
    interests: [] as string[],
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadOpportunities();
  }, [isAdmin, navigate]);

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

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'internship',
      description: '',
      organization: '',
      location: '',
      deadline: '',
      application_url: '',
      grade_levels: [],
      interests: [],
    });
    setEditingId(null);
    setCreating(false);
  };

  const handleEdit = (opp: Opportunity) => {
    setFormData({
      title: opp.title,
      type: opp.type,
      description: opp.description,
      organization: opp.organization,
      location: opp.location || '',
      deadline: opp.deadline || '',
      application_url: opp.application_url || '',
      grade_levels: opp.grade_levels || [],
      interests: opp.interests || [],
    });
    setEditingId(opp.id);
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (!error) {
      setOpportunities(opportunities.filter(opp => opp.id !== id));
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (editingId) {
      const { error } = await supabase
        .from('opportunities')
        .update({
          ...formData,
          deadline: formData.deadline || null,
          location: formData.location || null,
          application_url: formData.application_url || null,
        })
        .eq('id', editingId);

      if (!error) {
        await loadOpportunities();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('opportunities')
        .insert({
          ...formData,
          created_by: user.id,
          deadline: formData.deadline || null,
          location: formData.location || null,
          application_url: formData.application_url || null,
        });

      if (!error) {
        await loadOpportunities();
        resetForm();
      }
    }
  };

  const toggleGrade = (grade: string) => {
    setFormData({
      ...formData,
      grade_levels: formData.grade_levels.includes(grade)
        ? formData.grade_levels.filter(g => g !== grade)
        : [...formData.grade_levels, grade],
    });
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !formData.interests.includes(interest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest.trim()],
      });
    }
  };

  const removeInterest = (index: number) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-royal-purple">
            Admin Panel
          </h1>
          {!creating && !editingId && (
            <Button onClick={() => setCreating(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Opportunity
            </Button>
          )}
        </div>

        {(creating || editingId) && (
          <Card className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-charcoal">
                {editingId ? 'Edit Opportunity' : 'Create New Opportunity'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Opportunity title"
                required
              />

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg"
                  required
                >
                  <option value="internship">Internship</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="summer_program">Summer Program</option>
                  <option value="research">Research</option>
                  <option value="competition">Competition</option>
                </select>
              </div>

              <Input
                label="Organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Hosting organization"
                required
              />

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full description..."
                  rows={4}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg resize-none"
                  required
                />
              </div>

              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State or Remote"
              />

              <Input
                label="Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />

              <Input
                label="Application URL"
                value={formData.application_url}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                placeholder="https://..."
              />

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Eligible Grade Levels
                </label>
                <div className="flex gap-2">
                  {['9', '10', '11', '12'].map((grade) => (
                    <button
                      key={grade}
                      onClick={() => toggleGrade(grade)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        formData.grade_levels.includes(grade)
                          ? 'bg-electric-blue text-white'
                          : 'bg-gray-100 text-charcoal'
                      }`}
                    >
                      {grade}th
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Interests/Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add interest..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <Badge key={index} variant="blue" className="cursor-pointer">
                      {interest}
                      <button
                        onClick={() => removeInterest(index)}
                        className="ml-2 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={!formData.title || !formData.organization || !formData.description}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {opportunities.map((opp) => (
            <Card key={opp.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-charcoal mb-1">
                    {opp.title}
                  </h3>
                  <p className="text-electric-blue font-medium mb-2">
                    {opp.organization}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="blue">{opp.type.replace('_', ' ')}</Badge>
                    {opp.deadline && (
                      <Badge variant="peach">
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {opp.description}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(opp)}
                    className="p-2 hover:bg-blue-50 text-electric-blue rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(opp.id)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
