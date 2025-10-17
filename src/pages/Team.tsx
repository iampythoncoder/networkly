import { Mail, Linkedin } from 'lucide-react';
import { Card } from '../components/Card';

export function Team() {
  const team = [
    {
      name: 'Saatvik Santosh',
      role: 'Co-Founder & Developer',
      email: 'saatviksantosh10@gmail.com',
      bio: 'Passionate about building tools that help students succeed. When not coding, probably exploring new opportunities myself.',
    },
    {
      name: 'Aarush Kadira',
      role: 'Co-Founder & Developer',
      email: 'aarush.kadira@gmail.com',
      bio: 'Student developer on a mission to make opportunity discovery easier for everyone. Big believer in student-led innovation.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-royal-purple mb-6">
            Meet the Team
          </h1>
          <p className="text-xl text-charcoal leading-relaxed max-w-2xl mx-auto">
            Two high school students who decided to solve a problem we all face:
            finding and tracking opportunities shouldn't be this hard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {team.map((member, index) => (
            <Card key={index} hover>
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-soft-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-1">
                  {member.name}
                </h3>
                <p className="text-electric-blue font-medium mb-4">
                  {member.role}
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {member.bio}
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href={`mailto:${member.email}`}
                  className="p-2.5 bg-gray-100 hover:bg-electric-blue hover:text-white rounded-lg transition-all duration-200"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <button className="p-2.5 bg-gray-100 hover:bg-electric-blue hover:text-white rounded-lg transition-all duration-200">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-royal-purple to-electric-blue text-white">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want to Join Us?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              We're always looking for passionate students who want to make a difference.
              Whether it's development, design, or community building, reach out!
            </p>
            <a href="/contact">
              <button className="bg-white text-electric-blue px-6 py-3 rounded-lg font-medium hover:shadow-lifted transition-all duration-200">
                Get in Touch
              </button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
