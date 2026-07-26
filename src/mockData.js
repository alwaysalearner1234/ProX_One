export const mockData = {
  user: {
    name: "Alex Rivera",
    username: "@alexrivera_dev",
    role: "Senior CS & AI Undergraduate",
    university: "Stanford University '26",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    level: 14,
    xp: 14250,
    nextLevelXp: 18000,
    rank: "#3 Global Student Leader",
    profileCompletion: 92,
    reputationScore: 98.4,
    dailyStreak: 42,
    bio: "AI researcher & full-stack developer building autonomous agent networks. 3x Hackathon Winner."
  },

  kpiStats: [
    {
      id: "connections",
      title: "Connections",
      value: "1,482",
      rawVal: 1482,
      trend: "+12.4%",
      isPositive: true,
      icon: "fa-user-group",
      gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
      sparkline: [30, 45, 40, 60, 75, 80, 95]
    },
    {
      id: "applied",
      title: "Opportunities Applied",
      value: "24",
      rawVal: 24,
      trend: "+4 this week",
      isPositive: true,
      icon: "fa-bullseye",
      gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
      sparkline: [2, 5, 8, 12, 16, 20, 24]
    },
    {
      id: "hackathons",
      title: "Hackathons Joined",
      value: "8",
      rawVal: 8,
      trend: "2 Active",
      isPositive: true,
      icon: "fa-trophy",
      gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
      sparkline: [1, 2, 3, 4, 5, 6, 8]
    },
    {
      id: "internships",
      title: "Internships Offered",
      value: "3",
      rawVal: 3,
      trend: "Top Tier",
      isPositive: true,
      icon: "fa-briefcase",
      gradient: "linear-gradient(135deg, #10B981, #059669)",
      sparkline: [0, 1, 1, 2, 2, 3, 3]
    },
    {
      id: "courses",
      title: "Courses Completed",
      value: "16",
      rawVal: 16,
      trend: "+3 this month",
      isPositive: true,
      icon: "fa-graduation-cap",
      gradient: "linear-gradient(135deg, #EC4899, #BE185D)",
      sparkline: [6, 8, 10, 12, 14, 15, 16]
    },
    {
      id: "projects",
      title: "Projects Built",
      value: "12",
      rawVal: 12,
      trend: "4 Featured",
      isPositive: true,
      icon: "fa-folder-open",
      gradient: "linear-gradient(135deg, #06B6D4, #0891B2)",
      sparkline: [4, 6, 7, 8, 9, 11, 12]
    },
    {
      id: "certificates",
      title: "Certificates",
      value: "19",
      rawVal: 19,
      trend: "Verified",
      isPositive: true,
      icon: "fa-award",
      gradient: "linear-gradient(135deg, #6366F1, #4338CA)",
      sparkline: [10, 12, 14, 15, 17, 18, 19]
    },
    {
      id: "streak",
      title: "Daily Streak",
      value: "42 Days",
      rawVal: 42,
      trend: "🔥 Supercharged",
      isPositive: true,
      icon: "fa-fire",
      gradient: "linear-gradient(135deg, #EF4444, #B91C1C)",
      sparkline: [15, 20, 25, 30, 35, 40, 42]
    },
    {
      id: "reputation",
      title: "Reputation Score",
      value: "98.4",
      rawVal: 98.4,
      trend: "Top 1% Global",
      isPositive: true,
      icon: "fa-star",
      gradient: "linear-gradient(135deg, #FBBF24, #D97706)",
      sparkline: [88, 90, 92, 94, 96, 97, 98.4]
    },
    {
      id: "views",
      title: "Profile Views",
      value: "3,840",
      rawVal: 3840,
      trend: "+342 this week",
      isPositive: true,
      icon: "fa-chart-line",
      gradient: "linear-gradient(135deg, #14B8A6, #0D9488)",
      sparkline: [1200, 1800, 2200, 2700, 3100, 3500, 3840]
    }
  ],

  aiRecommendations: [
    {
      id: "rec-1",
      type: "Internship",
      title: "Google AI Research Fellow Internship",
      company: "Google AI",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
      matchScore: 95,
      reason: "Matched with your PyTorch, Transformer Architecture, and Stanford AI Lab experience.",
      salary: "$65/hr + Housing Stipend",
      location: "Mountain View, CA / Hybrid",
      isRemote: true,
      deadline: "Closes in 4 days",
      deadlineUrgent: true,
      tags: ["Artificial Intelligence", "LLMs", "PyTorch"]
    },
    {
      id: "rec-2",
      type: "Internship",
      title: "Microsoft Autonomous Systems Engineer",
      company: "Microsoft",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      matchScore: 92,
      reason: "High synergy with your Systems & C++ performance optimization background.",
      salary: "$62/hr + Benefits",
      location: "Redmond, WA",
      isRemote: false,
      deadline: "Closes in 7 days",
      deadlineUrgent: false,
      tags: ["C++", "Distributed Systems", "Azure"]
    },
    {
      id: "rec-3",
      type: "Hackathon",
      title: "MIT Global AI & Agentic Hackathon 2026",
      company: "MIT Media Lab",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg",
      matchScore: 98,
      reason: "Perfect match for your multi-agent architecture skills & track record.",
      salary: "$150,000 Prize Pool",
      location: "Cambridge, MA / Virtual",
      isRemote: true,
      deadline: "Registration closes in 3 days",
      deadlineUrgent: true,
      tags: ["Agentic AI", "Grand Prize", "Worldwide"]
    },
    {
      id: "rec-4",
      type: "Challenge",
      title: "Amazon ML Challenge 2026",
      company: "Amazon Web Services",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      matchScore: 89,
      reason: "Your computer vision projects place you in the top 5% candidate tier.",
      salary: "$100,000 Cash Prize + Fast-track Interviews",
      location: "Online Global",
      isRemote: true,
      deadline: "Starts Aug 1",
      deadlineUrgent: false,
      tags: ["Computer Vision", "AWS", "Machine Learning"]
    },
    {
      id: "rec-5",
      type: "Open Source",
      title: "Vercel AI SDK Core Contributor Recommendation",
      company: "Vercel",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
      matchScore: 91,
      reason: "Recommended based on your popular GitHub repo 'AgentFlow-TS'.",
      salary: "$5,000 Grant for top contributors",
      location: "Remote",
      isRemote: true,
      deadline: "Rolling Admission",
      deadlineUrgent: false,
      tags: ["TypeScript", "Next.js", "AI SDK"]
    },
    {
      id: "rec-6",
      type: "Resume Optimization",
      title: "Resume Boost: Add Quantum ML Project Metrics",
      company: "ProX AI Career Engine",
      companyLogo: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
      matchScore: 97,
      reason: "Adding impact numbers to your 3rd project will boost ATS score from 92 to 97%.",
      salary: "Instant +15% recruiter callbacks",
      location: "Self-service AI Tool",
      isRemote: true,
      deadline: "Recommended Today",
      deadlineUrgent: false,
      tags: ["ATS Optimizer", "Career AI", "1-Click Fix"]
    }
  ],

  nearbyPins: [
    {
      id: "pin-1",
      title: "Stanford GenAI Hacker House & Meetup",
      type: "Hackathon",
      lat: 37.4275,
      lng: -122.1697,
      distance: "0.8 miles",
      date: "Today, 6:00 PM",
      address: "Gates Computer Science Bldg, Stanford, CA",
      badge: "Free Food + VC Judges",
      icon: "fa-laptop-code",
      color: "#3B82F6"
    },
    {
      id: "pin-2",
      title: "OpenAI Campus Hiring & Tech Talk",
      type: "Jobs",
      lat: 37.7749,
      lng: -122.4194,
      distance: "14.2 miles",
      date: "Tomorrow, 2:00 PM",
      address: "Pioneer Building, San Francisco, CA",
      badge: "On-site Interviews",
      icon: "fa-briefcase",
      color: "#10B981"
    },
    {
      id: "pin-3",
      title: "Silicon Valley AI Research Lab Demo Day",
      type: "Research Labs",
      lat: 37.3861,
      lng: -122.0839,
      distance: "6.5 miles",
      date: "Jul 28, 10:00 AM",
      address: "Mountain View Tech Park, CA",
      badge: "Research Grants",
      icon: "fa-flask",
      color: "#8B5CF6"
    },
    {
      id: "pin-4",
      title: "Y Combinator Student Incubator Showcase",
      type: "Incubators",
      lat: 37.4848,
      lng: -122.1484,
      distance: "4.1 miles",
      date: "Jul 30, 4:00 PM",
      address: "Palo Alto HQ, CA",
      badge: "$500k Funding Track",
      icon: "fa-rocket",
      color: "#EC4899"
    },
    {
      id: "pin-5",
      title: "NVIDIA Quantum Robotics Workshop",
      type: "Events",
      lat: 37.3712,
      lng: -121.9667,
      distance: "11.0 miles",
      date: "Aug 2, 1:00 PM",
      address: "Voyager HQ, Santa Clara, CA",
      badge: "Hands-on Jetson Hardware",
      icon: "fa-robot",
      color: "#06B6D4"
    },
    {
      id: "pin-6",
      title: "Plug and Play Co-working & Founders Lounge",
      type: "Coworking Spaces",
      lat: 37.3688,
      lng: -122.0363,
      distance: "8.3 miles",
      date: "Open 24/7",
      address: "Sunnyvale, CA",
      badge: "Student Free Pass",
      icon: "fa-building-user",
      color: "#F59E0B"
    }
  ],

  upcomingEvents: [
    {
      id: "ev-1",
      title: "Google AI Global Developer Summit 2026",
      organizer: "Google Cloud & DeepMind",
      time: "July 26 • 09:00 AM PST",
      type: "Virtual & In-Person",
      speakers: ["Demis Hassabis", "Jeff Dean"],
      attendees: 14200,
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      id: "ev-2",
      title: "HackMIT 2026 Opening Keynote",
      organizer: "MIT Student Committee",
      time: "July 29 • 10:00 AM EST",
      type: "Hackathon",
      speakers: ["Sam Altman", "Guillermo Rauch"],
      attendees: 3800,
      gradient: "from-purple-600 to-pink-600"
    },
    {
      id: "ev-3",
      title: "AWS Cloud & Agentic Infrastructure Workshop",
      organizer: "Amazon Web Services",
      time: "August 02 • 02:00 PM PST",
      type: "Interactive Masterclass",
      speakers: ["Dr. Werner Vogels"],
      attendees: 8500,
      gradient: "from-cyan-600 to-blue-600"
    },
    {
      id: "ev-4",
      title: "Meta Developer Meetup & Llama 4 Showcase",
      organizer: "Meta AI",
      time: "August 05 • 05:00 PM PST",
      type: "Live Stream",
      speakers: ["Yann LeCun"],
      attendees: 19400,
      gradient: "from-emerald-600 to-teal-600"
    }
  ],

  communityPosts: [
    {
      id: "post-1",
      author: "Sophia Lin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      university: "MIT '25",
      badge: "🏆 Hackathon Champion",
      time: "2 hours ago",
      content: "🚀 Super excited to announce that our team won 1st Place at the Stanford Global AI Hackathon! We built **NexusAgent**—an autonomous agent that synthesizes scientific research papers into interactive 3D knowledge graphs in seconds. Huge thanks to ProX One for helping us find our amazing teammate @alexrivera_dev!",
      tags: ["#HackathonWin", "#AgenticAI", "#StanfordAI", "#ProXOne"],
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      likes: 342,
      comments: 48,
      reposts: 29,
      isLiked: true,
      isBookmarked: false
    },
    {
      id: "post-2",
      author: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      university: "UC Berkeley '26",
      badge: "💼 Incoming Google Intern",
      time: "5 hours ago",
      content: "🎉 Blessed to share that I just accepted my offer for Google AI Software Engineering Internship for Summer 2026! Big shoutout to ProX AI Career Coach for mock interviews and resume optimization—it pointed out 3 critical flaws that changed everything!",
      tags: ["#GoogleInternship", "#SoftwareEngineer", "#CareerGrowth", "#AIPrep"],
      mediaType: "certificate",
      mediaTitle: "Google Offer Verification Badge",
      likes: 890,
      comments: 112,
      reposts: 74,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: "post-3",
      author: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      university: "Oxford University '26",
      badge: "🔬 Published Researcher",
      time: "1 day ago",
      content: "📄 Our paper 'Zero-Shot Multi-Modal Alignment for Microscopic Protein Folding' was accepted at NeurIPS 2026! We released all datasets and code open-source on GitHub.",
      tags: ["#NeurIPS2026", "#BioInformatics", "#OpenSource", "#AI"],
      mediaType: "code",
      mediaTitle: "GitHub: bio-protein-align-v2",
      likes: 620,
      comments: 35,
      reposts: 88,
      isLiked: true,
      isBookmarked: false
    }
  ],

  portfolioData: {
    githubContributions: {
      totalThisYear: 1840,
      streak: 42,
      maxInDay: 28,
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
    },
    leetCode: {
      rating: 2185,
      rank: "Guardian (Top 0.8%)",
      solved: 642,
      easy: 210,
      medium: 340,
      hard: 92
    },
    scores: {
      portfolioScore: 94,
      resumeStrength: 96,
      atsScore: 92,
      codeQualityScore: 98
    },
    skills: [
      { name: "Python / PyTorch", level: 95 },
      { name: "TypeScript / React", level: 92 },
      { name: "System Architecture", level: 88 },
      { name: "C++ / CUDA", level: 82 },
      { name: "Agent Frameworks", level: 96 }
    ],
    verifiedCertificates: [
      { name: "Stanford Deep Learning Specialization", issuer: "Coursera & Stanford", date: "June 2026", badge: "Gold Verified" },
      { name: "AWS Certified Solutions Architect - Professional", issuer: "Amazon Web Services", date: "May 2026", badge: "Active" },
      { name: "Google Cloud ML Engineer Professional", issuer: "Google Cloud", date: "April 2026", badge: "Active" }
    ]
  },

  coursesData: [
    {
      id: "course-1",
      title: "Advanced Large Language Model Engineering & Agents",
      instructor: "Dr. Andrew Ng & DeepLearning.AI",
      progress: 78,
      totalModules: 12,
      completedModules: 9,
      icon: "fa-brain",
      color: "#3B82F6",
      category: "Artificial Intelligence"
    },
    {
      id: "course-2",
      title: "Full-Stack Enterprise React & Next.js 15 Masterclass",
      instructor: "Vercel Engineering Team",
      progress: 92,
      totalModules: 10,
      completedModules: 9,
      icon: "fa-code",
      color: "#A855F7",
      category: "Web Development"
    },
    {
      id: "course-3",
      title: "High-Throughput Distributed System Design",
      instructor: "MIT OpenCourseWare",
      progress: 45,
      totalModules: 16,
      completedModules: 7,
      icon: "fa-network-wired",
      color: "#06B6D4",
      category: "Systems"
    },
    {
      id: "course-4",
      title: "Cloud Native Kubernetes & Microservices Architecture",
      instructor: "CNCF Foundation",
      progress: 60,
      totalModules: 8,
      completedModules: 5,
      icon: "fa-cloud",
      color: "#10B981",
      category: "Cloud"
    }
  ],

  hackathonsData: [
    {
      id: "hack-1",
      title: "Global AI & Autonomous Agents World Cup",
      organizer: "Devpost & OpenAI",
      prizePool: "$250,000",
      deadline: "2026-08-15T23:59:59",
      participants: 4890,
      location: "Worldwide Virtual",
      isOnline: true,
      tags: ["AI Agents", "LLMs", "Hackathon"],
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: "hack-2",
      title: "Stanford TreeHacks 2026",
      organizer: "Stanford University",
      prizePool: "$100,000",
      deadline: "2026-08-01T18:00:00",
      participants: 1850,
      location: "Palo Alto, CA",
      isOnline: false,
      tags: ["Student", "Hardware", "BioTech"],
      color: "from-purple-500 to-pink-600"
    },
    {
      id: "hack-3",
      title: "ETH Global Web3 & AI Hackathon",
      organizer: "Ethereum Foundation",
      prizePool: "$175,000",
      deadline: "2026-08-20T12:00:00",
      participants: 3120,
      location: "San Francisco / Virtual",
      isOnline: true,
      tags: ["Web3", "Zero Knowledge", "AI"],
      color: "from-cyan-500 to-emerald-600"
    }
  ],

  internshipsData: [
    {
      id: "int-1",
      company: "Google",
      role: "Software Engineering Intern - AI Infrastructure",
      salary: "$68 / hour + housing",
      location: "Sunnyvale, CA",
      isRemote: true,
      aiMatch: 96,
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
      deadline: "Aug 10"
    },
    {
      id: "int-2",
      company: "Microsoft",
      role: "Quantum Computing & Algorithms Intern",
      salary: "$65 / hour",
      location: "Redmond, WA",
      isRemote: false,
      aiMatch: 92,
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      deadline: "Aug 14"
    },
    {
      id: "int-3",
      company: "OpenAI",
      role: "Research Engineer Intern - Multi-Modal Reasoning",
      salary: "$85 / hour + equity grant",
      location: "San Francisco, CA",
      isRemote: true,
      aiMatch: 98,
      logo: "https://cdn-icons-png.flaticon.com/512/12222/12222588.png",
      deadline: "Aug 05"
    },
    {
      id: "int-4",
      company: "Tesla",
      role: "Full Self-Driving (FSD) Vision Engineer Intern",
      salary: "$60 / hour",
      location: "Palo Alto, CA",
      isRemote: false,
      aiMatch: 88,
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
      deadline: "Aug 18"
    },
    {
      id: "int-5",
      company: "NVIDIA",
      role: "CUDA & Parallel Systems Performance Intern",
      salary: "$70 / hour",
      location: "Santa Clara, CA",
      isRemote: true,
      aiMatch: 94,
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg",
      deadline: "Aug 12"
    }
  ],

  liveEvents: [
    {
      id: "live-1",
      title: "🔴 Live Coding: Building an Autonomous Dev Agent from Scratch",
      host: "Alex Rivera & OpenDev Community",
      viewers: 1420,
      category: "Live Stream",
      isLive: true
    },
    {
      id: "live-2",
      title: "🔴 Demystifying Stanford CS224N: Natural Language Processing",
      host: "Prof. Christopher Manning",
      viewers: 3890,
      category: "Lecture Stream",
      isLive: true
    },
    {
      id: "live-3",
      title: "🔴 Startup Pitch Night: Top 10 Student AI Startups",
      host: "YC Alumni & Founders",
      viewers: 2150,
      category: "Pitch Battle",
      isLive: true
    }
  ],

  communitiesData: [
    { id: "c-1", name: "AI & Neural Networks", members: "148,200", icon: "fa-brain", unread: 12, color: "#3B82F6" },
    { id: "c-2", name: "Data Science & Big Data", members: "94,500", icon: "fa-database", unread: 5, color: "#8B5CF6" },
    { id: "c-3", name: "Open Source Builders", members: "112,000", icon: "fa-code-branch", unread: 18, color: "#10B981" },
    { id: "c-4", name: "Modern Web Dev (React/Next)", members: "210,000", icon: "fa-globe", unread: 0, color: "#06B6D4" },
    { id: "c-5", name: "Competitive Programming", members: "76,400", icon: "fa-terminal", unread: 8, color: "#F59E0B" },
    { id: "c-6", name: "Cloud Native & DevOps", members: "68,100", icon: "fa-cloud", unread: 2, color: "#EC4899" },
    { id: "c-7", name: "Cybersecurity & Hacking", members: "84,300", icon: "fa-shield-halved", unread: 14, color: "#EF4444" },
    { id: "c-8", name: "Robotics & Autonomous Systems", members: "45,900", icon: "fa-robot", unread: 4, color: "#6366F1" }
  ],

  trendingCompanies: [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg", hiring: "142 Positions", badge: "Top Employer" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", hiring: "98 Positions", badge: "Hiring Interns" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", hiring: "85 Positions", badge: "Active" },
    { name: "OpenAI", logo: "https://cdn-icons-png.flaticon.com/512/12222/12222588.png", hiring: "45 Positions", badge: "Unicorn" },
    { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg", hiring: "110 Positions", badge: "Top Tech" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", hiring: "210 Positions", badge: "Hiring Now" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", hiring: "75 Positions", badge: "Hardware & AI" },
    { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png", hiring: "62 Positions", badge: "Autopilot AI" }
  ],

  notifications: [
    { id: 1, title: "Google AI Internship Application Opened", text: "Your profile matches 95%! Apply early for top priority.", time: "10 min ago", icon: "fa-briefcase", unread: true },
    { id: 2, title: "HackMIT 2026 Registration Reminder", text: "Only 3 days left before early registration closes.", time: "45 min ago", icon: "fa-trophy", unread: true },
    { id: 3, title: "AI Coach Resume Verification Passed", text: "Your resume score is now 96/100 (ATS ready).", time: "2 hours ago", icon: "fa-robot", unread: false },
    { id: 4, title: "New Connection Request", text: "Dr. Elena Vance (DeepMind Senior Scientist) wants to connect.", time: "5 hours ago", icon: "fa-user-plus", unread: false }
  ]
};
