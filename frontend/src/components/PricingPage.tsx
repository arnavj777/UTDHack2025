import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Sparkles, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { Switch } from './ui/switch';
import { useState } from 'react';

export function PricingPage() {
  const [annually, setAnnually] = useState(false);

  const tiers = [
    {
      name: "Starter",
      price: annually ? 39 : 49,
      description: "Perfect for individual PMs and small teams",
      features: [
        "Up to 3 active products",
        "5 team members",
        "Basic AI assistant",
        "PRD & user story generation",
        "Standard roadmap views",
        "Email support",
        "100 AI credits/month",
        "Community access"
      ],
      excluded: [
        "Advanced AI features",
        "Compliance packs",
        "SSO",
        "Priority support"
      ]
    },
    {
      name: "Pro",
      price: annually ? 119 : 149,
      description: "For growing product teams",
      popular: true,
      features: [
        "Unlimited products",
        "25 team members",
        "Advanced AI assistant",
        "All generation features",
        "Advanced analytics",
        "Priority email & chat support",
        "1000 AI credits/month",
        "Integrations (Jira, Linear, Asana)",
        "Custom templates",
        "Version control",
        "Competitor intelligence",
        "Customer feedback analysis"
      ],
      excluded: [
        "SSO",
        "Compliance packs",
        "Custom integrations"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations and regulated industries",
      features: [
        "Unlimited everything",
        "Unlimited team members",
        "White-glove AI customization",
        "All Pro features",
        "Dedicated success manager",
        "24/7 phone & chat support",
        "Unlimited AI credits",
        "SSO (SAML, OAuth)",
        "Advanced security & compliance",
        "Banking & financial compliance packs",
        "Custom AI training",
        "API access",
        "Custom integrations",
        "On-premise deployment option",
        "SLA guarantees"
      ],
      excluded: []
    }
  ];

  const addOns = [
    {
      name: "Extra AI Credits",
      price: "$29/month",
      description: "500 additional AI generation credits"
    },
    {
      name: "Compliance Pack: Banking",
      price: "$99/month",
      description: "FDIC, SOX, and banking-specific templates and checks"
    },
    {
      name: "Compliance Pack: Healthcare",
      price: "$99/month",
      description: "HIPAA compliance templates and security features"
    },
    {
      name: "Single Sign-On (SSO)",
      price: "$49/month",
      description: "SAML and OAuth integration (Pro tier only)"
    },
    {
      name: "Premium Integrations",
      price: "$79/month",
      description: "Salesforce, SAP, custom API connections"
    }
  ];

  const faqs = [
    {
      q: "What are AI credits?",
      a: "AI credits are used when you generate content with our AI features (PRDs, user stories, market analysis, etc.). Each generation uses credits based on complexity. Don't worry - we'll notify you before you run out!"
    },
    {
      q: "Can I change plans later?",
      a: "Yes! You can upgrade or downgrade at any time. When upgrading, you'll get immediate access. When downgrading, changes take effect at the next billing cycle."
    },
    {
      q: "What integrations do you support?",
      a: "Pro and Enterprise plans include integrations with Jira, Linear, Asana, Azure DevOps, and GitHub. Enterprise customers can request custom integrations."
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We use bank-level encryption, SOC 2 certified infrastructure, and never train our AI models on your data. Enterprise plans include additional security features."
    },
    {
      q: "Do you offer a free trial?",
      a: "Yes! All plans come with a 14-day free trial. No credit card required."
    },
    {
      q: "What happens if I exceed my team member limit?",
      a: "We'll notify you when you're approaching your limit. You can either upgrade to the next tier or purchase additional seats at $15/user/month."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">ProductAI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
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

      {/* Header */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="mb-4">Simple, Transparent Pricing</h1>
          <p className="text-slate-600 mb-8">
            Choose the plan that's right for your team. All plans include 14-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={!annually ? '' : 'text-slate-400'}>Monthly</span>
            <Switch checked={annually} onCheckedChange={setAnnually} />
            <span className={annually ? '' : 'text-slate-400'}>
              Annual <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {tiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`p-8 text-left ${tier.popular ? 'border-blue-600 border-2 relative shadow-lg' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="mb-2">{tier.name}</h3>
                <div className="mb-4">
                  {typeof tier.price === 'number' ? (
                    <>
                      <span className="text-4xl">${tier.price}</span>
                      <span className="text-slate-600">/month</span>
                    </>
                  ) : (
                    <span className="text-4xl">{tier.price}</span>
                  )}
                </div>
                <p className="text-slate-600 mb-6">{tier.description}</p>
                
                <Link to="/signup">
                  <Button 
                    className={`w-full mb-6 ${tier.popular ? '' : 'variant-outline'}`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </Link>

                <div className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {tier.excluded.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-400">
                      <X className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-12">Detailed Feature Comparison</h2>
          <Card className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Starter</th>
                  <th className="text-center p-4">Pro</th>
                  <th className="text-center p-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Active Products', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Team Members', starter: '5', pro: '25', enterprise: 'Unlimited' },
                  { feature: 'AI Credits/month', starter: '100', pro: '1,000', enterprise: 'Unlimited' },
                  { feature: 'PRD Generation', starter: '✓', pro: '✓', enterprise: '✓' },
                  { feature: 'User Story Generation', starter: '✓', pro: '✓', enterprise: '✓' },
                  { feature: 'Roadmap Planning', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
                  { feature: 'Competitor Analysis', starter: '—', pro: '✓', enterprise: '✓' },
                  { feature: 'Customer Feedback AI', starter: '—', pro: '✓', enterprise: '✓' },
                  { feature: 'Integrations', starter: '—', pro: 'Jira, Linear, Asana', enterprise: 'All + Custom' },
                  { feature: 'SSO', starter: '—', pro: 'Add-on', enterprise: '✓' },
                  { feature: 'Compliance Packs', starter: '—', pro: '—', enterprise: '✓' },
                  { feature: 'Support', starter: 'Email', pro: 'Priority', enterprise: '24/7 Dedicated' },
                ].map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-4">{row.feature}</td>
                    <td className="p-4 text-center">{row.starter}</td>
                    <td className="p-4 text-center">{row.pro}</td>
                    <td className="p-4 text-center">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-4">Add-ons & Extensions</h2>
          <p className="text-center text-slate-600 mb-12">
            Enhance your plan with specialized features
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {addOns.map((addon, index) => (
              <Card key={index} className="p-6">
                <h4 className="mb-2">{addon.name}</h4>
                <div className="text-blue-600 mb-3">{addon.price}</div>
                <p className="text-slate-600">{addon.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="text-slate-600 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Button size="lg" variant="outline">Contact Sales</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
