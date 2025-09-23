"use client"

import { useEffect, useState } from 'react';
import { createLink, logout, removeLink, saveSettings } from '@/lib/api';
import { ShortLink } from '@/types';
import { linksAtom, settingsAtom, userDataAtom } from '@/components/DataProvider';
import { useAtom } from 'jotai';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [destination, setDestination] = useState('');
  const [earnings] = useState(true);
  const [customUrl, setCustomUrl] = useState('');

  const [autoClaim] = useState(false);
  const [autoClaimThreshold] = useState(0);

  const [] = useAtom(userDataAtom);
  const [links, setLinks] = useAtom(linksAtom);
  const [] = useAtom(settingsAtom);

  useEffect(() => {
    if (typeof window !== "undefined") {
      switch(window.location.hash) {
        case '#dashboard':
          setActiveTab(0);
          break;
        case '#links':
          setActiveTab(1);
          break;
        case '#earnings':
          setActiveTab(2);
          break;
        case '#settings':
          setActiveTab(3);
          break;
      }
    }
  }, []);

  const saveSettingsClick = () => {
    console.log('Saving settings:', { autoClaim, autoClaimThreshold });
    saveSettings({ autoClaim, autoClaimThreshold }).then((response) => {
      console.log('Settings saved:', response);
    }).catch((error) => {
      console.error('Error saving settings:', error);
    });
  }

  const handleRemoveLink = (id: string) => {
    console.log('Removing link with ID:', id);
    removeLink(id).then(() => {
      console.log('Link removed successfully');
      setLinks((links as ShortLink[]).filter(link => link.id !== id));
    }).catch((error) => {
      console.error('Error removing link:', error);
    });
  };

  const handleEditLink = (id: string) => {
    console.log('Editing link with ID:', id);
  };

  const logoutClick = () => {
    console.log('Logging out...');
    logout()
      .then(() => {
        console.log('Logged out successfully');
        location.href = '/'; // Redirect to login page
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      }
    );
  };

  const createLinkClick = () => {
    console.log('Creating link:', { destination, earnings, customUrl });
    setDestination('');
    setCustomUrl('');
    createLink({ destination, earn: earnings, shortLink: customUrl }).then((response) => {
      console.log('Link created:', response);
    }).catch((error) => {
      console.error('Error creating link:', error);
    });
  };

  // Chart configuration
  const chartData = {
    labels: Array.from({length: 14}, (_, i) => `${i + 1}/12`),
    datasets: [{
      label: 'Impressions',
      data: Array.from({length: 14}, () => Math.floor(Math.random() * 1000)),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e2f',
        titleColor: '#fff',
        bodyColor: '#e0e0e0',
        borderColor: '#6366f1',
        borderWidth: 1,
        padding: 12,
        intersect: false,
        callbacks: {
          title: (context: unknown[]) => {
            const ctx = context as { label: string }[];
            return `Date: ${ctx?.[0]?.label}`;
          },
          label: (context: unknown) => {
            const ctx = context as { raw: number };
            return `Impressions: ${ctx.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#a1a1aa' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#a1a1aa' }
      }
    },
    animation: { duration: 300 }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content */}
      <div className="drawer-content flex flex-col bg-base-200">
        {/* Mobile Navbar with hamburger */}
        <div className="w-full navbar bg-base-100 lg:hidden sticky top-0 z-10 border-b border-base-300">
          <div className="flex-none">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2">
            <h2 className="text-xl font-bold"><span className="text-primary">Tiny</span>XNO</h2>
          </div>
        </div>

        <main className="flex-1 flex flex-col overflow-hidden pt-20 lg:pt-16">
          {/* Dashboard content will be added here based on the original structure */}
        </main>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="w-64 bg-base-100 border-r border-base-300 flex flex-col h-full">
          <div className="p-4 border-b border-base-300 hidden lg:block">
            <h2 className="text-xl font-bold"><span className="text-primary">Tiny</span>XNO</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1 mt-4">
            <div className="lg:hidden"><br /><br /></div>
         
            {['Dashboard', 'Links', 'Earnings', 'Settings'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = `#${tab.toLowerCase()}`;
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center
                  ${activeTab === index 
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white' 
                    : 'hover:bg-base-300/50 text-base-content'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-base-300">
            <button className="w-full btn btn-ghost hover:bg-error/10 hover:text-error justify-start" onClick={logoutClick}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
