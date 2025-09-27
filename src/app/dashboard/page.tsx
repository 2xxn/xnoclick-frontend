"use client"

import 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { cashout, createLink, deleteAccount, logout, removeLink, saveSettings } from '../../lib/api';
import { ShortLink } from '../../types';
import { DataProvider, linksAtom, settingsAtom, userDataAtom } from '../../components/DataProvider';
import { useAtom } from 'jotai';
import { resetRememberMe } from '@/src/lib/utils';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [destination, setDestination] = useState('');
  const [earnings, setEarnings] = useState(true);
  const [customUrl, setCustomUrl] = useState('');

  const [autoClaim, setAutoClaim] = useState(false);
  const [autoClaimThreshold, setAutoClaimThreshold] = useState(0);

  const [userData] = useAtom(userDataAtom);
  const [links, setLinks] = useAtom(linksAtom);
  const [settings, setSettings] = useAtom(settingsAtom);

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
      setSettings({ autoClaim, autoClaimThreshold });
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

  const cashoutClick = () => {
    console.log('Cashout clicked');
    cashout().then((response) => {
      console.log('Cashout successful:', response);
    }).catch((error) => {
      console.error('Error during cashout:', error);
    });
  };

  const logoutClick = () => {
    console.log('Logging out...');
    logout()
      .then(() => {
        console.log('Logged out successfully');
        resetRememberMe('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  // Chart configuration
  const chartData = {
    labels: Array.from({length: 14}, (_, i) => `${i + 1}/07`),
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
          title: (context: { label: any; }[]) => `Date: ${context?.[0]?.label}`,
          label: (context: { raw: any; }) => `Impressions: ${context.raw}`
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

  const createLinkClick = () => {
    console.log('Creating link:', { destination, earnings, customUrl });
    createLink({ destination, earn: earnings, shortLink: customUrl }).then((response: any) => {
      console.log('Link created:', response);
      setDestination('');
      setCustomUrl('');
      setLinks([response.data as ShortLink, ...(links as ShortLink[])]);
    }).catch((error) => {
      console.error('Error creating link:', error);
    });
  };

  async function deleteAccountClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    try {
      await deleteAccount();
      resetRememberMe('/');
    } catch (error) {
      console.error('Account deletion failed:', error);
      alert('Failed to delete account. Please try again.');
    }
  }

  return (
    <DataProvider>
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
            <h2 className="text-xl font-bold"><span className="text-primary">XNO</span>Click</h2>
          </div>
        </div>

        <main className="flex-1 flex flex-col overflow-hidden pt-20 lg:pt-16">
          {activeTab === 0 && userData && (

            <div className="flex-1 p-4 sm:p-8 h-full overflow-auto">
              {/* <h2 className="text-2xl font-bold mb-8 my-6">
                Welcome, nano_123...!
              </h2> */}
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { title: 'Links', value: userData.links },
                  { title: 'Claimable', value: userData.claimable },
                  { title: 'Impressions', value: userData.totalImpressions },
                  { title: 'Total Earned', value: userData.totalEarned },
                ].map((stat) => (
                  <div key={stat.title} className="bg-gradient-to-br from-base-100 to-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
                    <h3 className="text-sm font-medium text-base-content/70 mb-2">{stat.title}</h3>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <div className="mt-4 h-1 bg-primary/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Daily Impressions (14 Days)</h3>
                </div>
                <div className="h-64 sm:h-80 lg:h-96">
                  <Chart type="line" data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && links && (
            <div className="flex-1 p-4 sm:p-8 h-full overflow-auto">
              <div className="max-w-3xl mx-auto space-y-8 px-4 sm:px-0">
                <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6">
                  <h2 className="text-2xl font-bold mb-6">Create New Link</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Destination URL</label>
                      <input 
                        type="url" 
                        placeholder="https://example.com" 
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                    <details className="collapse collapse-arrow bg-base-200 rounded-lg">
                      <summary className="collapse-title text-sm font-medium">Extra Options</summary>
                      <div className="collapse-content space-y-4 pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            checked={earnings}
                            onChange={(e) => setEarnings(e.target.checked)}
                          />
                          <span className="text-sm">Earnings</span>
                        </label>
                        <div>
                          <label className="block text-sm font-medium mb-2">Custom URL</label>
                          <div className="flex gap-2">
                            <span className="px-4 bg-base-300 flex items-center rounded-l-lg">xno.click/</span>
                            <input 
                              type="text" 
                              placeholder="custom" 
                              className="input input-bordered flex-1 rounded-l-none"
                              value={customUrl}
                              onChange={(e) => setCustomUrl(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </details>
                    <button 
                      onClick={createLinkClick}
                      className="btn btn-primary w-full mt-6 py-3 text-lg font-semibold shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      Shorten link
                    </button>
                  </div>
                </div>

                {/* Links List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-semibold">Managed Links</h2>
                    <span className="text-sm text-neutral-400">
                      {links.length} link{links.length !== 1 && 's'}
                    </span>
                  </div>

                  {links.length === 0 ? (
                    <div className="bg-base-200/40 rounded-xl p-8 text-center border-2 border-dashed border-base-300">
                      <p className="text-neutral-500 mb-3">No active links found</p>
                      <button 
                        onClick={() => {
                          // TODO: Highlight the create link section temporarily
                          setActiveTab(1);
                        }}
                        className="btn btn-primary btn-sm px-6 shadow-md"
                      >
                        Create New Link
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {links.map((link: ShortLink) => (
                        <div key={link.id} className="group bg-base-100 rounded-xl border border-base-300 p-5 transition-all hover:border-primary/30">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            {/* Main Content */}
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
                                <button
                                  onClick={() => navigator.clipboard.writeText(`https://xno.click/${link.shortUrl}`)}
                                  className="text-left font-semibold text-lg truncate hover:text-primary transition-colors"
                                >
                                  <span className="text-base-content/80">xno.click/</span>
                                  <span className="text-primary">{link.shortUrl}</span>
                                </button>
                                {/* <div className="flex gap-2 items-center">
                                  <span className={`badge badge-xs ${link.claimable ? 'badge-success' : 'badge-neutral'}`}></span>
                                  <span className="text-sm text-neutral-400">
                                    {link.claimable ? 'Claimable' : 'Pending'}
                                  </span>
                                </div> */}
                              </div>
                              
                              <p className="text-sm text-neutral-400 truncate">
                                → <a className="text-primary" href={link.destination} target="_blank" rel="noopener noreferrer">{link.destination}</a>
                              </p>

                              <div className="flex gap-6 border-t border-base-300 pt-3">
                                <div className="space-y-1">
                                  <span className="text-xs font-medium text-neutral-500">Impressions</span>
                                  <p className="font-medium text-lg">{link.impressions || 0}</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-xs font-medium text-neutral-500">Total Earnings</span>
                                  <p className="font-medium text-lg">
                                  Ӿ{link.earned > 0 ? link.earned : "0.00"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-xs font-medium text-neutral-500">Claimable</span>
                                  <p className="font-medium text-lg text-success">
                                  Ӿ{link.claimable > 0 ? link.claimable : "0.00"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row sm:flex-col gap-1.5 min-w-[90px] mt-3 sm:mt-0">
                              {/* <button
                                onClick={() => handleEditLink(link.id)}
                                className="btn btn-ghost btn-xs justify-start px-3 text-neutral-400 hover:text-primary hover:bg-primary/10"
                              >
                                Edit
                              </button> */}
                              <button
                                onClick={() => handleRemoveLink(link.id)}
                                className="btn btn-ghost btn-xs justify-start px-3 text-neutral-400 hover:text-error hover:bg-error/10"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="flex-1 p-4 sm:p-8 h-full overflow-auto">
              <div className="max-w-3xl mx-auto">
                <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6">
                  <h2 className="text-xl font-bold mb-4">Link Earnings</h2>
                  <p className="text-base-content/70 mb-6">
                    View your earnings and claimable amounts for each link.
                  </p>
                  {/* Stat cards */}
                  <div className="grid grid-cols-1 grid-cols-2 gap-6 mb-8">
                    {[
                      { title: 'Total Earnings', value: userData?.totalEarned || 0 },
                      { title: 'Claimable', value: userData?.claimable || 0 },
                    ].map((stat) => (
                      <div key={stat.title} className="bg-base-200 p-4 rounded-lg shadow-sm">
                        <h3 className="font-medium">{stat.title}</h3>
                        <p className="text-lg font-bold">Ӿ{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Cashout button */}
                  <div className="mt-6">
                    <button onClick={cashoutClick} className="btn btn-primary w-full">
                      Cash Out Earnings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && settings && (
            <div className="flex-1 p-4 sm:p-8 h-full overflow-auto">
              <div className="max-w-3xl mx-auto">
                <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                        <div>
                          <h3 className="font-medium">Auto-Claim System</h3>
                          <p className="text-sm text-base-content/70">Automatically claim available rewards</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          defaultChecked={settings.autoClaim ?? false}
                          onChange={(e) => setAutoClaim(e.target.checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                        <div>
                          <h3 className="font-medium">Auto-Claim Threshold</h3>
                          <p className="text-sm text-base-content/70">The claimable amount required for an auto-claim</p>
                        </div>
                        <input
                          type="text"
                          className="input input-bordered w-32 text-right"
                          placeholder="0.01"
                          min="0.01"
                          step="0.01"
                          defaultValue={settings.autoClaimThreshold ?? ''}
                          onChange={(e) => setAutoClaimThreshold(parseFloat(e.target.value))}
                        />
                      </div>

                      <div className="border-t border-base-300 pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button onClick={saveSettingsClick} className="btn btn-primary px-8 gap-2">
                            Save Changes
                          </button>
                          <button 
                            onClick={() => {
                              if (typeof document !== 'undefined') {
                                (document.getElementById('delete_modal') as any)?.showModal?.();
                              }
                            }}
                            className="btn btn-error px-8 gap-2 bg-gradient-to-r from-error/90 to-error/70 border-error/50 hover:from-error hover:to-error/90"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Modal */}
          <dialog id="delete_modal" className="modal">
            <div className="modal-box bg-base-100 max-w-md">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
              </form>
              <div className="text-center space-y-4 py-8">
                <div className="text-error inline-block p-4 bg-error/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Confirm Account Deletion</h3>
                <p className="text-base-content/70">This will permanently delete all your data and cannot be undone. Are you absolutely sure?</p>
                <div className="flex justify-center gap-4 pt-4">
                  <form method="dialog">
                    <button className="btn btn-ghost">Cancel</button>
                  </form>
                  <button
                    onClick={deleteAccountClick}
                    className="btn btn-error gap-2">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        </main>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="w-64 bg-base-100 border-r border-base-300 flex flex-col h-full">
          <div className="p-4 border-b border-base-300 hidden lg:block">
            <h2 className="text-xl font-bold"><span className="text-primary">XNO</span>Click</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1 mt-4">
            <div className="lg:hidden"><br /><br /></div>
         
            {['Dashboard', 'Links', 'Earnings', 'Settings'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = `#${tab.toLowerCase()}`;
                    setActiveTab(index);
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
    </DataProvider>
  );
}
