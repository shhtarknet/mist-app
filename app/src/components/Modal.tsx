import { X } from "lucide-react";
import { HasChildren } from "../lib/types";

interface ModalProps extends HasChildren {
	children: React.ReactNode;
	header: string | React.ReactNode;
	footer?: string | React.ReactNode;
	onClose: () => void;
}


export const Modal = ({ children, header, footer, onClose }: ModalProps) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center z-10 p-4" style={{ boxShadow: '0 0 9990px 999px rgba(0, 0, 0, 0.4)' }}>
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
				<div className="p-6 border-b border-gray-200 flex justify-between items-center relative">
					{typeof header === 'string' ? (
						<h2 className="text-xl font-bold text-gray-800">{header}</h2>
					) : (
						header
					)}
					<button onClick={() => onClose()} className="text-gray-500 hover:text-gray-800 absolute top-6 right-6">
						<X size={20} />
					</button>
				</div>

				<div className="p-6">
					{children}
				</div>

				{footer && <div className="p-4 border-t border-gray-200 bg-gray-50">
					{footer}
				</div>}
			</div>
		</div>
	);
};

