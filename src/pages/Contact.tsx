import { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-royal-purple mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-charcoal leading-relaxed">
            Have questions, suggestions, or just want to chat? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-electric-blue bg-opacity-10 rounded-xl">
                <Mail className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-charcoal mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">For general inquiries</p>
                <a
                  href="mailto:saatviksantosh10@gmail.com"
                  className="text-electric-blue hover:underline"
                >
                  saatviksantosh10@gmail.com
                </a>
                <br />
                <a
                  href="mailto:aarush.kadira@gmail.com"
                  className="text-electric-blue hover:underline"
                >
                  aarush.kadira@gmail.com
                </a>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-green bg-opacity-10 rounded-xl">
                <MessageSquare className="w-6 h-6 text-emerald-green" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-charcoal mb-2">Feedback</h3>
                <p className="text-gray-600">
                  Got ideas for features or improvements? We're all ears. Student feedback
                  drives everything we build.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-charcoal mb-6">Send us a Message</h2>
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-green bg-opacity-10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Send className="w-8 h-8 text-emerald-green" />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-2">
                Message Sent!
              </h3>
              <p className="text-gray-600">
                We'll get back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Your Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
              />
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  required
                  rows={6}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent resize-none"
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
