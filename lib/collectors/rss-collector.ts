export async function collectRSSFeeds() {
  const feeds = [
    'https://www.reuters.com/rssfeed/businessNews',
    'https://www.bloomberg.com/feed/podcast/etf-report.xml',
    'https://www.ft.com/?format=rss',
    'https://www.wsj.com/xml/rss/3_7085.xml'
  ];

  const currencyKeywords = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'XAU/USD', 'gold',
    'dollar', 'euro', 'pound', 'yen', 'franc', 'forex', 'currency', 'exchange rate',
    'central bank', 'Fed', 'ECB', 'BOE', 'BOJ', 'interest rate', 'monetary policy'
  ];

  const results = [];

  for (const feedUrl of feeds) {
    try {
      const response = await fetch(feedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 0 }
      });
      
      if (!response.ok) continue;
      
      const text = await response.text();
      
      // Extract items from RSS
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const titleRegex = /<title>(.*?)<\/title>/;
      const descRegex = /<description>(.*?)<\/description>/;
      const linkRegex = /<link>(.*?)<\/link>/;
      const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
      
      let match;
      while ((match = itemRegex.exec(text)) !== null) {
        const itemXml = match[1];
        
        const title = titleRegex.exec(itemXml)?.[1] || '';
        const description = descRegex.exec(itemXml)?.[1] || '';
        const link = linkRegex.exec(itemXml)?.[1] || '';
        const pubDate = pubDateRegex.exec(itemXml)?.[1] || '';
        
        const content = `${title} ${description}`.toLowerCase();
        
        // Check if relevant to forex
        const isRelevant = currencyKeywords.some(keyword => 
          content.includes(keyword.toLowerCase())
        );
        
        if (isRelevant) {
          results.push({
            source_type: 'rss_feed',
            source_name: feedUrl.includes('reuters') ? 'Reuters' : 
                         feedUrl.includes('bloomberg') ? 'Bloomberg' :
                         feedUrl.includes('ft.com') ? 'Financial Times' : 'WSJ',
            content: `${title}\n\n${description}`,
            url: link,
            metadata: { pubDate, feed: feedUrl }
          });
        }
      }
    } catch (error) {
      console.error(`[v0] RSS feed error (${feedUrl}):`, error);
    }
  }

  return results;
}
