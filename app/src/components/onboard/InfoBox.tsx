import { Info } from "lucide-react";

interface InfoBoxProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
}

export const InfoBox = ({ title, description, icon }: InfoBoxProps) => {
	return (
		<div className="bg-gray-100 p-4 rounded-lg mb-6">
			<div className="flex items-start">
				{icon || <Info size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />}
				<div>
					<h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
					<p className="text-xs text-gray-600">{description}</p>
				</div>
			</div>
		</div>
	);
};

