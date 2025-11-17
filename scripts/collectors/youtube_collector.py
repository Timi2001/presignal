"""
YouTube Collector
Collects video titles, descriptions from forex channels
"""

import os
import json
from datetime import datetime, timedelta
from typing import List, Dict
import requests

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', '')

FOREX_CHANNELS = [
    'UC8QNDoKLy_jJXr8f6xFjwsw',  # ForexSignals TV
    'UCrM7B7SL_g1edFOnmj-SDKg',  # Trading 212
    'UCO5QSjVp1Eo7FpXVDqcPeWA'   # Rayner Teo
]

SEARCH_QUERIES = ['forex news', 'EUR USD analysis', 'gold trading', 'DXY analysis']

def collect_youtube_data() -> List[Dict]:
    """Collect recent forex videos from YouTube"""
    all_videos = []
    
    if not YOUTUBE_API_KEY:
        print("[v0] YOUTUBE_API_KEY not set - skipping YouTube collection")
        return []
    
    for query in SEARCH_QUERIES:
        try:
            url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                'part': 'snippet',
                'q': query,
                'type': 'video',
                'maxResults': 10,
                'order': 'date',
                'key': YOUTUBE_API_KEY,
                'publishedAfter': (datetime.utcnow() - timedelta(days=1)).isoformat() + 'Z'
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                for item in data.get('items', []):
                    snippet = item['snippet']
                    video = {
                        'source_platform': 'youtube',
                        'source_name': snippet.get('channelTitle', ''),
                        'content': f"{snippet.get('title', '')}\n\n{snippet.get('description', '')}",
                        'metadata': {
                            'video_id': item['id'].get('videoId', ''),
                            'url': f"https://youtube.com/watch?v={item['id'].get('videoId', '')}",
                            'published_at': snippet.get('publishedAt', ''),
                            'channel_id': snippet.get('channelId', '')
                        },
                        'collected_at': datetime.utcnow().isoformat()
                    }
                    all_videos.append(video)
                    
        except Exception as e:
            print(f"[v0] Error collecting YouTube for '{query}': {e}")
            continue
    
    return all_videos

if __name__ == "__main__":
    videos = collect_youtube_data()
    print(json.dumps(videos, indent=2))
