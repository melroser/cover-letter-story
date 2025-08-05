'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import {
  FileText, Mail, StickyNote, Brain, Bot, Sparkles, 
  AlertTriangle, CheckCircle, TrendingUp, MessageSquare,
  Gauge, Hash, ChevronDown, Zap, Download, ArrowRight,
  Code2, Users, Rocket, Target, BookOpen, PenTool,
  CircuitBoard, GitBranch, Layers
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Font import - add to your app's global CSS or _document.tsx
// import { Space_Grotesk } from 'next/font/google';
// const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

// Complete NLP metrics for each stage
const getNLPMetrics = (stage: string) => ({
  wordCount: {
    sources: 450,
    'prompt-creation': 320,
    'ai-draft': 380,
    'humanizer-prompt': 280,
    'over-humanized': 420,
    'final': 350
  }[stage] || 0,
  sentiment: {
    sources: 0.2,
    'prompt-creation': 0.4,
    'ai-draft': 0.6,
    'humanizer-prompt': 0.5,
    'over-humanized': 0.9,
    'final': 0.7
  }[stage] || 0,
  formality: {
    sources: 0.3,
    'prompt-creation': 0.7,
    'ai-draft': 0.85,
    'humanizer-prompt': 0.4,
    'over-humanized': 0.2,
    'final': 0.6
  }[stage] || 0,
  readability: {
    sources: 65,
    'prompt-creation': 55,
    'ai-draft': 45,
    'humanizer-prompt': 70,
    'over-humanized': 75,
    'final': 58
  }[stage] || 0,
  avgSentenceLength: {
    sources: 12,
    'prompt-creation': 18,
    'ai-draft': 28,
    'humanizer-prompt': 15,
    'over-humanized': 16,
    'final': 22
  }[stage] || 0,
  uniqueWords: {
    sources: 180,
    'prompt-creation': 140,
    'ai-draft': 165,
    'humanizer-prompt': 120,
    'over-humanized': 195,
    'final': 175
  }[stage] || 0,
  technicalTerms: {
    sources: 15,
    'prompt-creation': 12,
    'ai-draft': 22,
    'humanizer-prompt': 8,
    'over-humanized': 18,
    'final': 20
  }[stage] || 0,
  emotionalTone: {
    sources: 0.3,
    'prompt-creation': 0.4,
    'ai-draft': 0.5,
    'humanizer-prompt': 0.6,
    'over-humanized': 0.85,
    'final': 0.65
  }[stage] || 0,
  activeVoice: {
    sources: 60,
    'prompt-creation': 70,
    'ai-draft': 40,
    'humanizer-prompt': 75,
    'over-humanized': 85,
    'final': 65
  }[stage] || 0
});

