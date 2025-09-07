// /api/courses/[slug]/progress.js  (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Course slug is required' });
  }

  try {
    // Mock progress data - in production, this would come from a database
    const progress = {
      courseSlug: slug,
      completed: false,
      progress: 0,
      lastAccessed: new Date().toISOString(),
      totalLessons: 10,
      completedLessons: 0,
      timeSpent: 0, // in minutes
      notes: [],
      bookmarks: []
    };

    return res.status(200).json(progress);

  } catch (err) {
    console.error('[api/courses/progress] error:', err);
    return res.status(500).json({
      error: 'Failed to load course progress',
      details: err.message
    });
  }
}
