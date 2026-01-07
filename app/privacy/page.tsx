export default function PrivacyPolicy() {
    return (
      <div className="max-w-4xl mx-auto p-8 text-slate-800">
        <h1 className="text-3xl font-bold text-sky-900 mb-6">Privacy Policy</h1>
        <p className="mb-4 text-sm text-slate-500">Last Updated: January 2026</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Data Collection</h2>
          <p>In accordance with the <strong>Nepal Privacy Act, 2075</strong>, we collect personal information (Name, Email, Citizenship details for KYC) only when voluntarily provided for account verification and grievance reporting.</p>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
          <p>Your data is used strictly for:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Verifying identity for "Citizen Portal" access.</li>
            <li>Processing and tracking public infrastructure complaints.</li>
            <li>Providing personalized dashboard analytics.</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
          <p>We implement industry-standard encryption to protect your sensitive data from unauthorized access, modification, or disclosure.</p>
        </section>
      </div>
    );
  }