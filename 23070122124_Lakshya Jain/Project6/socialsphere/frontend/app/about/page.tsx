import { Server, Database, Monitor, ChevronDown } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">About SocialSphere</h1>
        <p className="mt-2 text-sm text-slate-400">Under the hood of our Kubernetes-ready social benchmark application.</p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Section 1: What is SocialSphere? */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md">
          <h2 className="text-lg font-bold text-white mb-2">What is SocialSphere?</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            SocialSphere is a streamlined micro-blogging feed application designed specifically for system testing and load analysis.
            It provides a realistic simulation of standard social interactions—viewing feeds, writing posts, liking entries, and writing comments—without the overhead of complex business rules or authentication bottlenecks.
          </p>
        </section>

        {/* Section 2: Project Goal */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md">
          <h2 className="text-lg font-bold text-white mb-2">Project Goal</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The core purpose of SocialSphere is to serve as a stateless workload candidate for containerized autoscaling deployments.
            It is designed to be easily deployed on a Kubernetes cluster, allowing developers to configure and test **Horizontal Pod Autoscaling (HPA)** policies using metrics like CPU utilization, memory thresholds, or custom request throughput rates.
          </p>
        </section>

        {/* Section 3: Architecture */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md">
          <h2 className="text-lg font-bold text-white mb-4">System Architecture</h2>
          <div className="flex flex-col items-center justify-center bg-slate-950 p-6 rounded-lg border border-slate-850 font-mono text-xs text-indigo-400 shadow-inner">
            {/* Component 1: Browser */}
            <div className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-4 py-2.5 rounded text-slate-200">
              <Monitor className="h-4 w-4 text-indigo-400" />
              <span>Browser</span>
            </div>

            {/* Arrow */}
            <div className="my-2 text-slate-600 flex flex-col items-center">
              <span>│</span>
              <ChevronDown className="h-3 w-3 -mt-1" />
            </div>

            {/* Component 2: Frontend */}
            <div className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-4 py-2.5 rounded text-slate-200">
              <span className="font-sans font-bold text-indigo-500">N</span>
              <span>Next.js Frontend</span>
            </div>

            {/* Arrow */}
            <div className="my-2 text-slate-600 flex flex-col items-center">
              <span>│</span>
              <ChevronDown className="h-3 w-3 -mt-1" />
            </div>

            {/* Component 3: Backend */}
            <div className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-4 py-2.5 rounded text-slate-200">
              <Server className="h-4 w-4 text-indigo-400" />
              <span>Backend REST API</span>
            </div>

            {/* Arrow */}
            <div className="my-2 text-slate-600 flex flex-col items-center">
              <span>│</span>
              <ChevronDown className="h-3 w-3 -mt-1" />
            </div>

            {/* Component 4: DB */}
            <div className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-4 py-2.5 rounded text-slate-200">
              <Database className="h-4 w-4 text-indigo-400" />
              <span>PostgreSQL</span>
            </div>
          </div>
        </section>

        {/* Section 4: Tech Stack */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md">
          <h2 className="text-lg font-bold text-white mb-3">Technology Stack</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-350 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-950 p-3 border border-slate-850">
              <span className="font-semibold text-white block mb-0.5">Frontend</span>
              Next.js & React
            </div>
            <div className="rounded-lg bg-slate-950 p-3 border border-slate-850">
              <span className="font-semibold text-white block mb-0.5">Styling</span>
              Tailwind CSS
            </div>
            <div className="rounded-lg bg-slate-950 p-3 border border-slate-850">
              <span className="font-semibold text-white block mb-0.5">Backend</span>
              Node.js & Express
            </div>
            <div className="rounded-lg bg-slate-950 p-3 border border-slate-850">
              <span className="font-semibold text-white block mb-0.5">Language</span>
              TypeScript
            </div>
            <div className="rounded-lg bg-slate-950 p-3 border border-slate-850">
              <span className="font-semibold text-white block mb-0.5">Database</span>
              PostgreSQL
            </div>
            <div className="rounded-lg bg-slate-950 p-3 border border-slate-850">
              <span className="font-semibold text-white block mb-0.5">ORM</span>
              Prisma ORM
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
