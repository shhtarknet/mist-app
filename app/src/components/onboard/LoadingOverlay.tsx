
interface LoadingOverlayProps {
	processingMsg: string;
}

export const LoadingOverlay = ({ processingMsg }: LoadingOverlayProps) => {
	// Don't render anything if no message
	if (!processingMsg) {
		return null;
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 m-auto bg-black/50">
			{/* Semi-transparent backdrop */}

			{/* Centered content container */}
			<div className="relative bg-white rounded-lg p-6 m-4 max-w-60 w-full  shadow-2xl flex flex-col items-center">
				{/* Spinner - simple CSS-based loader */}
				<div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin my-8"></div>

				{/* Processing message */}
				<p className="mt-4 text-center text-gray-600 text-md font-medium">{processingMsg}</p>
			</div>
		</div>
	);
};
