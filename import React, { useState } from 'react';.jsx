import React, { useState } from 'react';
import { Sparkles, Copy, Check, Sun, Moon, Zap, Star, TrendingUp, Brain, Code, FileText, Search, Briefcase, BookOpen, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

const AIPromptGenerator = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [userTask, setUserTask] = useState('');
  const [taskType, setTaskType] = useState('auto');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [mode, setMode] = useState('generate'); // 'generate' or 'improve'
  const [results, setResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // AI Tool Database
  const aiTools = {
    chatgpt: {
      name: 'ChatGPT',
      icon: '🤖',
      strengths: ['Conversational', 'Creative Writing', 'General Knowledge', 'Code Explanation'],
      bestFor: ['Quick answers', 'Brainstorming', 'Tutoring', 'Content creation']
    },
    claude: {
      name: 'Claude',
      icon: '🧠',
      strengths: ['Long Context', 'Analysis', 'Code Generation', 'Research'],
      bestFor: ['Deep analysis', 'Complex coding', 'Document processing', 'Structured thinking']
    },
    gemini: {
      name: 'Gemini',
      icon: '✨',
      strengths: ['Multimodal', 'Research', 'Real-time Info', 'Integration'],
      bestFor: ['Current events', 'Multimodal tasks', 'Google workspace', 'Factual research']
    },
    imageai: {
      name: 'Image AI',
      icon: '🎨',
      strengths: ['Visual Creation', 'Art Styles', 'Consistency', 'Iteration'],
      bestFor: ['DALL·E, Midjourney, Stable Diffusion based on needs']
    }
  };

  // Task Analysis Engine
  const analyzeTask = (task, type) => {
    const taskLower = task.toLowerCase();
    const keywords = {
      coding: ['code', 'program', 'function', 'debug', 'api', 'algorithm', 'script', 'develop'],
      image: ['image', 'picture', 'visual', 'design', 'logo', 'illustration', 'art', 'generate picture'],
      writing: ['write', 'essay', 'article', 'blog', 'content', 'story', 'email', 'copy'],
      research: ['research', 'analyze', 'study', 'compare', 'investigate', 'summarize', 'explain'],
      business: ['business', 'strategy', 'marketing', 'plan', 'proposal', 'presentation'],
      study: ['learn', 'teach', 'tutor', 'explain', 'understand', 'study', 'homework']
    };

    let detectedType = type !== 'auto' ? type : 'general';
    let maxScore = 0;

    if (type === 'auto') {
      for (const [category, words] of Object.entries(keywords)) {
        const score = words.filter(word => taskLower.includes(word)).length;
        if (score > maxScore) {
          maxScore = score;
          detectedType = category;
        }
      }
    }

    return detectedType;
  };

  // AI Tool Scoring Engine
  const scoreAITools = (taskType, task) => {
    const scores = {
      coding: { claude: 95, chatgpt: 85, gemini: 80, imageai: 0 },
      image: { imageai: 100, claude: 0, chatgpt: 0, gemini: 0 },
      writing: { chatgpt: 90, claude: 95, gemini: 85, imageai: 0 },
      research: { claude: 95, gemini: 90, chatgpt: 80, imageai: 0 },
      business: { claude: 90, chatgpt: 88, gemini: 85, imageai: 0 },
      study: { chatgpt: 92, claude: 88, gemini: 85, imageai: 0 },
      general: { claude: 90, chatgpt: 88, gemini: 85, imageai: 0 }
    };

    return scores[taskType] || scores.general;
  };

  // Prompt Quality Scorer
  const calculatePromptQuality = (prompt) => {
    let score = 0;
    
    // Clarity (30 points)
    if (prompt.includes('You are') || prompt.includes('Act as')) score += 15;
    if (prompt.length > 100) score += 15;
    
    // Structure (25 points)
    if (prompt.includes('Requirements:') || prompt.includes('Context:')) score += 10;
    if (prompt.includes('Output format:') || prompt.includes('Format:')) score += 15;
    
    // Completeness (25 points)
    const sections = ['role', 'task', 'constraint', 'output', 'tone'];
    const foundSections = sections.filter(s => 
      prompt.toLowerCase().includes(s) || 
      (s === 'role' && prompt.includes('You are'))
    ).length;
    score += foundSections * 5;
    
    // Tool Compatibility (20 points)
    if (prompt.includes('step by step') || prompt.includes('think')) score += 10;
    if (prompt.length > 200) score += 10;
    
    return Math.min(score, 100);
  };

  // Prompt Generator for Each AI
  const generatePrompts = (task, taskType, skill) => {
    const roleMap = {
      coding: 'expert software engineer and architect',
      image: 'professional creative director and visual artist',
      writing: 'professional writer and content strategist',
      research: 'senior research analyst and domain expert',
      business: 'business strategy consultant and analyst',
      study: 'patient and knowledgeable tutor',
      general: 'helpful and knowledgeable assistant'
    };

    const role = roleMap[taskType];
    const skillContext = {
      beginner: 'Explain concepts simply with examples. Avoid jargon.',
      intermediate: 'Provide detailed explanations with best practices.',
      expert: 'Focus on advanced techniques, optimizations, and edge cases.'
    };

    const prompts = {};

    // Claude Prompt (Structured & Detailed)
    prompts.claude = `You are a ${role}.

Task: ${task}

Context:
- User skill level: ${skill}
- ${skillContext[skill]}

Requirements:
1. Provide a comprehensive and well-structured response
2. Use clear reasoning and step-by-step explanations
3. Include relevant examples or code snippets
4. Highlight best practices and potential pitfalls
5. Consider edge cases and alternative approaches

Output format:
- Start with a brief overview
- Break down the solution into logical sections
- Use markdown formatting for clarity
- End with a summary or next steps

Constraints:
- Be precise and accurate
- Avoid unnecessary complexity
- Focus on practical, actionable advice

Please provide your response now.`;

    // ChatGPT Prompt (Conversational & Creative)
    prompts.chatgpt = `You are a ${role} helping with the following task.

Task: ${task}

Please help me by:
1. Understanding my needs clearly
2. Providing a ${skill}-friendly explanation
3. ${skillContext[skill]}
4. Including practical examples
5. Suggesting next steps or improvements

Keep your response conversational, clear, and actionable. Use a friendly tone while maintaining professionalism.`;

    // Gemini Prompt (Research-Oriented & Factual)
    prompts.gemini = `Act as a ${role}.

Primary Task: ${task}

Approach:
- Analyze the task from multiple angles
- Provide factual, well-researched information
- Include current best practices and trends
- Consider the ${skill} skill level: ${skillContext[skill]}

Deliverables:
• Clear problem analysis
• Step-by-step solution or explanation
• References to authoritative sources (if applicable)
• Practical implementation advice

Format your response with clear headings and bullet points for easy readability.`;

    // Image AI Prompt (for visual tasks)
    if (taskType === 'image') {
      prompts.imageai = `${task}

Style and quality specifications:
- High quality, professional output
- Detailed rendering
- Appropriate color palette and composition
- Consider lighting, perspective, and mood

Technical settings:
- Resolution: High (1024x1024 or better)
- Style: ${skill === 'expert' ? 'Highly detailed, professional grade' : 'Clear and polished'}
- Negative prompt: blurry, low quality, distorted, amateur

Additional guidance: Focus on clarity, composition, and professional aesthetic.`;
    }

    return prompts;
  };

  // Main Generation Handler
  const handleGenerate = () => {
    if (!userTask.trim()) {
      alert('Please enter a task description');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const detectedType = analyzeTask(userTask, taskType);
      const toolScores = scoreAITools(detectedType, userTask);
      const generatedPrompts = generatePrompts(userTask, detectedType, skillLevel);

      // Calculate quality scores
      const promptsWithScores = Object.entries(generatedPrompts).map(([tool, prompt]) => ({
        tool,
        prompt,
        qualityScore: calculatePromptQuality(prompt),
        toolScore: toolScores[tool] || 0
      }));

      // Find best AI tool
      const bestTool = Object.entries(toolScores)
        .filter(([_, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])[0];

      // Get best prompt
      const bestPrompt = promptsWithScores
        .filter(p => p.toolScore > 0)
        .sort((a, b) => (b.qualityScore + b.toolScore) - (a.qualityScore + a.toolScore))[0];

      setResults({
        taskType: detectedType,
        toolScores,
        prompts: promptsWithScores,
        bestTool: bestTool[0],
        bestPrompt: bestPrompt,
        recommendation: generateRecommendation(bestTool[0], detectedType, userTask)
      });

      setIsGenerating(false);
    }, 1500);
  };

  // Improve Existing Prompt
  const handleImprovePrompt = () => {
    if (!userTask.trim()) {
      alert('Please paste a prompt to improve');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const improvements = [];
      const original = userTask;
      let improved = original;

      // Add role definition
      if (!original.toLowerCase().includes('you are') && !original.toLowerCase().includes('act as')) {
        improved = `You are an expert assistant specializing in this task.\n\n${improved}`;
        improvements.push('Added clear role definition');
      }

      // Add structure
      if (!original.includes('Requirements:') && !original.includes('Context:')) {
        const lines = improved.split('\n');
        improved = `${lines[0]}\n\nRequirements:\n${lines.slice(1).join('\n')}`;
        improvements.push('Added structured sections');
      }

      // Add output format
      if (!original.toLowerCase().includes('output') && !original.toLowerCase().includes('format')) {
        improved += `\n\nOutput format:\n- Provide a clear, well-structured response\n- Use examples where helpful\n- Keep explanations concise yet complete`;
        improvements.push('Specified output format');
      }

      // Add constraints
      if (!original.toLowerCase().includes('constraint') && original.length < 150) {
        improved += `\n\nConstraints:\n- Be accurate and precise\n- Focus on practical, actionable advice`;
        improvements.push('Added quality constraints');
      }

      const originalScore = calculatePromptQuality(original);
      const improvedScore = calculatePromptQuality(improved);

      setResults({
        mode: 'improve',
        original,
        improved,
        originalScore,
        improvedScore,
        improvements
      });

      setIsGenerating(false);
    }, 1000);
  };

  // Generate Recommendation Text
  const generateRecommendation = (tool, taskType, task) => {
    const reasons = {
      claude: 'Claude excels at detailed analysis, structured thinking, and handling complex tasks with long context. Perfect for this type of work.',
      chatgpt: 'ChatGPT offers the best conversational experience and creative problem-solving for this task.',
      gemini: 'Gemini provides excellent research capabilities and multimodal understanding for comprehensive results.',
      imageai: 'Image AI tools (DALL·E, Midjourney, Stable Diffusion) are specifically designed for visual content generation.'
    };

    return reasons[tool] || reasons.claude;
  };

  // Copy to Clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Get task type icon
  const getTaskIcon = (type) => {
    const icons = {
      coding: <Code className="w-5 h-5" />,
      image: <span className="text-xl">🎨</span>,
      writing: <FileText className="w-5 h-5" />,
      research: <Search className="w-5 h-5" />,
      business: <Briefcase className="w-5 h-5" />,
      study: <BookOpen className="w-5 h-5" />,
      general: <Brain className="w-5 h-5" />
    };
    return icons[type] || icons.general;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Sparkles className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  PromptGenius
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI Router + Prompt Engineer
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mode Switcher */}
              <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <button
                  onClick={() => setMode('generate')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'generate'
                      ? darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                      : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Zap className="w-4 h-4 inline mr-1" />
                  Generate
                </button>
                <button
                  onClick={() => setMode('improve')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'improve'
                      ? darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                      : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Improve
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition-opacity`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {mode === 'generate' ? 'Generate Perfect AI Prompts' : 'Improve Your Prompts'}
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            {mode === 'generate' 
              ? 'Describe your task, and we\'ll analyze it, recommend the best AI tool, and generate optimized prompts.'
              : 'Paste any prompt, and we\'ll enhance it with better structure, clarity, and effectiveness.'}
          </p>
        </div>

        {/* Input Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-8`}>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {mode === 'generate' ? 'Describe Your Task' : 'Paste Your Prompt'}
          </label>
          <textarea
            value={userTask}
            onChange={(e) => setUserTask(e.target.value)}
            placeholder={mode === 'generate' 
              ? "Example: Create a Python function that processes CSV files and generates visualizations..."
              : "Paste your existing prompt here to improve it..."}
            className={`w-full h-40 px-4 py-3 rounded-lg ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'
            } border focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
          />

          {mode === 'generate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Task Type
                </label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="auto">Auto-Detect</option>
                  <option value="coding">Coding</option>
                  <option value="image">Image Generation</option>
                  <option value="writing">Writing</option>
                  <option value="research">Research</option>
                  <option value="business">Business</option>
                  <option value="study">Study/Learning</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Skill Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={mode === 'generate' ? handleGenerate : handleImprovePrompt}
            disabled={isGenerating}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{mode === 'generate' ? 'Generate Smart Prompts' : 'Improve Prompt'}</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {results && mode === 'generate' && (
          <div className="space-y-8">
            {/* Task Analysis */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
              <div className="flex items-center space-x-3 mb-6">
                {getTaskIcon(results.taskType)}
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Task Analysis
                </h3>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg p-4 mb-6`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Detected task type: <span className="font-semibold capitalize">{results.taskType}</span>
                </p>
              </div>

              <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Tool Compatibility
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.toolScores && Object.entries(results.toolScores)
                  .filter(([_, score]) => score > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([tool, score]) => (
                    <div key={tool} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{aiTools[tool].icon}</span>
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {aiTools[tool].name}
                          </span>
                        </div>
                        <span className={`text-lg font-bold ${score >= 90 ? 'text-green-500' : score >= 80 ? 'text-yellow-500' : 'text-orange-500'}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                        <div
                          className={`h-2 rounded-full ${score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Best for: {aiTools[tool].bestFor.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Generated Prompts */}
            <div>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Optimized Prompts
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {results.prompts && results.prompts
                  .filter(p => p.toolScore > 0)
                  .sort((a, b) => b.qualityScore - a.qualityScore)
                  .map((item, index) => (
                    <div
                      key={item.tool}
                      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 ${
                        item.tool === results.bestTool ? 'ring-2 ring-purple-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{aiTools[item.tool].icon}</span>
                          <div>
                            <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {aiTools[item.tool].name}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                {skillLevel}
                              </span>
                              {item.tool === results.bestTool && (
                                <span className="text-xs px-2 py-1 rounded bg-purple-500 text-white flex items-center">
                                  <Star className="w-3 h-3 mr-1" />
                                  Best Match
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.qualityScore}
                            </span>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>/100</span>
                          </div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Quality Score
                          </p>
                        </div>
                      </div>

                      <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4 mb-4 relative`}>
                        <pre className={`text-sm whitespace-pre-wrap font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.prompt}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(item.prompt, index)}
                          className={`absolute top-4 right-4 p-2 rounded-lg ${
                            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                          } transition-colors`}
                        >
                          {copiedIndex === index ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            <TrendingUp className="w-4 h-4 inline mr-1" />
                            Tool Score: {item.toolScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Final Recommendation */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-100 to-pink-100'} rounded-2xl shadow-xl p-8`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-yellow-500 rounded-full p-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Final Recommendation
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    🏆 Best AI Tool
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{results.bestTool && aiTools[results.bestTool] ? aiTools[results.bestTool].icon : '🤖'}</span>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {results.bestTool && aiTools[results.bestTool] ? aiTools[results.bestTool].name : 'AI Tool'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    🧠 Prompt Quality
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {results.bestPrompt ? results.bestPrompt.qualityScore : 0}/100
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                      Excellent
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-50'} rounded-lg p-4 mb-4`}>
                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  ✅ Why This Recommendation?
                </p>
                <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {results.recommendation || 'Based on task analysis and AI capabilities.'}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <AlertCircle className={`w-4 h-4 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`} />
                <p className={darkMode ? 'text-purple-300' : 'text-purple-700'}>
                  This recommendation is based on task analysis, AI capabilities, and prompt quality scoring.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Improve Mode Results */}
        {results && mode === 'improve' && (
          <div className="space-y-8">
            {/* Score Comparison */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quality Improvement
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={`${darkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'} rounded-lg p-6`}>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    ❌ Original Score
                  </p>
                  <div className="text-4xl font-bold text-red-500 mb-2">
                    {results.originalScore}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{ width: `${results.originalScore}%` }}
                    />
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'} rounded-lg p-6`}>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                    ✅ Improved Score
                  </p>
                  <div className="text-4xl font-bold text-green-500 mb-2">
                    {results.improvedScore}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${results.improvedScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} rounded-lg p-4`}>
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  🧠 Improvements Made:
                </p>
                <ul className="space-y-2">
                  {results.improvements && results.improvements.map((improvement, index) => (
                    <li key={index} className={`flex items-center space-x-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                      <ChevronRight className="w-4 h-4" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Before & After */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
                <h4 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-red-500">❌</span>
                  <span>Original Prompt</span>
                </h4>
                <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4 relative`}>
                  <pre className={`text-sm whitespace-pre-wrap font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {results.original}
                  </pre>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
                <h4 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-green-500">✅</span>
                  <span>Improved Prompt</span>
                </h4>
                <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4 relative`}>
                  <pre className={`text-sm whitespace-pre-wrap font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {results.improved}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(results.improved, 'improved')}
                    className={`absolute top-4 right-4 p-2 rounded-lg ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                    } transition-colors`}
                  >
                    {copiedIndex === 'improved' ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Built with intelligence and precision • PromptGenius 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIPromptGenerator;