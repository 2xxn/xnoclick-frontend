"use client"
import React, { useEffect } from "react";
import { checkLogin, getStats, login, me } from "../lib/api";
import { LoginResponse, StatsResponse } from "../types";
import { NanoWS } from "../lib/nano";
import { calculatePercentage, resetRememberMe } from "../lib/utils";
import { GITHUB_URL, DISCORD_URL } from "../consts";
import Login from "./login";
import DonationModal from "./DonationModal";
import toast, { Toaster } from 'react-hot-toast';

export const LandingPage = () => {
  const [stats, setStats] = React.useState<StatsResponse>({
    rate: 0.0002, // TODO: change
    impressions: 0,
    impressionsMonthBefore: 0,
    distributed: 0,
    activeUsers: 0,
    fundingGoal: 20,
    funds: 0
  });

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [donationModalOpen, setDonationModalOpen] = React.useState(false);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [loginData, setLoginData] = React.useState<LoginResponse>();

  function checkLoginStatus(loginKey: string) {
    checkLogin(loginKey).then((response) => {
        if(response.success) {
          console.info("Login successful:", response);
          resetRememberMe('/dashboard');
        }
    });
  }

  function waitForTransaction(address: string, loginKey: string) {
      const ws = new NanoWS('wss://rainstorm.city/websocket');

      ws.on('reconnect', () => {
          // Delete current ws and create a new one
          console.log('Reconnecting WebSocket...');
          waitForTransaction(address, loginKey);
          checkLoginStatus(loginKey);
      });

          ws.subscribe(address);

          ws.on('confirmation', (data) => {
              console.log('Transaction confirmed:', data);
              checkLoginStatus(loginKey);
          });
  }

  function showLoginModal() {
    if(!window.sessionStorage.getItem('rememberMe')) {
      resetRememberMe();
    }

    login().then((response) => {
      console.log("Login response:", response);
      if((response as { status?: number })?.status == 204) {
        resetRememberMe('/dashboard');
      }

      setLoginData(response);
      setLoginModalOpen(true);

      checkLogin(response.loginKey).then((response) => {
          if(response.success) {
            console.info("Login successful:", response);
            resetRememberMe('/dashboard');
          }
      }).catch(() => {
        waitForTransaction(response.address, response.loginKey);
      });

      console.log("Login response:", response);
    }).catch((error) => {
      console.error("Error during login:", error);
      toast.error("An error occurred while initiating login. Please report this issue.");
    });
  }

  useEffect(() => {
    me().then(_ => setLoggedIn(true));

    getStats().then((data) => {
      setStats(data.data as StatsResponse);
    }).catch((error) => {
      toast.error("Failed to fetch platform statistics.");
      console.error("Error fetching stats:", error);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(this: HTMLAnchorElement, e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href')!);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Login Modal */}
      {(loginModalOpen) && <Login loginResponse={loginData as LoginResponse} onCancel={() => setLoginModalOpen(false)} />}

      {/* Donation Modal */}
      {donationModalOpen && <DonationModal address="asdjhas" onClose={() => setDonationModalOpen(false)} />}
           {/* Navbar */}
        <nav className="navbar bg-base-100 shadow-lg fixed top-0 z-50 2xl:px-90">
        <div className="flex flex-1">
          <a href="#top" className="btn btn-ghost text-xl">
            <span><span className="text-primary">xno.</span>click</span>  
          </a>
        </div>
        <div className="flex flex-none hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li><a href="#about" className="btn btn-ghost">About</a></li>
            <li><a href="#how" className="btn btn-ghost">How It Works</a></li>
            <li><a href="#stats" className="btn btn-ghost">Statistics</a></li>
            <li><a href="#donate" className="btn btn-ghost">Donate</a></li>
          </ul>
        </div>
        <div className="flex flex-1 justify-end">
          <button className="btn btn-primary gap-2" onClick={showLoginModal}>
            {loggedIn ? `Dashboard` : `Login`}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="top" className="min-h-screen flex items-center pt-24 pb-12 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fadeIn">
              Earn <span className="text-primary">$XNO</span> Through<br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Short Links
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-base-content/80">
              Transform long URLs into earning opportunities. Get paid in cryptocurrency for every verified visit.
            </p>
            <div className="flex gap-4">
              <button 
                className="btn btn-primary btn-lg px-8 shadow-lg"
                onClick={showLoginModal}
              >
                Start Earning
              </button>
              <a href="#about" className="btn btn-outline btn-lg px-8">
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="mockup-browser border border-base-300 bg-base-100 shadow-2xl">
              <div className="mockup-browser-toolbar">
                <div className="input border border-base-300">https://xno.click/dashboard</div>
              </div>
                  <img src="/preview.png" className="m-0 p-0 rounded-lg border border-base-300 shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <SectionWrapper id="about" title="About">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Crypto-Powered URL Shortener</h3>
            <p className="text-base-content/80 leading-relaxed">
              xno.click revolutionizes link sharing by integrating Nano cryptocurrency. 
              Create short links that generate passive income through community engagement 
              while promoting decentralized digital currency adoption.
            </p>
          </div>
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
            <div className="space-y-4">
              {[
                { label: 'Current Rate', value: stats.rate+' XNO/visit' },
                { label: 'Total Distributed', value: stats.distributed+' XNO' },
                { label: 'Active Users', value: stats.activeUsers }
              ].map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-base-300 last:border-0">
                  <span className="text-base-content/70">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="how" title="How It Works" bg="base-100">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Create', desc: 'Generate short links through your dashboard' },
            { title: 'Share', desc: 'Distribute your links across platforms' },
            { title: 'Earn', desc: 'Accumulate $XNO from verified visits' }
          ].map((step, index) => (
            <div key={index} className="card bg-base-200 border border-base-300 p-6 hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-primary mb-4">0{index + 1}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-base-content/80">{step.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="stats" title="Platform Statistics">
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard title="Total Distributed" value={`${stats.distributed} XNO`} />
          <StatCard title="Monthly Impressions" value={`${stats.impressions}`} trend={`+${calculatePercentage(stats.impressions, stats.impressionsMonthBefore)}% from last month`} />
          <StatCard title="Total Users" value={`${stats.activeUsers}`} />
        </div>
      </SectionWrapper>

      <SectionWrapper id="donate" title="Support the Network" bg="base-100">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xl text-base-content/80">
            Help sustain and grow the xno.click ecosystem. Your donations directly fuel user earnings
            and platform development.
          </p>
          <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
            <h3 className="text-2xl font-bold mb-4">Current Funding Pool</h3>
            <div className="radial-progress text-primary" style={{ '--value': calculatePercentage(stats?.funds || 0, stats?.fundingGoal || 20) } as React.CSSProperties}>
              {calculatePercentage(stats?.funds || 0, stats?.fundingGoal || 20)}%
            </div>
            <div className="mt-4 text-base-content/70">{(stats?.funds || 0).toFixed(3)}/{(stats?.fundingGoal || 20).toFixed(3)} XNO</div>
          </div>
          <button onClick={() => setDonationModalOpen(true)} className="btn btn-primary px-12">Contribute Now</button>
        </div>
      </SectionWrapper>

      {/* Enhanced Footer */}
      <footer className="footer p-12 bg-neutral text-neutral-content mt-20">
        <div className="container mx-auto px-4 2xl:px-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="footer-title">xno.click</h4>
              <p className="text-neutral-content/80">
                URL shortening powered by Nano cryptocurrency
              </p>
            </div>
            <div className="flex flex-col gap-0 lg:gap-4"> 
              <h4 className="footer-title">Legal</h4>
              <a className="link link-hover">Terms of use</a>
              <a className="link link-hover">Privacy policy</a>
              <a className="link link-hover">Cookie policy</a>
            </div>
            <div className="flex flex-col gap-0 lg:gap-4">
              <h4 className="footer-title">Community</h4>
              <a target="_blank" href={GITHUB_URL} className="link link-hover">GitHub</a>
              <a target="_blank" href={DISCORD_URL} className="link link-hover">Discord</a>
            </div>
          </div>
          <div className="border-t border-neutral-content/20 mt-8 pt-8 text-center md:text-left">
            <p>© {new Date().getFullYear()} xno.click. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SectionWrapper = ({ id, title, children, bg = 'base-200' }: { 
  id: string;
  title: string;
  children: React.ReactNode;
  bg?: string;
}) => (
  <section id={id} className={`py-20 px-4 md:px-8 bg-${bg}`}>
    <div className="container mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center">{title}</h2>
      {children}
    </div>
  </section>
);

const StatCard = ({ title, value, trend = "" }: { 
  title: string;
  value: string;
  trend?: string;
}) => (
  <div className="card bg-base-100 p-6 border border-base-300 hover:shadow-lg transition-all">
    <h3 className="text-lg text-base-content/70 mb-2">{title}</h3>
    <div className="text-3xl font-bold mb-2">{value}</div>
    <div className="text-sm text-primary">{trend || ''}</div>
  </div>
);
