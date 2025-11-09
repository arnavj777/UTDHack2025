import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, Brain, Zap, Target, Users, Rocket, CheckCircle, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Target,
      title: "Product Strategy & Ideation",
      description: "AI-powered brainstorming, market sizing, and scenario planning aligned with business goals"
    },
    {
      icon: Zap,
      title: "Smart Requirements",
      description: "Auto-generate user stories, acceptance criteria, and prioritize your backlog intelligently"
    },
    {
      icon: Users,
      title: "Customer Intelligence",
      description: "Synthesize feedback, competitor activity, and trends into actionable insights"
    },
    {
      icon: Rocket,
      title: "Rapid Prototyping",
      description: "Generate wireframes, test cases, and iterate with AI-powered feedback"
    },
    {
      icon: Brain,
      title: "Go-to-Market Excellence",
      description: "AI-assisted persona development, GTM strategy, and stakeholder communication"
    },
    {
      icon: Sparkles,
      title: "Intelligent Automation",
      description: "Automate sprint planning, reporting, and cross-team updates"
    }
  ];

  const testimonials = [
    {
      quote: "This AI assistant cut our PRD writing time by 70% and helped us ship 3x faster.",
      author: "Sarah Chen",
      role: "Senior PM, FinTech Startup",
      company: "PayFlow"
    },
    {
      quote: "The compliance checks alone saved us months of regulatory review cycles.",
      author: "Michael Torres",
      role: "Product Lead, Banking",
      company: "Regional Bank"
    },
    {
      quote: "Finally, a tool that understands the complexity of enterprise product management.",
      author: "Jessica Kumar",
      role: "VP Product, Enterprise SaaS",
      company: "CloudScale"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">ProductAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/pricing" className="text-slate-600 hover:text-slate-900">
                Pricing
              </Link>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900">AI-Powered Product Management</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 max-w-4xl mx-auto mb-6">
            Ship Better Products Faster with AI
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 mb-8">
            The first AI-native platform built for Product Managers in regulated industries. 
            Make smarter decisions, accelerate time-to-market, and scale your product org effortlessly.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>

          {/* Demo Video Placeholder */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border bg-slate-900 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-l-8 border-l-white border-y-6 border-y-transparent ml-1"></div>
                </div>
                <p className="text-white/60">Product Demo Video</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-600">
              AI-powered tools for every stage of the product lifecycle
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-slate-600">Get started in minutes, not months</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Connect Your Tools", desc: "Import from Jira, Asana, or start fresh" },
              { step: "2", title: "Set Your Context", desc: "Industry, compliance needs, and goals" },
              { step: "3", title: "Let AI Assist", desc: "Generate PRDs, roadmaps, and insights" },
              { step: "4", title: "Ship Faster", desc: "Collaborate and execute with confidence" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="mb-2">{item.title}</h4>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4">Loved by Product Teams</h2>
            <p className="text-slate-600">Join thousands of PMs shipping better products</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 text-yellow-400">★</div>
                  ))}
                </div>
                <p className="mb-4 text-slate-700">"{testimonial.quote}"</p>
                <div>
                  <div>{testimonial.author}</div>
                  <div className="text-slate-500">{testimonial.role}</div>
                  <div className="text-slate-400">{testimonial.company}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 mb-8">Plans that scale with your product team</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            <Card className="p-8">
              <h3 className="mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-4xl">$49</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Up to 3 products</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Basic AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>5 team members</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </Card>
            <Card className="p-8 border-blue-600 border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full">
                Popular
              </div>
              <h3 className="mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl">$149</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Unlimited products</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>25 team members</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </Card>
            <Card className="p-8">
              <h3 className="mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-4xl">Custom</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Unlimited everything</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Compliance packs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>SSO & security</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </Card>
          </div>
          <Link to="/pricing">
            <Button variant="link" className="gap-2">
              View Detailed Pricing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="mb-4 text-white">Ready to Transform Your Product Process?</h2>
          <p className="mb-8 text-blue-100">
            Join leading product teams using AI to ship faster and smarter
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">ProductAI</span>
              </div>
              <p>AI-powered product management for regulated industries</p>
            </div>
            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
                <li>Roadmap</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            © 2025 ProductAI. Built for PNC Hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
}

