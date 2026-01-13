import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import VisionHeader from '@/components/vision/VisionHeader';
import VisionHero from '@/components/vision/VisionHero';
import ProgressDashboard from '@/components/vision/ProgressDashboard';
import GoalsSection from '@/components/vision/GoalsSection';
import ClientsGrid from '@/components/vision/ClientsGrid';
import ServicesCards from '@/components/vision/ServicesCards';
import QuarterlyRoadmap from '@/components/vision/QuarterlyRoadmap';
import WeeklyRhythm from '@/components/vision/WeeklyRhythm';
import DecisionCards from '@/components/vision/DecisionCards';
import Accomplishments from '@/components/vision/Accomplishments';
import WeeklyReflections from '@/components/vision/WeeklyReflections';
import PipelineOverview from '@/components/vision/PipelineOverview';
import OngoingProjectsList from '@/components/vision/OngoingProjectsList';
import CalendarView from '@/components/vision/CalendarView';
import CostTracker from '@/components/vision/CostTracker';
import LearningDevelopment from '@/components/vision/LearningDevelopment';
import DailyReminder from '@/components/vision/DailyReminder';

export default function VisionBoard() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: progressData, isLoading } = useQuery({
    queryKey: ['visionProgress'],
    queryFn: async () => {
      const results = await base44.entities.VisionProgress.list();
      return results[0] || null;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <VisionHeader />
      
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 -left-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 pt-16">
        <div id="hero"><VisionHero progressData={progressData} /></div>
        <div id="progress"><ProgressDashboard progressData={progressData} isLoading={isLoading} /></div>
        <div id="goals"><GoalsSection /></div>
        <div id="accomplishments"><Accomplishments progressData={progressData} /></div>
        <div id="clients"><ClientsGrid /></div>
        <div id="services"><ServicesCards /></div>
        <div id="quarterly"><QuarterlyRoadmap progressData={progressData} /></div>
        <div id="pipeline"><PipelineOverview /></div>
        <div id="projects"><OngoingProjectsList /></div>
        <div id="calendar"><CalendarView /></div>
        <div id="costs"><CostTracker /></div>
        <div id="learning"><LearningDevelopment /></div>
        <div id="weekly"><WeeklyRhythm /></div>
        <div id="reflections"><WeeklyReflections progressData={progressData} /></div>
        <div id="decisions"><DecisionCards /></div>
        <div id="reminder"><DailyReminder /></div>
      </div>
    </div>
  );
}