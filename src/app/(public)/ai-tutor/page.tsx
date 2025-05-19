import Head from 'next/head';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">


      <main className="flex flex-col mt-[100px] items-center justify-center w-full max-w-4xl text-center">
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">AI Tutor</h1>
          <p className="text-xl md:text-2xl text-blue-600" style={{ color: '#5580D6' }}>Your Personal Learning Assistant</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 md:p-12 shadow-lg w-full mb-8 border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Coming Soon</h2>
          
          <p className="text-lg text-gray-700 mb-8">
            We&apos;re building the next generation of AI-powered learning. Get personalized tutoring, 
            instant feedback, and adaptive learning paths tailored just for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-3xl mb-2" style={{ color: '#5580D6' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Learning</h3>
              <p className="text-gray-600">AI-powered insights that adapt to your unique learning style and pace.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-3xl mb-2" style={{ color: '#5580D6' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Extensive Resources</h3>
              <p className="text-gray-600">Access a vast library of learning materials across multiple subjects and disciplines.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-3xl mb-2" style={{ color: '#5580D6' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Assistance</h3>
              <p className="text-gray-600">Get help whenever you need it with our always-available AI tutoring system.</p>
            </div>
          </div>
          
          <p className="text-lg font-medium text-gray-800">
            We&apos;re working hard to launch soon. Stay tuned for updates!
          </p>
        </div>
        
        
      </main>

  
    </div>
  );
}