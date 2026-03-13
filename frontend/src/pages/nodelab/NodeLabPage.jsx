import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '@/components/layout/Sidebar';
import BlueprintsTab from './tabs/BlueprintsTab';
import NodeListsTab from './tabs/NodeListsTab';

export default function NodeLabPage() {
	const [activeTab, setActiveTab] = useState('blueprints');
	const { t } = useTranslation();

	const TABS = [
		{
			id: 'blueprints',
			label: t('nodeLab.tabs.blueprints'),
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polygon points="12 2 2 7 12 12 22 7 12 2" />
					<polyline points="2 17 12 22 22 17" />
					<polyline points="2 12 12 17 22 12" />
				</svg>
			),
		},
		{
			id: 'node-lists',
			label: t('nodeLab.tabs.nodeLists'),
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<line x1="8" y1="6" x2="21" y2="6" />
					<line x1="8" y1="12" x2="21" y2="12" />
					<line x1="8" y1="18" x2="21" y2="18" />
					<line x1="3" y1="6" x2="3.01" y2="6" />
					<line x1="3" y1="12" x2="3.01" y2="12" />
					<line x1="3" y1="18" x2="3.01" y2="18" />
				</svg>
			),
		},
	];


	return (
		<div className="flex h-screen bg-background">
			<Sidebar />

			<main className="flex-1 overflow-y-auto p-8">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<header className="mb-6">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polygon points="12 2 2 7 12 12 22 7 12 2" />
									<polyline points="2 17 12 22 22 17" />
									<polyline points="2 12 12 17 22 12" />
								</svg>
							</div>
							<div>
								<h1 className="text-3xl font-bold text-[rgb(var(--color-text))]">
									{t('nodeLab.header')}
								</h1>
								<p className="text-[rgb(var(--color-text-secondary))] mt-0.5">
									{t('nodeLab.subtitle')}
								</p>
							</div>
						</div>
					</header>

					{/* Tabs */}
					<div className="flex items-center gap-1 mb-8 border-b border-[rgb(var(--color-border))]">
						{TABS.map(tab => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px ${
									activeTab === tab.id
										? 'border-cyan-500 text-cyan-500'
										: 'border-transparent text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-border))]'
								}`}
							>
								{tab.icon}
								{tab.label}
							</button>
						))}
					</div>

					{/* Tab content */}
					{activeTab === 'blueprints' && <BlueprintsTab />}
					{activeTab === 'node-lists' && <NodeListsTab />}
				</div>
			</main>
		</div>
	);
}
