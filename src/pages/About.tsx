import { Heart, Target, Lightbulb } from 'lucide-react';
import { Card } from '../components/Card';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-royal-purple mb-6">
            About Networkly
          </h1>
          <p className="text-xl text-charcoal leading-relaxed">
            We're high school students who got tired of opportunities being scattered everywhere.
            So we built something better.
          </p>
        </div>

        <Card className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-electric-blue bg-opacity-10 rounded-xl">
              <Target className="w-8 h-8 text-electric-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal mb-3">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To create a single platform where high schoolers can showcase their authentic selves and
                discover opportunities that actually matter. No spam, no clutter, just real connections
                that help students grow.
              </p>
            </div>
          </div>
        </Card>

        <Card className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-emerald-green bg-opacity-10 rounded-xl">
              <Lightbulb className="w-8 h-8 text-emerald-green" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal mb-3">Why We Built This</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                As students ourselves, we know how overwhelming it is to find internships, scholarships,
                and programs. Information is scattered across dozens of websites, deadlines sneak up on you,
                and it's hard to know what's even legitimate.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We wanted a place that felt human, not corporate. A platform built by people who understand
                the struggle because we're living it too.
              </p>
            </div>
          </div>
        </Card>

        <Card className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-coral-peach bg-opacity-10 rounded-xl">
              <Heart className="w-8 h-8 text-coral-peach" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal mb-3">What Makes Us Different</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-electric-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Built by students who actually use it</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Curated opportunities, not a spam dump</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-soft-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Deadline reminders so you never miss out</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-coral-peach rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Profiles that show who you really are</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="text-center bg-gradient-to-r from-soft-teal to-electric-blue rounded-xl p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-white mb-3">
            This is Just the Beginning
          </h2>
          <p className="text-white opacity-90">
            We're constantly adding features and opportunities based on what students actually need.
            Got ideas? We're listening.
          </p>
        </div>
      </div>
    </div>
  );
}
