import { useEffect, useState } from 'react';
import { User, School, MapPin, Briefcase, Award, Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    school: '',
    grade_level: '',
    bio: '',
    location: '',
    interests: [] as string[],
    skills: [] as string[],
    achievements: [] as string[],
    projects: [] as string[],
  });

  const [newTag, setNewTag] = useState('');
  const [tagType, setTagType] = useState<'interests' | 'skills' | 'achievements' | 'projects'>('interests');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        school: data.school || '',
        grade_level: data.grade_level || '',
        bio: data.bio || '',
        location: data.location || '',
        interests: data.interests || [],
        skills: data.skills || [],
        achievements: data.achievements || [],
        projects: data.projects || [],
      });
    } else if (error) {
      console.error('Error loading profile:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email!,
        ...formData,
      });

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      await loadProfile();
      setEditing(false);
    }
    setSaving(false);
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setFormData({
      ...formData,
      [tagType]: [...formData[tagType], newTag.trim()],
    });
    setNewTag('');
  };

  const removeTag = (type: keyof typeof formData, index: number) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-royal-purple">
            {editing ? 'Edit Profile' : 'My Profile'}
          </h1>
          {!editing ? (
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => {
                setEditing(false);
                if (profile) {
                  setFormData({
                    full_name: profile.full_name || '',
                    school: profile.school || '',
                    grade_level: profile.grade_level || '',
                    bio: profile.bio || '',
                    location: profile.location || '',
                    interests: profile.interests || [],
                    skills: profile.skills || [],
                    achievements: profile.achievements || [],
                    projects: profile.projects || [],
                  });
                }
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold text-charcoal mb-4">Basic Information</h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your name"
                />
                <Input
                  label="School"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  placeholder="Your high school"
                />
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Grade Level
                  </label>
                  <select
                    value={formData.grade_level}
                    onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  >
                    <option value="">Select grade</option>
                    <option value="9">9th Grade</option>
                    <option value="10">10th Grade</option>
                    <option value="11">11th Grade</option>
                    <option value="12">12th Grade</option>
                  </select>
                </div>
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                />
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold text-charcoal mb-4">Tags</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Add Tags
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={tagType}
                      onChange={(e) => setTagType(e.target.value as typeof tagType)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg"
                    >
                      <option value="interests">Interests</option>
                      <option value="skills">Skills</option>
                      <option value="achievements">Achievements</option>
                      <option value="projects">Projects</option>
                    </select>
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button onClick={addTag}>Add</Button>
                  </div>
                </div>

                {(['interests', 'skills', 'achievements', 'projects'] as const).map((type) => (
                  <div key={type}>
                    <label className="block text-sm font-medium text-charcoal mb-2 capitalize">
                      {type}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData[type].map((item, index) => (
                        <Badge key={index} variant="blue" className="cursor-pointer">
                          {item}
                          <button
                            onClick={() => removeTag(type, index)}
                            className="ml-2 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      {formData[type].length === 0 && (
                        <p className="text-gray-400 text-sm">No {type} added yet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-soft-teal rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-charcoal mb-2">
                    {profile?.full_name || 'Complete your profile'}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                    {profile?.school && (
                      <div className="flex items-center gap-1.5">
                        <School className="w-4 h-4" />
                        <span>{profile.school}</span>
                      </div>
                    )}
                    {profile?.grade_level && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        <span>Grade {profile.grade_level}</span>
                      </div>
                    )}
                    {profile?.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                  {profile?.bio && (
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                  )}
                </div>
              </div>
            </Card>

            {profile?.interests && profile.interests.length > 0 && (
              <Card>
                <h3 className="text-lg font-bold text-charcoal mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-electric-blue" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="blue">{interest}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {profile?.skills && profile.skills.length > 0 && (
              <Card>
                <h3 className="text-lg font-bold text-charcoal mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-green" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="green">{skill}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {profile?.achievements && profile.achievements.length > 0 && (
              <Card>
                <h3 className="text-lg font-bold text-charcoal mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-coral-peach" />
                  Achievements
                </h3>
                <ul className="space-y-2">
                  {profile.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-coral-peach rounded-full mt-2 flex-shrink-0"></span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {profile?.projects && profile.projects.length > 0 && (
              <Card>
                <h3 className="text-lg font-bold text-charcoal mb-3">Projects</h3>
                <ul className="space-y-2">
                  {profile.projects.map((project, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-soft-teal rounded-full mt-2 flex-shrink-0"></span>
                      <span>{project}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {!profile?.full_name && (
              <Card className="bg-warm-beige border-2 border-coral-peach">
                <p className="text-charcoal text-center">
                  Complete your profile to start applying for opportunities!
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
