type SectionLabelProps = {
  index: string;      
  text: string;       
  className?: string;
};

function SectionLabel({ index, text, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="label text-gold">[ {index} ]</span>
      <span className="label text-paper">{text}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default SectionLabel;