// Complete story content
const storyContent = {
  hero: {
    title: "This Website Is My Cover Letter",
    subtitle: "An Interactive Look AI-Assisted Writing",
    content: `Dear Fusion Risk Management Hiring Team,

    I built a demonstration of my approach to using AI to automate work whenever possible. 
    My strategy is to design a pipeline that leads me closer to my end goal after every step. 
    The first pass is often rough, but after enough cycles, I usually get value from the automation. 
    In this example, I transformed scattered correspondence and notes into an acceptable cover letter. 
    After building the automation I decided to use the pipeline to build this web tool demonstrating AI tool familiarity, 
    Engineering and System Design understanding, and an entrepreneurial spirit.
    if nothing else, I hope it's fun to scroll through.`,

    cta: "Scroll to see how I built my cover letter with AI"
  },
  sources: {
      title: "Step 1: Data Collection",
      subtitle: "Every great build starts with understanding the requirements",
      content: {
          resume: "My resume at https://registry.json.org/melroser showcases 10+ years building full-stack applications, leading teams, and pioneering AI-assisted development.",
          email: `From: Your Recruiter
          Subject: Full Stack Engineer - Fusion Risk Management

          Hi Rob,

          I really appreciate your time today and looking forward to working with you. Attached is the job description for the Full Stack Engineer with Fusion Risk Management. As we discussed, please send over a cover letter highlighting your experience vibe coding as well as the AI-assisted tools/bots/IDEs you've used.

                  Key Requirements:
                      • Entrepreneurial engineer who drives customer value
              • Greenfield Azure opportunity 
          • Experience with Gen AI Dev Tools (Cursor, Gemini, ChatGPT, CoPilot)
          • Backend: Java, .NET | Frontend: React, Angular
          • Remote position`,
          notes: `My notes from our call:

              🤖 Recruiter was REALLY interested in the LeRobot Worldwide Hackathon
          - Kicked off by Hugging Face CEO Clem Delangue
          - Built autonomous robot navigation system
          - Team won "Most Innovative Use of AI"

          💻 Windsurf Vibe Coding Meetup
          - I taught 30+ developers the new Windsurf IDE
          - Live-coded a full app using AI pair programming
          - "Vibe coding" = flowing with AI suggestions

          Key points to emphasize:
              - Speaker/mentor at conferences
          - Tools: Cursor, Hugging Face, Windsurf
          - Teaching others how to leverage AI
          - Entrepreneurial mindset`
      },
      events: [
          {
              icon: <Rocket className="w-6 h-6" />,
                  title: "LeRobot Hackathon Miami",
              description: "48-hour robotics challenge with Hugging Face",
              highlight: "Built award-winning autonomous navigation"
          },
          {
              icon: <Code2 className="w-6 h-6" />,
                  title: "Windsurf Vibe Coding",
              description: "Taught AI-assisted development to 30+ devs",
              highlight: "Live demo: Google Slides clone in 1 hour"
          }
      ]
  },
  promptCreation: {
      title: "Step 2: Prompt Builder",
      subtitle: "Building an AI system to understand context and generate targeted content",
      content: `I created a sophisticated prompt engineering system:

          <identity>
      You are a world-class career strategist specializing in tech/AI sectors...
          </identity>

      <context>
      - Always fetch latest resume from https://registry.json.org/melroser
          - Analyze job requirements deeply
      - Incorporate specific events and achievements
      - Match company culture and values
      </context>

      <task>
      Generate a cover letter that:
          1. Demonstrates technical expertise
      2. Shows cultural fit
      3. Highlights specific achievements
      4. Maintains authentic voice
      </task>

      The prompt was 2,000+ words of carefully crafted instructions to ensure the AI understood not just WHAT to write, but HOW to think about the problem.`
  },
  aiDraft: {
      title: "Step 3: First Draft",
      subtitle: "Claude generates a professional but formulaic draft",
      content: `August 5, 2025

      Fusion Risk Management Hiring Team

      Dear Hiring Team,

      I am writing to express my enthusiastic interest in the Full Stack Engineer position at Fusion Risk Management. Following a conversation with your recruiter, I was immediately drawn to this greenfield opportunity to build a new, scalable platform on Microsoft Azure from the ground up.

          The recruiter emphasized the need for an entrepreneurial engineer adept at using generative AI tools to accelerate development. This resonates strongly with my recent work. For instance, I actively use tools like Cursor, ChatGPT, and CoPilot in my daily workflow. At a recent AI Collective Open Build event, I demonstrated the power of rapid, AI-assisted development by building a functional Google Slides clone in under an hour through "vibe coding," a testament to my ability to quickly prototype and deliver solutions.

          Furthermore, I am passionate about fostering teamwork and teaching others, which I believe is crucial for the success of a foundational project. As a speaker and guide at a recent Windsurf conference, I mentored other developers on leveraging new frameworks. My enthusiasm for collaborative building was also on display during my participation in the LeRobot Worldwide Hackathon, an event kicked off by Hugging Face's CEO, which sharpened my ability to work effectively in a team to solve complex problems under pressure.

          [Rest of letter continues...]`,
      analysis: "Professional but generic. Mentions the key events but lacks personality. Sounds like every other cover letter."
  },
  humanizerCreation: {
      title: "Step 4: Make a Humanizer",
      subtitle: "Creating an AI to inject authentic personality",
      content: `I built a specialized "humanizer" prompt:

          <purpose>
      Transform corporate buzzword soup into how a real human talks
      </purpose>

      <style_guide>
      - Write like you're excitedly telling a friend about an opportunity
      - Use vivid metaphors and specific details
      - Show genuine enthusiasm
      - Keep technical credibility while being personable
          </style_guide>

      <examples>
      Instead of: "I have extensive experience with AI tools"
      Write: "I've learned to dance with tools like Cursor and ChatGPT in ways that turn development into jazz improvisation"
      </examples>`
  },
  overHumanized: {
      title: "Step 5: Tuning Required",
      subtitle: "The humanizer creates the 'George Hotz' version",
      content: `After chatting with your recruiter about the Full Stack Engineer role at Fusion Risk Management, I couldn't stop thinking about it. Building something completely new on Azure from scratch? That's the kind of challenge that gets me out of bed in the morning.

          Here's what really grabbed me: you're not just looking for someone to write code – you're looking for someone who thinks like an entrepreneur and builds like a hacker. That's exactly how I work. Just last week at the AI Collective Open Build, I decided to see how fast I could whip up a Google Slides clone using what I call "vibe coding" – basically riding the wave of AI assistance to go from idea to working prototype. One hour later, I had a functional app. Not because I'm some coding superhero, but because I've learned to dance with tools like Cursor, ChatGPT, and CoPilot in ways that turn development into jazz improvisation.

          [Continues with very casual tone...]

      I'm ready to pour everything I've got into building Fusion's future platform. Let's create something that doesn't just work – let's build something that makes other engineers wonder how we pulled it off.`,
      feedback: `My reaction: "Okay now that's better but tune it down about 70% you can have a couple cheeky sentences here and there but the whole thing can't read like it was written by a 17 year old George Hotz"`
  },
  finalVersion: {
      title: "Step 6: Desired Outcome",
      subtitle: "Professional enthusiasm with authentic personality",
      content: `After speaking with your recruiter about the Full Stack Engineer position at Fusion Risk Management, I've been genuinely excited about the opportunity to build a new platform on Azure from the ground up. The chance to shape foundational architecture while incorporating generative AI into the development process is exactly the type of challenge I've been looking for.

              Your recruiter highlighted the need for an entrepreneurial engineer who's comfortable using AI tools to accelerate development – this really caught my attention. I've integrated tools like Cursor, ChatGPT, and CoPilot into my daily workflow with great results. At a recent AI Collective Open Build event, I demonstrated this approach by building a functional Google Slides clone in under an hour. While it sounds a bit ridiculous, it perfectly illustrates how AI-assisted development can dramatically speed up prototyping without sacrificing quality.

                  Beyond the technical aspects, I believe successful greenfield projects require strong collaboration and knowledge sharing. At the recent Windsurf conference, I had the opportunity to guide other developers through new frameworks, and I participated in the LeRobot Worldwide Hackathon (yes, the one Hugging Face's CEO kicked off), where our team tackled some genuinely complex problems under tight deadlines. These experiences reinforced my belief that the best engineering happens when technical skill meets effective teamwork.

                      My background spans both backend development in .NET and Java, as well as modern frontend frameworks, giving me the full-stack perspective needed for this role. Combined with my experience architecting cloud-native applications on Azure, I'm confident I can contribute meaningfully from day one and help deliver the MVP you're looking for.

                          I'm excited about the possibility of joining Fusion's mission to build a more resilient world and would welcome the opportunity to discuss how I can contribute to this project.

                              Best regards,
          Robert Melrose`,
      success: true
  }
};

