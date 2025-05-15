import { cn } from "@/lib/utils";

type TestProps = {
	className?: string;
};

const Test = ({ className }: TestProps) => {
	return (
		<div className={cn(className)}>
			test
		</div>
	);
};

export default Test;