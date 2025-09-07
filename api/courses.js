// /api/courses.js  (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Sample course data - in production, this would come from a database
    const courses = [
      {
        id: 'python-basics',
        slug: 'python-basics',
        title: 'Python Fundamentals',
        description: 'Learn Python programming from scratch with hands-on exercises and real-world projects.',
        status: 'published',
        studentCount: 1247,
        fileName: 'python-fundamentals.pdf',
        fileSize: 2.3,
        visibility: 'published',
        createdAt: new Date().toISOString()
      },
      {
        id: 'react-essentials',
        slug: 'react-essentials', 
        title: 'React Essentials',
        description: 'Master React.js for building modern, interactive user interfaces.',
        status: 'published',
        studentCount: 892,
        fileName: 'react-essentials.pdf',
        fileSize: 1.8,
        visibility: 'published',
        createdAt: new Date().toISOString()
      },
      {
        id: 'javascript-advanced',
        slug: 'javascript-advanced',
        title: 'Advanced JavaScript',
        description: 'Deep dive into advanced JavaScript concepts, ES6+, and modern development patterns.',
        status: 'published',
        studentCount: 654,
        fileName: 'javascript-advanced.pdf',
        fileSize: 3.1,
        visibility: 'published',
        createdAt: new Date().toISOString()
      }
    ];

    return res.status(200).json(courses);

  } catch (err) {
    console.error('[api/courses] error:', err);
    return res.status(500).json({
      error: 'Failed to load courses',
      details: err.message
    });
  }
}
