// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Deployment Version: 4.0.0 (OpenRouter Architecture)
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const body = await req.json();

    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ insights: "AI Insights currently unavailable. Please configure OPENROUTER_API_KEY." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const examName = body.examName || 'ENTRANCE';
    let prompt = "";

    if (body.stats && body.subjectStats) {
      const { stats, subjectStats, topicStats } = body;

      // Extract top 3 weakest topics across all subjects
      const allTopics = [];
      Object.entries(topicStats || {}).forEach(([subject, topics]: [string, any]) => {
        if (Array.isArray(topics)) {
          topics.forEach(t => allTopics.push({ ...t, subject }));
        }
      });

      const weakTopics = allTopics
        .filter(t => t.solved >= 3 && t.accuracy < 65)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 3);

      const strongSubjects = subjectStats.filter((s: any) => s.accuracy >= 75).map((s: any) => s.subject);
      const weakSubjects = subjectStats.filter((s: any) => s.accuracy < 60 && s.solved > 0).map((s: any) => s.subject);

      prompt = `
        User is preparing for ${examName}.
        Current Overall Stats: ${stats.accuracy}% Accuracy over ${stats.totalQuestions} questions.
        
        Subject Performance:
        - Strong (>=75%): ${strongSubjects.join(', ') || 'None yet'}
        - Needs Work (<60%): ${weakSubjects.join(', ') || 'None yet'}
        
        Most Critical Topic Gaps (Accuracy < 65%):
        ${weakTopics.map(t => `- ${t.topic} in ${t.subject} (${t.accuracy}% accuracy)`).join('\n') || 'Not enough granular data yet.'}
        
        Provide a highly structured, professional study plan in 4 short sections:
        1. 🚀 **Strategic Overview**: 2 sentences on overall pace and readiness.
        2. 🎯 **Priority Focus**: Mention the specific topics that need immediate attention.
        3. 📋 **Strategic Guidance**: Include advice on Target Mastery (70%+ goal), Weekly Mock Exam importance, and time-split between weak/strong areas.
        4. 📅 **Action Plan**: 2 specific, actionable daily habits to improve.
        
        Keep the total length under 180 words. Use Markdown for bolding. Use a motivating, data-driven tone.
      `;
    } else {
      const { subject, score, avgTimePerQuestion } = body;
      prompt = `Analyze this ${examName} Session: Subject: ${subject}, Score: ${score}%, Avg Time: ${Math.round(avgTimePerQuestion)}s/q. Give a 2-sentence professional summary and 1 'golden rule' for improvement.`;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-preview:free",
        messages: [
          {
            role: "system",
            content: "You are an elite academic coach for medical and competitive entrance exams. Your advice is precise, data-backed, and highly structured. You speak with authority and motivation."
          },
          { role: "user", content: prompt }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter Error:", errorData);
      throw new Error(errorData.error?.message || `OpenRouter returned ${response.status}`);
    }

    const data = await response.json();
    const insights = data.choices?.[0]?.message?.content || "No insights generated.";
    return new Response(JSON.stringify({ insights }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error("Insights Function Error:", error);
    return new Response(JSON.stringify({
      error: error.message,
      insights: `⚠️ Connection Issue: ${error.message?.includes('OPENROUTER_API_KEY') ? 'AI key missing' : 'The AI is currently busy.'} Please try again in a moment.`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
