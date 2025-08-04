const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AIService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/ai`;
  }

  // Get auth headers
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Extract skills from text (resume, bio, job description)
  async extractSkills(text, type = 'general') {
    try {
      const response = await fetch(`${this.baseURL}/extract-skills`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ text, type })
      });

      if (!response.ok) {
        throw new Error('Failed to extract skills');
      }

      return await response.json();
    } catch (error) {
      console.error('Skill extraction error:', error);
      throw error;
    }
  }

  // Get job recommendations for a user
  async getJobRecommendations(userId, limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/job-recommendations/${userId}?limit=${limit}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get job recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Job recommendations error:', error);
      throw error;
    }
  }

  // Get candidate recommendations for a job
  async getCandidateRecommendations(jobId, limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/candidate-recommendations/${jobId}?limit=${limit}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get candidate recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Candidate recommendations error:', error);
      throw error;
    }
  }

  // Calculate match score between user and job
  async calculateMatchScore(userId, jobId) {
    try {
      const response = await fetch(`${this.baseURL}/match-score`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ userId, jobId })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate match score');
      }

      return await response.json();
    } catch (error) {
      console.error('Match score calculation error:', error);
      throw error;
    }
  }

  // Get personalized content recommendations
  async getContentRecommendations(userId, type = 'posts', limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/content-recommendations/${userId}?type=${type}&limit=${limit}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get content recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Content recommendations error:', error);
      throw error;
    }
  }

  // Get network suggestions
  async getNetworkSuggestions(userId, limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/network-suggestions/${userId}?limit=${limit}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get network suggestions');
      }

      return await response.json();
    } catch (error) {
      console.error('Network suggestions error:', error);
      throw error;
    }
  }

  // Get skill development recommendations
  async getSkillRecommendations(userId, limit = 5) {
    try {
      const response = await fetch(`${this.baseURL}/skill-recommendations/${userId}?limit=${limit}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get skill recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Skill recommendations error:', error);
      throw error;
    }
  }

  // Get career path suggestions
  async getCareerPathSuggestions(userId) {
    try {
      const response = await fetch(`${this.baseURL}/career-path/${userId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get career path suggestions');
      }

      return await response.json();
    } catch (error) {
      console.error('Career path suggestions error:', error);
      throw error;
    }
  }

  // Get market insights
  async getMarketInsights(industry = 'all') {
    try {
      const response = await fetch(`${this.baseURL}/market-insights?industry=${industry}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get market insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Market insights error:', error);
      throw error;
    }
  }

  // Get salary insights
  async getSalaryInsights(jobTitle, location) {
    try {
      const response = await fetch(`${this.baseURL}/salary-insights`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ jobTitle, location })
      });

      if (!response.ok) {
        throw new Error('Failed to get salary insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Salary insights error:', error);
      throw error;
    }
  }

  // Get interview preparation suggestions
  async getInterviewPrep(jobTitle, company) {
    try {
      const response = await fetch(`${this.baseURL}/interview-prep`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ jobTitle, company })
      });

      if (!response.ok) {
        throw new Error('Failed to get interview preparation');
      }

      return await response.json();
    } catch (error) {
      console.error('Interview prep error:', error);
      throw error;
    }
  }

  // Get resume optimization suggestions
  async getResumeOptimization(resumeText, jobDescription) {
    try {
      const response = await fetch(`${this.baseURL}/resume-optimization`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (!response.ok) {
        throw new Error('Failed to get resume optimization');
      }

      return await response.json();
    } catch (error) {
      console.error('Resume optimization error:', error);
      throw error;
    }
  }

  // Get company culture insights
  async getCompanyInsights(companyName) {
    try {
      const response = await fetch(`${this.baseURL}/company-insights`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ companyName })
      });

      if (!response.ok) {
        throw new Error('Failed to get company insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Company insights error:', error);
      throw error;
    }
  }

  // Get learning recommendations
  async getLearningRecommendations(userId, skillGaps) {
    try {
      const response = await fetch(`${this.baseURL}/learning-recommendations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ userId, skillGaps })
      });

      if (!response.ok) {
        throw new Error('Failed to get learning recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Learning recommendations error:', error);
      throw error;
    }
  }

  // Get productivity insights
  async getProductivityInsights(userId) {
    try {
      const response = await fetch(`${this.baseURL}/productivity-insights/${userId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get productivity insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Productivity insights error:', error);
      throw error;
    }
  }

  // Get trend analysis
  async getTrendAnalysis(industry, timeframe = '30d') {
    try {
      const response = await fetch(`${this.baseURL}/trend-analysis?industry=${industry}&timeframe=${timeframe}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get trend analysis');
      }

      return await response.json();
    } catch (error) {
      console.error('Trend analysis error:', error);
      throw error;
    }
  }

  // Get personalized insights
  async getPersonalizedInsights(userId) {
    try {
      const response = await fetch(`${this.baseURL}/personalized-insights/${userId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get personalized insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Personalized insights error:', error);
      throw error;
    }
  }
}

export default new AIService(); 