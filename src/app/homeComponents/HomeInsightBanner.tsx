import React from 'react';
import {  Users, User, Bus, School } from 'lucide-react';

const HomeInsightBanner = () => {
  return (
    <div>
        {/* Stats Section */}
        <section
          className="py-12"
          style={{ background: 'var(--color-background)' }}
        >
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Text */}
            <div>
              <h3
                className="text-3xl font-semibold mb-3"
                style={{ color: 'var(--color-textblack)' }}
              >
                Connected Many
              </h3>
              <h4
                className="text-3xl font-semibold mb-3"
                style={{
                  background: 'linear-gradient(90deg, var(--blue-shade-dark) 0%, var(--blue-shade-light) 60%, var(--green-shade-light) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'var(--blue-shade-dark)'
                }}
              >
                School Services and Parents
              </h4>
              <p
                className="text-sm"
                style={{ color: 'var(--color-textgreydark)' }}
              >
                We reached here with our hard work and dedication
              </p>
            </div>

            {/* Right Stats Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-3">
                <Users className="w-10 h-10 mr-3" style={{ color: 'var(--blue-shade-dark)' }} />
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--color-textblack)' }}>2,245,341</p>
                  <p className="text-sm" style={{ color: 'var(--color-textgreylight)' }}>Students</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-10 h-10 mr-3" style={{ color: 'var(--green-shade-dark)' }} />
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--color-textblack)' }}>46,328</p>
                  <p className="text-sm" style={{ color: 'var(--color-textgreylight)' }}>Drivers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bus className="w-10 h-10 mr-3" style={{ color: 'var(--blue-shade-light)' }} />
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--color-textblack)' }}>828,867</p>
                  <p className="text-sm" style={{ color: 'var(--color-textgreylight)' }}>Van Owners</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <School className="w-10 h-10 mr-3" style={{ color: 'var(--green-shade-light)' }} />
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--color-textblack)' }}>1,926,436</p>
                  <p className="text-sm" style={{ color: 'var(--color-textgreylight)' }}>Schools</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default HomeInsightBanner;
