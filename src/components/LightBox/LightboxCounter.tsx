export type LightboxCounterProps = {
  title: string;
  currentIndex: number;
  total: number;
};

const pad = (value: number) => String(value).padStart(2, "0");

function LightboxCounter({ title, currentIndex, total }: LightboxCounterProps) {
  return (
    <div className="text-center">
      <h2 className="font-display text-3xl uppercase text-paper md:text-4xl">{title}</h2>
      <p className="label mt-2 text-gold">
        [ {pad(currentIndex + 1)} / {pad(total)} ]
      </p>
    </div>
  );
}

export default LightboxCounter;