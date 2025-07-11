'use client'

export default function TestEnvPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-4">
        <div className="card">
          <h2 className="font-bold mb-2">Client-side Environment Variables:</h2>
          <div className="space-y-2">
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT LOADED'}
              </pre>
            </div>
            
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 50)}...` 
                  : 'NOT LOADED'}
              </pre>
            </div>
            
            <div>
              <strong>NEXT_PUBLIC_APP_URL:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1">
                {process.env.NEXT_PUBLIC_APP_URL || 'NOT LOADED'}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="card bg-yellow-50">
          <h3 className="font-bold text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Environment variables must start with NEXT_PUBLIC_ to be available in the browser</li>
            <li>• If showing &quot;NOT LOADED&quot;, restart the Next.js dev server after adding .env.local</li>
            <li>• Make sure .env.local file exists in the project root</li>
            <li>• Server-side variables (like SUPABASE_SERVICE_ROLE_KEY) are not accessible here</li>
          </ul>
        </div>
      </div>
    </div>
  )
}