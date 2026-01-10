import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const ThankYou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center bg-white rounded-3xl border border-slate-100 shadow-lg p-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>
        <h2 className="font-nunito font-bold text-3xl text-slate-900 mb-4">Thank you!</h2>
        <p className="text-slate-600 mb-6">We received your submission and will be in touch shortly.</p>
        <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
      </div>
    </div>
  );
};

export default ThankYou;