// NLP Analysis Card Component
const NLPAnalysisCard: React.FC<{ 
  metrics: ReturnType<typeof getNLPMetrics>;
  show: boolean;
}> = ({ metrics, show }) => {
  const radarData = [
    { metric: 'Sentiment', value: metrics.sentiment, fullMark: 1 },
    { metric: 'Formality', value: metrics.formality, fullMark: 1 },
    { metric: 'Readability', value: metrics.readability / 100, fullMark: 1 },
    { metric: 'Emotional', value: metrics.emotionalTone, fullMark: 1 },
    { metric: 'Active Voice', value: metrics.activeVoice / 100, fullMark: 1 },
    { metric: 'Technical', value: metrics.technicalTerms / 30, fullMark: 1 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: show ? 1 : 0, x: show ? 0 : 50 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircuitBoard className="w-5 h-5" />
            Document Analysis
          </CardTitle>
          <CardDescription className="text-white/70">
            Complete NLP metrics for this version
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{metrics.wordCount}</div>
              <div className="text-sm opacity-70">Words</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{metrics.readability}%</div>
              <div className="text-sm opacity-70">Readability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{metrics.avgSentenceLength}</div>
              <div className="text-sm opacity-70">Avg Sentence</div>
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* Detailed Scores */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sentiment Score</span>
              <div className="flex items-center gap-2">
                <Progress value={metrics.sentiment * 100} className="w-24" />
                <span className="text-sm font-mono">{(metrics.sentiment * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Formality Level</span>
              <div className="flex items-center gap-2">
                <Progress value={metrics.formality * 100} className="w-24" />
                <span className="text-sm font-mono">{(metrics.formality * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Emotional Tone</span>
              <div className="flex items-center gap-2">
                <Progress value={metrics.emotionalTone * 100} className="w-24" />
                <span className="text-sm font-mono">{(metrics.emotionalTone * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Voice</span>
              <div className="flex items-center gap-2">
                <Progress value={metrics.activeVoice} className="w-24" />
                <span className="text-sm font-mono">{metrics.activeVoice}%</span>
              </div>
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* Radar Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: 'white', fontSize: 11 }}
                className="text-xs"
              />
              <PolarRadiusAxis 
                domain={[0, 1]} 
                tick={false}
                axisLine={false}
              />
              <Radar
                dataKey="value"
                stroke="rgba(168, 85, 247, 0.8)"
                fill="rgba(168, 85, 247, 0.3)"
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <div className="text-xs opacity-70">Unique Words</div>
              <div className="text-xl font-semibold">{metrics.uniqueWords}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs opacity-70">Technical Terms</div>
              <div className="text-xl font-semibold">{metrics.technicalTerms}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Section Component
const ScrollSection: React.FC<{
  id: string;
  title: string;
  subtitle?: string;
  content: any;
  bgColor: string;
  index: number;
}> = ({ id, title, subtitle, content, bgColor, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  const [showMetrics, setShowMetrics] = useState(false);
  const metrics = getNLPMetrics(id);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      setShowMetrics(value > 0.3 && value < 0.7);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <motion.section
      ref={ref}
      className="min-h-screen relative flex items-center justify-center px-6 py-20"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                           radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <motion.div
          style={{ opacity, scale, y }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Content */}
          <div className="space-y-8">
            <div>
              <motion.h2 
                className="text-6xl lg:text-7xl font-black mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
              >
                {title}
              </motion.h2>
              {subtitle && (
                <motion.p 
                  className="text-xl lg:text-2xl opacity-80 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>

            {/* Content rendering based on type */}
            {typeof content === 'string' ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="prose prose-lg prose-invert max-w-none"
              >
                <pre className="whitespace-pre-wrap font-sans text-base lg:text-lg leading-relaxed opacity-90">
                  {content}
                </pre>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Hero section */}
                {content.content && typeof content.content === 'string' && (
                  <p className="text-lg lg:text-xl leading-relaxed opacity-90">
                    {content.content}
                  </p>
                )}

                {/* CTA */}
                {content.cta && (
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <span>{content.cta}</span>
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                  </div>
                )}

                {/* Source documents */}
                {content.email && (
                  <div className="space-y-6">
                    <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Mail className="w-5 h-5" />
                          Recruiter Email
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap text-sm text-white/90 font-sans">
                          {content.email}
                        </pre>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <StickyNote className="w-5 h-5" />
                          My Interview Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap text-sm text-white/90 font-sans">
                          {content.notes}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Events */}
                {content.events && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {content.events.map((event: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="bg-white/10 border-white/20 backdrop-blur-md h-full">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                              {event.icon}
                              {event.title}
                            </CardTitle>
                            <CardDescription className="text-white/70">
                              {event.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {event.highlight}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Analysis or feedback */}
                {content.analysis && (
                  <Card className="bg-red-500/20 border-red-500/40 backdrop-blur-md">
                    <CardContent className="pt-6">
                      <p className="text-white/90 italic">{content.analysis}</p>
                    </CardContent>
                  </Card>
                )}

                {content.feedback && (
                  <Card className="bg-orange-500/20 border-orange-500/40 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        My Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/90 italic text-lg">"{content.feedback}"</p>
                    </CardContent>
                  </Card>
                )}

                {content.success && (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="flex items-center gap-3 text-green-400"
                  >
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-xl font-semibold">Perfect Balance Achieved!</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* NLP Analysis */}
          <div className="lg:sticky lg:top-24">
            <NLPAnalysisCard metrics={metrics} show={showMetrics} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// PDF Generation Function
const generatePDF = () => {
  const pdf = new jsPDF();
  pdf.setFontSize(12);
  
  // Add content
  const lines = storyContent.finalVersion.content.split('\n');
  let y = 20;
  
  lines.forEach(line => {
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
    pdf.text(line, 20, y);
    y += 7;
  });
  
  pdf.save('Robert_Melrose_Cover_Letter_Fusion_Risk_Management.pdf');
};

// Main Component
export default function MetaCoverLetter() {
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      const section = Math.floor(value * 7);
      setCurrentSection(section);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const sections = [
    { id: 'hero', color: '#0f172a' },
    { id: 'sources', color: '#1e40af' },
    { id: 'prompt-creation', color: '#7c3aed' },
    { id: 'ai-draft', color: '#4f46e5' },
    { id: 'humanizer-prompt', color: '#ea580c' },
    { id: 'over-humanized', color: '#dc2626' },
    { id: 'final', color: '#059669' }
  ];

  return (
    <div className="relative text-white" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />

      {/* Navigation */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-4">
        <Badge variant="outline" className="bg-black/80 text-white border-white/20">
          Step {currentSection + 1} of 7
        </Badge>
        <Button
          variant="outline"
          size="sm"
          className="bg-black/80 text-white border-white/20 hover:bg-white/20"
          onClick={generatePDF}
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Hero Section */}
      <ScrollSection
        id="hero"
        title={storyContent.hero.title}
        subtitle={storyContent.hero.subtitle}
        content={storyContent.hero}
        bgColor={sections[0].color}
        index={0}
      />

      {/* Sources Section */}
      <ScrollSection
        id="sources"
        title={storyContent.sources.title}
        subtitle={storyContent.sources.subtitle}
        content={storyContent.sources.content}
        bgColor={sections[1].color}
        index={1}
      />

      {/* Prompt Creation */}
      <ScrollSection
        id="prompt-creation"
        title={storyContent.promptCreation.title}
        subtitle={storyContent.promptCreation.subtitle}
        content={storyContent.promptCreation.content}
        bgColor={sections[2].color}
        index={2}
      />

      {/* AI Draft */}
      <ScrollSection
        id="ai-draft"
        title={storyContent.aiDraft.title}
        subtitle={storyContent.aiDraft.subtitle}
        content={storyContent.aiDraft}
        bgColor={sections[3].color}
        index={3}
      />

      {/* Humanizer Creation */}
      <ScrollSection
        id="humanizer-prompt"
        title={storyContent.humanizerCreation.title}
        subtitle={storyContent.humanizerCreation.subtitle}
        content={storyContent.humanizerCreation.content}
        bgColor={sections[4].color}
        index={4}
      />

      {/* Over-Humanized */}
      <ScrollSection
        id="over-humanized"
        title={storyContent.overHumanized.title}
        subtitle={storyContent.overHumanized.subtitle}
        content={storyContent.overHumanized}
        bgColor={sections[5].color}
        index={5}
      />

      {/* Final Version */}
      <ScrollSection
        id="final"
        title={storyContent.finalVersion.title}
        subtitle={storyContent.finalVersion.subtitle}
        content={storyContent.finalVersion}
        bgColor={sections[6].color}
        index={6}
      />

      {/* Final CTA Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-green-900 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <Sparkles className="w-20 h-20 mx-auto mb-8 text-yellow-400" />
          <h2 className="text-6xl lg:text-8xl font-black mb-6">
            This Is How I Build
          </h2>
          <p className="text-2xl lg:text-3xl opacity-80 mb-12 font-light">
            Combining AI tools with human creativity to create exceptional experiences
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-white">6</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">AI Tools Used</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-white">3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">Iterations</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-white">1</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">Perfect Result</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={generatePDF}
            >
              <Download className="w-5 h-5 mr-2" />
              Download My Cover Letter
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Let's Build Together
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
