import { LucideProps } from "lucide-react";

interface IconWrapperProps extends LucideProps {
  icon: React.ReactNode;
}

function IconWrapper({ icon }: IconWrapperProps) {
  return <div className="flex items-center justify-end">{icon}</div>;
}

export default IconWrapper;
