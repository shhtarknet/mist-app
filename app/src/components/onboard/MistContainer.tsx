import { HasChildren } from "../../lib/types";

export const MistContainer = ({ children }: HasChildren) => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
			<div className="relative w-full max-w-md">
				<div className="flex items-center justify-center z-10 p-4">
					<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

