export async function collectRedditPosts() {
  const subreddits = ['Forex', 'wallstreetbets', 'investing', 'economics'];
  const results = [];

  for (const subreddit of subreddits) {
    try {
      const response = await fetch(
        `https://old.reddit.com/r/${subreddit}/hot.json?limit=25`,
        {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json'
          },
          next: { revalidate: 0 }
        }
      );

      if (!response.ok) {
        console.log(`[v0] Reddit r/${subreddit} returned ${response.status}`);
        continue;
      }

      const data = await response.json();
      const posts = data.data?.children || [];

      const currencyKeywords = [
        'eur/usd', 'gbp/usd', 'usd/jpy', 'usd/chf', 'aud/usd', 'usd/cad', 'xau/usd', 'gold',
        'eurusd', 'gbpusd', 'usdjpy', 'usdchf', 'audusd', 'usdcad', 'xauusd',
        'dollar', 'euro', 'pound', 'yen', 'forex', 'currency', 'fx', 'fed', 'central bank'
      ];

      for (const post of posts) {
        const postData = post.data;
        const title = postData.title?.toLowerCase() || '';
        const selftext = postData.selftext?.toLowerCase() || '';
        const content = `${title} ${selftext}`;

        const isRelevant = currencyKeywords.some(keyword => content.includes(keyword));

        if (isRelevant && postData.ups > 5) {
          results.push({
            source_type: 'reddit',
            source_name: `r/${subreddit}`,
            content: `${postData.title}\n\n${postData.selftext || ''}`,
            url: `https://reddit.com${postData.permalink}`,
            metadata: {
              upvotes: postData.ups,
              num_comments: postData.num_comments,
              created_utc: postData.created_utc,
              author: postData.author
            }
          });
        }
      }
    } catch (error) {
      console.error(`[v0] Reddit error (r/${subreddit}):`, error);
    }
  }

  console.log(`[v0] Reddit collected ${results.length} relevant posts`);
  return results;
}
