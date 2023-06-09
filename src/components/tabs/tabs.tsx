import "./tabs.css";
import { ReactNode } from "react";

type Tab = { component: ReactNode; title: string };
export type Props = {
	config: Record<string, Tab>;
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<string>>;
	children: ReactNode;
};

export const Tabs = ({ config, activeTab, setActiveTab, children }: Props) => {
	return (
		<>
			<div className="header">
				{Object.entries(config).map(([key, tab]) => {
					return (
						<div className={`tab ${key === activeTab ? "active" : ""}`} key={key} onClick={() => setActiveTab(key)}>
							{tab.title}
						</div>
					);
				})}
			</div>
			{activeTab ? <div>{config[activeTab].component}</div> : null}
			{children}
		</>
	);
};
