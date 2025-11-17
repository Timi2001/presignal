"""
Reddit Collector
Collects posts and comments from forex-related subreddits
"""

import os
import json
from datetime import datetime, timedelta
from typing import List, Dict
import requests

SUBREDDITS = ['Forex', 'wallstreetbets', 'investing', 'economics', 'stocks']
CURRENCY_KEYWORDS = ['EUR/USD', 'EURUSD', 'GBP/USD', 'GBPUSD', 'USD/JPY', 'USDJPY', 
                     'XAU/USD', 'XAUUSD', 'gold', 'dollar', 'DXY']

def collect_reddit_data() -> List[Dict]:
    """Collect recent posts from forex subreddits using Reddit JSON API"""
    all_posts = []
    
    for subreddit in SUBREDDITS:
        try:
            # Reddit JSON API (no auth needed for public data)
            url = f"https://www.reddit.com/r/{subreddit}/new.json?limit=50"
            headers = {'User-Agent': 'Mozilla/5.0 (Market Intelligence Bot)'}
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                for post in data['data']['children']:
                    post_data = post['data']
                    title = post_data.get('title', '')
                    selftext = post_data.get('selftext', '')
                    content = f"{title} {selftext}".upper()
                    
                    # Check if post is currency-related
                    is_relevant = any(keyword.upper() in content for keyword in CURRENCY_KEYWORDS)
                    
                    if is_relevant:
                        post_obj = {
                            'source_platform': 'reddit',
                            'source_name': f"r/{subreddit}",
                            'content': f"Title: {title}\n\nContent: {selftext}",
                            'metadata': {
                                'url': f"https://reddit.com{post_data.get('permalink', '')}",
                                'score': post_data.get('score', 0),
                                'num_comments': post_data.get('num_comments', 0),
                                'created_utc': post_data.get('created_utc', 0),
                                'author': post_data.get('author', '[deleted]')
                            },
                            'collected_at': datetime.utcnow().isoformat()
                        }
                        all_posts.append(post_obj)
                        
        except Exception as e:
            print(f"[v0] Error collecting from r/{subreddit}: {e}")
            continue
    
    return all_posts

if __name__ == "__main__":
    posts = collect_reddit_data()
    print(json.dumps(posts, indent=2))
