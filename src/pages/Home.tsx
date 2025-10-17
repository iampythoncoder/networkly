import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  onAuthClick: () => void;
}

export function Home({ onAuthClick }: HomeProps) {
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Student Profiles',
      description: 'Showcase who you are, your projects, skills, and achievements in one place.',
      color: 'text-electric-blue',
    },
    {
      icon: Briefcase,
      title: 'Real Opportunities',
      description: 'Find internships, scholarships, and programs tailored to your interests and grade.',
      color: 'text-emerald-green',
    },
    {
      icon: Award,
      title: 'Never Miss a Deadline',
      description: 'Get automatic reminders and updates about opportunities you care about.',
      color: 'text-coral-peach',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="pt-16 pb-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-royal-purple mb-6 leading-tight">
            Built by Students,<br />For Students
          </h1>
          <p className="text-lg sm:text-xl text-charcoal max-w-2xl mx-auto mb-8 leading-relaxed">
            Networkly helps high schoolers showcase who they are and find real opportunities to grow.
            No fluff, just connections that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/opportunities">
                <Button size="lg">
                  Explore Opportunities
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={onAuthClick}>
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover>
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-charcoal mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-16 text-center">
          <div className="bg-gradient-to-r from-electric-blue to-soft-teal rounded-2xl p-12 shadow-lifted">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white text-lg mb-8 opacity-90">
              Join hundreds of high schoolers discovering opportunities that match their ambitions.
            </p>
            {user ? (
              <Link to="/profile">
                <Button variant="secondary" size="lg">
                  Complete Your Profile
                </Button>
              </Link>
            ) : (
              <Button variant="secondary" size="lg" onClick={onAuthClick}>
                Join Networkly
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
