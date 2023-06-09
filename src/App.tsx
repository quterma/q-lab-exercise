import { useState, useEffect } from "react";
import "./App.css";
import { InstallsData, getCountries, getCompaniesWithData, Company } from "./api/api-service";
import { Loader } from "./components/loader";
import { Tabs } from "./components/tabs";
import { Overview } from "./components/overview";

export type Row = {
	display_name: string;
	country: string;
	installs: number;
	roi: number;
	industry_roi: number | undefined;
};

function App() {
	const [activeTab, setActiveTab] = useState<string>("installs");
	const [countries, setCountries] = useState<InstallsData[] | null>(null);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);
		Promise.all([getCountries(), getCompaniesWithData()])
			.then(([countries, companies]) => {
				setCountries(countries);
				setCompanies(companies);
			})
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false));
	}, []);

	const getRows = (companies: Company[]): Row[] =>
		companies
			.map(({ display_name, companyData }) =>
				companyData.map(({ country, installs, revenue, cost, iso }) => {
					const currentCountry = countries?.find(country => country.iso === iso);
					const industry_roi = currentCountry && currentCountry.revenue / currentCountry.cost;

					return {
						display_name,
						country,
						installs,
						roi: revenue / cost,
						industry_roi,
					};
				})
			)
			.flat();

	// const filterRows = (rows: Row[]) => (({ field, value }: {field: string; value: string | number}) => {

	// }

	const tabConfig = [{ installs: "Installs" }, { roi: "ROI" }].reduce((acc, tab) => {
		const [key, title] = Object.entries(tab)[0];
		const overviewData = getRows(companies)
			.slice(0, 5)
			.map(company => ({
				name: company.display_name,
				country: company.country,
				data: company[key as keyof Pick<Row, "installs" | "roi">],
			}));

		return {
			...acc,
			[key]: {
				title,
				component: isError ? (
					<div className="error">Something went wrong!</div>
				) : isLoading ? (
					<Loader />
				) : (
					<Overview data={overviewData} />
				),
			},
		};
	}, {});

	return (
		<div className="main-wrapper">
			<div className="main-header">Data Reports</div>
			<Tabs activeTab={activeTab} setActiveTab={setActiveTab} config={tabConfig}>
				<div className="">some content</div>
			</Tabs>
		</div>
	);
}

export default App;
