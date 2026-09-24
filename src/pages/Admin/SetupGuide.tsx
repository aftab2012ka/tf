import { BookOpen, Shield, Key, Database, Globe, Terminal, CheckCircle2 } from 'lucide-react';

export default function SetupGuide() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          System Setup & Deployment Guide
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete operational reference for Tuba Foundation Gokak's technical team.
        </p>
      </div>

      <div className="space-y-6 text-xs text-gray-700 leading-relaxed">
        {/* Step 1: Firebase Project Setup */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Database className="w-5 h-5 text-[#0e6245]" />
            <span>1. Firebase Project Setup</span>
          </div>
          <p>
            The project is provisioned with Firebase Firestore, Authentication, and Storage.
            The Firebase client configuration resides in <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">src/firebase/config.ts</code>.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Firestore database collections: <code className="font-mono">admins</code>, <code className="font-mono">admissions</code>, <code className="font-mono">seeratParticipants</code>, <code className="font-mono">gallery</code>, <code className="font-mono">donationSettings</code>, <code className="font-mono">siteSettings</code>.</li>
            <li>Default document IDs used: <code className="font-mono">donationSettings/default</code> and <code className="font-mono">siteSettings/default</code>.</li>
          </ul>
        </div>

        {/* Step 2: Firestore & Storage Rules */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Shield className="w-5 h-5 text-[#0e6245]" />
            <span>2. Firestore Security Rules</span>
          </div>
          <p>
            Hardened Firestore security rules are compiled and deployed to the project:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Public can submit new admissions and new Seerat registrations. Public cannot view other applicants' private personal data.</li>
            <li>Public can read published gallery media and donation settings.</li>
            <li>Only authenticated foundation administrators can query, edit, delete, or manage applicant records and update site settings.</li>
          </ul>
        </div>

        {/* Step 3: Firebase Authentication & Admin Creation */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Key className="w-5 h-5 text-[#0e6245]" />
            <span>3. How to Create / Authorize Admin Users</span>
          </div>
          <p>To grant admin privileges to foundation staff:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-gray-600">
            <li>
              In the <strong>Firebase Console &gt; Authentication</strong>, enable <strong>Email/Password</strong> or <strong>Google Sign-In</strong>.
            </li>
            <li>
              Add the staff email address (e.g. <code className="font-mono">admin@tubafoundation.org</code>) or sign in with the authorized Google account (<code className="font-mono">aftab2012ka@gmail.com</code>).
            </li>
            <li>
              In <strong>Firestore &gt; admins</strong> collection, create a document with the user's UID (or add their email) with role set to <code className="font-mono">"admin"</code>.
            </li>
          </ol>
        </div>

        {/* Step 4: Environment Variables */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Globe className="w-5 h-5 text-[#0e6245]" />
            <span>4. Environment Variables</span>
          </div>
          <p>
            Documented in <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">/.env.example</code>:
          </p>
          <div className="p-3 bg-gray-900 text-emerald-300 font-mono text-[11px] rounded-lg overflow-x-auto">
            # Foundation Email for notifications<br />
            FOUNDATION_NOTIFICATION_EMAIL="info@tubafoundation.org"<br />
            <br />
            # App Hosting URL<br />
            APP_URL="https://your-domain.org"
          </div>
        </div>

        {/* Step 5: Build & Run */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Terminal className="w-5 h-5 text-[#0e6245]" />
            <span>5. Local Development & Production Build</span>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-gray-800">Development Server:</p>
            <div className="p-2.5 bg-gray-100 rounded font-mono text-gray-800">
              npm run dev
            </div>
            <p className="font-bold text-gray-800 pt-2">Production Build:</p>
            <div className="p-2.5 bg-gray-100 rounded font-mono text-gray-800">
              npm run build
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
