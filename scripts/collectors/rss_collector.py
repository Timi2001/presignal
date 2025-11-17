"""
RSS Feed Collector
Collects news from Bloomberg, Reuters, FT, WSJ, BBC, CNN Business
"""

import feedparser
from datetime import datetime
import json
from typing import List, Dict

RSS_FEEDS = {
    'bloomberg': 'https://www.bloomberg.com/feed/podcast/etf-report.xml',
    'reuters_business': 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
    'ft_world': 'https://www.ft.com/?format=rss',
    'wsj_markets': 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    'bbc_business': 'http://feeds.bbci.co.uk/news/business/rss.xml',
    'cnn_business': 'http://rss.cnn.com/rss/money_latest.rss'
}

FOREX_KEYWORDS = [
    'forex', 'currency', 'dollar', 'euro', 'pound', 'yen', 'franc', 'gold',
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'federal reserve', 'ecb',
    'bank of england', 'bank of japan', 'interest rate', 'inflation',
    'central bank', 'monetary policy', 'fed', 'powell', 'lagarde'
]

def collect_rss_feeds() -> List[Dict]:
    """Collect articles from all RSS feeds"""
    all_articles = []
    
    for source_name, feed_url in RSS_FEEDS.items():
        try:
            feed = feedparser.parse(feed_url)
            
            for entry in feed.entries[:20]:  # Get latest 20 from each source
                title = entry.get('title', '')
                summary = entry.get('summary', entry.get('description', ''))
                content = f"{title} {summary}".lower()
                
                # Check if article is forex-related
                is_relevant = any(keyword.lower() in content for keyword in FOREX_KEYWORDS)
                
                if is_relevant:
                    article = {
                        'source_platform': 'rss',
                        'source_name': source_name,
                        'content': f"{title}\n\n{summary}",
                        'metadata': {
                            'url': entry.get('link', ''),
                            'published': entry.get('published', ''),
                            'author': entry.get('author', ''),
                            'tags': entry.get('tags', [])
                        },
                        'collected_at': datetime.utcnow().isoformat()
                    }
                    all_articles.append(article)
                    
        except Exception as e:
            print(f"[v0] Error collecting from {source_name}: {e}")
            continue
    
    return all_articles

if __name__ == "__main__":
    articles = collect_rss_feeds()
    print(json.dumps(articles, indent=2))
