import NavigationBarWrapper from "@/app/components/shared/NavigationBarWrapper";

export const AttemptNavigation = ({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) => <NavigationBarWrapper onBack={onBack} onNext={onSubmit} />;
