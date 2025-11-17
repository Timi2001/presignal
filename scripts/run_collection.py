"""
Main Collection Runner
Orchestrates all data collectors and saves to Supabase
"""

import os
import sys
from datetime import datetime
from collectors.rss_collector import collect_rss_feeds
from collectors.reddit_collector import collect_reddit_data
from collectors.twitter_collector import collect_twitter_data
from collectors.youtube_collector import collect_youtube_data
from collectors.google_trends_collector import collect_google_trends
from collectors.tradingview_scraper import scrape_tradingview_ideas
from collectors.central_bank_scraper import scrape_central_banks

def run_all_collectors():
    """Run all data collectors"""
    print(f"\n{'='*60}")
    print(f"[v0] Starting data collection run at {datetime.utcnow().isoformat()}")
    print(f"{'='*60}\n")
    
    all_data = []
    
    # RSS Feeds
    print("[v0] Collecting RSS feeds...")
    rss_data = collect_rss_feeds()
    all_data.extend(rss_data)
    print(f"[v0] Collected {len(rss_data)} articles from RSS feeds")
    
    # Reddit
    print("\n[v0] Collecting Reddit posts...")
    reddit_data = collect_reddit_data()
    all_data.extend(reddit_data)
    print(f"[v0] Collected {len(reddit_data)} posts from Reddit")
    
    # Twitter (placeholder for now)
    print("\n[v0] Collecting Twitter data...")
    twitter_data = collect_twitter_data()
    all_data.extend(twitter_data)
    print(f"[v0] Collected {len(twitter_data)} tweets")
    
    # YouTube
    print("\n[v0] Collecting YouTube videos...")
    youtube_data = collect_youtube_data()
    all_data.extend(youtube_data)
    print(f"[v0] Collected {len(youtube_data)} videos")
    
    # Google Trends
    print("\n[v0] Collecting Google Trends...")
    trends_data = collect_google_trends()
    all_data.extend(trends_data)
    print(f"[v0] Collected {len(trends_data)} trend reports")
    
    # TradingView
    print("\n[v0] Scraping TradingView ideas...")
    tradingview_data = scrape_tradingview_ideas()
    all_data.extend(tradingview_data)
    print(f"[v0] Collected {len(tradingview_data)} TradingView ideas")
    
    # Central Banks
    print("\n[v0] Scraping central bank statements...")
    cb_data = scrape_central_banks()
    all_data.extend(cb_data)
    print(f"[v0] Collected {len(cb_data)} central bank statements")
    
    print(f"\n{'='*60}")
    print(f"[v0] Collection complete! Total items: {len(all_data)}")
    print(f"{'='*60}\n")
    
    return all_data

if __name__ == "__main__":
    collected_data = run_all_collectors()
    
    # Save to file for now (will be sent to API endpoint in production)
    with open('collected_data.json', 'w') as f:
        import json
        json.dump(collected_data, f, indent=2)
    
    print(f"[v0] Data saved to collected_data.json")
