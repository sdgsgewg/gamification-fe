interface FormTitleProps {
  title: string;
  subtitle?: string;
}

const FormTitle = ({ title, subtitle }: FormTitleProps) => {
  return (
    <div className="flex flex-col gap-2 text-dark">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-base font-medium">{subtitle}</p>}
    </div>
  );
};

export default FormTitle;
