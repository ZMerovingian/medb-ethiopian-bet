
// Sports API service for integrating with free sports data APIs
// This file provides a foundation for connecting to real sports APIs

interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

// Configuration for different free sports APIs
const API_CONFIGS = {
  // API-Football (free tier available)
  apiFootball: {
    baseUrl: 'https://v3.football.api-sports.io',
    headers: {
      'X-RapidAPI-Host': 'v3.football.api-sports.io',
      // Add your API key here when ready: 'X-RapidAPI-Key': 'your-api-key'
    }
  },
  
  // TheSportsDB (completely free)
  sportsDb: {
    baseUrl: 'https://www.thesportsdb.com/api/v1/json/3',
    headers: {}
  },
  
  // ESPN API (free public endpoints)
  espn: {
    baseUrl: 'https://site.api.espn.com/apis/site/v2/sports/soccer',
    headers: {}
  }
};

export interface LiveMatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  league: string;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  minute?: number;
  youtubeStream?: string;
}

class SportsApiService {
  private async fetchFromApi(config: ApiConfig, endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}${endpoint}`, {
        headers: config.headers || {}
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Sports API request failed:', error);
      throw error;
    }
  }

  // Get live matches from TheSportsDB (free)
  async getLiveMatches(): Promise<LiveMatchData[]> {
    try {
      // For now, return mock data
      // To implement real API calls, uncomment and modify the code below:
      
      /*
      const response = await this.fetchFromApi(
        API_CONFIGS.sportsDb,
        '/latestsoccer.php'
      );
      
      return response.events?.map((event: any) => ({
        id: event.idEvent,
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        homeScore: parseInt(event.intHomeScore || '0'),
        awayScore: parseInt(event.intAwayScore || '0'),
        league: event.strLeague,
        status: event.strStatus === 'Match Finished' ? 'finished' : 'live',
        time: event.strTime,
        youtubeStream: this.findYouTubeStream(event.strLeague, event.strHomeTeam, event.strAwayTeam)
      })) || [];
      */
      
      // Mock data for demonstration
      return [
        {
          id: '1',
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          homeScore: 2,
          awayScore: 1,
          league: 'Premier League',
          status: 'live',
          time: '78\'',
          minute: 78,
          youtubeStream: 'dQw4w9WgXcQ'
        },
        {
          id: '2',
          homeTeam: 'Saint George',
          awayTeam: 'Ethiopia Bunna',
          homeScore: 1,
          awayScore: 0,
          league: 'Ethiopian Premier League',
          status: 'live',
          time: '45\'',
          minute: 45,
          youtubeStream: 'dQw4w9WgXcQ'
        }
      ];
    } catch (error) {
      console.error('Failed to fetch live matches:', error);
      return [];
    }
  }

  // Get upcoming fixtures
  async getUpcomingMatches(): Promise<LiveMatchData[]> {
    try {
      // Mock data - replace with real API call
      return [
        {
          id: '3',
          homeTeam: 'Barcelona',
          awayTeam: 'Real Madrid',
          homeScore: 0,
          awayScore: 0,
          league: 'La Liga',
          status: 'upcoming',
          time: '18:00',
          youtubeStream: 'dQw4w9WgXcQ'
        }
      ];
    } catch (error) {
      console.error('Failed to fetch upcoming matches:', error);
      return [];
    }
  }

  // Find official YouTube streams for matches
  private findYouTubeStream(league: string, homeTeam: string, awayTeam: string): string | undefined {
    // This would implement logic to find official YouTube streams
    // Many sports leagues have official YouTube channels with live streams
    
    const officialChannels: Record<string, string> = {
      'Ethiopian Premier League': 'EthiopianFootballChannel', // Example
      'Premier League': 'PremierLeague',
      'La Liga': 'LaLiga',
      'Bundesliga': 'Bundesliga'
    };

    // In a real implementation, you would:
    // 1. Check if the league has official YouTube streams
    // 2. Search for live streams on official channels
    // 3. Return the video ID if found
    
    return 'dQw4w9WgXcQ'; // Placeholder
  }

  // Get match statistics
  async getMatchStats(matchId: string): Promise<any> {
    try {
      // This would fetch detailed match statistics
      return {
        possession: { home: 55, away: 45 },
        shots: { home: 12, away: 8 },
        shotsOnTarget: { home: 6, away: 3 },
        corners: { home: 7, away: 4 }
      };
    } catch (error) {
      console.error('Failed to fetch match stats:', error);
      return null;
    }
  }
}

export const sportsApiService = new SportsApiService();

// Instructions for connecting to real APIs:
/*
To connect to real sports APIs:

1. API-Football (recommended for comprehensive data):
   - Sign up at rapidapi.com/api-sports/api/api-football
   - Get your free API key (500 requests/day)
   - Add the key to API_CONFIGS.apiFootball.headers['X-RapidAPI-Key']

2. TheSportsDB (completely free):
   - No API key required
   - Limited to basic match data
   - Good for Ethiopian Premier League coverage

3. ESPN API (free public endpoints):
   - No authentication required
   - Limited data but reliable
   - Good for major international leagues

4. YouTube API (for official streams):
   - Get API key from Google Cloud Console
   - Search for live streams on official channels
   - Embed approved streams only
*/
